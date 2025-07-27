import React from 'react';

const ChapterPage = ({ chapter, pageNumber }) => {
  if (!chapter) return null;

  return (
    <div 
      className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
    >
      {/* Page Content */}
      <div 
        className="h-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
          padding: '40px',
          maxWidth: '100%'
        }}
      >
        <div className="text-center">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-6 tracking-wide"
            style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1.5rem',
              marginTop: '0',
              lineHeight: '1.2'
            }}
          >
            {chapter.title || 'Chapter'}
          </h1>
          
          <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
        </div>
      </div>
      
      {/* Page Number - Bottom Center */}
      {pageNumber && (
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-mono"
          style={{ fontSize: '14px' }}
        >
          Page {pageNumber}
        </div>
      )}
    </div>
  );
};

export default ChapterPage; 