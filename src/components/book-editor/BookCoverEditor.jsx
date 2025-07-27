import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';

const BookCoverEditor = ({ book, setBook, onCoverDataChange }) => {
  const [activeCoverTab, setActiveCoverTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  
  // Book Cover State
  const [bookCover, setBookCover] = useState({
    title: book.title || '',
    subtitle: '',
    author: 'Your Name',
    coverImage: null,
    fontFamily: 'serif',
    textColor: '#ffffff',
    backgroundColor: '#667eea',
    backgroundGradient: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    template: 'default',
    titleSize: 48,
    subtitleSize: 24,
    authorSize: 18,
    titlePosition: { x: 50, y: 30 },
    subtitlePosition: { x: 50, y: 50 },
    authorPosition: { x: 50, y: 80 },
    isDragging: false,
    draggedElement: null
  });

  const handleCoverFieldChange = (field, value) => {
    const updatedCover = {
      ...bookCover,
      [field]: value
    };
    setBookCover(updatedCover);
    
    // Notify parent component for live preview
    if (onCoverDataChange) {
      onCoverDataChange(updatedCover);
    }
  };

  const handleCoverReset = () => {
    setBookCover({
      title: book.title || '',
      subtitle: '',
      author: 'Your Name',
      coverImage: null,
      fontFamily: 'serif',
      textColor: '#ffffff',
      backgroundColor: '#667eea',
      backgroundGradient: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      template: 'default',
      titleSize: 48,
      subtitleSize: 24,
      authorSize: 18,
      titlePosition: { x: 50, y: 30 },
      subtitlePosition: { x: 50, y: 50 },
      authorPosition: { x: 50, y: 80 },
      isDragging: false,
      draggedElement: null
    });
  };

  const handleCoverSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with cover data locally
      setBook(prev => ({
        ...prev,
        cover: bookCover
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        cover: bookCover
      });
      
      console.log('Cover saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving cover:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex space-x-6 border-b border-gray-200">
        {[
          { id: 'basic', label: 'Basic Info', icon: 'T' },
          { id: 'design', label: 'Design', icon: '🎨' },
          { id: 'cover', label: 'Cover', icon: '🖼️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCoverTab(tab.id)}
            className={`flex items-center space-x-2 px-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeCoverTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeCoverTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
            <input
              type="text"
              value={bookCover.title}
              onChange={(e) => handleCoverFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter book title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={bookCover.subtitle}
              onChange={(e) => handleCoverFieldChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subtitle (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
            <input
              type="text"
              value={bookCover.author}
              onChange={(e) => handleCoverFieldChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name"
            />
          </div>
        </div>
      )}

      {/* Design Tab */}
      {activeCoverTab === 'design' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={bookCover.fontFamily}
              onChange={(e) => handleCoverFieldChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={bookCover.textColor}
              onChange={(e) => handleCoverFieldChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={bookCover.backgroundColor}
              onChange={(e) => handleCoverFieldChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      {/* Cover Tab */}
      {activeCoverTab === 'cover' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-gray-500">Click to upload cover image</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              value={bookCover.template}
              onChange={(e) => handleCoverFieldChange('template', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleCoverReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleCoverSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Cover'}
        </button>
      </div>
    </div>
  );
};

export default BookCoverEditor; 