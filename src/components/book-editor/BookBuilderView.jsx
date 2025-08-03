import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import * as LucideIcons from 'lucide-react';
import BookBuilderSidebar from './BookBuilderSidebar';
import BookCoverEditor from './BookCoverEditor';
import AboutBookEditor from './AboutBookEditor';
import AuthorEditor from './AuthorEditor';
import PrefaceEditor from './PrefaceEditor';
import TOCEditor from './TOCEditor';
import AppendixEditor from './AppendixEditor';
import BookCoverPreview from './BookCoverPreview';
import AuthorPreview from './AuthorPreview';
import PrefacePreview from './PrefacePreview';
import TOCPreview from './TOCPreview';
import AppendixPreview from './AppendixPreview';
import AboutBookCard from './AboutBookCard';
import BookDetailPage from './BookDetailPage';
import ProgressTracker from '../shared/ProgressTracker';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

// Destructure the icons we need
const { 
  ArrowLeft, 
  Eye, 
  User, 
  Settings, 
  Upload, 
  ChevronDown, 
  LogOut, 
  CreditCard, 
  Key, 
  BookOpen, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Languages 
} = LucideIcons;

const BookBuilderView = ({
  book,
  setBook,
  aiSettings,
  aiDropdownOpen,
  setAiDropdownOpen,
  aiDropdownRef,
  calculateProgress,
  handleAiSettingChange,
  onSwitchToEditor,
  AI_FEATURES
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

  const [activeBookBuilderTab, setActiveBookBuilderTab] = useState('cover');
  const [selectedAiCategory, setSelectedAiCategory] = useState('writing');
  const [liveCoverData, setLiveCoverData] = useState(null);
  const [liveAboutData, setLiveAboutData] = useState(null);
  const [liveAuthorData, setLiveAuthorData] = useState(null);
  const [livePrefaceData, setLivePrefaceData] = useState(null);
  const [liveTOCData, setLiveTOCData] = useState(null);
  const [liveAppendixData, setLiveAppendixData] = useState(null);
  const [activeAboutPreviewTab, setActiveAboutPreviewTab] = useState('card');

  // Initialize live cover data when cover tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'cover' && book?.cover && !liveCoverData) {
      setLiveCoverData(book.cover);
    }
  }, [activeBookBuilderTab, book?.cover, liveCoverData]);

  // Initialize live about data when about tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'about' && book && !liveAboutData) {
      setLiveAboutData({
        shortDescription: book.shortDescription || '',
        fullDescription: book.fullDescription || '',
        tags: book.tags || '',
        tone: book.tone || '',
        publishedYear: book.publishedYear || new Date().getFullYear()
      });
    }
  }, [activeBookBuilderTab, book, liveAboutData]);

  // Initialize live author data when author tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'author' && book?.author && !liveAuthorData) {
      setLiveAuthorData(book.author);
    }
  }, [activeBookBuilderTab, book?.author, liveAuthorData]);

  // Initialize live preface data when preface tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'preface' && book?.preface && !livePrefaceData) {
      setLivePrefaceData(book.preface);
    }
  }, [activeBookBuilderTab, book?.preface, livePrefaceData]);

  // Initialize live appendix data when appendix tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'appendix' && book?.appendix && !liveAppendixData) {
      setLiveAppendixData(book.appendix);
    }
  }, [activeBookBuilderTab, book?.appendix, liveAppendixData]);

  // Initialize live TOC data when toc tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'toc' && book?.chapters && !liveTOCData) {
      setLiveTOCData(book.chapters);
    }
  }, [activeBookBuilderTab, book?.chapters, liveTOCData]);

  const bookBuilderTabs = [
    { id: 'cover', label: 'Book Cover', icon: '📖' },
    { id: 'about', label: 'About Book', icon: '📄' },
    { id: 'author', label: 'About Author', icon: '👤' },
    { id: 'preface', label: 'Preface', icon: '📝' },
    { id: 'toc', label: 'Table of Contents', icon: '📋' },
    { id: 'appendix', label: 'Appendix', icon: '📚' },
  ];

  // Language options (same as CreateBookModal)
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'other', label: 'Other' }
  ];

  // AI Tools configuration
  const aiTools = {
    writing: [
      { id: 'ai-enhance', label: 'AI Enhance', icon: Sparkles, color: 'purple' }
    ],
    editing: [
      { id: 'refactor', label: 'Refactor', icon: RotateCcw, color: 'blue' },
      { id: 'simplify', label: 'Simplify Text', icon: Zap, color: 'green' },
      { id: 'convert-pov', label: 'Convert to POV', icon: User, color: 'orange' }
    ],
    translation: [
      { 
        id: 'translate', 
        label: 'Translate', 
        icon: Languages, 
        color: 'indigo',
        type: 'dropdown',
        options: languageOptions
      }
    ]
  };

  const handleAiToolClick = (toolId, selectedLanguage = null) => {
    console.log(`AI Tool clicked: ${toolId}`, selectedLanguage ? `Language: ${selectedLanguage}` : '');
    // Implement AI tool functionality here
  };

  const renderAiTools = () => {
    const currentTools = aiTools[selectedAiCategory] || [];
    
    return (
      <div className="flex items-center space-x-2">
        {currentTools.map((tool) => {
          const IconComponent = tool.icon;
          
          // Render dropdown for translate tool
          if (tool.type === 'dropdown') {
            return (
              <div key={tool.id} className="relative">
                <select
                  onChange={(e) => handleAiToolClick(tool.id, e.target.value)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium appearance-none cursor-pointer ${
                    tool.color === 'purple' 
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                      : tool.color === 'blue'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                      : tool.color === 'green'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                      : tool.color === 'orange'
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-300'
                  }`}
                  style={{ paddingRight: '2.5rem' }}
                >
                  <option value="">{tool.label}</option>
                  {tool.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            );
          }
          
          // Render regular button for other tools
          return (
            <button
              key={tool.id}
              onClick={() => handleAiToolClick(tool.id)}
              className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium ${
                tool.color === 'purple' 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                  : tool.color === 'blue'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                  : tool.color === 'green'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                  : tool.color === 'orange'
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeBookBuilderTab) {
      case 'cover':
        return (
          <BookCoverEditor 
            book={book} 
            setBook={setBook} 
            onCoverDataChange={setLiveCoverData}
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
      case 'about':
        return (
          <AboutBookEditor 
            book={book} 
            setBook={setBook} 
            onAboutDataChange={setLiveAboutData}
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
      case 'author':
        return (
          <AuthorEditor 
            book={book} 
            setBook={setBook} 
            onAuthorDataChange={setLiveAuthorData}
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
      case 'preface':
        return (
          <PrefaceEditor 
            book={book} 
            setBook={setBook} 
            onPrefaceDataChange={setLivePrefaceData}
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
      case 'toc':
        return (
          <TOCEditor 
            book={book} 
            setBook={setBook} 
            onTOCDataChange={setLiveTOCData} 
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
      case 'appendix':
        return (
          <AppendixEditor 
            book={book} 
            setBook={setBook} 
            onAppendixDataChange={setLiveAppendixData}
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
      default:
        return (
          <BookCoverEditor 
            book={book} 
            setBook={setBook} 
            onCoverDataChange={setLiveCoverData}
            selectedAiCategory={selectedAiCategory}
            aiTools={aiTools[selectedAiCategory] || []}
            onAiToolClick={handleAiToolClick}
            languageOptions={languageOptions}
          />
        );
    }
  };

  const renderAboutPreview = () => {
    const tagList = liveAboutData?.tags ? liveAboutData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    return (
      <div className="h-full overflow-y-auto">
        {/* Preview Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveAboutPreviewTab('card')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeAboutPreviewTab === 'card'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Card Layout
          </button>
          <button
            onClick={() => setActiveAboutPreviewTab('detail')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeAboutPreviewTab === 'detail'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Detail Page
          </button>
        </div>

        {/* Preview Content */}
        <div className="mt-4">
          {activeAboutPreviewTab === 'card' ? (
            <AboutBookCard
              title={book?.title || 'Book Title'}
              subtitle={liveAboutData?.shortDescription || ''}
              description={liveAboutData?.fullDescription || ''}
              tags={tagList}
              publishedDate={liveAboutData?.publishedYear ? `Published ${liveAboutData.publishedYear}` : ''}
              book={book}
            />
          ) : (
            <BookDetailPage
              book={book}
              aboutData={liveAboutData}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div 
        className="px-6 py-4 flex items-center justify-between"
        style={{ 
          backgroundColor: '#1e1e2f', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: 'white'
        }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onSwitchToEditor}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{book?.title || 'Untitled Book'}</h1>
            <p className="text-sm text-gray-300">Book Builder</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ProgressTracker 
            book={book}
            onPublish={() => {
              // Navigate to the preview screen
              navigate(`/preview/${book.id}`);
            }}
          />
          
          <button className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Book Settings
          </button>
          
          <div className="relative">
            <button
              onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
              ref={aiDropdownRef}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Book Analyzer
            </button>
            
            {aiDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Settings</h3>
                  <div className="space-y-4">
                    {AI_FEATURES.map((feature) => (
                      <label key={feature.id} className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100 rounded transition-colors">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4 text-purple-600"
                          checked={aiSettings[feature.id] || false}
                          onChange={(e) => handleAiSettingChange(feature.id, e.target.checked)}
                        />
                        <span className="text-sm text-gray-900">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 flex items-center shadow-lg">
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
        {/* Left Sidebar - Book Builder Navigation */}
        <BookBuilderSidebar
          activeTab={activeBookBuilderTab}
          setActiveTab={setActiveBookBuilderTab}
          bookBuilderTabs={bookBuilderTabs}
          onSwitchToEditor={onSwitchToEditor}
        />

        {/* Main Content Area - Split Layout */}
        <div className="flex-1 bg-white flex">
          {/* Left Panel - Editor */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Editor Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {bookBuilderTabs.find(tab => tab.id === activeBookBuilderTab)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                {activeBookBuilderTab === 'cover' && 'Design your book cover and set up basic information'}
                {activeBookBuilderTab === 'about' && 'Add author information and biography'}
                {activeBookBuilderTab === 'preface' && 'Write your book preface and acknowledgments'}
                {activeBookBuilderTab === 'toc' && 'Manage your table of contents'}
                {activeBookBuilderTab === 'appendix' && 'Add appendix sections and additional content'}
              </p>
            </div>

            {/* AI Tools Toolbar - Only category tabs */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-3">
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
                    onClick={() => setSelectedAiCategory('editing')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      selectedAiCategory === 'editing'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-lg">🧠</span>
                    <span className="font-medium">Editing Aids</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedAiCategory('translation')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      selectedAiCategory === 'translation'
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-lg">🌐</span>
                    <span className="font-medium">Translation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-gray-50 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <p className="text-sm text-gray-600">See how your book will look</p>
            </div>
            <div className="flex-1 p-6">
              {activeBookBuilderTab === 'cover' && (
                <BookCoverPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentCoverData={liveCoverData}
                />
              )}
              {activeBookBuilderTab === 'about' && renderAboutPreview()}
              {activeBookBuilderTab === 'author' && (
                <AuthorPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentAuthorData={liveAuthorData}
                />
              )}
              {activeBookBuilderTab === 'preface' && (
                <PrefacePreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentPrefaceData={livePrefaceData}
                />
              )}
              {activeBookBuilderTab === 'toc' && (
                <TOCPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentTOCData={liveTOCData}
                />
              )}
              {activeBookBuilderTab === 'appendix' && (
                <AppendixPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentAppendixData={liveAppendixData}
                />
              )}
              {activeBookBuilderTab !== 'cover' && activeBookBuilderTab !== 'about' && activeBookBuilderTab !== 'author' && activeBookBuilderTab !== 'preface' && activeBookBuilderTab !== 'toc' && activeBookBuilderTab !== 'appendix' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-4">📖</div>
                    <p>Preview will appear here</p>
                    <p className="text-sm mt-2">Select a tab to see the preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookBuilderView; 