import React from 'react';

export default function LoadingSpinner({ size = 4, text = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className={`w-${size} h-${size} border-3 border-gray-600 border-t-white rounded-full animate-spin`}></div>
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
}
