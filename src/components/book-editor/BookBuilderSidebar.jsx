import React from 'react';
import { BookOpen } from 'lucide-react';

const BookBuilderSidebar = ({
  activeTab,
  setActiveTab,
  bookBuilderTabs,
  onSwitchToEditor
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Book Builder Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Book Builder</h1>
      </div>

      {/* Pages & Chapters Button */}
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={onSwitchToEditor}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center mb-3"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Pages & Chapters
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {bookBuilderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default BookBuilderSidebar; 