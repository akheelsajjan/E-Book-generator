import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PreviewFooter = ({ currentPageIndex, totalPages, onPageChange, viewMode = 'single' }) => {
  const handlePrevious = () => {
    if (viewMode === 'dual') {
      // In dual mode, jump by 2 pages, but handle special cases
      if (currentPageIndex === 0) {
        // At first page, stay there
        return;
      } else if (currentPageIndex === 1) {
        // At second page, go to first page
        onPageChange(0);
      } else {
        // Jump back by 2 pages
        onPageChange(Math.max(0, currentPageIndex - 2));
      }
    } else {
      // Single page mode - normal navigation
      if (currentPageIndex > 0) {
        onPageChange(currentPageIndex - 1);
      }
    }
  };

  const handleNext = () => {
    if (viewMode === 'dual') {
      // In dual mode, jump by 2 pages, but handle special cases
      if (currentPageIndex === 0) {
        // At first page, go to second page
        onPageChange(1);
      } else if (currentPageIndex >= totalPages - 2) {
        // Near the end, go to last page
        onPageChange(totalPages - 1);
      } else {
        // Jump forward by 2 pages
        onPageChange(Math.min(totalPages - 1, currentPageIndex + 2));
      }
    } else {
      // Single page mode - normal navigation
      if (currentPageIndex < totalPages - 1) {
        onPageChange(currentPageIndex + 1);
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-2 space-x-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPageIndex === 0}
        className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 w-32 ${
          currentPageIndex === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium">Previous</span>
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPageIndex === totalPages - 1}
        className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 w-32 ${
          currentPageIndex === totalPages - 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
        }`}
      >
        <span className="font-medium">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PreviewFooter; 