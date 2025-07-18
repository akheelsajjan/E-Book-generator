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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800"
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
                  <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={aiSettings.all}
                      onChange={() => handleAiSettingChange('all')}
                      className="mr-3 w-4 h-4 text-purple-600"
                    />
                    <span className="font-semibold text-gray-900">All AI Features</span>
                  </label>
                </div>
                <div className="border-b border-gray-200 mb-3" />
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
                
                {/* AI Suggestions Section */}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">AI Suggestions</h4>
                  <div className="space-y-2">
                    <div className="px-2 py-1 bg-yellow-50 rounded text-xs">
                      <span className="font-medium text-yellow-800">Getting Started:</span>
                      <span className="text-yellow-700 ml-1">3 AI tips available</span>
                    </div>
                    <div className="px-2 py-1 bg-green-50 rounded text-xs">
                      <span className="font-medium text-green-800">Foundations:</span>
                      <span className="text-green-700 ml-1">Ready to enhance</span>
                    </div>
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
  );
};

export default BookEditor; 