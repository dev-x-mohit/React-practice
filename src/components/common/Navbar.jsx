import React from 'react';
import {
  Code2,
  Menu,
  Sun,
  Moon,
  Flame,
  Download,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { getLessonById } from '../../data/curriculum/index';

export function Navbar() {
  const {
    activeView,
    setActiveView,
    currentLessonId,
    progress,
    metrics,
    toggleTheme,
    setDiagnosticOpen,
    setResetModalOpen,
    setExportModalOpen,
    setMobileSidebarOpen
  } = useAcademy();

  const currentLesson = getLessonById(currentLessonId);

  // Compute clean breadcrumb text
  const getBreadcrumb = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'curriculum':
        return 'Curriculum Directory';
      case 'workspace':
        return currentLesson ? `${currentLesson.phaseTitle} / ${currentLesson.title}` : 'Practice Studio';
      case 'capstones':
        return 'Portfolio Capstones';
      case 'review':
        return 'Review Queue';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="header-container">
        {/* Left Section: Mobile Menu, Brand & Location */}
        <div className="header-left">
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="header-brand" onClick={() => setActiveView('dashboard')}>
            <div className="header-brand-icon">
              <Code2 size={18} />
            </div>
            <div className="header-brand-copy">
              <span className="header-brand-title">React Practice Academy</span>
              <span className="header-brand-badge">MCA & MERN</span>
            </div>
          </div>

          <div className="header-breadcrumb-divider" aria-hidden="true">
            <ChevronRight size={14} />
          </div>

          <div className="header-breadcrumb">
            <span className="breadcrumb-current">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right Section: Stats, Theme & Actions */}
        <div className="header-right">
          {/* Active Streak */}
          <div
            className="stat-badge streak-badge"
            title={`Active learning streak: ${progress.streak.current} days (Best: ${progress.streak.best} days)`}
          >
            <Flame size={14} className="streak-icon" />
            <span className="stat-value tabular-nums">{progress.streak.current}d</span>
          </div>

          {/* Progress Pill */}
          <div
            className="stat-badge progress-badge"
            title={`${metrics.completedLessons} of ${metrics.totalLessons} lessons completed`}
          >
            <div className="progress-track" aria-hidden="true">
              <div
                className="progress-fill"
                style={{ width: `${metrics.overallPercentage}%` }}
              />
            </div>
            <span className="stat-value tabular-nums">{metrics.overallPercentage}%</span>
          </div>

          {/* Diagnostic Button */}
          <button
            className="header-action-btn highlight"
            onClick={() => setDiagnosticOpen(true)}
            title="Take diagnostic placement test"
          >
            <Sparkles size={14} />
            <span className="btn-text-desktop">Diagnostic</span>
          </button>

          {/* Theme Switcher */}
          <button
            className="header-action-btn icon-only"
            onClick={toggleTheme}
            aria-label={`Switch to ${progress.theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${progress.theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {progress.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Backup / Export */}
          <button
            className="header-action-btn icon-only"
            onClick={() => setExportModalOpen(true)}
            aria-label="Backup or import progress JSON"
            title="Backup or restore progress"
          >
            <Download size={16} />
          </button>

          {/* Reset progress */}
          <button
            className="header-action-btn icon-only danger-hover"
            onClick={() => setResetModalOpen(true)}
            aria-label="Reset progress"
            title="Reset progress to day one"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
