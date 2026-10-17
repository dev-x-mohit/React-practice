import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  HelpCircle
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { allPhases } from '../../data/curriculum/index';

export function CurriculumView() {
  const {
    progress,
    metrics,
    filters,
    setFilters,
    selectLesson,
    toggleBookmark,
    manualUnlockLesson,
    checkUnlocked
  } = useAcademy();

  const [expandedPhases, setExpandedPhases] = useState(() => {
    // Expand Phase 0 and Phase 1 by default
    return { 'phase-0': true, 'phase-1': true };
  });

  const togglePhaseExpand = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Filtered lesson counts & phase visibility
  const filteredCurriculum = useMemo(() => {
    const q = filters.search.toLowerCase().trim();

    return allPhases.map(phase => {
      const lessons = phase.lessons || [];
      const matchingLessons = lessons.filter(lesson => {
        // 1. Search text filter
        if (q) {
          const matchTitle = lesson.title.toLowerCase().includes(q);
          const matchDesc = lesson.explanation.toLowerCase().includes(q);
          const matchSlug = lesson.slug.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSlug) return false;
        }

        // 2. Difficulty filter
        if (filters.difficulty !== 'all' && lesson.difficulty !== filters.difficulty) {
          return false;
        }

        // 3. Status filter
        const isCompleted = Boolean(progress.completedLessons[lesson.id] || progress.manualOverrides[lesson.id]);
        const isBookmarked = progress.bookmarks.includes(lesson.id);
        const isUnlocked = checkUnlocked(lesson.id);

        if (filters.status === 'completed' && !isCompleted) return false;
        if (filters.status === 'incomplete' && isCompleted) return false;
        if (filters.status === 'bookmarked' && !isBookmarked) return false;
        if (filters.status === 'unlocked' && !isUnlocked) return false;
        if (filters.status === 'locked' && isUnlocked) return false;

        return true;
      });

      return {
        ...phase,
        filteredLessons: matchingLessons,
        hasMatches: matchingLessons.length > 0 || (phase.id === 'phase-15' && filters.difficulty === 'all')
      };
    }).filter(phase => {
      if (filters.phase !== 'all' && phase.id !== filters.phase) {
        return false;
      }
      return phase.hasMatches;
    });
  }, [filters, progress, checkUnlocked]);

  return (
    <div className="curriculum-container">
      {/* Header & Filter Controls */}
      <section className="curriculum-header">
        <div className="curriculum-title-group">
          <h1 className="page-title">Curriculum Directory</h1>
          <p className="page-subtitle">
            Explore 16 structured phases covering 180+ interactive lessons, test-driven coding challenges, and portfolio capstones.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="filter-toolbar">
          {/* Search Box */}
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              id="curriculum-search-input"
              type="text"
              placeholder="Search concepts, hooks, syntax..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
            {filters.search && (
              <button
                className="search-clear-btn"
                onClick={() => setFilters(f => ({ ...f, search: '' }))}
              >
                ×
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="filter-dropdown">
            <label htmlFor="filter-difficulty" className="sr-only">Difficulty</label>
            <select
              id="filter-difficulty"
              value={filters.difficulty}
              onChange={(e) => setFilters(f => ({ ...f, difficulty: e.target.value }))}
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="filter-dropdown">
            <label htmlFor="filter-status" className="sr-only">Status</label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="incomplete">Incomplete Only</option>
              <option value="completed">Completed Only</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="unlocked">Unlocked Only</option>
            </select>
          </div>

          {/* Phase Select */}
          <div className="filter-dropdown">
            <label htmlFor="filter-phase" className="sr-only">Phase</label>
            <select
              id="filter-phase"
              value={filters.phase}
              onChange={(e) => setFilters(f => ({ ...f, phase: e.target.value }))}
            >
              <option value="all">All 16 Phases</option>
              {allPhases.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Phases & Lessons Accordion List */}
      <div className="curriculum-list">
        {filteredCurriculum.length === 0 ? (
          <div className="empty-filter-state">
            <HelpCircle size={40} className="text-muted" />
            <h3>No lessons match your current filters</h3>
            <p>Try resetting search keywords or broadening difficulty filters.</p>
            <button
              className="btn btn-outline"
              onClick={() => setFilters({ search: '', difficulty: 'all', phase: 'all', status: 'all' })}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCurriculum.map(phase => {
            const isExpanded = Boolean(expandedPhases[phase.id]);
            const stats = metrics.phaseProgress[phase.id] || { completed: 0, total: 0, percentage: 0 };

            return (
              <div key={phase.id} className="phase-accordion-item">
                {/* Accordion Header */}
                <div
                  className="phase-accordion-header"
                  onClick={() => togglePhaseExpand(phase.id)}
                >
                  <div className="phase-header-left">
                    <span className="phase-tag">{phase.badge}</span>
                    <div>
                      <h3 className="phase-title">{phase.title}</h3>
                      <p className="phase-sub">{phase.description}</p>
                    </div>
                  </div>

                  <div className="phase-header-right">
                    <div className="phase-progress-summary">
                      <span className="progress-fraction">{stats.completed} / {stats.total}</span>
                      <div className="mini-progress-track">
                        <div
                          className="mini-progress-fill"
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                      <span className="progress-percent">{stats.percentage}%</span>
                    </div>

                    <button
                      className="accordion-toggle-btn"
                      aria-label={isExpanded ? 'Collapse Phase' : 'Expand Phase'}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Accordion Content (Lesson Cards) */}
                {isExpanded && (
                  <div className="phase-lessons-container">
                    {phase.lessons ? (
                      phase.filteredLessons.map(lesson => {
                        const isCompleted = Boolean(progress.completedLessons[lesson.id] || progress.manualOverrides[lesson.id]);
                        const isUnlocked = checkUnlocked(lesson.id);
                        const isBookmarked = progress.bookmarks.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className={`lesson-row-card ${isCompleted ? 'completed' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
                          >
                            <div className="lesson-left">
                              <div className="lesson-status-icon">
                                {isCompleted ? (
                                  <CheckCircle2 size={18} className="text-emerald" />
                                ) : isUnlocked ? (
                                  <div className="unlocked-dot" />
                                ) : (
                                  <Lock size={16} className="text-muted" />
                                )}
                              </div>

                              <div className="lesson-content">
                                <div className="lesson-title-row">
                                  <h4 className="lesson-title">{lesson.title}</h4>
                                  <span className={`difficulty-badge ${lesson.difficulty.toLowerCase()}`}>
                                    {lesson.difficulty}
                                  </span>
                                  <span className="duration-tag">
                                    <Clock size={12} />
                                    {lesson.estimatedDuration}
                                  </span>
                                </div>
                                <p className="lesson-explanation-snippet">
                                  {lesson.explanation.slice(0, 160)}...
                                </p>
                              </div>
                            </div>

                            <div className="lesson-actions">
                              <button
                                className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark for later'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(lesson.id);
                                }}
                              >
                                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                              </button>

                              {!isUnlocked && (
                                <button
                                  className="btn btn-ghost btn-small override-btn"
                                  title="I know this concept (manual unlock)"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    manualUnlockLesson(lesson.id);
                                  }}
                                >
                                  <Unlock size={14} />
                                  <span>Unlock</span>
                                </button>
                              )}

                              <button
                                className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'} btn-small`}
                                onClick={() => selectLesson(lesson.id)}
                              >
                                {isCompleted ? (
                                  <span>Review Code</span>
                                ) : (
                                  <>
                                    <Play size={14} fill="currentColor" />
                                    <span>Practice</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="capstones-phase-preview">
                        <p>10 Comprehensive Industry Capstones available in the Capstones tab.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
