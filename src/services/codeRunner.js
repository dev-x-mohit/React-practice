// Sandboxed In-Browser Code Execution & Test Runner Service

/**
 * Executes student code in a sandboxed harness against curriculum test cases.
 *
 * @param {string} rawCode Student source code
 * @param {Array<{ name: string, run: Function }>} testCases Test case assertions
 * @param {string} [starterCode] Optional initial starter code to extract expected target function name
 * @returns {Promise<{ allPassed: boolean, passedCount: number, totalCount: number, results: Array, syntaxError?: any, logs: Array }>}
 */
export async function runStudentCode(rawCode, testCases = [], starterCode = '') {
  const logs = [];
  const results = [];

  // Custom log interceptor
  const mockConsole = {
    log: (...args) => logs.push(args.map(formatLogArg).join(' ')),
    warn: (...args) => logs.push('[WARN] ' + args.map(formatLogArg).join(' ')),
    error: (...args) => logs.push('[ERROR] ' + args.map(formatLogArg).join(' ')),
    info: (...args) => logs.push('[INFO] ' + args.map(formatLogArg).join(' '))
  };

  function formatLogArg(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (_e) {
        return String(arg);
      }
    }
    return String(arg);
  }

  if (!rawCode || rawCode.trim().length === 0) {
    return {
      allPassed: false,
      syntaxError: {
        type: 'Empty Code',
        message: 'The editor is empty. Write your solution before running tests.'
      },
      passedCount: 0,
      totalCount: testCases.length,
      results: testCases.map(tc => ({ name: tc.name, passed: false, error: 'No code submitted' })),
      logs: []
    };
  }

  // Preprocess code: strip "export" and "export default" to allow Function evaluation
  const cleanedCode = rawCode
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+(function|const|let|var|class)\s+/g, '$1 ')
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, ''); // strip static imports

  // Detect expected target identifier from starter code or raw code
  const expectedName = extractExpectedIdentifier(starterCode) || extractExpectedIdentifier(rawCode);

  // Detect explicit exports and top-level declared identifiers
  const explicitExports = Array.from(
    rawCode.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:function\*?|const|let|var|class)\s+([a-zA-Z0-9_$]+)/g)
  ).map(m => m[1]);

  const topLevelFns = Array.from(
    rawCode.matchAll(/(?:^|\n)\s*(?:async\s+)?function\*?\s+([a-zA-Z0-9_$]+)/g)
  ).map(m => m[1]);

  const topLevelVars = Array.from(
    rawCode.matchAll(/(?:^|\n)\s*(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/g)
  ).map(m => m[1]);

  // Build ordered candidate list (expected target first, then exports, then top-level items)
  const candidateNames = Array.from(
    new Set([
      ...(expectedName ? [expectedName] : []),
      ...explicitExports,
      ...topLevelFns,
      ...topLevelVars
    ])
  ).filter(name => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name));

  let targetExport = null;

  try {
    // Construct execution harness returning the declared function or object
    const candidateChecks = candidateNames.map(
      name => `typeof ${name} !== 'undefined' ? { name: '${name}', val: ${name} } : null`
    ).join(', ');

    const wrapped = `
      "use strict";
      const console = mockConsole;
      ${cleanedCode}

      // Automatically locate target export among top-level candidates
      const __candidates = [${candidateChecks}].filter(Boolean);

      ${expectedName ? `
      const __matched = __candidates.find(c => c.name === '${expectedName}');
      if (__matched) return __matched.val;
      ` : ''}

      // Look for any function candidate
      const __fn = __candidates.find(c => typeof c.val === 'function');
      if (__fn) return __fn.val;

      // Look for any object candidate
      const __obj = __candidates.find(c => typeof c.val === 'object' && c.val !== null);
      if (__obj) return __obj.val;

      return __candidates.length > 0 ? __candidates[0].val : null;
    `;

    const factory = new Function('mockConsole', wrapped);
    targetExport = factory(mockConsole);
  } catch (compileErr) {
    let errorLine = null;
    const lineMatch = compileErr.stack?.match(/<anonymous>:(\d+):(\d+)/);
    if (lineMatch) {
      errorLine = Math.max(1, parseInt(lineMatch[1], 10) - 2);
    }

    return {
      allPassed: false,
      syntaxError: {
        type: compileErr.name || 'Syntax Error',
        message: compileErr.message,
        line: errorLine
      },
      passedCount: 0,
      totalCount: testCases.length,
      results: testCases.map(tc => ({
        name: tc.name,
        passed: false,
        error: `${compileErr.name || 'Syntax Error'}: ${compileErr.message}`
      })),
      logs
    };
  }

  if (typeof targetExport !== 'function' && typeof targetExport !== 'object') {
    const errorMsg = expectedName
      ? `Could not find function '${expectedName}'. Ensure you defined and exported 'function ${expectedName}(...)' at the top level.`
      : 'No callable function or export object was detected. Ensure your solution defines and exports the required function.';

    return {
      allPassed: false,
      syntaxError: {
        type: 'Missing Function Export',
        message: errorMsg
      },
      passedCount: 0,
      totalCount: testCases.length,
      results: testCases.map(tc => ({
        name: tc.name,
        passed: false,
        error: errorMsg
      })),
      logs
    };
  }

  // Run test cases against the extracted student code
  let passedCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      const outcome = await tc.run(targetExport);
      if (outcome === true) {
        passedCount++;
        results.push({ name: tc.name, passed: true });
      } else {
        const failureReason = typeof outcome === 'string'
          ? outcome
          : 'Assertion failed: The return value did not satisfy the expected conditions for this test case.';
        results.push({
          name: tc.name,
          passed: false,
          error: failureReason
        });
      }
    } catch (testErr) {
      results.push({
        name: tc.name,
        passed: false,
        error: `${testErr.name || 'Runtime Error'}: ${testErr.message || String(testErr)}`
      });
    }
  }

  return {
    allPassed: passedCount === testCases.length && testCases.length > 0,
    passedCount,
    totalCount: testCases.length,
    results,
    logs
  };
}

function extractExpectedIdentifier(code) {
  if (!code) return null;
  const match = code.match(/(?:export\s+(?:default\s+)?)?(?:async\s+)?function\*?\s+([a-zA-Z0-9_$]+)/)
    || code.match(/(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/);
  return match ? match[1] : null;
}
