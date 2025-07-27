import React from 'react';
import { Plus, BookOpen, FileText, Star, Trash2, X } from 'lucide-react';

const EditorSidebar = ({
  book,
  selectedPage,
  onPageSelect,
  onAddNewPage,
  onAddNewChapter,
  onDeleteChapter,
  onDeletePage,
  onSwitchToBookBuilder
}) => {
  // Debug logging
  console.log('EditorSidebar - Book data:', book);
  console.log('EditorSidebar - Selected page:', selectedPage);
  console.log('EditorSidebar - Chapters count:', book?.chapters?.length);
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-col">
      {/* Action Buttons */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onSwitchToBookBuilder}
          className="w-full mb-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          + Book Builder
        </button>
        <div className="mb-3">
          <button 
            onClick={async () => {
              try {
                await onAddNewChapter();
              } catch (error) {
                console.error('Error adding new chapter:', error);
              }
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            + New Chapter
          </button>
        </div>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Generate Outline
        </button>
      </div>

      {/* Book Content Tree */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="font-medium text-gray-900 mb-3">Book Structure</h3>
        <div className="space-y-2">
          {book.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id || chapterIndex}>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{chapter.title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={async () => {
                      try {
                        await onAddNewPage(chapter.id);
                      } catch (error) {
                        console.error('Error adding new page:', error);
                      }
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-blue-500"
                    title="Add page to this chapter"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        await onDeleteChapter(chapter.id);
                      } catch (error) {
                        console.error('Error deleting chapter:', error);
                      }
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-red-500"
                    title="Delete chapter"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {chapter.pages.map((page, pageIndex) => (
                <div
                  key={page.id || pageIndex}
                  className={`ml-4 p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 ${
                    selectedPage === page.title ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                  }`}
                  onClick={() => onPageSelect(page.id, chapter.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span className="text-sm text-gray-600">{page.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {selectedPage === page.title && <Star className="w-3 h-3 text-orange-500" />}
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await onDeletePage(chapter.id, page.id);
                          } catch (error) {
                            console.error('Error deleting page:', error);
                          }
                        }}
                        className="p-1 hover:bg-gray-200 rounded text-red-500"
                        title="Delete page"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar; 