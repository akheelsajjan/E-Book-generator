import React from 'react';

const PrefacePreview = ({ book, activeTab = 'preface', currentPrefaceData = null }) => {
  // Only show preview for preface tab
  if (activeTab !== 'preface') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <p>Preview will appear here</p>
          <p className="text-sm mt-2">Select a tab to see the preview</p>
        </div>
      </div>
    );
  }

  // Use current preface data if provided (for live preview), otherwise use book.preface
  const prefaceData = currentPrefaceData || book?.preface || {};
  const content = prefaceData.content || '';
  const acknowledgments = prefaceData.acknowledgments || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
      {/* Preface Page Container - Using same dimensions as PagePreview */}
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
        {/* Page Content */}
        <div className="h-full p-12 flex flex-col" style={{
          background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
          padding: '40px',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Preface
            </h1>
          </div>

          {/* Preface Content */}
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
              {/* Preface Content */}
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
                <p className="text-gray-500 italic">
                  Preface content will appear here...
                </p>
              )}

              {/* Acknowledgments */}
              {acknowledgments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Acknowledgments
                  </h3>
                  <div className="space-y-3">
                    {acknowledgments.map((acknowledgment, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {acknowledgment}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefacePreview; 