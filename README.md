<div align="center">

# ?????? React Practice Academy

**The Complete Senior & Full-Stack React Engineering Curriculum**

A comprehensive, interactive web platform featuring 16 progressive learning phases, client-side sandbox execution, diagnostic skill evaluations, and spaced repetition review.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PrismJS](https://img.shields.io/badge/PrismJS-Syntax%20Highlighting-2B2B2B)](https://prismjs.com/)
[![Oxlint](https://img.shields.io/badge/Oxlint-Fast%20Linter-orange)](https://oxc.rs/)

</div>

---

## ???? Overview

**React Practice Academy** is built to bridge the gap between junior tutorial knowledge and senior full-stack mastery. It includes an in-browser JavaScript sandbox, real-time code evaluation, adaptive diagnostic questionnaires, and production capstone blueprints.

---

## ???? Key Features

- **??? Client-Side Code Sandbox**: Execute modern JavaScript and React snippets safely in-browser with automated test assertions and console captures.
- **???? 16 Comprehensive Phases**: Over 100+ deep-dive lessons spanning core foundations to advanced compiler and architecture internals.
- **???? Diagnostic Skill Assessment**: 15-question diagnostic test that identifies skill gaps and recommends tailored learning tracks.
- **???? Spaced Repetition Review**: Smart review queue to revisit complex concepts and maintain knowledge retention.
- **???? Interactive Dashboard**: Real-time tracking of completion percentages, learning streaks, phase mastery, and capstone status.
- **???? Local State & Portability**: Fully persistent local storage with zero backend dependencies, plus JSON export and import capabilities.
- **???? Glassmorphic Dark UI**: High-contrast, responsive interface built with bespoke CSS variables, smooth transitions, and accessible components.

---

## ???? Curriculum Roadmap

| Phase | Module | Focus Areas |
|---|---|---|
| **Phase 0** | **JS Prerequisites** | Closures, Event Loop, Microtasks, Prototypes, ESNext features, Immutability |
| **Phase 1** | **React Foundations** | JSX Compilation, Virtual DOM, Components, Props vs State, Reconciliation |
| **Phase 2** | **State & Forms** | Controlled vs Uncontrolled, Compound Components, Form validation, State machines |
| **Phase 3** | **Hooks Deep Dive** | `useState`, `useEffect`, `useReducer`, `useCallback`, `useMemo`, Custom Hooks |
| **Phase 4** | **Internals & Fiber** | Fiber architecture, Work loop, Lanes, Concurrent Mode, Batched Updates |
| **Phase 5** | **Routing & Navigation** | Client-side routers, Dynamic routes, Protected routes, Layout nesting |
| **Phase 6** | **API & TanStack Query** | Data caching, Stale-while-revalidate, Optimistic updates, Infinite queries |
| **Phase 7** | **State Management** | Context pitfalls, Redux Toolkit, Zustand, Atomic state, Slice patterns |
| **Phase 8** | **Styling & Accessibility** | CSS Modules, CSS-in-JS, Tailwind patterns, WCAG 2.1, ARIA attributes |
| **Phase 9** | **TypeScript with React** | Generic components, Discriminated unions, Event typing, Ref forwards |
| **Phase 10** | **Performance & Profiling**| Profiler API, React.memo, Windowing/Virtualization, Bundle splitting |
| **Phase 11** | **Testing Strategies** | Unit testing, Integration testing, Testing Library principles, Mocking |
| **Phase 12** | **Production Security** | XSS prevention, CSRF mitigations, Content Security Policy, Safe rendering |
| **Phase 13** | **Advanced Patterns** | HOCs, Render Props, State Reducer, Control Props, Micro-frontends |
| **Phase 14** | **React Native & Mobile** | Native primitives, Yoga layout, Gesture handling, Cross-platform sharing |
| **Phase 15** | **Capstone Blueprints** | Full-scale architecture design, Real-world evaluation, Deployment review |

---

## ??????? Tech Stack

- **Core**: React 19, JavaScript ESNext
- **Build Tool**: Vite 8
- **Icons**: Lucide React
- **Syntax Highlighting**: PrismJS
- **Linting**: Oxlint
- **Confetti**: Canvas Confetti

---

## ???? Getting Started

### Prerequisites

- Node.js (version 18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-x-mohit/Practise.git

# Enter project directory
cd Practise

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ???? Project Structure

```
????????? public/                 # Static assets & SVG icons
????????? src/
???   ????????? assets/             # Brand logos & graphics
???   ????????? components/
???   ???   ????????? capstones/      # Capstone projects showcase view
???   ???   ????????? common/         # Navbar, Sidebar, Modal, CodeEditor, CodeBlock
???   ???   ????????? curriculum/     # Phase catalog and lesson navigation
???   ???   ????????? dashboard/      # Analytics, progress metrics, and streaks
???   ???   ????????? modals/         # Diagnostic quiz, Export/Import, Reset
???   ???   ????????? review/         # Spaced repetition review queue
???   ???   ????????? workspace/      # Code execution playground and test harness
???   ????????? context/            # AcademyContext state provider
???   ????????? data/
???   ???   ????????? curriculum/     # 16 structured phase datasets & diagnostic quiz
???   ????????? services/           # Code runner, adaptive engine, syntax, storage
???   ????????? App.jsx             # Main application shell
???   ????????? index.css           # Design tokens, variables & typography
???   ????????? main.jsx            # Entry point
????????? vite.config.js          # Vite configuration
????????? package.json            # Scripts & dependencies
```

---

## ???? License

MIT License. Created by [Mohit Lakhara](https://github.com/dev-x-mohit).
