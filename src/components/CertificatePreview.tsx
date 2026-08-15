import React, { useState } from 'react';
import { DonationRecord, CertificateTemplate } from '../types';
import { Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificatePreviewProps {
  record: DonationRecord;
  template?: CertificateTemplate;
  onTemplateChange?: (t: CertificateTemplate) => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  record,
  template = 'modern-gold',
  onTemplateChange,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<CertificateTemplate>(template);

  const handleToggle = (newTemplate: CertificateTemplate) => {
    setActiveTemplate(newTemplate);
    if (onTemplateChange) onTemplateChange(newTemplate);
  };

  const dateObj = new Date(record.timestamp);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Certificate Container */}
      <div className="w-full max-w-[760px] aspect-[1.414/1] bg-white rounded-2xl shadow-2xl p-6 sm:p-9 relative overflow-hidden text-stone-800 select-none border border-white/40">
        {activeTemplate === 'modern-gold' ? (
          /* Modern Gold Template Matching Screenshot 3 */
          <div className="relative w-full h-full flex flex-col justify-between items-center text-center p-2 border border-amber-300/60 rounded-xl">
            {/* Top-Right Burgundy/Gold Angled Geometries */}
            <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none rounded-tr-xl">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#700e1c] rotate-45 transform origin-bottom-left shadow-md"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#c89832] rotate-45 transform origin-bottom-left"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#8c1626] rotate-45 transform origin-bottom-left"></div>
            </div>

            {/* Bottom-Left Burgundy/Gold Angled Geometries */}
            <div className="absolute bottom-0 left-0 w-36 h-36 overflow-hidden pointer-events-none rounded-bl-xl">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#700e1c] rotate-45 transform origin-top-right shadow-md"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#c89832] rotate-45 transform origin-top-right"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-[#8c1626] rotate-45 transform origin-top-right"></div>
            </div>

            {/* Corner Filigrees / Ornaments */}
            <div className="absolute top-2 left-2 text-[#c89832] opacity-80 pointer-events-none">
              <svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 5 C30 5, 50 25, 50 50 C50 25, 70 5, 95 5" />
                <path d="M5 5 C5 30, 25 50, 50 50 C25 50, 5 70, 5 95" />
                <circle cx="25" cy="25" r="4" fill="currentColor" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 text-[#c89832] opacity-80 pointer-events-none rotate-180">
              <svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 5 C30 5, 50 25, 50 50 C50 25, 70 5, 95 5" />
                <path d="M5 5 C5 30, 25 50, 50 50 C25 50, 5 70, 5 95" />
                <circle cx="25" cy="25" r="4" fill="currentColor" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </div>

            {/* Header Section */}
            <div className="pt-2 z-10">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider text-[#520914] font-serif uppercase">
                CERTIFICATE
              </h1>
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#ab7a24] font-serif uppercase mt-0.5">
                OF ACHIEVEMENT
              </h2>
            </div>

            {/* Recipient Section */}
            <div className="my-auto z-10 w-full px-8">
              <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-stone-500 uppercase mb-1">
                THIS CERTIFICATE IS PRESENTED TO
              </p>

              {/* Dynamic Name in Signature Font */}
              <div className="relative inline-block my-1.5 max-w-full">
                <h3
                  className="text-3xl sm:text-5xl md:text-6xl text-stone-800 font-normal px-6 py-1 tracking-wide"
                  style={{
                    fontFamily: "'Great Vibes', 'Alex Brush', 'Playfair Display', cursive",
                    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  {record.name}
                </h3>
                <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#ab7a24] to-transparent mx-auto mt-0.5"></div>
              </div>

              <p className="text-[11px] sm:text-xs text-stone-600 max-w-md mx-auto leading-relaxed mt-2">
                Awarded to recognize achievement, generous donation of <span className="font-semibold text-stone-800">{record.donationItem}</span>, and relentless effort that results in success.
              </p>

              {/* Details Tag */}
              <div className="mt-2 text-[10px] text-stone-500 flex items-center justify-center gap-3">
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 border border-stone-200">
                  Role: <strong className="text-stone-800">{record.role}</strong>
                </span>
                {record.enrollNo && (
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 border border-stone-200">
                    Enroll: <strong className="text-stone-800">{record.enrollNo}</strong>
                  </span>
                )}
                <span className="bg-amber-50 px-2 py-0.5 rounded text-amber-800 border border-amber-200">
                  ID: <strong className="font-mono">{record.id}</strong>
                </span>
              </div>
            </div>

            {/* Medallion Ribbon Badge */}
            <div className="relative z-10 my-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#976a16] via-[#f7d070] to-[#ffd700] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-amber-600/40 flex flex-col items-center justify-center bg-gradient-to-b from-[#fceabb] to-[#f8b500] text-[#4a2e05]">
                  <Award className="w-5 h-5 drop-shadow-sm text-[#573602]" />
                  <span className="text-[6px] font-extrabold uppercase tracking-tight -mt-0.5">SINUSOID</span>
                </div>
              </div>
            </div>

            {/* Signatures & Footer */}
            <div className="w-full flex justify-between items-end px-6 sm:px-12 pb-1 z-10">
              {/* Left Signatory */}
              <div className="text-center">
                <div className="font-serif italic text-sm sm:text-base text-stone-700 font-semibold mb-0.5">
                  Harper Russo
                </div>
                <div className="w-24 sm:w-28 h-[1px] bg-stone-400 mx-auto"></div>
                <div className="text-[8px] sm:text-[9px] font-bold tracking-wider text-stone-700 uppercase mt-1">
                  HARPER RUSSO
                </div>
                <div className="text-[7px] text-stone-500 uppercase tracking-tight">
                  HEAD OF EVENT
                </div>
              </div>

              {/* Verified Badge */}
              <div className="text-center pb-1 text-[8px] text-stone-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>Verified SINUSOID VX Official</span>
              </div>

              {/* Right Signatory */}
              <div className="text-center">
                <div className="font-serif italic text-sm sm:text-base text-stone-700 font-semibold mb-0.5">
                  Rachelle Beaudry
                </div>
                <div className="w-24 sm:w-28 h-[1px] bg-stone-400 mx-auto"></div>
                <div className="text-[8px] sm:text-[9px] font-bold tracking-wider text-stone-700 uppercase mt-1">
                  RACHELLE BEAUDRY
                </div>
                <div className="text-[7px] text-stone-500 uppercase tracking-tight">
                  MANAGER
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vintage Appreciation Template Matching Screenshot 5 */
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 border-4 border-double border-stone-800 rounded-lg bg-[#fafaf7] text-stone-900">
            {/* Guilloche Border SVG frame */}
            <div className="absolute inset-1 border border-stone-400 pointer-events-none rounded"></div>

            {/* Vintage Heading */}
            <div className="text-center pt-2">
              <h1
                className="text-2xl sm:text-4xl text-stone-900 tracking-tight font-serif"
                style={{ fontFamily: "'UnifrakturMaguntia', 'Cinzel Decorative', serif" }}
              >
                Certificate of Appreciation
              </h1>
            </div>

            {/* Body */}
            <div className="text-center my-auto space-y-3 px-4">
              <p className="font-serif italic text-sm sm:text-base text-stone-700">
                This Certificate is hereby awarded to
              </p>

              {/* Recipient Name written on the line */}
              <div className="relative max-w-lg mx-auto pb-1">
                <div
                  className="text-2xl sm:text-4xl font-normal text-stone-900 py-1"
                  style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                >
                  {record.name}
                </div>
                <div className="w-full h-[1px] bg-stone-800"></div>
              </div>

              <p className="font-serif italic text-sm sm:text-base text-stone-700 pt-1">
                in recognition of
              </p>

              {/* Recognition Description on the line */}
              <div className="relative max-w-lg mx-auto pb-1">
                <div className="text-xs sm:text-sm font-serif italic text-stone-800 py-1">
                  Generous contribution of {record.donationItem} as {record.role} for SINUSOID VX
                </div>
                <div className="w-full h-[1px] bg-stone-800"></div>
              </div>
            </div>

            {/* Footer / Given by & Date */}
            <div className="pt-4 text-xs font-serif italic text-stone-800 flex justify-between items-end px-4">
              <div>
                <div className="flex items-center gap-2">
                  <span>Given by:</span>
                  <span className="font-sans font-semibold text-xs text-stone-900 border-b border-stone-800 pb-0.5 px-2">
                    SINUSOID VX Organizing Committee
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span>This</span>
                  <span className="border-b border-stone-800 px-2 font-mono font-medium">{day}</span>
                  <span>Day of</span>
                  <span className="border-b border-stone-800 px-2 font-sans font-medium">{month}</span>
                  <span>Year of</span>
                  <span className="border-b border-stone-800 px-2 font-mono font-medium">{year}</span>
                </div>
              </div>

              <div className="text-right text-[9px] text-stone-500 font-mono">
                <div>CERT-ID: {record.id}</div>
                <div>{record.enrollNo ? `ENR: ${record.enrollNo}` : 'SINUSOID 2026'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
