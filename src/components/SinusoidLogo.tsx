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
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.3 : 1;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}
    >
      <svg
        width="220"
        height="50"
        viewBox="0 0 440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          {/* Emblem Gradients */}
          <linearGradient id="emblemOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="50%" stopColor="#ff8c00" />
            <stop offset="100%" stopColor="#e65100" />
          </linearGradient>

          <linearGradient id="emblemPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a154b" />
            <stop offset="50%" stopColor="#6b1d6e" />
            <stop offset="100%" stopColor="#2b0938" />
          </linearGradient>

          {/* Text Gradient matching sinu-vX-logo-text.png */}
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe6c2" />
            <stop offset="35%" stopColor="#f5b877" />
            <stop offset="65%" stopColor="#bd6e7f" />
            <stop offset="100%" stopColor="#491b4a" />
          </linearGradient>
          
          <linearGradient id="vxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd8a8" />
            <stop offset="40%" stopColor="#f79c42" />
            <stop offset="70%" stopColor="#c25869" />
            <stop offset="100%" stopColor="#531c50" />
          </linearGradient>

          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Left Emblem Icon */}
        <g filter="url(#logoGlow)">
          {/* Upper-left orange lightning fold */}
          <path
            d="M55 8 L10 52 L35 52 L68 18 L90 18 L55 52 L40 52 L78 8 Z"
            fill="url(#emblemOrangeGrad)"
          />
          {/* Purple diagonal fold */}
          <path
            d="M38 52 L8 82 L35 82 L72 45 L94 45 L58 82 L75 82 L105 52 Z"
            fill="url(#emblemPurpleGrad)"
          />
          {/* Lower orange triangular shard */}
          <path
            d="M48 52 L48 94 L68 62 L68 52 Z"
            fill="url(#emblemOrangeGrad)"
          />
        </g>

        {/* Wordmark: siNUsoid vX */}
        <g filter="url(#logoGlow)" transform="translate(100, 72) skewX(-16)">
          <text
            x="0"
            y="0"
            fontFamily="'Montserrat', 'Outfit', sans-serif"
            fontSize="54"
            fontWeight="900"
            letterSpacing="2px"
            fill="url(#textGrad)"
          >
            <tspan fill="url(#textGrad)">s</tspan>
            <tspan fill="url(#textGrad)" fontSize="58">iNU</tspan>
            <tspan fill="url(#textGrad)">soid</tspan>
            <tspan dx="16" fill="url(#vxGrad)" fontSize="58">vX</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};
