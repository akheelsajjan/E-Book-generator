import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Tag, Globe, FileText, Monitor, Smartphone } from 'lucide-react';
import { useCreateBook } from '../hooks/useCreateBook';

const CreateBookModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    language: 'en',
    description: '',
    viewType: 'page'
  });
  const [errors, setErrors] = useState({});

  const { createBook, loading, error } = useCreateBook();
  const [creationStep, setCreationStep] = useState('');

  // Character limits based on view type
  const CHARACTER_LIMITS = {
    page: 2000,
    scroll: 15000
  };

  // View type options
  const viewTypeOptions = [
    { value: 'page', label: 'Page View', icon: Monitor, description: 'Fixed layout like a physical book (max 2,000 chars)' },
    { value: 'scroll', label: 'Scroll View', icon: Smartphone, description: 'Flexible digital scroll (max 15,000 chars)' }
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
    { value: 'children', label: 'Children' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
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
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        author: '',
        genre: '',
        language: 'en',
        description: '',
        viewType: 'page'
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Book title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }

    if (!formData.genre) {
      newErrors.genre = 'Please select a genre';
    }

    // Validate description character limit
    const descriptionLength = formData.description.length;
    const maxChars = CHARACTER_LIMITS[formData.viewType];
    
    if (descriptionLength > maxChars) {
      newErrors.description = `Description exceeds ${maxChars.toLocaleString()} character limit for ${formData.viewType === 'page' ? 'Page' : 'Scroll'} View`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setCreationStep('Creating book...');
      const result = await createBook(formData);
      if (result && result.bookId) {
        setCreationStep('Book created successfully!');
        setTimeout(() => {
          onSuccess(result);
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating book:', error);
      setCreationStep('');
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Book</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Book Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Book Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your book title"
              disabled={loading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Author Name */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Author Name *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.author ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
              disabled={loading}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Genre *
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.genre ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              {genreOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
            )}
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Monitor className="w-4 h-4 inline mr-1" />
              View Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {viewTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.viewType === option.value;
                const maxChars = CHARACTER_LIMITS[option.value];
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, viewType: option.value }));
                      if (errors.description) {
                        setErrors(prev => ({ ...prev, description: '' }));
                      }
                    }}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={loading}
                  >
                    <div className="flex items-center mb-1">
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="font-medium text-sm">{option.label}</span>
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
                <FileText className="w-4 h-4 inline mr-1" />
                Description (Optional)
              </label>
              <span className={`text-xs ${
                formData.description.length > CHARACTER_LIMITS[formData.viewType] 
                  ? 'text-red-600' 
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
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={`Brief description of your book... (max ${CHARACTER_LIMITS[formData.viewType].toLocaleString()} characters for ${formData.viewType === 'page' ? 'Page' : 'Scroll'} View)`}
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {creationStep === 'Book created successfully!' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Book initialized with 1 chapter and 1 page!
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
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
      </div>
    </div>
  );
};

export default CreateBookModal; 