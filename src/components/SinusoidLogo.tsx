import React from 'react';

interface SinusoidLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const SinusoidLogo: React.FC<SinusoidLogoProps> = ({
  className = '',
  size = 'md',
  onClick,
}) => {
  const sizeMap = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      <img
        src="/assets/siNUsoid vX text.png"
        alt="SINUSOID VX Logo"
        className={`${sizeMap[size]} w-auto drop-shadow-sm object-contain`}
      />
    </div>
  );
};
