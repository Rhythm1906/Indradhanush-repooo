import React from 'react';

interface IndradhanushLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const IndradhanushLogo: React.FC<IndradhanushLogoProps> = ({
  className = '',
  size = 'md',
  onClick,
}) => {
  const sizeMap = {
    sm: 'h-8 sm:h-10',
    md: 'h-10 sm:h-12 md:h-14',
    lg: 'h-14 sm:h-18'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      <img
        src="/assets/indradhanush-logo.png"
        alt="Indradhanush Logo"
        className={`${sizeMap[size]} w-auto drop-shadow-sm object-contain`}
      />
    </div>
  );
};
