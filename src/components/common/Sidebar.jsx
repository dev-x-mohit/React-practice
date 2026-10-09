import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { allPhases } from '../../data/curriculum/index';

export function Sidebar() {
  const {
    activeView,
    setActiveView,
    progress,
    metrics,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    setDiagnosticOpen,
    checkUnlocked
  } = useAcademy();

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'workspace', label: 'Practice Studio', icon: Terminal },
    { id: 'capstones', label: 'Capstones', icon: Trophy, count: 10 },
    { id: 'review', label: 'Review Queue', icon: RotateCcw, count: progress.reviewQueue.length }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setMobileSidebarOpen(false);
  };

  const handlePhaseClick = (phase) => {
    setActiveView('curriculum');
    setMobileSidebarOpen(false);
    // If phase has lessons, optionally scroll or select
    const targetElement = document.getElementById(`phase-section-${phase.id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${mobileSidebarOpen ? 'open' : ''}`} aria-label="Main Navigation">
        {/* Mobile Header with Close Button */}
        <div className="sidebar-mobile-header">
          <span className="sidebar-mobile-title">Navigation</span>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary View Navigation */}
        <div className="sidebar-section">
          <nav className="sidebar-nav">
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={16} className="nav-item-icon" />
                  <span className="nav-item-label">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="nav-item-count">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Curriculum Roadmap Header & Tree */}
        <div className="sidebar-section roadmap-section">
          <div className="sidebar-section-header">
            <span className="sidebar-section-label">Curriculum Roadmap</span>
            <span className="sidebar-section-metric">{metrics.completedLessons}/{metrics.totalLessons}</span>
          </div>

          <div className="phase-tree-list">
            {allPhases.map((phase, idx) => {
              const phaseStats = metrics.phaseProgress[phase.id] || { completed: 0, total: 0, percentage: 0 };
              const isComplete = phaseStats.total > 0 && phaseStats.completed === phaseStats.total;
              const firstLessonId = phase.lessons?.[0]?.id || 'p0-l1';
              const isUnlocked = phase.id === 'phase-0' || phase.id === 'phase-1' || phaseStats.completed > 0 || checkUnlocked(firstLessonId);

              return (
                <button
                  key={phase.id}
                  className={`phase-tree-item ${isComplete ? 'complete' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => handlePhaseClick(phase)}
                  title={phase.title}
                >
                  <span className="phase-dot" aria-hidden="true">
                    {isComplete ? (
                      <CheckCircle2 size={12} className="text-success" />
                    ) : !isUnlocked ? (
                      <Lock size={10} className="text-muted" />
                    ) : (
                      <span className="phase-dot-inner" />
                    )}
                  </span>
                  <span className="phase-tree-name">P{idx} · {phase.badge || phase.title}</span>
                  <span className="phase-tree-stat">{phaseStats.completed}/{phaseStats.total}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-footer-btn"
            onClick={() => {
              setDiagnosticOpen(true);
              setMobileSidebarOpen(false);
            }}
          >
            <Sparkles size={14} className="text-accent" />
            <span>Placement Diagnostic</span>
          </button>
          <div className="sidebar-version-tag">React 19 Academy · MCA Track</div>
        </div>
      </aside>
    </>
  );
}
