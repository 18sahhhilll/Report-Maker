import ExcelJS from 'exceljs';

export async function exportReportToExcel(report) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MedRep Report Maker';
  workbook.lastModifiedBy = 'MedRep Report Maker';
  workbook.created = new Date();

  // Clean sheet name (Excel limits sheet names to 31 chars and bans certain chars)
  const sheetName = (report.title || 'Doctor Visits')
    .replace(/[\\/*?:[\]]/g, '')
    .substring(0, 30);

  const worksheet = workbook.addWorksheet(sheetName);

  // Define columns
  const columns = report.columns || [];
  
  // Set header row values (including Sr No as first column)
  const headers = ['Sr No', ...columns.map(c => c.name)];
  worksheet.addRow(headers);

  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Slate Dark Navy
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF475569' } },
      left: { style: 'thin', color: { argb: 'FF475569' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      right: { style: 'thin', color: { argb: 'FF475569' } }
    };
  });

  // Add Data Rows
  const entries = report.entries || [];
  entries.forEach((entry, rowIndex) => {
    const rowValues = [
      rowIndex + 1, // Sr No
      ...columns.map((col) => {
        const val = entry.data ? entry.data[col.id] : '';
        if (val === undefined || val === null) return '';
        
        // Convert number type
        if (col.type === 'number' && val !== '') {
          const num = Number(val);
          return isNaN(num) ? val : num;
        }
        return String(val);
      })
    ];

    const dataRow = worksheet.addRow(rowValues);
    dataRow.height = 22;

    // Zebra striping & alignment
    const isEven = rowIndex % 2 === 0;
    dataRow.eachCell((cell, colNumber) => {
      const isSrNo = colNumber === 1;
      const colDef = isSrNo ? null : columns[colNumber - 2];

      cell.font = { name: 'Calibri', size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF8FAFC' }
      };

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if (isSrNo) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Calibri', size: 11, bold: true };
      } else if (colDef && colDef.type === 'number') {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0.00;(#,##0.00);"-"';
        }
      } else if (colDef && colDef.type === 'date') {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
    });
  });

  // Calculate Column Widths based on content
  worksheet.columns.forEach((column, i) => {
    if (i === 0) {
      column.width = 10; // Fixed width for Sr No
      return;
    }
    const colDef = columns[i - 1];
    let maxLength = colDef ? colDef.name.length : 12;

    entries.forEach((entry) => {
      if (colDef && entry.data && entry.data[colDef.id]) {
        const cellValue = String(entry.data[colDef.id]);
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      }
    });

    // Clamp between 14 and 45 characters width
    column.width = Math.min(Math.max(maxLength + 4, 14), 45);
  });


  // Write to Buffer & Trigger Browser Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  const sanitizedTitle = (report.title || 'report').replace(/[^a-z0-9_-]/gi, '_');
  const filename = `${sanitizedTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function exportAllReportsToExcel(reports) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MedRep Report Maker';

  reports.forEach((report, rIndex) => {
    let rawTitle = report.title || `Report ${rIndex + 1}`;
    let sheetName = rawTitle.replace(/[\\/*?:[\]]/g, '').substring(0, 30);
    
    // Ensure unique sheet names
    let counter = 1;
    let finalSheetName = sheetName;
    while (workbook.getWorksheet(finalSheetName)) {
      finalSheetName = `${sheetName.substring(0, 25)}_${counter++}`;
    }

    const worksheet = workbook.addWorksheet(finalSheetName);
    const columns = report.columns || [];

    // Header (including Sr No)
    const headers = ['Sr No', ...columns.map(c => c.name)];
    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Rows
    const entries = report.entries || [];
    entries.forEach((entry, rowIndex) => {
      const rowValues = [
        rowIndex + 1,
        ...columns.map(col => {
          const val = entry.data ? entry.data[col.id] : '';
          if (col.type === 'number' && val !== '') {
            const n = Number(val);
            return isNaN(n) ? val : n;
          }
          return String(val || '');
        })
      ];
      const dataRow = worksheet.addRow(rowValues);
      dataRow.eachCell((cell, colNum) => {
        if (colNum === 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.font = { name: 'Calibri', size: 11, bold: true };
        }
      });
    });

    // Dynamic width
    worksheet.columns.forEach((column, i) => {
      if (i === 0) {
        column.width = 10;
        return;
      }
      const colDef = columns[i - 1];
      let maxLen = colDef ? colDef.name.length : 12;
      entries.forEach(e => {
        if (colDef && e.data && e.data[colDef.id]) {
          maxLen = Math.max(maxLen, String(e.data[colDef.id]).length);
        }
      });
      column.width = Math.min(Math.max(maxLen + 4, 14), 45);
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `All_Medical_Reports_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
