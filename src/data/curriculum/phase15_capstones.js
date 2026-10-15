// Phase 15: Capstone Projects
export const phase15 = {
  id: 'phase-15',
  title: 'Phase 15 — Capstone Projects Portfolio',
  description: 'Apply everything you have mastered across 10 progressive, real-world portfolio capstones: from interactive stateful components and multi-step onboarding wizards to full e-commerce stores, role-based auth dashboards, and an enterprise analytics SaaS workspace.',
  icon: 'Trophy',
  badge: 'Capstones',
  estimatedHours: 40,
  capstones: [
    {
      id: 'capstone-1',
      title: 'Capstone 1: Interactive Profile Card & Counter Suite',
      subtitle: 'React Foundations, Props, State, and Event Architecture',
      difficulty: 'Beginner',
      phaseMilestone: 'Phases 0–1',
      estimatedHours: 3,
      description: 'Build a dynamic developer portfolio card featuring an interactive badge counter, theme toggle, social links list, and bio editor.',
      objectives: [
        'Decompose UI into modular subcomponents (Header, Avatar, Stats, Bio).',
        'Manage state for like counter, active status toggle, and editable bio text.',
        'Apply conditional classes and inline styles cleanly.'
      ],
      requirements: {
        dataModel: {
          user: {
            name: 'string',
            title: 'string',
            bio: 'string',
            likes: 'number',
            isAvailable: 'boolean',
            skills: 'string[]'
          }
        },
        userStories: [
          'User can click a Like button to increment appreciation count.',
          'User can toggle availability status between "Available for Hire" (green badge) and "Busy" (gray badge).',
          'User can click "Edit Bio" to switch bio text into a textarea and save updates.'
        ],
        edgeCases: [
          'Prevent empty bio text from saving.',
          'Count cannot drop below zero.'
        ]
      },
      starterCode: `// Capstone 1 Starter Code
export function createProfileCardState(initialUser) {
  // Return an object managing profile card state:
  // - getUser(): returns user object
  // - incrementLikes(): increments likes by 1
  // - toggleAvailability(): flips isAvailable
  // - updateBio(newBio): updates bio if non-empty string
  let user = { ...initialUser };

  return {
    getUser: () => ({ ...user }),
    incrementLikes: () => { user.likes += 1; },
    toggleAvailability: () => { user.isAvailable = !user.isAvailable; },
    updateBio: (newBio) => {
      if (typeof newBio === 'string' && newBio.trim().length > 0) {
        user.bio = newBio.trim();
      }
    }
  };
}`,
      testCases: [
        {
          name: 'Increments likes and toggles availability',
          run: (fn) => {
            const initial = { name: 'Dev', likes: 0, isAvailable: true, bio: 'Hello' };
            const card = fn(initial);
            card.incrementLikes();
            card.toggleAvailability();
            const u = card.getUser();
            return u.likes === 1 && u.isAvailable === false;
          }
        },
        {
          name: 'Updates bio and ignores empty whitespace',
          run: (fn) => {
            const card = fn({ bio: 'Old bio' });
            card.updateBio('   ');
            if (card.getUser().bio !== 'Old bio') return false;
            card.updateBio('New bio updated!');
            return card.getUser().bio === 'New bio updated!';
          }
        }
      ]
    },
    {
      id: 'capstone-2',
      title: 'Capstone 2: Advanced Task & Productivity Suite',
      subtitle: 'State Management, Forms, Filters, and Local Persistence',
      difficulty: 'Beginner',
      phaseMilestone: 'Phases 2–3',
      estimatedHours: 4,
      description: 'Build a production-grade Todo and Task Manager featuring category tags, priority levels, live search filtering, status toggling, and bulk operations.',
      objectives: [
        'Implement complete CRUD (Create, Read, Update, Delete) state logic.',
        'Filter tasks dynamically across status (all/active/completed) and search query.',
        'Calculate live completion statistics.'
      ],
      requirements: {
        dataModel: {
          task: {
            id: 'string',
            title: 'string',
            category: "'Work' | 'Study' | 'Personal'",
            priority: "'low' | 'medium' | 'high'",
            completed: 'boolean',
            createdAt: 'number'
          }
        },
        userStories: [
          'User can create a task with title, category, and priority.',
          'User can toggle task completion status with immediate visual feedback.',
          'User can filter by category and active status.',
          'User can delete individual tasks or bulk clear completed tasks.'
        ]
      },
      starterCode: `// Capstone 2 Starter Code
export function createTaskStore(initialTasks = []) {
  let tasks = [...initialTasks];

  return {
    getTasks: (filter = { status: 'all', search: '', category: 'all' }) => {
      return tasks.filter(t => {
        if (filter.status === 'active' && t.completed) return false;
        if (filter.status === 'completed' && !t.completed) return false;
        if (filter.category !== 'all' && t.category !== filter.category) return false;
        if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
      });
    },
    addTask: (taskData) => {
      const newTask = {
        id: 't-' + Math.random().toString(36).slice(2, 7),
        completed: false,
        createdAt: Date.now(),
        ...taskData
      };
      tasks.push(newTask);
      return newTask;
    },
    toggleTask: (id) => {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    },
    deleteTask: (id) => {
      tasks = tasks.filter(t => t.id !== id);
    },
    clearCompleted: () => {
      tasks = tasks.filter(t => !t.completed);
    },
    getStats: () => ({
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length
    })
  };
}`,
      testCases: [
        {
          name: 'Adds task, toggles status, and computes accurate stats',
          run: (fn) => {
            const store = fn();
            const t1 = store.addTask({ title: 'Task 1', category: 'Work' });
            store.addTask({ title: 'Task 2', category: 'Study' });
            store.toggleTask(t1.id);
            const stats = store.getStats();
            return stats.total === 2 && stats.completed === 1 && stats.pending === 1;
          }
        },
        {
          name: 'Filters tasks by search query and category',
          run: (fn) => {
            const store = fn();
            store.addTask({ title: 'Learn React', category: 'Study' });
            store.addTask({ title: 'Buy Groceries', category: 'Personal' });
            const searchRes = store.getTasks({ status: 'all', search: 'React', category: 'all' });
            const catRes = store.getTasks({ status: 'all', search: '', category: 'Personal' });
            return searchRes.length === 1 && catRes.length === 1 && searchRes[0].title === 'Learn React';
          }
        }
      ]
    },
    {
      id: 'capstone-3',
      title: 'Capstone 3: Dynamic Product Catalog & Filtering Matrix',
      subtitle: 'Complex Multi-Criteria Filtering, Sorting, and Debouncing',
      difficulty: 'Intermediate',
      phaseMilestone: 'Phases 2–4',
      estimatedHours: 5,
      description: 'Build an e-commerce product exploration matrix with faceted category checkboxes, price range slider, rating filters, multi-field sorting, and debounced instant search.',
      objectives: [
        'Compose multi-faceted filter criteria (category, price range, rating, in-stock).',
        'Sort products by price (low-to-high, high-to-low), rating, or newest.',
        'Optimize re-renders using useMemo for computed filtered results.'
      ],
      requirements: {
        dataModel: {
          product: {
            id: 'string',
            title: 'string',
            category: 'string',
            price: 'number',
            rating: 'number',
            inStock: 'boolean'
          }
        },
        userStories: [
          'User can filter by multiple categories simultaneously (e.g. Electronics AND Audio).',
          'User can constrain maximum price with range slider.',
          'User can sort results by price ascending/descending.'
        ]
      },
      starterCode: `// Capstone 3 Starter Code
export function filterProductMatrix(products, criteria) {
  // criteria: { categories: string[], maxPrice?: number, minRating?: number, inStockOnly?: boolean, sortBy?: string }
  let results = [...products];

  if (criteria.categories && criteria.categories.length > 0) {
    results = results.filter(p => criteria.categories.includes(p.category));
  }
  if (criteria.maxPrice !== undefined) {
    results = results.filter(p => p.price <= criteria.maxPrice);
  }
  if (criteria.minRating !== undefined) {
    results = results.filter(p => p.rating >= criteria.minRating);
  }
  if (criteria.inStockOnly) {
    results = results.filter(p => p.inStock);
  }

  if (criteria.sortBy === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (criteria.sortBy === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (criteria.sortBy === 'rating-desc') {
    results.sort((a, b) => b.rating - a.rating);
  }

  return results;
}`,
      testCases: [
        {
          name: 'Applies faceted category filter and price ceiling',
          run: (fn) => {
            const catalog = [
              { id: '1', title: 'Laptop', category: 'Tech', price: 900, rating: 4.8, inStock: true },
              { id: '2', title: 'Mouse', category: 'Tech', price: 50, rating: 4.5, inStock: true },
              { id: '3', title: 'Desk', category: 'Furniture', price: 300, rating: 4.2, inStock: false }
            ];
            const res = fn(catalog, { categories: ['Tech'], maxPrice: 100 });
            return res.length === 1 && res[0].title === 'Mouse';
          }
        },
        {
          name: 'Sorts filtered results by rating descending',
          run: (fn) => {
            const catalog = [
              { id: '1', price: 10, rating: 3.5 },
              { id: '2', price: 20, rating: 4.9 },
              { id: '3', price: 15, rating: 4.2 }
            ];
            const res = fn(catalog, { sortBy: 'rating-desc' });
            return res[0].rating === 4.9 && res[1].rating === 4.2 && res[2].rating === 3.5;
          }
        }
      ]
    },
    {
      id: 'capstone-4',
      title: 'Capstone 4: Enterprise Multi-Step Onboarding Wizard',
      subtitle: 'Step Machine, Form Validation, and Summary Review',
      difficulty: 'Intermediate',
      phaseMilestone: 'Phases 2–4',
      estimatedHours: 5,
      description: 'Build a 4-step user registration wizard: Account Details, Profile Info, Subscription Plan Selection, and Confirmation Review with step validation and draft recovery.',
      objectives: [
        'Manage multi-step navigation state with step validation gates.',
        'Validate inputs per step (email regex, password length, required fields).',
        'Provide back/next navigation without losing previously inputted step data.'
      ],
      requirements: {
        steps: [
          { step: 1, name: 'Account', fields: ['email', 'password'] },
          { step: 2, name: 'Profile', fields: ['fullName', 'role'] },
          { step: 3, name: 'Plan', fields: ['planType', 'billingCycle'] },
          { step: 4, name: 'Review', summary: true }
        ]
      },
      starterCode: `// Capstone 4 Starter Code
export function createWizardManager(stepsConfig) {
  let currentStep = 1;
  const formData = {};
  const maxStep = stepsConfig.length;

  return {
    getCurrentStep: () => currentStep,
    getData: () => ({ ...formData }),
    updateFields: (fields) => {
      Object.assign(formData, fields);
    },
    nextStep: (validateFn) => {
      if (validateFn && !validateFn(formData)) {
        return false;
      }
      if (currentStep < maxStep) {
        currentStep++;
        return true;
      }
      return false;
    },
    prevStep: () => {
      if (currentStep > 1) {
        currentStep--;
        return true;
      }
      return false;
    },
    isComplete: () => currentStep === maxStep
  };
}`,
      testCases: [
        {
          name: 'Advances through steps when validation passes',
          run: (fn) => {
            const steps = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const wizard = fn(steps);
            wizard.updateFields({ email: 'test@example.com' });
            const advanced = wizard.nextStep(data => Boolean(data.email));
            return advanced === true && wizard.getCurrentStep() === 2 && wizard.getData().email === 'test@example.com';
          }
        },
        {
          name: 'Blocks progression when step validation fails',
          run: (fn) => {
            const wizard = fn([{ id: 1 }, { id: 2 }]);
            const advanced = wizard.nextStep(() => false);
            return advanced === false && wizard.getCurrentStep() === 1;
          }
        }
      ]
    },
    {
      id: 'capstone-5',
      title: 'Capstone 5: Live Weather Radar & Forecast Dashboard',
      subtitle: 'Async Data Fetching, Error Boundaries, and Loading States',
      difficulty: 'Intermediate',
      phaseMilestone: 'Phases 5–6',
      estimatedHours: 4,
      description: 'Build a weather monitoring dashboard with city search, temperature unit toggle (Celsius/Fahrenheit), hourly forecast cards, and resilient network error retry handling.',
      objectives: [
        'Handle loading, success, and network failure states cleanly.',
        'Implement temperature unit conversion math (C <-> F).',
        'Implement retry mechanism for failed requests.'
      ],
      starterCode: `// Capstone 5 Starter Code
export function createWeatherManager(apiFetcher) {
  let cache = {};
  let unit = 'metric'; // 'metric' (C) or 'imperial' (F)

  return {
    getUnit: () => unit,
    setUnit: (nextUnit) => { unit = nextUnit; },
    convertTemp: (celsius) => {
      return unit === 'metric' ? Math.round(celsius) : Math.round((celsius * 9/5) + 32);
    },
    fetchCityWeather: async (cityName) => {
      if (cache[cityName.toLowerCase()]) {
        return { data: cache[cityName.toLowerCase()], fromCache: true };
      }
      const data = await apiFetcher(cityName);
      cache[cityName.toLowerCase()] = data;
      return { data, fromCache: false };
    }
  };
}`,
      testCases: [
        {
          name: 'Converts Celsius to Fahrenheit accurately',
          run: (fn) => {
            const mgr = fn(async () => ({}));
            const c = mgr.convertTemp(0); // 32 F in imperial
            mgr.setUnit('imperial');
            const f0 = mgr.convertTemp(0);
            const f100 = mgr.convertTemp(100);
            return c === 0 && f0 === 32 && f100 === 212;
          }
        },
        {
          name: 'Caches city weather queries to prevent redundant fetches',
          run: async (fn) => {
            let fetchCount = 0;
            const mockApi = async (city) => { fetchCount++; return { city, temp: 22 }; };
            const mgr = fn(mockApi);
            const r1 = await mgr.fetchCityWeather('London');
            const r2 = await mgr.fetchCityWeather('london');
            return fetchCount === 1 && r1.fromCache === false && r2.fromCache === true;
          }
        }
      ]
    },
    {
      id: 'capstone-6',
      title: 'Capstone 6: Multi-Page Content Hub with React Router',
      subtitle: 'Dynamic Routes, Nested Layouts, Search Params, and 404 Pages',
      difficulty: 'Intermediate',
      phaseMilestone: 'Phases 5–7',
      estimatedHours: 5,
      description: 'Build a multi-page documentation and blog platform featuring URL slug routing (`/posts/:slug`), category filtering via URL query params (`?tag=react`), nested sidebar layouts, and active link highlighting.',
      objectives: [
        'Construct nested route layouts with `<Outlet />`.',
        'Extract dynamic route parameters (`useParams`).',
        'Synchronize UI filter state with URL search parameters (`useSearchParams`).'
      ],
      starterCode: `// Capstone 6 Starter Code
export function parseRouteQuery(pathname, searchString) {
  // Simulates router params extraction:
  // /posts/:slug
  // searchString: '?tag=react&sort=new'
  const postMatch = pathname.match(/^\\/posts\\/([^\\/]+)$/);
  const slug = postMatch ? postMatch[1] : null;

  const params = {};
  if (searchString && searchString.startsWith('?')) {
    const pairs = searchString.slice(1).split('&');
    for (const p of pairs) {
      const [k, v] = p.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }
  }

  return { slug, queryParams: params };
}`,
      testCases: [
        {
          name: 'Extracts dynamic slug and query parameters from path',
          run: (fn) => {
            const res = fn('/posts/mastering-react-19', '?tag=javascript&sort=newest');
            return res.slug === 'mastering-react-19' && res.queryParams.tag === 'javascript' && res.queryParams.sort === 'newest';
          }
        }
      ]
    },
    {
      id: 'capstone-7',
      title: 'Capstone 7: Production E-Commerce Store with Global Cart',
      subtitle: 'Global State, Slide-out Drawer, Coupon Discounts, and Persisted Checkout',
      difficulty: 'Advanced',
      phaseMilestone: 'Phases 6–8',
      estimatedHours: 6,
      description: 'Build a full e-commerce store with global cart drawer, item quantity selectors, coupon code validation engine, tax calculation, and persistent storage synchronization.',
      objectives: [
        'Manage global cart state with Context or Zustand.',
        'Calculate subtotal, discount percentages, and final tax.',
        'Persist cart state in localStorage.'
      ],
      starterCode: `// Capstone 7 Starter Code
export function createCartManager(initialItems = []) {
  let items = [...initialItems];
  let discountPct = 0;
  const validCoupons = { 'REACT20': 20, 'SAVE50': 50 };

  return {
    getItems: () => [...items],
    addItem: (product) => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({ ...product, quantity: 1 });
      }
    },
    updateQuantity: (id, qty) => {
      if (qty <= 0) {
        items = items.filter(i => i.id !== id);
      } else {
        const item = items.find(i => i.id === id);
        if (item) item.quantity = qty;
      }
    },
    applyCoupon: (code) => {
      if (validCoupons[code]) {
        discountPct = validCoupons[code];
        return { success: true, discountPct };
      }
      return { success: false, error: 'Invalid coupon' };
    },
    getTotals: () => {
      const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const discountAmount = Number(((subtotal * discountPct) / 100).toFixed(2));
      const total = Number(Math.max(0, subtotal - discountAmount).toFixed(2));
      return { subtotal, discountAmount, total, count: items.reduce((c, i) => c + i.quantity, 0) };
    }
  };
}`,
      testCases: [
        {
          name: 'Computes item quantities and applies valid coupon discounts',
          run: (fn) => {
            const cart = fn();
            cart.addItem({ id: 'p1', title: 'Shirt', price: 50 });
            cart.addItem({ id: 'p1', title: 'Shirt', price: 50 }); // qty 2 = 100
            cart.addItem({ id: 'p2', title: 'Hat', price: 20 }); // qty 1 = 20 (subtotal 120)
            const couponRes = cart.applyCoupon('REACT20'); // 20% off 120 = 24 off
            const totals = cart.getTotals();
            return couponRes.success === true && totals.subtotal === 120 && totals.discountAmount === 24 && totals.total === 96 && totals.count === 3;
          }
        }
      ]
    },
    {
      id: 'capstone-8',
      title: 'Capstone 8: Role-Based Auth Dashboard & Protected Routes',
      subtitle: 'JWT Session Mock, Protected Route Guards, and Role Access Control',
      difficulty: 'Advanced',
      phaseMilestone: 'Phases 8–11',
      estimatedHours: 5,
      description: 'Build an authentication portal featuring login/logout, route protection, role-based UI access control (Admin, Editor, Viewer), and session timeout handling.',
      objectives: [
        'Protect routes from unauthenticated access, redirecting to login.',
        'Restrict administrative screens to users possessing the "admin" role.',
        'Provide custom AuthContext and useAuth guard hook.'
      ],
      starterCode: `// Capstone 8 Starter Code
export function createAuthSessionManager() {
  let currentUser = null;

  return {
    getUser: () => currentUser ? { ...currentUser } : null,
    login: (email, role = 'viewer') => {
      currentUser = { email, role, loggedInAt: Date.now() };
      return currentUser;
    },
    logout: () => { currentUser = null; },
    canAccess: (requiredRole) => {
      if (!currentUser) return false;
      if (requiredRole === 'viewer') return true;
      if (requiredRole === 'editor' && (currentUser.role === 'editor' || currentUser.role === 'admin')) return true;
      if (requiredRole === 'admin' && currentUser.role === 'admin') return true;
      return false;
    }
  };
}`,
      testCases: [
        {
          name: 'Enforces role-based permissions correctly',
          run: (fn) => {
            const auth = fn();
            if (auth.canAccess('viewer') !== false) return false;
            auth.login('user@test.com', 'editor');
            if (auth.canAccess('viewer') !== true) return false;
            if (auth.canAccess('editor') !== true) return false;
            if (auth.canAccess('admin') !== false) return false; // editor cannot access admin!
            auth.login('admin@test.com', 'admin');
            return auth.canAccess('admin') === true;
          }
        }
      ]
    },
    {
      id: 'capstone-9',
      title: 'Capstone 9: Full-Stack MERN Task & Kanban Workspace',
      subtitle: 'Optimistic State Sync, Column Drag-Drop, and REST API Integration',
      difficulty: 'Advanced',
      phaseMilestone: 'Phases 6–13',
      estimatedHours: 7,
      description: 'Build a full-featured Kanban board workspace with customizable status columns (Backlog, In Progress, Review, Done), optimistic column transitions, and server synchronization.',
      objectives: [
        'Implement column-based task organization with status updates.',
        'Apply optimistic UI updates during task movement.',
        'Synchronize task reordering across columns.'
      ],
      starterCode: `// Capstone 9 Starter Code
export function createKanbanStore(initialColumns, initialCards) {
  let columns = [...initialColumns];
  let cards = [...initialCards];

  return {
    getColumns: () => columns,
    getCardsByColumn: (colId) => cards.filter(c => c.columnId === colId),
    moveCard: (cardId, targetColId) => {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        card.columnId = targetColId;
        return true;
      }
      return false;
    },
    addCard: (title, columnId) => {
      const card = { id: 'c-' + Date.now(), title, columnId };
      cards.push(card);
      return card;
    }
  };
}`,
      testCases: [
        {
          name: 'Organizes cards by column and transitions cards between columns',
          run: (fn) => {
            const cols = ['todo', 'in-progress', 'done'];
            const initial = [{ id: '1', title: 'Task 1', columnId: 'todo' }];
            const store = fn(cols, initial);
            store.moveCard('1', 'done');
            return store.getCardsByColumn('todo').length === 0 && store.getCardsByColumn('done').length === 1;
          }
        }
      ]
    },
    {
      id: 'capstone-10',
      title: 'Capstone 10: Production Enterprise SaaS Analytics Platform',
      subtitle: 'Virtualized Data Grid, Theme Toggle, Metric Cards, and Profiling',
      difficulty: 'Advanced',
      phaseMilestone: 'Phases 8–15',
      estimatedHours: 8,
      description: 'The ultimate academy graduation capstone: Build a high-performance enterprise SaaS analytics console with interactive metric cards, virtualized 1,000-row customer activity grid, dark/light theme tokens, responsive sidebar, and verified sub-16ms render performance.',
      objectives: [
        'Unify React 19 architecture, TypeScript types, and WCAG accessibility standards.',
        'Virtualize high-density tabular data with windowing.',
        'Implement runtime theme switching with CSS variables.',
        'Deliver a stunning, production-ready portfolio centerpiece.'
      ],
      starterCode: `// Capstone 10 Starter Code
export function createEnterpriseAnalyticsStore(initialUsers = []) {
  let users = [...initialUsers];

  return {
    getKpis: () => {
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.status === 'active').length;
      const totalRevenue = users.reduce((sum, u) => sum + (u.mrr || 0), 0);
      return { totalUsers, activeUsers, totalRevenue };
    },
    getPaginatedGrid: (page = 1, pageSize = 20) => {
      const start = (page - 1) * pageSize;
      return {
        items: users.slice(start, start + pageSize),
        totalItems: users.length,
        totalPages: Math.ceil(users.length / pageSize),
        page
      };
    }
  };
}`,
      testCases: [
        {
          name: 'Computes enterprise KPIs and paginates grid data',
          run: (fn) => {
            const data = Array.from({ length: 50 }, (_, i) => ({
              id: String(i),
              status: i % 2 === 0 ? 'active' : 'inactive',
              mrr: 100
            }));
            const store = fn(data);
            const kpis = store.getKpis();
            const grid = store.getPaginatedGrid(1, 10);
            return kpis.totalUsers === 50 && kpis.activeUsers === 25 && kpis.totalRevenue === 5000 && grid.items.length === 10 && grid.totalPages === 5;
          }
        }
      ]
    }
  ]
};
