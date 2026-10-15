// Phase 14: React Native Bridge
export const phase14 = {
  id: 'phase-14',
  title: 'Phase 14 — React Native Bridge',
  description: 'Bridge your React web mastery into native mobile development for iOS and Android: Core mobile components (<View>, <Text>, <Image>), StyleSheet architecture & Flexbox column defaults, Pressable interactions, high-performance FlatList virtualization, React Navigation (Native Stack & Bottom Tabs), Platform-specific APIs, AsyncStorage, Expo vs Bare workflows, and Universal React code sharing.',
  icon: 'Smartphone',
  badge: 'Mobile & Native',
  estimatedHours: 12,
  lessons: [
    {
      id: 'p14-l1',
      slug: 'react-web-vs-react-native-mental-model',
      title: 'React Web vs React Native: The Shared Architecture',
      prerequisites: ['p1-l1', 'p3-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand what is 100% shared between React Web and React Native (JSX, hooks, state, props, Context).',
        'Learn what is completely different (no DOM, no HTML tags, no CSS cascade, native UI runtime).',
        'Map HTML elements to their React Native equivalents (`<div>` -> `<View>`, `<p>` -> `<Text>`).'
      ],
      explanation: 'If you know React, you already know 85% of React Native. The core mental model—components, props, state, `useState`, `useEffect`, `useContext`, custom hooks, and JSX—is 100% identical.\n\n**The Critical Difference**: In a browser, React renders to the **DOM** (`<div>`, `<p>`, `<span>`, `<a>`). In mobile apps (iOS & Android), there is **NO DOM and NO HTML**. Instead, React Native invokes native mobile UI widgets: `<View>` compiles to `UIView` on iOS and `android.view.ViewGroup` on Android. You cannot use `<div>` or `<p>` on mobile; attempting to do so throws a compile error.',
      whyItExists: 'Enables React developers to build truly native 60fps iOS and Android apps using their existing React knowledge without learning Swift or Kotlin from scratch.',
      syntaxRules: 'Import core components from `"react-native"`. Never use HTML tags like `<div>` or `<span>`. All text MUST be wrapped in `<Text>`.',
      codeExample: `// React Web:
// import React from 'react';
// export function WebCard() {
//   return <div className="card"><p>Hello Web</p></div>;
// }

// React Native Equivalent:
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NativeCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hello Mobile!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});`,
      lineByLine: [
        'Line 8: Imports View and Text primitives directly from "react-native".',
        'Line 12: <View> acts as the layout container (like <div>).',
        'Line 13: <Text> wraps strings. In React Native, plain strings outside <Text> throw a fatal error!',
        'Line 18: StyleSheet.create optimizes style definitions with native IDs.'
      ],
      expectedBehavior: 'Compiles to real native UIKit (iOS) and Android View components with zero web view or browser overhead.',
      commonMistakes: [
        'Placing raw text inside a `<View>` without wrapping in `<Text>`: `<View>Hello</View>` crashes the app!',
        'Trying to use CSS class names like `className="btn"` (React Native uses style objects and `StyleSheet.create`).'
      ],
      practiceLevels: {
        levelA: 'Translate a simple user profile card from HTML/CSS to React Native View/Text.',
        levelB: 'Set up an Expo snack and render native text with custom styling.',
        levelC: 'Compare bundle output between Web and Native builds.'
      },
      debuggingChallenge: {
        brokenCode: `export function App() {\n  return (\n    <View>\n      User Profile: Alice {/* Crash: Raw text outside <Text> component! */}\n    </View>\n  );\n}`,
        problem: 'React Native does not support naked text nodes inside containers.',
        fix: 'Wrap text in `<Text>`: `<Text>User Profile: Alice</Text>`.'
      },
      conceptualQuestion: {
        question: 'What happens if you render plain text directly inside a `<View>` in React Native without a `<Text>` wrapper?',
        options: [
          'It renders fine with default font styling.',
          'React Native throws a fatal red screen runtime crash: "Text strings must be rendered within a <Text> component".',
          'It automatically converts the text into a button.',
          'It opens a web browser view.'
        ],
        correctIndex: 1,
        explanation: 'React Native strictly mandates that all textual content must be enclosed inside a `<Text>` primitive.'
      },
      codeReadingQuestion: {
        snippet: `const WebToNativeMap = { div: 'View', p: 'Text', span: 'Text', img: 'Image', input: 'TextInput' };`,
        question: 'Which React Native component corresponds to an HTML `<input>` element?',
        answer: '`<TextInput>`'
      },
      starterCode: `// Assignment: Implement mapWebToNativeTags
// Build a transpiler helper mapping web HTML tags to React Native primitives:
// mapWebToNativeTags(webTag)
// - 'div', 'section', 'article', 'main' -> 'View'
// - 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'label' -> 'Text'
// - 'img' -> 'Image'
// - 'input' -> 'TextInput'
// - 'button' -> 'Pressable'
// - 'a' -> 'Pressable'
// Returns native component name or 'View' fallback.

export function mapWebToNativeTags(webTag) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Maps HTML layout and typography tags to Native equivalents',
          run: (fn) => {
            return fn('div') === 'View' && fn('p') === 'Text' && fn('h1') === 'Text' && fn('img') === 'Image' && fn('input') === 'TextInput';
          }
        },
        {
          name: 'Maps interactive tags to Pressable',
          run: (fn) => {
            return fn('button') === 'Pressable' && fn('a') === 'Pressable';
          }
        }
      ],
      solution: `export function mapWebToNativeTags(webTag) {
  const map = {
    div: 'View',
    section: 'View',
    article: 'View',
    main: 'View',
    p: 'Text',
    span: 'Text',
    h1: 'Text',
    h2: 'Text',
    h3: 'Text',
    h4: 'Text',
    label: 'Text',
    img: 'Image',
    input: 'TextInput',
    button: 'Pressable',
    a: 'Pressable'
  };
  return map[webTag.toLowerCase()] || 'View';
}`,
      hints: [
        'Normalize webTag to lower case.',
        'Use dictionary lookup.',
        'Fallback to View.'
      ]
    },
    {
      id: 'p14-l2',
      slug: 'react-native-flexbox-styling',
      title: 'Styling in React Native: Flexbox Differences & StyleSheet',
      prerequisites: ['p14-l1', 'p8-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Master the key differences between Web CSS and React Native Flexbox.',
        'Understand that `flexDirection` defaults to `"column"` on mobile (not `"row"`).',
        'Learn why all dimensional units are unitless density-independent pixels (dp).'
      ],
      explanation: 'React Native uses Yoga, a Flexbox engine that mimics CSS, but with several critical differences designed for mobile screens:\n1. **`flexDirection` defaults to `"column"`**: On the web, flex defaults to horizontal `row`. On mobile phones (tall portrait aspect ratio), flex defaults to vertical `column`!\n2. **Unitless Numbers**: You never write `px`, `rem`, or `em`. Writing `padding: 16` means 16 density-independent pixels (dp), which automatically scales across Retina and Android densities.\n3. **No CSS Cascade**: Styles do not inherit down the tree (except text styles within nested `<Text>` tags).\n4. **`StyleSheet.create`**: Validates styles and sends them across the native bridge as numeric IDs for performance.',
      whyItExists: 'Provides consistent, predictable layout behavior across thousands of Android and iOS device screen sizes.',
      syntaxRules: 'Use `StyleSheet.create({ ... })`. Dimensions are unitless: `width: 200`, `marginTop: 12`. Flex direction defaults to column.',
      codeExample: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function UserBadge({ name, role }: { name: string; role: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarPlaceholder} />
      <View style={styles.infoCol}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.roleText}>{role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Override default 'column' to horizontal row layout
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  avatarPlaceholder: {
    width: 48, // Unitless density-independent pixels!
    height: 48,
    borderRadius: 24, // 50% radius creates circle
    backgroundColor: '#3b82f6',
  },
  infoCol: {
    marginLeft: 12,
    flexDirection: 'column', // Native default
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  roleText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});`,
      lineByLine: [
        'Line 19: flexDirection: "row" explicitly overrides the default column layout to place avatar and text side-by-side.',
        'Line 25: width: 48 and height: 48 are unitless numbers, not "48px".',
        'Line 27: borderRadius: 24 makes the avatar a perfect circle.'
      ],
      expectedBehavior: 'Layout renders identically across iPhone and Android devices regardless of screen density.',
      commonMistakes: [
        'Writing string units like `padding: "16px"` or `margin: "1rem"` (causes runtime style parse crash!).',
        'Expecting child views to line up horizontally without specifying `flexDirection: "row"`.'
      ],
      practiceLevels: {
        levelA: 'Build a two-column mobile card layout with StyleSheet.create.',
        levelB: 'Center content vertically and horizontally using `justifyContent: "center"` and `alignItems: "center"`.',
        levelC: 'Implement responsive dimensions with `useWindowDimensions`.'
      },
      debuggingChallenge: {
        brokenCode: `const styles = StyleSheet.create({\n  box: {\n    width: '200px', // Crash!\n    margin: '10px 20px', // Crash!\n  }\n});`,
        problem: 'React Native does not accept "px" strings or CSS shorthand syntax with multiple values like "10px 20px".',
        fix: 'Use numbers and explicit directional properties: `width: 200, marginVertical: 10, marginHorizontal: 20`.'
      },
      conceptualQuestion: {
        question: 'What is the default `flexDirection` in React Native, and why does it differ from CSS on the web?',
        options: [
          'Default is "row" like CSS.',
          'Default is "column" because mobile phones have tall vertical portrait orientations, making top-to-bottom layout the natural default.',
          'Default is "wrap".',
          'Default is "none".'
        ],
        correctIndex: 1,
        explanation: 'On mobile, apps flow vertically from top to bottom, so `flexDirection: "column"` is the logical default.'
      },
      codeReadingQuestion: {
        snippet: `<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />`,
        question: 'What does `flex: 1` do on a root container view in React Native?',
        answer: 'It instructs the view to expand and fill the entire available screen height and width.'
      },
      starterCode: `// Assignment: Implement sanitizeNativeStyle
// Convert web CSS style definitions to React Native compatible objects:
// sanitizeNativeStyle(cssStyleObj)
// Rules:
// - Strip 'px' from numbers: '16px' -> 16
// - Convert pure numeric strings to numbers: '200' -> 200
// - Keep valid percentages as strings: '100%' -> '100%'
// - If flexDirection is missing and layout involves flex children, default to 'column'
// Returns sanitized style object.

export function sanitizeNativeStyle(cssStyleObj) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Converts px strings and numeric strings to pure numbers',
          run: (fn) => {
            const input = { width: '100px', height: '50', padding: 12, opacity: '100%' };
            const res = fn(input);
            return res.width === 100 && res.height === 50 && res.padding === 12 && res.opacity === '100%';
          }
        },
        {
          name: 'Supplies default column flexDirection if flex is defined',
          run: (fn) => {
            const res = fn({ flex: 1 });
            return res.flex === 1 && res.flexDirection === 'column';
          }
        }
      ],
      solution: `export function sanitizeNativeStyle(cssStyleObj) {
  const result = {};
  for (const [key, val] of Object.entries(cssStyleObj)) {
    if (typeof val === 'string') {
      if (val.endsWith('px')) {
        const num = parseFloat(val);
        result[key] = isNaN(num) ? val : num;
      } else if (/^\\d+(\\.\\d+)?$/.test(val)) {
        result[key] = parseFloat(val);
      } else {
        result[key] = val;
      }
    } else {
      result[key] = val;
    }
  }
  if (result.flex !== undefined && result.flexDirection === undefined) {
    result.flexDirection = 'column';
  }
  return result;
}`,
      hints: [
        'Check if val is string ending in "px" and parseFloat.',
        'Check if val is numeric string.',
        'If result.flex exists and flexDirection is undefined, add flexDirection: "column".'
      ]
    },
    {
      id: 'p14-l3',
      slug: 'mobile-lists-flatlist-virtualization',
      title: 'High-Performance Mobile Lists: `FlatList`',
      prerequisites: ['p14-l1', 'p10-l9'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand why `ScrollView` with `.map()` causes out-of-memory crashes on mobile.',
        'Use `FlatList` for built-in mobile list virtualization.',
        'Configure `data`, `renderItem`, `keyExtractor`, and `ListEmptyComponent`.'
      ],
      explanation: 'On mobile devices, memory and battery constraints are severe. If you render a list of 500 items using `<ScrollView>{items.map(...)}</ScrollView>`, React Native attempts to create 500 native views simultaneously in memory, causing laggy frame drops and app crashes.\n\n`<FlatList>` is React Native\'s built-in virtualized list component. It renders only the visible items on screen, recycling native views as the user scrolls. It supports pull-to-refresh (`onRefresh`), infinite scroll pagination (`onEndReached`), and multi-column grid layouts out of the box.',
      whyItExists: 'Enables smooth 60fps scrolling over feeds of thousands of items without exhausting mobile device RAM.',
      syntaxRules: '`<FlatList data={items} keyExtractor={item => item.id} renderItem={({ item }) => <Card item={item} />} />`.',
      codeExample: `import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

interface Post {
  id: string;
  title: string;
  author: string;
}

export function FeedList({ posts }: { posts: Post[] }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Fetch latest posts...
    setRefreshing(false);
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.postCard}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postAuthor}>By {item.author}</Text>
        </View>
      )}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  postCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  postTitle: { fontSize: 16, fontWeight: 'bold' },
  postAuthor: { fontSize: 14, color: '#64748b', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8' },
});`,
      lineByLine: [
        'Line 19: data={posts} supplies the array of items to render.',
        'Line 20: keyExtractor assigns unique string keys to each native view.',
        'Line 21: renderItem receives an object with { item, index } and returns native JSX.',
        'Line 28: ListEmptyComponent renders automatically when data array is empty.'
      ],
      expectedBehavior: 'Silky smooth 60fps scrolling with minimal mobile memory footprint.',
      commonMistakes: [
        'Using anonymous arrow functions inline for `renderItem` in heavy lists (creates a new function instance on every render; define as a callback).',
        'Forgetting `keyExtractor`, causing console warnings and inefficient item recycling.'
      ],
      practiceLevels: {
        levelA: 'Render a list of 100 contacts using FlatList with keyExtractor.',
        levelB: 'Add an infinite scroll handler using `onEndReached` and `onEndReachedThreshold`.',
        levelC: 'Configure a 2-column grid using `numColumns={2}`.'
      },
      debuggingChallenge: {
        brokenCode: `<FlatList\n  data={items}\n  renderItem={(item) => <Text>{item.title}</Text>} // Render error: undefined!\n/>`,
        problem: 'FlatList\'s renderItem receives an argument object `{ item, index }`, not the raw item directly.',
        fix: 'Destructure item: `renderItem={({ item }) => <Text>{item.title}</Text>}`.'
      },
      conceptualQuestion: {
        question: 'Why should you prefer `FlatList` over `ScrollView` with `items.map()` for long lists in React Native?',
        options: [
          'FlatList renders HTML directly.',
          'ScrollView renders all items into memory at once, which crashes on large datasets; FlatList lazily renders only visible items (virtualization), keeping memory low.',
          'ScrollView does not support scrolling.',
          'FlatList is written in Python.'
        ],
        correctIndex: 1,
        explanation: 'FlatList uses virtualization to keep only on-screen items in memory, preventing device out-of-memory crashes.'
      },
      codeReadingQuestion: {
        snippet: `<FlatList onEndReached={fetchNextPage} onEndReachedThreshold={0.5} />`,
        question: 'When will `fetchNextPage` be invoked by FlatList?',
        answer: 'When the user scrolls to within half a screen length (50% threshold) from the bottom of the list.'
      },
      starterCode: `// Assignment: Implement flatListKeyExtractor
// Build a robust key extractor fallback utility for FlatList:
// flatListKeyExtractor(item, index)
// Priority:
// 1. item.id (converted to string)
// 2. item.key (converted to string)
// 3. item._id (converted to string)
// 4. Fallback: String(index)

export function flatListKeyExtractor(item, index) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Extracts id or key as string',
          run: (fn) => {
            const k1 = fn({ id: 101 }, 0);
            const k2 = fn({ key: 'custom-key' }, 1);
            const k3 = fn({ _id: 'mongo-id' }, 2);
            return k1 === '101' && k2 === 'custom-key' && k3 === 'mongo-id';
          }
        },
        {
          name: 'Falls back to index string when no identifier exists',
          run: (fn) => {
            const k = fn({ name: 'Item without id' }, 4);
            return k === '4';
          }
        }
      ],
      solution: `export function flatListKeyExtractor(item, index) {
  if (item && item.id !== undefined && item.id !== null) return String(item.id);
  if (item && item.key !== undefined && item.key !== null) return String(item.key);
  if (item && item._id !== undefined && item._id !== null) return String(item._id);
  return String(index);
}`,
      hints: [
        'Check item.id, item.key, and item._id in priority order.',
        'Convert matched property to String().',
        'Fallback to String(index).'
      ]
    },
    {
      id: 'p14-l4',
      slug: 'touch-handling-pressable-gestures',
      title: 'Touch and Gestures: `Pressable` vs `TouchableOpacity`',
      prerequisites: ['p14-l1'],
      estimatedDuration: '25 mins',
      difficulty: 'Beginner',
      objectives: [
        'Understand why `Pressable` replaced `TouchableOpacity` and `TouchableHighlight`.',
        'Handle pressed states with dynamic function styles: `style={({ pressed }) => [...]}`.',
        'Configure `onLongPress`, `hitSlop`, and tactile feedback.'
      ],
      explanation: 'On mobile, there is no mouse cursor or hover state; interactions are driven by physical touch. In early React Native, developers used `TouchableOpacity` (which fades opacity on tap). \n\nModern React Native uses **`<Pressable>`**, the official core component for all touch interactions. `<Pressable>` offers complete control over touch states: you can pass a function to `style` or `children` (`({ pressed }) => ...`) to dynamically alter colors, scale, or opacity when a finger touches the screen. It also supports `hitSlop` to expand the touchable area without changing visual layout.',
      whyItExists: 'Provides fluid, responsive tactile touch interactions tailored for finger taps and long-presses.',
      syntaxRules: '`<Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>`.',
      codeExample: `import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      // hitSlop expands touch target by 10dp in all directions for accessibility
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed, // Applied while finger is touching
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.text, pressed && styles.textPressed]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.98 }], // Subtle tactile press animation
  },
  text: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  textPressed: { opacity: 0.9 },
});`,
      lineByLine: [
        'Line 9: hitSlop={10} expands touch target without altering CSS margins (huge for mobile UX!).',
        'Line 10: style receives an object with { pressed } boolean.',
        'Line 26: transform: [{ scale: 0.98 }] provides responsive native press feedback.'
      ],
      expectedBehavior: 'Button provides immediate visual feedback upon finger contact.',
      commonMistakes: [
        'Making button touch targets smaller than 44x44dp (Apple and Google human interface guidelines mandate at least 44-48dp minimum touch target).',
        'Using raw `onClick` (React Native uses `onPress`, not `onClick`).'
      ],
      practiceLevels: {
        levelA: 'Build an interactive button with dynamic pressed opacity using Pressable.',
        levelB: 'Add a long-press action that triggers after 800ms.',
        levelC: 'Configure hitSlop on a small close icon.'
      },
      debuggingChallenge: {
        brokenCode: `<Pressable onClick={handleAction}><Text>Submit</Text></Pressable> // Clicking does nothing!`,
        problem: 'React Native components do not have an `onClick` event prop.',
        fix: 'Change `onClick` to `onPress`.'
      },
      conceptualQuestion: {
        question: 'What does the `hitSlop` prop do on a React Native `<Pressable>` component?',
        options: [
          'It slows down user touch speed.',
          'It expands the interactive touchable area beyond the visual bounds of the component, making small icons easier for fingers to tap without altering visual layout.',
          'It prevents double tapping.',
          'It enables swipe gestures.'
        ],
        correctIndex: 1,
        explanation: '`hitSlop` enlarges the tap target area without changing the element\'s visual dimensions, dramatically improving mobile touch ergonomics.'
      },
      codeReadingQuestion: {
        snippet: `<Pressable onLongPress={showMenu} delayLongPress={600} />`,
        question: 'How long must a user hold their finger down before `showMenu` fires?',
        answer: '600 milliseconds.'
      },
      starterCode: `// Assignment: Implement resolvePressableStyle
// Simulate Pressable dynamic style calculation:
// resolvePressableStyle(styleProp, isPressed)
// - styleProp can be:
//   1. A plain style object: { backgroundColor: 'blue' }
//   2. An array of styles: [{ padding: 10 }, { color: 'white' }]
//   3. A function: ({ pressed }) => styleObj or styleArray
// Returns a single merged style object.

export function resolvePressableStyle(styleProp, isPressed) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Resolves function style passing pressed boolean',
          run: (fn) => {
            const dynamic = ({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              backgroundColor: 'blue'
            });
            const s1 = fn(dynamic, true);
            const s2 = fn(dynamic, false);
            return s1.opacity === 0.5 && s2.opacity === 1 && s1.backgroundColor === 'blue';
          }
        },
        {
          name: 'Merges array of style objects',
          run: (fn) => {
            const arr = [{ padding: 10 }, { padding: 20, color: 'red' }];
            const res = fn(arr, false);
            return res.padding === 20 && res.color === 'red';
          }
        }
      ],
      solution: `export function resolvePressableStyle(styleProp, isPressed) {
  let resolved = typeof styleProp === 'function' ? styleProp({ pressed: isPressed }) : styleProp;
  if (!resolved) return {};
  if (Array.isArray(resolved)) {
    return Object.assign({}, ...resolved.filter(Boolean));
  }
  return { ...resolved };
}`,
      hints: [
        'Check if typeof styleProp === "function". If so, invoke with { pressed: isPressed }.',
        'If result is an array, merge with Object.assign({}, ...array.filter(Boolean)).',
        'Return merged object.'
      ]
    },
    {
      id: 'p14-l5',
      slug: 'react-navigation-stacks-tabs',
      title: 'Mobile Navigation: React Navigation (Stack & Tabs)',
      prerequisites: ['p5-l1', 'p14-l1'],
      estimatedDuration: '35 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Understand mobile navigation patterns (Native Stack, Bottom Tabs, Drawer).',
        'Learn why mobile navigation uses a physical "screen stack" rather than URL routing.',
        'Navigate between screens with `navigation.navigate("ScreenName")`.'
      ],
      explanation: 'On the web, navigation is driven by browser URLs (`/products/123`). On mobile apps, navigation is structured as a **Stack of Screens**:\n- **Native Stack Navigator**: When you tap a product, a new native screen slides in from the right, stacking on top of the previous screen. Tapping "Back" or swiping from the edge pops the top screen off the stack.\n- **Bottom Tabs Navigator**: Persistent tabs along the bottom of the phone screen (e.g. Home, Search, Profile) allowing instant switching between primary app sections.\n\n**React Navigation** is the standard routing library in React Native.',
      whyItExists: 'Delivers genuine 60fps native screen transitions, gesture swipes, and header animations.',
      syntaxRules: 'Create stack: `const Stack = createNativeStackNavigator();`\nNavigate: `navigation.navigate("Details", { itemId: 42 })`.',
      codeExample: `// Navigation setup example (React Navigation):
