import React from 'react';
import { BookOpen, FileText, User, List, Book } from 'lucide-react';

const PreviewSidebar = ({ 
  bookStructure, 
  currentPageIndex, 
  onPageChange, 
  onTOCNavigation 
}) => {
  const getPageIcon = (pageType) => {
    switch (pageType) {
      case 'cover':
        return <Book className="w-4 h-4" />;
      case 'author':
        return <User className="w-4 h-4" />;
      case 'preface':
        return <FileText className="w-4 h-4" />;
      case 'toc':
        return <List className="w-4 h-4" />;
      case 'chapter':
        return <BookOpen className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'appendix':
        return <Book className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPageTitle = (page) => {
    switch (page.type) {
      case 'cover':
        return 'Book Cover';
      case 'author':
        return 'About the Author';
      case 'preface':
        return 'Preface';
      case 'toc':
        return `Table of Contents ${page.data.totalTOCPages > 1 ? `(Page ${page.data.tocPageIndex + 1} of ${page.data.totalTOCPages})` : ''}`;
      case 'chapter':
        return page.data.chapter?.title || 'Chapter';
      case 'page':
        return page.data.page?.title || 'Page';
      case 'appendix':
        return 'Appendix';
      default:
        return 'Page';
    }
  };

  const handlePageClick = (pageIndex) => {
    onPageChange(pageIndex);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Table of Contents</h2>
        <p className="text-sm text-gray-600">
          {bookStructure.length} pages total
        </p>
      </div>

      {/* Page List - Scrollable only when content overflows */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-2 pb-4">
          {bookStructure.map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                index === currentPageIndex
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 ${
                  index === currentPageIndex ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {getPageIcon(page.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className={`text-sm font-medium ${
                        index === currentPageIndex ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {getPageTitle(page)}
                      </p>
                    </div>
                    <span className={`text-xs font-mono ${
                      index === currentPageIndex ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {page.pageNumber}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer - Always visible */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
        <div className="text-xs text-gray-500 text-center">
          Click any page to navigate
        </div>
      </div>
    </div>
  );
};

export default PreviewSidebar; 