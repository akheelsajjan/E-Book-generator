import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit, Eye, Copy, Trash2, Calendar, BookOpen, FileText, User, Tag, Clock } from 'lucide-react';

const EnhancedBookCard = ({ book, onEdit, onPreview, onDelete, onDuplicate, onRename }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300 shadow-sm">
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-300 shadow-sm">
            DRAFT
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300 shadow-sm">
            In Progress
          </span>
        );
      default:
    return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-sm">
            {status || 'Draft'}
      </span>
    );
    }
  };

  const getChaptersCount = () => {
    if (!book.chapters) return 0;
    return book.chapters.length;
  };

  const getPagesCount = () => {
    if (!book.chapters) return 0;
    return book.chapters.reduce((total, chapter) => {
      return total + (chapter.pages ? chapter.pages.length : 0);
    }, 0);
  };

  const getBookGenre = () => {
    return book.genre || 'General';
  };

  const getBookDescription = () => {
    return book.description || 'No description available';
  };

  const getProgressPercentage = () => {
    // For published books, return 100%
    if (book.status === 'published') return 100;
    
    if (!book.chapters || book.chapters.length === 0) return 0;
    
    const totalPages = getPagesCount();
    const completedPages = book.chapters.reduce((total, chapter) => {
      if (chapter.pages) {
        return total + chapter.pages.filter(page => page.content && page.content.trim().length > 50).length;
      }
      return total;
    }, 0);
    
    return totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 20) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getProgressText = () => {
    // For published books, return "Published"
    if (book.status === 'published') return 'Published';
    
    const percentage = getProgressPercentage();
    if (percentage === 0) return 'Not started';
    if (percentage < 20) return 'Just started';
    if (percentage < 50) return 'In progress';
    if (percentage < 80) return 'Almost done';
    return 'Nearly complete';
  };

  const getWordCount = () => {
    if (!book.chapters) return 0;
    return book.chapters.reduce((total, chapter) => {
      if (chapter.pages) {
        return total + chapter.pages.reduce((pageTotal, page) => {
          return pageTotal + (page.content ? page.content.split(' ').length : 0);
        }, 0);
      }
      return total;
    }, 0);
  };

  const getEstimatedReadingTime = () => {
    const wordCount = getWordCount();
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    
    let bookDate;
    
    // Handle Firebase timestamp
    if (date.toDate) {
      bookDate = date.toDate();
    } else if (date.seconds) {
      bookDate = new Date(date.seconds * 1000);
    } else {
      bookDate = new Date(date);
    }
    
    // Check if the date is valid
    if (isNaN(bookDate.getTime())) {
      return 'Recently';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - bookDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'today';
    if (diffDays === 2) return 'yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  // Calculate menu position
  const calculateMenuPosition = () => {
    if (menuButtonRef.current) {
      const buttonRect = menuButtonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      console.log('Menu positioning - Button rect:', buttonRect);
      console.log('Menu positioning - Viewport:', { width: viewportWidth, height: viewportHeight });
      
      // Default position (bottom-right of button)
      let top = buttonRect.bottom + 8;
      let left = buttonRect.right - 192; // 192px is the width of the menu (w-48)
      
      console.log('Menu positioning - Initial position:', { top, left });
      
      // Adjust if menu would go off the right edge
      if (left + 192 > viewportWidth) {
        left = viewportWidth - 192 - 8;
        console.log('Menu positioning - Adjusted for right edge:', left);
      }
      
      // Adjust if menu would go off the bottom edge
      if (top + 120 > viewportHeight) { // 120px is approximate menu height
        top = buttonRect.top - 120 - 8;
        console.log('Menu positioning - Adjusted for bottom edge:', top);
      }
      
      // Ensure menu doesn't go off the left edge
      if (left < 8) {
        left = 8;
        console.log('Menu positioning - Adjusted for left edge:', left);
      }
      
      // Ensure menu doesn't go off the top edge
      if (top < 8) {
        top = 8;
        console.log('Menu positioning - Adjusted for top edge:', top);
      }
      
      console.log('Menu positioning - Final position:', { top, left });
      setMenuPosition({ top, left });
    }
  };

  // Handle menu toggle
  const handleMenuToggle = () => {
    console.log('Menu toggle clicked, current showMenu:', showMenu);
    if (!showMenu) {
      calculateMenuPosition();
    }
    setShowMenu(!showMenu);
    console.log('Menu toggle - new showMenu will be:', !showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);



  return (
    <>
      <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative h-full flex flex-col">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Card Content */}
        <div className="relative p-6 space-y-4 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-1 group-hover:text-purple-700 transition-colors duration-300">
                {book.title || 'Untitled Book'}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {book.cover?.author || book.author?.name || 'Unknown Author'}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="ml-3 flex-shrink-0">
              {getStatusBadge(book.status)}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">
                <span className="font-semibold text-gray-900">{getChaptersCount()}</span> chapters
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">
                <span className="font-semibold text-gray-900">{getPagesCount()}</span> pages
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">
                {formatDate(book.updatedAt)}
              </span>
            </div>
          </div>

          {/* Progress Section - Show progress for non-published books, placeholder for published */}
          <div className="flex-1 flex items-center">
            {book.status !== 'published' ? (
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{getProgressText()}</span>
                  <span className="font-semibold text-gray-900">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 shadow-sm ${getProgressColor()}`}
                    style={{ 
                      width: `${getProgressPercentage()}%`
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              // Empty space for published books to maintain consistent card height
              <div className="w-full h-10"></div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  console.log('EnhancedBookCard - Edit button clicked for book:', book);
                  onEdit(book);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-lg transition-all duration-200 font-medium text-sm border border-blue-200 hover:border-blue-300 hover:shadow-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => {
                  console.log('EnhancedBookCard - Preview button clicked for book:', book);
                  console.log('Book ID:', book.id);
                  onPreview(book);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>

            {/* More Options */}
            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={handleMenuToggle}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portal-based dropdown menu */}
      <DropdownMenu
        showMenu={showMenu}
        menuPosition={menuPosition}
        onDuplicate={() => onDuplicate(book)}
        onRename={() => onRename(book)}
        onDelete={() => onDelete(book)}
        onClose={() => setShowMenu(false)}
        menuRef={menuRef}
      />
    </>
  );
};

// Render dropdown menu using portal to avoid clipping
const DropdownMenu = ({ showMenu, menuPosition, onDuplicate, onRename, onDelete, onClose, menuRef }) => {
  if (!showMenu) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="dropdown-menu"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
      >
        <Copy className="w-4 h-4" />
        <span>Duplicate</span>
      </button>
      <button
        onClick={() => {
          onRename();
          onClose();
        }}
      >
        <Edit className="w-4 h-4" />
        <span>Rename</span>
      </button>
      <div className="divider"></div>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="delete"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>,
    document.body
  );
};

export default EnhancedBookCard; 