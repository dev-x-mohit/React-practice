// Diagnostic Assessment Questions
// Maps results to phase unlock recommendations and skill ratings

export const diagnosticQuestions = [
  {
    id: 'diag-1',
    category: 'JavaScript Prerequisites',
    targetPhase: 'phase-0',
    question: 'What is the output of the following array operation?\n`const arr = [1, 2, 3]; const res = arr.map(x => x * 2);`\nDoes `arr` mutate?',
    options: [
      '`arr` becomes [2, 4, 6] (mutated in place)',
      '`res` is [2, 4, 6] and `arr` remains [1, 2, 3] (unmutated)',
      '`res` is [1, 2, 3] and `arr` is unchanged',
      'It throws a TypeError'
    ],
    correctIndex: 1,
    explanation: '`Array.prototype.map()` is a pure, immutable method that returns a brand new array leaving the original array intact. This concept is foundational for React state immutability.'
  },
  {
    id: 'diag-2',
    category: 'JavaScript Prerequisites',
    targetPhase: 'phase-0',
    question: 'How does object destructuring with default parameters behave in the following snippet?\n`const { role = "guest", count = 0 } = { count: null };`\nWhat are the values of `role` and `count`?',
    options: [
      'role = "guest", count = 0',
      'role = "guest", count = null',
      'role = undefined, count = null',
      'role = "guest", count = undefined'
    ],
    correctIndex: 1,
    explanation: 'JavaScript default values are triggered ONLY when a property is strictly `undefined`. Because `count: null` is provided, `count` remains `null`. `role` was omitted (`undefined`), so it triggers the default `"guest"`.'
  },
  {
    id: 'diag-3',
    category: 'React Foundations',
    targetPhase: 'phase-1',
    question: 'In React JSX, why must all component tags return a single root element or Fragment (`<>...</>`)?',
    options: [
      'Because the browser DOM forbids having multiple siblings.',
      'Because JSX compiles into JavaScript `React.createElement()` or `_jsx()` function calls, and a JavaScript function can only return a single value.',
      'Because React 19 deprecated multi-child components.',
      'To enable automatic CSS layout.'
    ],
    correctIndex: 1,
    explanation: 'Under the hood, JSX compiles to function calls (`_jsx("div", ...)`). A JavaScript return statement cannot return two expressions without wrapping them in an array or container.'
  },
  {
    id: 'diag-4',
    category: 'React Foundations',
    targetPhase: 'phase-1',
    question: 'What is the primary function of the `key` prop when rendering a dynamic list of items in React?',
    options: [
      'It provides CSS styling hooks.',
      'It gives each DOM element a unique HTML ID.',
      'It provides React\'s reconciliation algorithm with a persistent identity for each item across renders, allowing it to preserve component state and avoid re-creating DOM nodes.',
      'It encrypts sensitive list data.'
    ],
    correctIndex: 2,
    explanation: 'Keys provide stable identity across renders. Using item IDs as keys allows React to match previous elements, reordering them cleanly without resetting local state.'
  },
  {
    id: 'diag-5',
    category: 'State & Forms',
    targetPhase: 'phase-2',
    question: 'Given the state update: `const [count, setCount] = useState(0);`\nIf you execute:\n`setCount(count + 1); setCount(count + 1); setCount(count + 1);` inside the same event handler, what is the count on the next render?',
    options: [
      '3',
      '1',
      '0',
      'undefined'
    ],
    correctIndex: 1,
    explanation: '`count` is a constant captured in the current render closure (0). All three calls compute `0 + 1 = 1`. To increment 3 times, you must use the functional updater: `setCount(c => c + 1)`.'
  },
  {
    id: 'diag-6',
    category: 'React Hooks',
    targetPhase: 'phase-3',
    question: 'What occurs when you omit the dependency array in a `useEffect` hook (`useEffect(() => { ... })`)?',
    options: [
      'The effect runs only once on mount.',
      'The effect runs on every single render (mount and every update).',
      'The effect never runs.',
      'React throws a compile error.'
    ],
    correctIndex: 1,
    explanation: 'Without a dependency array, `useEffect` executes after the initial mount AND after every subsequent re-render. Passing an empty array `[]` restricts it to mounting only.'
  },
  {
    id: 'diag-7',
    category: 'React Internals',
    targetPhase: 'phase-4',
    question: 'When a parent component re-renders in standard React, what happens to its child components by default?',
    options: [
      'Only children whose props changed will re-render.',
      'All child components in the parent\'s JSX tree re-render recursively, regardless of whether their props changed.',
      'Children are frozen in memory.',
      'Only stateful children re-render.'
    ],
    correctIndex: 1,
    explanation: 'React\'s default rendering cascade causes all children of a re-rendering component to re-render, unless optimized with `React.memo` or component composition.'
  },
  {
    id: 'diag-8',
    category: 'Routing',
    targetPhase: 'phase-5',
    question: 'In a single-page app using React Router, why should you use `<Link to="/about">` instead of `<a href="/about">`?',
    options: [
      'Anchor tags do not work on mobile.',
      '`<Link>` intercepts the click event, updates browser history via the HTML5 History API, and renders the new view in-place without triggering a full-page browser refresh.',
      '`<Link>` encrypts URL parameters.',
      '`<Link>` is faster because it compiles to C++.'
    ],
    correctIndex: 1,
    explanation: 'Standard `<a>` tags cause the browser to unload the current document and perform a full HTTP request. `<Link>` prevents default reload and switches components client-side.'
  },
  {
    id: 'diag-9',
    category: 'API & Server State',
    targetPhase: 'phase-6',
    question: 'Why are dedicated server-state libraries like TanStack Query (React Query) preferred over `useEffect` + `useState` for API fetching?',
    options: [
      'React Query replaces the Node.js backend.',
      'They provide automatic background refetching, deduping of identical requests, cache management, stale-time invalidation, and retry logic that requires hundreds of lines of fragile boilerplate in useEffect.',
      'useEffect is deprecated in React 19.',
      'TanStack Query makes HTTP requests faster.'
    ],
    correctIndex: 1,
    explanation: 'Server state has unique requirements (caching, deduplication, background revalidation, stale timers) that custom useEffect implementations almost always implement inconsistently.'
  },
  {
    id: 'diag-10',
    category: 'TypeScript with React',
    targetPhase: 'phase-9',
    question: 'When typing children in a reusable container component that can accept strings, JSX elements, numbers, or fragments, which type should you use?',
    options: [
      '`JSX.Element`',
      '`React.ReactNode`',
      '`HTMLElement`',
      '`string | number`'
    ],
    correctIndex: 1,
    explanation: '`React.ReactNode` is the comprehensive type for anything renderable in React JSX (elements, strings, numbers, booleans, null, fragments).'
  }
];

export function evaluateDiagnostic(answers) {
  // answers: { [questionId]: selectedOptionIndex }
  let score = 0;
  const recommendations = [];
  const phaseScores = {};

  for (const q of diagnosticQuestions) {
    const isCorrect = answers[q.id] === q.correctIndex;
    if (isCorrect) {
      score++;
    } else {
      if (!recommendations.includes(q.targetPhase)) {
        recommendations.push(q.targetPhase);
      }
    }
    phaseScores[q.targetPhase] = isCorrect;
  }

  const percentage = Math.round((score / diagnosticQuestions.length) * 100);
  let placementLevel = 'Foundations';
  if (percentage >= 80) placementLevel = 'Advanced Practitioner';
  else if (percentage >= 50) placementLevel = 'Intermediate Developer';

  return {
    score,
    total: diagnosticQuestions.length,
    percentage,
    placementLevel,
    recommendedReviewPhases: recommendations,
    phaseScores
  };
}
