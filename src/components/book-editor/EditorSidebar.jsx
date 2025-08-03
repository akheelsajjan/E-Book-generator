import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Plus, Trash2, X, Star, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

const EditorSidebar = ({
  book,
  selectedPage,
  selectedChapter,
  onPageSelect,
  onAddNewPage,
  onAddNewChapter,
  onDeleteChapter,
  onDeletePage,
  onSwitchToBookBuilder,
  isCreatingChapter,
  isCreatingPage,
  isDeletingChapter,
  isDeletingPage,
  deletingItemId
}) => {
  // State to track which chapter is expanded (accordion behavior - only one at a time)
  const [expandedChapterId, setExpandedChapterId] = useState(null);
  const [debugCounter, setDebugCounter] = useState(0);
  
  // Force re-render when state changes
  const [renderKey, setRenderKey] = useState(0);
  
  // Track if user has manually interacted with chapters
  const [hasManualInteraction, setHasManualInteraction] = useState(false);

  // Auto-expand first chapter on editor load (only once)
  useEffect(() => {
    if (book?.chapters?.length > 0 && !expandedChapterId && !hasManualInteraction) {
      setExpandedChapterId(book.chapters[0].id);
    }
  }, [book?.chapters]); // Remove expandedChapterId from dependencies

  // Auto-expand chapter when a page is selected (but don't interfere with manual toggling)
  useEffect(() => {
    if (selectedPage && book?.chapters) {
      const chapterWithSelectedPage = book.chapters.find(chapter => 
        chapter.pages?.some(page => page.id === selectedPage)
      );
      
      if (chapterWithSelectedPage && expandedChapterId !== chapterWithSelectedPage.id) {
        // Only auto-expand if no chapter is currently expanded
        if (!expandedChapterId) {
          setExpandedChapterId(chapterWithSelectedPage.id);
        }
      }
    }
  }, [selectedPage, book?.chapters]); // Remove expandedChapterId from dependencies

  // Toggle chapter expansion (accordion behavior)
  const toggleChapter = (chapterId) => {
    console.log('toggleChapter called with:', chapterId, 'Current expanded:', expandedChapterId);
    
    // Mark that user has manually interacted
    setHasManualInteraction(true);
    
    // Force state update with explicit logic
    if (expandedChapterId === chapterId) {
      console.log('Collapsing chapter:', chapterId);
      setExpandedChapterId(null);
    } else {
      console.log('Expanding chapter:', chapterId);
      setExpandedChapterId(chapterId);
    }
    
    // Force a complete re-render
    setRenderKey(prev => prev + 1);
  };

  // Function to expand a specific chapter (used when adding new pages)
  const expandChapter = (chapterId) => {
    setExpandedChapterId(chapterId);
  };

  // Explicit click handler for chapter headers
  const handleChapterClick = (chapterId, chapterTitle, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Chapter clicked:', chapterId, chapterTitle, 'Event target:', e.target);
    toggleChapter(chapterId);
  };


  
  return (
    <div key={renderKey} className="w-80 sidebar-dark flex flex-col h-screen">
      {/* Action Buttons - Fixed Header */}
      <div className="p-4 border-b border-white/20 flex-shrink-0">
        <button
          onClick={onSwitchToBookBuilder}
          className="w-full mb-3 flex items-center justify-center px-4 py-2 bg-[#4299e1] text-white rounded-lg hover:bg-[#3182ce] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isCreatingChapter}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#4299e1] text-white rounded-lg hover:bg-[#3182ce] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingChapter ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isCreatingChapter ? 'Creating...' : '+ New Chapter'}
          </button>
        </div>
        <button className="w-full flex items-center justify-center px-4 py-2 bg-[#4299e1] text-white rounded-lg hover:bg-[#3182ce] transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Generate Outline
        </button>
      </div>



      {/* Book Structure Header - Fixed */}
      <div className="p-4 pb-2 flex-shrink-0">
        <h3 className="font-medium text-white">Book Structure</h3>
      </div>

      {/* Scrollable Chapter/Page List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 scrollable-content" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <div className="space-y-2">
          {book.chapters.map((chapter, chapterIndex) => {
            console.log('Rendering chapter:', chapter.id, chapter.title, 'expanded:', expandedChapterId === chapter.id);
            const isExpanded = expandedChapterId === chapter.id;
            const isDeletingThisChapter = isDeletingChapter && deletingItemId === chapter.id;
            return (
              <div key={`${chapter.id}-${debugCounter}`} className="chapter">
                <div 
                  className={`chapter-header flex items-center justify-between p-3 rounded-md hover:bg-white/20 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-0.5 cursor-pointer border border-transparent hover:border-white/20 ${
                    selectedChapter === chapter.title && !selectedPage ? 'bg-white/15' : 'bg-white/5'
                  } ${isDeletingThisChapter ? 'opacity-50' : ''} ${isExpanded ? 'bg-white/15 border-l-4 border-blue-400' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => handleChapterClick(chapter.id, chapter.title, e)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Chapter touched:', chapter.id, chapter.title);
                    toggleChapter(chapter.id);
                  }}
                  title={`Click to ${isExpanded ? 'collapse' : 'expand'} chapter`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      console.log('Chapter key pressed:', chapter.id, chapter.title);
                      toggleChapter(chapter.id);
                    }
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                                      <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-white transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white transition-transform duration-200" />
                      )}
                      <BookOpen className={`chapter-icon w-3.5 h-3.5 ${isExpanded ? 'text-blue-300' : 'text-white'}`} />
                      <span className={`chapter-title text-sm font-medium flex-grow ${isExpanded ? 'text-white' : 'text-white/90'}`}>
                        {chapter.title} {isExpanded ? '🔽' : '▶️'}
                      </span>
                    </div>
                  <div className="chapter-actions flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          // If chapter is collapsed, expand it when adding a new page
                          if (!isExpanded) {
                            expandChapter(chapter.id);
                          }
                          await onAddNewPage(chapter.id);
                        } catch (error) {
                          console.error('Error adding new page:', error);
                        }
                      }}
                      disabled={isCreatingPage}
                      className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add page to this chapter"
                    >
                      {isCreatingPage ? (
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                      ) : (
                        <Plus className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await onDeleteChapter(chapter.id);
                        } catch (error) {
                          console.error('Error deleting chapter:', error);
                        }
                      }}
                      disabled={isDeletingChapter}
                      className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete chapter"
                    >
                      {isDeletingThisChapter ? (
                        <Loader2 className="w-3 h-3 text-red-400 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3 text-red-400 hover:text-red-300" />
                      )}
                    </button>
                  </div>
                </div>
                <div className={`pages ml-5 space-y-1 mt-2 border-l-2 border-blue-400 pl-3 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                  {chapter.pages.map((page, pageIndex) => {
                      const isDeletingThisPage = isDeletingPage && deletingItemId === page.id;
                      const isSelected = selectedPage === page.id;
                      console.log(`EditorSidebar - Page ${page.title} (${page.id}): selectedPage=${selectedPage}, isSelected=${isSelected}`);
                      return (
                        <div
                          key={page.id || pageIndex}
                          className={`page p-2 rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/15 hover:transform hover:translate-x-0.5 group ${
                            isSelected
                              ? 'selected bg-white/25 border-l-4 border-orange-400 shadow-lg' 
                              : 'bg-transparent'
                          } ${isDeletingThisPage ? 'opacity-50' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPageSelect(page.id, chapter.id);
                          }}
                          title={`Click to select: ${page.title}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-grow">
                              <FileText className={`page-icon w-3 h-3 ${isSelected ? 'text-orange-500' : 'text-white/90'}`} />
                              <span className={`page-title text-xs ${isSelected ? 'text-white font-medium' : 'text-white/90'}`}>
                                {page.title}
                              </span>
                            </div>
                            <div className={`page-actions flex items-center space-x-1 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
                              {isSelected && <Star className="w-3 h-3 text-orange-500 star-icon" />}
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await onDeletePage(chapter.id, page.id);
                                  } catch (error) {
                                    console.error('Error deleting page:', error);
                                  }
                                }}
                                disabled={isDeletingPage}
                                className="w-4 h-4 flex items-center justify-center hover:bg-white/20 rounded transition-colors duration-200 delete-icon disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete page"
                              >
                                {isDeletingThisPage ? (
                                  <Loader2 className="w-2.5 h-2.5 text-red-400 animate-spin" />
                                ) : (
                                  <X className="w-2.5 h-2.5 text-red-400 hover:text-red-300" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar; 