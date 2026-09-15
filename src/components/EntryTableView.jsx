import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Sliders, 
  FileSpreadsheet,
  LayoutList,
  Table
} from 'lucide-react';

export default function EntryTableView({
  report,
  viewMode,
  setViewMode,
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
    <div style={{ padding: '0.75rem 0.5rem', width: '100%' }}>
      
      {/* Top Toolbar */}
      <div 
        style={{ 
          marginBottom: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '0.5rem',
          flexWrap: 'wrap'
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

        {/* Search */}
        <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem', minHeight: '38px', fontSize: '0.85rem' }}
            placeholder={`Search ${entries.length} doctor visits...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Row Button */}
        <button className="btn btn-primary btn-sm" onClick={onNewVisitEntry}>
          <Plus size={16} /> Add Row
        </button>
      </div>

      {/* Clean Spreadsheet Grid */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>Sr No</th>
              {columns.map(col => (
                <th key={col.id} style={{ minWidth: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span>{col.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.6, fontWeight: 500 }}>{(col.type || 'TEXT').toUpperCase()}</span>
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
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
