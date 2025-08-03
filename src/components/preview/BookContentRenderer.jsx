import React from 'react';

const BookContentRenderer = ({ content, showTitle = false, title = '' }) => {
  const renderTitle = () => {
    if (!showTitle || !title) return null;

    return (
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <div className="w-full h-1 bg-gray-300"></div>
      </div>
    );
  };

  const renderContent = () => {
    if (!content) {
      return (
        <p className="text-gray-500 italic" style={{ textIndent: '2em' }}>
          No content to display
        </p>
      );
    }

    return (
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
        <div 
          dangerouslySetInnerHTML={{ 
            __html: content
              .replace(/\n\n/g, `</p><p style="margin-top: 1.5em; text-indent: ${showTitle && title ? '2em' : '0'}; max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">`)
              .replace(/\n/g, ' ')
              .replace(/^/, `<p style="text-indent: ${showTitle && title ? '2em' : '0'}; max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">`)
              .replace(/$/, '</p>')
          }} 
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {renderTitle()}
      <div className="flex-1" style={{ 
        marginTop: showTitle && title ? '0.5em' : '0', 
        marginBottom: showTitle && title ? '0.5em' : '1em',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default BookContentRenderer; 