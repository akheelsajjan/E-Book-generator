import React, { useState, useRef, useEffect } from 'react';
import { Star, FileText, MessageSquare, StickyNote, Eye, X } from 'lucide-react';
import BookContentRenderer from '../preview/BookContentRenderer';

const EditorAIAssistant = ({
  aiSettings,
  aiTab,
  setAiTab,
  aiPrompt,
  setAiPrompt,
  pageTitle,
  content,
  viewType
}) => {
  const [activeTab, setActiveTab] = useState('live-preview');

  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
      activeTab === 'live-preview' ? 'w-[32vw]' : 'w-80'
    }`}>
      {/* Main Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('live-preview')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'live-preview' 
              ? 'bg-white text-purple-600 border-b-2 border-purple-600' 
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Live Preview</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('ai-assistant')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'ai-assistant' 
              ? 'bg-white text-purple-600 border-b-2 border-purple-600' 
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>AI Assistant</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'notes' 
              ? 'bg-white text-purple-600 border-b-2 border-purple-600' 
              : 'bg-gray-50 text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <StickyNote className="w-4 h-4" />
            <span>Notes</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className={`${activeTab === 'live-preview' ? 'h-full' : 'p-4'}`}>
        {activeTab === 'ai-assistant' && (
          <div className="h-full overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Your intelligent writing companion</p>
            </div>

            {/* AI Tabs */}
            <div className="flex space-x-1 mb-6">
              <button 
                onClick={() => setAiTab('writing')}
                className={`flex-1 px-3 py-2 rounded-md text-sm ${
                  aiTab === 'writing' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Writing
              </button>
              <button 
                onClick={() => setAiTab('research')}
                className={`flex-1 px-3 py-2 rounded-md text-sm ${
                  aiTab === 'research' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Research
              </button>
              <button 
                onClick={() => setAiTab('analysis')}
                className={`flex-1 px-3 py-2 rounded-md text-sm ${
                  aiTab === 'analysis' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Analysis
              </button>
            </div>

            {/* AI Tab Content */}
            {aiTab === 'writing' && (
              <div className="space-y-6">
                {/* Content Generation */}
                {aiSettings.aiWriter && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <h4 className="font-medium text-gray-900">Content Generation</h4>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="What would you like to write?"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        onClick={() => alert('AI features coming soon...')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                )}

                {/* Writing Prompts */}
                {aiSettings.aiWriter && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h4 className="font-medium text-gray-900">Writing Prompts</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h5 className="font-medium text-gray-900">Introduction</h5>
                        <p className="text-sm text-gray-600">Create an engaging opening that hooks readers and sets expectations for this chapter.</p>
                        <button 
                          onClick={() => alert('AI features coming soon...')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Use Prompt
                        </button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h5 className="font-medium text-gray-900">Real-World Examples</h5>
                        <p className="text-sm text-gray-600">Include practical examples that illustrate your key points and make concepts relatable.</p>
                        <button 
                          onClick={() => alert('AI features coming soon...')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Generate Examples
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Style Suggestions */}
                {aiSettings.aiSuggestions && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <h4 className="font-medium text-gray-900">Style Suggestions</h4>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md mb-3">
                      <p className="text-sm text-gray-600 mb-2">Your current text scores 7.2/10 readability. Consider shorter sentences and simpler vocabulary.</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => alert('AI features coming soon...')}
                          className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                        >
                          examples
                        </button>
                        <button 
                          onClick={() => alert('AI features coming soon...')}
                          className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                        >
                          improve flow
                        </button>
                        <button 
                          onClick={() => alert('AI features coming soon...')}
                          className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                        >
                          Add statistics
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {aiTab === 'research' && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500">Research features coming soon</p>
              </div>
            )}

            {aiTab === 'analysis' && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">Analysis features coming soon</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-full overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
              <p className="text-sm text-gray-600">Keep track of your ideas and thoughts</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <textarea
                  placeholder="Write your notes here..."
                  className="w-full h-64 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button 
                    onClick={() => alert('Notes feature coming soon...')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                  >
                    Save Note
                  </button>
                </div>
              </div>
              
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your saved notes will appear here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live-preview' && (
          <div className="h-full flex flex-col">
            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-center items-center h-full">
                {/* Page Container */}
                <div 
                  className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  <div 
                    className="h-full flex flex-col"
                    style={{
                      background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
                      padding: '40px',
                      maxWidth: '100%'
                    }}
                  >
                    <BookContentRenderer 
                      content={content} 
                      showTitle={true} 
                      title={pageTitle} 
                    />
                  </div>
                  
                  {/* Page Number */}
                  <div 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
                    style={{ fontSize: '14px' }}
                  >
                    Page 1
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorAIAssistant; 