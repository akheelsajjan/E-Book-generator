import React, { useState, useEffect } from 'react';
import { Edit3, Tag, Calendar, Heart, Eye, FileText, Save, Sparkles, Loader2, RotateCcw, Languages, Zap, User, ChevronDown } from 'lucide-react';
import AboutBookCard from './AboutBookCard';
import BookDetailPage from './BookDetailPage';
import { updateBook } from '../../services/booksService';
import { generateContentWithAI } from '../../services/geminiService';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

const AboutBookEditor = ({ book, setBook, onAboutDataChange, aiTools = [], onAiToolClick, languageOptions = [] }) => {
  const [formData, setFormData] = useState({
    shortDescription: book?.shortDescription || '',
    fullDescription: book?.fullDescription || '',
    tags: book?.tags || '',
    tone: book?.tone || '',
    publishedYear: book?.publishedYear || new Date().getFullYear()
  });

  const [errors, setErrors] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('card');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedField, setSelectedField] = useState('shortDescription'); // 'shortDescription' or 'fullDescription'
  const [focusedField, setFocusedField] = useState(null); // 'shortDescription', 'fullDescription', 'tags', 'tone'
  const [loadingField, setLoadingField] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  // Update parent when form data changes
  useEffect(() => {
    if (onAboutDataChange) {
      onAboutDataChange(formData);
    }
  }, [formData, onAboutDataChange]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update book state
    const updatedBook = {
      ...book,
      [field]: value
    };
    setBook(updatedBook);
  };

  const validateShortDescription = (description) => {
    if (description.length > 280) {
      return 'Short description must be less than 280 characters';
    }
    return '';
  };

  const validateFullDescription = (description) => {
    if (description.length > 2000) {
      return 'Full description must be less than 2,000 characters';
    }
    return '';
  };

  const handleShortDescriptionChange = (value) => {
    handleInputChange('shortDescription', value);
    const error = validateShortDescription(value);
    if (error) {
      setErrors(prev => ({ ...prev, shortDescription: error }));
    }
  };

  const handleFullDescriptionChange = (value) => {
    handleInputChange('fullDescription', value);
    const error = validateFullDescription(value);
    if (error) {
      setErrors(prev => ({ ...prev, fullDescription: error }));
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    // Validate form
    const newErrors = {};
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    }
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one genre/tag is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      // Update book with about data
      const updatedBookData = {
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        tags: formData.tags,
        tone: formData.tone,
        publishedYear: formData.publishedYear
      };

      await updateBook(book.id, updatedBookData);
      
      // Update local book state
      setBook(prev => ({
        ...prev,
        ...updatedBookData
      }));

      setSaveMessage('About book section saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error saving about book data:', error);
      setSaveMessage('Error saving about book data. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTags = () => {
    if (!formData.tags) return null;
    const tagList = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    return (
      <div className="flex flex-wrap gap-2">
        {tagList.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Handle field focus for AI operations
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    setAiMessage(`AI can help you enhance the ${field} field.`);
  };

  // Handle AI tool click
  const handleAIToolClick = async (toolId, selectedLanguage = null) => {
    if (!focusedField) {
      setAiMessage('Please select a field before using AI enhancements.');
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
    const currentContent = formData[focusedField] || '';
    
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
          handleInputChange(focusedField, newContent);
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
    
    // For tags field, only show translation tools (since it's a list of names/terms)
    if (focusedField === 'tags') {
      return aiTools.filter(tool => tool.id === 'translate');
    }
    
    // For tone field, only show translation tools (since it's a single selection)
    if (focusedField === 'tone') {
      return aiTools.filter(tool => tool.id === 'translate');
    }
    
    // For other fields, show all tools
    return aiTools;
  };

  const renderFormMode = () => {
    return (
      <div className="space-y-4">
        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Edit3 className="w-4 h-4 inline mr-2 text-blue-500" />
            One-liner about the book *
          </label>
          <div className="relative">
            <textarea
              value={formData.shortDescription}
              onChange={(e) => handleShortDescriptionChange(e.target.value)}
              onFocus={() => handleFieldFocus('shortDescription')}
              placeholder="Write a compelling one-sentence description..."
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300 ${
                errors.shortDescription ? 'border-red-300' : 'border-blue-300'
              } ${loadingField === 'shortDescription' ? 'bg-blue-50' : ''}`}
            />
            {loadingField === 'shortDescription' && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          {errors.shortDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.shortDescription.length}/280 characters
          </div>
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2 text-blue-500" />
            What is this book about? *
          </label>
          <div className="relative">
            <textarea
              value={formData.fullDescription}
              onChange={(e) => handleFullDescriptionChange(e.target.value)}
              onFocus={() => handleFieldFocus('fullDescription')}
              placeholder="Write a detailed description of your book..."
              rows={6}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300 ${
                errors.fullDescription ? 'border-red-300' : 'border-blue-300'
              } ${loadingField === 'fullDescription' ? 'bg-blue-50' : ''}`}
            />
            {loadingField === 'fullDescription' && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          {errors.fullDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.fullDescription}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.fullDescription.length}/2000 characters
          </div>
        </div>

        {/* Tags/Genres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-2 text-blue-500" />
            Genres or themes (comma separated) *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              onFocus={() => handleFieldFocus('tags')}
              placeholder="e.g. mystery, fantasy, poetic, time-travel"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300 ${
                errors.tags ? 'border-red-300' : 'border-blue-300'
              } ${loadingField === 'tags' ? 'bg-blue-50' : ''}`}
            />
            {loadingField === 'tags' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
          )}
          {renderTags()}
        </div>

        {/* Tone/Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-2 text-blue-500" />
            Tone / Mood
          </label>
          <div className="relative">
            <select
              value={formData.tone}
              onChange={(e) => handleInputChange('tone', e.target.value)}
              onFocus={() => handleFieldFocus('tone')}
              className={`w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300 ${
                loadingField === 'tone' ? 'bg-blue-50' : ''
              }`}
            >
              <option value="">Select a tone...</option>
              <option value="Thoughtful">Thoughtful</option>
              <option value="Suspenseful">Suspenseful</option>
              <option value="Whimsical">Whimsical</option>
              <option value="Dark">Dark</option>
              <option value="Reflective">Reflective</option>
              <option value="Light-hearted">Light-hearted</option>
            </select>
            {loadingField === 'tone' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
        </div>

        {/* Published Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2 text-blue-500" />
            Published Year
          </label>
          <input
            type="number"
            value={formData.publishedYear}
            onChange={(e) => handleInputChange('publishedYear', parseInt(e.target.value) || new Date().getFullYear())}
            min="1900"
            max={new Date().getFullYear() + 10}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300"
          />
        </div>
      </div>
    );
  };

  const renderPreviewMode = () => {
    const tagList = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    return (
      <div className="h-full overflow-y-auto">
        {/* Preview Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActivePreviewTab('card')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activePreviewTab === 'card'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Card Layout
          </button>
          <button
            onClick={() => setActivePreviewTab('detail')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activePreviewTab === 'detail'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Detail Page
          </button>
        </div>

        {/* Preview Content */}
        <div className="mt-4">
          {activePreviewTab === 'card' ? (
            <AboutBookCard
              title={book?.title || 'Book Title'}
              subtitle={formData.shortDescription}
              description={formData.fullDescription}
              tags={tagList}
              publishedDate={formData.publishedYear ? `Published ${formData.publishedYear}` : ''}
              book={book}
            />
          ) : (
            <BookDetailPage
              book={book}
              aboutData={formData}
            />
          )}
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setFormData({
      shortDescription: book?.shortDescription || '',
      fullDescription: book?.fullDescription || '',
      tags: book?.tags || '',
      tone: book?.tone || '',
      publishedYear: book?.publishedYear || new Date().getFullYear()
    });
    setErrors({});
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

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          saveMessage.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {!isPreviewMode ? (
        <>
          {renderFormMode()}
          
          {/* Action Buttons - Updated with AI Tools */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              {renderAiTools()}
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving || isGenerating}
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                isSaving || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save About Book'}
            </button>
          </div>
        </>
      ) : (
        renderPreviewMode()
      )}
    </div>
  );
};

export default AboutBookEditor; 