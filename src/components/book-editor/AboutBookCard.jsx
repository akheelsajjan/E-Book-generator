import React from 'react';

const AboutBookCard = ({ 
  title = "Book Title", 
  subtitle = "", 
  description = "", 
  tags = [], 
  publishedDate = "", 
  image = null,
  book = null
}) => {
  // Check if book has cover data
  const hasBookCover = book?.cover && (
    book.cover.title || 
    book.cover.subtitle || 
    book.cover.author || 
    book.cover.backgroundColor || 
    book.cover.backgroundGradient
  );

  const renderBookCover = () => {
    if (hasBookCover) {
      const coverData = book.cover;
      const title = coverData.title || book?.title || 'Untitled Book';
      const subtitle = coverData.subtitle || '';
      const author = coverData.author || book?.author?.name || 'Unknown Author';
      const backgroundColor = coverData.backgroundColor || '#667eea';
      const textColor = coverData.textColor || '#ffffff';
      const fontFamily = coverData.fontFamily || 'serif';
      const backgroundGradient = coverData.backgroundGradient || `linear-gradient(135deg, ${backgroundColor} 0%, #764ba2 100%)`;

      return (
        <div 
          className="w-full h-72 rounded-lg shadow-2xl overflow-hidden relative"
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
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            {/* Main Title */}
            {title && (
              <h1 
                className="font-bold mb-4 leading-tight"
                style={{
                  fontSize: '1.8rem',
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
                className="font-medium mb-6 opacity-90 italic"
                style={{
                  fontSize: '1rem',
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
                className="border-t mb-6 w-16 mx-auto"
                style={{ borderColor: `${textColor}40` }}
              ></div>
            )}
            
            {/* Author */}
            {author && (
              <div className="author-section">
                <p 
                  className="font-medium"
                  style={{
                    fontSize: '0.9rem',
                    color: textColor,
                    fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    opacity: 0.9
                  }}
                >
                  {author}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Default stacked books fallback
      return (
        <div className="w-full h-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative">
          <div className="flex items-center justify-center space-x-2">
            {/* Stacked Books */}
            <div className="w-12 h-16 bg-green-400 rounded shadow-md transform rotate-12"></div>
            <div className="w-12 h-16 bg-red-400 rounded shadow-md transform rotate-6"></div>
            <div className="w-12 h-16 bg-blue-400 rounded shadow-md"></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/60 backdrop-blur-md border border-black/5 shadow-xl rounded-2xl p-6 lg:p-8">
        {/* Header Layout - Title and Date at Top */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-gray-900">
            {title}
          </h2>
          {publishedDate && (
            <span className="text-sm text-gray-500">
              Published on {publishedDate}
            </span>
          )}
        </div>

        {/* Subtitle with Blue Bar */}
        {subtitle && (
          <div className="border-l-4 border-blue-400 pl-3 mb-6">
            <p className="italic text-sm md:text-base text-gray-600">
              {subtitle}
            </p>
          </div>
        )}

        {/* Book Cover - Uses actual cover or fallback */}
        <div className="mb-6">
          {renderBookCover()}
        </div>

        {/* Clean Genre Tags - No Label */}
        {tags.length > 0 && (
          <div className="flex flex-wrap">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutBookCard; 