import React from 'react';

const TOCPreview = ({ bookData, template, onPageClick }) => {
  const generatePageNumbers = () => {
    let currentPage = 1; // Start after cover
    
    const sections = [];
    
    // Book Cover
    sections.push({ title: 'Book Cover', page: 1, type: 'cover' });
    currentPage++;
    
    // Table of Contents (always included)
    sections.push({ title: 'Table of Contents', page: currentPage, type: 'toc' });
    currentPage++;
    
    // Dedication
    if (bookData.dedication) {
      sections.push({ title: 'Dedication', page: currentPage, type: 'dedication' });
      currentPage++;
    }
    
    // Acknowledgments
    if (bookData.acknowledgments) {
      sections.push({ title: 'Acknowledgments', page: currentPage, type: 'acknowledgments' });
      currentPage++;
    }
    
    // Foreword
    if (bookData.foreword) {
      sections.push({ title: 'Foreword', page: currentPage, type: 'foreword' });
      currentPage++;
    }
    
    // About Author
    if (bookData.author) {
      sections.push({ title: 'About the Author', page: currentPage, type: 'author' });
      currentPage++;
    }
    
    // Preface
    if (bookData.preface) {
      sections.push({ title: 'Preface', page: currentPage, type: 'preface' });
      currentPage++;
    }
    
    // Introduction
    if (bookData.introduction) {
      sections.push({ title: 'Introduction', page: currentPage, type: 'introduction' });
      currentPage++;
    }
    
    // Chapters
    if (bookData.chapters) {
      bookData.chapters.forEach((chapter, index) => {
        sections.push({ 
          title: chapter.title, 
          page: currentPage, 
          type: 'chapter',
          status: chapter.status,
          pages: chapter.pages || [],
          chapterId: chapter.id
        });
        currentPage++;
      });
    }
    
    // Epilogue
    if (bookData.epilogue) {
      sections.push({ title: 'Epilogue', page: currentPage, type: 'epilogue' });
      currentPage++;
    }
    
    // Appendix
    if (bookData.appendix) {
      sections.push({ title: 'Appendix', page: currentPage, type: 'appendix' });
      currentPage++;
    }
    
    // Glossary
    if (bookData.glossary) {
      sections.push({ title: 'Glossary', page: currentPage, type: 'glossary' });
      currentPage++;
    }
    
    // Bibliography
    if (bookData.bibliography) {
      sections.push({ title: 'Bibliography', page: currentPage, type: 'bibliography' });
      currentPage++;
    }
    
    // Index
    if (bookData.index) {
      sections.push({ title: 'Index', page: currentPage, type: 'index' });
      currentPage++;
    }
    
    return sections;
  };

  const sections = generatePageNumbers();

  // Separate book builder sections from chapters
  const bookBuilderSections = sections.filter(section => 
    ['cover', 'toc', 'dedication', 'acknowledgments', 'foreword', 'author', 'preface', 'introduction', 'epilogue', 'appendix', 'glossary', 'bibliography', 'index'].includes(section.type)
  );
  
  const chapterSections = sections.filter(section => 
    section.type === 'chapter'
  );

  const handleSectionClick = (section) => {
    if (onPageClick) {
      onPageClick({
        section: section.type,
        chapterId: section.chapterId,
        pageId: null
      });
    }
  };

  const handlePageClick = (chapterId, pageId) => {
    if (onPageClick) {
      onPageClick({
        section: 'chapter',
        chapterId: chapterId,
        pageId: pageId
      });
    }
  };

  return (
    <div className="toc-preview">
      {/* Book Sections Dropdown */}
      <div className="mb-6">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Book Sections</span>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
            {bookBuilderSections.map((section, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSectionClick(section)}
              >
                <div className="flex items-center space-x-2">
                  {/* Section Icon */}
                  <div className="w-4 h-4">
                    {section.type === 'cover' && (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {section.type === 'toc' && (
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    {section.type === 'dedication' && (
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    {section.type === 'acknowledgments' && (
                      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    )}
                    {section.type === 'foreword' && (
                      <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                    {section.type === 'author' && (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {section.type === 'preface' && (
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {section.type === 'introduction' && (
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {section.type === 'epilogue' && (
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {section.type === 'appendix' && (
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {section.type === 'glossary' && (
                      <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )}
                    {section.type === 'bibliography' && (
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {section.type === 'index' && (
                      <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{section.title}</span>
                </div>
                <span className="text-sm text-gray-500 font-mono">{section.page}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Chapters and Pages Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Chapters and Pages</h3>
        
        {chapterSections.length > 0 ? (
          <div className="space-y-2">
            {chapterSections.map((section, index) => (
              <div key={index} className="space-y-1">
                {/* Chapter */}
                <div 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-center space-x-2">
                    {/* Chapter Icon */}
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    
                    <span className="text-sm font-medium text-gray-900">{section.title}</span>
                    
                    {/* Status Badge */}
                    {section.status && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        section.status === 'completed' ? 'bg-green-100 text-green-800' :
                        section.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {section.status}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 font-mono">{section.page}</span>
                </div>
                
                {/* Pages under chapter */}
                {section.pages && section.pages.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {section.pages.map((page, pageIndex) => (
                      <div 
                        key={pageIndex} 
                        className="flex items-center justify-between p-1 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePageClick(section.chapterId, page.id)}
                      >
                        <div className="flex items-center space-x-2">
                          {/* Page Icon */}
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-xs text-gray-600">{page.title}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{page.id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No chapters available</p>
        )}
      </div>
    </div>
  );
};

export default TOCPreview; 