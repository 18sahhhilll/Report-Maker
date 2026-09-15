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
      { id: 'col_1', name: 'Doctor Name', type: 'text', required: true },
      { id: 'col_2', name: 'Specialty', type: 'select', options: ['Cardiology', 'Internal Medicine', 'General Physician', 'Pediatrics', 'Orthopedics', 'Diabetology'] },
      { id: 'col_3', name: 'Hospital / Clinic', type: 'text' },
      { id: 'col_4', name: 'Products Discussed', type: 'text' },
      { id: 'col_5', name: 'Samples Provided (Units)', type: 'number' },
      { id: 'col_6', name: 'Visit Date', type: 'date' },
      { id: 'col_7', name: 'Call Outcome', type: 'select', options: ['Interested', 'Prescribing', 'Follow-up Needed', 'Busy / Rescheduled'] },
      { id: 'col_8', name: 'Notes & Follow-up', type: 'text' }
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
      { id: 'p_1', name: 'Doctor Name', type: 'text' },
      { id: 'p_2', name: 'Specialty', type: 'select', options: ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'ENT', 'Gynecology'] },
      { id: 'p_3', name: 'Hospital / Clinic', type: 'text' },
      { id: 'p_4', name: 'Products Discussed', type: 'text' },
      { id: 'p_5', name: 'Samples / Promos Given', type: 'text' },
      { id: 'p_6', name: 'Visit Date', type: 'date' },
      { id: 'p_7', name: 'Call Outcome', type: 'select', options: ['Positive', 'Needs Follow-up', 'Not Interested', 'Sample Given'] },
      { id: 'p_8', name: 'Remarks & Next Action', type: 'text' }
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
