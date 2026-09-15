import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Sliders, 
  Copy, 
  FileSpreadsheet, 
  Filter
} from 'lucide-react';

export default function EntryTableView({
  report,
  onUpdateEntry,
  onNewVisitEntry,
  onDeleteEntry,
  onOpenColumnBuilder,
  onExportExcel
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const columns = report?.columns || [];
  const entries = report?.entries || [];

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return columns.some(col => {
      const val = entry.data ? entry.data[col.id] : '';
      return String(val || '').toLowerCase().includes(searchLower);
    });
  });

  const handleCellChange = (entryId, colId, value) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      onUpdateEntry(entryId, {
        ...entry.data,
        [colId]: value
      });
    }
  };

  return (
    <div style={{ padding: '1rem 0.5rem', width: '100%' }}>
      
      {/* Table Toolbar */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '1rem', 
          padding: '0.85rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem', minHeight: '40px', fontSize: '0.875rem' }}
            placeholder={`Filter ${entries.length} doctor visits...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenColumnBuilder}>
            <Sliders size={15} /> Customize Columns
          </button>
          <button className="btn btn-accent btn-sm" onClick={onExportExcel}>
            <FileSpreadsheet size={15} /> Export Excel
          </button>
          <button className="btn btn-primary btn-sm" onClick={onNewVisitEntry}>
            <Plus size={16} /> Add Row
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>#</th>
              {columns.map(col => (
                <th key={col.id} style={{ minWidth: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span>{col.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 500 }}>{col.type || 'TEXT'}</span>
                  </div>
                </th>
              ))}
              <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  {searchTerm ? `No visits match "${searchTerm}"` : 'No visit entries recorded yet.'}
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, idx) => (
                <tr key={entry.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {idx + 1}
                  </td>
                  {columns.map(col => {
                    const val = entry.data ? (entry.data[col.id] ?? '') : '';

                    return (
                      <td key={col.id}>
                        {col.type === 'select' ? (
                          <select
                            className="table-input"
                            value={val}
                            onChange={e => handleCellChange(entry.id, col.id, e.target.value)}
                          >
                            <option value="">--</option>
                            {(col.options || []).map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : col.type === 'phone' ? (
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            className="table-input"
                            style={{
                              color: val && val.length === 10 ? 'var(--accent-primary)' : val && val.length > 0 ? 'var(--accent-warning)' : 'inherit'
                            }}
                            value={val}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                              handleCellChange(entry.id, col.id, digits);
                            }}
                            placeholder="10 digits..."
                          />
                        ) : (
                          <input
                            type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                            className="table-input"
                            value={val}
                            onChange={e => handleCellChange(entry.id, col.id, e.target.value)}
                            placeholder="Click to edit..."
                          />
                        )}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center' }}>
                    {entries.length > 1 && (
                      <button
                        className="btn btn-danger btn-sm btn-icon-only"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => onDeleteEntry(entry.id)}
                        title="Delete row"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
