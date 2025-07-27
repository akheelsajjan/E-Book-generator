import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    { id: 'all', label: 'All Books', count: tabCounts.all },
    { id: 'published', label: 'Published', count: tabCounts.published },
    { id: 'draft', label: 'Drafts', count: tabCounts.draft },
    { id: 'in-progress', label: 'In Progress', count: tabCounts.inProgress }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md mb-8">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${activeTab === tab.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation; 