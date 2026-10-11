// Phase 1: React Foundations
export const phase1 = {
  id: 'phase-1',
  title: 'Phase 1 — React Foundations',
  description: 'Understand declarative UI, JSX expressions, component trees, props flow, useState, event handlers, and list rendering with stable keys.',
  icon: 'Layers',
  badge: 'Core Foundations',
  estimatedHours: 12,
  lessons: [
    {
      id: 'p1-l1',
      slug: 'what-react-solves-declarative-dom',
      title: 'What React Solves & Declarative vs Imperative UI',
      prerequisites: ['p0-l11'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Contrast imperative DOM manipulation with declarative UI modeling.', 'Understand UI as a pure projection of state: UI = f(state).', 'Learn why manual DOM manipulation causes sync bugs and spaghetti code.'],
      explanation: 'In imperative vanilla JS, you write step-by-step instructions: find the element, change text, append child, add class. If state changes in three places, you must update the DOM in three places. React is declarative: you describe what the UI should look like for a given state, and React handles synchronization efficiently.',
      whyItExists: 'Eliminates complex DOM synchronization code and keeps UI predictable.',
      syntaxRules: 'Declare components as functions that return JSX describing UI based on input props and state.',
      codeExample: `// Imperative (Vanilla JS): Step-by-step DOM mutation\n// const btn = document.createElement('button');\n// btn.textContent = 'Count: ' + count;\n\n// Declarative (React): Describe what UI should be\nfunction CounterBadge({ count }) {\n  return <span className="badge">Count: {count}</span>;\n}`,
      lineByLine: [
        'Line 6: CounterBadge is a pure function taking state/props.',
        'Line 7: Returns JSX describing the desired UI for that count value.'
      ],
      expectedBehavior: 'When count changes, React calls CounterBadge again and updates only the necessary DOM text.',
      commonMistakes: ['Trying to manually mutate DOM nodes using document.querySelector inside React.', 'Thinking React redraws the whole web page from scratch.'],
      practiceLevels: {
        levelA: 'Identify imperative DOM lines and convert to declarative JSX.',
        levelB: 'Model a toggle switch purely as a boolean state projection.',
        levelC: 'Explain the reconciliation process when an item is added to an array.'
      },
      debuggingChallenge: {
        brokenCode: `function BadBadge({ count }) {\n  document.getElementById('cnt').innerText = count;\n  return <div id="cnt"></div>;\n}`,
        problem: 'Direct DOM mutation bypasses React reconciliation and causes race conditions.',
        fix: 'return <div id="cnt">{count}</div>;'
      },
      conceptualQuestion: {
        question: 'What does the formula "UI = f(state)" represent in React?',
        options: [
          'UI requires mathematical formulas to calculate CSS animations.',
          'The user interface is a pure visual projection of the application state at any given point in time.',
          'React components can only be defined using mathematical functions.',
          'State must always be calculated using pure functions.'
        ],
        correctIndex: 1,
        explanation: 'In React, given a specific state snapshot, the component function deterministically returns the exact UI for that state.'
      },
      codeReadingQuestion: {
        snippet: `const View = ({ isOpen }) => (\n  <div className={isOpen ? 'visible' : 'hidden'}>\n    {isOpen ? 'Open' : 'Closed'}\n  </div>\n);`,
        question: 'Is this imperative or declarative?',
        answer: 'Declarative, because it describes the UI structure for both states rather than imperatively adding/removing CSS classes.'
      },
      starterCode: `// Assignment: Implement describeUiState\n// Model a declarative status indicator function describeUiState(state)\n// state = { isLoading: boolean, error: string | null, dataCount: number }\n// Return an object: { label: string, statusType: 'loading' | 'error' | 'empty' | 'success', alertColor: string }\n// 1. If isLoading is true -> label: 'Loading...', statusType: 'loading', alertColor: 'blue'\n// 2. If error is present -> label: \`Error: \${error}\`, statusType: 'error', alertColor: 'red'\n// 3. If dataCount === 0 -> label: 'No records found', statusType: 'empty', alertColor: 'yellow'\n// 4. Otherwise -> label: \`\${dataCount} records active\`, statusType: 'success', alertColor: 'green'\n\nexport function describeUiState(state) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Handles loading state with highest priority',
          run: (fn) => {
            const res = fn({ isLoading: true, error: null, dataCount: 5 });
            return res.statusType === 'loading' && res.label === 'Loading...' && res.alertColor === 'blue';
          }
        },
        {
          name: 'Handles error state properly',
          run: (fn) => {
            const res = fn({ isLoading: false, error: 'Database offline', dataCount: 0 });
            return res.statusType === 'error' && res.label === 'Error: Database offline' && res.alertColor === 'red';
          }
        },
        {
          name: 'Handles empty and success states',
          run: (fn) => {
            const empty = fn({ isLoading: false, error: null, dataCount: 0 });
            const success = fn({ isLoading: false, error: null, dataCount: 12 });
            return empty.statusType === 'empty' && success.statusType === 'success' && success.label === '12 records active';
          }
        }
      ],
      hints: [
        'Use conditional if/else checks in order: loading, error, empty count, success.'
      ],
      checklist: [
        'Checked isLoading first',
        'Handled error message formatting',
        'Differentiated 0 records (empty) from > 0 records (success)'
      ],
      revisionSummary: 'React replaces imperative DOM manipulation with declarative UI: describe the output for each state and let React update the DOM.'
    },
    {
      id: 'p1-l2',
      slug: 'creating-react-app-vite',
      title: 'Creating a React Application with Vite',
      prerequisites: ['p0-l13'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Understand why Vite is the modern standard over Create React App (CRA).', 'Learn how Vite utilizes native ES modules and esbuild for instant HMR.', 'Explore vite.config.js and development vs production modes.'],
      explanation: 'Create React App (CRA) is deprecated because it uses Webpack to bundle the entire project before starting the dev server. Vite uses native ES Modules in the browser during development, loading files on demand with pre-bundled dependencies via esbuild. This gives sub-second startup times and instant Hot Module Replacement (HMR).',
      whyItExists: 'Provides a fast, zero-configuration development server and production build pipeline.',
      syntaxRules: 'Run `npm create vite@latest my-app -- --template react` or `npm run dev` to start the local Vite server.',
      codeExample: `// vite.config.js\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 3000 }\n});`,
      lineByLine: [
        'Line 2: Imports Vite React plugin which compiles JSX using Babel or SWC.',
        'Line 5: react() plugin enables Fast Refresh (retains component state on code edit).'
      ],
      expectedBehavior: 'Dev server spins up in milliseconds and reflects code changes instantaneously.',
      commonMistakes: ['Using process.env in Vite instead of import.meta.env.', 'Creating files with JSX syntax using .js extension without configuring loader (prefer .jsx).'],
      practiceLevels: {
        levelA: 'Inspect package.json scripts and run npm run dev.',
        levelB: 'Add an environment variable VITE_API_URL and read it via import.meta.env.',
        levelC: 'Configure a path alias @ -> src in vite.config.js.'
      },
      debuggingChallenge: {
        brokenCode: `// In Vite component:\nconst apiKey = process.env.API_KEY;`,
        problem: 'process is not defined in browser ESM environments; Vite exposes environment variables on import.meta.env.',
        fix: 'const apiKey = import.meta.env.VITE_API_KEY;'
      },
      conceptualQuestion: {
        question: 'Why does Vite start development servers so much faster than Webpack-based tools?',
        options: [
          'Vite skips compiling JavaScript entirely.',
          'Vite serves source code over native ES Modules (ESM) without bundling everything up-front, and pre-bundles node_modules with esbuild.',
          'Vite only works with static HTML files.',
          'Vite stores source files in RAM memory.'
        ],
        correctIndex: 1,
        explanation: 'Vite leaves source code as native ESM modules that the browser requests on demand, avoiding slow upfront bundling.'
      },
      codeReadingQuestion: {
        snippet: `// Vite env variable convention\n// .env file:\nVITE_APP_TITLE=React Academy\nSECRET_KEY=12345`,
        question: 'Which of these is exposed to the client-side bundle in Vite by default?',
        answer: 'Only VITE_APP_TITLE. Vite prevents accidental secret leaks by requiring the VITE_ prefix.'
      },
      starterCode: `// Assignment: Implement parseViteConfig\n// Build a configuration validator function parseViteConfig(config)\n// Requirements:\n// 1. Ensure config.plugins contains 'react'\n// 2. Default config.server.port to 5173 if not provided.\n// 3. Return sanitized config object: { hasReactPlugin: boolean, port: number, isProduction: boolean }\n\nexport function parseViteConfig(config) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Validates plugins and sets default port 5173',
          run: (fn) => {
            const res = fn({ plugins: ['react'], mode: 'development' });
            return res.hasReactPlugin === true && res.port === 5173 && res.isProduction === false;
          }
        },
        {
          name: 'Preserves custom port and detects production mode',
          run: (fn) => {
            const res = fn({ plugins: ['react', 'visualizer'], server: { port: 8080 }, mode: 'production' });
            return res.hasReactPlugin === true && res.port === 8080 && res.isProduction === true;
          }
        }
      ],
      hints: [
        'Check config?.plugins?.includes("react")',
        'Use config?.server?.port ?? 5173'
      ],
      checklist: [
        'Verified react plugin presence',
        'Defaulted port to 5173',
        'Checked if mode === "production"'
      ],
      revisionSummary: 'Vite leverages native browser ESM and esbuild for rapid development and Fast Refresh.'
    },
    {
      id: 'p1-l3',
      slug: 'project-structure-entry-point',
      title: 'Project Structure and the React Entry Point',
      prerequisites: ['p1-l2'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Navigate index.html, main.jsx, and App.jsx.', 'Understand how the root DOM element mounts the React component tree.', 'Organize assets, components, hooks, and styles cleanly.'],
      explanation: 'Every React application starts from index.html containing a container like <div id="root"></div>. In Vite, a script tag loads /src/main.jsx. This entry point imports React, ReactDOM, and App, mounting the component hierarchy into that root DOM container.',
      whyItExists: 'Establishes the bridge between the browser DOM document and the React component virtual tree.',
      syntaxRules: 'Keep main.jsx minimal: global styles, providers, and root mounting. Business components belong in src/components.',
      codeExample: `// src/main.jsx\nimport React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`,
      lineByLine: [
        'Line 2: Imports the client-side DOM rendering engine.',
        'Line 6: Finds the root element in index.html and initializes React root container.',
        'Line 7: StrictMode enables runtime checks and detects legacy methods.'
      ],
      expectedBehavior: 'The React virtual component tree renders into the single div#root element.',
      commonMistakes: ['Calling createRoot multiple times on the same page.', 'Placing heavy business logic inside main.jsx instead of App or page components.'],
      practiceLevels: {
        levelA: 'Identify the entry point and the root HTML container in a project.',
        levelB: 'Add a global theme provider or CSS reset at the entry point.',
        levelC: 'Structure an enterprise feature folder: /features/auth/{components, hooks, api, types}.'
      },
      debuggingChallenge: {
        brokenCode: `// main.jsx\nconst root = document.getElementById('app');\nReactDOM.createRoot(root).render(<App />); // HTML has <div id="root"></div>`,
        problem: 'root element is null because HTML ID is "root", throwing "Target container is not a DOM element".',
        fix: 'document.getElementById("root")'
      },
      conceptualQuestion: {
        question: 'What is the role of index.html in a Vite + React application?',
        options: [
          'It is compiled away and not sent to the browser.',
          'It is the actual entry HTML page that contains the root mount div and the script tag loading main.jsx.',
          'It only contains CSS stylesheets.',
          'It is a fallback page only used when JavaScript is disabled.'
        ],
        correctIndex: 1,
        explanation: 'In Vite, index.html is the central entry point where the browser begins parsing and executes the module script.'
      },
      codeReadingQuestion: {
        snippet: `const el = document.getElementById('root');\nif (!el) throw new Error('Missing root container');`,
        question: 'Why do production templates include this guard check?',
        answer: 'To fail fast with a descriptive error if the HTML root div is missing or misspelled before React attempts to mount.'
      },
      starterCode: `// Assignment: Implement validateProjectStructure\n// Given a project file list: string[] (e.g. ['index.html', 'src/main.jsx', 'src/App.jsx'])\n// Check for essential files:\n// 1. 'index.html'\n// 2. 'src/main.jsx' or 'src/main.tsx'\n// 3. 'src/App.jsx' or 'src/App.tsx'\n// 4. 'package.json'\n// Return: { isValid: boolean, missingFiles: string[] }\n\nexport function validateProjectStructure(files) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Confirms valid project structure',
          run: (fn) => {
            const files = ['package.json', 'index.html', 'src/main.jsx', 'src/App.jsx', 'src/index.css'];
            const res = fn(files);
            return res.isValid === true && res.missingFiles.length === 0;
          }
        },
        {
          name: 'Identifies missing required files',
          run: (fn) => {
            const files = ['package.json', 'src/App.jsx'];
            const res = fn(files);
            return res.isValid === false && res.missingFiles.includes('index.html');
          }
        }
      ],
      hints: [
        'Check for index.html, package.json, and main (jsx or tsx), and App (jsx or tsx).'
      ],
      checklist: [
        'Checked index.html and package.json',
        'Handled both .jsx and .tsx extension variants',
        'Returned structured missingFiles array'
      ],
      revisionSummary: 'The entry point connects index.html to main.jsx, mounting the React virtual tree into the browser DOM container.'
    },
    {
      id: 'p1-l4',
      slug: 'createroot-and-strictmode',
      title: 'createRoot and StrictMode',
      prerequisites: ['p1-l3'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Learn why React 18 introduced createRoot over legacy ReactDOM.render.', 'Understand why StrictMode executes component functions and effects twice in development.', 'Recognize side effects that violate React purity.'],
      explanation: 'createRoot enables the concurrent React 18+ architecture (transitions, Suspense, automatic batching). <React.StrictMode> is a development-only tool that renders components twice, re-runs effects with an immediate cleanup, and checks for deprecated APIs to help you find impure calculations and missing effect cleanups.',
      whyItExists: 'Catches subtle bugs before they reach production: memory leaks, stale subscriptions, and side-effects during render.',
      syntaxRules: 'StrictMode has ZERO impact on production builds. Never write code that breaks just because a component renders twice!',
      codeExample: `// Development double-invocation\n// 1. Component renders (count = 0)\n// 2. Component renders again immediately (StrictMode)\n// If you mutated an external variable during render, count would now be 2!\n\nlet impureCount = 0; // BAD: external mutation\nfunction BadComponent() {\n  impureCount++; // StrictMode exposes this bug!\n  return <div>{impureCount}</div>;\n}`,
      lineByLine: [
        'Line 6: BadComponent mutates an external variable during the render phase.',
        'Line 7: In StrictMode, this renders as 2 instead of 1, alerting you to the impure render.'
      ],
      expectedBehavior: 'Pure components produce identical JSX output regardless of how many times they are invoked.',
      commonMistakes: ['Removing StrictMode just to make console.log fire once instead of fixing the root bug.', 'Performing side-effects (like modifying DOM or setting timers) directly in component function body.'],
      practiceLevels: {
        levelA: 'Wrap an application in React.StrictMode.',
        levelB: 'Identify and fix an impure component flagged by double-rendering.',
        levelC: 'Test an effect cleanup function to ensure it properly cancels subscriptions on unmount.'
      },
      debuggingChallenge: {
        brokenCode: `// User complains: "My useEffect is firing twice and creating two items!"\nuseEffect(() => {\n  createDatabaseRecord();\n}, []);`,
        problem: 'Direct write in useEffect without cleanup or idempotent guard fires twice in dev under StrictMode.',
        fix: 'Use an AbortController or check whether record exists, or make write operation idempotent.'
      },
      conceptualQuestion: {
        question: 'Why does React.StrictMode intentionally invoke components and effects twice in development?',
        options: [
          'To test network connection speed.',
          'To help developers catch accidental side-effects during render and verify that cleanup functions work correctly.',
          'To double the frame rate of animations.',
          'Because React runs on two CPU threads simultaneously.'
        ],
        correctIndex: 1,
        explanation: 'StrictMode tests resilience by running render and effect lifecycles twice, surfacing uncleaned subscriptions and impure mutations.'
      },
      codeReadingQuestion: {
        snippet: `let renders = 0;\nfunction Test() {\n  renders++;\n  return <span>{renders}</span>;\n}`,
        question: 'In StrictMode in dev mode, what number will appear on initial render?',
        answer: '2, because StrictMode executes the function body twice to detect impure state mutations.'
      },
      starterCode: `// Assignment: Implement testPurity\n// Write a validator that verifies if a component function is pure.\n// Takes componentFn and testProps.\n// Call componentFn(testProps) twice.\n// Returns { isPure: boolean, firstResult: any, secondResult: any }\n// isPure is true IF AND ONLY IF JSON.stringify(firstResult) === JSON.stringify(secondResult).\n\nexport function testPurity(componentFn, testProps) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Detects pure function returning identical output',
          run: (fn) => {
            const pureComp = (props) => ({ text: `Hello ${props.name}` });
            const res = fn(pureComp, { name: 'Ada' });
            return res.isPure === true && res.firstResult.text === 'Hello Ada';
          }
        },
        {
          name: 'Detects impure function with mutating internal state',
          run: (fn) => {
            let seq = 0;
            const impureComp = () => ({ id: ++seq });
            const res = fn(impureComp, {});
            return res.isPure === false && res.firstResult.id === 1 && res.secondResult.id === 2;
          }
        }
      ],
      hints: [
        'Call componentFn(testProps) to get firstResult, then call it again for secondResult.'
      ],
      checklist: [
        'Executed component function twice',
        'Compared stringified outputs',
        'Returned structured diagnostic report'
      ],
      revisionSummary: 'StrictMode enforces React rendering purity and validates that effect cleanups undo their setups.'
    },
    {
      id: 'p1-l5',
      slug: 'jsx-syntax-expressions',
      title: 'JSX Syntax and JavaScript Expressions',
      prerequisites: ['p1-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Understand what JSX compiles to under the hood (React.createElement or jsx-runtime).', 'Embed dynamic JavaScript expressions using curly braces {}.', 'Differentiate statements from expressions in JSX.'],
      explanation: 'JSX is a syntax extension for JavaScript that looks like HTML. Browsers cannot execute JSX directly; Vite compiles JSX tags into regular JavaScript function calls (React.createElement or jsxDEV). Inside JSX, curly braces {} create an escape hatch where any valid JavaScript expression can be evaluated.',
      whyItExists: 'Combines markup structure with programming logic in a cohesive component file.',
      syntaxRules: 'Only expressions (values that produce a result) are allowed inside {}. Statements (if, for, while, let) are syntax errors inside JSX curly braces.',
      codeExample: `// Compiles to: jsx('h1', { children: ['Hello, ', userName.toUpperCase()] })\nfunction Greeting({ userName }) {\n  return (\n    <h1 className="title">\n      Hello, {userName.toUpperCase()}!\n    </h1>\n  );\n}`,
      lineByLine: [
        'Line 2: JSX tags represent React element nodes.',
        'Line 4: {userName.toUpperCase()} evaluates the JS expression and injects the string.'
      ],
      expectedBehavior: 'Dynamic values are escaped and rendered safely into the DOM without HTML injection.',
      commonMistakes: ['Trying to put an if-statement directly inside JSX curly braces: {if (x) { ... }} (use ternary ? : instead).', 'Forgetting to close empty tags: <img ... /> or <input ... />.'],
      practiceLevels: {
        levelA: 'Embed arithmetic calculation and string interpolation inside JSX.',
        levelB: 'Use ternary expression to toggle button text based on isPending prop.',
        levelC: 'Map over an object keys array inside JSX expressions.'
      },
      debuggingChallenge: {
        brokenCode: `return <div>{ if (isOnline) { 'Online' } else { 'Offline' } }</div>;`,
        problem: 'if statements do not evaluate to a value and cannot be placed inside JSX expressions.',
        fix: 'return <div>{isOnline ? "Online" : "Offline"}</div>;'
      },
      conceptualQuestion: {
        question: 'Which of the following CANNOT be placed directly inside JSX curly braces {}?',
        options: [
          'A ternary operator (condition ? "Yes" : "No")',
          'An array.map() call',
          'A for...of loop statement',
          'A function call returning a string'
        ],
        correctIndex: 2,
        explanation: 'Curly braces {} in JSX accept only expressions (values), not imperative statements like for-loops or if-statements.'
      },
      codeReadingQuestion: {
        snippet: `const x = 5;\nconst el = <span>{x > 10 ? 'Big' : x < 3 ? 'Small' : 'Medium'}</span>;`,
        question: 'What text does el display?',
        answer: '"Medium", because 5 is neither > 10 nor < 3.'
      },
      starterCode: `// Assignment: Implement evaluateJsxExpression\n// Build an expression evaluator simulating JSX interpolation rules:\n// evaluateJsxExpression(val)\n// Rules:\n// 1. null, undefined, and booleans (true/false) render as empty string ''\n// 2. numbers and strings render as their string representation\n// 3. arrays render as concatenated string of their valid items\n// 4. plain objects throw an error: 'Objects are not valid as a React child'\n\nexport function evaluateJsxExpression(val) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Converts null, undefined, and booleans to empty string',
          run: (fn) => {
            return fn(null) === '' && fn(undefined) === '' && fn(true) === '' && fn(false) === '';
          }
        },
        {
          name: 'Renders numbers and strings',
          run: (fn) => {
            return fn(42) === '42' && fn('React') === 'React';
          }
        },
        {
          name: 'Throws descriptive error for plain objects',
          run: (fn) => {
            try {
              fn({ user: 'Ada' });
              return false;
            } catch (err) {
              return err.message === 'Objects are not valid as a React child';
            }
          }
        }
      ],
      hints: [
        'Check typeof val === "object" && val !== null && !Array.isArray(val) to throw the React child error.'
      ],
      checklist: [
        'Handled null, undefined, booleans',
        'Handled numbers, strings, arrays',
        'Threw specific React error for objects'
      ],
      revisionSummary: 'JSX curly braces {} evaluate JavaScript expressions; booleans/null/undefined render nothing, while plain objects cannot be children.'
    },
    {
      id: 'p1-l6',
      slug: 'jsx-attributes-and-classname',
      title: 'JSX Attributes and className',
      prerequisites: ['p1-l5'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Learn camelCase attribute naming in JSX (className, htmlFor, tabIndex).', 'Pass boolean attributes and object props cleanly.', 'Safely pass inline styles using double curly braces style={{ color: "red" }}.'],
      explanation: 'Because JSX is closer to JavaScript than HTML, React uses camelCase property conventions matching DOM property APIs. class becomes className (because class is a reserved JS keyword), for becomes htmlFor, and inline styles are written as JavaScript objects with camelCase CSS properties (backgroundColor).',
      whyItExists: 'Prevents keyword clashes with JavaScript syntax and maps directly to DOM properties.',
      syntaxRules: 'Use className instead of class. Use htmlFor instead of for on labels. Style attributes take an object: style={{ marginTop: "1rem" }}.',
      codeExample: `function Card({ isActive, title }) {\n  return (\n    <div\n      className={\`card \${isActive ? 'card--active' : ''}\`}\n      style={{ padding: '16px', borderRadius: '8px' }}\n      tabIndex={0}\n    >\n      <h3>{title}</h3>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: className with template literal dynamically appends CSS classes.',
        'Line 5: style takes a JavaScript object literal with camelCase CSS properties.',
        'Line 6: tabIndex is camelCased.'
      ],
      expectedBehavior: 'Element is rendered into the DOM with the correct HTML class attribute and inline CSS styling.',
      commonMistakes: ['Writing style="padding: 16px" as a string (throws compiler error in JSX).', 'Using class="btn" instead of className="btn".'],
      practiceLevels: {
        levelA: 'Convert standard HTML markup with class and for attributes to valid JSX.',
        levelB: 'Construct a dynamic className helper combining base, variant, and disabled classes.',
        levelC: 'Build an inline style calculator that converts rem values to pixel objects.'
      },
      debuggingChallenge: {
        brokenCode: `<label for="email">Email</label>\n<input class="input" style="font-size: 14px;" />`,
        problem: 'for -> htmlFor, class -> className, style must be an object style={{ fontSize: "14px" }}.',
        fix: '<label htmlFor="email">Email</label>\n<input className="input" style={{ fontSize: "14px" }} />'
      },
      conceptualQuestion: {
        question: 'Why do inline styles in JSX use double curly braces like style={{ color: "red" }}?',
        options: [
          'Double curly braces are a special React encryption syntax.',
          'The outer braces represent the JSX expression escape hatch, and the inner braces define a JavaScript object literal.',
          'To indicate that the styles should be applied with !important.',
          'Because CSS requires two sets of brackets.'
        ],
        correctIndex: 1,
        explanation: 'The outer {} tells JSX to evaluate JavaScript; the inner {} is the JavaScript object literal passed to the style prop.'
      },
      codeReadingQuestion: {
        snippet: `<button disabled={false} className={undefined}>Click</button>`,
        question: 'Will the button be disabled in the DOM, and what will the class attribute look like?',
        answer: 'Button is NOT disabled (false removes the disabled attribute), and className is omitted entirely.'
      },
      starterCode: `// Assignment: Implement clsxLite\n// Build a utility function clsxLite(...inputs)\n// It accepts strings, booleans, undefined, null, or objects { [className]: boolean }.\n// Returns a single space-separated string of active class names.\n// Example: clsxLite('btn', false && 'hidden', { 'btn-primary': true, 'btn-lg': false }) -> 'btn btn-primary'\n\nexport function clsxLite(...inputs) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Combines strings and ignores falsy values',
          run: (fn) => {
            return fn('btn', null, undefined, false, 'btn-large') === 'btn btn-large';
          }
        },
        {
          name: 'Evaluates object flags correctly',
          run: (fn) => {
            const res = fn('base', { active: true, disabled: false, highlighted: true });
            return res === 'base active highlighted';
          }
        }
      ],
      hints: [
        'Iterate through inputs; if string, keep it; if object, add keys whose values are truthy.'
      ],
      checklist: [
        'Filtered out null, undefined, false',
        'Extracted truthy object keys',
        'Joined with single whitespace without leading/trailing spaces'
      ],
      revisionSummary: 'JSX attributes use camelCase (className, htmlFor); style attributes accept JavaScript object literals.'
    },
    {
      id: 'p1-l7',
      slug: 'functional-components',
      title: 'Functional Components',
      prerequisites: ['p1-l5'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Define functional components and understand component capitalization rules.', 'Explain the component lifecycle conceptually in modern function components.', 'Recognize why React components must be pure functions of props and state.'],
      explanation: 'A React component is a JavaScript function that accepts props (input data) and returns JSX (the UI description). Component names MUST start with an uppercase letter (e.g., UserBadge, not userBadge). React treats lowercase tags as built-in HTML elements (<div>, <button>).',
      whyItExists: 'Functional components provide modular, testable, and reusable building blocks for user interfaces.',
      syntaxRules: 'Always capitalize component names. A component must return valid JSX, null, or a fragment; it cannot return undefined.',
      codeExample: `// Functional Component\nfunction UserAvatar({ src, alt = 'User avatar' }) {\n  if (!src) return <div className="avatar-placeholder">?</div>;\n  return <img className="avatar" src={src} alt={alt} />;\n}`,
      lineByLine: [
        'Line 2: UserAvatar starts with uppercase letter, accepting props.',
        'Line 3: Returns fallback JSX if avatar src is absent.',
        'Line 4: Returns the image element.'
      ],
      expectedBehavior: 'Component encapsulates markup and presentation rules in a self-contained unit.',
      commonMistakes: ['Naming component with lowercase letter (e.g. function button()). React will compile it to <button> HTML tag.', 'Returning undefined when props condition fails (React throws error).'],
      practiceLevels: {
        levelA: 'Create a StatCard component displaying title, value, and trend icon.',
        levelB: 'Implement an AlertBanner with dismiss action and variant styling.',
        levelC: 'Build a polymorphic component that renders either an <a> or <button> depending on href prop.'
      },
      debuggingChallenge: {
        brokenCode: `function navLink({ label, href }) {\n  return <a href={href}>{label}</a>;\n}\n// In JSX: <navLink label="Home" href="/" />`,
        problem: 'Lowercase navLink is treated by React as an unknown HTML tag <navlink>, not a component function.',
        fix: 'Rename function to NavLink with a capital "N".'
      },
      conceptualQuestion: {
        question: 'Why MUST React component names start with an uppercase letter?',
        options: [
          'Because JavaScript classes require uppercase names.',
          'JSX differentiates custom React components (<MyComponent />) from built-in HTML DOM elements (<div />, <p />) by the capitalization of the first letter.',
          'Uppercase names load faster in V8.',
          'Because lowercase functions cannot use hooks.'
        ],
        correctIndex: 1,
        explanation: 'In JSX, lowercase tags are treated as HTML strings by the compiler, while capitalized tags are resolved as JavaScript identifiers.'
      },
      codeReadingQuestion: {
        snippet: `function Header() {\n  return;\n}\n// What happens when <Header /> renders?`,
        question: 'What error does React produce when this renders?',
        answer: 'React throws an error because Header returned undefined instead of JSX, null, or a valid element.'
      },
      starterCode: `// Assignment: Implement createComponentDescriptor\n// Create a helper that inspects a component definition:\n// createComponentDescriptor(name, renderFn)\n// Rules:\n// 1. If name does not start with an uppercase letter (A-Z), throw Error('Component name must start with uppercase letter')\n// 2. Call renderFn({})\n// 3. If renderFn returns undefined, throw Error('Component returned undefined. Return JSX or null.')\n// 4. Return { valid: true, componentName: name, defaultOutput: result }\n\nexport function createComponentDescriptor(name, renderFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Validates correctly capitalized component returning valid node',
          run: (fn) => {
            const desc = fn('UserProfile', () => ({ type: 'div' }));
            return desc.valid === true && desc.componentName === 'UserProfile' && desc.defaultOutput.type === 'div';
          }
        },
        {
          name: 'Throws error for lowercase component name',
          run: (fn) => {
            try {
              fn('userProfile', () => ({ type: 'div' }));
              return false;
            } catch (err) {
              return err.message === 'Component name must start with uppercase letter';
            }
          }
        },
        {
          name: 'Throws error when component returns undefined',
          run: (fn) => {
            try {
              fn('Badge', () => undefined);
              return false;
            } catch (err) {
              return err.message === 'Component returned undefined. Return JSX or null.';
            }
          }
        }
      ],
      hints: [
        'Check /^[A-Z]/.test(name) to validate capitalization.'
      ],
      checklist: [
        'Enforced capital first letter convention',
        'Tested for undefined return value',
        'Returned valid component descriptor'
      ],
      revisionSummary: 'Components are pure functions that must be capitalized and return valid JSX or null.'
    },
    {
      id: 'p1-l8',
      slug: 'component-composition-and-reuse',
      title: 'Component Composition and Reuse',
      prerequisites: ['p1-l7'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master composition over inheritance in React.', 'Decompose monolithic UI into cohesive sub-components.', 'Use slots and child pass-through patterns.'],
      explanation: 'In React, we build complex UIs by combining smaller, focused components together. Instead of creating giant "God Components" with hundreds of props, we use composition: assembling specialized components (like DialogHeader, DialogBody, DialogFooter) inside a parent container.',
      whyItExists: 'Composition prevents prop-drilling, keeps components focused on a single responsibility, and maximizes reuse.',
      syntaxRules: 'Favor composing components hierarchically rather than creating inheritance hierarchies or monster props.',
      codeExample: `// Composition Pattern\nfunction Dialog({ children, title }) {\n  return (\n    <div className="modal-backdrop">\n      <div className="modal-content">\n        <h2>{title}</h2>\n        <div className="modal-body">{children}</div>\n      </div>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 2: Dialog accepts children, allowing any arbitrary UI to be rendered inside.',
        'Line 6: Injects caller-defined children into the modal body slot.'
      ],
      expectedBehavior: 'Dialog handles modal framing while caller supplies the inner content.',
      commonMistakes: ['Passing 30 configuration flags to one component instead of composing sub-components.', 'Hardcoding specific markup inside generic container components.'],
      practiceLevels: {
        levelA: 'Refactor a hardcoded card into a generic Card container with Card.Header and Card.Body.',
        levelB: 'Create an Accordion component using composition.',
        levelC: 'Build an ApplicationShell with Sidebar, TopNav, and MainContent slots.'
      },
      debuggingChallenge: {
        brokenCode: `function MediaCard({ type, data }) {\n  // 200 lines of if (type === 'video') return ... else if (type === 'image') return ...\n}`,
        problem: 'Violates Open/Closed Principle; every new card type requires editing this monolithic function.',
        fix: 'Extract VideoCard and ImageCard and compose them through a shared BaseCard.'
      },
      conceptualQuestion: {
        question: 'Why does React officially favor "Composition over Inheritance"?',
        options: [
          'Inheritance is not supported by JavaScript classes.',
          'Composition provides greater flexibility by assembling small, independent pieces without tightly coupling component hierarchies.',
          'Composition consumes less memory in the browser.',
          'Inheritance cannot pass props.'
        ],
        correctIndex: 1,
        explanation: 'Composition allows flexible reuse of behavior and styling by nesting elements via props/children without rigid class inheritance.'
      },
      codeReadingQuestion: {
        snippet: `<SplitPane left={<Navigation />} right={<Dashboard />} />`,
        question: 'What pattern is being used here?',
        answer: 'Slot composition (passing rendered JSX elements as props).'
      },
      starterCode: `// Assignment: Implement composeTree\n// Build a composition helper composeTree(ParentComp, childrenArray)\n// Takes ParentComp function and an array of child component functions [Child1, Child2].\n// Call each child with empty props to get rendered outputs, then call ParentComp with { children: renderedChildren }.\n// Return the final result.\n\nexport function composeTree(ParentComp, childrenArray) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Composes children into parent wrapper',
          run: (fn) => {
            const Parent = ({ children }) => ({ type: 'CONTAINER', items: children });
            const Child1 = () => ({ type: 'ITEM', id: 1 });
            const Child2 = () => ({ type: 'ITEM', id: 2 });
            const tree = fn(Parent, [Child1, Child2]);
            return tree.type === 'CONTAINER' && tree.items.length === 2 && tree.items[0].id === 1;
          }
        }
      ],
      hints: [
        'Map childrenArray using child => child({}) and pass as { children: ... } to ParentComp.'
      ],
      checklist: [
        'Executed each child component function',
        'Passed assembled children to parent component',
        'Returned top-level composed tree'
      ],
      revisionSummary: 'Composition allows flexible UI assembly without rigid inheritance or bloated prop lists.'
    },
    {
      id: 'p1-l9',
      slug: 'props-and-one-way-data-flow',
      title: 'Props and One-Way Data Flow',
      prerequisites: ['p1-l7'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Understand unidirectional data flow (parent -> child).', 'Treat props as strictly read-only and immutable.', 'Provide default props and pass functions for child-to-parent communication.'],
      explanation: 'Props (short for properties) are the arguments passed into React components. Data flows strictly in one direction: from parent components down to child components. Props are immutable: a child component MUST NEVER attempt to mutate props.props.value = 123. To communicate back up, the parent passes down a callback function.',
      whyItExists: 'Unidirectional data flow ensures that state mutations have a single source of truth and are easy to trace.',
      syntaxRules: 'Props are read-only. Never modify props directly inside a component.',
      codeExample: `// Parent\nfunction Parent() {\n  const [user, setUser] = useState('Ada');\n  return <Child name={user} onNameChange={setUser} />;\n}\n\n// Child: Read-only props\nfunction Child({ name, onNameChange }) {\n  return (\n    <div>\n      <p>Hello {name}</p>\n      <button onClick={() => onNameChange('Grace')}>Change</button>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: Parent passes data down (name) and an action callback (onNameChange).',
        'Line 9: Child reads name; child cannot mutate name directly, so it invokes the callback.'
      ],
      expectedBehavior: 'State changes occur only in the parent owning the state, then flow down to children.',
      commonMistakes: ['Directly mutating props: props.user.name = "New".', 'Copying props into state unnecessarily without synchronization.'],
      practiceLevels: {
        levelA: 'Pass text and theme props to a Button component.',
        levelB: 'Pass an onSelect callback to child items and highlight the selected one.',
        levelC: 'Implement a reusable Table component driven purely by columns and data props.'
      },
      debuggingChallenge: {
        brokenCode: `function Profile(props) {\n  props.title = props.title.toUpperCase(); // Mutation!\n  return <h1>{props.title}</h1>;\n}`,
        problem: 'Directly mutating the props object violates React purity and mutates parent references.',
        fix: 'const formattedTitle = props.title.toUpperCase();'
      },
      conceptualQuestion: {
        question: 'Why are props in React considered read-only / immutable?',
        options: [
          'Because JavaScript objects cannot be modified in modern browsers.',
          'To ensure unidirectional data flow, where the parent remains the single source of truth and changes are predictable.',
          'Because props are stored on a read-only SSD.',
          'To prevent memory leaks.'
        ],
        correctIndex: 1,
        explanation: 'Immutable props guarantee that child components cannot unexpectedly mutate parent state without the parent knowing.'
      },
      codeReadingQuestion: {
        snippet: `function Item({ count }) {\n  count = count * 2;\n  return <span>{count}</span>;\n}`,
        question: 'Does this mutate the parent state? Why is it still bad practice?',
        answer: 'It does not mutate the parent primitive, but reassigning parameter variables is misleading and violates functional clarity.'
      },
      starterCode: `// Assignment: Implement validatePropsContract\n// Write a prop validator function validatePropsContract(props, schema)\n// schema: { [key]: { type: 'string' | 'number' | 'boolean', required?: boolean, default?: any } }\n// Returns { valid: boolean, sanitizedProps: object, errors: string[] }\n\nexport function validatePropsContract(props, schema) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Applies default props and validates correct types',
          run: (fn) => {
            const schema = {
              title: { type: 'string', required: true },
              count: { type: 'number', default: 0 }
            };
            const res = fn({ title: 'Tasks' }, schema);
            return res.valid === true && res.sanitizedProps.count === 0 && res.sanitizedProps.title === 'Tasks';
          }
        },
        {
          name: 'Flags missing required prop and type mismatches',
          run: (fn) => {
            const schema = { title: { type: 'string', required: true } };
            const res = fn({}, schema);
            return res.valid === false && res.errors.length > 0;
          }
        }
      ],
      hints: [
        'Iterate through schema keys, check if required prop is missing, assign default if undefined.'
      ],
      checklist: [
        'Checked for missing required props',
        'Verified types against schema',
        'Injected default values when props were undefined'
      ],
      revisionSummary: 'Data flows down via props; changes flow up via callbacks. Props are strictly read-only.'
    },
    {
      id: 'p1-l10',
      slug: 'children-and-children-prop',
      title: 'Children and the children Prop',
      prerequisites: ['p1-l9'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Use props.children to create layout and container wrappers.', 'Understand that children can be text, elements, or render functions.', 'Inspect and manipulate children safely using React.Children.'],
      explanation: 'Any content placed between opening and closing JSX tags (<Card><p>Hello</p></Card>) is automatically passed to the component as the special children prop. This enables generic wrapper components (cards, dialogs, drawers, layout containers).',
      whyItExists: 'Enables components to serve as open containers without knowing their contents in advance.',
      syntaxRules: 'Destructure children like any other prop: function Box({ children }) { return <div>{children}</div>; }',
      codeExample: `function CardContainer({ children, variant = 'elevated' }) {\n  return (\n    <div className={\`card card--\${variant}\`}>\n      {children}\n    </div>\n  );\n}\n\n// Usage:\n<CardContainer>\n  <h2>Welcome</h2>\n  <p>Practice React fundamentals!</p>\n</CardContainer>`,
      lineByLine: [
        'Line 1: children prop receives the nested JSX nodes.',
        'Line 4: {children} renders whatever elements the caller placed inside.'
      ],
      expectedBehavior: 'CardContainer wraps whatever inner content is supplied without coupling.',
      commonMistakes: ['Trying to access children[0] directly as an array (children can be a single object, array, or undefined; use React.Children.toArray instead).', 'Forgetting to render {children} inside the wrapper JSX.'],
      practiceLevels: {
        levelA: 'Build an AlertBox container rendering props.children with an icon.',
        levelB: 'Implement a CollapsibleSection that hides/shows its children based on toggle.',
        levelC: 'Use render props pattern: children as a function ({ isHovered }) => <Tooltip />.'
      },
      debuggingChallenge: {
        brokenCode: `function ListWrapper({ children }) {\n  return <div>Total items: {children.length}</div>; // Crashes if single child!\n}`,
        problem: 'If only one child is passed, children is a single object, not an array, so .length is undefined.',
        fix: 'Use React.Children.count(children) or React.Children.toArray(children).length'
      },
      conceptualQuestion: {
        question: 'What is the data type of props.children when exactly ONE child element is passed to a component?',
        options: [
          'Always an Array of elements',
          'A single React element object',
          'A DOM Node',
          'A Promise'
        ],
        correctIndex: 1,
        explanation: 'When one child is passed, props.children is a single object. When multiple children are passed, it is an array. When empty, it is undefined.'
      },
      codeReadingQuestion: {
        snippet: `function Wrapper({ children }) { return <div className="wrap">{children}</div>; }\n<Wrapper />`,
        question: 'What is props.children inside Wrapper here?',
        answer: 'undefined (because no nested children were passed).'
      },
      starterCode: `// Assignment: Implement normalizeChildren\n// Build a utility normalizeChildren(children)\n// 1. If children is null or undefined, return []\n// 2. If children is an array, return it flattened\n// 3. If children is a single element/primitive, return [children]\n// 4. Return { count: number, items: any[] }\n\nexport function normalizeChildren(children) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Normalizes undefined and single child into array',
          run: (fn) => {
            const empty = fn(undefined);
            const single = fn('hello');
            return empty.count === 0 && empty.items.length === 0 && single.count === 1 && single.items[0] === 'hello';
          }
        },
        {
          name: 'Flattens nested array of children',
          run: (fn) => {
            const res = fn([1, [2, 3], 4]);
            return res.count === 4 && res.items.length === 4 && res.items[2] === 3;
          }
        }
      ],
      hints: [
        'Use Array.isArray check and .flat(Infinity).'
      ],
      checklist: [
        'Handled undefined/null case',
        'Wrapped single item into array',
        'Counted total normalized children'
      ],
      revisionSummary: 'The children prop powers container composition, accepting primitives, elements, or render functions.'
    },
    {
      id: 'p1-l11',
      slug: 'rendering-lists-and-stable-keys',
      title: 'Rendering Lists and Stable Keys',
      prerequisites: ['p1-l5', 'p0-l5'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Render dynamic lists in JSX using array.map().', 'Understand the reconciliation role of the key prop.', 'Explain why using array indexes as keys causes serious rendering and form bugs.'],
      explanation: 'When rendering lists of elements, React requires a unique key prop for each item. React uses keys to match virtual DOM elements with actual DOM nodes between renders. Keys must be stable, unique among siblings, and permanent.',
      whyItExists: 'Keys allow React to determine which items have been added, removed, or reordered without re-creating the entire list.',
      syntaxRules: 'Use stable database IDs (item.id) for keys. Never use Math.random() as a key. Avoid array indexes as keys when items can be inserted, deleted, or sorted.',
      codeExample: `// Rendering list with stable database IDs\nfunction TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map(todo => (\n        <li key={todo.id} className={todo.completed ? 'done' : ''}>\n          {todo.text}\n        </li>\n      ))}\n    </ul>\n  );\n}`,
      lineByLine: [
        'Line 5: todos.map transforms each todo item into a <li> element.',
        'Line 6: key={todo.id} gives React a permanent identifier for reconciliation.'
      ],
      expectedBehavior: 'Reordering or deleting items preserves input focus, state, and animation transitions.',
      commonMistakes: ['Using index as key: key={index}. If an item is unshifted to the start, every subsequent index shifts, corrupting state and input values.', 'Generating random keys during render: key={Math.random()}. This forces React to destroy and recreate the DOM on EVERY render.'],
      practiceLevels: {
        levelA: 'Render a list of user badges using item.id as key.',
        levelB: 'Demonstrate an input state bug caused by using index as key during array deletion.',
        levelC: 'Build a reorderable drag-and-drop list and observe reconciliation with stable IDs.'
      },
      debuggingChallenge: {
        brokenCode: `<ul>\n  {items.map(item => <li>{item.name}</li>)}\n</ul>`,
        problem: 'Missing key prop warning: "Each child in a list should have a unique key prop".',
        fix: 'Add key={item.id} to the root element returned in map().'
      },
      conceptualQuestion: {
        question: 'Why does using Math.random() as a key cause catastrophic performance and input bugs?',
        options: [
          'Math.random() is deprecated in modern JavaScript.',
          'A new random key is generated on every single render, causing React to destroy and re-create the entire DOM tree and lose component state.',
          'React limits random numbers to 100 items.',
          'Because random keys cannot be sorted.'
        ],
        correctIndex: 1,
        explanation: 'If a key changes between renders, React considers it a completely different component, tearing down the old DOM node and losing all local state.'
      },
      codeReadingQuestion: {
        snippet: `const items = ['A', 'B', 'C'];\n// items.unshift('Z');\n// keys were index 0, 1, 2`,
        question: 'What element gets key="0" after unshift("Z") when using array index?',
        answer: 'The new element "Z" gets key="0", causing React to think the first item changed content rather than a new item being inserted.'
      },
      starterCode: `// Assignment: Implement auditListKeys\n// Takes an array of list items: [{ id, name, ... }]\n// Validates whether keys are suitable for React reconciliation:\n// 1. If any item is missing 'id' or id is null/undefined -> return { valid: false, reason: 'Missing id property' }\n// 2. If duplicate ids exist -> return { valid: false, reason: 'Duplicate key detected: ' + id }\n// 3. If all ids are unique and defined -> return { valid: true, count: items.length }\n\nexport function auditListKeys(items) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Approves unique and stable list of IDs',
          run: (fn) => {
            const list = [{ id: 'u1', name: 'Ava' }, { id: 'u2', name: 'Bob' }];
            const res = fn(list);
            return res.valid === true && res.count === 2;
          }
        },
        {
          name: 'Detects duplicate keys',
          run: (fn) => {
            const list = [{ id: 'u1', name: 'Ava' }, { id: 'u1', name: 'Clara' }];
            const res = fn(list);
            return res.valid === false && res.reason.includes('Duplicate key');
          }
        },
        {
          name: 'Detects missing id',
          run: (fn) => {
            const list = [{ id: 'u1' }, { name: 'No ID' }];
            const res = fn(list);
            return res.valid === false && res.reason === 'Missing id property';
          }
        }
      ],
      hints: [
        'Use a Set to track seen IDs and detect duplicates.'
      ],
      checklist: [
        'Checked for null/undefined IDs',
        'Used Set to detect duplicates',
        'Returned meaningful diagnostic reasons'
      ],
      revisionSummary: 'Stable, unique keys (item.id) are vital for React reconciliation; never use array index for dynamic lists.'
    },
    {
      id: 'p1-l12',
      slug: 'conditional-rendering',
      title: 'Conditional Rendering in React',
      prerequisites: ['p1-l5'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Master ternary operators (? :) for inline conditional UI.', 'Avoid the "0 renders on screen" bug with logical AND (&&).', 'Use early returns for loading, empty, and error guard clauses.'],
      explanation: 'In React, conditional rendering works the same way conditions work in JavaScript: using if/else, ternary operators (? :), or logical AND (&&). To render nothing, return null from a component or guard clause.',
      whyItExists: 'Allows interfaces to dynamically adapt to authentication status, data loading, errors, and permissions.',
      syntaxRules: 'Beware: 0 && <Component /> renders 0 on the screen! Always use boolean conditions: count > 0 && <Badge /> or Boolean(count) && <Badge />.',
      codeExample: `// 1. Guard Clause / Early Return\nfunction UserProfile({ user, isLoading }) {\n  if (isLoading) return <LoadingSpinner />;\n  if (!user) return <EmptyState message="No user found" />;\n\n  return (\n    <div className="profile">\n      <h1>{user.name}</h1>\n      {/* 2. Safe Logical AND with boolean */}\n      {user.isAdmin && <AdminBadge />}\n      {/* 3. Ternary Operator */}\n      <p>Status: {user.isOnline ? 'Online' : 'Away'}</p>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 3-4: Early returns keep the main component body clean of nested indentations.',
        'Line 10: user.isAdmin is a boolean, so false renders nothing cleanly.'
      ],
      expectedBehavior: 'Only the relevant component view renders based on the current state.',
      commonMistakes: ['Writing {items.length && <List />} where items is empty. Because 0 is falsy, JavaScript evaluates 0 && ... to 0, printing "0" in the HTML!', 'Deeply nested ternary chains that are impossible to read.'],
      practiceLevels: {
        levelA: 'Use ternary to toggle Login/Logout buttons.',
        levelB: 'Implement early returns for isLoading, isError, and data empty states.',
        levelC: 'Refactor a 4-level nested ternary into a clean lookup dictionary or sub-components.'
      },
      debuggingChallenge: {
        brokenCode: `<div>{unreadMessages.length && <span>New messages!</span>}</div>`,
        problem: 'If unreadMessages.length is 0, the number 0 is printed directly into the UI!',
        fix: '<div>{unreadMessages.length > 0 && <span>New messages!</span>}</div>'
      },
      conceptualQuestion: {
        question: 'Why does {items.length && <List />} print "0" on the screen when the array is empty?',
        options: [
          'Because React has a bug in its JSX parser.',
          'In JavaScript, logical AND (a && b) returns the left operand if it is falsy. When items.length is 0, it returns 0, and React renders numbers directly into the DOM.',
          'Because 0 is considered an object in JavaScript.',
          'Because <List /> is not imported.'
        ],
        correctIndex: 1,
        explanation: 'React does not render booleans, null, or undefined, but it DOES render numbers (including 0). 0 && <JSX> evaluates to 0.'
      },
      codeReadingQuestion: {
        snippet: `const user = null;\nconst el = <div>{user?.name || 'Anonymous'}</div>;`,
        question: 'What does el render?',
        answer: '<div>Anonymous</div>'
      },
      starterCode: `// Assignment: Implement safeConditionalRender\n// Build a helper that determines what JSX-equivalent payload should render:\n// safeConditionalRender(condition, renderValue, fallbackValue)\n// Rules:\n// 1. If condition is explicitly true -> return renderValue\n// 2. If condition is a number > 0 -> return renderValue\n// 3. If condition is 0, false, null, or undefined -> return fallbackValue ?? null\n\nexport function safeConditionalRender(condition, renderValue, fallbackValue) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Renders main value on boolean true or positive count',
          run: (fn) => {
            return fn(true, 'ACTIVE', 'INACTIVE') === 'ACTIVE' && fn(5, 'ITEMS', 'EMPTY') === 'ITEMS';
          }
        },
        {
          name: 'Safely falls back on 0 or false without returning 0',
          run: (fn) => {
            return fn(0, 'ITEMS', 'EMPTY') === 'EMPTY' && fn(false, 'OK', null) === null;
          }
        }
      ],
      hints: [
        'Check if (condition === true || (typeof condition === "number" && condition > 0))'
      ],
      checklist: [
        'Prevented 0 from leaking through as truthy',
        'Handled boolean true and positive numbers',
        'Returned fallbackValue or null'
      ],
      revisionSummary: 'Use early returns for guards, ternaries for binary branches, and ensure logical && uses explicit booleans (count > 0).'
    },
    {
      id: 'p1-l13',
      slug: 'react-fragments',
      title: 'React Fragments (<>...</>)',
      prerequisites: ['p1-l5'],
      estimatedDuration: '15 mins',
      difficulty: 'Beginner',
      objectives: ['Group multiple elements without adding unnecessary DOM nodes.', 'Use short syntax <>...</> vs explicit <React.Fragment key={id}>.', 'Avoid breaking CSS Flexbox/Grid layouts with redundant wrapper divs.'],
      explanation: 'A React component must return a single root element. If you need to return multiple sibling elements (e.g., table cells <td> or list items <li>), wrapping them in a <div> would produce invalid HTML or break CSS Grid/Flexbox layouts. React Fragments let you group elements without adding an extra node to the DOM.',
      whyItExists: 'Maintains valid HTML semantics and clean DOM trees without unnecessary wrapper divs.',
      syntaxRules: 'Use short syntax <>...</> for standard grouping. Use explicit <React.Fragment key={item.id}> when iterating in a list where keys are required.',
      codeExample: `// Short syntax: No extra DOM wrapper node\nfunction Columns() {\n  return (\n    <>\n      <td>Column 1</td>\n      <td>Column 2</td>\n    </>\n  );\n}\n\n// Keyed Fragment inside a list\nfunction Glossary({ terms }) {\n  return (\n    <dl>\n      {terms.map(t => (\n        <React.Fragment key={t.id}>\n          <dt>{t.term}</dt>\n          <dd>{t.definition}</dd>\n        </React.Fragment>\n      ))}\n    </dl>\n  );\n}`,
      lineByLine: [
        'Line 4: <>...</> groups sibling table cells without inserting an invalid <div> into a table row.',
        'Line 15: <React.Fragment key={t.id}> supports the key attribute when mapping lists.'
      ],
      expectedBehavior: 'Inner elements are mounted directly into the parent DOM node without a wrapper element.',
      commonMistakes: ['Trying to pass key to the short syntax: < key={item.id} > (syntax error). Must use <React.Fragment key={...}>.', 'Overusing <div> everywhere ("div soup") causing CSS layout bugs.'],
      practiceLevels: {
        levelA: 'Replace an unnecessary wrapper <div> with a Fragment <>...</>.',
        levelB: 'Render a definition list (<dl>) using keyed <React.Fragment>.',
        levelC: 'Inspect DOM in browser DevTools to confirm no extra container elements exist.'
      },
      debuggingChallenge: {
        brokenCode: `<ul className="menu">\n  <div className="items">\n    <li>Item 1</li>\n    <li>Item 2</li>\n  </div>\n</ul>`,
        problem: '<div> directly inside <ul> is invalid HTML and breaks CSS list-styling.',
        fix: 'Replace <div className="items"> with a Fragment or style the <ul> directly.'
      },
      conceptualQuestion: {
        question: 'When MUST you use <React.Fragment> instead of the short syntax <>?</question>',
        options: [
          'When the fragment has more than 5 children.',
          'When you need to pass a "key" prop to the fragment while rendering a list.',
          'When using TypeScript.',
          'When rendering inside an iframe.'
        ],
        correctIndex: 1,
        explanation: 'The short syntax <>...</> does not support any attributes. If a key is required (such as in an array.map()), you must use <React.Fragment key={...}>.'
      },
      codeReadingQuestion: {
        snippet: `const el = <React.Fragment key="k1"><span>A</span><span>B</span></React.Fragment>;`,
        question: 'How many DOM nodes will this create in the browser?',
        answer: 'Two DOM nodes (the two spans). The Fragment creates zero DOM nodes.'
      },
      starterCode: `// Assignment: Implement countDomNodesCreated\n// Given a virtual tree descriptor: [{ type: string, children: any[] }]\n// Types can be 'div', 'span', 'p', 'fragment', or 'text'.\n// Fragments do NOT create DOM nodes; their children are mounted directly.\n// Recursively count the total DOM nodes created.\n\nexport function countDomNodesCreated(nodes) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Does not count fragments as DOM nodes',
          run: (fn) => {
            const tree = [
              {
                type: 'fragment',
                children: [
                  { type: 'span', children: [] },
                  { type: 'p', children: [] }
                ]
              }
            ];
            return fn(tree) === 2;
          }
        },
        {
          name: 'Counts nested real DOM nodes correctly',
          run: (fn) => {
            const tree = [
              {
                type: 'div',
                children: [
                  { type: 'fragment', children: [{ type: 'button', children: [] }] }
                ]
              }
            ];
            return fn(tree) === 2; // div + button
          }
        }
      ],
      hints: [
        'If node.type !== "fragment", add 1, then recurse over node.children.'
      ],
      checklist: [
        'Excluded fragment nodes from DOM count',
        'Handled recursive children arrays',
        'Calculated correct total real nodes'
      ],
      revisionSummary: 'Fragments group sibling elements with zero DOM overhead; use <React.Fragment key={...}> when mapping lists.'
    },
    {
      id: 'p1-l14',
      slug: 'event-handling-in-react',
      title: 'Event Handling in React',
      prerequisites: ['p1-l5', 'p0-l11'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Handle events using camelCase props (onClick, onChange, onSubmit).', 'Pass function references rather than invoking functions immediately: onClick={handleClick}.', 'Work with React SyntheticEvent cross-browser wrappers.'],
      explanation: 'React attaches event handlers directly on JSX elements using camelCase props. Instead of passing a string (like HTML onclick="handleClick()"), you pass the actual function reference (onClick={handleClick}). React wraps native browser events in a SyntheticEvent object for cross-browser consistency.',
      whyItExists: 'Provides clean, declarative, high-performance event management via root container delegation.',
      syntaxRules: 'Pass the function reference: onClick={handleClick} or an inline arrow function: onClick={() => handleClick(id)}. Never call it immediately: onClick={handleClick()} (which triggers on every render!).',
      codeExample: `function DeleteButton({ itemId, onDelete }) {\n  function handleClick(event) {\n    event.stopPropagation();\n    onDelete(itemId);\n  }\n\n  return (\n    <button onClick={handleClick} className="btn-delete">\n      Delete Item\n    </button>\n  );\n}`,
      lineByLine: [
        'Line 2: Handler function receives the SyntheticEvent object.',
        'Line 3: stopPropagation prevents parent container clicks from firing.',
        'Line 7: Passes the handleClick function reference to onClick.'
      ],
      expectedBehavior: 'Handler executes only when user clicks the button.',
      commonMistakes: ['Calling function immediately in JSX: onClick={deleteItem(id)} instead of onClick={() => deleteItem(id)}.', 'Mutating the SyntheticEvent asynchronously after the event handler completes.'],
      practiceLevels: {
        levelA: 'Attach an onClick counter increment handler.',
        levelB: 'Pass arguments to an event handler using an inline arrow function.',
        levelC: 'Handle keyboard navigation (onKeyDown Enter and Escape keys).'
      },
      debuggingChallenge: {
        brokenCode: `<button onClick={alert('Hello!')}>Click Me</button>`,
        problem: 'alert() is called immediately when the component renders, not when clicked!',
        fix: '<button onClick={() => alert("Hello!")}>Click Me</button>'
      },
      conceptualQuestion: {
        question: 'What happens if you write <button onClick={handleClick()}>Click</button> in React?',
        options: [
          'It works normally.',
          'handleClick is executed immediately during render, and its return value is assigned as the event handler (often causing bugs or infinite render loops).',
          'React displays a compile-time syntax error.',
          'The button becomes disabled.'
        ],
        correctIndex: 1,
        explanation: 'Parentheses () invoke the function right away during render. You must pass a function reference (onClick={handleClick}) or arrow function (onClick={() => handleClick()}).'
      },
      codeReadingQuestion: {
        snippet: `const handle = (e) => { e.preventDefault(); console.log('Submitting'); };\n// <form onSubmit={handle} />`,
        question: 'What does e.preventDefault() accomplish here?',
        answer: 'It prevents the browser from doing a full page refresh upon form submission.'
      },
      starterCode: `// Assignment: Implement bindEventHandler\n// Create a safe event invoker bindEventHandler(handlerFn, arg)\n// Returns an event listener function: (event) => any\n// Requirements:\n// 1. If handlerFn is not a function, return a no-op function () => {}\n// 2. When listener is invoked, if arg is provided, call handlerFn(arg, event); otherwise handlerFn(event)\n\nexport function bindEventHandler(handlerFn, arg) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Invokes handler with argument and event object',
          run: (fn) => {
            let captured = null;
            const handler = (id, e) => { captured = { id, type: e.type }; };
            const listener = fn(handler, 42);
            listener({ type: 'click' });
            return captured && captured.id === 42 && captured.type === 'click';
          }
        },
        {
          name: 'Safely handles null/non-function handler',
          run: (fn) => {
            const listener = fn(null);
            listener({ type: 'click' }); // Should not throw
            return typeof listener === 'function';
          }
        }
      ],
      hints: [
        'Check typeof handlerFn === "function"; if false, return () => {}.'
      ],
      checklist: [
        'Safely validated function type',
        'Forwarded custom arguments and synthetic event',
        'Returned executable callback function'
      ],
      revisionSummary: 'Pass function references to camelCase event props (onClick={handleClick}); use arrow wrappers to pass parameters.'
    },
    {
      id: 'p1-l15',
      slug: 'state-with-usestate',
      title: 'State with useState',
      prerequisites: ['p1-l7', 'p0-l4'],
      estimatedDuration: '30 mins',
      difficulty: 'Beginner',
      objectives: ['Declare component-local state using the useState hook.', 'Understand array destructuring convention: const [state, setState] = useState(initialValue).', 'Understand that state persists across re-renders.'],
      explanation: 'Regular JavaScript variables inside a function disappear when the function finishes running and reset on the next call. The useState hook lets a React component "remember" data across renders. Calling the setter function (setCount) tells React that the component needs to re-render with the new state value.',
      whyItExists: 'Allows components to maintain interactive, dynamic, memory-persisted state.',
      syntaxRules: 'const [state, setState] = useState(initialValue). Only call useState at the top level of your component function (never inside loops, conditions, or nested functions).',
      codeExample: `import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="counter">\n      <p>Current: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: useState(0) initializes count with 0 on first render.',
        'Line 8: setCount(count + 1) schedules a state update and requests a re-render.'
      ],
      expectedBehavior: 'Clicking the button updates count and re-renders the UI displaying the new value.',
      commonMistakes: ['Trying to mutate state directly: count = count + 1 (React will not know to re-render!).', 'Calling useState conditionally inside an if-statement.'],
      practiceLevels: {
        levelA: 'Build an open/closed accordion toggle with useState(false).',
        levelB: 'Implement a character counter with useState("") tracking text input length.',
        levelC: 'Build a multi-tab switcher maintaining the activeTab index in state.'
      },
      debuggingChallenge: {
        brokenCode: `function BadCounter() {\n  let count = 0;\n  return <button onClick={() => { count++; }}>{count}</button>;\n}`,
        problem: 'Local variable count is reset to 0 on every render and incrementing it does not trigger a re-render.',
        fix: 'const [count, setCount] = useState(0); and onClick={() => setCount(count + 1)}'
      },
      conceptualQuestion: {
        question: 'Why doesn\'t changing a regular variable (let count = 0; count++) trigger a React re-render?',
        options: [
          'JavaScript does not support let in React.',
          'React does not track changes to local function variables; it only re-renders when state updater functions from useState/useReducer are called.',
          'Regular variables are read-only in React.',
          'Because variables are cleared by the garbage collector.'
        ],
        correctIndex: 1,
        explanation: 'React has no way of observing standard variable reassignments. Calling setState explicitly informs React to schedule a re-render.'
      },
      codeReadingQuestion: {
        snippet: `const [name, setName] = useState(() => 'Ada');`,
        question: 'What is passing a function to useState called, and when is it executed?',
        answer: 'Lazy initial state. The function is executed only once during the initial mount, useful for expensive calculations.'
      },
      starterCode: `// Assignment: Implement simulateUseState\n// Build a simplified simulator of useState:\n// createComponentState(initialValue)\n// Returns { getState: () => any, setState: (nextVal) => void, subscribe: (listener) => void }\n// When setState is called with a new value, update internal value and notify all subscribers with nextVal.\n\nexport function createComponentState(initialValue) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Maintains state and triggers listener on update',
          run: (fn) => {
            const state = fn(10);
            let observed = null;
            state.subscribe((val) => { observed = val; });
            state.setState(25);
            return state.getState() === 25 && observed === 25;
          }
        }
      ],
      hints: [
        'Store let value = initialValue; and const listeners = [];'
      ],
      checklist: [
        'Stored value across function calls',
        'Updated value on setState',
        'Notified subscribers of state changes'
      ],
      revisionSummary: 'useState allows components to persist dynamic data across renders and schedule UI updates.'
    },
    {
      id: 'p1-l16',
      slug: 'state-updates-prev-state-callbacks',
      title: 'State Updates and Previous-State Callbacks',
      prerequisites: ['p1-l15'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand state updater batching and snapshots.', 'Use the updater function pattern: setCount(prev => prev + 1).', 'Recognize race conditions caused by referencing stale state.'],
      explanation: 'State in React behaves like a snapshot: inside a render, the state variable holds the value at the time the render began. If you call setCount(count + 1) three times in a row within the same event handler, count does not change between those lines! To calculate new state based on previous state reliably, pass an updater function: setCount(prev => prev + 1).',
      whyItExists: 'Prevents race conditions and guarantees updates are queued and computed on the latest pending state.',
      syntaxRules: 'Whenever next state depends on current state (counters, toggles, appending to arrays), always use the callback form: setState(prev => ...).',
      codeExample: `// Stale Snapshot Bug:\n// setCount(count + 1); // count is 0\n// setCount(count + 1); // count is STILL 0!\n// Result: count becomes 1, not 2.\n\n// CORRECT: Updater Callback\nfunction incrementTwice() {\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n  // Result: count becomes 2!\n}`,
      lineByLine: [
        'Line 8: prev => prev + 1 queues an updater function in React\'s internal state queue.',
        'Line 9: Second updater takes the output of the first updater, correctly calculating 2.'
      ],
      expectedBehavior: 'Queued updates are evaluated in sequence against pending state.',
      commonMistakes: ['Calling setState(count + 1) multiple times assuming count immediately increments.', 'Using state directly in async timeouts instead of updater callbacks.'],
      practiceLevels: {
        levelA: 'Convert a toggle setter setIsOpen(!isOpen) to setIsOpen(prev => !prev).',
        levelB: 'Implement a batch adder incrementBy(amount) using updater functions.',
        levelC: 'Build an undo/redo state history container using queued state snapshots.'
      },
      debuggingChallenge: {
        brokenCode: `function handleLike() {\n  setLikes(likes + 1);\n  setTimeout(() => {\n    setLikes(likes + 1); // Stale snapshot!\n  }, 1000);\n}`,
        problem: 'likes inside setTimeout captured the value from 1 second ago.',
        fix: 'setLikes(prev => prev + 1);'
      },
      conceptualQuestion: {
        question: 'If count is 5, what is count after: setCount(count + 1); setCount(count + 1); setCount(count + 1)?',
        options: ['8', '6', '5', '7'],
        correctIndex: 1,
        explanation: 'count remains 5 for the duration of the current render event. All three calls evaluate to setCount(5 + 1), resulting in 6.'
      },
      codeReadingQuestion: {
        snippet: `setCount(c => c + 1);\nsetCount(c => c * 2); // if initial was 2`,
        question: 'What is the final count?',
        answer: '6 (first updater gives 2 + 1 = 3; second updater gives 3 * 2 = 6).'
      },
      starterCode: `// Assignment: Implement processUpdateQueue\n// Simulate React\'s updater queue engine:\n// processUpdateQueue(baseState, updates)\n// updates is an array of values or updater functions: [5, (prev) => prev + 1, (prev) => prev * 2]\n// Returns the final state computed sequentially.\n\nexport function processUpdateQueue(baseState, updates) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Sequentially applies updater functions and direct values',
          run: (fn) => {
            const queue = [
              (prev) => prev + 1, // 0 -> 1
              (prev) => prev + 1, // 1 -> 2
              (prev) => prev * 5  // 2 -> 10
            ];
            return fn(0, queue) === 10;
          }
        },
        {
          name: 'Direct values overwrite previous state in queue',
          run: (fn) => {
            const queue = [
              (prev) => prev + 10,
              100, // Replaces current value
              (prev) => prev + 5
            ];
            return fn(0, queue) === 105;
          }
        }
      ],
      hints: [
        'Use updates.reduce((state, update) => typeof update === "function" ? update(state) : update, baseState).'
      ],
      checklist: [
        'Handled both function updaters and direct values',
        'Processed updates sequentially in queue order',
        'Returned final computed state'
      ],
      revisionSummary: 'When next state depends on current state, always use functional updaters (prev => next) to avoid stale snapshot bugs.'
    },
    {
      id: 'p1-l17',
      slug: 'why-state-updates-trigger-renders',
      title: 'Why State Updates Trigger Renders',
      prerequisites: ['p1-l16'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Trace the React lifecycle from setState to re-render to DOM commit.', 'Understand Object.is equality checking in bailouts.', 'Explain why setting identical state skips re-rendering.'],
      explanation: 'When you call a state updater (setState(newValue)), React compares the new value with the current value using Object.is(prev, next). If the values are identical (referentially equal), React bails out of re-rendering! If the values differ, React schedules a re-render of that component and its children, produces a new Virtual DOM tree, reconciles diffs, and commits updates to the real DOM.',
      whyItExists: 'Prevents unnecessary calculations when state has not actually changed.',
      syntaxRules: 'If you mutate an object in place: user.name = "Bob"; setUser(user);, Object.is(prev, next) returns true! React bails out and DOES NOT RE-RENDER.',
      codeExample: `// React State Bailout Demonstration\nconst [count, setCount] = useState(0);\n\n// If count is 0, calling setCount(0) BAILS OUT:\n// Object.is(0, 0) === true -> No re-render scheduled!\n\n// Why mutation fails:\nconst [user, setUser] = useState({ name: 'Ada' });\nuser.name = 'Grace';\nsetUser(user); // Object.is(user, user) === TRUE -> NO RE-RENDER!`,
      lineByLine: [
        'Line 8: user.name is mutated, but the memory reference is identical.',
        'Line 9: setUser(user) checks Object.is(user, user). It returns true, so React skips rendering.'
      ],
      expectedBehavior: 'Component re-renders if and only if Object.is(prev, next) evaluates to false.',
      commonMistakes: ['Mutating object/array in place and wondering why the component does not update.', 'Expecting console.log right after setState to display the new value.'],
      practiceLevels: {
        levelA: 'Demonstrate that Object.is(+0, -0) is false and Object.is(NaN, NaN) is true.',
        levelB: 'Prevent unnecessary re-renders by guarding state updates.',
        levelC: 'Measure re-render counts with a render counter ref.'
      },
      debuggingChallenge: {
        brokenCode: `function Profile() {\n  const [data, setData] = useState({ views: 0 });\n  const handleClick = () => {\n    data.views += 1;\n    setData(data); // Why doesn't UI update?\n  };\n}`,
        problem: 'data object reference did not change. React bails out due to Object.is equality.',
        fix: 'setData({ ...data, views: data.views + 1 });'
      },
      conceptualQuestion: {
        question: 'Which equality comparison algorithm does React use to determine whether to re-render after setState?',
        options: [
          'Loose equality (==)',
          'Strict equality (===)',
          'Object.is()',
          'JSON.stringify deep comparison'
        ],
        correctIndex: 2,
        explanation: 'React uses Object.is() to compare previous and next state values to determine if a re-render is required.'
      },
      codeReadingQuestion: {
        snippet: `const [val, setVal] = useState(NaN);\nsetVal(NaN);`,
        question: 'Will React schedule a re-render here?',
        answer: 'No, because Object.is(NaN, NaN) is true, triggering a render bailout.'
      },
      starterCode: `// Assignment: Implement shouldReactRerender\n// Simulate React\'s bailout decision:\n// shouldReactRerender(prevState, nextState)\n// Return true if React will trigger a re-render, false if it bails out.\n// Must adhere strictly to Object.is() semantics.\n\nexport function shouldReactRerender(prevState, nextState) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Bails out when state is identical reference or value',
          run: (fn) => {
            const obj = { id: 1 };
            return fn(obj, obj) === false && fn(42, 42) === false && fn(NaN, NaN) === false;
          }
        },
        {
          name: 'Rerenders when reference changes even with identical data',
          run: (fn) => {
            return fn({ id: 1 }, { id: 1 }) === true && fn(0, 1) === true;
          }
        }
      ],
      hints: [
        'Return !Object.is(prevState, nextState);'
      ],
      checklist: [
        'Used Object.is comparison',
        'Correctly returned true for re-render, false for bailout'
      ],
      revisionSummary: 'React uses Object.is to check state changes; returning fresh object references is required to trigger re-renders.'
    },
    {
      id: 'p1-l18',
      slug: 'rules-of-react-rendering',
      title: 'Rules of React Rendering',
      prerequisites: ['p1-l4'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the Golden Rule of React: Components must be pure functions of props and state.', 'Never perform side effects during the render phase.', 'Keep JSX rendering deterministic.'],
      explanation: 'In React, the render phase must be pure: same inputs (props and state) must always produce the same output (JSX), and rendering must have zero observable side effects (no DOM mutations, no network requests, no timers). Side effects belong in event handlers or useEffect.',
      whyItExists: 'Enables React to pause, abort, and recalculate rendering in concurrent mode without visual artifacts or bugs.',
      syntaxRules: 'Pure functions: 1. Do not mutate objects created before rendering. 2. Do not mutate DOM nodes. 3. Do not fire asynchronous side effects in the render body.',
      codeExample: `// PURE COMPONENT: Deterministic, zero side effects\nfunction Recipe({ guests }) {\n  const cupsOfWater = guests * 2; // Local calculation: Pure!\n  return <div>Use {cupsOfWater} cups of water.</div>;\n}\n\n// IMPURE: Mutating external variable during render!\nlet currentId = 0;\nfunction BadItem() {\n  currentId++; // SIDE EFFECT: Breaches rendering purity!\n  return <div>Item #{currentId}</div>;\n}`,
      lineByLine: [
        'Line 2: cupsOfWater is computed locally without touching external variables.',
        'Line 9: Modifying currentId during render causes non-deterministic behavior and breaks StrictMode.'
      ],
      expectedBehavior: 'Component returns predictable JSX regardless of when or how often React invokes it.',
      commonMistakes: ['Calling fetch() directly in component function body.', 'Manipulating window or document directly during render.'],
      practiceLevels: {
        levelA: 'Refactor an impure component using Math.random() in render to receive an ID prop.',
        levelB: 'Move an API call out of render body and into an event handler.',
        levelC: 'Audit a component tree for render-phase side effects.'
      },
      debuggingChallenge: {
        brokenCode: `function Clock() {\n  setInterval(() => { /* ... */ }, 1000); // Triggered on EVERY render!\n  return <div>Time</div>;\n}`,
        problem: 'Creating intervals in render creates hundreds of runaway timers on every state update.',
        fix: 'Move timer into useEffect with cleanup clearInterval.'
      },
      conceptualQuestion: {
        question: 'Which of the following is permitted during the React render phase?',
        options: [
          'Sending an HTTP POST request',
          'Computing a derived string from props: const full = `${props.first} ${props.last}`',
          'Calling document.getElementById("root").style.background = "black"',
          'Starting a setInterval timer'
        ],
        correctIndex: 1,
        explanation: 'Computing derived values from props and state locally is pure and encouraged. Network requests, DOM mutations, and timers are side effects.'
      },
      codeReadingQuestion: {
        snippet: `function Item({ list }) {\n  list.push('new');\n  return <div>{list.length}</div>;\n}`,
        question: 'What React rendering rule does this break?',
        answer: 'Purity rule: It mutates an existing prop object (list) that was created outside the component render.'
      },
      starterCode: `// Assignment: Implement isRenderActionPermitted\n// Classify actions according to React Render Phase Rules:\n// isRenderActionPermitted(actionType)\n// Permitted in render: 'DERIVE_STATE', 'MAP_PROPS_TO_JSX', 'LOCAL_MATH', 'CALCULATE_CLASSES'\n// Prohibited in render: 'FETCH_API', 'MUTATE_DOM', 'START_TIMER', 'MUTATE_PROPS', 'WRITE_LOCAL_STORAGE'\n// Return { permitted: boolean, classification: 'pure_calculation' | 'side_effect' }\n\nexport function isRenderActionPermitted(actionType) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Permits pure calculations',
          run: (fn) => {
            const r1 = fn('DERIVE_STATE');
            const r2 = fn('CALCULATE_CLASSES');
            return r1.permitted === true && r1.classification === 'pure_calculation' && r2.permitted === true;
          }
        },
        {
          name: 'Prohibits side effects in render',
          run: (fn) => {
            const r1 = fn('FETCH_API');
            const r2 = fn('MUTATE_DOM');
            return r1.permitted === false && r1.classification === 'side_effect' && r2.permitted === false;
          }
        }
      ],
      hints: [
        'Check if action is in permitted array; return true and "pure_calculation", else false and "side_effect".'
      ],
      checklist: [
        'Categorized pure calculations vs side effects',
        'Returned structured permission object'
      ],
      revisionSummary: 'The render phase must be pure: deterministic calculation of JSX with zero side effects.'
    },
    {
      id: 'p1-l19',
      slug: 'state-immutability-arrays-objects',
      title: 'State Immutability: Updating Arrays and Objects',
      prerequisites: ['p1-l15', 'p0-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Update nested state objects using spread operators.', 'Add, remove, and update items in state arrays immutably.', 'Avoid mutation bugs with sort, splice, and reverse.'],
      explanation: 'In React, state should be treated as read-only. When updating objects or arrays, never mutate existing instances. Instead, create a new object using spread ({ ...prev, key: val }) or a new array using methods that return fresh copies (map, filter, concat, spread).',
      whyItExists: 'Immutable updates guarantee referential changes so React can detect changes, optimize re-renders, and support time-travel debugging.',
      syntaxRules: 'Add item: [...prev, item]. Remove item: prev.filter(i => i.id !== id). Update item: prev.map(i => i.id === id ? { ...i, done: true } : i).',
      codeExample: `// IMMUTABLE ARRAY OPERATIONS IN REACT\n// 1. Add item\nsetTodos(prev => [...prev, newTodo]);\n\n// 2. Remove item\nsetTodos(prev => prev.filter(t => t.id !== idToRemove));\n\n// 3. Update item\nsetTodos(prev => prev.map(t => t.id === targetId ? { ...t, completed: !t.completed } : t));`,
      lineByLine: [
        'Line 2: [...prev, newTodo] creates a new array with newTodo appended.',
        'Line 5: filter returns a brand new array excluding the matched ID.',
        'Line 8: map produces a new array, cloning and updating only the matching item.'
      ],
      expectedBehavior: 'React detects the new array reference and renders updated list items smoothly.',
      commonMistakes: ['Calling array.sort() directly on state (mutates in place; use [...arr].sort() instead).', 'Using array.splice() instead of filter() or slice().'],
      practiceLevels: {
        levelA: 'Add a new string to a tags array in state.',
        levelB: 'Toggle a todo item completed boolean using map() without mutating other items.',
        levelC: 'Update a deeply nested object: user.company.address.street immutably.'
      },
      debuggingChallenge: {
        brokenCode: `function handleSort() {\n  setItems(items.sort()); // Mutates items in place!\n}`,
        problem: 'items.sort() mutates the array in place and returns the same reference, so React bails out of re-rendering.',
        fix: 'setItems([...items].sort());'
      },
      conceptualQuestion: {
        question: 'Which of the following array methods mutates the array in place and should NOT be used directly on React state?',
        options: ['filter()', 'map()', 'splice()', 'slice()'],
        correctIndex: 2,
        explanation: 'splice() mutates the original array in place. filter(), map(), and slice() return fresh arrays.'
      },
      codeReadingQuestion: {
        snippet: `const update = (list, id) => list.map(item => item.id === id ? { ...item, active: true } : item);`,
        question: 'Does this create new objects for items that did not match id?',
        answer: 'No, unmatched items keep their existing object references (structural sharing), maximizing performance.'
      },
      starterCode: `// Assignment: Implement immutableStoreOperations\n// Build an immutable store manager:\n// immutableStoreOperations(state, action)\n// state = { items: [{ id: number, text: string, done: boolean }] }\n// Supported actions:\n// 1. { type: 'ADD', item: { id, text, done } } -> adds item to end\n// 2. { type: 'REMOVE', id: number } -> removes item\n// 3. { type: 'TOGGLE', id: number } -> flips done boolean for that item\n// Return the new state. Original state must NOT be mutated.\n\nexport function immutableStoreOperations(state, action) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Adds item and preserves immutability',
          run: (fn) => {
            const initial = { items: [{ id: 1, text: 'A', done: false }] };
            const next = fn(initial, { type: 'ADD', item: { id: 2, text: 'B', done: false } });
            return next.items.length === 2 && initial.items.length === 1 && next !== initial && next.items !== initial.items;
          }
        },
        {
          name: 'Toggles item done status cleanly',
          run: (fn) => {
            const initial = { items: [{ id: 1, text: 'A', done: false }] };
            const next = fn(initial, { type: 'TOGGLE', id: 1 });
            return next.items[0].done === true && initial.items[0].done === false;
          }
        },
        {
          name: 'Removes item cleanly',
          run: (fn) => {
            const initial = { items: [{ id: 1, text: 'A', done: false }, { id: 2, text: 'B', done: false }] };
            const next = fn(initial, { type: 'REMOVE', id: 1 });
            return next.items.length === 1 && next.items[0].id === 2;
          }
        }
      ],
      hints: [
        'Use [...state.items, action.item], state.items.filter(...), and state.items.map(...).'
      ],
      checklist: [
        'Implemented ADD, REMOVE, TOGGLE actions',
        'Returned fresh state and array references',
        'Did not mutate initial input objects'
      ],
      revisionSummary: 'Use spread, map, and filter for immutable updates; never mutate state objects or arrays directly.'
    },
    {
      id: 'p1-l20',
      slug: 'lifting-state-up',
      title: 'Lifting State Up',
      prerequisites: ['p1-l15', 'p1-l9'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify when sibling components need to share state.', 'Lift state up to their closest common parent.', 'Pass state down via props and update functions via callbacks.'],
      explanation: 'When two or more components need to coordinate or reflect the same changing data, do not duplicate the state in both components. Instead, lift the state up to their closest common ancestor. The ancestor becomes the single source of truth, passing values down as props and change handlers as callbacks.',
      whyItExists: 'Ensures state synchronization without duplicate sources of truth or buggy syncing effects.',
      syntaxRules: 'State lives in the common parent. Children receive current value and onUpdate callback.',
      codeExample: `// Closest Common Parent\nfunction TemperatureConverter() {\n  const [celsius, setCelsius] = useState(0);\n  const fahrenheit = (celsius * 9) / 5 + 32; // Derived state!\n\n  return (\n    <div>\n      <TemperatureInput scale="Celsius" value={celsius} onChange={setCelsius} />\n      <TemperatureDisplay scale="Fahrenheit" value={fahrenheit} />\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 3: Celsius state is stored in the parent.',
        'Line 4: Fahrenheit is derived on the fly without second state.',
        'Line 8: TemperatureInput reports changes back up to the parent.'
      ],
      expectedBehavior: 'Typing in Celsius immediately updates the Fahrenheit display consistently.',
      commonMistakes: ['Keeping duplicate state in both parent and child and trying to sync them with useEffect.', 'Lifting state too high up the tree, causing unnecessary re-renders of unrelated components.'],
      practiceLevels: {
        levelA: 'Lift active accordion index state to the parent Accordion container.',
        levelB: 'Synchronize a search input box with a results table component.',
        levelC: 'Build a synced split-pane markdown editor (Editor on left, Live Preview on right).'
      },
      debuggingChallenge: {
        brokenCode: `// Child copies prop into state\nfunction Child({ filter }) {\n  const [currentFilter, setCurrentFilter] = useState(filter); // Stale when prop changes!\n}`,
        problem: 'useState only initializes on mount. When parent updates filter prop, child state remains unchanged.',
        fix: 'Use prop directly: filter, without copying it into state.'
      },
      conceptualQuestion: {
        question: 'What is the primary benefit of "Lifting State Up" in React?',
        options: [
          'It makes the code execute on a background web worker thread.',
          'It maintains a single source of truth between components that need to coordinate, preventing state desynchronization.',
          'It reduces the bundle size of Vite.',
          'It replaces the need for React Router.'
        ],
        correctIndex: 1,
        explanation: 'Lifting state ensures there is exactly one source of truth shared by siblings, eliminating sync bugs.'
      },
      codeReadingQuestion: {
        snippet: `// Sibling A: <SearchInput text={q} onChange={setQ} />\n// Sibling B: <SearchResults query={q} />`,
        question: 'Where should const [q, setQ] = useState(\'\') be declared?',
        answer: 'In the parent component that renders both SearchInput and SearchResults.'
      },
      starterCode: `// Assignment: Implement findCommonAncestorState\n// Given a tree representation: { id, children: [] }\n// findCommonAncestor(tree, idA, idB)\n// Find the lowest common ancestor node ID where shared state should live to be accessible to both idA and idB.\n\nexport function findCommonAncestor(tree, idA, idB) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Finds direct parent as common ancestor',
          run: (fn) => {
            const tree = {
              id: 'App',
              children: [
                { id: 'Header', children: [] },
                {
                  id: 'Container',
                  children: [
                    { id: 'Input', children: [] },
                    { id: 'Display', children: [] }
                  ]
                }
              ]
            };
            return fn(tree, 'Input', 'Display') === 'Container';
          }
        },
        {
          name: 'Finds root when siblings are in different branches',
          run: (fn) => {
            const tree = {
              id: 'App',
              children: [
                { id: 'Nav', children: [{ id: 'UserMenu', children: [] }] },
                { id: 'Content', children: [{ id: 'ProfileView', children: [] }] }
              ]
            };
            return fn(tree, 'UserMenu', 'ProfileView') === 'App';
          }
        }
      ],
      hints: [
        'Find path from root to idA and path to idB, then find the last common node in both paths.'
      ],
      checklist: [
        'Traced paths from root',
        'Identified lowest common ancestor node',
        'Returned correct ancestor ID'
      ],
      revisionSummary: 'Share state between siblings by lifting it up to their closest common ancestor.'
    },
    {
      id: 'p1-l21',
      slug: 'controlled-inputs',
      title: 'Controlled Inputs in React',
      prerequisites: ['p1-l15', 'p1-l14'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Bind form input value to React state (value={text} onChange={e => setText(e.target.value)}).', 'Understand why React is the single source of truth in controlled components.', 'Avoid the "uncontrolled to controlled" warning.'],
      explanation: 'In traditional HTML, the DOM input element manages its own internal state. In a controlled component, the input\'s value is bound directly to React state: <input value={name} onChange={e => setName(e.target.value)} />. React dictates what is displayed in the input at all times.',
      whyItExists: 'Enables instant input validation, formatting (e.g. uppercase, phone mask), and disables submit buttons until fields are valid.',
      syntaxRules: 'Always initialize state with a defined string (e.g. useState("")), never useState(undefined) or useState(null), to prevent switching from uncontrolled to controlled.',
      codeExample: `function ControlledInput() {\n  const [name, setName] = useState('');\n\n  return (\n    <div>\n      <label htmlFor="user-name">Name:</label>\n      <input\n        id="user-name"\n        type="text"\n        value={name}\n        onChange={(e) => setName(e.target.value.toUpperCase())} // Direct control & transform!\n      />\n      <p>Length: {name.length}</p>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 2: name is initialized to empty string "".',
        'Line 8: value={name} binds the DOM element to React state.',
        'Line 9: onChange intercepts user typing, transforms to uppercase, and updates state.'
      ],
      expectedBehavior: 'Input immediately reflects the uppercase transformed state.',
      commonMistakes: ['Initializing with useState() without argument: value={undefined} causes React warning: "A component is changing an uncontrolled input to be controlled".', 'Passing value without onChange (makes input read-only unless readOnly is specified).'],
      practiceLevels: {
        levelA: 'Create a controlled text input displaying character count.',
        levelB: 'Implement a currency input that automatically formats numbers to USD currency.',
        levelC: 'Build a tags input where pressing Enter or comma converts typed text into pill badges.'
      },
      debuggingChallenge: {
        brokenCode: `function Input() {\n  const [text, setText] = useState(); // undefined!\n  return <input value={text} onChange={e => setText(e.target.value)} />;\n}`,
        problem: 'Input starts as uncontrolled because value is undefined, then becomes controlled on first keystroke.',
        fix: 'useState("")'
      },
      conceptualQuestion: {
        question: 'What is the defining characteristic of a "controlled component" in React?',
        options: [
          'It is wrapped in an Error Boundary.',
          'Its form element value is driven by React state, and changes trigger a state update via an onChange handler.',
          'It can only be used by administrators.',
          'It uses useRef instead of useState.'
        ],
        correctIndex: 1,
        explanation: 'A controlled input gets its current value from React state and updates that state via an onChange handler.'
      },
      codeReadingQuestion: {
        snippet: `<input value="hello" />`,
        question: 'Can the user type new text into this input in the browser?',
        answer: 'No, because value is hardcoded without an onChange handler, making it effectively read-only.'
      },
      starterCode: `// Assignment: Implement maskPhoneNumberInput\n// Build an input transformer maskPhoneNumberInput(rawInput)\n// Takes raw user input string (e.g. '1234567890' or 'abc1234567890')\n// 1. Strip all non-digit characters.\n// 2. Limit to max 10 digits.\n// 3. Format as: (XXX) XXX-XXXX for 10 digits; (XXX) XXX for 6 digits; (XXX for 3 digits.\n// Return formatted string.\n\nexport function maskPhoneNumberInput(rawInput) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Formats 10 digits as (XXX) XXX-XXXX',
          run: (fn) => {
            return fn('5551234567') === '(555) 123-4567';
          }
        },
        {
          name: 'Strips letters and partial formatting',
          run: (fn) => {
            return fn('phone 555-12') === '(555) 12';
          }
        }
      ],
      hints: [
        'Strip non-digits: const digits = rawInput.replace(/\\D/g, "").slice(0, 10);',
        'Format based on digits.length.'
      ],
      checklist: [
        'Sanitized non-numeric characters',
        'Capped at 10 digits',
        'Applied phone mask format'
      ],
      revisionSummary: 'Controlled inputs bind value to React state and update via onChange, enabling validation and masking.'
    },
    {
      id: 'p1-l22',
      slug: 'basic-forms-and-submission',
      title: 'Basic Forms and Form Submission',
      prerequisites: ['p1-l21'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Handle form submission using onSubmit and e.preventDefault().', 'Manage multi-field forms cleanly with a single state object.', 'Display field validation and submission states.'],
      explanation: 'HTML forms refresh the entire page by default when submitted. In React single-page apps, we intercept submission using <form onSubmit={handleSubmit}> and call e.preventDefault(). For multi-input forms, managing state with a single object ({ email: "", password: "" }) using computed property names ([e.target.name]: e.target.value) keeps code DRY.',
      whyItExists: 'Handles user data submission asynchronously without full browser reloads.',
      syntaxRules: 'Always put the submit handler on <form onSubmit={handleSubmit}>, not on the button onClick. This supports keyboard Enter key submission naturally.',
      codeExample: `function LoginForm({ onLogin }) {\n  const [formData, setFormData] = useState({ email: '', password: '' });\n\n  const handleChange = (e) => {\n    const { name, value } = e.target;\n    setFormData(prev => ({ ...prev, [name]: value }));\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    onLogin(formData);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="email" value={formData.email} onChange={handleChange} />\n      <input name="password" type="password" value={formData.password} onChange={handleChange} />\n      <button type="submit">Log In</button>\n    </form>\n  );\n}`,
      lineByLine: [
        'Line 2: Stores form state in a unified object.',
        'Line 6: [name]: value dynamically updates the corresponding field.',
        'Line 10: e.preventDefault() prevents browser reload.',
        'Line 15: onSubmit on the <form> enables Enter key submission.'
      ],
      expectedBehavior: 'Submitting form collects all fields cleanly without page reload.',
      commonMistakes: ['Putting onClick on the submit button instead of onSubmit on <form>, breaking accessibility and Enter-key submissions.', 'Forgetting e.preventDefault(), causing page to refresh and lose state.'],
      practiceLevels: {
        levelA: 'Build a ContactForm with name, email, and message fields.',
        levelB: 'Add inline error messages that show when required fields are empty.',
        levelC: 'Disable the submit button and show a spinner while isSubmitting is true.'
      },
      debuggingChallenge: {
        brokenCode: `<form>\n  <input value={query} onChange={e => setQuery(e.target.value)} />\n  <button onClick={handleSearch}>Search</button>\n</form>`,
        problem: 'Clicking button or pressing Enter submits form without preventDefault, refreshing the browser page.',
        fix: 'Add onSubmit={(e) => { e.preventDefault(); handleSearch(); }} to <form>.'
      },
      conceptualQuestion: {
        question: 'Why should you attach submission handlers to <form onSubmit={...}> instead of <button onClick={...}>?',
        options: [
          'Because buttons cannot have click handlers in React.',
          'Attaching onSubmit to the form captures submissions from both button clicks and pressing the Enter key on any input, adhering to HTML accessibility standards.',
          'onSubmit is faster than onClick.',
          'Because React forms require WebSockets.'
        ],
        correctIndex: 1,
        explanation: 'The form\'s onSubmit event fires regardless of whether user clicks the submit button or presses Enter inside an input field.'
      },
      codeReadingQuestion: {
        snippet: `<button type="button">Cancel</button>`,
        question: 'Why is type="button" necessary here inside a form?',
        answer: 'Buttons inside a form default to type="submit". Specifying type="button" prevents accidental form submission.'
      },
      starterCode: `// Assignment: Implement validateFormPayload\n// Validates a signup form payload:\n// validateFormPayload(formData)\n// formData = { username: string, email: string, password: string }\n// Validation Rules:\n// 1. username must be at least 3 characters.\n// 2. email must contain '@' and '.'\n// 3. password must be at least 8 characters.\n// Return: { isValid: boolean, errors: { username?: string, email?: string, password?: string } }\n\nexport function validateFormPayload(formData) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Validates complete and correct form data',
          run: (fn) => {
            const res = fn({ username: 'ada_lovelace', email: 'ada@example.com', password: 'password123' });
            return res.isValid === true && Object.keys(res.errors).length === 0;
          }
        },
        {
          name: 'Identifies all failing field validations',
          run: (fn) => {
            const res = fn({ username: 'ad', email: 'invalid_email', password: '123' });
            return res.isValid === false && !!res.errors.username && !!res.errors.email && !!res.errors.password;
          }
        }
      ],
      hints: [
        'Check each rule independently and populate errors[field] if it fails.'
      ],
      checklist: [
        'Validated username length >= 3',
        'Validated email format contains @ and .',
        'Validated password length >= 8',
        'Computed isValid based on error count'
      ],
      revisionSummary: 'Use onSubmit with e.preventDefault() on <form> elements; manage multi-input state with computed property keys.'
    },
    {
      id: 'p1-l23',
      slug: 'component-extraction-file-organization',
      title: 'Component Extraction and File Organization',
      prerequisites: ['p1-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Recognize when a component is doing too much and needs extraction.', 'Organize files using Feature-First vs Layer-First folder architecture.', 'Maintain clean dependency graphs and avoid circular imports.'],
      explanation: 'As applications grow, keeping all markup in App.jsx leads to unmaintainable files. Extracting components follows the Single Responsibility Principle: if a section of JSX has its own state, repeats elsewhere, or exceeds ~100 lines, extract it into its own component file inside a structured folder hierarchy.',
      whyItExists: 'Enables teams to work simultaneously without merge conflicts, makes components easily testable, and clarifies component responsibilities.',
      syntaxRules: 'Place reusable primitives in /components/common (Button, Modal, Input). Place domain features in /features/<featureName> ({ components, hooks, api }).',
      codeExample: `// Enterprise Feature Folder Structure\n// src/\n//   features/\n//     tasks/\n//       components/\n//         TaskCard.jsx\n//         TaskList.jsx\n//       hooks/\n//         useTasks.js\n//       api/\n//         tasksApi.js\n//   components/common/\n//     Button.jsx\n//     Badge.jsx`,
      lineByLine: [
        'Line 4-7: Encapsulates all domain logic for "tasks" together.',
        'Line 11-13: Reusable domain-agnostic UI widgets live in common/.'
      ],
      expectedBehavior: 'High cohesion within features; low coupling across features.',
      commonMistakes: ['Premature extraction: breaking code into 20 tiny one-line files before understanding the abstraction.', 'Circular dependencies where ComponentA imports ComponentB which imports ComponentA.'],
      practiceLevels: {
        levelA: 'Extract an inline table row <tr> from a large table into a TaskRow component.',
        levelB: 'Reorganize a flat src/ directory into feature folders.',
        levelC: 'Configure path aliases in vite.config.js (@components, @features) for clean imports.'
      },
      debuggingChallenge: {
        brokenCode: `// Circular Import Bug\n// FileA: import { CompB } from './FileB'; export const CompA = ...\n// FileB: import { CompA } from './FileA'; export const CompB = ...`,
        problem: 'Circular dependency leads to undefined component bindings at bundle evaluation time.',
        fix: 'Extract shared utilities or types to a separate common file imported by both.'
      },
      conceptualQuestion: {
        question: 'What is the primary advantage of a Feature-First folder structure (e.g. src/features/cart) over a Layer-First structure (src/components, src/hooks)?',
        options: [
          'Vite only supports Feature-First structures.',
          'All code related to a single business capability (components, hooks, tests, API calls) is colocated, making it easy to find, modify, or delete features.',
          'Feature-First reduces JavaScript execution time in Node.js.',
          'Layer-First is deprecated in React 19.'
        ],
        correctIndex: 1,
        explanation: 'Colocating related code by feature provides high cohesion and prevents developers from jumping between 5 distant folders to edit one screen.'
      },
      codeReadingQuestion: {
        snippet: `// components/common/Button/index.js\n// export { Button } from './Button';`,
        question: 'What is this file pattern called and what is its purpose?',
        answer: 'Barrel file. It provides a clean public API for the component folder so callers can import from "../Button".'
      },
      starterCode: `// Assignment: Implement categorizeProjectFiles\n// Given a list of file paths: string[]\n// Categorize them into: { features: Record<string, string[]>, common: string[], root: string[] }\n// Example paths: 'src/features/auth/LoginForm.jsx', 'src/components/common/Button.jsx', 'src/App.jsx'\n\nexport function categorizeProjectFiles(files) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Categorizes feature and common files accurately',
          run: (fn) => {
            const files = [
              'src/features/auth/LoginForm.jsx',
              'src/features/auth/useAuth.js',
              'src/features/cart/CartDrawer.jsx',
              'src/components/common/Button.jsx',
              'src/App.jsx'
            ];
            const res = fn(files);
            return res.features.auth.length === 2 && res.features.cart.length === 1 && res.common.length === 1 && res.root.length === 1;
          }
        }
      ],
      hints: [
        'Inspect path strings using regex or split("/") to match features/<name>.'
      ],
      checklist: [
        'Extracted feature names from path',
        'Grouped common components',
        'Classified root files'
      ],
      revisionSummary: 'Extract components according to single responsibility; organize by feature to maintain high cohesion.'
    }
  ]
};
