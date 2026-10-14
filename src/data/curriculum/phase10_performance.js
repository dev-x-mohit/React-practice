// Phase 10: Performance and Optimization
export const phase10 = {
  id: 'phase-10',
  title: 'Phase 10 — Performance and Optimization',
  description: 'Master production-grade React performance: React Profiler flamegraphs, diagnosing unnecessary re-renders, composition patterns (moving state down & children as props), React.memo and custom comparators, useCallback/useMemo trade-offs, lazy loading with Suspense, list virtualization, debouncing/throttling, memory leak prevention, and Core Web Vitals (INP, LCP, CLS).',
  icon: 'Zap',
  badge: 'Performance',
  estimatedHours: 15,
  lessons: [
    {
      id: 'p10-l1',
      slug: 'react-profiler-flamegraphs',
      title: 'Measuring Performance: React DevTools Profiler',
      prerequisites: ['p4-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Record and analyze rendering sessions using React DevTools Profiler.',
        'Interpret Flamegraph and Ranked views to spot slow render passes.',
        'Identify "Why did this render?" explanations in commit logs.'
      ],
      explanation: 'Never optimize blindly. The React DevTools Profiler measures how often components render and the "cost" (duration in milliseconds) of each render. The Flamegraph view visualizes the component hierarchy for a specific commit, with bar colors indicating render duration (yellow/orange = heavy, blue/gray = light). The Ranked view orders components by actual render time, highlighting immediate optimization targets.',
      whyItExists: 'Prevents premature optimization by directing engineering effort toward components that actually cause frame drops.',
      syntaxRules: 'Use React DevTools Profiler tab in browser or `<Profiler id="Name" onRender={callback}>` programmatically.',
      codeExample: `import React, { Profiler } from 'react';

function onRenderCallback(
  id, // the "id" prop of the Profiler tree that just committed
  phase, // "mount" or "update"
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime // when React committed this update
) {
  if (actualDuration > 16) {
    console.warn(\`Slow render in \${id} (\${phase}): \${actualDuration.toFixed(2)}ms\`);
  }
}

export function App() {
  return (
    <Profiler id="ProductList" onRender={onRenderCallback}>
      <ProductList />
    </Profiler>
  );
}`,
      lineByLine: [
        'Line 1: Profiler is imported directly from "react".',
        'Line 10: 16ms corresponds to dropping below 60 frames per second (1000ms / 60 ≈ 16.6ms).',
        'Line 16: Wraps the subtree to monitor its real-world commit durations.'
      ],
      expectedBehavior: 'Logs duration metrics whenever ProductList or its descendants re-render.',
      commonMistakes: [
        'Profiling in development mode only (React development mode is significantly slower due to extra checks; test production builds for real numbers).',
        'Optimizing a component that takes 0.2ms to render while ignoring one that takes 80ms.'
      ],
      practiceLevels: {
        levelA: 'Enable "Record why each component rendered" in React DevTools settings.',
        levelB: 'Wrap a complex filter list with <Profiler> and log renders taking > 10ms.',
        levelC: 'Analyze the Ranked chart to compare baseDuration vs actualDuration.'
      },
      debuggingChallenge: {
        brokenCode: `// Trying to benchmark:
const t0 = performance.now();
<SlowComponent />
const t1 = performance.now(); // Always returns 0ms difference!`,
        problem: 'JSX elements `<SlowComponent />` are plain JS objects created in microseconds; rendering happens asynchronously later during React\'s commit phase.',
        fix: 'Use the `<Profiler>` component or React DevTools Profiler to measure actual render and commit duration.'
      },
      conceptualQuestion: {
        question: 'What is the difference between `actualDuration` and `baseDuration` in React Profiler?',
        options: [
          'actualDuration is for mobile; baseDuration is for desktop.',
          'actualDuration measures time spent rendering the current update (with memoization benefits); baseDuration measures the worst-case cost of rendering the entire subtree from scratch.',
          'actualDuration is network fetch time; baseDuration is JS parse time.',
          'There is no difference.'
        ],
        correctIndex: 1,
        explanation: 'actualDuration reflects current render speed (factoring in memoization), while baseDuration estimates worst-case cost without memoization.'
      },
      codeReadingQuestion: {
        snippet: `<Profiler id="Feed" onRender={(id, phase, duration) => console.log(phase, duration)} />`,
        question: 'What will `phase` output on the first render vs subsequent state updates?',
        answer: '"mount" on the first render, and "update" on subsequent renders.'
      },
      starterCode: `// Assignment: Implement aggregateProfilerCommits
// Build a metric aggregator for React Profiler logs:
// aggregateProfilerCommits(commits)
// - commits: array of { id: string, phase: 'mount'|'update', actualDuration: number }
// Returns an object:
// {
//   totalCommits: number,
//   avgUpdateDuration: number (rounded to 2 decimal places),
//   slowCommits: number (commits where actualDuration > 16.6)
// }

export function aggregateProfilerCommits(commits) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Computes averages and identifies slow commits',
          run: (fn) => {
            const data = [
              { id: 'Feed', phase: 'mount', actualDuration: 25.4 },
              { id: 'Feed', phase: 'update', actualDuration: 5.2 },
              { id: 'Feed', phase: 'update', actualDuration: 18.0 }
            ];
            const res = fn(data);
            return res.totalCommits === 3 && res.avgUpdateDuration === 11.6 && res.slowCommits === 2;
          }
        },
        {
          name: 'Handles empty commits list safely',
          run: (fn) => {
            const res = fn([]);
            return res.totalCommits === 0 && res.avgUpdateDuration === 0 && res.slowCommits === 0;
          }
        }
      ],
      solution: `export function aggregateProfilerCommits(commits) {
  if (!commits || commits.length === 0) {
    return { totalCommits: 0, avgUpdateDuration: 0, slowCommits: 0 };
  }
  const updates = commits.filter(c => c.phase === 'update');
  const totalUpdateDuration = updates.reduce((acc, c) => acc + c.actualDuration, 0);
  const avg = updates.length > 0 ? totalUpdateDuration / updates.length : 0;
  const slowCount = commits.filter(c => c.actualDuration > 16.6).length;

  return {
    totalCommits: commits.length,
    avgUpdateDuration: Number(avg.toFixed(2)),
    slowCommits: slowCount
  };
}`,
      hints: [
        'Filter for phase === "update" to calculate average update duration.',
        'Count all commits with actualDuration > 16.6 as slowCommits.',
        'Use Number(val.toFixed(2)) to round.'
      ]
    },
    {
      id: 'p10-l2',
      slug: 'why-components-re-render',
      title: 'The 4 Triggers of Component Re-Renders',
      prerequisites: ['p1-l3', 'p4-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Identify the exact 4 causes of a component re-render in React.',
        'Understand the default "parent re-render cascade" behavior.',
        'Dispel common myths about prop changes vs parent renders.'
      ],
      explanation: 'In React, a component re-renders for exactly 4 reasons:\n1. **State Change**: Calling `setState` with a new value triggers a re-render of that component.\n2. **Parent Re-Render**: By default, when a parent component renders, EVERY child component in its JSX tree re-renders recursively, even if its props did NOT change!\n3. **Context Change**: A change to a Context provider\'s value re-renders all components calling `useContext` for that context.\n4. **Hooks Change**: A custom hook inside the component triggered a state change.',
      whyItExists: 'React\'s default assumption is safety over premature caching: re-rendering pure virtual DOM nodes is fast, so React renders children unless instructed otherwise.',
      syntaxRules: 'Understanding React\'s mental model: Component render !== Real DOM repaint. Re-rendering is just executing the function.',
      codeExample: `function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment: {count}</button>
      {/* ExpensiveChild re-renders EVERY time count increments, 
          even though it receives NO props! */}
      <ExpensiveChild />
    </div>
  );
}

function ExpensiveChild() {
  console.log('ExpensiveChild rendered!');
  return <div className="heavy-tree">Static UI</div>;
}`,
      lineByLine: [
        'Line 2: Parent state updates when button is clicked.',
        'Line 8: ExpensiveChild has no props, but re-renders solely because its parent re-rendered.',
        'Line 13: Console prints on every click.'
      ],
      expectedBehavior: 'Every parent render cascades down to all nested unmemoized child components.',
      commonMistakes: [
        'Believing that a child only re-renders when its props change (False! By default, parent renders always trigger child renders).',
        'Confusing virtual DOM re-render with real DOM mutations (React will not mutate DOM if the output JSX is identical).'
      ],
      practiceLevels: {
        levelA: 'Add console.log inside three nested components to observe the render cascade.',
        levelB: 'Demonstrate that passing unchanged primitive props does not stop default child rendering.',
        levelC: 'Contrast rendering behavior with React.memo.'
      },
      debuggingChallenge: {
        brokenCode: `function Dashboard() {\n  const [time, setTime] = useState(Date.now());\n  useEffect(() => {\n    const id = setInterval(() => setTime(Date.now()), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <div><Clock time={time} /><HugeDataGrid /></div>;\n}`,
        problem: 'HugeDataGrid re-renders every 1 second because Dashboard updates its time state.',
        fix: 'Isolate time state into a standalone <LiveClock /> component or wrap HugeDataGrid in React.memo.'
      },
      conceptualQuestion: {
        question: 'If component `<Child />` has no props and no internal state, will it re-render when its parent re-renders?',
        options: [
          'No, React automatically skips components with no props.',
          'Yes, by default every child in a re-rendering parent\'s JSX tree is re-evaluated.',
          'Only if it has a ref attached.',
          'Only in React 18 and older.'
        ],
        correctIndex: 1,
        explanation: 'In React\'s default rendering model, when a parent renders, all children in its JSX tree re-render recursively regardless of props.'
      },
      codeReadingQuestion: {
        snippet: `function Wrapper() {\n  const [val, setVal] = useState(0);\n  return <button onClick={() => setVal(0)}>Set to 0</button>;\n}`,
        question: 'If val is already 0 and you click the button, will Wrapper re-render?',
        answer: 'React will execute Object.is(0, 0) check and bailout of rendering without updating the DOM.'
      },
      starterCode: `// Assignment: Implement simulateRenderTree
// Simulate React's default cascade rendering algorithm:
// simulateRenderTree(tree, updatedNodeId)
// - tree: object { id: string, children: tree[] }
// - updatedNodeId: string id of component whose state changed
// When updatedNodeId changes, it re-renders AND ALL its recursive descendants re-render.
// Returns an array of component IDs that re-rendered during this update.

export function simulateRenderTree(tree, updatedNodeId) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Cascades render down to all descendants of updated node',
          run: (fn) => {
            const tree = {
              id: 'App',
              children: [
                {
                  id: 'Sidebar',
                  children: [{ id: 'Menu', children: [] }]
                },
                {
                  id: 'Main',
                  children: [{ id: 'Feed', children: [] }, { id: 'Ad', children: [] }]
                }
              ]
            };
            const rendered = fn(tree, 'Main');
            return rendered.length === 3 && rendered.includes('Main') && rendered.includes('Feed') && rendered.includes('Ad') && !rendered.includes('Sidebar');
          }
        },
        {
          name: 'Re-renders entire tree if root updates',
          run: (fn) => {
            const tree = {
              id: 'Root',
              children: [{ id: 'A', children: [] }]
            };
            const rendered = fn(tree, 'Root');
            return rendered.length === 2 && rendered.includes('Root') && rendered.includes('A');
          }
        }
      ],
      solution: `export function simulateRenderTree(tree, updatedNodeId) {
  const rendered = [];

  function collectAll(node) {
    rendered.push(node.id);
    if (node.children) {
      for (const child of node.children) {
        collectAll(child);
      }
    }
  }

  function findAndRender(node) {
    if (node.id === updatedNodeId) {
      collectAll(node);
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (findAndRender(child)) return true;
      }
    }
    return false;
  }

  findAndRender(tree);
  return rendered;
}`,
      hints: [
        'Traverse the tree to locate updatedNodeId.',
        'Once found, recursively gather the updated node and all its child IDs.',
        'Return the collected array of IDs.'
      ]
    },
    {
      id: 'p10-l3',
      slug: 'fixing-renders-with-composition',
      title: 'Fixing Re-Renders with Component Composition (No memo required!)',
      prerequisites: ['p10-l2', 'p1-l5'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Move rapidly-changing state down to isolated leaf components.',
        'Lift expensive components up and pass them as `children` props.',
        'Explain why passing an element as `children` avoids re-rendering when the parent updates.'
      ],
      explanation: 'Before reaching for `React.memo`, professional React engineers use **Composition**. \n\n1. **Move State Down**: If only a modal or dropdown cares about `isOpen`, don\'t put `isOpen` in the root App. Move it down into `<CollapsibleSection>`.\n2. **Pass Content as `children`**: If a container needs state (e.g. scroll position, background color toggle), define it to accept `children`. When `<ScrollContainer>` re-renders, its `children` prop was created by its outer parent and has NOT changed reference, so React skips re-rendering the children!',
      whyItExists: 'Achieves massive performance gains with 0 memory overhead, cleaner code architecture, and without tricky memo dependency arrays.',
      syntaxRules: 'Wrap dynamic state in a container: `<ColorPicker>{/* ExpensiveTree doesn\'t re-render */ <ExpensiveTree />}</ColorPicker>`.',
      codeExample: `// Anti-pattern: ExpensiveTree re-renders on every scroll
function BadPage() {
  const [scrollY, setScrollY] = useState(0);
  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <Header scrollY={scrollY} />
      <ExpensiveTree />
    </div>
  );
}

// Composition Pattern: Pass ExpensiveTree as children!
function ScrollTracker({ children }) {
  const [scrollY, setScrollY] = useState(0);
  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <Header scrollY={scrollY} />
      {children} {/* ExpensiveTree reference is preserved! */}
    </div>
  );
}

export function GoodPage() {
  return (
    <ScrollTracker>
      <ExpensiveTree />
    </ScrollTracker>
  );
}`,
      lineByLine: [
        'Line 13: ScrollTracker owns the rapidly changing scrollY state.',
        'Line 17: {children} is passed into ScrollTracker as a prop from GoodPage.',
        'Line 24: GoodPage does NOT re-render on scroll, so the <ExpensiveTree /> JSX element object retains the identical reference, and React bails out of re-rendering it.'
      ],
      expectedBehavior: 'ExpensiveTree never re-renders when ScrollTracker updates.',
      commonMistakes: [
        'Wrapping everything in React.memo before considering simple component extraction.',
        'Passing JSX inline as a new arrow function or fresh element created inside the stateful parent.'
      ],
      practiceLevels: {
        levelA: 'Refactor an expandable card so the toggle state is encapsulated inside the card.',
        levelB: 'Implement an active mouse tracker container passing static layout as children.',
        levelC: 'Measure render count reduction using React DevTools.'
      },
      debuggingChallenge: {
        brokenCode: `function ModalLayout() {\n  const [isOpen, setIsOpen] = useState(false);\n  return (\n    <div>\n      <button onClick={() => setIsOpen(true)}>Open</button>\n      <HeavyAnalyticsDashboard />\n      {isOpen && <ModalContent />}\n    </div>\n  );\n}`,
        problem: 'HeavyAnalyticsDashboard re-renders every time the modal opens or closes.',
        fix: 'Extract the button and modal into `<ModalButton>` or pass `<HeavyAnalyticsDashboard>` as `children` to ModalLayout.'
      },
      conceptualQuestion: {
        question: 'Why does passing `<ExpensiveChild />` as `children` to a stateful component prevent it from re-rendering when that stateful component updates?',
        options: [
          'Because children props are automatically placed in web workers.',
          'The `children` prop was instantiated in the outer parent. When the stateful wrapper re-renders, the `children` element object has the same reference (`prevProps.children === nextProps.children`), allowing React to bail out of rendering.',
          'React forbids children from ever re-rendering.',
          'Because children props bypass the virtual DOM.'
        ],
        correctIndex: 1,
        explanation: 'React compares element references. Since the outer parent didn\'t re-render, `children` is referentially equal, and React skips re-rendering it.'
      },
      codeReadingQuestion: {
        snippet: `function Counter({ children }) {\n  const [c, setC] = useState(0);\n  return <button onClick={() => setC(c + 1)}>{c}{children}</button>;\n}\n<Counter><span className="dot" /></Counter>`,
        question: 'Does `<span className="dot" />` re-render when the button is clicked?',
        answer: 'No. The span element was created outside Counter and keeps its reference across Counter\'s state updates.'
      },
      starterCode: `// Assignment: Implement testElementBailout
// Simulate React's element reference bailout check:
// testElementBailout(prevProps, nextProps)
// If prevProps.children === nextProps.children (strict reference equality)
// and all other prop keys in nextProps equal prevProps (shallow check),
// returns { canBailout: true, reason: 'Referential equality' }
// Otherwise returns { canBailout: false, changedKeys: string[] }

export function testElementBailout(prevProps, nextProps) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Bails out when children reference is identical and props match',
          run: (fn) => {
            const sharedChild = { type: 'div' };
            const p1 = { title: 'App', children: sharedChild };
            const p2 = { title: 'App', children: sharedChild };
            const res = fn(p1, p2);
            return res.canBailout === true;
          }
        },
        {
          name: 'Fails bailout when child reference is newly created',
          run: (fn) => {
            const p1 = { children: { type: 'div' } };
            const p2 = { children: { type: 'div' } }; // different object ref!
            const res = fn(p1, p2);
            return res.canBailout === false && res.changedKeys.includes('children');
          }
        }
      ],
      solution: `export function testElementBailout(prevProps, nextProps) {
  const allKeys = Array.from(new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]));
  const changedKeys = [];
  for (const k of allKeys) {
    if (prevProps[k] !== nextProps[k]) {
      changedKeys.push(k);
    }
  }
  if (changedKeys.length === 0) {
    return { canBailout: true, reason: 'Referential equality' };
  }
  return { canBailout: false, changedKeys };
}`,
      hints: [
        'Collect all unique keys from prevProps and nextProps.',
        'Compare prevProps[k] !== nextProps[k] with strict inequality !==.',
        'If changedKeys is empty, return { canBailout: true, reason: "Referential equality" }.'
      ]
    },
    {
      id: 'p10-l4',
      slug: 'react-memo-shallow-comparison',
      title: 'React.memo: Shallow Comparison and When NOT to Use It',
      prerequisites: ['p10-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Wrap functional components in React.memo to skip renders when props are unchanged.',
        'Understand shallow equality (`Object.is`) prop comparisons.',
        'Identify scenarios where React.memo is ineffective or adds negative overhead.'
      ],
      explanation: '`React.memo` is a higher-order component. When wrapped around a component (`const MemoComponent = React.memo(MyComponent)`), React renders the component and memoizes the result. On subsequent renders, React does a shallow comparison (`Object.is`) of each prop against the previous prop. If all props are identical, React reuses the previous render output entirely.\n\n**Warning**: If a prop is an inline object literal (`style={{ margin: 0 }}`) or inline arrow function (`onClick={() => doSomething()}`), a fresh reference is created on every parent render, completely breaking `React.memo`!',
      whyItExists: 'Skips heavy rendering computations when a component receives identical props frequently.',
      syntaxRules: '`const MemoizedComp = React.memo(Component);` or `export default React.memo(Component);`.',
      codeExample: `import React, { memo } from 'react';

