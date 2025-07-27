import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookWithChapters } from '../services/booksService';
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
  
  // State management
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'dual'
  const [authorMode, setAuthorMode] = useState(false);
  const [bookStructure, setBookStructure] = useState([]);
  const [error, setError] = useState(null);

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

    // Skip appendix for TOC
    if (book.appendix) globalPageNumber++;

    return entries;
  };

  // Fetch book data from Firebase
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        console.log('Fetching book data for ID:', bookId);
        
        const book = await getBookWithChapters(bookId);
        console.log('Fetched book data:', book);
        
        if (!book) {
          setError('Book not found');
          return;
        }

        setBookData(book);
        
        // Generate book structure
        const structure = generateBookStructure(book);
        setBookStructure(structure);
        
        console.log('Generated book structure:', structure);
        
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError('Failed to load book data');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  // Generate complete book structure
  const generateBookStructure = (book) => {
    if (!book) return [];
    
    const structure = [];
    let pageNumber = 1;

    // 1. Book Cover
    if (book.cover) {
      structure.push({
        type: 'cover',
        pageNumber: pageNumber++,
        data: { bookData: book }
      });
    }

    // 2. About Author
    if (book.author) {
      structure.push({
        type: 'author',
        pageNumber: pageNumber++,
        data: { bookData: book }
      });
    }

    // 3. Preface
    if (book.preface) {
      structure.push({
        type: 'preface',
        pageNumber: pageNumber++,
        data: { bookData: book }
      });
    }

    // 4. Table of Contents
    const tocEntries = generateTOCEntries(book);
    const entriesPerPage = 15;
    const totalTOCPages = Math.ceil(tocEntries.length / entriesPerPage);
    
    for (let tocPageIndex = 0; tocPageIndex < totalTOCPages; tocPageIndex++) {
      structure.push({
        type: 'toc',
        pageNumber: pageNumber++,
        data: { 
          bookData: book,
          tocPageIndex: tocPageIndex,
          totalTOCPages: totalTOCPages
        }
      });
    }

    // 5. Chapters and Pages
    if (book.chapters) {
      book.chapters.forEach((chapter, chapterIndex) => {
        // Chapter title page
        structure.push({
          type: 'chapter',
          pageNumber: pageNumber++,
          data: { chapter: chapter }
        });

        // Chapter pages (only those with titles)
        if (chapter.pages) {
          chapter.pages.forEach((page) => {
            if (page.title && page.title.trim()) {
              structure.push({
                type: 'page',
                pageNumber: pageNumber++,
                data: { 
                  chapter: chapter,
                  page: page
                }
              });
            } else {
              // Skip pages without titles but still increment page number
              pageNumber++;
            }
          });
        }
      });
    }

    // 6. Appendix
    if (book.appendix) {
      structure.push({
        type: 'appendix',
        pageNumber: pageNumber++,
        data: { bookData: book }
      });
    }

    return structure;
  };

  // Navigation handlers
  const handlePageChange = (newPageIndex) => {
    if (newPageIndex >= 0 && newPageIndex < bookStructure.length) {
      setCurrentPageIndex(newPageIndex);
    }
  };

  const handleTOCNavigation = (targetPageNumber) => {
    const targetIndex = bookStructure.findIndex(page => page.pageNumber === targetPageNumber);
    if (targetIndex !== -1) {
      setCurrentPageIndex(targetIndex);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleAuthorModeChange = (mode) => {
    setAuthorMode(mode);
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
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
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
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
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
      />
      
      {authorMode && (
        <PreviewSettings />
      )}
      
      <PreviewFooter 
        currentPageIndex={currentPageIndex}
        totalPages={bookStructure.length}
        onPageChange={handlePageChange}
      />
    </PreviewLayout>
  );
};

export default BookPreview; 