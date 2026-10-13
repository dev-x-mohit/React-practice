// Phase 6: API Integration and Server State
export const phase6 = {
  id: 'phase-6',
  title: 'Phase 6 — API Integration and Server State',
  description: 'Master data fetching from raw fetch() utilities to enterprise TanStack Query (React Query): CRUD patterns, status codes, AbortController cancellation, debounced search, caching and stale-time invalidation, optimistic mutations, and connecting React to an Express & MongoDB backend.',
  icon: 'Database',
  badge: 'Server State & TanStack Query',
  estimatedHours: 14,
  lessons: [
    {
      id: 'p6-l1',
      slug: 'http-methods-and-status-codes',
      title: 'HTTP Methods and Status Codes in React',
      prerequisites: ['p0-l12'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Master RESTful HTTP methods (GET, POST, PUT, PATCH, DELETE).', 'Understand status code ranges: 2xx (Success), 3xx (Redirect), 4xx (Client Error), 5xx (Server Error).', 'Design predictable UI responses for each status code.'],
      explanation: 'React applications communicate with REST APIs by sending HTTP requests. Each method communicates intent: GET reads data, POST creates a resource, PUT replaces a resource, PATCH updates specific fields, and DELETE removes a resource. Status codes inform the UI what happened: 200/201 (render data), 400 (show validation error), 401 (redirect to login), 403 (show forbidden), 404 (show not found), 500 (show server error).',
      whyItExists: 'Aligns frontend data mutations with industry-standard REST API protocols.',
      syntaxRules: 'GET must never mutate server data. POST is for creation. Check response.status explicitly.',
      codeExample: `async function handleApiResponse(response) {\n  if (response.status === 204) return null; // No Content\n  if (response.status === 401) throw new Error('SESSION_EXPIRED');\n  if (response.status === 403) throw new Error('FORBIDDEN');\n  if (!response.ok) {\n    const errorBody = await response.json().catch(() => ({}));\n    throw new Error(errorBody.message || \`HTTP Error \${response.status}\`);\n  }\n  return response.json();\n}`,
      lineByLine: [
        'Line 2: 204 No Content has no body, so calling response.json() would crash.',
        'Line 3-4: Maps HTTP auth codes to domain errors for UI redirection.',
        'Line 5: response.ok is false for any status >= 400.'
      ],
      expectedBehavior: 'Standardized error extraction and clean handling of empty status codes.',
      commonMistakes: ['Calling response.json() on a 204 No Content response (causes JSON parse error).', 'Treating 404 as a network failure in fetch() (fetch resolves successfully on 404; you must check response.ok!).'],
      practiceLevels: {
        levelA: 'Map status code 201 to a toast notification "Created successfully".',
        levelB: 'Implement automatic redirect on 401 Unauthorized.',
        levelC: 'Build an HTTP response interceptor that formats error payloads.'
      },
      debuggingChallenge: {
        brokenCode: `fetch('/api/delete/1', { method: 'DELETE' })\n  .then(res => res.json()); // SyntaxError: Unexpected end of JSON input`,
        problem: 'Server returned 204 No Content with an empty body, which res.json() cannot parse.',
        fix: 'if (res.status === 204) return null; return res.json();'
      },
      conceptualQuestion: {
        question: 'Does `fetch("/api/unknown")` reject its Promise if the server responds with a 404 Not Found status code?',
        options: [
          'Yes, any 4xx or 5xx status causes the Promise to reject.',
          'No! `fetch` only rejects on catastrophic network failures or DNS errors. It resolves normally on 404 or 500; you must check `response.ok` or `response.status`.',
          'Only in production mode.',
          'Only in Safari.'
        ],
        correctIndex: 1,
        explanation: 'fetch only rejects on network failures. HTTP error status codes (404, 500) resolve normally with response.ok === false.'
      },
      codeReadingQuestion: {
        snippet: `// PUT vs PATCH:`,
        question: 'What is the semantic difference between PUT and PATCH in REST APIs?',
        answer: 'PUT replaces the entire resource; PATCH updates only specific specified fields.'
      },
      starterCode: `// Assignment: Implement parseHttpResponse\n// Build an HTTP response interpreter:\n// parseHttpResponse(mockResponse)\n// mockResponse = { status: number, ok: boolean, body: any }\n// Rules:\n// 1. status === 204 -> return { success: true, data: null }\n// 2. ok === true -> return { success: true, data: mockResponse.body }\n// 3. status === 401 -> return { success: false, action: 'REDIRECT_LOGIN', error: 'Unauthorized' }\n// 4. status === 403 -> return { success: false, action: 'FORBIDDEN', error: 'Forbidden' }\n// 5. otherwise -> return { success: false, action: 'SHOW_ALERT', error: \`HTTP \${status}\` }\n\nexport function parseHttpResponse(mockResponse) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Handles 204 No Content with null data',
          run: (fn) => {
            const res = fn({ status: 204, ok: true, body: null });
            return res.success === true && res.data === null;
          }
        },
        {
          name: 'Handles 401 with login redirect instruction',
          run: (fn) => {
            const res = fn({ status: 401, ok: false, body: 'Token expired' });
            return res.success === false && res.action === 'REDIRECT_LOGIN';
          }
        }
      ],
      hints: [
        'Check status 204 first, then ok === true, then 401, 403, and general errors.'
      ],
      checklist: [
        'Handled 204 No Content',
        'Handled 200/201 Success',
        'Mapped 401 and 403 status codes'
      ],
      revisionSummary: 'Always verify response.ok; fetch does not reject on 4xx or 5xx status codes.'
    },
    {
      id: 'p6-l2',
      slug: 'reusable-api-client-utility',
      title: 'Building a Reusable API Client Utility',
      prerequisites: ['p6-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Build a central apiClient wrapper around fetch.', 'Support baseUrl, auth token injection, and default JSON headers.', 'Standardize request/response error formatting across the application.'],
      explanation: 'Scattering raw fetch() calls with duplicated headers, JSON.stringify, and error handling across 20 components leads to maintenance headaches. A reusable API client (apiClient.get, apiClient.post) centralizes the base URL, automatically attaches JWT authentication tokens, sets headers, and formats responses consistently.',
      whyItExists: 'DRY network architecture, centralized auth headers, and uniform error logging.',
      syntaxRules: 'apiClient.get("/lessons"), apiClient.post("/lessons", payload). Never hardcode API host URLs inside components.',
      codeExample: `// src/services/apiClient.js\nconst BASE_URL = import.meta.env.VITE_API_URL || '/api';\n\nasync function request(endpoint, options = {}) {\n  const token = localStorage.getItem('token');\n  const headers = {\n    'Content-Type': 'application/json',\n    ...(token ? { Authorization: \`Bearer \${token}\` } : {}),\n    ...options.headers\n  };\n\n  const res = await fetch(\`\${BASE_URL}\${endpoint}\`, { ...options, headers });\n  if (!res.ok) {\n    const err = await res.json().catch(() => ({}));\n    throw new Error(err.message || \`Request failed: \${res.status}\`);\n  }\n  return res.status === 204 ? null : res.json();\n}\n\nexport const apiClient = {\n  get: (url) => request(url),\n  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),\n  delete: (url) => request(url, { method: 'DELETE' })\n};`,
      lineByLine: [
        'Line 2: Reads configurable base URL from Vite environment variables.',
        'Line 6: Injects Authorization Bearer token automatically if logged in.',
        'Line 19-21: Provides clean, typed helper methods for GET, POST, and DELETE.'
      ],
      expectedBehavior: 'Components make API calls in one clean line: await apiClient.get("/user").',
      commonMistakes: ['Hardcoding http://localhost:5000 in components (breaks when deploying to production!).', 'Forgetting JSON.stringify() in request body.'],
      practiceLevels: {
        levelA: 'Build an apiClient with GET and POST helpers.',
        levelB: 'Add an automatic token refresh interceptor on 401 response.',
        levelC: 'Configure environment-specific API URLs (.env.development, .env.production).'
      },
      debuggingChallenge: {
        brokenCode: `apiClient.post('/data', myObject);\n// Server receives: "[object Object]"`,
        problem: 'Body was not serialized to JSON.',
        fix: 'body: JSON.stringify(myObject) and headers: { "Content-Type": "application/json" }.'
      },
      conceptualQuestion: {
        question: 'Why should API calls be routed through a centralized `apiClient` service rather than calling raw `fetch()` directly inside React components?',
        options: [
          'Because React forbids fetch in components.',
          'Centralizing API calls avoids duplicating base URLs, authorization headers, and error handling, making future changes (like changing backend URLs or switching to Axios) effortless.',
          'apiClient speeds up JavaScript compilation.',
          'It is required for MongoDB.'
        ],
        correctIndex: 1,
        explanation: 'A central client encapsulates headers, base URLs, authentication, and error formatting in one maintainable file.'
      },
      codeReadingQuestion: {
        snippet: `import.meta.env.VITE_API_BASE_URL ?? '/api'`,
        question: 'What is this expression doing?',
        answer: 'Reading the API URL from environment variables, falling back safely to "/api" relative proxy.'
      },
      starterCode: `// Assignment: Implement buildApiClientRequest\n// Assemble the options object for an API request:\n// buildApiClientRequest(endpoint, method, body, token)\n// 1. URL: \`https://api.academy.com\${endpoint}\`\n// 2. headers: { 'Content-Type': 'application/json' }\n// 3. if token provided -> add 'Authorization': \`Bearer \${token}\`\n// 4. if body provided -> body: JSON.stringify(body)\n// Return: { url: string, options: RequestInit }\n\nexport function buildApiClientRequest(endpoint, method = 'GET', body = null, token = null) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Constructs POST request with serialized body and auth header',
          run: (fn) => {
            const res = fn('/tasks', 'POST', { title: 'New Task' }, 'jwt_token');
            return res.url === 'https://api.academy.com/tasks' && res.options.method === 'POST' && res.options.headers.Authorization === 'Bearer jwt_token' && res.options.body === JSON.stringify({ title: 'New Task' });
          }
        },
        {
          name: 'Constructs clean GET request without body',
          run: (fn) => {
            const res = fn('/users', 'GET');
            return res.url === 'https://api.academy.com/users' && res.options.method === 'GET' && res.options.body === undefined;
          }
        }
      ],
      hints: [
        'Set body: body ? JSON.stringify(body) : undefined.'
      ],
      checklist: [
        'Prepended base URL',
        'Injected Bearer authorization token',
        'Serialized JSON body',
        'Returned URL and options'
      ],
      revisionSummary: 'Centralize network requests in a reusable apiClient for consistent headers, auth tokens, and error handling.'
    },
    {
      id: 'p6-l3',
      slug: 'loading-success-empty-error-states',
      title: 'The 4 Essential UI States: Loading, Success, Empty, Error',
      prerequisites: ['p6-l2', 'p1-l12'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Design and render all 4 essential asynchronous states.', 'Avoid forgetting Empty states when data array is [].', 'Provide user recovery actions (Retry) on error.'],
      explanation: 'Every screen that loads data from a server must handle four distinct states: 1. Loading: Skeleton or spinner while waiting. 2. Success: Rendering the loaded records. 3. Empty: Friendly guidance when data is [] (e.g. "No lessons found. [Clear filters]"). 4. Error: Informative error message with a "Retry" button. Never forget the Empty state!',
      whyItExists: 'Prevents blank screens, confusing empty boxes, and dead-ends for users.',
      syntaxRules: 'Always handle states in order: 1. if (isLoading) ... 2. if (isError) ... 3. if (data.length === 0) ... 4. render data.',
      codeExample: `function LessonList({ isLoading, error, lessons, onRetry }) {\n  // 1. Loading State\n  if (isLoading) return <SkeletonLoader count={4} />;\n\n  // 2. Error State with Recovery Action\n  if (error) {\n    return (\n      <div className="error-card">\n        <p>Failed to load lessons: {error}</p>\n        <button onClick={onRetry}>Retry</button>\n      </div>\n    );\n  }\n\n  // 3. Empty State with Clear Call-to-Action\n  if (!lessons || lessons.length === 0) {\n    return (\n      <div className="empty-state">\n        <h3>No lessons found</h3>\n        <p>Try adjusting your search or filters.</p>\n      </div>\n    );\n  }\n\n  // 4. Success State\n  return <ul>{lessons.map(l => <li key={l.id}>{l.title}</li>)}</ul>;\n}`,
      lineByLine: [
        'Line 3: Loading skeleton prevents layout shift.',
        'Line 6-12: Error state provides actionable retry action, not just a red text block.',
        'Line 16-21: Empty state gives user helpful next steps rather than a blank box.',
        'Line 24: Success state renders clean list.'
      ],
      expectedBehavior: 'User experiences informative, polished feedback across all network scenarios.',
      commonMistakes: ['Forgetting Empty state: user sees a blank white square and thinks the app is broken.', 'Not providing a Retry button on network error.'],
      practiceLevels: {
        levelA: 'Build an EmptyState component with icon, title, description, and action button.',
        levelB: 'Implement Skeleton placeholder cards for loading state.',
        levelC: 'Test error recovery by toggling an error simulation.'
      },
      debuggingChallenge: {
        brokenCode: `function Items({ list }) {\n  return <div>{list.map(i => <div key={i}>{i}</div>)}</div>;\n  // When list is empty [], user sees an empty box with zero explanation!\n}`,
        problem: 'Missing Empty state handling.',
        fix: 'if (list.length === 0) return <EmptyState />;'
      },
      conceptualQuestion: {
        question: 'Why is the "Empty State" considered just as critical as the "Success State" in product development?',
        options: [
          'Because empty states consume less bandwidth.',
          'An empty screen without explanation makes users think the application is frozen, broken, or bugged; a clear empty state guides the user on how to add data or clear filters.',
          'Empty states are required by WCAG level AAA.',
          'It is a Vite rule.'
        ],
        correctIndex: 1,
        explanation: 'A thoughtful empty state reassures the user that the system is functioning and provides clear next steps.'
      },
      codeReadingQuestion: {
        snippet: `if (isLoading) return <Spinner />;\nif (error) return <ErrorView />;\nif (!items.length) return <EmptyView />;`,
        question: 'What pattern of conditional rendering is used here?',
        answer: 'Guard clauses / Early returns.'
      },
      starterCode: `// Assignment: Implement resolveAsyncUiView\n// Determine which view descriptor to render based on async state:\n// resolveAsyncUiView({ isLoading, error, items })\n// 1. isLoading === true -> 'VIEW_LOADING'\n// 2. error != null -> 'VIEW_ERROR'\n// 3. !items || items.length === 0 -> 'VIEW_EMPTY'\n// 4. Otherwise -> 'VIEW_SUCCESS'\n\nexport function resolveAsyncUiView({ isLoading, error, items }) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Prioritizes loading over empty/success',
          run: (fn) => {
            return fn({ isLoading: true, error: null, items: [] }) === 'VIEW_LOADING';
          }
        },
        {
          name: 'Returns empty view when items is empty array',
          run: (fn) => {
            return fn({ isLoading: false, error: null, items: [] }) === 'VIEW_EMPTY';
          }
        },
        {
          name: 'Returns success when items has records',
          run: (fn) => {
            return fn({ isLoading: false, error: null, items: ['Item 1'] }) === 'VIEW_SUCCESS';
          }
        }
      ],
      hints: [
        'Check conditions in order: isLoading, error, items length, success.'
      ],
      checklist: [
        'Checked loading condition first',
        'Checked error condition',
        'Checked empty items condition',
        'Handled success condition'
      ],
      revisionSummary: 'Every asynchronous screen must handle all 4 essential states: Loading, Error, Empty, and Success.'
    },
    {
      id: 'p6-l4',
      slug: 'async-error-handling-network-failures',
      title: 'Async Error Handling and Network Failures',
      prerequisites: ['p6-l1', 'p0-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Differentiate network offline errors from server HTTP 500 errors.', 'Safely extract error messages from unknown catch(err) variables.', 'Deliver actionable user error messages rather than raw tech jargon.'],
      explanation: 'In JavaScript, anything can be thrown in catch(err): an Error instance, a string, or an object. In TypeScript and modern JavaScript, err in catch is `unknown`. We must safely normalize errors: `err instanceof Error ? err.message : "An unexpected error occurred"`. Furthermore, translate technical errors ("Failed to fetch") into friendly user messages ("You appear to be offline").',
      whyItExists: 'Prevents cryptic stack traces from confusing end users and ensures robust exception resilience.',
      syntaxRules: 'Always normalize catch errors with instanceof Error before displaying to UI.',
      codeExample: `export function formatErrorMessage(err) {\n  if (err instanceof Error) {\n    if (err.message === 'Failed to fetch') {\n      return 'Network connection lost. Please check your internet connection.';\n    }\n    return err.message;\n  }\n  if (typeof err === 'string') return err;\n  return 'An unexpected error occurred. Please try again.';\n}`,
      lineByLine: [
        'Line 2: Checks if err is a genuine JavaScript Error instance.',
        'Line 3-4: Translates browser "Failed to fetch" (offline) into user-friendly guidance.',
        'Line 8: Fallback for unexpected non-error objects.'
      ],
      expectedBehavior: 'User receives clear, understandable guidance without confusing stack traces.',
      commonMistakes: ['Displaying raw TypeError or [object Object] on screen.', 'Swallowing errors silently with empty catch {} blocks.'],
      practiceLevels: {
        levelA: 'Build an error normalizer helper function.',
        levelB: 'Simulate offline mode in Chrome DevTools and verify friendly message.',
        levelC: 'Log detailed error stacks to an in-memory logger while showing clean text to user.'
      },
      debuggingChallenge: {
        brokenCode: `try { await fetch(); } catch (err) {\n  setError(err.data.message); // Crashes if err.data is undefined!\n}`,
        problem: 'Unsafe deep access on caught error object throws TypeError.',
        fix: 'setError(err?.data?.message || err?.message || "Operation failed");'
      },
      conceptualQuestion: {
        question: 'Why does a browser throw "Failed to fetch" instead of an HTTP status code?',
        options: [
          'Because the server returned a 404.',
          'Because the request never reached a server (e.g. offline, DNS failure, CORS blocked, or connection refused).',
          'Because the JSON was malformed.',
          'It is a Vite build warning.'
        ],
        correctIndex: 1,
        explanation: '"Failed to fetch" signifies a network-level abort or failure before any HTTP response was received from a server.'
      },
      codeReadingQuestion: {
        snippet: `catch (err) { console.error(err); throw err; }`,
        question: 'What does re-throwing `throw err` accomplish?',
        answer: 'It logs the error locally while allowing caller functions (or error boundaries) to catch and handle it.'
      },
      starterCode: `// Assignment: Implement normalizeNetworkError\n// Standardize unknown error objects into user-facing feedback:\n// normalizeNetworkError(rawError)\n// 1. If rawError instanceof Error:\n//    a. message === 'Failed to fetch' -> { type: 'OFFLINE', message: 'You appear to be offline' }\n//    b. message.startsWith('HTTP 401') -> { type: 'AUTH', message: 'Session expired' }\n//    c. otherwise -> { type: 'ERROR', message: rawError.message }\n// 2. If rawError is string -> { type: 'ERROR', message: rawError }\n// 3. Otherwise -> { type: 'UNKNOWN', message: 'An unexpected error occurred' }\n\nexport function normalizeNetworkError(rawError) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Normalizes Failed to fetch into OFFLINE guidance',
          run: (fn) => {
            const res = fn(new Error('Failed to fetch'));
            return res.type === 'OFFLINE' && res.message === 'You appear to be offline';
          }
        },
        {
          name: 'Normalizes unknown objects safely',
          run: (fn) => {
            const res = fn({ weird: 'object' });
            return res.type === 'UNKNOWN' && res.message.includes('unexpected');
          }
        }
      ],
      hints: [
        'Use rawError instanceof Error check and compare rawError.message.'
      ],
      checklist: [
        'Handled Error instance checks',
        'Mapped offline and auth messages',
        'Provided safe fallback for unknown objects'
      ],
      revisionSummary: 'Safely normalize unknown errors; translate low-level browser network errors into friendly user messages.'
    },
    {
      id: 'p6-l5',
      slug: 'abortcontroller-and-cancellation',
      title: 'AbortController and Request Cancellation',
      prerequisites: ['p3-l4', 'p3-l7'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Cancel pending HTTP requests using the native AbortController API.', 'Connect controller.signal to fetch() calls.', 'Ignore AbortError exceptions in catch blocks.'],
      explanation: 'When a user navigates away from a page or types rapidly in a search box, previous in-flight HTTP requests waste bandwidth and server CPU. The standard Web API `AbortController` lets you cancel pending fetch requests. When `controller.abort()` is called, the browser aborts the request and throws an `AbortError`, which should be ignored in catch blocks.',
      whyItExists: 'Saves mobile bandwidth, reduces server load, and eliminates race conditions.',
      syntaxRules: 'const controller = new AbortController(); fetch(url, { signal: controller.signal }); return () => controller.abort();',
      codeExample: `useEffect(() => {\n  const controller = new AbortController();\n\n  async function loadData() {\n    try {\n      const res = await fetch(\`/api/items?q=\${query}\`, { signal: controller.signal });\n      const data = await res.json();\n      setItems(data);\n    } catch (err) {\n      // CRUCIAL: Do NOT treat AbortError as a real failure!\n      if (err.name !== 'AbortError') {\n        setError(err.message);\n      }\n    }\n  }\n\n  loadData();\n  // Aborts in-flight request when query changes or component unmounts!\n  return () => controller.abort();\n}, [query]);`,
      lineByLine: [
        'Line 2: Creates an AbortController instance.',
        'Line 6: signal links the request to the controller.',
        'Line 10: Checks err.name !== "AbortError" so cancelled requests do not show error alerts.',
        'Line 17: Cleanup aborts the previous request as soon as query changes.'
      ],
      expectedBehavior: 'Browser cancels the previous network request immediately when a new one begins.',
      commonMistakes: ['Treating AbortError as a real error and showing an error banner to the user.', 'Reusing the same AbortController after it has already aborted.'],
      practiceLevels: {
        levelA: 'Inspect canceled requests in Chrome DevTools Network tab.',
        levelB: 'Implement an explicit "Cancel Download" button using AbortController.',
        levelC: 'Build a reusable useFetchWithAbort custom hook.'
      },
      debuggingChallenge: {
        brokenCode: `catch (err) {\n  setError(err.message); // Flashes "The user aborted a request" whenever typing fast!\n}`,
        problem: 'AbortError is caught and displayed as an error to the user.',
        fix: 'if (err.name === "AbortError") return; setError(err.message);'
      },
      conceptualQuestion: {
        question: 'Why should you check `if (err.name === "AbortError")` in your fetch catch block?',
        options: [
          'Because AbortError crashes the browser.',
          'An AbortError is intentional cancellation (e.g. user navigated away or changed search query); it is not an error and should not display an error message to the user.',
          'AbortError means the server is down.',
          'It is required by TypeScript.'
        ],
        correctIndex: 1,
        explanation: 'AbortError is triggered deliberately when cancelling stale requests; ignoring it prevents false error alerts.'
      },
      codeReadingQuestion: {
        snippet: `const controller = new AbortController();\ncontroller.abort('User navigated away');`,
        question: 'Can an aborted controller be reused for a new fetch call?',
        answer: 'No. Once aborted, controller.signal remains permanently aborted; create a new AbortController for subsequent requests.'
      },
      starterCode: `// Assignment: Implement filterFetchExceptions\n// Process catch block exceptions:\n// filterFetchExceptions(error)\n// 1. If error.name === 'AbortError' -> return { shouldDisplayToUser: false, isCancellation: true }\n// 2. Otherwise -> return { shouldDisplayToUser: true, isCancellation: false, message: error.message || 'Request failed' }\n\nexport function filterFetchExceptions(error) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Silences AbortError from user display',
          run: (fn) => {
            const abortErr = new Error('The user aborted a request.');
            abortErr.name = 'AbortError';
            const res = fn(abortErr);
            return res.shouldDisplayToUser === false && res.isCancellation === true;
          }
        },
        {
          name: 'Displays real server errors to user',
          run: (fn) => {
            const serverErr = new Error('Internal Server Error 500');
            const res = fn(serverErr);
            return res.shouldDisplayToUser === true && res.isCancellation === false && res.message.includes('500');
          }
        }
      ],
      hints: [
        'Check error?.name === "AbortError".'
      ],
      checklist: [
        'Identified AbortError',
        'Flagged shouldDisplayToUser: false for cancellations',
        'Flagged shouldDisplayToUser: true for real failures'
      ],
      revisionSummary: 'AbortController cancels in-flight fetch requests; always filter out AbortError in catch blocks.'
    },
    {
      id: 'p6-l6',
      slug: 'preventing-stale-response-bugs',
      title: 'Preventing Stale Response Bugs',
      prerequisites: ['p6-l5', 'p3-l7'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify async out-of-order response bugs in interactive apps.', 'Compare cleanup flags vs AbortController for race condition mitigation.', 'Guarantee that active UI always matches the current selection.'],
      explanation: 'Imagine clicking "User A" (takes 1000ms to load), then immediately clicking "User B" (takes 200ms to load). User B\'s data loads and appears on screen. 800ms later, User A\'s slow response arrives and overwrites User B\'s data! The UI now displays User A even though User B is highlighted. Preventing stale responses is essential for all search inputs and master-detail views.',
      whyItExists: 'Guarantees UI consistency in high-frequency interactive applications.',
      syntaxRules: 'Use either AbortController or a boolean ignore flag in the effect cleanup.',
      codeExample: `// Stale response resolution via request ID sequence\nfunction useSequentialFetch() {\n  const latestRequestId = useRef(0);\n\n  const fetchSafe = async (url, onData) => {\n    const requestId = ++latestRequestId.current;\n    const res = await fetch(url);\n    const data = await res.json();\n\n    // Only update if this is STILL the most recent request!\n    if (requestId === latestRequestId.current) {\n      onData(data);\n    }\n  };\n\n  return { fetchSafe };\n}`,
      lineByLine: [
        'Line 2: latestRequestId tracks an incrementing sequence number across renders.',
        'Line 5: Each request captures its own unique requestId.',
        'Line 10: Compares captured requestId with the latest. If a newer request was dispatched, the old response is discarded!'
      ],
      expectedBehavior: 'Slow older responses are silently discarded when a newer response has already been requested.',
      commonMistakes: ['Assuming network responses always return in the exact order they were sent.', 'Writing search inputs without race-condition protection.'],
      practiceLevels: {
        levelA: 'Simulate randomized latency and observe stale response bugs without protection.',
        levelB: 'Implement request ID sequence matching.',
        levelC: 'Verify that switching tabs rapidly never displays stale data.'
      },
      debuggingChallenge: {
        brokenCode: `// User reports: "Sometimes when I search 'apple' then 'banana', results for 'apple' appear after 'banana'!"`,
        problem: 'Out-of-order network response arrival without sequence checking or cancellation.',
        fix: 'Use AbortController or request ID sequencing in the search effect.'
      },
      conceptualQuestion: {
        question: 'Why does asynchronous network latency cause "stale response" bugs in search inputs?',
        options: [
          'Because JavaScript runs in reverse.',
          'HTTP requests are asynchronous and variable; a query with a large payload or heavy DB query can arrive AFTER a subsequent smaller query, overwriting newer state with old data.',
          'Because the browser cache is disabled.',
          'It only happens on Windows.'
        ],
        correctIndex: 1,
        explanation: 'Network latency varies by payload and server load; requests do not resolve in the order they were dispatched.'
      },
      codeReadingQuestion: {
        snippet: `if (currentId !== latestId.current) return;`,
        question: 'What is this guard statement doing?',
        answer: 'Discarding a completed asynchronous response because a newer request was dispatched in the meantime.'
      },
      starterCode: `// Assignment: Implement filterStaleResponses\n// Given a chronological sequence of request completions with timestamps:\n// filterStaleResponses(completions)\n// completions: [{ requestId: number, dispatchIndex: number, data: string }]\n// Track the highest dispatchIndex seen so far. If a completion arrives with dispatchIndex < highestSeen, discard it as STALE!\n// Return array of accepted data strings: string[]\n\nexport function filterStaleResponses(completions) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Discards out-of-order responses whose dispatch was superseded',
          run: (fn) => {
            const list = [
              { requestId: 2, dispatchIndex: 2, data: 'Result 2' }, // Dispatched second, arrived first
              { requestId: 1, dispatchIndex: 1, data: 'Result 1' }, // Dispatched first, arrived second (STALE!)
              { requestId: 3, dispatchIndex: 3, data: 'Result 3' }  // Dispatched third, arrived third
            ];
            const accepted = fn(list);
            return accepted.length === 2 && accepted[0] === 'Result 2' && accepted[1] === 'Result 3';
          }
        }
      ],
      hints: [
        'Maintain let highestDispatch = -1; iterate over completions; if item.dispatchIndex >= highestDispatch, accept it and update highestDispatch.'
      ],
      checklist: [
        'Tracked highest dispatch index',
        'Discarded stale superseded responses',
        'Returned accepted data list'
      ],
      revisionSummary: 'Discard older responses using sequence IDs or AbortController to prevent race condition bugs.'
    },
    {
      id: 'p6-l7',
      slug: 'crud-operations-in-react',
      title: 'Full CRUD Operations: Create, Read, Update, Delete',
      prerequisites: ['p6-l2', 'p1-l19'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: ['Implement full CRUD workflows against a REST backend.', 'Synchronize server state with local UI state after mutations.', 'Handle confirmation dialogs and optimistic list updates.'],
      explanation: 'CRUD (Create, Read, Update, Delete) is the backbone of full-stack engineering. In React: Read uses GET. Create uses POST and appends the new record. Update uses PUT/PATCH and updates the matching record in state. Delete uses DELETE and filters out the removed record. Senior engineers update local state immutably upon successful server response.',
      whyItExists: 'Essential foundation for any full-stack MERN application.',
      syntaxRules: 'POST: headers Content-Type: application/json, body: JSON.stringify(data). DELETE: no body, check 204 or 200.',
      codeExample: `function TaskManager() {\n  const [tasks, setTasks] = useState([]);\n\n  // CREATE\n  const addTask = async (title) => {\n    const newTask = await apiClient.post('/tasks', { title });\n    setTasks(prev => [...prev, newTask]); // Append immutably\n  };\n\n  // UPDATE\n  const toggleTask = async (id, completed) => {\n    const updated = await apiClient.patch(\`/tasks/\${id}\`, { completed });\n    setTasks(prev => prev.map(t => t.id === id ? updated : t));\n  };\n\n  // DELETE\n  const deleteTask = async (id) => {\n    await apiClient.delete(\`/tasks/\${id}\`);\n    setTasks(prev => prev.filter(t => t.id !== id)); // Remove immutably\n  };\n}`,
      lineByLine: [
        'Line 6: Sends POST request, awaits new database record with generated ID, and appends to state.',
        'Line 12: Sends PATCH request and replaces matching item in local state array.',
        'Line 18: Sends DELETE request and filters out removed item from state array.'
      ],
      expectedBehavior: 'Server database and client UI stay perfectly synchronized across all CRUD operations.',
      commonMistakes: ['Appending item to client state before server confirms creation (without optimistic rollback).', 'Mutating state array directly on delete.'],
      practiceLevels: {
        levelA: 'Implement a Delete button with window.confirm() confirmation.',
        levelB: 'Build an inline editable task title with PATCH request.',
        levelC: 'Build full CRUD Task Manager connected to a mock REST server.'
      },
      debuggingChallenge: {
        brokenCode: `const deleteTask = async (id) => {\n  await api.delete('/item/' + id);\n  tasks.splice(tasks.findIndex(t => t.id === id), 1); // Mutation!\n  setTasks(tasks);\n};`,
        problem: 'Direct mutation of tasks array; React bails out of re-rendering.',
        fix: 'setTasks(prev => prev.filter(t => t.id !== id));'
      },
      conceptualQuestion: {
        question: 'Which HTTP method is most appropriate for toggling a single `isCompleted` boolean property on an existing task in a REST API?',
        options: ['GET', 'POST', 'PATCH', 'OPTIONS'],
        correctIndex: 2,
        explanation: 'PATCH is specifically designed for partial updates to a resource (updating one or more fields without replacing the whole object).'
      },
      codeReadingQuestion: {
        snippet: `setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));`,
        question: 'What operation does this line perform immutably?',
        answer: 'Updates the matching item in state with new properties while preserving all other items.'
      },
      starterCode: `// Assignment: Implement crudStateReducer\n// Manage local state across CRUD server events:\n// crudStateReducer(currentList, serverEvent)\n// currentList: [{ id: number, text: string }]\n// Events:\n// 1. { type: 'CREATED', payload: { id, text } } -> append payload\n// 2. { type: 'UPDATED', payload: { id, text } } -> replace matching item\n// 3. { type: 'DELETED', id: number } -> remove matching item\n// Return new array without mutating input.\n\nexport function crudStateReducer(currentList, serverEvent) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Appends created record and removes deleted record immutably',
          run: (fn) => {
            const l0 = [{ id: 1, text: 'First' }];
            const l1 = fn(l0, { type: 'CREATED', payload: { id: 2, text: 'Second' } });
            const l2 = fn(l1, { type: 'DELETED', id: 1 });
            return l1.length === 2 && l2.length === 1 && l2[0].id === 2 && l0.length === 1;
          }
        },
        {
          name: 'Updates existing record cleanly',
          run: (fn) => {
            const l0 = [{ id: 1, text: 'Old Text' }];
            const l1 = fn(l0, { type: 'UPDATED', payload: { id: 1, text: 'New Text' } });
            return l1[0].text === 'New Text';
          }
        }
      ],
      hints: [
        'Use switch(serverEvent.type) with spread, map, and filter.'
      ],
      checklist: [
        'Handled CREATED event',
        'Handled UPDATED event',
        'Handled DELETED event',
        'Preserved array immutability'
      ],
      revisionSummary: 'Full CRUD workflows update database resources via HTTP methods and update local state arrays immutably.'
    },
    {
      id: 'p6-l8',
      slug: 'pagination-and-infinite-scrolling',
      title: 'Pagination and Infinite Scrolling Patterns',
      prerequisites: ['p6-l7', 'p5-l12'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Implement offset/page-based pagination (Page 1, 2, 3).', 'Implement Infinite Scrolling using the native IntersectionObserver API.', 'Avoid duplicate items and manage hasMore termination flags.'],
      explanation: 'When querying 50,000 database records, backends paginate results to save memory and bandwidth. Frontends handle pagination in two primary patterns: 1. Numbered Page Pagination: user clicks "Previous / Next / Page 4", replacing items. 2. Infinite Scrolling: when user scrolls near the bottom of the list, an IntersectionObserver detects a sentinel element and fetches the next page, appending items to the existing list.',
      whyItExists: 'Enables smooth browsing of massive datasets without browser memory overload.',
      syntaxRules: 'Pagination replaces items: setTasks(newItems). Infinite scroll appends items: setTasks(prev => [...prev, ...newItems]). Check hasMore before fetching.',
      codeExample: `function InfiniteFeed() {\n  const [items, setItems] = useState([]);\n  const [page, setPage] = useState(1);\n  const [hasMore, setHasMore] = useState(true);\n  const sentinelRef = useRef(null);\n\n  useEffect(() => {\n    if (!hasMore) return;\n    const observer = new IntersectionObserver(([entry]) => {\n      if (entry.isIntersecting) {\n        setPage(p => p + 1); // Trigger next page fetch!\n      }\n    });\n    if (sentinelRef.current) observer.observe(sentinelRef.current);\n    return () => observer.disconnect();\n  }, [hasMore]);\n\n  return (\n    <div>\n      {items.map(i => <div key={i.id}>{i.title}</div>)}\n      {hasMore && <div ref={sentinelRef} className="loading-sentinel">Loading more...</div>}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 9: IntersectionObserver watches the sentinel <div> at the bottom of the list.',
        'Line 10: When sentinel scrolls into viewport, setPage(p => p + 1) fires.',
        'Line 13: Cleanup disconnects observer between renders to prevent duplicate triggers.'
      ],
      expectedBehavior: 'New items append smoothly as user scrolls down the page.',
      commonMistakes: ['Appending duplicate items when requests overlap (deduplicate by item.id).', 'Not disconnecting IntersectionObserver on cleanup, leaking listeners.'],
      practiceLevels: {
        levelA: 'Build standard Prev / Next numbered pagination.',
        levelB: 'Implement Infinite Scrolling with IntersectionObserver.',
        levelC: 'Add a "Back to Top" floating button that appears after scrolling 500px.'
      },
      debuggingChallenge: {
        brokenCode: `// User scrolls fast: duplicates appear in list: Item 1, Item 2, Item 1, Item 2!`,
        problem: 'Multiple fetch requests fired concurrently without a loading guard, appending the same page twice.',
        fix: 'Add if (isLoading || !hasMore) return; guard before fetching.'
      },
      conceptualQuestion: {
        question: 'Why is `IntersectionObserver` preferred over `window.addEventListener("scroll", handleScroll)` for implementing infinite scrolling?',
        options: [
          'Because scroll events are deprecated.',
          '`scroll` events fire dozens of times per second on the main thread causing jank and layout thrashing, whereas `IntersectionObserver` is optimized by the browser to run asynchronously off the main thread only when visibility changes.',
          'IntersectionObserver works without HTML.',
          'It is required by MongoDB.'
        ],
        correctIndex: 1,
        explanation: 'IntersectionObserver runs asynchronously with zero main-thread scroll jank or performance overhead.'
      },
      codeReadingQuestion: {
        snippet: `setItems(prev => {\n  const ids = new Set(prev.map(i => i.id));\n  return [...prev, ...newItems.filter(i => !ids.has(i.id))];\n});`,
        question: 'What critical bug does this deduplication logic prevent?',
        answer: 'Duplicate key warnings and duplicate list items caused by overlapping network responses.'
      },
      starterCode: `// Assignment: Implement deduplicateAppendedItems\n// Safely append new page items to an existing list without duplicates:\n// appendUniqueItems(existingItems, newItems)\n// Items: [{ id: number, title: string }]\n// Return: new array containing existingItems + any item from newItems whose ID was NOT already present in existingItems.\n\nexport function appendUniqueItems(existingItems, newItems) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Appends new unique items and discards duplicates',
          run: (fn) => {
            const existing = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
            const incoming = [{ id: 2, title: 'B' }, { id: 3, title: 'C' }];
            const res = fn(existing, incoming);
            return res.length === 3 && res[2].id === 3;
          }
        }
      ],
      hints: [
        'Create a Set of existing IDs: const seen = new Set(existingItems.map(i => i.id)); filter incoming for !seen.has(i.id).'
      ],
      checklist: [
        'Preserved existing items',
        'Deduplicated incoming items by ID',
        'Returned clean merged array'
      ],
      revisionSummary: 'Infinite scrolling uses IntersectionObserver to detect bottom sentinels; always deduplicate incoming items by ID.'
    },
    {
      id: 'p6-l9',
      slug: 'search-with-debouncing',
      title: 'Search with Debouncing: Reducing Server Load',
      prerequisites: ['p0-l3', 'p3-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Implement debouncing to delay API requests until user stops typing.', 'Differentiate debouncing (delay after inactivity) from throttling (rate-limiting).', 'Build a reusable useDebounce hook.'],
      explanation: 'If a user types "JavaScript" in a search input (10 keystrokes), without debouncing, the app sends 10 separate API requests in 2 seconds! This overloads the backend database and causes race conditions. Debouncing delays the API call until the user has PAUSED typing for a specified delay (e.g. 300ms).',
      whyItExists: 'Reduces backend search server load by 90% and prevents UI flickering.',
      syntaxRules: 'Clear previous setTimeout timer on every keystroke: clearTimeout(timerId); timerId = setTimeout(run, 300).',
      codeExample: `// Custom Hook: useDebounce\nfunction useDebounce(value, delayMs = 300) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    // Set timer to update debounced value after delay\n    const timer = setTimeout(() => setDebouncedValue(value), delayMs);\n\n    // Cleanup: Cancel timer if value changes before delay expires!\n    return () => clearTimeout(timer);\n  }, [value, delayMs]);\n\n  return debouncedValue;\n}\n\n// Usage in search:\nfunction SearchPage() {\n  const [query, setQuery] = useState('');\n  const debouncedQuery = useDebounce(query, 300);\n\n  // Effect runs ONLY when user pauses typing for 300ms!\n  useEffect(() => {\n    if (debouncedQuery) apiSearch(debouncedQuery);\n  }, [debouncedQuery]);\n}`,
      lineByLine: [
        'Line 6: setTimeout schedules the debounced value update.',
        'Line 9: clearTimeout cancels the timer if user types another letter within 300ms.',
        'Line 19: API search only triggers when debouncedQuery finally updates.'
      ],
      expectedBehavior: 'API fires exactly once after user finishes typing.',
      commonMistakes: ['Debouncing the input value itself (makes typing laggy and feel broken; debounce the API call, not the input display!).', 'Forgetting clearTimeout in cleanup.'],
      practiceLevels: {
        levelA: 'Implement useDebounce custom hook.',
        levelB: 'Inspect Network tab to verify 1 request fired instead of 10.',
        levelC: 'Add an instant "Clear Search" button that immediately aborts pending debounced queries.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev debounces input onChange: input value only updates 300ms after user stops typing!`,
        problem: 'User cannot see what they are typing because input value is debounced.',
        fix: 'Keep input value immediate; debounce the search query used for the API call.'
      },
      conceptualQuestion: {
        question: 'What is the functional difference between Debouncing and Throttling?',
        options: [
          'Debounce works with strings; throttle works with numbers.',
          'Debouncing waits until a burst of events stops for N milliseconds before executing once; Throttling guarantees execution at most once every N milliseconds regardless of activity.',
          'Throttling is deprecated.',
          'There is no difference.'
        ],
        correctIndex: 1,
        explanation: 'Debouncing waits for silence/inactivity (search inputs); throttling rate-limits continuous streams (scroll/resize events).'
      },
      codeReadingQuestion: {
        snippet: `useEffect(() => { const t = setTimeout(fn, 300); return () => clearTimeout(t); }, [q]);`,
        question: 'What happens if [q] updates 5 times in 200ms?',
        answer: 'The first 4 timers are cleared by the cleanup function; only the 5th timer executes 300ms after the last keystroke.'
      },
      starterCode: `// Assignment: Implement simulateDebounceEngine\n// Simulate debounce timer execution:\n// simulateDebounce(keystrokes, delayMs)\n// keystrokes: array of events with timestamps: [{ time: number, char: string }]\n// Output array of API queries dispatched: { time: number, query: string }[]\n// A query is dispatched at: lastKeystroke.time + delayMs IF no subsequent keystroke occurred within delayMs.\n\nexport function simulateDebounce(keystrokes, delayMs = 300) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Dispatches single query after typing burst finishes',
          run: (fn) => {
            const keys = [
              { time: 0, char: 'r' },
              { time: 50, char: 're' },
              { time: 100, char: 'rea' },
              { time: 150, char: 'react' }
            ];
            const res = fn(keys, 300);
            return res.length === 1 && res[0].query === 'react' && res[0].time === 450;
          }
        }
      ],
      hints: [
        'Iterate through keystrokes; if next keystroke time - current time < delayMs, timer is cancelled.'
      ],
      checklist: [
        'Cancelled intermediate timers',
        'Dispatched query for final keystroke',
        'Calculated correct execution timestamp'
      ],
      revisionSummary: 'Debounce search queries to wait for user typing pauses, slashing server load by 90%.'
    },
    {
      id: 'p6-l10',
      slug: 'retry-and-timeout-strategies',
      title: 'Retry and Timeout Strategies for Resilient Networking',
      prerequisites: ['p6-l4', 'p6-l5'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Implement exponential backoff retry algorithms for transient 503/network errors.', 'Enforce request timeouts using AbortSignal.timeout().', 'Avoid retrying non-retryable 4xx client errors (400, 401, 403, 404).'],
      explanation: 'Mobile networks drop packets and microservices experience transient 503 hiccups. Resilient React applications do not immediately give up on the first failure. By implementing automatic retries with Exponential Backoff (waiting 1s, then 2s, then 4s), temporary glitches resolve automatically. Never retry 4xx errors (e.g. 404 Not Found will never magically succeed).',
      whyItExists: 'Turns transient network hiccups into seamless, self-healing user experiences.',
      syntaxRules: 'Retry only 5xx server errors and network drops. Use AbortSignal.timeout(5000) for hard timeouts.',
      codeExample: `// Fetch with Exponential Backoff Retry\nasync function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {\n  try {\n    // Enforce 5-second timeout on every attempt\n    const signal = AbortSignal.timeout(5000);\n    const res = await fetch(url, { ...options, signal });\n\n    // Do NOT retry 4xx client errors (bad request, not found, forbidden)\n    if (!res.ok && res.status < 500) {\n      throw new Error(\`Client error \${res.status}\`);\n    }\n    if (!res.ok) throw new Error(\`Server error \${res.status}\`);\n    return await res.json();\n  } catch (err) {\n    if (retries <= 1 || err.message.includes('Client error')) throw err;\n    // Wait exponential delay (1s -> 2s -> 4s)\n    await new Promise(r => setTimeout(r, delay));\n    return fetchWithRetry(url, options, retries - 1, delay * 2);\n  }\n}`,
      lineByLine: [
        'Line 5: AbortSignal.timeout(5000) automatically cancels requests that hang longer than 5 seconds.',
        'Line 9: 4xx errors are thrown immediately without retrying.',
        'Line 17: Recursively retries with double delay on transient 5xx/network failures.'
      ],
      expectedBehavior: 'Temporary network dropouts recover automatically without user intervention.',
      commonMistakes: ['Retrying 401 or 404 errors (wastes battery and spamming server with impossible requests).', 'Retrying without delay (DDOSing your own backend during an outage).'],
      practiceLevels: {
        levelA: 'Add a 5-second timeout to fetch using AbortSignal.timeout(5000).',
        levelB: 'Implement exponential backoff retry helper.',
        levelC: 'Observe TanStack Query default 3-attempt exponential retry policy.'
      },
      debuggingChallenge: {
        brokenCode: `// Client error 404 is retried 10 times in a loop, freezing UI and flooding server logs!`,
        problem: 'Failing to check if status code is transient before retrying.',
        fix: 'Only retry if status >= 500 or err.name === "TypeError" (network drop).'
      },
      conceptualQuestion: {
        question: 'Why is "Exponential Backoff" (delaying 1s, 2s, 4s) used during retries instead of immediate retries?',
        options: [
          'Because JavaScript limits function calls to once per second.',
          'To avoid overwhelming a struggling backend server with an avalanche of instant retries (the "Thundering Herd" problem), giving the server time to recover.',
          'To save RAM memory.',
          'It is required by Vite.'
        ],
        correctIndex: 1,
        explanation: 'Backoff spacing prevents client retry storms from overwhelming restarting or overloaded servers.'
      },
      codeReadingQuestion: {
        snippet: `const signal = AbortSignal.timeout(3000);`,
        question: 'What does AbortSignal.timeout(3000) do?',
        answer: 'It returns an AbortSignal that automatically triggers abort after 3000 milliseconds (3 seconds).'
      },
      starterCode: `// Assignment: Implement calculateBackoffDelay\n// Compute exponential backoff delay with jitter cap:\n// calculateBackoffDelay(attemptNumber, baseDelayMs, maxDelayMs)\n// Formula: delay = Math.min(baseDelayMs * Math.pow(2, attemptNumber - 1), maxDelayMs)\n// Example: attempt 1: 1000 * 2^0 = 1000; attempt 2: 2000; attempt 3: 4000; max capped.\n\nexport function calculateBackoffDelay(attemptNumber, baseDelayMs = 1000, maxDelayMs = 10000) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Calculates exponential backoff progression',
          run: (fn) => {
            const a1 = fn(1, 1000, 10000);
            const a2 = fn(2, 1000, 10000);
            const a3 = fn(3, 1000, 10000);
            return a1 === 1000 && a2 === 2000 && a3 === 4000;
          }
        },
        {
          name: 'Caps delay at maxDelayMs',
          run: (fn) => {
            const a10 = fn(10, 1000, 8000);
            return a10 === 8000;
          }
        }
      ],
      hints: [
        'Use Math.min(baseDelayMs * Math.pow(2, attemptNumber - 1), maxDelayMs).'
      ],
      checklist: [
        'Calculated powers of 2 progression',
        'Enforced maxDelayMs ceiling'
      ],
      revisionSummary: 'Resilient applications use request timeouts and exponential backoff retries for transient 5xx errors.'
    },
    {
      id: 'p6-l11',
      slug: 'authentication-headers-bearer-tokens',
      title: 'Authentication Headers and Bearer Tokens',
      prerequisites: ['p6-l2', 'p0-l12'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Attach JWT Bearer tokens to HTTP Authorization headers.', 'Understand token expiration and 401 handling.', 'Implement silent token refresh patterns.'],
      explanation: 'Modern full-stack MERN apps authenticate API requests using JSON Web Tokens (JWT). When a user logs in, the Express backend returns a signed token. The React frontend sends this token on every subsequent request in the HTTP Authorization header: `Authorization: Bearer <token>`. When the token expires, the server responds with 401 Unauthorized, prompting the frontend to refresh the token or log out.',
      whyItExists: 'Enforces stateless, cryptographically secure authentication between React and Express.',
      syntaxRules: 'Format: headers: { "Authorization": `Bearer ${token}` }. Never put tokens in URL parameters.',
      codeExample: `// Token Injection in Fetch Request\nasync function fetchProtectedProfile() {\n  const token = localStorage.getItem('accessToken');\n  if (!token) throw new Error('No token found');\n\n  const res = await fetch('/api/user/profile', {\n    headers: {\n      'Authorization': \`Bearer \${token}\`,\n      'Content-Type': 'application/json'\n    }\n  });\n\n  if (res.status === 401) {\n    // Token expired or invalid: clear storage and redirect\n    localStorage.removeItem('accessToken');\n    window.location.href = '/login';\n    throw new Error('Session expired');\n  }\n  return res.json();\n}`,
      lineByLine: [
        'Line 2: Retrieves the saved JWT from storage.',
        'Line 7: Injects the standard Bearer token header.',
        'Line 12: Handles 401 token expiration by clearing credentials and redirecting.'
      ],
      expectedBehavior: 'Backend verifies signature and returns private user data.',
      commonMistakes: ['Missing the space between "Bearer" and the token: "Bearer" + token becomes "Bearertoken" and fails.', 'Failing to handle 401 token expiry.'],
      practiceLevels: {
        levelA: 'Format an Authorization header with Bearer prefix.',
        levelB: 'Implement 401 response interceptor clearing auth state.',
        levelC: 'Build dual-token refresh pattern (Access Token in memory + Refresh Token in HTTP-only cookie).'
      },
      debuggingChallenge: {
        brokenCode: `headers: { 'Authorization': token } // Backend rejects with 401 Invalid Token Format!`,
        problem: 'Missing the mandatory "Bearer " scheme prefix.',
        fix: 'headers: { "Authorization": `Bearer ${token}` }'
      },
      conceptualQuestion: {
        question: 'What is the standard HTTP header name and format used to transmit JWT authentication tokens?',
        options: [
          'Token: <jwt>',
          'Authorization: Bearer <jwt>',
          'Authenticate: Key <jwt>',
          'Security: JWT <jwt>'
        ],
        correctIndex: 1,
        explanation: 'RFC 6750 standardizes `Authorization: Bearer <token>` for transmitting OAuth and JWT bearer credentials.'
      },
      codeReadingQuestion: {
        snippet: `const authHeader = req.headers.authorization;\nconst token = authHeader && authHeader.split(' ')[1];`,
        question: 'What does this Express backend code extract?',
        answer: 'It splits "Bearer <token>" by space and extracts the token string at index 1.'
      },
      starterCode: `// Assignment: Implement attachAuthHeader\n// Inject bearer token into existing headers object:\n// attachAuthHeader(existingHeaders, token)\n// 1. If token is provided and non-empty -> add 'Authorization': \`Bearer \${token}\`\n// 2. If token is null, undefined, or empty -> do NOT include Authorization header\n// Return new headers object without mutating existingHeaders.\n\nexport function attachAuthHeader(existingHeaders = {}, token = null) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Injects Bearer token into headers',
          run: (fn) => {
            const h = fn({ 'Content-Type': 'application/json' }, 'jwt_xyz');
            return h.Authorization === 'Bearer jwt_xyz' && h['Content-Type'] === 'application/json';
          }
        },
        {
          name: 'Omits Authorization when token is null or empty',
          run: (fn) => {
            const h = fn({ 'Content-Type': 'application/json' }, null);
            return h.Authorization === undefined;
          }
        }
      ],
      hints: [
        'Use spread: return { ...existingHeaders, ...(token ? { Authorization: `Bearer ${token}` } : {}) }.'
      ],
      checklist: [
        'Formatted Bearer scheme',
        'Preserved existing headers',
        'Omitted header when token absent'
      ],
      revisionSummary: 'Authenticate API requests using Authorization: Bearer <token> headers; handle 401 expiration gracefully.'
    },
    {
      id: 'p6-l12',
      slug: 'cookies-and-credentials-handling',
      title: 'Cookies and Credential Handling: credentials: "include"',
      prerequisites: ['p6-l11'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand HTTP-only cookies vs localStorage for JWT security.', 'Enable credentials in cross-origin fetch requests using credentials: "include".', 'Configure CORS credentials on Express backends.'],
      explanation: 'Storing JWTs in localStorage leaves them vulnerable to Cross-Site Scripting (XSS) attacks. Security-conscious production apps store session tokens in HTTP-only cookies (which JavaScript cannot read). By default, browsers DO NOT send cookies with cross-origin fetch() requests! You must explicitly specify `credentials: "include"` on client fetch and `Access-Control-Allow-Credentials: true` on the Express backend.',
      whyItExists: 'Enables secure session cookies that resist XSS token theft.',
      syntaxRules: 'fetch(url, { credentials: "include" }). Express must NOT use wildcard origin "*" when credentials are included.',
      codeExample: `// Client-side fetch with credentials enabled\nasync function fetchSession() {\n  const res = await fetch('https://api.myapp.com/auth/me', {\n    credentials: 'include' // Sends HTTP-only session cookies with request!\n  });\n  return res.json();\n}\n\n// Backend Express CORS config:\n// app.use(cors({\n//   origin: 'https://myapp.com', // Must be explicit origin, NOT '*'!\n//   credentials: true\n// }));`,
      lineByLine: [
        'Line 4: credentials: "include" instructs browser to attach HTTP-only cookies even for cross-origin requests.',
        'Backend must return Access-Control-Allow-Credentials: true and specify exact frontend origin.'
      ],
      expectedBehavior: 'Browser automatically attaches session cookies with zero client-side token handling.',
      commonMistakes: ['Using origin: "*" on backend when credentials: true is set (browsers reject wildcard CORS with credentials!).', 'Wondering why fetch doesn\'t send cookies across domains without credentials: "include".'],
      practiceLevels: {
        levelA: 'Configure fetch with credentials: "include".',
        levelB: 'Inspect cookie headers in Chrome DevTools Application tab.',
        levelC: 'Configure Express cors middleware with credentials: true and explicit origin.'
      },
      debuggingChallenge: {
        brokenCode: `// CORS Error: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.`,
        problem: 'Backend CORS config has origin: "*", which is forbidden with credentials.',
        fix: 'Set specific origin: origin: "https://frontend-app.com" on the backend.'
      },
      conceptualQuestion: {
        question: 'Why are HTTP-only cookies considered more secure than localStorage for storing authentication tokens?',
        options: [
          'Cookies have larger storage capacity.',
          'HTTP-only cookies cannot be read or stolen by malicious client-side JavaScript (XSS attacks), whereas any script injected on the page can read localStorage.',
          'Cookies are faster than memory.',
          'Cookies never expire.'
        ],
        correctIndex: 1,
        explanation: 'HTTP-only cookies are inaccessible to document.cookie in JavaScript, preventing XSS scripts from stealing session tokens.'
      },
      codeReadingQuestion: {
        snippet: `fetch(url, { credentials: 'same-origin' }); // default`,
        question: 'Will this default request send cookies to a different domain backend (e.g. api.domain.com)?',
        answer: 'No! "same-origin" only sends cookies to the exact same origin; cross-origin requires credentials: "include".'
      },
      starterCode: `// Assignment: Implement configureCorsOptions\n// Validate CORS and credentials configuration:\n// validateCorsConfig(origin, credentialsAllowed)\n// Rules:\n// If credentialsAllowed is true AND origin === '*' -> return { isValid: false, error: 'Cannot use wildcard origin when credentials are true' }\n// If credentialsAllowed is true AND origin !== '*' -> return { isValid: true, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true' } }\n// If credentialsAllowed is false -> return { isValid: true, headers: { 'Access-Control-Allow-Origin': origin } }\n\nexport function validateCorsConfig(origin, credentialsAllowed) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Rejects wildcard origin with credentials allowed',
          run: (fn) => {
            const res = fn('*', true);
            return res.isValid === false && res.error.includes('wildcard');
          }
        },
        {
          name: 'Generates valid headers for explicit origin with credentials',
          run: (fn) => {
            const res = fn('https://app.com', true);
            return res.isValid === true && res.headers['Access-Control-Allow-Credentials'] === 'true' && res.headers['Access-Control-Allow-Origin'] === 'https://app.com';
          }
        }
      ],
      hints: [
        'Check credentialsAllowed && origin === "*".'
      ],
      checklist: [
        'Blocked wildcard origin with credentials',
        'Configured explicit origin headers',
        'Enabled credentials header'
      ],
      revisionSummary: 'HTTP-only cookies resist XSS; cross-origin cookie sharing requires credentials: "include" and explicit backend CORS origins.'
    },
    {
      id: 'p6-l13',
      slug: 'tanstack-query-queries-querykeys',
      title: 'TanStack Query: Queries and Query Keys',
      prerequisites: ['p6-l2', 'p3-l2'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand TanStack Query (React Query) as a specialized Server-State manager.', 'Use the useQuery hook with queryKey and queryFn.', 'Structure hierarchical query keys (["lessons", phaseId, lessonId]) for targeted caching.'],
      explanation: 'Managing server data with useState + useEffect requires 30 lines of boilerplate per component (loading, error, data, race conditions, cleanup, refetching). TanStack Query replaces all of this with `useQuery`. A `queryKey` is an array uniquely identifying the data in the cache. Whenever a component requests data with that queryKey, TanStack Query provides instant cached data while refetching in the background.',
      whyItExists: 'Automates caching, background refetching, deduplication, and loading/error states in 3 lines of code.',
      syntaxRules: 'const { data, isLoading, isError, error } = useQuery({ queryKey: ["todos", id], queryFn: () => fetchTodo(id) }).',
      codeExample: `import { useQuery } from '@tanstack/react-query';\nimport { apiClient } from '../services/apiClient';\n\nfunction LessonDetail({ lessonId }) {\n  // 3 lines replace 30 lines of useEffect boilerplate!\n  const { data: lesson, isLoading, error } = useQuery({\n    queryKey: ['lessons', lessonId], // Hierarchical query key\n    queryFn: () => apiClient.get(\`/lessons/\${lessonId}\`),\n    staleTime: 1000 * 60 * 5 // Cache fresh for 5 minutes\n  });\n\n  if (isLoading) return <Spinner />;\n  if (error) return <ErrorBanner message={error.message} />;\n  return <h1>{lesson.title}</h1>;\n}`,
      lineByLine: [
        'Line 6: useQuery hook automates the entire async lifecycle.',
        'Line 7: queryKey: ["lessons", lessonId] ensures Lesson 1 and Lesson 2 are cached separately.',
        'Line 8: queryFn is the promise-returning fetch function.',
        'Line 9: staleTime: 5 mins serves cached data instantly without re-fetching.'
      ],
      expectedBehavior: 'Instant page transitions using cached data with automatic background synchronization.',
      commonMistakes: ['Using a string queryKey instead of an array in v5 (queryKey must be an array: ["items"]).', 'Not including dynamic variables inside the queryKey (e.g. using queryKey: ["lesson"] instead of ["lesson", id]).'],
      practiceLevels: {
        levelA: 'Fetch a list of lessons using useQuery.',
        levelB: 'Structure hierarchical query keys for a filterable product catalog.',
        levelC: 'Inspect cache states using the TanStack Query Devtools.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev changes selectedId from 1 to 2, but component continues showing data for 1!`,
        problem: 'queryKey was written as queryKey: ["item"] omitting the dynamic ID.',
        fix: 'queryKey: ["item", selectedId]'
      },
      conceptualQuestion: {
        question: 'What is the purpose of the `queryKey` array in TanStack Query?',
        options: [
          'It is a database primary key.',
          'It is a unique serialization key used by TanStack Query to identify, cache, deduplicate, and invalidate specific server data.',
          'It is used for CSS styling.',
          'It is an encryption password.'
        ],
        correctIndex: 1,
        explanation: 'The queryKey uniquely identifies data in the cache; when dependencies in the key change, TanStack Query refetches automatically.'
      },
      codeReadingQuestion: {
        snippet: `const { data, isPending } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });`,
        question: 'What is `isPending` in TanStack Query v5?',
        answer: 'isPending is true when there is no cached data yet and the first query attempt is actively in flight.'
      },
      starterCode: `// Assignment: Implement serializeQueryKey\n// TanStack Query serializes queryKey arrays into cache strings:\n// serializeQueryKey(keyArray)\n// Example: ['lessons', { phase: 'p1', sort: 'asc' }]\n// Return a deterministic JSON string representing the cache key:\n// Objects inside the key must have their keys sorted alphabetically for determinism!\n\nexport function serializeQueryKey(keyArray) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Produces deterministic cache key regardless of object key order',
          run: (fn) => {
            const k1 = fn(['lessons', { sort: 'asc', phase: 'p1' }]);
            const k2 = fn(['lessons', { phase: 'p1', sort: 'asc' }]);
            return k1 === k2 && k1.includes('lessons');
          }
        }
      ],
      hints: [
        'Sort object keys before stringifying: JSON.stringify(keyArray, (k, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v).sort().reduce((o, k) => { o[k] = v[k]; return o; }, {}) : v).'
      ],
      checklist: [
        'Handled primitive keys in array',
        'Sorted object keys for deterministic serialization',
        'Produced identical hash for reordered keys'
      ],
      revisionSummary: 'TanStack Query replaces useEffect fetching; queryKey uniquely caches and refetches data automatically.'
    },
    {
      id: 'p6-l14',
      slug: 'caching-stale-time-cache-invalidation',
      title: 'Caching, Stale Data, and Cache Invalidation',
      prerequisites: ['p6-l13'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Master the difference between staleTime and gcTime (cacheTime).', 'Understand the "Stale-While-Revalidate" caching strategy.', 'Invalidate specific query caches using queryClient.invalidateQueries().'],
      explanation: 'TanStack Query uses the "Stale-While-Revalidate" caching strategy: it serves cached data instantly (0ms UI delay), then refetches in the background if the data is considered "stale". `staleTime` is how long data is considered fresh (default 0ms). `gcTime` (garbage collection time) is how long inactive data stays in memory (default 5 minutes). When data changes on the server, call `queryClient.invalidateQueries({ queryKey: ["todos"] })` to force an immediate refresh.',
      whyItExists: 'Delivers instantaneous page transitions while keeping data synchronized with the backend.',
      syntaxRules: 'queryClient.invalidateQueries({ queryKey: ["resource"] }) marks cached data as stale and refetches active queries.',
      codeExample: `import { useQueryClient } from '@tanstack/react-query';\n\nfunction AddLessonForm() {\n  const queryClient = useQueryClient();\n\n  const handleSave = async (newLesson) => {\n    await apiClient.post('/lessons', newLesson);\n    // INVALIDATE CACHE: Tells TanStack Query that "lessons" data is now stale!\n    // Any component on screen displaying lessons will automatically re-fetch in background!\n    queryClient.invalidateQueries({ queryKey: ['lessons'] });\n  };\n}`,
      lineByLine: [
        'Line 4: useQueryClient gives access to the global query cache.',
        'Line 7: Posts new record to the server.',
        'Line 10: invalidateQueries triggers background refetch for all matching queries on screen.'
      ],
      expectedBehavior: 'Existing lists update automatically with the newly added item.',
      commonMistakes: ['Confusing staleTime (freshness) with gcTime (garbage collection retention).', 'Setting staleTime to Infinity and forgetting to invalidate on mutation.'],
      practiceLevels: {
        levelA: 'Configure staleTime: 60000 (1 minute) on a user profile query.',
        levelB: 'Invalidate a query after a successful delete action.',
        levelC: 'Prefix-match invalidation: invalidateQueries({ queryKey: ["todos"] }) invalidates ["todos", 1] and ["todos", 2].'
      },
      debuggingChallenge: {
        brokenCode: `// Dev adds a task, but the task list still shows old data until manual page refresh!`,
        problem: 'Forgot to invalidate the tasks query key after the POST mutation.',
        fix: 'queryClient.invalidateQueries({ queryKey: ["tasks"] });'
      },
      conceptualQuestion: {
        question: 'What is the difference between `staleTime` and `gcTime` in TanStack Query?',
        options: [
          'staleTime is for numbers; gcTime is for strings.',
          '`staleTime` dictates how long data is considered fresh before a background refetch is needed; `gcTime` dictates how long unused/unmounted data stays in memory before being garbage collected.',
          'They are identical.',
          'gcTime is deprecated.'
        ],
        correctIndex: 1,
        explanation: 'staleTime controls when data refetches; gcTime controls when inactive cache entries are evicted from memory.'
      },
      codeReadingQuestion: {
        snippet: `queryClient.invalidateQueries({ queryKey: ['posts'] });`,
        question: 'Will this invalidate a query with key `["posts", 42, "comments"]`?',
        answer: 'Yes! TanStack Query matches query keys partially from the beginning (prefix matching).'
      },
      starterCode: `// Assignment: Implement isCacheStale\n// Evaluate if a cache entry is fresh, stale, or expired:\n// evaluateCacheEntry({ fetchedAt, staleTimeMs, gcTimeMs, currentTime })\n// 1. If currentTime - fetchedAt > gcTimeMs -> return 'GARBAGE_COLLECTED'\n// 2. If currentTime - fetchedAt > staleTimeMs -> return 'STALE_NEEDS_REFETCH'\n// 3. Otherwise -> return 'FRESH'\n\nexport function evaluateCacheEntry({ fetchedAt, staleTimeMs, gcTimeMs, currentTime }) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Categorizes fresh, stale, and expired cache entries',
          run: (fn) => {
            const fresh = fn({ fetchedAt: 1000, staleTimeMs: 5000, gcTimeMs: 20000, currentTime: 2000 });
            const stale = fn({ fetchedAt: 1000, staleTimeMs: 5000, gcTimeMs: 20000, currentTime: 8000 });
            const expired = fn({ fetchedAt: 1000, staleTimeMs: 5000, gcTimeMs: 20000, currentTime: 25000 });
            return fresh === 'FRESH' && stale === 'STALE_NEEDS_REFETCH' && expired === 'GARBAGE_COLLECTED';
          }
        }
      ],
      hints: [
        'Calculate age = currentTime - fetchedAt and compare against gcTimeMs then staleTimeMs.'
      ],
      checklist: [
        'Identified fresh cache status',
        'Identified stale status needing refetch',
        'Identified garbage collected status'
      ],
      revisionSummary: 'staleTime dictates when data refetches; invalidateQueries forces cache synchronization after mutations.'
    },
    {
      id: 'p6-l15',
      slug: 'mutations-and-optimistic-updates',
      title: 'Mutations and Optimistic Updates with TanStack Query',
      prerequisites: ['p6-l14'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: ['Perform server data mutations using the useMutation hook.', 'Implement optimistic updates with onMutate, onError, and onSettled.', 'Roll back cache automatically if a mutation fails.'],
      explanation: 'useQuery is for reading data; `useMutation` is for creating, updating, or deleting data. Optimistic updates update the local UI cache IMMEDIATELY before the network request returns. In TanStack Query: `onMutate` cancels active queries, snapshots previous data, and updates cache optimistically. If the server fails, `onError` rolls back using the snapshot. `onSettled` invalidates the query to sync with real server state.',
      whyItExists: 'Delivers zero-latency, snappy UI responses for likes, toggles, and deletes.',
      syntaxRules: 'useMutation({ mutationFn, onMutate, onError, onSettled }). Always return { previousData } from onMutate for rollback.',
      codeExample: `const queryClient = useQueryClient();\n\nconst mutation = useMutation({\n  mutationFn: (newTodo) => apiClient.post('/todos', newTodo),\n  // 1. When mutation starts: update cache optimistically\n  onMutate: async (newTodo) => {\n    await queryClient.cancelQueries({ queryKey: ['todos'] });\n    const previousTodos = queryClient.getQueryData(['todos']);\n\n    // Optimistically update cache with temporary ID\n    queryClient.setQueryData(['todos'], (old) => [...old, { ...newTodo, id: Date.now() }]);\n    return { previousTodos }; // Return context for rollback\n  },\n  // 2. If mutation fails: rollback!\n  onError: (err, newTodo, context) => {\n    queryClient.setQueryData(['todos'], context.previousTodos);\n  },\n  // 3. Always refetch on finish to ensure sync with server\n  onSettled: () => {\n    queryClient.invalidateQueries({ queryKey: ['todos'] });\n  }\n});`,
      lineByLine: [
        'Line 7: cancelQueries stops in-flight queries from overwriting our optimistic update.',
        'Line 8: Snapshots current cache data in case we need to roll back.',
        'Line 11: Injects optimistic item into cache immediately.',
        'Line 15: Restores previousTodos if the server returns an error.'
      ],
      expectedBehavior: 'Item appears instantly; rolls back seamlessly if offline or network error.',
      commonMistakes: ['Forgetting to return { previousData } from onMutate (leaves onError with no data to roll back to).', 'Not cancelling queries in onMutate, leading to race condition overwrites.'],
      practiceLevels: {
        levelA: 'Execute a POST request with useMutation.',
        levelB: 'Implement optimistic checkbox toggle with rollback.',
        levelC: 'Test error rollback by throwing a mock 500 error.'
      },
      debuggingChallenge: {
        brokenCode: `onError: (err, variables, context) => {\n  // context is undefined!\n}`,
        problem: 'Forgot to return context object from onMutate.',
        fix: 'onMutate must return an object: return { previousData };'
      },
      conceptualQuestion: {
        question: 'Why must `queryClient.cancelQueries()` be called at the start of `onMutate` during an optimistic update?',
        options: [
          'To clear the browser history.',
          'To prevent any in-flight background refetches from completing and overwriting our optimistic state with older server data.',
          'To delete the database records.',
          'It is a required syntax rule.'
        ],
        correctIndex: 1,
        explanation: 'Cancelling in-flight queries prevents older network responses from overwriting the optimistic UI before our mutation finishes.'
      },
      codeReadingQuestion: {
        snippet: `mutation.mutate({ title: 'New Task' });`,
        question: 'What is the function called to trigger a mutation execution?',
        answer: '`mutate()` or `mutateAsync()`.'
      },
      starterCode: `// Assignment: Implement simulateOptimisticLifecycle\n// Simulate the 3 phases of an optimistic mutation:\n// runOptimisticMutation(currentCache, optimisticItem, serverPromise)\n// 1. onMutate: snapshot = currentCache, optimisticCache = [...currentCache, optimisticItem]\n// 2. Await serverPromise\n// 3. If serverPromise succeeds -> return { finalCache: [...currentCache, serverResult], rolledBack: false }\n// 4. If serverPromise fails -> return { finalCache: snapshot, rolledBack: true, error: err.message }\n\nexport async function runOptimisticMutation(currentCache, optimisticItem, serverPromise) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Commits server result on success',
          run: async (fn) => {
            const cache = [{ id: 1, name: 'Task 1' }];
            const optimistic = { id: 'temp', name: 'Task 2' };
            const server = async () => ({ id: 2, name: 'Task 2' });
            const res = await fn(cache, optimistic, server());
            return res.rolledBack === false && res.finalCache.length === 2 && res.finalCache[1].id === 2;
          }
        },
        {
          name: 'Rolls back to snapshot on server error',
          run: async (fn) => {
            const cache = [{ id: 1, name: 'Task 1' }];
            const optimistic = { id: 'temp', name: 'Task 2' };
            const failingServer = Promise.reject(new Error('Server 500'));
            const res = await fn(cache, optimistic, failingServer);
            return res.rolledBack === true && res.finalCache.length === 1 && res.finalCache[0].id === 1;
          }
        }
      ],
      hints: [
        'Store snapshot = currentCache; use try/catch around await serverPromise.'
      ],
      checklist: [
        'Recorded snapshot before mutation',
        'Committed server response on success',
        'Rolled back to snapshot on error'
      ],
      revisionSummary: 'useMutation with onMutate, onError, and onSettled delivers instantaneous optimistic UI with automated rollback.'
    },
    {
      id: 'p6-l16',
      slug: 'dependent-queries-parallel-requests',
      title: 'Dependent Queries and Parallel Requests',
      prerequisites: ['p6-l13'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Execute parallel queries with multiple useQuery calls or useQueries.', 'Chain dependent queries using the `enabled` option.', 'Prevent queries from running until required prerequisite data is loaded.'],
      explanation: 'Some queries depend on data from an earlier query—for example, you cannot fetch a user\'s projects until you have loaded the user\'s organization ID: `user.orgId`. TanStack Query provides the `enabled` boolean option: `enabled: Boolean(user?.orgId)`. As long as `enabled` is false, TanStack Query will NOT run the query, preventing null pointer crashes.',
      whyItExists: 'Enables clean serial query pipelines without nested useEffect pyramids.',
      syntaxRules: 'enabled: Boolean(dependency) prevents the query from firing until the dependency is available.',
      codeExample: `function UserProjects({ username }) {\n  // 1. First query: fetch user by username\n  const { data: user } = useQuery({\n    queryKey: ['user', username],\n    queryFn: () => apiClient.get(\`/users/\${username}\`)\n  });\n\n  // 2. Dependent query: only runs once user?.id is available!\n  const { data: projects, isLoading: isProjectsLoading } = useQuery({\n    queryKey: ['projects', user?.id],\n    queryFn: () => apiClient.get(\`/users/\${user.id}/projects\`),\n    enabled: Boolean(user?.id) // WAITS for user to load!\n  });\n\n  return <div>{/* Render user and projects */}</div>;\n}`,
      lineByLine: [
        'Line 4: First query loads user profile.',
        'Line 13: enabled: Boolean(user?.id) pauses the second query until user.id is resolved.',
        'Prevents firing requests with undefined IDs.'
      ],
      expectedBehavior: 'Second query fires automatically as soon as the first query completes.',
      commonMistakes: ['Omitting enabled option, causing fetch to fire with /api/projects/undefined.', 'Nesting useQuery inside a Promise.then() callback (violates hook rules!).'],
      practiceLevels: {
        levelA: 'Chain a user profile query with an avatar details query.',
        levelB: 'Run 3 independent queries in parallel on a dashboard.',
        levelC: 'Use the useQueries hook to fetch an array of dynamic IDs concurrently.'
      },
      debuggingChallenge: {
        brokenCode: `const { data: user } = useQuery(...);\n// Crash: /api/teams/undefined (404 Not Found)`,
        problem: 'Second query ran immediately on mount before user data loaded.',
        fix: 'Add enabled: Boolean(user?.teamId) to the second query.'
      },
      conceptualQuestion: {
        question: 'What is the role of the `enabled` option in TanStack Query?',
        options: [
          'It enables CSS styles.',
          'It controls whether the query automatically executes; when `enabled: false`, the query stays in idle status and will not fire until the condition becomes true.',
          'It enables dark mode.',
          'It is used only in testing.'
        ],
        correctIndex: 1,
        explanation: 'The enabled option pauses queries until required parameters or prerequisites are ready.'
      },
      codeReadingQuestion: {
        snippet: `const results = useQueries({ queries: ids.map(id => ({ queryKey: ['item', id], queryFn: () => fetchItem(id) })) });`,
        question: 'What hook is used here to run variable numbers of queries in parallel?',
        answer: '`useQueries()`, allowing dynamic array mapping of queries without violating hook rules.'
      },
      starterCode: `// Assignment: Implement evaluateQueryEnabled\n// Check if dependent query should execute:\n// shouldQueryRun(prerequisiteData, isManualToggleOn)\n// Rules:\n// 1. If !isManualToggleOn -> false\n// 2. If prerequisiteData is null, undefined, or empty string -> false\n// 3. Otherwise -> true\n\nexport function shouldQueryRun(prerequisiteData, isManualToggleOn = true) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Enables query only when prerequisite exists and toggle is on',
          run: (fn) => {
            const ok = fn('org_123', true);
            const missingData = fn(null, true);
            const toggleOff = fn('org_123', false);
            return ok === true && missingData === false && toggleOff === false;
          }
        }
      ],
      hints: [
        'Return Boolean(isManualToggleOn && prerequisiteData).'
      ],
      checklist: [
        'Validated prerequisite existence',
        'Checked manual toggle',
        'Returned execution boolean'
      ],
      revisionSummary: 'Use the enabled: Boolean(id) option to chain dependent queries safely without undefined parameters.'
    },
    {
      id: 'p6-l17',
      slug: 'background-refetching-window-focus',
      title: 'Background Refetching on Window Focus & Network Reconnect',
      prerequisites: ['p6-l14'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand automatic refetchOnWindowFocus and refetchOnReconnect.', 'Keep multi-tab client state synchronized with server data automatically.', 'Configure refetch intervals for real-time polling.'],
      explanation: 'TanStack Query keeps data fresh through intelligent event listeners. By default: 1. `refetchOnWindowFocus`: when a user tabs away and returns to your app, it checks if data is stale and silently refreshes it. 2. `refetchOnReconnect`: when internet connection is restored, queries revalidate automatically. 3. `refetchInterval`: poll the server every N milliseconds for pseudo-real-time feeds.',
      whyItExists: 'Ensures users always see up-to-date data without manual page refreshes.',
      syntaxRules: 'refetchOnWindowFocus: true (default). Use refetchInterval: 5000 for polling dashboard metrics.',
      codeExample: `// Real-Time Polling Metric Query\nfunction LiveServerHealth() {\n  const { data: health } = useQuery({\n    queryKey: ['server-health'],\n    queryFn: () => apiClient.get('/health'),\n    refetchInterval: 5000, // Poll every 5 seconds\n    refetchOnWindowFocus: true // Refetch immediately when tab gains focus\n  });\n\n  return <div>Server Status: {health?.status ?? 'Checking...'}</div>;\n}`,
      lineByLine: [
        'Line 6: refetchInterval: 5000 automatically polls the endpoint every 5 seconds.',
        'Line 7: Refetches immediately when user clicks back into the browser tab.'
      ],
      expectedBehavior: 'Data updates automatically in the background with zero user action.',
      commonMistakes: ['Disabling refetchOnWindowFocus everywhere blindly (it is one of TanStack Query\'s best features!).', 'Setting refetchInterval on heavy queries without pagination, overloading the server.'],
      practiceLevels: {
        levelA: 'Verify window focus refetching by switching browser tabs.',
        levelB: 'Implement live notification polling with refetchInterval.',
        levelC: 'Configure queryClient defaultOptions to customize focus behavior globally.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev asks: "Why does my API get called every time I click back onto the browser tab?"`,
        problem: 'TanStack Query defaults refetchOnWindowFocus to true and staleTime to 0.',
        fix: 'Increase staleTime (e.g. staleTime: 60000) if data does not change frequently.'
      },
      conceptualQuestion: {
        question: 'Why does TanStack Query refetch data when the user refocuses the browser window by default?',
        options: [
          'Because the browser deletes all memory on tab switch.',
          'To ensure the user is viewing the latest data, in case records were updated by other users or background jobs while they were looking at another tab.',
          'To restart the React application.',
          'It is a Chrome bug.'
        ],
        correctIndex: 1,
        explanation: 'Window focus refetching keeps multi-tab and multi-user environments synchronized automatically.'
      },
      codeReadingQuestion: {
        snippet: `refetchInterval: (query) => query.state.data?.isProcessing ? 1000 : false,`,
        question: 'What dynamic polling strategy is implemented here?',
        answer: 'Conditional polling: polls every 1 second while a job is processing, and stops polling once complete.'
      },
      starterCode: `// Assignment: Implement dynamicPollingCalculator\n// Determine polling interval based on job status:\n// calculatePollingInterval(jobStatus)\n// 1. 'IN_PROGRESS' | 'QUEUED' -> return 2000 (poll every 2s)\n// 2. 'COMPLETED' | 'FAILED' -> return false (stop polling)\n// 3. Any other -> return false\n\nexport function calculatePollingInterval(jobStatus) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Polls while job is active',
          run: (fn) => {
            return fn('IN_PROGRESS') === 2000 && fn('QUEUED') === 2000;
          }
        },
        {
          name: 'Stops polling when job completes or fails',
          run: (fn) => {
            return fn('COMPLETED') === false && fn('FAILED') === false;
          }
        }
      ],
      hints: [
        'Check if jobStatus is IN_PROGRESS or QUEUED, return 2000, else false.'
      ],
      checklist: [
        'Enabled polling for active statuses',
        'Disabled polling for terminal statuses'
      ],
      revisionSummary: 'TanStack Query auto-refetches on window focus and reconnect; use refetchInterval for live polling.'
    },
    {
      id: 'p6-l18',
      slug: 'error-recovery-and-user-feedback',
      title: 'Error Recovery, Mutation Errors, and User Feedback',
      prerequisites: ['p6-l15', 'p6-l4'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Display toast notifications and inline feedback for mutation errors.', 'Expose retry handlers on failed mutations (mutation.mutate(variables)).', 'Differentiate network errors from business validation errors.'],
      explanation: 'When a mutation fails (e.g. creating a lesson, deleting a record), the user must receive clear, actionable feedback. TanStack Query exposes `mutation.isError`, `mutation.error`, and `mutation.reset()`. Pair this with a notification toast system to notify the user and provide a "Try Again" recovery action.',
      whyItExists: 'Empowers users to recover from errors without losing their typed inputs or context.',
      syntaxRules: 'Use mutation.mutate() with retry buttons. Reset error state with mutation.reset().',
      codeExample: `function CreatePostButton({ postData }) {\n  const mutation = useMutation({\n    mutationFn: (data) => apiClient.post('/posts', data),\n    onError: (err) => showToast(\`Failed: \${err.message}\`, 'error'),\n    onSuccess: () => showToast('Post created!', 'success')\n  });\n\n  return (\n    <div>\n      <button onClick={() => mutation.mutate(postData)} disabled={mutation.isPending}>\n        {mutation.isPending ? 'Publishing...' : 'Publish'}\n      </button>\n      {mutation.isError && (\n        <div className="error-toast">\n          <span>{mutation.error.message}</span>\n          <button onClick={() => mutation.mutate(postData)}>Retry</button>\n          <button onClick={mutation.reset}>Dismiss</button>\n        </div>\n      )}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4-5: onError and onSuccess show user-friendly toast feedback.',
        'Line 15: Inline recovery actions give the user immediate power to Retry or Dismiss.'
      ],
      expectedBehavior: 'Errors display non-intrusively with instant retry and dismiss controls.',
      commonMistakes: ['Displaying raw unformatted database errors (e.g. MongoServerError: E11000 duplicate key error).', 'Locking the UI so the user cannot retry after a failed mutation.'],
      practiceLevels: {
        levelA: 'Add a dismiss button calling mutation.reset().',
        levelB: 'Display toast alerts on mutation success and failure.',
        levelC: 'Build an auto-expiring notification queue.'
      },
      debuggingChallenge: {
        brokenCode: `// Mutation failed. User fixes input and clicks Publish, but old error message remains stuck on screen!`,
        problem: 'Did not reset mutation state before re-triggering.',
        fix: 'TanStack Query resets error state automatically on mutate(), or call mutation.reset().'
      },
      conceptualQuestion: {
        question: 'What does `mutation.reset()` do in TanStack Query?',
        options: [
          'Deletes database records.',
          'Resets the mutation back to its initial idle state, clearing any previous error or data.',
          'Reloads the browser window.',
          'Clears all local storage.'
        ],
        correctIndex: 1,
        explanation: 'mutation.reset() clears error and data states, returning the mutation to its clean initial idle status.'
      },
      codeReadingQuestion: {
        snippet: `mutation.mutate(data, { onSuccess: () => closeDialog() });`,
        question: 'Can callbacks like onSuccess be passed to individual `mutate()` calls in addition to `useMutation`?',
        answer: 'Yes! Passing callbacks to `mutate()` allows component-specific actions (like closing a dialog).'
      },
      starterCode: `// Assignment: Implement formatMutationFeedback\n// Format feedback based on mutation lifecycle:\n// formatMutationFeedback({ isPending, isError, isSuccess, error })\n// 1. isPending -> { status: 'loading', message: 'Saving changes...', canRetry: false }\n// 2. isError -> { status: 'error', message: error?.message || 'Operation failed', canRetry: true }\n// 3. isSuccess -> { status: 'success', message: 'Saved successfully', canRetry: false }\n// 4. Otherwise -> { status: 'idle', message: '', canRetry: false }\n\nexport function formatMutationFeedback({ isPending, isError, isSuccess, error }) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Formats error feedback with retry enabled',
          run: (fn) => {
            const res = fn({ isPending: false, isError: true, isSuccess: false, error: new Error('Network timeout') });
            return res.status === 'error' && res.canRetry === true && res.message === 'Network timeout';
          }
        },
        {
          name: 'Formats loading and success states',
          run: (fn) => {
            const l = fn({ isPending: true });
            const s = fn({ isPending: false, isSuccess: true });
            return l.status === 'loading' && s.status === 'success';
          }
        }
      ],
      hints: [
        'Check conditions in order: isPending, isError, isSuccess, idle fallback.'
      ],
      checklist: [
        'Formatted error status with canRetry flag',
        'Formatted loading and success messages',
        'Handled idle default'
      ],
      revisionSummary: 'Pair mutations with actionable error feedback, dismiss controls, and retry handlers.'
    },
    {
      id: 'p6-l19',
      slug: 'environment-variables-api-config',
      title: 'Environment Variables and API Configuration in Vite',
      prerequisites: ['p1-l2'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Configure environment variables (.env, .env.development, .env.production) in Vite.', 'Prefix client variables with VITE_ to expose them to the browser.', 'Prevent accidental leaks of backend secrets.'],
      explanation: 'React apps communicate with different backend endpoints in development (http://localhost:5000) and production (https://api.myacademy.com). Vite uses environment variables loaded from `.env` files. In Vite, ONLY variables prefixed with `VITE_` (e.g. `VITE_API_URL`) are exposed to your browser code via `import.meta.env.VITE_API_URL`. Any variable without the prefix is kept hidden to prevent secret leaks.',
      whyItExists: 'Enables environment-specific configuration and prevents catastrophic credential leaks.',
      syntaxRules: 'Use import.meta.env.VITE_VARIABLE_NAME. Never store private database passwords or JWT signing secrets in Vite client code.',
      codeExample: `// .env.development\n// VITE_API_URL=http://localhost:5000/api\n\n// .env.production\n// VITE_API_URL=https://api.production-domain.com/api\n\n// src/config.js\nexport const config = {\n  apiUrl: import.meta.env.VITE_API_URL || '/api',\n  isDev: import.meta.env.DEV,\n  isProd: import.meta.env.PROD\n};`,
      lineByLine: [
        'Line 8: Reads VITE_API_URL safely with fallback.',
        'Line 9-10: Vite built-in booleans (import.meta.env.DEV and PROD) indicate active environment.'
      ],
      expectedBehavior: 'App connects to localhost in dev and production API in deployment automatically.',
      commonMistakes: ['Trying to use process.env.API_URL in Vite (Vite uses import.meta.env!).', 'Putting a stripe secret key in .env and prefixing it with VITE_ (making it public to the whole world!).'],
      practiceLevels: {
        levelA: 'Create .env file with VITE_APP_TITLE and read it in a header component.',
        levelB: 'Set up .env.development and .env.production with separate API endpoints.',
        levelC: 'Audit a frontend build to ensure no private keys or secrets are exposed in client chunks.'
      },
      debuggingChallenge: {
        brokenCode: `// .env:\nAPI_SECRET=my_jwt_private_key\n// Component:\nconsole.log(import.meta.env.API_SECRET); // undefined!`,
        problem: 'Vite intentionally hides variables without the VITE_ prefix to protect your security.',
        fix: 'Private secrets belong on the Express server, not in the React frontend bundle!'
      },
      conceptualQuestion: {
        question: 'Why does Vite require client-side environment variables to start with the `VITE_` prefix?',
        options: [
          'Vite is named after the prefix.',
          'To prevent accidental security leaks of sensitive server environment variables (database passwords, API secrets) into the public client-side JavaScript bundle.',
          'Because JavaScript only supports 5-letter variables.',
          'It is an Oxlint requirement.'
        ],
        correctIndex: 1,
        explanation: 'The VITE_ prefix ensures that only variables you explicitly intended to make public are compiled into client-side code.'
      },
      codeReadingQuestion: {
        snippet: `if (import.meta.env.DEV) { console.log('Debug enabled'); }`,
        question: 'Will this console.log execute in a production build?',
        answer: 'No! During `vite build`, import.meta.env.DEV is replaced with `false`, and dead-code elimination strips it entirely.'
      },
      starterCode: `// Assignment: Implement auditEnvVariables\n// Audit environment variables for security exposure:\n// auditEnvVariables(envObject)\n// envObject: Record<string, string> (e.g. { VITE_API_URL: '...', DB_PASSWORD: '...' })\n// Rules:\n// 1. clientExposed: keys that start with 'VITE_'\n// 2. privateServerSecrets: keys that do NOT start with 'VITE_'\n// 3. If any key in clientExposed contains 'SECRET', 'PASSWORD', or 'KEY' -> flag as security risk!\n// Return: { isSecure: boolean, leakedKeys: string[], clientExposedCount: number }\n\nexport function auditEnvVariables(envObject) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Detects accidental secret exposure in VITE_ prefix',
          run: (fn) => {
            const env = { VITE_API_URL: 'https://api.com', VITE_STRIPE_SECRET_KEY: 'sk_live_123' };
            const res = fn(env);
            return res.isSecure === false && res.leakedKeys.includes('VITE_STRIPE_SECRET_KEY');
          }
        },
        {
          name: 'Approves safe public client variables',
          run: (fn) => {
            const env = { VITE_API_URL: 'https://api.com', VITE_APP_TITLE: 'Academy' };
            return fn(env).isSecure === true && fn(env).leakedKeys.length === 0;
          }
        }
      ],
      hints: [
        'Check if key.startsWith("VITE_") and regex /SECRET|PASSWORD|PRIVATE_KEY/i.test(key).'
      ],
      checklist: [
        'Separated VITE_ prefixed keys',
        'Flagged exposed secrets and keys',
        'Reported security audit status'
      ],
      revisionSummary: 'Vite exposes only VITE_ prefixed variables via import.meta.env; never expose private server secrets to the client.'
    },
    {
      id: 'p6-l20',
      slug: 'connecting-react-to-express-mongodb',
      title: 'Connecting React to an Express and MongoDB Backend',
      prerequisites: ['p6-l2', 'p6-l7', 'p6-l19'],
      estimatedDuration: '40 mins',
      difficulty: 'Advanced',
      objectives: ['Architect the MERN stack full-stack connection flow (React -> Express -> MongoDB).', 'Configure Vite dev server proxy to avoid CORS issues during development.', 'Handle MongoDB ObjectId serialization and REST schema mapping.'],
      explanation: 'In the MERN stack (MongoDB, Express, React, Node.js): React makes HTTP requests to Express REST API endpoints (`/api/lessons`), Express validates the request and queries MongoDB using Mongoose, and Express sends JSON back to React. In local development, configure Vite\'s dev server proxy in `vite.config.js` (`proxy: { "/api": "http://localhost:5000" }`) so your React app can make requests to `/api` without CORS errors!',
      whyItExists: 'Complete architectural synthesis connecting React to full-stack MERN production backends.',
      syntaxRules: 'Use Vite proxy for dev: server: { proxy: { "/api": "http://localhost:5000" } }. MongoDB _id should be mapped to id on response.',
      codeExample: `// vite.config.js - Local Dev Proxy Configuration\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      // Any request starting with /api is forwarded to Express on port 5000!\n      '/api': {\n        target: 'http://localhost:5000',\n        changeOrigin: true,\n        secure: false\n      }\n    }\n  }\n});`,
      lineByLine: [
        'Line 8: Declares the /api proxy route.',
        'Line 9: target points to the running Express backend.',
        'React components simply call fetch("/api/tasks") without CORS errors or hardcoded ports!'
      ],
      expectedBehavior: 'Seamless communication between React frontend and Express/MongoDB backend.',
      commonMistakes: ['Hardcoding http://localhost:5000 in fetch calls instead of using Vite proxy.', 'Forgetting that MongoDB uses `_id` while frontend conventions typically use `id`.'],
      practiceLevels: {
        levelA: 'Configure Vite proxy to forward /api requests to Express.',
        levelB: 'Map MongoDB _id to frontend id in an Express serialization transform.',
        levelC: 'Build an end-to-end MERN data flow: Form submission -> Express POST -> Mongoose save -> UI update.'
      },
      debuggingChallenge: {
        brokenCode: `// React error: Access to fetch at 'http://localhost:5000/api' from origin 'http://localhost:5173' has been blocked by CORS policy.`,
        problem: 'Direct cross-origin call from Vite port 5173 to Express port 5000 without CORS headers or proxy.',
        fix: 'Configure proxy in vite.config.js or enable cors() on Express.'
      },
      conceptualQuestion: {
        question: 'Why is configuring a proxy in `vite.config.js` (`server.proxy`) beneficial for MERN development?',
        options: [
          'It compiles MongoDB queries into JavaScript.',
          'It allows React to call relative paths like `/api/users` without CORS errors, and mimics production where frontend and backend are served behind a single domain/reverse-proxy.',
          'It replaces Node.js.',
          'It is required by React 19.'
        ],
        correctIndex: 1,
        explanation: 'Vite proxy prevents CORS errors during development and keeps URLs identical between local dev and production reverse proxies.'
      },
      codeReadingQuestion: {
        snippet: `// MongoDB doc: { _id: new ObjectId("652..."), title: "Task" }\n// Mongoose transform: doc._id.toString() -> id`,
        question: 'Why do full-stack MERN developers map `_id` to `id` in API responses?',
        answer: 'To provide clean JSON schemas and prevent client code from dealing with MongoDB BSON ObjectId types.'
      },
      starterCode: `// Assignment: Implement mapMongoDocumentToClient\n// Transform raw MongoDB document objects into clean client models:\n// mapMongoDocumentToClient(mongoDoc)\n// 1. Convert mongoDoc._id (or _id.toString()) to 'id'\n// 2. Remove '__v' (Mongoose version key) and '_id'\n// 3. Return clean object with 'id' as first property.\n\nexport function mapMongoDocumentToClient(mongoDoc) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Transforms MongoDB _id and strips __v',
          run: (fn) => {
            const raw = { _id: '652a123f', __v: 0, title: 'Learn MERN', completed: false };
            const clean = fn(raw);
            return clean.id === '652a123f' && clean._id === undefined && clean.__v === undefined && clean.title === 'Learn MERN';
          }
        }
      ],
      hints: [
        'const { _id, __v, ...rest } = mongoDoc; return { id: _id?.toString?.() || _id, ...rest };'
      ],
      checklist: [
        'Mapped _id to id',
        'Stripped Mongoose __v key',
        'Preserved all entity domain properties'
      ],
      revisionSummary: 'Connect React to Express/MongoDB using Vite proxy for dev, RESTful endpoints, and clean JSON model transformations.'
    }
  ]
};
