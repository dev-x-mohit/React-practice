// Phase 7: State Management
export const phase7 = {
  id: 'phase-7',
  title: 'Phase 7 — State Management',
  description: 'Master modern React state management architectures: Context + useReducer, Zustand stores/selectors/actions, Redux Toolkit (RTK) slices and thunks, RTK Query vs TanStack Query, normalized state schemas, and selecting the right state tool for your project.',
  icon: 'Share2',
  badge: 'Global State & Zustand',
  estimatedHours: 12,
  lessons: [
    {
      id: 'p7-l1',
      slug: 'local-vs-shared-state',
      title: 'Local State versus Shared State Architecture',
      prerequisites: ['p2-l4'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Differentiate local component state from global shared state.', 'Avoid putting private UI state into global stores.', 'Define clear ownership boundaries across the application.'],
      explanation: 'State management starts with boundaries. Local state is private to a single component (e.g. an input field or a tooltip open boolean). Shared state is needed by multiple distant components across different page sections (e.g. current logged-in user, shopping cart, or dark theme). Putting transient local state into global stores is an anti-pattern that creates unnecessary complexity.',
      whyItExists: 'Prevents store bloat, isolates re-renders, and keeps components modular.',
      syntaxRules: 'Ask: "Do components in other branches of the tree need this data?" If not, keep it local with useState.',
      codeExample: `// State Boundary Decision\n// 1. Local State: Dropdown open toggle (Keep local in component!)\nfunction Dropdown() {\n  const [isOpen, setIsOpen] = useState(false);\n  return <button onClick={() => setIsOpen(o => !o)}>Menu</button>;\n}\n\n// 2. Shared State: Shopping Cart count (Needs global store)\n// Cart count is displayed in Header, updated in ProductCard, and checked in Checkout.\n// -> Belongs in Zustand / Context store!`,
      lineByLine: [
        'Line 3: isOpen affects only this dropdown; globalizing it would pollute global state.',
        'Line 8: Cart data is needed across separate pages and views, making it a true shared state candidate.'
      ],
      expectedBehavior: 'Local state re-renders only the dropdown; shared state updates across header and cart simultaneously.',
      commonMistakes: ['Putting form input keystrokes into Redux or Zustand (causes global re-renders on every keystroke!).', 'Prop-drilling shared state through 10 intermediate components.'],
      practiceLevels: {
        levelA: 'Categorize 5 state variables into local vs shared.',
        levelB: 'Refactor a global store to remove 3 misplaced local UI states.',
        levelC: 'Design state architecture for an e-commerce platform.'
      },
      debuggingChallenge: {
        brokenCode: `// In global Zustand store:\nconst useStore = create(set => ({ searchQuery: '', isTooltipHovered: false }));`,
        problem: 'isTooltipHovered in global store causes unnecessary re-renders of all store listeners on mouse hover.',
        fix: 'Move tooltip hover state to local useState inside the Tooltip component.'
      },
      conceptualQuestion: {
        question: 'Which of the following belongs in a global state store (Zustand/Redux)?',
        options: [
          'Whether an accordion panel is currently expanded',
          'The authenticated user session and their shopping cart contents',
          'The temporary text typed into a search input before submitting',
          'A hover state of a button'
        ],
        correctIndex: 1,
        explanation: 'User session and cart are accessed across multiple distant routes and components, making them genuine shared global state.'
      },
      codeReadingQuestion: {
        snippet: `// Rule of thumb: Colocate state until sharing is strictly necessary.`,
        question: 'What principle does this statement express?',
        answer: 'State colocation (keeping state as close to where it is used as possible).'
      },
      starterCode: `// Assignment: Implement classifyStateScope\n// Classify state variables into 'LOCAL_STATE' or 'GLOBAL_SHARED_STATE':\n// classifyStateScope(descriptor)\n// descriptor = { consumedByMultipleRoutes: boolean, isTransientUi: boolean, persistedAcrossSession: boolean }\n// 1. If isTransientUi -> 'LOCAL_STATE'\n// 2. If consumedByMultipleRoutes || persistedAcrossSession -> 'GLOBAL_SHARED_STATE'\n// 3. Otherwise -> 'LOCAL_STATE'\n\nexport function classifyStateScope(descriptor) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Classifies cross-route data as global and transient UI as local',
          run: (fn) => {
            const cart = fn({ consumedByMultipleRoutes: true, isTransientUi: false, persistedAcrossSession: true });
            const modal = fn({ consumedByMultipleRoutes: false, isTransientUi: true, persistedAcrossSession: false });
            return cart === 'GLOBAL_SHARED_STATE' && modal === 'LOCAL_STATE';
          }
        }
      ],
      hints: [
        'Check isTransientUi first, then check consumedByMultipleRoutes || persistedAcrossSession.'
      ],
      checklist: [
        'Identified transient local UI state',
        'Identified global cross-route state'
      ],
      revisionSummary: 'Keep transient UI state local with useState; place cross-cutting data (user, cart, theme) in shared stores.'
    },
    {
      id: 'p7-l2',
      slug: 'prop-drilling-and-tradeoffs',
      title: 'Prop Drilling and Its Architectural Trade-offs',
      prerequisites: ['p7-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify prop drilling across component hierarchies.', 'Understand when prop drilling is acceptable vs when it becomes harmful.', 'Evaluate solutions: Component Composition vs Context vs Zustand.'],
      explanation: 'Prop drilling occurs when you pass a prop through intermediate components that do not need the prop themselves, merely to deliver it to a deeply nested child. Passing props down 1 or 2 levels is normal and explicit. Passing props down 5+ levels couples intermediate components to data they don\'t care about, making refactoring brittle.',
      whyItExists: 'Clarifies when to adopt state management libraries vs using simple component composition.',
      syntaxRules: 'Before adding a state library to fix prop drilling, first check if Component Composition (<Parent><Child prop={x} /></Parent>) solves the problem.',
      codeExample: `// PROP DRILLING PROBLEM:\n// App -> PageShell -> Section -> CardList -> Card -> UserAvatar\n// Passing user prop through all 5 layers is painful!\n\n// SOLUTION 1: Component Composition (Slots)\nfunction PageShell({ header, children }) {\n  return <div>{header}<main>{children}</main></div>;\n}\n// Now App can pass <UserAvatar user={user} /> directly into the slot!`,
      lineByLine: [
        'Line 2: 5 layers of intermediate components forwarding user prop.',
        'Line 6: Slot composition lets the top-level App instantiate UserAvatar directly, bypassing all intermediate layers.'
      ],
      expectedBehavior: 'Intermediate components remain clean without forwarding unused props.',
      commonMistakes: ['Reaching for Redux or Zustand immediately to fix 1 level of prop passing.', 'Ignoring slot composition and jumping straight to global state.'],
      practiceLevels: {
        levelA: 'Trace a prop passed through 3 levels of components.',
        levelB: 'Eliminate prop drilling using component slot composition ({children}).',
        levelC: 'Measure maintenance overhead of changing a drilled prop name.'
      },
      debuggingChallenge: {
        brokenCode: `function Layout({ theme, children }) {\n  return <Sidebar theme={theme} />;\n}\nfunction Sidebar({ theme }) {\n  return <Menu theme={theme} />;\n}\nfunction Menu({ theme }) {\n  return <Item theme={theme} />;\n}`,
        problem: 'Classic 4-level prop drilling for a theme string.',
        fix: 'Use a ThemeContext or Zustand store to consume theme directly in Item.'
      },
      conceptualQuestion: {
        question: 'What is often the best FIRST alternative to try before adopting a complex state library to solve prop drilling?',
        options: [
          'Rewriting the app in jQuery.',
          'Component Composition (passing components as `children` or JSX slot props directly to the container).',
          'Using global window variables.',
          'Migrating to Redux.'
        ],
        correctIndex: 1,
        explanation: 'Component composition allows the parent to inject the fully-formed child directly, bypassing intermediate layers without external libraries.'
      },
      codeReadingQuestion: {
        snippet: `<SplitLayout left={<Nav user={user} />} right={<Feed />} />`,
        question: 'How does this layout avoid prop drilling?',
        answer: 'By passing Nav with its user prop already bound into the `left` slot prop.'
      },
      starterCode: `// Assignment: Implement measureDrillDepth\n// Calculate prop drilling depth in a component tree path:\n// calculateDrillDepth(hierarchyPath, consumerComponentName)\n// hierarchyPath: string[] (e.g. ['App', 'Page', 'Section', 'Card', 'Avatar'])\n// If consumerComponentName is in hierarchyPath, drill depth is the number of intermediate components between index 0 and consumer index.\n// Return: { depth: number, recommendation: 'KEEP_PROPS' | 'USE_COMPOSITION' | 'USE_GLOBAL_STORE' }\n// depth <= 1 -> 'KEEP_PROPS'; depth 2-3 -> 'USE_COMPOSITION'; depth >= 4 -> 'USE_GLOBAL_STORE'\n\nexport function calculateDrillDepth(hierarchyPath, consumerComponentName) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Recommends global store for deep drilling >= 4 layers',
          run: (fn) => {
            const path = ['App', 'Shell', 'Layout', 'Section', 'Card', 'Avatar'];
            const res = fn(path, 'Avatar');
            return res.depth === 4 && res.recommendation === 'USE_GLOBAL_STORE';
          }
        },
        {
          name: 'Recommends keeping props for shallow 1-layer passing',
          run: (fn) => {
            const path = ['App', 'Header', 'UserMenu'];
            const res = fn(path, 'UserMenu');
            return res.depth === 1 && res.recommendation === 'KEEP_PROPS';
          }
        }
      ],
      hints: [
        'consumerIndex = hierarchyPath.indexOf(consumerComponentName); depth = Math.max(0, consumerIndex - 1).'
      ],
      checklist: [
        'Calculated intermediate layer depth',
        'Mapped depth to architectural recommendation'
      ],
      revisionSummary: '1-2 levels of props is healthy; for deeper drilling, try slot composition before reaching for global stores.'
    },
    {
      id: 'p7-l3',
      slug: 'context-api-and-limits',
      title: 'Context API: Scope and Performance Limits',
      prerequisites: ['p3-l10', 'p7-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Use React Context for low-frequency global state.', 'Understand why Context is NOT a complete state management engine.', 'Recognize context re-render performance bottlenecks.'],
      explanation: 'React Context is a dependency injection mechanism, not a state manager. It transports values down the tree. However, Context has a fundamental limitation: when any value in the Context changes, every component that consumes that context MUST re-render. If you put high-frequency data (like mouse coordinates or 100 fast-changing items) in Context, the entire app re-renders constantly.',
      whyItExists: 'Built-in solution for low-frequency global configurations (theme, user session, language).',
      syntaxRules: 'Use Context for static or low-frequency data. Avoid Context for high-frequency or granularly-selected data.',
      codeExample: `// Good Context: Low-frequency data (changes rarely)\nconst AuthContext = createContext(null);\n\n// Bad Context: High-frequency data (re-renders all consumers!)\nconst HighFrequencyContext = createContext({\n  cursorX: 0,\n  cursorY: 0,\n  audioTime: 0 // Changes 60 times/sec -> catastrophic re-renders!\n});`,
      lineByLine: [
        'Line 2: Auth status changes only on login/logout (ideal for Context).',
        'Line 5-9: Mouse and audio time change 60 times per second; putting them in Context causes 60 full-app re-renders per second!'
      ],
      expectedBehavior: 'Low-frequency context updates run smoothly with minimal re-render cost.',
      commonMistakes: ['Using Context for high-frequency gaming, audio, or canvas coordinates.', 'Putting the entire app state in one giant monolithic context.'],
      practiceLevels: {
        levelA: 'Provide and consume a UserProfileContext.',
        levelB: 'Profile render count when updating an un-memoized context value.',
        levelC: 'Determine when an application has outgrown Context and needs Zustand.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev reports: "My entire app freezes when typing in the search bar!"\n// Cause: Search query is stored in the root GlobalContext that wraps the entire app.`,
        problem: 'Root context re-renders all consumers on every single keystroke.',
        fix: 'Move search query to local state or a specialized Zustand store with selectors.'
      },
      conceptualQuestion: {
        question: 'Why is React Context generally unsuited for high-frequency state updates (e.g. mouse coordinates or audio playback time)?',
        options: [
          'Because Context cannot store numbers.',
          'Context lacks fine-grained selector subscriptions; any change to the context value forces every component calling `useContext` to re-render, causing severe performance drops.',
          'Because Context only works in class components.',
          'It crashes Node.js.'
        ],
        correctIndex: 1,
        explanation: 'Context notifies all consumers uniformly on any value change without selector filtering, leading to massive re-render storms.'
      },
      codeReadingQuestion: {
        snippet: `// Is Context a state management library?`,
        question: 'How did React team member Dan Abramov define Context?',
        answer: 'Context is a dependency injection mechanism (a transport pipe), not a state management library.'
      },
      starterCode: `// Assignment: Implement evaluateContextFit\n// Determine if a data requirement is suitable for React Context:\n// isSuitableForContext(updateFrequency, consumerTreeSize)\n// updateFrequency: 'RARE' (login/theme) | 'MODERATE' (cart) | 'HIGH_FREQUENCY' (cursor/animation)\n// consumerTreeSize: 'SMALL' | 'LARGE'\n// 1. If updateFrequency === 'HIGH_FREQUENCY' -> return { suitable: false, alternative: 'Zustand or useRef' }\n// 2. If updateFrequency === 'MODERATE' && consumerTreeSize === 'LARGE' -> return { suitable: false, alternative: 'Zustand' }\n// 3. Otherwise -> return { suitable: true, alternative: 'React Context' }\n\nexport function isSuitableForContext(updateFrequency, consumerTreeSize) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Approves rare updates for Context',
          run: (fn) => {
            const res = fn('RARE', 'LARGE');
            return res.suitable === true && res.alternative.includes('Context');
          }
        },
        {
          name: 'Rejects high-frequency updates from Context',
          run: (fn) => {
            const res = fn('HIGH_FREQUENCY', 'SMALL');
            return res.suitable === false && res.alternative.includes('Zustand');
          }
        }
      ],
      hints: [
        'Check updateFrequency === "HIGH_FREQUENCY" first.'
      ],
      checklist: [
        'Rejected high-frequency updates',
        'Allowed rare global settings',
        'Suggested appropriate alternatives'
      ],
      revisionSummary: 'Context is a transport pipe for low-frequency data; use Zustand for high-frequency or granularly-selected state.'
    },
    {
      id: 'p7-l4',
      slug: 'context-combined-with-usereducer',
      title: 'Context Combined with useReducer: Mini-Redux Pattern',
      prerequisites: ['p3-l11', 'p7-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Combine useReducer and Context to create a clean, dependency-free global state pattern.', 'Separate StateContext from DispatchContext.', 'Dispatch actions from deeply nested child components.'],
      explanation: 'Before adding external libraries like Redux or Zustand, you can build a powerful "Mini-Redux" using built-in React primitives: Context + useReducer. By splitting into two contexts—one for State and one for Dispatch—components that only dispatch actions NEVER re-render when state changes!',
      whyItExists: 'Provides clean, structured action-driven state management with zero external dependencies.',
      syntaxRules: 'Provide StateContext.Provider and DispatchContext.Provider. Export useTasks() and useTasksDispatch().',
      codeExample: `// Mini-Redux: Context + useReducer\nconst TasksStateContext = createContext(null);\nconst TasksDispatchContext = createContext(null);\n\nexport function TasksProvider({ children }) {\n  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);\n\n  return (\n    <TasksStateContext.Provider value={tasks}>\n      <TasksDispatchContext.Provider value={dispatch}>\n        {children}\n      </TasksDispatchContext.Provider>\n    </TasksStateContext.Provider>\n  );\n}\n\n// Custom Hooks\nexport const useTasks = () => useContext(TasksStateContext);\nexport const useTasksDispatch = () => useContext(TasksDispatchContext);`,
      lineByLine: [
        'Line 2-3: Declares separate contexts for state data and dispatch function.',
        'Line 8-12: Nests providers; dispatch reference is permanently stable.',
        'Buttons call useTasksDispatch() and NEVER re-render when tasks change!'
      ],
      expectedBehavior: 'Buttons dispatch actions smoothly; only consumers of tasks state re-render.',
      commonMistakes: ['Bundling state and dispatch into a single context value: value={{ state, dispatch }} (causes all dispatch buttons to re-render on every state change!).', 'Putting API calls inside the reducer function.'],
      practiceLevels: {
        levelA: 'Build an AuthProvider using Context + useReducer.',
        levelB: 'Implement an AddTaskButton that consumes only useTasksDispatch().',
        levelC: 'Verify that AddTaskButton does not re-render when tasks are added.'
      },
      debuggingChallenge: {
        brokenCode: `// In TasksProvider:\n<TasksContext.Provider value={{ tasks, dispatch }}>\n// AddTaskButton re-renders every time any task is checked off!`,
        problem: 'Bundling dispatch with tasks in the same context forces buttons to re-render on state changes.',
        fix: 'Split into TasksStateContext and TasksDispatchContext.'
      },
      conceptualQuestion: {
        question: 'Why does separating `StateContext` and `DispatchContext` improve rendering performance?',
        options: [
          'Because two contexts use less memory than one.',
          'The `dispatch` function from useReducer has a permanent, stable identity that never changes; components that only dispatch actions will NEVER re-render when state updates.',
          'Dispatch is processed on a background thread.',
          'It allows asynchronous reducers.'
        ],
        correctIndex: 1,
        explanation: 'Separating contexts prevents action-dispatching buttons from re-rendering when state values change.'
      },
      codeReadingQuestion: {
        snippet: `const dispatch = useTasksDispatch();\nreturn <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>;`,
        question: 'Will this button component re-render when tasks are added or deleted?',
        answer: 'No! Because dispatch reference is stable and it does not consume TasksStateContext.'
      },
      starterCode: `// Assignment: Implement miniReduxSimulator\n// Simulate the State and Dispatch separation of Context + useReducer:\n// createMiniRedux(reducer, initial)\n// Returns: { getState: () => any, dispatch: (action) => void, subscribeState: (cb) => void, subscribeDispatch: (cb) => void }\n// When dispatch(action) is called, state updates and ONLY state subscribers are notified. Dispatch subscribers are NOT notified!\n\nexport function createMiniRedux(reducer, initial) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Notifies state subscribers on dispatch but preserves dispatch stability',
          run: (fn) => {
            const reducer = (state, action) => action.type === 'INC' ? state + 1 : state;
            const store = fn(reducer, 0);
            let stateNotified = 0;
            let dispatchNotified = 0;
            store.subscribeState(() => { stateNotified++; });
            store.subscribeDispatch(() => { dispatchNotified++; });
            store.dispatch({ type: 'INC' });
            return store.getState() === 1 && stateNotified === 1 && dispatchNotified === 0;
          }
        }
      ],
      hints: [
        'Maintain let state = initial; stateSubscribers array; dispatch is constant function.'
      ],
      checklist: [
        'Updated state via reducer',
        'Notified state subscribers',
        'Preserved dispatch subscriber stability'
      ],
      revisionSummary: 'Combine Context with useReducer and split State from Dispatch to create a clean, dependency-free Mini-Redux.'
    },
    {
      id: 'p7-l5',
      slug: 'zustand-fundamentals-store-creation',
      title: 'Zustand Fundamentals: Store Creation without Providers',
      prerequisites: ['p7-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Install and create a Zustand store with create().', 'Understand why Zustand requires NO context providers or wrapping boilerplate.', 'Define state properties and mutation actions in one cohesive store.'],
      explanation: 'Zustand is the modern gold standard for React state management. Unlike Redux (which requires slices, dispatch, reducers, thunks, and providers) and Context (which requires providers and causes render storms), Zustand stores are plain JavaScript objects created with `create()`. There are NO Providers wrapping your app! You call the hook directly anywhere: `const count = useStore(state => state.count)`.',
      whyItExists: 'Provides an ultra-lightweight (1kB), ergonomic global state store with zero boilerplate.',
      syntaxRules: 'import { create } from "zustand"; const useStore = create((set, get) => ({ count: 0, inc: () => set(state => ({ count: state.count + 1 })) })).',
      codeExample: `import { create } from 'zustand';\n\n// Create store: State and Actions live together!\nexport const useCartStore = create((set) => ({\n  items: [],\n  // Action to add item\n  addItem: (product) => set((state) => ({\n    items: [...state.items, product]\n  })),\n  // Action to clear cart\n  clearCart: () => set({ items: [] })\n}));\n\n// In Component (No Provider needed!):\nfunction CartBadge() {\n  const items = useCartStore((state) => state.items);\n  return <span>Cart: {items.length}</span>;\n}`,
      lineByLine: [
        'Line 4: create() initializes the store.',
        'Line 7: set() performs a shallow merge of the new state into the store.',
        'Line 16: Components call useCartStore() directly without any <CartProvider> wrapper.'
      ],
      expectedBehavior: 'State updates cleanly across any component in the application with 1kB overhead.',
      commonMistakes: ['Mutating state directly: state.items.push(product) (set requires immutable state objects!).', 'Creating multiple stores for data that needs to be synchronized together.'],
      practiceLevels: {
        levelA: 'Create a useThemeStore with dark mode toggle.',
        levelB: 'Build a useAuthStore managing user profile and login/logout actions.',
        levelC: 'Inspect Zustand store state outside React components using useStore.getState().'
      },
      debuggingChallenge: {
        brokenCode: `const useStore = create(set => ({\n  count: 0,\n  inc: () => { this.count++; } // Broken: this mutation!\n}));`,
        problem: 'Direct mutation using `this` does not trigger Zustand listener updates.',
        fix: 'inc: () => set(state => ({ count: state.count + 1 }))'
      },
      conceptualQuestion: {
        question: 'Why does Zustand NOT require wrapping the component tree in a `<Provider>` component like Redux and Context do?',
        options: [
          'Because Zustand only works in Node.js.',
          'Zustand creates an external singleton store in memory that React components subscribe to directly using `useSyncExternalStore` under the hood.',
          'Because Zustand uses localStorage.',
          'It is a Vite compiler trick.'
        ],
        correctIndex: 1,
        explanation: 'Zustand lives outside the React tree as a standalone store; components subscribe directly without needing provider context wrappers.'
      },
      codeReadingQuestion: {
        snippet: `const currentCount = useStore.getState().count;`,
        question: 'Can Zustand state be read outside of React components using .getState()?',
        answer: 'Yes! `getState()` allows reading state anywhere (in API services, event listeners, or utility functions).'
      },
      starterCode: `// Assignment: Implement simulateZustandCreate\n// Build a simplified simulator of Zustand\'s create() API:\n// createZustandStore(storeCreator)\n// storeCreator = (set, get) => ({ count: 0, inc: () => set(...) })\n// Returns: { getState: () => any, setState: (partialOrFn) => void, subscribe: (cb) => unsubscribe }\n// set() must perform shallow merge: Object.assign({}, currentState, nextState)\n\nexport function createZustandStore(storeCreator) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Initializes state and updates via set shallow merge',
          run: (fn) => {
            const store = fn((set) => ({
              count: 0,
              inc: () => set((s) => ({ count: s.count + 1 }))
            }));
            const initial = store.getState().count;
            store.getState().inc();
            const updated = store.getState().count;
            return initial === 0 && updated === 1;
          }
        }
      ],
      hints: [
        'let state = {}; const set = (partial) => { state = Object.assign({}, state, typeof partial === "function" ? partial(state) : partial); listeners.forEach(cb => cb(state)); }; state = storeCreator(set, () => state);'
      ],
      checklist: [
        'Initialized state with store creator',
        'Implemented shallow merge set',
        'Supported getter and subscription'
      ],
      revisionSummary: 'Zustand creates provider-free, lightweight global stores pairing state and actions together.'
    },
    {
      id: 'p7-l6',
      slug: 'zustand-selectors-and-actions',
      title: 'Zustand: Selectors, Actions, and Granular Re-rendering',
      prerequisites: ['p7-l5'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Master selector functions: useStore(state => state.property).', 'Achieve granular re-renders (components re-render ONLY when their selected slice changes).', 'Use shallow comparison for multi-property selection.'],
      explanation: 'Zustand\'s superpower is SELECTORS. If a store holds 20 properties, and Component A only selects `const count = useStore(state => state.count)`, Component A will NOT re-render if any of the other 19 properties change! If you call `useStore()` without a selector, the component re-renders on EVERY store change. Always use selectors.',
      whyItExists: 'Delivers surgical, high-performance re-rendering across massive applications.',
      syntaxRules: 'Always write: useStore(state => state.targetProperty). When selecting multiple properties, use `useShallow`: useStore(useShallow(state => ({ a: state.a, b: state.b }))).',
      codeExample: `import { create } from 'zustand';\nimport { useShallow } from 'zustand/react/shallow';\n\n// Component A: ONLY re-renders when count changes!\nfunction CounterDisplay() {\n  const count = useStore(state => state.count); // Granular Selector\n  return <h1>{count}</h1>;\n}\n\n// Component B: Action-only component NEVER re-renders!\nfunction IncrementButton() {\n  const inc = useStore(state => state.inc); // Action is stable\n  return <button onClick={inc}>+1</button>;\n}\n\n// Component C: Multi-property selection with useShallow\nfunction UserCard() {\n  const { name, role } = useStore(useShallow(s => ({ name: s.name, role: s.role })));\n  return <div>{name} ({role})</div>;\n}`,
      lineByLine: [
        'Line 6: CounterDisplay subscribes ONLY to count; changes to user or theme will NOT re-render this component.',
        'Line 12: Action selector inc is referentially permanent, so IncrementButton never re-renders.',
        'Line 18: useShallow prevents re-renders when returning a new object literal.'
      ],
      expectedBehavior: 'Each component re-renders if and only if its specific selected slice changes.',
      commonMistakes: ['Calling const { count, inc } = useStore() without a selector (causes re-render on ANY store mutation!).', 'Returning object literals from selectors without useShallow.'],
      practiceLevels: {
        levelA: 'Write a selector to pick only completed tasks from a Zustand store.',
        levelB: 'Use useShallow to pick 2 properties into a header badge.',
        levelC: 'Measure re-render counts to prove unrelated components stay idle.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev writes: const { a, b } = useStore(s => ({ a: s.a, b: s.b }));\n// Component re-renders on every store change even when a and b did not change!`,
        problem: 'Selector returns a new object reference on every call, failing strict equality.',
        fix: 'Wrap with useShallow: useStore(useShallow(s => ({ a: s.a, b: s.b })))'
      },
      conceptualQuestion: {
        question: 'Why should you always pass a selector function (`useStore(state => state.value)`) in Zustand?',
        options: [
          'Zustand throws an error without a selector.',
          'Selectors ensure the component only subscribes and re-renders when that specific selected slice of state changes, preventing unnecessary re-renders from other store updates.',
          'Selectors encrypt the data.',
          'It is required by TypeScript.'
        ],
        correctIndex: 1,
        explanation: 'Selectors enable surgical subscriptions: components only re-render when their specific chosen slice changes.'
      },
      codeReadingQuestion: {
        snippet: `const deleteUser = useUserStore(s => s.deleteUser);`,
        question: 'Will a component containing this line re-render when users are added or deleted?',
        answer: 'No, because deleteUser is an action function whose reference never changes.'
      },
      starterCode: `// Assignment: Implement simulateSelectorFilter\n// Simulate Zustand selector comparison:\n// shouldComponentRerenderZustand(prevSlice, nextSlice, isShallow = false)\n// 1. If !isShallow -> return !Object.is(prevSlice, nextSlice)\n// 2. If isShallow -> return !shallowEqual(prevSlice, nextSlice)\n\nexport function shouldComponentRerenderZustand(prevSlice, nextSlice, isShallow = false) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Skips re-render when primitive slice is unchanged via Object.is',
          run: (fn) => {
            return fn(42, 42, false) === false && fn(42, 43, false) === true;
          }
        },
        {
          name: 'Skips re-render with shallow comparison on object slice',
          run: (fn) => {
            const o1 = { a: 1, b: 'x' };
            const o2 = { a: 1, b: 'x' };
            return fn(o1, o2, true) === false;
          }
        }
      ],
      hints: [
        'Check isShallow: if true, compare object keys and values shallowly; else Object.is(prev, next).'
      ],
      checklist: [
        'Handled strict Object.is comparison',
        'Handled shallow object comparison',
        'Returned accurate re-render decision'
      ],
      revisionSummary: 'Always use selectors in Zustand to achieve granular, surgical re-renders; use useShallow for multi-value objects.'
    },
    {
      id: 'p7-l7',
      slug: 'redux-fundamentals-unidirectional-flow',
      title: 'Redux Fundamentals: Unidirectional Data Flow',
      prerequisites: ['p7-l1', 'p3-l11'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the Redux triangle: Action -> Dispatch -> Reducer -> Store -> UI.', 'Understand the Three Principles of Redux.', 'Compare modern Redux with Zustand.'],
      explanation: 'Redux enforces strict unidirectional data flow through three principles: 1. Single source of truth (one central store tree). 2. State is read-only (mutations are prohibited; you must dispatch an action). 3. Changes are made with pure reducer functions: (state, action) => newState. When a user clicks, an Action is Dispatched, the Reducer computes new state, the Store updates, and the UI re-renders.',
      whyItExists: 'Provides total predictability and time-travel debugging in large enterprise codebases.',
      syntaxRules: 'Actions are plain objects with a `type` string. Reducers must be 100% pure functions.',
      codeExample: `// Classic Redux Data Flow\n// 1. Action: Plain object describing an event\nconst action = { type: 'cart/addItem', payload: { id: 1, name: 'Shoes' } };\n\n// 2. Reducer: Pure function computing next state\nfunction cartReducer(state = { items: [] }, action) {\n  switch (action.type) {\n    case 'cart/addItem':\n      return { ...state, items: [...state.items, action.payload] };\n    default:\n      return state;\n  }\n}\n\n// 3. Store: Central coordinator\n// store.dispatch(action) -> calls cartReducer -> updates state -> notifies UI`,
      lineByLine: [
        'Line 2: Action describes "what happened".',
        'Line 5: Reducer specifies "how state updates".',
        'Line 14: Unidirectional loop guarantees predictable, trackable state changes.'
      ],
      expectedBehavior: 'State transitions are strictly linear, transparent, and auditable.',
      commonMistakes: ['Mutating state inside classic Redux reducers (causes silent bugs).', 'Writing legacy "boilerplate" Redux with switch statements in 2026 (use Redux Toolkit instead!).'],
      practiceLevels: {
        levelA: 'Trace an action from button dispatch to reducer.',
        levelB: 'Write an action creator function.',
        levelC: 'Inspect actions in Redux DevTools.'
      },
      debuggingChallenge: {
        brokenCode: `function reducer(state, action) {\n  state.user = action.payload; // Direct mutation in classic Redux!\n  return state;\n}`,
        problem: 'Direct mutation violates Redux purity; store listeners will not detect state changes.',
        fix: 'return { ...state, user: action.payload };'
      },
      conceptualQuestion: {
        question: 'What are the Three Principles of Redux?',
        options: [
          'Components, Props, and State.',
          'Single source of truth (one store), State is read-only (dispatch actions), and Changes are made with pure functions (reducers).',
          'HTML, CSS, and JavaScript.',
          'Vite, React, and Node.js.'
        ],
        correctIndex: 1,
        explanation: 'Redux guarantees predictability through: 1 single store, read-only state via actions, and pure function reducers.'
      },
      codeReadingQuestion: {
        snippet: `dispatch({ type: 'counter/increment' });`,
        question: 'What method sends an action to the Redux store?',
        answer: 'The `dispatch()` method.'
      },
      starterCode: `// Assignment: Implement simulateReduxFlow\n// Build an educational Redux unidirectional loop:\n// simulateReduxFlow(reducer, initialState, action)\n// 1. Compute nextState = reducer(initialState, action)\n// 2. Return: { previousState: initialState, action, nextState, wasMutated: initialState === nextState }\n\nexport function simulateReduxFlow(reducer, initialState, action) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Computes next state immutably through reducer',
          run: (fn) => {
            const red = (s, a) => a.type === 'ADD' ? { count: s.count + a.val } : s;
            const res = fn(red, { count: 0 }, { type: 'ADD', val: 5 });
            return res.nextState.count === 5 && res.wasMutated === false;
          }
        }
      ],
      hints: [
        'Call reducer(initialState, action) and compare with initialState.'
      ],
      checklist: [
        'Dispatched action to reducer',
        'Computed next state',
        'Verified immutable reference creation'
      ],
      revisionSummary: 'Redux enforces unidirectional data flow: UI dispatches actions, pure reducers compute new state, store notifies UI.'
    },
    {
      id: 'p7-l8',
      slug: 'redux-toolkit-slices-immer',
      title: 'Redux Toolkit (RTK): Slices and Immer Mutability',
      prerequisites: ['p7-l7'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: ['Eliminate 80% of legacy Redux boilerplate using Redux Toolkit (RTK).', 'Use createSlice() to define state, reducers, and actions together.', 'Write "mutating" syntax safely using Immer under the hood.'],
      explanation: 'Modern Redux is written exclusively with Redux Toolkit (@reduxjs/toolkit). `createSlice()` defines the initial state, reducers, and automatically generates action creators in one place. Crucially, RTK uses the Immer library inside reducers: you can write intuitive "mutating" code (`state.items.push(item)`), and Immer automatically translates it into safe, immutable state updates behind the scenes!',
      whyItExists: 'Eliminates repetitive action constants, action creators, and tedious nested spread operators.',
      syntaxRules: 'Only write mutating logic (state.count++) INSIDE createSlice reducers. Never mutate state outside createSlice.',
      codeExample: `import { createSlice, configureStore } from '@reduxjs/toolkit';\n\n// Redux Toolkit Slice: Zero boilerplate!\nexport const cartSlice = createSlice({\n  name: 'cart',\n  initialState: { items: [], total: 0 },\n  reducers: {\n    // Immer allows direct "mutation" syntax safely!\n    addItem: (state, action) => {\n      state.items.push(action.payload); // Safe with Immer!\n      state.total += action.payload.price;\n    },\n    clearCart: (state) => {\n      state.items = [];\n      state.total = 0;\n    }\n  }\n});\n\n// Action creators are generated automatically!\nexport const { addItem, clearCart } = cartSlice.actions;\nexport default cartSlice.reducer;`,
      lineByLine: [
        'Line 4: createSlice bundles actions and reducers together.',
        'Line 9: state.items.push() is completely safe because Immer intercepts mutations and creates immutable copies.',
        'Line 18: cartSlice.actions exports addItem and clearCart action creator functions automatically.'
      ],
      expectedBehavior: 'Clean, concise Redux code with automatic immutable update generation.',
      commonMistakes: ['Writing manual action types like "CART_ADD_ITEM" (RTK creates them automatically!).', 'Returning a new state AND mutating existing state in the same reducer (causes Immer conflicts).'],
      practiceLevels: {
        levelA: 'Create a counterSlice with increment, decrement, and incrementByAmount.',
        levelB: 'Build a taskSlice with toggleTask and deleteTask using Immer.',
        levelC: 'Configure a store with configureStore({ reducer: { cart: cartReducer } }).'
      },
      debuggingChallenge: {
        brokenCode: `addItem: (state, action) => {\n  state.items.push(action.payload);\n  return state; // Error: An immer producer returned a new value AND mutated its draft!\n}`,
        problem: 'In Immer reducers, either mutate the draft OR return a new object, never both.',
        fix: 'Remove `return state;`—mutating the draft alone is sufficient.'
      },
      conceptualQuestion: {
        question: 'How does Redux Toolkit allow developers to write "mutating" code like `state.items.push(item)` safely?',
        options: [
          'It disables immutability in React.',
          'RTK internally uses the `Immer` library, which tracks changes to a draft proxy and produces a completely new immutable state snapshot automatically.',
          'It uses WebAssembly.',
          'It stores state in MySQL.'
        ],
        correctIndex: 1,
        explanation: 'Immer records mutations made to a draft object and converts them into pristine immutable state copies.'
      },
      codeReadingQuestion: {
        snippet: `const { actions, reducer } = createSlice({ name: 'auth', ... });`,
        question: 'What does createSlice automatically generate?',
        answer: 'Action creator functions matching each reducer, action type strings ("auth/login"), and the slice reducer.'
      },
      starterCode: `// Assignment: Implement simulateImmerDraftMutation\n// Simulate Immer draft mutation behavior:\n// produceState(baseState, recipeFn)\n// 1. Deep clone baseState to create a draft.\n// 2. Call recipeFn(draft).\n// 3. Freeze and return the modified draft. Original baseState must NOT be mutated!\n\nexport function produceState(baseState, recipeFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Allows mutating draft while keeping baseState untouched',
          run: (fn) => {
            const base = { items: ['A'] };
            const next = fn(base, (draft) => { draft.items.push('B'); });
            return next.items.length === 2 && base.items.length === 1 && next !== base;
          }
        }
      ],
      hints: [
        'const draft = structuredClone(baseState); recipeFn(draft); return Object.freeze(draft);'
      ],
      checklist: [
        'Cloned base state',
        'Executed recipe on draft',
        'Preserved base state immutability'
      ],
      revisionSummary: 'Redux Toolkit createSlice eliminates boilerplate and uses Immer to enable safe "mutating" reducer syntax.'
    },
    {
      id: 'p7-l9',
      slug: 'useselector-usedispatch-react-redux',
      title: 'useSelector and useDispatch in React-Redux',
      prerequisites: ['p7-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Connect React components to Redux store using useSelector and useDispatch.', 'Select specific slices of state to minimize re-renders.', 'Dispatch generated action creators.'],
      explanation: 'React-Redux connects your React components to the Redux store: 1. Wrap the root app in `<Provider store={store}>`. 2. `useSelector(state => state.cart.total)` reads a specific slice from the store. 3. `useDispatch()` returns the dispatch function to send actions (`dispatch(addItem(product))`).',
      whyItExists: 'Bridges Redux store state into declarative React hooks.',
      syntaxRules: 'Always select the minimal data needed: const count = useSelector(state => state.counter.value).',
      codeExample: `import { useSelector, useDispatch } from 'react-redux';\nimport { addItem } from '../features/cart/cartSlice';\n\nfunction ProductCard({ product }) {\n  const dispatch = useDispatch();\n  // Select only item count to avoid re-rendering on other cart changes\n  const itemCount = useSelector(state => state.cart.items.length);\n\n  return (\n    <div>\n      <h3>{product.name}</h3>\n      <button onClick={() => dispatch(addItem(product))}>\n        Add to Cart ({itemCount})\n      </button>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 5: useDispatch gets the store dispatch method.',
        'Line 7: useSelector subscribes specifically to cart item count.',
        'Line 12: Dispatches the addItem action creator with product payload.'
      ],
      expectedBehavior: 'Clicking button dispatches action, updates store, and updates itemCount badge.',
      commonMistakes: ['Calling useSelector(state => state) without selector (re-renders on ANY change in ANY slice!).', 'Forgetting the root <Provider store={store}> wrapper.'],
      practiceLevels: {
        levelA: 'Select user name from auth slice and display in navigation.',
        levelB: 'Dispatch an incrementByAmount action with numeric input payload.',
        levelC: 'Profile component re-renders when other unrelated slices update.'
      },
      debuggingChallenge: {
        brokenCode: `function Header() {\n  const state = useSelector(state => state); // Re-renders on EVERY action across entire app!\n}`,
        problem: 'Selecting the entire state tree disables selector memoization.',
        fix: 'Select specific slice: const user = useSelector(state => state.auth.user);'
      },
      conceptualQuestion: {
        question: 'How does `useSelector` determine whether to re-render a component?',
        options: [
          'It re-renders on every clock second.',
          'It compares the previous and next selected value using strict reference equality (`===`); if the selected reference has not changed, it skips re-rendering.',
          'It re-renders on all store actions unconditionally.',
          'It uses JSON.stringify.'
        ],
        correctIndex: 1,
        explanation: 'useSelector uses strict `===` reference equality on the returned value; if the selected value is identical, re-rendering is skipped.'
      },
      codeReadingQuestion: {
        snippet: `dispatch(cartSlice.actions.clearCart());`,
        question: 'What is passed to dispatch here?',
        answer: 'The action object `{ type: "cart/clearCart" }` generated by the clearCart action creator.'
      },
      starterCode: `// Assignment: Implement simulateReduxSelector\n// Simulate useSelector equality check:\n// testSelectorRerender(prevStoreState, nextStoreState, selectorFn)\n// Extract prevSelected = selectorFn(prevStoreState), nextSelected = selectorFn(nextStoreState)\n// Return: { shouldRerender: prevSelected !== nextSelected, selectedValue: nextSelected }\n\nexport function testSelectorRerender(prevStoreState, nextStoreState, selectorFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Skips re-render when selected slice is identical',
          run: (fn) => {
            const s1 = { cart: { count: 2 }, user: { name: 'Ada' } };
            const s2 = { cart: { count: 2 }, user: { name: 'Grace' } }; // user changed, cart unchanged!
            const res = fn(s1, s2, (s) => s.cart.count);
            return res.shouldRerender === false && res.selectedValue === 2;
          }
        },
        {
          name: 'Triggers re-render when selected slice changes',
          run: (fn) => {
            const s1 = { cart: { count: 2 } };
            const s2 = { cart: { count: 3 } };
            const res = fn(s1, s2, (s) => s.cart.count);
            return res.shouldRerender === true && res.selectedValue === 3;
          }
        }
      ],
      hints: [
        'Compute prev = selectorFn(prevStoreState); next = selectorFn(nextStoreState); compare prev !== next.'
      ],
      checklist: [
        'Applied selector to both state snapshots',
        'Compared using strict equality',
        'Returned accurate re-render flag'
      ],
      revisionSummary: 'useSelector extracts specific slices with strict equality memoization; useDispatch dispatches action creators.'
    },
    {
      id: 'p7-l10',
      slug: 'async-workflows-createasyncthunk',
      title: 'Async Workflows with Redux Toolkit: createAsyncThunk',
      prerequisites: ['p7-l8', 'p7-l9'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: ['Handle asynchronous API requests in Redux using createAsyncThunk.', 'Handle pending, fulfilled, and rejected promise lifecycles in extraReducers.', 'Understand Redux middleware.'],
      explanation: 'Redux reducers must be pure synchronous functions; they cannot make API calls. `createAsyncThunk` creates asynchronous action creators that handle the full Promise lifecycle. It automatically dispatches three actions: 1. `myThunk.pending` (set loading true), 2. `myThunk.fulfilled` (save data, set loading false), 3. `myThunk.rejected` (save error message). These are handled in the slice\'s `extraReducers`.',
      whyItExists: 'Standardizes async request lifecycles (loading, success, error) in Redux Toolkit.',
      syntaxRules: 'createAsyncThunk("slice/actionName", async (arg, thunkAPI) => { ... }). Handle in extraReducers: builder.addCase(thunk.fulfilled, ...).',
      codeExample: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';\n\n// 1. Create Async Thunk\nexport const fetchUser = createAsyncThunk(\n  'user/fetchById',\n  async (userId, { rejectWithValue }) => {\n    try {\n      const res = await fetch(\`/api/users/\${userId}\`);\n      if (!res.ok) throw new Error('User not found');\n      return await res.json(); // Becomes action.payload in fulfilled!\n    } catch (err) {\n      return rejectWithValue(err.message);\n    }\n  }\n);\n\n// 2. Handle in Slice extraReducers\nconst userSlice = createSlice({\n  name: 'user',\n  initialState: { data: null, status: 'idle', error: null },\n  reducers: {},\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })\n      .addCase(fetchUser.fulfilled, (state, action) => {\n        state.status = 'succeeded';\n        state.data = action.payload;\n      })\n      .addCase(fetchUser.rejected, (state, action) => {\n        state.status = 'failed';\n        state.error = action.payload;\n      });\n  }\n});`,
      lineByLine: [
        'Line 4: createAsyncThunk defines the async operation.',
        'Line 9: Returned JSON automatically populates action.payload in fulfilled.',
        'Line 21-28: extraReducers handles pending, fulfilled, and rejected transitions cleanly.'
      ],
      expectedBehavior: 'UI tracks status ("loading", "succeeded", "failed") deterministically.',
      commonMistakes: ['Putting fetch calls inside standard reducers (reducers must remain pure synchronous functions!).', 'Forgetting to handle .rejected causing silent failures.'],
      practiceLevels: {
        levelA: 'Create a fetchPosts thunk handling fulfilled data.',
        levelB: 'Add rejectWithValue to return custom backend validation errors.',
        levelC: 'Compare createAsyncThunk boilerplate with TanStack Query.'
      },
      debuggingChallenge: {
        brokenCode: `// In slice reducers:\nfetchUser: async (state) => {\n  const data = await fetch('/api'); // Error: Reducer functions must be synchronous!\n}`,
        problem: 'Reducers cannot be async functions.',
        fix: 'Use createAsyncThunk and handle in extraReducers.'
      },
      conceptualQuestion: {
        question: 'What three action types does `createAsyncThunk("todos/fetch", ...)` automatically dispatch during its lifecycle?',
        options: [
          'start, stop, error',
          '`todos/fetch/pending`, `todos/fetch/fulfilled`, and `todos/fetch/rejected`',
          'loading, success, failed',
          'try, catch, finally'
        ],
        correctIndex: 1,
        explanation: 'createAsyncThunk automatically dispatches pending on start, fulfilled on success, and rejected on promise error.'
      },
      codeReadingQuestion: {
        snippet: `builder.addCase(fetchItems.rejected, (state, action) => { state.error = action.payload; });`,
        question: 'When is this reducer case executed?',
        answer: 'When the fetchItems async thunk rejects or returns rejectWithValue.'
      },
      starterCode: `// Assignment: Implement simulateThunkLifecycle\n// Simulate the 3 actions dispatched by an async thunk:\n// executeThunkSimulation(thunkPrefix, asyncFn)\n// Track actions dispatched: [{ type: string, payload?: any }]\n// 1. Dispatch \`\${thunkPrefix}/pending\`\n// 2. Await asyncFn()\n// 3. If succeeds -> dispatch \`\${thunkPrefix}/fulfilled\` with result\n// 4. If fails -> dispatch \`\${thunkPrefix}/rejected\` with err.message\n// Return array of dispatched actions.\n\nexport async function executeThunkSimulation(thunkPrefix, asyncFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Dispatches pending then fulfilled on success',
          run: async (fn) => {
            const actions = await fn('items/load', async () => ['A', 'B']);
            return actions.length === 2 && actions[0].type === 'items/load/pending' && actions[1].type === 'items/load/fulfilled' && actions[1].payload.length === 2;
          }
        },
        {
          name: 'Dispatches pending then rejected on failure',
          run: async (fn) => {
            const actions = await fn('items/load', async () => { throw new Error('API 500'); });
            return actions.length === 2 && actions[0].type === 'items/load/pending' && actions[1].type === 'items/load/rejected' && actions[1].payload === 'API 500';
          }
        }
      ],
      hints: [
        'Push pending action, try/catch await asyncFn(), push fulfilled or rejected action.'
      ],
      checklist: [
        'Dispatched pending action',
        'Dispatched fulfilled on success',
        'Dispatched rejected on exception'
      ],
      revisionSummary: 'createAsyncThunk standardizes async lifecycles by automatically dispatching pending, fulfilled, and rejected actions.'
    },
    {
      id: 'p7-l11',
      slug: 'rtk-query-server-state',
      title: 'RTK Query: Built-in Server State for Redux',
      prerequisites: ['p7-l10', 'p6-l13'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Understand RTK Query as Redux Toolkit\'s answer to TanStack Query.', 'Define API endpoints with createApi() and fetchBaseQuery.', 'Auto-generate React hooks: useGetPostsQuery, useAddPostMutation.'],
      explanation: 'Writing `createAsyncThunk` + `extraReducers` for every single API endpoint requires a lot of code. RTK Query is an advanced data fetching and caching tool built directly into Redux Toolkit. You define your API service with `createApi()`, and RTK Query AUTOMATICALLY generates React hooks (e.g. `useGetLessonsQuery()`, `useAddLessonMutation()`) with built-in caching, polling, and deduplication!',
      whyItExists: 'Eliminates 90% of hand-written thunks and reducers in Redux applications.',
      syntaxRules: 'createApi({ reducerPath, baseQuery, endpoints: (builder) => ({ ... }) }).',
      codeExample: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';\n\nexport const lessonsApi = createApi({\n  reducerPath: 'lessonsApi',\n  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),\n  tagTypes: ['Lesson'],\n  endpoints: (builder) => ({\n    // Query endpoint\n    getLessons: builder.query({\n      query: () => '/lessons',\n      providesTags: ['Lesson']\n    }),\n    // Mutation endpoint\n    addLesson: builder.mutation({\n      query: (body) => ({ url: '/lessons', method: 'POST', body }),\n      invalidatesTags: ['Lesson'] // Auto-refetches getLessons!\n    })\n  })\n});\n\n// AUTO-GENERATED HOOKS!\nexport const { useGetLessonsQuery, useAddLessonMutation } = lessonsApi;`,
      lineByLine: [
        'Line 5: fetchBaseQuery is a lightweight fetch wrapper handling URLs and headers.',
        'Line 9: getLessons endpoint defines a GET query providing "Lesson" tags.',
        'Line 15: addLesson invalidates "Lesson" tag, automatically refetching getLessons!',
        'Line 21: RTK Query generates custom hooks automatically based on endpoint names.'
      ],
      expectedBehavior: 'Automatic hooks handle caching, loading, errors, and cache invalidation.',
      commonMistakes: ['Forgetting to add api.middleware to configureStore (breaks cache subscriptions!).', 'Writing manual thunks when RTK Query handles endpoints in 5 lines.'],
      practiceLevels: {
        levelA: 'Define an RTK Query endpoint for getTodos.',
        levelB: 'Add tag invalidation on a createTodo mutation.',
        levelC: 'Compare RTK Query features against TanStack Query.'
      },
      debuggingChallenge: {
        brokenCode: `// Error: Middleware for RTK Query was not added to the store!`,
        problem: 'Forgot to register api.middleware in configureStore.',
        fix: 'middleware: (getDefault) => getDefault().concat(lessonsApi.middleware)'
      },
      conceptualQuestion: {
        question: 'What is the primary difference between standard Redux Toolkit (`createSlice` + `createAsyncThunk`) and RTK Query (`createApi`)?',
        options: [
          'RTK Query only works in React Native.',
          'Standard RTK requires manually writing thunks, reducers, and loading flags for every endpoint; RTK Query generates hooks automatically with built-in caching, polling, and tag invalidation.',
          'RTK Query cannot make POST requests.',
          'There is no difference.'
        ],
        correctIndex: 1,
        explanation: 'RTK Query automates the entire server-state lifecycle (caching, deduplication, invalidation) via auto-generated hooks.'
      },
      codeReadingQuestion: {
        snippet: `const { data, isLoading } = useGetLessonsQuery();`,
        question: 'Where did the hook `useGetLessonsQuery` come from?',
        answer: 'Auto-generated by RTK Query from the `getLessons` endpoint definition in `createApi`.'
      },
      starterCode: `// Assignment: Implement generateHookName\n// Simulate RTK Query hook name generator:\n// generateRtkHookName(endpointName, type)\n// type: 'query' | 'mutation'\n// Format: \`use\${Capitalized(endpointName)}\${Capitalized(type)}\`\n// Example: ('getUsers', 'query') -> 'useGetUsersQuery'\n// Example: ('addPost', 'mutation') -> 'useAddPostMutation'\n\nexport function generateRtkHookName(endpointName, type) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Generates proper hook names for queries and mutations',
          run: (fn) => {
            const q = fn('getLessons', 'query');
            const m = fn('createLesson', 'mutation');
            return q === 'useGetLessonsQuery' && m === 'useCreateLessonMutation';
          }
        }
      ],
      hints: [
        'Capitalize first letter: str[0].toUpperCase() + str.slice(1).'
      ],
      checklist: [
        'Prefixed with "use"',
        'Capitalized endpoint name',
        'Appended capitalized type (Query/Mutation)'
      ],
      revisionSummary: 'RTK Query is Redux Toolkit\'s built-in server-state tool, auto-generating query and mutation hooks with tag caching.'
    },
    {
      id: 'p7-l12',
      slug: 'persistence-and-hydration',
      title: 'State Persistence and Storage Hydration',
      prerequisites: ['p7-l5'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Persist global state to localStorage using Zustand persist middleware or redux-persist.', 'Handle state schema migrations when data structures change.', 'Hydrate state safely across browser reloads.'],
      explanation: 'When a user refreshes the page, in-memory state resets. Persistence middleware automatically serializes state changes to `localStorage` (or `sessionStorage`), and rehydrates the store when the app boots up. Senior engineers always version their persisted data schema (`version: 1`) and provide migration functions to handle schema upgrades gracefully without crashing user browsers.',
      whyItExists: 'Preserves user progress, auth tokens, cart items, and settings across browser sessions.',
      syntaxRules: 'Use Zustand persist middleware: create(persist((set) => ({ ... }), { name: "storage-key", version: 1 })).',
      codeExample: `import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';\n\nexport const useAcademyProgressStore = create(\n  persist(\n    (set) => ({\n      completedLessons: [],\n      streakDays: 1,\n      markComplete: (id) => set(s => ({ completedLessons: [...s.completedLessons, id] }))\n    }),\n    {\n      name: 'academy-progress-storage', // localStorage key name\n      version: 1, // Schema version for migrations\n      migrate: (persistedState, version) => {\n        if (version === 0) {\n          // Migration from v0 to v1\n          return { ...persistedState, streakDays: 1 };\n        }\n        return persistedState;\n      }\n    }\n  )\n);`,
      lineByLine: [
        'Line 5: persist middleware wraps store creator.',
        'Line 11: name specifies the localStorage key.',
        'Line 12-19: version and migrate safely transform outdated stored data to current schema.'
      ],
      expectedBehavior: 'Completed lessons and streak persist seamlessly after browser refresh or tab reopen.',
      commonMistakes: ['Persisting non-serializable data (Functions, Promises, DOM nodes) which break JSON.stringify.', 'Updating state schema in code without bumping version, causing crashes on users with old data.'],
      practiceLevels: {
        levelA: 'Persist dark mode theme preference to localStorage with Zustand.',
        levelB: 'Implement a schema migration adding a new property with default fallback.',
        levelC: 'Build an export/import progress JSON feature.'
      },
      debuggingChallenge: {
        brokenCode: `// App crashes on load after deploying update: "TypeError: Cannot read properties of undefined (reading 'streakDays')"`,
        problem: 'Existing users had v0 data in localStorage without streakDays.',
        fix: 'Add version: 1 and a migrate function to supply default fallback.'
      },
      conceptualQuestion: {
        question: 'Why is it critical to include a `version` and `migrate` function when persisting state to localStorage?',
        options: [
          'Because localStorage requires numbers.',
          'As your application evolves, state schemas change. Without versioned migrations, users with old stored data will experience crashes when your new code expects fields that don\'t exist in their cached data.',
          'To encrypt the data.',
          'It is required by Vite.'
        ],
        correctIndex: 1,
        explanation: 'Versioned migrations ensure that existing users with older stored JSON can transition smoothly to new data shapes.'
      },
      codeReadingQuestion: {
        snippet: `partialize: (state) => ({ token: state.token })`,
        question: 'What does the `partialize` option do in Zustand persist middleware?',
        answer: 'It filters which state properties get saved to localStorage (saving only token and ignoring transient UI state).'
      },
      starterCode: `// Assignment: Implement executeSchemaMigration\n// Safely migrate stored data to current schema version:\n// migrateSavedProgress(storedPayload, currentVersion, migrationFn)\n// storedPayload: { version: number, state: object }\n// 1. If storedPayload.version === currentVersion -> return { migrated: false, state: storedPayload.state }\n// 2. If storedPayload.version < currentVersion -> updatedState = migrationFn(storedPayload.state, storedPayload.version);\n//    return { migrated: true, state: { ...updatedState, schemaVersion: currentVersion } }\n\nexport function migrateSavedProgress(storedPayload, currentVersion, migrationFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Migrates outdated schema to current version',
          run: (fn) => {
            const old = { version: 0, state: { completed: ['l1'] } };
            const migrator = (s, v) => ({ ...s, streak: 1 });
            const res = fn(old, 1, migrator);
            return res.migrated === true && res.state.streak === 1 && res.state.schemaVersion === 1;
          }
        },
        {
          name: 'Returns existing state unchanged when version matches',
          run: (fn) => {
            const current = { version: 1, state: { completed: ['l1'], streak: 5 } };
            const res = fn(current, 1, () => {});
            return res.migrated === false && res.state.streak === 5;
          }
        }
      ],
      hints: [
        'Check storedPayload.version === currentVersion.'
      ],
      checklist: [
        'Detected version parity',
        'Executed migration function on outdated data',
        'Updated schemaVersion metadata'
      ],
      revisionSummary: 'Persist state to localStorage safely by versioning schemas and supplying migration functions for upgrades.'
    },
    {
      id: 'p7-l13',
      slug: 'normalized-data-entity-relationships',
      title: 'Normalized Data and Entity Relationships',
      prerequisites: ['p7-l8', 'p1-l19'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Understand normalized state structure: { byId: Record<string, T>, allIds: string[] }.', 'Avoid deeply nested arrays and duplicate entity references.', 'Achieve O(1) instant entity lookups and updates.'],
      explanation: 'In large applications, relational data (e.g. users, posts, comments) should not be stored as deeply nested arrays: `[{ id, comments: [{ id, author: {} }] }]`. If User 1 updates their avatar, you would have to search and mutate 50 nested arrays! Normalized state organizes data like a relational database: entities are stored by ID in a lookup table `{ byId: { [id]: entity }, allIds: [id1, id2] }`.',
      whyItExists: 'Enables O(1) instant updates, eliminates duplicate data, and simplifies entity relationships.',
      syntaxRules: 'Store entities as a dictionary: byId: { [id]: data }. Store ordering in an array: allIds: [1, 2, 3].',
      codeExample: `// NORMALIZED STATE SCHEMA\nconst state = {\n  users: {\n    byId: {\n      'u1': { id: 'u1', name: 'Ada' },\n      'u2': { id: 'u2', name: 'Bob' }\n    },\n    allIds: ['u1', 'u2']\n  },\n  posts: {\n    byId: {\n      'p1': { id: 'p1', title: 'React Hooks', authorId: 'u1' }\n    },\n    allIds: ['p1']\n  }\n};\n\n// O(1) Instant Lookup without searching arrays!\nconst author = state.users.byId[post.authorId];`,
      lineByLine: [
        'Line 4-7: Users are stored in an indexed dictionary (hash map).',
        'Line 10: Posts reference authors by authorId foreign key, not duplicate objects.',
        'Line 16: Instant O(1) lookup: state.users.byId[authorId] in 0 milliseconds!'
      ],
      expectedBehavior: 'Updating an entity in one place immediately updates all references across the app.',
      commonMistakes: ['Duplicating user objects inside 20 post objects.', 'Searching large arrays with array.find() when byId dictionary lookup is instant.'],
      practiceLevels: {
        levelA: 'Convert an array of items into a normalized byId / allIds dictionary.',
        levelB: 'Update a user name in a normalized store in O(1) time.',
        levelC: 'Inspect Redux Toolkit createEntityAdapter() utility.'
      },
      debuggingChallenge: {
        brokenCode: `// User changes name in profile, but their name on old comments still shows old name!`,
        problem: 'Comment objects stored cloned copies of the user object instead of referencing userId.',
        fix: 'Normalize data: comments store authorId, look up author in users.byId.'
      },
      conceptualQuestion: {
        question: 'What is the primary benefit of storing relational data in a normalized structure (`byId` and `allIds`) in React state?',
        options: [
          'It makes CSS render faster.',
          'It eliminates duplicate entity copies and allows updating any entity in O(1) time without traversing deeply nested arrays.',
          'It is required by Vite.',
          'It replaces MongoDB.'
        ],
        correctIndex: 1,
        explanation: 'Normalization prevents duplicate data desynchronization and enables O(1) direct entity lookups.'
      },
      codeReadingQuestion: {
        snippet: `const user = state.users.byId[userId];`,
        question: 'What is the algorithmic time complexity of this lookup?',
        answer: 'O(1) constant time dictionary lookup.'
      },
      starterCode: `// Assignment: Implement normalizeEntityArray\n// Transform an array of entities into a normalized dictionary structure:\n// normalizeEntityArray(items)\n// items: [{ id: string | number, ...properties }]\n// Return: { byId: Record<string, T>, allIds: (string | number)[] }\n\nexport function normalizeEntityArray(items) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Normalizes array into byId dictionary and allIds order array',
          run: (fn) => {
            const list = [
              { id: 'u1', name: 'Ada' },
              { id: 'u2', name: 'Grace' }
            ];
            const res = fn(list);
            return res.byId['u1'].name === 'Ada' && res.byId['u2'].name === 'Grace' && res.allIds.length === 2 && res.allIds[0] === 'u1';
          }
        }
      ],
      hints: [
        'Use reduce to build byId map, and map for allIds.'
      ],
      checklist: [
        'Indexed items by ID in byId',
        'Preserved order in allIds array'
      ],
      revisionSummary: 'Normalize relational state ({ byId, allIds }) to enable O(1) lookups and eliminate duplicate data bugs.'
    },
    {
      id: 'p7-l14',
      slug: 'avoiding-duplicated-state-single-source',
      title: 'Avoiding Duplicated State: Single Source of Truth',
      prerequisites: ['p2-l3', 'p7-l13'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify redundant state variables that duplicate existing data.', 'Store IDs or references rather than full cloned objects.', 'Maintain a strict Single Source of Truth.'],
      explanation: 'One of the most frequent bugs in React is "State Duplication". For example, storing both `items: [...]` AND `selectedItem: { ... }` in state. If you update an item in `items`, `selectedItem` remains stuck with old data! The solution is storing only the ID: `selectedId: "item-1"`, and deriving `selectedItem = items.find(i => i.id === selectedId)` during render.',
      whyItExists: 'Eliminates out-of-sync state bugs and guarantees data integrity.',
      syntaxRules: 'Store the identifier (selectedId), not the whole object (selectedItem).',
      codeExample: `// ANTI-PATTERN: Duplicated state object\n// const [items, setItems] = useState([...]);\n// const [selectedItem, setSelectedItem] = useState(null); // DUPLICATED!\n\n// CLEAN: Single Source of Truth\nfunction SelectionManager({ items }) {\n  const [selectedId, setSelectedId] = useState(null); // Store only ID!\n\n  // Derive full object on the fly during render!\n  const selectedItem = items.find(i => i.id === selectedId) ?? null;\n\n  return (\n    <div>\n      <ItemList items={items} onSelect={setSelectedId} />\n      {selectedItem && <DetailCard item={selectedItem} />}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 6: Stores only selectedId primitive.',
        'Line 9: selectedItem is derived during render; if items array changes, selectedItem is guaranteed to be 100% up to date!'
      ],
      expectedBehavior: 'Editing an item updates both the list and the detail card simultaneously with zero sync effects.',
      commonMistakes: ['Storing cloned objects in selectedItem and trying to sync them with useEffect.', 'Storing derived counts in separate state variables.'],
      practiceLevels: {
        levelA: 'Refactor selectedUser object state to selectedUserId string state.',
        levelB: 'Derive active tab object from activeTabKey string.',
        levelC: 'Audit an application store to eliminate duplicate entity objects.'
      },
      debuggingChallenge: {
        brokenCode: `function EditItem({ item }) {\n  const [draft, setDraft] = useState(item); // Stuck on initial item!\n}`,
        problem: 'Duplicating props into state prevents updates when item changes.',
        fix: 'Pass key={item.id} to component to reset state when item changes, or derive directly.'
      },
      conceptualQuestion: {
        question: 'Why should you store `selectedId` in state instead of `selectedItem` object?',
        options: [
          'Because numbers take less memory than objects.',
          'Storing the full object duplicates state; if the item is updated in the list, `selectedItem` remains stale. Storing only `selectedId` allows deriving the fresh item during render, ensuring a Single Source of Truth.',
          'React cannot store objects in useState.',
          'It is a Vite rule.'
        ],
        correctIndex: 1,
        explanation: 'Storing only the ID guarantees that whenever the main item changes, the selected item reflects the update immediately.'
      },
      codeReadingQuestion: {
        snippet: `const activeItem = items.find(i => i.id === activeId);`,
        question: 'Is activeItem stored state or derived state?',
        answer: 'Derived state, computed during render from items and activeId.'
      },
      starterCode: `// Assignment: Implement auditStateDuplication\n// Audit state descriptors for duplication anti-patterns:\n// auditStateDuplication(stateKeys)\n// stateKeys: string[] (e.g. ['items', 'selectedItem', 'selectedId', 'totalCount', 'filter'])\n// If keys contain BOTH an array/list AND a 'selectedItem' object instead of 'selectedId' -> flag error!\n// If keys contain BOTH 'items' AND 'totalCount' -> flag error: 'totalCount should be derived from items.length'\n// Return: { isClean: boolean, warnings: string[] }\n\nexport function auditStateDuplication(stateKeys) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Detects duplicated selectedItem and redundant totalCount',
          run: (fn) => {
            const keys = ['items', 'selectedItem', 'totalCount'];
            const res = fn(keys);
            return res.isClean === false && res.warnings.length === 2;
          }
        },
        {
          name: 'Approves clean state using selectedId',
          run: (fn) => {
            const keys = ['items', 'selectedId', 'filter'];
            return fn(keys).isClean === true;
          }
        }
      ],
      hints: [
        'Check keys.includes("selectedItem") and keys.includes("totalCount").'
      ],
      checklist: [
        'Flagged selectedItem duplication',
        'Flagged redundant derived counts',
        'Approved single source of truth'
      ],
      revisionSummary: 'Never duplicate state; store IDs (selectedId) and derive full objects and counts during render.'
    },
    {
      id: 'p7-l15',
      slug: 'selecting-appropriate-state-solution',
      title: 'Selecting an Appropriate State Solution: The Decision Matrix',
      prerequisites: ['p7-l3', 'p7-l5', 'p7-l8', 'p6-l13'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the definitive decision matrix for React state management.', 'Choose accurately between useState, URL state, Context, Zustand, TanStack Query, and Redux Toolkit.', 'Defend architectural decisions in senior engineering interviews.'],
      explanation: 'Every senior engineer must know which tool to choose for which job: 1. Server Data (APIs, caching, deduplication) -> TanStack Query or RTK Query. 2. Shareable Filters / Tabs / Pages -> URL Search Params (React Router). 3. Complex Global Client State (cart, modals, player) -> Zustand (clean, lightweight) or Redux Toolkit (large enterprise teams). 4. Low-Frequency Global Configuration (theme, auth) -> React Context. 5. Local UI Interactions -> useState / useReducer.',
      whyItExists: 'Prevents over-engineering with heavyweight tools where simple primitives suffice.',
      syntaxRules: 'Do not use Redux for server caching (use TanStack Query). Do not use global stores for local form inputs (use useState).',
      codeExample: `// The Senior Engineer State Decision Matrix:\n// - Server Cache -> TanStack Query (useQuery)\n// - Shareable State -> URL Search Params (useSearchParams)\n// - Global Client State -> Zustand (useStore)\n// - Theme / Localization -> React Context (useTheme)\n// - Component UI Memory -> useState / useReducer`,
      lineByLine: [
        'Clear, unambiguous boundaries for each state category.',
        'Prevents architectural debt and keeps codebases maintainable.'
      ],
      expectedBehavior: 'Each piece of data is stored in the optimal tool designed specifically for its requirements.',
      commonMistakes: ['Using Redux to store API cache (writing 50 lines of thunks instead of 3 lines of TanStack Query).', 'Using Context for high-frequency stores, freezing the UI.'],
      practiceLevels: {
        levelA: 'Categorize 5 features into their optimal state tool.',
        levelB: 'Refactor an app using Redux for API cache to use TanStack Query.',
        levelC: 'Defend a state management architecture proposal in a mock architectural review.'
      },
      debuggingChallenge: {
        brokenCode: `// Architecture proposal: "We will use Redux Toolkit for everything: API caching, form input keystrokes, and modal open states."`,
        problem: 'Over-engineering; violates separation of concerns between server cache, local UI, and global state.',
        fix: 'Use TanStack Query for server cache, useState for form inputs, and Zustand/Context for global state.'
      },
      conceptualQuestion: {
        question: 'Which tool is best suited for managing Server State (caching, background refetching, deduplicating API requests)?',
        options: [
          'Plain useState with useEffect.',
          'TanStack Query (or RTK Query), because they are purpose-built for caching, stale-time invalidation, and async lifecycles.',
          'CSS Modules.',
          'BrowserRouter.'
        ],
        correctIndex: 1,
        explanation: 'TanStack Query is purpose-built for server data; global stores like Redux/Zustand are designed for client state.'
      },
      codeReadingQuestion: {
        snippet: `// What is the recommended global client state manager for modern React apps?`,
        question: 'Which library is currently recommended by most senior React engineers for client-side global state?',
        answer: 'Zustand, due to its minimal boilerplate, 1kB footprint, and provider-free architecture.'
      },
      starterCode: `// Assignment: Implement recommendStateTool\n// Architectural state selector decision engine:\n// recommendStateTool(problemStatement)\n// 1. 'API_DATA_CACHING' -> 'TanStack Query'\n// 2. 'SHAREABLE_SEARCH_FILTERS' -> 'URL Search Params (useSearchParams)'\n// 3. 'GLOBAL_SHOPPING_CART' -> 'Zustand'\n// 4. 'DARK_MODE_THEME' -> 'React Context'\n// 5. 'MODAL_OPEN_TOGGLE' -> 'useState'\n// Return: { tool: string, justification: string }\n\nexport function recommendStateTool(problemStatement) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Recommends TanStack Query for API caching',
          run: (fn) => {
            const res = fn('API_DATA_CACHING');
            return res.tool === 'TanStack Query';
          }
        },
        {
          name: 'Recommends URL search params for shareable filters',
          run: (fn) => {
            const res = fn('SHAREABLE_SEARCH_FILTERS');
            return res.tool.includes('useSearchParams');
          }
        },
        {
          name: 'Recommends Zustand for global cart',
          run: (fn) => {
            const res = fn('GLOBAL_SHOPPING_CART');
            return res.tool === 'Zustand';
          }
        }
      ],
      hints: [
        'Map each problemStatement keyword to its designated architectural tool.'
      ],
      checklist: [
        'Assigned TanStack Query for server cache',
        'Assigned URL params for shareable filters',
        'Assigned Zustand for global client state',
        'Assigned Context for theme and useState for local UI'
      ],
      revisionSummary: 'Use TanStack Query for server cache, URL for shareable filters, Zustand for global client state, and useState for local UI.'
    }
  ]
};
