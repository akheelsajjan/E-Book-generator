import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Eye, Download, User, List } from 'lucide-react';
import BookBuilderSidebar from './BookBuilderSidebar';
import BookCoverEditor from './BookCoverEditor';
import AuthorEditor from './AuthorEditor';
import PrefaceEditor from './PrefaceEditor';
import TOCEditor from './TOCEditor';
import AppendixEditor from './AppendixEditor';
import BookCoverPreview from './BookCoverPreview';
import AuthorPreview from './AuthorPreview';
import PrefacePreview from './PrefacePreview';
import TOCPreview from './TOCPreview';
import AppendixPreview from './AppendixPreview';

const BookBuilderView = ({
  book,
  setBook,
  aiSettings,
  aiDropdownOpen,
  setAiDropdownOpen,
  aiDropdownRef,
  calculateProgress,
  handleAiSettingChange,
  onSwitchToEditor,
  AI_FEATURES
}) => {
  const [activeBookBuilderTab, setActiveBookBuilderTab] = useState('cover');
  const [liveCoverData, setLiveCoverData] = useState(null);
  const [liveAuthorData, setLiveAuthorData] = useState(null);
  const [livePrefaceData, setLivePrefaceData] = useState(null);
  const [liveTOCData, setLiveTOCData] = useState(null);
  const [liveAppendixData, setLiveAppendixData] = useState(null);

  // Initialize live cover data when cover tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'cover' && book?.cover && !liveCoverData) {
      setLiveCoverData(book.cover);
    }
  }, [activeBookBuilderTab, book?.cover, liveCoverData]);

  // Initialize live author data when author tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'author' && book?.author && !liveAuthorData) {
      setLiveAuthorData(book.author);
    }
  }, [activeBookBuilderTab, book?.author, liveAuthorData]);

  // Initialize live preface data when preface tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'preface' && book?.preface && !livePrefaceData) {
      setLivePrefaceData(book.preface);
    }
  }, [activeBookBuilderTab, book?.preface, livePrefaceData]);

  // Initialize live appendix data when appendix tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'appendix' && book?.appendix && !liveAppendixData) {
      setLiveAppendixData(book.appendix);
    }
  }, [activeBookBuilderTab, book?.appendix, liveAppendixData]);

  // Initialize live TOC data when toc tab is selected
  useEffect(() => {
    if (activeBookBuilderTab === 'toc' && book?.chapters && !liveTOCData) {
      setLiveTOCData(book.chapters);
    }
  }, [activeBookBuilderTab, book?.chapters, liveTOCData]);

  const bookBuilderTabs = [
    { id: 'cover', label: 'Book Cover', icon: '📖' },
    { id: 'author', label: 'About Author', icon: '👤' },
    { id: 'preface', label: 'Preface', icon: '📝' },
    { id: 'toc', label: 'Table of Contents', icon: '📋' },
    { id: 'appendix', label: 'Appendix', icon: '📚' },
  ];

  const renderTabContent = () => {
    switch (activeBookBuilderTab) {
      case 'cover':
        return (
          <BookCoverEditor 
            book={book} 
            setBook={setBook} 
            onCoverDataChange={setLiveCoverData}
          />
        );
      case 'author':
        return (
          <AuthorEditor 
            book={book} 
            setBook={setBook} 
            onAuthorDataChange={setLiveAuthorData}
          />
        );
      case 'preface':
        return (
          <PrefaceEditor 
            book={book} 
            setBook={setBook} 
            onPrefaceDataChange={setLivePrefaceData}
          />
        );
      case 'toc':
        return <TOCEditor book={book} setBook={setBook} onTOCDataChange={setLiveTOCData} />;
      case 'appendix':
        return (
          <AppendixEditor 
            book={book} 
            setBook={setBook} 
            onAppendixDataChange={setLiveAppendixData}
          />
        );
      default:
        return (
          <BookCoverEditor 
            book={book} 
            setBook={setBook} 
            onCoverDataChange={setLiveCoverData}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSwitchToEditor}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{book.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Progress:</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{calculateProgress()}%</span>
          </div>

          {/* AI Settings Dropdown */}
          <div className="relative" ref={aiDropdownRef}>
            <button
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setAiDropdownOpen(v => !v)}
            >
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Book Settings
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {aiDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Book Builder Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Auto-generate TOC</span>
                    </label>
                    <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Include page numbers</span>
                    </label>
                    <label className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Add chapter summaries</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
            <BarChart3 className="w-4 h-4 mr-2" />
            Book Analyzer
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Book Builder Navigation */}
        <BookBuilderSidebar
          activeTab={activeBookBuilderTab}
          setActiveTab={setActiveBookBuilderTab}
          bookBuilderTabs={bookBuilderTabs}
          onSwitchToEditor={onSwitchToEditor}
        />

        {/* Main Content Area - Split Layout */}
        <div className="flex-1 bg-white flex">
          {/* Left Panel - Editor */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Editor Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {bookBuilderTabs.find(tab => tab.id === activeBookBuilderTab)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                {activeBookBuilderTab === 'cover' && 'Design your book cover and set up basic information'}
                {activeBookBuilderTab === 'author' && 'Add author information and biography'}
                {activeBookBuilderTab === 'preface' && 'Write your book preface and acknowledgments'}
                {activeBookBuilderTab === 'toc' && 'Manage your table of contents'}
                {activeBookBuilderTab === 'appendix' && 'Add appendix sections and additional content'}
              </p>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-gray-50 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <p className="text-sm text-gray-600">See how your book will look</p>
            </div>
            <div className="flex-1 p-6">
              {activeBookBuilderTab === 'cover' && (
                <BookCoverPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentCoverData={liveCoverData}
                />
              )}
              {activeBookBuilderTab === 'author' && (
                <AuthorPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentAuthorData={liveAuthorData}
                />
              )}
              {activeBookBuilderTab === 'preface' && (
                <PrefacePreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentPrefaceData={livePrefaceData}
                />
              )}
              {activeBookBuilderTab === 'toc' && (
                <TOCPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentTOCData={liveTOCData}
                />
              )}
              {activeBookBuilderTab === 'appendix' && (
                <AppendixPreview 
                  book={book} 
                  activeTab={activeBookBuilderTab}
                  currentAppendixData={liveAppendixData}
                />
              )}
              {activeBookBuilderTab !== 'cover' && activeBookBuilderTab !== 'author' && activeBookBuilderTab !== 'preface' && activeBookBuilderTab !== 'toc' && activeBookBuilderTab !== 'appendix' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-4">📖</div>
                    <p>Preview will appear here</p>
                    <p className="text-sm mt-2">Select a tab to see the preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookBuilderView; 