import React, { useState } from 'react';
import { ArrowLeft, BookOpen, User, FileText, List, FileText as AppendixIcon } from 'lucide-react';

const BookBuilder = ({ onBackToEditor, bookTitle }) => {
  const [activeTab, setActiveTab] = useState('cover');

  const tabs = [
    { id: 'cover', label: 'Book Cover', icon: BookOpen },
    { id: 'author', label: 'About Author', icon: User },
    { id: 'preface', label: 'Preface', icon: FileText },
    { id: 'toc', label: 'Table of Contents', icon: List },
    { id: 'appendix', label: 'Appendix', icon: AppendixIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cover':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Cover</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter book title"
                  defaultValue={bookTitle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subtitle (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-gray-500">Click to upload cover image</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'author':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">About Author</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  placeholder="Write a compelling author biography..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-gray-500">Click to upload author photo</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'preface':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Preface</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preface Content</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="12"
                  placeholder="Write your preface here..."
                />
              </div>
            </div>
          </div>
        );
      case 'toc':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Table of Contents</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Table of contents will be automatically generated from your chapters and pages.</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Table of Contents</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Getting Started</li>
                  <li className="ml-4">- Introduction</li>
                  <li>• Foundations</li>
                  <li className="ml-4">- Chapter 1 Foundations</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'appendix':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Appendix</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appendix Content</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="12"
                  placeholder="Add any additional materials, references, or supplementary content..."
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onBackToEditor}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Book Builder</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">Book Builder</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookBuilder; 