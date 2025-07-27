import React from 'react';

const BookCoverPreview = ({ book, activeTab = 'cover', currentCoverData = null }) => {
  // Only show preview for cover tab
  if (activeTab !== 'cover') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📖</div>
          <p>Preview will appear here</p>
          <p className="text-sm mt-2">Select a tab to see the preview</p>
        </div>
      </div>
    );
  }

  // Use current cover data if provided (for live preview), otherwise use book.cover
  const coverData = currentCoverData || book?.cover || {};
  const title = coverData.title || book?.title || 'Untitled Book';
  const subtitle = coverData.subtitle || '';
  const author = coverData.author || book?.author?.name || 'Unknown Author';
  const backgroundColor = coverData.backgroundColor || '#667eea';
  const textColor = coverData.textColor || '#ffffff';
  const fontFamily = coverData.fontFamily || 'serif';
  const backgroundGradient = coverData.backgroundGradient || `linear-gradient(135deg, ${backgroundColor} 0%, #764ba2 100%)`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
      {/* Book Cover Container - Using same dimensions as PagePreview */}
      <div 
        className="w-[600px] h-[800px] rounded-lg shadow-2xl overflow-hidden relative"
        style={{
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          overflow: 'hidden',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {/* Cover Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: backgroundGradient,
            opacity: 0.9
          }}
        ></div>
        
        {/* Cover Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          {/* Main Title */}
          {title && (
            <h1 
              className="font-bold mb-6 leading-tight"
              style={{
                fontSize: '2.5rem',
                color: textColor,
                fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                maxWidth: '90%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.2'
              }}
            >
              {title}
            </h1>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <h2 
              className="font-medium mb-8 opacity-90 italic"
              style={{
                fontSize: '1.25rem',
                color: textColor,
                fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                maxWidth: '80%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.3'
              }}
            >
              {subtitle}
            </h2>
          )}
          
          {/* Divider */}
          {(title || subtitle) && author && (
            <div 
              className="border-t mb-8 w-24 mx-auto"
              style={{ borderColor: `${textColor}40` }}
            ></div>
          )}
          
          {/* Author */}
          {author && (
            <div className="author-section">
              <p 
                className="text-sm mb-3 opacity-80"
                style={{ color: textColor }}
              >
                by
              </p>
              <p 
                className="font-semibold"
                style={{
                  fontSize: '1.125rem',
                  color: textColor,
                  fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  maxWidth: '90%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: '1.2'
                }}
              >
                {author}
              </p>
            </div>
          )}
          
          {/* Decorative Elements */}
          <div className="mt-12">
            <div 
              className="w-16 h-0.5 mx-auto mb-3"
              style={{ backgroundColor: textColor, opacity: 0.6 }}
            ></div>
            <div 
              className="text-xs opacity-60"
              style={{ color: textColor }}
            >
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
        
        {/* Background Pattern (subtle) */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute top-8 left-8 w-16 h-16 border-2 rounded-full"
            style={{ borderColor: textColor }}
          ></div>
          <div 
            className="absolute bottom-12 right-10 w-12 h-12 border rounded-full"
            style={{ borderColor: textColor }}
          ></div>
          <div 
            className="absolute top-1/3 right-6 w-8 h-8 border rounded-full"
            style={{ borderColor: textColor }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BookCoverPreview; 