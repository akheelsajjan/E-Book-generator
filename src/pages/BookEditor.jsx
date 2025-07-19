import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useRef } from 'react';
import { ArrowLeft, Lightbulb, BarChart3, Eye, Download, Plus, BookOpen, FileText, Star, Zap, Lightbulb as LightbulbIcon, User, List } from 'lucide-react';

const AI_FEATURES = [
  { key: 'aiWriter', label: 'AI Writer', icon: '✍️' },
  { key: 'aiEnhancer', label: 'AI Enhancer', icon: '✨' },
  { key: 'aiOutline', label: 'AI Outline', icon: '📋' },
  { key: 'aiAssistant', label: 'AI Assistant', icon: '🤖' },
  { key: 'aiSuggestions', label: 'AI Suggestions', icon: '💡' },
  { key: 'aiResearch', label: 'AI Research', icon: '🔍' },
  { key: 'aiAnalysis', label: 'AI Analysis', icon: '📊' },
  { key: 'aiGrammar', label: 'AI Grammar Check', icon: '📝' },
  { key: 'aiPlagiarism', label: 'AI Plagiarism Check', icon: '🔒' },
];

const BookEditor = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Add custom styles for range sliders
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .draggable-text:hover {
        opacity: 0.8;
        transform: scale(1.02);
        transition: all 0.2s ease;
      }
      .draggable-text:active {
        cursor: grabbing;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // State for view switching
  const [currentView, setCurrentView] = useState('editor'); // 'editor' or 'bookBuilder'
  const [activeBookBuilderTab, setActiveBookBuilderTab] = useState('cover');
  
  // Book Cover State (Task BB-002: Book Cover Data Structure)
  const [bookCover, setBookCover] = useState({
    title: '',
    subtitle: '',
    author: 'Your Name',
    coverImage: null,
    fontFamily: 'serif',
    textColor: '#ffffff',
    backgroundColor: '#667eea',
    backgroundGradient: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    template: 'default',
    // Text sizes for each element
    titleSize: 48,
    subtitleSize: 24,
    authorSize: 18,
    // Text positions for drag-and-drop
    titlePosition: { x: 50, y: 30 },
    subtitlePosition: { x: 50, y: 50 },
    authorPosition: { x: 50, y: 80 },
    // Drag state
    isDragging: false,
    draggedElement: null
  });
  
  // Book Cover UI State
  const [activeCoverTab, setActiveCoverTab] = useState('basic'); // 'basic', 'design', 'cover'
  
  // State for book data
  const [book, setBook] = useState({
    id: bookId,
    title: 'My First eBook',
    chapters: [
      {
        id: '1',
        title: 'Getting Started',
        pages: [
          {
            id: '1-1',
            title: 'Introduction',
            content: 'Welcome to your ebook creation journey!',
            chapterId: '1'
          }
        ]
      },
      {
        id: '2',
        title: 'Foundations',
        pages: [
          {
            id: '2-1',
            title: 'Chapter 1: Foundations',
            content: 'This chapter will cover the fundamental concepts...',
            chapterId: '2'
          }
        ]
      }
    ]
  });

  // State for current page
  const [currentPage, setCurrentPage] = useState({
    id: '1-1',
    title: 'Introduction',
    content: 'Welcome to your ebook creation journey!\n\nThis chapter will cover the fundamental concepts you need to understand before diving deeper into the subject matter.\n\nIn this section, we\'ll explore:\n- The basic principles that govern our topic\n- Key terminology you\'ll encounter throughout this book\n- Essential background knowledge for beginners\n\nLet\'s begin by understanding why this topic is important and how it can benefit you in your personal or professional life.',
    chapterId: '1'
  });

  // State for AI assistant
  const [aiTab, setAiTab] = useState('writing');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [aiSettings, setAiSettings] = useState({
    all: true,
    aiWriter: true,
    aiEnhancer: true,
    aiOutline: true,
    aiAssistant: true,
    aiSuggestions: true,
    aiResearch: true,
    aiAnalysis: true,
    aiGrammar: true,
    aiPlagiarism: true,
  });
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const aiDropdownRef = useRef(null);

  // Book Builder tabs
  const bookBuilderTabs = [
    { id: 'cover', label: 'Book Cover', icon: BookOpen },
    { id: 'toc', label: 'Table of Contents', icon: List },
    { id: 'author', label: 'About Author', icon: User },
    { id: 'preface', label: 'Preface', icon: FileText },
    { id: 'appendix', label: 'Appendix', icon: FileText },
  ];

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [currentPage]);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) {
        setAiDropdownOpen(false);
      }
    }
    if (aiDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aiDropdownOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
  };

  const handleContentChange = (e) => {
    setCurrentPage(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleTitleChange = (e) => {
    setCurrentPage(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleChapterChange = (e) => {
    setCurrentPage(prev => ({
      ...prev,
      chapterId: e.target.value
    }));
  };

  const addNewPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      title: 'New Page',
      content: '',
      chapterId: currentPage.chapterId
    };
    
    // Add to book structure
    const updatedBook = { ...book };
    const chapter = updatedBook.chapters.find(c => c.id === currentPage.chapterId);
    if (chapter) {
      chapter.pages.push(newPage);
      setBook(updatedBook);
      setCurrentPage(newPage);
    }
  };

  const addNewChapter = () => {
    const newChapter = {
      id: `chapter-${Date.now()}`,
      title: 'New Chapter',
      pages: []
    };
    
    setBook(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  const calculateProgress = () => {
    const totalPages = book.chapters.reduce((acc, chapter) => acc + chapter.pages.length, 0);
    const completedPages = book.chapters.reduce((acc, chapter) => 
      acc + chapter.pages.filter(page => page.content.trim().length > 50).length, 0
    );
    return totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;
  };

  const handleAiSettingChange = (key) => {
    if (key === 'all') {
      const newValue = !aiSettings.all;
      setAiSettings({
        all: newValue,
        aiWriter: newValue,
        aiEnhancer: newValue,
        aiOutline: newValue,
        aiAssistant: newValue,
        aiSuggestions: newValue,
        aiResearch: newValue,
        aiAnalysis: newValue,
        aiGrammar: newValue,
        aiPlagiarism: newValue,
      });
    } else {
      const newSettings = { ...aiSettings, [key]: !aiSettings[key] };
      newSettings.all = AI_FEATURES.every(f => newSettings[f.key]);
      setAiSettings(newSettings);
    }
  };

  // Book Cover Handlers (Task BB-003: Book Cover Form Components)
  const handleCoverFieldChange = (field, value) => {
    setBookCover(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoverReset = () => {
    setBookCover({
      title: '',
      subtitle: '',
      author: 'Your Name',
      coverImage: null,
      fontFamily: 'serif',
      textColor: '#ffffff',
      backgroundColor: '#667eea',
      backgroundGradient: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      template: 'default',
      titleSize: 48,
      subtitleSize: 24,
      authorSize: 18,
      titlePosition: { x: 50, y: 30 },
      subtitlePosition: { x: 50, y: 50 },
      authorPosition: { x: 50, y: 80 },
      isDragging: false,
      draggedElement: null
    });
  };

  const handleCoverSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving book cover:', bookCover);
  };

  // Drag and Drop Handlers
  const handleMouseDown = (element) => {
    setBookCover(prev => ({
      ...prev,
      isDragging: true,
      draggedElement: element
    }));
  };

  const handleMouseMove = (e) => {
    if (!bookCover.isDragging || !bookCover.draggedElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setBookCover(prev => ({
      ...prev,
      [`${bookCover.draggedElement}Position`]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setBookCover(prev => ({
      ...prev,
      isDragging: false,
      draggedElement: null
    }));
  };

  // Text Size Handlers
  const handleTextSizeChange = (element, size) => {
    setBookCover(prev => ({
      ...prev,
      [`${element}Size`]: size
    }));
  };

  // Table of Contents State and Handlers
  const [tocData, setTocData] = useState({
    chapters: [
      {
        id: '1',
        title: 'Introduction',
        status: 'completed',
        subchapters: [
          { id: '1-1', title: 'Getting Started', status: 'completed' },
          { id: '1-2', title: 'Overview', status: 'draft' }
        ]
      },
      {
        id: '2',
        title: 'Foundations',
        status: 'draft',
        subchapters: [
          { id: '2-1', title: 'Basic Concepts', status: 'draft' },
          { id: '2-2', title: 'Advanced Topics', status: 'not-started' }
        ]
      },
      {
        id: '3',
        title: 'Implementation',
        status: 'not-started',
        subchapters: []
      }
    ],
    autoNumbering: true,
    searchTerm: ''
  });

  const [activeTocTab, setActiveTocTab] = useState('structure'); // 'structure', 'preview', 'settings'

  // TOC Handlers
  const handleAddChapter = () => {
    const newChapter = {
      id: `chapter-${Date.now()}`,
      title: 'New Chapter',
      status: 'not-started',
      subchapters: []
    };
    setTocData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  const handleAddSubchapter = (chapterId) => {
    const newSubchapter = {
      id: `subchapter-${Date.now()}`,
      title: 'New Subchapter',
      status: 'not-started'
    };
    setTocData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, subchapters: [...chapter.subchapters, newSubchapter] }
          : chapter
      )
    }));
  };

  const handleEditChapter = (chapterId, newTitle) => {
    setTocData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, title: newTitle }
          : chapter
      )
    }));
  };

  const handleEditSubchapter = (chapterId, subchapterId, newTitle) => {
    setTocData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { 
              ...chapter, 
              subchapters: chapter.subchapters.map(sub => 
                sub.id === subchapterId 
                  ? { ...sub, title: newTitle }
                  : sub
              )
            }
          : chapter
      )
    }));
  };

  const handleDeleteChapter = (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setTocData(prev => ({
        ...prev,
        chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
      }));
    }
  };

  const handleDeleteSubchapter = (chapterId, subchapterId) => {
    if (window.confirm('Are you sure you want to delete this subchapter?')) {
      setTocData(prev => ({
        ...prev,
        chapters: prev.chapters.map(chapter => 
          chapter.id === chapterId 
            ? { 
                ...chapter, 
                subchapters: chapter.subchapters.filter(sub => sub.id !== subchapterId)
              }
            : chapter
        )
      }));
    }
  };

  const handleStatusChange = (chapterId, subchapterId = null, newStatus) => {
    setTocData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? subchapterId 
            ? { 
                ...chapter, 
                subchapters: chapter.subchapters.map(sub => 
                  sub.id === subchapterId 
                    ? { ...sub, status: newStatus }
                    : sub
                )
              }
            : { ...chapter, status: newStatus }
          : chapter
      )
    }));
  };

  const handleToggleAutoNumbering = () => {
    setTocData(prev => ({
      ...prev,
      autoNumbering: !prev.autoNumbering
    }));
  };

  const handleTocSearch = (searchTerm) => {
    setTocData(prev => ({
      ...prev,
      searchTerm
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'draft':
        return '📝';
      case 'not-started':
        return '⏳';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'draft':
        return 'text-yellow-600';
      case 'not-started':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  // About Author State and Handlers
  const [authorData, setAuthorData] = useState({
    name: 'Your Name',
    title: 'Author & Expert',
    bio: 'A passionate writer and industry expert with over 10 years of experience in the field. Dedicated to sharing knowledge and helping others succeed.',
    credentials: [
      'PhD in Computer Science',
      '15+ years industry experience',
      'Published 50+ research papers',
      'Speaker at international conferences'
    ],
    photo: null,
    website: 'https://yourwebsite.com',
    email: 'author@example.com',
    social: {
      linkedin: 'https://linkedin.com/in/yourauthor',
      twitter: 'https://twitter.com/yourauthor',
      github: 'https://github.com/yourauthor'
    },
    achievements: [
      'Best-selling author',
      'Industry thought leader',
      'Award-winning researcher'
    ],
    // Toggle switches for optional sections
    showCredentials: true,
    showAchievements: true,
    showSocialLinks: true,
    showContactInfo: true
  });

  const [activeAuthorTab, setActiveAuthorTab] = useState('basic'); // 'basic', 'bio', 'social', 'photo'

  // About Author Handlers
  const handleAuthorFieldChange = (field, value) => {
    setAuthorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialFieldChange = (platform, value) => {
    setAuthorData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  };

  const handleAddCredential = () => {
    setAuthorData(prev => ({
      ...prev,
      credentials: [...prev.credentials, 'New Credential']
    }));
  };

  const handleEditCredential = (index, value) => {
    setAuthorData(prev => ({
      ...prev,
      credentials: prev.credentials.map((cred, i) => i === index ? value : cred)
    }));
  };

  const handleDeleteCredential = (index) => {
    setAuthorData(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }));
  };

  const handleAddAchievement = () => {
    setAuthorData(prev => ({
      ...prev,
      achievements: [...prev.achievements, 'New Achievement']
    }));
  };

  const handleEditAchievement = (index, value) => {
    setAuthorData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => i === index ? value : ach)
    }));
  };

  const handleDeleteAchievement = (index) => {
    setAuthorData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleAuthorReset = () => {
    setAuthorData({
      name: 'Your Name',
      title: 'Author & Expert',
      bio: 'A passionate writer and industry expert with over 10 years of experience in the field. Dedicated to sharing knowledge and helping others succeed.',
      credentials: [
        'PhD in Computer Science',
        '15+ years industry experience',
        'Published 50+ research papers',
        'Speaker at international conferences'
      ],
      photo: null,
      website: 'https://yourwebsite.com',
      email: 'author@example.com',
      social: {
        linkedin: 'https://linkedin.com/in/yourauthor',
        twitter: 'https://twitter.com/yourauthor',
        github: 'https://github.com/yourauthor'
      },
      achievements: [
        'Best-selling author',
        'Industry thought leader',
        'Award-winning researcher'
      ],
      // Toggle switches for optional sections
      showCredentials: true,
      showAchievements: true,
      showSocialLinks: true,
      showContactInfo: true
    });
  };

  const handleAuthorSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving author data:', authorData);
  };

  // Preface State and Handlers
  const [prefaceData, setPrefaceData] = useState({
    title: 'Preface',
    subtitle: '',
    content: 'This book represents the culmination of years of research, experience, and passion for the subject matter. It is designed to provide readers with a comprehensive understanding of the topic while remaining accessible to both beginners and advanced practitioners.',
    author: 'Your Name',
    date: new Date().toLocaleDateString(),
    acknowledgments: [
      'To my family for their unwavering support',
      'To my mentors who guided me through this journey',
      'To my colleagues who provided valuable insights'
    ],
    showAcknowledgments: true,
    showDate: true,
    showAuthor: true
  });

  const [activePrefaceTab, setActivePrefaceTab] = useState('content'); // 'content', 'acknowledgments', 'preview'

  // Preface Handlers
  const handlePrefaceFieldChange = (field, value) => {
    setPrefaceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAcknowledgments = () => {
    setPrefaceData(prev => ({
      ...prev,
      acknowledgments: [...prev.acknowledgments, 'New acknowledgment']
    }));
  };

  const handleEditAcknowledgments = (index, value) => {
    setPrefaceData(prev => ({
      ...prev,
      acknowledgments: prev.acknowledgments.map((ack, i) => i === index ? value : ack)
    }));
  };

  const handleDeleteAcknowledgments = (index) => {
    setPrefaceData(prev => ({
      ...prev,
      acknowledgments: prev.acknowledgments.filter((_, i) => i !== index)
    }));
  };

  const handlePrefaceReset = () => {
    setPrefaceData({
      title: 'Preface',
      subtitle: '',
      content: 'This book represents the culmination of years of research, experience, and passion for the subject matter. It is designed to provide readers with a comprehensive understanding of the topic while remaining accessible to both beginners and advanced practitioners.',
      author: 'Your Name',
      date: new Date().toLocaleDateString(),
      acknowledgments: [
        'To my family for their unwavering support',
        'To my mentors who guided me through this journey',
        'To my colleagues who provided valuable insights'
      ],
      showAcknowledgments: true,
      showDate: true,
      showAuthor: true
    });
  };

  const handlePrefaceSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving preface data:', prefaceData);
  };

  // Appendix State and Handlers
  const [appendixData, setAppendixData] = useState({
    title: 'Appendix',
    sections: [
      {
        id: '1',
        title: 'Appendix A: Glossary',
        content: 'This appendix contains definitions of key terms used throughout the book.',
        type: 'glossary'
      },
      {
        id: '2',
        title: 'Appendix B: References',
        content: 'A comprehensive list of sources and references cited in this book.',
        type: 'references'
      },
      {
        id: '3',
        title: 'Appendix C: Additional Resources',
        content: 'Further reading materials and resources for continued learning.',
        type: 'resources'
      }
    ],
    showSectionNumbers: true,
    showTableOfContents: true
  });

  const [activeAppendixTab, setActiveAppendixTab] = useState('sections'); // 'sections', 'preview'

  // Appendix Handlers
  const handleAppendixFieldChange = (field, value) => {
    setAppendixData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAppendixSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Appendix Section',
      content: 'Content for the new appendix section.',
      type: 'general'
    };
    setAppendixData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleEditAppendixSection = (sectionId, field, value) => {
    setAppendixData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleDeleteAppendixSection = (sectionId) => {
    setAppendixData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleAppendixReset = () => {
    setAppendixData({
      title: 'Appendix',
      sections: [
        {
          id: '1',
          title: 'Appendix A: Glossary',
          content: 'This appendix contains definitions of key terms used throughout the book.',
          type: 'glossary'
        },
        {
          id: '2',
          title: 'Appendix B: References',
          content: 'A comprehensive list of sources and references cited in this book.',
          type: 'references'
        },
        {
          id: '3',
          title: 'Appendix C: Additional Resources',
          content: 'Further reading materials and resources for continued learning.',
          type: 'resources'
        }
      ],
      showSectionNumbers: true,
      showTableOfContents: true
    });
  };

  const handleAppendixSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving appendix data:', appendixData);
  };

  // Replace the current author preview state and logic with:
  const [authorPreviewPage, setAuthorPreviewPage] = useState(0);
  const [authorPreviewPages, setAuthorPreviewPages] = useState([]);
  const authorPreviewRef = useRef(null);

  // Function to render author preview content
  const renderAuthorPreviewContent = (data) => {
    const sections = [];
    
    // Header section
    sections.push({
      type: 'header',
      content: (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">About the Author</h2>
        </div>
      )
    });

    // Author info section
    sections.push({
      type: 'author-info',
      content: (
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            {data.photo ? (
              <img src={URL.createObjectURL(data.photo)} alt="Author" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-900">{data.name || 'Your Name'}</div>
            <div className="text-gray-600">{data.title || 'Author & Expert'}</div>
          </div>
        </div>
      )
    });

    // Bio section
    if (data.bio) {
      sections.push({
        type: 'bio',
        content: (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{data.bio}</p>
          </div>
        )
      });
    }

    // Credentials section
    if (data.showCredentials && data.credentials.length > 0) {
      sections.push({
        type: 'credentials',
        content: (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Credentials</h3>
            <ul className="space-y-2">
              {data.credentials.map((credential, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{credential}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      });
    }

    // Achievements section
    if (data.showAchievements && data.achievements.length > 0) {
      sections.push({
        type: 'achievements',
        content: (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
            <ul className="space-y-2">
              {data.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      });
    }

    // Contact section
    if (data.showContactInfo && (data.email || data.website)) {
      sections.push({
        type: 'contact',
        content: (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
            <div className="space-y-2">
              {data.email && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{data.email}</span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  <span className="text-blue-600 hover:underline">{data.website}</span>
                </div>
              )}
            </div>
          </div>
        )
      });
    }

    // Social links section
    if (data.showSocialLinks && (data.social.linkedin || data.social.twitter || data.social.github)) {
      sections.push({
        type: 'social',
        content: (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Social</h3>
            <div className="space-y-2">
              {data.social.linkedin && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-gray-700">{data.social.linkedin}</span>
                </div>
              )}
              {data.social.twitter && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-gray-700">{data.social.twitter}</span>
                </div>
              )}
              {data.social.github && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-gray-700">{data.social.github}</span>
                </div>
              )}
            </div>
          </div>
        )
      });
    }

    return sections;
  };

  // Function to split content into pages
  const splitContentIntoPages = (sections) => {
    const pages = [];
    let currentPage = [];
    let currentHeight = 0;
    const maxPageHeight = 600; // Maximum height per page

    sections.forEach((section) => {
      // Estimate section height (you can make this more sophisticated)
      const estimatedHeight = section.type === 'header' ? 80 : 
                             section.type === 'author-info' ? 100 :
                             section.type === 'bio' ? 120 :
                             section.type === 'credentials' ? 150 :
                             section.type === 'achievements' ? 150 :
                             section.type === 'contact' ? 100 :
                             section.type === 'social' ? 100 : 80;

      if (currentHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
        // Start a new page
        pages.push([...currentPage]);
        currentPage = [section];
        currentHeight = estimatedHeight;
      } else {
        // Add to current page
        currentPage.push(section);
        currentHeight += estimatedHeight;
      }
    });

    // Add the last page if it has content
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  // Effect to update pages when author data changes
  useEffect(() => {
    if (activeBookBuilderTab === 'author') {
      const sections = renderAuthorPreviewContent(authorData);
      const pages = splitContentIntoPages(sections);
      setAuthorPreviewPages(pages);
      setAuthorPreviewPage(0);
    }
  }, [authorData, activeBookBuilderTab]);

  // Render Book Builder Layout
  // Single return statement with conditional rendering
  return (
    <>
      {currentView === 'bookBuilder' ? (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header Bar - Same as Editor */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('editor')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{book.title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress Bar - Same as Editor */}
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

            {/* AI Settings Dropdown - Modified for Book Builder */}
            <div className="relative" ref={aiDropdownRef}>
              <button
                className="btn-secondary flex items-center"
                onClick={() => setAiDropdownOpen(v => !v)}
              >
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Book Settings
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {aiDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Book Builder Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Auto-generate TOC</span>
                      </label>
                      <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Include page numbers</span>
                      </label>
                      <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Add chapter summaries</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button className="btn-secondary flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Book Analyzer
            </button>
            <button className="btn-secondary flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button className="btn-primary bg-green-600 hover:bg-green-700 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Book Builder Navigation */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Book Builder Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-lg font-semibold text-gray-900">Book Builder</h1>
            </div>

            {/* Pages & Chapters Button */}
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setCurrentView('editor')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center mb-3"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Pages & Chapters
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {bookBuilderTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveBookBuilderTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeBookBuilderTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area - Split Layout */}
          <div className="flex-1 bg-white flex">
            {/* Left Panel - Editor */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              {/* Editor Header */}
              <div className="p-6 border-b border-gray-200">
                {activeBookBuilderTab === 'cover' && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Book Cover</h2>
                    <p className="text-sm text-gray-600">Design your book cover and set up basic information</p>
                    
                    {/* Sub-tabs */}
                    <div className="flex space-x-6 mt-4 border-b border-gray-200">
                      {[
                        { id: 'basic', label: 'Basic Info', icon: 'T' },
                        { id: 'design', label: 'Design', icon: '🎨' },
                        { id: 'cover', label: 'Cover', icon: '🖼️' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveCoverTab(tab.id)}
                          className={`flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeCoverTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeBookBuilderTab === 'toc' && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Table of Contents</h2>
                    <p className="text-sm text-gray-600">Structure your book with chapters and subchapters</p>
                    
                    {/* Sub-tabs */}
                    <div className="flex space-x-6 mt-4 border-b border-gray-200">
                      {[
                        { id: 'structure', label: 'Structure', icon: '📋' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTocTab(tab.id)}
                          className={`flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTocTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeBookBuilderTab === 'author' && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">About Author</h2>
                    <p className="text-sm text-gray-600">Create your author profile and biography</p>
                    
                    {/* Sub-tabs */}
                    <div className="flex space-x-6 mt-4 border-b border-gray-200">
                      {[
                        { id: 'basic', label: 'Basic Info', icon: '👤' },
                        { id: 'bio', label: 'Biography', icon: '📝' },
                        { id: 'social', label: 'Social Links', icon: '🔗' },
                        { id: 'photo', label: 'Photo', icon: '📷' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveAuthorTab(tab.id)}
                          className={`flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeAuthorTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Preface Tabs */}
                {activeBookBuilderTab === 'preface' && (
                  <>
                    <div className="flex border-b border-gray-200">
                      {[
                        { id: 'content', label: 'Content', icon: '📝' },
                        { id: 'acknowledgments', label: 'Acknowledgments', icon: '🙏' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActivePrefaceTab(tab.id)}
                          className={`flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activePrefaceTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Appendix Tabs */}
                {activeBookBuilderTab === 'appendix' && (
                  <>
                    <div className="flex border-b border-gray-200">
                      {[
                        { id: 'sections', label: 'Sections', icon: '📋' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveAppendixTab(tab.id)}
                          className={`flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeAppendixTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Editor Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Book Cover Content */}
                {activeBookBuilderTab === 'cover' && (
                  <>
                    {activeCoverTab === 'basic' && (
                      <div className="space-y-6">
                        {/* Title Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={bookCover.title}
                            onChange={(e) => handleCoverFieldChange('title', e.target.value)}
                            placeholder="Enter book title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Subtitle Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={bookCover.subtitle}
                            onChange={(e) => handleCoverFieldChange('subtitle', e.target.value)}
                            placeholder="Enter subtitle (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Author Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author *
                          </label>
                          <input
                            type="text"
                            value={bookCover.author}
                            onChange={(e) => handleCoverFieldChange('author', e.target.value)}
                            placeholder="Enter author name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {activeCoverTab === 'design' && (
                      <div className="space-y-6">
                        {/* Font Family Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Family
                          </label>
                          <select
                            value={bookCover.fontFamily}
                            onChange={(e) => handleCoverFieldChange('fontFamily', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="serif">Serif</option>
                            <option value="sans">Sans</option>
                            <option value="display">Display</option>
                          </select>
                        </div>

                        {/* Text Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text Color
                          </label>
                          <input
                            type="color"
                            value={bookCover.textColor}
                            onChange={(e) => handleCoverFieldChange('textColor', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                          />
                        </div>

                        {/* Background Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Color
                          </label>
                          <input
                            type="color"
                            value={bookCover.backgroundColor}
                            onChange={(e) => handleCoverFieldChange('backgroundColor', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                          />
                        </div>

                        {/* Background Gradient Toggle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Style
                          </label>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCoverFieldChange('backgroundGradient', 'none')}
                              className={`px-3 py-2 text-sm rounded-md border ${
                                bookCover.backgroundGradient === 'none' 
                                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Solid Color
                            </button>
                            <button
                              onClick={() => handleCoverFieldChange('backgroundGradient', 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)')}
                              className={`px-3 py-2 text-sm rounded-md border ${
                                bookCover.backgroundGradient !== 'none' 
                                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Gradient
                            </button>
                          </div>
                        </div>

                        {/* Text Size Controls */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-700">Text Sizes</h4>
                          
                          {/* Title Size */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Title Size: {bookCover.titleSize}px
                            </label>
                            <input
                              type="range"
                              min="12"
                              max="72"
                              value={bookCover.titleSize}
                              onChange={(e) => handleTextSizeChange('title', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>

                          {/* Subtitle Size */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Subtitle Size: {bookCover.subtitleSize}px
                            </label>
                            <input
                              type="range"
                              min="8"
                              max="48"
                              value={bookCover.subtitleSize}
                              onChange={(e) => handleTextSizeChange('subtitle', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>

                          {/* Author Size */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Author Size: {bookCover.authorSize}px
                            </label>
                            <input
                              type="range"
                              min="8"
                              max="36"
                              value={bookCover.authorSize}
                              onChange={(e) => handleTextSizeChange('author', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeCoverTab === 'cover' && (
                      <div className="space-y-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500">
                            Cover image upload coming soon
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* TOC Content */}
                {activeBookBuilderTab === 'toc' && (
                  <>
                    {activeTocTab === 'structure' && (
                      <div className="space-y-6">
                        {/* Search Bar */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Chapters
                          </label>
                          <input
                            type="text"
                            value={tocData.searchTerm}
                            onChange={(e) => handleTocSearch(e.target.value)}
                            placeholder="Search chapters..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Add Chapter Button */}
                        <div>
                          <button
                            onClick={handleAddChapter}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Chapter
                          </button>
                        </div>

                        {/* Chapters List */}
                        <div className="space-y-3">
                          {tocData.chapters
                            .filter(chapter => 
                              chapter.title.toLowerCase().includes(tocData.searchTerm.toLowerCase()) ||
                              chapter.subchapters.some(sub => 
                                sub.title.toLowerCase().includes(tocData.searchTerm.toLowerCase())
                              )
                            )
                            .map((chapter, index) => (
                              <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                                {/* Chapter Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-500">
                                      {tocData.autoNumbering ? `${index + 1}.` : ''}
                                    </span>
                                    <input
                                      type="text"
                                      value={chapter.title}
                                      onChange={(e) => handleEditChapter(chapter.id, e.target.value)}
                                      className="flex-1 px-2 py-1 border border-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent hover:bg-gray-50"
                                    />
                                    <span className={`text-sm ${getStatusColor(chapter.status)}`}>
                                      {getStatusIcon(chapter.status)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleAddSubchapter(chapter.id)}
                                      className="text-blue-600 hover:text-blue-700"
                                      title="Add Subchapter"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteChapter(chapter.id)}
                                      className="text-red-600 hover:text-red-700"
                                      title="Delete Chapter"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Subchapters */}
                                {chapter.subchapters.length > 0 && (
                                  <div className="ml-6 space-y-2">
                                    {chapter.subchapters.map((subchapter, subIndex) => (
                                      <div key={subchapter.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                        <div className="flex items-center space-x-3">
                                          <span className="text-sm text-gray-500">
                                            {tocData.autoNumbering ? `${index + 1}.${subIndex + 1}` : ''}
                                          </span>
                                          <input
                                            type="text"
                                            value={subchapter.title}
                                            onChange={(e) => handleEditSubchapter(chapter.id, subchapter.id, e.target.value)}
                                            className="flex-1 px-2 py-1 border border-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent hover:bg-white"
                                          />
                                          <span className={`text-sm ${getStatusColor(subchapter.status)}`}>
                                            {getStatusIcon(subchapter.status)}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => handleDeleteSubchapter(chapter.id, subchapter.id)}
                                            className="text-red-600 hover:text-red-700"
                                            title="Delete Subchapter"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {activeTocTab === 'settings' && (
                      <div className="space-y-6">
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={tocData.autoNumbering}
                              onChange={handleToggleAutoNumbering}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Auto-numbering</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Automatically number chapters and subchapters (e.g., "1. Introduction", "1.1 Getting Started")
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeBookBuilderTab === 'author' && (
                  <>
                    {activeAuthorTab === 'basic' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Required Information</h4>
                          <p className="text-sm text-blue-700">The following fields are required for your author profile.</p>
                        </div>

                        {/* Name Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={authorData.name}
                            onChange={(e) => handleAuthorFieldChange('name', e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        {/* Title Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={authorData.title}
                            onChange={(e) => handleAuthorFieldChange('title', e.target.value)}
                            placeholder="Enter your title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        {/* Bio Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Biography *
                          </label>
                          <textarea
                            value={authorData.bio}
                            onChange={(e) => handleAuthorFieldChange('bio', e.target.value)}
                            placeholder="Write a brief biography about yourself"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            required
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {activeAuthorTab === 'bio' && (
                      <div className="space-y-6">
                        {/* Credentials Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-700">Credentials</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={authorData.showCredentials}
                                onChange={(e) => handleAuthorFieldChange('showCredentials', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          {authorData.showCredentials && (
                            <textarea
                              value={authorData.credentials.join('\n')}
                              onChange={(e) => handleAuthorFieldChange('credentials', e.target.value.split('\n'))}
                              placeholder="Enter your credentials (one per line)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows="4"
                            ></textarea>
                          )}
                        </div>

                        {/* Achievements Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-700">Achievements</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={authorData.showAchievements}
                                onChange={(e) => handleAuthorFieldChange('showAchievements', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          {authorData.showAchievements && (
                            <textarea
                              value={authorData.achievements.join('\n')}
                              onChange={(e) => handleAuthorFieldChange('achievements', e.target.value.split('\n'))}
                              placeholder="Enter your achievements (one per line)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows="4"
                            ></textarea>
                          )}
                        </div>
                      </div>
                    )}

                    {activeAuthorTab === 'social' && (
                      <div className="space-y-6">
                        {/* Social Links Toggle */}
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-gray-700">Social Media Links</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={authorData.showSocialLinks}
                              onChange={(e) => handleAuthorFieldChange('showSocialLinks', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {authorData.showSocialLinks && (
                          <div className="space-y-4">
                            {/* LinkedIn Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn
                              </label>
                              <input
                                type="url"
                                value={authorData.social.linkedin}
                                onChange={(e) => handleSocialFieldChange('linkedin', e.target.value)}
                                placeholder="Enter your LinkedIn profile URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            {/* Twitter Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Twitter
                              </label>
                              <input
                                type="url"
                                value={authorData.social.twitter}
                                onChange={(e) => handleSocialFieldChange('twitter', e.target.value)}
                                placeholder="Enter your Twitter profile URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            {/* GitHub Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub
                              </label>
                              <input
                                type="url"
                                value={authorData.social.github}
                                onChange={(e) => handleSocialFieldChange('github', e.target.value)}
                                placeholder="Enter your GitHub profile URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeAuthorTab === 'photo' && (
                      <div className="space-y-6">
                        {/* Photo Upload Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-700">Author Photo</label>
                            <span className="text-xs text-gray-500">Optional</span>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleAuthorFieldChange('photo', e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Contact Information Toggle */}
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-gray-700">Contact Information</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={authorData.showContactInfo}
                              onChange={(e) => handleAuthorFieldChange('showContactInfo', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {authorData.showContactInfo && (
                          <div className="space-y-4">
                            {/* Website Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                              </label>
                              <input
                                type="url"
                                value={authorData.website}
                                onChange={(e) => handleAuthorFieldChange('website', e.target.value)}
                                placeholder="Enter your website URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            {/* Email Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                value={authorData.email}
                                onChange={(e) => handleAuthorFieldChange('email', e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Preface Content */}
                {activeBookBuilderTab === 'preface' && (
                  <>
                    {activePrefaceTab === 'content' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Preface Information</h4>
                          <p className="text-sm text-blue-700">The preface introduces your book and sets the context for readers.</p>
                        </div>

                        {/* Title Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preface Title
                          </label>
                          <input
                            type="text"
                            value={prefaceData.title}
                            onChange={(e) => handlePrefaceFieldChange('title', e.target.value)}
                            placeholder="Enter preface title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Subtitle Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle (Optional)
                          </label>
                          <input
                            type="text"
                            value={prefaceData.subtitle}
                            onChange={(e) => handlePrefaceFieldChange('subtitle', e.target.value)}
                            placeholder="Enter subtitle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Content Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preface Content *
                          </label>
                          <textarea
                            value={prefaceData.content}
                            onChange={(e) => handlePrefaceFieldChange('content', e.target.value)}
                            placeholder="Write your preface content..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="8"
                            required
                          ></textarea>
                        </div>

                        {/* Author Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author Name
                          </label>
                          <input
                            type="text"
                            value={prefaceData.author}
                            onChange={(e) => handlePrefaceFieldChange('author', e.target.value)}
                            placeholder="Enter author name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Date Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="text"
                            value={prefaceData.date}
                            onChange={(e) => handlePrefaceFieldChange('date', e.target.value)}
                            placeholder="Enter date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {activePrefaceTab === 'acknowledgments' && (
                      <div className="space-y-6">
                        {/* Acknowledgments Toggle */}
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-gray-700">Acknowledgments</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prefaceData.showAcknowledgments}
                              onChange={(e) => handlePrefaceFieldChange('showAcknowledgments', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {prefaceData.showAcknowledgments && (
                          <div className="space-y-4">
                            {/* Acknowledgments List */}
                            <div className="space-y-3">
                              {prefaceData.acknowledgments.map((acknowledgment, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={acknowledgment}
                                    onChange={(e) => handleEditAcknowledgments(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter acknowledgment"
                                  />
                                  <button
                                    onClick={() => handleDeleteAcknowledgments(index)}
                                    className="px-3 py-2 text-red-600 hover:text-red-700"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Add Acknowledgment Button */}
                            <button
                              onClick={handleAddAcknowledgments}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Add Acknowledgment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Appendix Content */}
                {activeBookBuilderTab === 'appendix' && (
                  <>
                    {activeAppendixTab === 'sections' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Appendix Sections</h4>
                          <p className="text-sm text-blue-700">Add supplementary materials like glossaries, references, and additional resources.</p>
                        </div>

                        {/* Appendix Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Appendix Title
                          </label>
                          <input
                            type="text"
                            value={appendixData.title}
                            onChange={(e) => handleAppendixFieldChange('title', e.target.value)}
                            placeholder="Enter appendix title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Add Section Button */}
                        <div>
                          <button
                            onClick={handleAddAppendixSection}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Appendix Section
                          </button>
                        </div>

                        {/* Sections List */}
                        <div className="space-y-4">
                          {appendixData.sections.map((section, index) => (
                            <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium text-gray-500">
                                    {appendixData.showSectionNumbers ? `${String.fromCharCode(65 + index)}.` : ''}
                                  </span>
                                  <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleEditAppendixSection(section.id, 'title', e.target.value)}
                                    className="flex-1 px-2 py-1 border border-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent hover:bg-gray-50"
                                    placeholder="Section title"
                                  />
                                </div>
                                <button
                                  onClick={() => handleDeleteAppendixSection(section.id)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete Section"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>

                              {/* Section Content */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Content
                                </label>
                                <textarea
                                  value={section.content}
                                  onChange={(e) => handleEditAppendixSection(section.id, 'content', e.target.value)}
                                  placeholder="Enter section content..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows="4"
                                ></textarea>
                              </div>

                              {/* Section Type */}
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Section Type
                                </label>
                                <select
                                  value={section.type}
                                  onChange={(e) => handleEditAppendixSection(section.id, 'type', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="glossary">Glossary</option>
                                  <option value="references">References</option>
                                  <option value="resources">Additional Resources</option>
                                  <option value="general">General</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeAppendixTab === 'settings' && (
                      <div className="space-y-6">
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={appendixData.showSectionNumbers}
                              onChange={(e) => handleAppendixFieldChange('showSectionNumbers', e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Show section numbers</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Automatically number appendix sections (e.g., "A. Glossary", "B. References")
                          </p>
                        </div>

                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={appendixData.showTableOfContents}
                              onChange={(e) => handleAppendixFieldChange('showTableOfContents', e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Show table of contents</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Include a table of contents for the appendix section
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={
                    activeBookBuilderTab === 'cover' ? handleCoverReset : 
                    activeBookBuilderTab === 'toc' ? () => {} : 
                    activeBookBuilderTab === 'author' ? handleAuthorReset : 
                    activeBookBuilderTab === 'preface' ? handlePrefaceReset :
                    activeBookBuilderTab === 'appendix' ? handleAppendixReset :
                    () => {}
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
                <button
                  onClick={
                    activeBookBuilderTab === 'cover' ? handleCoverSave : 
                    activeBookBuilderTab === 'toc' ? () => {} : 
                    activeBookBuilderTab === 'author' ? handleAuthorSave : 
                    activeBookBuilderTab === 'preface' ? handlePrefaceSave :
                    activeBookBuilderTab === 'appendix' ? handleAppendixSave :
                    () => {}
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
              </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="w-1/2 bg-gray-50 flex flex-col">
              {/* Preview Header */}
              <div className="p-6 border-b border-gray-200">
                {activeBookBuilderTab === 'cover' && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                    <p className="text-sm text-gray-600">Drag text elements to reposition them</p>
                  </>
                )}
                {activeBookBuilderTab === 'toc' && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">TOC Preview</h3>
                    <p className="text-sm text-gray-600">Live preview of your table of contents</p>
                  </>
                )}
                {activeBookBuilderTab === 'author' && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Author Preview</h3>
                    <p className="text-sm text-gray-600">Live preview of your author profile</p>
                  </>
                )}
                {activeBookBuilderTab === 'preface' && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Preface Preview</h3>
                    <p className="text-sm text-gray-600">Live preview of your preface</p>
                  </>
                )}
                {activeBookBuilderTab === 'appendix' && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Appendix Preview</h3>
                    <p className="text-sm text-gray-600">Live preview of your appendix</p>
                  </>
                )}
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-6 flex items-center justify-center">
                <>
                  {activeBookBuilderTab === 'cover' && (
                    <div 
                      className="w-[500px] h-[700px] rounded-lg shadow-lg relative overflow-hidden cursor-move"
                      style={{ 
                        background: bookCover.backgroundGradient === 'none' 
                          ? bookCover.backgroundColor 
                          : bookCover.backgroundGradient 
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Cover Content */}
                      <div className="absolute inset-0 p-6">
                        {bookCover.title && (
                          <div
                            className="absolute cursor-move select-none draggable-text"
                            style={{
                              left: `${bookCover.titlePosition.x}%`,
                              top: `${bookCover.titlePosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              fontSize: `${bookCover.titleSize}px`,
                              color: bookCover.textColor,
                              fontFamily: bookCover.fontFamily === 'serif' ? 'serif' : bookCover.fontFamily === 'sans' ? 'sans-serif' : 'cursive',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              maxWidth: '80%'
                            }}
                            onMouseDown={() => handleMouseDown('title')}
                          >
                            {bookCover.title}
                          </div>
                        )}
                        {bookCover.subtitle && (
                          <div
                            className="absolute cursor-move select-none draggable-text"
                            style={{
                              left: `${bookCover.subtitlePosition.x}%`,
                              top: `${bookCover.subtitlePosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              fontSize: `${bookCover.subtitleSize}px`,
                              color: bookCover.textColor,
                              fontFamily: bookCover.fontFamily === 'serif' ? 'serif' : bookCover.fontFamily === 'sans' ? 'sans-serif' : 'cursive',
                              textAlign: 'center',
                              maxWidth: '80%'
                            }}
                            onMouseDown={() => handleMouseDown('subtitle')}
                          >
                            {bookCover.subtitle}
                          </div>
                        )}
                        {bookCover.author && (
                          <div
                            className="absolute cursor-move select-none draggable-text"
                            style={{
                              left: `${bookCover.authorPosition.x}%`,
                              top: `${bookCover.authorPosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              fontSize: `${bookCover.authorSize}px`,
                              color: bookCover.textColor,
                              fontFamily: bookCover.fontFamily === 'serif' ? 'serif' : bookCover.fontFamily === 'sans' ? 'sans-serif' : 'cursive',
                              textAlign: 'center',
                              maxWidth: '80%'
                            }}
                            onMouseDown={() => handleMouseDown('author')}
                          >
                            {bookCover.author}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeBookBuilderTab === 'toc' && (
                    <div className="w-[500px] h-[700px] overflow-y-auto">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 h-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Table of Contents</h2>
                        <div className="space-y-4">
                          {tocData.chapters.map((chapter, index) => (
                            <div key={chapter.id} className="border-b border-gray-100 pb-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900">
                                  {tocData.autoNumbering ? `${index + 1}. ` : ''}{chapter.title}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {tocData.autoNumbering ? `${index + 1}` : ''}
                                </span>
                              </div>
                              {chapter.subchapters.length > 0 && (
                                <div className="ml-6 mt-2 space-y-1">
                                  {chapter.subchapters.map((subchapter, subIndex) => (
                                    <div key={subchapter.id} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700">
                                        {tocData.autoNumbering ? `${index + 1}.${subIndex + 1} ` : ''}{subchapter.title}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {tocData.autoNumbering ? `${index + 1}.${subIndex + 1}` : ''}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeBookBuilderTab === 'author' && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
                      <div className="w-[500px]">
                        {/* Preview Container */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 h-[700px]">
                          <div className="p-8 h-full overflow-y-auto">
                            {authorPreviewPages.length > 0 && authorPreviewPages[authorPreviewPage] && (
                              <>
                                {authorPreviewPages[authorPreviewPage].map((section, index) => (
                                  <div key={`${authorPreviewPage}-${index}`}>
                                    {section.content}
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Pagination Controls */}
                        {authorPreviewPages.length > 1 && (
                          <div className="flex items-center justify-center space-x-4">
                            <button 
                              onClick={() => setAuthorPreviewPage(p => Math.max(0, p - 1))}
                              disabled={authorPreviewPage === 0}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-600">
                              Page {authorPreviewPage + 1} of {authorPreviewPages.length}
                            </span>
                            <button 
                              onClick={() => setAuthorPreviewPage(p => Math.min(authorPreviewPages.length - 1, p + 1))}
                              disabled={authorPreviewPage === authorPreviewPages.length - 1}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeBookBuilderTab === 'preface' && (
                    <div className="w-[500px] h-[700px] overflow-y-auto">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 h-full">
                        <div className="space-y-6">
                          {/* Preface Title */}
                          <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{prefaceData.title}</h1>
                            {prefaceData.subtitle && (
                              <p className="text-xl text-gray-600 mb-4">{prefaceData.subtitle}</p>
                            )}
                          </div>

                          {/* Preface Content */}
                          <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{prefaceData.content}</p>
                          </div>

                          {/* Author and Date */}
                          <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              {prefaceData.showAuthor && (
                                <span>By {prefaceData.author}</span>
                              )}
                              {prefaceData.showDate && (
                                <span>{prefaceData.date}</span>
                              )}
                            </div>
                          </div>

                          {/* Acknowledgments */}
                          {prefaceData.showAcknowledgments && prefaceData.acknowledgments.length > 0 && (
                            <div className="border-t border-gray-200 pt-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">Acknowledgments</h3>
                              <ul className="space-y-2">
                                {prefaceData.acknowledgments.map((acknowledgment, index) => (
                                  <li key={index} className="text-gray-700">
                                    {acknowledgment}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeBookBuilderTab === 'appendix' && (
                    <div className="w-[500px] h-[700px] overflow-y-auto">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 h-full">
                        <div className="space-y-6">
                          {/* Appendix Title */}
                          <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">{appendixData.title}</h1>
                          </div>

                          {/* Table of Contents */}
                          {appendixData.showTableOfContents && (
                            <div className="border-b border-gray-200 pb-4 mb-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contents</h3>
                              <ul className="space-y-2">
                                {appendixData.sections.map((section, index) => (
                                  <li key={section.id} className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                      {appendixData.showSectionNumbers ? `${String.fromCharCode(65 + index)}.` : ''}
                                    </span>
                                    <span className="text-gray-700">{section.title}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Appendix Sections */}
                          <div className="space-y-8">
                            {appendixData.sections.map((section, index) => (
                              <div key={section.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                  {appendixData.showSectionNumbers ? `${String.fromCharCode(65 + index)}. ` : ''}
                                  {section.title}
                                </h3>
                                <div className="prose max-w-none">
                                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
        // Regular editor view
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Header Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
                  className="btn-secondary flex items-center"
                  onClick={() => setAiDropdownOpen(v => !v)}
                >
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Settings
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {aiDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 mb-2">AI Features</h4>
                      <div className="space-y-1">
                        {AI_FEATURES.map(f => (
                          <label key={f.key} className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={aiSettings[f.key]}
                              onChange={() => handleAiSettingChange(f.key)}
                              className="mr-3 w-4 h-4 text-purple-600"
                            />
                            <span className="mr-2">{f.icon}</span>
                            <span className="text-sm text-gray-700">{f.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="btn-secondary flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                AI Analyzer
              </button>
              <button className="btn-secondary flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button className="btn-primary bg-green-600 hover:bg-green-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Book Structure</h2>
                </div>
                
                {/* Book Builder Button */}
                <button 
                  onClick={() => setCurrentView('bookBuilder')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center mb-3"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Book Builder
                </button>
                
                {/* New Chapter and New Page buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={addNewChapter}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Chapter
                  </button>
                  <button 
                    onClick={addNewPage}
                    className="flex-1 btn-primary flex items-center justify-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Page
                  </button>
                </div>
              </div>

              {/* Book Structure */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {book.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                      </div>
                      <div className="ml-6 space-y-1">
                        {chapter.pages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => handlePageSelect(page)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              currentPage.id === page.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span className="truncate">{page.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 bg-white flex flex-col">
              {/* Editor Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                    <input
                      type="text"
                      value={book.chapters.find(c => c.id === currentPage.chapterId)?.title || ''}
                      onChange={(e) => {
                        const chapter = book.chapters.find(c => c.id === currentPage.chapterId);
                        if (chapter) {
                          chapter.title = e.target.value;
                          setBook({...book});
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter chapter title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={currentPage.title}
                      onChange={handleTitleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter page title"
                    />
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Bold">B</button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Italic">I</button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Underline">U</button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Heading 1">H1</button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Heading 2">H2</button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Heading 3">H3</button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Bullet List">• List</button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Numbered List">1. List</button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-100 rounded" title="Quote">Quote</button>
                </div>
              </div>

              {/* AI Writing Buttons */}
              <div className="px-6 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {aiSettings.aiWriter && (
                    <button className="btn-primary flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Writer
                    </button>
                  )}
                  {aiSettings.aiWriter && (
                    <button className="btn-primary bg-green-600 hover:bg-green-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Continue Writing
                    </button>
                  )}
                  {aiSettings.aiEnhancer && (
                    <button className="btn-primary bg-purple-600 hover:bg-purple-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Enhance
                    </button>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className="flex-1 p-6">
                <textarea
                  value={currentPage.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your content here..."
                  className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>

              {/* Status Bar */}
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-600 font-medium">
                      {isSaving ? 'Saving...' : 'Saved!'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">Ctrl+S to save</span>
                </div>
                <div className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Right Sidebar - AI Assistant */}
            {aiSettings.aiAssistant && (
              <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                {/* AI Assistant Header */}
                <div className="bg-purple-600 text-white p-4">
                  <h2 className="text-xl font-semibold">AI Assistant</h2>
                  <p className="text-purple-100 text-sm">Your intelligent writing companion</p>
                </div>

                {/* AI Tabs */}
                <div className="flex border-b border-gray-200">
                  {['writing', 'research', 'analysis'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAiTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-medium capitalize ${
                        aiTab === tab 
                          ? 'text-purple-600 border-b-2 border-purple-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* AI Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {aiTab === 'writing' && (
                    <div className="space-y-6">
                      {/* Content Generation */}
                      {aiSettings.aiWriter && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <h3 className="font-medium text-gray-900">Content Generation</h3>
                          </div>
                          <input
                            type="text"
                            placeholder="What would you like to write?"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <button className="w-full mt-2 btn-primary bg-green-600 hover:bg-green-700">
                            Generate
                          </button>
                        </div>
                      )}

                      {/* Writing Prompts */}
                      {aiSettings.aiWriter && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h3 className="font-medium text-gray-900">Writing Prompts</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <h4 className="font-medium text-gray-900 mb-1">Chapter Introduction</h4>
                              <p className="text-sm text-gray-600 mb-2">Create an engaging opening that hooks readers and sets expectations for this chapter.</p>
                              <button className="btn-primary text-sm">Use Prompt</button>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <h4 className="font-medium text-gray-900 mb-1">Add Real-World Examples</h4>
                              <p className="text-sm text-gray-600 mb-2">Include practical examples that illustrate your key points and make concepts relatable.</p>
                              <button className="btn-primary text-sm">Generate Examples</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Style Suggestions */}
                      {aiSettings.aiSuggestions && (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="font-medium text-gray-900">Style Suggestions</h3>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 mb-1">Improve Readability</h4>
                            <p className="text-sm text-gray-600 mb-2">Your current text scores 7.2/10 for readability. Consider shorter sentences and simpler vocabulary.</p>
                            <div className="flex space-x-2">
                              <button className="btn-secondary text-xs">Add examples</button>
                              <button className="btn-secondary text-xs">Improve flow</button>
                              <button className="btn-secondary text-xs">Add statistics</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {aiTab === 'research' && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-gray-500">Research features coming soon</p>
                    </div>
                  )}

                  {aiTab === 'analysis' && (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-gray-500">Analysis features coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookEditor; 