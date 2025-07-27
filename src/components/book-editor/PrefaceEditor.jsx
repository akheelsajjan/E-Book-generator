import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';

const PrefaceEditor = ({ book, setBook, onPrefaceDataChange }) => {
  const [prefaceData, setPrefaceData] = useState({
    content: book.preface?.content || '',
    acknowledgments: book.preface?.acknowledgments || []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handlePrefaceFieldChange = (field, value) => {
    const updatedPreface = {
      ...prefaceData,
      [field]: value
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handleAddAcknowledgments = () => {
    const updatedPreface = {
      ...prefaceData,
      acknowledgments: [...prefaceData.acknowledgments, '']
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handleEditAcknowledgments = (index, value) => {
    const updatedPreface = {
      ...prefaceData,
      acknowledgments: prefaceData.acknowledgments.map((ack, i) => i === index ? value : ack)
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handleDeleteAcknowledgments = (index) => {
    const updatedPreface = {
      ...prefaceData,
      acknowledgments: prefaceData.acknowledgments.filter((_, i) => i !== index)
    };
    setPrefaceData(updatedPreface);
    
    // Notify parent component for live preview
    if (onPrefaceDataChange) {
      onPrefaceDataChange(updatedPreface);
    }
  };

  const handlePrefaceReset = () => {
    setPrefaceData({
      content: '',
      acknowledgments: []
    });
  };

  const handlePrefaceSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with preface data locally
      setBook(prev => ({
        ...prev,
        preface: prefaceData
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        preface: prefaceData
      });
      
      console.log('Preface saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving preface:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preface Content</label>
        <textarea
          value={prefaceData.content}
          onChange={(e) => handlePrefaceFieldChange('content', e.target.value)}
          rows="12"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your preface here..."
        />
      </div>

      {/* Acknowledgments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Acknowledgments</label>
          <button
            onClick={handleAddAcknowledgments}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Acknowledgment
          </button>
        </div>
        <div className="space-y-2">
          {prefaceData.acknowledgments.map((acknowledgment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <textarea
                value={acknowledgment}
                onChange={(e) => handleEditAcknowledgments(index, e.target.value)}
                rows="2"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter acknowledgment"
              />
              <button
                onClick={() => handleDeleteAcknowledgments(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handlePrefaceReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handlePrefaceSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Preface'}
        </button>
      </div>
    </div>
  );
};

export default PrefaceEditor; 