import { DonationRecord, GoogleSheetConfig } from '../types';

const STORAGE_KEY = 'sinusoid_donations_records_v1';
const GOOGLE_SHEET_CONFIG_KEY = 'sinusoid_google_sheet_cfg_v1';

// Initial preloaded mock data to let user test immediately matching screenshot 3
const INITIAL_RECORDS: DonationRecord[] = [
  {
    id: 'DON-2026-001',
    name: 'Jonathan Patterson',
    role: 'Lead Contributor & Sponsor',
    enrollNo: 'ENR-2026-9042',
    donationItem: 'Tech Hardware & Community Fund',
    timestamp: Date.now() - 86400000 * 2,
    dateStr: 'August 12, 2026',
    qrPayload: 'Jonathan Patterson|DON-2026-001',
    redeemed: true,
    redeemedAt: 'August 13, 2026',
  },
  {
    id: 'DON-2026-002',
    name: 'Sarah Jenkins',
    role: 'Volunteer Organizer',
    enrollNo: 'ENR-2026-3318',
    donationItem: 'Logistics and Event Materials',
    timestamp: Date.now() - 86400000,
    dateStr: 'August 13, 2026',
    qrPayload: 'Sarah Jenkins|DON-2026-002',
    redeemed: false,
  },
  {
    id: 'DON-2026-003',
    name: 'Marcus Vance',
    role: 'Participant & Supporter',
    enrollNo: 'ENR-2026-7781',
    donationItem: 'Workshop Supplies',
    timestamp: Date.now() - 3600000 * 5,
    dateStr: 'August 14, 2026',
    qrPayload: 'Marcus Vance|DON-2026-003',
    redeemed: false,
  },
];

export function getStoredRecords(): DonationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load donation records:', e);
    return INITIAL_RECORDS;
  }
}

export function saveRecord(record: Omit<DonationRecord, 'id' | 'timestamp' | 'dateStr' | 'qrPayload' | 'redeemed'>): DonationRecord {
  const records = getStoredRecords();
  const id = `DON-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, '0')}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const newRecord: DonationRecord = {
    ...record,
    id,
    timestamp: Date.now(),
    dateStr,
    qrPayload: `${record.name}|${id}`,
    redeemed: false,
  };

  const updated = [newRecord, ...records];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  // Attempt async sync to Google Sheets if configured
  syncRecordToGoogleSheets(newRecord).catch((err) => {
    console.warn('Google Sheets sync attempted:', err);
  });

  return newRecord;
}

export function markRecordRedeemed(id: string): void {
  const records = getStoredRecords();
  const updated = records.map((r) =>
    r.id === id
      ? {
          ...r,
          redeemed: true,
          redeemedAt: new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        }
      : r
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update redeemed status:', e);
  }
}

export function findRecordByName(nameQuery: string): DonationRecord | null {
  const records = getStoredRecords();
  const normalized = nameQuery.trim().toLowerCase();
  if (!normalized) return null;

  // Exact or case-insensitive match first
  const exact = records.find((r) => r.name.trim().toLowerCase() === normalized);
  if (exact) return exact;

  // Partial match fallback if query is at least 3 chars
  if (normalized.length >= 3) {
    const partial = records.find(
      (r) =>
        r.name.toLowerCase().includes(normalized) ||
        normalized.includes(r.name.toLowerCase())
    );
    if (partial) return partial;
  }

  return null;
}

export function getGoogleSheetConfig(): GoogleSheetConfig {
  try {
    const raw = localStorage.getItem(GOOGLE_SHEET_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    webhookUrl: '',
    sheetName: 'Donations_SINUSOID_VX',
    enabled: false,
  };
}

export function saveGoogleSheetConfig(cfg: GoogleSheetConfig): void {
  try {
    localStorage.setItem(GOOGLE_SHEET_CONFIG_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.error(e);
  }
}

export async function syncRecordToGoogleSheets(record: DonationRecord): Promise<{ success: boolean; message: string }> {
  const config = getGoogleSheetConfig();
  if (!config.enabled || !config.webhookUrl) {
    return { success: false, message: 'Google Sheets sync is not enabled or URL is missing.' };
  }

  try {
    const payload = {
      id: record.id,
      name: record.name,
      role: record.role,
      enrollNo: record.enrollNo || 'N/A',
      donationItem: record.donationItem,
      date: record.dateStr,
      qrPayload: record.qrPayload,
      timestamp: new Date(record.timestamp).toISOString(),
    };

    // Google Apps Script Webhook uses POST
    const res = await fetch(config.webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // standard for Google Apps Script Webhooks
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return { success: true, message: 'Dispatched to Google Sheet Webhook' };
  } catch (error: any) {
    console.error('Error syncing to Google Sheet:', error);
    return { success: false, message: error.message || 'Sync failed' };
  }
}
