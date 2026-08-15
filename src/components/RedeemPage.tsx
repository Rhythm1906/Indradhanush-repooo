import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SinusoidLogo } from './SinusoidLogo';
import { CertificatePreview } from './CertificatePreview';
import { findRecordByName, markRecordRedeemed } from '../utils/storage';
import { downloadCertificatePDF } from '../utils/pdfGenerator';
import { DonationRecord, CertificateTemplate } from '../types';
import { Download, AlertCircle } from 'lucide-react';

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

  useEffect(() => {
    if (initialNameQuery && initialNameQuery.trim()) {
      handleVerify(initialNameQuery);
    }
  }, [initialNameQuery]);

  const handleVerify = async (nameToSearch: string) => {
    const query = nameToSearch.trim();
    setErrorMessage('');
    if (!query) {
      setErrorMessage('Please enter your full name as registered.');
      return;
    }

    setIsVerifying(true);
    setHasSearched(true);

    try {
      const match = await findRecordByName(query);
      if (match) {
        setVerifiedRecord(match);
        markRecordRedeemed(match.id);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#ffffff'],
          });
        } catch (e) {}
      } else {
        setVerifiedRecord(null);
        setErrorMessage(
          `No donation record found for "${query}". Please verify exact spelling or register first.`
        );
      }
    } catch (err) {
      setErrorMessage('Failed to search records. Please check your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = async () => {
    if (!verifiedRecord) return;
    setIsDownloading(true);
    try {
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
    <div className="min-h-screen bg-[#1242c7] text-white flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Top Header with Logo in corner */}
      <div className="absolute top-4 left-4 z-10">
        <SinusoidLogo size="sm" onClick={handleReset} />
      </div>

      {!verifiedRecord ? (
        <div className="w-full max-w-md mx-auto my-auto py-8 z-10 animate-in fade-in duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(fullName);
            }}
            className="space-y-6 text-center"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">
                Enter your full name
              </h2>
              <input
                type="text"
                autoFocus
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jonathan Patterson"
                className="w-full h-13 px-4 rounded-xl bg-[#3559bf] border-2 border-black/40 text-white placeholder-blue-200/50 text-xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-200 text-sm flex items-start gap-2.5 text-left">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:w-64 h-12 rounded-full bg-[#3eb370] hover:bg-[#34a362] active:bg-[#2c8e54] text-white font-bold text-lg tracking-wider uppercase transition-all shadow-lg hover:shadow-emerald-900/30 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      ) : (
        <div className="w-full max-w-4xl mx-auto my-auto py-4 z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <CertificatePreview
            record={verifiedRecord}
            template={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />

          <div className="pt-6 flex flex-col items-center">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-8 sm:px-12 h-13 rounded-full bg-[#3eb370] hover:bg-[#34a362] active:bg-[#2c8e54] text-white font-bold text-lg sm:text-xl tracking-wider uppercase transition-all shadow-2xl hover:shadow-emerald-900/40 transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
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