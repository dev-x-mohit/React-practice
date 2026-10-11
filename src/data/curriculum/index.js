// Master Curriculum Index
import { phase0 } from './phase0_js.js';
import { phase1 } from './phase1_foundations.js';
import { phase2 } from './phase2_state_forms.js';
import { phase3 } from './phase3_hooks.js';
import { phase4 } from './phase4_internals.js';
import { phase5 } from './phase5_routing.js';
import { phase6 } from './phase6_api_query.js';
import { phase7 } from './phase7_state_mgmt.js';
import { phase8 } from './phase8_styling_a11y.js';
import { phase9 } from './phase9_typescript.js';
import { phase10 } from './phase10_performance.js';
import { phase11 } from './phase11_testing.js';
import { phase12 } from './phase12_security.js';
import { phase13 } from './phase13_advanced.js';
import { phase14 } from './phase14_native.js';
import { phase15 } from './phase15_capstones.js';
import { diagnosticQuestions, evaluateDiagnostic } from './diagnostic_questions.js';

export const allPhases = [
  phase0,
  phase1,
  phase2,
  phase3,
  phase4,
  phase5,
  phase6,
  phase7,
  phase8,
  phase9,
  phase10,
  phase11,
  phase12,
  phase13,
  phase14,
  phase15
];

export { diagnosticQuestions, evaluateDiagnostic };

// Flatten all lessons across phases 0 to 14
export function getAllLessons() {
  const lessons = [];
  for (const phase of allPhases) {
    if (phase.lessons) {
      for (const lesson of phase.lessons) {
        lessons.push({ ...lesson, phaseId: phase.id, phaseTitle: phase.title });
      }
    }
  }
  return lessons;
}

// Find specific lesson by its unique ID
export function getLessonById(lessonId) {
  for (const phase of allPhases) {
    if (phase.lessons) {
      const found = phase.lessons.find(l => l.id === lessonId);
      if (found) {
        return { ...found, phaseId: phase.id, phaseTitle: phase.title };
      }
    }
  }
  return null;
}

// Find phase by ID
export function getPhaseById(phaseId) {
  return allPhases.find(p => p.id === phaseId) || null;
}

// Get sequential next lesson
export function getNextLesson(currentLessonId) {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentLessonId);
  if (idx !== -1 && idx < all.length - 1) {
    return all[idx + 1];
  }
  return null;
}

// Get sequential previous lesson
export function getPrevLesson(currentLessonId) {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentLessonId);
  if (idx > 0) {
    return all[idx - 1];
  }
  return null;
}

// Compute curriculum summary metrics
export function getCurriculumMetrics() {
  const allLessons = getAllLessons();
  const totalCapstones = phase15.capstones ? phase15.capstones.length : 0;
  const totalHours = allPhases.reduce((acc, p) => acc + (p.estimatedHours || 0), 0);

  return {
    totalPhases: allPhases.length,
    totalLessons: allLessons.length,
    totalCapstones,
    totalHours,
    beginnerLessons: allLessons.filter(l => l.difficulty === 'Beginner').length,
    intermediateLessons: allLessons.filter(l => l.difficulty === 'Intermediate').length,
    advancedLessons: allLessons.filter(l => l.difficulty === 'Advanced').length
  };
}
