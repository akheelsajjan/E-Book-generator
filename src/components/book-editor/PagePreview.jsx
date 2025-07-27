import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

const PagePreview = ({ 
  pageTitle, 
  content, 
  onExitPreview, 
  viewType = 'page' 
}) => {
  // Handle ESC key to exit preview
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onExitPreview();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onExitPreview]);

  // Only show preview for page view type
  if (viewType !== 'page') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      {/* Header with exit button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onExitPreview}
          className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </button>
      </div>

      {/* Close button in top right */}
      <button
        onClick={onExitPreview}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Page Container */}
      <div 
        className="w-[600px] h-[800px] bg-white rounded-lg shadow-2xl border border-gray-200"
        style={{
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          overflow: 'hidden',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {/* Page Content */}
        <div className="h-full p-12 flex flex-col" style={{
          background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
          padding: '40px',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Page Title */}
          {pageTitle && pageTitle.trim() && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {pageTitle}
              </h1>
            </div>
          )}

          {/* Page Content - No scroll, content flows naturally */}
          <div className="flex-1" style={{ 
            marginTop: '1em', 
            marginBottom: '1em',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <div 
              className="text-gray-800 leading-relaxed"
              style={{ 
                fontSize: '16px',
                lineHeight: '1.6',
                fontFamily: 'Georgia, serif',
                textAlign: 'justify',
                wordSpacing: '0.05em',
                letterSpacing: '0.01em',
                maxWidth: '100%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {content ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: content
                      .replace(/\n\n/g, '</p><p style="margin-top: 1.5em; text-indent: 2em; max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">')
                      .replace(/\n/g, ' ')
                      .replace(/^/, '<p style="text-indent: 2em; max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">')
                      .replace(/$/, '</p>')
                  }} 
                />
              ) : (
                <p className="text-gray-500 italic" style={{ textIndent: '2em' }}>
                  No content to preview
                </p>
              )}
            </div>
          </div>

          {/* Page Number */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Page 1
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
        Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd> to exit preview
      </div>
    </div>
  );
};

export default PagePreview; 