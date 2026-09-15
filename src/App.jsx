import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ReportListModal from './components/ReportListModal';
import ColumnBuilderModal from './components/ColumnBuilderModal';
import EntryFormView from './components/EntryFormView';
import EntryTableView from './components/EntryTableView';
import BackupModal from './components/BackupModal';
import { loadReports, saveReports, clearAllStorage, SAMPLE_REPORTS } from './storage';
import { exportReportToExcel, exportAllReportsToExcel } from './utils/excelExport';

export default function App() {
  const [reports, setReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);
  const [activeEntryIndex, setActiveEntryIndex] = useState(0);
  const [viewMode, setViewMode] = useState('form'); // 'form' | 'table'
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'

  // Modals state
  const [isReportListOpen, setIsReportListOpen] = useState(false);
  const [isColumnBuilderOpen, setIsColumnBuilderOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    async function init() {
      const loaded = await loadReports();
      setReports(loaded);
      if (loaded.length > 0) {
        setActiveReportId(loaded[0].id);
      }
    }
    init();
  }, []);

  // Save changes to storage whenever reports state mutates (debounced)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (reports.length === 0) return;

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      await saveReports(reports);
      setSaveStatus('saved');
    }, 400);

    return () => clearTimeout(timer);
  }, [reports]);

  // Active Report Helper
  const activeReport = reports.find(r => r.id === activeReportId) || reports[0];

  // Helper to mutate active report
  const updateActiveReport = (updaterFn) => {
    setReports(prevReports => 
      prevReports.map(r => {
        if (r.id === activeReportId) {
          const updated = typeof updaterFn === 'function' ? updaterFn(r) : { ...r, ...updaterFn };
          return { ...updated, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );
  };

  // 1. Update an entry's data
  const handleUpdateEntry = (entryId, newData) => {
    if (!activeReport) return;
    updateActiveReport(report => {
      const updatedEntries = (report.entries || []).map(e => {
        if (e.id === entryId) {
          return { ...e, data: newData, updatedAt: new Date().toISOString() };
        }
        return e;
      });
      return { ...report, entries: updatedEntries };
    });
  };

  // 2. Create new visit entry
  const handleNewVisitEntry = () => {
    if (!activeReport) return;
    const newEntryId = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    
    // Default initial values (e.g. Visit Date set to today if a Date column exists)
    const initialData = {};
    (activeReport.columns || []).forEach(col => {
      if (col.type === 'date') {
        initialData[col.id] = new Date().toISOString().split('T')[0];
      } else {
        initialData[col.id] = '';
      }
    });

    const newEntry = {
      id: newEntryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: initialData
    };

    updateActiveReport(report => ({
      ...report,
      entries: [...(report.entries || []), newEntry]
    }));

    // Focus on new entry if in form view
    const newCount = (activeReport.entries || []).length;
    setActiveEntryIndex(newCount);
  };

  // 3. Copy Previous Entry
  const handleCopyPreviousEntry = (currentEntryId, currentIndex) => {
    if (currentIndex <= 0 || !activeReport) return;
    const previousEntry = activeReport.entries[currentIndex - 1];
    if (!previousEntry) return;

    handleUpdateEntry(currentEntryId, { ...previousEntry.data });
  };

  // 4. Delete Entry
  const handleDeleteEntry = (entryId) => {
    if (!activeReport) return;
    updateActiveReport(report => {
      const filtered = (report.entries || []).filter(e => e.id !== entryId);
      return { ...report, entries: filtered };
    });

    if (activeEntryIndex >= (activeReport.entries?.length || 1) - 1) {
      setActiveEntryIndex(Math.max(0, (activeReport.entries?.length || 1) - 2));
    }
  };

  // 5. Save Columns & Title
  const handleSaveColumns = (newTitle, newColumns) => {
    if (!activeReport) return;
    updateActiveReport(report => ({
      ...report,
      title: newTitle,
      columns: newColumns
    }));
  };

  // 6. Create New Report
  const handleCreateReport = ({ title, copyFromReportId }) => {
    let initialColumns = [];

    if (copyFromReportId) {
      const templateReport = reports.find(r => r.id === copyFromReportId);
      if (templateReport && templateReport.columns) {
        initialColumns = JSON.parse(JSON.stringify(templateReport.columns));
      }
    }

    if (initialColumns.length === 0) {
      // Use standard default preset
      initialColumns = [
        { id: `col_${Date.now()}_1`, name: 'Doctor Name', type: 'text' },
        { id: `col_${Date.now()}_2`, name: 'Specialty', type: 'select', options: ['Cardiology', 'Internal Medicine', 'General Physician', 'Pediatrics', 'Orthopedics'] },
        { id: `col_${Date.now()}_3`, name: 'Hospital / Clinic', type: 'text' },
        { id: `col_${Date.now()}_4`, name: 'Products Discussed', type: 'text' },
        { id: `col_${Date.now()}_5`, name: 'Samples Provided', type: 'text' },
        { id: `col_${Date.now()}_6`, name: 'Visit Date', type: 'date' },
        { id: `col_${Date.now()}_7`, name: 'Call Outcome', type: 'select', options: ['Interested', 'Prescribing', 'Follow-up Needed', 'Busy'] },
        { id: `col_${Date.now()}_8`, name: 'Notes', type: 'text' }
      ];
    }

    const firstEntryId = `entry_${Date.now()}_1`;
    const initialData = {};
    initialColumns.forEach(col => {
      if (col.type === 'date') {
        initialData[col.id] = new Date().toISOString().split('T')[0];
      }
    });

    const newReport = {
      id: `report_${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      columns: initialColumns,
      entries: []
    };

    setReports(prev => [newReport, ...prev]);
    setActiveReportId(newReport.id);
    setActiveEntryIndex(0);
  };

  // 7. Delete Report
  const handleDeleteReport = (reportId) => {
    if (reports.length <= 1) {
      alert('Cannot delete the last remaining report.');
      return;
    }
    const filtered = reports.filter(r => r.id !== reportId);
    setReports(filtered);
    if (activeReportId === reportId) {
      setActiveReportId(filtered[0].id);
      setActiveEntryIndex(0);
    }
  };

  // 8. Export Single Report to Excel
  const handleExportSingleExcel = (targetReport = activeReport) => {
    if (!targetReport) return;
    exportReportToExcel(targetReport);
  };

  // 9. Export All Reports to Multi-Sheet Excel
  const handleExportAllExcel = () => {
    exportAllReportsToExcel(reports);
  };

  // 10. Restore Backup
  const handleImportBackup = (importedReports) => {
    setReports(importedReports);
    if (importedReports.length > 0) {
      setActiveReportId(importedReports[0].id);
      setActiveEntryIndex(0);
    }
  };

  // 11. Clear Storage & Reset Data
  const handleClearStorage = async () => {
    await clearAllStorage();
    setReports(SAMPLE_REPORTS);
    if (SAMPLE_REPORTS.length > 0) {
      setActiveReportId(SAMPLE_REPORTS[0].id);
      setActiveEntryIndex(0);
    }
  };

  return (
    <div className="app-container">
      
      {/* Navigation Top Header */}
      <Header
        activeReport={activeReport}
        reports={reports}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenReportList={() => setIsReportListOpen(true)}
        onOpenColumnBuilder={() => setIsColumnBuilderOpen(true)}
        onExportExcel={() => handleExportSingleExcel(activeReport)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onNewVisitEntry={handleNewVisitEntry}
        saveStatus={saveStatus}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '1rem 0.75rem', width: '100%' }}>
        {activeReport ? (
          viewMode === 'form' ? (
            <EntryFormView
              report={activeReport}
              activeEntryIndex={activeEntryIndex}
              setActiveEntryIndex={setActiveEntryIndex}
              onUpdateEntry={handleUpdateEntry}
              onNewVisitEntry={handleNewVisitEntry}
              onDeleteEntry={handleDeleteEntry}
              onCopyPreviousEntry={handleCopyPreviousEntry}
              onOpenColumnBuilder={() => setIsColumnBuilderOpen(true)}
            />
          ) : (
            <EntryTableView
              report={activeReport}
              onUpdateEntry={handleUpdateEntry}
              onNewVisitEntry={handleNewVisitEntry}
              onDeleteEntry={handleDeleteEntry}
              onOpenColumnBuilder={() => setIsColumnBuilderOpen(true)}
              onExportExcel={() => handleExportSingleExcel(activeReport)}
            />
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p>No report loaded.</p>
            <button className="btn btn-primary" onClick={() => setIsReportListOpen(true)}>
              Open Report Manager
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <ReportListModal
        isOpen={isReportListOpen}
        onClose={() => setIsReportListOpen(false)}
        reports={reports}
        activeReportId={activeReportId}
        onSelectReport={id => {
          setActiveReportId(id);
          setActiveEntryIndex(0);
        }}
        onCreateReport={handleCreateReport}
        onDeleteReport={handleDeleteReport}
        onExportSingleExcel={handleExportSingleExcel}
        onExportAllExcel={handleExportAllExcel}
      />

      <ColumnBuilderModal
        isOpen={isColumnBuilderOpen}
        onClose={() => setIsColumnBuilderOpen(false)}
        report={activeReport}
        onSaveColumns={handleSaveColumns}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        reports={reports}
        onImportBackup={handleImportBackup}
        onClearStorage={handleClearStorage}
      />

    </div>
  );
}
