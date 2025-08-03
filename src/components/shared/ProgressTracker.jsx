import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ 
  book, 
  onPublish, 
  className = "",
  buttonClassName = "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Calculate book completion checklist
  const calculateBookCompletion = () => {
    const checklist = [
      {
        id: 'chapters',
        label: 'Has at least one chapter and one page',
        completed: book?.chapters && book.chapters.length > 0 && 
                  book.chapters.some(chapter => chapter.pages && chapter.pages.length > 0),
        percentage: 20
      },
      {
        id: 'author',
        label: '"About Author" is filled',
        completed: book?.author && 
                  (book.author.name && book.author.name.trim() !== '') &&
                  (book.author.bio && book.author.bio.trim() !== ''),
        percentage: 20
      },
      {
        id: 'preface',
        label: 'Preface is filled',
        completed: book?.preface && book.preface.content && book.preface.content.trim() !== '',
        percentage: 20
      },
      {
        id: 'cover',
        label: 'Book cover is updated',
        completed: book?.cover && 
                  (book.cover.title && book.cover.title.trim() !== '') &&
                  (book.cover.author && book.cover.author.trim() !== ''),
        percentage: 20
      },
      {
        id: 'metadata',
        label: 'Book title, subtitle, genre, and tags set',
        completed: book?.title && book.title.trim() !== '' &&
                  book?.genre && book.genre.trim() !== '' &&
                  book?.tags && book.tags.trim() !== '',
        percentage: 20
      }
    ];

    const completedItems = checklist.filter(item => item.completed);
    const totalCompletion = Math.round((completedItems.length / checklist.length) * 100);

    return { checklist, totalCompletion };
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.progress-tracker-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const { checklist, totalCompletion } = calculateBookCompletion();

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className={buttonClassName}
        title="Track your book completion progress"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Progress:</span>
            <span className="text-sm font-bold">{totalCompletion}%</span>
          </div>
          <div className="w-12 h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${totalCompletion}%` }}
            ></div>
          </div>
        </div>
        <svg className={`w-4 h-4 ml-3 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Progress Dropdown */}
      {showDropdown && (
        <div className="progress-tracker-dropdown absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Completion Checklist</h3>
            
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-5 h-5">
                        {item.completed ? (
                          <span className="text-green-600 text-lg">✅</span>
                        ) : (
                          <span className="text-gray-400 text-lg">❌</span>
                        )}
                      </div>
                      <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${item.completed ? 'text-green-600' : 'text-gray-400'}`}>
                      {item.percentage}%
                    </span>
                  </div>
                  {index < checklist.length - 1 && (
                    <div className="h-px bg-gray-200 mx-3"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Progress */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Total Progress</span>
                <span className="text-sm font-bold text-blue-600">{totalCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${totalCompletion}%` }}
                ></div>
              </div>
            </div>

            {/* Book Ready Message & Preview & Publish Button */}
            {totalCompletion === 100 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center mb-3">
                  <div className="text-2xl mb-1">🎉</div>
                  <div className="text-sm font-medium text-green-600">Book Ready!</div>
                </div>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    if (onPublish) {
                      onPublish();
                    }
                  }}
                  className="w-full px-4 py-2 bg-[#4299e1] text-white rounded-lg hover:bg-[#3182ce] transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview & Publish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker; 