import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { ArrowLeft, Eye, User, Settings, Upload, ChevronDown, LogOut, CreditCard, Key, BookOpen, Loader2 } from 'lucide-react';
import EditorSidebar from './EditorSidebar';
import EditorContent from './EditorContent';
import EditorAIAssistant from './EditorAIAssistant';
import ProgressTracker from '../shared/ProgressTracker';
import { 
  updateBook, 
  createChapter, 
  createPage, 
  updatePage, 
  deleteChapter, 
  deletePage, 
  updateChapter 
} from '../../services/booksService';
import aiActionService from '../../services/aiActionService';

const EditorView = ({
  book,
  setBook,
  calculateProgress,
  onSwitchToBookBuilder
}) => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  
  // User profile dropdown state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  const getUserName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const handleApiKeysManage = () => {
    setShowUserDropdown(false);
    navigate('/settings/api-keys');
  };

  const handleSettingsConfigure = () => {
    setShowUserDropdown(false);
    // TODO: Navigate to general settings page
    console.log('Settings clicked');
  };

  const handleSubscriptionUpgrade = () => {
    setShowUserDropdown(false);
    // TODO: Navigate to subscription page
    console.log('Upgrade clicked');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowUserDropdown(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Loading states for different operations
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState(false);
  const [isDeletingPage, setIsDeletingPage] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null); // Track which item is being deleted
  
  // Feedback states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // State for dynamic guidance messages
  const [dynamicMessage, setDynamicMessage] = useState('');
  
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
  const [selectedPage, setSelectedPage] = useState(firstPage?.id || '');
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



  // Preview mode state
  const [previewMode, setPreviewMode] = useState(false);

  // Right sidebar state
  const [aiSettings, setAiSettings] = useState({
    aiWriter: true,
    aiSuggestions: true,
    aiAnalysis: true
  });
  const [aiTab, setAiTab] = useState('writing');
  const [aiPrompt, setAiPrompt] = useState('');

  // AI Toolbar state
  const [selectedAiCategory, setSelectedAiCategory] = useState('writing');
  const [selectedAiTools, setSelectedAiTools] = useState({
    // Writing Tools
    aiWriter: true,
    continueWriting: true,
    generatePageSummary: false,
    
    // Clarity & Style
    refactorText: false,
    enhanceStyle: false,
    simplifyLanguage: false,
    convertPOV: false,
    
    // Content Helpers
    addExamples: false,
    insertFacts: false,
    expandToList: false,
    
    // Other
    translate: false,
    plagiarismCheck: false
  });



  // Update state when book data changes
  useEffect(() => {
    console.log('EditorView - Book data changed, updating state');
    console.log('EditorView - Current selectedPage:', selectedPage);
    console.log('EditorView - Current currentPageId:', currentPageId);
    
    const firstChapter = book?.chapters?.[0];
    const firstPage = firstChapter?.pages?.[0];

    console.log('EditorView - Updated first chapter:', firstChapter);
    console.log('EditorView - Updated first page:', firstPage);

    // Only update state if no page is currently selected OR if this is the initial load
    // This prevents overriding the selection when a new page is created, but allows initial setup
    if (selectedPage && currentPageId && book?.chapters?.length > 0) {
      console.log('EditorView - Page already selected, skipping state reset');
      return;
    }

    if (firstPage) {
      setSelectedPage(firstPage.id);
      setPageTitle(firstPage.title);
      setContent(firstPage.content || '');
      setCurrentPageId(firstPage.id);
      setShowTitleField(firstPage.title && firstPage.title.trim().length > 0);
    }

    if (firstChapter) {
      setCurrentChapter(firstChapter.title);
      setChapterTitle(firstChapter.title);
      setCurrentChapterId(firstChapter.id);
    }
  }, [book, selectedPage, currentPageId]);

  // Helper functions for feedback
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => setShowErrorMessage(false), 5000);
  };

  // Removed auto-save functionality - save only happens on button click

  // Handle save
  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    
    // Check weight limit before saving
    const currentWeight = calculateWeightedLength(content);
    const maxWeight = getCharacterLimit();
    
    if (currentWeight > maxWeight) {
      showError(`Cannot save: Content exceeds weight limit. Current: ${currentWeight}, Limit: ${maxWeight}`);
      setIsSaving(false);
      return;
    }
    
    setIsSaving(true);
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
                  if (page.id === currentPageId) {
                    return { ...page, id: newPageId }; // Keep original ID if createPage is not available
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
          
          // Update the current page ID to the new Firestore ID
          setCurrentPageId(newPageId);
          
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
      
      // Keep the current page selected by ID, not by title
      // This prevents highlighting issues and redirects
      setSelectedPage(currentPageId);
      setCurrentChapter(chapterTitle);
      setLastSaved(new Date());
      
      console.log('Save completed - maintaining selection:', {
        selectedPage: currentPageId,
        currentChapter: chapterTitle,
        pageTitle: pageTitle
      });
      
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
      showSuccess('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving book data:', error);
      showError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
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
      setSelectedPage(selectedPageData.id);
      setPageTitle(selectedPageData.title);
      setContent(selectedPageData.content || '');
      setCurrentPageId(selectedPageData.id);
      // Show title field if page has a title, otherwise hide it
      setShowTitleField(selectedPageData.title && selectedPageData.title.trim().length > 0);
      
      if (selectedChapterData) {
        setCurrentChapter(selectedChapterData.title);
        setChapterTitle(selectedChapterData.title);
        setCurrentChapterId(selectedChapterData.id);
      }
    }
  };

  // Character limits based on whether page has a title
  // Weighted scoring system for content limits
  const calculateWeightedLength = (text) => {
    if (!text) return 0;
    
    let weight = 0;
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];
      
      // Check for paragraph breaks (double line breaks)
      if (line.trim() === '' && nextLine && nextLine.trim() === '') {
        weight += 24; // Paragraph end
        continue;
      }
      
      // Check for single line breaks
      if (line.trim() === '') {
        weight += 12; // Line break
        continue;
      }
      
      // Check for markdown headings
      if (line.startsWith('# ')) {
        weight += 30; // H1 heading
        weight += line.length - 2; // Add remaining characters
        continue;
      }
      if (line.startsWith('## ')) {
        weight += 30; // H2 heading
        weight += line.length - 3; // Add remaining characters
        continue;
      }
      if (line.startsWith('### ')) {
        weight += 30; // H3 heading
        weight += line.length - 4; // Add remaining characters
        continue;
      }
      
      // Check for list bullets
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        weight += 10; // List bullet
        weight += line.length; // Add all characters including bullet
        continue;
      }
      
      // Normal text - count each character
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === ' ') {
          weight += 1; // Space
        } else {
          weight += 1; // Normal character
        }
      }
    }
    
    return weight;
  };

  const getCharacterLimit = () => {
    const BASE_WEIGHT = 1500;
    
    // If no title or empty title, return base weight
    if (!pageTitle || pageTitle.trim() === "") {
      return BASE_WEIGHT;
    }

    // Calculate title weight based on length
    // Each character in title takes approximately 2x space due to larger font size
    const titleWeight = Math.min(pageTitle.length * 2, 500); // Cap at 500 to prevent negative limits
    
    // Return dynamic weight limit
    const dynamicLimit = BASE_WEIGHT - titleWeight;
    
    // Ensure minimum limit of 800 weight
    return Math.max(dynamicLimit, 800);
  };

  // Preview mode handlers
  const handlePreviewClick = () => {
    // Navigate to the preview screen
    navigate(`/preview/${book.id}`);
  };

  const handleExitPreview = () => {
    setPreviewMode(false);
  };



  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    const maxWeight = getCharacterLimit();
    
    // The EditorContent component now handles limit enforcement
    // We trust that the content passed here is within limits
    setContent(newContent);
    
    // Update the page data in the book state so sidebar reflects the change
    if (currentPageId && currentChapterId) {
      const updatedChapters = book.chapters.map(chapter => {
        if (chapter.id === currentChapterId) {
          return {
            ...chapter,
            pages: chapter.pages.map(page => {
              if (page.id === currentPageId) {
                return {
                  ...page,
                  content: newContent
                };
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
    }
  };

  // Handle book metadata updates
  const handleUpdateBookMetadata = async (updatedBook) => {
    try {
      setBook(updatedBook);
      
      // Save to Firestore
      await updateBook(book.id, {
        shortDescription: updatedBook.shortDescription,
        fullDescription: updatedBook.fullDescription,
        tags: updatedBook.tags,
        tone: updatedBook.tone,
        publishedYear: updatedBook.publishedYear
      });
      
      showSuccess('Book metadata updated successfully');
    } catch (error) {
      console.error('Error updating book metadata:', error);
      showError('Failed to update book metadata');
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setPageTitle(newTitle);
    
    // Update the page data in the book state so sidebar reflects the change
    if (currentPageId && currentChapterId) {
      const updatedChapters = book.chapters.map(chapter => {
        if (chapter.id === currentChapterId) {
          return {
            ...chapter,
            pages: chapter.pages.map(page => {
              if (page.id === currentPageId) {
                return {
                  ...page,
                  title: newTitle
                };
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
    }
  };

  // Handle chapter change
  const handleChapterChange = (e) => {
    setChapterTitle(e.target.value);
    // Don't update currentChapter here - keep the original chapter title for finding the chapter
  };

  // Add new page
  const addNewPage = async (chapterId = null) => {
    if (isCreatingPage) return; // Prevent multiple page creations
    
    setIsCreatingPage(true);
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
      const pageTitleUnique = '';
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
      setSelectedPage(newPage.id);
      setPageTitle(newPage.title);
      setContent('');
      setCurrentPageId(newPage.id);
      setCurrentChapterId(targetChapter.id);
      setCurrentChapter(targetChapter.title);
      setChapterTitle(targetChapter.title);
      setShowTitleField(true);
      
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        console.log('New page added successfully and switched to it');
        console.log('Current selected page ID:', newPage.id);
        console.log('Current page title:', newPage.title);
        console.log('Current content:', '');
      }, 100);
    } catch (error) {
      console.error('Error adding new page:', error);
    } finally {
      setIsCreatingPage(false);
    }
  };

  // Add new chapter
  const addNewChapter = async () => {
    if (isCreatingChapter) return; // Prevent multiple chapter creations
    
    setIsCreatingChapter(true);
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
        title: '',
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
      setSelectedPage(newChapter.pages[0].id);
      setPageTitle(newChapter.pages[0].title);
      setContent(newChapter.pages[0].content);
      setCurrentPageId(newChapter.pages[0].id);
      setCurrentChapterId(newChapter.id);
      setShowTitleField(true);
      
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        console.log('New chapter with default page added successfully and switched to it');
        console.log('Current selected page ID:', newChapter.pages[0].id);
        console.log('Current page title:', newChapter.pages[0].title);
        console.log('Current content:', newChapter.pages[0].content);
      }, 100);
    } catch (error) {
      console.error('Error adding new chapter:', error);
    } finally {
      setIsCreatingChapter(false);
    }
  };

  // Delete chapter
  const handleDeleteChapter = async (chapterId) => {
    if (isDeletingChapter) return; // Prevent multiple chapter deletions
    
    setIsDeletingChapter(true);
    setDeletingItemId(chapterId);
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
          setSelectedPage(firstPage.id);
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
    } finally {
      setIsDeletingChapter(false);
      setDeletingItemId(null);
    }
  };

  // Delete page
  const handleDeletePage = async (chapterId, pageId) => {
    if (isDeletingPage) return; // Prevent multiple page deletions
    
    setIsDeletingPage(true);
    setDeletingItemId(pageId);
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
            setSelectedPage(firstPage.id);
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
          setSelectedPage(firstPage.id);
          setPageTitle(firstPage.title);
          setContent(firstPage.content || '');
        }
      }
      
      console.log('Page deleted successfully');
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsDeletingPage(false);
      setDeletingItemId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Bar - Full Width */}
      <div 
        className="flex items-center justify-between px-6 py-4"
        style={{ 
          backgroundColor: '#1e1e2f', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: 'white'
        }}
      >
        {/* Left Section - Back Button and Title */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-xl font-bold text-white truncate max-w-md">{book.title}</h1>
        </div>

        {/* Right Section - Action Buttons and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Book Progress Button */}
          <ProgressTracker 
            book={book}
            onPublish={handlePreviewClick}
          />
          
          <button 
            onClick={handlePreviewClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 flex items-center shadow-lg"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>

          {/* User Profile Dropdown */}
          <div className="relative flex-shrink-0" ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              {/* User Info */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {getUserName()}
                </p>
                <p className="text-xs text-gray-300">Author</p>
              </div>
              
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20 hover:border-white/30 transition-all duration-200">
                {getUserInitial()}
              </div>
              
              {/* Dropdown Arrow */}
              <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                      {getUserInitial()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{getUserName()}</h3>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* Reader Mode Switch */}
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Switch to Reader Mode</h4>
                        <p className="text-sm text-gray-600">Browse and read books</p>
                      </div>
                      <button 
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/main');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Switch
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Subscription Plan Section */}
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Subscription Plan</h4>
                        <p className="text-sm text-gray-600">Free Plan</p>
                      </div>
                      <button 
                        onClick={handleSubscriptionUpgrade}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>

                  {/* API Keys Section */}
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">API Keys</h4>
                        <p className="text-sm text-gray-600">Manage your API keys</p>
                      </div>
                      <button
                        onClick={handleApiKeysManage}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Manage
                      </button>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Settings</h4>
                        <p className="text-sm text-gray-600">Account preferences</p>
                      </div>
                      <button
                        onClick={handleSettingsConfigure}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Configure
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-200 text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Sign Out</h4>
                      <p className="text-sm text-gray-600">Log out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <EditorSidebar
          book={book}
          selectedPage={selectedPage}
          selectedChapter={currentChapter}
          onPageSelect={handlePageSelect}
          onAddNewPage={addNewPage}
          onAddNewChapter={addNewChapter}
          onDeleteChapter={handleDeleteChapter}
          onDeletePage={handleDeletePage}
          onSwitchToBookBuilder={onSwitchToBookBuilder}
          isCreatingChapter={isCreatingChapter}
          isCreatingPage={isCreatingPage}
          isDeletingChapter={isDeletingChapter}
          isDeletingPage={isDeletingPage}
          deletingItemId={deletingItemId}
        />

        {/* Center Content */}
        <div className="flex-1 flex-col bg-white">
          {/* AI Tools Toolbar - Constrained to content area */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-6 py-3">
              <div className="flex gap-x-2 justify-center">
                <button
                  onClick={() => setSelectedAiCategory('writing')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    selectedAiCategory === 'writing'
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">✍️</span>
                  <span className="font-medium">Writing Tools</span>
                </button>
                
                <button
                  onClick={() => setSelectedAiCategory('clarity')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    selectedAiCategory === 'clarity'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">🧠</span>
                  <span className="font-medium">Editing Aids</span>
                </button>
                
                <button
                  onClick={() => setSelectedAiCategory('content')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    selectedAiCategory === 'content'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">📚</span>
                  <span className="font-medium">Content Helpers</span>
                </button>
                
                <button
                  onClick={() => setSelectedAiCategory('other')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    selectedAiCategory === 'other'
                      ? 'bg-orange-100 text-orange-700 border-2 border-orange-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">🌐</span>
                  <span className="font-medium">Translation</span>
                </button>
                
                <button
                  onClick={() => setSelectedAiCategory('utilities')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    selectedAiCategory === 'utilities'
                      ? 'bg-gray-100 text-gray-700 border-2 border-gray-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium">Utilities</span>
                </button>
              </div>
            </div>
          </div>

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
          handleSave={handleSave}
          isSaving={isSaving}
          selectedAiTools={selectedAiTools}
          selectedCategory={selectedAiCategory}
          onDynamicMessageChange={setDynamicMessage}
          />
        </div>

        {/* Right Sidebar */}
        <EditorAIAssistant
          aiSettings={aiSettings}
          aiTab={aiTab}
          setAiTab={setAiTab}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          pageTitle={pageTitle}
          content={content}
          viewType={book?.viewType || 'page'}
        />

      </div>

            {/* Save Button at Bottom */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        {/* Left side - Dynamic hints */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-500">
            {dynamicMessage || "Hover over buttons or focus on fields for guidance"}
          </span>
        </div>
        
        {/* Right side - Static save info */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Click Save to save your changes</span>
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
          className={`btn-primary flex items-center space-x-2 ${isSaving ? 'save-progress' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </>
          )}
        </button>
      </div>

      {/* Page Preview Modal */}
      {console.log('EditorView - Rendering PagePreview, previewMode:', previewMode)}
      {previewMode && (
        <PagePreview
          pageTitle={pageTitle}
          content={content}
          onExitPreview={handleExitPreview}
          viewType={book?.viewType || 'page'}
        />
      )}
      
      {/* Loading Overlay */}
      {(isSaving || isCreatingChapter || isCreatingPage || isDeletingChapter || isDeletingPage) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center loading-overlay">
          <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4 loading-content">
            <Loader2 className="w-6 h-6 animate-spin text-[#4299e1]" />
            <div className="text-gray-700 font-medium">
              {isSaving && 'Saving changes...'}
              {isCreatingChapter && 'Creating new chapter...'}
              {isCreatingPage && 'Creating new page...'}
              {isDeletingChapter && 'Deleting chapter...'}
              {isDeletingPage && 'Deleting page...'}
            </div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 loading-content">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 loading-content">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}
      
      {console.log('Rendering EditorView, previewMode:', previewMode)}
    </div>
  );
};

export default EditorView; 