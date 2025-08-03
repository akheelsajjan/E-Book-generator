import React, { useState, useEffect, useRef } from 'react';
import BookContentRenderer from './BookContentRenderer';
import ChapterPage from './ChapterPage';

const PreviewPage = ({ currentPage, viewMode, bookStructure, currentPageIndex, onSplitPage, isSplitting = false }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showSplitMessage, setShowSplitMessage] = useState(false);
  const contentRef = useRef(null);
  
  if (!currentPage) return null;

  // Check for content overflow
  const checkOverflow = () => {
    if (contentRef.current && currentPage.type === 'page') {
      const container = contentRef.current;
      const isOverflowing = container.scrollHeight > container.clientHeight;
      setIsOverflowing(isOverflowing);
      
      if (isOverflowing && !showSplitMessage) {
        setShowSplitMessage(true);
      }
    }
  };

  // Monitor content changes and window resize
  useEffect(() => {
    checkOverflow();
    
    const handleResize = () => {
      setTimeout(checkOverflow, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, showSplitMessage]);

  const renderPageContent = () => {
    const { type, data, pageNumber } = currentPage;

    switch (type) {
      case 'cover':
        return renderCoverPage(data, pageNumber);
      
      case 'author':
        return renderAuthorPage(data, pageNumber);
      
      case 'preface':
        return renderPrefacePage(data, pageNumber);
      
      case 'toc':
        return renderTOCPage(data, 0, 1, pageNumber);
      
      case 'chapter':
        return <ChapterPage chapter={data} pageNumber={pageNumber} />;
      
      case 'page':
        return renderContentPage(data.chapter, data, pageNumber);
      
      case 'appendix':
        return renderAppendixPage(data, pageNumber);
      
      default:
        return renderDefaultPage(pageNumber);
    }
  };

  const renderCoverPage = (coverData, pageNumber) => {
    const cover = coverData;
    const hasCustomBackground = cover?.backgroundColor;
    
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: hasCustomBackground 
            ? `linear-gradient(135deg, ${cover.backgroundColor} 0%, ${cover.backgroundColor}dd 100%)`
            : 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          color: hasCustomBackground ? 'white' : '#333333'
        }}
      >
        <div 
          className="h-full flex flex-col items-center justify-center p-8 text-center"
          style={{
            background: hasCustomBackground ? 'transparent' : 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {cover?.title || 'Book Title'}
          </h1>
          
          {cover?.subtitle && (
            <h2 className="text-xl md:text-2xl font-medium mb-6 opacity-90 italic">
              {cover.subtitle}
            </h2>
          )}
          
          <div className="border-t border-current border-opacity-30 pt-6 mb-6 w-32 mx-auto"></div>
          
          <div className="author-section">
            <p className="text-lg mb-2">by</p>
            <p className="text-2xl md:text-3xl font-semibold">
              {cover?.author || 'Unknown Author'}
            </p>
          </div>
          
          {cover?.publisher && (
            <div className="mt-8 text-sm opacity-75">
              {cover.publisher}
            </div>
          )}
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  const renderAuthorPage = (authorData, pageNumber) => {
    const author = authorData;
    
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        <div 
          className="h-full flex flex-col"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              About the Author
            </h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{author?.name || 'Author Name'}</h2>
              {author?.title && (
                <p className="text-lg text-gray-600 mb-4">{author.title}</p>
              )}
            </div>
            
            {author?.bio && (
              <div className="text-gray-700 leading-relaxed">
                <p className="text-justify">{author.bio}</p>
              </div>
            )}
            
            {author?.credentials && author.credentials.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Credentials</h3>
                <ul className="space-y-2">
                  {author.credentials.map((credential, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{credential}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {author?.achievements && author.achievements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                <ul className="space-y-2">
                  {author.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  const renderPrefacePage = (prefaceData, pageNumber) => {
    const preface = prefaceData;
    
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        <div 
          className="h-full flex flex-col"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Preface
            </h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          
          <div className="flex-1">
            {preface?.content && (
              <div className="text-gray-700 leading-relaxed">
                <BookContentRenderer content={preface.content} />
              </div>
            )}
            
            {preface?.acknowledgments && preface.acknowledgments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Acknowledgments</h3>
                <div className="space-y-2">
                  {preface.acknowledgments.map((acknowledgment, index) => (
                    <p key={index} className="text-gray-700 italic">
                      {acknowledgment}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  const renderTOCPage = (bookData, tocPageIndex, totalTOCPages, pageNumber) => {
    const generateTOCEntries = (book) => {
      // Add null check to prevent TypeError
      if (!book) {
        return [];
      }
      
      const entries = [];
      let globalPageNumber = 1;

      // Skip cover, author, preface for TOC
      if (book.cover) globalPageNumber++;
      if (book.author) globalPageNumber++;
      if (book.preface) globalPageNumber++;

      // Calculate TOC pages (we'll estimate this)
      const estimatedTOCEntries = [];
      if (book.chapters) {
        book.chapters.forEach((chapter, chapterIndex) => {
          estimatedTOCEntries.push({
            title: chapter.title?.trim() || `Chapter ${chapterIndex + 1}`,
            type: 'chapter'
          });
          
          if (chapter.pages) {
            chapter.pages.forEach((page) => {
              if (page.title && page.title.trim()) {
                estimatedTOCEntries.push({
                  title: page.title,
                  type: 'page'
                });
              }
            });
          }
        });
      }
      
      const entriesPerPage = 15;
      const totalTOCPages = Math.ceil(estimatedTOCEntries.length / entriesPerPage);
      globalPageNumber += totalTOCPages;

      // Chapters and pages
      if (book.chapters) {
        book.chapters.forEach((chapter, chapterIndex) => {
          // Always add chapter entry
          const chapterTitle = chapter.title?.trim() || `Chapter ${chapterIndex + 1}`;
          entries.push({
            title: chapterTitle,
            pageNumber: globalPageNumber,
            type: 'chapter'
          });
          globalPageNumber++;

          // Add page entries - only include pages with valid titles
          if (chapter.pages) {
            chapter.pages.forEach((page) => {
              if (page.title && page.title.trim()) {
                entries.push({
                  title: page.title,
                  pageNumber: globalPageNumber,
                  type: 'page'
                });
              }
              // Always increment page number for continuity
              globalPageNumber++;
            });
          }
        });
      }

      return entries;
    };

    const tocEntries = generateTOCEntries(bookData);
    const entriesPerPage = 15;
    const startIndex = tocPageIndex * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentPageEntries = tocEntries.slice(startIndex, endIndex);

    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        <div 
          className="h-full flex flex-col"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Table of Contents
              {totalTOCPages > 1 && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Page {tocPageIndex + 1} of {totalTOCPages})
                </span>
              )}
            </h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          
          <div className="flex-1 space-y-2">
            {currentPageEntries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-gray-900 ${
                  entry.type === 'chapter' ? 'font-bold' : 'font-normal'
                }`}>
                  {entry.title}
                </span>
                <div className="flex items-center flex-1 mx-2">
                  <div className="flex-1 border-b border-dotted border-gray-400 mx-2"></div>
                </div>
                <span className="text-gray-600 font-mono text-sm">{entry.pageNumber}</span>
              </div>
            ))}
          </div>
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  const renderContentPage = (chapter, page, pageNumber) => {
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        <div 
          ref={contentRef}
          className="h-full flex flex-col"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <BookContentRenderer 
            content={page?.content} 
            showTitle={true} 
            title={page?.title} 
          />
          
          {/* Auto-pagination overflow message */}
          {isOverflowing && showSplitMessage && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-yellow-700 mb-3">
                  This page has more content than fits. Create a new page to continue?
                </p>
                <button
                  onClick={() => onSplitPage(chapter, page, contentRef.current)}
                  disabled={isSplitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSplitting ? 'Splitting...' : 'Split to New Page'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  const renderAppendixPage = (appendixData, pageNumber) => {
    const appendix = appendixData;
    
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        <div 
          className="h-full flex flex-col"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {appendix?.title || 'Appendix'}
            </h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          
          <div className="flex-1 space-y-6">
            {appendix?.sections && appendix.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {section.title || `Section ${index + 1}`}
                </h3>
                {section.content && (
                  <div className="text-gray-700 leading-relaxed">
                    <BookContentRenderer content={section.content} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  const renderDefaultPage = (pageNumber) => {
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        <div 
          className="h-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <div className="text-center">
            <p className="text-gray-500">Page content not available</p>
          </div>
        </div>
        
        {pageNumber && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
            style={{ fontSize: '14px' }}
          >
            Page {pageNumber}
          </div>
        )}
      </div>
    );
  };

  // Helper function to render a single page
  const renderSinglePage = (page) => {
    if (!page) return null;
    
    const { type, data, pageNumber } = page;

    switch (type) {
      case 'cover':
        return renderCoverPage(data.bookData, pageNumber);
      
      case 'author':
        return renderAuthorPage(data.bookData, pageNumber);
      
      case 'preface':
        return renderPrefacePage(data.bookData, pageNumber);
      
      case 'toc':
        return renderTOCPage(data.bookData, data.tocPageIndex, data.totalTOCPages, pageNumber);
      
      case 'chapter':
        return <ChapterPage chapter={data.chapter} pageNumber={pageNumber} />;
      
      case 'page':
        return renderContentPage(data.chapter, data.page, pageNumber);
      
      case 'appendix':
        return renderAppendixPage(data.bookData, pageNumber);
      
      default:
        return renderDefaultPage(pageNumber);
    }
  };

  // Dual page mode rendering
  const renderDualPages = () => {
    const leftPage = bookStructure[currentPageIndex];
    const rightPage = bookStructure[currentPageIndex + 1];

    // Special handling for page 1 (cover) - show alone
    if (currentPageIndex === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full transition-all duration-300 ease-in-out">
          {renderSinglePage(leftPage)}
        </div>
      );
    }

    // For other pages, show spread layout
    return (
      <div className="flex items-center justify-center w-full h-full transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-center gap-8">
          {/* Left Page */}
          <div className="flex-shrink-0 transition-transform duration-300 ease-in-out">
            {renderSinglePage(leftPage)}
          </div>
          
          {/* Center Divider (book binding simulation) */}
          <div className="w-px h-[800px] bg-gray-300 opacity-50"></div>
          
          {/* Right Page */}
          <div className="flex-shrink-0 transition-transform duration-300 ease-in-out">
            {renderSinglePage(rightPage)}
          </div>
        </div>
      </div>
    );
  };

  // Single page mode rendering
  const renderSinglePageMode = () => {
    return (
      <div className="flex items-center justify-center w-full h-full transition-all duration-300 ease-in-out">
        {renderPageContent()}
      </div>
    );
  };

  // Responsive behavior for mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveViewMode = isMobile ? 'single' : viewMode;

  return (
    <div className="w-full h-full transition-opacity duration-300 ease-in-out">
      {effectiveViewMode === 'dual' ? renderDualPages() : renderSinglePageMode()}
    </div>
  );
};

export default PreviewPage; 