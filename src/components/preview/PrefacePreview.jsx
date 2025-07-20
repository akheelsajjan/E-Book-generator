import React from 'react';

const PrefacePreview = ({ preface, template }) => {
  if (!preface) {
    return (
      <div className="preface-preview">
        <h1 className="text-xl font-bold text-center mb-6">Preface</h1>
        <p className="text-center">No preface content available.</p>
      </div>
    );
  }

  return (
    <div className="preface-preview">
      {/* Title */}
      <h1 className="text-xl font-bold text-center mb-8">Preface</h1>
      
      <div className="preface-content">
        {/* Preface Content */}
        {preface.content && (
          <div className="mb-6">
            <p className="text-justify leading-relaxed">
              {preface.content}
            </p>
          </div>
        )}
        
        {/* Author Signature */}
        {preface.author && (
          <div className="mt-8 text-right">
            <p className="text-lg font-semibold">{preface.author}</p>
            {preface.date && (
              <p className="text-sm text-gray-600">{preface.date}</p>
            )}
          </div>
        )}
        
        {/* Location (if available) */}
        {preface.location && (
          <div className="mt-4 text-right text-sm text-gray-600">
            <p>{preface.location}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrefacePreview; 