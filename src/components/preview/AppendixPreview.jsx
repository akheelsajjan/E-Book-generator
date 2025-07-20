import React from 'react';

const AppendixPreview = ({ appendix, template }) => {
  if (!appendix) {
    return (
      <div className="appendix-preview">
        <h1 className="text-xl font-bold text-center mb-6">Appendix</h1>
        <p className="text-center">No appendix content available.</p>
      </div>
    );
  }

  return (
    <div className="appendix-preview">
      {/* Title */}
      <h1 className="text-xl font-bold text-center mb-8">
        {appendix.title || 'Appendix'}
      </h1>
      
      <div className="appendix-content">
        {/* Glossary */}
        {appendix.glossary && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Glossary</h2>
            <div className="space-y-3">
              {appendix.glossary.map((term, index) => (
                <div key={index} className="border-b border-gray-200 pb-2">
                  <dt className="font-semibold text-gray-900">{term.term}</dt>
                  <dd className="text-gray-700 mt-1">{term.definition}</dd>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* References */}
        {appendix.references && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">References</h2>
            <ol className="list-decimal list-inside space-y-2">
              {appendix.references.map((reference, index) => (
                <li key={index} className="text-gray-700">
                  {reference}
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {/* Additional Sections */}
        {appendix.sections && appendix.sections.length > 0 && (
          <div className="space-y-6">
            {appendix.sections.map((section, index) => (
              <div key={index} className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
                <div className="text-justify">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Index */}
        {appendix.index && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Index</h2>
            <div className="columns-2 gap-4 text-sm">
              {appendix.index.map((entry, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <span className="text-gray-900">{entry.term}</span>
                  <span className="text-gray-600">{entry.page}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppendixPreview; 