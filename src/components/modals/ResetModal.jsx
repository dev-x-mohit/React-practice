import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAcademy } from '../../context/AcademyContext';

export function ResetModal() {
  const {
    resetModalOpen,
    setResetModalOpen,
    resetAllProgress
  } = useAcademy();

  return (
    <Modal
      isOpen={resetModalOpen}
      onClose={() => setResetModalOpen(false)}
      title="Reset Academy Progress"
      maxWidth="480px"
    >
      <div className="reset-modal-body">
        <div className="warning-icon-box">
          <AlertTriangle size={36} className="text-rose" />
        </div>

        <h3 className="reset-warning-title">Are you sure you want to reset?</h3>
        <p className="reset-warning-desc">
          This action will reset all completed lessons, code drafts, bookmarks, and test scores back to day one. Your daily streak will reset to 1.
        </p>

        <div className="modal-actions-row mt-4">
          <button
            className="btn btn-ghost"
            onClick={() => setResetModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={resetAllProgress}
          >
            <RotateCcw size={16} />
            <span>Yes, Reset Everything</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