interface RowProps {
  id: string;
  label: string;
  count: number;
}

// Without memo: Re-renders whenever ANY state in parent updates
// With memo: Only re-renders if id, label, or count changes value
export const TableRow = memo(function TableRow({ id, label, count }: RowProps) {
  console.log('Rendering row:', id);
  return (
    <div className="table-row">
      <span>{label}</span>
      <span>{count}</span>
    </div>
  );
});`,
      lineByLine: [
        'Line 9: memo() wraps the component definition.',
        'React compares prevProps.id === nextProps.id, prevProps.label === nextProps.label, and prevProps.count === nextProps.count.',
        'If all match, TableRow does not execute.'
      ],
      expectedBehavior: 'TableRow skips execution on parent renders when its props remain unchanged.',
      commonMistakes: [
        'Passing inline anonymous functions `<TableRow onSelect={() => handleSelect(id)} />`, which invalidates memo on every render.',
        'Wrapping tiny components like `<Button>{label}</Button>` in memo (comparison overhead costs more than the render itself!).'
      ],
      practiceLevels: {
        levelA: 'Wrap a chart component in React.memo and verify it skips renders when unrelated sibling state changes.',
        levelB: 'Examine why passing an inline empty array `tags={[]}` causes memo to fail.',
        levelC: 'Profile the application before and after memoization.'
      },
      debuggingChallenge: {
        brokenCode: `const MemoUser = React.memo(UserCard);\n// In parent:\n<MemoUser user={{ name: 'Alice' }} />`,
        problem: '`{ name: "Alice" }` creates a new object in memory on every parent render. `{ name: "Alice" } !== { name: "Alice" }` causes memo to always fail.',
        fix: 'Store user in state or memoize with useMemo.'
      },
      conceptualQuestion: {
        question: 'Under what condition does `React.memo` skip re-rendering a component?',
        options: [
          'Whenever the component has no children.',
          'When every prop in `nextProps` is strictly equal (`Object.is`) to the corresponding prop in `prevProps`.',
          'Only when all props are strings.',
          'Whenever the DOM has not changed.'
        ],
        correctIndex: 1,
        explanation: 'React.memo performs shallow comparison using `Object.is`. If all keys match, render is skipped.'
      },
      codeReadingQuestion: {
        snippet: `const MemoComp = React.memo(Comp);\n// Render 1:\n<MemoComp config={[]} />\n// Render 2:\n<MemoComp config={[]} />`,
        question: 'Does MemoComp re-render on Render 2? Why?',
        answer: 'Yes! `[] !== []` because they are two distinct array instances in memory, so shallow comparison fails.'
      },
      starterCode: `// Assignment: Implement shallowPropsEqual
// Simulate React.memo's default prop comparison algorithm:
// shallowPropsEqual(prevProps, nextProps)
// Returns true if:
// 1. Both objects have the exact same number of keys.
// 2. For every key k in prevProps, Object.is(prevProps[k], nextProps[k]) is true.
// Returns false otherwise.

export function shallowPropsEqual(prevProps, nextProps) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Returns true for identical primitives and shared references',
          run: (fn) => {
            const arr = [1, 2];
            const p1 = { a: 1, b: 'test', c: arr };
            const p2 = { a: 1, b: 'test', c: arr };
            return fn(p1, p2) === true;
          }
        },
        {
          name: 'Returns false for different object instances or missing keys',
          run: (fn) => {
            const p1 = { a: 1, arr: [1] };
            const p2 = { a: 1, arr: [1] };
            return fn(p1, p2) === false;
          }
        },
        {
          name: 'Correctly compares NaN using Object.is semantics',
          run: (fn) => {
            return fn({ val: NaN }, { val: NaN }) === true;
          }
        }
      ],
      solution: `export function shallowPropsEqual(prevProps, nextProps) {
  if (Object.is(prevProps, nextProps)) return true;
  if (typeof prevProps !== 'object' || prevProps === null || typeof nextProps !== 'object' || nextProps === null) {
    return false;
  }
  const keysA = Object.keys(prevProps);
  const keysB = Object.keys(nextProps);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(nextProps, key) || !Object.is(prevProps[key], nextProps[key])) {
      return false;
    }
  }
  return true;
}`,
      hints: [
        'Check Object.is(prevProps, nextProps) first.',
        'Compare Object.keys lengths.',
        'Loop through keys and check Object.is(prevProps[key], nextProps[key]).'
      ]
    },
    {
      id: 'p10-l5',
      slug: 'react-memo-custom-comparators',
      title: 'Custom Comparators in React.memo: `arePropsEqual`',
      prerequisites: ['p10-l4'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Pass a custom `arePropsEqual(prevProps, nextProps)` comparator to React.memo.',
        'Understand that `arePropsEqual` returns `true` to SKIP render (opposite of shouldComponentUpdate).',
        'Avoid deep equality traps on massive data structures.'
      ],
      explanation: 'Sometimes shallow comparison fails because a parent passes a complex object or callback you don\'t control. You can provide a custom comparison function as the second argument to `React.memo(Component, arePropsEqual)`. \n\n**CRITICAL GOTCHA**: Unlike class `shouldComponentUpdate` (which returns true to render), `arePropsEqual` returns `true` if props are equal (meaning **SKIP** render) and `false` to **re-render**.',
      whyItExists: 'Allows selective re-renders based on specific primary IDs or timestamps rather than shallow object references.',
      syntaxRules: '`React.memo(Component, (prevProps, nextProps) => boolean);` return true = SKIP, false = RE-RENDER.',
      codeExample: `import React, { memo } from 'react';

