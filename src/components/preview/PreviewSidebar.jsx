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
        return page.data?.title || 'Chapter';
      case 'page':
        return page.data?.title?.trim() || '⋯';
      case 'appendix':
        return 'Appendix';
      default:
        return 'Page';
    }
  };

  const handlePageClick = (pageIndex) => {
    onPageChange(pageIndex);
  };

  // Group pages by chapters for hierarchical display
  const renderHierarchicalTOC = () => {
    const items = [];
    let currentChapter = null;
    let chapterPages = [];
    const standaloneItems = [];

    bookStructure.forEach((page, index) => {
      if (page.type === 'chapter') {
        // If we have a previous chapter, add it to items
        if (currentChapter) {
          items.push({
            type: 'chapter-group',
            chapter: currentChapter,
            pages: chapterPages,
            chapterIndex: currentChapter.index
          });
        }
        // Start new chapter
        currentChapter = { ...page, index };
        chapterPages = [];
      } else if (page.type === 'page' && currentChapter) {
        // Add page to current chapter
        chapterPages.push({ ...page, index });
      } else {
        // Collect standalone items (cover, author, preface, toc, appendix) for later sorting
        standaloneItems.push({
          type: 'standalone',
          page: { ...page, index }
        });
      }
    });

    // Add the last chapter if exists
    if (currentChapter) {
      items.push({
        type: 'chapter-group',
        chapter: currentChapter,
        pages: chapterPages,
        chapterIndex: currentChapter.index
      });
    }

    // Sort standalone items by page number and add them to the appropriate positions
    standaloneItems.sort((a, b) => a.page.pageNumber - b.page.pageNumber);
    
    // Insert standalone items at the correct positions based on page numbers
    const finalItems = [];
    let standaloneIndex = 0;
    
    items.forEach(item => {
      if (item.type === 'chapter-group') {
        // Add standalone items that come before this chapter
        while (standaloneIndex < standaloneItems.length && 
               standaloneItems[standaloneIndex].page.pageNumber < item.chapter.pageNumber) {
          finalItems.push(standaloneItems[standaloneIndex]);
          standaloneIndex++;
        }
        finalItems.push(item);
      }
    });
    
    // Add any remaining standalone items (like appendix)
    while (standaloneIndex < standaloneItems.length) {
      finalItems.push(standaloneItems[standaloneIndex]);
      standaloneIndex++;
    }

    return finalItems;
  };

  const tocItems = renderHierarchicalTOC();

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
          {tocItems.map((item, itemIndex) => {
            if (item.type === 'standalone') {
              // Render standalone items (cover, author, preface, toc, appendix)
              const { page } = item;
              return (
                <button
                  key={page.index}
                  onClick={() => handlePageClick(page.index)}
                  className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                    page.index === currentPageIndex
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 ${
                      page.index === currentPageIndex ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {getPageIcon(page.type)}
                    </div>
                    
                                         <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between w-full">
                         <div className="truncate flex-1">
                           <p className={`text-sm font-medium ${
                             page.index === currentPageIndex ? 'text-blue-700' : 'text-gray-900'
                           }`}>
                             {getPageTitle(page)}
                           </p>
                         </div>
                         <span className={`text-xs font-mono flex-shrink-0 ml-2 ${
                           page.index === currentPageIndex ? 'text-blue-600' : 'text-gray-500'
                         }`}>
                           {page.pageNumber}
                         </span>
                       </div>
                     </div>
                  </div>
                </button>
              );
            } else {
              // Render chapter group
              const { chapter, pages } = item;
              return (
                <div key={chapter.index} className="mb-2">
                  {/* Chapter Header */}
                  <button
                    onClick={() => handlePageClick(chapter.index)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      chapter.index === currentPageIndex
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 ${
                        chapter.index === currentPageIndex ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {getPageIcon(chapter.type)}
                      </div>
                      
                                             <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between w-full">
                           <div className="truncate flex-1">
                             <p className={`text-sm font-semibold ${
                               chapter.index === currentPageIndex ? 'text-blue-700' : 'text-gray-900'
                             }`}>
                               {getPageTitle(chapter)}
                             </p>
                           </div>
                           <span className={`text-xs font-mono flex-shrink-0 ml-2 ${
                             chapter.index === currentPageIndex ? 'text-blue-600' : 'text-gray-500'
                           }`}>
                             {chapter.pageNumber}
                           </span>
                         </div>
                       </div>
                    </div>
                  </button>

                                     {/* Chapter Pages - Indented */}
                   {pages.map((page) => (
                     <button
                       key={page.index}
                       onClick={() => handlePageClick(page.index)}
                       className={`w-full text-left p-3 rounded-md mb-1 transition-colors relative ${
                         page.index === currentPageIndex
                           ? 'bg-blue-50 text-blue-700 border-l-blue-400'
                           : 'hover:bg-gray-50 text-gray-700'
                       }`}
                     >
                       <div className="flex items-center space-x-3">
                         <div className={`flex-shrink-0 ${
                           page.index === currentPageIndex ? 'text-blue-600' : 'text-gray-400'
                         }`}>
                           {getPageIcon(page.type)}
                         </div>
                         
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between w-full">
                             <div className="truncate flex-1 ml-6">
                               <p className={`text-sm ${
                                 page.index === currentPageIndex ? 'text-blue-700 font-medium' : 'text-gray-700'
                               }`}>
                                 {getPageTitle(page)}
                               </p>
                             </div>
                             <span className={`text-xs font-mono flex-shrink-0 ml-2 ${
                               page.index === currentPageIndex ? 'text-blue-600' : 'text-gray-500'
                             }`}>
                               {page.pageNumber}
                             </span>
                           </div>
                         </div>
                       </div>
                       
                       {/* Left border for indentation visual */}
                       <div className="absolute left-0 top-0 bottom-0 w-6 border-l-2 border-gray-200"></div>
                     </button>
                   ))}
                </div>
              );
            }
          })}
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