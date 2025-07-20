import React from 'react';
import BasePageLayout from './BasePageLayout';

const PageContent = ({ chapter, page, pageId, showTitle = false }) => {
  if (!page) return null;

  return (
    <BasePageLayout>
      <div className="h-full flex flex-col">
        {/* Optional Page Header with Title */}
        {showTitle && (
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-2">
              {chapter.title} • {page.id}
            </div>
            {/* Page Title - Centered, Large, Bold */}
            <h1 className="text-3xl font-bold mb-4 text-center tracking-wide">
              {page.title}
            </h1>
            <div className="w-16 h-1 bg-gray-300 mx-auto"></div>
          </div>
        )}

        {/* Page Content - Text Only */}
        <div className="flex-1">
          <div 
            className="prose prose-lg max-w-none"
            style={{
              textIndent: '0', // No indent for first paragraph
            }}
          >
            {/* First paragraph - no indent */}
            <p className="text-lg leading-relaxed text-gray-700 mb-4" style={{ textIndent: '0' }}>
              {page.content}
            </p>
          </div>
        </div>
      </div>
    </BasePageLayout>
  );
};

export default PageContent; 