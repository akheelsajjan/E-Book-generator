import React, { useState } from 'react';
import { updateBook } from '../../services/booksService';

const AppendixEditor = ({ book, setBook, onAppendixDataChange }) => {
  const [appendixData, setAppendixData] = useState({
    title: book.appendix?.title || 'Appendix',
    sections: book.appendix?.sections || []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAppendixFieldChange = (field, value) => {
    const updatedAppendix = {
      ...appendixData,
      [field]: value
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleAddAppendixSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: '',
      type: 'text'
    };
    const updatedAppendix = {
      ...appendixData,
      sections: [...appendixData.sections, newSection]
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleEditAppendixSection = (sectionId, field, value) => {
    const updatedAppendix = {
      ...appendixData,
      sections: appendixData.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleDeleteAppendixSection = (sectionId) => {
    const updatedAppendix = {
      ...appendixData,
      sections: appendixData.sections.filter(section => section.id !== sectionId)
    };
    setAppendixData(updatedAppendix);
    
    // Notify parent component for live preview
    if (onAppendixDataChange) {
      onAppendixDataChange(updatedAppendix);
    }
  };

  const handleAppendixReset = () => {
    setAppendixData({
      title: 'Appendix',
      sections: []
    });
  };

  const handleAppendixSave = async () => {
    try {
      setIsSaving(true);
      
      // Update book with appendix data locally
      setBook(prev => ({
        ...prev,
        appendix: appendixData
      }));
      
      // Save to Firestore
      await updateBook(book.id, {
        appendix: appendixData
      });
      
      console.log('Appendix saved successfully to Firestore');
    } catch (error) {
      console.error('Error saving appendix:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Appendix Title</label>
        <input
          type="text"
          value={appendixData.title}
          onChange={(e) => handleAppendixFieldChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter appendix title"
        />
      </div>

      {/* Appendix Sections */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Appendix Sections</label>
          <button
            onClick={handleAddAppendixSection}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Section
          </button>
        </div>
        <div className="space-y-4">
          {appendixData.sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleEditAppendixSection(section.id, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  placeholder="Section title"
                />
                <select
                  value={section.type}
                  onChange={(e) => handleEditAppendixSection(section.id, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                >
                  <option value="text">Text</option>
                  <option value="table">Table</option>
                  <option value="list">List</option>
                  <option value="chart">Chart</option>
                </select>
                <button
                  onClick={() => handleDeleteAppendixSection(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <textarea
                value={section.content}
                onChange={(e) => handleEditAppendixSection(section.id, 'content', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Section content..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleAppendixReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleAppendixSave}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Appendix'}
        </button>
      </div>
    </div>
  );
};

export default AppendixEditor; 