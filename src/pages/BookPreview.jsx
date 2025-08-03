import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { getBookWithChapters, updatePage, createPage, publishBook } from '../services/booksService';
import PreviewLayout from '../components/preview/PreviewLayout';
import PreviewSidebar from '../components/preview/PreviewSidebar';
import PreviewHeader from '../components/preview/PreviewHeader';
import PreviewPage from '../components/preview/PreviewPage';
import PreviewFooter from '../components/preview/PreviewFooter';
import PreviewSettings from '../components/preview/PreviewSettings';
import BookContentRenderer from '../components/preview/BookContentRenderer';
import ChapterPage from '../components/preview/ChapterPage';
import PageSwitchController from '../components/preview/PageSwitchController';

const BookPreview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // State management
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'dual'
  const [authorMode, setAuthorMode] = useState(false);
  const [bookStructure, setBookStructure] = useState([]);
  const [error, setError] = useState(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);

  // Generate TOC entries (only pages with titles)
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
            estimatedTOCEntries.push({
              title: page.title?.trim() || '⋯',
              type: 'page'
            });
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

        // Add page entries - include all pages
        if (chapter.pages) {
          chapter.pages.forEach((page) => {
            entries.push({
              title: page.title?.trim() || '⋯',
              pageNumber: globalPageNumber,
              type: 'page'
            });
            globalPageNumber++;
          });
        }
      });
    }
    
    // Skip appendix for TOC
    if (book.appendix) globalPageNumber++;

    return entries;
  };

  // Fetch book data from Firebase
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        console.log('BookPreview - Received bookId from URL params:', bookId);
        console.log('BookPreview - bookId type:', typeof bookId);
        
        if (!bookId) {
          throw new Error('No book ID provided');
        }

        const book = await getBookWithChapters(bookId);
        console.log('BookPreview - Fetched book data:', book);
        
        // Check if this is reader mode via URL parameter or book status
        const urlParams = new URLSearchParams(location.search);
        const urlReaderMode = urlParams.get('mode') === 'reader';
        const isPublished = book.status === 'published';
        const isAuthor = book.userId === user?.uid;
        
        // Set reader mode if explicitly requested via URL or if viewing published book as non-author
        if (urlReaderMode || (isPublished && !isAuthor)) {
          setIsReaderMode(true);
          setAuthorMode(false); // Force preview mode for readers
        }
        
        setBookData(book);
        
        // Generate book structure for preview
        const structure = generateBookStructure(book);
        setBookStructure(structure);
        
        console.log('BookPreview - Generated book structure:', structure);
        
      } catch (error) {
        console.error('BookPreview - Error fetching book data:', error);
        setError(error.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);



  // Generate complete book structure for preview
  const generateBookStructure = (book) => {
    const structure = [];
    let globalPageNumber = 1;

    // Add cover page if exists
    if (book.cover) {
      structure.push({
        type: 'cover',
        pageNumber: globalPageNumber,
        data: book.cover
      });
      globalPageNumber++;
    }

    // Add author page if exists
    if (book.author) {
      structure.push({
        type: 'author',
        pageNumber: globalPageNumber,
        data: book.author
      });
      globalPageNumber++;
    }

    // Add preface page if exists
    if (book.preface) {
      structure.push({
        type: 'preface',
        pageNumber: globalPageNumber,
        data: book.preface
      });
      globalPageNumber++;
    }

    // Add TOC page
    const tocEntries = generateTOCEntries(book);
    structure.push({
      type: 'toc',
      pageNumber: globalPageNumber,
      data: { entries: tocEntries }
    });
    globalPageNumber++;

    // Add chapters and pages
    if (book.chapters) {
      book.chapters.forEach((chapter) => {
        // Add chapter page
        structure.push({
          type: 'chapter',
          pageNumber: globalPageNumber,
          data: chapter
        });
        globalPageNumber++;

        // Add pages in chapter
        if (chapter.pages) {
          chapter.pages.forEach((page) => {
            structure.push({
              type: 'page',
              pageNumber: globalPageNumber,
              data: page,
              chapter: chapter
            });
            globalPageNumber++;
          });
        }
      });
    }

    // Add appendix if exists
    if (book.appendix) {
      structure.push({
        type: 'appendix',
        pageNumber: globalPageNumber,
        data: book.appendix
      });
      globalPageNumber++;
    }

    return structure;
  };

  // Handle page navigation
  const handlePageChange = (newPageIndex) => {
    if (newPageIndex >= 0 && newPageIndex < bookStructure.length) {
      setCurrentPageIndex(newPageIndex);
    }
  };

  // Handle TOC navigation
  const handleTOCNavigation = (targetPageNumber) => {
    const targetIndex = bookStructure.findIndex(page => page.pageNumber === targetPageNumber);
    if (targetIndex !== -1) {
      setCurrentPageIndex(targetIndex);
    }
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle author mode change
  const handleAuthorModeChange = (mode) => {
    setAuthorMode(mode);
  };

  // Check if book is complete and ready for publishing
  const isBookComplete = () => {
    if (!bookData) return false;
    
    // Check if book has a title
    if (!bookData.title || bookData.title.trim() === '') return false;
    
    // Check if book has at least one chapter
    if (!bookData.chapters || bookData.chapters.length === 0) return false;
    
    // Check if each chapter has at least one page with content
    let totalContentPages = 0;
    for (const chapter of bookData.chapters) {
      if (!chapter.pages || chapter.pages.length === 0) return false;
      
      // Check if at least one page has content
      const hasContent = chapter.pages.some(page => {
        const hasPageContent = page.content && page.content.trim() !== '';
        if (hasPageContent) {
          totalContentPages++;
        }
        return hasPageContent;
      });
      
      if (!hasContent) return false;
    }
    
    // Ensure we have at least 2 content pages (not just cover/TOC)
    if (totalContentPages < 2) return false;
    
    // Additional check: ensure we have meaningful content (not just placeholders)
    let hasMeaningfulContent = false;
    for (const chapter of bookData.chapters) {
      for (const page of chapter.pages) {
        if (page.content && page.content.trim().length > 50) { // At least 50 characters
          hasMeaningfulContent = true;
          break;
        }
      }
      if (hasMeaningfulContent) break;
    }
    
    if (!hasMeaningfulContent) return false;
    
    return true;
  };

  // Handle publish book
  const handlePublish = async () => {
    if (!isBookComplete()) {
      console.log('Book is not complete. Cannot publish.');
      return;
    }
    
    try {
      setIsPublishing(true);
      await publishBook(bookId);
      
      // Update local book data to reflect published status
      setBookData(prev => ({
        ...prev,
        status: 'published',
        publishedAt: new Date()
      }));
      
      // Show success message (you could add a toast notification here)
      console.log('Book published successfully!');
      
    } catch (error) {
      console.error('Error publishing book:', error);
      // Show error message (you could add a toast notification here)
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle page splitting
  const handleSplitPage = async (chapter, page, contentElement) => {
    if (!contentElement) return;

    setIsSplitting(true);

    try {
      const findSplitPoint = (content, maxHeight) => {
        const words = content.split(/\s+/);
        let left = 0;
        let right = words.length;
        let splitIndex = 0;

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const testContent = words.slice(0, mid).join(' ');
          
          // Create temporary element to measure height
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = window.getComputedStyle(contentElement).cssText;
          tempDiv.style.height = 'auto';
          tempDiv.style.position = 'absolute';
          tempDiv.style.visibility = 'hidden';
          tempDiv.innerHTML = testContent;
          document.body.appendChild(tempDiv);
          
          const height = tempDiv.scrollHeight;
          document.body.removeChild(tempDiv);
          
          if (height <= maxHeight) {
            splitIndex = mid;
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }

        return splitIndex;
      };

      const maxHeight = contentElement.clientHeight - 200; // Leave space for title and padding
      const splitIndex = findSplitPoint(page.content, maxHeight);

      if (splitIndex <= 0) return;

      // Split the content
      const words = page.content.split(/\s+/);
      const firstPart = words.slice(0, splitIndex).join(' ');
      const secondPart = words.slice(splitIndex).join(' ');

      try {
        // Update current page with first part
        await updatePage(bookId, chapter.id, page.id, {
          ...page,
          content: firstPart
        });

        // Create new page with remaining content
        const newPageData = {
          title: page.title ? `${page.title} (continued)` : 'Page (continued)',
          content: secondPart,
          order: page.order + 1
        };

        const newPage = await createPage(bookId, chapter.id, newPageData);

        // Update local state
        const updatedBookData = { ...bookData };
        const chapterIndex = updatedBookData.chapters.findIndex(c => c.id === chapter.id);
        const pageIndex = updatedBookData.chapters[chapterIndex].pages.findIndex(p => p.id === page.id);

        if (chapterIndex !== -1 && pageIndex !== -1) {
          // Update existing page
          updatedBookData.chapters[chapterIndex].pages[pageIndex] = {
            ...page,
            content: firstPart
          };

          // Add new page
          updatedBookData.chapters[chapterIndex].pages.splice(pageIndex + 1, 0, {
            id: newPage,
            ...newPageData
          });

          setBookData(updatedBookData);
          
          // Regenerate book structure
          const newStructure = generateBookStructure(updatedBookData);
          setBookStructure(newStructure);
          
          // Navigate to the new page
          const newPageIndex = newStructure.findIndex(p => p.data.id === newPage);
          if (newPageIndex !== -1) {
            setCurrentPageIndex(newPageIndex);
          }
        }
      } catch (error) {
        console.error('Error splitting page:', error);
        // You could add a toast notification here
      } finally {
        setIsSplitting(false);
      }
    } catch (error) {
      console.error('Error splitting page:', error);
      // You could add a toast notification here
    } finally {
      setIsSplitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book preview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(isReaderMode ? '/main' : '/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isReaderMode ? 'Back to Books' : 'Back to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  // No book data
  if (!bookData || !bookStructure.length) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No book data available</p>
            <button
            onClick={() => navigate(isReaderMode ? '/main' : '/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
            {isReaderMode ? 'Back to Books' : 'Back to Dashboard'}
            </button>
        </div>
      </div>
    );
  }

  const currentPage = bookStructure[currentPageIndex];

  return (
    <PreviewLayout>
      <PreviewHeader 
        bookTitle={bookData.title}
        viewMode={viewMode}
        authorMode={authorMode}
        onViewModeChange={handleViewModeChange}
        onAuthorModeChange={handleAuthorModeChange}
        bookStatus={bookData.status || 'draft'}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        isReaderMode={isReaderMode}
        isBookComplete={isBookComplete()}
      />
      
      <PreviewSidebar 
        bookStructure={bookStructure}
        currentPageIndex={currentPageIndex}
        onPageChange={handlePageChange}
        onTOCNavigation={handleTOCNavigation}
      />
      
      <PreviewPage 
        currentPage={currentPage}
        viewMode={viewMode}
        bookStructure={bookStructure}
        currentPageIndex={currentPageIndex}
        onSplitPage={handleSplitPage}
        isSplitting={isSplitting}
      />
      
      {authorMode && bookData.status !== 'published' && (
        <PreviewSettings />
      )}
      
      <PreviewFooter 
        currentPageIndex={currentPageIndex}
        totalPages={bookStructure.length}
        onPageChange={handlePageChange}
        viewMode={viewMode}
      />
    </PreviewLayout>
  );
};

export default BookPreview; 