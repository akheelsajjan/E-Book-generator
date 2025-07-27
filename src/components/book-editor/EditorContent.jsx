import React, { useState } from 'react';
import { Lightbulb, Zap, Plus, X } from 'lucide-react';

const EditorContent = ({
  pageTitle,
  chapterTitle,
  content,
  onTitleChange,
  onChapterChange,
  onContentChange,
  lastSaved,
  viewType = 'page',
  showTitleField,
  setShowTitleField,
  getCharacterLimit
}) => {
  // Determine if page has a title
  const hasTitle = pageTitle && pageTitle.trim().length > 0;
  
  // Get character limit based on title presence
  const maxChars = getCharacterLimit ? getCharacterLimit() : (hasTitle ? 1675 : 2000);
  const isOverLimit = content.length > maxChars;

  // Handle remove title
  const handleRemoveTitle = () => {
    onTitleChange({ target: { value: '' } });
    setShowTitleField && setShowTitleField(false);
  };

  return (
    <div className="flex-1 p-6">
      {/* Page/Chapter Info */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
            {hasTitle || showTitleField ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={pageTitle}
                  onChange={onTitleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page title"
                />
                {hasTitle && (
                  <button
                    onClick={handleRemoveTitle}
                    className="px-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center"
                    title="Remove title"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowTitleField && setShowTitleField(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                + Add Page Title
              </button>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
            <input
              type="text"
              value={chapterTitle}
              onChange={onChapterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">B</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">I</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">U</button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">H1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">H2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">H3</button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">• List</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">1. List</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200">• Numbered List</button>
          </div>
        </div>
      </div>

      {/* AI Writing Buttons */}
      <div className="mb-4 flex items-center space-x-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Lightbulb className="w-4 h-4 mr-2" />
          AI Writer
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Continue Writing
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Lightbulb className="w-4 h-4 mr-2" />
          AI Enhance
        </button>
      </div>

      {/* Text Editor */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <span className={`text-xs ${
            isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'
          }`}>
            {content.length.toLocaleString()} / {maxChars.toLocaleString()} characters
          </span>
        </div>
        <textarea
          value={content}
          onChange={onContentChange}
          className={`w-full h-96 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isOverLimit ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={`Start writing your content here... (max ${maxChars.toLocaleString()} characters${hasTitle ? ' with title' : ' without title'})`}
        />
        {isOverLimit && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
            ⚠️ Character limit exceeded. {hasTitle ? 'Consider removing the page title to increase the limit to 2000 characters.' : 'Please reduce content to stay within the limit.'}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Saved! Ctrl+S to save</span>
        </div>
        <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default EditorContent; 