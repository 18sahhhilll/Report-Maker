import React from 'react';
import { 
  FolderOpen, 
  Sliders, 
  Plus, 
  FileSpreadsheet, 
  Menu 
} from 'lucide-react';

export default function MobileBottomNav({
  onOpenReportList,
  onOpenColumnBuilder,
  onNewVisitEntry,
  onExportExcel,
  onOpenMenuModal
}) {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className="mobile-nav-btn" 
        onClick={onOpenReportList}
        title="Switch / Manage Reports"
      >
        <FolderOpen size={18} />
        <span>Reports</span>
      </button>

      <button 
        className="mobile-nav-btn" 
        onClick={onOpenColumnBuilder}
        title="Configure Fields / Columns"
      >
        <Sliders size={18} />
        <span>Fields</span>
      </button>

      <button 
        className="mobile-nav-btn btn-main" 
        onClick={onNewVisitEntry}
        title="Add New Doctor Visit"
      >
        <Plus size={22} />
        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>+ Visit</span>
      </button>

      <button 
        className="mobile-nav-btn" 
        onClick={onExportExcel}
        title="Export to Excel"
      >
        <FileSpreadsheet size={18} style={{ color: 'var(--accent-secondary)' }} />
        <span>Excel</span>
      </button>

      <button 
        className="mobile-nav-btn" 
        onClick={onOpenMenuModal}
        title="Open Full Menu"
      >
        <Menu size={18} />
        <span>Menu</span>
      </button>
    </nav>
  );
}
