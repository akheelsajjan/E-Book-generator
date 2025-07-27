import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, BarChart3, Eye, Download, Plus, BookOpen, FileText, Star, Zap, Lightbulb as LightbulbIcon } from 'lucide-react';
import { updatePage, updateChapter, createPage, createChapter, deleteChapter, deletePage } from '../../services/booksService';
import EditorSidebar from './EditorSidebar';
import EditorContent from './EditorContent';
import EditorAIAssistant from './EditorAIAssistant';
import PagePreview from './PagePreview';

const EditorView = ({
  book,
  setBook,
  aiSettings,
  aiDropdownOpen,
  setAiDropdownOpen,
  aiDropdownRef,
  calculateProgress,
  handleAiSettingChange,
  onSwitchToBookBuilder,
  AI_FEATURES
}) => {
  const navigate = useNavigate();
  // Debug logging
  console.log('EditorView - Book data received:', book);
  console.log('EditorView - Book chapters:', book?.chapters);
  console.log('EditorView - Book title:', book?.title);

  // Get first chapter and page from server data
  const firstChapter = book?.chapters?.[0];
  const firstPage = firstChapter?.pages?.[0];

  console.log('EditorView - First chapter:', firstChapter);
  console.log('EditorView - First page:', firstPage);

  // Editor state - initialize from server data
  const [selectedPage, setSelectedPage] = useState(firstPage?.title || '');
  const [currentChapter, setCurrentChapter] = useState(firstChapter?.title || '');
  const [content, setContent] = useState(firstPage?.content || '');
  const [pageTitle, setPageTitle] = useState(firstPage?.title || '');
  const [chapterTitle, setChapterTitle] = useState(firstChapter?.title || '');
  const [showTitleField, setShowTitleField] = useState(false);
  
  // Track current page and chapter IDs for unique identification
  const [currentPageId, setCurrentPageId] = useState(firstPage?.id || '');
  const [currentChapterId, setCurrentChapterId] = useState(firstChapter?.id || '');

  // Save functionality
  const [lastSaved, setLastSaved] = useState(new Date());
  const [pageRefreshed, setPageRefreshed] = useState(false);

  // AI state
  const [aiTab, setAiTab] = useState('writing');
  const [aiPrompt, setAiPrompt] = useState('');

  // Preview mode state
  const [previewMode, setPreviewMode] = useState(false);

  // Update state when book data changes
  useEffect(() => {
    console.log('EditorView - Book data changed, updating state');
    
    const firstChapter = book?.chapters?.[0];
    const firstPage = firstChapter?.pages?.[0];

    console.log('EditorView - Updated first chapter:', firstChapter);
    console.log('EditorView - Updated first page:', firstPage);

    if (firstPage) {
      setSelectedPage(firstPage.title);
      setPageTitle(firstPage.title);
      setContent(firstPage.content || '');
      setCurrentPageId(firstPage.id);
      setShowTitleField(false);
    }

    if (firstChapter) {
      setCurrentChapter(firstChapter.title);
      setChapterTitle(firstChapter.title);
      setCurrentChapterId(firstChapter.id);
    }
  }, [book]);

  // Removed auto-save functionality - save only happens on button click

  // Handle save
  const handleSave = async () => {
    try {
      console.log('Saving book data to Firestore...');
      
      // Find the current page in the book data using page ID and chapter ID
      let currentPageData = null;
      let currentChapterData = null;

      for (const chapter of book.chapters || []) {
        if (chapter.id === currentChapterId) {
          const page = chapter.pages?.find(p => p.id === currentPageId);
          if (page) {
            currentPageData = page;
            currentChapterData = chapter;
            break;
          }
        }
      }

      if (!currentPageData || !currentChapterData) {
        console.error('Current page or chapter not found');
        console.log('Current page ID:', currentPageId);
        console.log('Current chapter ID:', currentChapterId);
        console.log('Available chapters:', book.chapters?.map(ch => ({ id: ch.id, title: ch.title })));
        return;
      }

      console.log('Updating page:', currentPageData.id);
      console.log('Original page title:', selectedPage);
      console.log('New page title:', pageTitle);
      console.log('New content:', content);
      console.log('New chapter title:', chapterTitle);

      // Update the page content and title
      const updatedPage = {
        ...currentPageData,
        title: pageTitle,
        content: content,
        updatedAt: new Date()
      };

      // Update the chapter title if it changed
      const updatedChapter = {
        ...currentChapterData,
        title: chapterTitle,
        updatedAt: new Date()
      };

      // Update the book state
      const updatedChapters = book.chapters.map(chapter => {
        if (chapter.id === currentChapterId) {
          return {
            ...chapter,
            title: chapterTitle,
            pages: chapter.pages.map(page => {
              if (page.id === currentPageId) {
                return updatedPage;
              }
              return page;
            })
          };
        }
        return chapter;
      });

      const updatedBook = {
        ...book,
        chapters: updatedChapters
      };

      // Save to Firestore - check if page exists or needs to be created
      try {
        await updatePage(book.id, currentChapterData.id, currentPageData.id, {
          title: pageTitle,
          content: content
        });
      } catch (error) {
        // If update fails, try to create the page
        if (error.message.includes('No document to update')) {
          console.log('Page not found in Firestore, creating new page...');
          const pageData = {
            title: pageTitle,
            content: content,
            pageType: 'text',
            order: currentPageData.order || 1,
            alignment: 'left',
            fontSize: 14,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#000000',
            backgroundColor: '#ffffff',
            margins: 16,
            padding: 16,
            pageBreakBefore: false,
            pageBreakAfter: false,
            showPageNumber: true,
            showHeader: false,
            showFooter: false,
            isVisible: true
          };
          
          const newPageId = await createPage(book.id, currentChapterData.id, pageData);
          
          // Update the page ID in local state
          const updatedChapters = book.chapters.map(chapter => {
            if (chapter.id === currentChapterData.id) {
              return {
                ...chapter,
                pages: chapter.pages.map(page => {
                  if (page.title === selectedPage) {
                    return { ...page, id: newPageId };
                  }
                  return page;
                })
              };
            }
            return chapter;
          });
          
          setBook({
            ...book,
            chapters: updatedChapters
          });
          
          console.log('Page created successfully in Firestore');
        } else {
          throw error;
        }
      }

      // Update chapter title if it changed
      if (currentChapterData.title !== chapterTitle) {
        await updateChapter(book.id, currentChapterId, {
          title: chapterTitle
        });
      }

      // Update the book state
      setBook(updatedBook);
      
      // Update selectedPage and currentChapter to the new titles after successful save
      setSelectedPage(pageTitle);
      setCurrentChapter(chapterTitle);
      setLastSaved(new Date());
      
      // Refresh the current page data to ensure we're viewing the latest content
      console.log('Refreshing current page data after save...');
      
      // Find the updated page data in the new book state
      let refreshedPageData = null;
      let refreshedChapterData = null;
      
      for (const chapter of updatedBook.chapters || []) {
        if (chapter.id === currentChapterId) {
          const page = chapter.pages?.find(p => p.id === currentPageId);
          if (page) {
            refreshedPageData = page;
            refreshedChapterData = chapter;
            break;
          }
        }
      }
      
      if (refreshedPageData) {
        // Update the editor with the latest saved data
        setPageTitle(refreshedPageData.title);
        setContent(refreshedPageData.content || '');
        setChapterTitle(refreshedChapterData.title);
        
        console.log('Current page refreshed with latest data:', {
          pageTitle: refreshedPageData.title,
          chapterTitle: refreshedChapterData.title,
          contentLength: refreshedPageData.content?.length || 0
        });
        
        // Show refresh indicator
        setPageRefreshed(true);
        setTimeout(() => setPageRefreshed(false), 2000); // Hide after 2 seconds
      }
      
      console.log('Book data updated successfully in Firestore');
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  // Auto-save disabled - only manual save via Save button

  // Handle page selection
  const handlePageSelect = (pageId, chapterId) => {
    console.log('EditorView - Page selected:', { pageId, chapterId });
    
    // Find the page in the book data using page ID and chapter ID
    let selectedPageData = null;
    let selectedChapterData = null;

    for (const chapter of book.chapters || []) {
      if (chapter.id === chapterId) {
        const page = chapter.pages?.find(p => p.id === pageId);
        if (page) {
          selectedPageData = page;
          selectedChapterData = chapter;
          break;
        }
      }
    }

    console.log('EditorView - Found page data:', selectedPageData);
    console.log('EditorView - Found chapter data:', selectedChapterData);

    if (selectedPageData) {
      setSelectedPage(selectedPageData.title);
      setPageTitle(selectedPageData.title);
      setContent(selectedPageData.content || '');
      setCurrentPageId(selectedPageData.id);
      // Reset title field state when switching pages
      setShowTitleField(false);
      
      if (selectedChapterData) {
        setCurrentChapter(selectedChapterData.title);
        setChapterTitle(selectedChapterData.title);
        setCurrentChapterId(selectedChapterData.id);
      }
    }
  };

  // Character limits based on whether page has a title
  const getCharacterLimit = () => {
    const hasTitle = pageTitle && pageTitle.trim().length > 0;
    return hasTitle ? 1675 : 2000;
  };

  // Preview mode handlers
  const handlePreviewClick = () => {
    setPreviewMode(true);
  };

  const handleExitPreview = () => {
    setPreviewMode(false);
  };

  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    const maxChars = getCharacterLimit();
    
    // Only allow content within the character limit
    if (newContent.length <= maxChars) {
      setContent(newContent);
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setPageTitle(e.target.value);
    // Don't update selectedPage here - keep the original page title for finding the page
  };

  // Handle chapter change
  const handleChapterChange = (e) => {
    setChapterTitle(e.target.value);
    // Don't update currentChapter here - keep the original chapter title for finding the chapter
  };

  // Add new page
  const addNewPage = async (chapterId = null) => {
    try {
      console.log('Adding new page...');
      
      // First, save current content if there are any changes
      // Find the current page data to compare with original content
      let currentPageData = null;
      for (const chapter of book.chapters || []) {
        if (chapter.id === currentChapterId) {
          const page = chapter.pages?.find(p => p.id === currentPageId);
          if (page) {
            currentPageData = page;
            break;
          }
        }
      }
      
      // Check if there are any changes to save
      const hasChanges = pageTitle !== selectedPage || 
                        chapterTitle !== currentChapter || 
                        (currentPageData && content !== (currentPageData.content || ''));
      
      console.log('Current content:', content);
      console.log('Original content:', currentPageData?.content || '');
      console.log('Has changes:', hasChanges);
      
      // Always save if there's content in the editor, even if it matches original
      const shouldSave = hasChanges || content.trim() !== '';
      
      if (shouldSave) {
        console.log('Saving current content before adding new page...');
        await handleSave();
      } else {
        console.log('No changes detected, skipping save');
      }
      
      // Find the target chapter
      let targetChapter = null;
      if (chapterId) {
        targetChapter = book.chapters.find(chapter => chapter.id === chapterId);
      } else {
        targetChapter = book.chapters.find(chapter => chapter.title === currentChapter);
      }
      if (!targetChapter) {
        console.error('Target chapter not found');
        return;
      }
      // Generate unique page title
      const pageNumber = (targetChapter.pages?.length || 0) + 1;
      const pageTitleUnique = `Page ${pageNumber}`;
      // Create page data for Firestore
      const pageData = {
        title: pageTitleUnique,
        content: '',
        pageType: 'text',
        order: pageNumber,
        alignment: 'left',
        fontSize: 14,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000',
        backgroundColor: '#ffffff',
        margins: 16,
        padding: 16,
        pageBreakBefore: false,
        pageBreakAfter: false,
        showPageNumber: true,
        showHeader: false,
        showFooter: false,
        isVisible: true
      };
      // Create page in Firestore
      const newPageId = await createPage(book.id, targetChapter.id, pageData);
      // Create page object for local state
      const newPage = {
        id: newPageId,
        ...pageData
      };
      // Update local state
      const updatedChapters = book.chapters.map(chapter => {
        if (chapter.id === targetChapter.id) {
          return {
            ...chapter,
            pages: [...(chapter.pages || []), newPage]
          };
        }
        return chapter;
      });
      setBook({
        ...book,
        chapters: updatedChapters
      });
      // Switch to the newly created page
      setSelectedPage(newPage.title);
      setPageTitle(newPage.title);
      setContent('');
      setCurrentPageId(newPage.id);
      setCurrentChapterId(targetChapter.id);
      setShowTitleField(false);
      console.log('New page added successfully and switched to it');
    } catch (error) {
      console.error('Error adding new page:', error);
    }
  };

  // Add new chapter
  const addNewChapter = async () => {
    try {
      console.log('Adding new chapter with default page...');
      
      // First, save current content if there are any changes
      // Find the current page data to compare with original content
      let currentPageData = null;
      for (const chapter of book.chapters || []) {
        if (chapter.id === currentChapterId) {
          const page = chapter.pages?.find(p => p.id === currentPageId);
          if (page) {
            currentPageData = page;
            break;
          }
        }
      }
      
      // Check if there are any changes to save
      const hasChanges = pageTitle !== selectedPage || 
                        chapterTitle !== currentChapter || 
                        (currentPageData && content !== (currentPageData.content || ''));
      
      console.log('Current content:', content);
      console.log('Original content:', currentPageData?.content || '');
      console.log('Has changes:', hasChanges);
      
      // Always save if there's content in the editor, even if it matches original
      const shouldSave = hasChanges || content.trim() !== '';
      
      if (shouldSave) {
        console.log('Saving current content before adding new chapter...');
        await handleSave();
      } else {
        console.log('No changes detected, skipping save');
      }
      
      // Generate unique chapter title
      const chapterNumber = (book.chapters?.length || 0) + 1;
      const chapterTitleUnique = `Chapter ${chapterNumber}`;
      // Create chapter data for Firestore
      const chapterData = {
        title: chapterTitleUnique,
        description: `This is your new chapter ${chapterNumber}...!!`,
        order: chapterNumber,
        isVisible: true,
        includeInTOC: true,
        pageBreakBefore: false,
        pageBreakAfter: false,
        wordCount: 0,
        estimatedReadingTime: 0
      };
      // Create chapter in Firestore
      const newChapterId = await createChapter(book.id, chapterData);
      // Create default page data for Firestore
      const pageData = {
        title: 'Page 1',
        content: 'Start writing your first page here...!!',
        pageType: 'text',
        order: 1,
        alignment: 'left',
        fontSize: 14,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000',
        backgroundColor: '#ffffff',
        margins: 16,
        padding: 16,
        pageBreakBefore: false,
        pageBreakAfter: false,
        showPageNumber: true,
        showHeader: false,
        showFooter: false,
        isVisible: true
      };
      // Create default page in Firestore
      const newPageId = await createPage(book.id, newChapterId, pageData);
      // Create chapter object with default page for local state
      const newChapter = {
        id: newChapterId,
        ...chapterData,
        pages: [{
          id: newPageId,
          ...pageData
        }]
      };
      // Update local state
      setBook({
        ...book,
        chapters: [...(book.chapters || []), newChapter]
      });
      // Switch to the newly created chapter and its first page
      setCurrentChapter(newChapter.title);
      setChapterTitle(newChapter.title);
      setSelectedPage(newChapter.pages[0].title);
      setPageTitle(newChapter.pages[0].title);
      setContent(newChapter.pages[0].content);
      setCurrentPageId(newChapter.pages[0].id);
      setCurrentChapterId(newChapter.id);
      setShowTitleField(false);
      console.log('New chapter with default page added successfully and switched to it');
    } catch (error) {
      console.error('Error adding new chapter:', error);
    }
  };

  // Delete chapter
  const handleDeleteChapter = async (chapterId) => {
    try {
      console.log('Deleting chapter:', chapterId);
      
      // Check if this is the last chapter (book must have at least 1 chapter)
      if (book.chapters.length <= 1) {
        console.log('Cannot delete the last chapter. Book must have at least 1 chapter.');
        return;
      }
      
      // Find the chapter to delete
      const chapterToDelete = book.chapters.find(ch => ch.id === chapterId);
      if (!chapterToDelete) {
        console.error('Chapter not found');
        return;
      }
      
      // Delete all pages in the chapter from Firestore first
      for (const page of chapterToDelete.pages || []) {
        try {
          await deletePage(book.id, chapterId, page.id);
          console.log('Deleted page:', page.id);
        } catch (error) {
          console.error('Error deleting page:', page.id, error);
        }
      }
      
      // Delete the chapter from Firestore
      await deleteChapter(book.id, chapterId);
      console.log('Deleted chapter from Firestore');
      
      // Update local state
      const updatedChapters = book.chapters.filter(chapter => chapter.id !== chapterId);
      setBook({
        ...book,
        chapters: updatedChapters
      });
      
      // If deleted chapter was current, select first available chapter
      if (updatedChapters.length > 0) {
        const firstChapter = updatedChapters[0];
        setCurrentChapter(firstChapter.title);
        setChapterTitle(firstChapter.title);
        if (firstChapter.pages.length > 0) {
          const firstPage = firstChapter.pages[0];
          setSelectedPage(firstPage.title);
          setPageTitle(firstPage.title);
          setContent(firstPage.content || '');
        } else {
          // If first chapter has no pages, clear the editor
          setSelectedPage('');
          setPageTitle('');
          setContent('');
        }
      }
      
      console.log('Chapter deleted successfully');
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  // Delete page
  const handleDeletePage = async (chapterId, pageId) => {
    try {
      console.log('Deleting page:', pageId, 'from chapter:', chapterId);
      
      // Find the chapter and page
      const chapter = book.chapters.find(ch => ch.id === chapterId);
      if (!chapter) {
        console.error('Chapter not found');
        return;
      }
      
      const page = chapter.pages.find(p => p.id === pageId);
      if (!page) {
        console.error('Page not found');
        return;
      }
      
      // Delete the page from Firestore
      await deletePage(book.id, chapterId, pageId);
      console.log('Page deleted from Firestore');
      
      // Check if this is the last page in the chapter
      if (chapter.pages.length <= 1) {
        console.log('This is the last page in the chapter. Deleting the entire chapter.');
        
        // Check if this is the last chapter (book must have at least 1 chapter)
        if (book.chapters.length <= 1) {
          console.log('Cannot delete the last chapter. Book must have at least 1 chapter.');
          return;
        }
        
        // Delete all remaining pages in the chapter from Firestore
        for (const remainingPage of chapter.pages) {
          if (remainingPage.id !== pageId) { // Skip the page we already deleted
            try {
              await deletePage(book.id, chapterId, remainingPage.id);
              console.log('Deleted remaining page:', remainingPage.id);
            } catch (error) {
              console.error('Error deleting remaining page:', remainingPage.id, error);
            }
          }
        }
        
        // Delete the chapter from Firestore
        await deleteChapter(book.id, chapterId);
        console.log('Chapter deleted from Firestore');
        
        // Update local state - remove the entire chapter
        const updatedChapters = book.chapters.filter(ch => ch.id !== chapterId);
        setBook({
          ...book,
          chapters: updatedChapters
        });
        
        // Select first available chapter and page
        if (updatedChapters.length > 0) {
          const firstChapter = updatedChapters[0];
          setCurrentChapter(firstChapter.title);
          setChapterTitle(firstChapter.title);
          if (firstChapter.pages.length > 0) {
            const firstPage = firstChapter.pages[0];
            setSelectedPage(firstPage.title);
            setPageTitle(firstPage.title);
            setContent(firstPage.content || '');
          } else {
            setSelectedPage('');
            setPageTitle('');
            setContent('');
          }
        }
      } else {
        // Just remove the page from local state
        const updatedChapters = book.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            return {
              ...chapter,
              pages: chapter.pages.filter(page => page.id !== pageId)
            };
          }
          return chapter;
        });
        
        setBook({
          ...book,
          chapters: updatedChapters
        });
        
        // If deleted page was selected, select first available page in the same chapter
        const currentChapter = updatedChapters.find(ch => ch.id === chapterId);
        if (currentChapter && currentChapter.pages.length > 0) {
          const firstPage = currentChapter.pages[0];
          setSelectedPage(firstPage.title);
          setPageTitle(firstPage.title);
          setContent(firstPage.content || '');
        }
      }
      
      console.log('Page deleted successfully');
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Bar - Full Width */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{book.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Progress:</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{calculateProgress()}%</span>
          </div>
          
          {/* AI Settings Dropdown */}
          <div className="relative" ref={aiDropdownRef}>
            <button
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setAiDropdownOpen(v => !v)}
            >
              <Lightbulb className="w-4 h-4" />
              <span>AI Settings</span>
            </button>
            {aiDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Features</h4>
                  <div className="space-y-2">
                    {AI_FEATURES.map((feature) => (
                      <label key={feature.key} className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={aiSettings[feature.key]}
                          onChange={() => handleAiSettingChange(feature.key)}
                          className="mr-3 w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm text-gray-700">{feature.icon} {feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
            <BarChart3 className="w-4 h-4 mr-2" />
            AI Analyzer
          </button>
          {book?.viewType === 'page' && (
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={handlePreviewClick}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
          )}
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <EditorSidebar
          book={book}
          selectedPage={selectedPage}
          onPageSelect={handlePageSelect}
          onAddNewPage={addNewPage}
          onAddNewChapter={addNewChapter}
          onDeleteChapter={handleDeleteChapter}
          onDeletePage={handleDeletePage}
          onSwitchToBookBuilder={onSwitchToBookBuilder}
        />

        {/* Center Content */}
        <div className="flex-1 flex-col">
          <EditorContent
            pageTitle={pageTitle}
            chapterTitle={chapterTitle}
            content={content}
            onTitleChange={handleTitleChange}
            onChapterChange={handleChapterChange}
            onContentChange={handleContentChange}
            lastSaved={lastSaved}
            viewType={book?.viewType || 'page'}
            showTitleField={showTitleField}
            setShowTitleField={setShowTitleField}
            getCharacterLimit={getCharacterLimit}
          />
        </div>

        {/* Right Sidebar - AI Assistant */}
        <EditorAIAssistant
          aiSettings={aiSettings}
          aiTab={aiTab}
          setAiTab={setAiTab}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
        />
      </div>

      {/* Save Button at Bottom */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Click Save to save your changes</span>
          </div>
          <span className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>
          {pageRefreshed && (
            <div className="flex items-center space-x-2 text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Page refreshed</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>Save</span>
        </button>
      </div>

      {/* Page Preview Modal */}
      {previewMode && (
        <PagePreview
          pageTitle={pageTitle}
          content={content}
          onExitPreview={handleExitPreview}
          viewType={book?.viewType || 'page'}
        />
      )}
    </div>
  );
};

export default EditorView; 