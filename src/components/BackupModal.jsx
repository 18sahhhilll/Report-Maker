import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Trash2
} from 'lucide-react';

export default function BackupModal({
  isOpen,
  onClose,
  reports,
  onImportBackup,
  onClearStorage
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(reports, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedRep_Reports_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          onImportBackup(importedData);
          alert('Backup data restored successfully!');
          onClose();
        } else {
          alert('Invalid backup file format. Expected an array of report objects.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearClick = () => {
    if (window.confirm('⚠️ WARNING: Are you sure you want to clear ALL saved reports and entries from this device?\n\nMake sure you have exported a JSON backup first if you need to keep your data.')) {
      onClearStorage();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={20} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h2 className="modal-title">Backup & Data Safety</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Transfer reports between devices or reset storage
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon-only btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Status info */}
          <div className="card" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  All data is stored locally in browser storage
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  You currently have <strong>{reports.length} report(s)</strong> saved on this device.
                </p>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>1. Export Backup (.json)</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Download a complete JSON file containing all your reports, visit entries, and custom column definitions.
            </p>
            <button className="btn btn-primary" onClick={handleExportJSON}>
              <Download size={18} /> Export Full JSON Backup
            </button>
          </div>

          <hr style={{ borderColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />

          {/* Import Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>2. Import / Restore Backup</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Restore reports from a previously saved JSON backup file.
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button 
              className="btn btn-secondary" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} /> Select & Restore .json File
            </button>
          </div>

          <hr style={{ borderColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />

          {/* Clear Storage Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-danger)' }}>
              3. Clear Storage & Reset Data
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Wipe all reports and entries saved in browser storage on this device.
            </p>
            <button className="btn btn-danger" onClick={handleClearClick}>
              <Trash2 size={18} /> Clear All Storage & Reset
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

