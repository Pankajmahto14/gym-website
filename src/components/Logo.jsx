import { useState } from 'react';
import fitnfeatLogo from '../assets/fitnfeatLogo.png';

/**
 * FIT N FEAT logo (src/assets/fitnfeatLogo.png).
 * Shows "FNF" fallback if the image fails to load.
 */
export default function Logo({ className = 'w-12 h-12', alt = 'FIT N FEAT' }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`${className} rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center font-display font-bold text-white shadow-lg shrink-0`}
        title={alt}
      >
        FNF
      </div>
    );
  }

  return (
    <img
      src={fitnfeatLogo}
      alt={alt}
      className={`${className} rounded-full object-cover object-center shrink-0`}
      onError={() => setError(true)}
    />
  );
}
