import { DonationRecord, GoogleSheetConfig } from '../types';

const STORAGE_KEY_RECORDS = 'sinusoid_donation_records';
const STORAGE_KEY_CONFIG = 'sinusoid_gsheet_config';

export const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/0daxof63tarzp';

export function getStoredRecords(): DonationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse records', e);
  }
  return [];
}

export function saveStoredRecords(records: DonationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records:', err);
  }
}

export function getGoogleSheetConfig(): GoogleSheetConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        webhookUrl: parsed.webhookUrl || SHEETDB_API_URL,
        enabled: parsed.enabled !== undefined ? parsed.enabled : true,
      };
    }
  } catch {}

  return {
    webhookUrl: SHEETDB_API_URL,
    enabled: true,
  };
}

export function saveGoogleSheetConfig(config: GoogleSheetConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}

export async function syncRecordToGoogleSheets(
  record: Partial<DonationRecord>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            name: record.name || '',
            role: record.role || '',
            'enrollment no': record.enrollNo || '-',
            donation: record.donationItem || '',
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SheetDB responded with status ${response.status}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error('SheetDB Sync Error:', err);
    return { success: false, error: err?.message || 'Sync failed' };
  }
}

export async function saveRecord(
  data: Omit<DonationRecord, 'id' | 'dateStr' | 'timestamp' | 'redeemed'>
): Promise<DonationRecord> {
  const now = new Date();
  const id = `SINU-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRecord: DonationRecord = {
    ...data,
    id,
    dateStr: now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    timestamp: now.toISOString(),
    redeemed: false,
    qrPayload: `SINUSOID_VERIFY_${id}`,
  };

  // 1. Save locally in browser
  const existing = getStoredRecords();
  saveStoredRecords([newRecord, ...existing]);

  // 2. Push to Google Sheets via SheetDB API
  await syncRecordToGoogleSheets(newRecord);

  return newRecord;
}

export function findRecordByName(name: string): DonationRecord | null {
  const records = getStoredRecords();
  const query = name.trim().toLowerCase();
  return records.find((r) => r.name.trim().toLowerCase() === query) || null;
}

export function markRecordRedeemed(id: string): boolean {
  const records = getStoredRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index].redeemed = true;
    records[index].redeemedAt = new Date().toISOString();
    saveStoredRecords(records);
    return true;
  }
  return false;
}