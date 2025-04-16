import React from 'react';

export default function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-50 px-3 py-3.5">
        <div className="grid grid-cols-8 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-3/4"></div>
          ))}
        </div>
      </div>

      {/* Rows skeleton */}
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="border-t border-gray-200 px-3 py-4">
          <div className="grid grid-cols-8 gap-4">
            {[...Array(8)].map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-4 bg-gray-100 rounded ${
                  colIndex === 0 ? 'w-20' : 'w-16'
                }`}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 