import React from 'react';
import BasePageLayout from './BasePageLayout';

const ChapterPage = ({ chapter }) => {
  if (!chapter) return null;

  return (
    <BasePageLayout>
      <div className="h-full flex flex-col">
        {/* Chapter Title - Centered, Large, Bold */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 tracking-wide">
            {chapter.title}
          </h1>
          <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
        </div>

        {/* Chapter Content with Proper Typography */}
        <div className="flex-1">
          <div 
            className="prose prose-lg max-w-none"
            style={{
              textIndent: '0', // No indent for first paragraph
            }}
          >
            {/* First paragraph - no indent */}
            <p className="text-lg leading-relaxed text-gray-700 mb-4" style={{ textIndent: '0' }}>
              {chapter.content}
            </p>
          </div>
        </div>

        {/* Chapter Pages List */}
        {chapter.pages && chapter.pages.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Chapter Contents</h3>
            <div className="space-y-3">
              {chapter.pages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-gray-500 w-8">
                      {page.id}
                    </span>
                    <span className="text-gray-700 font-medium">
                      {page.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Page {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BasePageLayout>
  );
};

export default ChapterPage; 