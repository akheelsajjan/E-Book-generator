import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';
import { Sparkles, RotateCcw, Languages, Zap, User, ChevronDown, Loader2 } from 'lucide-react';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

const BookCoverEditor = ({ book, setBook, onCoverDataChange, aiTools = [], onAiToolClick, languageOptions = [] }) => {
  const [activeCoverTab, setActiveCoverTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // 'title', 'subtitle', 'author'
  const [loadingField, setLoadingField] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  
  // Book Cover State
  const [bookCover, setBookCover] = useState({
    title: book.title || '',
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

  const handleCoverFieldChange = (field, value) => {
    const updatedCover = {
      ...bookCover,
      [field]: value
    };
    setBookCover(updatedCover);
    
    // Notify parent component for live preview
    if (onCoverDataChange) {
      onCoverDataChange(updatedCover);
    }
  };

  const handleCoverReset = () => {
    setBookCover({
      title: book.title || '',
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
    try {
      setIsSaving(true);
      
      // Update book with cover data locally
      setBook(prev => ({
        ...prev,
        cover: bookCover
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        cover: bookCover
      });
      
      console.log('Cover saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving cover:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field focus for AI operations
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    if (field === 'author') {
      setAiMessage('AI can translate author name, select Translation');
    } else {
      setAiMessage(`AI can help you enhance the ${field} field.`);
    }
  };

  // Handle AI tool click
  const handleAIToolClick = async (toolId, selectedLanguage = null) => {
    if (!focusedField) {
      setAiMessage('Please select a field (Title, Subtitle, or Author) before using AI enhancements.');
      return;
    }

    if (bookBuilderAIService.isCurrentlyProcessing()) {
      setAiMessage('Please wait for the current AI operation to complete.');
      return;
    }

    const config = bookBuilderAIToolConfigs[toolId];
    if (!config) {
      console.error('No config found for tool:', toolId);
      return;
    }

    // Get current content for the focused field
    const currentContent = bookCover[focusedField] || '';
    
    if (currentContent.trim().length < (config.minCharRequired || 5)) {
      setAiMessage(`Enter more content before using AI enhancement. (Minimum ${config.minCharRequired || 5} characters required)`);
      return;
    }

    setLoadingField(focusedField);
    setAiMessage(`Processing ${config.label}...`);

    try {
      await bookBuilderAIService.executeAction({
        label: config.label,
        tooltip: config.tooltip,
        promptBuilder: config.promptBuilder,
        onResponse: config.onResponse,
        currentContent: currentContent,
        updateContent: (newContent) => {
          handleCoverFieldChange(focusedField, newContent);
        },
        onError: (error) => {
          console.error('AI Action Error:', error);
          setAiMessage(`Error: ${error}`);
        },
        onSuccess: (label, response) => {
          console.log(`${label} completed successfully on ${focusedField}`);
          setAiMessage(`${label} completed successfully!`);
          // Clear success message after 3 seconds
          setTimeout(() => {
            setAiMessage('');
          }, 3000);
        },
        selectedLanguage: selectedLanguage,
        targetField: focusedField
      });
    } catch (error) {
      console.error('AI tool error:', error);
      setAiMessage(`Failed to execute ${config.label}: ${error.message}`);
    } finally {
      setLoadingField(null);
    }
  };

  // Filter AI tools based on focused field
  const getFilteredAiTools = () => {
    if (!focusedField) return [];
    
    // For author field, only show translation tools
    if (focusedField === 'author') {
      return aiTools.filter(tool => tool.id === 'translate');
    }
    
    // For other fields, show all tools except translation for author-specific tools
    return aiTools.filter(tool => {
      if (focusedField === 'author' && tool.id !== 'translate') {
        return false;
      }
      return true;
    });
  };

  const renderAiTools = () => {
    const filteredTools = getFilteredAiTools();
    if (!filteredTools || filteredTools.length === 0) return null;
    
    return (
      <div className="flex items-center space-x-2">
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon;
          const config = bookBuilderAIToolConfigs[tool.id];
          const isProcessing = bookBuilderAIService.isCurrentlyProcessing() && 
                             bookBuilderAIService.getCurrentAction() === config?.label;
          const isDisabled = !focusedField || 
                           bookBuilderAIService.isCurrentlyProcessing() || 
                           loadingField !== null;
          
          // Render dropdown for translate tool
          if (tool.type === 'dropdown') {
            return (
              <div key={tool.id} className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAIToolClick(tool.id, e.target.value);
                    }
                  }}
                  disabled={isDisabled}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium appearance-none cursor-pointer ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                      : tool.color === 'purple' 
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
                  <option value="">{isProcessing ? 'Processing...' : tool.label}</option>
                  {tool.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            );
          }
          
          // Render regular button for other tools
          return (
            <button
              key={tool.id}
              onClick={() => handleAIToolClick(tool.id)}
              disabled={isDisabled}
              className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                  : tool.color === 'purple' 
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
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <IconComponent className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Processing...' : tool.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Message */}
      {aiMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          aiMessage.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : aiMessage.includes('completed')
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-blue-100 text-blue-700 border border-blue-200'
        }`}>
          {aiMessage}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex space-x-6 border-b border-gray-200">
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

      {/* Basic Info Tab */}
      {activeCoverTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
            <div className="relative">
              <input
                type="text"
                value={bookCover.title}
                onChange={(e) => handleCoverFieldChange('title', e.target.value)}
                onFocus={() => handleFieldFocus('title')}
                maxLength={100}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 focus:border-blue-500 ${
                  bookCover.title && bookCover.title.length > 80 ? 'border-yellow-300' : 'border-gray-200'
                } ${loadingField === 'title' ? 'bg-blue-50' : ''}`}
              />
              {loadingField === 'title' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
            {bookCover.title && (
              <p className={`mt-2 text-sm ${bookCover.title.length > 80 ? 'text-red-600' : 'text-yellow-600'}`}>
                {bookCover.title.length > 80 
                  ? 'Title must be less than 80 characters' 
                  : 'Title is quite long and may not display well on book covers'
                }
              </p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {bookCover.title.length}/100 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={bookCover.subtitle}
                onChange={(e) => handleCoverFieldChange('subtitle', e.target.value)}
                onFocus={() => handleFieldFocus('subtitle')}
                maxLength={150}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 focus:border-blue-500 ${
                  bookCover.subtitle && bookCover.subtitle.length > 120 ? 'border-yellow-300' : 'border-gray-200'
                } ${loadingField === 'subtitle' ? 'bg-blue-50' : ''}`}
              />
              {loadingField === 'subtitle' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
            {bookCover.subtitle && (
              <p className={`mt-2 text-sm ${bookCover.subtitle.length > 120 ? 'text-red-600' : 'text-yellow-600'}`}>
                {bookCover.subtitle.length > 120 
                  ? 'Subtitle must be less than 120 characters' 
                  : 'Subtitle is quite long and may not display well on book covers'
                }
              </p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {bookCover.subtitle.length}/150 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
            <div className="relative">
              <input
                type="text"
                value={bookCover.author}
                onChange={(e) => handleCoverFieldChange('author', e.target.value)}
                onFocus={() => handleFieldFocus('author')}
                maxLength={50}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 focus:border-blue-500 ${
                  bookCover.author && bookCover.author.length > 40 ? 'border-yellow-300' : 'border-gray-200'
                } ${loadingField === 'author' ? 'bg-blue-50' : ''}`}
              />
              {loadingField === 'author' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
            {bookCover.author && (
              <p className={`mt-2 text-sm ${bookCover.author.length > 50 ? 'text-red-600' : 'text-yellow-600'}`}>
                {bookCover.author.length > 50 
                  ? 'Author name must be less than 50 characters' 
                  : 'Author name is quite long and may not display well on book covers'
                }
              </p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {bookCover.author.length}/50 characters
            </div>
          </div>
        </div>
      )}

      {/* Design Tab */}
      {activeCoverTab === 'design' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={bookCover.fontFamily}
              onChange={(e) => handleCoverFieldChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={bookCover.textColor}
              onChange={(e) => handleCoverFieldChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={bookCover.backgroundColor}
              onChange={(e) => handleCoverFieldChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      {/* Cover Tab */}
      {activeCoverTab === 'cover' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-gray-500">Click to upload cover image</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              value={bookCover.template}
              onChange={(e) => handleCoverFieldChange('template', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons - Updated with AI Tools */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCoverReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          {renderAiTools()}
        </div>
        
        <button
          onClick={handleCoverSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Cover'}
        </button>
      </div>
    </div>
  );
};

export default BookCoverEditor; 