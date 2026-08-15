import React, { useState } from 'react';
import { Navbar } from './Navbar';
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
    <div className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-8 select-none relative z-10">
      {/* Top Navbar with SINUSOID VX & Indradhanush Logos */}
      <Navbar className="mb-4 sm:mb-0" />

      {/* Main Registration Box wrapped in Transparent Glass Div with Blackish Shade */}
      <div className="w-full max-w-lg mx-auto my-auto py-6 z-10">
        <div className="relative rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 p-6 sm:p-9 shadow-2xl shadow-black/70 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none">
          {/* Subtle colorful ambient blur shades for depth */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide drop-shadow-md">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jonathan Patterson"
                className="w-full h-13 px-4 rounded-xl bg-black/50 hover:bg-black/60 focus:bg-black/70 border border-white/20 focus:border-emerald-400 text-white placeholder-white/40 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition-all shadow-inner backdrop-blur-md"
              />
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide drop-shadow-md">
                Role
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Contributor, Volunteer, Sponsor"
                className="w-full h-13 px-4 rounded-xl bg-black/50 hover:bg-black/60 focus:bg-black/70 border border-white/20 focus:border-emerald-400 text-white placeholder-white/40 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition-all shadow-inner backdrop-blur-md"
              />
            </div>

            {/* Enroll No (Optional) Field */}
            <div className="space-y-1.5">
              <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide drop-shadow-md">
                Enroll No (Optional)
              </label>
              <input
                type="text"
                value={enrollNo}
                onChange={(e) => setEnrollNo(e.target.value)}
                placeholder="e.g. 2026-ENG-8849"
                className="w-full h-13 px-4 rounded-xl bg-black/50 hover:bg-black/60 focus:bg-black/70 border border-white/20 focus:border-emerald-400 text-white placeholder-white/40 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition-all shadow-inner backdrop-blur-md"
              />
            </div>

            {/* What did they donate */}
            <div className="space-y-1.5">
              <label className="block text-white font-semibold text-lg sm:text-xl tracking-wide drop-shadow-md">
                What did they donate
              </label>
              <input
                type="text"
                required
                value={donationItem}
                onChange={(e) => setDonationItem(e.target.value)}
                placeholder="e.g. Tech Hardware, Books, Funds, Equipment"
                className="w-full h-13 px-4 rounded-xl bg-black/50 hover:bg-black/60 focus:bg-black/70 border border-white/20 focus:border-emerald-400 text-white placeholder-white/40 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition-all shadow-inner backdrop-blur-md"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-sm backdrop-blur-md">
                {errorMessage}
              </div>
            )}

            {/* Green ENTER Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-64 h-12 rounded-full bg-[#3eb370] hover:bg-[#34a362] active:bg-[#2c8e54] text-white font-bold text-lg tracking-wider uppercase transition-all shadow-lg hover:shadow-emerald-500/30 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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