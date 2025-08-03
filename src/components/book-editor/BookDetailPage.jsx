import React from 'react';
import { Play, Bookmark, Star } from 'lucide-react';

const BookDetailPage = ({ 
  book = null,
  aboutData = null
}) => {
  const title = book?.title || 'Beneath the Silent Gears';
  const author = book?.author?.name || 'Akheel Sajjan';
  const rating = 4.2;
  const reviews = 1247;
  const publishedYear = aboutData?.publishedYear || 2022;
  const tags = aboutData?.tags ? aboutData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : ['Poetic'];
  const shortDescription = aboutData?.shortDescription || 'In a steampunk world where time itself can be manipulated, a master clockmaker uncovers a hidden truth.';
  const fullDescription = aboutData?.fullDescription || 'In the fog-shrouded city of New Chronos, mechanical wonders and hidden knowledge intertwine with ancient gears that reshape the world. This poetic journey explores strength, vulnerability, and the courage to speak truth, blending the mechanical and the mystical.';
  const authorQuote = "My name is Akheel Sajjan and I am the strongest person in this world and I am afraid of many things so how can I tell about anything";

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
      const coverTitle = coverData.title || book?.title || 'Untitled Book';
      const coverSubtitle = coverData.subtitle || '';
      const coverAuthor = coverData.author || book?.author?.name || 'Unknown Author';
      const backgroundColor = coverData.backgroundColor || '#667eea';
      const textColor = coverData.textColor || '#ffffff';
      const fontFamily = coverData.fontFamily || 'serif';
      const backgroundGradient = coverData.backgroundGradient || `linear-gradient(135deg, ${backgroundColor} 0%, #764ba2 100%)`;

      return (
        <div 
          className="w-48 h-64 rounded-lg shadow-2xl overflow-hidden relative"
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
          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
            {/* Main Title */}
            {coverTitle && (
              <h1 
                className="font-bold mb-2 leading-tight"
                style={{
                  fontSize: '1.2rem',
                  color: textColor,
                  fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  maxWidth: '90%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: '1.2'
                }}
              >
                {coverTitle}
              </h1>
            )}
            
            {/* Subtitle */}
            {coverSubtitle && (
              <h2 
                className="font-medium mb-3 opacity-90 italic"
                style={{
                  fontSize: '0.8rem',
                  color: textColor,
                  fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: '1.3'
                }}
              >
                {coverSubtitle}
              </h2>
            )}
            
            {/* Divider */}
            {(coverTitle || coverSubtitle) && coverAuthor && (
              <div 
                className="border-t mb-3 w-12 mx-auto"
                style={{ borderColor: `${textColor}40` }}
              ></div>
            )}
            
            {/* Author */}
            {coverAuthor && (
              <div className="author-section">
                <p 
                  className="font-medium"
                  style={{
                    fontSize: '0.7rem',
                    color: textColor,
                    fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'sans' ? 'Arial, sans-serif' : 'Georgia, serif',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    opacity: 0.9
                  }}
                >
                  {coverAuthor}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Default stacked books fallback
      return (
        <div className="w-48 h-64 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center relative">
          <div className="flex items-center justify-center space-x-1">
            {/* Stacked Books */}
            <div className="w-8 h-10 bg-green-400 rounded shadow-md transform rotate-12"></div>
            <div className="w-8 h-10 bg-red-400 rounded shadow-md transform rotate-6"></div>
            <div className="w-8 h-10 bg-blue-400 rounded shadow-md"></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-white rounded-full"></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="flex items-start space-x-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              {renderBookCover()}
            </div>
            
            {/* Book Information */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              <p className="text-xl opacity-90 mb-4">by {author}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{rating} ({reviews.toLocaleString()} reviews)</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors">
                  <Play className="w-5 h-5" />
                  <span className="font-medium">Start Reading</span>
                </button>
                <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span className="font-medium">Add to Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Book</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{fullDescription}</p>
              </div>
            </div>
            
            {/* Author Quote */}
            <div className="bg-gray-100 border-l-4 border-blue-400 pl-4 py-4 rounded-r-lg">
              <p className="italic text-gray-700">"{authorQuote}"</p>
            </div>
          </div>
          
          {/* Right Column - Side Panels */}
          <div className="space-y-6">
            {/* Book Details Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium">{publishedYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Genre:</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {tags[0] || 'Poetic'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages:</span>
                  <span className="font-medium">284</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ISBN:</span>
                  <span className="font-medium text-sm">978-0-123-45678-9</span>
                </div>
              </div>
            </div>
            
            {/* Reading Progress Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Progress</h3>
              <div className="space-y-3">
                <p className="text-gray-600">Chapter 3 of 12</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-sm text-gray-600">25% Complete</p>
              </div>
            </div>
            
            {/* Similar Books Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Books</h3>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">The Clockwork Heart</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">Whispers in Steel</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">Mechanical Dreams</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage; 