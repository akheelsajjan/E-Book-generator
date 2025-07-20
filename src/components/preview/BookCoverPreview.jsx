import React from 'react';

const BookCoverPreview = ({ bookData, template }) => {
  if (!bookData?.cover) {
    return (
      <div className="book-cover-preview">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Book Cover</h1>
          <p className="text-lg">No cover data available</p>
        </div>
      </div>
    );
  }

  const coverStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(135deg, ${bookData.cover.backgroundColor || '#667eea'} 0%, ${bookData.cover.backgroundColor || '#667eea'}dd 100%)`,
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
  };

  return (
    <div className="book-cover-preview" style={coverStyles}>
      <div className="cover-content">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {bookData.cover.title || bookData.title}
        </h1>
        
        {/* Subtitle */}
        {bookData.cover.subtitle && (
          <h2 className="text-xl md:text-2xl font-medium mb-6 opacity-90 italic">
            {bookData.cover.subtitle}
          </h2>
        )}
        
        {/* Divider */}
        <div className="border-t border-white border-opacity-30 pt-6 mb-6 w-32 mx-auto"></div>
        
        {/* Author */}
        <div className="author-section">
          <p className="text-lg mb-2">by</p>
          <p className="text-2xl md:text-3xl font-semibold">
            {bookData.cover.author || bookData.author?.name || 'Unknown Author'}
          </p>
        </div>
        
        {/* Optional: Publisher or additional info */}
        {bookData.cover.publisher && (
          <div className="mt-8 text-sm opacity-75">
            {bookData.cover.publisher}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCoverPreview; 