interface MessageItemProps {
  message: { id: string; text: string; editedAt: number };
  onDelete: (id: string) => void;
}

function areMessagesEqual(prev: MessageItemProps, next: MessageItemProps) {
  // Only re-render if the message ID or edit timestamp changed!
  // Ignores changes to onDelete reference if parent didn't use useCallback.
  return (
    prev.message.id === next.message.id &&
    prev.message.editedAt === next.message.editedAt
  );
}

export const MessageItem = memo(function MessageItem({ message, onDelete }: MessageItemProps) {
  return (
    <div className="message">
      <p>{message.text}</p>
      <button onClick={() => onDelete(message.id)}>Delete</button>
    </div>
  );
}, areMessagesEqual);`,
      lineByLine: [
        'Line 8: areMessagesEqual receives prevProps and nextProps.',
        'Line 11: Returns true if id and editedAt are identical, telling React to skip re-rendering.',
        'Line 18: Passes comparator as second argument to memo.'
      ],
      expectedBehavior: 'MessageItem will not re-render even if parent passes a fresh onDelete function reference on every render.',
      commonMistakes: [
        'Returning `false` when props are equal (causes continuous unnecessary rendering).',
        'Doing `JSON.stringify(prevProps) === JSON.stringify(nextProps)` (extremely slow; can freeze the main thread on large datasets!).',
        'Comparing complex functions or nested arrays with deep recursion.'
      ],
      practiceLevels: {
        levelA: 'Write an arePropsEqual function for a StockTicker component that only renders if ticker.price changed.',
        levelB: 'Compare array lengths before comparing items in a list view.',
        levelC: 'Measure performance difference between deep compare vs key-based compare.'
      },
      debuggingChallenge: {
        brokenCode: `const MemoCard = React.memo(Card, (prev, next) => {\n  return prev.id !== next.id; // Bug!\n});`,
        problem: 'The author inverted the logic: returning true when IDs are different tells React that props are equal, skipping render when it SHOULD render!',
        fix: 'Return `prev.id === next.id`.'
      },
      conceptualQuestion: {
        question: 'What does returning `true` from an `arePropsEqual` comparator function tell React to do?',
        options: [
          'Force a re-render immediately.',
          'Skip re-rendering the component because props are deemed equal.',
          'Unmount the component.',
          'Re-mount the component with fresh state.'
        ],
        correctIndex: 1,
        explanation: '`arePropsEqual` returns true if props are equivalent, instructing React to reuse the previous render output and skip re-rendering.'
      },
      codeReadingQuestion: {
        snippet: `const MemoUser = React.memo(User, (prev, next) => prev.user.id === next.user.id);`,
        question: 'If `next.user.name` is edited from "Alice" to "Alicia" with the same ID, will MemoUser update visually?',
        answer: 'No! The comparator only checks ID, so the visual update for name will be blocked.'
      },
      starterCode: `// Assignment: Implement createCustomMemoRunner
// Simulate React.memo with a custom comparator:
// createCustomMemoRunner(renderFn, arePropsEqual)
// Returns a runner object:
// - render(props):
//   * First call: executes renderFn(props), records 1 render
//   * Subsequent calls: executes arePropsEqual(prevProps, props).
//     If true: returns cached result without calling renderFn
//     If false: executes renderFn(props), updates cache, increments render count
// - getRenderCount(): returns total times renderFn was executed

export function createCustomMemoRunner(renderFn, arePropsEqual) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Skips render when comparator returns true',
          run: (fn) => {
            const runner = fn(p => 'Rendered: ' + p.name, (p1, p2) => p1.id === p2.id);
            const r1 = runner.render({ id: 1, name: 'Alice' });
            const r2 = runner.render({ id: 1, name: 'Alicia' }); // Same ID!
            return runner.getRenderCount() === 1 && r1 === 'Rendered: Alice' && r2 === 'Rendered: Alice';
          }
        },
        {
          name: 'Re-renders when comparator returns false',
          run: (fn) => {
            const runner = fn(p => p.val, (p1, p2) => p1.val === p2.val);
            runner.render({ val: 10 });
            runner.render({ val: 20 });
            return runner.getRenderCount() === 2;
          }
        }
      ],
      solution: `export function createCustomMemoRunner(renderFn, arePropsEqual) {
              let renderCount = 0;
              let prevProps = null;
              let cachedOutput = null;

              return {
                render(nextProps) {
                  if (prevProps !== null && arePropsEqual(prevProps, nextProps)) {
                    return cachedOutput;
                  }
                  prevProps = nextProps;
                  cachedOutput = renderFn(nextProps);
                  renderCount++;
                  return cachedOutput;
                },
                getRenderCount: () => renderCount
              };
            } `,
      hints: [
        'Track prevProps, cachedOutput, and renderCount.',
        'If prevProps is not null and arePropsEqual(prevProps, nextProps) is true, return cachedOutput.',
        'Otherwise execute renderFn, cache the result, increment count, and return.'
      ]
    },
    {
      id: 'p10-l6',
      slug: 'usecallback-referential-stability',
      title: 'useCallback Deep Dive: Referential Stability',
      prerequisites: ['p3-l2', 'p10-l4'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand referential equality of JavaScript functions across component renders.',
        'Pair `useCallback` with `React.memo` child components.',
        'Avoid creating `useCallback` closures with stale state.'
      ],
      explanation: 'In JavaScript, functions are objects: `(() => { }) !== (() => { })`. Every time a parent component re-renders, any regular function defined inside it is re-created with a brand-new memory reference. If you pass this function as a prop to a `React.memo` child, the child\'s shallow comparison sees a changed prop and re-renders anyway!\n\n`useCallback(fn, deps)` returns a cached version of `fn` that preserves the exact same function reference between renders until its dependencies change.',
      whyItExists: 'Maintains referential stability for callback props so `React.memo` children can successfully skip re-rendering.',
      syntaxRules: '`const stableFn = useCallback(() => { doSomething(a); }, [a]); `.',
      codeExample: `import React, { useState, useCallback, memo } from 'react';

            // Memoized child
            const DeleteButton = memo(function DeleteButton({ onDelete }: { onDelete: () => void }) {
              console.log('DeleteButton rendered');
              return <button onClick={onDelete}>Delete</button>;
            });

            export function Parent() {
              const [text, setText] = useState('');
              const [items, setItems] = useState(['A', 'B', 'C']);

              // Without useCallback: Fresh function reference created on every keystroke in 'text'!
              // With useCallback: Reference is stable, DeleteButton never re-renders while typing!
              const handleDelete = useCallback(() => {
                setItems(prev => prev.slice(0, -1));
              }, []); // [] deps because we use functional updater prev => ...

              return (
                <div>
                  <input value={text} onChange={e => setText(e.target.value)} />
                  <DeleteButton onDelete={handleDelete} />
                </div>
              );
            } `,
      lineByLine: [
        'Line 4: DeleteButton is wrapped in memo.',
        'Line 17: useCallback caches handleDelete.',
        'Line 18: setItems(prev => ...) needs no outer dependencies, so deps is empty [].',
        'Typing into <input> updates text, re-renders Parent, but DeleteButton skips rendering!'
      ],
      expectedBehavior: 'Typing in the input does not cause DeleteButton to re-render.',
      commonMistakes: [
        'Using `useCallback` on a function passed to a regular unmemoized DOM ` < button onClick = { ...} > ` (provides ZERO performance benefit; adds overhead).',
        'Omitting a state variable from the dependency array, causing a stale closure bug.'
      ],
      practiceLevels: {
        levelA: 'Wrap an item deletion handler in useCallback and verify referential equality across renders.',
        levelB: 'Use a functional state updater inside useCallback to eliminate state from dependencies.',
        levelC: 'Test what happens when a dependency changes: verify that reference updates appropriately.'
      },
      debuggingChallenge: {
        brokenCode: `const [count, setCount] = useState(0); \nconst handleClick = useCallback(() => {
            \n  console.log('Current count:', count); // Always prints 0!\n}, []);`,
              problem: 'handleClick closed over initial count (0) and deps array is empty `[]`, causing a stale closure.',
                fix: 'Add `[count]` to the dependency array or read state via ref if logging.'
            },
              conceptualQuestion: {
              question: 'When does wrapping a function in `useCallback` actually improve application performance?',
              options: [
                'Always, every function should be wrapped in useCallback.',
                'Only when the function is passed to an optimized child wrapped in `React.memo`, or used in a `useEffect` dependency array.',
                'Only when the function takes more than two arguments.',
                'Never, it is only for TypeScript type checking.'
              ],
              correctIndex: 1,
              explanation: 'useCallback does not make functions faster to execute. It only prevents re-renders of memoized child components or re-running effects dependent on function identity.'
            },
              codeReadingQuestion: {
              snippet: `const fn1 = () => 5;\nconst fn2 = () => 5;\nconsole.log(fn1 === fn2);`,
              question: 'What does this print to the console and why?',
              answer: '`false`. In JavaScript, every function declaration or arrow function creates a unique object reference in memory.'
            },
              starterCode: `// Assignment: Implement simulateCallbackHook
// Simulate React's useCallback caching mechanics:
// createCallbackHarness()
// Returns { use(callbackFn, deps) }
// On subsequent calls:
// - If deps are shallowly equal to previous deps: returns the PREVIOUS callbackFn reference
// - If deps changed: updates cached deps and returns the NEW callbackFn reference

export function createCallbackHarness() {
  // Your code here
}`,
              testCases: [
              {
                name: 'Returns same function instance when dependencies are unchanged',
                run: (fn) => {
                  const hook = fn();
                  const fn1 = () => 'first';
                  const fn2 = () => 'second';
                  const r1 = hook.use(fn1, [1, 'a']);
                  const r2 = hook.use(fn2, [1, 'a']); // Same deps!
                  return r1 === fn1 && r2 === fn1; // Preserved r1
                }
              },
              {
                name: 'Updates function instance when dependencies change',
                run: (fn) => {
                  const hook = fn();
                  const fn1 = () => 1;
                  const fn2 = () => 2;
                  const r1 = hook.use(fn1, [10]);
                  const r2 = hook.use(fn2, [20]); // Changed dep!
                  return r1 === fn1 && r2 === fn2;
                }
              }
            ],
              solution: `export function createCallbackHarness() {
  let prevCallback = null;
  let prevDeps = null;

  return {
    use(callback, deps) {
      if (prevDeps !== null && deps !== null && prevDeps.length === deps.length) {
        let match = true;
        for (let i = 0; i < deps.length; i++) {
          if (!Object.is(prevDeps[i], deps[i])) {
            match = false;
            break;
          }
        }
        if (match) return prevCallback;
      }
      prevCallback = callback;
      prevDeps = deps;
      return callback;
    }
  };
}`,
              hints: [
              'Store prevCallback and prevDeps.',
              'Compare each element in deps with prevDeps[i] using Object.is.',
              'If all match, return prevCallback; otherwise update and return callback.'
            ]
    },
    {
          id: 'p10-l7',
          slug: 'usememo-expensive-computations',
          title: 'useMemo Deep Dive: Expensive Computations and Object Stability',
          prerequisites: ['p3-l3', 'p10-l6'],
          estimatedDuration: '30 mins',
          difficulty: 'Intermediate',
          objectives: [
            'Memoize heavy computational results with `useMemo`.',
            'Preserve referential stability of objects and arrays passed to children.',
            'Benchmark computation cost to determine if useMemo is warranted.'
          ],
          explanation: '`useMemo` caches the result of a calculation between renders: `const value = useMemo(() => computeExpensive(a, b), [a, b])`. It serves two distinct purposes:\n1. **Expensive Calculations**: Skipping CPU-intensive operations (sorting 10,000 items, complex regex parsing, 3D math) when inputs haven\'t changed.\n2. **Referential Stability**: Preventing an object/array reference from changing on every render (`const filter = useMemo(() => ({ category, minPrice }), [category, minPrice])`), so child components wrapped in `React.memo` don\'t re-render.',
          whyItExists: 'Protects application frame rates from freezing during heavy math or filtering operations on large datasets.',
          syntaxRules: '`const cached = useMemo(() => calculateValue(deps), [deps]);`.',
          codeExample: `import React, { useState, useMemo } from 'react';

export function ProductCatalog({ products }) {
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Expensive calculation: filtering & sorting 5,000 products
  // Without useMemo: Re-runs 5,000-item filter when toggling darkMode!
  // With useMemo: Only re-runs when search or products change!
  const filteredProducts = useMemo(() => {
    console.log('Filtering catalog...');
    const query = search.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(query))
      .sort((a, b) => a.price - b.price);
  }, [products, search]);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <button onClick={() => setDarkMode(d => !d)}>Toggle Dark Mode</button>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <ProductList items={filteredProducts} />
    </div>
  );
}`,
          lineByLine: [
            'Line 12: useMemo wraps filtering and sorting logic.',
            'Line 17: Dependencies are [products, search].',
            'Line 21: Clicking "Toggle Dark Mode" re-renders ProductCatalog, but "Filtering catalog..." does NOT log because search and products are identical.'
          ],
          expectedBehavior: 'Heavy filtering operation is skipped when unrelated state (darkMode) changes.',
          commonMistakes: [
            'Using `useMemo` for trivial operations like `useMemo(() => a + b, [a, b])` (creates extra closure and memory overhead for a 1-nanosecond addition).',
            'Mutating the memoized object directly instead of returning a new one.'
          ],
          practiceLevels: {
            levelA: 'Memoize a filtered list of 1,000 items based on an active status toggle.',
            levelB: 'Stabilize a configuration object passed to a chart component.',
            levelC: 'Measure execution time using `console.time` to justify useMemo usage.'
          },
          debuggingChallenge: {
            brokenCode: `const total = useMemo(() => {\n  items.map(i => i.price); // Forgot to return sum!\n}, [items]);`,
            problem: 'The calculation function does not return a value, so total evaluates to undefined.',
            fix: 'Return the computed value: `return items.reduce((acc, i) => acc + i.price, 0);`.'
          },
          conceptualQuestion: {
            question: 'When is a computation considered "expensive" enough to justify `useMemo` in React?',
            options: [
              'Any operation with more than two lines of code.',
              'Computations that take > 1 millisecond or iterate over large arrays (thousands of items), or when stabilizing an object reference for a memoized child.',
              'Only when fetching data from the server.',
              'Every single array filter in a React component.'
            ],
            correctIndex: 1,
            explanation: 'Modern JS engines perform simple loops and additions in microseconds. useMemo is justified for heavy operations (1ms+) or preserving referential equality.'
          },
          codeReadingQuestion: {
            snippet: `const config = useMemo(() => ({ step: 1 }), []);\nconst obj = { step: 1 };`,
            question: 'On subsequent renders, how do `config` and `obj` compare to their previous render values?',
            answer: '`config === prevConfig` is true (preserved in memory), whereas `obj === prevObj` is false (new object allocated on each render).'
          },
          starterCode: `// Assignment: Implement memoizeWithStats
// Build a performance-monitored memoization container:
// memoizeWithStats(computeFn)
// Returns an object:
// - compute(inputs):
//   * If inputs match previous inputs (shallow array equality):
//     returns { value: cachedVal, fromCache: true }
//   * Otherwise: executes computeFn(...inputs), updates cache,
//     returns { value: newVal, fromCache: false }
// - getStats(): returns { hits: number, misses: number }

export function memoizeWithStats(computeFn) {
  // Your code here
}`,
          testCases: [
            {
              name: 'Returns cached value on identical inputs and tracks hits',
              run: (fn) => {
                const m = fn((a, b) => a + b);
                const r1 = m.compute([2, 3]);
                const r2 = m.compute([2, 3]);
                const stats = m.getStats();
                return r1.value === 5 && r1.fromCache === false && r2.value === 5 && r2.fromCache === true && stats.hits === 1 && stats.misses === 1;
              }
            },
            {
              name: 'Recomputes when inputs change',
              run: (fn) => {
                const m = fn(x => x * 2);
                m.compute([5]);
                m.compute([10]);
                return m.getStats().misses === 2 && m.getStats().hits === 0;
              }
            }
          ],
          solution: `export function memoizeWithStats(computeFn) {
  let prevInputs = null;
  let cachedVal = null;
  let hits = 0;
  let misses = 0;

  return {
    compute(inputs) {
      if (prevInputs !== null && prevInputs.length === inputs.length) {
        let match = true;
        for (let i = 0; i < inputs.length; i++) {
          if (!Object.is(prevInputs[i], inputs[i])) {
            match = false;
            break;
          }
        }
        if (match) {
          hits++;
          return { value: cachedVal, fromCache: true };
        }
      }
      misses++;
      prevInputs = [...inputs];
      cachedVal = computeFn(...inputs);
      return { value: cachedVal, fromCache: false };
    },
    getStats: () => ({ hits, misses })
  };
}`,
          hints: [
            'Check inputs length and compare items with Object.is.',
            'Increment hits on match and return { value: cachedVal, fromCache: true }.',
            'Increment misses on change, run computeFn, and cache.'
          ]
        },
        {
          id: 'p10-l8',
          slug: 'code-splitting-lazy-suspense',
          title: 'Code Splitting with React.lazy and Suspense',
          prerequisites: ['p5-l1', 'p1-l6'],
          estimatedDuration: '35 mins',
          difficulty: 'Intermediate',
          objectives: [
            'Split large JavaScript bundles into smaller on-demand chunks.',
            'Implement route-based code splitting using `React.lazy()` and dynamic `import()`.',
            'Provide accessible fallback skeletons with `<Suspense fallback={<Loader />}>`.'
          ],
          explanation: 'In a single-page React app, bundling all routes and components into one massive `main.js` file destroys initial load time (LCP). Code splitting allows you to split your app into separate JS chunks that are only downloaded when the user actually visits that route or opens that dialog.\n\n`React.lazy()` takes a function that calls dynamic `import("./Component")` and returns a component. Wrap lazy components in `<Suspense fallback={<Spinner />}>` so React knows what to show while downloading the chunk.',
          whyItExists: 'Reduces initial JavaScript bundle download size, drastically accelerating Initial Page Load and improving Core Web Vitals.',
          syntaxRules: '`const LazyComp = React.lazy(() => import("./Comp"));`\n`<Suspense fallback={<Loading />}>{/* ... */}</Suspense>`.',
          codeExample: `import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Lazy-loaded route components (split into separate chunks at build time)
const HomePage = lazy(() => import('./pages/HomePage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function LoadingSkeleton() {
  return <div className="skeleton-loader">Loading page...</div>;
}

export function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      {/* Suspense catches lazy components while downloading */}
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
          lineByLine: [
            'Line 5-7: lazy(() => import(...)) instructs Vite to generate separate .js chunks for each page.',
            'Line 20: Suspense boundary surrounds Routes.',
            'Line 20: fallback={<LoadingSkeleton />} renders while browser downloads AnalyticsDashboard.js.'
          ],
          expectedBehavior: 'Vite outputs separate bundle chunks; visiting /analytics triggers a network request for its chunk.',
          commonMistakes: [
            'Calling `React.lazy()` inside the component render function (re-creates the lazy wrapper on every render, resetting state). Declare it outside at file level!',
            'Forgetting default export in the lazy-loaded file (`React.lazy` requires a Promise resolving to `{ default: Component }`).'
          ],
          practiceLevels: {
            levelA: 'Split an admin dashboard tab with React.lazy and Suspense.',
            levelB: 'Implement an interactive modal that only downloads its code when the user clicks "Open Modal".',
            levelC: 'Prefetch a lazy route on link hover using `const prefetch = () => import("./Route")`.'
          },
          debuggingChallenge: {
            brokenCode: `// In App.jsx:\nfunction App() {\n  const Dashboard = React.lazy(() => import('./Dashboard')); // Anti-pattern!\n  return <Suspense><Dashboard /></Suspense>;\n}`,
            problem: 'Declaring React.lazy inside App causes React to re-mount the component and re-trigger Suspense on every App render.',
            fix: 'Move `const Dashboard = React.lazy(...)` outside the App function at module scope.'
          },
          conceptualQuestion: {
            question: 'What type of export does `React.lazy()` expect from the dynamic `import()` module?',
            options: [
              'A named export called `Component`.',
              'A default export: `export default function MyComponent() { ... }`.',
              'A CommonJS `module.exports`.',
              'Any exported object.'
            ],
            correctIndex: 1,
            explanation: '`React.lazy` expects the module promise to resolve to an object with a `.default` property containing a React component.'
          },
          codeReadingQuestion: {
            snippet: `const onHover = () => import('./HeavyEditor');\n<button onMouseEnter={onHover}>Edit</button>`,
            question: 'What performance technique is this demonstrating?',
            answer: 'Preloading / Prefetching code on user intent (mouse hover) before the user actually clicks to open it.'
          },
          starterCode: `// Assignment: Implement lazyBundleSimulator
// Simulate on-demand chunk loading and Suspense resolution:
// createLazyBundleLoader(moduleRegistry)
// - moduleRegistry: object mapping chunkId to factory function returning Promise of component
// Returns:
// - load(chunkId): returns status object:
//   * If already loaded: { status: 'resolved', component: module.default }
//   * If currently loading: { status: 'pending', promise }
//   * If failed: { status: 'rejected', error }

export function createLazyBundleLoader(moduleRegistry) {
  // Your code here
}`,
          testCases: [
            {
              name: 'Loads module dynamically and caches resolved component',
              run: async (fn) => {
                const registry = {
                  'chart': () => Promise.resolve({ default: 'ChartComponent' })
                };
                const loader = fn(registry);
                const p1 = loader.load('chart');
                if (p1.status !== 'pending') return false;
                await p1.promise;
                const p2 = loader.load('chart');
                return p2.status === 'resolved' && p2.component === 'ChartComponent';
              }
            },
            {
              name: 'Handles failed module loads',
              run: async (fn) => {
                const registry = {
                  'broken': () => Promise.reject(new Error('Network offline'))
                };
                const loader = fn(registry);
                const p = loader.load('broken');
                try {
                  await p.promise;
                } catch (e) { }
                const res = loader.load('broken');
                return res.status === 'rejected' && res.error.includes('Network offline');
              }
            }
          ],
          solution: `export function createLazyBundleLoader(moduleRegistry) {
  const cache = {};

  return {
    load(chunkId) {
      if (cache[chunkId]) return cache[chunkId];

      const factory = moduleRegistry[chunkId];
      if (!factory) {
        const errState = { status: 'rejected', error: \`Chunk \${chunkId} not found\` };
        cache[chunkId] = errState;
        return errState;
      }

      let resObj = { status: 'pending', promise: null };
      resObj.promise = factory()
        .then(mod => {
          cache[chunkId] = { status: 'resolved', component: mod.default };
          return mod.default;
        })
        .catch(err => {
          cache[chunkId] = { status: 'rejected', error: err.message };
          throw err;
        });

      cache[chunkId] = resObj;
      return resObj;
    }
  };
}`,
          hints: [
            'Store chunk load states in a cache dictionary.',
            'Return { status: "pending", promise } while loading.',
            'Update cache to resolved or rejected when factory() completes.'
          ]
        },
        {
          id: 'p10-l9',
          slug: 'list-virtualization-windowing',
          title: 'List Virtualization: Windowing 10,000+ DOM Nodes',
          prerequisites: ['p1-l5', 'p10-l1'],
          estimatedDuration: '40 mins',
          difficulty: 'Advanced',
          objectives: [
            'Understand DOM bloat caused by rendering thousands of items.',
            'Implement windowing: rendering only visible items inside the viewport.',
            'Calculate scroll offset, visible slice (`startIndex`, `endIndex`), and top/bottom spacer heights.'
          ],
          explanation: 'Rendering 10,000 DOM nodes simultaneously cripples browser performance: DOM nodes consume excessive memory, initial paint locks the main thread, and scrolling stutters. **Virtualization** (or windowing) renders ONLY the small slice of items currently visible in the scroll viewport (e.g. 15 items), plus an extra 2-3 item buffer. As the user scrolls, off-screen nodes are recycled or removed, keeping DOM node counts permanently flat.',
          whyItExists: 'Enables smooth 60fps scrolling and instant loading for arbitrarily large feeds, logs, and spreadsheets.',
          syntaxRules: '`startIndex = Math.floor(scrollTop / rowHeight)`, `endIndex = Math.min(items.length, startIndex + visibleCount)`.',
          codeExample: `import React, { useState } from 'react';

export function VirtualizedList({ items, rowHeight = 40, viewportHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * rowHeight;
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2); // 2 item buffer
  const endIndex = Math.min(items.length, startIndex + visibleCount + 4);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  return (
    <div
      style={{ height: viewportHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Phantom height container forces scrollbar to reflect total dataset size */}
      <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map(item => (
            <div key={item.id} style={{ height: rowHeight }} className="row">
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
          lineByLine: [
            'Line 6: totalHeight is total items * rowHeight, ensuring scrollbar thumb is correctly sized.',
            'Line 8: startIndex calculates which item starts at current scrollTop.',
            'Line 11: visibleItems extracts only ~15-20 items out of 10,000.',
            'Line 20: transform: translateY pushes the visible items down into view.'
          ],
          expectedBehavior: 'DOM contains only ~20 elements regardless of whether items has 100 or 100,000 elements.',
          commonMistakes: [
            'Using virtualization for small lists (under 100 items), where standard rendering is fast enough and virtualization adds unnecessary complexity.',
            'Forgetting the phantom scroll height container, making the scrollbar shrink to only 15 items.'
          ],
          practiceLevels: {
            levelA: 'Calculate visible slice given scrollTop = 200, rowHeight = 50, viewport = 300.',
            levelB: 'Build a lightweight windowed log viewer with 5,000 log entries.',
            levelC: 'Integrate dynamic height estimation using ResizeObserver.'
          },
          debuggingChallenge: {
            brokenCode: `const startIndex = Math.floor(scrollTop / rowHeight);\nconst visible = items.slice(startIndex, startIndex + 5); // When scrolling fast, items flash white!`,
            problem: 'No overscan/buffer items are rendered outside the visible area, causing blank white flashes during fast scrolling.',
            fix: 'Add an overscan buffer (e.g. 2-3 items before and after visible range).'
          },
          conceptualQuestion: {
            question: 'Why does list virtualization maintain high performance even when rendering 100,000 items?',
            options: [
              'It compiles the list into WebAssembly.',
              'The number of actual DOM nodes in the document is capped at the small number visible on screen (e.g. ~15-20 nodes), preventing DOM tree bloat.',
              'It deletes the items from JavaScript memory.',
              'It runs in a separate browser tab.'
            ],
            correctIndex: 1,
            explanation: 'Virtualization keeps the real DOM lightweight. Only visible rows are rendered, so browser style recalculations and paints remain instantaneous.'
          },
          codeReadingQuestion: {
            snippet: `const totalHeight = 1000 * 50;\n<div style={{ height: totalHeight }} />`,
            question: 'What is the purpose of this 50,000px tall element in a virtualized container?',
            answer: 'It expands the scrollable area so the browser\'s native scrollbar accurately represents the total length of the list.'
          },
          starterCode: `// Assignment: Implement computeVirtualWindow
// Calculate the virtualized window slice metrics:
// computeVirtualWindow({ totalItems, rowHeight, viewportHeight, scrollTop, buffer = 2 })
// Returns:
// {
//   startIndex: number,
//   endIndex: number,
//   offsetY: number,
//   totalHeight: number,
//   renderedCount: number
// }

export function computeVirtualWindow(config) {
  // Your code here
}`,
          testCases: [
            {
              name: 'Calculates window slice at scroll position 0',
              run: (fn) => {
                const res = fn({ totalItems: 1000, rowHeight: 40, viewportHeight: 200, scrollTop: 0, buffer: 2 });
                return res.startIndex === 0 && res.endIndex === 7 && res.offsetY === 0 && res.totalHeight === 40000 && res.renderedCount === 7;
              }
            },
            {
              name: 'Calculates window slice at scrolled position',
              run: (fn) => {
                const res = fn({ totalItems: 500, rowHeight: 50, viewportHeight: 200, scrollTop: 500, buffer: 1 });
                // scrollTop 500 / 50 = index 10. with buffer 1: start = 9. visible count = 4. end = 9 + 4 + 2 = 15
                return res.startIndex === 9 && res.offsetY === 450 && res.totalHeight === 25000;
              }
            }
          ],
          solution: `export function computeVirtualWindow(config) {
  const { totalItems, rowHeight, viewportHeight, scrollTop, buffer = 2 } = config;
  const totalHeight = totalItems * rowHeight;
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const rawStart = Math.floor(scrollTop / rowHeight);
  const startIndex = Math.max(0, rawStart - buffer);
  const endIndex = Math.min(totalItems, rawStart + visibleCount + buffer);
  const offsetY = startIndex * rowHeight;
  const renderedCount = Math.max(0, endIndex - startIndex);

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    renderedCount
  };
}`,
          hints: [
            'Calculate totalHeight = totalItems * rowHeight.',
            'Calculate visibleCount = Math.ceil(viewportHeight / rowHeight).',
            'Subtract buffer from rawStart for startIndex, and add buffer to endIndex.'
          ]
        },
        {
          id: 'p10-l10',
          slug: 'debouncing-and-throttling-react',
          title: 'Debouncing and Throttling in React',
          prerequisites: ['p3-l4', 'p3-l2'],
          estimatedDuration: '30 mins',
          difficulty: 'Intermediate',
          objectives: [
            'Distinguish between debouncing (waiting for idle) and throttling (capping frequency).',
            'Implement custom `useDebounce` hook for search queries.',
            'Prevent memory leaks by cleaning up timer timeouts on unmount.'
          ],
          explanation: 'Rapidly firing events (keystrokes in a search input, window resizing, scrolling) can flood your app with hundreds of state updates and API calls per second.\n- **Debounce**: Delays executing a function until a specified time has elapsed since the LAST event (e.g., wait 300ms after the user stops typing before fetching search results).\n- **Throttle**: Guarantees execution at most once every X milliseconds (e.g., sample scroll position at most once every 100ms).',
          whyItExists: 'Reduces backend server load, saves mobile bandwidth, and prevents UI stutter caused by excessive state updates.',
          syntaxRules: '`const debouncedVal = useDebounce(inputVal, 300);`. Clean up `clearTimeout(timer)` in useEffect.',
          codeExample: `import { useState, useEffect } from 'react';

// Custom useDebounce hook
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Start timer on every value change
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cancel timer if value changes again before delayMs expires!
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

// Consuming component:
export function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Fetching API for:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />;
}`,
          lineByLine: [
            'Line 8: setTimeout schedules debouncedValue update.',
            'Line 13: return () => clearTimeout(handler) cancels pending timer if user types another letter within 300ms.',
            'Line 24: debouncedQuery only updates when user pauses typing for 400ms.'
          ],
          expectedBehavior: 'Typing 10 characters rapidly triggers only 1 API search call instead of 10.',
          commonMistakes: [
            'Creating a debounced function inside component body without `useCallback` or `useMemo` (re-creates a new debounced instance on every render, breaking timer cancellation).',
            'Forgetting `clearTimeout` cleanup, causing state updates on unmounted components.'
          ],
          practiceLevels: {
            levelA: 'Build the useDebounce hook and test with rapid typing.',
            levelB: 'Implement a useThrottle hook for window resize event listener.',
            levelC: 'Add an immediate-first-call option to the throttle function.'
          },
          debuggingChallenge: {
            brokenCode: `function Search() {\n  const [q, setQ] = useState('');\n  const searchApi = debounce((val) => fetchResults(val), 300);\n  return <input onChange={e => searchApi(e.target.value)} />;\n}`,
            problem: '`searchApi` is recreated on every keystroke, so each keystroke gets its own brand new timer that will all fire after 300ms.',
            fix: 'Wrap `searchApi` in `useCallback` or use the `useDebounce` hook on the state value.'
          },
          conceptualQuestion: {
            question: 'What is the main functional difference between Debouncing and Throttling?',
            options: [
              'Debouncing is for mobile devices; throttling is for desktop browsers.',
              'Debouncing delays execution until events pause for N ms; Throttling enforces a maximum execution frequency of once per N ms regardless of ongoing events.',
              'Debouncing runs synchronously; throttling runs asynchronously.',
              'Throttling requires Redux.'
            ],
            correctIndex: 1,
            explanation: 'Debounce waits for silence/inactivity. Throttle ensures regular periodic execution while continuous activity occurs.'
          },
          codeReadingQuestion: {
            snippet: `useEffect(() => {\n  const id = setTimeout(() => notify(), 500);\n  return () => clearTimeout(id);\n}, [text]);`,
            question: 'If the user types 5 letters with 100ms intervals between each, how many times does `notify()` execute?',
            answer: 'Exactly 1 time (500ms after the 5th and final letter is typed).'
          },
          starterCode: `// Assignment: Implement debounceSimulator
// Simulate a debounced function invoker:
// debounceSimulator(fn, delayMs)
// Returns an object:
// - trigger(arg, currentTimeMs): schedules call
// - tick(currentTimeMs): advances simulated time and executes fn if timer elapsed
// - getCallCount(): number of times fn was actually executed
// - getLastArg(): last argument passed to fn

export function debounceSimulator(fn, delayMs) {
  // Your code here
}`,
          testCases: [
            {
              name: 'Only fires after delay has passed with no subsequent calls',
              run: (fn) => {
                let last = '';
                const sim = fn(x => { last = x; }, 300);
                sim.trigger('a', 0);
                sim.trigger('b', 100);
                sim.trigger('c', 200);
                sim.tick(250); // only 50ms since 'c'
                if (sim.getCallCount() !== 0) return false;
                sim.tick(501); // 301ms since 'c'
                return sim.getCallCount() === 1 && sim.getLastArg() === 'c' && last === 'c';
              }
            },
            {
              name: 'Handles multiple distinct debounce windows',
              run: (fn) => {
                const sim = fn(x => x, 200);
                sim.trigger('first', 0);
                sim.tick(250); // executes 'first'
                sim.trigger('second', 300);
                sim.tick(550); // executes 'second'
                return sim.getCallCount() === 2;
              }
            }
          ],
          solution: `export function debounceSimulator(fn, delayMs) {
  let callCount = 0;
  let lastArg = null;
  let scheduledAt = null;
  let pendingArg = null;

  return {
    trigger(arg, currentTimeMs) {
      pendingArg = arg;
      scheduledAt = currentTimeMs + delayMs;
    },
    tick(currentTimeMs) {
      if (scheduledAt !== null && currentTimeMs >= scheduledAt) {
        lastArg = pendingArg;
        fn(lastArg);
        callCount++;
        scheduledAt = null;
        pendingArg = null;
      }
    },
    getCallCount: () => callCount,
    getLastArg: () => lastArg
  };
}`,
          hints: [
            'Track scheduledAt as currentTimeMs + delayMs on every trigger.',
            'In tick, check if currentTimeMs >= scheduledAt and invoke fn.',
            'Reset scheduledAt to null after execution.'
          ]
        },
        {
          id: 'p10-l11',
          slug: 'preventing-memory-leaks-cleanup',
          title: 'Preventing Memory Leaks and Detached DOM Trees',
          prerequisites: ['p3-l2', 'p10-l1'],
          estimatedDuration: '30 mins',
          difficulty: 'Intermediate',
          objectives: [
            'Identify common memory leaks in React single-page applications.',
            'Clean up window event listeners, intervals, web socket connections, and AbortControllers.',
            'Understand detached DOM nodes caused by retained references in closures.'
          ],
          explanation: 'In a long-running Single Page Application (SPA), memory leaks cause the tab to progressively consume gigabytes of RAM until the browser crashes. Common culprits in React include:\n1. **Dangling Event Listeners**: Attaching `window.addEventListener("resize", fn)` in `useEffect` without removing it in the cleanup function.\n2. **Uncancelled Timers**: `setInterval` continuing to run in the background after the component unmounts.\n3. **Unclosed WebSockets/Subscriptions**: Retaining event bus listeners.\n4. **Detached DOM nodes**: Holding global references to DOM elements that have been removed from the document.',
          whyItExists: 'Ensures the app runs fast and stably indefinitely without freezing browser tabs during hours of continuous user sessions.',
          syntaxRules: 'Always return a cleanup function from `useEffect`: `return () => { clearInterval(id); window.removeEventListener(...); };`.',
          codeExample: `import React, { useEffect, useState } from 'react';

export function WindowWatcher() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // 1. Add listener
    window.addEventListener('resize', handleResize);

    // 2. MUST remove listener on unmount to prevent memory leak!
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const res = await fetch('/api/stats', { signal: controller.signal });
        const json = await res.json();
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }
    loadData();

    // Abort pending fetch if component unmounts mid-request!
    return () => controller.abort();
  }, []);

  return <div>Window width: {width}px</div>;
}`,
          lineByLine: [
            'Line 13: Cleanup function removes resize listener when component unmounts.',
            'Line 29: Aborts fetch request so unmounted component does not attempt state updates.'
          ],
          expectedBehavior: 'Zero orphaned listeners or background tasks remain after component unmounts.',
          commonMistakes: [
            'Passing an anonymous arrow function to addEventListener (`window.addEventListener("resize", () => ...)`). You cannot remove an anonymous function with removeEventListener!',
            'Storing heavy component instances or DOM nodes on a global window object.'
          ],
          practiceLevels: {
            levelA: 'Verify timer cleanup by observing console logs after component unmounts.',
            levelB: 'Inspect Chrome DevTools Memory tab to capture heap snapshots.',
            levelC: 'Implement an AbortController cleanup pattern for asynchronous requests.'
          },
          debuggingChallenge: {
            brokenCode: `useEffect(() => {\n  window.addEventListener('scroll', () => handleScroll());\n  return () => window.removeEventListener('scroll', () => handleScroll());\n}, []);`,
            problem: 'The removeEventListener call passes a new arrow function, which does not match the instance passed to addEventListener, leaving the listener active permanently!',
            fix: 'Assign the handler to a named variable `const fn = () => handleScroll();` and pass `fn` to both add and remove.'
          },
          conceptualQuestion: {
            question: 'Why does passing `() => doSomething()` directly to both `addEventListener` and `removeEventListener` fail to clean up the listener?',
            options: [
              'Because arrow functions cannot be used with browser events.',
              'Each arrow function is a distinct object in memory. `removeEventListener` searches for the exact same function reference; finding no match, it does nothing.',
              'Because React clears listeners automatically.',
              'Because removeEventListener requires a string parameter.'
            ],
            correctIndex: 1,
            explanation: 'Event listeners are removed by reference equality. Two identical-looking inline arrow functions have different references in memory.'
          },
          codeReadingQuestion: {
            snippet: `useEffect(() => {\n  const id = setInterval(poll, 1000);\n  return () => clearInterval(id);\n}, []);`,
            question: 'When is `clearInterval(id)` executed by React?',
            answer: 'When the component unmounts, or immediately before re-running the effect if dependencies change.'
          },
          starterCode: `// Assignment: Implement listenerLifecycleManager
// Simulate resource registration and cleanup tracking:
// createLifecycleManager()
// Methods:
// - register(resourceId, cleanupFn): tracks an active resource
// - unregister(resourceId): runs cleanupFn and removes from active registry
// - disposeAll(): runs cleanup on all active resources (simulates unmount)
// - getActiveCount(): returns number of currently active resources

export function createLifecycleManager() {
  // Your code here
}`,
          testCases: [
            {
              name: 'Registers and cleans up resources on unmount',
              run: (fn) => {
                const mgr = fn();
                let cleaned = false;
                mgr.register('timer-1', () => { cleaned = true; });
                if (mgr.getActiveCount() !== 1) return false;
                mgr.disposeAll();
                return mgr.getActiveCount() === 0 && cleaned === true;
              }
            },
            {
              name: 'Allows explicit unregistering before disposal',
              run: (fn) => {
                const mgr = fn();
                let count = 0;
                mgr.register('res-1', () => count++);
                mgr.unregister('res-1');
                mgr.disposeAll();
                return count === 1 && mgr.getActiveCount() === 0;
              }
            }
          ],
          solution: `export function createLifecycleManager() {
  const active = new Map();

  return {
    register(resourceId, cleanupFn) {
      active.set(resourceId, cleanupFn);
    },
    unregister(resourceId) {
      const fn = active.get(resourceId);
      if (typeof fn === 'function') {
        fn();
      }
      active.delete(resourceId);
    },
    disposeAll() {
      for (const [, fn] of active.entries()) {
        if (typeof fn === 'function') fn();
      }
      active.clear();
    },
    getActiveCount: () => active.size
  };
}`,
          hints: [
            'Use Map to store resourceId -> cleanupFn.',
            'In disposeAll, iterate all values, invoke them, and clear the map.',
            'getActiveCount returns active.size.'
          ]
        },
        {
          id: 'p10-l12',
          slug: 'core-web-vitals-react-inp-cls',
          title: 'Core Web Vitals and React: INP, LCP, and CLS',
          prerequisites: ['p10-l1', 'p10-l8'],
          estimatedDuration: '30 mins',
          difficulty: 'Intermediate',
          objectives: [
            'Understand Google Core Web Vitals: Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS).',
            'Optimize INP in React by breaking up long tasks and yielding to the main thread.',
            'Eliminate layout shifts caused by dynamic images and conditional content.'
          ],
          explanation: 'Core Web Vitals are real-world user experience metrics measured by Google:\n1. **INP (Interaction to Next Paint)**: Measures user interface responsiveness. If a user clicks a button and React blocks the main thread with a 200ms synchronous render, INP suffers (> 200ms is poor). Solved with `useTransition`, web workers, or chunked processing.\n2. **LCP (Largest Contentful Paint)**: How fast the primary content renders (target < 2.5s). Solved with SSR, code splitting, and asset optimization.\n3. **CLS (Cumulative Layout Shift)**: Measures visual stability (target < 0.1). Solved by setting explicit `width` and `height` aspect ratios on images and skeletons.',
          whyItExists: 'Directly impacts Google search ranking, bounce rate, and user perception of application speed.',
          syntaxRules: 'Keep tasks under 50ms. Reserve image dimensions: `<img width="600" height="400" />`. Use `useTransition` for non-urgent updates.',
          codeExample: `import React, { useTransition, useState } from 'react';

export function ResponsiveTabs() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (nextTab: string) => {
    // Urgent update: click indicator / active tab border updates instantly
    // Non-urgent update: rendering the heavy tab content yields to main thread
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <div className="tab-buttons">
        <button onClick={() => handleTabChange('home')}>Home</button>
        <button onClick={() => handleTabChange('heavyData')}>Analytics</button>
      </div>
      {isPending && <div className="spinner">Updating view...</div>}
      {tab === 'home' ? <HomeView /> : <HeavyAnalyticsView />}
    </div>
  );
}`,
          lineByLine: [
            'Line 5: useTransition hook marks updates as non-blocking transitions.',
            'Line 11: startTransition wraps the state update for the heavy tab.',
            'React keeps the browser responsive to clicks and typing while rendering HeavyAnalyticsView in the background.'
          ],
          expectedBehavior: 'Clicks feel instantaneous with 0 main-thread freezing, producing green INP scores.',
          commonMistakes: [
            'Rendering images without `width` and `height` attributes, causing the page to jump as images load (destroys CLS).',
            'Running heavy synchronous loops (> 50ms) inside event handlers without yielding.'
          ],
          practiceLevels: {
            levelA: 'Add explicit aspect ratio reserve boxes to prevent layout shift on loading images.',
            levelB: 'Use useTransition to optimize tab switching responsiveness.',
            levelC: 'Measure INP using web-vitals npm package or Chrome DevTools Performance panel.'
          },
          debuggingChallenge: {
            brokenCode: `<div className="banner">\n  {bannerUrl && <img src={bannerUrl} />} {/* When loaded, pushes content down! */}\n</div>`,
            problem: 'Content jumps down abruptly when the banner loads, causing high CLS.',
            fix: 'Add a fixed aspect-ratio container or skeleton with predefined height: `style={{ minHeight: "200px" }}`.'
          },
          conceptualQuestion: {
            question: 'Which Core Web Vital metric replaced First Input Delay (FID) to assess overall page responsiveness throughout the entire session?',
            options: [
              'LCP (Largest Contentful Paint)',
              'INP (Interaction to Next Paint)',
              'CLS (Cumulative Layout Shift)',
              'TTFB (Time to First Byte)'
            ],
            correctIndex: 1,
            explanation: 'INP (Interaction to Next Paint) measures the latency of all user interactions (clicks, taps, keystrokes) across the page lifespan.'
          },
          codeReadingQuestion: {
            snippet: `<img src="/hero.jpg" width="1200" height="600" style={{ maxWidth: '100%', height: 'auto' }} />`,
            question: 'How do the `width` and `height` HTML attributes help prevent Cumulative Layout Shift (CLS)?',
            answer: 'They allow the browser to calculate the image\'s aspect ratio and reserve the exact space before the image file finishes downloading.'
          },
          starterCode: `// Assignment: Implement classifyVitals
// Classify Web Vitals scores into Google performance tiers:
// classifyVitals(metrics)
// - metrics: { inp?: number, lcp?: number, cls?: number }
// Rules:
// - INP: <= 200 'good', <= 500 'needs-improvement', > 500 'poor'
// - LCP: <= 2500 'good', <= 4000 'needs-improvement', > 4000 'poor'
// - CLS: <= 0.1 'good', <= 0.25 'needs-improvement', > 0.25 'poor'
// Returns: { [metric]: tier, overall: 'good' | 'needs-improvement' | 'poor' }
// overall is the worst tier among the provided metrics.

export function classifyVitals(metrics) {
  // Your code here
}`,
          testCases: [
            {
              name: 'Accurately classifies all good metrics',
              run: (fn) => {
                const res = fn({ inp: 150, lcp: 1800, cls: 0.05 });
                return res.inp === 'good' && res.lcp === 'good' && res.cls === 'good' && res.overall === 'good';
              }
            },
            {
              name: 'Identifies worst metric for overall score',
              run: (fn) => {
                const res = fn({ inp: 120, lcp: 4500, cls: 0.02 });
                return res.inp === 'good' && res.lcp === 'poor' && res.overall === 'poor';
              }
            }
          ],
          solution: `export function classifyVitals(metrics) {
  const result = {};
  const tiers = ['good', 'needs-improvement', 'poor'];

  if (metrics.inp !== undefined) {
    result.inp = metrics.inp <= 200 ? 'good' : metrics.inp <= 500 ? 'needs-improvement' : 'poor';
  }
  if (metrics.lcp !== undefined) {
    result.lcp = metrics.lcp <= 2500 ? 'good' : metrics.lcp <= 4000 ? 'needs-improvement' : 'poor';
  }
  if (metrics.cls !== undefined) {
    result.cls = metrics.cls <= 0.1 ? 'good' : metrics.cls <= 0.25 ? 'needs-improvement' : 'poor';
  }

  const values = Object.values(result);
  if (values.includes('poor')) {
    result.overall = 'poor';
  } else if (values.includes('needs-improvement')) {
    result.overall = 'needs-improvement';
  } else {
    result.overall = 'good';
  }

  return result;
}`,
          hints: [
            'Check each metric threshold with ternary statements.',
            'Compute overall by checking if values includes "poor", then "needs-improvement", else "good".'
          ]
        }
      ]
    };
