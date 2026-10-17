import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Play,
  Code2
} from 'lucide-react';
import { phase15 } from '../../data/curriculum/phase15_capstones';
import { runStudentCode } from '../../services/codeRunner';
import { CodeEditor } from '../common/CodeEditor';

export function CapstonesView() {
  const capstones = phase15.capstones || [];

  const [selectedCapstoneId, setSelectedCapstoneId] = useState(capstones[0]?.id || 'capstone-1');
  const activeCapstone = capstones.find(c => c.id === selectedCapstoneId) || capstones[0];

  const [code, setCode] = useState(activeCapstone?.starterCode || '');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleSelectCapstone = (c) => {
    setSelectedCapstoneId(c.id);
    setCode(c.starterCode || '');
    setTestResults(null);
  };

  const handleRunCapstoneTests = async () => {
    if (!activeCapstone) return;
    setIsRunning(true);
    try {
      const res = await runStudentCode(code, activeCapstone.testCases || [], activeCapstone.starterCode || '');
      setTestResults(res);
    } catch (err) {
      setTestResults({
        allPassed: false,
        syntaxError: { type: 'Execution Error', message: err.message || String(err) },
        passedCount: 0,
        totalCount: activeCapstone.testCases?.length || 0,
        results: (activeCapstone.testCases || []).map(tc => ({ name: tc.name, passed: false, error: err.message })),
        logs: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="capstones-container">
      {/* Header */}
      <section className="capstones-header">
        <div className="capstones-title-group">
          <div className="hero-badge">
            <Trophy size={16} />
            <span>Portfolio Capstone Engineering</span>
          </div>
          <h1 className="page-title">10 Production Capstone Projects</h1>
          <p className="page-subtitle">
            Progressive portfolio pieces designed for MERN developers and MCA graduates to demonstrate software engineering mastery to technical interviewers.
          </p>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="capstones-split-layout">
        {/* Left List of 10 Capstones */}
        <div className="capstones-sidebar-list">
          {capstones.map((c, idx) => {
            const isSelected = c.id === selectedCapstoneId;
            return (
              <div
                key={c.id}
                className={`capstone-nav-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectCapstone(c)}
              >
                <div className="capstone-nav-top">
                  <span className="capstone-num">#{idx + 1}</span>
                  <span className={`difficulty-badge ${c.difficulty.toLowerCase()}`}>
                    {c.difficulty}
                  </span>
                </div>
                <h4 className="capstone-nav-title">{c.title}</h4>
                <div className="capstone-nav-meta">
                  <span>{c.phaseMilestone}</span>
                  <span>•</span>
                  <span>{c.estimatedHours}h</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Capstone Specification & Runner */}
        <div className="capstone-detail-pane">
          {activeCapstone && (
            <>
              <div className="capstone-spec-header">
                <span className="milestone-badge">{activeCapstone.phaseMilestone} Milestone</span>
                <h2 className="spec-title">{activeCapstone.title}</h2>
                <h3 className="spec-subtitle">{activeCapstone.subtitle}</h3>
                <p className="spec-desc">{activeCapstone.description}</p>
              </div>

              {/* Objectives */}
              <div className="capstone-card objectives-card">
                <h4 className="card-heading">Architectural Objectives</h4>
                <ul className="objectives-list">
                  {activeCapstone.objectives?.map((obj, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements & User Stories */}
              {activeCapstone.requirements && (
                <div className="capstone-card requirements-card">
                  <h4 className="card-heading">User Stories & Technical Acceptance</h4>
                  <ul className="requirements-list">
                    {activeCapstone.requirements.userStories?.map((story, i) => (
                      <li key={i}>
                        <CheckCircle2 size={13} className="text-secondary" />
                        <span>{story}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Live Capstone Code Editor & Test Runner */}
              <div className="capstone-editor-section">
                <div className="editor-header">
                  <div className="editor-header-left">
                    <Code2 size={16} />
                    <span>CapstoneSolution.js</span>
                  </div>
                  <button
                    className="btn btn-primary btn-small"
                    disabled={isRunning}
                    onClick={handleRunCapstoneTests}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>{isRunning ? 'Verifying...' : 'Verify Capstone Tests'}</span>
                  </button>
                </div>

                <CodeEditor
                  id="capstone-code-textarea"
                  code={code}
                  onChange={setCode}
                  onRun={handleRunCapstoneTests}
                  language="javascript"
                  height="360px"
                  placeholder="// Implement your capstone project code here..."
                />

                {testResults && (
                  <div className="test-results-list mt-3">
                    {testResults.syntaxError && (
                      <div className="test-error-callout">
                        <div className="test-error-callout-header">
                          <strong>
                            {typeof testResults.syntaxError === 'object'
                              ? testResults.syntaxError.type || 'Compilation Error'
                              : 'Compilation Error'}
                            {typeof testResults.syntaxError === 'object' && testResults.syntaxError.line
                              ? ` (Line ${testResults.syntaxError.line})`
                              : ''}
                          </strong>
                        </div>
                        <div className="test-error-callout-msg">
                          {typeof testResults.syntaxError === 'object'
                            ? testResults.syntaxError.message
                            : testResults.syntaxError}
                        </div>
                      </div>
                    )}

                    {!testResults.syntaxError && testResults.results.map((res, idx) => (
                      <div
                        key={idx}
                        className={`test-result-row ${res.passed ? 'passed' : 'failed'}`}
                      >
                        <span className="result-icon">
                          {res.passed ? (
                            <CheckCircle2 size={16} className="text-success" />
                          ) : (
                            <XCircle size={16} className="text-danger" />
                          )}
                        </span>
                        <div className="result-details">
                          <span className="test-case-name">{res.name}</span>
                          {res.error && <span className="test-case-error">{res.error}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
