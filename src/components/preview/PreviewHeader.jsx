import React from 'react';
import { ArrowLeft, Eye, EyeOff, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PreviewHeader = ({ 
  bookTitle, 
  viewMode, 
  authorMode, 
  onViewModeChange, 
  onAuthorModeChange 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <h1 className="text-xl font-semibold text-gray-900 truncate">
          {bookTitle || 'Book Preview'}
        </h1>
      </div>

      {/* Center Section - View Mode Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">View Mode:</span>
        <div className="flex bg-gray-100 rounded-md p-1">
          <button
            onClick={() => onViewModeChange('single')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'single'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single Page
          </button>
          <button
            onClick={() => onViewModeChange('dual')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'dual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dual Page
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Author Mode Toggle */}
        <button
          onClick={() => onAuthorModeChange(!authorMode)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            authorMode
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {authorMode ? <User className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm">
            {authorMode ? 'Author Mode' : 'Preview Mode'}
          </span>
        </button>

        {/* Settings Button (only in author mode) */}
        {authorMode && (
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewHeader; 