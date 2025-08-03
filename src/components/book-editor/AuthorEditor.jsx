import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';
import { Sparkles, RotateCcw, Languages, Zap, User, ChevronDown, Loader2 } from 'lucide-react';
import bookBuilderAIService from '../../services/bookBuilderAIService';
import { bookBuilderAIToolConfigs } from '../../config/bookBuilderAIToolConfigs';

const AuthorEditor = ({ book, setBook, onAuthorDataChange, aiTools = [], onAiToolClick, languageOptions = [] }) => {
  const [authorData, setAuthorData] = useState({
    name: book.author?.name || '',
    title: book.author?.title || '',
    bio: book.author?.bio || '',
    photo: null,
    credentials: book.author?.credentials || [],
    achievements: book.author?.achievements || [],
    social: {
      website: book.author?.social?.website || '',
      twitter: book.author?.social?.twitter || '',
      linkedin: book.author?.social?.linkedin || '',
      email: book.author?.social?.email || ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // 'name', 'title', 'bio', 'social.*'
  const [loadingField, setLoadingField] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  const handleAuthorFieldChange = (field, value) => {
    const updatedAuthor = {
      ...authorData,
      [field]: value
    };
    setAuthorData(updatedAuthor);
    
    // Notify parent component for live preview
    if (onAuthorDataChange) {
      onAuthorDataChange(updatedAuthor);
    }
  };

  const handleSocialFieldChange = (platform, value) => {
    const updatedAuthor = {
      ...authorData,
      social: {
        ...authorData.social,
        [platform]: value
      }
    };
    setAuthorData(updatedAuthor);
    
    // Notify parent component for live preview
    if (onAuthorDataChange) {
      onAuthorDataChange(updatedAuthor);
    }
  };

  const handleAddCredential = () => {
    setAuthorData(prev => ({
      ...prev,
      credentials: [...prev.credentials, '']
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
      achievements: [...prev.achievements, '']
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
      name: '',
      title: '',
      bio: '',
      photo: null,
      credentials: [],
      achievements: [],
      social: {
        website: '',
        twitter: '',
        linkedin: '',
        email: ''
      }
    });
  };

  const handleAuthorSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with author data locally
      setBook(prev => ({
        ...prev,
        author: authorData
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        author: authorData
      });
      
      console.log('Author information saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving author information:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field focus for AI operations
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    if (field === 'name') {
      setAiMessage('AI can translate author name, select Translation');
    } else if (field === 'title') {
      setAiMessage('AI can translate professional title, select Translation');
    } else if (field === 'bio') {
      setAiMessage('AI can help you enhance the author bio with all features');
    } else {
      setAiMessage(`AI can help you enhance the ${field} field.`);
    }
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
    if (focusedField === 'name' || focusedField === 'title' || focusedField === 'bio') {
      currentContent = authorData[focusedField] || '';
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
          handleAuthorFieldChange(focusedField, newContent);
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
    
    // For name and title fields, only show translation tools
    if (focusedField === 'name' || focusedField === 'title') {
      return aiTools.filter(tool => tool.id === 'translate');
    }
    
    // For bio field, show all tools
    if (focusedField === 'bio') {
      return aiTools;
    }
    
    // For social media fields, show no tools
    if (focusedField.startsWith('social.')) {
      return [];
    }
    
    // For other fields, show all tools
    return aiTools;
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
        <div className="relative">
          <input
            type="text"
            value={authorData.name}
            onChange={(e) => handleAuthorFieldChange('name', e.target.value)}
            onFocus={() => handleFieldFocus('name')}
            className={`w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm transition-all duration-300 ${
              loadingField === 'name' ? 'bg-blue-50' : ''
            }`}
            placeholder="Enter author name"
          />
          {loadingField === 'name' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
        <div className="relative">
          <input
            type="text"
            value={authorData.title}
            onChange={(e) => handleAuthorFieldChange('title', e.target.value)}
            onFocus={() => handleFieldFocus('title')}
            className={`w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300 ${
              loadingField === 'title' ? 'bg-blue-50' : ''
            }`}
            placeholder="e.g., Professor, CEO, Consultant"
          />
          {loadingField === 'title' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio</label>
        <div className="relative">
          <textarea
            value={authorData.bio}
            onChange={(e) => handleAuthorFieldChange('bio', e.target.value)}
            onFocus={() => handleFieldFocus('bio')}
            rows="4"
            className={`w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm transition-all duration-300 ${
              loadingField === 'bio' ? 'bg-blue-50' : ''
            }`}
            placeholder="Write a compelling author biography..."
          />
          {loadingField === 'bio' && (
            <div className="absolute right-3 top-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Photo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <p className="text-gray-500">Click to upload author photo</p>
        </div>
      </div>

      {/* Credentials */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Credentials</label>
        <div className="space-y-2">
          {authorData.credentials.map((credential, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={credential}
                onChange={(e) => handleEditCredential(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter credential"
              />
              <button
                onClick={() => handleDeleteCredential(index)}
                className="px-2 py-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={handleAddCredential}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Credential
          </button>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
        <div className="space-y-2">
          {authorData.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleEditAchievement(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter achievement"
              />
              <button
                onClick={() => handleDeleteAchievement(index)}
                className="px-2 py-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={handleAddAchievement}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Achievement
          </button>
        </div>
      </div>

      {/* Social Media Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Website</label>
            <input
              type="url"
              value={authorData.social.website}
              onChange={(e) => handleSocialFieldChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Twitter</label>
            <input
              type="url"
              value={authorData.social.twitter}
              onChange={(e) => handleSocialFieldChange('twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://twitter.com/yourauthor"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
            <input
              type="url"
              value={authorData.social.linkedin}
              onChange={(e) => handleSocialFieldChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/yourauthor"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={authorData.social.email}
              onChange={(e) => handleSocialFieldChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="author@example.com"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons - Updated with AI Tools */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAuthorReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          {renderAiTools()}
        </div>
        
        <button
          onClick={handleAuthorSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Author'}
        </button>
      </div>
    </div>
  );
};

export default AuthorEditor; 