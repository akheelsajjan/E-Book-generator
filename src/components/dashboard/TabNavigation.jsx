import React from 'react';
import { TabGroup } from '../ui';

const TabNavigation = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    { id: 'all', label: 'All Books', count: tabCounts.all || 0 },
    { id: 'published', label: 'Published', count: tabCounts.published || 0 },
    { id: 'drafts', label: 'Drafts', count: tabCounts.drafts || 0 },
    { id: 'in-progress', label: 'In Progress', count: tabCounts['in-progress'] || 0 }
  ];

  return (
    <div className="mb-8">
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default TabNavigation; 