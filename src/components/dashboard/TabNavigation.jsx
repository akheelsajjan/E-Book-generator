import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    { id: 'all', label: 'All Books', count: tabCounts.all },
    { id: 'published', label: 'Published', count: tabCounts.published },
    { id: 'draft', label: 'Drafts', count: tabCounts.draft },
    { id: 'in-progress', label: 'In Progress', count: tabCounts.inProgress }
  ];

  return (
    <div className="glass-effect mb-8">
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                tab flex items-center space-x-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'text-primary border-b-2 border-accent-blue'
                  : 'text-secondary hover:text-primary'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${activeTab === tab.id
                    ? 'bg-accent-blue/20 text-accent-blue'
                    : 'bg-glass text-secondary'
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