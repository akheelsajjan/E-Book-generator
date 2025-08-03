import React, { useState } from 'react';
import { FileText, Settings, Languages, ChevronDown, Loader2 } from 'lucide-react';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

const TOCEditor = ({ book, setBook, onTOCDataChange, aiTools = [], onAiToolClick, languageOptions = [] }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [loadingField, setLoadingField] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  // Handle field focus for AI operations
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    setAiMessage('AI can help you translate TOC content.');
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

    // For TOC, we don't have specific content to translate yet
    // This is a placeholder for future TOC editing functionality
    setAiMessage('TOC editing features are coming soon. Translation will be available when TOC editing is implemented.');
  };

  // Filter AI tools - only show translate for TOC
  const getFilteredAiTools = () => {
    if (!focusedField) return [];
    
    // For TOC, show only translate (when implemented)
    return aiTools.filter(tool => tool.id === 'translate');
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Table of Contents</h3>
        <p className="text-blue-700 text-sm">
          Manage your table of contents and chapter structure.
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <FileText className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Edit Features Coming Soon
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Advanced table of contents editing features are currently in development. 
            The preview shows your current chapter and page structure.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Planned Features:</h5>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Custom TOC entry management</li>
              <li>• Page number configuration</li>
              <li>• Chapter summary editing</li>
              <li>• Drag-and-drop reordering</li>
              <li>• Advanced formatting options</li>
              <li>• AI-powered translation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Structure Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-4 h-4 mr-2 text-blue-600" />
          Current Structure
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Chapters</span>
            <span className="text-sm text-gray-500">{book?.chapters?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Total Pages</span>
            <span className="text-sm text-gray-500">
              {book?.chapters?.reduce((total, chapter) => total + (chapter.pages?.length || 0), 0) || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Updated with AI Tools */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          {renderAiTools()}
        </div>
        
        <div className="text-sm text-gray-500">
          TOC editing coming soon
        </div>
      </div>
    </div>
  );
};

export default TOCEditor; 