/*
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Stack Navigator
export function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

// 2. Screen Component receiving navigation prop:
function FeedScreen({ navigation }) {
  return (
    <View>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { id: 101 })}
      />
    </View>
  );
}
*/`,
      lineByLine: [
        'Stack.Navigator manages the physical card stack of screens.',
        'navigation.navigate("Details", params) pushes the Details screen onto the stack with native OS transition animations.'
      ],
      expectedBehavior: 'Users can swipe from the left edge of iOS screens to pop back naturally.',
      commonMistakes: [
        'Attempting to use `window.location` or `react-router-dom` in React Native apps.',
        'Passing massive non-serializable objects (like class instances or functions) inside navigation route params.'
      ],
      practiceLevels: {
        levelA: 'Configure a Native Stack with Home and Settings screens.',
        levelB: 'Pass item IDs as route parameters to a detail screen.',
        levelC: 'Nest a Stack Navigator inside a Bottom Tab Navigator.'
      },
      debuggingChallenge: {
        brokenCode: `// In DetailsScreen:\nfunction DetailsScreen(props) {\n  const id = props.id; // undefined!\n}`,
        problem: 'Route parameters are passed inside `props.route.params`, not directly on `props`.',
        fix: 'Access via `props.route.params?.id` or `useRoute().params`.'
      },
      conceptualQuestion: {
        question: 'How does mobile screen navigation fundamentally differ from web browser routing?',
        options: [
          'Mobile routing only works when connected to WiFi.',
          'Mobile routing is modeled as a physical stack of screens (pushing new views on top, popping previous views off with native swipe gestures) rather than URL string replacements.',
          'Mobile navigation requires Redux.',
          'There is no difference.'
        ],
        correctIndex: 1,
        explanation: 'Mobile navigation preserves underlying screens in memory as layers in a stack, enabling instant back-swipes.'
      },
      codeReadingQuestion: {
        snippet: `navigation.goBack();`,
        question: 'What does `navigation.goBack()` do in a Stack Navigator?',
        answer: 'It pops the current screen off the top of the stack and reveals the previous screen.'
      },
      starterCode: `// Assignment: Implement simulateNavigationStack
// Simulate a mobile screen navigation stack:
// createNavigationStack(initialRoute)
// Returns:
// - current(): name of active screen at top of stack
// - push(screenName, params = {}): pushes new screen onto stack
// - pop(): pops top screen off stack (cannot pop root screen; returns false if attempted)
// - getStackDepth(): returns number of screens in stack

export function createNavigationStack(initialRoute) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Pushes and pops screens in LIFO order',
          run: (fn) => {
            const nav = fn('Home');
            if (nav.current() !== 'Home' || nav.getStackDepth() !== 1) return false;
            nav.push('Profile');
            nav.push('Settings');
            if (nav.current() !== 'Settings' || nav.getStackDepth() !== 3) return false;
            nav.pop();
            return nav.current() === 'Profile' && nav.getStackDepth() === 2;
          }
        },
        {
          name: 'Prevents popping initial root screen',
          run: (fn) => {
            const nav = fn('Feed');
            const popped = nav.pop();
            return popped === false && nav.current() === 'Feed' && nav.getStackDepth() === 1;
          }
        }
      ],
      solution: `export function createNavigationStack(initialRoute) {
  const stack = [{ name: initialRoute, params: {} }];

  return {
    current: () => stack[stack.length - 1].name,
    push(screenName, params = {}) {
      stack.push({ name: screenName, params });
    },
    pop() {
      if (stack.length <= 1) return false;
      stack.pop();
      return true;
    },
    getStackDepth: () => stack.length
  };
}`,
      hints: [
        'Store stack as an array initialized with [{ name: initialRoute, params: {} }].',
        'current() reads stack[stack.length - 1].name.',
        'In pop(), check if stack.length <= 1 and return false before popping.'
      ]
    },
    {
      id: 'p14-l6',
      slug: 'universal-react-code-sharing',
      title: 'Universal React: Sharing Code Between Web and Mobile',
      prerequisites: ['p14-l1', 'p14-l2'],
      estimatedDuration: '30 mins',
      difficulty: 'Intermediate',
      objectives: [
        'Structure a cross-platform repository to share 80%+ of code between Web and Mobile.',
        'Extract shared business logic, custom hooks, and state management into a shared core.',
        'Use Platform-specific file extensions: `.native.js` and `.web.js`.'
      ],
      explanation: 'The greatest superpower of the React ecosystem is **Universal React**: building Web, iOS, and Android applications from a single monorepo. \n\nBy separating **Business Logic** (data fetching, custom hooks, Redux/Zustand state, validation schemas, utility functions) from **Presentational Components** (DOM tags vs Native primitives), you can share over 80% of your codebase. Bundlers like Vite and Metro also support platform extensions: if you name files `Button.web.jsx` and `Button.native.jsx`, Vite automatically bundles the web version while Metro bundles the native version.',
      whyItExists: 'Saves companies hundreds of engineering hours by reusing business logic and state across web and mobile teams.',
      syntaxRules: 'Place shared business logic in `/shared/hooks` and `/shared/state`. Use `Button.web.tsx` and `Button.native.tsx` for platform-specific UI.',
      codeExample: `// Shared custom hook (100% reusable on Web AND Mobile!):
