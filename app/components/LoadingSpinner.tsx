'use client'

import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-64 h-64">
        <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle className="text-violet-500 stroke-current" cx="50" cy="50" r="45" strokeWidth="8" fill="none" 
            style={{
              animation: 'dash 1.5s ease-in-out infinite alternate',
              strokeDasharray: '90 150',
              strokeDashoffset: 0,
            }}
          />
          <circle className="text-pink-500 stroke-current" cx="50" cy="50" r="35" strokeWidth="6" fill="none"
            style={{
              animation: 'dash 1.5s ease-in-out infinite alternate-reverse',
              strokeDasharray: '70 120',
              strokeDashoffset: 0,
            }}
          />
          <circle className="text-blue-500 stroke-current" cx="50" cy="50" r="25" strokeWidth="4" fill="none"
            style={{
              animation: 'dash 1.5s ease-in-out infinite alternate',
              strokeDasharray: '50 90',
              strokeDashoffset: 0,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl font-bold animate-pulse">Loading</div>
        </div>
      </div>
      <style jsx>{`
        @keyframes dash {
          from {
            stroke-dashoffset: 240;
          }
          to {
            stroke-dashoffset: 40;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner