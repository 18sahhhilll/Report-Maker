import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  User, 
  Building2, 
  Stethoscope, 
  Pill, 
  Sliders,
  Sparkles
} from 'lucide-react';

export default function EntryFormView({
  report,
  activeEntryIndex,
  setActiveEntryIndex,
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
      <div style={{ textAlignment: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No doctor visit entries recorded yet in this report.</p>
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
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1rem 0.5rem', width: '100%' }}>
      
      {/* Navigation Toolbar */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '1rem', 
          padding: '0.75rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            onClick={() => setActiveEntryIndex(Math.max(0, activeEntryIndex - 1))}
            disabled={activeEntryIndex === 0}
            title="Previous Visit"
          >
            <ChevronLeft size={18} />
          </button>
          
          <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '110px', textAlign: 'center' }}>
            Visit {activeEntryIndex + 1} of {entries.length}
          </span>

          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            onClick={() => setActiveEntryIndex(Math.min(entries.length - 1, activeEntryIndex + 1))}
            disabled={activeEntryIndex === entries.length - 1}
            title="Next Visit"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {/* Copy Previous Entry Button */}
          {activeEntryIndex > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onCopyPreviousEntry(currentEntry.id, activeEntryIndex)}
              title="Copy fields from previous visit to save typing"
            >
              <Copy size={15} style={{ color: 'var(--accent-secondary)' }} />
              <span>Copy Previous</span>
            </button>
          )}

          {/* New Entry */}
          <button className="btn btn-primary btn-sm" onClick={onNewVisitEntry}>
            <Plus size={16} />
            <span>New Visit</span>
          </button>

          {/* Delete Entry */}
          {entries.length > 1 && (
            <button
              className="btn btn-danger btn-sm btn-icon-only"
              onClick={() => onDeleteEntry(currentEntry.id)}
              title="Delete this visit entry"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Dynamic Form Card */}
      <div className="card" style={{ padding: '1.5rem', borderColor: 'var(--border-strong)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={20} style={{ color: 'var(--accent-primary)' }} />
            Doctor Visit Record
          </h2>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onOpenColumnBuilder}
            style={{ fontSize: '0.8rem' }}
          >
            <Sliders size={14} /> Add/Manage Fields
          </button>
        </div>

        {/* Dynamic Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {columns.map((col) => {
            const val = currentEntry.data ? (currentEntry.data[col.id] ?? '') : '';

            return (
              <div key={col.id} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>{col.name}</span>
                  <span className="badge">{col.type ? col.type.toUpperCase() : 'TEXT'}</span>
                </label>

                {/* Render input based on Column Type */}
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
                ) : col.type === 'date' ? (
                  <input
                    type="date"
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

        {/* Form Footer info & Next Visit button */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Auto-saved instantly to your device
          </span>

          <button className="btn btn-primary" onClick={onNewVisitEntry}>
            <Plus size={18} /> Add Next Doctor Visit
          </button>
        </div>

      </div>
    </div>
  );
}
