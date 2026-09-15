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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div className="brand-badge">
          <div className="brand-icon">
            <Stethoscope size={22} />
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
            style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FolderOpen size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 700, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeReport.title}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'var(--bg-surface-elevated)', 
              padding: '2px 7px', 
              borderRadius: '10px', 
              color: 'var(--text-secondary)' 
            }}>
              {activeReport.entries?.length || 0} visits
            </span>
          </button>
        )}
      </div>

      {/* Middle: Form vs Table view toggle */}
      <div className="tab-group" style={{ maxWidth: '280px' }}>
        <button
          className={`tab-btn ${viewMode === 'form' ? 'active' : ''}`}
          onClick={() => setViewMode('form')}
        >
          <LayoutList size={16} />
          <span>Form View</span>
        </button>
        <button
          className={`tab-btn ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => setViewMode('table')}
        >
          <Table size={16} />
          <span>Table View</span>
        </button>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Save Status Indicator */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.35rem', 
          fontSize: '0.8rem', 
          color: saveStatus === 'saving' ? 'var(--accent-warning)' : 'var(--accent-primary)',
          marginRight: '0.5rem'
        }}>
          {saveStatus === 'saving' ? (
            <>
              <RefreshCw size={14} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              <span className="hide-mobile">Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={14} />
              <span className="hide-mobile">Saved</span>
            </>
          )}
        </div>

        {/* Quick New Entry */}
        <button className="btn btn-primary btn-sm" onClick={onNewVisitEntry}>
          <Plus size={16} />
          <span className="hide-mobile">New Visit</span>
        </button>

        {/* Customize Fields */}
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onOpenColumnBuilder}
          title="Configure dynamic fields/columns"
        >
          <Sliders size={16} />
          <span className="hide-mobile">Fields ({activeReport?.columns?.length || 0})</span>
        </button>

        {/* Export to Excel */}
        <button 
          className="btn btn-accent btn-sm" 
          onClick={onExportExcel}
          title="Download formatted Excel (.xlsx) file"
        >
          <FileSpreadsheet size={16} />
          <span>Export Excel</span>
        </button>

        {/* Backup / Restore */}
        <button 
          className="btn btn-secondary btn-sm btn-icon-only" 
          onClick={onOpenBackupModal}
          title="Backup or restore data"
        >
          <Database size={16} />
        </button>
      </div>
    </header>
  );
}
