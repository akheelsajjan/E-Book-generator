import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, BarChart3, Eye, Download, Plus, BookOpen, FileText, Star, Zap, Lightbulb as LightbulbIcon } from 'lucide-react';

const BookEditor = ({ bookTitle, onSwitchToBookBuilder }) => {
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
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-col">
        {/* Action Buttons */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onSwitchToBookBuilder}
            className="w-full mb-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            + Book Builder
          </button>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              + New Page
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              + New Chapter
            </button>
          </div>
          <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <LightbulbIcon className="w-4 h-4 mr-2" />
            AI Generate Outline
          </button>
        </div>

        {/* Book Content Tree */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-3">Book Structure</h3>
          <div className="space-y-2">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex}>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{chapter.name}</span>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded text-red-500">
                      <FileText className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {chapter.pages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    className={`ml-4 p-2 bg-gray-50 cursor-pointer ${
                      selectedPage === page ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{page}</span>
                      {selectedPage === page && <Star className="w-3 h-3 text-orange-500" />}
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
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">{bookTitle}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span className="text-sm text-gray-600">Progress</span>
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
                <Lightbulb className="w-4 h-4" />
                <span>AI Settings</span>
              </button>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  AI Analyzer
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          {/* Page/Chapter Info */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
              <input
                type="text"
                value={currentChapter}
                onChange={(e) => setCurrentChapter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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