// Phase 3: React Hooks
export const phase3 = {
  id: 'phase-3',
  title: 'Phase 3 — React Hooks',
  description: 'Master every everyday and specialized React hook: useEffect synchronization, race condition avoidance, useRef DOM vs mutable refs, useContext, useReducer, useCallback/useMemo referential caching, custom hooks, Concurrent hooks (useTransition, useDeferredValue), useSyncExternalStore, and React 19 hooks (useActionState, useOptimistic).',
  icon: 'Anchor',
  badge: 'Hooks Mastery',
  estimatedHours: 16,
  lessons: [
    {
      id: 'p3-l1',
      slug: 'usestate-deep-dive',
      title: 'useState: State Snapshots and Functional Updates',
      prerequisites: ['p1-l16'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Master lazy initial state with useState(() => expensiveCalc()).', 'Understand state snapshots in asynchronous closures.', 'Safely batch and queue functional state updates.'],
      explanation: 'useState is React\'s core primitive for local memory. Passing a function to useState (useState(() => init())) runs only once during initial mount (lazy initialization). Inside any given render, state is a constant snapshot; calling setState schedules an update for the next render.',
      whyItExists: 'Allows components to hold dynamic, interactive data that survives re-renders.',
      syntaxRules: 'Use functional initializer for expensive setups: useState(() => parseLargeData()). Use functional updaters for sequential updates: setCount(c => c + 1).',
      codeExample: `function Counter() {\n  // Lazy initialization runs once\n  const [count, setCount] = useState(() => {\n    const saved = localStorage.getItem('count');\n    return saved ? Number(saved) : 0;\n  });\n\n  return (\n    <button onClick={() => setCount(prev => prev + 1)}>\n      Count: {count}\n    </button>\n  );\n}`,
      lineByLine: [
        'Line 3-6: Function passed to useState runs only on initial mount, avoiding reading localStorage on every re-render.',
        'Line 9: Functional updater prev => prev + 1 guarantees access to the latest queued state.'
      ],
      expectedBehavior: 'State initializes once and updates smoothly with no stale snapshot bugs.',
      commonMistakes: ['Calling expensive functions directly: useState(expensiveCalculation()) runs on EVERY render, wasting CPU.', 'Assuming count updates immediately on the next line after setCount(5).'],
      practiceLevels: {
        levelA: 'Convert a direct localStorage read into a lazy useState initializer.',
        levelB: 'Queue three sequential state updates in a single event handler.',
        levelC: 'Build an undoable counter with past state snapshot stack.'
      },
      debuggingChallenge: {
        brokenCode: `function BadInit() {\n  const [data, setData] = useState(JSON.parse(localStorage.getItem('huge'))); // Slow!\n}`,
        problem: 'JSON.parse runs on every single render, degrading performance.',
        fix: 'Pass a callback: useState(() => JSON.parse(localStorage.getItem("huge")))'
      },
      conceptualQuestion: {
        question: 'Why should an expensive calculation passed to useState be wrapped in a function (e.g. useState(() => calculate()))?',
        options: [
          'Because React only accepts functions in useState.',
          'Lazy initialization ensures the expensive calculation executes only once on mount, rather than repeating on every single re-render.',
          'It forces the calculation to run on a background thread.',
          'It enables TypeScript type inference.'
        ],
        correctIndex: 1,
        explanation: 'Passing a function causes React to run it only during initial mount, ignoring it on subsequent re-renders.'
      },
      codeReadingQuestion: {
        snippet: `const [x, setX] = useState(0);\nconst click = () => { setX(x + 1); console.log(x); };`,
        question: 'What is logged if x was 0 before click?',
        answer: '0 (state is a snapshot; setX does not mutate x in the current render execution).'
      },
      starterCode: `// Assignment: Implement simulateLazyInit\n// Build a simulator function simulateLazyInit(initializer, isFirstMount)\n// 1. If isFirstMount is true: if initializer is a function, call it and return its value; else return initializer.\n// 2. If isFirstMount is false: return 'REUSED_EXISTING_STATE' without calling initializer!\n// Return { state: any, invokedInitializer: boolean }\n\nexport function simulateLazyInit(initializer, isFirstMount) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Invokes initializer only on first mount',
          run: (fn) => {
            let called = false;
            const initFn = () => { called = true; return 42; };
            const m1 = fn(initFn, true);
            const m2 = fn(initFn, false);
            return m1.state === 42 && m1.invokedInitializer === true && m2.state === 'REUSED_EXISTING_STATE' && m2.invokedInitializer === false;
          }
        }
      ],
      hints: [
        'Check isFirstMount: if true, execute function if typeof is function, set invokedInitializer: true.'
      ],
      checklist: [
        'Called function initializer on mount',
        'Skipped evaluation on subsequent renders',
        'Returned correct diagnostic result'
      ],
      revisionSummary: 'Use useState(() => init) for lazy mount-only initialization; use prev => next updaters for sequential updates.'
    },
    {
      id: 'p3-l2',
      slug: 'useeffect-fundamentals',
      title: 'useEffect: Synchronizing with External Systems',
      prerequisites: ['p3-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Define what an effect is: synchronizing React with non-React systems (DOM, APIs, timers, WebSockets).', 'Trace the effect execution timeline (Render -> DOM Paint -> useEffect).', 'Differentiate effect execution from event handlers.'],
      explanation: 'useEffect lets you synchronize a component with an external system. Unlike event handlers (which run in response to specific user actions like clicks), effects run AFTER React renders and paints the DOM to the screen. An effect should not be used to compute derived state or handle direct user clicks.',
      whyItExists: 'Provides an escape hatch from React\'s pure declarative model to interact with the outside browser/network world.',
      syntaxRules: 'useEffect(setupFunction, [dependencies]). The setup function runs after render. If it returns a function, that is the cleanup function.',
      codeExample: `import { useEffect, useState } from 'react';\n\nfunction WindowTitleUpdater({ title }) {\n  useEffect(() => {\n    // Synchronize document title with external browser window\n    document.title = \`Academy | \${title}\`;\n  }, [title]); // Re-runs only when title changes\n\n  return <h2>Current Page: {title}</h2>;\n}`,
      lineByLine: [
        'Line 4: useEffect runs after React finishes painting the DOM.',
        'Line 6: document.title synchronizes with the outside browser tab.',
        'Line 7: [title] dependency array tells React to re-run this effect only when title prop changes.'
      ],
      expectedBehavior: 'Browser title updates whenever title prop changes, without blocking visual rendering.',
      commonMistakes: ['Using useEffect to calculate values from state (should be derived in render).', 'Forgetting dependency arrays, causing effects to run on every single keystroke.'],
      practiceLevels: {
        levelA: 'Synchronize document.title to show active lesson name.',
        levelB: 'Attach an event listener to window.addEventListener("resize") with cleanup.',
        levelC: 'Connect to an external WebSocket with message subscription.'
      },
      debuggingChallenge: {
        brokenCode: `function Title({ name }) {\n  document.title = name; // Direct side-effect in render!\n  return <h1>{name}</h1>;\n}`,
        problem: 'Directly mutating document.title during render violates rendering purity.',
        fix: 'Wrap inside useEffect(() => { document.title = name; }, [name]);'
      },
      conceptualQuestion: {
        question: 'When does the callback inside useEffect execute relative to browser paint?',
        options: [
          'Synchronously before React updates the DOM.',
          'Asynchronously after React updates the DOM and the browser has painted the screen.',
          'Before the component function runs.',
          'During the compilation step in Vite.'
        ],
        correctIndex: 1,
        explanation: 'useEffect is deferred until after the browser paints the screen, ensuring side-effects do not block visual rendering.'
      },
      codeReadingQuestion: {
        snippet: `useEffect(() => { console.log('A'); });\nuseEffect(() => { console.log('B'); }, []);`,
        question: 'How often do effect A and effect B run?',
        answer: 'Effect A runs after EVERY render (no dependency array). Effect B runs ONLY ONCE after initial mount (empty dependency array).'
      },
      starterCode: `// Assignment: Implement classifyEffectNecessity\n// Audit whether an operation requires useEffect or should be done elsewhere:\n// classifyEffectNecessity(operationType)\n// Permitted in useEffect: 'DOCUMENT_TITLE', 'LOCAL_STORAGE_SYNC', 'WEBSOCKET_LISTEN', 'TIMER_SETUP', 'THIRD_PARTY_WIDGET'\n// NOT in useEffect: 'DERIVED_CALCULATION' (do in render), 'USER_CLICK_ACTION' (do in onClick), 'FORM_SUBMIT' (do in onSubmit)\n// Return: { requiresEffect: boolean, recommendedLocation: 'useEffect' | 'render' | 'event_handler' }\n\nexport function classifyEffectNecessity(operationType) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Correctly assigns external synchronizations to useEffect',
          run: (fn) => {
            const r1 = fn('DOCUMENT_TITLE');
            const r2 = fn('WEBSOCKET_LISTEN');
            return r1.requiresEffect === true && r1.recommendedLocation === 'useEffect' && r2.requiresEffect === true;
          }
        },
        {
          name: 'Recommends render or event handler for non-effects',
          run: (fn) => {
            const r1 = fn('DERIVED_CALCULATION');
            const r2 = fn('USER_CLICK_ACTION');
            return r1.requiresEffect === false && r1.recommendedLocation === 'render' && r2.requiresEffect === false && r2.recommendedLocation === 'event_handler';
          }
        }
      ],
      hints: [
        'Check operationType against categories and return appropriate recommendedLocation.'
      ],
      checklist: [
        'Classified external system synchronizations',
        'Separated derived render calculations',
        'Separated user event handlers'
      ],
      revisionSummary: 'useEffect synchronizes React components with external systems and runs after browser paint.'
    },
    {
      id: 'p3-l3',
      slug: 'effect-dependencies-reactive-values',
      title: 'Effect Dependencies and Reactive Values',
      prerequisites: ['p3-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify reactive values (props, state, and variables derived from them).', 'Satisfy the exhaustive-deps rule honestly.', 'Understand dependency comparison using Object.is.'],
      explanation: 'Every reactive value referenced inside an effect MUST be declared in its dependency array. Reactive values include props, state, and any variable or function created inside the component body. React compares dependencies between renders using Object.is(). If any dependency changed, the effect re-runs.',
      whyItExists: 'Prevents stale closure bugs where effects read outdated props or state.',
      syntaxRules: 'Never lie to React by omitting a reactive dependency to stop re-running. If an effect runs too often, remove the dependency by making the value non-reactive or moving it inside the effect.',
      codeExample: `function ChatRoom({ roomId, serverUrl }) {\n  useEffect(() => {\n    // roomId and serverUrl are reactive values used inside the effect!\n    const connection = createConnection(serverUrl, roomId);\n    connection.connect();\n    return () => connection.disconnect();\n  }, [roomId, serverUrl]); // Declared honestly in deps!\n}`,
      lineByLine: [
        'Line 4: serverUrl and roomId are props used inside the effect.',
        'Line 7: [roomId, serverUrl] tells React to reconnect whenever either prop changes.'
      ],
      expectedBehavior: 'Effect re-runs if and only if roomId or serverUrl change referentially.',
      commonMistakes: ['Suppressing eslint-plugin-react-hooks/exhaustive-deps warning with // eslint-disable.', 'Creating objects or functions in render and putting them in deps (causing infinite re-runs).'],
      practiceLevels: {
        levelA: 'Identify all reactive values in an effect and list them in the dependency array.',
        levelB: 'Move a function declaration inside useEffect to remove it from dependencies.',
        levelC: 'Use updater callbacks (setCount(c => c + 1)) to remove count from dependencies.'
      },
      debuggingChallenge: {
        brokenCode: `function Timer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => {\n      setCount(count + 1); // Uses count!\n    }, 1000);\n    return () => clearInterval(id);\n  }, []); // Lying to React: omitted count!\n}`,
        problem: 'count is frozen at 0 inside the closure; timer stays stuck at 1 forever.',
        fix: 'Use functional updater: setCount(c => c + 1) and keep [] deps, or add [count].'
      },
      conceptualQuestion: {
        question: 'What is a "reactive value" in React?',
        options: [
          'Any variable defined using the `var` keyword.',
          'Any value (props, state, or variables calculated from them) that participates in the React data flow and can change on re-render.',
          'An external library like RxJS.',
          'A CSS animation.'
        ],
        correctIndex: 1,
        explanation: 'Props, state, and all variables derived from them are reactive because their values change across render cycles.'
      },
      codeReadingQuestion: {
        snippet: `const options = { server: 'https://api.com' }; // declared in render\nuseEffect(() => { connect(options); }, [options]);`,
        question: 'Why does this effect run on EVERY render?',
        answer: 'options is an object recreated with a new memory address on every render, making Object.is(prev, next) always false.'
      },
      starterCode: `// Assignment: Implement evaluateDepsDifference\n// Simulate React\'s dependency comparison algorithm:\n// evaluateDepsDifference(prevDeps, nextDeps)\n// 1. If prevDeps is null/undefined (no deps passed) -> return { hasChanged: true, reason: 'NO_DEPS' }\n// 2. If prevDeps.length !== nextDeps.length -> return { hasChanged: true, reason: 'DEPS_LENGTH_MISMATCH' }\n// 3. Compare each element with Object.is(prev[i], next[i]).\n// If all match -> return { hasChanged: false }\n// If any differs -> return { hasChanged: true, changedIndex: i, reason: 'VALUE_CHANGED' }\n\nexport function evaluateDepsDifference(prevDeps, nextDeps) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Bails out when all dependencies are identical via Object.is',
          run: (fn) => {
            const res = fn([1, 'a', true], [1, 'a', true]);
            return res.hasChanged === false;
          }
        },
        {
          name: 'Detects changed dependency and identifies index',
          run: (fn) => {
            const res = fn([1, 'old'], [1, 'new']);
            return res.hasChanged === true && res.changedIndex === 1 && res.reason === 'VALUE_CHANGED';
          }
        },
        {
          name: 'Identifies missing deps array',
          run: (fn) => {
            return fn(null, null).hasChanged === true && fn(null, null).reason === 'NO_DEPS';
          }
        }
      ],
      hints: [
        'Use Object.is(prevDeps[i], nextDeps[i]) in a loop.'
      ],
      checklist: [
        'Handled no-deps condition',
        'Compared using Object.is',
        'Reported change index'
      ],
      revisionSummary: 'All reactive values must be declared in dependencies; comparison is performed via Object.is.'
    },
    {
      id: 'p3-l4',
      slug: 'effect-cleanup-functions',
      title: 'Effect Cleanup Functions',
      prerequisites: ['p3-l3'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Return a cleanup function from useEffect to prevent memory leaks.', 'Understand when cleanup runs: before effect re-runs AND on unmount.', 'Clean up subscriptions, event listeners, timers, and abort requests.'],
      explanation: 'If an effect sets up something (like subscribing to a chat room, adding a window event listener, or starting a timer), it MUST clean it up. React executes your cleanup function whenever the effect is about to re-run (with new dependencies) and when the component unmounts.',
      whyItExists: 'Prevents memory leaks, duplicate event handlers, and callbacks firing on unmounted components.',
      syntaxRules: 'Return a synchronous function: return () => { cleanup(); }. Never return a Promise or anything other than a cleanup function.',
      codeExample: `function MouseTracker() {\n  const [coords, setCoords] = useState({ x: 0, y: 0 });\n\n  useEffect(() => {\n    const handleMove = (e) => setCoords({ x: e.clientX, y: e.clientY });\n    window.addEventListener('pointermove', handleMove);\n\n    // CLEANUP FUNCTION: Undo setup when component unmounts\n    return () => {\n      window.removeEventListener('pointermove', handleMove);\n    };\n  }, []); // Run on mount, clean on unmount\n}`,
      lineByLine: [
        'Line 6: Adds the pointermove listener to the global window.',
        'Line 9-11: Cleanup function removes the listener, preventing memory leaks when navigating away.'
      ],
      expectedBehavior: 'Listener remains active only while MouseTracker is mounted.',
      commonMistakes: ['Forgetting cleanup on intervals or window listeners, causing duplicate executions.', 'Returning an async function from useEffect (which returns a Promise, not a cleanup function).'],
      practiceLevels: {
        levelA: 'Clean up a setInterval timer with clearInterval.',
        levelB: 'Clean up an IntersectionObserver monitoring a scroll element.',
        levelC: 'Test cleanup in React StrictMode to verify setup/cleanup symmetry.'
      },
      debuggingChallenge: {
        brokenCode: `useEffect(() => {\n  const timer = setInterval(() => tick(), 1000);\n  // Missing cleanup!\n}, []);`,
        problem: 'Every time the component mounts/unmounts, a ghost timer stays running forever in browser memory.',
        fix: 'return () => clearInterval(timer);'
      },
      conceptualQuestion: {
        question: 'When does the cleanup function returned by useEffect execute?',
        options: [
          'Only when the entire browser window is closed.',
          'Before the effect re-runs with new dependencies, and when the component unmounts.',
          'Synchronously during the render phase.',
          'Only when an uncaught error occurs.'
        ],
        correctIndex: 1,
        explanation: 'React invokes the previous effect\'s cleanup function before running the new effect with updated dependencies, as well as on component unmount.'
      },
      codeReadingQuestion: {
        snippet: `useEffect(() => {\n  console.log('Setup ' + id);\n  return () => console.log('Clean ' + id);\n}, [id]);`,
        question: 'If id changes from 1 to 2, what is logged in order?',
        answer: '"Clean 1" then "Setup 2" (React cleans up the old effect before running the new one).'
      },
      starterCode: `// Assignment: Implement simulateEffectLifecycle\n// Simulate execution of an effect with cleanup across dependencies:\n// simulateEffectLifecycle(effectRunner, sequenceOfDeps)\n// sequenceOfDeps: array of dependency values, e.g. ['room1', 'room2']\n// effectRunner(dep): returns a cleanup callback\n// Track execution log: string[] (e.g. ['SETUP: room1', 'CLEANUP: room1', 'SETUP: room2'])\n// On final unmount, run final cleanup.\n\nexport function simulateEffectLifecycle(effectRunner, sequenceOfDeps) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Cleans up previous effect before running next and on final unmount',
          run: (fn) => {
            const logs = [];
            const runner = (id) => {
              logs.push('SETUP: ' + id);
              return () => logs.push('CLEANUP: ' + id);
            };
            fn(runner, ['A', 'B']);
            return JSON.stringify(logs) === JSON.stringify([
              'SETUP: A',
              'CLEANUP: A',
              'SETUP: B',
              'CLEANUP: B'
            ]);
          }
        }
      ],
      hints: [
        'Iterate over deps; if activeCleanup exists, invoke it before calling effectRunner(dep).'
      ],
      checklist: [
        'Called setup on first dep',
        'Called previous cleanup before subsequent setup',
        'Executed final unmount cleanup'
      ],
      revisionSummary: 'Always return a cleanup function from useEffect to undo subscriptions, timers, and listeners.'
    },
    {
      id: 'p3-l5',
      slug: 'strictmode-development-behavior',
      title: 'StrictMode\'s Development Behavior & Effects',
      prerequisites: ['p3-l4', 'p1-l4'],
      estimatedDuration: '20 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand why React mounts, unmounts, and re-mounts components in development.', 'Verify that effect setup and cleanup are symmetrical.', 'Avoid writing non-idempotent setup functions.'],
      explanation: 'In development mode under <React.StrictMode>, React simulates an immediate remount: Mount -> Unmount -> Mount. This means your useEffect executes: Setup -> Cleanup -> Setup. React does this intentionally to prove that your cleanup function properly resets everything the setup function created.',
      whyItExists: 'Surfaces missing cleanups, lingering network requests, and broken subscriptions before production.',
      syntaxRules: 'If your effect breaks in development because it runs twice, DO NOT remove StrictMode! Fix your cleanup function so that Setup + Cleanup returns the component to its baseline state.',
      codeExample: `// StrictMode Verification\nuseEffect(() => {\n  const controller = new AbortController();\n\n  fetch('/api/data', { signal: controller.signal })\n    .then(r => r.json())\n    .then(setData)\n    .catch(err => {\n      if (err.name !== 'AbortError') console.error(err);\n    });\n\n  // StrictMode runs this cleanup immediately on initial dev mount:\n  return () => controller.abort(); // Cancels the first request cleanly!\n}, []);`,
      lineByLine: [
        'Line 2: Creates an AbortController to manage request cancellation.',
        'Line 4: signal links the fetch request to the controller.',
        'Line 12: AbortController cancels the first in-flight request when StrictMode simulates unmount.'
      ],
      expectedBehavior: 'Zero duplicate requests or memory leaks in development or production.',
      commonMistakes: ['Removing StrictMode just to silence duplicate console.log outputs.', 'Assuming StrictMode runs twice in production (it runs once in production builds).'],
      practiceLevels: {
        levelA: 'Add an AbortController cleanup to an effect fetching data.',
        levelB: 'Inspect console output to trace Setup -> Cleanup -> Setup sequence.',
        levelC: 'Make a DOM canvas setup function idempotent so remounting does not duplicate layers.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev reports: "My animation starts twice in dev mode!"\nuseEffect(() => {\n  startAnimation(); // Mutates canvas directly\n  // No cleanup to stop animation!\n}, []);`,
        problem: 'Without cleanup, the second mount creates a second overlapping animation loop.',
        fix: 'return () => stopAnimation();'
      },
      conceptualQuestion: {
        question: 'What is the setup/cleanup sequence executed by React StrictMode on component mount in development?',
        options: [
          'Setup once, never cleaned up until browser closes.',
          'Setup -> Cleanup -> Setup (mount, immediate unmount, re-mount).',
          'Cleanup -> Setup.',
          'Setup -> Setup -> Cleanup.'
        ],
        correctIndex: 1,
        explanation: 'StrictMode runs setup, cleanup, and setup again to verify that your cleanup function completely undoes the setup.'
      },
      codeReadingQuestion: {
        snippet: `useEffect(() => { ref.current.appendChild(el); return () => ref.current.removeChild(el); }, []);`,
        question: 'Is this effect safe under StrictMode double-invocation?',
        answer: 'Yes! Appending and removing are perfectly symmetrical; when it runs twice, only one el remains.'
      },
      starterCode: `// Assignment: Implement testStrictModeResilience\n// Simulate StrictMode mount-unmount-remount:\n// testStrictModeResilience(setupFn)\n// setupFn() returns a cleanup function.\n// Execute: 1. cleanup1 = setupFn() -> 2. cleanup1() -> 3. cleanup2 = setupFn()\n// Measure external resource count before and after.\n// Return: { isResilient: boolean, finalCleanup: () => void }\n\nexport function testStrictModeResilience(setupFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Verifies resilient setup/cleanup cycle',
          run: (fn) => {
            let activeConnections = 0;
            const setup = () => {
              activeConnections++;
              return () => { activeConnections--; };
            };
            const res = fn(setup);
            const resilient = activeConnections === 1;
            res.finalCleanup();
            return resilient && activeConnections === 0;
          }
        }
      ],
      hints: [
        'Call cleanup1 = setupFn(), call cleanup1(), call cleanup2 = setupFn(), return finalCleanup: cleanup2.'
      ],
      checklist: [
        'Simulated mount-unmount-remount sequence',
        'Returned final cleanup handler',
        'Verified resource balance'
      ],
      revisionSummary: 'StrictMode runs setup -> cleanup -> setup in development to verify effect symmetry and catch leaks.'
    },
    {
      id: 'p3-l6',
      slug: 'avoiding-unnecessary-effects',
      title: 'Avoiding Unnecessary Effects',
      prerequisites: ['p3-l2', 'p2-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Eliminate useEffect calls used for calculating derived state.', 'Eliminate useEffect calls used for handling user events.', 'Reset state on prop change using keys instead of effects.'],
      explanation: 'useEffect is one of the most overused hooks in React. You do NOT need an effect to: 1. Transform data for rendering (calculate it in render!). 2. Handle user events (put it in the onClick handler!). 3. Reset state when props change (pass a key={id} to the component!).',
      whyItExists: 'Reduces unnecessary re-renders, eliminates screen flickering, and simplifies component logic.',
      syntaxRules: 'If you can calculate something during render from existing props/state, do not put it in an effect or state.',
      codeExample: `// BAD: Unnecessary effect causing extra re-render cycle!\n// const [first, setFirst] = useState('');\n// const [last, setLast] = useState('');\n// const [full, setFull] = useState('');\n// useEffect(() => { setFull(first + ' ' + last); }, [first, last]);\n\n// GOOD: Calculate directly during render!\nfunction NameDisplay({ first, last }) {\n  const full = \`\${first} \${last}\`.trim(); // Pure, zero effects!\n  return <h1>{full}</h1>;\n}`,
      lineByLine: [
        'Line 8: full is calculated instantly during render.',
        'Eliminates an entire extra render cycle and avoids desynchronization.'
      ],
      expectedBehavior: 'Instantaneous UI updates without secondary re-render passes.',
      commonMistakes: ['Writing useEffect(() => { setFiltered(items.filter(...)) }, [items]).', 'Using useEffect to fire an analytics event on button click instead of calling it in onClick.'],
      practiceLevels: {
        levelA: 'Remove an effect calculating filtered search results and derive in render.',
        levelB: 'Replace a reset-state-on-prop-change effect with a key prop.',
        levelC: 'Audit a component with 5 effects and eliminate at least 3.'
      },
      debuggingChallenge: {
        brokenCode: `function Cart({ items }) {\n  const [total, setTotal] = useState(0);\n  useEffect(() => {\n    setTotal(items.reduce((s, i) => s + i.price, 0));\n  }, [items]);\n}`,
        problem: 'items changes -> render with old total -> effect runs -> setTotal -> second render with new total! (Visual flicker)',
        fix: 'Delete total state and effect. Compute: const total = items.reduce((s, i) => s + i.price, 0);'
      },
      conceptualQuestion: {
        question: 'Which of the following is a VALID use case for useEffect?',
        options: [
          'Calculating the full name from firstName and lastName props.',
          'Filtering a list of products based on a search string in state.',
          'Connecting to a WebSocket chat server and subscribing to incoming messages.',
          'Resetting a comment input field when the user clicks the "Submit" button.'
        ],
        correctIndex: 2,
        explanation: 'Connecting to a WebSocket synchronizes with an external system. The other three belong in render calculations or event handlers.'
      },
      codeReadingQuestion: {
        snippet: `// useEffect(() => { if (user) fetchCart(user.id); }, [user]);`,
        question: 'Is this an appropriate use of useEffect?',
        answer: 'Yes! It synchronizes component state with external network data when the user identity changes.'
      },
      starterCode: `// Assignment: Implement auditEffectCode\n// Audit an AST list of effect usages:\n// auditEffectCode(effectDescriptors)\n// effectDescriptors: [{ id: string, purpose: 'DERIVE_DATA' | 'RESET_STATE' | 'EXTERNAL_SYNC' | 'USER_EVENT' }]\n// Rules:\n// If purpose === 'DERIVE_DATA' -> flag: 'Calculate in render instead'\n// If purpose === 'RESET_STATE' -> flag: 'Use key prop on component instead'\n// If purpose === 'USER_EVENT' -> flag: 'Move logic to event handler'\n// If purpose === 'EXTERNAL_SYNC' -> valid: true\n// Return: { validEffects: number, unnecessaryEffects: string[] }\n\nexport function auditEffectCode(effectDescriptors) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Flags unnecessary effects and approves valid external synchronizations',
          run: (fn) => {
            const list = [
              { id: 'e1', purpose: 'DERIVE_DATA' },
              { id: 'e2', purpose: 'EXTERNAL_SYNC' },
              { id: 'e3', purpose: 'USER_EVENT' }
            ];
            const res = fn(list);
            return res.validEffects === 1 && res.unnecessaryEffects.length === 2 && res.unnecessaryEffects[0].includes('render');
          }
        }
      ],
      hints: [
        'Iterate through list, increment validEffects if EXTERNAL_SYNC, else push suggestion to unnecessaryEffects.'
      ],
      checklist: [
        'Identified derived state effects',
        'Identified user event effects',
        'Preserved genuine external sync effects'
      ],
      revisionSummary: 'Only use useEffect to synchronize with external systems; compute derived state in render and handle actions in event handlers.'
    },
    {
      id: 'p3-l7',
      slug: 'fetching-data-effects-race-conditions',
      title: 'Fetching Data with Effects and Race Conditions',
      prerequisites: ['p3-l4', 'p0-l8'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Fetch API data safely inside useEffect.', 'Understand network race conditions when parameters change rapidly.', 'Solve race conditions using an ignore boolean flag or AbortController.'],
      explanation: 'When fetching data inside useEffect based on an ID (e.g. userId), if the user quickly clicks "User 1" then "User 2", two network requests are sent. If the response for User 1 arrives AFTER the response for User 2, the UI will display User 1 data even though User 2 is selected! This is a race condition. It must be resolved using a cleanup flag or AbortController.',
      whyItExists: 'Guarantees that stale asynchronous responses never overwrite fresh user selections.',
      syntaxRules: 'Use a boolean flag: let ignore = false; ... return () => { ignore = true; } or use AbortController signal.',
      codeExample: `function UserDetail({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    let ignore = false; // Flag to prevent race condition\n\n    fetch(\`/api/users/\${userId}\`)\n      .then(res => res.json())\n      .then(data => {\n        if (!ignore) {\n          setUser(data); // Only update if still active!\n        }\n      });\n\n    return () => {\n      ignore = true; // Stale request response will be ignored\n    };\n  }, [userId]);\n}`,
      lineByLine: [
        'Line 5: ignore flag is local to this specific render effect cycle.',
        'Line 10: Checks !ignore before updating state; if userId changed, ignore is true.',
        'Line 15: Cleanup sets ignore = true as soon as userId changes or component unmounts.'
      ],
      expectedBehavior: 'Only the response matching the latest active userId updates state.',
      commonMistakes: ['Fetching without cleanup, causing out-of-order stale data bugs.', 'Setting state on unmounted components after async delay.'],
      practiceLevels: {
        levelA: 'Implement a race-condition-safe fetch using the ignore boolean pattern.',
        levelB: 'Implement request cancellation using fetch AbortController signal.',
        levelC: 'Compare custom fetch effect with TanStack Query automatic cancellation.'
      },
      debuggingChallenge: {
        brokenCode: `useEffect(() => {\n  fetch(\`/api/post/\${id}\`).then(r => r.json()).then(setPost);\n}, [id]);`,
        problem: 'If user clicks Post 1 then Post 2, and Post 1 returns slower than Post 2, UI displays Post 1.',
        fix: 'Add let ignore = false; ... if (!ignore) setPost(data); return () => { ignore = true; };'
      },
      conceptualQuestion: {
        question: 'What is a "race condition" in data fetching with useEffect?',
        options: [
          'A race between CPU cores to compile JSX.',
          'When multiple asynchronous requests are in flight, and an older request completes after a newer request, overwriting state with stale data.',
          'When two users try to register the same username.',
          'When CSS loads before HTML.'
        ],
        correctIndex: 1,
        explanation: 'Network latency varies; without cleanup or cancellation, slow older responses can arrive after faster newer responses, corrupting state.'
      },
      codeReadingQuestion: {
        snippet: `const controller = new AbortController();\nfetch(url, { signal: controller.signal });\n// In cleanup: controller.abort();`,
        question: 'What happens to the network request in browser DevTools when aborted?',
        answer: 'The browser cancels the pending HTTP request immediately, with status (canceled).'
      },
      starterCode: `// Assignment: Implement simulateRaceConditionFix\n// Simulate requests with varying latencies:\n// simulateRaceConditionFix(requests)\n// requests: [{ id: string, latencyMs: number, data: string }]\n// Emulate sequential user selection where each request cancels the previous:\n// Only the data from the LAST request in the array should be accepted!\n// Return: { resolvedData: string, ignoredCount: number }\n\nexport function simulateRaceConditionFix(requests) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Resolves data from last request and ignores earlier stale responses',
          run: (fn) => {
            const list = [
              { id: 'u1', latencyMs: 500, data: 'User 1' },
              { id: 'u2', latencyMs: 100, data: 'User 2' }
            ];
            const res = fn(list);
            return res.resolvedData === 'User 2' && res.ignoredCount === 1;
          }
        }
      ],
      hints: [
        'The last item in requests represents the latest active selection.'
      ],
      checklist: [
        'Ignored earlier requests',
        'Accepted only latest request data',
        'Reported ignored request count'
      ],
      revisionSummary: 'Prevent data fetching race conditions in useEffect using an ignore flag or AbortController.'
    },
    {
      id: 'p3-l8',
      slug: 'useref-for-dom-access',
      title: 'useRef for DOM Access',
      prerequisites: ['p1-l14'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Obtain direct references to real DOM nodes using useRef().', 'Focus inputs, scroll elements, and measure DOM layout dimensions.', 'Avoid direct DOM mutations that fight React reconciliation.'],
      explanation: 'React manages the DOM declaratively. However, certain imperative browser APIs require direct DOM access: focusing an input, scrolling to an element, or measuring element size (getBoundingClientRect). useRef returns a persistent object { current: initialValue } that React populates with the actual DOM node when mounted.',
      whyItExists: 'Provides a safe escape hatch to invoke imperative browser DOM APIs without breaking React.',
      syntaxRules: 'Declare const inputRef = useRef(null); attach via ref={inputRef}; access node via inputRef.current. Only access current inside effects or event handlers, never during render.',
      codeExample: `import { useRef } from 'react';\n\nfunction AutoFocusSearch() {\n  const inputRef = useRef(null);\n\n  const handleFocus = () => {\n    // Imperatively focus DOM input node\n    inputRef.current?.focus();\n  };\n\n  return (\n    <div>\n      <input ref={inputRef} placeholder="Search..." />\n      <button onClick={handleFocus}>Focus Input</button>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: inputRef is initialized with null.',
        'Line 8: inputRef.current accesses the real HTMLInputElement in the browser.',
        'Line 12: ref={inputRef} instructs React to set inputRef.current to this DOM node upon mounting.'
      ],
      expectedBehavior: 'Clicking button immediately moves keyboard cursor focus into the input.',
      commonMistakes: ['Reading or writing ref.current during render (causes non-deterministic render bugs).', 'Using document.getElementById() instead of React refs.'],
      practiceLevels: {
        levelA: 'Focus an input when an "Edit" button is clicked.',
        levelB: 'Scroll to the bottom of a chat log whenever a new message is added.',
        levelC: 'Measure element width and height with getBoundingClientRect() in useEffect.'
      },
      debuggingChallenge: {
        brokenCode: `function BadRef() {\n  const elRef = useRef(null);\n  const width = elRef.current?.offsetWidth; // Reading ref during render!\n  return <div ref={elRef}>Width: {width}</div>;\n}`,
        problem: 'During render, the DOM node has not been attached yet; elRef.current is null on initial render.',
        fix: 'Measure inside useEffect and update a state variable.'
      },
      conceptualQuestion: {
        question: 'When does React assign the DOM node to `ref.current`?',
        options: [
          'Before the component function runs.',
          'During the commit phase, after React inserts the DOM nodes into the screen.',
          'Only when the user clicks the element.',
          'In the Vite build step.'
        ],
        correctIndex: 1,
        explanation: 'React populates ref.current during the commit phase after the DOM node has been created, and clears it to null on unmount.'
      },
      codeReadingQuestion: {
        snippet: `inputRef.current?.scrollIntoView({ behavior: 'smooth' });`,
        question: 'What does this command do?',
        answer: 'Smoothly scrolls the browser viewport until the referenced DOM node is visible.'
      },
      starterCode: `// Assignment: Implement simulateRefAttachment\n// Simulate React\'s ref attachment lifecycle:\n// simulateRefAttachment(nodeDescriptor)\n// nodeDescriptor: { tagName: string, id: string }\n// 1. On mount: assign nodeDescriptor to ref.current\n// 2. On unmount: set ref.current = null\n// Return { getRef: () => any, mount: () => void, unmount: () => void }\n\nexport function simulateRefAttachment(nodeDescriptor) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Manages ref.current across mount and unmount',
          run: (fn) => {
            const harness = fn({ tagName: 'INPUT', id: 'search' });
            if (harness.getRef() !== null) return false;
            harness.mount();
            if (harness.getRef()?.id !== 'search') return false;
            harness.unmount();
            return harness.getRef() === null;
          }
        }
      ],
      hints: [
        'Store let current = null; mount sets current = nodeDescriptor; unmount sets current = null.'
      ],
      checklist: [
        'Initialized ref to null',
        'Attached node descriptor on mount',
        'Cleared ref to null on unmount'
      ],
      revisionSummary: 'useRef provides access to real DOM nodes for focus, scrolling, and measurement without mutating state.'
    },
    {
      id: 'p3-l9',
      slug: 'useref-for-mutable-values',
      title: 'useRef for Mutable Values (Variables that Don\'t Re-render)',
      prerequisites: ['p3-l8', 'p1-l15'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Store mutable values that persist across renders without triggering a re-render.', 'Store timer IDs, previous prop values, and render counters.', 'Know when to use useState vs useRef.'],
      explanation: 'useRef is not just for DOM elements. It is a general-purpose container for any mutable value that needs to persist across renders WITHOUT triggering a re-render when mutated. Modifying ref.current = 10 does not schedule a re-render. If a piece of data is used purely in event handlers or effects and never rendered in JSX, useRef is ideal.',
      whyItExists: 'Stores mutable operational values (timer IDs, WebSockets, previous state) without wasting re-renders.',
      syntaxRules: 'Changing ref.current does NOT re-render. Never read or write ref.current in render JSX.',
      codeExample: `function Stopwatch() {\n  const [seconds, setSeconds] = useState(0);\n  const timerRef = useRef(null); // Stores timer ID without causing renders\n\n  const handleStart = () => {\n    if (timerRef.current !== null) return;\n    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);\n  };\n\n  const handleStop = () => {\n    clearInterval(timerRef.current);\n    timerRef.current = null;\n  };\n\n  return (\n    <div>\n      <h1>{seconds}s</h1>\n      <button onClick={handleStart}>Start</button>\n      <button onClick={handleStop}>Stop</button>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 3: timerRef holds the NodeJS/browser interval ID.',
        'Line 7: Updating timerRef.current saves the ID silently without re-rendering.',
        'Line 11: clearInterval reads timerRef.current to stop the exact active timer.'
      ],
      expectedBehavior: 'Stopwatch ticks every second; start/stop mutations cause zero unnecessary re-renders.',
      commonMistakes: ['Putting timer IDs in useState (which triggers a redundant re-render just to store a number).', 'Using a regular let variable outside the component (shared globally across all instances!).'],
      practiceLevels: {
        levelA: 'Store the interval ID of a countdown timer in useRef.',
        levelB: 'Implement usePrevious(value) hook to track the previous prop value.',
        levelC: 'Build an operation throttle tracking lastInvocationTime with a ref.'
      },
      debuggingChallenge: {
        brokenCode: `let globalTimer = null; // Bug: Global variable!\nfunction Timer() {\n  // If two Timer components are on screen, they overwrite each other\'s globalTimer!\n}`,
        problem: 'Module-scoped variables are shared across all component instances.',
        fix: 'Use const timerRef = useRef(null); inside the component.'
      },
      conceptualQuestion: {
        question: 'What is the primary difference between `useState` and `useRef` for storing data in React?',
        options: [
          'useState can only store strings; useRef stores anything.',
          'Updating state triggers a component re-render; mutating `ref.current` does NOT trigger a re-render.',
          'useRef is cleared on every render.',
          'useState works only in Vite.'
        ],
        correctIndex: 1,
        explanation: 'Mutating ref.current is silent and does not schedule a re-render, making it ideal for operational variables like timer IDs.'
      },
      codeReadingQuestion: {
        snippet: `const renders = useRef(0);\nuseEffect(() => { renders.current++; });`,
        question: 'Why is useRef used here instead of useState to count renders?',
        answer: 'If useState were used, updating the counter inside useEffect would trigger another render, causing an infinite render loop!'
      },
      starterCode: `// Assignment: Implement trackPreviousValue\n// Build the logic of a usePrevious tracker:\n// trackPreviousValue(historyState, nextValue)\n// historyState: { current: any, previous: any }\n// Returns new history state where: previous = historyState.current, current = nextValue\n\nexport function trackPreviousValue(historyState, nextValue) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Tracks transition from previous to next value',
          run: (fn) => {
            const h1 = { current: 'alpha', previous: null };
            const h2 = fn(h1, 'beta');
            const h3 = fn(h2, 'gamma');
            return h2.previous === 'alpha' && h2.current === 'beta' && h3.previous === 'beta' && h3.current === 'gamma';
          }
        }
      ],
      hints: [
        'Return { previous: historyState.current, current: nextValue }.'
      ],
      checklist: [
        'Shifted current to previous',
        'Assigned nextValue to current'
      ],
      revisionSummary: 'useRef stores persistent mutable values without triggering re-renders, perfect for timers and previous states.'
    },
    {
      id: 'p3-l10',
      slug: 'usecontext-fundamentals',
      title: 'useContext: Passing Data Deeply Without Prop Drilling',
      prerequisites: ['p1-l9', 'p2-l15'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Eliminate prop drilling across deep component trees.', 'Create, provide, and consume Context cleanly.', 'Combine Context with custom hook wrappers with safety checks.'],
      explanation: 'Passing props through 5 layers of intermediate components that don\'t care about the data is called "Prop Drilling". React Context lets a parent component provide data to the entire subtree below it. Any child at any depth can consume the data directly via useContext().',
      whyItExists: 'Supplies global or subtree-wide state (themes, authentication, current user, localization) directly.',
      syntaxRules: '1. createContext(defaultValue). 2. <MyContext.Provider value={value}>. 3. useContext(MyContext). Always create a custom hook useMyContext() that throws if used outside the Provider.',
      codeExample: `import { createContext, useContext, useState } from 'react';\n\nconst ThemeContext = createContext(null);\n\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('dark');\n  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nexport function useTheme() {\n  const context = useContext(ThemeContext);\n  if (!context) throw new Error('useTheme must be used within ThemeProvider');\n  return context;\n}`,
      lineByLine: [
        'Line 3: createContext initializes context with null default.',
        'Line 9: Provider broadcasts theme and toggleTheme to all descendants.',
        'Line 16: Custom hook encapsulates useContext and guards against missing providers.'
      ],
      expectedBehavior: 'Descendants read theme and call toggleTheme without props being drilled.',
      commonMistakes: ['Overusing Context for frequently changing data, causing excessive re-renders across the entire tree.', 'Forgetting the custom hook guard check.'],
      practiceLevels: {
        levelA: 'Provide and consume an AuthContext with currentUser.',
        levelB: 'Build a Language/Localization context with translate(key) function.',
        levelC: 'Optimize context by splitting StateContext and DispatchContext.'
      },
      debuggingChallenge: {
        brokenCode: `function Header() {\n  const { user } = useContext(UserContext); // Throws TypeError: Cannot destructure property 'user' of null\n}`,
        problem: 'Header was rendered outside <UserContext.Provider>, returning default null.',
        fix: 'Wrap Header inside <UserContext.Provider> or use a guarded custom hook.'
      },
      conceptualQuestion: {
        question: 'Why should you create a custom hook like `useTheme()` instead of calling `useContext(ThemeContext)` directly in components?',
        options: [
          'Because useContext cannot be used in functional components.',
          'The custom hook encapsulates the context reference, prevents leaking internal details, and provides a clear runtime error if used outside its Provider.',
          'It improves network speed.',
          'It converts Context to Redux.'
        ],
        correctIndex: 1,
        explanation: 'A custom hook provides defensive guard checks and clean ergonomics for consumers.'
      },
      codeReadingQuestion: {
        snippet: `<Context.Provider value={{ count }}>\n  <Child />\n</Context.Provider>`,
        question: 'What happens to all consumers of Context when count changes?',
        answer: 'All components consuming this context re-render with the new count value.'
      },
      starterCode: `// Assignment: Implement resolveContextConsumer\n// Simulates Context resolution in a component tree:\n// resolveContextConsumer(treeContextValue, fallbackDefault)\n// 1. If treeContextValue is defined (not null/undefined) -> return { value: treeContextValue, hasProvider: true }\n// 2. If treeContextValue is null/undefined -> return { value: fallbackDefault, hasProvider: false }\n\nexport function resolveContextConsumer(treeContextValue, fallbackDefault) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Resolves provided tree context',
          run: (fn) => {
            const res = fn({ theme: 'dark' }, { theme: 'light' });
            return res.value.theme === 'dark' && res.hasProvider === true;
          }
        },
        {
          name: 'Falls back to default when provider is absent',
          run: (fn) => {
            const res = fn(null, { theme: 'system' });
            return res.value.theme === 'system' && res.hasProvider === false;
          }
        }
      ],
      hints: [
        'Check treeContextValue != null.'
      ],
      checklist: [
        'Detected active provider value',
        'Applied fallback default when missing'
      ],
      revisionSummary: 'useContext broadcasts data down the tree without prop drilling; wrap in custom hooks with guard errors.'
    },
    {
      id: 'p3-l11',
      slug: 'usereducer-complex-state',
      title: 'useReducer for Complex State Transitions',
      prerequisites: ['p3-l1', 'p0-l5'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: ['Master reducer functions: (state, action) => nextState.', 'Manage complex state with multiple sub-values and interdependent updates.', 'Dispatch standardized actions: dispatch({ type: "ACTION", payload }).'],
      explanation: 'When state involves multiple sub-values, complex transitions, or when next state depends on multiple previous states, useState becomes unwieldy. useReducer centralizes all state transition logic into a single pure reducer function. Components describe "what happened" by dispatching actions, and the reducer decides "how state changes".',
      whyItExists: 'Separates state transition logic from UI components and enables predictable, testable state flows.',
      syntaxRules: 'const [state, dispatch] = useReducer(reducer, initialState). Reducer must be a pure function: (state, action) => nextState.',
      codeExample: `// Pure Reducer Function (Testable outside React!)\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case 'ADD_ITEM':\n      return { ...state, items: [...state.items, action.payload] };\n    case 'REMOVE_ITEM':\n      return { ...state, items: state.items.filter(i => i.id !== action.payload) };\n    case 'CLEAR':\n      return { ...state, items: [] };\n    default:\n      return state;\n  }\n}\n\n// In Component:\nfunction Cart() {\n  const [state, dispatch] = useReducer(cartReducer, { items: [] });\n  return <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>;\n}`,
      lineByLine: [
        'Line 2: cartReducer is a pure JavaScript function that takes state and action and returns new state.',
        'Line 4-9: Immutably handles distinct business events.',
        'Line 15: dispatch({ type: "CLEAR" }) sends the action to the reducer.'
      ],
      expectedBehavior: 'State transitions occur strictly through defined action types.',
      commonMistakes: ['Mutating state directly inside the reducer: state.items.push(action.payload) (violates purity!).', 'Putting side effects (like fetch calls or localStorage writes) inside the reducer function.'],
      practiceLevels: {
        levelA: 'Write a counter reducer supporting INCREMENT, DECREMENT, RESET.',
        levelB: 'Build a multi-step checkout form state manager using useReducer.',
        levelC: 'Unit-test a complex reducer with 6 action types completely outside React.'
      },
      debuggingChallenge: {
        brokenCode: `function reducer(state, action) {\n  if (action.type === 'ADD') {\n    state.count++; // Direct mutation!\n    return state;\n  }\n}`,
        problem: 'Mutates state in place; same object reference is returned so React skips re-rendering.',
        fix: 'return { ...state, count: state.count + 1 };'
      },
      conceptualQuestion: {
        question: 'Why must a reducer function passed to `useReducer` be a PURE function?',
        options: [
          'Because JavaScript throws a SyntaxError if it isn\'t.',
          'Pure reducers ensure predictable state transitions, prevent subtle mutation bugs, and enable time-travel debugging and concurrent rendering.',
          'Pure reducers run on the GPU.',
          'To allow async/await inside the reducer.'
        ],
        correctIndex: 1,
        explanation: 'Reducers must calculate nextState purely from (state, action) without side effects or mutations.'
      },
      codeReadingQuestion: {
        snippet: `dispatch({ type: 'DELETE_TASK', id: 42 });`,
        question: 'What is the object passed to dispatch called, and what does it describe?',
        answer: 'An action object. It describes what user event or business action occurred.'
      },
      starterCode: `// Assignment: Implement executeReducerAction\n// Build and test a pure task list reducer:\n// taskReducer(state, action)\n// state = { tasks: [{ id: number, title: string, completed: boolean }] }\n// Actions:\n// 1. { type: 'ADD', task: { id, title, completed } }\n// 2. { type: 'TOGGLE', id: number }\n// 3. { type: 'DELETE', id: number }\n// Return new state without mutating original.\n\nexport function taskReducer(state, action) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Adds task immutably',
          run: (fn) => {
            const s0 = { tasks: [] };
            const s1 = fn(s0, { type: 'ADD', task: { id: 1, title: 'Learn Hooks', completed: false } });
            return s1.tasks.length === 1 && s1.tasks[0].title === 'Learn Hooks' && s0.tasks.length === 0;
          }
        },
        {
          name: 'Toggles and deletes tasks',
          run: (fn) => {
            const s0 = { tasks: [{ id: 1, title: 'Test', completed: false }] };
            const s1 = fn(s0, { type: 'TOGGLE', id: 1 });
            const s2 = fn(s1, { type: 'DELETE', id: 1 });
            return s1.tasks[0].completed === true && s2.tasks.length === 0;
          }
        }
      ],
      hints: [
        'Use switch(action.type) with spread and array map/filter.'
      ],
      checklist: [
        'Handled ADD, TOGGLE, DELETE',
        'Preserved state immutability',
        'Returned default state for unknown actions'
      ],
      revisionSummary: 'useReducer centralizes complex state transitions into pure, testable reducer functions driven by actions.'
    },
    {
      id: 'p3-l12',
      slug: 'usecallback-referential-stability',
      title: 'useCallback and Referential Stability',
      prerequisites: ['p3-l11', 'p0-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Cache function definitions between renders using useCallback.', 'Pass referentially stable callbacks to memoized children (React.memo).', 'Avoid premature optimization with useCallback.'],
      explanation: 'In JavaScript, () => {} creates a brand new function object with a new memory reference on EVERY render. When passing callbacks to optimized child components wrapped in React.memo, this new reference causes the child to re-render anyway! useCallback caches a function definition between renders until its dependencies change.',
      whyItExists: 'Preserves function referential equality across renders to optimize child components and satisfy effect dependencies.',
      syntaxRules: 'const memoizedFn = useCallback(fn, [dependencies]). Only use useCallback when passing callbacks to memoized children or effect dependencies.',
      codeExample: `import { useState, useCallback, memo } from 'react';\n\n// Memoized Child: Only re-renders if onIncrement reference changes!\nconst ChildButton = memo(function ChildButton({ onIncrement }) {\n  return <button onClick={onIncrement}>+1</button>;\n});\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const [theme, setTheme] = useState('dark');\n\n  // Stable reference: Doesn't change when theme updates!\n  const handleIncrement = useCallback(() => {\n    setCount(c => c + 1);\n  }, []); // Empty deps because functional updater is used\n\n  return <ChildButton onIncrement={handleIncrement} />;\n}`,
      lineByLine: [
        'Line 4: memo() skips re-rendering ChildButton if props are referentially identical.',
        'Line 13: useCallback caches handleIncrement across renders.',
        'When theme toggles, ChildButton does NOT re-render because handleIncrement reference remained stable!'
      ],
      expectedBehavior: 'Child components avoid re-renders when unrelated parent state changes.',
      commonMistakes: ['Wrapping every single function in useCallback blindly without measuring.', 'Omitting dependencies and closing over stale state.'],
      practiceLevels: {
        levelA: 'Wrap an item deletion handler in useCallback.',
        levelB: 'Profile child re-renders before and after applying React.memo and useCallback.',
        levelC: 'Use functional updaters inside useCallback to keep dependencies array empty [].'
      },
      debuggingChallenge: {
        brokenCode: `const handleClick = useCallback(() => {\n  console.log(count);\n}, []); // Missing count in deps!\nsetCount(5); // handleClick still logs 0!`,
        problem: 'Empty dependency array captures stale count closure at initial mount.',
        fix: 'Add count to deps: [count] or use functional updater.'
      },
      conceptualQuestion: {
        question: 'When is `useCallback` actually beneficial in React?',
        options: [
          'On every single function to make the app faster.',
          'When passing a function as a prop to a child wrapped in `React.memo`, or when the function is used as a dependency in another hook like `useEffect`.',
          'It compiles the function to machine code.',
          'Only when using Redux.'
        ],
        correctIndex: 1,
        explanation: 'useCallback has overhead; it is only beneficial when preserving reference equality prevents expensive re-renders or effect re-runs.'
      },
      codeReadingQuestion: {
        snippet: `const fn1 = () => 1;\nconst fn2 = () => 1;\nconsole.log(fn1 === fn2);`,
        question: 'What is logged and why?',
        answer: 'false, because each function literal creates a unique object reference in memory.'
      },
      starterCode: `// Assignment: Implement simulateUseCallback\n// Simulate useCallback cache mechanism:\n// createCallbackCache()\n// Returns: (fn, deps) => cachedFn\n// If deps match previous deps via Object.is -> return previously cached fn instance!\n// If deps changed or first call -> update cache and return new fn instance.\n\nexport function createCallbackCache() {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Returns same function reference when dependencies are unchanged',
          run: (fn) => {
            const cache = fn();
            const f1 = () => 1;
            const f2 = () => 2;
            const r1 = cache(f1, [10]);
            const r2 = cache(f2, [10]); // Same deps: should return f1!
            return r1 === r2;
          }
        },
        {
          name: 'Updates function reference when dependencies change',
          run: (fn) => {
            const cache = fn();
            const f1 = () => 1;
            const f2 = () => 2;
            const r1 = cache(f1, [10]);
            const r2 = cache(f2, [20]); // Changed deps: should return f2!
            return r1 !== r2 && r2 === f2;
          }
        }
      ],
      hints: [
        'Store previousFn and previousDeps in closure and compare with Object.is.'
      ],
      checklist: [
        'Cached function reference',
        'Returned cached reference on identical deps',
        'Updated reference when deps changed'
      ],
      revisionSummary: 'useCallback caches function references across renders to prevent unnecessary re-renders in memoized children.'
    },
    {
      id: 'p3-l13',
      slug: 'usememo-expensive-calculations',
      title: 'useMemo: Caching Expensive Calculations',
      prerequisites: ['p3-l12'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Cache the result of expensive calculations between renders using useMemo.', 'Preserve referential equality for objects and arrays passed as props.', 'Measure execution time using performance.now() to verify optimization necessity.'],
      explanation: 'useMemo caches the result of a calculation between renders: const result = useMemo(() => calculateExpensiveValue(data), [data]). React will only re-execute the calculation function when one of the dependencies has changed. In all other renders, it returns the cached result instantaneously.',
      whyItExists: 'Prevents CPU-heavy calculations (sorting 10,000 items, complex regex, matrix math) from freezing the UI on unrelated renders.',
      syntaxRules: 'const cached = useMemo(() => compute(a, b), [a, b]). Do not overuse useMemo for cheap operations (e.g. 2 + 2 or simple string trims).',
      codeExample: `import { useMemo, useState } from 'react';\n\nfunction ProductTable({ products, filterText }) {\n  // Expensive filter and sort only re-runs when products or filterText changes\n  const visibleProducts = useMemo(() => {\n    return products\n      .filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))\n      .sort((a, b) => b.sales - a.sales);\n  }, [products, filterText]);\n\n  return <Table data={visibleProducts} />;\n}`,
      lineByLine: [
        'Line 5: useMemo wraps the filter and sort transformation.',
        'Line 8: [products, filterText] dependencies tell React when to invalidate the cache.',
        'When an unrelated state (like dark theme) changes, visibleProducts is returned from cache in 0ms.'
      ],
      expectedBehavior: 'Expensive filtering and sorting is skipped on unrelated component renders.',
      commonMistakes: ['Wrapping trivial 1-line calculations in useMemo (the overhead of useMemo exceeds the calculation cost!).', 'Mutating objects cached by useMemo.'],
      practiceLevels: {
        levelA: 'Measure execution time of a large array search using console.time().',
        levelB: 'Use useMemo to stabilize an object passed as a prop to a memoized child.',
        levelC: 'Benchmark before/after re-render times using React DevTools Profiler.'
      },
      debuggingChallenge: {
        brokenCode: `const total = useMemo(() => items.length, [items]);`,
        problem: 'Reading .length is an instantaneous O(1) property lookup; useMemo here is pure wasted overhead.',
        fix: 'const total = items.length;'
      },
      conceptualQuestion: {
        question: 'When is `useMemo` genuinely worthwhile?',
        options: [
          'On every single variable declared in any React component.',
          'When the calculation is noticeably slow (takes >1ms or handles thousands of records) or when creating an object/array that is used as a dependency in another hook.',
          'Only when fetching data from a database.',
          'It is required by Vite.'
        ],
        correctIndex: 1,
        explanation: 'useMemo introduces memory and comparison overhead; use it when the computation is demonstrably expensive or for referential stability.'
      },
      codeReadingQuestion: {
        snippet: `// What is the relationship between useMemo and useCallback?`,
        question: 'How can useCallback be expressed using useMemo?',
        answer: 'useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).'
      },
      starterCode: `// Assignment: Implement simulateMemoCache\n// Build an in-memory memoization cache:\n// createMemoCache()\n// Returns: (computeFn, deps) => cachedResult\n// If deps match previous deps via Object.is -> return cachedResult WITHOUT calling computeFn!\n// If deps changed or first call -> call computeFn(), cache result, and return it.\n\nexport function createMemoCache() {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Computes result on first call and caches on identical deps',
          run: (fn) => {
            const memo = fn();
            let computeCount = 0;
            const compute = () => { computeCount++; return 42; };
            const r1 = memo(compute, [1]);
            const r2 = memo(compute, [1]);
            return r1 === 42 && r2 === 42 && computeCount === 1;
          }
        },
        {
          name: 'Recomputes when dependencies change',
          run: (fn) => {
            const memo = fn();
            let count = 0;
            const compute = () => ++count;
            const r1 = memo(compute, ['a']);
            const r2 = memo(compute, ['b']);
            return r1 === 1 && r2 === 2;
          }
        }
      ],
      hints: [
        'Store previousValue and previousDeps in closure; check Object.is.'
      ],
      checklist: [
        'Executed compute function on initial call',
        'Skipped computation when deps were equal',
        'Re-evaluated on dependency change'
      ],
      revisionSummary: 'useMemo caches expensive calculations between renders, recomputing only when dependencies change.'
    },
    {
      id: 'p3-l14',
      slug: 'custom-hooks-logic-reuse',
      title: 'Custom Hooks: Extracting Reusable Logic',
      prerequisites: ['p3-l1', 'p3-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Extract stateful component logic into reusable functions starting with "use".', 'Compose multiple built-in hooks inside custom hooks.', 'Share stateful logic WITHOUT sharing state instances.'],
      explanation: 'Custom hooks let you extract component logic into reusable functions. A custom hook is simply a JavaScript function whose name starts with "use" and that may call other hooks (useState, useEffect, etc.). When two components use the same custom hook, they share the logic, but their state is completely independent!',
      whyItExists: 'Enables clean separation of business logic from UI and DRY code reuse across an entire application.',
      syntaxRules: 'Always start the function name with "use" (e.g. useOnlineStatus, useDebounce). Never call custom hooks inside conditions.',
      codeExample: `// Reusable Custom Hook: useOnlineStatus\nfunction useOnlineStatus() {\n  const [isOnline, setIsOnline] = useState(navigator.onLine);\n\n  useEffect(() => {\n    const handleOnline = () => setIsOnline(true);\n    const handleOffline = () => setIsOnline(false);\n    window.addEventListener('online', handleOnline);\n    window.addEventListener('offline', handleOffline);\n    return () => {\n      window.removeEventListener('online', handleOnline);\n      window.removeEventListener('offline', handleOffline);\n    };\n  }, []);\n\n  return isOnline;\n}\n\n// Usage in component:\nfunction StatusBar() {\n  const isOnline = useOnlineStatus();\n  return <div>Status: {isOnline ? 'Online' : 'Offline'}</div>;\n}`,
      lineByLine: [
        'Line 2: Hook name starts with "use", allowing React\'s linter to enforce hook rules.',
        'Line 3: Manages its own internal state.',
        'Line 15: Returns simple boolean value to caller.'
      ],
      expectedBehavior: 'Component consumes status cleanly with zero clutter in its render function.',
      commonMistakes: ['Naming hook without "use" prefix (e.g. getOnlineStatus), which prevents ESLint from checking hook rules.', 'Thinking two components using the same custom hook share the same state variable (each invocation is completely independent).'],
      practiceLevels: {
        levelA: 'Build useToggle(initialValue = false) returning [value, toggle].',
        levelB: 'Build useLocalStorage(key, initialValue) synchronizing state with window.localStorage.',
        levelC: 'Build useDebounce(value, delayMs) delaying state updates until user stops typing.'
      },
      debuggingChallenge: {
        brokenCode: `function checkAuth() {\n  const [user, setUser] = useState(null); // Warning: React Hook "useState" is called in function "checkAuth" that is neither a React component nor a custom hook!\n}`,
        problem: 'Function name does not start with "use", violating React naming conventions.',
        fix: 'Rename to useAuth().'
      },
      conceptualQuestion: {
        question: 'If Component A and Component B both call `const data = useFetch("/api")`, do they share the same state object?',
        options: [
          'Yes, custom hooks create global singleton state.',
          'No, each component that calls a custom hook gets its own completely isolated copy of state.',
          'Only if they are siblings.',
          'Yes, if they have the same key.'
        ],
        correctIndex: 1,
        explanation: 'Custom hooks share stateful LOGIC, not state itself. Each hook invocation creates independent state.'
      },
      codeReadingQuestion: {
        snippet: `function useCounter(step = 1) {\n  const [count, setCount] = useState(0);\n  const inc = () => setCount(c => c + step);\n  return [count, inc];\n}`,
        question: 'What does useCounter return?',
        answer: 'A tuple array containing the current count and an increment function.'
      },
      starterCode: `// Assignment: Implement customHookContractValidator\n// Validates whether a function definition conforms to React Custom Hook rules:\n// validateCustomHookContract(fnName, usesHooks)\n// 1. If fnName does not start with 'use' followed by an uppercase letter (e.g. 'useAuth'), return { valid: false, error: 'Custom hook name must start with "use" followed by capital letter' }\n// 2. If usesHooks is false, return { valid: true, warning: 'Function does not call any hooks; regular utility function may be preferred' }\n// 3. Otherwise return { valid: true }\n\nexport function validateCustomHookContract(fnName, usesHooks) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Validates standard custom hook naming',
          run: (fn) => {
            const res = fn('useWindowDimensions', true);
            return res.valid === true && res.error === undefined;
          }
        },
        {
          name: 'Rejects invalid prefix or lowercase naming',
          run: (fn) => {
            const r1 = fn('getDimensions', true);
            const r2 = fn('useuser', true);
            return r1.valid === false && r2.valid === false;
          }
        }
      ],
      hints: [
        'Check /^use[A-Z]/.test(fnName).'
      ],
      checklist: [
        'Enforced use[A-Z] convention',
        'Flagged non-hook utilities',
        'Returned structured validation output'
      ],
      revisionSummary: 'Custom hooks encapsulate reusable stateful logic; prefix with "use" and each caller gets isolated state.'
    },
    {
      id: 'p3-l15',
      slug: 'hook-rules-and-ordering',
      title: 'Hook Rules and Hook Call Ordering',
      prerequisites: ['p3-l14'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the 2 Golden Rules of Hooks.', 'Understand how React tracks hooks using an internal linked list.', 'Never call hooks inside conditions, loops, or nested functions.'],
      explanation: 'Under the hood, React does not track hooks by name. React tracks hooks by their CALL ORDER using an internal linked list on the fiber node. On every render, React expects the exact same hooks to be called in the exact same sequence. If you place a hook inside an if-statement, the order desynchronizes, corrupting state for all subsequent hooks!',
      whyItExists: 'Guarantees that React pairs hook state with the correct call index between renders.',
      syntaxRules: 'Rule 1: Only call hooks at the top level (never in conditions, loops, or nested functions). Rule 2: Only call hooks from React function components or custom hooks.',
      codeExample: `// TERRIBLE BUG: Hook called conditionally\nfunction BadComponent({ isGuest }) {\n  if (isGuest) {\n    return <div>Welcome Guest</div>;\n  }\n\n  // BUG: This hook won't be called if isGuest is true!\n  // The internal hook index will desynchronize on next render!\n  const [user, setUser] = useState('Member');\n  return <div>Welcome {user}</div>;\n}`,
      lineByLine: [
        'Line 3: Early return before useState causes hook count to change between renders.',
        'React throws: "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."'
      ],
      expectedBehavior: 'All hooks are declared at the very top of the component function before any conditionals or early returns.',
      commonMistakes: ['Calling useEffect or useState inside an if (condition) block.', 'Returning early before all hooks have been declared.'],
      practiceLevels: {
        levelA: 'Move a conditional check below all hook declarations.',
        levelB: 'Refactor a loop containing hooks to map over a sub-component instead.',
        levelC: 'Configure eslint-plugin-react-hooks to enforce rules at build time.'
      },
      debuggingChallenge: {
        brokenCode: `function Tab({ tabId }) {\n  if (!tabId) return null;\n  const [data, setData] = useState(null);\n}`,
        problem: 'Early return occurs before useState, breaking hook call ordering when tabId changes.',
        fix: 'Move const [data, setData] = useState(null); to the very top, before if (!tabId) return null;'
      },
      conceptualQuestion: {
        question: 'Why CANNOT React hooks be called inside conditional statements (`if (cond) { useState() }`)?',
        options: [
          'Because JavaScript forbids if-statements inside functions.',
          'React relies on the call order of hooks across renders to pair internal state with each hook; conditional hooks shift the order, corrupting state.',
          'Because hooks run asynchronously.',
          'Because Vite bundles conditionals differently.'
        ],
        correctIndex: 1,
        explanation: 'React maintains hook state in an ordered array/linked list per fiber; changing call order misaligns all subsequent hook states.'
      },
      codeReadingQuestion: {
        snippet: `for (let i = 0; i < 3; i++) { useState(i); }`,
        question: 'Does this violate React rules of hooks?',
        answer: 'Yes! Hooks cannot be called inside loops.'
      },
      starterCode: `// Assignment: Implement verifyHookCallSequence\n// Simulates React\'s hook call order verifier:\n// verifyHookCallSequence(prevHookList, nextHookList)\n// prevHookList: string[] (e.g. ['useState', 'useEffect', 'useMemo'])\n// nextHookList: string[]\n// Rules:\n// 1. nextHookList must have EXACTLY the same length as prevHookList.\n// 2. Each hook type at index [i] must match prevHookList[i].\n// Return: { isCompliant: boolean, error?: string }\n\nexport function verifyHookCallSequence(prevHookList, nextHookList) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Approves identical hook call sequence',
          run: (fn) => {
            const list = ['useState', 'useEffect', 'useMemo'];
            return fn(list, [...list]).isCompliant === true;
          }
        },
        {
          name: 'Detects changed hook order or missing hook',
          run: (fn) => {
            const prev = ['useState', 'useEffect'];
            const next = ['useState']; // Missing effect!
            const res = fn(prev, next);
            return res.isCompliant === false && res.error.includes('hook');
          }
        }
      ],
      hints: [
        'Compare length first, then loop through items checking prev[i] === next[i].'
      ],
      checklist: [
        'Checked hook call array length',
        'Compared hook types by index',
        'Reported descriptive compliance error'
      ],
      revisionSummary: 'Only call hooks at the top level of React function components; consistent call order is mandatory.'
    },
    {
      id: 'p3-l16',
      slug: 'stale-closures-in-hooks',
      title: 'Stale Closures in Hooks and Callbacks',
      prerequisites: ['p3-l3', 'p0-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Diagnose and fix stale closure bugs in useEffect, setInterval, and event handlers.', 'Use functional state updates to bypass stale closures.', 'Use mutable refs as a bridge when callbacks cannot be re-created.'],
      explanation: 'In JavaScript, a closure captures variables from its lexical environment at the time it was created. In React, if a callback or effect captures state from Render 1, and the component re-renders (Render 2) with new state, but the callback was NOT re-created, the callback still references the OLD state from Render 1! This is a stale closure.',
      whyItExists: 'A direct consequence of JavaScript\'s lexical scoping in a component lifecycle with changing state over time.',
      syntaxRules: 'Fix stale closures by: 1. Adding the variable to the dependency array. 2. Using functional state updaters: setCount(c => c + 1). 3. Storing latest values in a ref.',
      codeExample: `// Stale Closure Problem\nfunction BrokenTimer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => {\n      console.log(count); // STALE! Always logs 0!\n      setCount(count + 1); // Sets 0 + 1 = 1 on EVERY tick!\n    }, 1000);\n    return () => clearInterval(id);\n  }, []); // [] means count is captured from mount!\n}\n\n// Solution: Functional Updater\nfunction FixedTimer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => {\n      setCount(prev => prev + 1); // Reads fresh pending state!\n    }, 1000);\n    return () => clearInterval(id);\n  }, []);\n}`,
      lineByLine: [
        'Line 6: count is trapped in the setInterval closure with value 0.',
        'Line 18: setCount(prev => prev + 1) reads current state directly from React\'s queue, eliminating the stale closure bug.'
      ],
      expectedBehavior: 'Timer increments reliably 1, 2, 3, 4 without resetting.',
      commonMistakes: ['Thinking setInterval re-evaluates the variable inside it on every tick.', 'Using eslint-disable to hide missing dependency warnings.'],
      practiceLevels: {
        levelA: 'Fix a stale closure in a button setTimeout callback.',
        levelB: 'Implement the useEvent / useLatestRef pattern to keep callbacks fresh without re-subscribing.',
        levelC: 'Audit a chat application to ensure send message callbacks don\'t capture old drafts.'
      },
      debuggingChallenge: {
        brokenCode: `function AlertButton() {\n  const [msg, setMsg] = useState('Hello');\n  const showAlert = useCallback(() => alert(msg), []); // Missing msg in deps!\n}`,
        problem: 'showAlert permanently alerts "Hello" even after setMsg("Goodbye").',
        fix: 'Add msg to dependencies: useCallback(() => alert(msg), [msg]);'
      },
      conceptualQuestion: {
        question: 'Why does `setCount(count + 1)` fail inside a `setInterval` with an empty dependency array `[]`?',
        options: [
          'Because intervals cannot access React state.',
          'The effect closure captured `count` from the initial mount (0); every interval tick runs `setCount(0 + 1)`, leaving count stuck at 1.',
          'Because setInterval runs synchronously.',
          'Because count is frozen by Object.freeze.'
        ],
        correctIndex: 1,
        explanation: 'With [] deps, the interval callback never gets re-created, holding onto the stale count = 0 forever.'
      },
      codeReadingQuestion: {
        snippet: `const latest = useRef(value); latest.current = value;`,
        question: 'What pattern is being used here to solve stale closures?',
        answer: 'The "Latest Ref" pattern, allowing asynchronous callbacks to read current state without being in the dependency array.'
      },
      starterCode: `// Assignment: Implement resolveStaleClosure\n// Demonstrate how a stale closure differs from a ref bridge:\n// simulateClosureTrap(initialVal, updatedVal)\n// 1. Create a closure capturing initialVal: () => initialVal\n// 2. Create a ref object { current: initialVal }, update ref.current = updatedVal\n// 3. Return { closureOutput: staleCallback(), refOutput: ref.current }\n\nexport function resolveStaleClosure(initialVal, updatedVal) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Demonstrates closure capturing initial value while ref reflects updated value',
          run: (fn) => {
            const res = fn('initial', 'updated');
            return res.closureOutput === 'initial' && res.refOutput === 'updated';
          }
        }
      ],
      hints: [
        'Define const staleFn = () => initialVal; and const ref = { current: initialVal }; ref.current = updatedVal.'
      ],
      checklist: [
        'Captured initial value in closure',
        'Mutated ref to updated value',
        'Observed difference between closure and ref'
      ],
      revisionSummary: 'Stale closures hold onto old render variables; fix using functional updaters or latest mutable refs.'
    },
    {
      id: 'p3-l17',
      slug: 'dependency-arrays-exhaustive-deps',
      title: 'Dependency Arrays and Exhaustive-Deps',
      prerequisites: ['p3-l16', 'p3-l3'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Configure and understand the eslint-plugin-react-hooks/exhaustive-deps rule.', 'Understand why suppressing the linter creates production bugs.', 'Remove unnecessary dependencies by moving code inside effects or making it non-reactive.'],
      explanation: 'The exhaustive-deps ESLint rule is the safety net of React. It inspects your effects and ensures that every reactive value (props, state, component functions) is listed in the dependency array. If you feel the urge to suppress this rule, you have an architectural problem: you should either move the logic inside the effect, use functional updaters, or hoist non-reactive logic.',
      whyItExists: 'Guarantees synchronization and protects against difficult-to-reproduce timing bugs.',
      syntaxRules: 'Never write // eslint-disable-next-line react-hooks/exhaustive-deps. Fix the root cause instead.',
      codeExample: `// PROBLEM: Linter warns 'fetchData' is missing in deps\n// function Search({ query }) {\n//   const fetchData = () => { /* uses query */ };\n//   useEffect(() => { fetchData(); }, []); // BAD!\n// }\n\n// SOLUTION: Move function INSIDE the effect!\nfunction Search({ query }) {\n  useEffect(() => {\n    function fetchData() {\n      console.log('Searching:', query);\n    }\n    fetchData();\n  }, [query]); // Clean, honest, self-contained!\n}`,
      lineByLine: [
        'Line 9: fetchData is moved inside useEffect.',
        'Line 13: Only query is needed in dependencies, making the effect completely honest and self-contained.'
      ],
      expectedBehavior: 'Linter passes with zero warnings, and query updates always re-trigger search.',
      commonMistakes: ['Disabling ESLint warnings instead of refactoring.', 'Passing object literals directly into dependency arrays.'],
      practiceLevels: {
        levelA: 'Refactor a component by moving an effect helper function inside the useEffect.',
        levelB: 'Use useCallback to stabilize a function that must be shared between multiple effects.',
        levelC: 'Extract a non-reactive constant outside the component function entirely.'
      },
      debuggingChallenge: {
        brokenCode: `function View({ id }) {\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => { loadItem(id); }, []); // Ignores id changes!\n}`,
        problem: 'When user navigates to a new id, component fails to load new item.',
        fix: 'Add [id] to deps and remove eslint-disable.'
      },
      conceptualQuestion: {
        question: 'Why is suppressing `exhaustive-deps` with `// eslint-disable` considered dangerous in React?',
        options: [
          'Vite build will fail in production.',
          'It creates invisible stale closure bugs where the effect continues referencing outdated values without re-running when props or state change.',
          'It slows down browser JavaScript parsing.',
          'It breaks CSS styles.'
        ],
        correctIndex: 1,
        explanation: 'Lying to React about dependencies prevents effects from updating when data changes, creating subtle stale state bugs.'
      },
      codeReadingQuestion: {
        snippet: `const SERVER_URL = 'https://api.com'; // outside component\nfunction App() { useEffect(() => { connect(SERVER_URL); }, []); }`,
        question: 'Does SERVER_URL need to be in the dependency array?',
        answer: 'No! Because SERVER_URL is defined outside the component, it is static (non-reactive) and cannot change across renders.'
      },
      starterCode: `// Assignment: Implement validateExhaustiveDeps\n// Simulates the exhaustive-deps linter rule:\n// validateExhaustiveDeps(usedVariables, declaredDeps)\n// usedVariables: string[] (all variables used inside effect)\n// declaredDeps: string[] (variables listed in dependency array)\n// Return: { isHonest: boolean, missingDeps: string[] }\n\nexport function validateExhaustiveDeps(usedVariables, declaredDeps) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Flags missing dependencies honestly',
          run: (fn) => {
            const used = ['userId', 'theme', 'config'];
            const declared = ['userId'];
            const res = fn(used, declared);
            return res.isHonest === false && res.missingDeps.includes('theme') && res.missingDeps.includes('config');
          }
        },
        {
          name: 'Approves fully declared dependencies',
          run: (fn) => {
            const used = ['query'];
            const declared = ['query', 'extra'];
            return fn(used, declared).isHonest === true;
          }
        }
      ],
      hints: [
        'Find items in usedVariables that are not included in declaredDeps.'
      ],
      checklist: [
        'Identified missing reactive dependencies',
        'Determined honesty boolean',
        'Returned accurate missing array'
      ],
      revisionSummary: 'Satisfy exhaustive-deps honestly; move functions inside effects or hoist non-reactive variables.'
    },
    {
      id: 'p3-l18',
      slug: 'separating-event-logic-from-effect-logic',
      title: 'Separating Event Logic from Effect Logic',
      prerequisites: ['p3-l17'],
      estimatedDuration: '25 mins',
      difficulty: 'Advanced',
      objectives: ['Distinguish event-driven code (user caused) from synchronization code (state caused).', 'Understand experimental useEffectEvent / reactive separation.', 'Avoid triggering effects when non-reactive notification values change.'],
      explanation: 'Event handlers run in response to specific user interactions (clicking a button, submitting a form). Effects run in response to state synchronization. Mixing the two causes bugs—such as wanting an effect to run when `roomId` changes, but reading `theme` inside without wanting the effect to reconnect when `theme` changes.',
      whyItExists: 'Separates reactive synchronization triggers from non-reactive operational reads.',
      syntaxRules: 'Ask: "Should this code run because the user clicked something (Event Handler), or because the screen displayed something (Effect)?"',
      codeExample: `// Clear separation\nfunction ChatRoom({ roomId, theme }) {\n  // 1. Effect synchronizes with external chat server when roomId changes\n  useEffect(() => {\n    const conn = connect(roomId);\n    conn.onMessage(msg => {\n      // 2. Notification displays using current theme WITHOUT theme in deps!\n      showNotification(msg, theme);\n    });\n    return () => conn.disconnect();\n  }, [roomId]); // Re-connect only when roomId changes, not on theme change!\n}`,
      lineByLine: [
        'Line 4: useEffect responds to roomId changes.',
        'Line 10: [roomId] controls connection lifecycle independently of cosmetic theme changes.'
      ],
      expectedBehavior: 'Toggling theme does not disconnect and reconnect the chat room.',
      commonMistakes: ['Putting form submission logic in useEffect.', 'Reconnecting WebSockets or refetching data just because a cosmetic theme changed.'],
      practiceLevels: {
        levelA: 'Move a cart checkout API call from an effect to the button onClick.',
        levelB: 'Read latest theme inside a WebSocket listener without re-triggering connection.',
        levelC: 'Implement a custom useEvent hook wrapper using useRef and useCallback.'
      },
      debuggingChallenge: {
        brokenCode: `useEffect(() => {\n  if (cartSubmitted) {\n    submitCart(items);\n  }\n}, [cartSubmitted, items]);`,
        problem: 'Uses effect to handle a user submit action, creating race conditions and complex state flags.',
        fix: 'Call submitCart(items) directly inside the form onSubmit handler.'
      },
      conceptualQuestion: {
        question: 'Which is the correct place to send an analytics log when a user clicks the "Purchase" button?',
        options: [
          'Inside a useEffect with [purchased] dependency.',
          'Directly inside the purchase button\'s `onClick` event handler.',
          'Inside the root App component render body.',
          'In an Error Boundary.'
        ],
        correctIndex: 1,
        explanation: 'User-driven actions belong directly in event handlers. Effects are for synchronization after state changes.'
      },
      codeReadingQuestion: {
        snippet: `// Is navigation after login an event or an effect?`,
        question: 'Where should navigate("/dashboard") be placed upon successful login button click?',
        answer: 'Inside the async submit event handler, after the login Promise resolves.'
      },
      starterCode: `// Assignment: Implement classifyTriggerSource\n// Determine whether logic belongs in an 'EVENT_HANDLER' or 'EFFECT':\n// classifyTriggerSource(scenario)\n// 1. 'USER_CLICKED_SUBMIT' -> 'EVENT_HANDLER'\n// 2. 'KEY_PRESSED_ENTER' -> 'EVENT_HANDLER'\n// 3. 'URL_PARAM_CHANGED_SYNC_DATA' -> 'EFFECT'\n// 4. 'WINDOW_RESIZED_EXTERNAL' -> 'EFFECT'\n// 5. 'USER_CLICKED_LIKE' -> 'EVENT_HANDLER'\n// Return { placement: 'EVENT_HANDLER' | 'EFFECT', rationale: string }\n\nexport function classifyTriggerSource(scenario) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Categorizes user interactions to event handlers',
          run: (fn) => {
            const r1 = fn('USER_CLICKED_SUBMIT');
            const r2 = fn('KEY_PRESSED_ENTER');
            return r1.placement === 'EVENT_HANDLER' && r2.placement === 'EVENT_HANDLER';
          }
        },
        {
          name: 'Categorizes external synchronizations to effects',
          run: (fn) => {
            const r1 = fn('URL_PARAM_CHANGED_SYNC_DATA');
            return r1.placement === 'EFFECT';
          }
        }
      ],
      hints: [
        'User interactions -> EVENT_HANDLER; State/external synchronizations -> EFFECT.'
      ],
      checklist: [
        'Separated user events from state effects',
        'Returned placement and rationale'
      ],
      revisionSummary: 'Execute user-triggered actions in event handlers; reserve useEffect strictly for synchronizing state with external systems.'
    },
    {
      id: 'p3-l19',
      slug: 'useid-accessible-identifiers',
      title: 'useId: Generating Unique Accessible Identifiers',
      prerequisites: ['p2-l14'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Generate unique IDs that are stable across SSR and client hydration.', 'Link accessibility attributes: aria-labelledby, aria-describedby, htmlFor.', 'Avoid using useId for list keys.'],
      explanation: 'useId is a hook for generating unique IDs that are stable across server-side rendering and client hydration. Hardcoded string IDs (id="email") collide if a component is used more than once on a page. Math.random() mismatches between server and client HTML causing hydration errors. useId solves both.',
      whyItExists: 'Enables accessible forms without ID collisions or SSR hydration mismatch warnings.',
      syntaxRules: 'const id = useId(); <label htmlFor={id}> ... <input id={id} />. Never use useId to generate keys for lists (use data IDs).',
      codeExample: `import { useId } from 'react';\n\nfunction PasswordField() {\n  const passwordHintId = useId();\n\n  return (\n    <div>\n      <input\n        type="password"\n        aria-describedby={passwordHintId}\n      />\n      <p id={passwordHintId}>\n        Must contain at least 8 characters.\n      </p>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: useId() generates a unique string like ":r1:" safe for HTML IDs.',
        'Line 9: aria-describedby links the input to the hint paragraph.',
        'Line 11: Paragraph receives the matching ID.'
      ],
      expectedBehavior: 'Screen readers read the hint text when the input is focused, with zero ID collisions.',
      commonMistakes: ['Using useId() to generate keys in an array.map() (use item.id instead!).', 'Modifying the generated ID with custom string prefixes unnecessarily.'],
      practiceLevels: {
        levelA: 'Link a checkbox to its description text via useId and aria-describedby.',
        levelB: 'Create an accessible FormSection with title linked via aria-labelledby.',
        levelC: 'Verify that two instances of a component on one page produce different unique IDs.'
      },
      debuggingChallenge: {
        brokenCode: `function Items({ list }) {\n  const id = useId();\n  return <ul>{list.map(item => <li key={id}>{item}</li>)}</ul>;\n}`,
        problem: 'All list items get the exact same key={id}, causing duplicate key warnings and reconciliation bugs.',
        fix: 'Use item.id or item unique identifier for key, not useId().'
      },
      conceptualQuestion: {
        question: 'Why should `useId()` NOT be used to generate keys for mapping lists (`key={useId()}`)?',
        options: [
          'Because useId returns numbers, not strings.',
          'useId generates one stable ID for the component instance; it cannot generate distinct keys for different items in an array, resulting in duplicate keys.',
          'Because useId is deprecated.',
          'It is only allowed inside forms.'
        ],
        correctIndex: 1,
        explanation: 'useId produces a single unique ID for that component call, not a sequence of keys for list elements.'
      },
      codeReadingQuestion: {
        snippet: `const id = useId();\n<input id={id + '-first'} />\n<input id={id + '-last'} />`,
        question: 'Is deriving multiple sub-IDs from a single useId() call valid practice?',
        answer: 'Yes! Appending suffixes to a single useId() is officially recommended by React for multi-field components.'
      },
      starterCode: `// Assignment: Implement generateAccessibleIds\n// Simulate useId sub-identifier generation:\n// generateAccessibleIds(baseId, fieldNames)\n// baseId: string (e.g. ':r1:')\n// fieldNames: string[] (e.g. ['name', 'email', 'hint'])\n// Returns an object mapping: { [field]: \`\${baseId}-\${field}\` }\n\nexport function generateAccessibleIds(baseId, fieldNames) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Generates scoped IDs for fields',
          run: (fn) => {
            const res = fn(':r1:', ['name', 'email']);
            return res.name === ':r1:-name' && res.email === ':r1:-email';
          }
        }
      ],
      hints: [
        'Use reduce to map fieldNames into an object with `${baseId}-${field}` values.'
      ],
      checklist: [
        'Prefixed with baseId',
        'Generated mapping for all fields'
      ],
      revisionSummary: 'useId generates stable unique IDs for form accessibility across SSR and client; never use for list keys.'
    },
    {
      id: 'p3-l20',
      slug: 'usetransition-non-blocking-updates',
      title: 'useTransition: Prioritizing Urgent vs Non-Urgent Updates',
      prerequisites: ['p3-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Differentiate urgent updates (typing, clicking) from non-urgent transitions (filtering a large list).', 'Keep input typing responsive while background views update.', 'Use isPending boolean to show loading spinners during transitions.'],
      explanation: 'In React, all state updates used to be treated with equal urgency. If filtering a 10,000-row table took 100ms, the user typing into the search input would freeze and lag. useTransition lets you mark updates as non-urgent: startTransition(() => setFilteredData(...)). Urgent updates (like typing text) interrupt and take priority over the transition!',
      whyItExists: 'Maintains snappy 60fps input responsiveness during heavy UI rendering without freezing the page.',
      syntaxRules: 'const [isPending, startTransition] = useTransition(). Wrap non-urgent state setters inside startTransition(() => { ... }).',
      codeExample: `import { useState, useTransition } from 'react';\n\nfunction TabContainer() {\n  const [tab, setTab] = useState('home');\n  const [isPending, startTransition] = useTransition();\n\n  const selectTab = (nextTab) => {\n    // Non-urgent transition: User can still click other tabs while loading!\n    startTransition(() => {\n      setTab(nextTab);\n    });\n  };\n\n  return (\n    <div>\n      <button onClick={() => selectTab('posts')}>Posts</button>\n      {isPending && <span className="spinner">Updating...</span>}\n      <TabContent tab={tab} />\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 5: useTransition returns isPending flag and startTransition wrapper.',
        'Line 9: Marks setTab as non-urgent transition.',
        'Line 16: isPending lets you display an inline indicator while the heavy view prepares.'
      ],
      expectedBehavior: 'UI remains fully responsive to clicks while heavy tab renders in the background.',
      commonMistakes: ['Wrapping controlled text input setters in startTransition (typing must remain urgent!).', 'Putting async fetch operations inside startTransition (startTransition callback must be synchronous).'],
      practiceLevels: {
        levelA: 'Mark a slow tab switch as a transition and show an isPending spinner.',
        levelB: 'Keep a search text input instant while list filtering runs in a transition.',
        levelC: 'Measure input latency before and after useTransition using Chrome DevTools Performance tab.'
      },
      debuggingChallenge: {
        brokenCode: `const handleType = (e) => {\n  startTransition(() => {\n    setText(e.target.value); // Laggy input!\n  });\n};`,
        problem: 'Controlled input values must update urgently; wrapping them in transition causes input stuttering.',
        fix: 'setText(e.target.value) immediately; wrap the heavy filtered list state update in startTransition.'
      },
      conceptualQuestion: {
        question: 'What is the purpose of `useTransition` in React?',
        options: [
          'To animate CSS opacity transitions.',
          'To mark state updates as non-urgent transitions, keeping user interactions (like typing and clicking) responsive while heavy components render in the background.',
          'To migrate from React 17 to React 18.',
          'To replace async/await.'
        ],
        correctIndex: 1,
        explanation: 'useTransition marks state updates as non-urgent, allowing React to interrupt them to process urgent user input.'
      },
      codeReadingQuestion: {
        snippet: `const [isPending, startTransition] = useTransition();`,
        question: 'What is isPending and when is it true?',
        answer: 'isPending is a boolean that is true while the non-urgent transition is being rendered in the background.'
      },
      starterCode: `// Assignment: Implement classifyUpdateUrgency\n// Classify whether an update should be URGENT or a TRANSITION:\n// classifyUpdateUrgency(actionType)\n// Urgent: 'TEXT_INPUT_TYPING', 'BUTTON_CLICK_TOGGLE', 'CHECKBOX_SELECTION', 'KEYBOARD_NAVIGATION'\n// Transition: 'FILTER_LARGE_LIST', 'SWITCH_HEAVY_TAB', 'CHART_RECALCULATION', 'PAGE_NAVIGATION'\n// Return: { isTransition: boolean, priority: 'urgent' | 'low' }\n\nexport function classifyUpdateUrgency(actionType) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Categorizes typing as urgent and heavy list filtering as transition',
          run: (fn) => {
            const r1 = fn('TEXT_INPUT_TYPING');
            const r2 = fn('FILTER_LARGE_LIST');
            return r1.isTransition === false && r1.priority === 'urgent' && r2.isTransition === true && r2.priority === 'low';
          }
        }
      ],
      hints: [
        'Check if actionType is in the transition list.'
      ],
      checklist: [
        'Separated urgent input from heavy transitions',
        'Returned structured priority report'
      ],
      revisionSummary: 'useTransition marks heavy updates as non-urgent, keeping typing and clicking responsive.'
    },
    {
      id: 'p3-l21',
      slug: 'usedeferredvalue-responsive-ui',
      title: 'useDeferredValue: Deferring Stale Value Updates',
      prerequisites: ['p3-l20'],
      estimatedDuration: '25 mins',
      difficulty: 'Advanced',
      objectives: ['Defer re-rendering of expensive child trees using useDeferredValue(value).', 'Differentiate debouncing (delays firing) from deferring (renders immediately if idle).', 'Provide stale UI feedback while deferred value catches up.'],
      explanation: 'useDeferredValue accepts a value and returns a deferred version of it. During urgent updates (e.g. typing in an input), React renders the input immediately with the new value, while the deferred value retains the previous value. Once the urgent work is done, React renders in the background with the new deferred value. Unlike debouncing (which adds a fixed delay like 300ms), useDeferredValue is instant if the device is fast!',
      whyItExists: 'Optimizes child rendering without fixed latency delays or timers.',
      syntaxRules: 'const deferredValue = useDeferredValue(value). Pass deferredValue to the expensive child component (which should be wrapped in React.memo).',
      codeExample: `import { useState, useDeferredValue, memo } from 'react';\n\nfunction SearchApp() {\n  const [query, setQuery] = useState('');\n  const deferredQuery = useDeferredValue(query); // Lags behind during typing\n  const isStale = query !== deferredQuery;\n\n  return (\n    <div>\n      <input value={query} onChange={e => setQuery(e.target.value)} />\n      <div style={{ opacity: isStale ? 0.6 : 1 }}>\n        <HeavyResultsList query={deferredQuery} />\n      </div>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 5: deferredQuery holds the previous value while query updates instantly.',
        'Line 6: isStale indicates when the results list is catching up.',
        'Line 11: Opacity dims slightly while background render completes.'
      ],
      expectedBehavior: 'Input stays buttery smooth while heavy results list updates as fast as CPU allows.',
      commonMistakes: ['Forgetting to wrap the child component in React.memo (useDeferredValue needs memoization to skip re-renders).', 'Confusing useDeferredValue with debounced setTimeout.'],
      practiceLevels: {
        levelA: 'Dim the opacity of a search list while query !== deferredQuery.',
        levelB: 'Compare useDeferredValue performance against lodash.debounce.',
        levelC: 'Test on throttled 4x slowdown CPU in DevTools.'
      },
      debuggingChallenge: {
        brokenCode: `function App() {\n  const [text, setText] = useState('');\n  const deferred = useDeferredValue(text);\n  return <NonMemoList text={deferred} />; // Re-renders anyway on every keystroke!\n}`,
        problem: 'NonMemoList is not memoized; parent render forces it to re-render regardless of deferred value.',
        fix: 'Wrap child in React.memo: const MemoList = memo(NonMemoList);'
      },
      conceptualQuestion: {
        question: 'How does `useDeferredValue` differ from traditional `debounce` (e.g. setTimeout 300ms)?',
        options: [
          'useDeferredValue only works with strings.',
          'Debounce introduces a fixed artificial waiting delay (e.g. 300ms) regardless of machine speed; useDeferredValue renders immediately if the device is fast and adapts dynamically to CPU load without fixed delays.',
          'Debounce is built into React 19.',
          'useDeferredValue runs on a separate server.'
        ],
        correctIndex: 1,
        explanation: 'useDeferredValue is dynamic and interruptible; it skips fixed delay timers and renders as quickly as the CPU permits.'
      },
      codeReadingQuestion: {
        snippet: `const isStale = query !== deferredQuery;`,
        question: 'What does isStale represent in this pattern?',
        answer: 'It indicates that the user has typed newer input that the deferred component has not finished rendering yet.'
      },
      starterCode: `// Assignment: Implement simulateDeferredLag\n// Simulate useDeferredValue state tracking:\n// simulateDeferredLag(history)\n// history: array of typed keystrokes with timestamps: [{ time: number, text: string }]\n// If time between keystrokes < 50ms, deferredText does not update immediately.\n// Return: [{ text: string, deferredText: string, isStale: boolean }]\n\nexport function simulateDeferredLag(history) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Maintains stale deferred text during rapid keystrokes',
          run: (fn) => {
            const h = [
              { time: 0, text: 'a' },
              { time: 20, text: 'ab' }, // < 50ms: stays 'a'
              { time: 100, text: 'abc' } // >= 50ms: catches up
            ];
            const res = fn(h);
            return res[1].isStale === true && res[1].deferredText === 'a' && res[2].isStale === false && res[2].deferredText === 'abc';
          }
        }
      ],
      hints: [
        'Track previous time; if diff < 50, keep previous deferredText, else update deferredText.'
      ],
      checklist: [
        'Tracked stale state during rapid bursts',
        'Caught up when idle',
        'Reported isStale flag'
      ],
      revisionSummary: 'useDeferredValue dynamically defers heavy child rendering without fixed debounce delays.'
    },
    {
      id: 'p3-l22',
      slug: 'usesyncexternalstore-integration',
      title: 'useSyncExternalStore: Subscribing to External Stores',
      prerequisites: ['p3-l14'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: ['Subscribe to non-React data stores (browser APIs, Zustand, Redux) safely.', 'Prevent tearing in concurrent React.', 'Implement custom browser store subscribers (window.navigator.onLine, media queries).'],
      explanation: 'In concurrent React, rendering can pause and resume. If an external store changes in the middle of a render, two components on the screen could read different values from the same store—a visual glitch called "tearing". useSyncExternalStore is the official React 18+ primitive for subscribing to external non-React stores synchronously without tearing.',
      whyItExists: 'Guarantees consistent, non-tearing reads from third-party state stores and browser APIs.',
      syntaxRules: 'const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot). getSnapshot must return an immutable or cached value.',
      codeExample: `// Custom Window Online Store\nfunction subscribeOnline(callback) {\n  window.addEventListener('online', callback);\n  window.addEventListener('offline', callback);\n  return () => {\n    window.removeEventListener('online', callback);\n    window.removeEventListener('offline', callback);\n  };\n}\n\nfunction getOnlineSnapshot() {\n  return navigator.onLine;\n}\n\nexport function useNetworkStatus() {\n  return useSyncExternalStore(subscribeOnline, getOnlineSnapshot);\n}`,
      lineByLine: [
        'Line 2: subscribe function registers listener and returns unbind cleanup.',
        'Line 10: getSnapshot returns the current value from the external browser API.',
        'Line 15: useSyncExternalStore guarantees tear-free synchronization with React.'
      ],
      expectedBehavior: 'Component updates instantly when browser goes offline/online with zero tearing.',
      commonMistakes: ['Returning a new object from getSnapshot on every call (e.g. () => ({ count })) which causes an infinite render loop! getSnapshot must return cached or primitive values.', 'Using useEffect + useState instead of useSyncExternalStore for external libraries.'],
      practiceLevels: {
        levelA: 'Build useWindowWidth() using useSyncExternalStore and resize listener.',
        levelB: 'Build a dark mode media query subscriber: usePrefersDarkMode().',
        levelC: 'Inspect how Zustand implements its store selector via useSyncExternalStore.'
      },
      debuggingChallenge: {
        brokenCode: `function getSnapshot() {\n  return { width: window.innerWidth }; // Infinite loop!\n}`,
        problem: 'getSnapshot returns a new object reference every time React checks it, causing infinite re-renders.',
        fix: 'Return a primitive: return window.innerWidth;'
      },
      conceptualQuestion: {
        question: 'What is "tearing" in concurrent React, which `useSyncExternalStore` prevents?',
        options: [
          'A screen tearing effect caused by monitor refresh rate mismatches.',
          'When concurrent rendering pauses and resumes while an external store changes, causing different UI components on the same screen to render conflicting data snapshots.',
          'When HTML DOM nodes are torn from the tree.',
          'A crash in Vite dev server.'
        ],
        correctIndex: 1,
        explanation: 'Tearing occurs when a shared external store mutates midway through an async render, causing visible data inconsistencies on screen.'
      },
      codeReadingQuestion: {
        snippet: `useSyncExternalStore(store.subscribe, () => store.getState().user);`,
        question: 'Why must store.getState().user return referentially stable data if it is an object?',
        answer: 'React compares getSnapshot() output with Object.is; unstable object references trigger infinite re-render loops.'
      },
      starterCode: `// Assignment: Implement simulateExternalStoreSubscription\n// Create an external store subscription simulator:\n// createMockExternalStore(initialState)\n// Returns: { subscribe: (cb) => unsubscribe, getState: () => any, setState: (val) => void }\n// When setState is called, update internal state and notify all active subscribers.\n\nexport function createMockExternalStore(initialState) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Notifies subscribers on state change',
          run: (fn) => {
            const store = fn(100);
            let observed = null;
            const unsub = store.subscribe(() => { observed = store.getState(); });
            store.setState(200);
            const r1 = observed === 200;
            unsub();
            store.setState(300);
            return r1 && observed === 200; // Unsubscribed, did not update to 300
          }
        }
      ],
      hints: [
        'Maintain a Set of callbacks; subscribe adds callback and returns () => set.delete(cb).'
      ],
      checklist: [
        'Implemented subscribe with unsubscribe return',
        'Notified subscribers on setState',
        'Returned getState snapshot'
      ],
      revisionSummary: 'useSyncExternalStore is the concurrent-safe primitive for subscribing to external state without tearing.'
    },
    {
      id: 'p3-l23',
      slug: 'react19-useactionstate-useoptimistic',
      title: 'React 19: useActionState and useOptimistic',
      prerequisites: ['p2-l12', 'p1-l22'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Manage asynchronous form actions with useActionState.', 'Display instant optimistic updates with useOptimistic.', 'Handle automatic rollback on server action failure.'],
      explanation: 'React 19 introduces native form action hooks. useActionState manages pending states, returned data, and errors from async actions automatically: const [state, formAction, isPending] = useActionState(asyncFn, initial). useOptimistic displays the expected UI state immediately before the server response returns, automatically rolling back if the request fails.',
      whyItExists: 'Eliminates boilerplate useState/try/catch for forms and delivers instant app-like optimistic UI.',
      syntaxRules: 'const [optimisticState, setOptimistic] = useOptimistic(state, updateFn). Must be used within an async Action.',
      codeExample: `// React 19 Action & Optimistic Pattern\nimport { useActionState, useOptimistic } from 'react';\n\nasync function updateNameAction(prevName, formData) {\n  const newName = formData.get('name');\n  await apiUpdateUser(newName);\n  return newName;\n}\n\nfunction ProfileName({ currentName }) {\n  const [name, formAction, isPending] = useActionState(updateNameAction, currentName);\n  const [optimisticName, setOptimisticName] = useOptimistic(\n    name,\n    (current, update) => update\n  );\n\n  const handleSubmit = async (formData) => {\n    setOptimisticName(formData.get('name')); // Instant UI feedback!\n    await formAction(formData);\n  };\n\n  return (\n    <form action={handleSubmit}>\n      <h2>User: {optimisticName} {isPending && '(Saving...)'}</h2>\n      <input name="name" defaultValue={name} />\n      <button type="submit" disabled={isPending}>Save</button>\n    </form>\n  );\n}`,
      lineByLine: [
        'Line 9: useActionState automatically manages the async form action, current state, and isPending flag.',
        'Line 10: useOptimistic shows the new name instantly while server request is in flight.',
        'Line 17: If the server request fails, React rolls optimisticName back to name automatically!'
      ],
      expectedBehavior: 'Instant UI response on submit with automatic error rollback.',
      commonMistakes: ['Manual optimistic updates without error rollback logic.', 'Forgetting that useActionState receives (prevState, formData) as parameters.'],
      practiceLevels: {
        levelA: 'Implement a like button with useOptimistic instant heart fill.',
        levelB: 'Manage a comment submission with useActionState.',
        levelC: 'Demonstrate automatic rollback when network throws an error.'
      },
      debuggingChallenge: {
        brokenCode: `// Action handler signature:\nasync function myAction(formData) { /* Missing prevState! */ }`,
        problem: 'useActionState passes (prevState, formData); missing prevState shifts argument positions.',
        fix: 'async function myAction(prevState, formData) { ... }'
      },
      conceptualQuestion: {
        question: 'What is the primary benefit of `useOptimistic` in React 19?',
        options: [
          'It forces the network to download faster.',
          'It shows the expected final state immediately to the user while an async action is in flight, and automatically reverts to the real server state if the action fails.',
          'It prevents forms from submitting.',
          'It replaces MongoDB.'
        ],
        correctIndex: 1,
        explanation: 'useOptimistic delivers instant perceived responsiveness by predicting the UI state and handling error rollback automatically.'
      },
      codeReadingQuestion: {
        snippet: `const [state, formAction, isPending] = useActionState(saveFn, null);`,
        question: 'What does isPending represent in React 19?',
        answer: 'A boolean that is true while the async saveFn is actively executing.'
      },
      starterCode: `// Assignment: Implement simulateOptimisticRollback\n// Simulate optimistic action with rollback:\n// simulateOptimisticAction(currentValue, optimisticValue, asyncFn)\n// 1. Return optimisticValue immediately.\n// 2. Await asyncFn().\n// 3. If asyncFn succeeds -> commit final result from asyncFn.\n// 4. If asyncFn throws error -> rollback to currentValue.\n// Return: { finalValue: string, wasRolledBack: boolean }\n\nexport async function simulateOptimisticAction(currentValue, optimisticValue, asyncFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Commits result on success',
          run: async (fn) => {
            const res = await fn('Old', 'Optimistic', async () => 'ServerConfirmed');
            return res.finalValue === 'ServerConfirmed' && res.wasRolledBack === false;
          }
        },
        {
          name: 'Rolls back to currentValue on failure',
          run: async (fn) => {
            const res = await fn('Old', 'Optimistic', async () => { throw new Error('500'); });
            return res.finalValue === 'Old' && res.wasRolledBack === true;
          }
        }
      ],
      hints: [
        'Use try/catch around asyncFn().'
      ],
      checklist: [
        'Handled success commit',
        'Caught error and rolled back to currentValue',
        'Reported wasRolledBack flag'
      ],
      revisionSummary: 'React 19 useActionState and useOptimistic streamline form actions and instant optimistic updates with automatic rollback.'
    },
    {
      id: 'p3-l24',
      slug: 'useimperativehandle-dom-exposure',
      title: 'useImperativeHandle: Custom Ref Handles',
      prerequisites: ['p3-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Advanced',
      objectives: ['Customize the instance value exposed when a parent passes a ref to a child.', 'Expose specific methods (focus, scroll, reset) instead of raw DOM nodes.', 'Limit DOM access to maintain encapsulation.'],
      explanation: 'By default, passing a ref exposes the raw DOM node (<input>, <div>). useImperativeHandle lets a child component customize what is exposed to the parent. Instead of giving the parent total uncontrolled access to the DOM node, you expose a restricted API: { focus(), scrollToBottom() }.',
      whyItExists: 'Protects component encapsulation by restricting external access to a safe public method contract.',
      syntaxRules: 'useImperativeHandle(ref, createHandle, [deps]). Always paired with ref prop (or forwardRef in pre-React 19).',
      codeExample: `import { useImperativeHandle, useRef } from 'react';\n\nfunction CustomInput({ ref }) { // React 19 ref prop\n  const realInputRef = useRef(null);\n\n  // Expose ONLY focus and clear methods to parent\n  useImperativeHandle(ref, () => ({\n    focus() {\n      realInputRef.current?.focus();\n    },\n    clear() {\n      if (realInputRef.current) realInputRef.current.value = '';\n    }\n  }), []);\n\n  return <input ref={realInputRef} />;\n}`,
      lineByLine: [
        'Line 4: realInputRef points to the real HTMLInputElement privately.',
        'Line 7: useImperativeHandle populates parent\'s ref with only focus and clear methods.',
        'Parent CANNOT access or mutate styling or other DOM properties directly.'
      ],
      expectedBehavior: 'Parent calls ref.current.focus() cleanly without direct DOM exposure.',
      commonMistakes: ['Overusing imperative handles for everyday communication (prefer props and state!).', 'Forgetting dependency array in useImperativeHandle.'],
      practiceLevels: {
        levelA: 'Build a VideoPlayer component exposing play() and pause() via ref.',
        levelB: 'Build a FormModal exposing open() and close() methods.',
        levelC: 'Expose a smooth-scroll-to-bottom imperative handle on a ChatLog.'
      },
      debuggingChallenge: {
        brokenCode: `// Parent calls childRef.current.style.color = 'red';\n// Throws: Cannot set properties of undefined (setting 'color')`,
        problem: 'Child used useImperativeHandle and did not expose .style property.',
        fix: 'Component intentionally encapsulates its style; communicate via props instead.'
      },
      conceptualQuestion: {
        question: 'Why would a developer use `useImperativeHandle` instead of exposing the raw DOM node directly?',
        options: [
          'To make the component load faster.',
          'To enforce encapsulation by exposing only specific permitted methods (like focus or reset), preventing parents from directly mutating arbitrary DOM properties.',
          'Because React 19 banned refs.',
          'It is required by TypeScript.'
        ],
        correctIndex: 1,
        explanation: 'useImperativeHandle acts as an API gateway, exposing a safe public method contract rather than raw DOM elements.'
      },
      codeReadingQuestion: {
        snippet: `useImperativeHandle(ref, () => ({ scroll: () => {} }), []);`,
        question: 'What properties will `ref.current` have in the parent component?',
        answer: 'Only the `scroll` method defined in the return object.'
      },
      starterCode: `// Assignment: Implement filterExposedHandleApi\n// Simulates useImperativeHandle method filtering:\n// filterExposedHandleApi(rawDomNode, allowedMethods)\n// allowedMethods: string[] (e.g. ['focus', 'blur'])\n// Returns an object containing ONLY the allowed methods bound to rawDomNode.\n\nexport function filterExposedHandleApi(rawDomNode, allowedMethods) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Exposes only specified allowed methods',
          run: (fn) => {
            let focused = false;
            const mockNode = {
              focus: () => { focused = true; },
              blur: () => {},
              innerHTML: '<bad>',
              style: {}
            };
            const handle = fn(mockNode, ['focus']);
            handle.focus();
            return focused === true && handle.innerHTML === undefined && handle.style === undefined;
          }
        }
      ],
      hints: [
        'Reduce allowedMethods into an object binding mockNode[method].'
      ],
      checklist: [
        'Exposed allowed methods',
        'Excluded sensitive DOM properties',
        'Preserved method invocation behavior'
      ],
      revisionSummary: 'useImperativeHandle customizes the ref value exposed to parents, preserving component encapsulation.'
    },
    {
      id: 'p3-l25',
      slug: 'uselayouteffect-synchronous-dom',
      title: 'useLayoutEffect: Synchronous DOM Measurements',
      prerequisites: ['p3-l2', 'p3-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Advanced',
      objectives: ['Learn when useLayoutEffect runs: synchronously after DOM mutation, BEFORE browser paint.', 'Prevent visual flickering when measuring and adjusting DOM layout.', 'Recognize why useEffect is preferred 99% of the time.'],
      explanation: 'useEffect runs asynchronously AFTER the browser has painted the screen. If you measure an element and immediately reposition it using useEffect, the user sees a visible flicker: the element appears at position A, then jumps to position B. useLayoutEffect runs SYNCHRONOUSLY before the browser paints, eliminating layout flicker.',
      whyItExists: 'Allows measuring DOM layout and applying adjustments before the user sees the screen.',
      syntaxRules: 'Use useLayoutEffect ONLY when you must measure DOM (tooltips, popovers, canvas) and synchronously update state before paint. Otherwise use useEffect.',
      codeExample: `import { useLayoutEffect, useRef, useState } from 'react';\n\nfunction Tooltip({ targetRect, text }) {\n  const ref = useRef(null);\n  const [coords, setCoords] = useState({ top: 0, left: 0 });\n\n  useLayoutEffect(() => {\n    // Measure tooltip height BEFORE browser paints screen!\n    const height = ref.current.getBoundingClientRect().height;\n    setCoords({\n      top: targetRect.top - height,\n      left: targetRect.left\n    });\n  }, [targetRect]); // Zero visual flicker!\n\n  return <div ref={ref} style={{ position: 'fixed', top: coords.top, left: coords.left }}>{text}</div>;\n}`,
      lineByLine: [
        'Line 7: useLayoutEffect executes synchronously right after React commits DOM mutations.',
        'Line 9: Measures element dimensions before the browser repaints.',
        'The user only ever sees the tooltip in its correct final position.'
      ],
      expectedBehavior: 'Zero visual flickering or position jumps on initial tooltip mount.',
      commonMistakes: ['Using useLayoutEffect for data fetching (blocks the entire browser UI thread!).', 'Using useLayoutEffect during SSR (throws server warning; useLayoutEffect cannot run on server).'],
      practiceLevels: {
        levelA: 'Measure a popover height and flip it above the target if near the bottom edge.',
        levelB: 'Compare visual flicker between useEffect and useLayoutEffect on an animated box.',
        levelC: 'Resolve SSR hydration warnings with a useIsomorphicLayoutEffect utility.'
      },
      debuggingChallenge: {
        brokenCode: `useLayoutEffect(() => {\n  fetch('/api/heavy-data'); // Freezes browser UI painting!\n}, []);`,
        problem: 'useLayoutEffect is synchronous and blocks the browser from painting until completed.',
        fix: 'Move data fetching to standard useEffect.'
      },
      conceptualQuestion: {
        question: 'What is the critical timing difference between `useLayoutEffect` and `useEffect`?',
        options: [
          'useEffect runs before React updates the DOM; useLayoutEffect runs after.',
          'useLayoutEffect runs synchronously immediately after DOM mutations but BEFORE browser paint; useEffect runs asynchronously AFTER browser paint.',
          'useLayoutEffect only runs on mobile browsers.',
          'There is no difference in React 18+.'
        ],
        correctIndex: 1,
        explanation: 'useLayoutEffect runs before paint to allow synchronous DOM measurements without visual flickering.'
      },
      codeReadingQuestion: {
        snippet: `// React warning: useLayoutEffect does nothing on the server`,
        question: 'Why does this warning occur during Server-Side Rendering (SSR)?',
        answer: 'Because the server has no browser DOM to measure or paint.'
      },
      starterCode: `// Assignment: Implement selectEffectTimingHook\n// Choose between 'useEffect' and 'useLayoutEffect':\n// selectEffectTimingHook(requirement)\n// Requirements:\n// 1. 'MEASURE_DOM_BEFORE_PAINT' -> 'useLayoutEffect'\n// 2. 'POSITION_POPUP_AVOID_FLICKER' -> 'useLayoutEffect'\n// 3. 'FETCH_API_DATA' -> 'useEffect'\n// 4. 'DOCUMENT_TITLE_SYNC' -> 'useEffect'\n// 5. 'LOG_ANALYTICS' -> 'useEffect'\n// Return { recommendedHook: string, blocksPaint: boolean }\n\nexport function selectEffectTimingHook(requirement) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Assigns layout measurements to useLayoutEffect and API to useEffect',
          run: (fn) => {
            const r1 = fn('MEASURE_DOM_BEFORE_PAINT');
            const r2 = fn('FETCH_API_DATA');
            return r1.recommendedHook === 'useLayoutEffect' && r1.blocksPaint === true && r2.recommendedHook === 'useEffect' && r2.blocksPaint === false;
          }
        }
      ],
      hints: [
        'Layout measurements -> useLayoutEffect (blocksPaint: true); all else -> useEffect.'
      ],
      checklist: [
        'Separated DOM layout measurement from standard effects',
        'Accurately set blocksPaint boolean'
      ],
      revisionSummary: 'useLayoutEffect runs synchronously before paint for flicker-free measurements; use useEffect for everything else.'
    },
    {
      id: 'p3-l26',
      slug: 'useinsertioneffect-css-in-js',
      title: 'useInsertionEffect: CSS-in-JS Style Injection',
      prerequisites: ['p3-l25'],
      estimatedDuration: '20 mins',
      difficulty: 'Advanced',
      objectives: ['Understand when useInsertionEffect runs: before any DOM mutations or layout effects.', 'Learn why CSS-in-JS libraries (Emotion, styled-components) use this hook.', 'Recognize why app developers should almost never write useInsertionEffect.'],
      explanation: 'useInsertionEffect is a specialized hook designed exclusively for authors of CSS-in-JS libraries. It fires synchronously BEFORE any DOM mutations are written to the tree. This allows libraries to inject <style> tags into the document before React runs layout effects, ensuring styles are available before layout measurements happen.',
      whyItExists: 'Solves style recalculation performance bottlenecks in dynamic CSS-in-JS libraries.',
      syntaxRules: 'useInsertionEffect(setup, [deps]). App developers should NEVER use this hook directly—use standard CSS or CSS modules instead.',
      codeExample: `// Library-level usage (e.g. inside Emotion / Styled-Components)\nimport { useInsertionEffect } from 'react';\n\nfunction useCSS(cssString) {\n  useInsertionEffect(() => {\n    // Injects <style> tags BEFORE layout effects measure elements\n    const styleTag = document.createElement('style');\n    styleTag.textContent = cssString;\n    document.head.appendChild(styleTag);\n    return () => document.head.removeChild(styleTag);\n  }, [cssString]);\n}`,
      lineByLine: [
        'Line 4: useInsertionEffect runs before any useLayoutEffect or DOM mutations.',
        'Line 7: Inserts styles so that subsequent layout measurements have correct CSS rules applied.'
      ],
      expectedBehavior: 'Styles are available before any element dimensions are measured.',
      commonMistakes: ['Attempting to access refs or DOM elements inside useInsertionEffect (refs are not attached yet!).', 'Using useInsertionEffect in standard application code.'],
      practiceLevels: {
        levelA: 'Trace the order of all three effect hooks: insertion -> layout -> paint -> useEffect.',
        levelB: 'Inspect why ref.current is null inside useInsertionEffect.',
        levelC: 'Understand why modern React favors zero-runtime CSS (Tailwind, Vanilla CSS) over runtime insertion.'
      },
      debuggingChallenge: {
        brokenCode: `useInsertionEffect(() => {\n  console.log(myRef.current); // null!\n}, []);`,
        problem: 'useInsertionEffect executes before React has attached refs to DOM elements.',
        fix: 'Use useLayoutEffect or useEffect to access refs.'
      },
      conceptualQuestion: {
        question: 'Who is the intended audience for `useInsertionEffect` in React?',
        options: [
          'All React beginners.',
          'Authors of runtime CSS-in-JS libraries who need to inject <style> tags before any layout effects read DOM geometry.',
          'Backend developers writing Express.',
          'React Native developers.'
        ],
        correctIndex: 1,
        explanation: 'useInsertionEffect was introduced specifically for CSS-in-JS library authors to inject styles before layout calculations occur.'
      },
      codeReadingQuestion: {
        snippet: `// What is the execution sequence of React effects?`,
        question: 'Put useLayoutEffect, useEffect, and useInsertionEffect in chronological execution order:',
        answer: '1. useInsertionEffect, 2. useLayoutEffect, 3. (Browser Paint), 4. useEffect.'
      },
      starterCode: `// Assignment: Implement orderReactLifecycles\n// Order the sequence of React execution phases:\n// orderReactLifecycles(phases)\n// Valid order: 'RENDER' -> 'USE_INSERTION_EFFECT' -> 'DOM_MUTATIONS' -> 'USE_LAYOUT_EFFECT' -> 'BROWSER_PAINT' -> 'USE_EFFECT'\n// Return array of phases in exact chronological sequence.\n\nexport function orderReactLifecycles(phases) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Sorts lifecycle phases in correct React execution order',
          run: (fn) => {
            const input = ['USE_EFFECT', 'RENDER', 'USE_LAYOUT_EFFECT', 'USE_INSERTION_EFFECT', 'BROWSER_PAINT'];
            const res = fn(input);
            return JSON.stringify(res) === JSON.stringify([
              'RENDER',
              'USE_INSERTION_EFFECT',
              'USE_LAYOUT_EFFECT',
              'BROWSER_PAINT',
              'USE_EFFECT'
            ]);
          }
        }
      ],
      hints: [
        'Define a reference array of the exact chronological order and sort input by that index.'
      ],
      checklist: [
        'Placed RENDER first',
        'Placed USE_INSERTION_EFFECT before layout',
        'Placed BROWSER_PAINT before USE_EFFECT'
      ],
      revisionSummary: 'useInsertionEffect runs before DOM mutations exclusively for CSS-in-JS library style injection.'
    },
    {
      id: 'p3-l27',
      slug: 'understanding-when-not-to-use-a-hook',
      title: 'Understanding When NOT to Use a Hook',
      prerequisites: ['p3-l2', 'p3-l6', 'p3-l13'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify over-hooking anti-patterns.', 'Use pure plain JavaScript functions instead of hooks where appropriate.', 'Keep component architecture simple, readable, and performant.'],
      explanation: 'Just because hooks exist doesn\'t mean everything must be a hook! Beginners often create hooks for pure math utilities (useAdd(a, b)), wrap every 5-character string in useMemo, and write cascading useEffect chains. If a function doesn\'t need React state or lifecycles, it should be a regular, pure JavaScript function outside the component.',
      whyItExists: 'Prevents unnecessary cognitive overhead, memory waste, and over-engineering.',
      syntaxRules: 'If a function does not call any built-in React hooks, it is NOT a hook—it is a regular utility function.',
      codeExample: `// ANTI-PATTERN: Over-hooking a pure utility\n// function useFormatCurrency(amount) { // BAD! Unnecessary hook!\n//   return '$' + amount.toFixed(2);\n// }\n\n// CLEAN: Pure standard JavaScript function!\nexport function formatCurrency(amount) {\n  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);\n}\n\n// Usage in component:\nfunction PriceTag({ price }) {\n  return <span>{formatCurrency(price)}</span>; // Fast, pure, zero hooks!\n}`,
      lineByLine: [
        'Line 7: formatCurrency is a standard pure JavaScript function defined at module scope.',
        'Line 13: Called directly during render with zero React hook overhead.'
      ],
      expectedBehavior: 'Simple, blazing-fast rendering with zero hook management overhead.',
      commonMistakes: ['Prefixed pure helper functions with "use" out of habit.', 'Creating useEffect chains where state A triggers effect B which sets state C.'],
      practiceLevels: {
        levelA: 'Refactor 3 fake custom hooks into plain JavaScript utility functions.',
        levelB: 'Flatten a 3-step cascading useEffect chain into a single event handler.',
        levelC: 'Audit a component file and remove 50% of unnecessary hook invocations.'
      },
      debuggingChallenge: {
        brokenCode: `function useCalculateTax(total) {\n  const [tax, setTax] = useState(0);\n  useEffect(() => { setTax(total * 0.1); }, [total]);\n  return tax;\n}`,
        problem: 'Creates state, effect, and a 2-render cycle for a simple multiplication!',
        fix: 'export const calculateTax = (total) => total * 0.1;'
      },
      conceptualQuestion: {
        question: 'When should a utility be written as a regular JavaScript function rather than a Custom Hook?',
        options: [
          'Whenever it does not need to call any React hooks (like useState or useEffect) or access React component lifecycles.',
          'Never; in React everything must be a hook.',
          'Only when writing Node.js backend code.',
          'Only for math equations.'
        ],
        correctIndex: 0,
        explanation: 'If code does not use React primitives (useState, useEffect, etc.), it should be a pure JavaScript function to avoid hook overhead.'
      },
      codeReadingQuestion: {
        snippet: `const useDate = (d) => new Date(d).toLocaleDateString();`,
        question: 'Should this be a custom hook?',
        answer: 'No! It does not call any React hooks. It should be `formatDate(d)`.'
      },
      starterCode: `// Assignment: Implement auditHookOverhead\n// Audit whether functions should be HOOK or PLAIN_FUNCTION:\n// auditHookOverhead(functionList)\n// functionList: [{ name: string, callsOtherHooks: boolean, accessesDomRef: boolean }]\n// If callsOtherHooks || accessesDomRef -> 'KEEP_AS_HOOK'\n// Else -> 'CONVERT_TO_PLAIN_FUNCTION'\n// Return: { hooksToKeep: string[], utilitiesToExtract: string[] }\n\nexport function auditHookOverhead(functionList) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Separates genuine hooks from plain utilities',
          run: (fn) => {
            const list = [
              { name: 'useAuth', callsOtherHooks: true, accessesDomRef: false },
              { name: 'useFormatMoney', callsOtherHooks: false, accessesDomRef: false },
              { name: 'useFocusInput', callsOtherHooks: false, accessesDomRef: true }
            ];
            const res = fn(list);
            return res.hooksToKeep.length === 2 && res.utilitiesToExtract.includes('useFormatMoney');
          }
        }
      ],
      hints: [
        'Iterate through list and partition based on callsOtherHooks or accessesDomRef.'
      ],
      checklist: [
        'Detected genuine stateful hooks',
        'Identified pure functions disguised as hooks',
        'Returned clean refactor recommendations'
      ],
      revisionSummary: 'Only use hooks when managing React state or lifecycles; keep pure calculations as standard JavaScript functions.'
    }
  ]
};
