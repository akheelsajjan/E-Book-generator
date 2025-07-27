import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PreviewFooter = ({ currentPageIndex, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      onPageChange(currentPageIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevious}
          disabled={currentPageIndex === 0}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
            currentPageIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
      </div>

      {/* Center Section - Page Info */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Page {currentPageIndex + 1} of {totalPages}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleNext}
          disabled={currentPageIndex === totalPages - 1}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
            currentPageIndex === totalPages - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PreviewFooter; 