import React from 'react';
import BasePageLayout from './BasePageLayout';

const PrefacePage = ({ bookData }) => {
  if (!bookData?.preface) return null;

  const { preface } = bookData;

  return (
    <BasePageLayout>
      <div className="h-full flex flex-col">
        {/* Preface Title - Centered, Large, Bold */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 tracking-wide">Preface</h1>
          <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
        </div>

        {/* Preface Content with Proper Typography */}
        <div className="flex-1">
          <div 
            className="prose prose-lg max-w-none"
            style={{
              textIndent: '0', // No indent for first paragraph
            }}
          >
            {/* First paragraph - no indent */}
            <p className="text-lg leading-relaxed text-gray-700 mb-4" style={{ textIndent: '0' }}>
              {preface.content}
            </p>
          </div>
        </div>

        {/* Author Signature and Date */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold text-gray-900">{preface.author}</p>
              {preface.location && (
                <p className="text-sm text-gray-600">{preface.location}</p>
              )}
            </div>
            
            {preface.date && (
              <div className="text-sm text-gray-500">
                {preface.date}
              </div>
            )}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="text-center mt-12">
          <div className="inline-block w-16 h-1 bg-gray-300"></div>
        </div>
      </div>
    </BasePageLayout>
  );
};

export default PrefacePage; 