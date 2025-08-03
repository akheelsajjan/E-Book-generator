import React from 'react';

const TabGroup = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`flex gap-1 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/30 p-2 rounded-full shadow-xl border border-blue-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-3 px-5 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-2 flex-1 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <span className="font-semibold">{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabGroup; 