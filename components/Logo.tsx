import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      // fill="currentColor" // Removed to allow individual path fills
    >
      <defs>
        <linearGradient id="logoBowlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#34D399' }} /> {/* emerald-400 */}
          <stop offset="100%" style={{stopColor: '#14B8A6' }} /> {/* teal-500 */}
        </linearGradient>
         <linearGradient id="logoCarrotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FDBA74' }} /> {/* orange-300 */}
          <stop offset="100%" style={{stopColor: '#FB923C' }} /> {/* orange-400 */}
        </linearGradient>
        <linearGradient id="logoLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#86EFAC' }} /> {/* green-300 */}
          <stop offset="100%" style={{stopColor: '#34D399' }} /> {/* green-400 */}
        </linearGradient>
         <linearGradient id="logoTomatoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#F87171' }} /> {/* red-400 */}
          <stop offset="100%" style={{stopColor: '#EF4444' }} /> {/* red-500 */}
        </linearGradient>
      </defs>

      {/* Bowl shape */}
      <path 
        fill="url(#logoBowlGradient)"
        d="M10 50 Q15 70 50 85 Q85 70 90 50 A40 40 0 0 0 10 50 Z"
      />
      
      {/* Carrot-like shape */}
      <ellipse 
        fill="url(#logoCarrotGradient)"
        cx="35" cy="45" rx="10" ry="18" 
        transform="rotate(-30 35 45)" 
      />
      <path 
        fill="url(#logoLeafGradient)"
        d="M30 30 Q35 25 40 30 Q35 35 30 30 Z M28 28 Q33 23 38 28 Q33 33 28 28 Z"
        transform="translate(0 -2) rotate(-30 35 30)"
      />


      {/* Broccoli/Leaf-like shape */}
      <path 
        fill="url(#logoLeafGradient)"
        d="M50 30 Q60 20 70 35 Q65 50 50 45 Q35 50 40 35 Q40 20 50 30 Z" 
        transform="translate(0, -5)"
      />
      
      {/* Tomato slice-like shape */}
      <circle 
        fill="url(#logoTomatoGradient)"
        cx="70" cy="50" r="12" 
      />
      <circle fill="#FFF3E0" cx="70" cy="50" r="8" opacity="0.7"/>
      <path d="M70 43 L70 57 M63 50 L77 50" stroke="#FEE2E2" strokeWidth="1.5" opacity="0.8"/>


    </svg>
  );
};