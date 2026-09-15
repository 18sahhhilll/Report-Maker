import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  FolderOpen, 
  Menu,
  Pencil,
  Check,
  X,
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
      {/* Brand Logo & Name */}
      <div className="brand-badge">
        <div className="brand-icon">
          <Stethoscope size={20} />
        </div>
        <h1 className="brand-title">MedRep Logger</h1>
      </div>

      {/* Center/Right: Report Badge & Action Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        
        {/* Active Report Title Switcher Badge */}
        {activeReport && (
          !isEditingTitle ? (
            <button 
              className="report-title-badge"
              onClick={onOpenReportList}
              title="Click to switch or rename report"
            >
              <FolderOpen size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeReport.title}
              </span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <input
                type="text"
                className="form-control"
                style={{ minHeight: '36px', padding: '0.2rem 0.6rem', fontSize: '0.85rem', width: '140px' }}
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
                style={{ width: '34px', height: '34px' }}
                onClick={handleSaveTitle}
              >
                <Check size={14} />
              </button>
            </div>
          )
        )}

        {/* Save Indicator Dot */}
        <div style={{ 
          fontSize: '0.75rem', 
          color: saveStatus === 'saving' ? 'var(--accent-warning)' : 'var(--accent-primary)',
          display: 'flex', 
          alignItems: 'center', 
          gap: '3px' 
        }}>
          {saveStatus === 'saving' ? (
            <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <CheckCircle2 size={13} />
          )}
        </div>

        {/* Single Main Action Menu Button */}
        <button 
          className="btn btn-secondary btn-icon-only"
          style={{ width: '40px', height: '40px' }}
          onClick={onOpenMenuModal}
          title="Open Menu & Export Tools"
        >
          <Menu size={20} />
        </button>

      </div>
    </header>
  );
}
