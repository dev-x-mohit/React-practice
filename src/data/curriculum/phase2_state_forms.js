// Phase 2: State, Forms, and Component Design
export const phase2 = {
  id: 'phase-2',
  title: 'Phase 2 — State, Forms, and Component Design',
  description: 'Master advanced state architecture: derived state calculations, component identity and state resetting via keys, compound component patterns, dynamic form arrays, and complete form validation.',
  icon: 'Edit3',
  badge: 'Intermediate Architecture',
  estimatedHours: 10,
  lessons: [
    {
      id: 'p2-l1',
      slug: 'designing-reusable-components',
      title: 'Designing Reusable Components',
      prerequisites: ['p1-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Design clean, intuitive component API contracts.', 'Support variants, sizes, and polymorphic "as" prop.', 'Balance customizability with sensible defaults.'],
      explanation: 'A great reusable component provides sensible defaults for common use cases while exposing ergonomic props for customization. Designing clean component APIs prevents prop explosion (having 40 boolean flags like hasBorder, isBlue, showArrow) and makes design systems consistent.',
      whyItExists: 'Enables high developer velocity and visual consistency across large application surfaces.',
      syntaxRules: 'Use explicit variant props (variant="primary" | "secondary" | "danger") rather than conflicting booleans like isPrimary, isDanger.',
      codeExample: `// Clean Reusable Button API\nfunction Button({ variant = 'primary', size = 'md', as: Component = 'button', children, className = '', ...props }) {\n  return (\n    <Component\n      className={\`btn btn--\${variant} btn--\${size} \${className}\`.trim()}\n      {...props}\n    >\n      {children}\n    </Component>\n  );\n}`,
      lineByLine: [
        'Line 2: as: Component = "button" allows rendering an <a> tag when href is provided.',
        'Line 4: Composes variant and size classes deterministically.',
        'Line 5: ...props forwards valid HTML attributes like onClick, disabled, aria-label.'
      ],
      expectedBehavior: 'Component can render as a button, link, or custom container seamlessly.',
      commonMistakes: ['Creating conflicting boolean props like <Button isPrimary isDanger />.', 'Not forwarding standard HTML attributes via ...props.'],
      practiceLevels: {
        levelA: 'Build a Badge component with variants (success, warning, error).',
        levelB: 'Implement an IconButton with accessible aria-label requirement.',
        levelC: 'Build a polymorphic Box component supporting as="section" | "article" | "div".'
      },
      debuggingChallenge: {
        brokenCode: `function Card({ title, content, buttonText, onClick }) {\n  return <div className="card"><h3>{title}</h3><p>{content}</p><button onClick={onClick}>{buttonText}</button></div>;\n}`,
        problem: 'Inflexible rigid props. Cannot render custom children, links, or multiple buttons.',
        fix: 'Accept children prop and let caller compose content freely.'
      },
      conceptualQuestion: {
        question: 'Why is `variant="danger"` preferable over boolean flags like `isDanger={true}`?',
        options: [
          'Strings consume less RAM than booleans.',
          'A variant string enforces mutually exclusive options, preventing conflicting states like isPrimary && isDanger.',
          'Boolean props cannot be passed in JSX.',
          'Strings render faster in the DOM.'
        ],
        correctIndex: 1,
        explanation: 'Enforcing variants as an enum string prevents invalid simultaneous states where two conflicting boolean flags are both passed.'
      },
      codeReadingQuestion: {
        snippet: `const { as: Tag = 'div', ...rest } = props;\nreturn <Tag {...rest} />;`,
        question: 'What React design pattern is implemented here?',
        answer: 'The Polymorphic Component pattern, allowing callers to dynamically select the underlying HTML tag.'
      },
      starterCode: `// Assignment: Implement resolveComponentClasses\n// Build a class builder for a reusable UI component:\n// resolveComponentClasses({ base, variant, size, disabled, customClass })\n// 1. base is always included.\n// 2. variant -> \`\${base}--\${variant}\` (default: 'primary')\n// 3. size -> \`\${base}--\${size}\` (default: 'md')\n// 4. if disabled is true -> add 'is-disabled'\n// 5. append customClass if provided.\n// Return trimmed single string.\n\nexport function resolveComponentClasses({ base = 'btn', variant = 'primary', size = 'md', disabled = false, customClass = '' } = {}) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Constructs default class string',
          run: (fn) => {
            return fn() === 'btn btn--primary btn--md';
          }
        },
        {
          name: 'Applies custom variant, size, disabled flag, and customClass',
          run: (fn) => {
            const res = fn({ base: 'badge', variant: 'danger', size: 'lg', disabled: true, customClass: 'shadow-md' });
            return res === 'badge badge--danger badge--lg is-disabled shadow-md';
          }
        }
      ],
      hints: [
        'Collect valid class names in an array and join with " ".'
      ],
      checklist: [
        'Used default fallback parameters',
        'Added is-disabled conditionally',
        'Returned clean, whitespace-trimmed string'
      ],
      revisionSummary: 'Design reusable components with variant enums and attribute forwarding (...rest) for maximum ergonomics.'
    },
    {
      id: 'p2-l2',
      slug: 'props-versus-state',
      title: 'Props versus State: Clear Separation',
      prerequisites: ['p1-l9', 'p1-l15'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Differentiate between props (external configuration) and state (internal memory).', 'Decide definitively whether a piece of data belongs in props, state, or regular variables.'],
      explanation: 'Props are passed into a component from the outside (like function arguments) and are owned by the parent. State is managed internally inside the component (like local memory) and can change over time via user interaction.',
      whyItExists: 'Prevents state duplication, stale data copies, and tangled components.',
      syntaxRules: 'Ask three questions: 1. Does it remain unchanged over time? Not state. 2. Is it passed in from parent? Not state. 3. Can you compute it from existing props or state? Not state.',
      codeExample: `// Props: Passed from parent (immutable to child)\n// State: Maintained locally (mutable via setter)\nfunction SearchBox({ defaultPlaceholder, onSearch }) {\n  // State: Changes as user types\n  const [query, setQuery] = useState('');\n\n  return (\n    <input\n      placeholder={defaultPlaceholder} // Prop\n      value={query}                   // State\n      onChange={(e) => setQuery(e.target.value)}\n    />\n  );\n}`,
      lineByLine: [
        'Line 3: defaultPlaceholder is a prop configuration from parent.',
        'Line 5: query is local interactive state because it changes on keystroke.'
      ],
      expectedBehavior: 'Props drive initial/external behavior; state captures local user input.',
      commonMistakes: ['Copying props into state unnecessarily: const [title, setTitle] = useState(props.title); (unless intentionally ignoring future prop updates).', 'Storing derived calculations in state.'],
      practiceLevels: {
        levelA: 'Categorize 5 data items into Props vs State.',
        levelB: 'Refactor a component that unnecessarily copies props to state.',
        levelC: 'Implement an uncontrolled-with-default component pattern.'
      },
      debuggingChallenge: {
        brokenCode: `function UserBadge(props) {\n  const [name, setName] = useState(props.name);\n  // When props.name changes in parent, UserBadge continues showing old name!\n}`,
        problem: 'useState only initializes on mount; copying props into state causes stale sync bugs.',
        fix: 'Remove useState and render props.name directly!'
      },
      conceptualQuestion: {
        question: 'Which of the following belongs in React component state?',
        options: [
          'The current year (2026)',
          'User text currently typed into a comment box',
          'The total count of items in props.items.length',
          'A constant API endpoint URL'
        ],
        correctIndex: 1,
        explanation: 'The user text changes over time via user interaction and cannot be computed from anything else, making it genuine state.'
      },
      codeReadingQuestion: {
        snippet: `const fullName = \`\${props.firstName} \${props.lastName}\`;`,
        question: 'Should fullName be stored in useState?',
        answer: 'No! It can be computed on the fly during render from existing props.'
      },
      starterCode: `// Assignment: Implement classifyDataRole\n// Classify whether a data requirement belongs in 'PROP', 'STATE', or 'DERIVED_VARIABLE':\n// classifyDataRole({ changesOverTime: boolean, passedFromParent: boolean, computableFromExisting: boolean })\n// 1. If computableFromExisting is true -> 'DERIVED_VARIABLE'\n// 2. If passedFromParent is true and !changesOverTime -> 'PROP'\n// 3. If changesOverTime is true and !computableFromExisting -> 'STATE'\n// 4. Otherwise -> 'PROP'\n\nexport function classifyDataRole({ changesOverTime, passedFromParent, computableFromExisting }) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Correctly classifies derived variables and interactive state',
          run: (fn) => {
            const derived = fn({ changesOverTime: true, passedFromParent: false, computableFromExisting: true });
            const state = fn({ changesOverTime: true, passedFromParent: false, computableFromExisting: false });
            return derived === 'DERIVED_VARIABLE' && state === 'STATE';
          }
        },
        {
          name: 'Classifies passed parent configs as props',
          run: (fn) => {
            return fn({ changesOverTime: false, passedFromParent: true, computableFromExisting: false }) === 'PROP';
          }
        }
      ],
      hints: [
        'Check computableFromExisting first; it has priority.'
      ],
      checklist: [
        'Prioritized derived calculations',
        'Differentiated props from local state'
      ],
      revisionSummary: 'Never store in state what can be passed as props or derived during render.'
    },
    {
      id: 'p2-l3',
      slug: 'derived-state-vs-stored-state',
      title: 'Derived State versus Stored State',
      prerequisites: ['p2-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Eliminate redundant useState declarations by computing values on the fly.', 'Avoid desynchronization bugs caused by updating one state and forgetting another.', 'Identify when useMemo is actually needed for expensive derived state.'],
      explanation: 'Derived state is data that can be calculated directly from existing props or state during the render phase. For example, if you have a list of items and a search filter string in state, filteredItems is derived state! Creating a third state const [filteredItems, setFilteredItems] = useState([]) creates synchronization headaches.',
      whyItExists: 'Reduces state complexity, eliminates sync useEffects, and ensures data integrity.',
      syntaxRules: 'Don\'t put it in state if you can compute it during render: const total = items.reduce(...) or const filtered = items.filter(...).',
      codeExample: `// BAD: Redundant state requiring endless synchronization\n// const [items, setItems] = useState([...]);\n// const [total, setTotal] = useState(0); // BAD!\n// useEffect(() => setTotal(items.length), [items]); // TERRIBLE!\n\n// GOOD: Derive during render!\nfunction ItemSummary({ items }) {\n  const total = items.length; // Pure, instant calculation!\n  const activeCount = items.filter(i => i.active).length;\n  return <div>Total: {total}, Active: {activeCount}</div>;\n}`,
      lineByLine: [
        'Line 7: total is derived directly from items.length on every render.',
        'Line 8: activeCount is computed during render with zero chance of going out of sync.'
      ],
      expectedBehavior: 'Zero redundant re-renders and guaranteed data synchronization.',
      commonMistakes: ['Using useEffect to calculate derived state and call another setState (causes an extra render cycle and potential infinite loops).', 'Prematurely wrapping simple array filters in useMemo.'],
      practiceLevels: {
        levelA: 'Refactor a component with [count, setCount] and [isEven, setIsEven] to derive isEven.',
        levelB: 'Compute cart subtotal, tax, and total directly in render.',
        levelC: 'Derive multi-criteria filtered and sorted list during render.'
      },
      debuggingChallenge: {
        brokenCode: `function FullNameForm() {\n  const [first, setFirst] = useState('');\n  const [last, setLast] = useState('');\n  const [full, setFull] = useState('');\n  // setFirst('Ada'); -> full is still empty until next render!\n}`,
        problem: 'full is redundant state that lags behind first and last.',
        fix: 'Delete full state; compute const full = `${first} ${last}`.trim();'
      },
      conceptualQuestion: {
        question: 'What is the danger of using useEffect to sync a derived state variable (e.g. useEffect(() => setTotal(items.reduce(...)), [items]))?',
        options: [
          'It causes memory leaks on mobile devices.',
          'It introduces an unnecessary extra render pass, causes visual flicker, and can easily create infinite render loops.',
          'useEffect cannot access component state.',
          'It violates JavaScript syntax.'
        ],
        correctIndex: 1,
        explanation: 'Updating state inside an effect in response to other state causes a secondary re-render, degrades performance, and creates stale state windows.'
      },
      codeReadingQuestion: {
        snippet: `const hasSelected = selectedIds.length > 0;`,
        question: 'Is hasSelected stored state or derived state?',
        answer: 'Derived state, computed synchronously during render.'
      },
      starterCode: `// Assignment: Implement deriveDashboardMetrics\n// Given raw items: [{ id, price, status: 'active' | 'archived', category }]\n// and activeCategory: string ('all' or specific category)\n// Derive summary metrics WITHOUT creating redundant state:\n// 1. filteredItems: items matching activeCategory (or all if activeCategory === 'all')\n// 2. activeCount: count of filtered items with status === 'active'\n// 3. totalPrice: sum of prices of filtered active items\n// Return { count: number, activeCount: number, totalPrice: number }\n\nexport function deriveDashboardMetrics(items, activeCategory = 'all') {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Derives metrics accurately for category filter',
          run: (fn) => {
            const items = [
              { id: 1, price: 100, status: 'active', category: 'tech' },
              { id: 2, price: 50, status: 'archived', category: 'tech' },
              { id: 3, price: 200, status: 'active', category: 'books' }
            ];
            const tech = fn(items, 'tech');
            return tech.count === 2 && tech.activeCount === 1 && tech.totalPrice === 100;
          }
        },
        {
          name: 'Computes metrics for "all" category',
          run: (fn) => {
            const items = [
              { id: 1, price: 100, status: 'active', category: 'tech' },
              { id: 2, price: 200, status: 'active', category: 'books' }
            ];
            const all = fn(items, 'all');
            return all.count === 2 && all.activeCount === 2 && all.totalPrice === 300;
          }
        }
      ],
      hints: [
        'Filter items by category first, then compute activeCount and totalPrice.'
      ],
      checklist: [
        'Derived filtered subset',
        'Computed active item count',
        'Calculated total price accurately'
      ],
      revisionSummary: 'Compute values from props and state during render; avoid redundant state and syncing effects.'
    },
    {
      id: 'p2-l4',
      slug: 'choosing-correct-state-owner',
      title: 'Choosing the Correct State Owner',
      prerequisites: ['p2-l2', 'p1-l20'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Identify which component in the tree should hold state.', 'Colocate state as close as possible to where it is consumed.', 'Prevent over-lifting state to the top-level App component.'],
      explanation: 'Every piece of state should live in the component that directly cares about it, or in the lowest common ancestor of all components that need it. While beginners often lift all state up to App.jsx, colocating state keeps components self-contained and avoids re-rendering the entire app when a small dropdown toggles.',
      whyItExists: 'Maximizes component encapsulation and prevents excessive re-rendering of unrelated subtrees.',
      syntaxRules: 'Colocate state where it is used. Only lift state when two sibling components actually need to share it.',
      codeExample: `// COLOCATED STATE: Dropdown owns its own isOpen state\nfunction UserDropdown({ user }) {\n  const [isOpen, setIsOpen] = useState(false); // Colocated!\n  return (\n    <div>\n      <button onClick={() => setIsOpen(prev => !prev)}>{user.name}</button>\n      {isOpen && <DropdownMenu />}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 3: isOpen is stored inside UserDropdown because no other component needs to know if this dropdown is open.',
        'Line 6: Toggling isOpen re-renders only UserDropdown, leaving the rest of the page unaffected.'
      ],
      expectedBehavior: 'Re-renders are isolated to the minimal necessary subtree.',
      commonMistakes: ['Putting modal or dropdown isOpen state in global App state when only one button controls it.', 'Duplicating form input state in both child and parent.'],
      practiceLevels: {
        levelA: 'Colocate tooltip hover state inside a Tooltip component.',
        levelB: 'Determine state owner between a Header search bar and a Main results view.',
        levelC: 'Refactor a top-heavy App component by moving 5 local states down to their respective children.'
      },
      debuggingChallenge: {
        brokenCode: `// In App.jsx:\nconst [isSearchOpen, setIsSearchOpen] = useState(false);\nconst [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\nconst [isNotificationOpen, setIsNotificationOpen] = useState(false);\n// App re-renders every time any menu opens!`,
        problem: 'Over-lifting state causes root re-renders for private UI widgets.',
        fix: 'Move each open/closed state into its respective Navigation, Search, and Notification components.'
      },
      conceptualQuestion: {
        question: 'What is the guideline for state colocation?',
        options: [
          'All state must be stored in the root App component.',
          'Keep state as close as possible to where it is used. Only lift it when multiple components need access.',
          'State must always be moved to Redux or Zustand.',
          'Only numbers can be colocated; objects must be global.'
        ],
        correctIndex: 1,
        explanation: 'State colocation maintains encapsulation and avoids unnecessary parent-level re-renders.'
      },
      codeReadingQuestion: {
        snippet: `// If Component B and Component C need access to query, and Parent A renders both:`,
        question: 'Where should query state live?',
        answer: 'In Parent A (the lowest common ancestor).'
      },
      starterCode: `// Assignment: Implement recommendStatePlacement\n// Given a list of component IDs that need read or write access to a state variable:\n// consumers: string[] (e.g. ['FilterBar', 'ProductList'])\n// and the component tree hierarchy: { id: string, children: string[] }\n// Return { recommendedOwner: string, isColocated: boolean }\n// If consumers has only 1 component -> recommendedOwner is that component (isColocated: true)\n// If multiple -> recommendedOwner is their lowest common parent (isColocated: false)\n\nexport function recommendStatePlacement(consumers, tree) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Recommends colocation for single consumer',
          run: (fn) => {
            const tree = { id: 'App', children: ['Card'] };
            const res = fn(['Card'], tree);
            return res.recommendedOwner === 'Card' && res.isColocated === true;
          }
        },
        {
          name: 'Recommends lowest common ancestor for multiple consumers',
          run: (fn) => {
            const tree = { id: 'App', children: ['Header', 'Main'] };
            const res = fn(['Header', 'Main'], tree);
            return res.recommendedOwner === 'App' && res.isColocated === false;
          }
        }
      ],
      hints: [
        'If consumers.length === 1, return { recommendedOwner: consumers[0], isColocated: true }.'
      ],
      checklist: [
        'Detected single-component colocation',
        'Calculated common ancestor for multiple consumers'
      ],
      revisionSummary: 'Colocate state locally by default; lift to lowest common ancestor only when shared.'
    },
    {
      id: 'p2-l5',
      slug: 'sharing-state-between-sibling-components',
      title: 'Sharing State Between Sibling Components',
      prerequisites: ['p2-l4', 'p1-l20'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Wire sibling components together via parent callback props.', 'Establish bidirectional synchronization patterns through parent mediator.', 'Prevent stale prop states in siblings.'],
      explanation: 'Sibling components cannot directly communicate with one another in React\'s unidirectional architecture. To coordinate two siblings (such as a FilterSidebar and a ProductGrid), the parent component acts as a mediator: holding the shared state, passing it as props to Sibling B, and passing an updater callback to Sibling A.',
      whyItExists: 'Enables clean component coordination while maintaining strict unidirectional flow.',
      syntaxRules: 'Sibling A updates state via parent callback; parent re-renders and passes fresh state down to Sibling B.',
      codeExample: `// Parent acts as mediator\nfunction ShopPage() {\n  const [category, setCategory] = useState('all');\n\n  return (\n    <div className="layout">\n      {/* Sibling A triggers change */}\n      <CategoryFilter selected={category} onSelectCategory={setCategory} />\n      {/* Sibling B receives updated data */}\n      <ProductGrid activeCategory={category} />\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 2: Shared state lives in the parent ShopPage.',
        'Line 7: CategoryFilter receives current value and callback.',
        'Line 9: ProductGrid receives current value as a read-only prop.'
      ],
      expectedBehavior: 'Selecting a category in the filter updates the parent, which immediately passes the new category to the grid.',
      commonMistakes: ['Trying to emit custom browser DOM events between siblings.', 'Copying the category prop into local state inside ProductGrid.'],
      practiceLevels: {
        levelA: 'Connect an audio player slider (Sibling A) to a volume label (Sibling B).',
        levelB: 'Sync a master item checkbox with individual item checkboxes across components.',
        levelC: 'Build a pagination controller sibling driving a data table sibling.'
      },
      debuggingChallenge: {
        brokenCode: `function ProductGrid({ activeCategory }) {\n  const [cat, setCat] = useState(activeCategory); // Bug: Never updates when prop changes!\n  return <div>Category: {cat}</div>;\n}`,
        problem: 'useState is only initialized once; when Sibling A changes category, ProductGrid stays stuck on initial value.',
        fix: 'Use activeCategory prop directly without copying into useState.'
      },
      conceptualQuestion: {
        question: 'How do two sibling components communicate in React without global state?',
        options: [
          'Through a shared global window variable.',
          'Via the parent component: one sibling triggers a callback to update parent state, and the parent passes the new value down as a prop to the other sibling.',
          'Using the DOM dispatchEvent() API.',
          'Siblings cannot communicate in React.'
        ],
        correctIndex: 1,
        explanation: 'The parent serves as the mediator, holding state and distributing it via props while receiving updates via callbacks.'
      },
      codeReadingQuestion: {
        snippet: `<Tabs active={idx} onTabChange={setIdx}>\n  <TabList />\n  <TabPanels />\n</Tabs>`,
        question: 'Which component is the mediator here?',
        answer: 'The parent component managing `idx` and `setIdx`.'
      },
      starterCode: `// Assignment: Implement simulateParentMediator\n// Build an event bus mediator simulating parent-sibling coordination:\n// createMediator(initialState)\n// Returns: { getState: () => any, updateState: (updater) => void, subscribe: (listener) => void }\n// When Sibling A calls updateState(val or fn), state updates and all sibling listeners are notified with the latest state.\n\nexport function createMediator(initialState) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Coordinates state between siblings via mediator',
          run: (fn) => {
            const mediator = fn('all');
            let siblingBValue = null;
            mediator.subscribe((val) => { siblingBValue = val; });
            mediator.updateState('electronics');
            return mediator.getState() === 'electronics' && siblingBValue === 'electronics';
          }
        }
      ],
      hints: [
        'Store state in a closure variable and maintain an array of subscriber callbacks.'
      ],
      checklist: [
        'Maintained state internally',
        'Notified subscribers on update',
        'Supported state getters'
      ],
      revisionSummary: 'Siblings coordinate through their parent mediator via callbacks and props.'
    },
    {
      id: 'p2-l6',
      slug: 'preserving-and-resetting-component-state',
      title: 'Preserving and Resetting Component State',
      prerequisites: ['p1-l15', 'p1-l11'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand how React pairs state with a component\'s position in the UI tree.', 'Preserve state across renders when component remains at the same position.', 'Reset component state intentionally using the `key` prop.'],
      explanation: 'React preserves state as long as a component is rendered at the same position in the UI tree. If you render a different component at that position, or render the same component with a DIFFERENT `key`, React destroys the old component instance, discards its state, and mounts a fresh instance with initial state.',
      whyItExists: 'Allows clean form/editor resets when switching between records (e.g. switching from Editing User 1 to Editing User 2) without messy manual reset effects.',
      syntaxRules: 'To completely reset a component\'s state when an ID changes, pass the ID as its key: <UserProfileForm key={userId} userId={userId} />.',
      codeExample: `// Intentional State Reset with key\nfunction ChatContainer({ recipientId }) {\n  // Passing key={recipientId} tells React:\n  // "When recipientId changes, throw away previous draft state and create a new ChatInput!"\n  return <ChatInput key={recipientId} recipientId={recipientId} />;\n}`,
      lineByLine: [
        'Line 5: key={recipientId} signals to React that a change in recipientId represents a distinct component identity.',
        'When recipientId changes, React resets ChatInput\'s text state to "" automatically.'
      ],
      expectedBehavior: 'Previous chat draft does not accidentally leak to the new recipient.',
      commonMistakes: ['Writing complicated useEffects with 10 setState("") calls to reset forms when changing keys does it automatically.', 'Changing keys accidentally, causing unexpected state loss.'],
      practiceLevels: {
        levelA: 'Demonstrate how toggling an if/else condition resets local input state.',
        levelB: 'Use key={userId} to cleanly reset an EditProfile form when switching users.',
        levelC: 'Preserve state while conditionally altering layout positions.'
      },
      debuggingChallenge: {
        brokenCode: `// User switches from editing Post 1 to Post 2\nfunction PostEditor({ post }) {\n  const [text, setText] = useState(post.title); // Remains stuck on Post 1 title!\n}`,
        problem: 'PostEditor stays at the same position in the tree, so React preserves the old text state.',
        fix: 'Render with key={post.id}: <PostEditor key={post.id} post={post} />'
      },
      conceptualQuestion: {
        question: 'What is the idiomatic, built-in React way to completely reset all internal state of a component when an entity changes?',
        options: [
          'Call window.location.reload().',
          'Pass a new `key` prop (e.g., key={entity.id}) to the component.',
          'Call this.forceUpdate().',
          'Wrap the component in React.memo().'
        ],
        correctIndex: 1,
        explanation: 'Changing the key prop instructs React that this is a brand new component identity, destroying the old state and mounting fresh initial state.'
      },
      codeReadingQuestion: {
        snippet: `{isPerson ? <Counter key="person" /> : <Counter key="company" />}`,
        question: 'When isPerson toggles, is Counter state preserved or reset?',
        answer: 'Reset, because the different keys signal distinct component identities to React.'
      },
      starterCode: `// Assignment: Implement simulateComponentIdentity\n// Simulate React\'s state preservation / reset logic:\n// evaluateComponentInstance(prevTree, nextTree)\n// prevTree: { type: string, key?: string, state: any }\n// nextTree: { type: string, key?: string, defaultState: any }\n// Rules:\n// 1. If prevTree.type !== nextTree.type -> state is RESET to nextTree.defaultState, action: 'MOUNT_NEW'\n// 2. If prevTree.key !== nextTree.key -> state is RESET to nextTree.defaultState, action: 'KEY_RESET'\n// 3. If type and key match -> state is PRESERVED (prevTree.state), action: 'PRESERVE'\n// Return { state: any, action: string }\n\nexport function evaluateComponentInstance(prevTree, nextTree) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Preserves state when type and key match',
          run: (fn) => {
            const prev = { type: 'Counter', key: 'c1', state: 42 };
            const next = { type: 'Counter', key: 'c1', defaultState: 0 };
            const res = fn(prev, next);
            return res.state === 42 && res.action === 'PRESERVE';
          }
        },
        {
          name: 'Resets state when key changes',
          run: (fn) => {
            const prev = { type: 'ProfileForm', key: 'user_1', state: { draft: 'Old' } };
            const next = { type: 'ProfileForm', key: 'user_2', defaultState: { draft: '' } };
            const res = fn(prev, next);
            return res.state.draft === '' && res.action === 'KEY_RESET';
          }
        }
      ],
      hints: [
        'Check type first, then compare key properties.'
      ],
      checklist: [
        'Reset state on type mismatch',
        'Reset state on key change',
        'Preserved existing state when identity matched'
      ],
      revisionSummary: 'State is tied to position and key; pass key={id} to completely and declaratively reset component state.'
    },
    {
      id: 'p2-l7',
      slug: 'react-component-identity-and-keys',
      title: 'React Component Identity and Keys',
      prerequisites: ['p2-l6'],
      estimatedDuration: '20 mins',
      difficulty: 'Intermediate',
      objectives: ['Differentiate component identity from component position.', 'Never declare component functions inside another component function.', 'Avoid accidental component remounting.'],
      explanation: 'In React, component identity is determined by the component\'s function reference and its key. A dangerous anti-pattern is declaring a component function INSIDE another component: function Parent() { function Child() {} return <Child />; }. Every time Parent renders, a brand new Child function reference is created, causing React to treat it as a completely different component, remounting DOM and destroying state on every render!',
      whyItExists: 'Prevents focus loss, input resets, and severe performance degradation caused by accidental remounts.',
      syntaxRules: 'Always declare component functions at the top level of the module file, never nested inside another component body.',
      codeExample: `// TERRIBLE BUG: Nested component declaration\nfunction ParentForm() {\n  const [count, setCount] = useState(0);\n\n  // BAD: Redefined on EVERY render of ParentForm!\n  function BadNestedInput() {\n    return <input placeholder="Type here..." />;\n  }\n\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>\n      <BadNestedInput /> {/* Losing input focus on every count click! */}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 6: BadNestedInput is recreated as a new function reference every time ParentForm renders.',
        'Line 13: React compares OldComponent !== NewComponent and tears down the DOM node on every render.'
      ],
      expectedBehavior: 'Components declared at module scope retain identity and DOM focus across parent updates.',
      commonMistakes: ['Declaring sub-components inside parent component body.', 'Using dynamic keys that change on every render (e.g. key={Date.now()}).'],
      practiceLevels: {
        levelA: 'Identify and extract a nested component function to module scope.',
        levelB: 'Observe DOM focus loss when typing in a nested component and fix it.',
        levelC: 'Audit an entire feature folder for nested component declarations.'
      },
      debuggingChallenge: {
        brokenCode: `function Page() {\n  const Sub = () => <input autoFocus />;\n  return <Sub />;\n}`,
        problem: 'Sub has a new identity on every Page render, tearing down and recreating the input on every keystroke.',
        fix: 'Move const Sub = () => <input autoFocus />; outside Page at top level.'
      },
      conceptualQuestion: {
        question: 'Why does defining a component inside another component cause text inputs to lose focus on every keystroke?',
        options: [
          'Because browsers do not allow nested functions in HTML.',
          'Each parent render re-creates the child component function, causing React to see a new component type and completely unmount and remount the DOM element.',
          'Because useState is disabled inside nested functions.',
          'Because of CSS styling conflicts.'
        ],
        correctIndex: 1,
        explanation: 'React compares component types by referential equality. A function declared inside render has a new reference every render, forcing complete DOM remounting.'
      },
      codeReadingQuestion: {
        snippet: `// File scope vs Function scope:\nconst Button = () => <button />;\nfunction App() { return <Button />; }`,
        question: 'Is this component declaration safe against remounting bugs?',
        answer: 'Yes! Button is declared once at file scope, maintaining stable identity across renders.'
      },
      starterCode: `// Assignment: Implement detectNestedComponentAntiPattern\n// Write a code linter rule:\n// detectNestedComponentAntiPattern(ast)\n// ast = [{ scope: 'module' | 'function', name: string, isComponent: boolean }]\n// If any component (isComponent === true) has scope === 'function', return { hasError: true, offender: name, fix: 'Move ' + name + ' to module scope' }\n// Otherwise return { hasError: false }\n\nexport function detectNestedComponentAntiPattern(ast) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Detects nested component anti-pattern',
          run: (fn) => {
            const ast = [
              { scope: 'module', name: 'App', isComponent: true },
              { scope: 'function', name: 'ChildInput', isComponent: true }
            ];
            const res = fn(ast);
            return res.hasError === true && res.offender === 'ChildInput';
          }
        },
        {
          name: 'Passes clean module-scoped components',
          run: (fn) => {
            const ast = [
              { scope: 'module', name: 'Header', isComponent: true },
              { scope: 'module', name: 'Footer', isComponent: true }
            ];
            return fn(ast).hasError === false;
          }
        }
      ],
      hints: [
        'Find item where isComponent === true and scope === "function".'
      ],
      checklist: [
        'Detected function-scoped components',
        'Generated helpful refactoring guidance'
      ],
      revisionSummary: 'Never declare component functions inside other components; declare all components at module scope to preserve identity.'
    },
    {
      id: 'p2-l8',
      slug: 'form-input-patterns',
      title: 'Form Input Patterns: Text, Numbers, Dates',
      prerequisites: ['p1-l21'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Handle string-to-number coercions for numeric inputs (e.target.valueAsNumber).', 'Handle ISO date strings with <input type="date">.', 'Build controlled debounced search inputs.'],
      explanation: 'In HTML, input.value is always a string—even for type="number"! If you add 5 to "10", you get "105" instead of 15. Modern browsers provide e.target.valueAsNumber, or you must explicitly parse numbers with Number(e.target.value) or parseInt().',
      whyItExists: 'Prevents numeric coercion bugs and ensures form payloads match backend REST/JSON schemas.',
      syntaxRules: 'For numeric inputs, use e.target.valueAsNumber or Number(e.target.value). For date inputs, use standard YYYY-MM-DD ISO format.',
      codeExample: `function PriceInput({ price, onPriceChange }) {\n  return (\n    <input\n      type="number"\n      value={isNaN(price) ? '' : price}\n      onChange={(e) => {\n        const val = e.target.valueAsNumber;\n        onPriceChange(isNaN(val) ? 0 : val);\n      }}\n    />\n  );\n}`,
      lineByLine: [
        'Line 5: Safely displays empty string when price is NaN.',
        'Line 7: valueAsNumber extracts the actual float/integer, avoiding string concatenation bugs.'
      ],
      expectedBehavior: 'Numeric state is always stored as a true JavaScript number.',
      commonMistakes: ['Storing input type="number" values as strings and causing calculation errors: "50" + "10" = "5010".', 'Not handling empty input backspacing (which produces NaN in valueAsNumber).'],
      practiceLevels: {
        levelA: 'Build a number stepper with increment/decrement buttons.',
        levelB: 'Implement a date range selector validating that endDate >= startDate.',
        levelC: 'Build a formatted credit card input with 4-digit spacing.'
      },
      debuggingChallenge: {
        brokenCode: `function TipCalculator() {\n  const [bill, setBill] = useState(100);\n  const [tip, setTip] = useState(15);\n  const total = bill + tip; // Result: "10015"!\n}`,
        problem: 'Input onChange stored event.target.value as a string, causing string concatenation.',
        fix: 'setTip(Number(e.target.value))'
      },
      conceptualQuestion: {
        question: 'What is the return type of e.target.value on an <input type="number" /> in JavaScript?',
        options: [
          'Always a number',
          'Always a string',
          'A BigInt',
          'null if empty'
        ],
        correctIndex: 1,
        explanation: 'The standard DOM .value property is always a string. To get a number, use e.target.valueAsNumber or Number(e.target.value).'
      },
      codeReadingQuestion: {
        snippet: `const handleNum = (e) => setVal(e.target.value === '' ? 0 : Number(e.target.value));`,
        question: 'Why is the empty string check necessary here?',
        answer: 'When a user clears the input with backspace, Number("") evaluates to 0 rather than NaN, keeping state valid.'
      },
      starterCode: `// Assignment: Implement sanitizeFormInput\n// Converts raw input values into their proper typed representation:\n// sanitizeFormInput(type, rawValue)\n// 1. type === 'number' -> returns Number(rawValue) (or 0 if NaN/empty)\n// 2. type === 'boolean' -> returns Boolean(rawValue === true || rawValue === 'true')\n// 3. type === 'date' -> validates YYYY-MM-DD format; returns trimmed string or null if invalid\n// 4. type === 'text' -> returns trimmed string\n\nexport function sanitizeFormInput(type, rawValue) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Sanitizes numbers and booleans',
          run: (fn) => {
            return fn('number', '42.5') === 42.5 && fn('number', '') === 0 && fn('boolean', 'true') === true;
          }
        },
        {
          name: 'Validates and trims date and text strings',
          run: (fn) => {
            const validDate = fn('date', '2026-10-18');
            const invalidDate = fn('date', 'invalid-date');
            const text = fn('text', '   hello react   ');
            return validDate === '2026-10-18' && invalidDate === null && text === 'hello react';
          }
        }
      ],
      hints: [
        'Use regex /^\\d{4}-\\d{2}-\\d{2}$/ to validate date format.'
      ],
      checklist: [
        'Handled number conversion with 0 fallback',
        'Coerced boolean strings',
        'Validated date ISO pattern'
      ],
      revisionSummary: 'Always parse numeric inputs to true numbers; coerce inputs at the event boundary.'
    },
    {
      id: 'p2-l9',
      slug: 'checkbox-radio-select-textarea',
      title: 'Checkbox, Radio, Select, and Textarea Handling',
      prerequisites: ['p2-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Handle checkboxes using e.target.checked instead of e.target.value.', 'Manage radio button groups with shared name attributes.', 'Control single and multi-select dropdowns and textareas.'],
      explanation: 'Not all form inputs use value. Checkboxes store their boolean state in e.target.checked. In React, <textarea> uses standard value={text} props (unlike HTML which uses inner text). <select> uses value={selectedOption} directly on the select tag rather than selected attributes on options.',
      whyItExists: 'Provides consistent, declarative control across all HTML form element variants.',
      syntaxRules: 'Checkboxes: checked={isAgreed} onChange={e => setIsAgreed(e.target.checked)}. Radio: checked={role === "admin"} onChange={() => setRole("admin")}.',
      codeExample: `function PreferencesForm() {\n  const [prefs, setPrefs] = useState({\n    notifications: true,\n    theme: 'dark',\n    comments: ''\n  });\n\n  const handleChange = (e) => {\n    const { name, type, value, checked } = e.target;\n    setPrefs(prev => ({\n      ...prev,\n      [name]: type === 'checkbox' ? checked : value\n    }));\n  };\n\n  return (\n    <form>\n      {/* Checkbox */}\n      <input type="checkbox" name="notifications" checked={prefs.notifications} onChange={handleChange} />\n      {/* Select Dropdown */}\n      <select name="theme" value={prefs.theme} onChange={handleChange}>\n        <option value="light">Light</option>\n        <option value="dark">Dark</option>\n      </select>\n      {/* Textarea */}\n      <textarea name="comments" value={prefs.comments} onChange={handleChange} />\n    </form>\n  );\n}`,
      lineByLine: [
        'Line 9: type === "checkbox" ? checked : value branches dynamically for checkbox inputs.',
        'Line 20: <select value={prefs.theme}> declaratively binds the active selection.'
      ],
      expectedBehavior: 'All input types report their state into the unified prefs state object.',
      commonMistakes: ['Reading e.target.value on a checkbox (always returns "on", not a boolean!).', 'Putting selected attribute on <option> in React (React warns to use value on <select> instead).'],
      practiceLevels: {
        levelA: 'Build a Terms & Conditions checkbox that enables a Submit button.',
        levelB: 'Implement a survey with radio button choices.',
        levelC: 'Build a multi-select checkbox group managing an array of selected permissions.'
      },
      debuggingChallenge: {
        brokenCode: `function Checkbox() {\n  const [agree, setAgree] = useState(false);\n  return <input type="checkbox" value={agree} onChange={e => setAgree(e.target.value)} />;\n}`,
        problem: 'Checkbox uses checked prop, not value. e.target.value is the string "on".',
        fix: 'checked={agree} onChange={e => setAgree(e.target.checked)}'
      },
      conceptualQuestion: {
        question: 'Which property on the event target holds the state of an <input type="checkbox">?',
        options: ['e.target.value', 'e.target.checked', 'e.target.selected', 'e.target.status'],
        correctIndex: 1,
        explanation: 'e.target.checked contains the true/false boolean state of checkboxes.'
      },
      codeReadingQuestion: {
        snippet: `<textarea>{content}</textarea>`,
        question: 'What is wrong with this React code?',
        answer: 'In React, <textarea> should use the value prop (<textarea value={content} />) rather than nested children.'
      },
      starterCode: `// Assignment: Implement updateGenericFormField\n// Build the generic change handler logic:\n// updateGenericFormField(currentFormData, eventTarget)\n// eventTarget = { name: string, type: string, value: string, checked?: boolean }\n// 1. If type === 'checkbox', update [name] to eventTarget.checked\n// 2. Otherwise update [name] to eventTarget.value\n// Return new updated object without mutating currentFormData.\n\nexport function updateGenericFormField(currentFormData, eventTarget) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Updates checkbox using checked boolean',
          run: (fn) => {
            const initial = { subscribe: false, role: 'viewer' };
            const next = fn(initial, { name: 'subscribe', type: 'checkbox', value: 'on', checked: true });
            return next.subscribe === true && next.role === 'viewer' && initial.subscribe === false;
          }
        },
        {
          name: 'Updates text/select fields using value string',
          run: (fn) => {
            const initial = { subscribe: true, role: 'viewer' };
            const next = fn(initial, { name: 'role', type: 'select-one', value: 'admin' });
            return next.role === 'admin' && next.subscribe === true;
          }
        }
      ],
      hints: [
        'Return { ...currentFormData, [eventTarget.name]: eventTarget.type === "checkbox" ? eventTarget.checked : eventTarget.value }.'
      ],
      checklist: [
        'Handled checkbox type branch',
        'Handled standard value branch',
        'Preserved immutability'
      ],
      revisionSummary: 'Use checked for checkboxes and value for select and textarea; handle dynamically with type check.'
    },
    {
      id: 'p2-l10',
      slug: 'form-validation-and-error-messages',
      title: 'Form Validation and Error Messages',
      prerequisites: ['p2-l9'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Implement touched/dirty field tracking to prevent premature error yelling.', 'Validate fields onBlur, onChange, and onSubmit.', 'Display accessible error messages using aria-invalid and aria-describedby.'],
      explanation: 'Great form UX requires considerate validation. Showing an error message the second a user clicks into a field ("Yelling early") causes frustration. Instead, track touched state ({ [field]: boolean }): only show error messages if the field has been touched (onBlur) or if the form has been submitted.',
      whyItExists: 'Delivers professional, accessible, and user-friendly form interactions.',
      syntaxRules: 'Show error when: touched[field] && errors[field]. Associate error with input via aria-describedby="field-error".',
      codeExample: `function EmailField({ value, onChange }) {\n  const [touched, setTouched] = useState(false);\n  const error = !value ? 'Required' : !value.includes('@') ? 'Invalid email' : null;\n  const showError = touched && Boolean(error);\n\n  return (\n    <div className="field">\n      <input\n        value={value}\n        onChange={onChange}\n        onBlur={() => setTouched(true)}\n        aria-invalid={showError}\n        aria-describedby={showError ? 'email-err' : undefined}\n      />\n      {showError && <span id="email-err" className="err-msg">{error}</span>}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 2: touched tracks whether the user has interacted with the input.',
        'Line 3: error is derived synchronously from value without redundant state.',
        'Line 4: showError triggers only after user leaves the field (onBlur).',
        'Line 11-12: ARIA attributes communicate error status to screen readers.'
      ],
      expectedBehavior: 'Errors appear only after user interaction or on attempted form submit.',
      commonMistakes: ['Validating only on submit, forcing users to guess requirements.', 'Flashing red errors on initial mount before user types anything.'],
      practiceLevels: {
        levelA: 'Add onBlur touched tracking to a password input.',
        levelB: 'Implement live password strength indicator with 4 criteria checks.',
        levelC: 'Build an asynchronous username availability validator with debounce.'
      },
      debuggingChallenge: {
        brokenCode: `function Input({ val }) {\n  return <div><input value={val} />{!val && <span>Required!</span>}</div>;\n}`,
        problem: 'Error "Required!" displays immediately on mount when form is empty.',
        fix: 'Add touched state onBlur; display error only when touched && !val.'
      },
      conceptualQuestion: {
        question: 'What is the purpose of tracking the "touched" state of an input in form validation?',
        options: [
          'To detect if the user has a touchscreen device.',
          'To avoid showing validation errors before the user has had a chance to interact with or leave the field.',
          'To encrypt the keystrokes.',
          'To send analytics to Google.'
        ],
        correctIndex: 1,
        explanation: 'Tracking touched prevents premature error messages from displaying on virgin, unvisited fields.'
      },
      codeReadingQuestion: {
        snippet: `<input aria-invalid={Boolean(errors.email)} aria-describedby="email-error" />`,
        question: 'Why are these ARIA attributes important?',
        answer: 'They inform assistive technologies and screen readers that the input has an error and connect the error text to the input.'
      },
      starterCode: `// Assignment: Implement evaluateFormErrors\n// Build a validation engine evaluateFormErrors(values, touched, rules)\n// values = { email, password }\n// touched = { email: boolean, password: boolean }\n// rules = { [field]: (val) => string | null }\n// Return { errors: Record<string, string>, visibleErrors: Record<string, string>, isValid: boolean }\n// visibleErrors only includes errors for fields where touched[field] === true.\n\nexport function evaluateFormErrors(values, touched, rules) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Filters visibleErrors to only touched fields',
          run: (fn) => {
            const values = { email: 'bad', password: '123' };
            const touched = { email: true, password: false };
            const rules = {
              email: (v) => v.includes('@') ? null : 'Invalid email',
              password: (v) => v.length >= 8 ? null : 'Too short'
            };
            const res = fn(values, touched, rules);
            return res.isValid === false && res.errors.email === 'Invalid email' && res.visibleErrors.email === 'Invalid email' && res.visibleErrors.password === undefined;
          }
        }
      ],
      hints: [
        'Run rules on each field to populate errors; if touched[field] is true, copy to visibleErrors.'
      ],
      checklist: [
        'Executed validation rules for all fields',
        'Separated internal errors from visibleErrors',
        'Derived isValid flag'
      ],
      revisionSummary: 'Track touched state onBlur to prevent premature error displays; connect errors with aria-invalid.'
    },
    {
      id: 'p2-l11',
      slug: 'dynamic-fields-and-field-arrays',
      title: 'Dynamic Fields and Field Arrays',
      prerequisites: ['p1-l19', 'p1-l11'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Render dynamic lists of inputs (e.g. multiple phone numbers, line items).', 'Add, remove, and reorder fields immutably.', 'Assign unique, stable IDs (crypto.randomUUID()) to dynamic form rows.'],
      explanation: 'Real-world forms frequently require dynamic lists: adding multiple invitees, multiple work experiences, or line items in an invoice. In React, dynamic field arrays are stored in state as an array of objects: [{ id: "uuid-1", name: "", email: "" }]. Each row must have a permanent unique ID (NOT array index) to prevent input corruption when deleting rows.',
      whyItExists: 'Enables complex data entry forms without arbitrary field limits.',
      syntaxRules: 'Always generate a stable unique ID when creating a new row (e.g., crypto.randomUUID()). Never use array index as key.',
      codeExample: `function ExperienceForm() {\n  const [rows, setRows] = useState([\n    { id: 'exp-1', company: '', role: '' }\n  ]);\n\n  const addRow = () => {\n    setRows(prev => [...prev, { id: crypto.randomUUID(), company: '', role: '' }]);\n  };\n\n  const removeRow = (id) => {\n    setRows(prev => prev.filter(r => r.id !== id));\n  };\n\n  const updateRow = (id, field, value) => {\n    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));\n  };\n\n  return (\n    <div>\n      {rows.map((row) => (\n        <div key={row.id}>\n          <input value={row.company} onChange={e => updateRow(row.id, 'company', e.target.value)} />\n          <button onClick={() => removeRow(row.id)}>Remove</button>\n        </div>\n      ))}\n      <button onClick={addRow}>Add Experience</button>\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 7: crypto.randomUUID() generates a permanent stable key for the new row.',
        'Line 11: filter removes the target row immutably.',
        'Line 15: map updates the specific field on the targeted row.',
        'Line 20: key={row.id} ensures inputs maintain focus and correct identity on deletion.'
      ],
      expectedBehavior: 'Deleting any row smoothly removes that row without shuffling text between other inputs.',
      commonMistakes: ['Using array index as key={index}. When row 0 is deleted, row 1\'s input retains the DOM state of row 0!', 'Mutating row objects directly: rows[i].company = val.'],
      practiceLevels: {
        levelA: 'Build an invoice line-item builder with item name, quantity, price.',
        levelB: 'Implement reordering buttons (Move Up / Move Down) for list items.',
        levelC: 'Calculate total order price dynamically as line items are edited.'
      },
      debuggingChallenge: {
        brokenCode: `const remove = (index) => {\n  items.splice(index, 1); // Mutates state array in place!\n  setItems(items);\n};`,
        problem: 'Direct mutation; React does not detect reference change and bails out.',
        fix: 'setItems(prev => prev.filter((_, i) => i !== index));'
      },
      conceptualQuestion: {
        question: 'Why is it critical to assign a unique ID (like crypto.randomUUID()) to each row in a dynamic field array instead of using the array index?',
        options: [
          'Because React crashes if index is used.',
          'If a user removes an item from the middle or top of the list, index-based keys cause React to reuse DOM nodes, transferring input values and cursor focus to the wrong row.',
          'Because UUIDs are smaller than numbers.',
          'Because array indexes cannot be converted to strings.'
        ],
        correctIndex: 1,
        explanation: 'Using array index confuses React\'s reconciliation when items are deleted or reordered, leading to corrupted input state.'
      },
      codeReadingQuestion: {
        snippet: `setRows(prev => prev.filter(r => r.id !== targetId));`,
        question: 'What operation does this perform?',
        answer: 'Immutably removes the item with targetId from the rows state array.'
      },
      starterCode: `// Assignment: Implement manageFieldArray\n// Build a reducer helper for dynamic field arrays:\n// manageFieldArray(currentList, action)\n// Actions:\n// 1. { type: 'ADD', id: string, initialValues: object } -> appends new item { id, ...initialValues }\n// 2. { type: 'REMOVE', id: string } -> removes item by id\n// 3. { type: 'UPDATE', id: string, field: string, value: any } -> updates field on item\n// 4. { type: 'MOVE', fromIndex: number, toIndex: number } -> reorders items\n// Return new array without mutating input.\n\nexport function manageFieldArray(currentList, action) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Adds and updates items immutably',
          run: (fn) => {
            const list = [{ id: '1', name: 'Alpha' }];
            const added = fn(list, { type: 'ADD', id: '2', initialValues: { name: 'Beta' } });
            const updated = fn(added, { type: 'UPDATE', id: '2', field: 'name', value: 'Beta 2.0' });
            return added.length === 2 && updated[1].name === 'Beta 2.0' && list.length === 1;
          }
        },
        {
          name: 'Removes item and handles move reordering',
          run: (fn) => {
            const list = [{ id: '1' }, { id: '2' }, { id: '3' }];
            const removed = fn(list, { type: 'REMOVE', id: '2' });
            const moved = fn(list, { type: 'MOVE', fromIndex: 0, toIndex: 2 });
            return removed.length === 2 && moved[2].id === '1' && moved[0].id === '2';
          }
        }
      ],
      hints: [
        'For MOVE, clone array: const copy = [...currentList]; const [item] = copy.splice(fromIndex, 1); copy.splice(toIndex, 0, item); return copy;'
      ],
      checklist: [
        'Implemented ADD, REMOVE, UPDATE, MOVE',
        'Maintained array immutability',
        'Preserved unique IDs'
      ],
      revisionSummary: 'Dynamic field arrays require stable unique IDs (crypto.randomUUID()) and immutable array manipulation.'
    },
    {
      id: 'p2-l12',
      slug: 'form-submission-states',
      title: 'Form Submission States: Idle, Submitting, Success, Error',
      prerequisites: ['p2-l10'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Model form submission states as a state machine: idle | submitting | success | error.', 'Disable inputs and buttons during active submission.', 'Provide clear visual feedback and recovery actions on network error.'],
      explanation: 'Forms have distinct lifecycles. Instead of creating 5 disconnected booleans (isLoading, isSuccess, isError, isFinished), senior engineers model submission state as a finite union status: "idle" | "submitting" | "success" | "error". This prevents impossible states (like being both "submitting" and "success" at the same time).',
      whyItExists: 'Prevents duplicate submissions, disables controls during flight, and handles errors gracefully.',
      syntaxRules: 'Always disable the submit button while status === "submitting" to prevent double-clicks from firing duplicate requests.',
      codeExample: `function CheckoutForm({ onCheckout }) {\n  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'\n  const [errorMessage, setErrorMessage] = useState(null);\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    if (status === 'submitting') return; // Double-click guard\n\n    setStatus('submitting');\n    try {\n      await onCheckout();\n      setStatus('success');\n    } catch (err) {\n      setErrorMessage(err.message);\n      setStatus('error');\n    }\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <button type="submit" disabled={status === 'submitting'}>\n        {status === 'submitting' ? 'Processing...' : 'Complete Purchase'}\n      </button>\n      {status === 'error' && <div className="alert-error">{errorMessage}</div>}\n      {status === 'success' && <div className="alert-success">Order placed successfully!</div>}\n    </form>\n  );\n}`,
      lineByLine: [
        'Line 2: Single status state guarantees mutually exclusive lifecycles.',
        'Line 7: Guard prevents duplicate clicks while network request is in flight.',
        'Line 19: Button is disabled during submission with active loading text.'
      ],
      expectedBehavior: 'User receives continuous feedback and cannot submit twice.',
      commonMistakes: ['Leaving submit button enabled during async request (users double-click, charging credit cards twice!).', 'Using conflicting booleans: const [isLoading, setIsLoading] and const [isSuccess, setIsSuccess].'],
      practiceLevels: {
        levelA: 'Disable a submit button and show a spinner during setTimeout simulation.',
        levelB: 'Implement an error retry button that resets status back to "idle".',
        levelC: 'Build an auto-dismissing success banner after submission.'
      },
      debuggingChallenge: {
        brokenCode: `const [loading, setLoading] = useState(false);\nconst [success, setSuccess] = useState(false);\nconst [error, setError] = useState(false);\n// If an error happens after success, both success and error flags remain true!`,
        problem: 'Independent booleans create impossible overlapping UI states.',
        fix: 'Use a single status: "idle" | "submitting" | "success" | "error".'
      },
      conceptualQuestion: {
        question: 'Why is a single status string ("idle" | "submitting" | "success" | "error") preferred over multiple boolean states (isSubmitting, isSuccess, isError)?',
        options: [
          'Because strings use less CPU cache.',
          'It eliminates "impossible states", ensuring the form cannot accidentally be in both an error state and a success state at the same time.',
          'Boolean state is deprecated in React 19.',
          'Because TypeScript cannot check booleans.'
        ],
        correctIndex: 1,
        explanation: 'Finite state machine modeling guarantees that only one valid submission state can be active at any given moment.'
      },
      codeReadingQuestion: {
        snippet: `<button disabled={status === 'submitting'}>Submit</button>`,
        question: 'What crucial real-world bug does this single line prevent?',
        answer: 'Accidental double-submissions / duplicate API requests from eager user double-clicks.'
      },
      starterCode: `// Assignment: Implement formStateTransition\n// Enforce valid transitions in a submission state machine:\n// formStateTransition(currentStatus, action)\n// Statuses: 'IDLE', 'SUBMITTING', 'SUCCESS', 'ERROR'\n// Actions: 'SUBMIT_START', 'SUBMIT_SUCCESS', 'SUBMIT_FAIL', 'RESET'\n// Valid Transitions:\n// 1. IDLE + SUBMIT_START -> SUBMITTING\n// 2. ERROR + SUBMIT_START -> SUBMITTING\n// 3. SUBMITTING + SUBMIT_SUCCESS -> SUCCESS\n// 4. SUBMITTING + SUBMIT_FAIL -> ERROR\n// 5. ANY + RESET -> IDLE\n// If invalid transition attempted -> return currentStatus (no change)\n\nexport function formStateTransition(currentStatus, action) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Allows valid happy path transitions',
          run: (fn) => {
            const s1 = fn('IDLE', 'SUBMIT_START');
            const s2 = fn(s1, 'SUBMIT_SUCCESS');
            return s1 === 'SUBMITTING' && s2 === 'SUCCESS';
          }
        },
        {
          name: 'Blocks invalid transitions',
          run: (fn) => {
            const blocked = fn('IDLE', 'SUBMIT_SUCCESS'); // Cannot succeed without submitting!
            return blocked === 'IDLE';
          }
        }
      ],
      hints: [
        'Use switch statement checking currentStatus and action.'
      ],
      checklist: [
        'Enforced valid state transitions',
        'Handled RESET to IDLE',
        'Rejected invalid state transitions'
      ],
      revisionSummary: 'Model form lifecycles as a state machine (idle, submitting, success, error) to avoid impossible states and double-submits.'
    },
    {
      id: 'p2-l13',
      slug: 'preventing-accidental-form-submissions',
      title: 'Preventing Accidental Form Submissions',
      prerequisites: ['p2-l12'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Understand button type defaults in HTML (<button> defaults to type="submit").', 'Explicitly assign type="button" to auxiliary buttons.', 'Prevent accidental enter-key submissions in search inputs.'],
      explanation: 'In HTML forms, any <button> element that does not explicitly specify a type attribute defaults to type="submit"! If you have a "Show Password" eye icon button or a "Cancel" button without type="button", clicking it will SUBMIT the entire form and refresh the page. Senior engineers always explicitly declare type="button" or type="submit".',
      whyItExists: 'Prevents embarrassing user bugs where clicking a helper button triggers premature form submission.',
      syntaxRules: 'Always write <button type="button"> for any button that does not submit the form.',
      codeExample: `function AccountForm() {\n  const [showPassword, setShowPassword] = useState(false);\n\n  return (\n    <form onSubmit={handleFinalSubmit}>\n      <input type={showPassword ? 'text' : 'password'} />\n      {/* MUST specify type="button" to prevent form submission! */}\n      <button type="button" onClick={() => setShowPassword(p => !p)}>\n        {showPassword ? 'Hide' : 'Show'}\n      </button>\n      <button type="submit">Save Account</button>\n    </form>\n  );\n}`,
      lineByLine: [
        'Line 8: type="button" guarantees this button will NEVER submit the form when clicked.',
        'Line 11: type="submit" explicitly declares the primary submission button.'
      ],
      expectedBehavior: 'Clicking "Show" toggles password visibility without triggering form validation or submission.',
      commonMistakes: ['Writing <button onClick={toggleDialog}> without type="button" inside a form.', 'Assuming default button type in HTML is "button" (it is "submit"!).'],
      practiceLevels: {
        levelA: 'Audit a form with 3 buttons and add explicit type attributes.',
        levelB: 'Prevent Enter key on a specific input from triggering submission.',
        levelC: 'Build an alert dialog confirming before form reset.'
      },
      debuggingChallenge: {
        brokenCode: `<form onSubmit={save}>\n  <input />\n  <button onClick={openHelpModal}>Help</button>\n</form>`,
        problem: 'Clicking "Help" submits the form because <button> defaults to type="submit"!',
        fix: '<button type="button" onClick={openHelpModal}>Help</button>'
      },
      conceptualQuestion: {
        question: 'What is the default `type` attribute of a `<button>` element placed inside a `<form>` if omitted?',
        options: ['type="button"', 'type="submit"', 'type="reset"', 'type="text"'],
        correctIndex: 1,
        explanation: 'HTML specifications dictate that buttons default to type="submit" unless explicitly given type="button".'
      },
      codeReadingQuestion: {
        snippet: `<button onClick={cancel}>Cancel</button>`,
        question: 'What bug occurs if this button is inside a `<form>`?',
        answer: 'It accidentally submits the form instead of just canceling.'
      },
      starterCode: `// Assignment: Implement auditFormButtons\n// Inspects button descriptors in a form:\n// auditFormButtons(buttons)\n// buttons = [{ id: string, label: string, type?: string, action: 'submit' | 'cancel' | 'toggle' }]\n// Rules:\n// 1. If action !== 'submit' and type !== 'button', flag as an error: \`Button '\${label}' must have type="button"\`\n// 2. Return { isCompliant: boolean, errors: string[] }\n\nexport function auditFormButtons(buttons) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Catches missing type="button" on auxiliary buttons',
          run: (fn) => {
            const list = [
              { id: '1', label: 'Save', type: 'submit', action: 'submit' },
              { id: '2', label: 'Cancel', action: 'cancel' } // Missing type!
            ];
            const res = fn(list);
            return res.isCompliant === false && res.errors[0].includes('Cancel');
          }
        },
        {
          name: 'Approves compliant form buttons',
          run: (fn) => {
            const list = [
              { id: '1', label: 'Save', type: 'submit', action: 'submit' },
              { id: '2', label: 'Cancel', type: 'button', action: 'cancel' }
            ];
            return fn(list).isCompliant === true && res.errors?.length === 0 || fn(list).isCompliant === true;
          }
        }
      ],
      hints: [
        'Iterate through buttons and test button.action !== "submit" && button.type !== "button".'
      ],
      checklist: [
        'Checked each button descriptor',
        'Flagged missing type="button"',
        'Returned validation errors'
      ],
      revisionSummary: 'Always declare type="button" on non-submitting buttons inside forms to prevent accidental submissions.'
    },
    {
      id: 'p2-l14',
      slug: 'reusable-input-button-components',
      title: 'Reusable Input and Button Components',
      prerequisites: ['p2-l1', 'p2-l10'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Build production-grade input and button design system primitives.', 'Forward DOM ref using React 19 / forwardRef.', 'Connect labels and error messages with auto-generated IDs via useId.'],
      explanation: 'In real-world applications, you should never write raw <input> tags scattered everywhere. Instead, build a reusable <InputField> component that bundles label, input, helper text, error message, and unique accessible IDs (via useId) into a cohesive, reusable primitive.',
      whyItExists: 'Enforces accessible label-input associations, consistent styling, and reduces boilerplate across all forms.',
      syntaxRules: 'Use useId() to associate <label htmlFor={id}> with <input id={id}> automatically.',
      codeExample: `import { useId } from 'react';\n\nfunction TextField({ label, error, helperText, ...props }) {\n  const inputId = useId();\n  const errorId = useId();\n\n  return (\n    <div className="text-field">\n      <label htmlFor={inputId}>{label}</label>\n      <input\n        id={inputId}\n        aria-invalid={Boolean(error)}\n        aria-describedby={error ? errorId : undefined}\n        {...props}\n      />\n      {error && <span id={errorId} className="error-text">{error}</span>}\n      {!error && helperText && <span className="helper-text">{helperText}</span>}\n    </div>\n  );\n}`,
      lineByLine: [
        'Line 4: useId() produces stable unique IDs safe across client/server rendering.',
        'Line 8: htmlFor connects the label to the input for accessibility.',
        'Line 12: ...props forwards value, onChange, placeholder, disabled to the input.'
      ],
      expectedBehavior: 'Clicking label focuses the input; screen readers announce error message automatically.',
      commonMistakes: ['Hardcoding IDs like id="email", which causes duplicate DOM ID bugs if two forms are on one page.', 'Not forwarding standard input props (...props).'],
      practiceLevels: {
        levelA: 'Build an InputField primitive with label and error display.',
        levelB: 'Add leading and trailing icon slots (e.g. search icon, clear button).',
        levelC: 'Support password toggle visibility inside the InputField primitive.'
      },
      debuggingChallenge: {
        brokenCode: `function Input({ label }) {\n  return <div><label>{label}</label><input /></div>;\n}`,
        problem: 'Label is not linked to input. Clicking label does not focus input and screen readers cannot associate them.',
        fix: 'Use useId() and connect via htmlFor={id} and id={id}.'
      },
      conceptualQuestion: {
        question: 'Why is `useId()` superior to hardcoding string IDs (like id="username") in reusable components?',
        options: [
          'Because useId runs faster.',
          'useId generates globally unique IDs, preventing duplicate ID collision bugs when a component is reused multiple times on the same page.',
          'useId prevents CSS from being inspected.',
          'Because string IDs are not allowed in HTML5.'
        ],
        correctIndex: 1,
        explanation: 'Reusable components appear multiple times per page; hardcoded IDs cause duplicate ID collisions that break form accessibility.'
      },
      codeReadingQuestion: {
        snippet: `const id = useId();\n// Returns: ":r1:" in React`,
        question: 'Can useId() be used to generate CSS selectors or keys in lists?',
        answer: 'No! useId is exclusively for accessibility attribute associations (htmlFor, aria-describedby), not for list keys.'
      },
      starterCode: `// Assignment: Implement assembleAccessibleField\n// Simulates accessible attribute generation for reusable input fields:\n// assembleAccessibleField({ label, error, helperText, generatedId })\n// 1. inputProps: { id: generatedId, 'aria-invalid': Boolean(error) }\n// 2. if error exists, add 'aria-describedby': \`\${generatedId}-err\`\n// 3. if no error but helperText exists, add 'aria-describedby': \`\${generatedId}-help\`\n// Return { labelFor: generatedId, inputProps, errorId: \`\${generatedId}-err\`, helpId: \`\${generatedId}-help\` }\n\nexport function assembleAccessibleField({ label, error, helperText, generatedId }) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Assembles accessible props with error linkage',
          run: (fn) => {
            const res = fn({ label: 'Email', error: 'Required', generatedId: 'fld-1' });
            return res.labelFor === 'fld-1' && res.inputProps['aria-invalid'] === true && res.inputProps['aria-describedby'] === 'fld-1-err';
          }
        },
        {
          name: 'Links helper text when no error exists',
          run: (fn) => {
            const res = fn({ label: 'Age', helperText: 'Must be 18+', generatedId: 'fld-2' });
            return res.inputProps['aria-invalid'] === false && res.inputProps['aria-describedby'] === 'fld-2-help';
          }
        }
      ],
      hints: [
        'Check Boolean(error) for aria-invalid and conditionally set aria-describedby.'
      ],
      checklist: [
        'Associated labelFor with input id',
        'Linked error and helper IDs via aria-describedby',
        'Set boolean aria-invalid'
      ],
      revisionSummary: 'Encapsulate labels, inputs, and errors inside reusable primitives connected by useId().'
    },
    {
      id: 'p2-l15',
      slug: 'compound-components-controlled-uncontrolled',
      title: 'Compound Components and Controlled/Uncontrolled APIs',
      prerequisites: ['p2-l1', 'p1-l10'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Master the Compound Component pattern (e.g. <Tabs><Tabs.List/><Tabs.Panel/></Tabs>).', 'Share implicit state between sub-components using React Context.', 'Support both controlled and uncontrolled component modes.'],
      explanation: 'Compound components work together to provide a flexible, cohesive declarative API, much like native HTML <select> and <option>. Instead of passing a giant array of tabs to a single monolithic component, compound components share state implicitly via Context, letting callers customize layout and structure freely.',
      whyItExists: 'Powers industry-standard component libraries (Radix UI, Headless UI, Chakra UI) with maximum consumer flexibility.',
      syntaxRules: 'Parent component creates a Context Provider; sub-components consume that Context to read active state and trigger actions.',
      codeExample: `// Compound Component Pattern: Tabs\nconst TabsContext = createContext();\n\nfunction Tabs({ children, defaultValue }) {\n  const [activeTab, setActiveTab] = useState(defaultValue);\n  return (\n    <TabsContext.Provider value={{ activeTab, setActiveTab }}>\n      <div className="tabs">{children}</div>\n    </TabsContext.Provider>\n  );\n}\n\nfunction TabButton({ value, children }) {\n  const { activeTab, setActiveTab } = useContext(TabsContext);\n  return (\n    <button\n      className={activeTab === value ? 'tab--active' : ''}\n      onClick={() => setActiveTab(value)}\n    >\n      {children}\n    </button>\n  );\n}\n\nTabs.Button = TabButton;`,
      lineByLine: [
        'Line 2: TabsContext holds shared state for all sub-components.',
        'Line 6: TabsContext.Provider supplies activeTab and setter without prop drilling.',
        'Line 13: TabButton consumes context and responds to active state.',
        'Line 23: Attaching sub-components as properties (Tabs.Button) clarifies ownership.'
      ],
      expectedBehavior: 'Callers compose sub-components freely while state remains coordinated behind the scenes.',
      commonMistakes: ['Forgetting to throw a descriptive error when a child sub-component is used outside the parent Provider.', 'Not supporting controlled mode (value & onChange props) alongside uncontrolled (defaultValue).'],
      practiceLevels: {
        levelA: 'Build an Accordion compound component (<Accordion><Accordion.Item /><Accordion.Trigger /></Accordion>).',
        levelB: 'Implement a Dropdown Menu compound component with keyboard navigation.',
        levelC: 'Build a dual-mode component that works both controlled (value passed) and uncontrolled (defaultValue passed).'
      },
      debuggingChallenge: {
        brokenCode: `function TabPanel({ children }) {\n  const context = useContext(TabsContext);\n  // If used outside <Tabs>, context is undefined, crashing child!\n}`,
        problem: 'Missing guard check for context usage outside parent Provider.',
        fix: 'if (!context) throw new Error("TabPanel must be used within <Tabs>");'
      },
      conceptualQuestion: {
        question: 'What is the primary benefit of the Compound Component pattern in React?',
        options: [
          'It compiles JSX to WebAssembly.',
          'It allows related components to share implicit state via Context while giving the developer complete control over markup structure and placement.',
          'It avoids needing React DOM.',
          'It prevents components from re-rendering.'
        ],
        correctIndex: 1,
        explanation: 'Compound components invert control: callers place sub-components wherever they want while state coordinates automatically.'
      },
      codeReadingQuestion: {
        snippet: `const isControlled = props.value !== undefined;\nconst activeValue = isControlled ? props.value : internalState;`,
        question: 'What design pattern does this code represent?',
        answer: 'Controlled vs Uncontrolled dual-mode component support.'
      },
      starterCode: `// Assignment: Implement resolveActiveTabContent\n// Simulate compound component resolution:\n// resolveActiveTabContent(activeTab, tabsDescriptor)\n// tabsDescriptor: [{ value: string, label: string, content: string }]\n// Returns: { activeLabel: string, activeContent: string, isFound: boolean }\n// If activeTab does not match any item -> fallback to first item in descriptor.\n\nexport function resolveActiveTabContent(activeTab, tabsDescriptor) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Resolves matched active tab',
          run: (fn) => {
            const tabs = [
              { value: 'tab1', label: 'Overview', content: 'Overview text' },
              { value: 'tab2', label: 'Settings', content: 'Settings text' }
            ];
            const res = fn('tab2', tabs);
            return res.activeLabel === 'Settings' && res.activeContent === 'Settings text' && res.isFound === true;
          }
        },
        {
          name: 'Falls back to first tab when match missing',
          run: (fn) => {
            const tabs = [
              { value: 'tab1', label: 'Overview', content: 'Overview text' }
            ];
            const res = fn('unknown', tabs);
            return res.activeLabel === 'Overview' && res.isFound === false;
          }
        }
      ],
      hints: [
        'Find matched item; if not found, use tabsDescriptor[0] and set isFound: false.'
      ],
      checklist: [
        'Found matching tab by value',
        'Implemented fallback to first tab',
        'Returned activeLabel and activeContent'
      ],
      revisionSummary: 'Compound components coordinate implicit state via Context, granting consumers flexible markup composition.'
    },
    {
      id: 'p2-l16',
      slug: 'separation-of-ui-logic-data',
      title: 'Separation of UI, Business Logic, and Data Access',
      prerequisites: ['p2-l15', 'p1-l23'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Separate Presentational (Dumb) components from Container (Smart) components or Custom Hooks.', 'Extract API calls into independent data access services.', 'Keep JSX views declarative, minimal, and easy to unit test.'],
      explanation: 'Clean React code separates three distinct concerns: 1. UI (Presentational JSX): how things look. 2. Business Logic (Custom Hooks): calculations, validation, and state rules. 3. Data Access (API services): fetch/axios requests. When you mix network calls, state calculations, and 300 lines of JSX in one file, testing and maintenance become nightmares.',
      whyItExists: 'Makes code testable, allows frontend UI swapping without touching business rules, and simplifies debugging.',
      syntaxRules: 'Component renders UI; Custom hook manages state and operations; API module handles HTTP requests.',
      codeExample: `// 1. Data Access (api/users.js)\nexport const fetchUsers = () => fetch('/api/users').then(r => r.json());\n\n// 2. Business Logic (hooks/useUsers.js)\nexport function useUsers() {\n  const [users, setUsers] = useState([]);\n  // ... manages loading, error, filtering ...\n  return { users, removeUser, isLoading };\n}\n\n// 3. UI Presentation (components/UserList.jsx)\nexport function UserList() {\n  const { users, removeUser, isLoading } = useUsers();\n  if (isLoading) return <Spinner />;\n  return <ul>{users.map(u => <UserItem key={u.id} user={u} onDelete={removeUser} />)}</ul>;\n}`,
      lineByLine: [
        'Line 2: Pure data access function; zero React dependencies.',
        'Line 5: Custom hook manages state logic, independently testable.',
        'Line 12: Pure UI component; merely wires hook output to presentation.'
      ],
      expectedBehavior: 'Each layer can be tested and modified in isolation.',
      commonMistakes: ['Putting raw fetch calls directly inside JSX event handlers.', 'Coupling UI components directly to database or API structures.'],
      practiceLevels: {
        levelA: 'Extract a raw fetch call from a component into an api/ service function.',
        levelB: 'Extract state management and validation from a form component into a useLoginForm hook.',
        levelC: 'Unit-test a custom hook independently using React Testing Library.'
      },
      debuggingChallenge: {
        brokenCode: `function BadComponent() {\n  // 400 lines mixing fetch(), token storage, input regex, and JSX\n}`,
        problem: 'God Component anti-pattern; impossible to unit test presentation separately from network calls.',
        fix: 'Split into api/service.js, useFeature.js hook, and FeatureView.jsx component.'
      },
      conceptualQuestion: {
        question: 'Why extract business logic into Custom Hooks instead of leaving it in the component file?',
        options: [
          'Because components cannot run asynchronous functions.',
          'It separates presentation from logic, making business rules reusable across different screens and unit-testable without rendering UI.',
          'Custom hooks execute faster than components.',
          'It reduces browser memory usage.'
        ],
        correctIndex: 1,
        explanation: 'Custom hooks isolate state and operations from JSX markup, enabling headless testing and multi-device reuse.'
      },
      codeReadingQuestion: {
        snippet: `const { tasks, addTask } = useTasks();\nreturn <TaskListView tasks={tasks} onAdd={addTask} />;`,
        question: 'What architectural separation is demonstrated here?',
        answer: 'Headless hook logic (useTasks) separated from pure presentational UI (TaskListView).'
      },
      starterCode: `// Assignment: Implement splitArchitectureLayers\n// Analyze a module descriptor and categorize its exports:\n// splitArchitectureLayers(exportedSymbols)\n// exportedSymbols: [{ name: string, type: 'api_fetch' | 'hook' | 'presentational_component' | 'container' }]\n// Return: { dataAccess: string[], businessLogic: string[], presentation: string[] }\n\nexport function splitArchitectureLayers(exportedSymbols) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Categorizes architectural layers cleanly',
          run: (fn) => {
            const symbols = [
              { name: 'fetchProducts', type: 'api_fetch' },
              { name: 'useCart', type: 'hook' },
              { name: 'ProductCard', type: 'presentational_component' }
            ];
            const res = fn(symbols);
            return res.dataAccess.includes('fetchProducts') && res.businessLogic.includes('useCart') && res.presentation.includes('ProductCard');
          }
        }
      ],
      hints: [
        'Filter symbols into dataAccess, businessLogic, and presentation arrays based on type.'
      ],
      checklist: [
        'Separated API data access',
        'Separated business logic hooks',
        'Separated presentational components'
      ],
      revisionSummary: 'Decouple UI presentation, custom hook business logic, and API data access for testable, maintainable systems.'
    }
  ]
};
