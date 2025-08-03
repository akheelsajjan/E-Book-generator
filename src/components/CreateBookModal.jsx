import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Tag, Globe, FileText, Monitor, Smartphone, Sparkles, Wand2 } from 'lucide-react';
import { useCreateBook } from '../hooks/useCreateBook';
import { generateChapterContent, generateBookIntroduction, generateTableOfContents, generateCustomContent, testGeminiConnection } from '../services/geminiService';
import AIBookGenerator from './AIBookGenerator';

const CreateBookModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    language: 'en',
    description: '',
    viewType: 'page'
  });
  const [errors, setErrors] = useState({});

  // AI Generation States
  const [aiFormData, setAiFormData] = useState({
    bookDescription: '',
    genre: '',
    targetAudience: '',
    numberOfChapters: 5,
    chapterTitles: [],
    generatedContent: {
      introduction: '',
      tableOfContents: '',
      chapters: []
    }
  });
  const [aiError, setAiError] = useState('');

  const { createBook, loading, error } = useCreateBook();
  const [creationStep, setCreationStep] = useState('');

  // Character limits based on view type
  const CHARACTER_LIMITS = {
    page: 1600,
    scroll: 15000
  };

  // View type options
  const viewTypeOptions = [
    { value: 'page', label: 'Page View', icon: Monitor, description: 'Fixed layout like a physical book (base 1,600 chars, adjusted for titles)' },
    { value: 'scroll', label: 'Scroll View', icon: Smartphone, description: 'Flexible digital scroll (max 15,000 chars) - Coming Soon!' }
  ];

  // Genre options
  const genreOptions = [
    { value: '', label: 'Select a genre' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'technical', label: 'Technical' },
    { value: 'poetry', label: 'Poetry' },
    { value: 'biography', label: 'Biography' },
    { value: 'self-help', label: 'Self-Help' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'cooking', label: 'Cooking & Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'history', label: 'History' },
    { value: 'science', label: 'Science' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'religion', label: 'Religion & Spirituality' },
    { value: 'art', label: 'Art & Design' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'other', label: 'Other' }
  ];

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAiInputChange = (e) => {
    const { name, value } = e.target;
    setAiFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Book title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    } else if (formData.author.trim().length < 2) {
      newErrors.author = 'Author name must be at least 2 characters long';
    } else if (formData.author.trim().length > 50) {
      newErrors.author = 'Author name must be less than 50 characters';
    }

    if (!formData.genre) {
      newErrors.genre = 'Please select a genre';
    }

    if (formData.description.length > CHARACTER_LIMITS[formData.viewType]) {
      newErrors.description = `Description must be less than ${CHARACTER_LIMITS[formData.viewType].toLocaleString()} characters for ${formData.viewType === 'page' ? 'Page' : 'Scroll'} View`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAiForm = () => {
    const newErrors = {};

    if (!aiFormData.bookDescription.trim()) {
      newErrors.bookDescription = 'Book description is required for AI generation';
    }

    if (!aiFormData.genre) {
      newErrors.genre = 'Please select a genre';
    }

    if (!aiFormData.targetAudience) {
      newErrors.targetAudience = 'Please select a target audience';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setCreationStep('Creating your book...');
      const result = await createBook(formData);
      setCreationStep('Book created successfully!');
      
      setTimeout(() => {
        if (result) {
          const newBook = {
            id: result.bookId,
            title: formData.title.trim(),
            author: formData.author.trim(),
            genre: formData.genre,
            language: formData.language || 'en',
            description: formData.description.trim() || '',
            viewType: formData.viewType || 'page',
            status: 'draft',
            progress: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            cover: {
              title: formData.title.trim(),
              subtitle: '',
              author: formData.author.trim(),
              background: ''
            },
            authorInfo: {
              name: formData.author.trim(),
              bio: ''
            },
            preface: '',
            backMatter: '',
            chapters: []
          };
          onSuccess(newBook);
        }
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error creating book:', err);
    }
  };



  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        author: '',
        genre: '',
        language: 'en',
        description: '',
        viewType: 'page'
      });
      setAiFormData({
        bookDescription: '',
        genre: '',
        targetAudience: '',
        numberOfChapters: 5,
        chapterTitles: [],
        generatedContent: {
          introduction: '',
          tableOfContents: '',
          chapters: []
        }
      });
      setErrors({});
      setCreationStep('');
      setAiError('');
      setActiveTab('manual');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center modal-overlay p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl modal-content h-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400/80 rounded-sm"></div>
              <div className="w-2 h-2 bg-red-400/80 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-400/80 rounded-sm"></div>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">Create New Book</h2>
              <p className="text-gray-300 text-sm">Choose your creation method</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'manual'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Generate Book Manually</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate Content Using AI</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">AI for enhancement</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'manual' && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Manual Book Creation Form */}
              {/* Book Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2 text-blue-500" />
                  Book Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                    errors.title 
                      ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                      : 'border-blue-300 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white'
                  } shadow-sm`}
                  placeholder="Enter book title"
                  disabled={loading}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.title}
                  </p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2 text-blue-500" />
                  Author Name *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  maxLength={50}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                    errors.author 
                      ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                      : 'border-blue-300 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white'
                  } shadow-sm`}
                  placeholder="Enter author name"
                  disabled={loading}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.author.length}/50 characters
                </div>
                {errors.author && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.author}
                  </p>
                )}
              </div>

              {/* Genre and Language Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Genre */}
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2 text-blue-500" />
                    Genre *
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                      errors.genre 
                        ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                        : 'border-blue-300 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white'
                    } shadow-sm`}
                    disabled={loading}
                  >
                    {genreOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.genre && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.genre}
                    </p>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2 text-blue-500" />
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm transition-all duration-300"
                    disabled={loading}
                  >
                    {languageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Monitor className="w-4 h-4 inline mr-2 text-blue-500" />
                  View Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {viewTypeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.viewType === option.value;
                    const isDisabled = option.value === 'scroll';
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            setFormData(prev => ({ ...prev, viewType: option.value }));
                            if (errors.description) {
                              setErrors(prev => ({ ...prev, description: '' }));
                            }
                          }
                        }}
                        className={`p-3 border-2 rounded-xl text-left transition-all duration-300 ${
                          isDisabled
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                            : isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        disabled={loading || isDisabled}
                      >
                        <div className="flex items-center mb-1">
                          <Icon className={`w-4 h-4 mr-2 ${isSelected ? 'text-blue-500' : isDisabled ? 'text-gray-400' : 'text-gray-400'}`} />
                          <span className="font-semibold text-sm">{option.label}</span>
                          {isDisabled && (
                            <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 inline mr-2 text-blue-500" />
                    Description (Optional)
                  </label>
                  <span className={`text-xs font-medium ${
                    formData.description.length > CHARACTER_LIMITS[formData.viewType] 
                      ? 'text-red-500' 
                      : 'text-gray-500'
                  }`}>
                    {formData.description.length.toLocaleString()} / {CHARACTER_LIMITS[formData.viewType].toLocaleString()} characters
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={CHARACTER_LIMITS[formData.viewType]}
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                    errors.description 
                      ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                      : 'border-blue-300 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white'
                  } shadow-sm`}
                  placeholder="Enter book description..."
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {creationStep === 'Book created successfully!' && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Book initialized with 1 chapter and 1 page!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {creationStep || 'Creating...'}
                    </>
                  ) : (
                    'Create Book'
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'ai' && (
            <div className="p-6 space-y-4">
              {/* AI Book Generation Form */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Book Generation</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Let AI help you create a complete book with introduction, table of contents, and sample chapters.
                </p>
              </div>



              {/* Book Description */}
              <div>
                <label htmlFor="aiBookDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2 text-purple-500" />
                  Input Text *
                </label>
                <textarea
                  id="aiBookDescription"
                  name="bookDescription"
                  value={aiFormData.bookDescription}
                  onChange={handleAiInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                    errors.bookDescription 
                      ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                      : 'border-purple-300 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white'
                  } shadow-sm`}
                  placeholder="Describe what your book is about, its main topics, and what readers will learn..."
                  disabled={false}
                />
                {errors.bookDescription && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.bookDescription}
                  </p>
                )}
              </div>

              {/* Genre */}
              <div>
                <label htmlFor="aiGenre" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2 text-purple-500" />
                  Genre *
                </label>
                <select
                  id="aiGenre"
                  name="genre"
                  value={aiFormData.genre}
                  onChange={handleAiInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                    errors.genre 
                      ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                      : 'border-purple-300 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white'
                  } shadow-sm`}
                  disabled={false}
                >
                  <option value="">Select a genre</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="technical">Technical</option>
                  <option value="poetry">Poetry</option>
                  <option value="biography">Biography</option>
                  <option value="self-help">Self-Help</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="health">Health & Wellness</option>
                  <option value="cooking">Cooking & Food</option>
                  <option value="travel">Travel</option>
                  <option value="history">History</option>
                  <option value="science">Science</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="religion">Religion & Spirituality</option>
                  <option value="art">Art & Design</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports & Recreation</option>
                  <option value="other">Other</option>
                </select>
                {errors.genre && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.genre}
                  </p>
                )}
              </div>

              {/* Target Audience */}
              <div>
                <label htmlFor="aiTargetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2 text-purple-500" />
                  Target Audience *
                </label>
                <select
                  id="aiTargetAudience"
                  name="targetAudience"
                  value={aiFormData.targetAudience}
                  onChange={handleAiInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                    errors.targetAudience 
                      ? 'border-red-300 focus:ring-red-500/30 hover:border-red-400 focus:border-red-500 bg-gradient-to-r from-red-50 to-white' 
                      : 'border-purple-300 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white'
                  } shadow-sm`}
                  disabled={false}
                >
                  <option value="">Select target audience</option>
                  <option value="kids">Kids</option>
                  <option value="teens">Teens</option>
                  <option value="adults">Adults</option>
                  <option value="college">College</option>
                  <option value="elderly">Elderly</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="all">All</option>
                </select>
                {errors.targetAudience && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.targetAudience}
                  </p>
                )}
              </div>

              {/* Number of Chapters */}
              <div>
                <label htmlFor="aiNumberOfChapters" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2 text-purple-500" />
                  Number of Chapters
                </label>
                <select
                  id="aiNumberOfChapters"
                  name="numberOfChapters"
                  value={aiFormData.numberOfChapters}
                  onChange={handleAiInputChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm transition-all duration-300"
                  disabled={false}
                >
                  <option value={1}>1 Chapter</option>
                  <option value={2}>2 Chapters</option>
                  <option value={3}>3 Chapters</option>
                  <option value={4}>4 Chapters</option>
                  <option value={5}>5 Chapters</option>
                  <option value={6}>6 Chapters</option>
                  <option value={7}>7 Chapters</option>
                  <option value={8}>8 Chapters</option>
                </select>
              </div>

              {/* AI Error Message */}
              {aiError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {aiError}
                </div>
              )}



              {/* AI Book Generator Component */}
              <AIBookGenerator
                bookDescription={aiFormData.bookDescription}
                genre={aiFormData.genre}
                targetAudience={aiFormData.targetAudience}
                numberOfChapters={aiFormData.numberOfChapters}
                onSuccess={() => {
                  handleClose();
                  onSuccess && onSuccess();
                }}
                onError={(error) => {
                  setAiError(error);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBookModal; 