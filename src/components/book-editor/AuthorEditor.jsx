import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';

const AuthorEditor = ({ book, setBook, onAuthorDataChange }) => {
  const [authorData, setAuthorData] = useState({
    name: book.author?.name || '',
    title: book.author?.title || '',
    bio: book.author?.bio || '',
    photo: null,
    credentials: book.author?.credentials || [],
    achievements: book.author?.achievements || [],
    social: {
      website: book.author?.social?.website || '',
      twitter: book.author?.social?.twitter || '',
      linkedin: book.author?.social?.linkedin || '',
      email: book.author?.social?.email || ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAuthorFieldChange = (field, value) => {
    const updatedAuthor = {
      ...authorData,
      [field]: value
    };
    setAuthorData(updatedAuthor);
    
    // Notify parent component for live preview
    if (onAuthorDataChange) {
      onAuthorDataChange(updatedAuthor);
    }
  };

  const handleSocialFieldChange = (platform, value) => {
    const updatedAuthor = {
      ...authorData,
      social: {
        ...authorData.social,
        [platform]: value
      }
    };
    setAuthorData(updatedAuthor);
    
    // Notify parent component for live preview
    if (onAuthorDataChange) {
      onAuthorDataChange(updatedAuthor);
    }
  };

  const handleAddCredential = () => {
    setAuthorData(prev => ({
      ...prev,
      credentials: [...prev.credentials, '']
    }));
  };

  const handleEditCredential = (index, value) => {
    setAuthorData(prev => ({
      ...prev,
      credentials: prev.credentials.map((cred, i) => i === index ? value : cred)
    }));
  };

  const handleDeleteCredential = (index) => {
    setAuthorData(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }));
  };

  const handleAddAchievement = () => {
    setAuthorData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const handleEditAchievement = (index, value) => {
    setAuthorData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => i === index ? value : ach)
    }));
  };

  const handleDeleteAchievement = (index) => {
    setAuthorData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleAuthorReset = () => {
    setAuthorData({
      name: '',
      title: '',
      bio: '',
      photo: null,
      credentials: [],
      achievements: [],
      social: {
        website: '',
        twitter: '',
        linkedin: '',
        email: ''
      }
    });
  };

  const handleAuthorSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with author data locally
      setBook(prev => ({
        ...prev,
        author: authorData
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        author: authorData
      });
      
      console.log('Author information saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving author information:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
        <input
          type="text"
          value={authorData.name}
          onChange={(e) => handleAuthorFieldChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter author name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
        <input
          type="text"
          value={authorData.title}
          onChange={(e) => handleAuthorFieldChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Professor, CEO, Consultant"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio</label>
        <textarea
          value={authorData.bio}
          onChange={(e) => handleAuthorFieldChange('bio', e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a compelling author biography..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Photo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <p className="text-gray-500">Click to upload author photo</p>
        </div>
      </div>

      {/* Credentials */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Credentials</label>
          <button
            onClick={handleAddCredential}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Credential
          </button>
        </div>
        <div className="space-y-2">
          {authorData.credentials.map((credential, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={credential}
                onChange={(e) => handleEditCredential(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter credential"
              />
              <button
                onClick={() => handleDeleteCredential(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
        <div className="space-y-2">
          <input
            type="url"
            value={authorData.social.website}
            onChange={(e) => handleSocialFieldChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Website URL"
          />
          <input
            type="url"
            value={authorData.social.twitter}
            onChange={(e) => handleSocialFieldChange('twitter', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Twitter URL"
          />
          <input
            type="url"
            value={authorData.social.linkedin}
            onChange={(e) => handleSocialFieldChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="LinkedIn URL"
          />
          <input
            type="email"
            value={authorData.social.email}
            onChange={(e) => handleSocialFieldChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email address"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleAuthorReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleAuthorSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Author Info'}
        </button>
      </div>
    </div>
  );
};

export default AuthorEditor; 