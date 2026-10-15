import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAcademy } from '../../context/AcademyContext';
import { diagnosticQuestions } from '../../data/curriculum/diagnostic_questions';

export function DiagnosticModal() {
  const {
    diagnosticOpen,
    setDiagnosticOpen,
    applyDiagnosticResults
  } = useAcademy();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = diagnosticQuestions[currentIdx];

  const handleSelectOption = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIdx < diagnosticQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleApply = () => {
    applyDiagnosticResults(answers);
    setIsFinished(false);
    setCurrentIdx(0);
    setAnswers({});
  };

  const handleReset = () => {
    setIsFinished(false);
    setCurrentIdx(0);
    setAnswers({});
  };

  return (
    <Modal
      isOpen={diagnosticOpen}
      onClose={() => setDiagnosticOpen(false)}
      title="Diagnostic Placement Assessment"
      maxWidth="700px"
    >
      {!isFinished ? (
        <div className="diagnostic-modal-content">
          <div className="diagnostic-step-bar">
            <span>Question {currentIdx + 1} of {diagnosticQuestions.length}</span>
            <div className="mini-progress-track">
              <div
                className="mini-progress-fill"
                style={{ width: `${((currentIdx + 1) / diagnosticQuestions.length) * 100}%` }}
              />
            </div>
            <span className="step-category">{currentQ.category}</span>
          </div>

          <h3 className="diagnostic-question-text">{currentQ.question}</h3>

          <div className="diagnostic-options-list">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === i;
              return (
                <button
                  key={i}
                  className={`diagnostic-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(i)}
                >
                  <span className="option-bullet">{String.fromCharCode(65 + i)}</span>
                  <span className="option-text">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="modal-actions-row mt-4">
            <button
              className="btn btn-ghost"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(c => c - 1)}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              disabled={answers[currentQ.id] === undefined}
              onClick={handleNext}
            >
              <span>{currentIdx === diagnosticQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="diagnostic-results-view">
          <div className="result-hero-badge">
            <Sparkles size={32} className="text-amber" />
            <h3>Assessment Complete!</h3>
          </div>

          <p className="result-summary-text">
            Based on your answers, we have mapped your personalized placement tier and unlocked the appropriate curriculum phases.
          </p>

          <div className="modal-actions-row mt-4">
            <button className="btn btn-outline" onClick={handleReset}>
              <RotateCcw size={16} />
              <span>Retake</span>
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              <span>Apply Placement & Unlock Path</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
