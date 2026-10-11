// Phase 0: JavaScript Prerequisites for Modern React
export const phase0 = {
  id: 'phase-0',
  title: 'Phase 0 — JavaScript Prerequisites',
  description: 'Master the core modern JavaScript primitives that React relies on: immutability, closures, array methods, async/await, and the event loop.',
  icon: 'Zap',
  badge: 'Prerequisites',
  estimatedHours: 8,
  lessons: [
    {
      id: 'p0-l1',
      slug: 'variables-scope-data-types',
      title: 'Variables, Scope, and Data Types',
      prerequisites: [],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand block scope vs function scope vs global scope.',
        'Distinguish primitive values from reference types in memory.',
        'Avoid variable shadowing and understand temporal dead zone (TDZ).'
      ],
      explanation: 'In JavaScript, variables are containers for values. JavaScript provides three keywords to declare variables: var (function-scoped, hoisted), let (block-scoped, TDZ), and const (block-scoped, re-assignment prohibited). Modern React code exclusively relies on let and const to avoid accidental global pollution and closure bugs.',
      whyItExists: 'Predictable scoping prevents state variables from leaking across component re-renders or asynchronous callbacks.',
      syntaxRules: 'Use const by default. Use let only when a value must be reassigned (such as accumulator variables). Never use var in React codebases.',
      codeExample: `// Primitive vs Reference\nconst primitiveNum = 42;\nlet mutableCounter = 0;\nmutableCounter += 1;\n\nfunction scopeDemo() {\n  const inside = 'scoped';\n  if (true) {\n    const blockScoped = 'block only';\n  }\n  // blockScoped is not accessible here\n  return inside;\n}`,
      lineByLine: [
        'Line 2: primitiveNum is stored directly by value in the stack.',
        'Line 3: mutableCounter is declared with let, allowing incrementing.',
        'Line 8: blockScoped exists only inside the if-block scope and cannot leak out.'
      ],
      expectedBehavior: 'Variables declared inside a block {} are strictly inaccessible outside of that block.',
      commonMistakes: [
        'Using var which hoists declarations without temporal dead zone errors.',
        'Confusing reassigning a variable with mutating an internal object property.'
      ],
      practiceLevels: {
        levelA: 'Declare a userProfile object using const and a counter variable using let.',
        levelB: 'Create a function calculateTotal(items) that safely iterates using a block-scoped accumulator.',
        levelC: 'Refactor legacy var code to strict let/const with zero variable shadowing.'
      },
      debuggingChallenge: {
        brokenCode: `function getTax(price) {\n  if (price > 100) {\n    var discount = 0.1;\n  }\n  return price * discount;\n}`,
        problem: 'discount is undefined if price <= 100 because var hoists without default initialization.',
        fix: 'Declare discount with let or initialize a default const discount = price > 100 ? 0.1 : 0;'
      },
      conceptualQuestion: {
        question: 'Why does React recommend const for declaring hooks and components?',
        options: [
          'Because const makes the internal properties of objects immutable.',
          'To prevent accidental reassignment of component functions or hook return values.',
          'Because const runs faster in V8 engine than let.',
          'Because let cannot be exported from ES modules.'
        ],
        correctIndex: 1,
        explanation: 'const guarantees that the identifier reference cannot be overwritten within that scope, ensuring stable component definitions and hook bindings.'
      },
      codeReadingQuestion: {
        snippet: `let x = 10;\nfunction test() {\n  console.log(x);\n  let x = 20;\n}\ntest();`,
        question: 'What happens when test() is invoked?',
        answer: 'ReferenceError: Cannot access "x" before initialization due to the Temporal Dead Zone (TDZ) inside test().'
      },
      starterCode: `// Assignment: Implement formatUserSession\n// Requirements:\n// 1. Declare a constant 'SESSION_TIMEOUT' set to 3600.\n// 2. Return an object with username, timeout (SESSION_TIMEOUT), and isExpired (boolean).\n\nexport function formatUserSession(username, elapsedSeconds) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Returns correct session object for active user',
          run: (fn) => {
            const res = fn('cosmo', 120);
            return res && res.username === 'cosmo' && res.timeout === 3600 && res.isExpired === false;
          }
        },
        {
          name: 'Detects expired session when elapsed >= 3600',
          run: (fn) => {
            const res = fn('alex', 3700);
            return res && res.isExpired === true;
          }
        }
      ],
      hints: [
        'Declare const SESSION_TIMEOUT = 3600; inside or outside the function.',
        'Use comparison elapsedSeconds >= SESSION_TIMEOUT to determine isExpired.'
      ],
      checklist: [
        'Used const for SESSION_TIMEOUT',
        'Returned an object with username, timeout, isExpired',
        'Handled boundary edge case where elapsed === 3600'
      ],
      revisionSummary: 'Modern JavaScript uses const by default and let when reassignment is required. Block scope prevents variable leakage.'
    },
    {
      id: 'p0-l2',
      slug: 'let-const-immutability',
      title: 'let, const, and Immutability',
      prerequisites: ['p0-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Differentiate assignment immutability (const) from structural immutability (Object.freeze, copy patterns).', 'Explain why React state updates require immutable data patterns.'],
      explanation: 'In JavaScript, const prevents reassignment of the variable identifier. However, const does NOT prevent mutating properties of an object or items in an array. In React, state must be treated as immutable so that React can detect changes via referential equality (prev !== next).',
      whyItExists: 'React optimizes re-renders by doing shallow comparisons of props and state. Direct mutations bypass this detection.',
      syntaxRules: 'To update an object, create a new object using spread {...obj, key: val}. To update an array, use methods that return a new array (map, filter, concat, slice) or spread [...arr].',
      codeExample: `const state = { count: 0, user: { name: 'Ada' } };\n// WRONG: state.count = 1; (Mutation!)\n// CORRECT: Create a new state snapshot\nconst nextState = { ...state, count: state.count + 1 };`,
      lineByLine: [
        'Line 1: const creates a binding to the heap memory address.',
        'Line 4: Object spread creates a fresh object reference, allowing React to trigger a re-render.'
      ],
      expectedBehavior: 'state !== nextState evaluates to true, signaling a change to React.',
      commonMistakes: ['Calling array.push() on React state arrays.', 'Assuming const makes nested properties read-only.'],
      practiceLevels: {
        levelA: 'Update an object property immutably using the spread operator.',
        levelB: 'Update a nested property (e.g. user.address.city) without mutating parent references.',
        levelC: 'Write a helper updateListItem(list, id, newProps) that returns a newly mapped array.'
      },
      debuggingChallenge: {
        brokenCode: `function addItem(list, item) {\n  list.push(item);\n  return list;\n}`,
        problem: 'list.push mutates the original array in place, retaining the same memory reference.',
        fix: 'return [...list, item];'
      },
      conceptualQuestion: {
        question: 'Does "const user = { role: \'admin\' }; user.role = \'editor\';" throw a TypeError?',
        options: [
          'Yes, because const makes the object properties read-only.',
          'No, because const only prevents re-assigning the variable "user", not mutating its properties.',
          'Yes, but only in strict mode.',
          'No, but user.role will remain "admin".'
        ],
        correctIndex: 1,
        explanation: 'const binds the variable name to the memory address. To freeze properties, you would need Object.freeze().'
      },
      codeReadingQuestion: {
        snippet: `const arr1 = [1, 2, 3];\nconst arr2 = arr1;\narr2.push(4);\nconsole.log(arr1.length === arr2.length);`,
        question: 'What is printed to the console?',
        answer: 'true, because arr1 and arr2 point to the exact same array reference in memory.'
      },
      starterCode: `// Assignment: Implement addTagImmutably\n// Given a post object: { id: number, title: string, tags: string[] }\n// Return a new post object containing the new tag WITHOUT mutating the original post or its tags array.\n\nexport function addTagImmutably(post, newTag) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Adds tag to array and returns a new post object',
          run: (fn) => {
            const original = { id: 1, title: 'React Hooks', tags: ['react'] };
            const updated = fn(original, 'javascript');
            return updated.tags.includes('javascript') && updated.tags.length === 2;
          }
        },
        {
          name: 'Original post and original tags array are NOT mutated',
          run: (fn) => {
            const original = { id: 1, title: 'React Hooks', tags: ['react'] };
            const updated = fn(original, 'frontend');
            return original.tags.length === 1 && original !== updated && original.tags !== updated.tags;
          }
        }
      ],
      hints: [
        'Use object spread {...post} and array spread tags: [...post.tags, newTag].'
      ],
      checklist: [
        'Did not use post.tags.push()',
        'Returned a fresh object reference',
        'Returned a fresh tags array reference'
      ],
      revisionSummary: 'Immutability in React ensures state changes can be detected via shallow reference checks (prev !== next).'
    },
    {
      id: 'p0-l3',
      slug: 'functions-arrow-closures',
      title: 'Functions, Arrow Functions, and Closures',
      prerequisites: ['p0-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Master lexical this in arrow functions.', 'Understand how closures capture variables from enclosing scopes.', 'Identify stale closure pitfalls in React effects and callbacks.'],
      explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical state. In React, every custom hook, event handler, and useEffect callback relies on closures to read state and props from the component render cycle.',
      whyItExists: 'Closures allow functions to maintain private state and access component values at the exact time the function was created.',
      syntaxRules: 'Arrow functions () => {} inherit `this` from their enclosing lexical context and cannot be used as constructors.',
      codeExample: `function createCounter(initial = 0) {\n  let count = initial;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\nconst counter = createCounter(10);\ncounter.increment(); // 11`,
      lineByLine: [
        'Line 2: count is a private variable enclosed in createCounter.',
        'Line 4: increment arrow function closes over count and modifies it.'
      ],
      expectedBehavior: 'Private variables remain alive in memory as long as the returned inner functions are referenced.',
      commonMistakes: ['Expecting arrow functions to have their own "this" or "arguments" bindings.', 'Creating stale closures when capturing outdated state inside a timer or event listener.'],
      practiceLevels: {
        levelA: 'Convert a standard function declaration to an arrow function with implicit return.',
        levelB: 'Build a multiplier(factor) function that returns a closure multiplying any number by factor.',
        levelC: 'Build a debounced function wrapper using closures to hold the timeoutId.'
      },
      debuggingChallenge: {
        brokenCode: `function buildList() {\n  var result = [];\n  for (var i = 0; i < 3; i++) {\n    result.push(function() { return i; });\n  }\n  return result;\n}`,
        problem: 'var i is shared across all iterations. All functions return 3.',
        fix: 'Replace var with let i = 0 so each iteration gets its own lexical environment.'
      },
      conceptualQuestion: {
        question: 'What is a "stale closure" in React?',
        options: [
          'A closure that has been deleted by the garbage collector.',
          'A function that captured values from an earlier render and was not updated with the latest state.',
          'An arrow function declared inside a JSX attribute.',
          'A closure that causes an infinite render loop.'
        ],
        correctIndex: 1,
        explanation: 'A stale closure occurs when a callback (e.g. inside useEffect or setTimeout) captures state from an older render because its dependency array omitted that value.'
      },
      codeReadingQuestion: {
        snippet: `const add = (a) => (b) => a + b;\nconst add5 = add(5);\nconsole.log(add5(3));`,
        question: 'What does this output?',
        answer: '8. add(5) returns a closure holding a = 5; calling it with 3 returns 5 + 3 = 8.'
      },
      starterCode: `// Assignment: Implement createRateLimiter\n// Create a function createRateLimiter(limit)\n// Returns a function: checkLimit(cost)\n// Every call adds 'cost' to internal accumulated units.\n// If total units <= limit, returns { allowed: true, remaining: limit - total }\n// If total units > limit, returns { allowed: false, remaining: previous remaining }\n\nexport function createRateLimiter(limit) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Allows requests within limit',
          run: (fn) => {
            const limiter = fn(10);
            const r1 = limiter(4);
            const r2 = limiter(5);
            return r1.allowed === true && r1.remaining === 6 && r2.allowed === true && r2.remaining === 1;
          }
        },
        {
          name: 'Rejects requests exceeding remaining limit',
          run: (fn) => {
            const limiter = fn(10);
            limiter(8);
            const r = limiter(3); // 8 + 3 = 11 > 10
            return r.allowed === false && r.remaining === 2;
          }
        }
      ],
      hints: [
        'Store let used = 0 inside createRateLimiter.',
        'In checkLimit(cost), check if (used + cost <= limit) before updating used.'
      ],
      checklist: [
        'Internal state is encapsulated via closure',
        'Returns correct allowed and remaining properties',
        'Does not mutate state when limit is exceeded'
      ],
      revisionSummary: 'Closures retain access to their defining scope. In React, dependency arrays keep closures synchronized with current state.'
    },
    {
      id: 'p0-l4',
      slug: 'destructuring-spread-rest',
      title: 'Destructuring, Spread, and Rest',
      prerequisites: ['p0-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Unpack props and state using object and array destructuring.', 'Collect remaining arguments using the rest operator.', 'Merge and clone objects/arrays safely using spread.'],
      explanation: 'Destructuring allows unpacking values from arrays or properties from objects into distinct variables. The spread operator (...) expands an iterable into individual elements, while the rest operator (...) bundles multiple elements into an array.',
      whyItExists: 'React component props are JavaScript objects. Destructuring allows direct, clean access: function Button({ label, onClick, ...restProps }).',
      syntaxRules: 'Destructuring supports default values: const { role = \'guest\' } = user. Rest parameters must be the last element in a parameter list.',
      codeExample: `// React Props Destructuring\nfunction UserCard({ name, avatar, role = 'member', ...rest }) {\n  return { name, avatar, role, extra: rest };\n}\n\n// Array Destructuring (like useState)\nconst [count, setCount] = [0, () => {}];`,
      lineByLine: [
        'Line 2: { name, avatar, role = "member", ...rest } unpacks known props with a default and collects leftovers into rest.',
        'Line 7: Array destructuring matches values positionally.'
      ],
      expectedBehavior: 'Extracted variables are scoped to the function, and leftovers are grouped into a clean rest object/array.',
      commonMistakes: ['Destructuring null or undefined without default fallbacks, causing TypeError.', 'Confusing spread (unpacking) with rest (gathering).'],
      practiceLevels: {
        levelA: 'Destructure title, price, and category from a product object.',
        levelB: 'Extract the first two elements from an array and gather the rest into remainingItems.',
        levelC: 'Merge three configuration objects with proper priority overriding using spread.'
      },
      debuggingChallenge: {
        brokenCode: `function printUser(user) {\n  const { name, profile: { bio } } = user;\n  return \`\${name}: \${bio}\`;\n}`,
        problem: 'Throws TypeError if user.profile is null or undefined.',
        fix: 'Provide default: const { name, profile: { bio } = {} } = user || {};'
      },
      conceptualQuestion: {
        question: 'What is the key difference between spread (...) and rest (...) syntax?',
        options: [
          'Spread packs items into an array; rest expands them.',
          'Spread expands elements out of an array/object; rest gathers remaining elements into an array/object.',
          'Spread can only be used with arrays; rest can only be used with objects.',
          'There is no difference; they are identical.'
        ],
        correctIndex: 1,
        explanation: 'Spread unfolds data structures (e.g. [...items]), whereas rest gathers multiple remaining elements (e.g. function(...args)).'
      },
      codeReadingQuestion: {
        snippet: `const obj = { a: 1, b: 2, c: 3 };\nconst { a, ...others } = obj;\nconsole.log(others);`,
        question: 'What is logged to the console?',
        answer: '{ b: 2, c: 3 }'
      },
      starterCode: `// Assignment: Implement sanitizeProps\n// Given a rawProps object, extract 'internalId' and 'secretKey'.\n// Return a cleanProps object that excludes both sensitive keys, but includes a new property 'isPublic: true'.\n\nexport function sanitizeProps(rawProps) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Omits internalId and secretKey, preserves other props and adds isPublic',
          run: (fn) => {
            const raw = { internalId: 'xyz_123', secretKey: 'shhh', title: 'Card', color: 'blue' };
            const clean = fn(raw);
            return clean.internalId === undefined && clean.secretKey === undefined && clean.title === 'Card' && clean.color === 'blue' && clean.isPublic === true;
          }
        }
      ],
      hints: [
        'Use object destructuring: const { internalId, secretKey, ...rest } = rawProps;',
        'Return { ...rest, isPublic: true }.'
      ],
      checklist: [
        'Used rest syntax to collect remaining properties',
        'Added isPublic: true flag',
        'Did not mutate rawProps input'
      ],
      revisionSummary: 'Destructuring and rest/spread simplify prop passing, component wrapping, and immutable state transforms.'
    },
    {
      id: 'p0-l5',
      slug: 'array-methods-functional',
      title: 'Array Methods: map, filter, reduce, find, some, every',
      prerequisites: ['p0-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Render lists in React using array.map().', 'Conditionally filter items without mutating lists.', 'Aggregate complex state using reduce.'],
      explanation: 'React UI is a direct projection of data. We transform arrays into UI lists using map(), remove items using filter(), test conditions using some() / every(), and compute totals using reduce(). These functional methods return new values without mutating the source.',
      whyItExists: 'Imperative for-loops are verbose and error-prone in JSX expressions. Functional array methods integrate seamlessly into JSX: {items.map(item => <Item key={item.id} />)}.',
      syntaxRules: 'Never use methods that mutate arrays in place (sort, splice, reverse) without first making a shallow copy: [...arr].sort().',
      codeExample: `const users = [\n  { id: 1, name: 'Ava', active: true },\n  { id: 2, name: 'Bob', active: false }\n];\n// Filter active users and map to uppercase names\nconst activeNames = users\n  .filter(u => u.active)\n  .map(u => u.name.toUpperCase());`,
      lineByLine: [
        'Line 6: filter returns a new array with matching items.',
        'Line 7: map returns a new array transforming each item.'
      ],
      expectedBehavior: 'Source array users remains untouched; a new array activeNames is produced.',
      commonMistakes: ['Forgetting to return a value from map() callback.', 'Using forEach() inside JSX (forEach returns undefined).'],
      practiceLevels: {
        levelA: 'Double every number in an array using map.',
        levelB: 'Filter out disabled products and sort remaining by price ascending without mutating input.',
        levelC: 'Group a list of transactions by category using reduce.'
      },
      debuggingChallenge: {
        brokenCode: `function renderBadList(items) {\n  return items.forEach(item => item.name);\n}`,
        problem: 'forEach returns undefined, resulting in no rendered output in React.',
        fix: 'Replace forEach with map.'
      },
      conceptualQuestion: {
        question: 'Why does React require map() instead of forEach() when rendering a list in JSX?',
        options: [
          'map() runs asynchronously, preventing UI lockups.',
          'map() returns a new array of React elements which JSX can render, whereas forEach() returns undefined.',
          'forEach() is deprecated in modern ECMAScript.',
          'map() automatically generates keys for list items.'
        ],
        correctIndex: 1,
        explanation: 'JSX requires an expression that evaluates to a renderable value (such as an array of elements). map() returns an array; forEach() returns undefined.'
      },
      codeReadingQuestion: {
        snippet: `const nums = [1, 2, 3, 4];\nconst res = nums.reduce((acc, curr) => curr % 2 === 0 ? acc + curr : acc, 0);\nconsole.log(res);`,
        question: 'What is the value of res?',
        answer: '6 (sum of even numbers 2 + 4 = 6).'
      },
      starterCode: `// Assignment: Implement computeCartSummary\n// Given an array of cartItems: [{ id, name, price, qty, inStock }]\n// 1. Only include items where inStock === true.\n// 2. Compute totalItems (sum of qty) and totalPrice (sum of qty * price).\n// 3. Return { totalItems, totalPrice, itemNames: string[] }.\n\nexport function computeCartSummary(cartItems) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Accurately computes total items, price, and itemNames for inStock items',
          run: (fn) => {
            const cart = [
              { id: 1, name: 'Keyboard', price: 50, qty: 2, inStock: true },
              { id: 2, name: 'Mouse', price: 25, qty: 1, inStock: true },
              { id: 3, name: 'Monitor', price: 200, qty: 1, inStock: false }
            ];
            const summary = fn(cart);
            return summary.totalItems === 3 && summary.totalPrice === 125 && summary.itemNames.length === 2 && summary.itemNames.includes('Keyboard');
          }
        }
      ],
      hints: [
        'First filter for inStock: const available = cartItems.filter(i => i.inStock);',
        'Use reduce to calculate totalItems and totalPrice, and map for itemNames.'
      ],
      checklist: [
        'Excluded out-of-stock items',
        'Calculated correct total quantity and total price',
        'Extracted item names into an array'
      ],
      revisionSummary: 'Functional array methods (map, filter, reduce) are foundational to declarative UI rendering in React.'
    },
    {
      id: 'p0-l6',
      slug: 'objects-computed-properties-chaining',
      title: 'Objects, Computed Properties, and Optional Chaining',
      prerequisites: ['p0-l4'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: ['Safely access deeply nested API responses using optional chaining (?.).', 'Use computed property names for dynamic form handlers: [e.target.name]: e.target.value.', 'Provide sensible fallbacks with nullish coalescing (??).'],
      explanation: 'React applications constantly handle asynchronous JSON data and dynamic forms. Optional chaining (?.) avoids "Cannot read properties of undefined" errors. Computed property names allow a single change handler function to update any form field dynamically.',
      whyItExists: 'Reduces boilerplate defensive checks (if (user && user.address && ...)) and enables reusable form handlers.',
      syntaxRules: 'Optional chaining: obj?.prop?.subProp. Nullish coalescing: val ?? fallback (only checks null or undefined, unlike || which also coerces 0, false, and "").',
      codeExample: `// Dynamic Form Change Handler in React\nfunction handleChange(event, setFormData) {\n  const { name, value } = event.target;\n  setFormData(prev => ({ ...prev, [name]: value }));\n}\n\n// Safe Deep Navigation\nconst city = response?.data?.user?.address?.city ?? 'Unknown';`,
      lineByLine: [
        'Line 3: [name]: value uses computed property syntax to update the corresponding form key.',
        'Line 7: Optional chaining stops and returns undefined if any link in the chain is null/undefined.'
      ],
      expectedBehavior: 'No TypeError crashes even when intermediate data properties are missing from API responses.',
      commonMistakes: ['Using || instead of ?? when 0 or false are legitimate valid values.', 'Overusing ?. on variables that are guaranteed to exist, masking underlying logic bugs.'],
      practiceLevels: {
        levelA: 'Safely access a user company catchphrase: user?.company?.catchPhrase ?? "N/A".',
        levelB: 'Implement a generic object property updater using computed properties.',
        levelC: 'Build a safe path extractor getNestedValue(obj, "a.b.c", fallback).'
      },
      debuggingChallenge: {
        brokenCode: `function getLikes(post) {\n  return post.likes || 0;\n}`,
        problem: 'If post is undefined, this throws TypeError. If likes is 0, || evaluates to 0 anyway, but if likes is null, post?.likes ?? 0 is strictly safer.',
        fix: 'return post?.likes ?? 0;'
      },
      conceptualQuestion: {
        question: 'What is the critical difference between ?? (nullish coalescing) and || (logical OR)?',
        options: [
          '?? checks null and undefined only; || checks all falsy values (including 0, false, and "").',
          '?? is slower than ||.',
          '|| works with objects; ?? works only with numbers.',
          'There is no difference in ES2020+.'
        ],
        correctIndex: 0,
        explanation: '?? only falls back when the left operand is null or undefined, preserving valid values like 0 or false.'
      },
      codeReadingQuestion: {
        snippet: `const config = { timeout: 0, debug: false };\nconsole.log(config.timeout ?? 5000, config.timeout || 5000);`,
        question: 'What is logged?',
        answer: '0 5000 (?? preserves 0 because it is not nullish; || treats 0 as falsy).'
      },
      starterCode: `// Assignment: Implement extractUserCard\n// Given a raw user object from an API, safely return:\n// { displayName: string, city: string, avatarUrl: string }\n// Requirements:\n// 1. displayName = user.profile.name ?? 'Guest User'\n// 2. city = user.address.city ?? 'Remote'\n// 3. avatarUrl = user.media.avatars[0] ?? '/default.png'\n// Must NEVER throw an error if user, profile, address, or media is null/undefined.\n\nexport function extractUserCard(user) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Extracts full user card when all data is present',
          run: (fn) => {
            const u = { profile: { name: 'Ada' }, address: { city: 'London' }, media: { avatars: ['/ada.jpg'] } };
            const card = fn(u);
            return card.displayName === 'Ada' && card.city === 'London' && card.avatarUrl === '/ada.jpg';
          }
        },
        {
          name: 'Safely falls back when properties are null or undefined',
          run: (fn) => {
            const card = fn(null);
            return card.displayName === 'Guest User' && card.city === 'Remote' && card.avatarUrl === '/default.png';
          }
        }
      ],
      hints: [
        'Use user?.profile?.name ?? "Guest User"',
        'Use user?.media?.avatars?.[0] ?? "/default.png"'
      ],
      checklist: [
        'Used optional chaining on all nested property lookups',
        'Used nullish coalescing for defaults',
        'Handled completely null or undefined inputs without crashing'
      ],
      revisionSummary: 'Optional chaining (?.) and nullish coalescing (??) make React apps resilient against asynchronous and incomplete payloads.'
    },
    {
      id: 'p0-l7',
      slug: 'modules-import-export',
      title: 'ES Modules: import and export',
      prerequisites: ['p0-l1'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Master default exports vs named exports in React.', 'Understand re-exporting and index barrel files.', 'Recognize how bundlers like Vite optimize and tree-shake modules.'],
      explanation: 'Modern JavaScript uses ES Modules (ESM) to organize code into reusable files. Components are declared and exported using named exports (export function Button) or default exports (export default Button). Bundlers like Vite use static import statements to analyze the dependency graph and bundle code efficiently.',
      whyItExists: 'Separation of concerns, encapsulation, and code splitting across modern React architecture.',
      syntaxRules: 'A file can have only ONE default export, but unlimited named exports. Named imports must match exported names unless aliased with `as`.',
      codeExample: `// Named Export\nexport const THEME_DARK = 'dark';\nexport function Header() { /* ... */ }\n\n// Default Export\nexport default function App() { /* ... */ }\n\n// Importing\nimport App, { Header, THEME_DARK as theme } from './App';`,
      lineByLine: [
        'Line 2: Named export permits precise selective importing and tree shaking.',
        'Line 5: Default export is the primary value represented by the module file.'
      ],
      expectedBehavior: 'Modules maintain their own scope; variables do not leak into the global window object.',
      commonMistakes: ['Importing a named export without curly braces {}.', 'Using CommonJS require() inside ES modules in Vite.'],
      practiceLevels: {
        levelA: 'Export a utility function and constant using named exports.',
        levelB: 'Create a barrel index.js file that aggregates and re-exports multiple components.',
        levelC: 'Configure a dynamic import() with code splitting.'
      },
      debuggingChallenge: {
        brokenCode: `import Button from './Button'; // where Button.jsx has: export function Button() {}`,
        problem: 'Importing a named export as a default import returns undefined.',
        fix: 'import { Button } from "./Button";'
      },
      conceptualQuestion: {
        question: 'Why do many senior React teams prefer named exports over default exports for components?',
        options: [
          'Default exports do not work in Vite or Webpack.',
          'Named exports enforce consistent naming across the codebase and make refactoring / IDE auto-imports more reliable.',
          'Default exports cannot be lazy-loaded.',
          'Named exports load faster in browsers.'
        ],
        correctIndex: 1,
        explanation: 'Named exports guarantee that every file imports the component with the exact same identifier, preventing renaming bugs.'
      },
      codeReadingQuestion: {
        snippet: `// utils.js: export const a = 1; export default 2;\n// app.js: import num, { a } from './utils.js';`,
        question: 'What are the values of num and a?',
        answer: 'num is 2 (default export) and a is 1 (named export).'
      },
      starterCode: `// Assignment: Implement moduleRegistry\n// Build a registry function that simulates an ES module barrel.\n// Takes an array of module descriptors: [{ name, isDefault, value }]\n// Returns an object containing: { defaultExport: any, namedExports: { [name]: value } }.\n\nexport function moduleRegistry(descriptors) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Correctly partitions default and named exports',
          run: (fn) => {
            const desc = [
              { name: 'App', isDefault: true, value: 'AppComp' },
              { name: 'Button', isDefault: false, value: 'BtnComp' },
              { name: 'Icon', isDefault: false, value: 'IconComp' }
            ];
            const reg = fn(desc);
            return reg.defaultExport === 'AppComp' && reg.namedExports.Button === 'BtnComp' && reg.namedExports.Icon === 'IconComp';
          }
        }
      ],
      hints: [
        'Iterate through descriptors and check item.isDefault.'
      ],
      checklist: [
        'Identified the default export',
        'Mapped all named exports into an object map'
      ],
      revisionSummary: 'ES Modules provide static dependency graphs, enabling Vite hot module replacement (HMR) and tree-shaking.'
    },
    {
      id: 'p0-l8',
      slug: 'promises-async-await-errors',
      title: 'Promises, async/await, and Error Handling',
      prerequisites: ['p0-l3'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: ['Master Promise states: pending, fulfilled, rejected.', 'Write clean asynchronous code with async/await and try/catch/finally.', 'Handle concurrent requests safely using Promise.all() and Promise.allSettled().'],
      explanation: 'React components fetch data from servers asynchronously. A Promise is an object representing the eventual completion or failure of an asynchronous operation. Async/await provides synchronous-looking syntax on top of Promises.',
      whyItExists: 'Essential for data fetching, API mutations, timers, and handling network failure gracefully in UI states.',
      syntaxRules: 'An async function always returns a Promise. Await can only be used inside async functions (or top-level modules). Always wrap await calls in try/catch or handle .catch().',
      codeExample: `async function fetchUserData(userId) {\n  try {\n    const res = await fetch(\`/api/users/\${userId}\`);\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    const data = await res.json();\n    return { success: true, data };\n  } catch (err) {\n    return { success: false, error: err.message };\n  }\n}`,
      lineByLine: [
        'Line 3: await pauses function execution until the fetch Promise resolves.',
        'Line 4: Checks res.ok because fetch does not reject on 404 or 500 status codes.',
        'Line 7: Catches network errors and handles fallback response cleanly.'
      ],
      expectedBehavior: 'Function reliably returns a standardized result object without uncaught Promise rejections.',
      commonMistakes: ['Assuming fetch rejects on 404/500 errors (fetch only rejects on network failures).', 'Passing an async function directly to useEffect without an inner function.'],
      practiceLevels: {
        levelA: 'Wrap a fetch call in async/await with try/catch.',
        levelB: 'Fetch user profile and posts concurrently using Promise.all.',
        levelC: 'Build a safe async wrapper that returns [error, data] tuple like Go/Lua.'
      },
      debuggingChallenge: {
        brokenCode: `useEffect(async () => {\n  const data = await fetch('/api');\n}, []);`,
        problem: 'useEffect callbacks must return either nothing or a cleanup function. An async function returns a Promise!',
        fix: 'Declare an inner async function: useEffect(() => { async function load() { ... } load(); }, []);'
      },
      conceptualQuestion: {
        question: 'Why does useEffect(() => { async () => {} }, []) cause React warnings or errors?',
        options: [
          'Because browsers do not support async functions.',
          'Because useEffect expects the returned value to be a synchronous cleanup function, not a Promise.',
          'Because async functions cannot access component state.',
          'Because async functions trigger synchronous re-renders.'
        ],
        correctIndex: 1,
        explanation: 'React calls the cleanup function returned by useEffect when the component unmounts or before re-running the effect. A Promise cannot be invoked as a cleanup function.'
      },
      codeReadingQuestion: {
        snippet: `const p1 = Promise.resolve(10);\nconst p2 = Promise.reject('Fail');\nPromise.allSettled([p1, p2]).then(res => console.log(res.length));`,
        question: 'What is logged?',
        answer: '2 (allSettled waits for all promises regardless of rejection).'
      },
      starterCode: `// Assignment: Implement safeAsync\n// Create an async function runner safeAsync(asyncFn)\n// Returns a Promise resolving to: { data: any, error: string | null }\n// If asyncFn succeeds, error is null.\n// If asyncFn throws an error, data is null and error is err.message.\n\nexport async function safeAsync(asyncFn) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Resolves data cleanly on success',
          run: async (fn) => {
            const res = await fn(async () => 42);
            return res.data === 42 && res.error === null;
          }
        },
        {
          name: 'Catches error and formats error message on rejection',
          run: async (fn) => {
            const res = await fn(async () => { throw new Error('API timeout'); });
            return res.data === null && res.error === 'API timeout';
          }
        }
      ],
      hints: [
        'Use try { const data = await asyncFn(); return { data, error: null }; } catch (err) { ... }'
      ],
      checklist: [
        'Awaited the passed async function',
        'Caught synchronous and asynchronous exceptions',
        'Returned standardized { data, error } contract'
      ],
      revisionSummary: 'Async/await provides structured async error boundaries crucial for React data fetching and server actions.'
    },
    {
      id: 'p0-l9',
      slug: 'event-loop-microtasks',
      title: 'The Event Loop, Microtasks, and Macrotasks',
      prerequisites: ['p0-l8'],
      estimatedDuration: '30 mins',
      difficulty: 'Advanced',
      objectives: ['Trace the order of execution between call stack, microtask queue, and macrotask queue.', 'Understand why React 18 batches state updates across task boundaries.'],
      explanation: 'The JavaScript runtime is single-threaded and non-blocking. Synchronous code executes on the Call Stack. Microtasks (Promise.then, queueMicrotask) run immediately after the current call stack empties and before the browser renders. Macrotasks (setTimeout, setInterval, requestAnimationFrame, DOM events) run in subsequent loop ticks.',
      whyItExists: 'Explains execution ordering, state batching behavior in React 18, and why console.log after setState shows previous values.',
      syntaxRules: 'Microtasks always have strict priority over macrotasks. The microtask queue must be completely drained before the next macrotask is executed.',
      codeExample: `console.log('1: Sync');\nsetTimeout(() => console.log('4: Macrotask'), 0);\nPromise.resolve().then(() => console.log('3: Microtask'));\nconsole.log('2: Sync');\n// Order: 1 -> 2 -> 3 -> 4`,
      lineByLine: [
        'Line 1 & 4: Run synchronously on the call stack.',
        'Line 2: Schedules callback in macrotask queue.',
        'Line 3: Schedules callback in microtask queue (runs before macrotask).'
      ],
      expectedBehavior: 'Microtasks execute before any macrotask callback is picked up.',
      commonMistakes: ['Thinking setTimeout(..., 0) runs immediately.', 'Assuming state update is synchronous because it happens after await.'],
      practiceLevels: {
        levelA: 'Predict output order for mixed console.log, Promise, and setTimeout code.',
        levelB: 'Use queueMicrotask() to execute work right before painting.',
        levelC: 'Explain React 18 automatic batching across microtasks and event listeners.'
      },
      debuggingChallenge: {
        brokenCode: `function execute() {\n  let val = 'initial';\n  setTimeout(() => { val = 'updated'; }, 0);\n  return val;\n}`,
        problem: 'execute() returns "initial" because setTimeout is asynchronous and deferred to macrotask queue.',
        fix: 'Return a Promise or accept a callback to deliver the deferred value.'
      },
      conceptualQuestion: {
        question: 'Which queue processes Promise.then callbacks?',
        options: [
          'The Macrotask queue',
          'The Microtask queue',
          'The Render queue',
          'The Thread pool'
        ],
        correctIndex: 1,
        explanation: 'Promise callbacks are microtasks and execute immediately after the call stack clears, before the browser repaints or picks the next macrotask.'
      },
      codeReadingQuestion: {
        snippet: `setTimeout(() => console.log('A'), 0);\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');`,
        question: 'What is the order of printed letters?',
        answer: 'C, then B, then A.'
      },
      starterCode: `// Assignment: Implement simulateEventLoopOrder\n// Given an array of task descriptors: [{ type: 'sync' | 'microtask' | 'macrotask', id: string }]\n// Return an array of ids in the exact order the JavaScript runtime executes them:\n// 1. All 'sync' tasks in original order\n// 2. All 'microtask' tasks in original order\n// 3. All 'macrotask' tasks in original order\n\nexport function simulateEventLoopOrder(tasks) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Orders sync -> microtask -> macrotask',
          run: (fn) => {
            const list = [
              { type: 'macrotask', id: 'timer' },
              { type: 'sync', id: 'log1' },
              { type: 'microtask', id: 'promise' },
              { type: 'sync', id: 'log2' }
            ];
            const order = fn(list);
            return JSON.stringify(order) === JSON.stringify(['log1', 'log2', 'promise', 'timer']);
          }
        }
      ],
      hints: [
        'Filter for sync first, then microtask, then macrotask, extracting .id for each group.'
      ],
      checklist: [
        'Preserved internal order within each category',
        'Prioritized synchronous stack first, then microtasks, then macrotasks'
      ],
      revisionSummary: 'The event loop prioritizes the synchronous stack, drains microtasks, and finally dequeues macrotasks.'
    },
    {
      id: 'p0-l10',
      slug: 'reference-types-shallow-deep-copies',
      title: 'Reference Types, Shallow Copies, and Deep Copies',
      prerequisites: ['p0-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Differentiate stack vs heap memory in JS.', 'Understand shallow copy limitations of {...spread} and Object.assign.', 'Perform true deep clones using structuredClone().'],
      explanation: 'Primitives (strings, numbers, booleans) are copied by value. Objects, arrays, and functions are copied by reference. When you do {...user}, only top-level properties are cloned; nested objects are still shared references! Mutating a nested property on a shallow copy silently mutates the original.',
      whyItExists: 'A premier source of state bugs in React applications with nested data structures.',
      syntaxRules: 'Use structuredClone(value) for native deep cloning. Avoid JSON.parse(JSON.stringify(x)) when data includes Dates, undefined, Functions, or circular references.',
      codeExample: `const state = { user: { profile: { theme: 'dark' } } };\n// Shallow copy bug:\nconst shallow = { ...state };\nshallow.user.profile.theme = 'light';\nconsole.log(state.user.profile.theme); // 'light' (MUTATED!)\n\n// Safe Deep Clone:\nconst deep = structuredClone(state);\ndeep.user.profile.theme = 'neon'; // state remains 'light'`,
      lineByLine: [
        'Line 4: {...state} only clones the top-level state object, not user or profile.',
        'Line 9: structuredClone recursively clones all nested objects and arrays.'
      ],
      expectedBehavior: 'Deep clones are completely isolated in memory; mutations to one have zero impact on the other.',
      commonMistakes: ['Thinking {...nestedObj} deep-copies child objects.', 'Using JSON.stringify on objects containing functions or undefined.'],
      practiceLevels: {
        levelA: 'Demonstrate that two object variables reference the same heap object.',
        levelB: 'Perform a 2-level shallow copy update cleanly in React style.',
        levelC: 'Implement a recursive deep clone function handling objects and arrays.'
      },
      debuggingChallenge: {
        brokenCode: `function cloneAndSet(obj, key, val) {\n  const copy = Object.assign({}, obj);\n  copy.settings[key] = val;\n  return copy;\n}`,
        problem: 'copy.settings is a shared reference with obj.settings. Mutating it mutates obj!',
        fix: 'copy.settings = { ...copy.settings, [key]: val };'
      },
      conceptualQuestion: {
        question: 'What is the modern native JavaScript function for creating true deep clones?',
        options: [
          'Object.clone()',
          'structuredClone()',
          'JSON.clone()',
          'Array.prototype.deepCopy()'
        ],
        correctIndex: 1,
        explanation: 'structuredClone() is the built-in browser and Node.js standard algorithm for creating deep clones of complex values.'
      },
      codeReadingQuestion: {
        snippet: `const a = [{ x: 1 }];\nconst b = [...a];\nb[0].x = 99;\nconsole.log(a[0].x);`,
        question: 'What is logged?',
        answer: '99 (array was shallow-copied, but the item object inside it was shared).'
      },
      starterCode: `// Assignment: Implement updateNestedSetting\n// Given state: { id, settings: { notifications: { email: boolean, sms: boolean } } }\n// Return a new state object where settings.notifications[channel] = enabled.\n// Original state, settings, and notifications must NOT be mutated.\n\nexport function updateNestedSetting(state, channel, enabled) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Updates nested channel without mutating original references',
          run: (fn) => {
            const original = { id: 1, settings: { notifications: { email: true, sms: false } } };
            const updated = fn(original, 'sms', true);
            return updated.settings.notifications.sms === true && original.settings.notifications.sms === false && original !== updated && original.settings !== updated.settings && original.settings.notifications !== updated.settings.notifications;
          }
        }
      ],
      hints: [
        'Return { ...state, settings: { ...state.settings, notifications: { ...state.settings.notifications, [channel]: enabled } } }'
      ],
      checklist: [
        'All three object levels received fresh memory references',
        'Specified channel was updated',
        'No mutations occurred on original input'
      ],
      revisionSummary: 'Shallow copies copy references for nested values; React immutable state updates require copying every level that changes.'
    },
    {
      id: 'p0-l11',
      slug: 'dom-fundamentals-browser-events',
      title: 'DOM Fundamentals and Browser Events',
      prerequisites: ['p0-l3'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Understand how the real DOM tree works and why direct mutations are costly.', 'Explain event bubbling, capturing, and delegation.', 'Understand SyntheticEvent in React.'],
      explanation: 'The Document Object Model (DOM) is the tree of nodes created by the browser from HTML. Direct DOM operations (document.createElement, innerHTML) trigger browser layout and repaint pipelines. React introduces a virtual representation to batch and minimize these costly DOM writes.',
      whyItExists: 'Understanding native browser events helps grasp why React uses synthetic events and event delegation on the root container.',
      syntaxRules: 'event.preventDefault() stops native behavior (e.g., form submit refresh). event.stopPropagation() stops event bubbling up the DOM tree.',
      codeExample: `// Browser Event Handling\nconst btn = document.getElementById('save-btn');\nbtn.addEventListener('click', (e) => {\n  e.preventDefault();\n  console.log('Clicked target:', e.target);\n});`,
      lineByLine: [
        'Line 2: Attaches an event listener to the native DOM element.',
        'Line 4: preventDefault cancels browser default submission.'
      ],
      expectedBehavior: 'Events bubble from the target element up through all parent ancestors to window.',
      commonMistakes: ['Calling document.getElementById inside React components instead of using useRef.', 'Confusing e.target (element clicked) with e.currentTarget (element holding the listener).'],
      practiceLevels: {
        levelA: 'Prevent form submission reload using e.preventDefault().',
        levelB: 'Implement event delegation on a parent <ul> to catch clicks on any <li>.',
        levelC: 'Inspect differences between e.target and e.currentTarget in nested components.'
      },
      debuggingChallenge: {
        brokenCode: `function handleParentClick(e) {\n  // Expects only parent clicks\n  doSomething(e.target.dataset.parentId);\n}`,
        problem: 'If a child icon or span is clicked, e.target is the child, not the parent, causing undefined dataset.',
        fix: 'Use e.currentTarget to always inspect the element that holds the listener.'
      },
      conceptualQuestion: {
        question: 'What is event bubbling in browser DOM?',
        options: [
          'Events traveling from window down to the target node.',
          'Events firing on the target node and propagating upwards to its ancestors.',
          'Events repeating indefinitely in an animation loop.',
          'Events failing to execute due to memory leaks.'
        ],
        correctIndex: 1,
        explanation: 'Event bubbling means the event triggers on the innermost target element first, then bubbles upward through parent nodes.'
      },
      codeReadingQuestion: {
        snippet: `<div onclick="console.log('div')"><button onclick="console.log('btn')">Click</button></div>`,
        question: 'What is logged when button is clicked (without stopPropagation)?',
        answer: '"btn" followed by "div" (due to bubbling).'
      },
      starterCode: `// Assignment: Implement parseClickEvent\n// Create a function that takes an event-like object:\n// { target: { tagName, id }, currentTarget: { id }, defaultPrevented }\n// Returns a summary: { isTargetSelf: boolean, elementTag: string, wasPrevented: boolean }\n\nexport function parseClickEvent(event) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Summarizes event target and delegation match',
          run: (fn) => {
            const ev = { target: { tagName: 'BUTTON', id: 'submit' }, currentTarget: { id: 'submit' }, defaultPrevented: true };
            const res = fn(ev);
            return res.isTargetSelf === true && res.elementTag === 'BUTTON' && res.wasPrevented === true;
          }
        }
      ],
      hints: [
        'Compare event.target.id === event.currentTarget.id for isTargetSelf.'
      ],
      checklist: [
        'Extracted target information',
        'Compared target with currentTarget',
        'Read defaultPrevented property'
      ],
      revisionSummary: 'React wraps browser events in SyntheticEvents, attaching a single delegator to the root container for high performance.'
    },
    {
      id: 'p0-l12',
      slug: 'http-json-rest-apis-fetch',
      title: 'HTTP, JSON, REST APIs, and fetch',
      prerequisites: ['p0-l8'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: ['Master HTTP methods: GET, POST, PUT, PATCH, DELETE.', 'Understand HTTP status code ranges (200, 201, 400, 401, 403, 404, 500).', 'Serialize and parse JSON payloads safely.'],
      explanation: 'React single-page applications communicate with backends (Express, Nest, Next.js API) via HTTP requests exchanging JSON. Fetch is the native Web API for making network requests. Understanding request headers (Content-Type, Authorization) is mandatory for MERN full-stack development.',
      whyItExists: 'Connects client-side user interactions with server-side database persistence.',
      syntaxRules: 'fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }). Always check response.ok.',
      codeExample: `async function createPost(postData) {\n  const response = await fetch('/api/posts', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(postData)\n  });\n  if (!response.ok) {\n    throw new Error(\`Failed to create post: \${response.status}\`);\n  }\n  return await response.json();\n}`,
      lineByLine: [
        'Line 2: method POST tells the server to create a new resource.',
        'Line 3: headers specify JSON encoding.',
        'Line 4: JSON.stringify converts JS object to JSON string.',
        'Line 6: Checks HTTP status before parsing response.'
      ],
      expectedBehavior: 'HTTP request is transmitted and resolved response payload parsed into native JS object.',
      commonMistakes: ['Forgetting JSON.stringify() in request body, sending [object Object].', 'Assuming fetch throws on 401 or 500 status codes.'],
      practiceLevels: {
        levelA: 'Send a GET request and parse the JSON response.',
        levelB: 'Send a POST request with Authorization Bearer token header.',
        levelC: 'Build a reusable apiClient with interceptors for baseURL and token injection.'
      },
      debuggingChallenge: {
        brokenCode: `fetch('/api/user', {\n  method: 'POST',\n  body: { name: 'Alex' }\n});`,
        problem: 'body is an object without JSON.stringify and missing Content-Type header.',
        fix: 'headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Alex" })'
      },
      conceptualQuestion: {
        question: 'Which HTTP status code signifies that a resource was successfully created?',
        options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
        correctIndex: 1,
        explanation: '201 Created is the RESTful HTTP standard status code returned when a POST operation creates a new record.'
      },
      codeReadingQuestion: {
        snippet: `fetch('/api').then(res => { console.log(typeof res); return res.json(); }).then(data => console.log(typeof data));`,
        question: 'What are the two types logged?',
        answer: 'object (Response instance) and object (parsed JSON object/array).'
      },
      starterCode: `// Assignment: Implement buildRequestPayload\n// Build an HTTP request options generator:\n// buildRequestPayload(method, data, token)\n// Requirements:\n// 1. Returns { method, headers: { 'Content-Type': 'application/json' }, body: string }\n// 2. If token is provided, add 'Authorization': \`Bearer \${token}\` to headers.\n// 3. If method is 'GET' or 'DELETE', body must be undefined.\n\nexport function buildRequestPayload(method, data, token) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Creates POST payload with serialized body and auth header',
          run: (fn) => {
            const res = fn('POST', { title: 'New' }, 'jwt_secret');
            return res.method === 'POST' && res.headers['Content-Type'] === 'application/json' && res.headers['Authorization'] === 'Bearer jwt_secret' && res.body === JSON.stringify({ title: 'New' });
          }
        },
        {
          name: 'Omits body on GET requests',
          run: (fn) => {
            const res = fn('GET', null, null);
            return res.method === 'GET' && res.body === undefined && res.headers['Authorization'] === undefined;
          }
        }
      ],
      hints: [
        'Conditionally set body: (method === "GET" || method === "DELETE") ? undefined : JSON.stringify(data)'
      ],
      checklist: [
        'Formatted Content-Type header',
        'Injected Bearer authorization token conditionally',
        'Omitted body for GET and DELETE methods'
      ],
      revisionSummary: 'REST APIs communicate with JSON payloads and HTTP status codes; fetch requires careful header and status handling.'
    },
    {
      id: 'p0-l13',
      slug: 'git-npm-basic-debugging',
      title: 'Git, npm, and Basic Debugging',
      prerequisites: ['p0-l1'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: ['Understand npm package.json, dependencies vs devDependencies, and lockfiles.', 'Use git branching and commit practices for feature development.', 'Inspect runtime issues with debugger, console.table(), and breakpoints.'],
      explanation: 'Modern React projects rely on package managers (npm, pnpm) to manage dependencies and Git for version control. Debugging effectively using browser DevTools (Sources tab, breakpoints, console) saves hours compared to guessing.',
      whyItExists: 'Forms the everyday operational foundation of a working software engineer.',
      syntaxRules: 'dependencies are required in production runtime; devDependencies (Vite, ESLint, TypeScript) are build-time tools only.',
      codeExample: `// package.json dependencies separation\n// "dependencies": { "react": "^19.0.0" },\n// "devDependencies": { "vite": "^6.0.0" }\n\n// Debugging with console.table\nconst users = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Bob' }];\nconsole.table(users);`,
      lineByLine: [
        'Line 2-3: Distinguishes runtime packages from dev tooling.',
        'Line 7: console.table prints structured tabular representations of arrays/objects.'
      ],
      expectedBehavior: 'Clean dependency trees, clear commit logs, and rapid root-cause isolation during bugs.',
      commonMistakes: ['Committing node_modules to Git (must always be in .gitignore).', 'Installing build tools as runtime dependencies.'],
      practiceLevels: {
        levelA: 'Use console.table and console.time / console.timeEnd to inspect execution.',
        levelB: 'Set a conditional breakpoint in Chrome DevTools.',
        levelC: 'Configure a clean git commit and semantic versioning tag.'
      },
      debuggingChallenge: {
        brokenCode: `// Git error: fatal: 'origin' does not appear to be a git repository`,
        problem: 'Remote URL has not been configured on local repository.',
        fix: 'Run: git remote add origin <repo-url>'
      },
      conceptualQuestion: {
        question: 'What is the purpose of package-lock.json?',
        options: [
          'It locks the code so it cannot be edited.',
          'It pins the exact resolved versions and checksums of every dependency and sub-dependency to guarantee reproducible builds.',
          'It encrypts passwords in the repository.',
          'It is only used by the npm publish command.'
        ],
        correctIndex: 1,
        explanation: 'package-lock.json ensures every team member and deployment server installs the exact same dependency tree.'
      },
      codeReadingQuestion: {
        snippet: `// package.json:\n// "scripts": { "dev": "vite", "build": "vite build" }`,
        question: 'What CLI command executes the build script?',
        answer: 'npm run build'
      },
      starterCode: `// Assignment: Implement auditDependencies\n// Takes an object: { dependencies: Record<string, string>, devDependencies: Record<string, string> }\n// Returns an audit summary: { total: number, runtimeCount: number, devCount: number, duplicates: string[] }\n// duplicates lists any package name present in BOTH dependencies and devDependencies.\n\nexport function auditDependencies(manifest) {\n  // Your code here\n}`,
      testCases: [
        {
          name: 'Computes package counts and detects duplicate packages',
          run: (fn) => {
            const manifest = {
              dependencies: { react: '^19.0.0', lodash: '^4.17.0' },
              devDependencies: { vite: '^6.0.0', lodash: '^4.17.0' }
            };
            const audit = fn(manifest);
            return audit.runtimeCount === 2 && audit.devCount === 2 && audit.duplicates.includes('lodash') && audit.total === 3;
          }
        }
      ],
      hints: [
        'Get Object.keys(manifest.dependencies || {}) and devDependencies.',
        'Check which keys exist in both sets.'
      ],
      checklist: [
        'Counted dependencies and devDependencies',
        'Identified overlapping duplicate package names',
        'Calculated total distinct packages'
      ],
      revisionSummary: 'Git, npm package management, and browser DevTools breakpoints are indispensable software engineering workflows.'
    }
  ]
};
