import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Lightbulb,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Code2,
  BookOpen,
  Sparkles,
  Terminal as TerminalIcon,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { getLessonById, getNextLesson, getPrevLesson } from '../../data/curriculum/index';
import { runStudentCode } from '../../services/codeRunner';
import { CodeEditor } from '../common/CodeEditor';
import { CodeBlock } from '../common/CodeBlock';

export function WorkspaceView() {
  const {
    currentLessonId,
    selectLesson,
    progress,
    completeLesson,
    toggleBookmark,
    addToReviewQueue,
    saveDraft,
    manualUnlockLesson
  } = useAcademy();

  const lesson = getLessonById(currentLessonId) || getLessonById('p0-l1');

  // Left panel active tab: 'concept' | 'practice' | 'quiz'
  const [activeTab, setActiveTab] = useState('concept');

  // Code editor state
  const [code, setCode] = useState(() => {
    return progress.codeDrafts[lesson?.id] || lesson?.starterCode || '// Write your code here';
  });

  // Test runner results
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Progressive hints
  const [hintIndex, setHintIndex] = useState(0);
  const [showHintsModal, setShowHintsModal] = useState(false);

  // Solution reveal
  const [showSolution, setShowSolution] = useState(false);

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCodeReadingAnswer, setShowCodeReadingAnswer] = useState(false);
  const [showDebuggingFix, setShowDebuggingFix] = useState(false);

  // Copy feedback
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Reset states when switching lessons
  useEffect(() => {
    if (lesson) {
      const saved = progress.codeDrafts[lesson.id];
      setCode(saved !== undefined ? saved : (lesson.starterCode || ''));
      setTestResults(null);
      setHintIndex(0);
      setShowHintsModal(false);
      setShowSolution(false);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setShowCodeReadingAnswer(false);
      setShowDebuggingFix(false);
      setActiveTab('concept');
    }
  }, [lesson?.id]);

  const handleResetStarter = () => {
    if (lesson?.starterCode) {
      setCode(lesson.starterCode);
      saveDraft(lesson.id, lesson.starterCode);
      setTestResults(null);
    }
  };

  const handleRunTests = async () => {
    if (!lesson) return;
    setIsRunning(true);
    try {
      const outcome = await runStudentCode(code, lesson.testCases || [], lesson.starterCode || '');
      setTestResults(outcome);

      if (outcome.allPassed) {
        completeLesson(lesson.id, 100);
      } else {
        addToReviewQueue(lesson.id, 'Test case assertion failed in practice studio');
      }
    } catch (err) {
      setTestResults({
        allPassed: false,
        syntaxError: {
          type: 'Execution Error',
          message: err.message || String(err)
        },
        passedCount: 0,
        totalCount: lesson.testCases?.length || 0,
        results: (lesson.testCases || []).map(tc => ({ name: tc.name, passed: false, error: err.message })),
        logs: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  if (!lesson) {
    return <div className="workspace-empty">Select a lesson from the curriculum directory.</div>;
  }

  const prevLesson = getPrevLesson(lesson.id);
  const nextLesson = getNextLesson(lesson.id);
  const isCompleted = Boolean(progress.completedLessons[lesson.id] || progress.manualOverrides[lesson.id]);
  const isBookmarked = progress.bookmarks.includes(lesson.id);

  return (
    <div className="workspace-container">
      {/* Workspace Top Toolbar */}
      <div className="workspace-toolbar">
        <div className="toolbar-left">
          <button
            className="nav-arrow-btn"
            disabled={!prevLesson}
            onClick={() => prevLesson && selectLesson(prevLesson.id)}
            title={prevLesson ? `Previous: ${prevLesson.title}` : 'No previous lesson'}
          >
            <ChevronLeft size={16} />
            <span className="btn-label-desktop">Previous</span>
          </button>

          <div className="current-lesson-info">
            <span className="lesson-phase-pill">{lesson.phaseTitle || lesson.phaseId}</span>
            <h2 className="current-lesson-name">{lesson.title}</h2>
          </div>

          <button
            className="nav-arrow-btn"
            disabled={!nextLesson}
            onClick={() => nextLesson && selectLesson(nextLesson.id)}
            title={nextLesson ? `Next: ${nextLesson.title}` : 'No next lesson'}
          >
            <span className="btn-label-desktop">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="toolbar-right">
          <button
            className={`toolbar-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => toggleBookmark(lesson.id)}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span className="btn-label-desktop">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            className="toolbar-btn"
            onClick={() => manualUnlockLesson(lesson.id)}
            title="Mark as known (manual override)"
          >
            <Unlock size={16} />
            <span className="btn-label-desktop">Mark as Known</span>
          </button>

          {isCompleted && (
            <div className="completed-badge-pill">
              <CheckCircle2 size={16} />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Split View Container */}
      <div className="workspace-split-view">
        {/* Left Pane: Pedagogical Guide */}
        <div className="pedagogical-pane">
          {/* Navigation Tabs */}
          <div className="pedagogical-tabs" role="tablist">
            <button
              className={`tab-btn ${activeTab === 'concept' ? 'active' : ''}`}
              onClick={() => setActiveTab('concept')}
            >
              <BookOpen size={16} />
              <span>Core Concept</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('practice')}
            >
              <TerminalIcon size={16} />
              <span>Levels & Debugging</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HelpCircle size={16} />
              <span>Comprehension Quiz</span>
            </button>
          </div>

          {/* Tab 1: Core Concept */}
          {activeTab === 'concept' && (
            <div className="pedagogical-content">
              {/* Objectives */}
              <div className="pedagogical-card objectives-card">
                <h4 className="card-heading">Learning Objectives</h4>
                <ul className="objectives-list">
                  {lesson.objectives?.map((obj, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plain English Explanation */}
              <div className="pedagogical-section">
                <h3 className="section-title">Plain English Explanation</h3>
                <p className="body-text">{lesson.explanation}</p>
              </div>

              {/* Why It Exists */}
              <div className="pedagogical-section highlight-box">
                <h4 className="box-title">
                  <Sparkles size={16} />
                  <span>Why It Exists in React</span>
                </h4>
                <p className="box-text">{lesson.whyItExists}</p>
              </div>

              {/* Syntax Rules */}
              <div className="pedagogical-section">
                <h3 className="section-title">Syntax Rules</h3>
                <div className="code-syntax-callout">
                  <code>{lesson.syntaxRules}</code>
                </div>
              </div>

              {/* Minimal Working Example */}
              <div className="pedagogical-section">
                <div className="section-header-row">
                  <h3 className="section-title">Minimal Working Example</h3>
                  <button
                    className="copy-btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(lesson.codeExample);
                      setCopiedSnippet(true);
                      setTimeout(() => setCopiedSnippet(false), 2000);
                    }}
                  >
                    {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <CodeBlock code={lesson.codeExample} language="jsx" />
              </div>

              {/* Line by line breakdown */}
              {lesson.lineByLine && (
                <div className="pedagogical-section">
                  <h4 className="section-title">Line-by-Line Breakdown</h4>
                  <ul className="line-breakdown-list">
                    {lesson.lineByLine.map((line, idx) => (
                      <li key={idx}>
                        <span className="line-bullet">{idx + 1}</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Practice Levels & Debugging */}
          {activeTab === 'practice' && (
            <div className="pedagogical-content">
              {/* Practice Levels A, B, C */}
              <div className="pedagogical-section">
                <h3 className="section-title">Progressive Practice Tasks</h3>
                <div className="practice-levels-grid">
                  <div className="level-card level-a">
                    <span className="level-tag">Level A: Foundation</span>
                    <p>{lesson.practiceLevels?.levelA}</p>
                  </div>
                  <div className="level-card level-b">
                    <span className="level-tag">Level B: Practical</span>
                    <p>{lesson.practiceLevels?.levelB}</p>
                  </div>
                  <div className="level-card level-c">
                    <span className="level-tag">Level C: Advanced / Edge</span>
                    <p>{lesson.practiceLevels?.levelC}</p>
                  </div>
                </div>
              </div>

              {/* Common Mistakes */}
              {lesson.commonMistakes && (
                <div className="pedagogical-section">
                  <h3 className="section-title">Common Mistakes to Avoid</h3>
                  <div className="mistakes-list">
                    {lesson.commonMistakes.map((mistake, idx) => (
                      <div key={idx} className="mistake-item">
                        <AlertTriangle size={16} className="text-amber" />
                        <p>{mistake}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Debugging Challenge */}
              {lesson.debuggingChallenge && (
                <div className="pedagogical-section debugging-card">
                  <h3 className="section-title">Debugging Challenge</h3>
                  <p className="card-sub">Identify the bug in the following snippet:</p>
                  <CodeBlock code={lesson.debuggingChallenge.brokenCode} language="jsx" className="broken-block" />
                  <div className="debugging-problem-box">
                    <strong>Symptom:</strong> {lesson.debuggingChallenge.problem}
                  </div>

                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => setShowDebuggingFix(prev => !prev)}
                  >
                    {showDebuggingFix ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showDebuggingFix ? 'Hide Fix' : 'Reveal Solution & Fix'}</span>
                  </button>

                  {showDebuggingFix && (
                    <div className="debugging-fix-box">
                      <strong>Fix:</strong> {lesson.debuggingChallenge.fix}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Comprehension Quiz */}
          {activeTab === 'quiz' && (
            <div className="pedagogical-content">
              {/* Conceptual Multiple Choice */}
              {lesson.conceptualQuestion && (
                <div className="pedagogical-section quiz-card">
                  <span className="quiz-badge">Conceptual Quiz</span>
                  <h3 className="quiz-question">{lesson.conceptualQuestion.question}</h3>

                  <div className="quiz-options-list">
                    {lesson.conceptualQuestion.options.map((opt, idx) => {
                      const isSelected = selectedQuizOption === idx;
                      const isCorrect = idx === lesson.conceptualQuestion.correctIndex;
                      let optionClass = 'quiz-option';

                      if (quizSubmitted) {
                        if (isCorrect) optionClass += ' correct';
                        else if (isSelected && !isCorrect) optionClass += ' incorrect';
                      } else if (isSelected) {
                        optionClass += ' selected';
                      }

                      return (
                        <button
                          key={idx}
                          className={optionClass}
                          onClick={() => {
                            if (!quizSubmitted) {
                              setSelectedQuizOption(idx);
                            }
                          }}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                          <span className="option-text">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      className="btn btn-primary btn-small mt-3"
                      disabled={selectedQuizOption === null}
                      onClick={() => setQuizSubmitted(true)}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="quiz-explanation-box">
                      <strong>
                        {selectedQuizOption === lesson.conceptualQuestion.correctIndex
                          ? 'Correct'
                          : 'Incorrect'}
                      </strong>
                      <p>{lesson.conceptualQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Code Reading Question */}
              {lesson.codeReadingQuestion && (
                <div className="pedagogical-section quiz-card mt-4">
                  <span className="quiz-badge">Code Reading & Mental Model</span>
                  <CodeBlock code={lesson.codeReadingQuestion.snippet} language="jsx" />
                  <p className="quiz-question">{lesson.codeReadingQuestion.question}</p>

                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => setShowCodeReadingAnswer(prev => !prev)}
                  >
                    {showCodeReadingAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showCodeReadingAnswer ? 'Hide Answer' : 'Reveal Answer'}</span>
                  </button>

                  {showCodeReadingAnswer && (
                    <div className="quiz-explanation-box mt-3">
                      <strong>Answer:</strong> {lesson.codeReadingQuestion.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Pane: Code Editor & Test Runner */}
        <div className="code-editor-pane">
          {/* Editor Header */}
          <div className="editor-header">
            <div className="editor-header-left">
              <Code2 size={16} />
              <span className="editor-tab-title">Exercise.jsx</span>
            </div>

            <div className="editor-header-actions">
              {lesson.hints && lesson.hints.length > 0 && (
                <button
                  className="editor-btn"
                  onClick={() => setShowHintsModal(true)}
                  title="View progressive hints"
                >
                  <Lightbulb size={14} />
                  <span>Hints ({lesson.hints.length})</span>
                </button>
              )}

              {lesson.solution && (
                <button
                  className="editor-btn"
                  onClick={() => setShowSolution(prev => !prev)}
                  title="Toggle reference solution"
                >
                  <Eye size={14} />
                  <span>{showSolution ? 'Hide Solution' : 'Solution'}</span>
                </button>
              )}

              <button
                className="editor-btn"
                onClick={handleCopyCode}
                title="Copy current code"
              >
                {copiedSnippet ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                className="editor-btn"
                onClick={handleResetStarter}
                title="Reset editor back to initial starter code"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Reference Solution Drawer if toggled */}
          {showSolution && lesson.solution && (
            <div className="solution-drawer">
              <div className="solution-drawer-header">
                <span>Reference Implementation</span>
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => {
                    setCode(lesson.solution);
                    saveDraft(lesson.id, lesson.solution);
                    setShowSolution(false);
                  }}
                >
                  Load Solution into Editor
                </button>
              </div>
              <CodeBlock code={lesson.solution} language="jsx" className="solution-block" />
            </div>
          )}

          {/* Interactive Colorful Code Editor Area */}
          <CodeEditor
            id="workspace-code-textarea"
            code={code}
            onChange={(val) => {
              setCode(val);
              saveDraft(lesson.id, val);
            }}
            onRun={handleRunTests}
            language="jsx"
            height="440px"
            placeholder="// Write your code here..."
          />

          {/* Test Runner & Results Panel */}
          <div className="test-runner-panel">
            <div className="test-runner-header">
              <div className="test-status-summary">
                {testResults ? (
                  testResults.allPassed ? (
                    <span className="test-badge-success">
                      <CheckCircle2 size={16} />
                      <span>All {testResults.passedCount}/{testResults.totalCount} Tests Passed!</span>
                    </span>
                  ) : (
                    <span className="test-badge-fail">
                      <XCircle size={16} />
                      <span>{testResults.passedCount}/{testResults.totalCount} Tests Passed</span>
                    </span>
                  )
                ) : (
                  <span className="test-badge-idle">
                    <TerminalIcon size={14} />
                    <span>Ready to run tests ({lesson.testCases?.length || 0} assertions)</span>
                  </span>
                )}
              </div>

              <button
                id="workspace-run-tests-btn"
                className="btn btn-primary run-tests-btn"
                disabled={isRunning}
                onClick={handleRunTests}
              >
                <Play size={16} fill="currentColor" />
                <span>{isRunning ? 'Executing...' : 'Run Tests (Ctrl+Enter)'}</span>
              </button>
            </div>

            {/* Test Results Output */}
            {testResults && (
              <div className="test-results-list">
                {testResults.syntaxError && (
                  <div className="test-error-callout">
                    <div className="test-error-callout-header">
                      <AlertTriangle size={15} />
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
                    <div className="result-icon">
                      {res.passed ? (
                        <CheckCircle2 size={16} className="text-emerald" />
                      ) : (
                        <XCircle size={16} className="text-rose" />
                      )}
                    </div>
                    <div className="result-details">
                      <span className="test-case-name">{res.name}</span>
                      {res.error && (
                        <span className="test-case-error">{res.error}</span>
                      )}
                    </div>
                  </div>
                ))}

                {testResults.logs && testResults.logs.length > 0 && (
                  <div className="console-logs-container">
                    <div className="logs-header">Console Output:</div>
                    {testResults.logs.map((log, i) => (
                      <div key={i} className="log-line">{log}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hints Modal */}
      {showHintsModal && lesson.hints && (
        <div className="modal-backdrop" onClick={() => setShowHintsModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Progressive Hints ({lesson.hints.length})</h3>
              <button className="modal-close-btn" onClick={() => setShowHintsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="hints-instructions">
                Try each hint one at a time before revealing the next:
              </p>
              <div className="hints-stack">
                {lesson.hints.map((hint, idx) => {
                  const isRevealed = idx <= hintIndex;
                  return (
                    <div key={idx} className={`hint-step-card ${isRevealed ? 'revealed' : 'locked'}`}>
                      <div className="hint-step-header">
                        <span className="hint-step-title">Hint #{idx + 1}</span>
                        {!isRevealed && idx === hintIndex + 1 && (
                          <button
                            className="btn btn-outline btn-small"
                            onClick={() => setHintIndex(idx)}
                          >
                            Reveal Hint #{idx + 1}
                          </button>
                        )}
                      </div>
                      {isRevealed ? (
                        <p className="hint-text">{hint}</p>
                      ) : (
                        <p className="hint-locked-text">Locked hint. Solve progressively!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
