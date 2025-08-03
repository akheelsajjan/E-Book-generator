import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';
import { RotateCcw, Languages, ChevronDown, Loader2 } from 'lucide-react';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

const AppendixEditor = ({ book, setBook, onAppendixDataChange, aiTools = [], onAiToolClick, languageOptions = [] }) => {
  const [appendixData, setAppendixData] = useState({
    title: book.appendix?.title || 'Appendix',
    sections: book.appendix?.sections || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loadingField, setLoadingField] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  const handleAppendixFieldChange = (field, value) => {
    const updatedAppendix = {
      ...appendixData,
      [field]: value
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleAddAppendixSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: '',
      type: 'text'
    };
    const updatedAppendix = {
      ...appendixData,
      sections: [...appendixData.sections, newSection]
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleEditAppendixSection = (sectionId, field, value) => {
    const updatedAppendix = {
      ...appendixData,
      sections: appendixData.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleDeleteAppendixSection = (sectionId) => {
    const updatedAppendix = {
      ...appendixData,
      sections: appendixData.sections.filter(section => section.id !== sectionId)
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleAppendixReset = () => {
    setAppendixData({
      title: 'Appendix',
      sections: []
    });
  };

  const handleAppendixSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with appendix data locally
      setBook(prev => ({
        ...prev,
        appendix: appendixData
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        appendix: appendixData
      });
      
      console.log('Appendix saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving appendix:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field focus for AI operations
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    setAiMessage('AI can help you enhance the appendix content with translation and refactoring.');
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
    let currentContent = '';
    if (focusedField === 'title') {
      currentContent = appendixData.title || '';
    } else if (focusedField.startsWith('section-')) {
      const sectionId = focusedField;
      const section = appendixData.sections.find(s => s.id === sectionId);
      if (section) {
        currentContent = section.content || '';
      }
    }
    
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
          if (focusedField === 'title') {
            handleAppendixFieldChange('title', newContent);
          } else if (focusedField.startsWith('section-')) {
            const sectionId = focusedField;
            handleEditAppendixSection(sectionId, 'content', newContent);
          }
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

  // Filter AI tools - only show translate and refactor for appendix
  const getFilteredAiTools = () => {
    if (!focusedField) return [];
    
    // For appendix title and content, show only translate and refactor
    if (focusedField === 'title' || focusedField.startsWith('section-')) {
      return aiTools.filter(tool => tool.id === 'translate' || tool.id === 'refactor');
    }
    
    // For other fields, show no tools
    return [];
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Appendix Title</label>
        <div className="relative">
          <input
            type="text"
            value={appendixData.title}
            onChange={(e) => handleAppendixFieldChange('title', e.target.value)}
            onFocus={() => handleFieldFocus('title')}
            className={`w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm transition-all duration-300 ${
              loadingField === 'title' ? 'bg-blue-50' : ''
            }`}
            placeholder="Enter appendix title"
          />
          {loadingField === 'title' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>

      {/* Appendix Sections */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Appendix Sections</label>
        <div className="space-y-4">
          {appendixData.sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleEditAppendixSection(section.id, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  placeholder="Section title"
                />
                <button
                  onClick={() => handleDeleteAppendixSection(section.id)}
                  className="px-2 py-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={section.content}
                  onChange={(e) => handleEditAppendixSection(section.id, 'content', e.target.value)}
                  onFocus={() => handleFieldFocus(section.id)}
                  rows="4"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loadingField === section.id ? 'bg-blue-50' : ''
                  }`}
                  placeholder="Section content..."
                />
                {loadingField === section.id && (
                  <div className="absolute right-3 top-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleAddAppendixSection}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Section
          </button>
        </div>
      </div>

      {/* Action Buttons - Updated with AI Tools */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAppendixReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          {renderAiTools()}
        </div>
        
        <button
          onClick={handleAppendixSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Appendix'}
        </button>
      </div>
    </div>
  );
};

export default AppendixEditor; 