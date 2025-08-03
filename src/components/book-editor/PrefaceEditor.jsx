import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';
import { RotateCcw, Languages, ChevronDown, Loader2 } from 'lucide-react';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

const PrefaceEditor = ({ book, setBook, onPrefaceDataChange, aiTools = [], onAiToolClick, languageOptions = [] }) => {
  const [prefaceData, setPrefaceData] = useState({
    content: book.preface?.content || '',
    acknowledgments: book.preface?.acknowledgments || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loadingField, setLoadingField] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  const handlePrefaceFieldChange = (field, value) => {
    const updatedPreface = {
      ...prefaceData,
      [field]: value
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handleAddAcknowledgments = () => {
    const updatedPreface = {
      ...prefaceData,
      acknowledgments: [...prefaceData.acknowledgments, '']
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handleEditAcknowledgments = (index, value) => {
    const updatedPreface = {
      ...prefaceData,
      acknowledgments: prefaceData.acknowledgments.map((ack, i) => i === index ? value : ack)
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handleDeleteAcknowledgments = (index) => {
    const updatedPreface = {
      ...prefaceData,
      acknowledgments: prefaceData.acknowledgments.filter((_, i) => i !== index)
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handlePrefaceReset = () => {
    setPrefaceData({
      content: '',
      acknowledgments: []
    });
  };

  const handlePrefaceSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with preface data locally
      setBook(prev => ({
        ...prev,
        preface: prefaceData
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        preface: prefaceData
      });
      
      console.log('Preface saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving preface:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field focus for AI operations
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    setAiMessage('AI can help you enhance the preface content with translation and refactoring.');
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
    if (focusedField === 'content') {
      currentContent = prefaceData.content || '';
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
          handlePrefaceFieldChange(focusedField, newContent);
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

  // Filter AI tools - only show translate and refactor for preface
  const getFilteredAiTools = () => {
    if (!focusedField) return [];
    
    // For preface content, show only translate and refactor
    if (focusedField === 'content') {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Preface Content</label>
        <div className="relative">
          <textarea
            value={prefaceData.content}
            onChange={(e) => handlePrefaceFieldChange('content', e.target.value)}
            onFocus={() => handleFieldFocus('content')}
            rows="8"
            className={`w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm transition-all duration-300 ${
              loadingField === 'content' ? 'bg-blue-50' : ''
            }`}
            placeholder="Write your preface content here..."
          />
          {loadingField === 'content' && (
            <div className="absolute right-3 top-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>

      {/* Acknowledgments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Acknowledgments</label>
        <div className="space-y-2">
          {prefaceData.acknowledgments.map((acknowledgment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={acknowledgment}
                onChange={(e) => handleEditAcknowledgments(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter acknowledgment"
              />
              <button
                onClick={() => handleDeleteAcknowledgments(index)}
                className="px-2 py-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={handleAddAcknowledgments}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Acknowledgment
          </button>
        </div>
      </div>

      {/* Action Buttons - Updated with AI Tools */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrefaceReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          {renderAiTools()}
        </div>
        
        <button
          onClick={handlePrefaceSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Preface'}
        </button>
      </div>
    </div>
  );
};

export default PrefaceEditor; 