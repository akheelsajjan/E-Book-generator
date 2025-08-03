import React from 'react';
import { BookOpen } from 'lucide-react';

const BookBuilderSidebar = ({
  activeTab,
  setActiveTab,
  bookBuilderTabs,
  onSwitchToEditor
}) => {
  return (
    <div className="w-80 sidebar-dark flex flex-col">
      {/* Book Builder Header */}
      <div className="p-4 border-b border-white/20">
        <h1 className="text-lg font-semibold text-white">Book Builder</h1>
      </div>

      {/* Pages & Chapters Button */}
      <div className="p-4 border-b border-white/20">
        <button 
          onClick={onSwitchToEditor}
          className="w-full flex items-center justify-center mb-3 px-4 py-2 bg-[#5a67d8] text-white rounded-lg hover:bg-[#4c51bf] transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Pages & Chapters
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <nav className="space-y-2">
          {bookBuilderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors sidebar-item ${
                activeTab === tab.id
                  ? 'active'
                  : 'hover:bg-white/10'
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