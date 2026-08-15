import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './Navbar';
import { CertificatePreview } from './CertificatePreview';
import { findRecordByName, markRecordRedeemed } from '../utils/storage';
import { downloadCertificatePDF } from '../utils/pdfGenerator';
import { DonationRecord, CertificateTemplate } from '../types';
import { ArrowLeft, Download, RotateCcw, AlertCircle, CheckCircle2, Share2, Sparkles } from 'lucide-react';

interface RedeemPageProps {
  initialNameQuery?: string;
  onNavigateToRegister: () => void;
  onOpenSpreadsheet: () => void;
}

export const RedeemPage: React.FC<RedeemPageProps> = ({
  initialNameQuery = '',
  onNavigateToRegister,
  onOpenSpreadsheet,
}) => {
  const [fullName, setFullName] = useState(initialNameQuery);
  const [verifiedRecord, setVerifiedRecord] = useState<DonationRecord | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate>('modern-gold');
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-verify if prefilled from QR code scan
  useEffect(() => {
    if (initialNameQuery && initialNameQuery.trim()) {
      handleVerify(initialNameQuery);
    }
  }, [initialNameQuery]);

  const handleVerify = (nameToSearch: string) => {
    const query = nameToSearch.trim();
    setErrorMessage('');
    if (!query) {
      setErrorMessage('Please enter your full name as registered.');
      return;
    }

    setIsVerifying(true);
    setHasSearched(true);

    setTimeout(() => {
      const match = findRecordByName(query);
      if (match) {
        setVerifiedRecord(match);
        markRecordRedeemed(match.id);

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#ffffff'],
          });
        } catch (e) {
          // ignore if canvas not ready
        }
      } else {
        setVerifiedRecord(null);
        setErrorMessage(
          `No donation record found for "${query}". Please verify exact spelling or register first.`
        );
      }
      setIsVerifying(false);
    }, 350);
  };

  const handleDownload = async () => {
    if (!verifiedRecord) return;
    setIsDownloading(true);
    try {
      // Confetti burst on download
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch (e) {}

      await downloadCertificatePDF(verifiedRecord, selectedTemplate);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setVerifiedRecord(null);
    setHasSearched(false);
    setFullName('');
    setErrorMessage('');
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-8 select-none relative z-10">
      {/* Top Navbar with SINUSOID VX & Indradhanush Logos */}
      <Navbar onLogoClick={handleReset} className="mb-4 sm:mb-0" />

      {/* Main Content Area */}
      {!verifiedRecord ? (
        /* Enter your full name in Glass Box with Blackish Shade */
        <div className="w-full max-w-md mx-auto my-auto py-6 z-10 animate-in fade-in duration-200">
          <div className="relative rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 p-6 sm:p-9 shadow-2xl shadow-black/70 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none">
            {/* Subtle colorful ambient blur shades */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(fullName);
              }}
              className="relative z-10 space-y-6 text-center"
            >
              {/* Input Label */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-wide drop-shadow-md">
                  Enter your full name
                </h2>
                <input
                  type="text"
                  autoFocus
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jonathan Patterson"
                  className="w-full h-13 px-4 rounded-xl bg-black/50 hover:bg-black/60 focus:bg-black/70 border border-white/20 focus:border-emerald-400 text-white placeholder-white/40 text-xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition-all shadow-inner backdrop-blur-md"
                />
              </div>

              {/* Error feedback */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-sm flex items-start gap-2.5 text-left backdrop-blur-md">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p>{errorMessage}</p>
                    <p className="mt-1 text-xs text-blue-200">
                      Tip: Try searching for pre-loaded demo name{' '}
                      <strong
                        className="underline cursor-pointer text-amber-300 font-bold"
                        onClick={() => {
                          setFullName('Jonathan Patterson');
                          handleVerify('Jonathan Patterson');
                        }}
                      >
                        "Jonathan Patterson"
                      </strong>{' '}
                      or check the spreadsheet.
                    </p>
                  </div>
                </div>
              )}

              {/* Green ENTER Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full sm:w-64 h-12 rounded-full bg-[#3eb370] hover:bg-[#34a362] active:bg-[#2c8e54] text-white font-bold text-lg tracking-wider uppercase transition-all shadow-lg hover:shadow-emerald-500/30 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'ENTER'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Certificate Preview directly on page */
        <div className="w-full max-w-4xl mx-auto my-auto py-4 z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <CertificatePreview
            record={verifiedRecord}
            template={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />

          {/* Green Download Button */}
          <div className="pt-6 flex flex-col items-center">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-8 sm:px-12 h-13 rounded-full bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white font-bold text-lg sm:text-xl tracking-wider uppercase transition-all shadow-2xl hover:shadow-green-900/50 transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>GENERATING PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>CLICK HERE TO DOWNLOAD</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