// src/shared/hooks/useCart.js
import { useState, useCallback } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems(curr => [...curr, product]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems(curr => curr.filter(item => item.id !== id));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { items, addItem, removeItem, total };
}

// In React Web:
// import { useCart } from '@/shared/hooks/useCart';
// <div onClick={() => addItem(p)}>Add to Cart</div>

// In React Native:
// import { useCart } from '@/shared/hooks/useCart';
// <Pressable onPress={() => addItem(p)}><Text>Add to Cart</Text></Pressable>`,
      lineByLine: [
        'Line 4: useCart uses pure React hooks with zero web or mobile UI primitives.',
        'Line 20: Web component consumes useCart and renders HTML <div>.',
        'Line 24: Native component consumes the exact same useCart hook and renders <Pressable> and <Text>.'
      ],
      expectedBehavior: 'Identical cart state, pricing math, and business rules executed across web and mobile platforms.',
      commonMistakes: [
        'Putting DOM elements or `localStorage` calls inside shared custom hooks (breaks immediately when imported into React Native).',
        'Duplicating state management code separately for Web and Mobile.'
      ],
      practiceLevels: {
        levelA: 'Write a platform-agnostic useAuth custom hook.',
        levelB: 'Implement Platform.select({ ios: ..., android: ..., web: ... }).',
        levelC: 'Configure a monorepo with shared state and separate Web/Mobile apps.'
      },
      debuggingChallenge: {
        brokenCode: `// In shared hook:\nexport function useStorage() {\n  const save = (k, v) => window.localStorage.setItem(k, v); // Crashes on mobile: window is undefined!\n}`,
        problem: 'window and localStorage do not exist in React Native.',
        fix: 'Inject a storage adapter or use platform-specific storage modules.'
      },
      conceptualQuestion: {
        question: 'What is the recommended architecture for sharing code between a React Web app and a React Native mobile app?',
        options: [
          'Copy-paste files between two separate repositories.',
          'Extract pure state management, API services, and custom hooks into a shared core, while keeping UI presentational components platform-specific.',
          'Use iframes inside the mobile app.',
          'Force the web app to use React Native Web for everything.'
        ],
        correctIndex: 1,
        explanation: 'Separating business logic (hooks, state, math) from UI primitives enables massive code reuse without compromising platform-native user experiences.'
      },
      codeReadingQuestion: {
        snippet: `import { Platform } from 'react-native';\nconst shadow = Platform.select({\n  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 },\n  android: { elevation: 4 },\n});`,
        question: 'Why is `Platform.select` necessary for shadows here?',
        answer: 'Because iOS uses CoreGraphics shadow properties while Android uses native elevation.'
      },
      starterCode: `// Assignment: Implement platformFileResolver
// Simulate how bundlers resolve platform-specific extensions:
// resolvePlatformFile(availableFiles, baseFileName, targetPlatform)
// - availableFiles: array of filenames e.g. ['Card.web.js', 'Card.native.js', 'Card.js']
// - targetPlatform: 'web' | 'ios' | 'android'
// Resolution priority:
// 1. Exact platform: \`\${baseFileName}.\${targetPlatform}.js\`
// 2. Native fallback (if targetPlatform is 'ios' or 'android'): \`\${baseFileName}.native.js\`
// 3. Base fallback: \`\${baseFileName}.js\`
// Returns the resolved filename, or null if none match.

export function resolvePlatformFile(availableFiles, baseFileName, targetPlatform) {
  // Your code here
}`,
      testCases: [
        {
          name: 'Resolves exact platform file if available',
          run: (fn) => {
            const files = ['Card.web.js', 'Card.native.js', 'Card.js'];
            return fn(files, 'Card', 'web') === 'Card.web.js';
          }
        },
        {
          name: 'Falls back to .native.js for mobile platforms',
          run: (fn) => {
            const files = ['Button.native.js', 'Button.js'];
            return fn(files, 'Button', 'ios') === 'Button.native.js';
          }
        },
        {
          name: 'Falls back to base .js file when platform-specific file is absent',
          run: (fn) => {
            const files = ['Header.js'];
            return fn(files, 'Header', 'android') === 'Header.js';
          }
        }
      ],
      solution: `export function resolvePlatformFile(availableFiles, baseFileName, targetPlatform) {
  const exact = \`\${baseFileName}.\${targetPlatform}.js\`;
  if (availableFiles.includes(exact)) return exact;

  if (targetPlatform === 'ios' || targetPlatform === 'android') {
    const native = \`\${baseFileName}.native.js\`;
    if (availableFiles.includes(native)) return native;
  }

  const base = \`\${baseFileName}.js\`;
  if (availableFiles.includes(base)) return base;

  return null;
}`,
      hints: [
        'Check \`\${baseFileName}.\${targetPlatform}.js\` first.',
        'If targetPlatform is ios or android, check \`\${baseFileName}.native.js\`.',
        'Check \`\${baseFileName}.js\` as fallback.'
      ]
    }
  ]
};
