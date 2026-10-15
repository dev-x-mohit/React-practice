// Adaptive Learning & Unlock Engine
import { allPhases, getAllLessons, getLessonById } from '../data/curriculum/index.js';

export function isLessonUnlocked(lessonId, completedLessons = {}, manualOverrides = {}, diagnosticResult = null) {
  // 1. Manual override always grants unlock
  if (manualOverrides[lessonId]) {
    return true;
  }

  const lesson = getLessonById(lessonId);
  if (!lesson) return false;

  // 2. Phase 0 and Phase 1 are always unlocked for exploration
  if (lesson.phaseId === 'phase-0' || lesson.phaseId === 'phase-1') {
    return true;
  }

  // 3. Diagnostic placement: if diagnostic placed student at Advanced or Intermediate, unlock corresponding phases
  if (diagnosticResult) {
    if (diagnosticResult.placementLevel === 'Advanced Practitioner') {
      return true; // Full unlocked access
    }
    if (diagnosticResult.placementLevel === 'Intermediate Developer') {
      const intermediatePhases = ['phase-0', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-5', 'phase-6'];
      if (intermediatePhases.includes(lesson.phaseId)) {
        return true;
      }
    }
  }

  // 4. Prerequisites check: all prerequisite lesson IDs must be completed or overridden
  if (lesson.prerequisites && lesson.prerequisites.length > 0) {
    const allPrereqsMet = lesson.prerequisites.every(pId => {
      return Boolean(completedLessons[pId] || manualOverrides[pId]);
    });
    if (!allPrereqsMet) return false;
  }

  // 5. Phase-level threshold: Phase N requires >= 60% completion of Phase N-1
  const phaseIndex = allPhases.findIndex(p => p.id === lesson.phaseId);
  if (phaseIndex <= 1) return true; // phase-0 and phase-1 are free

  const prevPhase = allPhases[phaseIndex - 1];
  if (!prevPhase || !prevPhase.lessons || prevPhase.lessons.length === 0) return true;

  const prevCompletedCount = prevPhase.lessons.filter(l => Boolean(completedLessons[l.id] || manualOverrides[l.id])).length;
  const prevCompletionPct = (prevCompletedCount / prevPhase.lessons.length) * 100;

  return prevCompletionPct >= 60;
}

export function computeProgressMetrics(completedLessons = {}, manualOverrides = {}) {
  const allLessons = getAllLessons();
  const total = allLessons.length;
  let completedCount = 0;

  const phaseProgress = {};

  for (const phase of allPhases) {
    const phaseLessons = phase.lessons || [];
    const count = phaseLessons.filter(l => Boolean(completedLessons[l.id] || manualOverrides[l.id])).length;
    const pct = phaseLessons.length > 0 ? Math.round((count / phaseLessons.length) * 100) : 0;

    phaseProgress[phase.id] = {
      completed: count,
      total: phaseLessons.length,
      percentage: pct
    };

    completedCount += count;
  }

  const overallPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    totalLessons: total,
    completedLessons: completedCount,
    overallPercentage,
    phaseProgress
  };
}

export function getRecommendedNextLesson(completedLessons = {}, manualOverrides = {}, reviewQueue = []) {
  // Priority 1: High priority item in review queue
  if (reviewQueue && reviewQueue.length > 0) {
    const topReview = reviewQueue[0];
    const lesson = getLessonById(topReview.lessonId);
    if (lesson) {
      return {
        lesson,
        reason: 'Recommended for Review: ' + (topReview.reason || 'Reinforce concept')
      };
    }
  }

  // Priority 2: Next incomplete unlocked lesson in curriculum
  const allLessons = getAllLessons();
  for (const lesson of allLessons) {
    const isDone = Boolean(completedLessons[lesson.id] || manualOverrides[lesson.id]);
    if (!isDone) {
      const unlocked = isLessonUnlocked(lesson.id, completedLessons, manualOverrides);
      if (unlocked) {
        return {
          lesson,
          reason: `Next up in ${lesson.phaseTitle}`
        };
      }
    }
  }

  // Default to first lesson if everything is completed or locked
  return {
    lesson: allLessons[0],
    reason: 'Start from beginning'
  };
}
