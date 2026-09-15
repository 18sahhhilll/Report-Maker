import React from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Sliders, 
  Database, 
  FolderOpen, 
  Plus, 
  Download, 
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';

export default function ActionsMenuModal({
  isOpen,
  onClose,
  activeReport,
  onOpenReportList,
  onOpenColumnBuilder,
  onExportExcel,
  onExportAllExcel,
  onOpenBackupModal,
  onNewVisitEntry
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Menu & Tools</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Report: <strong>{activeReport?.title || 'Report'}</strong>
            </p>
          </div>
          <button className="btn btn-secondary btn-icon-only btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          
          {/* Export Excel */}
          <button 
            className="btn btn-accent" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            onClick={() => {
              onExportExcel();
              onClose();
            }}
          >
            <FileSpreadsheet size={20} />
            <div style={{ textAlignment: 'left', flex: 1, marginLeft: '0.3rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Export to Excel (.xlsx)</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Download formatted spreadsheet with Sr No</div>
            </div>
            <ChevronRight size={16} />
          </button>

          {/* Customize Fields */}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            onClick={() => {
              onOpenColumnBuilder();
              onClose();
            }}
          >
            <Sliders size={20} style={{ color: 'var(--accent-secondary)' }} />
            <div style={{ textAlignment: 'left', flex: 1, marginLeft: '0.3rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Customize Fields & Columns</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Add, rename, reorder, or set input types</div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>

          {/* Switch / Manage Reports */}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            onClick={() => {
              onOpenReportList();
              onClose();
            }}
          >
            <FolderOpen size={20} style={{ color: 'var(--accent-primary)' }} />
            <div style={{ textAlignment: 'left', flex: 1, marginLeft: '0.3rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Switch / All Reports</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View past sessions or create new report</div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>

          {/* Backup & Restore */}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            onClick={() => {
              onOpenBackupModal();
              onClose();
            }}
          >
            <Database size={20} style={{ color: 'var(--accent-warning)' }} />
            <div style={{ textAlignment: 'left', flex: 1, marginLeft: '0.3rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Backup & Data Safety</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Export JSON backup or clear storage</div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>

          {/* Export All Reports */}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
            onClick={() => {
              onExportAllExcel();
              onClose();
            }}
          >
            <Download size={20} style={{ color: 'var(--text-secondary)' }} />
            <div style={{ textAlignment: 'left', flex: 1, marginLeft: '0.3rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Export All Reports (.xlsx)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Download multi-sheet Excel file</div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </button>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ width: '100%' }}>
            Close Menu
          </button>
        </div>

      </div>
    </div>
  );
}
