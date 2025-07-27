import React, { useState } from 'react';
import { Bot, MessageCircle, Bookmark, Search, Zap, Lightbulb } from 'lucide-react';

const PreviewSettings = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAiSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement AI functionality
    setAiResponse('AI response placeholder...');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
        <p className="text-sm text-gray-600">Your intelligent writing companion</p>
      </div>

      {/* AI Actions */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">Dictionary</span>
          </button>
          
          <button className="flex items-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Summarize</span>
          </button>
          
          <button className="flex items-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">
            <Search className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700">Explain</span>
          </button>
          
          <button className="flex items-center space-x-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors">
            <Bookmark className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-700">Notes</span>
          </button>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="bg-gray-50 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">AI Response</span>
            </div>
            <p className="text-sm text-gray-600">{aiResponse}</p>
          </div>
        )}

        {/* AI Input */}
        <form onSubmit={handleAiSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ask AI about this page
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask me anything about this page..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          AI Assistant powered by advanced language models
        </div>
      </div>
    </div>
  );
};

export default PreviewSettings; 