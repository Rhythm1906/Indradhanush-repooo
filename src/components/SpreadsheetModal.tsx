import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { DonationRecord, GoogleSheetConfig } from '../types';
import {
  getStoredRecords,
  getGoogleSheetConfig,
  saveGoogleSheetConfig,
  syncRecordToGoogleSheets,
} from '../utils/storage';
import {
  X,
  FileSpreadsheet,
  Download,
  Link2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  ExternalLink,
  Copy,
  Plus,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface SpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecordToRedeem: (name: string) => void;
}

export const SpreadsheetModal: React.FC<SpreadsheetModalProps> = ({
  isOpen,
  onClose,
  onSelectRecordToRedeem,
}) => {
  const [records, setRecords] = useState<DonationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'records' | 'googlesheet' | 'qrcodes'>('records');
  const [googleConfig, setGoogleConfig] = useState<GoogleSheetConfig>(getGoogleSheetConfig());
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRecords(getStoredRecords());
      setGoogleConfig(getGoogleSheetConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.donationItem.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (r.enrollNo && r.enrollNo.toLowerCase().includes(searchFilter.toLowerCase())) ||
      r.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleExportExcel = () => {
    const dataForSheet = records.map((r) => ({
      'Certificate ID': r.id,
      'Full Name': r.name,
      'Role': r.role,
      'Enrollment No': r.enrollNo || 'N/A',
      'What Did They Donate': r.donationItem,
      'Registration Date': r.dateStr,
      'Redeemed Status': r.redeemed ? 'Redeemed' : 'Pending',
      'Redeemed Date': r.redeemedAt || 'N/A',
      'QR Verification Payload': r.qrPayload,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Donations');

    // Auto fit column width
    worksheet['!cols'] = [
      { wch: 16 },
      { wch: 24 },
      { wch: 20 },
      { wch: 18 },
      { wch: 30 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 35 },
    ];

    XLSX.writeFile(workbook, `SINUSOID_VX_Donations_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleExportCSV = () => {
    const dataForSheet = records.map((r) => ({
      'Certificate ID': r.id,
      'Full Name': r.name,
      'Role': r.role,
      'Enrollment No': r.enrollNo || 'N/A',
      'What Did They Donate': r.donationItem,
      'Registration Date': r.dateStr,
      'Redeemed Status': r.redeemed ? 'Redeemed' : 'Pending',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SINUSOID_VX_Donations.csv`;
    link.click();
  };

  const handleSaveGoogleConfig = () => {
    saveGoogleSheetConfig(googleConfig);
    setSyncStatusMsg('Configuration saved successfully!');
    setTimeout(() => setSyncStatusMsg(''), 3000);
  };

  const handleTestSyncAll = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Pushing all rows to Google Sheet webhook...');
    let successCount = 0;
    for (const rec of records) {
      const res = await syncRecordToGoogleSheets(rec);
      if (res.success) successCount++;
    }
    setIsSyncing(false);
    setSyncStatusMsg(`Successfully sent ${successCount} records to Google Sheet.`);
    setTimeout(() => setSyncStatusMsg(''), 4000);
  };

  const googleAppsScriptCode = `// --- GOOGLE APPS SCRIPT FOR SINUSOID VX ---
// 1. Open your Google Sheet -> Extensions -> Apps Script
// 2. Paste this code -> Click Deploy -> New Deployment -> Web App
// 3. Set "Who has access" to "Anyone"
// 4. Copy the Web App URL and paste it into the Webhook URL field in the app.

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Name", "Role", "Enroll No", "Donation Item", "Date", "QR Payload", "Timestamp"]);
      sheet.getRange("1:1").setFontWeight("bold").setBackground("#1242c7").setFontColor("#ffffff");
    }
    
    sheet.appendRow([
      data.id || "",
      data.name || "",
      data.role || "",
      data.enrollNo || "N/A",
      data.donationItem || "",
      data.date || new Date().toLocaleDateString(),
      data.qrPayload || "",
      data.timestamp || new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-[#0f2d8a] border-2 border-blue-400/40 rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-blue-400/20 flex items-center justify-between bg-[#0b2470]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/40 border border-blue-400 flex items-center justify-center text-blue-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Google Sheets & Excel Database
              </h2>
              <p className="text-xs text-blue-200">
                {records.length} registered donators &bull; Live Sheet Synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Sub-Nav Tabs */}
        <div className="px-6 pt-3 border-b border-blue-400/20 bg-[#0e2a80] flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors ${
              activeTab === 'records'
                ? 'bg-[#1239aa] text-white border-t-2 border-emerald-400'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Donations Table ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('googlesheet')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors ${
              activeTab === 'googlesheet'
                ? 'bg-[#1239aa] text-white border-t-2 border-emerald-400'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Google Sheets Live Sync
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qrcodes')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors ${
              activeTab === 'qrcodes'
                ? 'bg-[#1239aa] text-white border-t-2 border-emerald-400'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            QR Badges & Verification Cards
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#1239aa]/40">
          {activeTab === 'records' && (
            <div className="space-y-4">
              {/* Search & Export Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <input
                  type="text"
                  placeholder="Filter by name, role, donation, or ID..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-[#0e2768] border border-blue-400/30 text-white placeholder-blue-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:w-80"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Full Excel (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-blue-400/20 bg-[#0e256b]/80 shadow-lg">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-blue-400/30 bg-[#0a1e56] text-blue-200 text-xs uppercase tracking-wider font-semibold">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Donator Name</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Enroll No</th>
                      <th className="p-3.5">What Did They Donate</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-400/10 text-white/90">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-blue-200">
                          No donation records match your search query.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-blue-600/20 transition-colors">
                          <td className="p-3.5 font-mono text-xs text-amber-300 font-semibold">{r.id}</td>
                          <td className="p-3.5 font-bold text-white text-base">{r.name}</td>
                          <td className="p-3.5">{r.role}</td>
                          <td className="p-3.5 font-mono text-xs text-blue-200">{r.enrollNo || '-'}</td>
                          <td className="p-3.5">
                            <span className="bg-blue-900/60 text-emerald-300 px-2.5 py-1 rounded-md text-xs font-semibold border border-emerald-400/20">
                              {r.donationItem}
                            </span>
                          </td>
                          <td className="p-3.5 text-xs text-blue-200">{r.dateStr}</td>
                          <td className="p-3.5">
                            {r.redeemed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Redeemed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                <span>Pending</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectRecordToRedeem(r.name);
                                onClose();
                              }}
                              className="px-3 py-1 bg-[#3eb370] hover:bg-[#34a362] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                            >
                              Redeem Certificate
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'googlesheet' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-[#0b2470] border border-blue-400/30 rounded-2xl p-5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-emerald-400" />
                  <span>Connect Real Google Sheets via Webhook</span>
                </h3>
                <p className="text-sm text-blue-200 leading-relaxed">
                  Every time a new donation is registered, this app can automatically append a row to your live Google Sheet using a free Google Apps Script Webhook.
                </p>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-300">
                    Google Apps Script Webhook URL:
                  </label>
                  <input
                    type="url"
                    value={googleConfig.webhookUrl}
                    onChange={(e) =>
                      setGoogleConfig({ ...googleConfig, webhookUrl: e.target.value })
                    }
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#081b53] border border-blue-400/40 text-white placeholder-blue-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={googleConfig.enabled}
                        onChange={(e) =>
                          setGoogleConfig({ ...googleConfig, enabled: e.target.checked })
                        }
                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
                      />
                      <span>Enable live auto-sync to Google Sheet upon registration</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveGoogleConfig}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Save Configuration
                  </button>

                  <button
                    type="button"
                    onClick={handleTestSyncAll}
                    disabled={isSyncing || !googleConfig.webhookUrl}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Push All Existing Records to Sheet</span>
                  </button>
                </div>

                {syncStatusMsg && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs rounded-xl">
                    {syncStatusMsg}
                  </div>
                )}
              </div>

              {/* Step-by-step Setup Guide */}
              <div className="bg-[#0b2470] border border-blue-400/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-amber-300">
                    How to setup Google Sheets in 2 minutes:
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(googleAppsScriptCode);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2500);
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-300" />
                    <span>{copiedScript ? 'Copied Apps Script!' : 'Copy Apps Script'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside text-xs sm:text-sm text-blue-200 space-y-1.5 leading-relaxed">
                  <li>Create a new spreadsheet at <strong className="text-white">sheets.google.com</strong>.</li>
                  <li>Click <strong className="text-white">Extensions &gt; Apps Script</strong>.</li>
                  <li>Paste the script below, replace any default code, and click <strong className="text-white">Save</strong>.</li>
                  <li>Click <strong className="text-white">Deploy &gt; New Deployment</strong>, select type <strong className="text-white">Web app</strong>.</li>
                  <li>Set <strong className="text-white">Who has access</strong> to <strong className="text-white">Anyone</strong> and deploy.</li>
                  <li>Copy the resulting Web App URL and paste it into the field above!</li>
                </ol>

                <div className="relative">
                  <pre className="bg-[#06143c] p-4 rounded-xl text-[11px] font-mono text-emerald-300/90 overflow-x-auto border border-blue-400/20 max-h-48">
                    {googleAppsScriptCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qrcodes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredRecords.map((r) => {
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
                const redeemUrl = `${origin}${pathname}#/redeem?name=${encodeURIComponent(r.name)}&id=${r.id}`;

                return (
                  <div
                    key={r.id}
                    className="bg-[#0e2768] border border-blue-400/30 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 shadow-lg"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-inner">
                      <QRCodeSVG value={redeemUrl} size={130} level="M" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{r.name}</h4>
                      <p className="text-xs text-blue-200">{r.role}</p>
                      <p className="text-xs text-emerald-300 font-medium mt-0.5">{r.donationItem}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRecordToRedeem(r.name);
                        onClose();
                      }}
                      className="w-full py-1.5 bg-[#3eb370] hover:bg-[#34a362] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Redeem Certificate
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
