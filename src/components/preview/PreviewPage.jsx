import React from 'react';
import BookContentRenderer from './BookContentRenderer';
import ChapterPage from './ChapterPage';

const PreviewPage = ({ currentPage, viewMode, bookStructure, currentPageIndex }) => {
  if (!currentPage) return null;

  const renderPageContent = () => {
    const { type, data, pageNumber } = currentPage;

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

  const renderCoverPage = (bookData, pageNumber) => {
    const cover = bookData?.cover;
    
    return (
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
        style={{
          background: cover?.backgroundColor 
            ? `linear-gradient(135deg, ${cover.backgroundColor} 0%, ${cover.backgroundColor}dd 100%)`
            : 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          color: cover?.backgroundColor ? 'white' : '#333333'
        }}
      >
        <div 
          className="h-full flex flex-col items-center justify-center p-8 text-center"
          style={{
            background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
            padding: '40px',
            maxWidth: '100%'
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {cover?.title || bookData?.title || 'Book Title'}
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
              {cover?.author || bookData?.author?.name || 'Unknown Author'}
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

  const renderAuthorPage = (bookData, pageNumber) => {
    const author = bookData?.author;
    
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
                <p className="text-lg text-gray-600 italic">{author.title}</p>
              )}
            </div>
            
            {author?.bio && (
              <BookContentRenderer content={author.bio} />
            )}
            
            {author?.credentials && author.credentials.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Credentials</h3>
                <div className="space-y-2">
                  {author.credentials.map((credential, index) => (
                    <p key={index} style={{ 
                      textIndent: '2em',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      fontFamily: 'Georgia, serif',
                      textAlign: 'justify'
                    }}>
                      • {credential}
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

  const renderPrefacePage = (bookData, pageNumber) => {
    const preface = bookData?.preface;
    
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
            <BookContentRenderer content={preface?.content} />
          </div>
          
          {preface?.author && (
            <div className="mt-8 text-right">
              <p className="text-lg font-semibold">{preface.author}</p>
              {preface?.date && (
                <p className="text-sm text-gray-600">{preface.date}</p>
              )}
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

  const renderTOCPage = (bookData, tocPageIndex, totalTOCPages, pageNumber) => {
    const generateTOCEntries = (book) => {
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

  const renderAppendixPage = (bookData, pageNumber) => {
    const appendix = bookData?.appendix;
    
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
            {appendix?.glossary && appendix.glossary.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Glossary</h2>
                <div className="space-y-3">
                  {appendix.glossary.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <dt className="font-semibold text-gray-900">{item.term}</dt>
                      <dd className="text-gray-700 mt-1">{item.definition}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {appendix?.references && appendix.references.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">References</h2>
                <div className="space-y-2">
                  {appendix.references.map((reference, index) => (
                    <p key={index} style={{ 
                      textIndent: '2em',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      fontFamily: 'Georgia, serif',
                      textAlign: 'justify'
                    }}>
                      {index + 1}. {reference}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {appendix?.content && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Additional Information</h2>
                <BookContentRenderer content={appendix.content} />
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

  return (
    <div className="flex items-center justify-center w-full h-full">
      {renderPageContent()}
    </div>
  );
};

export default PreviewPage; 