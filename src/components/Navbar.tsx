import React from 'react';
import { SinusoidLogo } from './SinusoidLogo';
import { IndradhanushLogo } from './IndradhanushLogo';

interface NavbarProps {
  onLogoClick?: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoClick, className = '' }) => {
  return (
    <header className={`w-full max-w-7xl mx-auto z-30 ${className}`}>
      <nav className="w-full rounded-2xl sm:rounded-full bg-black/50 backdrop-blur-2xl border border-white/20 px-4 sm:px-8 py-2 sm:py-2.5 shadow-2xl shadow-black/60 flex items-center justify-between transition-all hover:bg-black/55">
        {/* Left Side: SINUSOID VX × NSS Logo Combo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SinusoidLogo size="sm" onClick={onLogoClick} />
          <span className="text-white/50 font-light text-lg sm:text-xl select-none">×</span>
          <img
            src="/assets/nss-logo.png"
            alt="NSS Logo"
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-md rounded-full"
          />
        </div>

        {/* Right Side: Indradhanush Logo */}
        <div className="flex items-center">
          <IndradhanushLogo size="sm" />
        </div>
      </nav>
    </header>
  );
};
