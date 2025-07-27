import React from 'react';

const PageSwitchController = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">View:</span>
      <div className="flex bg-gray-100 rounded-md p-1">
        <button
          onClick={() => onViewModeChange('single')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            viewMode === 'single'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Single
        </button>
        <button
          onClick={() => onViewModeChange('dual')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            viewMode === 'dual'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dual
        </button>
      </div>
    </div>
  );
};

export default PageSwitchController; 