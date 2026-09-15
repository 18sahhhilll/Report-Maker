import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  FileSpreadsheet, 
  Calendar, 
  Layers, 
  Check, 
  ArrowRight,
  Download,
  Pencil
} from 'lucide-react';

export default function ReportListModal({
  isOpen,
  onClose,
  reports,
  activeReportId,
  onSelectReport,
  onCreateReport,
  onDeleteReport,
  onExportSingleExcel,
  onExportAllExcel,
  onRenameReport
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [copyFromId, setCopyFromId] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  if (!isOpen) return null;

  const handleStartRename = (report) => {
    setEditingId(report.id);
    setEditingTitleText(report.title || '');
  };

  const handleSaveRename = (reportId) => {
    if (editingTitleText.trim() && onRenameReport) {
      onRenameReport(reportId, editingTitleText.trim());
    }
    setEditingId(null);
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateReport({
      title: newTitle.trim(),
      copyFromReportId: copyFromId || null
    });

    setNewTitle('');
    setCopyFromId('');
    setShowCreateForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Report Manager</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Switch reports, create sessions, or reuse field setups
            </p>
          </div>
          <button className="btn btn-secondary btn-icon-only btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Top Bar: Search & New Report Button */}
          {!showCreateForm ? (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', minHeight: '42px', fontSize: '0.9rem' }}
                  placeholder="Search past reports..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={18} />
                <span>Start New Report</span>
              </button>
            </div>
          ) : (
            /* Create Report Sub-form */
            <form onSubmit={handleCreateSubmit} className="card" style={{ marginBottom: '1.25rem', borderColor: 'var(--accent-primary)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Create New Report</h3>
              
              <div className="form-group">
                <label className="form-label">Report Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Oct 2026 - Cardiology Visits"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Field Setup / Dynamic Columns</span>
                  <span className="badge">Optional</span>
                </label>
                <select
                  className="form-control"
                  value={copyFromId}
                  onChange={e => setCopyFromId(e.target.value)}
                >
                  <option value="">✨ Start with Default Fields (Doctor Name, Specialty, etc.)</option>
                  {reports.map(r => (
                    <option key={r.id} value={r.id}>
                      📋 Duplicate columns from: "{r.title}" ({r.columns?.length || 0} fields)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create & Start Entry
                </button>
              </div>
            </form>
          )}

          {/* Reports List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                No reports found matching "{searchTerm}".
              </div>
            ) : (
              filteredReports.map(report => {
                const isActive = report.id === activeReportId;
                const entryCount = report.entries?.length || 0;
                const columnCount = report.columns?.length || 0;
                const updatedDate = new Date(report.updatedAt || report.createdAt).toLocaleDateString();

                return (
                  <div
                    key={report.id}
                    className="card"
                    style={{
                      borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: isActive ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {editingId === report.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: '100%' }}>
                            <input
                              type="text"
                              className="form-control"
                              style={{ minHeight: '36px', fontSize: '0.9rem', padding: '0.2rem 0.5rem' }}
                              value={editingTitleText}
                              onChange={e => setEditingTitleText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveRename(report.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              autoFocus
                            />
                            <button
                              className="btn btn-primary btn-sm btn-icon-only"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() => handleSaveRename(report.id)}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm btn-icon-only"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() => setEditingId(null)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {report.title}
                            </h4>
                            <button
                              className="btn btn-secondary btn-sm btn-icon-only"
                              style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
                              onClick={() => handleStartRename(report)}
                              title="Rename report"
                            >
                              <Pencil size={13} style={{ color: 'var(--text-muted)' }} />
                            </button>
                            {isActive && (
                              <span style={{ 
                                fontSize: '0.7rem', 
                                background: 'var(--accent-primary)', 
                                color: '#fff', 
                                padding: '2px 8px', 
                                borderRadius: '10px', 
                                fontWeight: 700 
                              }}>
                                ACTIVE
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>
                          <Layers size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                          {columnCount} Columns
                        </span>
                        <span>
                          <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                          {entryCount} Doctor Visits
                        </span>
                        <span>Updated: {updatedDate}</span>
                      </div>
                    </div>

                    {/* Actions for this report */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onExportSingleExcel(report)}
                        title="Download Excel for this report"
                      >
                        <FileSpreadsheet size={15} />
                      </button>

                      {!isActive ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            onSelectReport(report.id);
                            onClose();
                          }}
                        >
                          Select
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6 }}>
                          <Check size={14} /> Selected
                        </button>
                      )}

                      {reports.length > 1 && (
                        <button
                          className="btn btn-danger btn-sm btn-icon-only"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete report "${report.title}"?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          title="Delete report"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onExportAllExcel}
            title="Download Excel containing all reports in separate tabs"
          >
            <Download size={15} />
            <span>Export All Reports (.xlsx)</span>
          </button>
          
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
