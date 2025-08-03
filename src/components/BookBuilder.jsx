import React, { useState } from 'react';
import { ArrowLeft, BookOpen, User, FileText, List, FileText as AppendixIcon, Eye } from 'lucide-react';

const BookBuilder = ({ onBackToEditor, bookTitle, onSwitchToPreview }) => {
  const [activeTab, setActiveTab] = useState('cover');
  const [formData, setFormData] = useState({
    title: bookTitle || '',
    subtitle: '',
    author: '',
    authorBio: '',
    preface: '',
    shortDescription: '',
    fullDescription: '',
    tags: '',
    tone: '',
    publishedYear: new Date().getFullYear()
  });
  const [errors, setErrors] = useState({});

  const tabs = [
    { id: 'cover', label: 'Book Cover', icon: BookOpen },
    { id: 'about', label: 'About Book', icon: FileText },
    { id: 'author', label: 'About Author', icon: User },
    { id: 'preface', label: 'Preface', icon: FileText },
    { id: 'toc', label: 'Table of Contents', icon: List },
    { id: 'appendix', label: 'Appendix', icon: AppendixIcon },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateTitle = (title) => {
    if (!title.trim()) {
      return 'Book title is required';
    } else if (title.trim().length < 3) {
      return 'Title must be at least 3 characters long';
    } else if (title.trim().length > 100) {
      return 'Title must be less than 100 characters';
    } else if (title.trim().length > 80) {
      return 'Title is quite long and may not display well on book covers';
    }
    return '';
  };

  const handleTitleChange = (value) => {
    handleInputChange('title', value);
    const error = validateTitle(value);
    if (error) {
      setErrors(prev => ({ ...prev, title: error }));
    }
  };

  const validateAuthor = (author) => {
    if (!author.trim()) {
      return 'Author name is required';
    } else if (author.trim().length < 2) {
      return 'Author name must be at least 2 characters long';
    } else if (author.trim().length > 50) {
      return 'Author name must be less than 50 characters';
    } else if (author.trim().length > 40) {
      return 'Author name is quite long and may not display well on book covers';
    }
    return '';
  };

  const handleAuthorChange = (value) => {
    handleInputChange('author', value);
    const error = validateAuthor(value);
    if (error) {
      setErrors(prev => ({ ...prev, author: error }));
    }
  };

  const validateDescription = (description) => {
    if (description.length > 1600) {
      return 'Description must be less than 1,600 characters';
    } else if (description.length > 1280) {
      return 'Description is getting long. Consider keeping it under 1,280 characters for better readability.';
    }
    return '';
  };

  const handleDescriptionChange = (value) => {
    handleInputChange('description', value);
    const error = validateDescription(value);
    if (error) {
      setErrors(prev => ({ ...prev, description: error }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cover':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Cover</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Book Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  maxLength={100}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm ${
                    errors.title 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' 
                      : 'border-purple-300'
                  }`}
                  placeholder="Enter book title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Subtitle</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm"
                  placeholder="Enter subtitle (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  maxLength={50}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm ${
                    errors.author 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' 
                      : 'border-purple-300'
                  }`}
                  placeholder="Enter author name"
                />
                {errors.author && (
                  <p className="mt-2 text-sm text-red-600">{errors.author}</p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formData.author.length}/50 characters
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-300 transition-all duration-300">
                  <p className="text-gray-500">Click to upload cover image</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">About Book</h2>
            <div className="space-y-6">
              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">One-liner about the book</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  maxLength={280}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 resize-none"
                  rows="3"
                  placeholder="A compelling one-sentence description..."
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Used for dashboard previews</span>
                  <span>{formData.shortDescription.length}/280</span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">What is this book about?</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  maxLength={2000}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 resize-none"
                  rows="8"
                  placeholder="A detailed description of your book's plot, themes, and what readers can expect..."
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Used for book details and social sharing</span>
                  <span>{formData.fullDescription.length}/2000</span>
                </div>
              </div>

              {/* Tags/Genres */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Genres or themes (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500"
                  placeholder="e.g. mystery, fantasy, poetic, time-travel"
                />
              </div>

              {/* Tone/Mood Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Tone / Mood</label>
                <select
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500"
                >
                  <option value="">Select tone...</option>
                  <option value="thoughtful">Thoughtful</option>
                  <option value="suspenseful">Suspenseful</option>
                  <option value="whimsical">Whimsical</option>
                  <option value="dark">Dark</option>
                  <option value="reflective">Reflective</option>
                  <option value="light-hearted">Light-hearted</option>
                </select>
              </div>

              {/* Published Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Published Year</label>
                <input
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => handleInputChange('publishedYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500"
                />
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
                <label className="block text-sm font-semibold text-gray-900 mb-3">Author Bio</label>
                <textarea
                  value={formData.authorBio}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={2000}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200'
                  }`}
                  rows="6"
                  placeholder="Write a compelling author biography..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formData.authorBio.length}/2,000 characters
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Author Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-300 transition-all duration-300">
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
                <label className="block text-sm font-semibold text-gray-900 mb-3">Preface Content</label>
                <textarea
                  value={formData.preface}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  maxLength={2000}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200'
                  }`}
                  rows="12"
                  placeholder="Write your preface here..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formData.preface.length}/2,000 characters
                </div>
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
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Table of Contents</h3>
                <ul className="space-y-2 text-sm text-gray-600">
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
                <label className="block text-sm font-semibold text-gray-900 mb-3">Appendix Content</label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300 focus:border-purple-500 resize-none"
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
    <div className="flex h-screen dashboard-container">
      {/* Left Sidebar */}
      <div className="w-64 sidebar-dark flex-col">
        {/* Header */}
        <div 
          className="p-4 border-b border-white/20"
          style={{ 
            backgroundColor: '#1e1e2f', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            color: 'white'
          }}
        >
          <button
            onClick={onBackToEditor}
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-lg font-semibold text-white">Book Builder</h1>
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
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors sidebar-item ${
                    activeTab === tab.id
                      ? 'active'
                      : 'hover:bg-white/10'
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
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ 
            backgroundColor: '#1e1e2f', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            color: 'white'
          }}
        >
          {/* Left Section - Back Button and Title */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToEditor}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold text-white truncate max-w-md">Book Builder</h1>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onSwitchToPreview}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 flex items-center shadow-lg"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Save Changes
            </button>
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