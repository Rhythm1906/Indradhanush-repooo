import React, { useState } from 'react';
import { SinusoidLogo } from './SinusoidLogo';
import { saveRecord } from '../utils/storage';
import { DonationRecord } from '../types';
import { CheckCircle } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage("Please enter the donator's full name.");
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
      const newRecord = await saveRecord({
        name: name.trim(),
        role: role.trim(),
        enrollNo: enrollNo.trim() || '-',
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

  return (
    <div className="min-h-screen bg-[#1242c7] text-white flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Top Bar with SINUSOID VX Logo */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10">
        <SinusoidLogo size="md" />
      </div>

      {/* Main Registration Box */}
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

          {/* Green ENTER Button */}
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

      {/* Success Registration Modal */}
      {registeredRecord && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#163fa8] to-[#0c2b7a] border-2 border-emerald-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-300">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Registration Complete!</h3>
              <p className="text-blue-100 text-sm">
                Your details have been saved and will appear in the donation sheet.
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setRegisteredRecord(null)}
                className="px-5 py-2.5 bg-[#3eb370] hover:bg-[#34a362] text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};