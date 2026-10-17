import React from 'react';
import {
  Play,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  Lock,
  Clock
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { allPhases, getLessonById } from '../../data/curriculum/index';

export function DashboardView() {
  const {
    progress,
    metrics,
    curriculumStats,
    recommendedLesson,
    selectLesson,
    setActiveView,
    setDiagnosticOpen
  } = useAcademy();

  const nextLesson = recommendedLesson.lesson;

  // Retrieve recently completed lessons from progress.completedLessons sorted by timestamp
  const recentCompletions = Object.entries(progress.completedLessons)
    .sort(([, a], [, b]) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
    .slice(0, 4)
    .map(([lessonId, data]) => ({
      lesson: getLessonById(lessonId),
      data
    }))
    .filter(item => Boolean(item.lesson));

  return (
    <div className="dashboard-layout">
      {/* Primary Content Column */}
      <div className="dashboard-main-col">
        {/* Page Heading & Brief Supporting Text */}
        <header className="page-header">
          <h1 className="page-title">React Practice Academy</h1>
          <p className="page-subtitle">
            An engineering practice workspace for MERN developers and MCA students. Master React 19 fundamentals, concurrent rendering, and real-world architectures through executable code challenges.
          </p>
        </header>

        {/* Continue Learning Banner */}
        {nextLesson && (
          <section className="continue-learning-section" aria-labelledby="continue-learning-heading">
            <div className="section-label-row">
              <span className="section-eyebrow">CONTINUE LEARNING</span>
              <span className="section-tag">{recommendedLesson.reason}</span>
            </div>

            <div className="continue-card">
              <div className="continue-card-content">
                <span className="continue-phase-label">{nextLesson.phaseTitle}</span>
                <h2 id="continue-learning-heading" className="continue-title">{nextLesson.title}</h2>
                <p className="continue-description">{nextLesson.explanation.slice(0, 180)}...</p>

                <div className="continue-meta-row">
                  <span className={`badge-pill ${nextLesson.difficulty.toLowerCase()}`}>
                    {nextLesson.difficulty}
                  </span>
                  <span className="meta-item">
                    <Clock size={13} />
                    <span>{nextLesson.estimatedDuration}</span>
                  </span>
                  <span className="meta-item">
                    <CheckCircle2 size={13} />
                    <span>{nextLesson.testCases?.length || 0} assertions</span>
                  </span>
                </div>
              </div>

              <div className="continue-card-action">
                <button
                  id="dashboard-continue-btn"
                  className="btn btn-primary btn-large"
                  onClick={() => selectLesson(nextLesson.id)}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Open Practice Studio</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Course Progress Strip */}
        <section className="progress-strip-section" aria-label="Course Overview Metrics">
          <div className="progress-strip-card">
            <div className="progress-stat-item">
              <span className="stat-label">Course Completion</span>
              <div className="stat-num-row">
                <span className="stat-num tabular-nums">{metrics.overallPercentage}%</span>
                <span className="stat-detail tabular-nums">({metrics.completedLessons}/{metrics.totalLessons})</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${metrics.overallPercentage}%` }}
                />
              </div>
            </div>

            <div className="stat-divider" aria-hidden="true" />

            <div className="progress-stat-item">
              <span className="stat-label">Curriculum Depth</span>
              <div className="stat-num-row">
                <span className="stat-num tabular-nums">{curriculumStats.totalPhases}</span>
                <span className="stat-detail">Phases</span>
              </div>
              <span className="stat-subtext tabular-nums">{curriculumStats.totalHours} estimated study hours</span>
            </div>

            <div className="stat-divider" aria-hidden="true" />

            <div className="progress-stat-item">
              <span className="stat-label">Capstones Ready</span>
              <div className="stat-num-row">
                <span className="stat-num tabular-nums">{curriculumStats.totalCapstones}</span>
                <span className="stat-detail">Projects</span>
              </div>
              <span className="stat-subtext">Portfolio-ready specs</span>
            </div>
          </div>
        </section>

        {/* Recently Completed / Studied */}
        {recentCompletions.length > 0 && (
          <section className="recent-activity-section" aria-labelledby="recent-activity-heading">
            <div className="section-header-compact">
              <h2 id="recent-activity-heading" className="section-heading">Recently Practiced</h2>
              <button className="text-link-btn" onClick={() => setActiveView('curriculum')}>
                View all lessons
              </button>
            </div>

            <div className="recent-cards-list">
              {recentCompletions.map(({ lesson, data }) => (
                <div key={lesson.id} className="recent-card-row">
                  <div className="recent-card-left">
                    <CheckCircle2 size={16} className="text-success" />
                    <div className="recent-card-title-group">
                      <span className="recent-lesson-title">{lesson.title}</span>
                      <span className="recent-lesson-phase">{lesson.phaseTitle}</span>
                    </div>
                  </div>
                  <div className="recent-card-right">
                    <span className="recent-date tabular-nums">
                      {new Date(data.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => selectLesson(lesson.id)}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curriculum Overview (Roadmap) */}
        <section className="curriculum-overview-section" aria-labelledby="curriculum-heading">
          <div className="section-header-compact">
            <div>
              <h2 id="curriculum-heading" className="section-heading">Curriculum Overview</h2>
              <p className="section-description">16 structured phases covering foundational JavaScript through production React 19.</p>
            </div>
            <button className="btn btn-secondary btn-small" onClick={() => setActiveView('curriculum')}>
              Directory View
            </button>
          </div>

          <div className="phases-table-card">
            {allPhases.map((phase, idx) => {
              const stats = metrics.phaseProgress[phase.id] || { completed: 0, total: 0, percentage: 0 };
              const isPhaseUnlocked = phase.id === 'phase-0' || phase.id === 'phase-1' || stats.completed > 0 || (idx > 0 && metrics.phaseProgress[allPhases[idx - 1].id]?.percentage >= 60) || progress.diagnosticResult?.placementLevel === 'Advanced Practitioner';
              const isCompleted = stats.total > 0 && stats.completed === stats.total;

              return (
                <div
                  key={phase.id}
                  className={`phase-table-row ${isCompleted ? 'completed' : ''} ${!isPhaseUnlocked ? 'locked' : ''}`}
                  onClick={() => {
                    if (phase.lessons && phase.lessons.length > 0) {
                      selectLesson(phase.lessons[0].id);
                    } else if (phase.id === 'phase-15') {
                      setActiveView('capstones');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (phase.lessons?.[0]) selectLesson(phase.lessons[0].id);
                    }
                  }}
                >
                  <div className="phase-cell-title">
                    <span className="phase-index-badge tabular-nums">{idx}</span>
                    <div>
                      <div className="phase-title-line">
                        <span className="phase-name">{phase.title}</span>
                        {!isPhaseUnlocked && <Lock size={12} className="text-secondary" />}
                        {isCompleted && <CheckCircle2 size={13} className="text-success" />}
                      </div>
                      <span className="phase-summary-text">{phase.description.slice(0, 110)}...</span>
                    </div>
                  </div>

                  <div className="phase-cell-meta">
                    <span className="phase-lesson-count tabular-nums">
                      {phase.lessons ? `${phase.lessons.length} lessons` : `${phase.capstones?.length || 0} capstones`}
                    </span>
                    <span className="phase-hours tabular-nums">{phase.estimatedHours}h</span>
                  </div>

                  <div className="phase-cell-progress">
                    <div className="phase-mini-bar">
                      <div
                        className="phase-mini-fill"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <span className="phase-pct tabular-nums">{stats.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right Supporting Sidebar (320-344px) */}
      <aside className="dashboard-sidebar-col" aria-label="Study Metrics and Quick Actions">
        {/* Active Learning Streak Widget */}
        <div className="widget-card">
          <div className="widget-header">
            <span className="widget-title">Study Streak</span>
            <Flame size={15} className="text-warning" />
          </div>
          <div className="streak-display-row">
            <span className="streak-large-num tabular-nums">{progress.streak.current}</span>
            <div className="streak-text-group">
              <span className="streak-unit">Days Active</span>
              <span className="streak-best tabular-nums">Personal Best: {progress.streak.best}d</span>
            </div>
          </div>
          <p className="widget-subtext">
            Log into the practice studio and complete at least one exercise daily to maintain active memory consolidation.
          </p>
        </div>

        {/* Diagnostic Assessment Widget */}
        <div className="widget-card">
          <div className="widget-header">
            <span className="widget-title">Placement Assessment</span>
            <Sparkles size={15} className="text-accent" />
          </div>
          {progress.diagnosticResult ? (
            <div className="diagnostic-widget-body">
              <div className="diagnostic-tier-pill">
                <span>{progress.diagnosticResult.placementLevel}</span>
              </div>
              <p className="widget-subtext">
                Scored <strong className="tabular-nums">{progress.diagnosticResult.score}/{progress.diagnosticResult.total}</strong> ({progress.diagnosticResult.percentage}%). Advanced phase unlock overrides are active.
              </p>
              <button
                className="btn btn-secondary btn-small btn-block mt-2"
                onClick={() => setDiagnosticOpen(true)}
              >
                Retake Assessment
              </button>
            </div>
          ) : (
            <div className="diagnostic-widget-body">
              <p className="widget-subtext">
                Already experienced with React and JavaScript fundamentals? Take the 10-question placement quiz to tailor your starting point.
              </p>
              <button
                className="btn btn-secondary btn-small btn-block mt-2"
                onClick={() => setDiagnosticOpen(true)}
              >
                Start Diagnostic
              </button>
            </div>
          )}
        </div>

        {/* Spaced Repetition Review Queue Widget */}
        <div className="widget-card">
          <div className="widget-header">
            <span className="widget-title">Review Queue</span>
            <RotateCcw size={15} className="text-secondary" />
          </div>
          <div className="queue-metric-row">
            <span className="queue-large-num tabular-nums">{progress.reviewQueue.length}</span>
            <div className="queue-text-group">
              <span className="queue-label">Concepts Queued</span>
              <span className="queue-subtext">Reinforce weak spots</span>
            </div>
          </div>
          {progress.reviewQueue.length > 0 ? (
            <button
              className="btn btn-primary btn-small btn-block mt-2"
              onClick={() => setActiveView('review')}
            >
              Open Review Queue
            </button>
          ) : (
            <p className="widget-subtext mt-1 text-success">
              Queue clear. Any failed practice tests will be flagged here automatically.
            </p>
          )}
        </div>

        {/* Capstone Portfolio Milestone Widget */}
        <div className="widget-card">
          <div className="widget-header">
            <span className="widget-title">Portfolio Projects</span>
            <Award size={15} className="text-secondary" />
          </div>
          <p className="widget-subtext">
            10 production capstones designed for MCA project portfolios and technical engineering interviews.
          </p>
          <div className="widget-action-footer mt-2">
            <button
              className="btn btn-secondary btn-small btn-block"
              onClick={() => setActiveView('capstones')}
            >
              Explore Capstones
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
