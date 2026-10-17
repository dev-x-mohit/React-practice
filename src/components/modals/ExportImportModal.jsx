import React, { useState } from 'react';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAcademy } from '../../context/AcademyContext';
import { exportProgressJSON, importProgressJSON } from '../../services/storage';

export function ExportImportModal() {
  const {
    exportModalOpen,
    setExportModalOpen,
    progress
  } = useAcademy();

  const [jsonText, setJsonText] = useState(() => exportProgressJSON(progress));
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `react-academy-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const res = importProgressJSON(jsonText);
    if (res.success) {
      setImportStatus({ success: true, message: 'Progress successfully restored! Reloading...' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setImportStatus({ success: false, message: 'Import failed: ' + res.error });
    }
  };

  return (
    <Modal
      isOpen={exportModalOpen}
      onClose={() => setExportModalOpen(false)}
      title="Backup & Restore Progress"
      maxWidth="600px"
    >
      <div className="export-modal-body">
        <p className="modal-description">
          Export your complete learning history, streak records, code drafts, and test completions as a portable JSON file, or restore a previous backup.
        </p>

        <div className="export-textarea-wrapper">
          <textarea
            className="code-textarea json-textarea"
            rows={10}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
        </div>

        {importStatus && (
          <div className={`status-banner ${importStatus.success ? 'success' : 'error'}`}>
            {importStatus.message}
          </div>
        )}

        <div className="modal-actions-row mt-3">
          <div className="actions-left">
            <button className="btn btn-outline btn-small" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button className="btn btn-outline btn-small" onClick={handleDownloadFile}>
              <Download size={14} />
              <span>Download .json</span>
            </button>
          </div>

          <div className="actions-right">
            <button className="btn btn-primary btn-small" onClick={handleImport}>
              <Upload size={14} />
              <span>Restore from Text</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
