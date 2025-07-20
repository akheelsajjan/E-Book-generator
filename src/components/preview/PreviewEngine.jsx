import React from 'react';
import PageRenderer from './PageRenderer';
import BookCoverPreview from './BookCoverPreview';
import TOCPreview from './TOCPreview';
import AuthorPreview from './AuthorPreview';
import PrefacePreview from './PrefacePreview';
import AppendixPreview from './AppendixPreview';

const PreviewEngine = ({ bookData, currentPage, template }) => {
  const renderPageContent = () => {
    // Page 1 is always the book cover
    if (currentPage === 1) {
      return <BookCoverPreview bookData={bookData} template={template} />;
    }

    // Page 2 is About Author (if exists)
    if (currentPage === 2 && bookData?.author) {
      return <AuthorPreview author={bookData.author} template={template} />;
    }

    // Page 3 is Preface (if exists)
    if (currentPage === 3 && bookData?.preface) {
      return <PrefacePreview preface={bookData.preface} template={template} />;
    }

    // Page 4+ are chapters
    if (currentPage >= 4 && bookData?.chapters) {
      const chapterIndex = currentPage - 4;
      const chapter = bookData.chapters[chapterIndex];
      
      if (chapter) {
        return (
          <PageRenderer 
            title={chapter.title}
            content={chapter.content || `Content for ${chapter.title}`}
            template={template}
            pageType="chapter"
          />
        );
      }
    }

    // Last page is Appendix (if exists)
    const totalPages = calculateTotalPages(bookData);
    if (currentPage === totalPages && bookData?.appendix) {
      return <AppendixPreview appendix={bookData.appendix} template={template} />;
    }

    // Fallback
    return (
      <PageRenderer 
        title={`Page ${currentPage}`}
        content="This page is under construction."
        template={template}
        pageType="default"
      />
    );
  };

  const calculateTotalPages = (bookData) => {
    let total = 1; // Book cover
    
    if (bookData?.author) total++;
    if (bookData?.preface) total++;
    if (bookData?.chapters) total += bookData.chapters.length;
    if (bookData?.appendix) total++;
    
    return total;
  };

  return (
    <div className="preview-engine h-full">
      {renderPageContent()}
    </div>
  );
};

export default PreviewEngine; 