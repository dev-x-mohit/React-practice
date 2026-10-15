// Phase 13: Advanced React and Ecosystem
export const phase13 = {
  id: 'phase-13',
  title: 'Phase 13 — Advanced React and Ecosystem',
  description: 'Master cutting-edge React 19 architecture and modern full-stack patterns: Concurrent rendering and time slicing, useTransition vs useDeferredValue, React 19 Actions (useActionState), optimistic UI with useOptimistic, form status with useFormStatus, simplified ref as prop, React Server Components (RSC) vs Client Components, Next.js App Router architecture, SSR streaming hydration, and the React Compiler.',
  icon: 'Layers',
  badge: 'Advanced & React 19',
  estimatedHours: 16,
  lessons: [
    {
      id: 'p13-l1',
      slug: 'concurrent-rendering-interruptible',
      title: 'Concurrent Rendering: Time Slicing & Interruptible Updates',
      prerequisites: ['p4-l1', 'p10-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: [
        'Understand how Concurrent React differs from legacy synchronous rendering.',
        'Learn time-slicing: breaking huge rendering trees into small 5ms frames.',
        'Understand interruptible rendering (yielding to high-priority typing or clicks).'
      ],
      explanation: 'In React 17 and earlier, rendering was synchronous: once React started rendering a component tree, it could NOT be paused or interrupted until the entire virtual DOM was processed. If a chart or table took 300ms to render, the browser froze completely—keystrokes lagged, animations stuttered, and clicks were ignored.\n\nIn **Concurrent React (React 18 & 19)**, rendering is **interruptible**. React works on updates in memory in the background in 5ms slices. If a user types a new character into an input while a heavy list is rendering in the background, React yields the main thread to handle the urgent keystroke immediately, then resumes rendering the background list. This eliminates UI freezes.',
      whyItExists: 'Guarantees the browser interface remains fluid and responsive even during massive virtual DOM calculations.',
      syntaxRules: 'Concurrent features are enabled automatically in React 18+ via `createRoot`. Trigger concurrent scheduling using `startTransition` or `useDeferredValue`.',
      codeExample: `// Conceptual model of concurrent time-slicing:
function simulateConcurrentWork(tasks, yieldThresholdMs = 5) {
  const startTime = Date.now();
  const completed = [];

  for (let i = 0; i < tasks.length; i++) {
    // If we have worked for >= 5ms, yield to browser main thread
    if (Date.now() - startTime >= yieldThresholdMs) {
      console.log('Yielding to main thread for urgent user input!');
      // In real React: scheduler.yield() or MessageChannel
      break;
    }
    completed.push(tasks[i]());
  }
  return completed;
}`,
      lineByLine: [
        'Line 2: Tasks represent component render operations.',
        'Line 7: 5ms threshold matches React\'s frame budget to maintain 60fps.',
        'Line 8: Yields execution so the browser can paint mouse clicks or keystrokes immediately.'
      ],
      expectedBehavior: 'Input typing feels instant even when updating heavy background data views.',
      commonMistakes: [
        'Thinking concurrent rendering makes pure math calculations faster (it doesn\'t reduce total work; it intelligently prioritizes urgent work over non-urgent work).',
        'Writing side effects inside component render functions (because concurrent rendering can abort and restart renders, side effects in render bodies fire multiple times; keep side effects in useEffect or event handlers!).'
      ],
      practiceLevels: {
        levelA: 'Demonstrate laggy input with synchronous rendering vs fluid input with transitions.',
        levelB: 'Inspect Concurrent Mode scheduling logs in Chrome DevTools Performance tab.',
        levelC: 'Configure React 19 createRoot and transition boundaries.'
      },
      debuggingChallenge: {
        brokenCode: `function HeavyList({ query }) {\n  analytics.trackRender(query); // Anti-pattern: side effect in render body!\n  return <ul>...</ul>;\n}`,
        problem: 'In concurrent React, a render pass can be interrupted, discarded, and restarted. This causes analytics to track duplicate counts.',
        fix: 'Move the analytics tracking into a `useEffect` hook or event handler.'
      },
      conceptualQuestion: {
        question: 'What is the primary advantage of Concurrent Rendering in React 18 and 19?',
        options: [
          'It compiles JavaScript into machine assembly.',
          'Rendering is interruptible, allowing React to pause a heavy background render to handle urgent user inputs (typing, clicking) without freezing the UI.',
          'It replaces CSS stylesheets.',
          'It eliminates all component re-renders permanently.'
        ],
        correctIndex: 1,
        explanation: 'Concurrent rendering enables React to prioritize urgent user interactions over background updates, preventing UI freezes.'
      },
      codeReadingQuestion: {
        snippet: `// React 17:\nReactDOM.render(<App />, root);\n// React 18/19:\nReactDOM.createRoot(root).render(<App />);`,
        question: 'Why did React introduce `createRoot`?',
        answer: 'To enable the new Concurrent features (useTransition, Suspense improvements, automatic batching) without breaking legacy apps.'
      },
      starterCode: `// Assignment: Implement simulateTimeSlicer
// Build a time-slicing task executor:
// simulateTimeSlicer(tasks, timeBudgetMs, currentTimeFn)
// - tasks: array of functions () => any
// - timeBudgetMs: maximum ms allowed per slice
// - currentTimeFn: () => number (returns simulated timestamp in ms)
// Runs tasks sequentially until currentTimeFn() - startTime >= timeBudgetMs.
// Returns: { completedResults: any[], remainingCount: number, yielded: boolean }

export function simulateTimeSlicer(tasks, timeBudgetMs, currentTimeFn) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Completes all tasks when within time budget',
          run: (fn) => {
            let clock = 1000;
            const tasks = [() => 'a', () => 'b'];
            const res = fn(tasks, 50, () => clock++);
            return res.completedResults.length === 2 && res.remainingCount === 0 && res.yielded === false;
          }
        },
        {
          name: 'Yields execution when time budget is exceeded',
          run: (fn) => {
            let clock = 0;
            const tasks = [
              () => { clock += 3; return 1; },
              () => { clock += 4; return 2; }, // now clock = 7 >= 5ms budget
              () => { clock += 2; return 3; }
            ];
            const res = fn(tasks, 5, () => clock);
            return res.completedResults.length === 2 && res.remainingCount === 1 && res.yielded === true;
          }
        }
      ],
      solution: `export function simulateTimeSlicer(tasks, timeBudgetMs, currentTimeFn) {
  const start = currentTimeFn();
  const completedResults = [];
  let i = 0;

  while (i < tasks.length) {
    if (currentTimeFn() - start >= timeBudgetMs) {
      break;
    }
    completedResults.push(tasks[i]());
    i++;
  }

  const remainingCount = tasks.length - i;
  return {
    completedResults,
    remainingCount,
    yielded: remainingCount > 0
  };
}`,
      hints: [
        'Record start = currentTimeFn().',
        'Loop while i < tasks.length and check if (currentTimeFn() - start >= timeBudgetMs).',
        'Return { completedResults, remainingCount, yielded }.'
      ]
    },
    {
      id: 'p13-l2',
      slug: 'usetransition-urgent-vs-nonurgent',
      title: '`useTransition`: Separating Urgent and Non-Urgent Updates',
      prerequisites: ['p13-l1', 'p3-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Differentiate between urgent updates (typing, clicking) and transition updates (filtering, navigation).',
        'Use `useTransition` to wrap non-urgent state updates.',
        'Display loading states using the `isPending` boolean.'
      ],
      explanation: 'In user interfaces, not all state updates have the same urgency:\n- **Urgent Updates**: Direct physical manipulation (typing into an input, clicking a checkbox, dragging a slider). These MUST reflect on screen immediately; any delay feels laggy.\n- **Transition (Non-Urgent) Updates**: Transitioning the UI from one view to another (filtering a 1,000-item product list, switching tabs). Users expect these to take a moment.\n\n`const [isPending, startTransition] = useTransition();` allows you to tell React: "The update inside `startTransition(() => setList(data))` is non-urgent. If the user types another character, pause or abandon this list render and prioritize the input!"',
      whyItExists: 'Keeps inputs completely responsive without debouncing, while providing a native `isPending` loading indicator.',
      syntaxRules: '`const [isPending, startTransition] = useTransition();`\n`startTransition(() => { setNonUrgentState(newVal); });`.',
      codeExample: `import React, { useState, useTransition } from 'react';

export function FilterableSearch({ largeDataset }) {
  // 1. Urgent state: input value updates instantly
  const [inputVal, setInputVal] = useState('');

  // 2. Non-urgent state: filtered list updates in background transition
  const [filterQuery, setFilterQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const nextText = e.target.value;
    // Urgent update: text cursor updates immediately
    setInputVal(nextText);

    // Non-urgent update: filtering large list yields to main thread
    startTransition(() => {
      setFilterQuery(nextText);
    });
  };

  const filteredItems = largeDataset.filter(item =>
    item.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div>
      <input value={inputVal} onChange={handleChange} placeholder="Search..." />
      {isPending && <span className="spinner">Filtering...</span>}
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <ItemList items={filteredItems} />
      </div>
    </div>
  );
}`,
      lineByLine: [
        'Line 8: isPending is true while React prepares the transition render in the background.',
        'Line 13: setInputVal(nextText) updates immediately, so keystrokes never lag.',
        'Line 16: startTransition wraps setFilterQuery, marking it as interruptible.',
        'Line 28: isPending dims the previous list to signal an update is in progress.'
      ],
      expectedBehavior: 'Typing 20 characters as fast as possible never lags or drops keystrokes.',
      commonMistakes: [
        'Wrapping the input\'s own controlled value in `startTransition` (causes the text cursor to feel sluggish and lag behind typing).',
        'Passing async functions into `startTransition` without using React 19 async transitions.'
      ],
      practiceLevels: {
        levelA: 'Build a tab-switcher using useTransition with isPending opacity indicator.',
        levelB: 'Compare responsiveness of large list filtering with vs without useTransition.',
        levelC: 'Combine useTransition with Suspense navigation.'
      },
      debuggingChallenge: {
        brokenCode: `const handleChange = (e) => {\n  startTransition(() => {\n    setInput(e.target.value); // Input lag!\n  });\n};`,
        problem: 'Making the input itself a non-urgent transition makes the text input feel unresponsive and laggy.',
        fix: 'Keep `setInput(e.target.value)` urgent, and wrap only the heavy derived filter or secondary view in `startTransition`.'
      },
      conceptualQuestion: {
        question: 'What is the purpose of `isPending` returned by `useTransition`?',
        options: [
          'It indicates whether a network fetch is running.',
          'It is a boolean indicating whether React is currently rendering the non-urgent transition in the background.',
          'It pauses the JavaScript engine.',
          'It cancels the update.'
        ],
        correctIndex: 1,
        explanation: '`isPending` is true from the moment startTransition is called until React finishes committing the transition update to the DOM.'
      },
      codeReadingQuestion: {
        snippet: `<div style={{ opacity: isPending ? 0.7 : 1 }}>{children}</div>`,
        question: 'Why is dimming opacity with `isPending` a popular UX pattern for transitions?',
        answer: 'It provides immediate visual feedback that new content is loading without jarringly unmounting the existing content.'
      },
      starterCode: `// Assignment: Implement transitionScheduler
// Simulate urgent vs transition update queues:
// createTransitionScheduler()
// Returns:
// - dispatchUrgent(name, fn): runs fn immediately and marks status: 'completed'
// - dispatchTransition(name, fn): queues fn as non-urgent; sets isPending: true
// - flushTransition(): runs pending transition fn; sets isPending: false
// - getStatus(): returns { isPending: boolean, history: string[] }

export function createTransitionScheduler() {
  // Your code here
}`,
      testCases: [
        {
          name: 'Executes urgent updates immediately while transitions wait for flush',
          run: (fn) => {
            const sched = fn();
            sched.dispatchUrgent('input', () => {});
            if (sched.getStatus().isPending !== false) return false;
            sched.dispatchTransition('heavyList', () => {});
            if (sched.getStatus().isPending !== true) return false;
            sched.flushTransition();
            const status = sched.getStatus();
            return status.isPending === false && status.history.includes('urgent:input') && status.history.includes('transition:heavyList');
          }
        }
      ],
      solution: `export function createTransitionScheduler() {
  let isPending = false;
  let pendingTask = null;
  const history = [];

  return {
    dispatchUrgent(name, fn) {
      fn();
      history.push(\`urgent:\${name}\`);
    },
    dispatchTransition(name, fn) {
      isPending = true;
      pendingTask = { name, fn };
    },
    flushTransition() {
      if (pendingTask) {
        pendingTask.fn();
        history.push(\`transition:\${pendingTask.name}\`);
        pendingTask = null;
      }
      isPending = false;
    },
    getStatus: () => ({ isPending, history: [...history] })
  };
}`,
      hints: [
        'Store isPending boolean and pendingTask object.',
        'dispatchUrgent runs immediately and pushes to history.',
        'dispatchTransition stores task and sets isPending = true.',
        'flushTransition runs task, sets isPending = false, and pushes to history.'
      ]
    },
    {
      id: 'p13-l3',
      slug: 'usedeferredvalue-smooth-interfaces',
      title: '`useDeferredValue`: Deferring Child Tree Re-Renders',
      prerequisites: ['p13-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Use `useDeferredValue` when you don\'t control the state updater (e.g. props passed from parent).',
        'Compare `useDeferredValue` with `useTransition`.',
        'Avoid stale visual artifacts by pairing with React.memo.'
      ],
      explanation: 'While `useTransition` is used when YOU call the state updater (`startTransition(() => setState())`), sometimes you receive a value as a prop from an external component or parent library and cannot wrap the `setState` call.\n\n`useDeferredValue(value)` accepts a value and returns a deferred version of it. During urgent updates (like typing), React returns the OLD deferred value while rendering the new value in the background. Once the urgent update commits, React works on the deferred tree.',
      whyItExists: 'Enables smooth concurrent optimization when receiving fast-changing props from parents.',
      syntaxRules: '`const deferredQuery = useDeferredValue(query);`. Pair child with `React.memo` to skip re-renders until deferredQuery updates.',
      codeExample: `import React, { useDeferredValue, memo } from 'react';

// Memoized heavy list
const HeavyProductList = memo(function HeavyProductList({ query }: { query: string }) {
  console.log('Rendering heavy list for:', query);
  // Heavy calculations...
  return <div>Results for: {query}</div>;
});

export function SearchPage({ query }: { query: string }) {
  // deferredQuery lags behind query during typing
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {/* HeavyProductList only renders when deferredQuery updates! */}
      <HeavyProductList query={deferredQuery} />
    </div>
  );
}`,
      lineByLine: [
        'Line 11: useDeferredValue creates a concurrent copy of query.',
        'Line 12: isStale is true when user has typed newer characters that are still processing.',
        'Line 17: HeavyProductList receives deferredQuery, skipping re-renders while typing.'
      ],
      expectedBehavior: 'Typing remains smooth; list updates concurrently as soon as main thread is free.',
      commonMistakes: [
        'Forgetting to wrap the child component in `React.memo` (without memo, the parent still re-renders the child anyway, defeating useDeferredValue!).',
        'Using both `useTransition` and `useDeferredValue` on the exact same variable (redundant).'
      ],
      practiceLevels: {
        levelA: 'Implement useDeferredValue on a chart query input.',
        levelB: 'Create an isStale visual indicator comparing `value !== deferredValue`.',
        levelC: 'Benchmark CPU time with Chrome DevTools CPU throttling.'
      },
      debuggingChallenge: {
        brokenCode: `function Page({ text }) {\n  const deferred = useDeferredValue(text);\n  return <HeavyChart text={deferred} />; // HeavyChart still lags typing!\n}`,
        problem: 'HeavyChart is NOT wrapped in React.memo. When Page re-renders on text change, HeavyChart re-renders immediately regardless of deferredValue.',
        fix: 'Wrap HeavyChart in `React.memo(HeavyChart)`.'
      },
      conceptualQuestion: {
        question: 'When should you choose `useDeferredValue` over `useTransition`?',
        options: [
          'When you are working with SVG elements.',
          'When you only have access to a value (such as a prop) and cannot directly wrap the `setState` call in `startTransition`.',
          'Only in Next.js.',
          'Never, useTransition has completely replaced useDeferredValue.'
        ],
        correctIndex: 1,
        explanation: 'useTransition requires access to the setState updater. When a value is received via props or third-party hooks, useDeferredValue is the proper choice.'
      },
      codeReadingQuestion: {
        snippet: `const isStale = text !== deferredText;`,
        question: 'What does `isStale === true` signify in the UI?',
        answer: 'The user has inputted a newer value (`text`), but the background concurrent render for `deferredText` has not finished committing yet.'
      },
      starterCode: `// Assignment: Implement deferredValueHarness
// Simulate useDeferredValue lifecycle:
// createDeferredValueHarness(initialValue)
// Returns:
// - get(): returns current deferred value
// - pushUrgent(newVal): updates latest value immediately, but keeps deferred value unchanged
// - commitDeferred(): syncs deferred value to latest value
// - isStale(): returns boolean indicating whether latest !== deferred

export function createDeferredValueHarness(initialValue) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Maintains deferred value until commit',
          run: (fn) => {
            const h = fn('apple');
            if (h.get() !== 'apple' || h.isStale() !== false) return false;
            h.pushUrgent('banana');
            if (h.get() !== 'apple' || h.isStale() !== true) return false;
            h.commitDeferred();
            return h.get() === 'banana' && h.isStale() === false;
          }
        }
      ],
      solution: `export function createDeferredValueHarness(initialValue) {
  let latest = initialValue;
  let deferred = initialValue;

  return {
    get: () => deferred,
    pushUrgent(newVal) {
      latest = newVal;
    },
    commitDeferred() {
      deferred = latest;
    },
    isStale: () => latest !== deferred
  };
}`,
      hints: [
        'Store latest and deferred initialized to initialValue.',
        'pushUrgent sets latest.',
        'commitDeferred sets deferred = latest.',
        'isStale returns latest !== deferred.'
      ]
    },
    {
      id: 'p13-l4',
      slug: 'react19-actions-useactionstate',
      title: 'React 19 Actions: `useActionState` and Form Architecture',
      prerequisites: ['p2-l2', 'p13-l2'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: [
        'Understand the React 19 concept of an "Action".',
        'Use the new `useActionState` hook for managing async form submissions.',
        'Eliminate manual `setIsSubmitting`, `setError`, and `try/catch` boilerplate.'
      ],
      explanation: 'In React 19, an **Action** is an asynchronous function that handles data mutation (like submitting a form). React 19 introduces native hooks to manage action lifecycles automatically.\n\n`useActionState(actionFn, initialState)` takes an async action and initial state, returning `[state, formAction, isPending]`. When the form is submitted via `<form action={formAction}>`, React automatically sets `isPending = true`, executes the async function, updates `state` with the return value, catches any errors, and automatically resets `isPending = false`.',
      whyItExists: 'Eliminates 20+ lines of repetitive state management boilerplate (`loading`, `error`, `success`, `event.preventDefault`) for every form.',
      syntaxRules: '`const [state, formAction, isPending] = useActionState(async (prevState, formData) => { ... }, initial);`\n`<form action={formAction}>`.',
      codeExample: `import React, { useActionState } from 'react';

// Async action handler
async function updateUsernameAction(previousState, formData) {
  const newName = formData.get('username');
  try {
    const res = await fetch('/api/user/name', {
      method: 'POST',
      body: JSON.stringify({ name: newName })
    });
    if (!res.ok) throw new Error('Name taken');
    return { success: true, name: newName, error: null };
  } catch (err) {
    return { success: false, name: previousState.name, error: err.message };
  }
}

export function UsernameForm() {
  const [state, formAction, isPending] = useActionState(updateUsernameAction, {
    success: false,
    name: 'Alice',
    error: null
  });

  return (
    <form action={formAction}>
      <p>Current Name: {state.name}</p>
      <input name="username" defaultValue={state.name} required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update Name'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Updated successfully!</p>}
    </form>
  );
}`,
      lineByLine: [
        'Line 4: Action receives (previousState, formData) parameters.',
        'Line 17: useActionState wires up the async action with initial state.',
        'Line 24: <form action={formAction}> uses React 19 native form action binding (no manual onSubmit or preventDefault needed!).',
        'Line 27: isPending is automatically true during the API call.'
      ],
      expectedBehavior: 'Form automatically handles async transitions, submission states, and error handling.',
      commonMistakes: [
        'Calling `e.preventDefault()` inside a React 19 form action (not needed; React actions manage submission lifecycle natively).',
        'Forgetting that `useActionState` action functions must return the new state object.'
      ],
      practiceLevels: {
        levelA: 'Build an email subscription form with useActionState.',
        levelB: 'Display server validation error messages returned in action state.',
        levelC: 'Handle optimistic rollback when action rejects.'
      },
      debuggingChallenge: {
        brokenCode: `// In action function:\nasync function myAction(formData) {\n  // Missing previousState first parameter!\n}`,
        problem: 'The action passed to useActionState receives `(previousState, formData)` as its two arguments. Omitting previousState causes formData to be undefined.',
        fix: 'Signature must be `async function myAction(previousState, formData)`.'
      },
      conceptualQuestion: {
        question: 'What is the primary benefit of React 19\'s `useActionState` hook?',
        options: [
          'It replaces Redux completely.',
          'It standardizes form mutations by managing async pending states, returned data, error handling, and form action attributes natively.',
          'It converts client forms into WebSockets.',
          'It is only for mobile apps.'
        ],
        correctIndex: 1,
        explanation: '`useActionState` handles pending states, previous state transitions, and form payloads without manual `useState` or `e.preventDefault()` boilerplate.'
      },
      codeReadingQuestion: {
        snippet: `<button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button>`,
        question: 'Where does `isPending` come from in a component using `useActionState`?',
        answer: 'It is the third item returned in the tuple from `useActionState(action, initial)`.'
      },
      starterCode: `// Assignment: Implement simulateActionState
// Build a harness for React 19 useActionState:
// createActionStateHarness(actionFn, initialState)
// Returns:
// - getState(): current state
// - isPending(): boolean
// - runAction(formDataPayload): async function that:
//   * sets isPending to true
//   * executes actionFn(currentState, formDataPayload)
//   * updates state with result
//   * sets isPending to false
//   * returns new state

export function createActionStateHarness(actionFn, initialState) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Executes action and transitions pending state',
          run: async (fn) => {
            const action = async (prev, payload) => ({ count: prev.count + payload.amount });
            const harness = fn(action, { count: 0 });
            if (harness.isPending() !== false) return false;
            const promise = harness.runAction({ amount: 5 });
            if (harness.isPending() !== true) return false;
            const res = await promise;
            return res.count === 5 && harness.getState().count === 5 && harness.isPending() === false;
          }
        }
      ],
      solution: `export function createActionStateHarness(actionFn, initialState) {
  let state = initialState;
  let pending = false;

  return {
    getState: () => state,
    isPending: () => pending,
    async runAction(payload) {
      pending = true;
      try {
        state = await actionFn(state, payload);
        return state;
      } finally {
        pending = false;
      }
    }
  };
}`,
      hints: [
        'Store state and pending flag.',
        'In runAction, set pending = true in try block and pending = false in finally block.',
        'Await actionFn(state, payload) and update state.'
      ]
    },
    {
      id: 'p13-l5',
      slug: 'react19-useoptimistic-updates',
      title: 'React 19 Optimistic UI: `useOptimistic`',
      prerequisites: ['p13-l4', 'p6-l5'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: [
        'Understand Optimistic UI: showing expected state immediately before server responds.',
        'Use the React 19 `useOptimistic` hook.',
        'Handle automatic rollback if the server action fails.'
      ],
      explanation: 'In traditional apps, when a user likes a post or sends a chat message, the UI waits for the server response (200-500ms) before updating the screen. This feels sluggish.\n\n**React 19 `useOptimistic`** allows you to show the expected result immediately. When the user clicks "Send", `useOptimistic` instantly renders the message in the feed with a "Sending..." indicator. Once the background action completes, React replaces the optimistic state with the true server state. If the request fails, React automatically rolls back to the previous state with zero manual cleanup!',
      whyItExists: 'Makes web applications feel instantaneous by updating the UI ahead of network confirmation.',
      syntaxRules: '`const [optimisticState, setOptimistic] = useOptimistic(passthroughState, updateFn);`.',
      codeExample: `import React, { useOptimistic } from 'react';

export function ChatFeed({ messages, onSendMessage }) {
  // useOptimistic takes the actual state from props/state, plus an updater
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (currentMessages, newMessageText) => [
      ...currentMessages,
      { id: 'temp-' + Date.now(), text: newMessageText, sending: true }
    ]
  );

  const handleAction = async (formData) => {
    const text = formData.get('message');
    // 1. Immediately shows message in UI
    addOptimisticMessage(text);
    // 2. Server mutation runs in background
    await onSendMessage(text);
  };

  return (
    <div>
      <ul>
        {optimisticMessages.map(msg => (
          <li key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>
            {msg.text} {msg.sending && '(Sending...)'}
          </li>
        ))}
      </ul>
      <form action={handleAction}>
        <input name="message" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}`,
      lineByLine: [
        'Line 5: useOptimistic creates an optimistic view of messages.',
        'Line 15: addOptimisticMessage(text) immediately adds the pending message to the DOM.',
        'Line 17: onSendMessage executes the actual API mutation.',
        'When action finishes, optimisticMessages syncs back to the authoritative messages prop.'
      ],
      expectedBehavior: 'Chat message appears the millisecond "Send" is clicked, giving an instant native app feel.',
      commonMistakes: [
        'Calling `addOptimisticMessage` outside an action or transition (React 19 requires optimistic updates to be dispatched inside an action).',
        'Mutating the current state array directly inside the optimistic reducer instead of returning a new array.'
      ],
      practiceLevels: {
        levelA: 'Build an optimistic Like Button counter (increments like count immediately).',
        levelB: 'Add an optimistic delete action where deleted items fade out instantly.',
        levelC: 'Test error rollback by simulating network failure.'
      },
      debuggingChallenge: {
        brokenCode: `const [opt, addOpt] = useOptimistic(list, (curr, item) => {\n  curr.push(item); // Mutation bug!\n  return curr;\n});`,
        problem: 'Directly mutating `curr` array breaks React\'s immutability checks and corrupts rollback state.',
        fix: 'Return a fresh array: `return [...curr, item];`.'
      },
      conceptualQuestion: {
        question: 'What happens to the optimistic UI if the async action in `useOptimistic` throws an error and fails?',
        options: [
          'The browser crashes.',
          'React automatically discards the optimistic update and reverts the UI to the actual server state.',
          'The optimistic item remains permanently frozen.',
          'The user is logged out.'
        ],
        correctIndex: 1,
        explanation: 'React tracks the base state. If the action errors or completes, React re-renders with the real base state, automatically reverting optimistic changes.'
      },
      codeReadingQuestion: {
        snippet: `{msg.sending && <span className="status">Sending...</span>}`,
        question: 'How was `msg.sending` set in this component?',
        answer: 'By the optimistic update function passed to `useOptimistic`, which added the temporary `{ sending: true }` property.'
      },
      starterCode: `// Assignment: Implement optimisticStateHarness
// Simulate React 19 useOptimistic:
// createOptimisticHarness(baseState, updateFn)
// Returns:
// - getState(): returns optimistic state if active, else baseState
// - setOptimistic(payload): applies updateFn(currentState, payload) optimistically
// - resolveAction(newBaseState): commits new actual server state and clears optimistic override
// - rejectAction(): rolls back optimistic state to original baseState

export function createOptimisticHarness(baseState, updateFn) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Applies optimistic update immediately and commits new base state',
          run: (fn) => {
            const h = fn(['A'], (curr, item) => [...curr, item]);
            if (h.getState().length !== 1) return false;
            h.setOptimistic('B');
            if (h.getState().length !== 2 || h.getState()[1] !== 'B') return false;
            h.resolveAction(['A', 'B-confirmed']);
            const s = h.getState();
            return s.length === 2 && s[1] === 'B-confirmed';
          }
        },
        {
          name: 'Rolls back to base state on rejectAction',
          run: (fn) => {
            const h = fn(10, (curr, delta) => curr + delta);
            h.setOptimistic(5);
            if (h.getState() !== 15) return false;
            h.rejectAction();
            return h.getState() === 10;
          }
        }
      ],
      solution: `export function createOptimisticHarness(baseState, updateFn) {
  let base = baseState;
  let optimistic = null;
  let hasOptimistic = false;

  return {
    getState: () => (hasOptimistic ? optimistic : base),
    setOptimistic(payload) {
      const current = hasOptimistic ? optimistic : base;
      optimistic = updateFn(current, payload);
      hasOptimistic = true;
    },
    resolveAction(newBaseState) {
      base = newBaseState;
      hasOptimistic = false;
      optimistic = null;
    },
    rejectAction() {
      hasOptimistic = false;
      optimistic = null;
    }
  };
}`,
      hints: [
        'Maintain base, optimistic, and hasOptimistic flag.',
        'getState returns optimistic if hasOptimistic else base.',
        'rejectAction resets hasOptimistic to false.'
      ]
    },
    {
      id: 'p13-l6',
      slug: 'react-server-components-rsc-vs-client',
      title: 'React Server Components (RSC) vs Client Components',
      prerequisites: ['p1-l1', 'p13-l1'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: [
        'Understand the fundamental boundary between Server Components and Client Components.',
        'Recognize what code only runs on the server (direct database access, secrets).',
        'Use the `"use client"` directive correctly.'
      ],
      explanation: 'In traditional React, 100% of your component code was bundled and downloaded to the client browser. **React Server Components (RSC)** introduce a new paradigm where components run exclusively on the server by default.\n\n- **Server Components**: Run ONLY on the server during build or request. They NEVER download their code to the browser (0 client bundle size!). They can query databases directly (`await db.query(...)`), use private backend secrets, and render fast.\n- **Client Components**: Designated with the `"use client"` directive at the top of the file. These are standard interactive components that support `useState`, `useEffect`, event listeners (`onClick`), and browser APIs.',
      whyItExists: 'Dramatically slashes client bundle sizes, speeds up initial page load, and enables direct secure database access from components.',
      syntaxRules: 'Server Component: Default in modern frameworks (Next.js). No directive needed.\nClient Component: Add `"use client";` as line 1 of the file.',
      codeExample: `// 1. Server Component: UserFeed.jsx (runs exclusively on server)
// import db from '@/lib/db'; // Direct database connection! Zero JS bundle on client!

export async function UserFeed() {
  // Direct DB query on server - no fetch API needed!
  // const users = await db.users.findMany();
  const users = [{ id: 1, name: 'Alice' }];

  return (
    <div>
      <h2>User Directory (Rendered on Server)</h2>
      {users.map(u => (
        <UserItem key={u.id} user={u} />
      ))}
    </div>
  );
}

// 2. Client Component: LikeButton.jsx (interactive)
// 'use client'; // Required for hooks and event handlers!
import { useState } from 'react';

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(l => l + 1)}>Likes: {likes}</button>;
}`,
      lineByLine: [
        'Line 4: Server Component is an async function that can directly query backend resources.',
        'Line 19: "use client" marks the boundary where JavaScript must be sent to the browser for interactivity (useState, onClick).'
      ],
      expectedBehavior: 'Server component logic adds 0 bytes to the client JavaScript bundle.',
      commonMistakes: [
        'Thinking `"use client"` means the component only renders on the client (it still pre-renders on the server during SSR; "use client" simply marks the boundary for client bundle inclusion).',
        'Trying to use `useState` or `useEffect` in a Server Component without `"use client"` (throws build error: Hooks can only be used in Client Components).'
      ],
      practiceLevels: {
        levelA: 'Identify which components require "use client" vs Server Components.',
        levelB: 'Pass a Server Component as children to a Client Component.',
        levelC: 'Verify client bundle size savings in a Next.js App Router app.'
      },
      debuggingChallenge: {
        brokenCode: `// In default Server Component (no 'use client'):\nexport default function Counter() {\n  const [count, setCount] = useState(0); // Error: useState is not supported in Server Components!\n}`,
        problem: 'Server Components cannot have interactive state or browser lifecycle hooks.',
        fix: 'Add `"use client";` at the very top of the file before imports.'
      },
      conceptualQuestion: {
        question: 'What is the main purpose of the `"use client"` directive in React Server Components?',
        options: [
          'It instructs the browser to open a WebSocket connection.',
          'It defines the boundary between the server-only component graph and the interactive client bundle, marking this component and its imports to be included in the client JS bundle.',
          'It compiles the code to WebAssembly.',
          'It forces the component to be rendered on mobile only.'
        ],
        correctIndex: 1,
        explanation: '`"use client"` establishes the boundary line where components transition from zero-bundle server rendering to interactive client hydration.'
      },
      codeReadingQuestion: {
        snippet: `// ProductPage.jsx (Server Component)\nimport AddToCartButton from './AddToCartButton'; // (Client Component)\n<AddToCartButton productId={123} />`,
        question: 'Can a Server Component import and render a Client Component?',
        answer: 'Yes! Server Components frequently render Client Components as leaf nodes for interactivity, passing serialized props.'
      },
      starterCode: `// Assignment: Implement classifyRscBoundary
// Classify whether a component must be a 'client' component or can be a 'server' component:
// classifyRscBoundary(sourceCode)
// Rules:
// If sourceCode contains any of:
// - 'useState', 'useEffect', 'useReducer', 'useRef', 'useContext'
// - 'onClick', 'onChange', 'onSubmit'
// - 'window.', 'document.', 'localStorage'
// Returns 'client', otherwise returns 'server'.

export function classifyRscBoundary(sourceCode) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Detects client component requiring hooks or click handlers',
          run: (fn) => {
            const code1 = 'function Button() { const [c, setC] = useState(0); return <button onClick={() => setC(1)}>Click</button>; }';
            const code2 = 'async function Post() { const data = await fetch("api"); return <div>{data}</div>; }';
            return fn(code1) === 'client' && fn(code2) === 'server';
          }
        },
        {
          name: 'Detects browser API usage as client requirement',
          run: (fn) => {
            const code = 'function Tracker() { const w = window.innerWidth; return <div>{w}</div>; }';
            return fn(code) === 'client';
          }
        }
      ],
      solution: `export function classifyRscBoundary(sourceCode) {
  const clientIndicators = [
    'useState', 'useEffect', 'useReducer', 'useRef', 'useContext',
    'onClick', 'onChange', 'onSubmit',
    'window.', 'document.', 'localStorage'
  ];
  for (const indicator of clientIndicators) {
    if (sourceCode.includes(indicator)) {
      return 'client';
    }
  }
  return 'server';
}`,
      hints: [
        'Check if sourceCode includes any hook names (useState, useEffect).',
        'Check for event attributes (onClick, onChange).',
        'Check for DOM objects (window., document., localStorage).'
      ]
    }
  ]
};
