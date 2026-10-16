// Global Academy Context
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  loadProgress,
  saveProgress,
  updateStreak,
  resetProgress
} from '../services/storage.js';
import {
  computeProgressMetrics,
  isLessonUnlocked,
  getRecommendedNextLesson
} from '../services/adaptiveEngine.js';
import {
  getCurriculumMetrics,
  evaluateDiagnostic
} from '../data/curriculum/index.js';

const AcademyContext = createContext(null);

export function AcademyProvider({ children }) {
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'curriculum' | 'workspace' | 'capstones' | 'review'
  const [currentLessonId, setCurrentLessonId] = useState('p0-l1');
  const [activeCapstoneId, setActiveCapstoneId] = useState('capstone-1');
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    phase: 'all',
    status: 'all'
  });
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync theme to root DOM element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', progress.theme);
  }, [progress.theme]);

  // Persist progress changes to localStorage
  const updateAndSave = useCallback((updater) => {
    setProgress(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveProgress(next);
      return next;
    });
  }, []);

  // Complete a lesson with celebratory confetti
  const completeLesson = useCallback((lessonId, score = 100) => {
    updateAndSave(prev => {
      const updatedStreak = updateStreak(prev);
      const updatedCompleted = {
        ...prev.completedLessons,
        [lessonId]: {
          completedAt: new Date().toISOString(),
          score,
          attempts: (prev.completedLessons[lessonId]?.attempts || 0) + 1
        }
      };

      // Remove from review queue if present
      const updatedReview = prev.reviewQueue.filter(r => r.lessonId !== lessonId);

      return {
        ...prev,
        completedLessons: updatedCompleted,
        reviewQueue: updatedReview,
        streak: updatedStreak
      };
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (_e) {}
  }, [updateAndSave]);

  const toggleBookmark = useCallback((lessonId) => {
    updateAndSave(prev => {
      const isBookmarked = prev.bookmarks.includes(lessonId);
      const bookmarks = isBookmarked
        ? prev.bookmarks.filter(id => id !== lessonId)
        : [...prev.bookmarks, lessonId];
      return { ...prev, bookmarks };
    });
  }, [updateAndSave]);

  const addToReviewQueue = useCallback((lessonId, reason = 'Needs reinforcement') => {
    updateAndSave(prev => {
      if (prev.reviewQueue.some(r => r.lessonId === lessonId)) {
        return prev;
      }
      return {
        ...prev,
        reviewQueue: [
          ...prev.reviewQueue,
          { lessonId, reason, addedAt: new Date().toISOString() }
        ]
      };
    });
  }, [updateAndSave]);

  const removeFromReviewQueue = useCallback((lessonId) => {
    updateAndSave(prev => ({
      ...prev,
      reviewQueue: prev.reviewQueue.filter(r => r.lessonId !== lessonId)
    }));
  }, [updateAndSave]);

  const saveDraft = useCallback((lessonId, code) => {
    updateAndSave(prev => ({
      ...prev,
      codeDrafts: {
        ...prev.codeDrafts,
        [lessonId]: code
      }
    }));
  }, [updateAndSave]);

  const manualUnlockLesson = useCallback((lessonId) => {
    updateAndSave(prev => ({
      ...prev,
      manualOverrides: {
        ...prev.manualOverrides,
        [lessonId]: true
      }
    }));
  }, [updateAndSave]);

  const toggleTheme = useCallback(() => {
    updateAndSave(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  }, [updateAndSave]);

  const resetAllProgress = useCallback(() => {
    const fresh = resetProgress();
    setProgress(fresh);
    setResetModalOpen(false);
  }, []);

  const selectLesson = useCallback((lessonId) => {
    setCurrentLessonId(lessonId);
    setActiveView('workspace');
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const applyDiagnosticResults = useCallback((answers) => {
    const result = evaluateDiagnostic(answers);
    updateAndSave(prev => ({
      ...prev,
      diagnosticResult: result
    }));
    setDiagnosticOpen(false);
  }, [updateAndSave]);

  // Derived metrics
  const metrics = useMemo(() => {
    return computeProgressMetrics(progress.completedLessons, progress.manualOverrides);
  }, [progress.completedLessons, progress.manualOverrides]);

  const curriculumStats = useMemo(() => {
    return getCurriculumMetrics();
  }, []);

  const recommendedLesson = useMemo(() => {
    return getRecommendedNextLesson(
      progress.completedLessons,
      progress.manualOverrides,
      progress.reviewQueue
    );
  }, [progress.completedLessons, progress.manualOverrides, progress.reviewQueue]);

  const checkUnlocked = useCallback((lessonId) => {
    return isLessonUnlocked(
      lessonId,
      progress.completedLessons,
      progress.manualOverrides,
      progress.diagnosticResult
    );
  }, [progress.completedLessons, progress.manualOverrides, progress.diagnosticResult]);

  const contextValue = {
    progress,
    metrics,
    curriculumStats,
    recommendedLesson,
    activeView,
    setActiveView,
    currentLessonId,
    setCurrentLessonId,
    activeCapstoneId,
    setActiveCapstoneId,
    filters,
    setFilters,
    diagnosticOpen,
    setDiagnosticOpen,
    resetModalOpen,
    setResetModalOpen,
    exportModalOpen,
    setExportModalOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    selectLesson,
    completeLesson,
    toggleBookmark,
    addToReviewQueue,
    removeFromReviewQueue,
    saveDraft,
    manualUnlockLesson,
    toggleTheme,
    resetAllProgress,
    applyDiagnosticResults,
    checkUnlocked
  };

  return (
    <AcademyContext.Provider value={contextValue}>
      {children}
    </AcademyContext.Provider>
  );
}

export function useAcademy() {
  const ctx = useContext(AcademyContext);
  if (!ctx) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return ctx;
}
