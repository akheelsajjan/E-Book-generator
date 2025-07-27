import React from 'react';

const AppendixPreview = ({ book, activeTab = 'appendix', currentAppendixData = null }) => {
  // Only show preview for appendix tab
  if (activeTab !== 'appendix') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📚</div>
          <p>Preview will appear here</p>
          <p className="text-sm mt-2">Select a tab to see the preview</p>
        </div>
      </div>
    );
  }

  // Use current appendix data if provided (for live preview), otherwise use book.appendix
  const appendixData = currentAppendixData || book?.appendix || {};
  const title = appendixData.title || 'Appendix';
  const sections = appendixData.sections || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
      {/* Appendix Page Container - Using same dimensions as PagePreview */}
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
              {title}
            </h1>
          </div>

          {/* Appendix Content */}
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
              {/* Appendix Sections */}
              {sections.length > 0 ? (
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <div key={section.id || index} className="mb-6">
                      {/* Section Title */}
                      {section.title && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {section.title}
                        </h3>
                      )}
                      
                      {/* Section Content */}
                      {section.content && (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: section.content
                              .replace(/\n\n/g, '</p><p style="margin-top: 1.5em; text-indent: 2em; max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">')
                              .replace(/\n/g, ' ')
                              .replace(/^/, '<p style="text-indent: 2em; max-width: 100%; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">')
                              .replace(/$/, '</p>')
                          }}
                        />
                      )}
                      
                      {/* Section Divider */}
                      {index < sections.length - 1 && (
                        <div className="border-t border-gray-200 mt-6 pt-6"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Appendix content will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppendixPreview; 