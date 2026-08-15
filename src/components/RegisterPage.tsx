import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { SinusoidLogo } from './SinusoidLogo';
import { saveRecord } from '../utils/storage';
import { DonationRecord } from '../types';
import { CheckCircle, QrCode, ArrowRight, Download, Copy, Sparkles, ExternalLink, Printer, Plus } from 'lucide-react';

interface RegisterPageProps {
  onNavigateToRedeem: (prefillName?: string) => void;
  onOpenSpreadsheet: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToRedeem,
  onOpenSpreadsheet,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [enrollNo, setEnrollNo] = useState('');
  const [donationItem, setDonationItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Registered Success Modal State
  const [registeredRecord, setRegisteredRecord] = useState<DonationRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter the donator\'s full name.');
      return;
    }
    if (!role.trim()) {
      setErrorMessage('Please enter the role (e.g., Sponsor, Volunteer, Contributor).');
      return;
    }
    if (!donationItem.trim()) {
      setErrorMessage('Please specify what was donated.');
      return;
    }

    setIsLoading(true);

    try {
      const newRecord = saveRecord({
        name: name.trim(),
        role: role.trim(),
        enrollNo: enrollNo.trim() || undefined,
        donationItem: donationItem.trim(),
      });

      setRegisteredRecord(newRecord);
      // Reset form
      setName('');
      setRole('');
      setEnrollNo('');
      setDonationItem('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to register donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRedeemUrl = (rec: DonationRecord) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    // Format full redeem URL with prefill query
    return `${origin}${pathname}#/redeem?name=${encodeURIComponent(rec.name)}&id=${rec.id}`;
  };

  const handleCopyLink = () => {
    if (!registeredRecord) return;
    const url = getRedeemUrl(registeredRecord);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!registeredRecord) return;
    const svgElement = document.getElementById(`qr-code-${registeredRecord.id}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(img, 50, 50, 500, 500);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${registeredRecord.name.replace(/\s+/g, '_')}.png`;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-[#1242c7] text-white flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Top Bar with SINUSOID VX Logo on top left (matching screenshot 1) */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10">
        <SinusoidLogo size="md" />
      </div>

      {/* Main Registration Box (Exact match to Screenshot 1) */}
      <div className="w-full max-w-lg mx-auto my-auto py-8 z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jonathan Patterson"
              className="w-full h-13 px-4 rounded-xl bg-[#3559bf] border-2 border-black/40 text-white placeholder-blue-200/50 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
            />
          </div>

          {/* Role Field */}
          <div className="space-y-1.5">
            <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide">
              Role
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Contributor, Volunteer, Sponsor"
              className="w-full h-13 px-4 rounded-xl bg-[#3559bf] border-2 border-black/40 text-white placeholder-blue-200/50 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
            />
          </div>

          {/* Enroll No (Optional) Field */}
          <div className="space-y-1.5">
            <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide">
              Enroll No (Optional)
            </label>
            <input
              type="text"
              value={enrollNo}
              onChange={(e) => setEnrollNo(e.target.value)}
              placeholder="e.g. 2026-ENG-8849"
              className="w-full h-13 px-4 rounded-xl bg-[#3559bf] border-2 border-black/40 text-white placeholder-blue-200/50 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
            />
          </div>

          {/* What did they donate */}
          <div className="space-y-1.5">
            <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide">
              What did they donate
            </label>
            <input
              type="text"
              required
              value={donationItem}
              onChange={(e) => setDonationItem(e.target.value)}
              placeholder="e.g. Tech Hardware, Books, Funds, Equipment"
              className="w-full h-13 px-4 rounded-xl bg-[#3559bf] border-2 border-black/40 text-white placeholder-blue-200/50 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-900/60 border border-rose-500/50 rounded-xl text-rose-200 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Green ENTER Button (Exact visual style from Screenshot 1) */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-64 h-12 rounded-full bg-[#3eb370] hover:bg-[#34a362] active:bg-[#2c8e54] text-white font-bold text-lg tracking-wider uppercase transition-all shadow-lg hover:shadow-emerald-900/30 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'ENTER'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Registration & QR Code Modal */}
      {registeredRecord && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#163fa8] to-[#0c2b7a] border-2 border-emerald-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-300">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Registration Complete!</h3>
              <p className="text-blue-200 text-sm">
                Saved to database and ready for certificate redemption.
              </p>
            </div>

            {/* Donor Summary Card */}
            <div className="my-5 bg-[#0e2768]/80 rounded-2xl p-4 border border-blue-400/20 text-sm space-y-2">
              <div className="flex justify-between border-b border-blue-400/10 pb-1.5">
                <span className="text-blue-300">Donator:</span>
                <span className="font-bold text-white text-base">{registeredRecord.name}</span>
              </div>
              <div className="flex justify-between border-b border-blue-400/10 pb-1.5">
                <span className="text-blue-300">Role:</span>
                <span className="text-white">{registeredRecord.role}</span>
              </div>
              <div className="flex justify-between border-b border-blue-400/10 pb-1.5">
                <span className="text-blue-300">Donation:</span>
                <span className="text-emerald-300 font-semibold">{registeredRecord.donationItem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">Certificate ID:</span>
                <span className="font-mono text-amber-300 font-medium">{registeredRecord.id}</span>
              </div>
            </div>

            {/* Generated QR Code */}
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-inner mx-auto w-fit">
              <QRCodeSVG
                id={`qr-code-${registeredRecord.id}`}
                value={getRedeemUrl(registeredRecord)}
                size={180}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: '',
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              <p className="text-stone-600 text-xs font-mono mt-3 font-semibold text-center">
                Scan to redeem certificate
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Direct Test Redeem Button */}
              <button
                type="button"
                onClick={() => onNavigateToRedeem(registeredRecord.name)}
                className="w-full py-3 bg-[#3eb370] hover:bg-[#34a362] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Go to Redeem Page Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setRegisteredRecord(null)}
                className="w-full py-2 text-blue-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                + Register Another Donator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
