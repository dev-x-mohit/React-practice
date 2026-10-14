// Phase 9: TypeScript with React
export const phase9 = {
  id: 'phase-9',
  title: 'Phase 9 — TypeScript with React',
  description: 'Master full end-to-end type safety in modern React: typing component props, children (ReactNode vs ReactElement), DOM event handlers, useState generics, useRef variants, useReducer discriminated unions, generic components, polymorphic as props, and TypeScript utility types.',
  icon: 'ShieldCheck',
  badge: 'TypeScript',
  estimatedHours: 14,
  lessons: [
    {
      id: 'p9-l1',
      slug: 'ts-react-setup-foundations',
      title: 'TypeScript Foundations in React (TSX vs JSX)',
      prerequisites: ['p1-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand how TSX compiles to JavaScript.',
        'Configure tsconfig.json compiler options for React (jsx: react-jsx).',
        'Recognize the benefits of compile-time error detection vs runtime bugs.'
      ],
      explanation: 'TypeScript adds a compile-time static type system on top of JavaScript. In React, files containing JSX are given the `.tsx` extension. Vite uses esbuild to strip types almost instantaneously, while TypeScript checks your props, state, and event signatures. If a parent forgets a required prop or passes a string instead of a number, TypeScript catches it in your editor before you ever refresh your browser.',
      whyItExists: 'Eliminates entire categories of runtime bugs (like `cannot read properties of undefined`) and provides autocomplete for props and state.',
      syntaxRules: 'Use .tsx file extension for files with JSX. Ensure compilerOptions.jsx is set to "react-jsx" in tsconfig.json.',
      codeExample: `// Greeting.tsx
interface GreetingProps {
  name: string;
  count?: number; // Optional prop
}

export function Greeting({ name, count = 1 }: GreetingProps) {
  return <h1>Hello {name}, visit #{count}</h1>;
}`,
      lineByLine: [
        'Line 2-5: interface GreetingProps defines the contract for props accepted by Greeting.',
        'Line 4: count?: number indicates count is optional and can be undefined.',
        'Line 7: ({ name, count = 1 }: GreetingProps) types the destructured parameter.'
      ],
      expectedBehavior: 'Editor highlights missing required props and suggests valid prop names with autocomplete.',
      commonMistakes: [
        'Using `.ts` instead of `.tsx` for files containing JSX elements (causes syntax parse error on `<tag>`).',
        'Using `any` as an escape hatch, which completely disables type safety.'
      ],
      practiceLevels: {
        levelA: 'Define an interface for a UserBadge component accepting name, email, and isActive.',
        levelB: 'Add optional avatarUrl with a default fallback avatar in the component.',
        levelC: 'Configure tsconfig with strict: true and noImplicitAny: true.'
      },
      debuggingChallenge: {
        brokenCode: `function Card(props: any) {\n  return <div>{props.titl.toUpperCase()}</div>; // Typo 'titl' passes type checker!\n}`,
        problem: 'props is typed as any, so TypeScript cannot catch the typo `titl` instead of `title`.',
        fix: 'Define interface CardProps { title: string } and type props: CardProps.'
      },
      conceptualQuestion: {
        question: 'What does the compiler option `"jsx": "react-jsx"` do in tsconfig.json?',
        options: [
          'Forces React to be imported manually as `import React from "react"` in every file.',
          'Enables the modern automatic JSX runtime so React does not need to be in scope for JSX.',
          'Transpiles JSX into HTML string templates at build time.',
          'Converts TypeScript interfaces into runtime PropTypes.'
        ],
        correctIndex: 1,
        explanation: '`react-jsx` configures TS to use the React 17+ transform (_jsx calls) without requiring manual React imports.'
      },
      codeReadingQuestion: {
        snippet: `type Status = 'idle' | 'loading' | 'success' | 'error';\nconst current: Status = 'pending';`,
        question: 'Will this code compile in TypeScript? Why?',
        answer: 'No. "pending" is not assignable to type Status because Status only permits "idle", "loading", "success", or "error".'
      },
      starterCode: `// Assignment: Implement validatePropsSchema
// Simulate a runtime prop validator that mimics TypeScript type checking:
// schema: object where keys are prop names and values are types ('string' | 'number' | 'boolean')
// required: array of string prop names that must exist
// Return { valid: boolean, errors: string[] }

export function validatePropsSchema(props, schema, required = []) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Validates correct props matching schema and required list',
          run: (fn) => {
            const schema = { name: 'string', age: 'number', isStudent: 'boolean' };
            const res = fn({ name: 'Alice', age: 24 }, schema, ['name']);
            return res.valid === true && res.errors.length === 0;
          }
        },
        {
          name: 'Reports error when required prop is missing',
          run: (fn) => {
            const schema = { title: 'string', count: 'number' };
            const res = fn({ count: 5 }, schema, ['title']);
            return res.valid === false && res.errors.some(e => e.includes('title'));
          }
        },
        {
          name: 'Reports error when prop type does not match schema',
          run: (fn) => {
            const schema = { age: 'number' };
            const res = fn({ age: 'twenty' }, schema, []);
            return res.valid === false && res.errors.some(e => e.includes('type'));
          }
        }
      ],
      solution: `export function validatePropsSchema(props, schema, required = []) {
  const errors = [];
  for (const req of required) {
    if (props[req] === undefined || props[req] === null) {
      errors.push(\`Missing required prop: \${req}\`);
    }
  }
  for (const [key, val] of Object.entries(props)) {
    if (schema[key] && typeof val !== schema[key]) {
      errors.push(\`Invalid prop type for \${key}: expected \${schema[key]}, got \${typeof val}\`);
    }
  }
  return { valid: errors.length === 0, errors };
}`,
      hints: [
        'Check for missing required properties first by verifying props[key] is not undefined.',
        'Compare typeof props[key] against schema[key] for defined properties.',
        'Collect all error strings into an array and return { valid: errors.length === 0, errors }.'
      ]
    },
    {
      id: 'p9-l2',
      slug: 'typing-props-interfaces-types',
      title: 'Typing Component Props: Interfaces vs Type Aliases',
      prerequisites: ['p9-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Beginner',
      objectives: [
        'Choose between interface and type alias for component props.',
        'Type optional props and provide default parameters.',
        'Extend prop interfaces with `extends` or intersection types (`&`).'
      ],
      explanation: 'In React TypeScript, props can be defined using either `interface` or `type`. Interfaces support declaration merging and extension via `extends`, making them ideal for component prop contracts. Type aliases excel at unions (`type Variant = "primary" | "secondary"`), tuples, and complex mapped types. Both enforce that parents supply the exact data your component expects.',
      whyItExists: 'Ensures clear component APIs, eliminates undocumented props, and prevents accidental prop name mismatches.',
      syntaxRules: 'Use `interface ButtonProps { label: string; onClick: () => void; }` or `type ButtonProps = { ... }`. Extend using `interface X extends Y` or `type X = Y & { ... }`.',
      codeExample: `interface BaseProps {
  id: string;
  className?: string;
}

interface ButtonProps extends BaseProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function Button({ label, variant = 'primary', disabled = false, className = '', id }: ButtonProps) {
  return (
    <button id={id} className={\`btn btn-\${variant} \${className}\`} disabled={disabled}>
      {label}
    </button>
  );
}`,
      lineByLine: [
        'Line 1-4: BaseProps defines standard HTML attributes shared by multiple components.',
        'Line 6-10: ButtonProps extends BaseProps, inheriting id and className while adding Button-specific props.',
        'Line 8: variant is restricted to exactly three string literal options.'
      ],
      expectedBehavior: 'Passing an unsupported variant like `variant="awesome"` throws a compile error.',
      commonMistakes: [
        'Using plain `string` when a closed union like `"sm" | "md" | "lg"` would prevent invalid values.',
        'Marking a prop as optional in the interface (`prop?: string`) but accessing `prop.length` without a null check or default.'
      ],
      practiceLevels: {
        levelA: 'Create an AlertProps interface with type: "info" | "warning" | "error" and message: string.',
        levelB: 'Extend HTML button attributes into your custom button interface.',
        levelC: 'Build a Discriminated union of props (e.g. if isLink is true, href is required; if isLink is false, onClick is required).'
      },
      debuggingChallenge: {
        brokenCode: `interface ModalProps {\n  title: string;\n  onClose?: () => void;\n}\nfunction Modal({ title, onClose }: ModalProps) {\n  return <button onClick={onClose()}>Close</button>; // Error!\n}`,
        problem: 'onClose is called immediately `onClose()` instead of passed as a handler, and onClose might be undefined.',
        fix: 'Pass `onClick={onClose}` directly or `onClick={() => onClose?.()}`.'
      },
      conceptualQuestion: {
        question: 'What is the primary difference between `interface` and `type` for React props?',
        options: [
          'Interfaces cannot be used with React components.',
          'Interfaces can be extended via `extends` and merged; `type` aliases can represent union types and primitives directly.',
          '`type` runs at runtime while `interface` runs at compile time.',
          'There is no difference; they are strictly identical in every scenario.'
        ],
        correctIndex: 1,
        explanation: 'Interfaces support inheritance and declaration merging; types can express union types (`"a" | "b"`), intersections (`&`), and mapped types.'
      },
      codeReadingQuestion: {
        snippet: `type HeaderProps = { title: string } & ({ subtitle: string; showBadge: true } | { subtitle?: never; showBadge?: false });`,
        question: 'If showBadge is true, is subtitle required or optional?',
        answer: 'Required. When showBadge is true, subtitle must be a string according to the first branch of the union.'
      },
      starterCode: `// Assignment: Implement mergePropsConfig
// Implement a function that merges base props with override props according to type rules:
// base: object
// overrides: object
// rules: object defining { [key]: 'override' | 'concat' | 'fallback' }
// - 'override': override replaces base
// - 'concat': strings are joined with space, arrays are joined
// - 'fallback': use override if defined and non-null, else base

export function mergePropsConfig(base, overrides, rules = {}) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Merges with override rule',
          run: (fn) => {
            const base = { label: 'Click', disabled: false };
            const over = { label: 'Submit' };
            const res = fn(base, over, { label: 'override' });
            return res.label === 'Submit' && res.disabled === false;
          }
        },
        {
          name: 'Concatenates strings for className',
          run: (fn) => {
            const base = { className: 'btn' };
            const over = { className: 'btn-primary active' };
            const res = fn(base, over, { className: 'concat' });
            return res.className === 'btn btn-primary active';
          }
        },
        {
          name: 'Applies fallback for undefined overrides',
          run: (fn) => {
            const base = { variant: 'default' };
            const over = { variant: undefined };
            const res = fn(base, over, { variant: 'fallback' });
            return res.variant === 'default';
          }
        }
      ],
      solution: `export function mergePropsConfig(base, overrides, rules = {}) {
  const result = { ...base };
  for (const [key, val] of Object.entries(overrides)) {
    const rule = rules[key] || 'override';
    if (rule === 'concat') {
      if (typeof result[key] === 'string' && typeof val === 'string') {
        result[key] = result[key] ? \`\${result[key]} \${val}\`.trim() : val;
      } else if (Array.isArray(result[key]) && Array.isArray(val)) {
        result[key] = [...result[key], ...val];
      } else {
        result[key] = val !== undefined ? val : result[key];
      }
    } else if (rule === 'fallback') {
      result[key] = (val !== undefined && val !== null) ? val : result[key];
    } else {
      if (val !== undefined) result[key] = val;
    }
  }
  return result;
}`,
      hints: [
        'Start with a shallow clone of base: const result = { ...base }.',
        'Iterate over Object.entries(overrides) and check the rule in rules[key].',
        'Handle "concat" for strings by joining with spaces.'
      ]
    },
    {
      id: 'p9-l3',
      slug: 'typing-children-reactnode-reactelement',
      title: 'Typing Children: ReactNode vs ReactElement',
      prerequisites: ['p9-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Differentiate between React.ReactNode, React.ReactElement, and JSX.Element.',
        'Use PropsWithChildren helper type appropriately.',
        'Restrict children types when a component only accepts specific elements.'
      ],
      explanation: 'In React TypeScript, typing `children` correctly is essential: \n- `React.ReactNode`: The most permissive and common type for children. Can be a React element, string, number, array of nodes, fragment, boolean, null, or undefined.\n- `React.ReactElement`: Specifically a JSX element object (like `<Card />` or `<div>`). Cannot be a primitive string, number, or boolean.\n- `PropsWithChildren<P>`: A TypeScript utility type that automatically adds `children?: React.ReactNode` to your props interface `P`.',
      whyItExists: 'Ensures parent containers receive valid renderable content while preventing type mismatch errors with primitives.',
      syntaxRules: 'Use `children: React.ReactNode` for general containers. Use `React.ReactElement` when using `React.cloneElement` or expecting a single JSX component.',
      codeExample: `import React, { PropsWithChildren } from 'react';

// Approach 1: Explicit interface
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Approach 2: PropsWithChildren
type SectionProps = PropsWithChildren<{ id: string }>;
export function Section({ id, children }: SectionProps) {
  return <section id={id}>{children}</section>;
}`,
      lineByLine: [
        'Line 5: children: React.ReactNode permits strings, JSX, fragments, or null.',
        'Line 17: PropsWithChildren<{ id: string }> adds children?: React.ReactNode automatically.'
      ],
      expectedBehavior: 'Container accepts strings, elements, numbers, or sub-components seamlessly.',
      commonMistakes: [
        'Typing children as `JSX.Element` when the parent might pass text `"Hello"` (causes compile error: string is not assignable to JSX.Element).',
        'Using `PropsWithChildren` when the component should NOT accept any children.'
      ],
      practiceLevels: {
        levelA: 'Create a Modal wrapper component with header, footer, and children: React.ReactNode.',
        levelB: 'Type a render-props component where children is a function: `(isOpen: boolean) => React.ReactNode`.',
        levelC: 'Use React.Children.map with React.isValidElement to enforce child types at runtime.'
      },
      debuggingChallenge: {
        brokenCode: `interface LayoutProps {\n  children: JSX.Element;\n}\n// Usage:\n<Layout>Just some plain text</Layout> // Type error!`,
        problem: 'JSX.Element does not accept primitive strings; only JSX elements.',
        fix: 'Change children type to `React.ReactNode`.'
      },
      conceptualQuestion: {
        question: 'Which type should you use for standard component `children` that can receive text, JSX, or arrays of items?',
        options: [
          '`JSX.Element`',
          '`React.ReactNode`',
          '`HTMLElement`',
          '`React.Component`'
        ],
        correctIndex: 1,
        explanation: '`React.ReactNode` represents anything that can be rendered inside JSX (strings, numbers, elements, portals, boolean/null/undefined).'
      },
      codeReadingQuestion: {
        snippet: `type SlotProps = { icon: React.ReactElement };\n<Slot icon="star" />`,
        question: 'Why will this fail compilation?',
        answer: '"star" is a primitive string, not a React.ReactElement. It must be passed as an element like `<StarIcon />`.'
      },
      starterCode: `// Assignment: Implement inspectChildrenNodes
// Simulate a parser that inspects an array of children descriptors and classifies them:
// descriptors: array of { type: string, value: any }
// Types can be: 'element', 'string', 'number', 'boolean', 'null', 'undefined'
// Return an object: { textCount: number, elementCount: number, isRenderable: boolean }
// isRenderable is true if at least one child is a string, number, or element.

export function inspectChildrenNodes(children) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Correctly classifies elements and text nodes',
          run: (fn) => {
            const list = [
              { type: 'element', value: 'div' },
              { type: 'string', value: 'Hello' },
              { type: 'null', value: null }
            ];
            const res = fn(list);
            return res.elementCount === 1 && res.textCount === 1 && res.isRenderable === true;
          }
        },
        {
          name: 'Handles non-renderable only children (boolean / null)',
          run: (fn) => {
            const list = [
              { type: 'boolean', value: false },
              { type: 'null', value: null }
            ];
            const res = fn(list);
            return res.textCount === 0 && res.elementCount === 0 && res.isRenderable === false;
          }
        }
      ],
      solution: `export function inspectChildrenNodes(children) {
  let textCount = 0;
  let elementCount = 0;
  for (const child of children) {
    if (child.type === 'string' || child.type === 'number') {
      textCount++;
    } else if (child.type === 'element') {
      elementCount++;
    }
  }
  return {
    textCount,
    elementCount,
    isRenderable: (textCount + elementCount) > 0
  };
}`,
      hints: [
        'Iterate through the array and increment counters based on child.type.',
        'Strings and numbers count toward textCount.',
        'elementCount counts child.type === "element".'
      ]
    },
    {
      id: 'p9-l4',
      slug: 'typing-usestate-generics-unions',
      title: 'Typing useState: Inference, Generics, and Union State',
      prerequisites: ['p3-l1', 'p9-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Beginner',
      objectives: [
        'Rely on TypeScript type inference for simple primitives.',
        'Supply explicit type arguments for nullable or complex state: `useState<User | null>(null)`.',
        'Type array and object states cleanly without defaulting to `any[]`.'
      ],
      explanation: 'When initializing `useState` with a primitive like `useState(0)` or `useState("initial")`, TypeScript automatically infers `number` or `string`. However, when state starts as `null` or an empty array `[]`, inference fails or defaults to `null` or `never[]`. In these cases, you must provide explicit generics: `useState<User | null>(null)` or `useState<Todo[]>([]).',
      whyItExists: 'Prevents typescript from inferring `never[]` on empty arrays and forces you to handle `null` safely before accessing properties.',
      syntaxRules: 'Syntax: `const [state, setState] = useState<Type | null>(initialVal)`. For inferred types: `useState(5)` (no generic needed).',
      codeExample: `interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

export function UserCard() {
  // 1. Primitive: Inferred as boolean
  const [isOpen, setIsOpen] = useState(false);

  // 2. Complex nullable: Needs explicit generic
  const [user, setUser] = useState<UserProfile | null>(null);

  // 3. Array state: Needs explicit generic
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div>
      <p>Status: {isOpen ? 'Open' : 'Closed'}</p>
      {user ? <p>Welcome, {user.name} ({user.role})</p> : <p>Loading...</p>}
    </div>
  );
}`,
      lineByLine: [
        'Line 9: useState(false) is automatically inferred as boolean without explicit <boolean>.',
        'Line 12: useState<UserProfile | null>(null) permits both UserProfile objects and null.',
        'Line 20: TypeScript forces user check: accessing user.name without {user ? ...} produces type error.'
      ],
      expectedBehavior: 'TypeScript protects you from undefined property access until null check is performed.',
      commonMistakes: [
        'Writing `useState([])` without generics. TS infers `never[]`, causing `.push` or `setState([...state, item])` to fail compilation.',
        'Using `useState<any>(null)` instead of defining a specific interface.'
      ],
      practiceLevels: {
        levelA: 'Define an interface Task and create a `useState<Task[]>` hook.',
        levelB: 'Create a state variable holding a union of status strings: `"idle" | "loading" | "success" | "error"`.',
        levelC: 'Build an optional filter state object typed with `Partial<FilterCriteria>`.'
      },
      debuggingChallenge: {
        brokenCode: `const [items, setItems] = useState([]);\n// Later:\nsetItems(['apple']); // Error: Argument of type 'string' is not assignable to parameter of type 'never'`,
        problem: 'TypeScript inferred `never[]` because the initial array had no elements to infer from.',
        fix: 'Add explicit generic: `useState<string[]>([])`.'
      },
      conceptualQuestion: {
        question: 'Why does `const [user, setUser] = useState(null);` cause issues when later calling `setUser({ id: 1, name: "Sam" })`?',
        options: [
          'Because null is not a valid initial state in React 19.',
          'TypeScript infers the type as `null`, so setUser will only ever accept `null`.',
          'React will crash immediately on mount.',
          'The state is automatically converted to undefined.'
        ],
        correctIndex: 1,
        explanation: 'Without a generic, TS infers state type as `null`. Calling `setUser` with an object fails because object is not assignable to `null`.'
      },
      codeReadingQuestion: {
        snippet: `type State = { status: 'idle' } | { status: 'success'; data: string[] };\nconst [state, setState] = useState<State>({ status: 'idle' });\nif (state.status === 'success') console.log(state.data.length);`,
        question: 'Why does TypeScript allow accessing `state.data` inside the if block without errors?',
        answer: 'Discriminated union narrowing: TS knows that when `state.status === "success"`, the type is narrowed to the second branch which guarantees `data` exists.'
      },
      starterCode: `// Assignment: Implement createStateStore
// Implement a type-safe simulated state manager:
// createStateStore(initialState)
// Methods:
// - getState(): returns current state
// - setState(updater): accepts either a new state value or an updater function (prev => next)
// - subscribe(listener): calls listener(state) whenever state changes, returns unsubscribe function

export function createStateStore(initialState) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Updates state with direct value and calls listeners',
          run: (fn) => {
            const store = fn(10);
            let called = false;
            store.subscribe((val) => { called = val === 20; });
            store.setState(20);
            return store.getState() === 20 && called === true;
          }
        },
        {
          name: 'Updates state with updater function',
          run: (fn) => {
            const store = fn({ count: 1 });
            store.setState(prev => ({ count: prev.count + 5 }));
            return store.getState().count === 6;
          }
        },
        {
          name: 'Correctly unsubscribes listener',
          run: (fn) => {
            const store = fn('a');
            let calls = 0;
            const unsub = store.subscribe(() => { calls++; });
            store.setState('b');
            unsub();
            store.setState('c');
            return calls === 1 && store.getState() === 'c';
          }
        }
      ],
      solution: `export function createStateStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    setState: (updater) => {
      state = typeof updater === 'function' ? updater(state) : updater;
      listeners.forEach(fn => fn(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}`,
      hints: [
        'Store listeners in a Set() so duplicate subscriptions and unsubscriptions are O(1).',
        'In setState, check if typeof updater === "function". If so, pass state to it.',
        'Iterate through listeners and invoke each with the new state.'
      ]
    },
    {
      id: 'p9-l5',
      slug: 'typing-dom-events-handlers',
      title: 'Typing DOM Events and Event Handlers',
      prerequisites: ['p1-l4', 'p9-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Type synthetic events with `React.MouseEvent`, `React.ChangeEvent`, `React.FormEvent`, and `React.KeyboardEvent`.',
        'Supply the corresponding HTML element generic: `HTMLInputElement`, `HTMLButtonElement`, `HTMLFormElement`.',
        'Pass event handlers as inline arrows vs typed handler functions.'
      ],
      explanation: 'React events are not native browser events; they are wrapped in React\'s cross-browser `SyntheticEvent`. When defining a standalone event handler function outside JSX, TypeScript cannot infer the event type automatically. You must explicitly annotate the parameter: e.g. `(e: React.ChangeEvent<HTMLInputElement>) => void`. The generic inside `<...>` specifies which HTML element triggered the event, ensuring properties like `e.currentTarget.value` are fully recognized.',
      whyItExists: 'Enables safe access to element properties like `.value`, `.checked`, or `.files` without runtime casting.',
      syntaxRules: 'Format: `React.[EventType]<HTML[ElementType]>`. Example: `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }`.',
      codeExample: `import React, { useState } from 'react';

export function RegistrationForm() {
  const [email, setEmail] = useState('');

  // 1. Change event on an input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 2. Form submission event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted:', email);
  };

  // 3. Click event on a button
  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleChange} />
      <button type="button" onClick={handleReset}>Clear</button>
      <button type="submit">Submit</button>
    </form>
  );
}`,
      lineByLine: [
        'Line 7: React.ChangeEvent<HTMLInputElement> types input changes; e.target.value is recognized as string.',
        'Line 12: React.FormEvent<HTMLFormElement> gives access to e.preventDefault() for form submission.',
        'Line 18: React.MouseEvent<HTMLButtonElement> types mouse interactions on buttons.'
      ],
      expectedBehavior: 'Autocomplete provides all event properties; passing an invalid handler to an input produces a compile error.',
      commonMistakes: [
        'Typing the event as native `Event` instead of `React.ChangeEvent` or `React.SyntheticEvent`.',
        'Confusing `e.target` (element that dispatched the event) with `e.currentTarget` (element to which event handler is attached).',
        'Omitting the HTML generic `<HTMLInputElement>`, leaving `e.target` as a generic EventTarget without `.value`.'
      ],
      practiceLevels: {
        levelA: 'Type a keyboard event handler listening for the "Enter" key (`React.KeyboardEvent<HTMLInputElement>`).',
        levelB: 'Type a file upload change event handler accessing `e.target.files`.',
        levelC: 'Build a generic form change handler handling both text inputs and checkboxes (`e.target.type === "checkbox"`).'
      },
      debuggingChallenge: {
        brokenCode: `function Input() {\n  const onTextChange = (e: any) => console.log(e.targt.value); // Runtime error: undefined!\n  return <input onChange={onTextChange} />;\n}`,
        problem: 'Typing e as any allowed the typo `targt` instead of `target` to go unnoticed.',
        fix: 'Annotate parameter with `e: React.ChangeEvent<HTMLInputElement>`.'
      },
      conceptualQuestion: {
        question: 'Why does accessing `e.target.value` sometimes show a TypeScript error when `e` is typed only as `React.SyntheticEvent`?',
        options: [
          'Because SyntheticEvent does not have a target property.',
          '`SyntheticEvent.target` is typed as `EventTarget`, which does not guarantee the existence of a `.value` property until narrowed by an element generic like `<HTMLInputElement>`.',
          'Because value is a private property in HTML5.',
          'Because TypeScript prohibits reading form inputs.'
        ],
        correctIndex: 1,
        explanation: 'EventTarget can be any DOM node (like a window or div). Specifying `<HTMLInputElement>` narrows target to an element possessing a `.value` property.'
      },
      codeReadingQuestion: {
        snippet: `const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {\n  if (e.key === 'Enter') submit();\n};`,
        question: 'What property does `e.key` return compared to the deprecated `e.keyCode`?',
        answer: '`e.key` returns a string representation of the key ("Enter", "Escape", "a"), whereas `keyCode` returned a numeric code (13, 27, 65).'
      },
      starterCode: `// Assignment: Implement simulateEventDispatcher
// Build a synthetic event simulation utility:
// simulateEventDispatcher(element, eventName, payload)
// - element: object representing a DOM node { listeners: {}, value: '', checked: false }
// - eventName: 'change' | 'click' | 'submit'
// - payload: object with simulated event data (e.g. { value: 'test' })
// Creates a synthetic event object { defaultPrevented: false, preventDefault(), target: element }
// Calls the registered listener in element.listeners[eventName] passing the synthetic event.
// Returns the event object.

export function simulateEventDispatcher(element, eventName, payload = {}) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Dispatches event and respects preventDefault()',
          run: (fn) => {
            let receivedEvent = null;
            const el = {
              value: 'old',
              listeners: {
                submit: (e) => {
                  e.preventDefault();
                  receivedEvent = e;
                }
              }
            };
            const event = fn(el, 'submit');
            return event.defaultPrevented === true && receivedEvent === event;
          }
        },
        {
          name: 'Updates element value on change event',
          run: (fn) => {
            const el = {
              value: 'init',
              listeners: {
                change: (e) => {
                  el.value = e.target.value;
                }
              }
            };
            fn(el, 'change', { value: 'updated' });
            return el.value === 'updated';
          }
        }
      ],
      solution: `export function simulateEventDispatcher(element, eventName, payload = {}) {
  Object.assign(element, payload);
  const syntheticEvent = {
    defaultPrevented: false,
    target: element,
    currentTarget: element,
    preventDefault() {
      this.defaultPrevented = true;
    },
    stopPropagation() {}
  };
  const handler = element.listeners && element.listeners[eventName];
  if (typeof handler === 'function') {
    handler(syntheticEvent);
  }
  return syntheticEvent;
}`,
      hints: [
        'Create an object with defaultPrevented: false and preventDefault() method that flips it to true.',
        'Assign target and currentTarget to element.',
        'Invoke element.listeners[eventName] if present.'
      ]
    },
    {
      id: 'p9-l6',
      slug: 'typing-useref-dom-vs-mutable',
      title: 'Typing useRef: DOM Element Refs vs Mutable Values',
      prerequisites: ['p3-l4', 'p9-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand the two distinct TypeScript overloads of `useRef`.',
        'Type DOM refs: `useRef<HTMLInputElement>(null)` (read-only `.current`).',
        'Type mutable instance variables: `useRef<number>(0)` (writable `.current`).'
      ],
      explanation: 'TypeScript treats `useRef` differently depending on whether you supply an initial value of `null` and a generic:\n1. **DOM Ref (RefObject)**: `useRef<HTMLInputElement>(null)`. Here, `.current` is typed as `HTMLInputElement | null` and is read-only for you because React manages the assignment when the DOM node mounts/unmounts.\n2. **Mutable Value Ref (MutableRefObject)**: `useRef<number>(0)` or `useRef<NodeJS.Timeout | null>(null)`. Here, `.current` is mutable and you can freely read/write `ref.current = newVal`.',
      whyItExists: 'Prevents accidentally trying to manually reassign a DOM node ref while allowing timer IDs and persistent variables to mutate.',
      syntaxRules: 'DOM Ref: `const ref = useRef<HTMLInputElement>(null);`\nMutable Ref: `const timerRef = useRef<number | null>(null);`',
      codeExample: `import React, { useRef, useEffect } from 'react';

export function AutoFocusInput() {
  // Case 1: DOM ref (React manages .current)
  const inputRef = useRef<HTMLInputElement>(null);

  // Case 2: Mutable value ref (we manage .current)
  const renderCount = useRef<number>(0);

  useEffect(() => {
    // Focus input on mount with optional chaining
    inputRef.current?.focus();
    renderCount.current += 1;
  });

  return (
    <div>
      <input ref={inputRef} placeholder="Type here..." />
      <p>Rendered {renderCount.current} times</p>
    </div>
  );
}`,
      lineByLine: [
        'Line 5: useRef<HTMLInputElement>(null) creates a RefObject typed to an HTML input.',
        'Line 8: useRef<number>(0) creates a MutableRefObject initialized to 0.',
        'Line 12: inputRef.current?.focus() uses optional chaining because current is null before mount.'
      ],
      expectedBehavior: 'Writing `inputRef.current = document.createElement("input")` produces a type error because RefObject is read-only.',
      commonMistakes: [
        'Leaving out `(null)`: `useRef<HTMLInputElement>()` makes `.current` `HTMLInputElement | undefined`, which React does not accept for ref props.',
        'Forgetting that `ref.current` can be `null` before mounting or after unmounting.'
      ],
      practiceLevels: {
        levelA: 'Create a typed ref for an HTMLVideoElement and toggle play/pause.',
        levelB: 'Type an interval ID ref storing `NodeJS.Timeout | number | null`.',
        levelC: 'Build an previous-value hook (`usePrevious<T>`) using a typed mutable ref.'
      },
      debuggingChallenge: {
        brokenCode: `const ref = useRef<HTMLDivElement>();\nreturn <div ref={ref} />; // Type error on ref prop!`,
        problem: 'useRef without initial value initializes with undefined, creating MutableRefObject<HTMLDivElement | undefined> instead of RefObject.',
        fix: 'Pass null as the initial argument: `useRef<HTMLDivElement>(null)`.'
      },
      conceptualQuestion: {
        question: 'Why must you supply `(null)` as the initial value when creating a DOM ref with `useRef<HTMLButtonElement>(null)`?',
        options: [
          'Because React crashes if initial state is undefined.',
          'To select the `RefObject` overload where `.current` is `HTMLButtonElement | null`, which matches React\'s ref prop signature.',
          'Because DOM nodes must always start as null in modern JavaScript.',
          'Null automatically binds the ref to the window object.'
        ],
        correctIndex: 1,
        explanation: 'Providing `null` selects the `RefObject<T>` overload where `current` is read-only and accepts null before the DOM element mounts.'
      },
      codeReadingQuestion: {
        snippet: `const scrollRef = useRef<HTMLDivElement>(null);\nconst scrollToBottom = () => {\n  scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });\n};`,
        question: 'What prevents a crash if `scrollToBottom` is called when the div is not rendered?',
        answer: 'The optional chaining operator (`?.`), which short-circuits execution if `scrollRef.current` is null.'
      },
      starterCode: `// Assignment: Implement createRefSimulator
// Simulate the TypeScript dual behavior of React's useRef:
// createRefSimulator(type, initialValue)
// - type: 'dom' | 'mutable'
// If type === 'dom':
//   - .current is initialValue
//   - attach(node): assigns .current = node
//   - detach(): assigns .current = null
//   - Attempting direct assignment throws or returns error
// If type === 'mutable':
//   - .current can be set and read directly via set(val) and get()

export function createRefSimulator(type, initialValue = null) {
  // Your code here
}`,
      testCases: [
        {
          name: 'DOM ref behaves as managed container',
          run: (fn) => {
            const domRef = fn('dom', null);
            if (domRef.current !== null) return false;
            domRef.attach({ tagName: 'DIV' });
            if (domRef.current?.tagName !== 'DIV') return false;
            domRef.detach();
            return domRef.current === null;
          }
        },
        {
          name: 'Mutable ref allows setting values directly',
          run: (fn) => {
            const mutRef = fn('mutable', 0);
            mutRef.set(42);
            return mutRef.get() === 42 && mutRef.current === 42;
          }
        }
      ],
      solution: `export function createRefSimulator(type, initialValue = null) {
  let val = initialValue;
  if (type === 'dom') {
    return {
      get current() { return val; },
      attach(node) { val = node; },
      detach() { val = null; }
    };
  } else {
    return {
      get current() { return val; },
      set current(next) { val = next; },
      get() { return val; },
      set(next) { val = next; }
    };
  }
}`,
      hints: [
        'Use getter for current: get current() { return val; }.',
        'For mutable ref, also provide a setter for current.',
        'For dom ref, provide attach and detach methods.'
      ]
    },
    {
      id: 'p9-l7',
      slug: 'typing-usereducer-discriminated-unions',
      title: 'Typing useReducer: Discriminated Unions for Actions',
      prerequisites: ['p3-l5', 'p9-l2'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Define strict action types using TypeScript discriminated unions.',
        'Type reducer state interfaces and function signatures.',
        'Use TypeScript exhaustion checking (`never`) in reducer default cases.'
      ],
      explanation: 'Discriminated unions are the gold standard for typing `useReducer`. Each action is an object with a shared literal `type` property (the discriminator) and its specific payload. When your reducer switch statement checks `switch (action.type)`, TypeScript narrows the action inside each `case` block so you can only access the exact payload belonging to that action.',
      whyItExists: 'Prevents passing the wrong payload to an action (e.g. forgetting an ID when deleting) and ensures all action types are handled.',
      syntaxRules: 'Declare action union: `type Action = { type: "add"; payload: Todo } | { type: "delete"; id: string } | { type: "reset" }`.',
      codeExample: `interface State {
  count: number;
  step: number;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set_step'; payload: number }
  | { type: 'reset' };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'set_step':
      // action.payload is strictly typed as number!
      return { ...state, step: action.payload };
    case 'reset':
      return { count: 0, step: 1 };
    default: {
      const _exhaustiveCheck: never = action;
      return state;
    }
  }
}`,
      lineByLine: [
        'Line 6-10: Action union defines all possible actions and their associated payloads.',
        'Line 19: Inside case "set_step", TypeScript knows action has payload of type number.',
        'Line 23: Exhaustive check guarantees a compile error if a new action is added to Action union but omitted in the switch.'
      ],
      expectedBehavior: 'Dispatching `{ type: "set_step" }` without payload or with a string payload triggers an immediate compile error.',
      commonMistakes: [
        'Typing action as `{ type: string; payload?: any }`, which completely destroys type safety in reducers.',
        'Omitting the `never` exhaustive check, allowing forgotten action types to pass silently.'
      ],
      practiceLevels: {
        levelA: 'Build a shopping cart reducer with ADD_ITEM, REMOVE_ITEM, and CLEAR_CART actions.',
        levelB: 'Add a SET_QUANTITY action requiring id: string and quantity: number.',
        levelC: 'Implement exhaustive check asserting `_exhaustive: never = action` in the default case.'
      },
      debuggingChallenge: {
        brokenCode: `type Action = { type: 'add'; item: string } | { type: 'remove'; id: number };\nfunction reducer(state, action: Action) {\n  if (action.type === 'remove') console.log(action.item); // Error!\n}`,
        problem: 'action.item does not exist on the "remove" action; only on "add".',
        fix: 'Access `action.id` instead, which TypeScript recognizes for type "remove".'
      },
      conceptualQuestion: {
        question: 'What is the purpose of assigning `const _check: never = action;` in the default case of a reducer switch?',
        options: [
          'It clears memory at runtime.',
          'It forces TypeScript to verify at compile time that every possible action type in the union was handled.',
          'It restarts the reducer from the beginning.',
          'It converts JavaScript errors into console warnings.'
        ],
        correctIndex: 1,
        explanation: 'If any action member is unhandled, it will fall through to default where its type cannot be assigned to `never`, triggering a compile error.'
      },
      codeReadingQuestion: {
        snippet: `type Action = { type: 'LOGIN'; user: User } | { type: 'LOGOUT' };\n// in reducer:\ncase 'LOGOUT': return { user: null };`,
        question: 'If you try to read `action.user` inside `case "LOGOUT"`, what will TypeScript report?',
        answer: 'Property "user" does not exist on type \'{ type: "LOGOUT" }\'.'
      },
      starterCode: `// Assignment: Implement createDiscriminatedReducer
// Simulate a typed reducer pipeline that verifies action discrimination:
// createDiscriminatedReducer(initialState, handlers)
// handlers: object mapping action types to handler functions (state, action) => newState
// Returns { dispatch(action), getState() }
// Throws Error(\`Unknown action type: \${action.type}\`) if action.type is not in handlers.

export function createDiscriminatedReducer(initialState, handlers) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Dispatches known actions and updates state',
          run: (fn) => {
            const handlers = {
              add: (state, action) => ({ ...state, total: state.total + action.amount }),
              reset: () => ({ total: 0 })
            };
            const store = fn({ total: 10 }, handlers);
            store.dispatch({ type: 'add', amount: 5 });
            if (store.getState().total !== 15) return false;
            store.dispatch({ type: 'reset' });
            return store.getState().total === 0;
          }
        },
        {
          name: 'Throws error for unhandled action types',
          run: (fn) => {
            const store = fn({ count: 0 }, { inc: s => ({ count: s.count + 1 }) });
            try {
              store.dispatch({ type: 'unknown' });
              return false;
            } catch (err) {
              return err.message.includes('Unknown action type');
            }
          }
        }
      ],
      solution: `export function createDiscriminatedReducer(initialState, handlers) {
  let state = initialState;
  return {
    getState: () => state,
    dispatch(action) {
      if (!action || !action.type || !handlers[action.type]) {
        throw new Error(\`Unknown action type: \${action?.type}\`);
      }
      state = handlers[action.type](state, action);
      return state;
    }
  };
}`,
      hints: [
        'Check if handlers[action.type] exists before calling.',
        'If not found, throw new Error(\`Unknown action type: \${action?.type}\`).',
        'Update state with the result of calling handlers[action.type](state, action).'
      ]
    },
    {
      id: 'p9-l8',
      slug: 'typing-usecontext-custom-hook-guard',
      title: 'Typing useContext and the Custom Hook Guard Pattern',
      prerequisites: ['p3-l6', 'p9-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Type React Context values and create nullable contexts cleanly.',
        'Implement the Custom Hook Guard pattern to avoid repetitive null checks.',
        'Separate Context state interface from Context dispatch/actions.'
      ],
      explanation: 'When creating a context with `createContext<AuthContextType | null>(null)`, consumers using `useContext(AuthContext)` receive `AuthContextType | null`. Checking `if (!auth)` in every single component is tedious. The standard production pattern is to export a custom hook (e.g. `useAuth()`) that performs the null check once and throws if called outside the Provider, returning a guaranteed non-null `AuthContextType`.',
      whyItExists: 'Eliminates repetitive `auth?.user?.name` optional chaining in every component and gives clear runtime developer errors when a Provider is forgotten.',
      syntaxRules: 'Create context: `const Ctx = createContext<T | null>(null);`\nCustom hook: `export function useCtx() { const val = useContext(Ctx); if (!val) throw new Error(...); return val; }`.',
      codeExample: `import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { name: string; email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = (email: string) => setUser({ name: email.split('@')[0], email });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook guard pattern:
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Guaranteed non-null!
}`,
      lineByLine: [
        'Line 9: createContext<AuthContextType | null>(null) permits null as initial value before Provider mounts.',
        'Line 26: useAuth() hook queries the context and asserts presence.',
        'Line 28: Throws descriptive error if developer forgot to wrap in AuthProvider.',
        'Line 30: Returns non-null AuthContextType, freeing consuming components from writing auth?.login().'
      ],
      expectedBehavior: 'Components consuming `useAuth()` have guaranteed typed access to user, login, and logout without null assertions.',
      commonMistakes: [
        'Providing dummy default values in `createContext({ user: null, login: () => {} })` to avoid null, which hides missing Providers.',
        'Directly exporting the raw Context object instead of the guarded custom hook.'
      ],
      practiceLevels: {
        levelA: 'Create a ThemeContext with theme: "light" | "dark" and toggleTheme().',
        levelB: 'Implement the useTheme() guarded hook with descriptive error message.',
        levelC: 'Separate State Context and Dispatch Context to avoid unnecessary re-renders in consumers.'
      },
      debuggingChallenge: {
        brokenCode: `const Ctx = createContext<UserContextType>(null); // Type error: null is not assignable to UserContextType!`,
        problem: 'Context generic does not include `| null`, but initial value passed is `null`.',
        fix: 'Add `| null` to the generic: `createContext<UserContextType | null>(null)`.'
      },
      conceptualQuestion: {
        question: 'Why is the guarded custom hook pattern (useContext + throw if null) preferred over passing dummy empty functions to createContext()?',
        options: [
          'Because dummy functions are slower in JavaScript.',
          'Dummy default values fail silently when a component is accidentally placed outside the Provider, whereas the guarded hook immediately warns the developer.',
          'React does not allow functions inside context values.',
          'TypeScript forbids dummy functions.'
        ],
        correctIndex: 1,
        explanation: 'Failing fast with a clear error message prevents bizarre silent bugs where clicks do nothing because a dummy function was invoked.'
      },
      codeReadingQuestion: {
        snippet: `export function useSettings() {\n  const ctx = useContext(SettingsContext);\n  if (!ctx) throw new Error("Missing SettingsProvider");\n  return ctx;\n}`,
        question: 'What is the return type of `useSettings` if `SettingsContext` is typed as `Context<Settings | null>`?',
        answer: '`Settings` (non-null), because TypeScript narrows away `null` after the throwing guard.'
      },
      starterCode: `// Assignment: Implement createContextContainer
// Simulate the Context Guard pattern:
// createContextContainer(name)
// Returns:
// - provide(value): stores active context value
// - revoke(): clears context value (sets to null)
// - use(): returns value, or throws Error(\`use\${name} must be used within a \${name}Provider\`) if null

export function createContextContainer(name) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Returns provided value when initialized',
          run: (fn) => {
            const container = fn('Theme');
            container.provide({ mode: 'dark' });
            const val = container.use();
            return val.mode === 'dark';
          }
        },
        {
          name: 'Throws descriptive error when value is revoked or missing',
          run: (fn) => {
            const container = fn('Auth');
            try {
              container.use();
              return false;
            } catch (err) {
              return err.message === 'useAuth must be used within a AuthProvider';
            }
          }
        }
      ],
      solution: `export function createContextContainer(name) {
  let contextValue = null;
  return {
    provide(value) {
      contextValue = value;
    },
    revoke() {
      contextValue = null;
    },
    use() {
      if (contextValue === null || contextValue === undefined) {
        throw new Error(\`use\${name} must be used within a \${name}Provider\`);
      }
      return contextValue;
    }
  };
}`,
      hints: [
        'Store contextValue in a closure initialized to null.',
        'In use(), verify contextValue is not null or undefined.',
        'Throw Error(\`use\${name} must be used within a \${name}Provider\`) if missing.'
      ]
    },
    {
      id: 'p9-l9',
      slug: 'typing-custom-hooks-as-const',
      title: 'Typing Custom Hooks and the "as const" Assertion',
      prerequisites: ['p3-l7', 'p9-l4'],
      estimatedDuration: '25 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand why TypeScript infers custom hook array returns as union arrays `(T | U)[]`.',
        'Use `as const` tuple assertions for hook returns mimicking useState.',
        'Choose between returning tuples vs returning strongly typed objects.'
      ],
      explanation: 'When you create a custom hook that returns a tuple like `return [value, toggle]`, TypeScript infers the return type as an array of unions: `(boolean | (() => void))[]`. Consequently, calling `toggle()` throws a compile error: "Cannot invoke an expression whose type lacks a call signature". To preserve the exact tuple positions and types, append `as const` to the return statement or write an explicit tuple return type `[boolean, () => void]`.',
      whyItExists: 'Allows custom hooks to provide the clean `const [val, setVal] = useHook()` destructuring API with 100% type safety.',
      syntaxRules: 'Append `as const` to array returns: `return [state, actions] as const;` or type function: `function useToggle(): [boolean, () => void]`.',
      codeExample: `import { useState, useCallback } from 'react';

// Method 1: 'as const' assertion
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);

  return [value, toggle] as const;
  // Return type is readonly [boolean, () => void]
}

// Method 2: Object return (preferred for > 2 items)
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export function useCounter(initial: number = 0): UseCounterReturn {
  const [count, setCount] = useState(initial);
  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
    reset: () => setCount(initial)
  };
}`,
      lineByLine: [
        'Line 8: return [value, toggle] as const locks index 0 to boolean and index 1 to () => void.',
        'Line 20: Explicit UseCounterReturn interface makes returned object properties self-documenting.'
      ],
      expectedBehavior: 'Destructuring `const [isOpen, toggleOpen] = useToggle()` correctly types `isOpen` as boolean and `toggleOpen` as function.',
      commonMistakes: [
        'Returning `[value, setValue]` without `as const`, resulting in TypeScript thinking both items are `typeof value | typeof setValue`.',
        'Returning tuples with more than 3 elements (confusing order; prefer objects for > 2 values).'
      ],
      practiceLevels: {
        levelA: 'Write a useBoolean hook returning `[val, setTrue, setFalse] as const`.',
        levelB: 'Type a useLocalStorage hook returning `[T, (val: T) => void] as const`.',
        levelC: 'Convert a multi-return hook from tuple to typed object interface.'
      },
      debuggingChallenge: {
        brokenCode: `function useStatus() {\n  const [s] = useState('idle');\n  const setS = () => {};\n  return [s, setS];\n}\nconst [status, setStatus] = useStatus();\nsetStatus(); // Error: This expression is not callable!`,
        problem: 'TS inferred the return as (string | (() => void))[], so status and setStatus are both union types.',
        fix: 'Add `as const`: `return [s, setS] as const;`.'
      },
      conceptualQuestion: {
        question: 'What does the `as const` assertion do when applied to an array literal `[a, b] as const`?',
        options: [
          'Freezes the array in memory so it cannot be garbage collected.',
          'Narrows the type to a read-only tuple with exact positional types instead of a mutable union array.',
          'Converts the array into a Set.',
          'Prevents React from re-rendering the component.'
        ],
        correctIndex: 1,
        explanation: '`as const` marks primitives as literal types and arrays as fixed-length readonly tuples.'
      },
      codeReadingQuestion: {
        snippet: `const pair = ['count', 42] as const;`,
        question: 'What is the TypeScript type of `pair`?',
        answer: '`readonly ["count", 42]`'
      },
      starterCode: `// Assignment: Implement tupleReturnSimulator
// Simulate a hook tuple return formatter:
// tupleReturnSimulator(values)
// - If values has length <= 2, returns { type: 'tuple', items: [...values], readonly: true }
// - If values has length > 2, transforms into an object: { type: 'object', data: { [key]: val } } using the first element of each entry.
// For array of entries [ ['count', 0], ['inc', fn] ] with > 2 items: returns object mapping keys to values.

export function tupleReturnSimulator(items) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Formats pairs as readonly tuple descriptor',
          run: (fn) => {
            const res = fn([true, 'toggle']);
            return res.type === 'tuple' && res.readonly === true && res.items.length === 2;
          }
        },
        {
          name: 'Transforms > 2 entries into object mapping',
          run: (fn) => {
            const entries = [['count', 0], ['inc', 1], ['dec', -1]];
            const res = fn(entries);
            return res.type === 'object' && res.data.count === 0 && res.data.dec === -1;
          }
        }
      ],
      solution: `export function tupleReturnSimulator(items) {
  if (items.length <= 2) {
    return {
      type: 'tuple',
      items: [...items],
      readonly: true
    };
  }
  const data = {};
  for (const item of items) {
    if (Array.isArray(item)) {
      data[item[0]] = item[1];
    }
  }
  return {
    type: 'object',
    data
  };
}`,
      hints: [
        'Check items.length <= 2.',
        'If longer, iterate and populate data object from key-value pairs.'
      ]
    },
    {
      id: 'p9-l10',
      slug: 'generic-components-reusability',
      title: 'Generic Components in React (`<List<T>>`)',
      prerequisites: ['p9-l2', 'p9-l3'],
      estimatedDuration: '35 mins',
      difficulty: 'Advanced',
      objectives: [
        'Write components parameterized by generic type parameters `<T>`.',
        'Enable type-safe render props without resorting to `any`.',
        'Handle generic constraints: `<T extends { id: string | number }>`.'
      ],
      explanation: 'A Generic Component is a reusable component parameterized with one or more types (`<T>`). Common examples include Tables, Dropdowns, and List views. Instead of typing the items as `any[]` or a fixed `User[]`, you write `<T,>(props: ListProps<T>)`. When a parent passes `items={users}`, TypeScript infers `T = User`, guaranteeing that the `renderItem` callback receives a fully-typed `user` object with full editor autocomplete.',
      whyItExists: 'Allows building flexible, reusable design-system components without sacrificing end-to-end type safety.',
      syntaxRules: 'Function syntax: `function List<T extends { id: string }>({ items, renderItem }: ListProps<T>) { ... }`. In TSX arrow functions, use trailing comma: `const List = <T,>(...) => ...`.',
      codeExample: `interface Identifiable {
  id: string | number;
}

interface ListProps<T extends Identifiable> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
  emptyMessage?: string;
}

export function List<T extends Identifiable>({
  items,
  renderItem,
  onSelect,
  emptyMessage = 'No items found'
}: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onSelect?.(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}`,
      lineByLine: [
        'Line 5: ListProps<T extends Identifiable> accepts an array of type T where T has an id.',
        'Line 7: renderItem callback takes an item of exact type T and returns React.ReactNode.',
        'Line 19: item.id is guaranteed to exist because of generic constraint T extends Identifiable.'
      ],
      expectedBehavior: 'Consuming `<List items={products} renderItem={p => <span>{p.price}</span>} />` gives full autocomplete on `p.price`.',
      commonMistakes: [
        'In TSX arrow functions, writing `<T>` without a trailing comma `<T,>`, causing the compiler to interpret `<T>` as an unclosed JSX tag.',
        'Omitting constraints (`<T>`) when trying to access `.id` in `key={item.id}`.'
      ],
      practiceLevels: {
        levelA: 'Build a generic SelectDropdown<T> component taking items: T[] and getLabel: (item: T) => string.',
        levelB: 'Add generic search filtering: filterFn: (item: T, query: string) => boolean.',
        levelC: 'Build a type-safe generic DataTable<T> with Column<T>[] definitions.'
      },
      debuggingChallenge: {
        brokenCode: `// In TSX file:\nconst Table = <T>(props: TableProps<T>) => { ... }; // TSX parsing error!`,
        problem: 'TSX parser treats `<T>` as opening an HTML/JSX tag named <T>.',
        fix: 'Add a trailing comma: `const Table = <T,>(props: TableProps<T>) => { ... };` or use `function Table<T>(...)`.'
      },
      conceptualQuestion: {
        question: 'Why is `<T,>` (with a comma) used in TSX arrow functions instead of plain `<T>`?',
        options: [
          'Because TypeScript requires all generics to have at least two parameters.',
          'To disambiguate generic type parameter syntax from a JSX tag `<T>` in `.tsx` files.',
          'It is a shorthand for `<T, unknown>`.',
          'It tells the compiler to optimize the loop.'
        ],
        correctIndex: 1,
        explanation: 'In `.tsx` files, `<T>` looks identical to an opening JSX tag. The trailing comma `<T,>` disambiguates it as a TypeScript generic.'
      },
      codeReadingQuestion: {
        snippet: `interface Product { id: number; title: string; price: number }\n<List items={products} renderItem={p => p.sku} />`,
        question: 'If `Product` does not have property `sku`, will TypeScript catch this error? Why?',
        answer: 'Yes! Because `List` is generic, `p` is inferred as `Product`, so accessing `.sku` causes an immediate property missing error.'
      },
      starterCode: `// Assignment: Implement filterAndTransformList
// Simulate generic list processing:
// filterAndTransformList(items, predicate, transform)
// - items: array of T
// - predicate: (item: T) => boolean
// - transform: (item: T, index: number) => U
// Returns array of transformed items matching predicate.

export function filterAndTransformList(items, predicate, transform) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Filters numbers and transforms to formatted strings',
          run: (fn) => {
            const nums = [1, 2, 3, 4, 5];
            const res = fn(nums, n => n % 2 === 0, (n, i) => 'Item ' + i + ': ' + (n * 10));
            return res.length === 2 && res[0] === 'Item 0: 20' && res[1] === 'Item 1: 40';
          }
        },
        {
          name: 'Works with object collections',
          run: (fn) => {
            const users = [{ name: 'A', active: true }, { name: 'B', active: false }];
            const res = fn(users, u => u.active, u => u.name.toUpperCase());
            return res.length === 1 && res[0] === 'A';
          }
        }
      ],
      solution: `export function filterAndTransformList(items, predicate, transform) {
  const result = [];
  let index = 0;
  for (const item of items) {
    if (predicate(item)) {
      result.push(transform(item, index));
      index++;
    }
  }
  return result;
}`,
      hints: [
        'Iterate through items with for...of.',
        'Test predicate(item). If true, push transform(item, index++) to result.'
      ]
    },
    {
      id: 'p9-l11',
      slug: 'polymorphic-components-as-prop',
      title: 'Polymorphic Components and the "as" Prop',
      prerequisites: ['p9-l10'],
      estimatedDuration: '40 mins',
      difficulty: 'Advanced',
      objectives: [
        'Understand polymorphic components that render different HTML tags or components via `as`.',
        'Use `React.ElementType` and `React.ComponentPropsWithoutRef`.',
        'Combine custom props with HTML attributes of the dynamic tag.'
      ],
      explanation: 'A polymorphic component is a component that can render as different HTML tags or other React components via an `as` prop while maintaining complete type safety. For example, a `<Button as="a" href="/login">` should accept `href`, but `<Button as="button">` should accept `type="submit"` and NOT allow `href`. In TypeScript, this is achieved using generics constrained to `React.ElementType` and `React.ComponentPropsWithoutRef<E>`.',
      whyItExists: 'Enables design-system buttons, text tags, and boxes to render as `<a>`, `<button>`, `<h1>`, or `<p>` without messy duplications.',
      syntaxRules: 'Declare generic prop type: `type ButtonProps<E extends React.ElementType> = { as?: E } & React.ComponentPropsWithoutRef<E>;`.',
      codeExample: `import React, { ElementType, ComponentPropsWithoutRef } from 'react';

type ButtonOwnProps<E extends ElementType = 'button'> = {
  as?: E;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
};

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps>;

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'primary',
  children,
  ...restProps
}: ButtonProps<E>) {
  const Component = as || 'button';
  return (
    <Component className={\`btn btn-\${variant}\`} {...restProps}>
      {children}
    </Component>
  );
}`,
      lineByLine: [
        'Line 3: ButtonOwnProps defaults generic E to "button".',
        'Line 9: ComponentPropsWithoutRef<E> extracts valid HTML props for element E.',
        'Line 10: Omit prevents duplicate property conflicts with ButtonOwnProps.',
        'Line 18: const Component = as || "button" dynamically renders the specified tag.'
      ],
      expectedBehavior: 'Passing `as="a"` enables autocomplete for `href` and `target`; passing `as="button"` enables `type="submit"`.',
      commonMistakes: [
        'Using `React.ComponentPropsWithRef` without `forwardRef`, causing ref typing conflicts.',
        'Forgetting `Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps>`, causing duplicate property errors.'
      ],
      practiceLevels: {
        levelA: 'Build a polymorphic Typography component (`<Text as="h1">` vs `<Text as="p">`).',
        levelB: 'Add color and size variants to the polymorphic Typography component.',
        levelC: 'Forward refs properly through a polymorphic component using React.forwardRef.'
      },
      debuggingChallenge: {
        brokenCode: `<Button as="button" href="https://google.com">Click</Button> // Type error: href does not exist on button!`,
        problem: 'A standard HTML button element does not accept an href attribute.',
        fix: 'Change `as="button"` to `as="a"` when an href link is needed.'
      },
      conceptualQuestion: {
        question: 'What is the main benefit of a polymorphic component in a design system?',
        options: [
          'It loads styles asynchronously.',
          'It provides consistent visual styling while allowing the semantic HTML tag to change for accessibility and SEO (e.g. styling a link as a button).',
          'It converts server components into client components.',
          'It bypasses React\'s Virtual DOM.'
        ],
        correctIndex: 1,
        explanation: 'Polymorphism allows UI elements to keep consistent design-system styling while rendering the semantically correct HTML tag (`<a>`, `<button>`, `<div>`).'
      },
      codeReadingQuestion: {
        snippet: `type HeadingProps<E extends React.ElementType> = { as?: E } & React.ComponentPropsWithoutRef<E>;\n<Heading as="h2" id="section-1">Title</Heading>`,
        question: 'Which element will be rendered in the DOM, and will `id` be attached?',
        answer: 'An `<h2>` element with attribute `id="section-1"`, containing text "Title".'
      },
      starterCode: `// Assignment: Implement resolvePolymorphicTag
// Simulate resolving polymorphic component tag and props:
// resolvePolymorphicTag(props, defaultTag = 'div')
// - extracts 'as' prop from props (or defaults to defaultTag)
// - separates known custom props: ['as', 'variant', 'size'] from htmlProps
// Returns: { Tag: string, customProps: object, htmlProps: object }

export function resolvePolymorphicTag(props, defaultTag = 'div') {
  // Your code here
}`,
      testCases: [
        {
          name: 'Resolves custom as tag and isolates props',
          run: (fn) => {
            const input = { as: 'a', href: '/home', variant: 'primary', id: 'link-1' };
            const res = fn(input);
            return res.Tag === 'a' && res.customProps.variant === 'primary' && res.htmlProps.href === '/home' && !('as' in res.htmlProps);
          }
        },
        {
          name: 'Falls back to default tag when as is omitted',
          run: (fn) => {
            const input = { className: 'box', size: 'lg' };
            const res = fn(input, 'section');
            return res.Tag === 'section' && res.customProps.size === 'lg' && res.htmlProps.className === 'box';
          }
        }
      ],
      solution: `export function resolvePolymorphicTag(props, defaultTag = 'div') {
  const { as, variant, size, ...htmlProps } = props;
  const Tag = as || defaultTag;
  const customProps = {};
  if (variant !== undefined) customProps.variant = variant;
  if (size !== undefined) customProps.size = size;
  return { Tag, customProps, htmlProps };
}`,
      hints: [
        'Destructure as, variant, size from props.',
        'Assign Tag = as || defaultTag.',
        'Return { Tag, customProps, htmlProps }.'
      ]
    },
    {
      id: 'p9-l12',
      slug: 'ts-utility-types-react',
      title: 'TypeScript Utility Types for React (Partial, Pick, Omit, Record)',
      prerequisites: ['p9-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Use `Partial<T>` for optional updates and draft forms.',
        'Use `Pick<T, K>` and `Omit<T, K>` to construct prop interfaces from models.',
        'Use `Record<K, V>` for lookup maps and dictionary states.'
      ],
      explanation: 'TypeScript provides built-in utility types that eliminate boilerplate when managing React props and state:\n- `Partial<T>`: Makes all properties in T optional. Perfect for form drafts or partial update handlers (`updateUser(id, partial: Partial<User>)`).\n- `Pick<T, K>`: Constructs a type by picking keys K from T (`Pick<User, "name" | "avatar">`).\n- `Omit<T, K>`: Removes keys K from T (`Omit<ButtonProps, "onClick">`).\n- `Record<Keys, Values>`: Defines a dictionary mapping keys to values (`Record<string, TodoItem>`).',
      whyItExists: 'Prevents duplicate interface definitions by transforming existing types into specialized sub-types.',
      syntaxRules: '`Partial<Type>`, `Pick<Type, "a" | "b">`, `Omit<Type, "c">`, `Record<string, Type>`.',
      codeExample: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt: string;
}

// 1. Pick: Only need name and email for summary badge
type UserSummaryProps = Pick<User, 'name' | 'email'>;

// 2. Omit: Card accepts User fields without internal ID and createdAt
type UserFormInputs = Omit<User, 'id' | 'createdAt'>;

// 3. Partial: Updating user profile (any field is optional)
type UserUpdatePayload = Partial<User>;

// 4. Record: Normalized lookup dictionary
type UserMap = Record<string, User>;`,
      lineByLine: [
        'Line 10: Pick<User, "name" | "email"> creates a type with only name and email.',
        'Line 13: Omit<User, "id" | "createdAt"> removes id and createdAt.',
        'Line 16: Partial<User> allows passing any subset of User properties.',
        'Line 19: Record<string, User> maps string IDs to User objects.'
      ],
      expectedBehavior: 'Changes in the base `User` interface automatically propagate to all derived Pick, Omit, and Partial types.',
      commonMistakes: [
        'Manually re-typing properties in five different interfaces instead of using `Pick` or `Omit`.',
        'Using `any` for dictionary objects instead of `Record<string, T>`.',
        'Using `Partial<T>` when certain required fields (like `id`) must remain non-optional.'
      ],
      practiceLevels: {
        levelA: 'Create an EditableProfile state using `Partial<UserProfile>`.',
        levelB: 'Type an API cache map using `Record<string, CachedResponse>`.',
        levelC: 'Combine `Omit` and `ComponentPropsWithoutRef<"button">` to build an extended button prop type.'
      },
      debuggingChallenge: {
        brokenCode: `type Summary = Pick<User, 'nam'>; // Error: Type '"nam"' does not satisfy the constraint 'keyof User'`,
        problem: 'Typo in key: User has property "name", not "nam".',
        fix: 'Fix the typo to `Pick<User, "name">`.'
      },
      conceptualQuestion: {
        question: 'When is `Omit<T, K>` preferable to manually defining a new interface?',
        options: [
          'Only when compiling in production mode.',
          'When you want the derived type to automatically inherit updates and property renames from the source type `T`, excluding only specific keys.',
          'Because Omit runs faster than interface declaration.',
          'Omit is only used for CSS classes.'
        ],
        correctIndex: 1,
        explanation: '`Omit` keeps types in sync: if a field on `T` changes type or new fields are added, the derived type updates automatically.'
      },
      codeReadingQuestion: {
        snippet: `type Themes = 'light' | 'dark' | 'sepia';\ntype ThemeConfig = Record<Themes, { bg: string; color: string }>;`,
        question: 'What happens if `ThemeConfig` fails to define the "sepia" entry?',
        answer: 'TypeScript produces a compile error: Property "sepia" is missing in type.'
      },
      starterCode: `// Assignment: Implement pickAndOmitSimulator
// Implement runtime simulation of Pick and Omit:
// pickAndOmitSimulator(obj, keys, mode)
// - obj: source object
// - keys: array of string keys
// - mode: 'pick' | 'omit'
// If 'pick': returns new object containing ONLY keys present in 'keys'
// If 'omit': returns new object containing all keys EXCEPT those in 'keys'

export function pickAndOmitSimulator(obj, keys, mode) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Picks specified keys correctly',
          run: (fn) => {
            const data = { id: 1, name: 'Alice', role: 'admin', age: 30 };
            const res = fn(data, ['name', 'role'], 'pick');
            return Object.keys(res).length === 2 && res.name === 'Alice' && res.role === 'admin';
          }
        },
        {
          name: 'Omits specified keys correctly',
          run: (fn) => {
            const data = { id: 1, name: 'Bob', secret: 'xyz' };
            const res = fn(data, ['secret'], 'omit');
            return !('secret' in res) && res.id === 1 && res.name === 'Bob';
          }
        }
      ],
      solution: `export function pickAndOmitSimulator(obj, keys, mode) {
  const keySet = new Set(keys);
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    if (mode === 'pick' && keySet.has(k)) {
      result[k] = v;
    } else if (mode === 'omit' && !keySet.has(k)) {
      result[k] = v;
    }
  }
  return result;
}`,
      hints: [
        'Use new Set(keys) for O(1) membership checks.',
        'Iterate Object.entries(obj) and filter into result based on mode.'
      ]
    },
    {
      id: 'p9-l13',
      slug: 'migrating-jsx-to-tsx',
      title: 'Migrating Legacy JSX Codebases to TSX',
      prerequisites: ['p9-l1', 'p9-l2', 'p9-l5'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Follow an incremental migration strategy from JSX to TSX.',
        'Configure `allowJs: true` for gradual codebase adoption.',
        'Eliminate implicit any and safely narrow third-party types.'
      ],
      explanation: 'Migrating an existing React project to TypeScript should never be done as a massive all-at-once rewrite. The proven production strategy is incremental: 1. Add TypeScript and tsconfig.json with `allowJs: true`. 2. Rename utility helper files from `.js` to `.ts` and type core models. 3. Rename leaf components (e.g. `<Badge>`, `<Avatar>`) from `.jsx` to `.tsx`. 4. Migrate container and parent components up the tree. 5. Gradually enable `strict: true`.',
      whyItExists: 'Enables real-world engineering teams to gain TypeScript benefits without stopping feature development.',
      syntaxRules: 'Enable `"allowJs": true` in tsconfig.json. Migrate bottom-up (leaf components first).',
      codeExample: `// tsconfig.json for gradual migration:
/*
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,          // <--- Allows JS and TS files side-by-side
    "checkJs": false,         // <--- Don't error on unmigrated JS
    "skipLibCheck": true,
    "strict": false,          // <--- Turn on strict later
    "jsx": "react-jsx"
  }
}
*/`,
      lineByLine: [
        'allowJs: true lets Vite compile both .jsx and .tsx in the same project.',
        'checkJs: false prevents existing JavaScript files from being inundated with red squiggles.'
      ],
      expectedBehavior: 'Unmigrated JSX files continue functioning normally while migrated TSX files gain full type safety.',
      commonMistakes: [
        'Enabling `"strict": true` on day one of a 50,000-line legacy migration, resulting in thousands of errors and stalled progress.',
        'Replacing all unknown types with `any` instead of `unknown` with type guards.'
      ],
      practiceLevels: {
        levelA: 'Rename a simple button component from .jsx to .tsx and type its props.',
        levelB: 'Add tsconfig allowJs configuration to support hybrid codebase.',
        levelC: 'Refactor an any-typed event handler to use strict React.ChangeEvent.'
      },
      debuggingChallenge: {
        brokenCode: `// Button.jsx renamed to Button.tsx:\nexport function Button(props) {\n  return <button>{props.children}</button>; // Error: Parameter 'props' implicitly has an 'any' type\n}`,
        problem: 'TypeScript strict mode or noImplicitAny requires function parameters to have type annotations.',
        fix: 'Add an explicit interface: `interface ButtonProps { children: React.ReactNode }`.'
      },
      conceptualQuestion: {
        question: 'What is the recommended migration sequence when converting a React codebase from JavaScript to TypeScript?',
        options: [
          'Top-down: start with App.jsx and index.jsx first.',
          'All at once: rename all files simultaneously and fix all errors before running Vite.',
          'Bottom-up: start with data models/types and leaf UI components, progressing up to containers and routers.',
          'Only convert backend files; leave React in JavaScript.'
        ],
        correctIndex: 2,
        explanation: 'Migrating leaf components and data models first ensures parent components receive typed props as they are subsequently migrated.'
      },
      codeReadingQuestion: {
        snippet: `// tsconfig.json\n{ "compilerOptions": { "noImplicitAny": true } }`,
        question: 'What does this compiler option enforce?',
        answer: 'It raises an error on any variable or parameter whose type is not explicitly declared and cannot be safely inferred, preventing accidental `any`.'
      },
      starterCode: `// Assignment: Implement migrationAudit
// Simulate an automated codebase migration audit:
// migrationAudit(fileList)
// - fileList: array of filenames (e.g. ['App.jsx', 'Button.tsx', 'utils.ts', 'api.js'])
// Returns an audit report object:
// {
//   totalFiles: number,
//   tsFiles: number,
//   jsFiles: number,
//   percentageMigrated: number (rounded integer 0-100),
//   remainingFiles: string[]
// }

export function migrationAudit(fileList) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Computes accurate migration percentage and classifies files',
          run: (fn) => {
            const files = ['Button.tsx', 'Card.tsx', 'App.jsx', 'api.js'];
            const res = fn(files);
            return res.totalFiles === 4 && res.tsFiles === 2 && res.jsFiles === 2 && res.percentageMigrated === 50 && res.remainingFiles.length === 2;
          }
        },
        {
          name: 'Handles 100% migrated codebase',
          run: (fn) => {
            const files = ['Index.tsx', 'Utils.ts'];
            const res = fn(files);
            return res.percentageMigrated === 100 && res.remainingFiles.length === 0;
          }
        }
      ],
      solution: `export function migrationAudit(fileList) {
  const total = fileList.length;
  if (total === 0) return { totalFiles: 0, tsFiles: 0, jsFiles: 0, percentageMigrated: 100, remainingFiles: [] };
  const tsExtensions = ['.ts', '.tsx'];
  const tsFiles = fileList.filter(f => tsExtensions.some(ext => f.endsWith(ext)));
  const jsFiles = fileList.filter(f => !tsExtensions.some(ext => f.endsWith(ext)));
  const pct = Math.round((tsFiles.length / total) * 100);
  return {
    totalFiles: total,
    tsFiles: tsFiles.length,
    jsFiles: jsFiles.length,
    percentageMigrated: pct,
    remainingFiles: jsFiles
  };
}`,
      hints: [
        'Check if filename endsWith(".ts") or endsWith(".tsx").',
        'Calculate percentage as Math.round((tsCount / total) * 100).',
        'Return remainingFiles containing all JS files.'
      ]
    },
    {
      id: 'p9-l14',
      slug: 'declaration-files-and-ambient-types',
      title: 'Declaration Files (.d.ts) and Module Augmentation',
      prerequisites: ['p9-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Advanced',
      objectives: [
        'Declare types for assets like SVG, PNG, and CSS Modules in `vite-env.d.ts`.',
        'Write ambient declarations for un-typed npm packages (`declare module "legacy-lib"`).',
        'Augment existing modules (e.g. adding custom properties to window or process.env).'
      ],
      explanation: 'In TypeScript, declaration files (`.d.ts`) contain type information without executable JavaScript code. When you import an SVG or CSS file in Vite (`import logo from "./logo.svg"`), TypeScript doesn\'t know how to handle it by default. A declaration file tells TypeScript: "Treat any import ending in `.svg` as a string URL". Similarly, if an older npm package lacks `@types/`, you can provide ambient type declarations using `declare module`.',
      whyItExists: 'Enables importing static assets (images, fonts, stylesheets) and using untyped third-party packages without compilation errors.',
      syntaxRules: 'Use `declare module "*.svg" { const content: string; export default content; }`. For window globals: `declare global { interface Window { analytics: any; } }`.',
      codeExample: `// vite-env.d.ts
/// <reference types="vite/client" />

// 1. Declare SVG image module
declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// 2. Augment Window interface
declare global {
  interface Window {
    __APP_VERSION__: string;
    gtag?: (...args: any[]) => void;
  }
}`,
      lineByLine: [
        'Line 2: vite/client provides default Vite asset and import.meta.env declarations.',
        'Line 5: declare module "*.svg" tells TS that importing any SVG resolves to a string URL.',
        'Line 13: Augments the global Window interface so window.__APP_VERSION__ is recognized.'
      ],
      expectedBehavior: 'Importing `import banner from "./banner.png"` or calling `window.gtag(...)` compiles without red squiggles.',
      commonMistakes: [
        'Adding `import` or `export` at the top level of a ambient declaration file without `declare global`, which converts it from an ambient script into an isolated module.',
        'Putting actual JavaScript implementation code inside a `.d.ts` file.'
      ],
      practiceLevels: {
        levelA: 'Declare types for `.png` and `.jpg` image imports in a vite-env.d.ts file.',
        levelB: 'Augment ImportMetaEnv with custom VITE_API_URL and VITE_APP_NAME.',
        levelC: 'Write a declaration module for an untyped charting library.'
      },
      debuggingChallenge: {
        brokenCode: `// In component:\nimport logo from './logo.svg'; // Error: Cannot find module './logo.svg' or its corresponding type declarations.`,
        problem: 'TypeScript does not recognize non-code assets by default without a declaration file.',
        fix: 'Add `/// <reference types="vite/client" />` or declare `module "*.svg"` in a .d.ts file.'
      },
      conceptualQuestion: {
        question: 'What is the role of a `.d.ts` declaration file in a TypeScript project?',
        options: [
          'It is executed by Node.js before running the web app.',
          'It provides type information to the TypeScript compiler and editor without generating any JavaScript code in the build output.',
          'It replaces package.json dependencies.',
          'It minifies CSS and HTML templates.'
        ],
        correctIndex: 1,
        explanation: '`.d.ts` files contain pure type definitions (interfaces, ambient declarations) and produce zero JavaScript bytes.'
      },
      codeReadingQuestion: {
        snippet: `declare global {\n  interface Window { telemetry: { track: (event: string) => void } }\n}`,
        question: 'Can you now call `window.telemetry.track("button_click")` in your TSX code?',
        answer: 'Yes! The Window interface has been augmented with the telemetry property.'
      },
      starterCode: `// Assignment: Implement envValidator
// Simulate verifying runtime environment variables against expected TypeScript declarations:
// envValidator(envObj, schema)
// - envObj: object with current environment variables
// - schema: object with { [key]: { type: 'string' | 'number' | 'boolean', required: boolean } }
// Returns: { isValid: boolean, missing: string[], errors: string[] }

export function envValidator(envObj, schema) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Validates complete environment config',
          run: (fn) => {
            const env = { VITE_API: 'https://api.com', VITE_PORT: 3000 };
            const schema = {
              VITE_API: { type: 'string', required: true },
              VITE_PORT: { type: 'number', required: true }
            };
            const res = fn(env, schema);
            return res.isValid === true && res.missing.length === 0;
          }
        },
        {
          name: 'Catches missing required environment variables',
          run: (fn) => {
            const env = { VITE_DEBUG: true };
            const schema = {
              VITE_SECRET: { type: 'string', required: true }
            };
            const res = fn(env, schema);
            return res.isValid === false && res.missing.includes('VITE_SECRET');
          }
        }
      ],
      solution: `export function envValidator(envObj, schema) {
  const missing = [];
  const errors = [];
  for (const [key, rules] of Object.entries(schema)) {
    const val = envObj[key];
    if (val === undefined || val === null || val === '') {
      if (rules.required) missing.push(key);
    } else {
      if (typeof val !== rules.type) {
        errors.push(\`Variable \${key} expected type \${rules.type}, got \${typeof val}\`);
      }
    }
  }
  return {
    isValid: missing.length === 0 && errors.length === 0,
    missing,
    errors
  };
}`,
      hints: [
        'Iterate over schema entries.',
        'Check if required variables are missing from envObj.',
        'Check typeof for present variables against rules.type.'
      ]
    },
    {
      id: 'p9-l15',
      slug: 'typescript-react-best-practices-cheatsheet',
      title: 'Production TypeScript with React: Patterns, Anti-Patterns & Checklist',
      prerequisites: ['p9-l1', 'p9-l2', 'p9-l7', 'p9-l10'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Review the 10 Golden Rules for TypeScript in production React.',
        'Avoid common anti-patterns like `as unknown as Type` and `any`.',
        'Use TypeScript compiler checks for bulletproof refactoring confidence.'
      ],
      explanation: 'Production React with TypeScript requires disciplined patterns: prefer interfaces for props, use union literals over broad strings, avoid type assertions (`as`) unless strictly necessary, leverage discriminated unions for state transitions, use custom hook guards for contexts, and never use `any`. Following these practices turns TypeScript into your most dependable pair-programming partner.',
      whyItExists: 'Ensures codebases remain maintainable, scalable, and bug-resistant across growing engineering teams.',
      syntaxRules: 'Rule 1: Never use `any`; use `unknown` with type narrowing. Rule 2: Discriminated unions for multi-stage states. Rule 3: Guarded custom hooks for context.',
      codeExample: `// Golden Rule Summary Example:
interface User {
  id: string;
  name: string;
}

// 1. Discriminated union for asynchronous state
type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

// 2. Strict component props
interface ProfileCardProps {
  user: User;
  onRefresh: () => Promise<void>;
  variant?: 'compact' | 'expanded';
}

export function ProfileCard({ user, onRefresh, variant = 'compact' }: ProfileCardProps) {
  return (
    <div className={\`card card-\${variant}\`}>
      <h4>{user.name}</h4>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}`,
      lineByLine: [
        'Line 8-12: AsyncState prevents impossible states like having both loading: true and error: "Failed".',
        'Line 15-19: Clear, self-documenting interface for component contract.'
      ],
      expectedBehavior: 'Clean, type-safe architecture with 0 TypeScript compiler warnings and 100% editor autocomplete.',
      commonMistakes: [
        'Using type assertion `as SomeType` to silence the compiler instead of fixing the root type error.',
        'Defining complex boolean matrices (`isLoading`, `isError`, `isSuccess`) that permit impossible states.'
      ],
      practiceLevels: {
        levelA: 'Refactor a boolean matrix state ({ loading, error, data }) into a discriminated union.',
        levelB: 'Create an exhaustive type guard verifying an unknown API payload matches an interface.',
        levelC: 'Configure ESLint/Oxlint rules enforcing `@typescript-eslint/no-explicit-any`.'
      },
      debuggingChallenge: {
        brokenCode: `const data = (response as any).data.user.name; // Bypasses all type checks!`,
        problem: 'Forcing `as any` opens the door to silent runtime crashes if response.data or user is undefined.',
        fix: 'Define proper API response interfaces and validate data before accessing nested fields.'
      },
      conceptualQuestion: {
        question: 'Why are discriminated unions for async state (`idle` | `loading` | `success` | `error`) superior to separate booleans (`isLoading`, `isError`)?',
        options: [
          'Because booleans use more CPU cycles in V8.',
          'Discriminated unions make impossible states (e.g. `isLoading: true` and `isError: true` simultaneously) unrepresentable in the type system.',
          'React 19 only supports discriminated unions.',
          'Booleans cannot be rendered in JSX.'
        ],
        correctIndex: 1,
        explanation: 'Separate booleans can produce invalid combinations (e.g. loading=true AND error=true). Discriminated unions represent mutually exclusive valid states.'
      },
      codeReadingQuestion: {
        snippet: `function isUser(obj: unknown): obj is User {\n  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj;\n}`,
        question: 'What is this function called in TypeScript, and what does `obj is User` do?',
        answer: 'It is a User-Defined Type Guard. When it returns true, TypeScript narrows the type of `obj` from `unknown` to `User` in the surrounding scope.'
      },
      starterCode: `// Assignment: Implement createAsyncStateMachine
// Simulate an async state machine that strictly adheres to discriminated unions:
// createAsyncStateMachine()
// Methods:
// - getState(): returns current state
// - transition(action):
//   * action { type: 'FETCH' } -> { status: 'loading', data: null, error: null }
//   * action { type: 'RESOLVE', payload } -> { status: 'success', data: payload, error: null }
//   * action { type: 'REJECT', error } -> { status: 'error', data: null, error }
//   * action { type: 'RESET' } -> { status: 'idle', data: null, error: null }
// Throws Error(\`Invalid transition \${action.type} from \${currentState.status}\`) if transition is invalid:
// e.g. Cannot RESOLVE from 'idle'.

export function createAsyncStateMachine() {
  // Your code here
}`,
      testCases: [
        {
          name: 'Transitions through valid fetch-resolve lifecycle',
          run: (fn) => {
            const sm = fn();
            if (sm.getState().status !== 'idle') return false;
            sm.transition({ type: 'FETCH' });
            if (sm.getState().status !== 'loading') return false;
            sm.transition({ type: 'RESOLVE', payload: { id: 1 } });
            const s = sm.getState();
            return s.status === 'success' && s.data.id === 1 && s.error === null;
          }
        },
        {
          name: 'Rejects invalid transitions',
          run: (fn) => {
            const sm = fn();
            try {
              sm.transition({ type: 'RESOLVE', payload: 'data' });
              return false;
            } catch (err) {
              return err.message.includes('Invalid transition');
            }
          }
        }
      ],
      solution: `export function createAsyncStateMachine() {
  let state = { status: 'idle', data: null, error: null };
  return {
    getState: () => ({ ...state }),
    transition(action) {
      if (action.type === 'FETCH') {
        state = { status: 'loading', data: null, error: null };
      } else if (action.type === 'RESOLVE') {
        if (state.status !== 'loading') {
          throw new Error(\`Invalid transition RESOLVE from \${state.status}\`);
        }
        state = { status: 'success', data: action.payload, error: null };
      } else if (action.type === 'REJECT') {
        if (state.status !== 'loading') {
          throw new Error(\`Invalid transition REJECT from \${state.status}\`);
        }
        state = { status: 'error', data: null, error: action.error };
      } else if (action.type === 'RESET') {
        state = { status: 'idle', data: null, error: null };
      } else {
        throw new Error(\`Unknown action type: \${action.type}\`);
      }
      return state;
    }
  };
}`,
      hints: [
        'Check state.status before allowing RESOLVE or REJECT (must be loading).',
        'Throw Error(\`Invalid transition \${action.type} from \${state.status}\`) on invalid steps.',
        'Reset returns { status: "idle", data: null, error: null }.'
      ]
    }
  ]
};
