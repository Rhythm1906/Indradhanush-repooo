export interface DonationRecord {
  id: string;
  name: string;
  role: string;
  enrollNo?: string;
  donationItem: string;
  timestamp: number;
  dateStr: string;
  qrPayload: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export type CertificateTemplate = 'modern-gold' | 'vintage-classic';

export interface GoogleSheetConfig {
  webhookUrl: string;
  sheetName: string;
  enabled: boolean;
  lastSyncedAt?: number;
}
