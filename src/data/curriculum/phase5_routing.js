// Phase 5: Routing and Multi-Page Applications
export const phase5 = {
  id: 'phase-5',
  title: 'Phase 5 — Routing and Multi-Page Applications',
  description: 'Master client-side routing with React Router: BrowserRouter, dynamic route parameters (:id), search params (URLSearchParams), nested routes and layouts with <Outlet />, protected routes, data loaders/actions, and URL-driven state management.',
  icon: 'Compass',
  badge: 'Multi-Page Architecture',
  estimatedHours: 10,
  lessons: [
    {
      id: 'p5-l1',
      slug: 'spa-fundamentals-client-routing',
      title: 'SPA Fundamentals and Client-Side Routing',
      prerequisites: ['p1-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Understand how Single Page Applications (SPAs) differ from Multi-Page Applications (MPAs).', 'Intercept browser navigation to prevent full page reloads.', 'Synchronize browser address bar with React component rendering.'],
      explanation: 'In a traditional Multi-Page Application (MPA), every link click triggers an HTTP GET request to the server, resulting in a blank white flash while the browser discards the DOM, downloads a new HTML page, and re-executes all scripts. In a Single Page Application (SPA), client-side routing intercepts link clicks, updates the browser URL via the HTML5 History API, and renders the matching React component instantaneously without reloading the page.',
      whyItExists: 'Delivers instantaneous, app-like navigation and preserves in-memory client state across views.',
      syntaxRules: 'Use <Link to="..."> instead of <a href="..."> to prevent browser page reloads in React Router.',
      codeExample: `import { BrowserRouter, Link } from 'react-router-dom';\n\nfunction Navigation() {\n  return (\n    <nav>\n      {/* WRONG: <a href="/about"> causes full page reload! */}\n      {/* CORRECT: <Link> updates URL client-side with zero reload */}\n      <Link to="/">Home</Link>\n      <Link to="/curriculum">Curriculum</Link>\n    </nav>\n  );\n}`,
      lineByLine: [
        'Line 7: <Link to="..."> intercepts the click event and calls e.preventDefault().',
        'Updates window.location.pathname via history.pushState and renders the destination component in 0ms.'
      ],
      expectedBehavior: 'URL updates in address bar; content changes instantaneously with zero white flash or network reload.',
      commonMistakes: ['Using standard HTML <a href="..."> links for internal routing, causing full page refreshes and losing state.', 'Forgetting to configure server fallbacks (e.g. index.html rewrite in production) for direct URL visits.'],
      practiceLevels: {
        levelA: 'Convert regular <a> tags into React Router <Link> elements.',
        levelB: 'Inspect browser Network tab to verify zero network requests during SPA navigation.',
        levelC: 'Configure a client-side route matcher matching paths to components.'
      },
      debuggingChallenge: {
        brokenCode: `<a href="/dashboard">Dashboard</a> // Why does my audio player stop and state reset on click?`,
        problem: '<a> tag causes a full browser page refresh, destroying all React state and background processes.',
        fix: 'Replace with <Link to="/dashboard">Dashboard</Link>.'
      },
      conceptualQuestion: {
        question: 'What browser Web API enables client-side routing in React SPAs without refreshing the page?',
        options: [
          'The WebSockets API.',
          'The HTML5 History API (`history.pushState` and `window.onpopstate`).',
          'The Canvas API.',
          'The Geolocation API.'
        ],
        correctIndex: 1,
        explanation: 'The HTML5 History API allows JavaScript to change the browser URL without triggering an HTTP request or page reload.'
      },
      codeReadingQuestion: {
        snippet: `// What happens when user clicks back button in an SPA?`,
        question: 'Which browser event does React Router listen to when the user clicks the browser Back or Forward button?',
        answer: 'The `popstate` event.'
      },
      starterCode: `// Assignment: Implement simulateSpaLinkInterceptor\n// Build an SPA link click interceptor:\n// handleSpaLinkClick(event, destinationPath)\n// 1. If event.metaKey || event.ctrlKey is true (user opened in new tab), do NOT prevent default; return { intercepted: false, method: 'NATIVE_BROWSER' }\n// 2. Otherwise call event.preventDefault(); return { intercepted: true, method: 'PUSH_STATE', newPath: destinationPath }\n\nexport function handleSpaLinkClick(event, destinationPath) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Intercepts standard link click and prevents default',
          run: (fn) => {
            let prevented = false;
            const ev = { metaKey: false, ctrlKey: false, preventDefault: () => { prevented = true; } };
            const res = fn(ev, '/profile');
            return res.intercepted === true && res.newPath === '/profile' && prevented === true;
          }
        },
        {
          name: 'Allows Cmd/Ctrl+Click to open in new tab natively',
          run: (fn) => {
            let prevented = false;
            const ev = { metaKey: true, ctrlKey: false, preventDefault: () => { prevented = true; } };
            const res = fn(ev, '/profile');
            return res.intercepted === false && prevented === false;
          }
        }
      ],
      hints: [
        'Check event.metaKey || event.ctrlKey; if false, call event.preventDefault().'
      ],
      checklist: [
        'Checked for modifier keys (Cmd/Ctrl)',
        'Called preventDefault on standard clicks',
        'Returned structured navigation result'
      ],
      revisionSummary: 'SPAs use the HTML5 History API to update the URL client-side, avoiding full page reloads.'
    },
    {
      id: 'p5-l2',
      slug: 'browser-history-url-structure',
      title: 'Browser History and URL Structure',
      prerequisites: ['p5-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Deconstruct URL anatomy: protocol, host, pathname, search params, and hash.', 'Understand the browser history stack: pushState vs replaceState.', 'Support forward/back browser navigation seamlessly.'],
      explanation: 'A URL consists of: Protocol (https://) + Host (myapp.com) + Pathname (/lessons/hooks) + Search/Query (?view=split&filter=react) + Hash (#section-2). The browser manages a history stack. `history.pushState` adds a new entry to the stack (so Back button returns to previous view), while `history.replaceState` overwrites the current entry (useful for login redirects or filter updates).',
      whyItExists: 'Enables deep-linking, shareable URLs, and expected Back/Forward browser navigation.',
      syntaxRules: 'Use navigate(path) for push navigation; use navigate(path, { replace: true }) to overwrite the current history entry.',
      codeExample: `// URL Anatomy in React Router\n// URL: https://academy.com/curriculum?topic=hooks#p3-l2\nconst pathname = window.location.pathname; // '/curriculum'\nconst search = window.location.search;     // '?topic=hooks'\nconst hash = window.location.hash;         // '#p3-l2'\n\n// push vs replace navigation\n// navigate('/login'); // Adds new history entry\n// navigate('/dashboard', { replace: true }); // Replaces /login in stack!`,
      lineByLine: [
        'Line 3-5: Identifies the three distinct components of the URL path.',
        'Line 9: replace: true prevents the user from clicking Back and landing back on the login page.'
      ],
      expectedBehavior: 'History stack reflects user navigation accurately without login loops.',
      commonMistakes: ['Using push for login redirects, causing the user to loop back to login when pressing the Back button.', 'Storing state in local component memory that should have been shareable in the URL query string.'],
      practiceLevels: {
        levelA: 'Parse pathname and search string from a raw URL.',
        levelB: 'Implement redirect with replace: true on login.',
        levelC: 'Handle window.onpopstate to sync custom state with browser Back button.'
      },
      debuggingChallenge: {
        brokenCode: `// User logs in, gets pushed to /dashboard. User clicks browser Back button and gets stuck in infinite login redirect loop!`,
        problem: 'Login page was pushed onto history instead of replaced.',
        fix: 'navigate("/dashboard", { replace: true });'
      },
      conceptualQuestion: {
        question: 'When should you use `replace: true` instead of standard push navigation?',
        options: [
          'Whenever navigating to the home page.',
          'After actions like login redirects, form submissions, or live search query updates where you do not want the user to navigate back to the intermediate state.',
          'Only in mobile browsers.',
          'It is required for external URLs.'
        ],
        correctIndex: 1,
        explanation: 'Replacing history overwrites the current stack entry, preventing users from getting trapped in login or intermediate redirect loops.'
      },
      codeReadingQuestion: {
        snippet: `navigate(-1);`,
        question: 'What does navigate(-1) do in React Router?',
        answer: 'It navigates one step backward in the browser history stack, identical to clicking the browser Back button.'
      },
      starterCode: `// Assignment: Implement parseUrlSegments\n// Parse a full URL string into structured segments:\n// parseUrlSegments(urlString)\n// Return: { pathname: string, searchParams: Record<string, string>, hash: string }\n\nexport function parseUrlSegments(urlString) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Parses pathname, search params, and hash',
          run: (fn) => {
            const res = fn('https://academy.com/lessons/react?topic=hooks&difficulty=hard#challenge');
            return res.pathname === '/lessons/react' && res.searchParams.topic === 'hooks' && res.searchParams.difficulty === 'hard' && res.hash === '#challenge';
          }
        }
      ],
      hints: [
        'Use native new URL(urlString) and iterate over url.searchParams.'
      ],
      checklist: [
        'Extracted pathname',
        'Parsed query parameters into object',
        'Extracted hash fragment'
      ],
      revisionSummary: 'URLs contain pathname, search params, and hash; use replace: true for redirects to keep history clean.'
    },
    {
      id: 'p5-l3',
      slug: 'browserrouter-and-route-config',
      title: 'BrowserRouter and Route Configuration',
      prerequisites: ['p5-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Configure <BrowserRouter>, <Routes>, and <Route path="..." element={<Comp />}>.', 'Understand how route matching selects the best matching route.', 'Organize top-level application routing.'],
      explanation: 'React Router v6+ uses `<BrowserRouter>` as the root context provider for routing. Inside `<Routes>`, you declare individual `<Route path="..." element={<Component />} />`. React Router matches the current URL against the configured paths and renders the corresponding component.',
      whyItExists: 'Provides declarative route mapping between URLs and UI views.',
      syntaxRules: 'Wrap your app in <BrowserRouter>. Group routes inside <Routes>. Pass components as JSX elements: element={<Home />} (not element={Home}).',
      codeExample: `import { BrowserRouter, Routes, Route } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<HomePage />} />\n        <Route path="/curriculum" element={<CurriculumPage />} />\n        <Route path="/workspace" element={<WorkspacePage />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}`,
      lineByLine: [
        'Line 4: BrowserRouter provides routing context and listens to URL changes.',
        'Line 5: Routes selects and renders the single best matching child route.',
        'Line 6: element={<HomePage />} instantiates the component when path matches "/".'
      ],
      expectedBehavior: 'Navigating to "/curriculum" unmounts HomePage and mounts CurriculumPage cleanly.',
      commonMistakes: ['Passing component name instead of JSX element: element={HomePage} (must be element={<HomePage />})!', 'Putting Route elements outside of a <Routes> container.'],
      practiceLevels: {
        levelA: 'Configure 3 basic routes (Home, About, Contact) in App.jsx.',
        levelB: 'Add route alias or redirect using <Navigate to="/" replace />.',
        levelC: 'Configure data router using createBrowserRouter() API.'
      },
      debuggingChallenge: {
        brokenCode: `<Routes>\n  <Route path="/about" component={About} />\n</Routes>`,
        problem: 'component={About} is deprecated React Router v5 syntax; React Router v6+ requires element={<About />}.',
        fix: '<Route path="/about" element={<About />} />'
      },
      conceptualQuestion: {
        question: 'Why does React Router v6 require `element={<MyComponent />}` instead of `component={MyComponent}`?',
        options: [
          'JSX elements allow passing custom props directly (e.g. element={<MyComponent user={user} />}) and align with standard React element conventions.',
          'It compiles faster.',
          'Classes cannot be passed in props.',
          'It is a Vite requirement.'
        ],
        correctIndex: 0,
        explanation: 'element={<Component prop={val} />} enables direct, natural prop passing without cumbersome render-prop callbacks.'
      },
      codeReadingQuestion: {
        snippet: `<Route path="*" element={<NotFound />} />`,
        question: 'What does the path="*" wildcard route match?',
        answer: 'Any URL path that was not matched by any other preceding route (404 catch-all).'
      },
      starterCode: `// Assignment: Implement matchRoutePath\n// Simulate route matching against a configured table:\n// matchRoutePath(routes, currentPath)\n// routes: [{ path: string, element: string }]\n// Rules:\n// 1. Exact match has top priority.\n// 2. Wildcard '*' matches if no exact match is found.\n// 3. Return matching element string or '404_NOT_FOUND'.\n\nexport function matchRoutePath(routes, currentPath) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Matches exact route path',
          run: (fn) => {
            const routes = [
              { path: '/', element: 'HOME' },
              { path: '/curriculum', element: 'CURRICULUM' },
              { path: '*', element: 'NOT_FOUND' }
            ];
            return fn(routes, '/curriculum') === 'CURRICULUM';
          }
        },
        {
          name: 'Falls back to wildcard when path unmatched',
          run: (fn) => {
            const routes = [
              { path: '/', element: 'HOME' },
              { path: '*', element: 'NOT_FOUND' }
            ];
            return fn(routes, '/unknown-url') === 'NOT_FOUND';
          }
        }
      ],
      hints: [
        'Find item with exact path match first; if not found, find item with path "*".'
      ],
      checklist: [
        'Matched exact paths',
        'Handled wildcard catch-all',
        'Returned correct element string'
      ],
      revisionSummary: 'BrowserRouter provides routing context; Routes pairs URL paths with JSX component elements.'
    },
    {
      id: 'p5-l4',
      slug: 'route-parameters-useparams',
      title: 'Route Parameters and the useParams Hook',
      prerequisites: ['p5-l3'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Define dynamic route segments using colon syntax (path="/lesson/:lessonId").', 'Extract parameter values inside components using useParams().', 'Handle parameter type coercion (e.g. Number(id)).'],
      explanation: 'Web applications often need dynamic URLs to display specific entities (e.g. /lesson/p1-l4, /user/42). In React Router, dynamic segments are declared with a colon: path="/lesson/:lessonId". Inside the rendered component, the `useParams()` hook returns an object containing all extracted route parameters.',
      whyItExists: 'Enables dynamic detail pages and resource-specific URLs with a single shared component template.',
      syntaxRules: 'Route: <Route path="/lesson/:id" element={<LessonView />} />. Component: const { id } = useParams(). Parameter values are always strings!',
      codeExample: `import { useParams } from 'react-router-dom';\n\n// Route config: <Route path="/lessons/:phaseId/:lessonId" element={<LessonWorkspace />} />\nfunction LessonWorkspace() {\n  const { phaseId, lessonId } = useParams();\n\n  return (\n    <div>\n      <h2>Phase: {phaseId}</h2>\n      <h3>Lesson: {lessonId}</h3>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 5: useParams() extracts { phaseId, lessonId } dynamically from the URL.',
        'If URL is /lessons/phase-1/p1-l5, phaseId is "phase-1" and lessonId is "p1-l5".'
      ],
      expectedBehavior: 'Component dynamically renders data matching the URL parameter.',
      commonMistakes: ['Forgetting that useParams values are ALWAYS strings: id === 42 fails if id is "42" (use Number(id)).', 'Forgetting the colon : in the route path definition.'],
      practiceLevels: {
        levelA: 'Extract an :id param and fetch matching entity data.',
        levelB: 'Define multi-segment params: /course/:courseId/module/:moduleId.',
        levelC: 'Display a "Resource Not Found" view when parameter ID does not exist in registry.'
      },
      debuggingChallenge: {
        brokenCode: `// Route: <Route path="/user/id" element={<User />} />\n// Component: const { id } = useParams(); // id is undefined!`,
        problem: 'Missing colon; path="/user/id" matches the literal word "id", not a dynamic parameter.',
        fix: 'path="/user/:id"'
      },
      conceptualQuestion: {
        question: 'What is the JavaScript type of values returned by the `useParams()` hook in React Router?',
        options: [
          'Numbers if numeric, otherwise strings.',
          'Always strings (or undefined if omitted).',
          'Objects containing DOM elements.',
          'Promises.'
        ],
        correctIndex: 1,
        explanation: 'URLs are strings; useParams always returns string values, requiring manual parsing for numbers (e.g. parseInt(id, 10)).'
      },
      codeReadingQuestion: {
        snippet: `// Route: path="/products/:category/:productId"\n// URL: /products/laptops/123`,
        question: 'What object does useParams() return?',
        answer: '{ category: "laptops", productId: "123" }'
      },
      starterCode: `// Assignment: Implement extractRouteParams\n// Extract dynamic parameters from a route pattern against an active URL:\n// extractRouteParams(pattern, activeUrl)\n// Example: pattern = '/lessons/:phase/:id', activeUrl = '/lessons/p1/l5'\n// Returns: { phase: 'p1', id: 'l5' }\n// If path lengths or static segments mismatch -> return null\n\nexport function extractRouteParams(pattern, activeUrl) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Extracts single and multi-parameter segments',
          run: (fn) => {
            const res = fn('/lessons/:phaseId/:lessonId', '/lessons/phase-1/p1-l1');
            return res && res.phaseId === 'phase-1' && res.lessonId === 'p1-l1';
          }
        },
        {
          name: 'Returns null on segment mismatch',
          run: (fn) => {
            return fn('/lessons/:id', '/products/123') === null;
          }
        }
      ],
      hints: [
        'Split both paths by "/" and compare segment counts; extract params where pattern starts with ":".'
      ],
      checklist: [
        'Compared segment lengths',
        'Validated static segment matching',
        'Extracted dynamic named parameters'
      ],
      revisionSummary: 'Dynamic route segments use colon syntax (:id) and are accessed as strings via useParams().'
    },
    {
      id: 'p5-l5',
      slug: 'query-parameters-usesearchparams',
      title: 'Query Parameters and useSearchParams',
      prerequisites: ['p5-l4'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Read and write URL search parameters (?filter=react&sort=desc) with useSearchParams.', 'Synchronize filters, search boxes, and pagination with the URL.', 'Understand why URL search state enables shareable links.'],
      explanation: 'Search parameters (query strings) appear after the question mark in a URL: `?tab=notes&filter=hooks`. In React Router, the `useSearchParams()` hook works similarly to `useState`: it returns a `URLSearchParams` instance to read parameters, and a setter function to update them. Putting search and filter state into the URL makes pages bookmarkable and shareable.',
      whyItExists: 'Enables users to copy a link with active filters or pagination and send it to a coworker.',
      syntaxRules: 'const [searchParams, setSearchParams] = useSearchParams(). Read via searchParams.get("key"). Update via setSearchParams({ key: "val" }).',
      codeExample: `import { useSearchParams } from 'react-router-dom';\n\nfunction FilterableLessons() {\n  const [searchParams, setSearchParams] = useSearchParams();\n  const activeDifficulty = searchParams.get('difficulty') ?? 'all';\n\n  const handleSelect = (difficulty) => {\n    // Updates browser URL to: ?difficulty=Beginner\n    setSearchParams({ difficulty });\n  };\n\n  return (\n    <div>\n      <button onClick={() => handleSelect('Beginner')}>Beginner</button>\n      <button onClick={() => handleSelect('Advanced')}>Advanced</button>\n      <p>Current Filter: {activeDifficulty}</p>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: useSearchParams provides reactive access to URL query strings.',
        'Line 5: searchParams.get("difficulty") reads current filter cleanly.',
        'Line 9: setSearchParams updates the URL without page reload.'
      ],
      expectedBehavior: 'URL reflects active filter; reloading the page restores the exact filter state.',
      commonMistakes: ['Overwriting existing search params accidentally when updating one parameter (use new URLSearchParams(searchParams) to preserve others).', 'Using useState for search filters, making links unshareable.'],
      practiceLevels: {
        levelA: 'Read a ?query=text parameter and display it.',
        levelB: 'Build a multi-filter bar preserving existing parameters when adding new ones.',
        levelC: 'Sync pagination ?page=2 with a table component.'
      },
      debuggingChallenge: {
        brokenCode: `// User has: ?sort=desc&category=hooks\nsetSearchParams({ page: '2' }); // Bug: wipes out sort and category!`,
        problem: 'Passing a new object replaces all search parameters entirely.',
        fix: 'setSearchParams(prev => { prev.set("page", "2"); return prev; });'
      },
      conceptualQuestion: {
        question: 'Why should search queries and filters be stored in URL search parameters rather than `useState`?',
        options: [
          'Because search parameters consume zero memory.',
          'Storing state in the URL makes the page bookmarkable, shareable, and supports standard browser Back/Forward navigation history.',
          'React state cannot store strings.',
          'It is required for HTTPS security.'
        ],
        correctIndex: 1,
        explanation: 'URL state allows users to copy the URL and share their exact search or filtered view with others.'
      },
      codeReadingQuestion: {
        snippet: `const page = Number(searchParams.get('page') ?? '1');`,
        question: 'What does this expression guarantee?',
        answer: 'It parses the page parameter into a number, defaulting safely to 1 if omitted.'
      },
      starterCode: `// Assignment: Implement updateSearchParamsSafely\n// Update a single query parameter while preserving existing ones:\n// updateSearchParamsSafely(currentQueryString, keyToUpdate, newValue)\n// If newValue is null or empty string '' -> remove keyToUpdate from params!\n// Return updated query string (e.g. '?topic=react&page=2' or '' if empty).\n\nexport function updateSearchParamsSafely(currentQueryString, keyToUpdate, newValue) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Updates single param and preserves existing params',
          run: (fn) => {
            const res = fn('?topic=react&page=1', 'page', '2');
            return res.includes('topic=react') && res.includes('page=2');
          }
        },
        {
          name: 'Deletes param when newValue is null or empty',
          run: (fn) => {
            const res = fn('?topic=react&page=1', 'page', '');
            return res === '?topic=react' || res === 'topic=react';
          }
        }
      ],
      hints: [
        'Use new URLSearchParams(currentQueryString); use .set() or .delete().'
      ],
      checklist: [
        'Preserved existing query parameters',
        'Updated target parameter value',
        'Removed key when value was empty'
      ],
      revisionSummary: 'useSearchParams synchronizes UI filters and pagination with the URL for bookmarkable, shareable views.'
    },
    {
      id: 'p5-l6',
      slug: 'navigation-link-navlink-usenavigate',
      title: 'Navigation: Link, NavLink, and useNavigate',
      prerequisites: ['p5-l3'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Master Link for declarative navigation.', 'Use NavLink for active tab styling via isActive callback.', 'Use useNavigate for programmatic navigation (after async submit, timers, guards).'],
      explanation: 'React Router provides three navigation tools: 1. `<Link to="...">`: Declarative navigation for standard links. 2. `<NavLink to="...">`: Specialized link that knows whether it is currently active, perfect for navigation bars and tabs (className={({ isActive }) => isActive ? "active" : ""}). 3. `useNavigate()`: Programmatic navigation hook for redirecting inside JavaScript functions.',
      whyItExists: 'Covers all navigation scenarios: static links, active navigation menus, and asynchronous redirects.',
      syntaxRules: 'Use NavLink for navbars. Use useNavigate inside event handlers. Never use window.location.href for internal routes.',
      codeExample: `import { NavLink, useNavigate } from 'react-router-dom';\n\nfunction TopNav() {\n  const navigate = useNavigate();\n\n  const handleLogout = async () => {\n    await apiLogout();\n    // Programmatic redirect after async logout\n    navigate('/login', { replace: true });\n  };\n\n  return (\n    <nav>\n      {/* NavLink with automatic active styling */}\n      <NavLink\n        to="/curriculum"\n        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}\n      >\n        Curriculum\n      </NavLink>\n      <button onClick={handleLogout}>Log Out</button>\n    </nav>\n  );\n}`,
      lineByLine: [
        'Line 4: useNavigate returns the programmatic navigation dispatch function.',
        'Line 9: Redirects to /login replacing history entry after logout.',
        'Line 17: NavLink provides isActive boolean to highlight the currently open menu item.'
      ],
      expectedBehavior: 'Active nav item is visually highlighted; logout redirects cleanly.',
      commonMistakes: ['Calling navigate() during the component render phase (must only be called in effects or event handlers).', 'Using standard Link in navbars and writing complex manual pathname checks to highlight active links.'],
      practiceLevels: {
        levelA: 'Style a navigation bar with active indicator using NavLink.',
        levelB: 'Redirect user to /dashboard after a 2-second success delay with useNavigate.',
        levelC: 'Build a breadcrumb navigation trail using React Router links.'
      },
      debuggingChallenge: {
        brokenCode: `function LoginForm() {\n  const navigate = useNavigate();\n  navigate('/dashboard'); // Direct navigation in render body!\n  return <form>...</form>;\n}`,
        problem: 'Calling navigate during render causes infinite loops and violates render purity.',
        fix: 'Call navigate inside handleSubmit or useEffect.'
      },
      conceptualQuestion: {
        question: 'What is the key advantage of `<NavLink>` over `<Link>` in navigation bars?',
        options: [
          'NavLink loads faster.',
          'NavLink automatically detects if its `to` destination matches the current URL and exposes an `isActive` boolean for dynamic CSS styling.',
          'NavLink works without JavaScript.',
          'NavLink encrypts the destination URL.'
        ],
        correctIndex: 1,
        explanation: 'NavLink passes an { isActive } boolean to className or style, making active navigation styling effortless.'
      },
      codeReadingQuestion: {
        snippet: `<NavLink to="/dashboard" end />`,
        question: 'What does the `end` prop on NavLink do?',
        answer: 'It ensures the link is only considered active if the URL matches the path exactly, not if it matches a sub-route (e.g. /dashboard/settings).'
      },
      starterCode: `// Assignment: Implement resolveNavLinkClass\n// Simulate NavLink active class resolution:\n// resolveNavLinkClass(toPath, currentPath, isEnd)\n// 1. If isEnd is true: active if currentPath === toPath\n// 2. If isEnd is false: active if currentPath.startsWith(toPath)\n// Return: active ? 'nav-item nav-item--active' : 'nav-item'\n\nexport function resolveNavLinkClass(toPath, currentPath, isEnd = false) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Highlights active link on exact match with isEnd',
          run: (fn) => {
            const active = fn('/dashboard', '/dashboard', true);
            const inactive = fn('/dashboard', '/dashboard/settings', true);
            return active.includes('nav-item--active') && !inactive.includes('nav-item--active');
          }
        },
        {
          name: 'Matches sub-routes when isEnd is false',
          run: (fn) => {
            const res = fn('/curriculum', '/curriculum/p1-l1', false);
            return res.includes('nav-item--active');
          }
        }
      ],
      hints: [
        'Check isEnd ? currentPath === toPath : currentPath.startsWith(toPath).'
      ],
      checklist: [
        'Checked exact match when isEnd is true',
        'Checked prefix match when isEnd is false',
        'Returned correct BEM class string'
      ],
      revisionSummary: 'Use Link for standard links, NavLink for active tab styling, and useNavigate for programmatic redirects.'
    },
    {
      id: 'p5-l7',
      slug: 'nested-routes-and-layouts',
      title: 'Nested Routes and Shared Layouts',
      prerequisites: ['p5-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Nest routes hierarchically to represent nested UI layouts.', 'Share headers, sidebars, and navigation shells across sub-pages.', 'Avoid duplicating layout markup across individual page views.'],
      explanation: 'Most web apps have persistent layout elements: a top navigation bar, a persistent sidebar, or breadcrumbs that remain on screen while the inner page content switches. In React Router, nesting `<Route>` tags mirrors this hierarchy. The parent route renders the shared layout, and child routes render inside it.',
      whyItExists: 'Prevents re-mounting common headers and sidebars on every page switch, preserving state and scroll positions.',
      syntaxRules: 'Declare child routes inside parent: <Route path="/dashboard" element={<DashboardLayout />}> <Route path="analytics" element={<Analytics />} /> </Route>. Child path is relative (no leading slash).',
      codeExample: `import { Routes, Route } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <Routes>\n      {/* Parent Route renders shared DashboardLayout */}\n      <Route path="/dashboard" element={<DashboardLayout />}>\n        {/* Child routes render INSIDE DashboardLayout */}\n        <Route path="analytics" element={<AnalyticsView />} />\n        <Route path="settings" element={<SettingsView />} />\n      </Route>\n    </Routes>\n  );\n}`,
      lineByLine: [
        'Line 6: DashboardLayout stays mounted when switching between analytics and settings.',
        'Line 8-9: Relative child paths match /dashboard/analytics and /dashboard/settings.'
      ],
      expectedBehavior: 'Sidebar stays in place; only the inner content updates when navigating between child routes.',
      commonMistakes: ['Putting leading slashes on child route paths: path="/analytics" (overwrites root URL instead of nesting under /dashboard!).', 'Forgetting to render <Outlet /> inside the layout component.'],
      practiceLevels: {
        levelA: 'Create an AppLayout with Header and Footer wrapping sub-routes.',
        levelB: 'Build a SettingsLayout with a left tab menu and right content panel.',
        levelC: 'Verify that an input inside the shared header retains its value when changing child routes.'
      },
      debuggingChallenge: {
        brokenCode: `<Route path="/admin" element={<AdminLayout />}>\n  <Route path="/users" element={<Users />} /> {/* Leading slash! */}\n</Route>`,
        problem: 'Leading slash on child route makes it match root "/users" instead of "/admin/users".',
        fix: '<Route path="users" element={<Users />} />'
      },
      conceptualQuestion: {
        question: 'Why should child routes in a nested route hierarchy use relative paths (e.g. `path="settings"`) instead of absolute paths (`path="/settings"`)?',
        options: [
          'Absolute paths fail in Vite.',
          'Relative paths automatically append to the parent route\'s URL (`/dashboard/settings`), whereas a leading slash resets the path from the root domain.',
          'Relative paths load faster.',
          'Because React Router only supports 5 letters in paths.'
        ],
        correctIndex: 1,
        explanation: 'Omitting the leading slash preserves path nesting, joining child paths with parent paths automatically.'
      },
      codeReadingQuestion: {
        snippet: `<Route path="users" element={<Users />} /> // inside path="/admin"`,
        question: 'What full URL path does this route match?',
        answer: '/admin/users'
      },
      starterCode: `// Assignment: Implement resolveNestedRouteUrls\n// Resolve full URLs for nested route definitions:\n// resolveNestedRouteUrls(parentPath, childPaths)\n// childPaths: string[] (e.g. ['profile', 'security', '/override'])\n// Rules:\n// 1. If childPath starts with '/', it is absolute: return childPath\n// 2. Otherwise join: \`\${parentPath.replace(/\\/$/, '')}/\${childPath}\`\n// Return: string[] of resolved full paths.\n\nexport function resolveNestedRouteUrls(parentPath, childPaths) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Resolves relative child paths under parent',
          run: (fn) => {
            const res = fn('/dashboard', ['analytics', 'reports']);
            return res[0] === '/dashboard/analytics' && res[1] === '/dashboard/reports';
          }
        },
        {
          name: 'Preserves absolute override paths',
          run: (fn) => {
            const res = fn('/admin', ['users', '/root-override']);
            return res[0] === '/admin/users' && res[1] === '/root-override';
          }
        }
      ],
      hints: [
        'Check child.startsWith("/") for absolute paths.'
      ],
      checklist: [
        'Handled relative child path concatenation',
        'Handled absolute root override paths'
      ],
      revisionSummary: 'Nested routes mirror UI hierarchy; parent route renders the shared layout while child paths match sub-views.'
    },
    {
      id: 'p5-l8',
      slug: 'outlet-component-subviews',
      title: 'The Outlet Component: Rendering Sub-Views',
      prerequisites: ['p5-l7'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Use <Outlet /> inside parent layout components.', 'Understand where child routes mount within layout markup.', 'Pass shared context down to child routes with <Outlet context={data} />.'],
      explanation: 'In nested routing, the parent layout component needs to know WHERE to render the matched child route. The `<Outlet />` component from React Router acts as a placeholder or slot: whatever child route matches will be rendered in place of the `<Outlet />`. You can also pass shared data down to child routes using `<Outlet context={{ user }} />` and `useOutletContext()`.',
      whyItExists: 'Enables flexible layout framing with dynamic sub-view insertion.',
      syntaxRules: 'Place <Outlet /> inside the parent layout JSX where the child content should appear.',
      codeExample: `import { Outlet, useOutletContext } from 'react-router-dom';\n\n// Parent Layout\nfunction DashboardLayout() {\n  const [user] = useState({ name: 'Ada', role: 'admin' });\n\n  return (\n    <div className="dashboard-shell">\n      <Sidebar />\n      <main className="content-area">\n        {/* Matched child route renders HERE: */}\n        <Outlet context={{ user }} />\n      </main>\n    </div>\n  );\n}\n\n// Child Route Component\nfunction OverviewTab() {\n  // Access shared parent data via useOutletContext\n  const { user } = useOutletContext();\n  return <h2>Welcome back, {user.name}</h2>;\n}`,
      lineByLine: [
        'Line 11: <Outlet /> tells React Router where to insert child routes like OverviewTab.',
        'Line 18: useOutletContext() reads shared parent state cleanly without prop drilling.'
      ],
      expectedBehavior: 'Sidebar stays fixed while content-area swaps child views dynamically.',
      commonMistakes: ['Forgetting to render <Outlet /> in the parent layout (child routes will never display!).', 'Trying to pass props directly to <Outlet myProp={x} /> (use context={x} instead).'],
      practiceLevels: {
        levelA: 'Add <Outlet /> to a two-column layout component.',
        levelB: 'Pass current user data to child tabs using <Outlet context={user} />.',
        levelC: 'Inspect the rendered DOM tree with React DevTools to observe Outlet replacement.'
      },
      debuggingChallenge: {
        brokenCode: `function Layout() {\n  return <div><Sidebar />{/* Child route doesn\'t render! */}</div>;\n}`,
        problem: 'Missing <Outlet /> component; React Router has nowhere to render the matched child route.',
        fix: 'Add <Outlet /> inside the layout.'
      },
      conceptualQuestion: {
        question: 'What is the function of `<Outlet />` in React Router?',
        options: [
          'It connects to a database outlet.',
          'It serves as a placeholder slot inside a parent layout component where matching child route components are rendered.',
          'It is a special button that navigates backward.',
          'It is an HTTP proxy.'
        ],
        correctIndex: 1,
        explanation: 'Outlet marks the exact insertion point where child routes should mount inside parent layouts.'
      },
      codeReadingQuestion: {
        snippet: `const { currentUser } = useOutletContext();`,
        question: 'Where was currentUser passed from?',
        answer: 'From the parent layout\'s `<Outlet context={{ currentUser }} />` prop.'
      },
      starterCode: `// Assignment: Implement simulateOutletInjection\n// Simulates Outlet rendering logic:\n// renderLayoutWithOutlet(layoutTemplate, matchedChildContent)\n// layoutTemplate: string with placeholder '{{OUTLET}}' (e.g. '<shell>{{OUTLET}}</shell>')\n// If matchedChildContent is provided -> replace '{{OUTLET}}' with matchedChildContent\n// If matchedChildContent is null/empty -> replace '{{OUTLET}}' with '<empty-outlet />'\n\nexport function renderLayoutWithOutlet(layoutTemplate, matchedChildContent) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Injects matched child content into outlet slot',
          run: (fn) => {
            const res = fn('<main>{{OUTLET}}</main>', '<Overview />');
            return res === '<main><Overview /></main>';
          }
        },
        {
          name: 'Renders empty outlet placeholder when no child matched',
          run: (fn) => {
            const res = fn('<main>{{OUTLET}}</main>', null);
            return res === '<main><empty-outlet /></main>';
          }
        }
      ],
      hints: [
        'Use layoutTemplate.replace("{{OUTLET}}", matchedChildContent || "<empty-outlet />").'
      ],
      checklist: [
        'Replaced outlet placeholder with child content',
        'Handled null child fallback'
      ],
      revisionSummary: 'The <Outlet /> component acts as the render target for child routes inside parent layouts.'
    },
    {
      id: 'p5-l9',
      slug: 'index-routes-default-subviews',
      title: 'Index Routes: Default Child Sub-Views',
      prerequisites: ['p5-l8'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Define default child views using the `index` prop.', 'Render content when visiting the exact parent URL path.', 'Understand index routes vs path="" routes.'],
      explanation: 'When navigating to a parent route like `/dashboard`, which child component should render inside the `<Outlet />`? An index route is the default child route that renders when the parent URL matches exactly and no specific child path was requested: `<Route index element={<DashboardOverview />} />`.',
      whyItExists: 'Provides an intuitive landing view for layout routes without duplicating paths.',
      syntaxRules: 'Use <Route index element={<DefaultView />} /> inside parent route. An index route CANNOT have children.',
      codeExample: `import { Routes, Route } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/dashboard" element={<DashboardLayout />}>\n        {/* Renders when URL is exactly "/dashboard" */}\n        <Route index element={<DashboardOverview />} />\n        {/* Renders when URL is "/dashboard/settings" */}\n        <Route path="settings" element={<Settings />} />\n      </Route>\n    </Routes>\n  );\n}`,
      lineByLine: [
        'Line 8: index prop tells React Router to render DashboardOverview at the exact parent URL /dashboard.',
        'Line 10: Specific child path matches /dashboard/settings.'
      ],
      expectedBehavior: 'Visiting /dashboard shows DashboardOverview inside the layout automatically.',
      commonMistakes: ['Adding path="/" to a child route inside a parent route (resets to domain root!).', 'Trying to nest further child routes inside an index route (index routes cannot have children).'],
      practiceLevels: {
        levelA: 'Configure an index route displaying a welcome message on /profile.',
        levelB: 'Add tabs navigation where the first tab is the index route.',
        levelC: 'Test navigation between index route and child routes.'
      },
      debuggingChallenge: {
        brokenCode: `<Route path="/admin" element={<AdminLayout />}>\n  <Route path="/admin" element={<AdminHome />} /> {/* Redundant path! */}\n</Route>`,
        problem: 'Specifying the full parent path on a child is redundant and error-prone.',
        fix: '<Route index element={<AdminHome />} />'
      },
      conceptualQuestion: {
        question: 'What is an `index` route in React Router?',
        options: [
          'A route that indexes database records.',
          'The default child route that renders inside the parent\'s `<Outlet />` when the user visits the parent\'s exact URL path.',
          'The 404 page.',
          'The route that loads index.html.'
        ],
        correctIndex: 1,
        explanation: 'Index routes specify which component displays by default inside the parent layout when no specific sub-path is in the URL.'
      },
      codeReadingQuestion: {
        snippet: `<Route index element={<Home />} />`,
        question: 'Can an index route define its own child routes?',
        answer: 'No. Index routes are leaf routes and cannot have children.'
      },
      starterCode: `// Assignment: Implement selectActiveChildRoute\n// Given parentPath: '/admin', currentPath: '/admin', childRoutes:\n// [{ index: true, element: 'HOME' }, { path: 'users', element: 'USERS' }]\n// Return matching element string:\n// 1. If currentPath === parentPath -> return index route element\n// 2. If currentPath === parentPath + '/' + child.path -> return that child element\n// 3. Else -> 'NOT_FOUND'\n\nexport function selectActiveChildRoute(parentPath, currentPath, childRoutes) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Selects index route when URL matches parent path exactly',
          run: (fn) => {
            const routes = [
              { index: true, element: 'HOME' },
              { path: 'users', element: 'USERS' }
            ];
            return fn('/admin', '/admin', routes) === 'HOME';
          }
        },
        {
          name: 'Selects named child route when sub-path provided',
          run: (fn) => {
            const routes = [
              { index: true, element: 'HOME' },
              { path: 'users', element: 'USERS' }
            ];
            return fn('/admin', '/admin/users', routes) === 'USERS';
          }
        }
      ],
      hints: [
        'Check if currentPath === parentPath: find child with index: true.'
      ],
      checklist: [
        'Selected index route on exact parent match',
        'Selected child route on path match'
      ],
      revisionSummary: 'Index routes serve as default landing views inside parent layouts when no sub-path is specified.'
    },
    {
      id: 'p5-l10',
      slug: 'not-found-routes-and-404',
      title: 'Not-Found Routes and 404 Handling',
      prerequisites: ['p5-l3'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Catch unmatched URLs using the wildcard path="*".', 'Build friendly 404 error pages with links back home.', 'Nest 404 handlers within specific sub-trees (e.g. /dashboard/*).'],
      explanation: 'When a user mistypes a URL or clicks a broken link, React Router needs to handle the unmatched path gracefully. Placing a `<Route path="*" element={<NotFoundPage />} />` at the bottom of your `<Routes>` tree catches any URL that didn\'t match earlier routes.',
      whyItExists: 'Prevents blank screens and guides users back to valid areas of the application.',
      syntaxRules: 'Declare <Route path="*" element={<NotFound />} /> inside <Routes>. React Router scores routes by specificity, so path="*" has lowest priority.',
      codeExample: `import { Routes, Route, Link } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/" element={<Home />} />\n      <Route path="/curriculum" element={<Curriculum />} />\n      {/* Catch-all 404 Route */}\n      <Route path="*" element={<NotFoundView />} />\n    </Routes>\n  );\n}\n\nfunction NotFoundView() {\n  return (\n    <div className="not-found">\n      <h1>404 — Page Not Found</h1>\n      <p>The lesson or page you requested does not exist.</p>\n      <Link to="/" className="btn-home">Return Home</Link>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 8: path="*" catches any URL not matching "/" or "/curriculum".',
        'Line 17: Provides a clear, friendly recovery link back to the homepage.'
      ],
      expectedBehavior: 'Visiting /invalid-page shows the styled 404 page with navigation links.',
      commonMistakes: ['Placing path="*" at the top of <Routes> in older routing libraries (in v6, React Router automatically picks the most specific match regardless of order, but putting it at the bottom is standard convention).', 'Not styling the 404 page consistently with the rest of the application.'],
      practiceLevels: {
        levelA: 'Build an illustrated 404 page with a "Back to Academy" button.',
        levelB: 'Add a scoped 404 route for unmatched sub-lessons inside /lessons/*.',
        levelC: 'Log 404 occurrences to analytics to track broken links.'
      },
      debuggingChallenge: {
        brokenCode: `// User enters /lessons/xyz-999; page displays completely blank white screen!`,
        problem: 'No wildcard route configured in <Routes>.',
        fix: 'Add <Route path="*" element={<NotFound />} /> at the end of <Routes>.'
      },
      conceptualQuestion: {
        question: 'How does React Router v6 prioritize the wildcard `path="*"` route relative to explicit routes like `path="/about"`?',
        options: [
          'It depends strictly on which route is written first in the file.',
          'React Router v6 uses an intelligent route ranking algorithm that scores explicit paths higher than wildcard paths, ensuring `path="*"` only matches when no other route matches.',
          'Wildcard routes cannot be used in React Router v6.',
          'Wildcards only match numbers.'
        ],
        correctIndex: 1,
        explanation: 'React Router v6 ranks routes by specificity; wildcard paths have the lowest rank and act as true fallbacks.'
      },
      codeReadingQuestion: {
        snippet: `<Route path="users/*" element={<UserSection />} />`,
        question: 'What does the trailing wildcard in "users/*" allow?',
        answer: 'It allows UserSection to render its own nested <Routes> matching deeper paths under /users/.'
      },
      starterCode: `// Assignment: Implement rankRouteSpecificity\n// Rank routes by specificity score:\n// scoreRoute(path)\n// Rules:\n// 1. Wildcard '*' -> score: 0\n// 2. Dynamic param ':id' -> score: 3\n// 3. Static segment (e.g. 'users', 'admin') -> score: 5\n// Split path by '/' (ignore empty segments). Total score = sum of segment scores.\n// Return: { path, score }\n\nexport function scoreRoute(path) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Scores static paths higher than dynamic and wildcard paths',
          run: (fn) => {
            const r1 = fn('/users/admin'); // 5 + 5 = 10
            const r2 = fn('/users/:id');   // 5 + 3 = 8
            const r3 = fn('*');            // 0
            return r1.score === 10 && r2.score === 8 && r3.score === 0;
          }
        }
      ],
      hints: [
        'Filter out empty segments: path.split("/").filter(Boolean); score each segment based on "*", ":", or static.'
      ],
      checklist: [
        'Scored static segments highest',
        'Scored dynamic params medium',
        'Scored wildcards lowest'
      ],
      revisionSummary: 'Use path="*" for catch-all 404 pages to handle invalid URLs gracefully with recovery links.'
    },
    {
      id: 'p5-l11',
      slug: 'route-code-splitting-dynamic-import',
      title: 'Route-Based Code Splitting with React.lazy',
      prerequisites: ['p5-l3', 'p4-l14'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Combine React.lazy() with React Router for on-demand route chunking.', 'Wrap the top-level <Routes> in a single <Suspense> boundary.', 'Inspect network waterfalls during route transitions.'],
      explanation: 'In production React applications, users shouldn\'t load the entire admin portal or complex charts code when visiting the homepage. By combining React.lazy() with React Router, each page is bundled into its own standalone chunk. When a user clicks a route link, the browser downloads only that specific page chunk on demand.',
      whyItExists: 'Cuts initial bundle download sizes from megabytes to kilobytes, boosting performance on mobile devices.',
      syntaxRules: 'const RouteComponent = lazy(() => import("./path")). Wrap <Routes> inside <Suspense fallback={<PageLoader />}>.',
      codeExample: `import { lazy, Suspense } from 'react';\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\n\n// Lazy-loaded route chunks\nconst Home = lazy(() => import('./routes/Home'));\nconst Curriculum = lazy(() => import('./routes/Curriculum'));\nconst Workspace = lazy(() => import('./routes/Workspace'));\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Suspense fallback={<div className="page-loader">Loading view...</div>}>\n        <Routes>\n          <Route path="/" element={<Home />} />\n          <Route path="/curriculum" element={<Curriculum />} />\n          <Route path="/workspace" element={<Workspace />} />\n        </Routes>\n      </Suspense>\n    </BrowserRouter>\n  );\n}`,
      lineByLine: [
        'Line 5-7: Dynamic imports create split chunks in Vite build.',
        'Line 12: A single top-level Suspense handles loading fallback across all routes.'
      ],
      expectedBehavior: 'Opening dev tools Network tab reveals chunk downloads only on navigation.',
      commonMistakes: ['Putting Suspense inside each individual route file instead of wrapping the <Routes> container.', 'Not styling the loading fallback to match the app layout, causing layout shift.'],
      practiceLevels: {
        levelA: 'Convert 3 static route imports to lazy imports.',
        levelB: 'Create a skeleton loader fallback that mimics the page layout.',
        levelC: 'Analyze Vite build output with `npm run build` to view generated chunk files.'
      },
      debuggingChallenge: {
        brokenCode: `// Error: Failed to fetch dynamically imported module ./routes/Admin\n// (User had app open when a new deployment happened, invalidating old chunk hash)`,
        problem: 'New production deployment purged old chunk hashes from the CDN.',
        fix: 'Catch dynamic import errors and prompt user: "A new version is available. [Refresh]".'
      },
      conceptualQuestion: {
        question: 'Where is the optimal placement for the `<Suspense>` boundary when using route-based code splitting?',
        options: [
          'Inside every single paragraph tag.',
          'Wrapping the `<Routes>` container (or inside individual layout shells) to provide a smooth loading state while the route chunk downloads.',
          'Outside the HTML document.',
          'Inside index.html.'
        ],
        correctIndex: 1,
        explanation: 'Wrapping <Routes> in <Suspense> handles the pending promise during chunk download cleanly for all routes.'
      },
      codeReadingQuestion: {
        snippet: `// vite.config.js build output:\n// assets/Workspace-Dk82ja.js  142.12 kB`,
        question: 'What does this file in the build output represent?',
        answer: 'A separate code-split JavaScript chunk generated for the Workspace route.'
      },
      starterCode: `// Assignment: Implement simulateChunkLoader\n// Build an on-demand chunk loader cache:\n// createChunkCache()\n// Returns: async (chunkName, importFn) => moduleExports\n// 1. If chunkName is already cached, return cached module immediately.\n// 2. If not cached, call importFn(), cache the result, and return it.\n\nexport function createChunkCache() {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Loads and caches chunk on first call, reuses on second',
          run: async (fn) => {
            const cache = fn();
            let networkCalls = 0;
            const fetchChunk = async () => { networkCalls++; return { default: 'WorkspaceComponent' }; };
            const m1 = await cache('workspace', fetchChunk);
            const m2 = await cache('workspace', fetchChunk);
            return m1.default === 'WorkspaceComponent' && m2.default === 'WorkspaceComponent' && networkCalls === 1;
          }
        }
      ],
      hints: [
        'Maintain a Map or object in closure to cache chunk promises.'
      ],
      checklist: [
        'Executed import function on first request',
        'Cached module in memory',
        'Prevented duplicate network fetches'
      ],
      revisionSummary: 'Route code splitting with React.lazy downloads code on demand, slashing initial load times.'
    },
    {
      id: 'p5-l12',
      slug: 'search-filter-pagination-urls',
      title: 'Search, Filtering, and Pagination via URLs',
      prerequisites: ['p5-l5'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Build a production-grade data table driven completely by URL state.', 'Synchronize query, filter chips, sort direction, and page numbers with searchParams.', 'Ensure browser Back and Forward restore exact table filter state.'],
      explanation: 'Senior React engineers do not store table filters, sort columns, and page numbers in ephemeral local useState. If a user spends 5 minutes filtering a table of 1,000 items and refreshes the page, local state resets to page 1! Putting `?q=hooks&sort=asc&page=3` into the URL ensures the view survives page refreshes and can be shared with team members.',
      whyItExists: 'Delivers professional, bookmarkable data exploration interfaces.',
      syntaxRules: 'Derive table filter parameters directly from useSearchParams() during render.',
      codeExample: `function CurriculumFilterTable({ lessons }) {\n  const [searchParams, setSearchParams] = useSearchParams();\n\n  // 1. Read state directly from URL query string\n  const q = searchParams.get('q') ?? '';\n  const page = Number(searchParams.get('page') ?? '1');\n  const difficulty = searchParams.get('difficulty') ?? 'all';\n\n  // 2. Derive filtered data during render\n  const filtered = lessons.filter(l => {\n    const matchQ = l.title.toLowerCase().includes(q.toLowerCase());\n    const matchDiff = difficulty === 'all' || l.difficulty === difficulty;\n    return matchQ && matchDiff;\n  });\n\n  return <div>{/* Render table and filter controls */}</div>;\n}`,
      lineByLine: [
        'Line 5-7: Reads query, page, and difficulty directly from URL searchParams.',
        'Line 10-14: Derives filtered dataset purely in render without duplicate useState variables.'
      ],
      expectedBehavior: 'Typing or filtering updates the URL; sharing the URL opens the identical filtered view.',
      commonMistakes: ['Syncing URL params into local useState and trying to keep them in sync with useEffect (creates dual sources of truth!).', 'Not resetting page=1 when the search query changes.'],
      practiceLevels: {
        levelA: 'Build a search input that updates ?q=... with debouncing.',
        levelB: 'Add pagination controls that increment/decrement the ?page= param.',
        levelC: 'Reset page=1 whenever difficulty filter changes.'
      },
      debuggingChallenge: {
        brokenCode: `// User is on page 5 of 'All'. User selects 'Advanced' (only 1 item matches).\n// Table displays: "No items on page 5!"`,
        problem: 'Changing filters did not reset page back to 1.',
        fix: 'When setting filter, also reset page: setSearchParams({ ...params, difficulty: "Advanced", page: "1" });'
      },
      conceptualQuestion: {
        question: 'Why should table pagination and filters be derived directly from `searchParams` rather than copying them into `useState`?',
        options: [
          'Copying URL state into local useState creates two sources of truth that can easily go out of sync, requiring complex syncing effects.',
          'searchParams runs on a faster CPU thread.',
          'useState is not allowed in table components.',
          'Because URLs are encrypted.'
        ],
        correctIndex: 0,
        explanation: 'Treating the URL as the single source of truth eliminates state synchronization bugs and keeps views bookmarkable.'
      },
      codeReadingQuestion: {
        snippet: `const updateFilter = (diff) => setSearchParams(prev => { prev.set('diff', diff); prev.set('page', '1'); return prev; });`,
        question: 'Why does this handler explicitly set page to "1"?',
        answer: 'To prevent displaying an out-of-bounds empty page when the filtered results count shrinks.'
      },
      starterCode: `// Assignment: Implement buildUrlFilterState\n// Derive table pagination and filters:\n// filterLessonsByUrl(lessons, searchParamsObj)\n// lessons: [{ id, title, difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }]\n// searchParamsObj: { q?: string, difficulty?: string, page?: string, pageSize?: number }\n// 1. Filter by q (case-insensitive substring match on title)\n// 2. Filter by difficulty (if defined and !== 'all')\n// 3. Paginate: slice items for given page (default 1) and pageSize (default 5)\n// Return: { totalMatches: number, totalPages: number, currentPage: number, items: any[] }\n\nexport function filterLessonsByUrl(lessons, searchParamsObj = {}) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Filters by query and paginates items accurately',
          run: (fn) => {
            const list = [
              { id: 1, title: 'React Hooks Intro', difficulty: 'Beginner' },
              { id: 2, title: 'Hooks Deep Dive', difficulty: 'Advanced' },
              { id: 3, title: 'Redux Basics', difficulty: 'Intermediate' }
            ];
            const res = fn(list, { q: 'hooks', page: '1', pageSize: 1 });
            return res.totalMatches === 2 && res.totalPages === 2 && res.items.length === 1 && res.items[0].id === 1;
          }
        }
      ],
      hints: [
        'Filter first, compute totalPages = Math.ceil(filtered.length / pageSize), then slice((page - 1) * pageSize, page * pageSize).'
      ],
      checklist: [
        'Filtered by query string',
        'Filtered by difficulty',
        'Calculated pagination metadata and sliced items'
      ],
      revisionSummary: 'Use the URL as the single source of truth for table filtering, sorting, and pagination.'
    },
    {
      id: 'p5-l13',
      slug: 'protected-routes-auth-navigation',
      title: 'Protected Routes and Authentication Navigation',
      prerequisites: ['p5-l3', 'p3-l10'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Create a <ProtectedRoute> wrapper checking authentication state.', 'Redirect unauthenticated users to /login using <Navigate replace />.', 'Remember original destination via location.state to return user after login.'],
      explanation: 'Certain screens (like account settings, admin dashboards, or private workspaces) should only be accessible to logged-in users. In React Router, we create a `<ProtectedRoute>` wrapper that inspects the current user authentication state. If authenticated, it renders `<Outlet />`; if not, it renders `<Navigate to="/login" replace state={{ from: location }} />`.',
      whyItExists: 'Enforces client-side authorization and delivers seamless post-login redirects.',
      syntaxRules: 'Pass location state: <Navigate to="/login" state={{ from: location }} replace /> to return to original page after login.',
      codeExample: `import { Navigate, Outlet, useLocation } from 'react-router-dom';\nimport { useAuth } from '../context/AuthContext';\n\nexport function ProtectedRoute() {\n  const { user, isLoading } = useAuth();\n  const location = useLocation();\n\n  if (isLoading) return <LoadingSpinner />;\n\n  // Redirect to login if unauthenticated, saving original target URL\n  if (!user) {\n    return <Navigate to="/login" state={{ from: location }} replace />;\n  }\n\n  return <Outlet />; // Render child route if authenticated\n}`,
      lineByLine: [
        'Line 8: Waits for auth status to verify before making redirect decision.',
        'Line 12: Redirects to /login, saving current location in history state.',
        'Line 15: If user exists, renders the protected child routes via <Outlet />.'
      ],
      expectedBehavior: 'Unauthenticated users are redirected to login; once logged in, they are redirected back to where they started.',
      commonMistakes: ['Redirecting before auth state finishes loading (causes false redirects to login on page refresh).', 'Forgetting replace prop, creating messy history loops.'],
      practiceLevels: {
        levelA: 'Wrap an admin route in ProtectedRoute checking user.role === "admin".',
        levelB: 'Implement post-login redirect using location.state?.from?.pathname ?? "/".',
        levelC: 'Display an "Access Denied 403" view for unauthorized roles.'
      },
      debuggingChallenge: {
        brokenCode: `function Protected() {\n  const { user } = useAuth(); // Initial state: user = null, isLoading = true\n  if (!user) return <Navigate to="/login" />; // Flashes to login before auth token verifies!\n}`,
        problem: 'Fails to wait for auth verification to complete before redirecting.',
        fix: 'if (isLoading) return <Spinner />; before checking !user.'
      },
      conceptualQuestion: {
        question: 'Why does `<Navigate to="/login" state={{ from: location }} replace />` save `from: location` in state?',
        options: [
          'To report the user IP address.',
          'So the login page can read `location.state.from` and redirect the user back to the exact page they were trying to access after successful authentication.',
          'To encrypt password fields.',
          'It is required by the browser.'
        ],
        correctIndex: 1,
        explanation: 'Saving the attempted location enables the login page to send the user right back to where they originally intended to go.'
      },
      codeReadingQuestion: {
        snippet: `const from = location.state?.from?.pathname || '/dashboard';\nnavigate(from, { replace: true });`,
        question: 'When is this code typically executed?',
        answer: 'Immediately upon successful login form submission.'
      },
      starterCode: `// Assignment: Implement evaluateRouteAccess\n// Determine route authorization decision:\n// evaluateRouteAccess({ user, requiredRole, isLoading, currentPath })\n// 1. If isLoading is true -> return { canAccess: false, action: 'SHOW_SPINNER' }\n// 2. If !user -> return { canAccess: false, action: 'REDIRECT_LOGIN', redirectTo: '/login', state: { from: currentPath } }\n// 3. If requiredRole && user.role !== requiredRole -> return { canAccess: false, action: 'SHOW_FORBIDDEN_403' }\n// 4. Otherwise -> return { canAccess: true, action: 'RENDER_OUTLET' }\n\nexport function evaluateRouteAccess({ user, requiredRole, isLoading, currentPath }) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Redirects unauthenticated user with saved from path',
          run: (fn) => {
            const res = fn({ user: null, isLoading: false, currentPath: '/settings' });
            return res.canAccess === false && res.action === 'REDIRECT_LOGIN' && res.state.from === '/settings';
          }
        },
        {
          name: 'Blocks access when user lacks required role',
          run: (fn) => {
            const res = fn({ user: { role: 'member' }, requiredRole: 'admin', isLoading: false, currentPath: '/admin' });
            return res.canAccess === false && res.action === 'SHOW_FORBIDDEN_403';
          }
        },
        {
          name: 'Permits authenticated authorized user',
          run: (fn) => {
            const res = fn({ user: { role: 'admin' }, requiredRole: 'admin', isLoading: false, currentPath: '/admin' });
            return res.canAccess === true && res.action === 'RENDER_OUTLET';
          }
        }
      ],
      hints: [
        'Check conditions in priority order: isLoading, !user, role check, allow access.'
      ],
      checklist: [
        'Handled loading state',
        'Redirected unauthenticated visitors with from state',
        'Enforced role-based access control',
        'Permitted valid users'
      ],
      revisionSummary: 'Protected routes guard private sub-trees, redirecting unauthenticated users to login with state for post-login return.'
    },
    {
      id: 'p5-l14',
      slug: 'react-router-loaders-and-actions',
      title: 'React Router Data APIs: Loaders and Actions',
      prerequisites: ['p5-l13'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: ['Fetch data before rendering components using router `loader` functions.', 'Handle form mutations with router `action` functions.', 'Read loader data in components with `useLoaderData()`.'],
      explanation: 'Modern React Router (createBrowserRouter) provides framework-level data loading APIs. A `loader` runs BEFORE the component renders, eliminating "fetch-on-render" loading waterfalls. Inside the component, `useLoaderData()` synchronously returns the fetched data. Form mutations are handled via `action` functions, which automatically revalidate loader data upon completion.',
      whyItExists: 'Eliminates cascading loading spinners and automates cache revalidation after data mutations.',
      syntaxRules: 'export async function loader({ params }) { return fetch(...); }. In component: const data = useLoaderData().',
      codeExample: `// Modern Data Router API\nimport { createBrowserRouter, useLoaderData } from 'react-router-dom';\n\n// 1. Loader runs BEFORE component renders\nexport async function lessonLoader({ params }) {\n  const res = await fetch(\`/api/lessons/\${params.lessonId}\`);\n  if (!res.ok) throw new Response('Not Found', { status: 404 });\n  return res.json();\n}\n\n// 2. Component receives data synchronously\nexport function LessonView() {\n  const lesson = useLoaderData();\n  return <h1>{lesson.title}</h1>;\n}`,
      lineByLine: [
        'Line 5: loader fetches data in parallel with code bundle loading.',
        'Line 13: useLoaderData() provides resolved data instantly with zero local useState or useEffect.'
      ],
      expectedBehavior: 'Component renders immediately with data, eliminating intermediate loading spinners.',
      commonMistakes: ['Using useLoaderData in components not rendered by a createBrowserRouter data route.', 'Not handling 404 responses inside the loader.'],
      practiceLevels: {
        levelA: 'Define a loader function fetching user profile data.',
        levelB: 'Use a Form action to submit a review and observe automatic revalidation.',
        levelC: 'Configure an errorElement on a data route to catch loader rejections.'
      },
      debuggingChallenge: {
        brokenCode: `// Error: useLoaderData must be used within a data router.`,
        problem: 'App was initialized with legacy <BrowserRouter> instead of createBrowserRouter().',
        fix: 'Use createBrowserRouter(routes) with <RouterProvider router={router} />.'
      },
      conceptualQuestion: {
        question: 'What is the primary architectural advantage of React Router `loader` functions over fetching data in `useEffect`?',
        options: [
          'Loaders can only run on Node.js.',
          'Loaders fetch data in parallel as soon as navigation starts—before the component mounts—eliminating "fetch-on-render" waterfalls and nested loading spinners.',
          'Loaders replace MongoDB.',
          'Loaders do not use HTTP.'
        ],
        correctIndex: 1,
        explanation: 'Loaders initiate data fetching in parallel with route chunk downloads before components mount, ending waterfall delays.'
      },
      codeReadingQuestion: {
        snippet: `export async function action({ request }) {\n  const formData = await request.formData();\n  return saveItem(formData);\n}`,
        question: 'What happens to active route loaders after an action completes in React Router?',
        answer: 'React Router automatically re-runs active loaders to revalidate and refresh the screen with the latest server data.'
      },
      starterCode: `// Assignment: Implement executeLoaderPipeline\n// Simulate a route loader execution pipeline:\n// executeLoaderPipeline(loaderFn, params)\n// If loaderFn succeeds -> return { ok: true, data: result, status: 200 }\n// If loaderFn throws error with status -> return { ok: false, error: err.message, status: err.status || 500 }\n\nexport async function executeLoaderPipeline(loaderFn, params) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Resolves data cleanly from loader',
          run: async (fn) => {
            const loader = async ({ id }) => ({ title: 'Lesson ' + id });
            const res = await fn(loader, { id: 'p1' });
            return res.ok === true && res.data.title === 'Lesson p1' && res.status === 200;
          }
        },
        {
          name: 'Catches loader failure and captures status',
          run: async (fn) => {
            const failingLoader = async () => {
              const err = new Error('Lesson not found');
              err.status = 404;
              throw err;
            };
            const res = await fn(failingLoader, { id: 'invalid' });
            return res.ok === false && res.status === 404;
          }
        }
      ],
      hints: [
        'Use try/catch around await loaderFn(params).'
      ],
      checklist: [
        'Passed params to loader function',
        'Captured successful response',
        'Handled loader exceptions and HTTP status codes'
      ],
      revisionSummary: 'React Router loaders fetch data before render to eliminate waterfalls; actions mutate data and revalidate loaders automatically.'
    },
    {
      id: 'p5-l15',
      slug: 'url-state-vs-local-component-state',
      title: 'URL State versus Local Component State Decision Matrix',
      prerequisites: ['p5-l5', 'p5-l12'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the architectural decision matrix between URL state and local state.', 'Identify what data MUST be in the URL vs what MUST stay in memory.', 'Build cohesive, production-grade state architectures.'],
      explanation: 'Every piece of frontend state must live in the right place. Ask: "Should a user be able to copy the URL, paste it into an incognito window or Slack, and see the exact same thing?" If YES: it belongs in the URL (active tab, search filter, page number, selected entity ID). If NO: it belongs in local component state (input cursor focus, hover tooltips, form draft in progress).',
      whyItExists: 'Prevents state architecture anti-patterns and ensures applications behave like real web pages.',
      syntaxRules: 'Shareable / Bookmarkable -> URL. Transient / Private -> useState / useRef.',
      codeExample: `// State Decision Matrix\n// 1. URL State (Search Params & Route Params)\n// - Active Tab: ?tab=assignments\n// - Search Filter: ?q=hooks\n// - Pagination: ?page=3\n// - Active Lesson: /lessons/p3-l15\n\n// 2. Local Component State (useState / useRef)\n// - Modal open/close: useState(false)\n// - Hover tooltip: useState(false)\n// - Draft comment keystrokes: useState('')\n// - Interval timer ID: useRef(null)`,
      lineByLine: [
        'Line 2-6: URL state allows sharing and bookmarking.',
        'Line 8-12: Local state encapsulates private, transient interactions.'
      ],
      expectedBehavior: 'Clean division between shareable URL state and private component memory.',
      commonMistakes: ['Putting passwords or secrets in URL search params (visible in browser history and server logs!).', 'Hiding active tab state in useState, breaking the Back button.'],
      practiceLevels: {
        levelA: 'Categorize 10 real-world data points into URL State vs Local State.',
        levelB: 'Migrate a multi-tab view from useState to URL query params.',
        levelC: 'Audit a complex dashboard for state placement compliance.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev puts sensitive credit card token in URL query string: ?token=secret_123`,
        problem: 'URLs are stored in browser history, HTTP Referer headers, and proxy access logs; secrets in URLs are security vulnerabilities.',
        fix: 'Store sensitive tokens in memory or HTTP-only secure cookies, never in URL parameters.'
      },
      conceptualQuestion: {
        question: 'Which of the following data items should NOT be stored in URL parameters?',
        options: [
          'The active search query string (?q=react)',
          'The current page number (?page=2)',
          'The user\'s secret API authentication key or password',
          'The active tab name (?tab=reviews)'
        ],
        correctIndex: 2,
        explanation: 'URLs are logged in browser history, server access logs, and referrer headers; sensitive secrets must never be placed in URLs.'
      },
      codeReadingQuestion: {
        snippet: `// Is active accordion index better in URL or local state?`,
        question: 'If you want users to be able to link directly to FAQ Question #4, where should the open state live?',
        answer: 'In the URL (e.g. ?faq=4 or hash #faq-4).'
      },
      starterCode: `// Assignment: Implement classifyStateDestination\n// Classify state placement according to the architectural decision matrix:\n// classifyStateDestination(dataItem)\n// dataItem: { name: string, isShareable: boolean, containsSensitiveSecret: boolean, isTransientInteraction: boolean }\n// 1. If containsSensitiveSecret is true -> 'MEMORY_STATE' (never in URL!)\n// 2. If isTransientInteraction is true -> 'LOCAL_COMPONENT_STATE'\n// 3. If isShareable is true -> 'URL_STATE'\n// 4. Else -> 'LOCAL_COMPONENT_STATE'\n\nexport function classifyStateDestination(dataItem) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Categorizes shareable non-secret items to URL',
          run: (fn) => {
            const res = fn({ name: 'filter', isShareable: true, containsSensitiveSecret: false, isTransientInteraction: false });
            return res === 'URL_STATE';
          }
        },
        {
          name: 'Keeps secrets and transient interactions out of URL',
          run: (fn) => {
            const secret = fn({ name: 'apiKey', isShareable: true, containsSensitiveSecret: true, isTransientInteraction: false });
            const hover = fn({ name: 'tooltipHover', isShareable: false, containsSensitiveSecret: false, isTransientInteraction: true });
            return secret === 'MEMORY_STATE' && hover === 'LOCAL_COMPONENT_STATE';
          }
        }
      ],
      hints: [
        'Check containsSensitiveSecret first, then isTransientInteraction, then isShareable.'
      ],
      checklist: [
        'Protected sensitive secrets from URL leakage',
        'Assigned shareable state to URL',
        'Assigned transient UI interactions to local state'
      ],
      revisionSummary: 'Use URL state for shareable, bookmarkable data (filters, tabs, pages); use local memory for transient and private interactions.'
    }
  ]
};
