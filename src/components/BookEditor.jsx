import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, BarChart3, Eye, Download, Plus, BookOpen, FileText, Star, Zap, Lightbulb as LightbulbIcon } from 'lucide-react';

const BookEditor = ({ bookTitle, onSwitchToBookBuilder, onSwitchToPreview }) => {
  const [selectedPage, setSelectedPage] = useState('Introduction');
  const [currentChapter, setCurrentChapter] = useState('Getting Started');
  const [content, setContent] = useState(
    "Welcome to your ebook creation journey!\n\nThis chapter will cover:\n• The basic principles that govern our topic\n• Key terminology you'll encounter throughout this book\n• Essential background knowledge for beginners\n\nUnderstanding these fundamentals is crucial for your success."
  );

  const chapters = [
    {
      name: 'Getting Started',
      pages: ['Introduction'],
      expanded: true
    },
    {
      name: 'Foundations',
      pages: ['Chapter 1undations'],
      expanded: true
    }
  ];

  return (
    <div className="flex h-screen dashboard-container">
      {/* Left Sidebar */}
      <div className="w-64 sidebar-dark flex-col">
        {/* Action Buttons */}
        <div className="p-4 border-b border-white/20">
          <button
            onClick={onSwitchToBookBuilder}
            className="btn-primary w-full mb-3 flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            + Book Builder
          </button>
          <div className="space-y-2">
            <button className="btn-primary w-full flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              + New Page
            </button>
            <button className="btn-primary w-full flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              + New Chapter
            </button>
          </div>
          <button className="btn-ai w-full mt-3 flex items-center justify-center">
            <LightbulbIcon className="w-4 h-4 mr-2" />
            AI Generate Outline
          </button>
        </div>

        {/* Book Content Tree */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-medium text-white mb-3">Book Structure</h3>
          <div className="space-y-2">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex}>
                <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                  <span className="text-sm font-medium text-white">{chapter.name}</span>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 hover:bg-white/20 rounded text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-white/20 rounded text-red-400">
                      <FileText className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {chapter.pages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    className={`ml-4 p-2 bg-white/10 cursor-pointer ${
                      selectedPage === page ? 'bg-white/20 border-l-2 border-accent-primary' : ''
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{page}</span>
                      {selectedPage === page && <Star className="w-3 h-3 text-orange-400" />}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex-col">
        {/* Top Bar */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ 
            backgroundColor: '#1e1e2f', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            color: 'white'
          }}
        >
          {/* Left Section - Back Button */}
          <div className="flex items-center">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>

          {/* Center Section - Book Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-white truncate max-w-md">
              {bookTitle}
            </h1>
          </div>

          {/* Right Section - Progress and Action Buttons */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">Progress: 0%</span>
            
            <button className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              AI Settings
            </button>
            
            <button className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              AI Analyzer
            </button>
            
            <button 
              onClick={onSwitchToPreview}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 flex items-center shadow-lg"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          {/* Page/Chapter Info */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Page Title</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  maxLength={100}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 ${
                    selectedPage && selectedPage.length > 80 ? 'border-yellow-300' : 'border-gray-200'
                  }`}
                />
                {selectedPage && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-500">
                      {selectedPage.length}/100 characters
                    </div>
                    {selectedPage.length > 80 && (
                      <div className="text-yellow-600">
                        Page title is quite long and may not display well
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Chapter</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={currentChapter}
                  onChange={(e) => setCurrentChapter(e.target.value)}
                  maxLength={100}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 ${
                    currentChapter && currentChapter.length > 80 ? 'border-yellow-300' : 'border-gray-200'
                  }`}
                />
                {currentChapter && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-500">
                      {currentChapter.length}/100 characters
                    </div>
                    {currentChapter.length > 80 && (
                      <div className="text-yellow-600">
                        Chapter title is quite long and may not display well
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">B</button>
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">I</button>
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">U</button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">H1</button>
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">H2</button>
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">H3</button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">• List</button>
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">1. List</button>
                <button className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 font-semibold">• Numbered List</button>
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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start writing your content here..."
            />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Saved! Ctrl+S to save</span>
            </div>
            <span>Last saved: 7/span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          <p className="text-sm text-gray-600">Your intelligent writing companion</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md text-sm">Writing</button>
          <button className="flex-1 px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-700">Research</button>
          <button className="flex-1 px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-700">Analysis</button>
        </div>

        {/* Content Generation */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-4 h-4 text-yellow-50" />
            <h4 className="font-medium text-gray-900">Content Generation</h4>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="What would you like to write?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Generate
            </button>
          </div>
        </div>

        {/* Writing Prompts */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-50" />
            <h4 className="font-medium text-gray-900">Writing Prompts</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-md">
              <h5 className="font-medium text-gray-900">Introduction</h5>
              <p className="text-sm text-gray-600">Create an engaging opening that hooks readers and sets expectations for this chapter.</p>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Use Prompt</button>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <h5 className="font-medium text-gray-900">Real-World Examples</h5>
              <p className="text-sm text-gray-600">Include practical examples that illustrate your key points and make concepts relatable.</p>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Generate Examples</button>
            </div>
          </div>
        </div>

        {/* Style Suggestions */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-4 h-4 text-blue-50" />
            <h4 className="font-medium text-gray-900">Style Suggestions</h4>
          </div>
          <div className="p-3 bg-gray-50 rounded-md mb-3">
            <p className="text-sm text-gray-600 mb-2">Your current text scores 7.2/10 readability. Consider shorter sentences and simpler vocabulary.</p>
            <div className="flex space-x-2">
              <button className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">examples</button>
              <button className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">improve flow</button>
              <button className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">Add statistics</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEditor; 