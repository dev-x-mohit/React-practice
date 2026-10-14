// Phase 11: Testing and Debugging
export const phase11 = {
  id: 'phase-11',
  title: 'Phase 11 — Testing and Debugging',
  description: 'Master production testing and debugging: Kent C. Dodds\' Testing Trophy, Vitest & React Testing Library (RTL), accessible query priority (getByRole first), user-event simulation, jest-dom assertions, asynchronous testing (waitFor, findBy), mocking APIs with MSW, testing Context providers, renderHook for custom hooks, Error Boundary tests, and Playwright E2E fundamentals.',
  icon: 'CheckCircle2',
  badge: 'Testing',
  estimatedHours: 15,
  lessons: [
    {
      id: 'p11-l1',
      slug: 'testing-philosophy-trophy',
      title: 'Testing Philosophy: The Testing Trophy and RTL Principles',
      prerequisites: ['p1-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand the Testing Trophy (Static, Unit, Integration, E2E).',
        'Learn the core RTL philosophy: "The more your tests resemble the way your software is used, the more confidence they can give you."',
        'Avoid testing implementation details (internal state, method names, component lifecycle).'
      ],
      explanation: 'In the past, developers wrote thousands of isolated "shallow" unit tests testing private component methods or internal state variables (`wrapper.state("isOpen")`). When the component was refactored without changing user behavior, all tests broke (false negatives). Conversely, when features broke for users, unit tests still passed (false positives).\n\nKent C. Dodds established the **Testing Trophy** and **React Testing Library**: tests should interact with components the exact same way a real human or screen reader does—clicking buttons, reading text labels, and filling inputs—giving you genuine confidence.',
      whyItExists: 'Gives developers confidence to refactor code without tests breaking, and catches regressions that actually affect end users.',
      syntaxRules: 'Do NOT test internal state. Test DOM inputs, rendered texts, and user actions via accessible queries.',
      codeExample: `// Anti-Pattern: Testing implementation details (Fragile!)
// expect(component.state.isOpen).toBe(true);

// Good Pattern: Testing user behavior (Resilient!)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

test('expands accordion content when user clicks header', async () => {
  const user = userEvent.setup();
  render(<Accordion title="Details">Hidden Info</Accordion>);

  // Verify content is initially not visible
  expect(screen.queryByText(/hidden info/i)).not.toBeInTheDocument();

  // User interacts with the accessible button
  await user.click(screen.getByRole('button', { name: /details/i }));

  // Verify content is now visible
  expect(screen.getByText(/hidden info/i)).toBeInTheDocument();
});`,
      lineByLine: [
        'Line 10: Renders the component into the RTL virtual DOM.',
        'Line 13: screen.queryByText safely checks for absence without throwing an error.',
        'Line 16: user.click simulates a realistic browser click sequence (hover, down, up, click).',
        'Line 19: Confirms that the user can now read "Hidden Info".'
      ],
      expectedBehavior: 'Test passes if the feature works for a real human, regardless of whether you used useState, useReducer, or CSS classes.',
      commonMistakes: [
        'Asserting on CSS class names or internal component state rather than visible user text/roles.',
        'Over-testing static constants while ignoring critical user interaction flows.'
      ],
      practiceLevels: {
        levelA: 'Identify fragile tests vs behavior tests in a code review.',
        levelB: 'Rewrite an implementation-detail test into an RTL behavioral test.',
        levelC: 'Configure test coverage reports focused on user-facing paths.'
      },
      debuggingChallenge: {
        brokenCode: `test('submits form', () => {\n  const wrapper = shallow(<Form />);\n  wrapper.instance().handleFormSubmit({ preventDefault: () => {} }); // Anti-pattern!\n});`,
        problem: 'Directly calling the private class method `handleFormSubmit` bypasses button click events, validation, and real DOM behavior.',
        fix: 'Use RTL to render the form, type into inputs with userEvent, and click the Submit button.'
      },
      conceptualQuestion: {
        question: 'What is the primary guiding principle of React Testing Library?',
        options: [
          'Verify every line of source code with 100% test coverage.',
          'The more your tests resemble the way your software is used, the more confidence they can give you.',
          'Always mock all sub-components.',
          'Test class methods using shallow rendering.'
        ],
        correctIndex: 1,
        explanation: 'RTL\'s core ethos is testing user-visible behavior and accessibility roles rather than internal implementation details.'
      },
      codeReadingQuestion: {
        snippet: `screen.getByRole('button', { name: /save/i });`,
        question: 'Why is `getByRole` with a name regex preferred over `getByText("Save")`?',
        answer: 'Because it verifies both the accessibility role (`<button>`) and its accessible text name simultaneously, matching how screen readers navigate.'
      },
      starterCode: `// Assignment: Implement classifyTestType
// Classify testing assertions based on the Testing Trophy:
// classifyTestType(assertionDescription)
// - If contains 'type check', 'linter', 'syntax': returns 'static'
// - If contains 'pure function', 'math', 'isolated utility': returns 'unit'
// - If contains 'user clicks', 'form submission', 'renders with context': returns 'integration'
// - If contains 'browser login', 'full checkout flow', 'end to end': returns 'e2e'
// Defaults to 'integration'.

export function classifyTestType(description) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Classifies integration and unit descriptions correctly',
          run: (fn) => {
            const t1 = fn('user clicks submit button and sees error');
            const t2 = fn('pure function formats currency string');
            const t3 = fn('type check verifies props interface');
            return t1 === 'integration' && t2 === 'unit' && t3 === 'static';
          }
        },
        {
          name: 'Classifies E2E flows',
          run: (fn) => {
            return fn('full checkout flow across pages in chromium') === 'e2e';
          }
        }
      ],
      solution: `export function classifyTestType(description) {
  const d = description.toLowerCase();
  if (d.includes('type check') || d.includes('linter') || d.includes('syntax')) return 'static';
  if (d.includes('pure function') || d.includes('math') || d.includes('isolated utility')) return 'unit';
  if (d.includes('browser login') || d.includes('full checkout flow') || d.includes('end to end')) return 'e2e';
  if (d.includes('user clicks') || d.includes('form submission') || d.includes('renders with context')) return 'integration';
  return 'integration';
}`,
      hints: [
        'Convert description to lower case.',
        'Check for static keywords first, then unit, then e2e, then integration.',
        'Default to integration.'
      ]
    },
    {
      id: 'p11-l2',
      slug: 'rtl-query-priority-accessibility',
      title: 'Query Priority in RTL: getByRole First',
      prerequisites: ['p11-l1', 'p8-l4'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Master RTL\'s recommended query hierarchy.',
        'Use `getByRole`, `getByLabelText`, and `getByPlaceholderText`.',
        'Understand why `getByTestId` is the query of LAST resort.'
      ],
      explanation: 'React Testing Library provides multiple query methods. Following RTL\'s **Priority Hierarchy** ensures your app remains accessible:\n1. **Queries Accessible to Everyone** (Highest Priority):\n   - `getByRole`: Identifies elements by their ARIA role (`button`, `heading`, `textbox`, `checkbox`).\n   - `getByLabelText`: Great for form inputs associated with `<label>`.\n   - `getByPlaceholderText`: For inputs without labels.\n   - `getByText`: For non-interactive elements (paragraphs, spans).\n2. **Semantic HTML5 Queries**:\n   - `getByAltText` (images), `getByTitle`.\n3. **Test IDs** (Lowest Priority):\n   - `getByTestId`: Only when an element cannot be queried by role or text (e.g. dynamic canvas or SVG graphic).',
      whyItExists: 'Forces developers to build accessible HTML with proper labels and roles, directly benefiting screen reader users.',
      syntaxRules: 'Preferred: `screen.getByRole("button", { name: /submit/i })`. Avoid: `screen.getByTestId("submit-btn")`.',
      codeExample: `// Component
function LoginForm() {
  return (
    <form>
      <h2>Sign In</h2>
      <label htmlFor="user-email">Email Address</label>
      <input id="user-email" type="email" />

      <button type="submit">Log In</button>
    </form>
  );
}

// Tests in Order of Priority:
// 1. Heading by role:
const heading = screen.getByRole('heading', { level: 2, name: /sign in/i });

// 2. Input by associated label text:
const emailInput = screen.getByLabelText(/email address/i);

// 3. Button by role and accessible name:
const submitBtn = screen.getByRole('button', { name: /log in/i });`,
      lineByLine: [
        'Line 16: getByRole("heading", { level: 2 }) verifies proper h2 semantic markup.',
        'Line 19: getByLabelText verifies the <input> is properly linked to its <label> via htmlFor/id.',
        'Line 22: getByRole("button", { name: /log in/i }) queries the accessible submit action.'
      ],
      expectedBehavior: 'If a developer forgets the `<label>` tag or breaks the `htmlFor` association, the test immediately fails, catching the a11y bug before production.',
      commonMistakes: [
        'Slapping `data-testid="anything"` on every element and only using `getByTestId` (defeats RTL\'s accessibility validation).',
        'Using `getByText` on buttons instead of `getByRole("button", { name: "Save" })` (misses verifying that the element is actually clickable/accessible).'
      ],
      practiceLevels: {
        levelA: 'Query a navigation link using `getByRole("link", { name: "About" })`.',
        levelB: 'Refactor three `getByTestId` calls to `getByRole` and `getByLabelText`.',
        levelC: 'Test an input with aria-describedby error messaging.'
      },
      debuggingChallenge: {
        brokenCode: `// Component: <button><span>Save</span></button>\n// Test: expect(screen.getByRole('button')).toBeInTheDocument(); // Error: Found multiple buttons!`,
        problem: 'getByRole without a name filter found multiple buttons on the page.',
        fix: 'Add the accessible name filter: `screen.getByRole("button", { name: /save/i })`.'
      },
      conceptualQuestion: {
        question: 'Why does RTL consider `getByTestId` to be the query of last resort?',
        options: [
          'Because test IDs increase CSS file size.',
          'Because real users and assistive technologies cannot see or interact with data-testid attributes, so querying by test ID does not validate accessibility.',
          'Test IDs only work in Firefox.',
          'Test IDs are deprecated in HTML5.'
        ],
        correctIndex: 1,
        explanation: 'Users interact with labels, button text, and roles, not data-testids. Testing by role ensures assistive technologies can navigate the app.'
      },
      codeReadingQuestion: {
        snippet: `screen.getByRole('checkbox', { name: /accept terms/i, checked: true });`,
        question: 'What two assertions does this single query verify simultaneously?',
        answer: 'It verifies that an accessible checkbox with label "Accept Terms" exists AND that its checked state is currently true.'
      },
      starterCode: `// Assignment: Implement rankQueryMethods
// Simulate RTL's query priority advisor:
// rankQueryMethods(queryName)
// - 'getByRole' -> { rank: 1, recommendation: 'Top priority: Accessible to everyone' }
// - 'getByLabelText' -> { rank: 2, recommendation: 'High priority: Form accessibility' }
// - 'getByPlaceholderText' -> { rank: 3, recommendation: 'Good: Use when label is missing' }
// - 'getByText' -> { rank: 4, recommendation: 'Good for non-interactive text elements' }
// - 'getByTestId' -> { rank: 5, recommendation: 'Last resort: Only when other queries fail' }
// Any unknown query returns { rank: 99, recommendation: 'Unrecognized query method' }

export function rankQueryMethods(queryName) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Ranks getByRole as top priority',
          run: (fn) => {
            const res = fn('getByRole');
            return res.rank === 1 && res.recommendation.includes('Top priority');
          }
        },
        {
          name: 'Ranks getByTestId as last resort',
          run: (fn) => {
            const res = fn('getByTestId');
            return res.rank === 5 && res.recommendation.includes('Last resort');
          }
        }
      ],
      solution: `export function rankQueryMethods(queryName) {
  const map = {
    getByRole: { rank: 1, recommendation: 'Top priority: Accessible to everyone' },
    getByLabelText: { rank: 2, recommendation: 'High priority: Form accessibility' },
    getByPlaceholderText: { rank: 3, recommendation: 'Good: Use when label is missing' },
    getByText: { rank: 4, recommendation: 'Good for non-interactive text elements' },
    getByTestId: { rank: 5, recommendation: 'Last resort: Only when other queries fail' }
  };
  return map[queryName] || { rank: 99, recommendation: 'Unrecognized query method' };
}`,
      hints: [
        'Use an object mapping query names to their rank and recommendation.',
        'Return fallback rank 99 for unknown query names.'
      ]
    },
    {
      id: 'p11-l3',
      slug: 'user-event-simulations-vs-fireevent',
      title: 'User Interactions: user-event vs fireEvent',
      prerequisites: ['p11-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand why `@testing-library/user-event` is superior to `fireEvent`.',
        'Simulate typing, keyboard navigation, selecting options, and file uploads.',
        'Always initialize with `const user = userEvent.setup()`.'
      ],
      explanation: 'Early tests used `fireEvent.click(button)` or `fireEvent.change(input, { target: { value: "hello" } })`. However, `fireEvent` simply dispatches a single raw DOM event without triggering the 15+ related browser events that occur when a real human types or clicks.\n\n`@testing-library/user-event` simulates full browser lifecycles: when a user clicks an input, it hovers, clicks, focuses, moves the cursor, fires `keydown`, `keypress`, `input`, and `keyup` for every single character. This catches real-world issues like `onKeyDown` listeners or disabled button behaviors.',
      whyItExists: 'Guarantees that component behavior matches genuine user keyboard and mouse interactions.',
      syntaxRules: '`const user = userEvent.setup(); await user.type(input, "text"); await user.click(button);`. All user-event methods return Promises.',
      codeExample: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBox } from './SearchBox';

test('triggers onSearch when user submits search query', async () => {
  const user = userEvent.setup(); // Always call setup() before render!
  const mockSearch = vi.fn();

  render(<SearchBox onSearch={mockSearch} />);

  const input = screen.getByRole('textbox', { name: /search/i });
  const button = screen.getByRole('button', { name: /submit/i });

  // 1. Type realistic characters
  await user.type(input, 'React 19');
  expect(input).toHaveValue('React 19');

  // 2. Click submit button
  await user.click(button);

  // 3. Verify callback was executed with argument
  expect(mockSearch).toHaveBeenCalledTimes(1);
  expect(mockSearch).toHaveBeenCalledWith('React 19');
});`,
      lineByLine: [
        'Line 6: userEvent.setup() initializes realistic event simulation.',
        'Line 7: vi.fn() creates a mock spy function.',
        'Line 15: user.type simulates typing "React 19" character by character.',
        'Line 19: user.click triggers pointerdown, focus, click.'
      ],
      expectedBehavior: 'All browser events fire in exact natural sequence.',
      commonMistakes: [
        'Forgetting `await` on `user.click` or `user.type` (user-event methods are asynchronous; omitting await causes race conditions).',
        'Calling `userEvent.click` directly without `userEvent.setup()` (deprecated in userEvent v14+).'
      ],
      practiceLevels: {
        levelA: 'Simulate typing into a password input and toggling show/hide password.',
        levelB: 'Simulate pressing Enter key inside an input using `await user.keyboard("{Enter}")`.',
        levelC: 'Test file upload interaction using `await user.upload(input, file)`.'
      },
      debuggingChallenge: {
        brokenCode: `test('types text', () => {\n  const user = userEvent.setup();\n  user.type(input, 'hello'); // Test finishes before typing completes!\n  expect(input.value).toBe('hello');\n});`,
        problem: 'user.type returns a Promise that was not awaited, so the assertion runs before typing finishes.',
        fix: 'Add `async` to the test function and `await user.type(...)`.'
      },
      conceptualQuestion: {
        question: 'Why is `userEvent.type(input, "abc")` preferred over `fireEvent.change(input, { target: { value: "abc" } })`?',
        options: [
          'Because fireEvent was removed from npm.',
          'userEvent simulates all intermediate browser events (focus, keydown, keypress, keyup, input) for every character, catching real keyboard bugs.',
          'fireEvent only works on strings shorter than 10 characters.',
          'userEvent runs in WebAssembly.'
        ],
        correctIndex: 1,
        explanation: 'fireEvent just changes the DOM property directly, bypassing keyboard event listeners and validation that execute on key strokes.'
      },
      codeReadingQuestion: {
        snippet: `await user.keyboard('{Control>}a{/Control}{Backspace}');`,
        question: 'What real user action does this user-event command simulate?',
        answer: 'Selecting all text in an input (Ctrl+A) and deleting it with the Backspace key.'
      },
      starterCode: `// Assignment: Implement simulateUserActions
// Simulate sequential user actions on a stateful mock input:
// simulateUserActions(initialValue, actions)
// actions is an array of commands:
// - { type: 'type', text: string } -> appends text to value
// - { type: 'backspace', count: number } -> removes last count characters
// - { type: 'clear' } -> resets value to empty string
// Returns the final state: { value: string, history: string[] }
// history tracks the value after each action.

export function simulateUserActions(initialValue, actions) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Simulates typing and backspace sequences',
          run: (fn) => {
            const actions = [
              { type: 'type', text: 'Hello' },
              { type: 'type', text: ' World' },
              { type: 'backspace', count: 6 }
            ];
            const res = fn('', actions);
            return res.value === 'Hello' && res.history.length === 3 && res.history[1] === 'Hello World';
          }
        },
        {
          name: 'Clears input cleanly',
          run: (fn) => {
            const actions = [{ type: 'clear' }];
            const res = fn('Existing', actions);
            return res.value === '' && res.history[0] === '';
          }
        }
      ],
      solution: `export function simulateUserActions(initialValue, actions) {
  let val = initialValue;
  const history = [];

  for (const act of actions) {
    if (act.type === 'type') {
      val += act.text;
    } else if (act.type === 'backspace') {
      const count = act.count || 1;
      val = val.slice(0, Math.max(0, val.length - count));
    } else if (act.type === 'clear') {
      val = '';
    }
    history.push(val);
  }

  return { value: val, history };
}`,
      hints: [
        'Iterate through actions and mutate val according to act.type.',
        'Use val.slice(0, Math.max(0, val.length - count)) for backspace.',
        'Push val to history after each command.'
      ]
    },
    {
      id: 'p11-l4',
      slug: 'async-testing-findby-waitfor',
      title: 'Asynchronous Testing: `findBy*`, `waitFor`, and Timers',
      prerequisites: ['p11-l3', 'p6-l1'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Choose between `getBy*` (synchronous), `queryBy*` (assert absent), and `findBy*` (async/polling).',
        'Use `waitFor` for assertions that take time to become true.',
        'Manage fake timers with `vi.useFakeTimers()` without stalling tests.'
      ],
      explanation: 'In modern React, data fetches and animations happen asynchronously. RTL provides three query variants:\n- `getBy*`: Expects element to exist immediately. Throws an error if not found. Use for synchronous DOM.\n- `queryBy*`: Returns `null` if element does not exist. Use ONLY for asserting non-existence: `expect(screen.queryByText(...)).not.toBeInTheDocument()`.\n- `findBy*`: Returns a Promise that polls until the element appears in the DOM (default timeout: 1000ms). Perfect for async data loading!\n\nFor custom conditions, `await waitFor(() => expect(...).toBe(...))` repeatedly polls until the expectation passes.',
      whyItExists: 'Prevents flaky timing tests and race conditions when testing async components.',
      syntaxRules: 'Async element appears: `const item = await screen.findByRole("heading");`\nAssert absence: `expect(screen.queryByText(...)).not.toBeInTheDocument();`.',
      codeExample: `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile';

test('loads and displays user profile data', async () => {
  render(<UserProfile userId="123" />);

  // 1. Synchronous check: Initial loading skeleton is present
  expect(screen.getByText(/loading user.../i)).toBeInTheDocument();

  // 2. Asynchronous check: findByRole polls until API response renders
  const heading = await screen.findByRole('heading', { name: /alice smith/i });
  expect(heading).toBeInTheDocument();

  // 3. Absence check: Loading skeleton has disappeared
  expect(screen.queryByText(/loading user.../i)).not.toBeInTheDocument();
});`,
      lineByLine: [
        'Line 8: getByText verifies the loader renders immediately on mount.',
        'Line 11: await screen.findByRole waits up to 1 second for the async API request to resolve and render the user name.',
        'Line 15: screen.queryByText confirms the loader has unmounted without throwing an error.'
      ],
      expectedBehavior: 'Test reliably waits for data fetching to complete before asserting.',
      commonMistakes: [
        'Using `await screen.getByRole(...)` (`getBy` is synchronous and does not return a Promise; using await does nothing).',
        'Putting side effects or user clicks inside a `waitFor` callback (e.g. `waitFor(() => user.click(...))` runs the click multiple times as it polls!).',
        'Using `findBy` to assert that an element is NOT in the document (it will poll for 1 second, fail, and throw an error. Use `queryBy` instead).'
      ],
      practiceLevels: {
        levelA: 'Test an async autocomplete list that appears 200ms after typing.',
        levelB: 'Assert that an error toast disappears after 3 seconds using waitFor.',
        levelC: 'Test a debounced search input using `vi.useFakeTimers()`.'
      },
      debuggingChallenge: {
        brokenCode: `test('checks element absent', async () => {\n  expect(await screen.findByText('Error')).not.toBeInTheDocument(); // Throws timeout error!\n});`,
        problem: 'findByText waits for "Error" to appear. Since it never appears, findByText times out and fails the test before the assertion runs.',
        fix: 'Use `screen.queryByText("Error")` with synchronous assertion: `expect(screen.queryByText("Error")).not.toBeInTheDocument();`.'
      },
      conceptualQuestion: {
        question: 'Which RTL query method should you use when asserting that an element does NOT exist in the DOM?',
        options: [
          '`screen.getByText()`',
          '`screen.findByText()`',
          '`screen.queryByText()`',
          '`screen.assertNotPresent()`'
        ],
        correctIndex: 2,
        explanation: '`getBy` and `findBy` both throw errors when elements are missing. Only `queryBy` returns `null`, enabling `expect(...).not.toBeInTheDocument()`.'
      },
      codeReadingQuestion: {
        snippet: `await waitFor(() => {\n  expect(screen.getByRole('alert')).toHaveTextContent('Saved');\n});`,
        question: 'How does `waitFor` work under the hood?',
        answer: 'It executes the callback repeatedly inside a MutationObserver/interval loop until the assertion passes or the timeout limit is reached.'
      },
      starterCode: `// Assignment: Implement pollUntilCondition
// Simulate the core mechanism of waitFor / findBy:
// pollUntilCondition(predicateFn, { timeoutMs = 1000, intervalMs = 50 })
// - predicateFn: () => boolean. Returns true when condition met, false or throws if not met.
// Returns a Promise:
// - Resolves true if predicateFn returns true before timeout.
// - Rejects with Error('Timed out waiting for condition') if timeout expires.

export function pollUntilCondition(predicateFn, options = {}) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Resolves when predicate turns true within timeout',
          run: async (fn) => {
            let count = 0;
            const pred = () => { count++; return count >= 3; };
            const res = await fn(pred, { timeoutMs: 300, intervalMs: 20 });
            return res === true;
          }
        },
        {
          name: 'Rejects when predicate never satisfies condition',
          run: async (fn) => {
            try {
              await fn(() => false, { timeoutMs: 100, intervalMs: 20 });
              return false;
            } catch (err) {
              return err.message.includes('Timed out');
            }
          }
        }
      ],
      solution: `export function pollUntilCondition(predicateFn, options = {}) {
  const { timeoutMs = 1000, intervalMs = 50 } = options;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    function check() {
      try {
        if (predicateFn()) {
          return resolve(true);
        }
      } catch (e) {}

      if (Date.now() - startTime >= timeoutMs) {
        return reject(new Error('Timed out waiting for condition'));
      }
      setTimeout(check, intervalMs);
    }
    check();
  });
}`,
      hints: [
        'Record startTime = Date.now().',
        'Inside check(), call predicateFn(). If true, resolve(true).',
        'If elapsed >= timeoutMs, reject(new Error("Timed out waiting for condition")).',
        'Otherwise setTimeout(check, intervalMs).'
      ]
    },
    {
      id: 'p11-l5',
      slug: 'testing-custom-hooks-renderhook',
      title: 'Testing Custom Hooks with `renderHook` and `act`',
      prerequisites: ['p3-l7', 'p11-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Test custom hooks in isolation without creating dummy UI wrapper components.',
        'Use `renderHook(() => useMyHook())` from `@testing-library/react`.',
        'Wrap state mutations in `act(() => { ... })` when invoking hook callbacks directly.'
      ],
      explanation: 'Because React hooks cannot be called outside functional components, testing a custom hook historically required creating a fake scratch component. React Testing Library solves this with `renderHook`.\n\n`const { result, rerender } = renderHook(() => useCounter(0))` renders an internal test component. `result.current` contains the hook\'s return value at any moment. When you invoke a hook method that triggers internal state updates (like `result.current.increment()`), you wrap it in `act(() => { ... })` so React flushes all pending effects and state updates before the assertion runs.',
      whyItExists: 'Enables fast, isolated unit testing of custom hook business logic, state machines, and calculations.',
      syntaxRules: '`const { result } = renderHook(() => useHook(initialProps));`\n`act(() => { result.current.action(); });`.',
      codeExample: `import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments and decrements counter state', () => {
  // 1. Render hook
  const { result } = renderHook(() => useCounter(10));

  // 2. Initial state verification
  expect(result.current.count).toBe(10);

  // 3. Trigger action inside act()
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(11);

  // 4. Trigger decrement with step
  act(() => {
    result.current.decrement(5);
  });
  expect(result.current.count).toBe(6);
});`,
      lineByLine: [
        'Line 5: renderHook mounts the hook in an internal test container.',
        'Line 8: result.current holds the current return value of useCounter.',
        'Line 11: act() ensures React executes the setState and flushes re-renders.',
        'Line 14: Confirms count updated to 11.'
      ],
      expectedBehavior: 'Clean test of hook logic with zero visual UI boilerplate.',
      commonMistakes: [
        'Destructuring `const { count, increment } = result.current` initially (primitives like `count` won\'t update! Always read via `result.current.count`).',
        'Calling hook state updaters outside `act(...)`, which generates "Warning: An update to TestComponent inside a test was not wrapped in act(...)".'
      ],
      practiceLevels: {
        levelA: 'Test a useToggle custom hook (toggle, setTrue, setFalse).',
        levelB: 'Pass props to renderHook and use `rerender({ initial: 20 })`.',
        levelC: 'Test an async useFetch hook using `waitFor(() => expect(result.current.data).toBeDefined())`.'
      },
      debuggingChallenge: {
        brokenCode: `test('counter', () => {\n  const { result } = renderHook(() => useCounter(0));\n  const { count, increment } = result.current;\n  act(() => increment());\n  expect(count).toBe(1); // Fails! count is still 0!\n});`,
        problem: 'Destructuring `count` copied the primitive number 0 by value. The updated count is on `result.current.count`.',
        fix: 'Assert on `result.current.count`.'
      },
      conceptualQuestion: {
        question: 'Why must hook properties like `result.current.count` be read via `result.current` rather than destructured at the start of the test?',
        options: [
          'Because React freezes variable names.',
          'Primitive values like numbers and booleans are copied by value. Destructuring captures the initial value, while `result.current` is a mutable ref that points to the latest render output.',
          'Destructuring is forbidden in test files.',
          'result.current clears memory.'
        ],
        correctIndex: 1,
        explanation: '`result.current` is updated by RTL on every re-render. Reading through `result.current.property` guarantees you inspect the current state.'
      },
      codeReadingQuestion: {
        snippet: `const { result, rerender } = renderHook(({ step }) => useStep(step), { initialProps: { step: 1 } });\nrerender({ step: 5 });`,
        question: 'What does `rerender({ step: 5 })` simulate in a real React application?',
        answer: 'It simulates a parent component re-rendering and passing updated props to the custom hook.'
      },
      starterCode: `// Assignment: Implement simulateHookHarness
// Simulate the renderHook container:
// createHookHarness(hookFn, initialProps)
// Returns an object:
// - result: { current: initialHookReturn }
// - act(actionFn): executes actionFn, then re-runs hookFn and updates result.current
// - rerender(newProps): re-runs hookFn with newProps and updates result.current

export function createHookHarness(hookFn, initialProps) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Maintains result.current and updates state via act',
          run: (fn) => {
            let state = 0;
            const useTest = () => ({
              count: state,
              inc: () => { state++; }
            });
            const harness = fn(useTest, null);
            if (harness.result.current.count !== 0) return false;
            harness.act(() => {
              harness.result.current.inc();
            });
            return harness.result.current.count === 1;
          }
        },
        {
          name: 'Supports rerender with new props',
          run: (fn) => {
            const useMultiply = (factor) => factor * 10;
            const harness = fn(useMultiply, 2);
            if (harness.result.current !== 20) return false;
            harness.rerender(5);
            return harness.result.current === 50;
          }
        }
      ],
      solution: `export function createHookHarness(hookFn, initialProps) {
  let currentProps = initialProps;
  const result = { current: hookFn(currentProps) };

  function update() {
    result.current = hookFn(currentProps);
  }

  return {
    result,
    act(actionFn) {
      actionFn();
      update();
    },
    rerender(newProps) {
      currentProps = newProps;
      update();
    }
  };
}`,
      hints: [
        'Store currentProps and an object result = { current: hookFn(currentProps) }.',
        'In act(actionFn), execute actionFn() and update result.current = hookFn(currentProps).',
        'In rerender(newProps), update currentProps and call hookFn.'
      ]
    },
    {
      id: 'p11-l6',
      slug: 'testing-context-providers-custom-render',
      title: 'Testing Context Providers and Custom `renderWithProviders`',
      prerequisites: ['p3-l6', 'p11-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Avoid wrapping every single component test in 5 nested Providers manually.',
        'Build a reusable `renderWithProviders` test utility.',
        'Supply initial mock context state for tests.'
      ],
      explanation: 'In real-world applications, components rely on multiple Context providers (`ThemeProvider`, `AuthProvider`, `QueryClientProvider`, `BrowserRouter`). If you render a component that uses `useAuth()` in a test without wrapping it in `<AuthProvider>`, the test will crash with `Error: useAuth must be used within an AuthProvider`.\n\nThe professional solution is to create a custom render helper function `renderWithProviders(ui, options)` that automatically wraps test components in all required providers, allowing you to pass initial mock values cleanly.',
      whyItExists: 'Eliminates hundreds of lines of repetitive test boilerplate and ensures tests mirror production provider configurations.',
      syntaxRules: 'Export custom render from a test utility file: `export function renderWithProviders(ui, { preloadedState, ...renderOptions } = {}) { ... }`.',
      codeExample: `// test-utils.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { AuthContext } from './AuthContext';

export function renderWithProviders(ui, {
  theme = 'light',
  user = null,
  route = '/',
  ...renderOptions
} = {}) {
  window.history.pushState({}, 'Test page', route);

  function AllProviders({ children }) {
    return (
      <BrowserRouter>
        <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
          <AuthContext.Provider value={{ user, login: () => {}, logout: () => {} }}>
            {children}
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </BrowserRouter>
    );
  }

  return {
    ...render(ui, { wrapper: AllProviders, ...renderOptions })
  };
}

// In test file:
test('renders welcome message for logged in user', () => {
  renderWithProviders(<Navbar />, { user: { name: 'Alice' } });
  expect(screen.getByText(/welcome, alice/i)).toBeInTheDocument();
});`,
      lineByLine: [
        'Line 8: Custom render helper accepts mock props like user, theme, route.',
        'Line 16: AllProviders wraps test components with required hierarchy.',
        'Line 26: RTL\'s wrapper option automatically places AllProviders around the UI under test.',
        'Line 34: Test file uses clean single-line render with custom user mock.'
      ],
      expectedBehavior: 'Components consuming Context render cleanly without erroring or requiring manual Provider trees in every test.',
      commonMistakes: [
        'Duplicating provider boilerplate across 50 test files instead of centralizing in a single test-utils file.',
        'Forgetting BrowserRouter wrapper when testing components with `<Link>` tags.'
      ],
      practiceLevels: {
        levelA: 'Create a renderWithTheme test helper and test a DarkModeToggle button.',
        levelB: 'Add route history simulation with MemoryRouter to renderWithProviders.',
        levelC: 'Configure a fresh QueryClientProvider per test to prevent cache pollution.'
      },
      debuggingChallenge: {
        brokenCode: `test('renders link', () => {\n  render(<UserProfileLink />); // Error: useNavigate() may be used only in the context of a <Router> component!\n});`,
        problem: 'UserProfileLink contains a Link or useNavigate hook, but was rendered without a Router provider in the test.',
        fix: 'Render with `renderWithProviders(<UserProfileLink />)` or wrap with `<MemoryRouter>`.'
      },
      conceptualQuestion: {
        question: 'What is the purpose of passing `{ wrapper: AllProviders }` to RTL\'s `render` function?',
        options: [
          'It applies CSS styling to the rendered HTML.',
          'It automatically encloses the component under test inside a surrounding component tree (providers, routers, themes) without altering the returned queries.',
          'It runs tests in an isolated web worker.',
          'It compiles the component to production mode.'
        ],
        correctIndex: 1,
        explanation: 'The `wrapper` option wraps the element under test with necessary context providers so context hooks function properly.'
      },
      codeReadingQuestion: {
        snippet: `renderWithProviders(<CartView />, { preloadedState: { cart: [item1] } });`,
        question: 'What does this pattern allow test authors to do?',
        answer: 'It lets tests initialize specific preloaded store states without having to simulate 10 manual user clicks to populate the cart.'
      },
      starterCode: `// Assignment: Implement wrapWithContextPipeline
// Simulate the provider wrapping pipeline:
// wrapWithContextPipeline(componentName, providers)
// - providers: array of provider names e.g. ['Router', 'Theme', 'Auth']
// Returns string representation of nested JSX hierarchy:
// e.g. "<Router><Theme><Auth><Dashboard /></Auth></Theme></Router>"

export function wrapWithContextPipeline(componentName, providers = []) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Wraps component with nested providers in order',
          run: (fn) => {
            const res = fn('Dashboard', ['Router', 'Theme', 'Auth']);
            return res === '<Router><Theme><Auth><Dashboard /></Auth></Theme></Router>';
          }
        },
        {
          name: 'Returns standalone element if providers list is empty',
          run: (fn) => {
            return fn('Button', []) === '<Button />';
          }
        }
      ],
      solution: `export function wrapWithContextPipeline(componentName, providers = []) {
  let content = \`<\${componentName} />\`;
  for (let i = providers.length - 1; i >= 0; i--) {
    const p = providers[i];
    content = \`<\${p}>\${content}</\${p}>\`;
  }
  return content;
}`,
      hints: [
        'Start with <\${componentName} />.',
        'Iterate providers backwards from length - 1 down to 0.',
        'Wrap current content with <\${p}>\${content}</\${p}>.'
      ]
    }
  ]
};
