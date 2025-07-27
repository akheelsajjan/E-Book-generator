import React from 'react';
import { Star, FileText } from 'lucide-react';

const EditorAIAssistant = ({
  aiSettings,
  aiTab,
  setAiTab,
  aiPrompt,
  setAiPrompt
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        <p className="text-sm text-gray-600">Your intelligent writing companion</p>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
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
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Use Prompt</button>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h5 className="font-medium text-gray-900">Real-World Examples</h5>
                  <p className="text-sm text-gray-600">Include practical examples that illustrate your key points and make concepts relatable.</p>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Generate Examples</button>
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
                  <button className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">examples</button>
                  <button className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">improve flow</button>
                  <button className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">Add statistics</button>
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
  );
};

export default EditorAIAssistant; 