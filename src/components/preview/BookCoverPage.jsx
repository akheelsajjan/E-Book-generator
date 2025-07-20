import React from 'react';
import BasePageLayout from './BasePageLayout';

const BookCoverPage = ({ bookData }) => {
  if (!bookData?.cover) return null;

  const { cover } = bookData;

  return (
    <BasePageLayout className="flex items-center justify-center p-0 overflow-hidden">
      <div 
        className="w-full h-full flex flex-col items-center justify-center relative"
        style={{ 
          background: `linear-gradient(135deg, ${cover.backgroundColor || '#667eea'} 0%, #764ba2 100%)`
        }}
      >
        {/* Book Cover Content */}
        <div className="text-center text-white space-y-8 p-12">
          {/* Main Title */}
          <h1 className="text-6xl font-bold tracking-wide mb-4">
            {cover.title || 'Untitled Book'}
          </h1>
          
          {/* Subtitle */}
          {cover.subtitle && (
            <h2 className="text-2xl font-light tracking-wide mb-8">
              {cover.subtitle}
            </h2>
          )}
          
          {/* Author */}
          <div className="text-xl font-medium">
            by {cover.author || 'Unknown Author'}
          </div>
          
          {/* Decorative Elements */}
          <div className="mt-12">
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
            <div className="text-sm opacity-75">
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-16 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 border border-white rounded-full"></div>
        </div>
      </div>
    </BasePageLayout>
  );
};

export default BookCoverPage; 