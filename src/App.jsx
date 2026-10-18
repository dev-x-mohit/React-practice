import React from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { CapstonesView } from './components/capstones/CapstonesView';
import { ReviewQueueView } from './components/review/ReviewQueueView';
import { DiagnosticModal } from './components/modals/DiagnosticModal';
import { ExportImportModal } from './components/modals/ExportImportModal';
import { ResetModal } from './components/modals/ResetModal';

function AcademyApp() {
  const { activeView } = useAcademy();

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <div className="app-main-area">
          <main className="main-content" id="main-content">
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'curriculum' && <CurriculumView />}
            {activeView === 'workspace' && <WorkspaceView />}
            {activeView === 'capstones' && <CapstonesView />}
            {activeView === 'review' && <ReviewQueueView />}
          </main>

          <footer className="academy-footer">
            <div className="footer-content">
              <span className="footer-brand">React Practice Academy</span>
              <span className="footer-meta">MERN & MCA Senior Engineering Track · 100% Client-Side Sandbox</span>
              <div className="footer-status-pill">
                <span className="status-dot-pulse" aria-hidden="true" />
                <span>React 19 System Active</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <DiagnosticModal />
      <ExportImportModal />
      <ResetModal />
    </div>
  );
}

export default function App() {
  return (
    <AcademyProvider>
      <AcademyApp />
    </AcademyProvider>
  );
}
