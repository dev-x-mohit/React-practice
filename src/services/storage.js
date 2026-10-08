// LocalStorage Engine Service - v1
const STORAGE_KEY = 'react_academy_state_v1';

function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getInitialTheme() {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const DEFAULT_STATE = {
  version: 'v1',
  theme: getInitialTheme(),
  completedLessons: {}, // { [lessonId]: { completedAt: string, score: number, attempts: number } }
  codeDrafts: {}, // { [lessonId]: string }
  bookmarks: [], // string[] of lesson IDs
  reviewQueue: [], // { lessonId: string, reason: string, addedAt: string }[]
  streak: {
    current: 1,
    best: 1,
    lastActivityDate: getTodayString()
  },
  diagnosticResult: null,
  manualOverrides: {}, // { [lessonId]: true }
  capstoneSubmissions: {} // { [capstoneId]: { submittedAt: string, code: string } }
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProgress(DEFAULT_STATE);
      return { ...DEFAULT_STATE };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch (err) {
    console.error('Failed to parse saved progress, falling back to default:', err);
    return { ...DEFAULT_STATE };
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

export function updateStreak(currentState) {
  const today = getTodayString();
  const streak = { ...currentState.streak };

  if (streak.lastActivityDate === today) {
    return streak;
  }

  const lastDate = new Date(streak.lastActivityDate);
  const currentDate = new Date(today);
  const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    streak.current += 1;
    if (streak.current > streak.best) {
      streak.best = streak.current;
    }
  } else if (diffDays > 1) {
    streak.current = 1;
  }

  streak.lastActivityDate = today;
  return streak;
}

export function exportProgressJSON(state) {
  return JSON.stringify(state, null, 2);
}

export function importProgressJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === 'object') {
      const merged = { ...DEFAULT_STATE, ...parsed };
      saveProgress(merged);
      return { success: true, state: merged };
    }
    return { success: false, error: 'Invalid JSON format' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function resetProgress() {
  const fresh = { ...DEFAULT_STATE, streak: { current: 1, best: 1, lastActivityDate: getTodayString() } };
  saveProgress(fresh);
  return fresh;
}
