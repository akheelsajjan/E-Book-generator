import React from 'react';
import BasePageLayout from './BasePageLayout';

const TOCPage = ({ bookData, onNavigate }) => {
  if (!bookData) return null;

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
    if (onNavigate) {
      onNavigate(section.type, section.chapterId, null);
    }
  };

  const handlePageClick = (chapterId, pageId) => {
    if (onNavigate) {
      onNavigate('page', chapterId, pageId);
    }
  };

  return (
    <BasePageLayout>
      <div className="h-full flex flex-col">
        {/* TOC Title - Centered, Large, Bold */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 tracking-wide">Table of Contents</h1>
          <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
        </div>

        {/* TOC Content */}
        <div className="flex-1 space-y-8">
          {/* Book Sections */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Book Sections</h2>
            <div className="space-y-2">
              {bookBuilderSections.map((section, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-gray-500 w-8">
                      {section.page}
                    </span>
                    <span className="text-gray-700 font-medium">
                      {section.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Page {section.page}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chapters and Pages */}
          {chapterSections.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Chapters and Pages</h2>
              <div className="space-y-4">
                {chapterSections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    {/* Chapter Header */}
                    <div 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-3"
                      onClick={() => handleSectionClick(section)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono text-gray-500 w-8">
                          {section.page}
                        </span>
                        <span className="text-gray-700 font-semibold">
                          {section.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          section.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : section.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {section.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Page {section.page}
                      </div>
                    </div>

                    {/* Chapter Pages */}
                    {section.pages && section.pages.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {section.pages.map((page, pageIndex) => (
                          <div 
                            key={pageIndex} 
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handlePageClick(section.chapterId, page.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-mono text-gray-500 w-12">
                                {page.id}
                              </span>
                              <span className="text-gray-600 text-sm">
                                {page.title}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Page {pageIndex + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BasePageLayout>
  );
};

export default TOCPage; 