import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'med_rep_reports_v1';

// Initial template report if app is launched fresh (clean, 0 entries)
export const SAMPLE_REPORTS = [
  {
    id: 'report_sample_1',
    title: 'Doctor Visits Report',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columns: [
      { id: 'col_1', name: 'Time', type: 'time' },
      { id: 'col_2', name: 'Doctor Name', type: 'text' },
      { id: 'col_3', name: 'Date', type: 'date' },
      { id: 'col_4', name: 'Category', type: 'text' },
      { id: 'col_5', name: 'Qualification', type: 'select', options: ['MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh', 'BAMS', 'BHMS'] },
      { id: 'col_6', name: 'Contact No', type: 'phone' }
    ],
    entries: []
  }
];

export async function loadReports() {
  try {
    const data = await get(STORAGE_KEY);
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('IndexedDB load error, checking localStorage fallback:', err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('LocalStorage parse error:', e);
  }

  // Save default sample if empty
  await saveReports(SAMPLE_REPORTS);
  return SAMPLE_REPORTS;
}

export async function saveReports(reports) {
  try {
    await set(STORAGE_KEY, reports);
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export async function clearAllStorage() {
  try {
    await del(STORAGE_KEY);
  } catch (err) {
    console.warn('IndexedDB delete error:', err);
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('LocalStorage delete error:', err);
  }
}

export const PRESET_COLUMNS = [
  {
    name: 'Standard Doctor Visit',
    columns: [
      { id: 'p_1', name: 'Time', type: 'time' },
      { id: 'p_2', name: 'Doctor Name', type: 'text' },
      { id: 'p_3', name: 'Date', type: 'date' },
      { id: 'p_4', name: 'Category', type: 'text' },
      { id: 'p_5', name: 'Qualification', type: 'select', options: ['MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh', 'BAMS', 'BHMS'] },
      { id: 'p_6', name: 'Contact No', type: 'phone' }
    ]
  },
  {
    name: 'Pharmacy / Retail Audit',
    columns: [
      { id: 'pa_1', name: 'Chemist / Pharmacy Name', type: 'text' },
      { id: 'pa_2', name: 'Contact Person / Pharmacist', type: 'text' },
      { id: 'pa_3', name: 'Location / Area', type: 'text' },
      { id: 'pa_4', name: 'Stock Status', type: 'select', options: ['Sufficient', 'Low Stock', 'Out of Stock', 'Competitor Brand High'] },
      { id: 'pa_5', name: 'Order Placed (Units)', type: 'number' },
      { id: 'pa_6', name: 'Key Prescribing Doctors Nearby', type: 'text' },
      { id: 'pa_7', name: 'Visit Date', type: 'date' }
    ]
  }
];
