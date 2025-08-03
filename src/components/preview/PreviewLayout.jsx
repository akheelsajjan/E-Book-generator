import React from 'react';

const PreviewLayout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        {React.Children.toArray(children).find(child => child.type?.name === 'PreviewHeader')}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
          {React.Children.toArray(children).find(child => child.type?.name === 'PreviewSidebar')}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Page Viewer */}
          <div className="flex-1 flex items-center justify-center p-0 overflow-hidden">
            {React.Children.toArray(children).find(child => child.type?.name === 'PreviewPage')}
          </div>
          
          {/* Settings Panel (Author Mode) */}
          <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
            {React.Children.toArray(children).find(child => child.type?.name === 'PreviewSettings')}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        {React.Children.toArray(children).find(child => child.type?.name === 'PreviewFooter')}
      </div>
    </div>
  );
};

export default PreviewLayout; 