import React from 'react';
import { 
  Stethoscope, 
  FolderOpen, 
  Sliders, 
  Download, 
  FileSpreadsheet, 
  LayoutList, 
  Table, 
  CheckCircle2, 
  RefreshCw,
  Plus,
  Database
} from 'lucide-react';

export default function Header({
  activeReport,
  reports,
  viewMode,
  setViewMode,
  onOpenReportList,
  onOpenColumnBuilder,
  onExportExcel,
  onOpenBackupModal,
  onNewVisitEntry,
  saveStatus
}) {
  return (
    <header className="navbar">
      {/* Top row: Brand & Report Switcher */}
      <div className="nav-top-row">
        <div className="brand-badge">
          <div className="brand-icon">
            <Stethoscope size={20} />
          </div>
          <div>
            <h1 className="brand-title">MedRep Visit Logger</h1>
            <p className="brand-subtitle">Dynamic Excel Report Generator</p>
          </div>
        </div>

        {/* Current Active Report Switcher Badge */}
        {activeReport && (
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onOpenReportList}
            title="Switch or manage reports"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', maxWidth: '170px' }}
          >
            <FolderOpen size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeReport.title}
            </span>
          </button>
        )}
      </div>

      {/* Middle & Right: Actions Bar */}
      <div className="action-bar-mobile">
        {/* Form vs Table view toggle */}
        <div className="tab-group" style={{ flex: 1, minWidth: '180px', maxWidth: '240px' }}>
          <button
            className={`tab-btn ${viewMode === 'form' ? 'active' : ''}`}
            onClick={() => setViewMode('form')}
          >
            <LayoutList size={15} />
            <span>Form</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <Table size={15} />
            <span>Table</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Quick New Entry */}
          <button className="btn btn-primary btn-sm" onClick={onNewVisitEntry} title="Add New Visit Entry">
            <Plus size={16} />
            <span>Visit</span>
          </button>

          {/* Customize Fields */}
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onOpenColumnBuilder}
            title="Configure dynamic fields/columns"
          >
            <Sliders size={15} />
            <span className="hide-mobile">Fields</span>
          </button>

          {/* Export to Excel */}
          <button 
            className="btn btn-accent btn-sm" 
            onClick={onExportExcel}
            title="Download formatted Excel (.xlsx) file"
          >
            <FileSpreadsheet size={15} />
            <span>Excel</span>
          </button>

          {/* Backup / Restore */}
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={onOpenBackupModal}
            title="Backup or restore data"
          >
            <Database size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
