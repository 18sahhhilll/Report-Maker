import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Check, 
  Type, 
  Hash, 
  Calendar, 
  ListFilter,
  Phone,
  AlertCircle
} from 'lucide-react';
import { PRESET_COLUMNS } from '../storage';

export default function ColumnBuilderModal({
  isOpen,
  onClose,
  report,
  onSaveColumns
}) {
  const [columns, setColumns] = useState([]);
  const [reportTitle, setReportTitle] = useState('');

  useEffect(() => {
    if (report) {
      setColumns(report.columns ? JSON.parse(JSON.stringify(report.columns)) : []);
      setReportTitle(report.title || '');
    }
  }, [report, isOpen]);

  if (!isOpen || !report) return null;

  const handleAddColumn = (type = 'text') => {
    const newId = `col_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setColumns([
      ...columns,
      {
        id: newId,
        name: `New Field ${columns.length + 1}`,
        type: type,
        options: type === 'select' ? ['Option 1', 'Option 2'] : []
      }
    ]);
  };

  const handleUpdateColumn = (id, field, value) => {
    setColumns(columns.map(col => {
      if (col.id === id) {
        if (field === 'options' && typeof value === 'string') {
          return { ...col, options: value.split(',').map(s => s.trim()).filter(Boolean) };
        }
        return { ...col, [field]: value };
      }
      return col;
    }));
  };

  const handleMoveColumn = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    const newCols = [...columns];
    const temp = newCols[index];
    newCols[index] = newCols[targetIndex];
    newCols[targetIndex] = temp;
    setColumns(newCols);
  };

  const handleDeleteColumn = (id) => {
    if (columns.length <= 1) {
      alert('A report must have at least one column/field.');
      return;
    }
    setColumns(columns.filter(c => c.id !== id));
  };

  const handleApplyPreset = (preset) => {
    if (window.confirm(`Apply preset "${preset.name}"? This will replace current column names with the preset fields.`)) {
      setColumns(preset.columns.map(c => ({
        ...c,
        id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
      })));
    }
  };

  const handleSave = () => {
    // Validate empty names
    const hasEmpty = columns.some(c => !c.name.trim());
    if (hasEmpty) {
      alert('All fields must have a valid name.');
      return;
    }
    onSaveColumns(reportTitle.trim() || 'Untitled Report', columns);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Configure Fields / Columns</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Add, rename, reorder, or change input types for "{report.title}"
            </p>
          </div>
          <button className="btn btn-secondary btn-icon-only btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Report Title Editor */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Report Title</label>
            <input
              type="text"
              className="form-control"
              value={reportTitle}
              onChange={e => setReportTitle(e.target.value)}
              placeholder="e.g. Sept 2026 - Doctor Visits"
            />
          </div>

          {/* Preset Buttons */}
          <div style={{ marginBottom: '1.5rem', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              <Sparkles size={16} />
              <span>Quick Presets:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PRESET_COLUMNS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleApplyPreset(preset)}
                >
                  Insert "{preset.name}" Fields
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Column List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Fields ({columns.length})</h3>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleAddColumn('text')}>
                  <Type size={14} /> Text
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleAddColumn('number')}>
                  <Hash size={14} /> Number
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleAddColumn('date')}>
                  <Calendar size={14} /> Date
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleAddColumn('select')}>
                  <ListFilter size={14} /> Dropdown
                </button>
              </div>
            </div>

            {columns.map((col, index) => (
              <div
                key={col.id}
                className="card"
                style={{
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Move up / down */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon-only"
                      style={{ width: '28px', height: '24px' }}
                      onClick={() => handleMoveColumn(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon-only"
                      style={{ width: '28px', height: '24px' }}
                      onClick={() => handleMoveColumn(index, 1)}
                      disabled={index === columns.length - 1}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  {/* Column Name Input */}
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ minHeight: '40px', fontSize: '0.925rem' }}
                      value={col.name}
                      onChange={e => handleUpdateColumn(col.id, 'name', e.target.value)}
                      placeholder="Field / Column Name"
                    />
                  </div>

                  {/* Type Selector */}
                  <div style={{ width: '130px' }}>
                    <select
                      className="form-control"
                      style={{ minHeight: '40px', fontSize: '0.85rem' }}
                      value={col.type || 'text'}
                      onChange={e => handleUpdateColumn(col.id, 'type', e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="select">Dropdown</option>
                    </select>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm btn-icon-only"
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handleDeleteColumn(col.id)}
                    title="Delete field"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Dropdown Options Sub-input if type === 'select' */}
                {col.type === 'select' && (
                  <div style={{ paddingLeft: '2.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px', display: 'block' }}>
                      Dropdown choices (comma-separated):
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ minHeight: '36px', fontSize: '0.825rem' }}
                      value={Array.isArray(col.options) ? col.options.join(', ') : ''}
                      onChange={e => handleUpdateColumn(col.id, 'options', e.target.value)}
                      placeholder="e.g. Prescribing, Interested, Follow-up Needed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: '1rem', borderStyle: 'dashed' }}
            onClick={() => handleAddColumn('text')}
          >
            <Plus size={16} /> Add Custom Field
          </button>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Check size={16} /> Save Column Setup
          </button>
        </div>

      </div>
    </div>
  );
}
