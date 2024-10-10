// components/LoadingSpinner.tsx

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1 left-1 right-1 bottom-1 bg-white rounded-full"></div>
        <div className="absolute top-2 left-2 right-2 bottom-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin-slow"></div>
        <div className="absolute top-3 left-3 right-3 bottom-3 bg-white rounded-full flex justify-center items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;