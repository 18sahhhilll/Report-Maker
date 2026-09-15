import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Copy, 
  Trash2, 
  LayoutList, 
  Table, 
  Pencil,
  Sliders
} from 'lucide-react';

export default function EntryFormView({
  report,
  activeEntryIndex,
  setActiveEntryIndex,
  viewMode,
  setViewMode,
  onUpdateEntry,
  onNewVisitEntry,
  onDeleteEntry,
  onCopyPreviousEntry,
  onOpenColumnBuilder
}) {
  const entries = report?.entries || [];
  const columns = report?.columns || [];
  const currentEntry = entries[activeEntryIndex];

  if (!currentEntry) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>No doctor visit entries recorded yet in this report.</p>
        <button className="btn btn-primary" onClick={onNewVisitEntry}>
          <Plus size={18} /> Record First Doctor Visit
        </button>
      </div>
    );
  }

  const handleFieldChange = (colId, value) => {
    onUpdateEntry(currentEntry.id, {
      ...currentEntry.data,
      [colId]: value
    });
  };

  return (
    <div style={{ padding: '0.75rem 0.5rem', width: '100%' }}>
      
      {/* View Switcher & Pagination Bar */}
      <div 
        style={{ 
          marginBottom: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        {/* Form / Table Toggle */}
        <div className="tab-group" style={{ maxWidth: '220px' }}>
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

        {/* Simple Compact Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-surface)', padding: '3px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            style={{ width: '32px', height: '32px', border: 'none' }}
            onClick={() => setActiveEntryIndex(Math.max(0, activeEntryIndex - 1))}
            disabled={activeEntryIndex === 0}
            title="Previous Visit"
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ fontWeight: 700, fontSize: '0.85rem', padding: '0 4px', color: 'var(--text-primary)' }}>
            Visit {activeEntryIndex + 1} of {entries.length}
          </span>

          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            style={{ width: '32px', height: '32px', border: 'none' }}
            onClick={() => setActiveEntryIndex(Math.min(entries.length - 1, activeEntryIndex + 1))}
            disabled={activeEntryIndex === entries.length - 1}
            title="Next Visit"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Clean Form Card */}
      <div className="card" style={{ padding: '1.25rem 1.25rem 1.5rem 1.25rem' }}>
        
        {/* Dynamic Fields List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {columns.map((col) => {
            const val = currentEntry.data ? (currentEntry.data[col.id] ?? '') : '';

            return (
              <div key={col.id} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>{col.name}</span>
                </label>

                {/* Input components */}
                {col.type === 'select' ? (
                  <select
                    className="form-control"
                    value={val}
                    onChange={e => handleFieldChange(col.id, e.target.value)}
                  >
                    <option value="">-- Select {col.name} --</option>
                    {(col.options || []).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : col.type === 'number' ? (
                  <input
                    type="number"
                    className="form-control"
                    placeholder={`Enter ${col.name.toLowerCase()}...`}
                    value={val}
                    onChange={e => handleFieldChange(col.id, e.target.value)}
                  />
                ) : col.type === 'phone' ? (
                  <div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="form-control"
                      placeholder="10-digit mobile number"
                      value={val}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleFieldChange(col.id, digits);
                      }}
                      style={{
                        borderColor: val && val.length === 10 ? 'var(--accent-primary)' : val && val.length > 0 ? 'var(--accent-warning)' : 'var(--border-subtle)'
                      }}
                    />
                    {val && val.length > 0 && val.length < 10 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', marginTop: '2px', display: 'block' }}>
                        ⚠️ Phone number must be exactly 10 digits ({val.length}/10)
                      </span>
                    )}
                    {val && val.length === 10 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '2px', display: 'block' }}>
                        ✓ Valid 10-digit Phone No
                      </span>
                    )}
                  </div>
                ) : col.type === 'date' ? (
                  <input
                    type="date"
                    className="form-control"
                    value={val}
                    onChange={e => handleFieldChange(col.id, e.target.value)}
                  />
                ) : col.type === 'time' ? (
                  <input
                    type="time"
                    className="form-control"
                    value={val}
                    onChange={e => handleFieldChange(col.id, e.target.value)}
                  />
                ) : (
                  col.name.toLowerCase().includes('note') || col.name.toLowerCase().includes('remark') ? (
                    <textarea
                      className="form-control"
                      placeholder={`Type ${col.name.toLowerCase()}...`}
                      value={val}
                      onChange={e => handleFieldChange(col.id, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Enter ${col.name.toLowerCase()}...`}
                      value={val}
                      onChange={e => handleFieldChange(col.id, e.target.value)}
                    />
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Secondary Card Actions: Copy & Delete */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          {activeEntryIndex > 0 ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onCopyPreviousEntry(currentEntry.id, activeEntryIndex)}
              title="Copy details from previous visit"
            >
              <Copy size={15} style={{ color: 'var(--accent-secondary)' }} />
              <span>Copy Previous</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Auto-saved instantly
            </span>
          )}

          {entries.length > 1 && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteEntry(currentEntry.id)}
              title="Delete this visit entry"
            >
              <Trash2 size={15} />
              <span>Delete Entry</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Primary Action Button at bottom */}
      <div style={{ marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={onNewVisitEntry}
          style={{ width: '100%', minHeight: '52px', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
        >
          <Plus size={20} /> Add Next Doctor Visit
        </button>
      </div>

    </div>
  );
}
