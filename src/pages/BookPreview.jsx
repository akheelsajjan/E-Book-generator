import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Download, Settings, BookOpen, FileText, User, List, ChevronDown, ChevronUp, Book, Lightbulb, HelpCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getMockBooks } from '../services/booksService';
import PageRouter from '../components/preview/PageRouter';
import TOCPreview from '../components/preview/TOCPreview';

const BookPreview = ({ onBackToEditor }) => {
  // Use a default bookId since we're not using URL parameters
  const bookId = 'javascript-fundamentals';
  
  console.log('BookPreview component mounted with bookId:', bookId);
  
  // State for preview mode
  const [isAuthor, setIsAuthor] = useState(true); // TODO: Check if current user is author
  const [showPublishDropdown, setShowPublishDropdown] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('cover');
  const [currentSection, setCurrentSection] = useState('cover');
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(null);

  // Template customization state
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [customizationOptions, setCustomizationOptions] = useState({
    fontSize: 'medium',
    fontFamily: 'serif',
    theme: 'light'
  });

  // Book data state
  const [bookData, setBookData] = useState(null);

  // AI Assistant state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Calculate total pages for navigation
  const getTotalPages = () => {
    if (!bookData) return 1;
    
    let total = 2; // cover, toc
    
    // Add optional sections
    if (bookData.dedication) total++;
    if (bookData.acknowledgments) total++;
    if (bookData.foreword) total++;
    if (bookData.author) total++;
    if (bookData.preface) total++;
    if (bookData.introduction) total++;
    
    // Add chapters and their pages
    if (bookData.chapters) {
      bookData.chapters.forEach(chapter => {
        total += 1; // chapter overview
        if (chapter.pages) {
          total += chapter.pages.length; // individual pages
        }
      });
    }
    
    // Add end sections
    if (bookData.epilogue) total++;
    if (bookData.appendix) total++;
    if (bookData.glossary) total++;
    if (bookData.bibliography) total++;
    if (bookData.index) total++;
    
    return total;
  };

  // Load book data
  useEffect(() => {
    const loadBookData = () => {
      try {
        setLoading(true);
        const mockBooks = getMockBooks();
        const book = mockBooks.find(b => b.id === bookId);
        
        if (book) {
          setBookData(book);
          console.log('Book data loaded:', book);
        } else {
          console.error('Book not found:', bookId);
          // Fallback to mock data with enhanced structure
          setBookData({
            id: bookId,
            title: 'History of India',
            subtitle: 'A Tale to Tell',
            author: {
              name: 'Akheel Sajjan',
              title: 'Historian and Author',
              bio: 'Akheel Sajjan is a passionate historian with over 10 years of experience in researching and documenting Indian history. He has published numerous articles and books on various aspects of Indian civilization.',
              credentials: [
                'PhD in History from Delhi University',
                'Masters in Ancient Indian History',
                'Published author of 5 books'
              ],
              achievements: [
                'Best History Book Award 2023',
                'Featured in National Geographic',
                'Guest lecturer at prestigious universities'
              ],
              email: 'akheel.sajjan@example.com'
            },
            dedication: {
              content: 'To my parents, who instilled in me a love for learning and a curiosity about the world around us. To my teachers, who guided me on this journey of discovery. And to all those who believe in the power of knowledge to transform lives.',
              author: 'Akheel Sajjan'
            },
            acknowledgments: {
              content: 'I would like to express my deepest gratitude to the countless individuals who have contributed to this work. Special thanks to my research assistants, the librarians who provided invaluable resources, and my colleagues who offered constructive feedback throughout this journey.',
              author: 'Akheel Sajjan'
            },
            foreword: {
              content: 'In this remarkable work, Akheel Sajjan takes us on an extraordinary journey through the annals of Indian history. His meticulous research and engaging narrative style make this book an essential read for anyone interested in understanding the rich tapestry of India\'s past.',
              author: 'Dr. Priya Sharma',
              title: 'Professor of History, Delhi University'
            },
            cover: {
              title: 'History of India',
              subtitle: 'A Tale to Tell',
              author: 'Akheel Sajjan',
              backgroundColor: '#667eea'
            },
            preface: {
              content: 'This book represents a comprehensive journey through the rich tapestry of Indian history. From the ancient civilizations of the Indus Valley to the modern era, we explore the cultural, political, and social evolution of one of the world\'s oldest civilizations.',
              author: 'Akheel Sajjan',
              date: 'January 2024',
              location: 'New Delhi, India'
            },
            introduction: {
              content: 'India, a land of incredible diversity and rich heritage, has been home to some of the world\'s most ancient civilizations. This introduction sets the stage for our exploration of India\'s fascinating journey through time.',
              author: 'Akheel Sajjan'
            },
            chapters: [
              { 
                id: '1', 
                title: 'Introduction to Indian History', 
                status: 'completed',
                content: 'India, officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country, and the most populous democracy in the world.',
                pages: [
                  { id: '1.1', title: 'Introduction to Variables', content: 'Variables are containers for storing data values...' },
                  { id: '1.2', title: 'Number Data Type', content: 'Numbers in JavaScript can be integers or floating-point...' },
                  { id: '1.3', title: 'String Data Type', content: 'Strings are sequences of characters enclosed in quotes...' },
                  { id: '1.4', title: 'Boolean Data Type', content: 'Booleans represent true or false values...' },
                  { id: '1.5', title: 'Undefined and Null', content: 'Undefined and null are special data types...' }
                ]
              },
              { 
                id: '2', 
                title: 'Ancient India', 
                status: 'completed',
                content: 'Ancient India was home to one of the world\'s oldest civilizations. The Indus Valley Civilization, which flourished around 2500 BCE, was one of the most advanced urban cultures of its time.',
                pages: [
                  { id: '2.1', title: 'Function Declaration', content: 'Functions are reusable blocks of code...' },
                  { id: '2.2', title: 'Function Expressions', content: 'Function expressions allow you to create functions...' },
                  { id: '2.3', title: 'Arrow Functions', content: 'Arrow functions provide a concise syntax...' },
                  { id: '2.4', title: 'Parameters and Arguments', content: 'Functions can accept input through parameters...' },
                  { id: '2.5', title: 'Return Values', content: 'Functions can return values using the return statement...' }
                ]
              },
              { 
                id: '3', 
                title: 'Medieval Period', 
                status: 'in-progress',
                content: 'The medieval period in India was marked by the rise and fall of various dynasties, including the Delhi Sultanate and the Mughal Empire. This era saw significant cultural and architectural developments.',
                pages: [
                  { id: '3.1', title: 'Creating Objects', content: 'Objects are collections of key-value pairs...' },
                  { id: '3.2', title: 'Object Properties', content: 'Properties can be accessed using dot notation...' },
                  { id: '3.3', title: 'Array Basics', content: 'Arrays are ordered collections of values...' },
                  { id: '3.4', title: 'Array Methods', content: 'JavaScript provides many useful array methods...' }
                ]
              },
              { 
                id: '4', 
                title: 'Modern India', 
                status: 'pending',
                content: 'Modern India emerged from British colonial rule in 1947. Since independence, India has developed into one of the world\'s fastest-growing major economies and a vibrant democracy.',
                pages: [
                  { id: '4.1', title: 'Understanding the DOM', content: 'The DOM represents the structure of HTML documents...' },
                  { id: '4.2', title: 'Selecting Elements', content: 'You can select elements using various methods...' },
                  { id: '4.3', title: 'Modifying Elements', content: 'You can change element content and attributes...' },
                  { id: '4.4', title: 'Creating Elements', content: 'You can create new elements dynamically...' }
                ]
              }
            ],
            epilogue: {
              content: 'As we conclude this journey through India\'s history, we are reminded of the resilience and adaptability that have characterized this great nation. The lessons of the past continue to guide us toward a brighter future.',
              author: 'Akheel Sajjan'
            },
            appendix: {
              title: 'Appendix A: Timeline of Indian History',
              glossary: [
                { term: 'Indus Valley Civilization', definition: 'An ancient civilization that flourished in the northwestern regions of South Asia' },
                { term: 'Mughal Empire', definition: 'An early-modern empire that ruled large parts of the Indian subcontinent' },
                { term: 'British Raj', definition: 'The period of British rule on the Indian subcontinent between 1858 and 1947' }
              ],
              references: [
                'The Cambridge History of India',
                'A History of India by Romila Thapar',
                'India: A History by John Keay'
              ]
            },
            glossary: {
              title: 'Glossary of Terms',
              terms: [
                { term: 'Dharma', definition: 'The cosmic law and order that upholds the universe' },
                { term: 'Karma', definition: 'The principle of cause and effect in Hindu philosophy' },
                { term: 'Moksha', definition: 'Liberation from the cycle of birth and death' },
                { term: 'Vedas', definition: 'The oldest sacred texts of Hinduism' },
                { term: 'Upanishads', definition: 'Philosophical texts that form the basis of Hindu philosophy' }
              ]
            },
            bibliography: {
              title: 'Bibliography',
              references: [
                'Thapar, Romila. "A History of India." Penguin Books, 1990.',
                'Keay, John. "India: A History." Grove Press, 2000.',
                'Wolpert, Stanley. "A New History of India." Oxford University Press, 2004.',
                'Basham, A.L. "The Wonder That Was India." Grove Press, 1954.',
                'Majumdar, R.C. "Ancient India." Motilal Banarsidass, 1977.'
              ]
            },
            index: {
              title: 'Index',
              entries: [
                { term: 'Akbar', pages: '45-52' },
                { term: 'Ashoka', pages: '23-28' },
                { term: 'British Raj', pages: '78-95' },
                { term: 'Indus Valley', pages: '12-18' },
                { term: 'Mughal Empire', pages: '40-65' },
                { term: 'Partition', pages: '90-95' }
              ]
            }
          });
        }
      } catch (error) {
        console.error('Error loading book data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [bookId]);

  // Handle page navigation from TOC
  const handlePageClick = (navigationData) => {
    const { section, chapterId, pageId } = navigationData;
    
    if (section === 'cover') {
      setCurrentPage('cover');
      setCurrentSection('cover');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'toc') {
      setCurrentPage('toc');
      setCurrentSection('toc');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'author') {
      setCurrentPage('author');
      setCurrentSection('author');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'preface') {
      setCurrentPage('preface');
      setCurrentSection('preface');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'dedication') {
      setCurrentPage('dedication');
      setCurrentSection('dedication');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'acknowledgments') {
      setCurrentPage('acknowledgments');
      setCurrentSection('acknowledgments');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'foreword') {
      setCurrentPage('foreword');
      setCurrentSection('foreword');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'introduction') {
      setCurrentPage('introduction');
      setCurrentSection('introduction');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'chapter') {
      if (pageId) {
        // Navigate to specific page
        setCurrentPage('page');
        setCurrentSection('page');
        setCurrentChapter(chapterId);
        setCurrentPageId(pageId);
      } else {
        // Navigate to chapter overview
        setCurrentPage('chapter');
        setCurrentSection('chapter');
        setCurrentChapter(chapterId);
        setCurrentPageId(null);
      }
    } else if (section === 'epilogue') {
      setCurrentPage('epilogue');
      setCurrentSection('epilogue');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'appendix') {
      setCurrentPage('appendix');
      setCurrentSection('appendix');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'glossary') {
      setCurrentPage('glossary');
      setCurrentSection('glossary');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'bibliography') {
      setCurrentPage('bibliography');
      setCurrentSection('bibliography');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (section === 'index') {
      setCurrentPage('index');
      setCurrentSection('index');
      setCurrentChapter(null);
      setCurrentPageId(null);
    }
  };

  const handleNavigation = (sectionType, chapterId, pageId) => {
    if (sectionType === 'cover') {
      setCurrentPage('cover');
      setCurrentSection('cover');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (sectionType === 'toc') {
      setCurrentPage('toc');
      setCurrentSection('toc');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (sectionType === 'author') {
      setCurrentPage('author');
      setCurrentSection('author');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (sectionType === 'preface') {
      setCurrentPage('preface');
      setCurrentSection('preface');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (sectionType === 'chapter') {
      setCurrentPage('chapter');
      setCurrentSection('chapter');
      setCurrentChapter(chapterId);
      setCurrentPageId(null);
    } else if (sectionType === 'page') {
      setCurrentPage('page');
      setCurrentSection('page');
      setCurrentChapter(chapterId);
      setCurrentPageId(pageId);
    }
  };

  // Handle navigation controls
  const handlePreviousPage = () => {
    // Navigation logic based on current state
    if (currentPage === 'page' && currentChapter && currentPageId) {
      // Navigate to previous page within chapter
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      if (chapter?.pages) {
        const currentPageIndex = chapter.pages.findIndex(p => p.id === currentPageId);
        if (currentPageIndex > 0) {
          const prevPage = chapter.pages[currentPageIndex - 1];
          setCurrentPageId(prevPage.id);
        } else {
          // Go to chapter overview
          setCurrentPage('chapter');
          setCurrentPageId(null);
        }
      }
    } else if (currentPage === 'chapter' && currentChapter) {
      // Navigate to previous chapter
      const currentChapterIndex = bookData.chapters?.findIndex(ch => ch.id === currentChapter);
      if (currentChapterIndex > 0) {
        const prevChapter = bookData.chapters[currentChapterIndex - 1];
        setCurrentChapter(prevChapter.id);
        setCurrentPage('chapter');
        setCurrentPageId(null);
      } else {
        // Go to preface
        setCurrentPage('preface');
        setCurrentSection('preface');
        setCurrentChapter(null);
        setCurrentPageId(null);
      }
    } else if (currentPage === 'preface') {
      // Go to author
      setCurrentPage('author');
      setCurrentSection('author');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (currentPage === 'author') {
      // Go to TOC
      setCurrentPage('toc');
      setCurrentSection('toc');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (currentPage === 'toc') {
      // Go to cover
      setCurrentPage('cover');
      setCurrentSection('cover');
      setCurrentChapter(null);
      setCurrentPageId(null);
    }
  };

  const handleNextPage = () => {
    // Navigation logic based on current state
    if (currentPage === 'cover') {
      // Go to TOC
      setCurrentPage('toc');
      setCurrentSection('toc');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (currentPage === 'toc') {
      // Go to author
      setCurrentPage('author');
      setCurrentSection('author');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (currentPage === 'author') {
      // Go to preface
      setCurrentPage('preface');
      setCurrentSection('preface');
      setCurrentChapter(null);
      setCurrentPageId(null);
    } else if (currentPage === 'preface') {
      // Go to first chapter
      if (bookData.chapters && bookData.chapters.length > 0) {
        setCurrentPage('chapter');
        setCurrentSection('chapter');
        setCurrentChapter(bookData.chapters[0].id);
        setCurrentPageId(null);
      }
    } else if (currentPage === 'chapter' && currentChapter) {
      // Navigate to next chapter or first page of current chapter
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      if (chapter?.pages && chapter.pages.length > 0) {
        // Go to first page of current chapter
        setCurrentPage('page');
        setCurrentPageId(chapter.pages[0].id);
      } else {
        // Go to next chapter
        const currentChapterIndex = bookData.chapters?.findIndex(ch => ch.id === currentChapter);
        if (currentChapterIndex < bookData.chapters.length - 1) {
          const nextChapter = bookData.chapters[currentChapterIndex + 1];
          setCurrentChapter(nextChapter.id);
          setCurrentPage('chapter');
          setCurrentPageId(null);
        }
      }
    } else if (currentPage === 'page' && currentChapter && currentPageId) {
      // Navigate to next page within chapter
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      if (chapter?.pages) {
        const currentPageIndex = chapter.pages.findIndex(p => p.id === currentPageId);
        if (currentPageIndex < chapter.pages.length - 1) {
          const nextPage = chapter.pages[currentPageIndex + 1];
          setCurrentPageId(nextPage.id);
        } else {
          // Go to next chapter
          const currentChapterIndex = bookData.chapters?.findIndex(ch => ch.id === currentChapter);
          if (currentChapterIndex < bookData.chapters.length - 1) {
            const nextChapter = bookData.chapters[currentChapterIndex + 1];
            setCurrentChapter(nextChapter.id);
            setCurrentPage('chapter');
            setCurrentPageId(null);
          }
        }
      }
    }
  };

  // Calculate current page info for display
  const getCurrentPageInfo = () => {
    if (currentPage === 'cover') {
      return { title: 'Book Cover', current: 1, total: getTotalPages() };
    } else if (currentPage === 'toc') {
      return { title: 'Table of Contents', current: 2, total: getTotalPages() };
    } else if (currentPage === 'dedication') {
      return { title: 'Dedication', current: 3, total: getTotalPages() };
    } else if (currentPage === 'acknowledgments') {
      return { title: 'Acknowledgments', current: 4, total: getTotalPages() };
    } else if (currentPage === 'foreword') {
      return { title: 'Foreword', current: 5, total: getTotalPages() };
    } else if (currentPage === 'author') {
      return { title: 'About the Author', current: 6, total: getTotalPages() };
    } else if (currentPage === 'preface') {
      return { title: 'Preface', current: 7, total: getTotalPages() };
    } else if (currentPage === 'introduction') {
      return { title: 'Introduction', current: 8, total: getTotalPages() };
    } else if (currentPage === 'chapter' && currentChapter) {
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      const chapterIndex = bookData.chapters?.findIndex(ch => ch.id === currentChapter);
      return { 
        title: `Chapter ${chapterIndex + 1}: ${chapter?.title}`, 
        current: 9 + chapterIndex, 
        total: getTotalPages() 
      };
    } else if (currentPage === 'page' && currentChapter && currentPageId) {
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      const page = chapter?.pages?.find(p => p.id === currentPageId);
      const chapterIndex = bookData.chapters?.findIndex(ch => ch.id === currentChapter);
      const pageIndex = chapter?.pages?.findIndex(p => p.id === currentPageId);
      return { 
        title: `${page?.title}`, 
        current: 9 + chapterIndex + (pageIndex || 0) + 1, 
        total: getTotalPages() 
      };
    } else if (currentPage === 'epilogue') {
      return { title: 'Epilogue', current: getTotalPages() - 3, total: getTotalPages() };
    } else if (currentPage === 'appendix') {
      return { title: 'Appendix', current: getTotalPages() - 2, total: getTotalPages() };
    } else if (currentPage === 'glossary') {
      return { title: 'Glossary', current: getTotalPages() - 1, total: getTotalPages() };
    } else if (currentPage === 'bibliography') {
      return { title: 'Bibliography', current: getTotalPages(), total: getTotalPages() };
    } else if (currentPage === 'index') {
      return { title: 'Index', current: getTotalPages(), total: getTotalPages() };
    }
    return { title: 'Unknown', current: 1, total: getTotalPages() };
  };

  // Check if Previous button should be disabled
  const isPreviousDisabled = () => {
    if (currentPage === 'cover') return true;
    if (currentPage === 'page' && currentChapter && currentPageId) {
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      const currentPageIndex = chapter?.pages?.findIndex(p => p.id === currentPageId);
      return currentPageIndex === 0;
    }
    return false;
  };

  // Check if Next button should be disabled
  const isNextDisabled = () => {
    if (currentPage === 'page' && currentChapter && currentPageId) {
      const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
      const currentPageIndex = chapter?.pages?.findIndex(p => p.id === currentPageId);
      const isLastPage = currentPageIndex === (chapter?.pages?.length - 1);
      const isLastChapter = bookData.chapters?.findIndex(ch => ch.id === currentChapter) === (bookData.chapters?.length - 1);
      return isLastPage && isLastChapter;
    }
    return false;
  };

  const pageInfo = getCurrentPageInfo();

  const handleBackToDashboard = () => {
    if (onBackToEditor) {
      onBackToEditor();
    } else {
      // No navigation, just return to dashboard
    }
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing book...');
    setShowPublishDropdown(false);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Exporting to PDF...');
    setShowPublishDropdown(false);
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    // TODO: Implement AI assistance
    setAiResponse('AI assistance feature coming soon...');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book preview...</p>
        </div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">The requested book could not be found.</p>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Table of Contents */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToDashboard}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{bookData.title}</h1>
              <p className="text-sm text-gray-500">Table of Contents</p>
            </div>
          </div>
        </div>

        {/* TOC Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <TOCPreview 
            bookData={bookData} 
            template={selectedTemplate}
            onPageClick={handlePageClick}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {bookData.title}
              </h2>
              {isAuthor && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Author View
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Template Button */}
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Template
              </button>
              
              {/* Publish Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowPublishDropdown(!showPublishDropdown)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>Publish</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showPublishDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={handlePublish}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Publish Book
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export as PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Book Content - Centered with proper spacing */}
        <div className="flex-1 flex items-start justify-center pt-4 pb-24 px-8">
          <div className="w-full max-w-4xl h-full">
            <PageRouter
              bookData={bookData}
              currentPage={currentPage}
              currentSection={currentSection}
              currentChapter={currentChapter}
              currentPageId={currentPageId}
              onNavigate={handleNavigation}
            />
          </div>
        </div>

        {/* Fixed Footer Navigation */}
        <div className="fixed bottom-0 left-80 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={isPreviousDisabled()}
              className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Indicator */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{pageInfo.title}</div>
                <div className="text-xs text-gray-500">Page {pageInfo.current} of {pageInfo.total}</div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={isNextDisabled()}
              className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
      {showAiAssistant && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* AI Assistant Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-500">Get help with reading and understanding</p>
              </div>
              <button
                onClick={() => setShowAiAssistant(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* AI Assistant Content */}
          <div className="flex-1 p-4 space-y-4">
            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2">
                  <Book className="w-4 h-4" />
                  <span>Dictionary</span>
                </button>
                <button className="p-3 text-sm bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Explain</span>
                </button>
                <button className="p-3 text-sm bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Summarize</span>
                </button>
                <button className="p-3 text-sm bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Notes</span>
                </button>
              </div>
            </div>

            {/* Ask AI */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Ask AI</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ask about this page..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAiQuery}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ask
                </button>
              </div>
              
              {aiResponse && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPreview; 