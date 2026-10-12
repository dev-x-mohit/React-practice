// Phase 4: Rendering and React Internals
export const phase4 = {
  id: 'phase-4',
  title: 'Phase 4 — Rendering and React Internals',
  description: 'Understand the two-phase rendering pipeline (Render vs Commit), reconciliation algorithms, state snapshots and batching, Error Boundaries, Portals, Suspense/Lazy code-splitting, and the React Compiler.',
  icon: 'Cpu',
  badge: 'Core Internals',
  estimatedHours: 12,
  lessons: [
    {
      id: 'p4-l1',
      slug: 'render-and-commit-phases',
      title: 'The Render and Commit Phases',
      prerequisites: ['p1-l17', 'p1-l18'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Differentiate the Render phase (pure calculation) from the Commit phase (DOM writes).', 'Understand why React can pause or abort the Render phase in concurrent mode.', 'Recognize where side effects can and cannot be executed.'],
      explanation: 'React updates the UI in two distinct phases: 1. Render Phase: React calls your component functions to figure out what the UI should look like. This phase must be pure and have zero side effects; React may even discard render output. 2. Commit Phase: React takes the computed diff and applies it to the actual DOM. Side effects like layout effects and standard effects run only after the commit phase.',
      whyItExists: 'Separating calculation from DOM mutation enables concurrent rendering, suspense, and high frame rates.',
      syntaxRules: 'Render phase: pure JSX and math calculations. Commit phase: DOM updates, ref attachments, useEffect runs.',
      codeExample: `// Two-Phase Lifecycle\nfunction Dashboard({ data }) {\n  // 1. RENDER PHASE: Call component function, compute JSX\n  const formatted = data.map(d => d.value * 2);\n\n  // 2. COMMIT PHASE & EFFECTS: Run after DOM is written\n  useEffect(() => {\n    console.log('DOM updated and painted!');\n  }, []);\n\n  return <div>{formatted.join(', ')}</div>;\n}`,
      lineByLine: [
        'Line 4: Render phase runs locally in memory without touching real DOM.',
        'Line 7: Commit phase writes to the DOM; useEffect runs after paint.'
      ],
      expectedBehavior: 'Component executes purely during render; side effects are safely deferred to the commit phase.',
      commonMistakes: ['Mutating the DOM during the render phase.', 'Assuming every render call results in a real DOM write (if diff is empty, commit is skipped!).'],
      practiceLevels: {
        levelA: 'Categorize operations into Render Phase vs Commit Phase.',
        levelB: 'Observe React skipping DOM mutations when render output has not changed.',
        levelC: 'Profile render vs commit times using React DevTools Profiler.'
      },
      debuggingChallenge: {
        brokenCode: `function Title({ text }) {\n  document.title = text; // DOM side effect during render phase!\n  return <h1>{text}</h1>;\n}`,
        problem: 'Direct DOM mutation in render phase can run multiple times or be aborted, causing corrupted state.',
        fix: 'Move to useEffect(() => { document.title = text; }, [text]);'
      },
      conceptualQuestion: {
        question: 'Can React abort or restart a component\'s Render phase without committing changes to the real DOM?',
        options: [
          'No, every render must be committed.',
          'Yes, in concurrent React, the Render phase can be paused, interrupted, or discarded if higher-priority user input arrives.',
          'Only in React Native.',
          'Only when an error occurs.'
        ],
        correctIndex: 1,
        explanation: 'In concurrent mode, React can interrupt render calculations if a high-priority event occurs, which is why the render phase must remain pure.'
      },
      codeReadingQuestion: {
        snippet: `console.log('Render');\nuseEffect(() => console.log('Commit Effect'));`,
        question: 'What is logged first?',
        answer: '"Render" logs first during the render phase, followed by "Commit Effect" after the commit phase.'
      },
      starterCode: `// Assignment: Implement classifyPipelinePhase\n// Classify actions according to React Pipeline Phases:\n// classifyPipelinePhase(action)\n// Render phase: 'CALL_COMPONENT_FUNCTION', 'EVALUATE_JSX', 'DIFF_VIRTUAL_TREE', 'DERIVE_LOCAL_STATE'\n// Commit phase: 'INSERT_DOM_NODE', 'UPDATE_DOM_ATTRIBUTE', 'RUN_USE_LAYOUT_EFFECT', 'RUN_USE_EFFECT'\n// Return: { phase: 'RENDER' | 'COMMIT', canBeInterrupted: boolean }\n\nexport function classifyPipelinePhase(action) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Correctly identifies render phase operations',
          run: (fn) => {
            const res = fn('EVALUATE_JSX');
            return res.phase === 'RENDER' && res.canBeInterrupted === true;
          }
        },
        {
          name: 'Correctly identifies commit phase operations',
          run: (fn) => {
            const res = fn('INSERT_DOM_NODE');
            return res.phase === 'COMMIT' && res.canBeInterrupted === false;
          }
        }
      ],
      hints: [
        'Check if action is in the render phase list; render phase is interruptible.'
      ],
      checklist: [
        'Classified render vs commit operations',
        'Marked render phase as interruptible',
        'Marked commit phase as non-interruptible'
      ],
      revisionSummary: 'The Render phase computes UI virtual diffs purely; the Commit phase applies updates to the real DOM.'
    },
    {
      id: 'p4-l2',
      slug: 'reconciliation-and-keys',
      title: 'Reconciliation and the Role of Keys',
      prerequisites: ['p4-l1', 'p1-l11'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Master React\'s O(n) heuristic diffing algorithm.', 'Understand element identity by type and key.', 'Explain why differing element types cause full subtree unmounts.'],
      explanation: 'Reconciliation is the process through which React updates the DOM by comparing previous and next virtual trees. Comparing arbitrary trees takes O(n^3) time. React uses two heuristics to achieve O(n) performance: 1. Two elements of different types (e.g. <div> to <span>) will produce different trees and tear down the old subtree. 2. Keys provide persistent identity across re-renders for list elements.',
      whyItExists: 'Enables real-time 60fps tree diffing across thousands of elements.',
      syntaxRules: 'Changing an element\'s tag or its key instructs React to unmount the old component and mount a new one.',
      codeExample: `// Heuristic 1: Changing Element Type destroys subtree!\n// Old: <div><Counter /></div>\n// New: <section><Counter /></section>\n// Result: React completely unmounts Counter and resets its state to initial!\n\n// Heuristic 2: Stable Keys preserve subtree!\n// <TodoItem key={todo.id} todo={todo} />\n// React matches identical keys and preserves component state and DOM focus.`,
      lineByLine: [
        'Line 2: Changing wrapper from div to section forces complete unmount of children.',
        'Line 7: Stable key preserves component state even if items are sorted or filtered.'
      ],
      expectedBehavior: 'Reconciliation updates only changed attributes and preserves subtree identity.',
      commonMistakes: ['Changing container wrappers dynamically, wondering why nested inputs lose state.', 'Omitting keys on dynamic sibling elements.'],
      practiceLevels: {
        levelA: 'Demonstrate component unmounting when tag type changes.',
        levelB: 'Inspect DOM node mutations in DevTools during list reordering with keys.',
        levelC: 'Measure reconciliation speed difference with and without stable keys.'
      },
      debuggingChallenge: {
        brokenCode: `// Developer toggles: {isGrid ? <div className="grid"><Item /></div> : <section className="list"><Item /></section>}`,
        problem: 'Item loses all internal state on toggle because its parent element type changed from div to section.',
        fix: 'Keep the parent element type identical: <div className={isGrid ? "grid" : "list"}><Item /></div>.'
      },
      conceptualQuestion: {
        question: 'What happens in React reconciliation when an element\'s tag type changes from `<div>` to `<span>`?',
        options: [
          'React renames the DOM node and preserves child component state.',
          'React completely destroys the old `<div>` and all its child components (running their cleanups/unmounts) and builds a brand new DOM subtree from scratch.',
          'React issues a compile error in Vite.',
          'Only CSS classes are refreshed.'
        ],
        correctIndex: 1,
        explanation: 'Different element types tear down the entire old subtree, destroying all component instances and their states.'
      },
      codeReadingQuestion: {
        snippet: `// What is the time complexity of React's reconciliation algorithm?`,
        question: 'What is the big-O performance of React diffing?',
        answer: 'O(n), linear time with respect to the number of nodes in the tree.'
      },
      starterCode: `// Assignment: Implement simulateReconciliationDiff\n// Simulates React reconciliation decisions between two virtual nodes:\n// diffVirtualNodes(prevNode, nextNode)\n// Node: { type: string, key?: string, props: object }\n// 1. If prevNode.type !== nextNode.type -> action: 'REPLACE_SUBTREE'\n// 2. If prevNode.key !== nextNode.key -> action: 'REPLACE_BY_KEY'\n// 3. If type and key match -> compare props: if props changed -> action: 'UPDATE_PROPS', else 'NOOP'\n// Return: { action: string, shouldUnmount: boolean }\n\nexport function diffVirtualNodes(prevNode, nextNode) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Triggers REPLACE_SUBTREE when element type differs',
          run: (fn) => {
            const prev = { type: 'div', key: '1', props: {} };
            const next = { type: 'section', key: '1', props: {} };
            const res = fn(prev, next);
            return res.action === 'REPLACE_SUBTREE' && res.shouldUnmount === true;
          }
        },
        {
          name: 'Triggers UPDATE_PROPS when identity matches but props change',
          run: (fn) => {
            const prev = { type: 'div', key: '1', props: { className: 'old' } };
            const next = { type: 'div', key: '1', props: { className: 'new' } };
            const res = fn(prev, next);
            return res.action === 'UPDATE_PROPS' && res.shouldUnmount === false;
          }
        }
      ],
      hints: [
        'Check type first (shouldUnmount: true), then key (shouldUnmount: true), then props comparison.'
      ],
      checklist: [
        'Handled element type mismatch',
        'Handled key mismatch',
        'Handled prop updates without unmounting'
      ],
      revisionSummary: 'Reconciliation matches nodes by type and key, preserving state when identity matches.'
    },
    {
      id: 'p4-l3',
      slug: 'virtual-dom-realities-and-myths',
      title: 'Virtual DOM: Realities, Myths, and Limitations',
      prerequisites: ['p4-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Deconstruct the myth that "Virtual DOM is inherently faster than direct DOM".', 'Understand what the Virtual DOM actually is: a lightweight tree of plain JS objects.', 'Explain how React uses VDOM for declarative abstraction, not raw micro-benchmarks.'],
      explanation: 'The Virtual DOM (VDOM) is not a magic speed booster. A plain JavaScript object tree is used to represent the desired UI. Direct manual DOM manipulation will always be faster for a single surgical write. What the Virtual DOM provides is DECLARATIVE VALUE: it allows developers to write code as if re-rendering the whole page on every state update, while React batches and optimizes the actual DOM writes to achieve excellent average performance.',
      whyItExists: 'Provides an abstraction that frees engineers from manual DOM synchronization.',
      syntaxRules: 'A Virtual DOM node is just a plain JS object: { type: "h1", props: { children: "Hello" } } produced by React.createElement.',
      codeExample: `// What JSX compiles to: Plain JS Object!\nconst vdomNode = {\n  type: 'button',\n  props: {\n    className: 'btn-primary',\n    onClick: () => {},\n    children: 'Click Me'\n  }\n};\n// React inspects this in memory in microseconds!`,
      lineByLine: [
        'Line 2: A VDOM node is a standard JavaScript object in memory.',
        'Comparing two JS objects is cheap; updating the real browser DOM triggers layout recalculations.'
      ],
      expectedBehavior: 'React diffs in-memory JS objects before touching the browser layout engine.',
      commonMistakes: ['Believing React is faster than hand-optimized vanilla JS (it is not; React optimizes developer productivity).', 'Assuming VDOM uses browser memory buffers.'],
      practiceLevels: {
        levelA: 'Inspect React element objects returned by React.createElement.',
        levelB: 'Compare DOM layout cost vs JS object comparison cost in browser.',
        levelC: 'Understand why modern frameworks like Svelte compile without a Virtual DOM.'
      },
      debuggingChallenge: {
        brokenCode: `// Interview question: "Is React faster than vanilla JS?"`,
        problem: 'Claiming React is faster than vanilla JS is technically false.',
        fix: 'Explain that React provides maintainability and predictable good performance through declarative diffing, not raw peak speed.'
      },
      conceptualQuestion: {
        question: 'What is the primary benefit of the Virtual DOM in React?',
        options: [
          'It is faster than any vanilla JavaScript code ever written.',
          'It provides a declarative programming model: developers describe desired UI state, and React automatically figures out the necessary DOM operations.',
          'It runs on WebAssembly.',
          'It replaces CSS.'
        ],
        correctIndex: 1,
        explanation: 'The Virtual DOM enables declarative UI programming while maintaining high average performance without manual DOM bookkeeping.'
      },
      codeReadingQuestion: {
        snippet: `const el = <h1>Title</h1>;\nconsole.log(typeof el, el.$$typeof);`,
        question: 'What is el in JavaScript memory?',
        answer: 'A plain JavaScript object with a special Symbol identifier (Symbol(react.transitional.element) or Symbol(react.element)).'
      },
      starterCode: `// Assignment: Implement createVNode\n// Build a simplified virtual DOM node constructor:\n// createVNode(type, props, children)\n// Return a frozen object: { type, props: { ...props, children: normalizedChildren }, isVNode: true }\n// Normalize children: if children is not an array, wrap into [children] unless null/undefined (then []).\n\nexport function createVNode(type, props = {}, children = []) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Constructs valid frozen VNode object',
          run: (fn) => {
            const node = fn('button', { className: 'btn' }, 'Submit');
            return node.type === 'button' && node.props.className === 'btn' && node.props.children[0] === 'Submit' && node.isVNode === true && Object.isFrozen(node);
          }
        }
      ],
      hints: [
        'Normalize children into an array and return Object.freeze({ type, props: { ...props, children }, isVNode: true }).'
      ],
      checklist: [
        'Normalized children to array',
        'Frozen resulting VNode object',
        'Preserved props and type'
      ],
      revisionSummary: 'The Virtual DOM is a lightweight tree of plain JS objects enabling declarative UI synchronization.'
    },
    {
      id: 'p4-l4',
      slug: 'component-rerender-triggers',
      title: 'Component Re-render Triggers',
      prerequisites: ['p4-l1', 'p1-l17'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the 4 triggers for a React component re-render.', 'Understand why parent re-renders cascade down to children by default.', 'Differentiate prop changes from parent re-renders.'],
      explanation: 'A component re-renders if and only if one of 4 things happens: 1. Its own local state changes (setState). 2. Its parent component re-renders. 3. A Context it consumes changes value. 4. A custom hook it calls updates its internal state. Note: A child re-renders when its parent re-renders EVEN IF ITS PROPS DID NOT CHANGE (unless memoized with React.memo)!',
      whyItExists: 'Ensures the entire subtree receives updated data consistently.',
      syntaxRules: 'By default in React, when a parent renders, all of its children render recursively.',
      codeExample: `function Parent() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>+1</button>\n      {/* Child re-renders EVERY time Parent renders, even though it has NO props! */}\n      <Child />\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 2: State changes in Parent.',
        'Line 7: Child re-renders automatically because its parent re-rendered, not because props changed.'
      ],
      expectedBehavior: 'Recursive downward rendering guarantees UI consistency.',
      commonMistakes: ['Thinking components only re-render when their props change (they re-render whenever their parent renders!).', 'Trying to optimize every child when virtual re-renders cost microseconds.'],
      practiceLevels: {
        levelA: 'Use console.log in a child to observe parent-induced re-renders.',
        levelB: 'Pass children as props (slot composition) to prevent child re-renders.',
        levelC: 'Wrap heavy leaf components in React.memo.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev asks: "Why is MyList re-rendering? Its items prop didn\'t change!"\nfunction App() {\n  const [tick, setTick] = useState(0);\n  return <><button onClick={() => setTick(t => t + 1)}>Tick</button><MyList items={staticItems} /></>;\n}`,
        problem: 'App re-renders on tick; all children of App re-render by default.',
        fix: 'Wrap MyList in React.memo(MyList) if MyList is measurably slow.'
      },
      conceptualQuestion: {
        question: 'Will a child component re-render when its parent re-renders if the child has NO props?',
        options: [
          'No, React skips components without props.',
          'Yes, by default in React, when a parent component renders, all of its children re-render recursively.',
          'Only in development mode.',
          'Only if the child has useState.'
        ],
        correctIndex: 1,
        explanation: 'In React\'s default rendering model, parent re-renders cascade down through all descendant children unless halted by React.memo.'
      },
      codeReadingQuestion: {
        snippet: `const Child = memo(() => { console.log('Child'); return <div />; });`,
        question: 'When Parent re-renders, will this memoized Child re-render?',
        answer: 'No, because it has no props and is wrapped in React.memo.'
      },
      starterCode: `// Assignment: Implement evaluateRerenderReason\n// Identify whether a component will re-render:\n// evaluateRerenderReason({ stateChanged, parentRerendered, contextChanged, isMemoized, propsChanged })\n// 1. If stateChanged -> return { willRerender: true, reason: 'LOCAL_STATE_CHANGE' }\n// 2. If contextChanged -> return { willRerender: true, reason: 'CONTEXT_UPDATE' }\n// 3. If parentRerendered:\n//    a. If !isMemoized -> return { willRerender: true, reason: 'PARENT_RERENDER' }\n//    b. If isMemoized and propsChanged -> return { willRerender: true, reason: 'PROPS_CHANGED' }\n//    c. If isMemoized and !propsChanged -> return { willRerender: false, reason: 'MEMO_SKIPPED' }\n// 4. Otherwise return { willRerender: false, reason: 'IDLE' }\n\nexport function evaluateRerenderReason(scenario) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Cascades parent render when unmemoized',
          run: (fn) => {
            const res = fn({ stateChanged: false, parentRerendered: true, contextChanged: false, isMemoized: false, propsChanged: false });
            return res.willRerender === true && res.reason === 'PARENT_RERENDER';
          }
        },
        {
          name: 'Skips render when memoized and props unchanged',
          run: (fn) => {
            const res = fn({ stateChanged: false, parentRerendered: true, contextChanged: false, isMemoized: true, propsChanged: false });
            return res.willRerender === false && res.reason === 'MEMO_SKIPPED';
          }
        }
      ],
      hints: [
        'Check conditions in order: stateChanged, contextChanged, parentRerendered.'
      ],
      checklist: [
        'Handled local state updates',
        'Handled unmemoized child cascade',
        'Handled memoized prop equality bailout'
      ],
      revisionSummary: 'Components re-render from state changes, parent re-renders, or context updates.'
    },
    {
      id: 'p4-l5',
      slug: 'parent-child-rendering-behavior',
      title: 'Parent and Child Rendering Behavior & Slots',
      prerequisites: ['p4-l4', 'p1-l10'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the "Passing components as children/JSX slots" optimization.', 'Prevent child re-renders WITHOUT using React.memo.', 'Understand React element equality.'],
      explanation: 'You do not always need React.memo to prevent child re-renders! If you pass children as JSX (<Parent><Child /></Parent>), Child is created in the grandparent component. When Parent\'s local state updates, Parent re-renders, but its children prop still holds the EXACT same object reference created by the grandparent! React sees children has not changed and skips re-rendering Child!',
      whyItExists: 'Elegant architectural performance optimization without any memoization overhead.',
      syntaxRules: 'Lift the stateful logic into a wrapper component and pass the heavy subtree via {children}.',
      codeExample: `// Architectural Optimization: Move state down and pass children\nfunction ScrollWrapper({ children }) {\n  const [scrollY, setScrollY] = useState(0);\n  return (\n    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>\n      <ScrollProgress y={scrollY} />\n      {/* children is referentially identical between ScrollWrapper renders! */}\n      {children} {/* HeavyChild will NOT re-render on scroll! */}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 2: ScrollWrapper owns high-frequency scroll state.',
        'Line 7: {children} was passed from the caller; its reference does not change when ScrollWrapper updates.',
        'HeavyChild skips re-rendering completely without React.memo!'
      ],
      expectedBehavior: 'High-frequency scroll state updates without re-rendering the heavy content.',
      commonMistakes: ['Wrapping everything in React.memo when simply composing via children prop accomplishes the same cleaner result.', 'Instantiating JSX inside the wrapper render instead of accepting it as children.'],
      practiceLevels: {
        levelA: 'Refactor a slow mouse-tracker wrapper using {children} composition.',
        levelB: 'Profile render counts with React DevTools to confirm child bailout.',
        levelC: 'Build an expandable Sidebar wrapper that does not re-render MainLayout.'
      },
      debuggingChallenge: {
        brokenCode: `function ColorPicker() {\n  const [color, setColor] = useState('red');\n  return <div><input onChange={e => setColor(e.target.value)} /><HeavyTree /></div>;\n}`,
        problem: 'HeavyTree re-renders on every color input keystroke.',
        fix: 'Extract ColorPicker container and pass <HeavyTree /> as {children} from App.'
      },
      conceptualQuestion: {
        question: 'Why does passing a component as `{children}` prevent it from re-rendering when the parent container updates its state?',
        options: [
          'Because children are rendered in an iframe.',
          'The children JSX element object was created by the grandparent; when the parent re-renders, `props.children` holds the exact same object reference, so React skips it.',
          'Because children cannot have props.',
          'It is a Vite plugin.'
        ],
        correctIndex: 1,
        explanation: 'React compares props with Object.is. Since the children element object reference is unchanged, React skips re-rendering it.'
      },
      codeReadingQuestion: {
        snippet: `<Container><SlowComponent /></Container>`,
        question: 'If Container state updates, will SlowComponent re-render?',
        answer: 'No! SlowComponent was instantiated in the outer component, keeping its reference identical.'
      },
      starterCode: `// Assignment: Implement testElementReferenceBailout\n// Simulate React\'s element-reference bailout:\n// testElementReferenceBailout(prevChildrenProp, nextChildrenProp)\n// If prevChildrenProp === nextChildrenProp -> React bails out! return { reRendered: false, savedRender: true }\n// If references differ -> return { reRendered: true, savedRender: false }\n\nexport function testElementReferenceBailout(prevChildrenProp, nextChildrenProp) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Bails out when children reference is identical',
          run: (fn) => {
            const childObj = { type: 'HeavyComponent' };
            const res = fn(childObj, childObj);
            return res.reRendered === false && res.savedRender === true;
          }
        },
        {
          name: 'Re-renders when fresh child element object is created',
          run: (fn) => {
            const res = fn({ type: 'Comp' }, { type: 'Comp' });
            return res.reRendered === true && res.savedRender === false;
          }
        }
      ],
      hints: [
        'Check prevChildrenProp === nextChildrenProp.'
      ],
      checklist: [
        'Tested referential equality',
        'Returned accurate bailout result'
      ],
      revisionSummary: 'Passing components as children preserves element references, avoiding re-renders without React.memo.'
    },
    {
      id: 'p4-l6',
      slug: 'state-snapshots-batching',
      title: 'State Snapshots and Automatic Batching',
      prerequisites: ['p1-l16'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand how React treats state as a snapshot during render.', 'Explain React 18 automatic batching across timeouts, promises, and events.', 'Use flushSync when synchronous DOM reads are strictly required.'],
      explanation: 'In React, state variables are not mutable pointers; they are snapshots of values for that specific render. In React 18, automatic batching groups multiple state updates into a single re-render, whether they occur inside React event handlers, setTimeout callbacks, Promise.then chains, or native event listeners.',
      whyItExists: 'Drastically cuts down unnecessary render passes and prevents incomplete intermediate states.',
      syntaxRules: 'Multiple state updates in the same tick are batched automatically. To force an immediate synchronous flush (rare), use flushSync(() => setVal(...)).',
      codeExample: `// Automatic Batching in React 18\nfunction BatchingDemo() {\n  const [count, setCount] = useState(0);\n  const [flag, setFlag] = useState(false);\n\n  const handleClick = () => {\n    // Even inside async promises or timeouts, React 18 batches both updates into 1 render!\n    setTimeout(() => {\n      setCount(c => c + 1);\n      setFlag(f => !f);\n      // React re-renders ONLY ONCE for both updates!\n    }, 100);\n  };\n\n  return <button onClick={handleClick}>Click</button>;\n}`,
      lineByLine: [
        'Line 8: In React 17, timeouts caused two separate re-renders.',
        'In React 18+, automatic batching combines both updates into a single re-render.'
      ],
      expectedBehavior: 'A single render pass occurs after the timeout completes.',
      commonMistakes: ['Expecting count to equal 1 on the line directly below setCount(1).', 'Using flushSync unnecessarily, degrading performance.'],
      practiceLevels: {
        levelA: 'Count render passes when 3 state setters fire inside a Promise.',
        levelB: 'Use flushSync to synchronously scroll a message into view immediately after adding it.',
        levelC: 'Compare batching behavior between React 17 and React 18.'
      },
      debuggingChallenge: {
        brokenCode: `setCount(count + 1);\nif (count === 5) doSomething(); // count is STILL the old snapshot!`,
        problem: 'count does not change within the current render event handler.',
        fix: 'const nextCount = count + 1; setCount(nextCount); if (nextCount === 5) doSomething();'
      },
      conceptualQuestion: {
        question: 'What was the major change to batching introduced in React 18?',
        options: [
          'Batching was removed entirely.',
          'Automatic Batching now applies to ALL state updates, including inside Promises, setTimeout, and native event listeners (previously only React synthetic events were batched).',
          'Only numbers are batched.',
          'Batching requires a Vite plugin.'
        ],
        correctIndex: 1,
        explanation: 'React 18 expanded automatic batching everywhere: promises, timeouts, and native listeners now batch into a single render.'
      },
      codeReadingQuestion: {
        snippet: `import { flushSync } from 'react-dom';\nflushSync(() => setCount(1));\n// What does flushSync do?`,
        question: 'What is the purpose of flushSync?',
        answer: 'It forces React to flush pending state updates synchronously to the DOM immediately.'
      },
      starterCode: `// Assignment: Implement simulateBatchingQueue\n// Simulate React 18 state batching:\n// simulateBatchingQueue(updatesList)\n// updatesList: array of state setters called in a single microtask\n// Return: { totalStateSettersCalled: number, totalRendersTriggered: number }\n// If updatesList has 1 or more setters -> totalRendersTriggered is ALWAYS 1!\n// If updatesList is empty -> totalRendersTriggered is 0.\n\nexport function simulateBatchingQueue(updatesList) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Batches 5 updates into a single re-render',
          run: (fn) => {
            const list = ['setA', 'setB', 'setC', 'setD', 'setE'];
            const res = fn(list);
            return res.totalStateSettersCalled === 5 && res.totalRendersTriggered === 1;
          }
        },
        {
          name: 'Triggers 0 renders when empty',
          run: (fn) => {
            return fn([]).totalRendersTriggered === 0;
          }
        }
      ],
      hints: [
        'totalStateSettersCalled is updatesList.length; totalRendersTriggered is length > 0 ? 1 : 0.'
      ],
      checklist: [
        'Counted total setter calls',
        'Batched into single render',
        'Handled empty list'
      ],
      revisionSummary: 'React 18 batches all state updates across promises, timeouts, and events into a single render.'
    },
    {
      id: 'p4-l7',
      slug: 'why-state-updates-appear-async',
      title: 'Why State Updates Appear Asynchronous',
      prerequisites: ['p4-l6'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Explain why console.log after setState shows previous state.', 'Understand closures and render snapshots.', 'Use local variables when you need the new value immediately.'],
      explanation: 'Beginners frequently ask: "Why does console.log(count) show the old value right after setCount(count + 1)?" State updates are not asynchronous in the sense of a network Promise. Rather, `count` is a CONSTANT inside the current render function execution! Calling `setCount` requests a FUTURE render with the new value; it cannot alter the constant variable in the currently executing call stack.',
      whyItExists: 'Guarantees consistent state throughout a single render execution.',
      syntaxRules: 'If you need to use the next value immediately, store it in a local constant first: const next = count + 1; setCount(next); doSomething(next);',
      codeExample: `function Profile() {\n  const [role, setRole] = useState('guest');\n\n  const handlePromote = () => {\n    const nextRole = 'admin'; // Store in local variable!\n    setRole(nextRole);\n    saveToBackend(nextRole); // Use local variable, NOT role!\n    console.log(nextRole);   // 'admin'\n  };\n}`,
      lineByLine: [
        'Line 5: nextRole holds the calculated value.',
        'Line 6: Tells React to schedule nextRole for the next render.',
        'Line 7: Passes nextRole directly to external services immediately.'
      ],
      expectedBehavior: 'Local logic reads the new value immediately while React schedules the next render.',
      commonMistakes: ['Calling setState and immediately reading state expecting it to have changed.', 'Adding an unnecessary useEffect just to log state after it updates.'],
      practiceLevels: {
        levelA: 'Refactor a handler using a local constant before setState.',
        levelB: 'Pass calculated next values to 2 consecutive API calls.',
        levelC: 'Explain the mental model to a junior engineer.'
      },
      debuggingChallenge: {
        brokenCode: `const [step, setStep] = useState(1);\nconst next = () => {\n  setStep(step + 1);\n  analytics.track('Step ' + step); // Tracks old step!\n};`,
        problem: 'step holds the current snapshot value (1), so it tracks "Step 1" instead of "Step 2".',
        fix: 'const nextStep = step + 1; setStep(nextStep); analytics.track("Step " + nextStep);'
      },
      conceptualQuestion: {
        question: 'Why does `console.log(count)` immediately after `setCount(count + 1)` print the old count?',
        options: [
          'Because React is buggy.',
          'Because `count` is a local constant variable scoped to the current render function execution; calling setCount schedules a new render with a new count constant.',
          'Because setState runs on a web worker.',
          'Because JavaScript is single-threaded.'
        ],
        correctIndex: 1,
        explanation: 'State is immutable for the duration of the current render. Setting state schedules a future render with the new value.'
      },
      codeReadingQuestion: {
        snippet: `const handle = () => {\n  const next = val + 1;\n  setVal(next);\n  return next;\n};`,
        question: 'What is this pattern called?',
        answer: 'Pre-calculating next state into a local constant.'
      },
      starterCode: `// Assignment: Implement snapshotVsNextVal\n// Demonstrate local constant vs snapshot behavior:\n// snapshotVsNextVal(currentSnapshot, incrementAmount)\n// Return: { loggedInsideHandler: currentSnapshot, scheduledForNextRender: currentSnapshot + incrementAmount }\n\nexport function snapshotVsNextVal(currentSnapshot, incrementAmount) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Captures current snapshot and calculates scheduled next value',
          run: (fn) => {
            const res = fn(5, 1);
            return res.loggedInsideHandler === 5 && res.scheduledForNextRender === 6;
          }
        }
      ],
      hints: [
        'loggedInsideHandler is currentSnapshot; scheduledForNextRender is currentSnapshot + incrementAmount.'
      ],
      checklist: [
        'Captured snapshot in handler',
        'Computed next value for future render'
      ],
      revisionSummary: 'State variables are constants in the current render; use local variables if you need the updated value immediately.'
    },
    {
      id: 'p4-l8',
      slug: 'referential-equality-object-is',
      title: 'Referential Equality and Object.is',
      prerequisites: ['p0-l2', 'p1-l17'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master Object.is() equality semantics used by React.', 'Understand why {} !== {} and [] !== [].', 'Differentiate value equality (primitives) from reference equality (objects/arrays/functions).'],
      explanation: 'JavaScript has three equality operators: loose (==), strict (===), and Object.is. React uses Object.is() for state update bailouts and dependency comparisons. Primitives compare by value (42 === 42). Objects, arrays, and functions compare by MEMORY ADDRESS. Two objects with identical contents { a: 1 } and { a: 1 } are NOT equal in Object.is because they reside at different memory addresses.',
      whyItExists: 'Allows React to perform O(1) instantaneous shallow comparison rather than slow recursive deep diffs.',
      syntaxRules: 'Object.is(NaN, NaN) is true. Object.is(+0, -0) is false. For objects, Object.is tests if both reference the exact same memory pointer.',
      codeExample: `// Object.is Semantics in React\nObject.is(42, 42); // true\nObject.is('a', 'a'); // true\nObject.is(NaN, NaN); // true (differs from === which says false!)\nObject.is(+0, -0); // false (differs from === which says true!)\n\n// Object Reference Semantics\nconst a = { id: 1 };\nconst b = { id: 1 };\nObject.is(a, b); // FALSE! Different memory addresses!\nObject.is(a, a); // TRUE! Same memory address.`,
      lineByLine: [
        'Line 5-6: Object.is handles NaN and +0/-0 edge cases accurately.',
        'Line 11: a and b have identical properties, but Object.is evaluates to false because their memory addresses differ.'
      ],
      expectedBehavior: 'React checks Object.is(prev, next); if false, it re-renders.',
      commonMistakes: ['Expecting React to deep-compare object contents automatically.', 'Recreating inline object props style={{ color: "red" }} causing memoized children to fail shallow comparison.'],
      practiceLevels: {
        levelA: 'Demonstrate differences between === and Object.is for NaN and -0.',
        levelB: 'Prevent unnecessary re-renders by hoisting static objects outside the component.',
        levelC: 'Implement a shallowEqual(objA, objB) helper function.'
      },
      debuggingChallenge: {
        brokenCode: `const [list, setList] = useState([1, 2]);\nconst handleClick = () => {\n  list.push(3);\n  setList(list); // Object.is(list, list) === true -> NO RE-RENDER!\n};`,
        problem: 'Direct mutation keeps the exact same memory address; Object.is returns true, so React bails out.',
        fix: 'setList([...list, 3]);'
      },
      conceptualQuestion: {
        question: 'Why doesn\'t React deep-compare object properties by default instead of using `Object.is` reference comparison?',
        options: [
          'Because JavaScript cannot compare object keys.',
          'Deep comparison is O(n) recursive and can cause severe performance bottlenecks or infinite loops on circular objects, whereas Object.is reference checking is instantaneous O(1).',
          'Because React is written in C++.',
          'Deep comparison is forbidden by browser security.'
        ],
        correctIndex: 1,
        explanation: 'Instantaneous O(1) reference checking keeps React blazing fast; deep comparison on complex nested state is prohibitively expensive.'
      },
      codeReadingQuestion: {
        snippet: `Object.is(NaN, NaN) === true && (NaN === NaN) === false;`,
        question: 'Is this statement true or false in JavaScript?',
        answer: 'True! Object.is correctly recognizes NaN as equal to NaN, whereas === returns false.'
      },
      starterCode: `// Assignment: Implement shallowEqual\n// Build the shallow equality algorithm used by React.memo:\n// shallowEqual(objA, objB)\n// 1. If Object.is(objA, objB) -> true\n// 2. If either is null or not an object -> false\n// 3. If keys lengths differ -> false\n// 4. For every key in objA, check if objB has key and Object.is(objA[k], objB[k]) -> if any fails, false\n// 5. Return true\n\nexport function shallowEqual(objA, objB) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Returns true for shallow equal objects with distinct references',
          run: (fn) => {
            const a = { id: 1, name: 'Ada' };
            const b = { id: 1, name: 'Ada' };
            return fn(a, b) === true;
          }
        },
        {
          name: 'Returns false when properties differ or keys missing',
          run: (fn) => {
            const a = { id: 1, name: 'Ada' };
            const b = { id: 1, name: 'Grace' };
            return fn(a, b) === false;
          }
        }
      ],
      hints: [
        'Check Object.is first, then compare Object.keys length and properties.'
      ],
      checklist: [
        'Handled identical references with Object.is',
        'Compared keys length',
        'Validated 1-level shallow property equality'
      ],
      revisionSummary: 'React uses Object.is for instantaneous O(1) equality; immutable updates create new references to trigger updates.'
    },
    {
      id: 'p4-l9',
      slug: 'context-update-behavior-optimization',
      title: 'Context Update Behavior and Optimization',
      prerequisites: ['p3-l10', 'p4-l8'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Understand how Context updates bypass React.memo in consumers.', 'Split Context to avoid unnecessary re-renders (Separate State from Dispatch).', 'Memoize the context value object.'],
      explanation: 'When a Context Provider value changes, EVERY component that calls useContext(MyContext) will re-render! Even if a consumer component is wrapped in React.memo, Context bypasses memoization for all consumers. To optimize context: 1. Split state from dispatch. 2. Memoize the value object: useMemo(() => ({ state, dispatch }), [state]).',
      whyItExists: 'Prevents global context updates from re-rendering hundreds of unaffected consumer components.',
      syntaxRules: 'Never pass a new object literal value={{ a, b }} directly into Provider without useMemo, or it will re-render all consumers on every parent render.',
      codeExample: `// OPTIMIZED CONTEXT PROVIDER\nfunction CounterProvider({ children }) {\n  const [count, setCount] = useState(0);\n\n  // Memoize value so consumers only re-render when count actually changes!\n  const contextValue = useMemo(() => ({\n    count,\n    increment: () => setCount(c => c + 1)\n  }), [count]);\n\n  return (\n    <CounterContext.Provider value={contextValue}>\n      {children}\n    </CounterContext.Provider>\n  );\n}`,
      lineByLine: [
        'Line 6: useMemo caches the contextValue object.',
        'Prevents all consumers from re-rendering if CounterProvider renders due to other state.'
      ],
      expectedBehavior: 'Consumers re-render only when count changes, not on unrelated provider re-renders.',
      commonMistakes: ['Writing <Context.Provider value={{ count, dispatch }}> without useMemo.', 'Putting 10 unrelated pieces of state into a single mega-context.'],
      practiceLevels: {
        levelA: 'Wrap a Context Provider value in useMemo.',
        levelB: 'Split a UserSettingsContext into SettingsStateContext and SettingsDispatchContext.',
        levelC: 'Measure re-renders in a consumer component using React DevTools Highlight Updates.'
      },
      debuggingChallenge: {
        brokenCode: `// In Provider:\nreturn <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;\n// Every time Provider renders, new object literal forces ALL consumers to re-render!`,
        problem: 'Object literal has a new memory address on every render.',
        fix: 'const value = useMemo(() => ({ theme, toggle }), [theme]);'
      },
      conceptualQuestion: {
        question: 'Does wrapping a consumer component in `React.memo` prevent it from re-rendering when a Context it consumes updates?',
        options: [
          'Yes, React.memo blocks all updates.',
          'No, when a Context value changes, all components calling `useContext` for that context re-render regardless of `React.memo`.',
          'Only in Vite production mode.',
          'Only if the component has props.'
        ],
        correctIndex: 1,
        explanation: 'Context updates bypass React.memo; any component calling useContext will re-render when the provided value changes.'
      },
      codeReadingQuestion: {
        snippet: `// Why split StateContext and DispatchContext?`,
        question: 'What is the primary benefit of separating State Context from Dispatch Context?',
        answer: 'Components that only dispatch actions (buttons) never re-render when state changes, because dispatch references are permanent.'
      },
      starterCode: `// Assignment: Implement isContextUpdateNeeded\n// Check if a Context Provider should notify consumers:\n// isContextUpdateNeeded(prevValue, nextValue)\n// Return true if !Object.is(prevValue, nextValue), false otherwise.\n\nexport function isContextUpdateNeeded(prevValue, nextValue) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Notifies consumers when context reference changes',
          run: (fn) => {
            return fn({ theme: 'dark' }, { theme: 'dark' }) === true;
          }
        },
        {
          name: 'Bails out when context reference is identical',
          run: (fn) => {
            const val = { theme: 'dark' };
            return fn(val, val) === false;
          }
        }
      ],
      hints: [
        'Return !Object.is(prevValue, nextValue).'
      ],
      checklist: [
        'Compared using Object.is',
        'Returned notification boolean'
      ],
      revisionSummary: 'Memoize context values and split state from dispatch to prevent unnecessary consumer re-renders.'
    },
    {
      id: 'p4-l10',
      slug: 'pure-rendering-side-effects',
      title: 'Pure Rendering and Side Effects',
      prerequisites: ['p1-l18'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master the mathematical definition of a pure function: Same inputs -> Same outputs, zero side effects.', 'Identify subtle impurity bugs in React components.', 'Keep rendering deterministic across time and environments.'],
      explanation: 'React is designed around a functional programming concept: Pure Rendering. A component should behave like a mathematical formula: given the same props and state, it should ALWAYS return the exact same JSX. It must not modify variables created outside of it, call Math.random(), or query the current time during render.',
      whyItExists: 'Enables concurrent rendering, server components, caching, and reliable hot reloading.',
      syntaxRules: 'Components must be pure. Side effects belong strictly in event handlers or useEffect.',
      codeExample: `// IMPURE COMPONENT (DO NOT DO THIS!)\nlet guestCount = 0; // External mutation!\nfunction BadCup() {\n  guestCount = guestCount + 1; // Impure side effect in render!\n  return <h2>Tea cup for guest #{guestCount}</h2>;\n}\n\n// PURE COMPONENT\nfunction GoodCup({ guestNumber }) {\n  return <h2>Tea cup for guest #{guestNumber}</h2>;\n}`,
      lineByLine: [
        'Line 3: Mutating external guestCount causes non-deterministic output.',
        'Line 9: GoodCup depends purely on guestNumber prop; rendering it 10 times produces identical output.'
      ],
      expectedBehavior: 'Pure component can be rendered anywhere, anytime with completely predictable results.',
      commonMistakes: ['Calling Math.random() or Date.now() directly in render to generate IDs (use useId or crypto.randomUUID outside render).', 'Pushing items to an array passed in as a prop.'],
      practiceLevels: {
        levelA: 'Refactor an impure component using Date.now() in render.',
        levelB: 'Run in StrictMode and fix any component failing double-invocation test.',
        levelC: 'Test component idempotency with automated property testing.'
      },
      debuggingChallenge: {
        brokenCode: `function ItemsList({ items }) {\n  items.sort(); // Mutating prop during render!\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n}`,
        problem: 'items.sort() mutates the array in place, altering parent data during render.',
        fix: 'const sorted = [...items].sort();'
      },
      conceptualQuestion: {
        question: 'Which of the following operations makes a React component function IMPURE?',
        options: [
          'Multiplying a prop number by 2: const double = props.num * 2',
          'Mutating a variable declared outside the component function during the render phase',
          'Returning JSX from the function',
          'Using array.map() inside JSX'
        ],
        correctIndex: 1,
        explanation: 'Modifying variables outside the component function during render is an observable side effect that violates purity.'
      },
      codeReadingQuestion: {
        snippet: `function Card() { const id = Math.random(); return <div id={id} />; }`,
        question: 'Why is this impure and problematic?',
        answer: 'Every render generates a new random ID, breaking DOM reconciliation, hydration, and accessibility.'
      },
      starterCode: `// Assignment: Implement verifyPurityContract\n// Test if a function behaves as a pure function:\n// verifyPurityContract(fn, input)\n// Run fn(input) 3 times.\n// If all 3 runs produce identical stringified output AND global state was not mutated -> { isPure: true }\n// Else -> { isPure: false, failureRun: number }\n\nexport function verifyPurityContract(fn, input) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Verifies pure function repeatability',
          run: (fn) => {
            const pure = (x) => ({ val: x * 2 });
            return fn(pure, 10).isPure === true;
          }
        },
        {
          name: 'Detects impure non-repeatable function',
          run: (fn) => {
            let n = 0;
            const impure = () => ({ val: ++n });
            return fn(impure, 0).isPure === false;
          }
        }
      ],
      hints: [
        'Call fn(input) three times and compare outputs with JSON.stringify.'
      ],
      checklist: [
        'Executed 3 repeated runs',
        'Compared stringified outputs',
        'Reported purity verification'
      ],
      revisionSummary: 'React components must be pure functions of props and state with zero render-phase side effects.'
    },
    {
      id: 'p4-l11',
      slug: 'error-boundaries-resilience',
      title: 'Error Boundaries: Graceful Failure Handling',
      prerequisites: ['p4-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Catch JavaScript errors anywhere in the child component tree.', 'Display fallback UI instead of crashing the entire application into a white screen.', 'Log errors to monitoring services (Sentry/Datadog).'],
      explanation: 'In vanilla React, an unhandled JavaScript error inside a component unmounts the entire application, leaving the user with a blank white screen. An Error Boundary is a component that catches errors anywhere in its child tree, logs the error, and displays a fallback UI (like "Something went wrong. [Retry]").',
      whyItExists: 'Prevents a minor widget crash (e.g. broken ad or profile widget) from crashing the entire application.',
      syntaxRules: 'Error boundaries must currently be class components with componentDidCatch or static getDerivedStateFromError (or use the popular `react-error-boundary` package).',
      codeExample: `import React from 'react';\n\nexport class ErrorBoundary extends React.Component {\n  state = { hasError: false, error: null };\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error, errorInfo) {\n    console.error('Error caught by boundary:', error, errorInfo);\n  }\n\n  handleReset = () => {\n    this.setState({ hasError: false, error: null });\n  };\n\n  return() {\n    if (this.state.hasError) {\n      return (\n        <div className="error-fallback">\n          <h3>Something went wrong</h3>\n          <button onClick={this.handleReset}>Try Again</button>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}`,
      lineByLine: [
        'Line 6: static getDerivedStateFromError updates state to render fallback UI on the next render.',
        'Line 10: componentDidCatch logs the stack trace to reporting services.',
        'Line 24: Returns children normally when no errors occur.'
      ],
      expectedBehavior: 'Errors in children are isolated to the boundary; rest of the app continues working.',
      commonMistakes: ['Expecting Error Boundaries to catch errors in event handlers (use try/catch inside onClick instead; boundaries catch errors in render/effects).', 'Putting a single boundary around the entire app instead of isolating critical widgets.'],
      practiceLevels: {
        levelA: 'Wrap an unstable widget in an Error Boundary.',
        levelB: 'Add a "Try Again" recovery button that resets the boundary state.',
        levelC: 'Compare custom class boundary with the npm `react-error-boundary` library.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev asks: "Why didn\'t my ErrorBoundary catch this error?"\nconst handleClick = () => {\n  throw new Error('Button failed'); // In event handler!\n};`,
        problem: 'Error Boundaries do NOT catch errors inside event handlers.',
        fix: 'Use standard try/catch inside event handlers.'
      },
      conceptualQuestion: {
        question: 'Which errors are NOT caught by React Error Boundaries?',
        options: [
          'Errors during rendering and lifecycle methods.',
          'Errors inside event handlers, asynchronous code (e.g. setTimeout or fetch callbacks), and server-side rendering.',
          'Syntax errors in JSX.',
          'Errors inside child components.'
        ],
        correctIndex: 1,
        explanation: 'Error Boundaries catch errors during rendering, lifecycles, and constructors of the tree below them; they do not catch event handlers or async timeouts.'
      },
      codeReadingQuestion: {
        snippet: `<ErrorBoundary fallback={<WidgetFallback />}><Widget /></ErrorBoundary>`,
        question: 'What happens if Widget throws during render?',
        answer: 'React displays WidgetFallback, while the rest of the page remains intact.'
      },
      starterCode: `// Assignment: Implement simulateErrorBoundaryCatch\n// Simulates Error Boundary recovery logic:\n// simulateErrorBoundaryCatch(renderChildFn, fallbackUi)\n// Try executing renderChildFn().\n// If it returns successfully -> return { hasError: false, rendered: result }\n// If it throws an error -> return { hasError: true, rendered: fallbackUi, errorMessage: err.message }\n\nexport function simulateErrorBoundaryCatch(renderChildFn, fallbackUi) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Catches error and returns fallback UI',
          run: (fn) => {
            const crash = () => { throw new Error('Null pointer'); };
            const res = fn(crash, 'FALLBACK_UI');
            return res.hasError === true && res.rendered === 'FALLBACK_UI' && res.errorMessage === 'Null pointer';
          }
        },
        {
          name: 'Renders normal UI when child succeeds',
          run: (fn) => {
            const ok = () => 'NORMAL_CONTENT';
            const res = fn(ok, 'FALLBACK_UI');
            return res.hasError === false && res.rendered === 'NORMAL_CONTENT';
          }
        }
      ],
      hints: [
        'Use try/catch around renderChildFn().'
      ],
      checklist: [
        'Returned normal output on success',
        'Caught exception and rendered fallbackUi',
        'Captured error message'
      ],
      revisionSummary: 'Error boundaries catch rendering errors in child components and display fallback UI to prevent white screens.'
    },
    {
      id: 'p4-l12',
      slug: 'portals-rendering-outside-dom',
      title: 'Portals: Rendering Outside the Parent DOM',
      prerequisites: ['p1-l10'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Render child elements into a different DOM node using createPortal().', 'Solve CSS z-index, overflow: hidden, and stacking context issues for modals/tooltips.', 'Understand event bubbling through React Portals.'],
      explanation: 'Sometimes a child element needs to visually break out of its container—for example, a modal dialog, floating tooltip, or dropdown menu. If the parent has overflow: hidden or z-index constraints, the modal gets clipped. createPortal lets you render a component into any DOM node outside the parent hierarchy (like document.body) while retaining React parent-child context and event bubbling!',
      whyItExists: 'Escapes CSS clipping and stacking contexts for top-level overlays.',
      syntaxRules: 'createPortal(children, domNode). Events bubble through the React component tree, NOT the DOM tree!',
      codeExample: `import { createPortal } from 'react-dom';\n\nfunction Modal({ isOpen, onClose, children }) {\n  if (!isOpen) return null;\n\n  // Render directly into document.body, escaping parent overflow: hidden!\n  return createPortal(\n    <div className="modal-backdrop" onClick={onClose}>\n      <div className="modal-content" onClick={e => e.stopPropagation()}>\n        {children}\n      </div>\n    </div>,\n    document.body // Target DOM container node\n  );\n}`,
      lineByLine: [
        'Line 7: createPortal takes the JSX to render and the physical DOM destination.',
        'Line 13: document.body receives the modal DOM nodes, avoiding parent CSS clipping.',
        'Clicks inside Modal bubble up through the React parent component tree as normal!'
      ],
      expectedBehavior: 'Modal renders at top level of DOM, completely immune to parent CSS overflow constraints.',
      commonMistakes: ['Forgetting that events bubble according to the React tree, not the DOM tree.', 'Creating portal target containers dynamically without cleanup.'],
      practiceLevels: {
        levelA: 'Render a floating Toast notification into document.body using createPortal.',
        levelB: 'Build a Modal dialog that traps focus and closes on Escape.',
        levelC: 'Verify event bubbling from a portaled button up to its React parent.'
      },
      debuggingChallenge: {
        brokenCode: `function Modal() {\n  return createPortal(<div>Modal</div>, document.getElementById('modal-root'));\n  // If index.html is missing #modal-root, throws Target container is not a DOM element!\n}`,
        problem: 'Assumes DOM container exists without checking or creating it.',
        fix: 'Check if document.getElementById("modal-root") exists or default to document.body.'
      },
      conceptualQuestion: {
        question: 'How does event bubbling behave in a React Portal?',
        options: [
          'Events do not bubble at all out of a portal.',
          'Events bubble according to the React Virtual Component tree structure, NOT the physical DOM hierarchy.',
          'Events bubble to document.body only.',
          'Portals convert events to native promises.'
        ],
        correctIndex: 1,
        explanation: 'Even though a portal resides elsewhere in the real DOM, an event fired inside a portal bubbles up the React component tree.'
      },
      codeReadingQuestion: {
        snippet: `<div onClick={() => console.log('Parent Clicked')}>\n  {createPortal(<button>Click</button>, document.body)}\n</div>`,
        question: 'When the button in document.body is clicked, will "Parent Clicked" be logged?',
        answer: 'Yes! In React, events bubble up the virtual component tree, even across portals.'
      },
      starterCode: `// Assignment: Implement resolvePortalTarget\n// Validates and returns a safe DOM target for portals:\n// resolvePortalTarget(customContainerId)\n// 1. If customContainerId provided and node exists -> return { target: customContainerId, isBodyFallback: false }\n// 2. If node does not exist or not provided -> return { target: 'document.body', isBodyFallback: true }\n\nexport function resolvePortalTarget(customContainerId, existingElementIds = []) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Uses existing custom target element',
          run: (fn) => {
            const res = fn('modal-root', ['modal-root', 'app']);
            return res.target === 'modal-root' && res.isBodyFallback === false;
          }
        },
        {
          name: 'Falls back to body when target is missing',
          run: (fn) => {
            const res = fn('missing-id', ['app']);
            return res.target === 'document.body' && res.isBodyFallback === true;
          }
        }
      ],
      hints: [
        'Check existingElementIds.includes(customContainerId).'
      ],
      checklist: [
        'Resolved existing custom target',
        'Fell back to document.body when missing'
      ],
      revisionSummary: 'Portals render children into a different DOM destination to escape CSS clipping while preserving React event bubbling.'
    },
    {
      id: 'p4-l13',
      slug: 'suspense-and-fallback-ui',
      title: 'Suspense and Fallback UI',
      prerequisites: ['p4-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Wrap asynchronous components in <Suspense fallback={<Spinner />}>.', 'Coordinate loading states across nested boundaries.', 'Understand how Suspense integrates with data fetching and code-splitting.'],
      explanation: 'Suspense lets components "wait" for something (code chunks, data, assets) before they render, displaying a fallback UI (like a skeleton or spinner) in the meantime. Instead of every child managing its own isLoading boolean, Suspense handles loading state declaratively at the boundary level.',
      whyItExists: 'Eliminates cascading loading spinners and coordinates async UI states declaratively.',
      syntaxRules: '<Suspense fallback={<LoadingSkeleton />}> <AsyncComponent /> </Suspense>.',
      codeExample: `import { Suspense, lazy } from 'react';\n\nconst HeavyChart = lazy(() => import('./HeavyChart'));\n\nfunction AnalyticsPage() {\n  return (\n    <div>\n      <h1>Analytics</h1>\n      {/* Displays Skeleton while HeavyChart bundle is downloading */}\n      <Suspense fallback={<div className="skeleton">Loading Chart...</div>}>\n        <HeavyChart />\n      </Suspense>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 3: lazy() splits HeavyChart into a separate JavaScript bundle.',
        'Line 9: Suspense catches the pending Promise and renders fallback until loaded.',
        'Line 10: HeavyChart displays seamlessly once downloaded.'
      ],
      expectedBehavior: 'Fallback spinner displays until the asynchronous chunk resolves.',
      commonMistakes: ['Placing Suspense boundaries too high, hiding the entire screen when a single button loads.', 'Assuming Suspense catches regular fetch() without a Suspense-compatible resource loader.'],
      practiceLevels: {
        levelA: 'Wrap a lazy-loaded route in Suspense with a spinner fallback.',
        levelB: 'Nest Suspense boundaries so the header renders immediately while content loads.',
        levelC: 'Test Suspense behavior on Slow 3G network simulation.'
      },
      debuggingChallenge: {
        brokenCode: `const Lazy = lazy(() => import('./Comp'));\nfunction App() {\n  return <Lazy />; // Throws: A React component suspended while rendering, but no fallback UI was specified!\n}`,
        problem: 'Lazy components must always be wrapped in a <Suspense> boundary.',
        fix: 'Wrap with <Suspense fallback={<Spinner />}><Lazy /></Suspense>'
      },
      conceptualQuestion: {
        question: 'What is the purpose of `<Suspense>` in React?',
        options: [
          'To pause JavaScript execution with sleep().',
          'To declaratively specify a loading fallback UI while child components are waiting for asynchronous resources (like code chunks or data) to resolve.',
          'To handle JavaScript runtime errors.',
          'To animate page transitions.'
        ],
        correctIndex: 1,
        explanation: 'Suspense catches pending asynchronous promises from child components and displays the specified fallback UI until ready.'
      },
      codeReadingQuestion: {
        snippet: `<Suspense fallback="Loading..."><Profile /></Suspense>`,
        question: 'What happens when Profile finishes loading?',
        answer: 'React replaces "Loading..." with the rendered Profile component output.'
      },
      starterCode: `// Assignment: Implement resolveSuspenseBoundary\n// Simulate Suspense resolution:\n// resolveSuspenseBoundary(childrenStatus, fallbackContent)\n// childrenStatus: 'PENDING' | 'RESOLVED' | 'REJECTED'\n// 1. If 'PENDING' -> return { rendered: fallbackContent, isSuspended: true }\n// 2. If 'RESOLVED' -> return { rendered: 'CHILD_CONTENT', isSuspended: false }\n// 3. If 'REJECTED' -> throw new Error('Resource failed to load')\n\nexport function resolveSuspenseBoundary(childrenStatus, fallbackContent) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Displays fallback while children status is PENDING',
          run: (fn) => {
            const res = fn('PENDING', 'SPINNER');
            return res.rendered === 'SPINNER' && res.isSuspended === true;
          }
        },
        {
          name: 'Renders child content when RESOLVED',
          run: (fn) => {
            const res = fn('RESOLVED', 'SPINNER');
            return res.rendered === 'CHILD_CONTENT' && res.isSuspended === false;
          }
        }
      ],
      hints: [
        'Check childrenStatus with if/else or switch.'
      ],
      checklist: [
        'Rendered fallback on PENDING',
        'Rendered child content on RESOLVED',
        'Threw error on REJECTED'
      ],
      revisionSummary: 'Suspense declaratively displays fallback UI while child components await async resources.'
    },
    {
      id: 'p4-l14',
      slug: 'lazy-loading-code-splitting',
      title: 'Lazy Loading and Route Code Splitting',
      prerequisites: ['p4-l13', 'p0-l7'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Split application bundle into smaller on-demand chunks with React.lazy().', 'Implement route-based code splitting.', 'Reduce initial bundle size and Improve First Contentful Paint (FCP).'],
      explanation: 'Without code splitting, a user visiting your login page downloads the entire JavaScript bundle: admin dashboard, heavy charts, settings, and checkout code! React.lazy() dynamically imports components: const Admin = lazy(() => import("./Admin")). Vite splits Admin into its own separate chunk that is downloaded ONLY when the user navigates to the Admin page.',
      whyItExists: 'Drastically reduces initial page load times and mobile data consumption.',
      syntaxRules: 'const MyComponent = lazy(() => import("./MyComponent")). Must be wrapped in <Suspense>.',
      codeExample: `// Route-based code splitting\nimport { lazy, Suspense } from 'react';\nimport { Routes, Route } from 'react-router-dom';\n\n// Downloaded on-demand when route matches\nconst Dashboard = lazy(() => import('./routes/Dashboard'));\nconst Settings = lazy(() => import('./routes/Settings'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<PageSpinner />}>\n      <Routes>\n        <Route path="/dashboard" element={<Dashboard />} />\n        <Route path="/settings" element={<Settings />} />\n      </Routes>\n    </Suspense>\n  );\n}`,
      lineByLine: [
        'Line 6-7: Dynamic imports create distinct bundle chunks in Vite build output.',
        'Line 11: Suspense provides a loading fallback while the network downloads the chunk.'
      ],
      expectedBehavior: 'Initial bundle size drops significantly; routes download on demand.',
      commonMistakes: ['Calling lazy() inside a component render body (must be called at module top-level!).', 'Lazy loading 10-line tiny components where chunk HTTP overhead exceeds savings.'],
      practiceLevels: {
        levelA: 'Split a large modal into a lazy-loaded chunk loaded only on button click.',
        levelB: 'Configure route-based code splitting across 3 pages.',
        levelC: 'Inspect Vite build output chunks using rollup-plugin-visualizer.'
      },
      debuggingChallenge: {
        brokenCode: `function Page() {\n  const LazyComp = lazy(() => import('./Comp')); // Inside render!\n  return <LazyComp />;\n}`,
        problem: 'Re-declares lazy component on every render, resetting state and reloading chunk.',
        fix: 'Move const LazyComp = lazy(...) outside at module level.'
      },
      conceptualQuestion: {
        question: 'What is the primary performance metric improved by Route-based Code Splitting with `React.lazy`?',
        options: [
          'Server CPU speed.',
          'Initial JavaScript bundle size and First Contentful Paint (FCP), because the browser downloads only the code needed for the current screen.',
          'Database query latency.',
          'CSS animation smoothness.'
        ],
        correctIndex: 1,
        explanation: 'Code splitting avoids downloading the entire codebase upfront, speeding up initial page load.'
      },
      codeReadingQuestion: {
        snippet: `import('./HeavyMath').then(module => module.calculate());`,
        question: 'What JavaScript feature powers React.lazy under the hood?',
        answer: 'Dynamic ES module import() expressions returning a Promise.'
      },
      starterCode: `// Assignment: Implement estimateBundleSavings\n// Compute bundle size savings from code splitting:\n// estimateBundleSavings(routeChunks)\n// routeChunks: [{ route: string, sizeKb: number, isInitial: boolean }]\n// Return: { initialBundleSizeKb: number, deferredBundleSizeKb: number, savingsPercent: number }\n\nexport function estimateBundleSavings(routeChunks) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Calculates initial vs deferred bundle savings accurately',
          run: (fn) => {
            const chunks = [
              { route: '/', sizeKb: 100, isInitial: true },
              { route: '/admin', sizeKb: 300, isInitial: false },
              { route: '/charts', sizeKb: 100, isInitial: false }
            ];
            const res = fn(chunks);
            return res.initialBundleSizeKb === 100 && res.deferredBundleSizeKb === 400 && res.savingsPercent === 80;
          }
        }
      ],
      hints: [
        'Total is initial + deferred. savingsPercent = Math.round((deferred / total) * 100).'
      ],
      checklist: [
        'Summed initial chunks',
        'Summed deferred chunks',
        'Calculated savings percentage'
      ],
      revisionSummary: 'React.lazy dynamically splits bundles by route to minimize initial load time and optimize FCP.'
    },
    {
      id: 'p4-l15',
      slug: 'strictmode-unsafe-patterns',
      title: 'StrictMode and Detecting Unsafe Patterns',
      prerequisites: ['p1-l4', 'p3-l5'],
      estimatedDuration: '20 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify deprecated legacy APIs flagged by StrictMode.', 'Detect side effects in render functions.', 'Prepare applications for Concurrent React and future React upgrades.'],
      explanation: 'StrictMode is a development canary for future React releases. It detects: 1. Components with unsafe lifecycles (componentWillMount). 2. Legacy string ref API usage. 3. Deprecated findDOMNode usage. 4. Accidental side-effects during render (via double-invocation). 5. Missing effect cleanups.',
      whyItExists: 'Ensures your codebase adheres to modern React standards and remains upgrade-ready.',
      syntaxRules: 'Wrap your app or individual feature subtrees in <React.StrictMode>. Has zero overhead in production.',
      codeExample: `// StrictMode detects legacy patterns\n// <React.StrictMode>\n//   <LegacyComponent /> -> Console warning: componentWillReceiveProps is deprecated!\n// </React.StrictMode>`,
      lineByLine: [
        'StrictMode executes runtime checks in development only.',
        'Warns in the console with exact component stack traces.'
      ],
      expectedBehavior: 'Clean console without legacy warnings or memory leak alerts.',
      commonMistakes: ['Ignoring StrictMode warnings until major upgrades break the app.', 'Using legacy third-party libraries that rely on deprecated lifecycle methods.'],
      practiceLevels: {
        levelA: 'Identify deprecated lifecycles in legacy code.',
        levelB: 'Replace legacy string refs (ref="myInput") with modern useRef().',
        levelC: 'Wrap a legacy component in StrictMode to audit compatibility.'
      },
      debuggingChallenge: {
        brokenCode: `// Warning: findDOMNode is deprecated in StrictMode`,
        problem: 'findDOMNode broke component encapsulation and prevents concurrent tree optimization.',
        fix: 'Pass a ref directly to the child element or use forwardRef.'
      },
      conceptualQuestion: {
        question: 'Which of the following is flagged as unsafe by React StrictMode?',
        options: [
          'Using useState and useEffect.',
          'Using legacy string refs (ref="input") and deprecated lifecycle methods like componentWillMount.',
          'Using modern arrow functions.',
          'Importing CSS files.'
        ],
        correctIndex: 1,
        explanation: 'StrictMode flags legacy string refs, findDOMNode, and deprecated lifecycles that break concurrent features.'
      },
      codeReadingQuestion: {
        snippet: `// Does StrictMode alter the production bundle output?`,
        question: 'Does StrictMode run double-renders in production builds?',
        answer: 'No! StrictMode checks are stripped and completely inactive in production.'
      },
      starterCode: `// Assignment: Implement auditStrictModeWarnings\n// Inspect a component tree descriptor for legacy anti-patterns:\n// auditStrictModeWarnings(componentDescriptors)\n// componentDescriptors: [{ name: string, usesStringRefs: boolean, usesDeprecatedLifecycles: boolean, usesFindDOMNode: boolean }]\n// Return: { isStrictReady: boolean, flaggedComponents: string[] }\n\nexport function auditStrictModeWarnings(componentDescriptors) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Flags legacy anti-patterns',
          run: (fn) => {
            const list = [
              { name: 'ModernCard', usesStringRefs: false, usesDeprecatedLifecycles: false, usesFindDOMNode: false },
              { name: 'LegacyWidget', usesStringRefs: true, usesDeprecatedLifecycles: false, usesFindDOMNode: false }
            ];
            const res = fn(list);
            return res.isStrictReady === false && res.flaggedComponents.includes('LegacyWidget');
          }
        }
      ],
      hints: [
        'Filter for any descriptor where usesStringRefs, usesDeprecatedLifecycles, or usesFindDOMNode is true.'
      ],
      checklist: [
        'Identified legacy anti-patterns',
        'Flagged non-compliant components'
      ],
      revisionSummary: 'StrictMode identifies legacy APIs and side effects to keep applications ready for future React versions.'
    },
    {
      id: 'p4-l16',
      slug: 'react-compiler-and-manual-memo',
      title: 'React Compiler: What It Does and When Manual Memoization Matters',
      prerequisites: ['p3-l12', 'p3-l13'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Understand how the React Compiler (React Forget) automatically memoizes values and functions.', 'Learn what code patterns break the compiler (impure renders, mutations).', 'Recognize when manual optimization (React.memo, useMemo) remains relevant.'],
      explanation: 'The React Compiler is an optimizing compiler that automatically memoizes values, functions, and JSX elements at build time. It analyzes JavaScript semantics and automatically injects memoization where safe. However, the compiler RELIES on the Rules of React: if your component mutates objects during render, the compiler bails out or breaks! Understanding purity and manual memoization remains essential.',
      whyItExists: 'Eliminates the mental overhead of manually writing useMemo and useCallback across codebases.',
      syntaxRules: 'Strict adherence to React Rules (immutability, no render mutations, hook rules) is mandatory for the compiler to optimize your code.',
      codeExample: `// Before Compiler: Manual boilerplate\nconst memoizedValue = useMemo(() => compute(a), [a]);\nconst memoizedCallback = useCallback(() => doSomething(b), [b]);\n\n// With React Compiler: Write idiomatic JS!\n// The compiler automatically inserts memoization behind the scenes\nconst value = compute(a);\nconst handleClick = () => doSomething(b);`,
      lineByLine: [
        'Line 2-3: Manual memoization requires writing dependency arrays and wrapper hooks.',
        'Line 7-8: The compiler analyzes data flow and caches value and handleClick automatically.'
      ],
      expectedBehavior: 'High rendering performance without manual useMemo/useCallback boilerplate.',
      commonMistakes: ['Assuming the compiler fixes impure code (impure code causes compiler bailouts or runtime bugs).', 'Deleting all existing manual optimizations before compiler tooling is configured.'],
      practiceLevels: {
        levelA: 'Audit a component to ensure it complies with the Rules of React for compiler readiness.',
        levelB: 'Run the React Compiler ESLint plugin (eslint-plugin-react-compiler).',
        levelC: 'Compare compiled AST output against manual useMemo code.'
      },
      debuggingChallenge: {
        brokenCode: `function BadForCompiler({ list }) {\n  list.push('item'); // Mutation during render breaks compiler analysis!\n  return <div>{list.length}</div>;\n}`,
        problem: 'Render-phase mutations violate JavaScript semantics and cause the compiler to fail.',
        fix: 'const nextList = [...list, "item"];'
      },
      conceptualQuestion: {
        question: 'What is the primary requirement for a component to be safely optimized by the React Compiler?',
        options: [
          'It must be written in TypeScript.',
          'It must strictly adhere to the Rules of React (rendering purity, immutability, and hook rules).',
          'It must use Redux.',
          'It must be a class component.'
        ],
        correctIndex: 1,
        explanation: 'The compiler relies on predictable JavaScript semantics; adhering strictly to React purity rules is essential for automatic optimization.'
      },
      codeReadingQuestion: {
        snippet: `// eslint-plugin-react-compiler`,
        question: 'What does this ESLint plugin verify?',
        answer: 'It verifies whether components and hooks obey the strict Rules of React required by the compiler.'
      },
      starterCode: `// Assignment: Implement checkCompilerReadiness\n// Audit component characteristics for compiler compatibility:\n// checkCompilerReadiness(audit)\n// audit: { hasRenderMutations: boolean, breaksHookRules: boolean, hasSideEffectsInRender: boolean }\n// If any is true -> return { isReady: boolean, blockers: string[] }\n// If all false -> return { isReady: true, blockers: [] }\n\nexport function checkCompilerReadiness(audit) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Approves clean compiler-ready component',
          run: (fn) => {
            const res = fn({ hasRenderMutations: false, breaksHookRules: false, hasSideEffectsInRender: false });
            return res.isReady === true && res.blockers.length === 0;
          }
        },
        {
          name: 'Identifies compiler blockers',
          run: (fn) => {
            const res = fn({ hasRenderMutations: true, breaksHookRules: false, hasSideEffectsInRender: true });
            return res.isReady === false && res.blockers.length === 2;
          }
        }
      ],
      hints: [
        'Inspect each boolean flag and push descriptive blocker strings.'
      ],
      checklist: [
        'Checked for render mutations',
        'Checked for hook rule violations',
        'Returned compiler readiness status'
      ],
      revisionSummary: 'The React Compiler automates memoization, requiring strict adherence to rendering purity.'
    },
    {
      id: 'p4-l17',
      slug: 'common-rendering-misconceptions',
      title: 'Common Rendering Misconceptions Debunked',
      prerequisites: ['p4-l4', 'p4-l6'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Debunk top 5 rendering myths that trip up React developers.', 'Understand that re-rendering does not mean re-painting the entire DOM.', 'Cultivate an accurate mental model of the React engine.'],
      explanation: 'Let\'s debunk the top myths: Myth 1: "Re-rendering is slow." (Calling a component function takes microseconds; only DOM writes take milliseconds). Myth 2: "Re-rendering re-draws the real DOM." (React diffs in memory; if output is identical, ZERO DOM writes happen). Myth 3: "Props change triggers child renders." (Parent rendering triggers child renders by default). Myth 4: "setState is asynchronous like a Promise." (It is a synchronous request for a future render).',
      whyItExists: 'Replaces guessing and superstition with precise engineering mental models.',
      syntaxRules: 'Measure with React DevTools Profiler before jumping to premature optimizations.',
      codeExample: `// Myth Buster: Component renders, but DOM is NOT touched!\nfunction Parent() {\n  const [tick, setTick] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setTick(t => t + 1)}>Tick: {tick}</button>\n      <StaticHeader /> {/* Renders in JS memory, but DOM node is untouched! */}\n    </div>\n  );\n}\n\nfunction StaticHeader() {\n  return <h2>React Practice Academy</h2>;\n}`,
      lineByLine: [
        'Line 6: StaticHeader is called during Parent\'s render.',
        'React compares <h2> with previous <h2>, finds zero differences, and performs ZERO DOM operations!'
      ],
      expectedBehavior: 'Zero unnecessary browser layout operations or paints.',
      commonMistakes: ['Obsessing over re-renders that take 0.05ms in JavaScript.', 'Assuming every render call causes visible screen redraws.'],
      practiceLevels: {
        levelA: 'Use Chrome DevTools "Paint Flashing" to see real DOM paints vs React renders.',
        levelB: 'Measure execution time of 1,000 virtual element diffs.',
        levelC: 'Answer 5 common technical interview trap questions on rendering.'
      },
      debuggingChallenge: {
        brokenCode: `// Dev claims: "My whole app is repainting the DOM on every keystroke!"`,
        problem: 'Confusing a component function being invoked in JavaScript with the browser repainting the screen.',
        fix: 'Turn on Chrome DevTools Rendering -> Paint Flashing to see what actual DOM elements repaint.'
      },
      conceptualQuestion: {
        question: 'If a React component re-renders, does it always cause a repaint of the real browser DOM?',
        options: [
          'Yes, every re-render redraws the whole web page.',
          'No, React compares the virtual DOM output with the previous render; if the output HTML elements and attributes are identical, ZERO DOM writes or repaints occur.',
          'Only in Chrome.',
          'Yes, unless you use jQuery.'
        ],
        correctIndex: 1,
        explanation: 'Reconciliation diffs in-memory JS objects. If no differences are found, React performs zero DOM writes, avoiding browser repainting.'
      },
      codeReadingQuestion: {
        snippet: `// What tool reveals actual browser DOM repaints?`,
        question: 'Which browser DevTools feature flashes green when the real DOM repaints?',
        answer: 'Paint Flashing (under the Rendering tab in Chrome/Edge DevTools).'
      },
      starterCode: `// Assignment: Implement evaluateRenderingFactCheck\n// Fact check statements about React rendering:\n// evaluateRenderingFactCheck(statementId)\n// 1. 'RERENDER_ALWAYS_REPAINTS_DOM' -> false\n// 2. 'SETSTATE_RUNS_A_PROMISE' -> false\n// 3. 'PARENT_RERENDER_CASCADES_TO_CHILDREN_BY_DEFAULT' -> true\n// 4. 'KEYS_MUST_BE_GLOBALLY_UNIQUE_ACROSS_ENTIRE_APP' -> false (only among siblings!)\n// 5. 'STRICTMODE_RUNS_TWICE_ONLY_IN_DEVELOPMENT' -> true\n// Return: { statementId, isTrue: boolean, correction: string }\n\nexport function evaluateRenderingFactCheck(statementId) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Correctly debunk common rendering myths',
          run: (fn) => {
            const r1 = fn('RERENDER_ALWAYS_REPAINTS_DOM');
            const r2 = fn('PARENT_RERENDER_CASCADES_TO_CHILDREN_BY_DEFAULT');
            return r1.isTrue === false && r2.isTrue === true;
          }
        }
      ],
      hints: [
        'Check statementId against known facts and myths.'
      ],
      checklist: [
        'Identified fact vs myth',
        'Supplied engineering corrections'
      ],
      revisionSummary: 'Component re-renders run in memory; React only mutates the real DOM when virtual diffs detect changes.'
    },
    {
      id: 'p4-l18',
      slug: 'react-internals-mastery-synthesis',
      title: 'React Internals: Architecture Synthesis & Interview Drill',
      prerequisites: ['p4-l1', 'p4-l2', 'p4-l16'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: ['Synthesize Fiber nodes, work loop, priority lanes, and reconciliation.', 'Answer senior-level engineering interview questions with technical precision.', 'Diagnose real-world production rendering bottlenecks.'],
      explanation: 'A React Fiber is a plain JavaScript object that represents a unit of work. Fibers form a linked list (child, sibling, return) that allows React to pause, resume, and prioritize work. Priority lanes allow urgent interactions (typing, clicks) to jump ahead of low-priority background work. Synthesizing this knowledge elevates you from a code-writer to a senior React architect.',
      whyItExists: 'Enables high-level technical communication in senior software engineering interviews.',
      syntaxRules: 'Fiber architecture = Cooperative multitasking on the browser main thread.',
      codeExample: `// Conceptual Fiber Node Structure\nconst fiberNode = {\n  type: ComponentFunction,\n  key: 'user-1',\n  stateNode: domElement,\n  child: firstChildFiber,\n  sibling: nextSiblingFiber,\n  return: parentFiber,\n  memoizedState: hookLinkedList,\n  lanes: priorityBitmask\n};`,
      lineByLine: [
        'Line 2: type references the component function or HTML tag string.',
        'Line 4-7: Linked list pointers enable interruptible traversal of the component tree.',
        'Line 8: memoizedState holds the linked list of hooks for this component.'
      ],
      expectedBehavior: 'Interruptible, priority-based cooperative rendering.',
      commonMistakes: ['Describing the Virtual DOM as a rigid binary tree (it is a linked-list Fiber architecture).', 'Failing to mention priority lanes when explaining React 18+ concurrency.'],
      practiceLevels: {
        levelA: 'Explain the difference between a React Element and a Fiber node.',
        levelB: 'Trace how a hook linked list (memoizedState) is traversed during re-render.',
        levelC: 'Answer a 5-question mock technical interview on React internals.'
      },
      debuggingChallenge: {
        brokenCode: `// Interviewer asks: "How does React pause rendering without blocking the main thread?"`,
        problem: 'Vague answer like "It uses Web Workers".',
        fix: 'Explain that the Fiber work loop breaks rendering into small units of work, yielding control back to the browser via MessageChannel / scheduler when the frame budget expires.'
      },
      conceptualQuestion: {
        question: 'What data structure does React Fiber use to traverse the component tree in an interruptible manner?',
        options: [
          'A recursive call stack.',
          'A singly-linked list with `child`, `sibling`, and `return` pointers.',
          'An SQL database.',
          'A circular doubly-linked list.'
        ],
        correctIndex: 1,
        explanation: 'Fibers use child, sibling, and return pointers, enabling React to traverse the tree iteratively with a work loop that can pause and resume.'
      },
      codeReadingQuestion: {
        snippet: `while (workInProgress !== null && !shouldYield()) { workInProgress = performUnitOfWork(workInProgress); }`,
        question: 'What does this loop represent in React source code?',
        answer: 'The concurrent work loop, processing Fiber nodes until the frame budget expires (shouldYield() returns true).'
      },
      starterCode: `// Assignment: Implement simulateFiberTraversal\n// Simulate Fiber linked list traversal (child -> sibling -> return):\n// traverseFiberTree(rootFiber)\n// Fiber: { id: string, child?: Fiber, sibling?: Fiber, return?: Fiber }\n// Traverse nodes in preorder and return array of visited fiber IDs: string[]\n\nexport function simulateFiberTraversal(rootFiber) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Traverses parent, child, and sibling in correct order',
          run: (fn) => {
            const c2 = { id: 'Child2' };
            const c1 = { id: 'Child1', sibling: c2 };
            const root = { id: 'Root', child: c1 };
            c1.return = root;
            c2.return = root;
            const visited = fn(root);
            return JSON.stringify(visited) === JSON.stringify(['Root', 'Child1', 'Child2']);
          }
        }
      ],
      hints: [
        'Traverse node, then recurse on node.child, then node.sibling.'
      ],
      checklist: [
        'Traversed root node',
        'Traversed child pointers',
        'Traversed sibling pointers'
      ],
      revisionSummary: 'React Fiber uses linked-list traversal and priority lanes to enable interruptible concurrent rendering.'
    }
  ]
};
