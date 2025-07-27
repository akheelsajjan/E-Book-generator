import React from 'react';
import { FileText } from 'lucide-react';

const TOCPreview = ({ book, activeTab = 'toc', currentTOCData = null }) => {
  // Only show preview for toc tab
  if (activeTab !== 'toc') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p>Preview will appear here</p>
          <p className="text-sm mt-2">Select a tab to see the preview</p>
        </div>
      </div>
    );
  }

  const generateTOCStructure = () => {
    // Use currentTOCData if available, otherwise use book.chapters
    const chapters = currentTOCData || book.chapters || [];
    
    let globalPageNumber = 1;
    const tocEntries = [];
    
    chapters.forEach((chapter, chapterIndex) => {
      // Always add chapter entry - use title if available, otherwise fallback
      const chapterTitle = chapter.title?.trim() || `Chapter ${chapterIndex + 1}`;
      tocEntries.push({
        title: chapterTitle,
        pageNumber: globalPageNumber,
        type: 'chapter',
        status: chapter.status
      });
      globalPageNumber++;
      
      // Add page entries - only include pages with valid titles
      const pages = chapter.pages || [];
      pages.forEach((page) => {
        // Skip pages with no title (null, empty, or only whitespace)
        const pageTitle = page.title?.trim();
        if (pageTitle && pageTitle.length > 0) {
          tocEntries.push({
            title: pageTitle,
            pageNumber: globalPageNumber,
            type: 'page'
          });
        }
        // Always increment page number for continuity, even if page is skipped
        globalPageNumber++;
      });
    });
    
    return tocEntries;
  };

  const tocEntries = generateTOCStructure();

  const renderDottedLeader = (title, pageNumber) => {
    return (
      <div className="flex items-center justify-between w-full">
        <span className="text-gray-900">{title}</span>
        <div className="flex items-center flex-1 mx-2">
          <div className="flex-1 border-b border-dotted border-gray-400 mx-2"></div>
        </div>
        <span className="text-gray-600 font-mono text-sm">{pageNumber}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
      {/* TOC Page Container - Using same dimensions as PagePreview */}
      <div 
        className="w-[600px] h-[800px] rounded-lg shadow-2xl overflow-hidden relative"
        style={{
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          overflow: 'hidden',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {/* Page Content */}
        <div className="h-full p-12 flex flex-col" style={{
          background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
          padding: '40px',
          maxWidth: '100%'
        }}>
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Table of Contents
            </h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>

          {/* TOC Content */}
          <div className="flex-1 space-y-2" style={{ 
            marginTop: '1em', 
            marginBottom: '1em',
            maxWidth: '100%'
          }}>
            {/* TOC Entries */}
            {tocEntries.length > 0 ? (
              <div className="animate-fadeIn">
                <div className="space-y-2">
                  {tocEntries.map((entry, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out"
                    >
                      <span className="text-sm mr-3">
                        {entry.type === 'chapter' ? '📘' : '📄'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={`mr-2 ${entry.type === 'chapter' ? 'font-semibold' : 'font-normal'}`}>
                            {entry.title}
                          </span>
                        </div>
                        {entry.status && entry.type === 'chapter' && (
                          <div className="mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full transition-all duration-200 ${
                              entry.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : entry.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {entry.status}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center flex-1 mx-2">
                        <div className="flex-1 border-b border-dotted border-gray-400 mx-2"></div>
                      </div>
                      <span className="text-gray-600 font-mono text-sm">{entry.pageNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12 text-gray-500 animate-fadeIn">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No chapters available</p>
                <p className="text-sm mt-2">Add chapters and pages to see them in the table of contents</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TOCPreview; 