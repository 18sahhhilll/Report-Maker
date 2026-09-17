import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  FolderOpen, 
  Menu,
  Check,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function Header({
  activeReport,
  onOpenReportList,
  onOpenMenuModal,
  onRenameReport,
  saveStatus
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    if (activeReport) {
      setEditedTitle(activeReport.title || '');
    }
  }, [activeReport]);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && activeReport) {
      onRenameReport(activeReport.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="navbar">
      {/* Brand Logo & Title */}
      <div className="brand-badge">
        <div className="brand-icon">
          <Stethoscope size={20} />
        </div>
        <h1 className="brand-title">MedRep Logger</h1>
      </div>

      {/* Right Controls: Report Switcher & Menu Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, maxWidth: '60%' }}>
        
        {/* Active Report Title Switcher Badge */}
        {activeReport && (
          !isEditingTitle ? (
            <button 
              className="report-title-badge"
              onClick={onOpenReportList}
              title="Click to switch or rename report"
            >
              <FolderOpen size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>{activeReport.title}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <input
                type="text"
                className="form-control"
                style={{ minHeight: '34px', padding: '0.2rem 0.5rem', fontSize: '0.8rem', width: '100px' }}
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
              />
              <button
                className="btn btn-primary btn-sm btn-icon-only"
                style={{ width: '32px', height: '32px' }}
                onClick={handleSaveTitle}
              >
                <Check size={14} />
              </button>
            </div>
          )
        )}

        {/* Save Indicator Icon */}
        <div style={{ 
          fontSize: '0.75rem', 
          color: saveStatus === 'saving' ? 'var(--accent-warning)' : 'var(--accent-primary)',
          display: 'flex', 
          alignItems: 'center', 
          flexShrink: 0 
        }} title={saveStatus === 'saving' ? 'Saving...' : 'All changes saved'}>
          {saveStatus === 'saving' ? (
            <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <CheckCircle2 size={13} />
          )}
        </div>

        {/* Single Main Action Menu Button - FIXED ON TOP RIGHT */}
        <button 
          className="btn btn-secondary btn-icon-only"
          style={{ width: '38px', height: '38px', flexShrink: 0 }}
          onClick={onOpenMenuModal}
          title="Open Menu & Export Tools"
        >
          <Menu size={18} />
        </button>

      </div>
    </header>
  );
}
