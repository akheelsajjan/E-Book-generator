import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import EditorView from './EditorView';
import BookBuilderView from './BookBuilderView';

const BookEditorMain = ({ book: bookProp, setBook }) => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debug logging
  console.log('BookEditorMain - Book prop received:', bookProp);
  console.log('BookEditorMain - Book ID from params:', bookId);
  
  // Add custom styles for range sliders
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .draggable-text:hover {
        opacity: 0.8;
        transform: scale(1.02);
        transition: all 0.2s ease;
      }
      .draggable-text:active {
        cursor: grabbing;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // State for view switching
  const [currentView, setCurrentView] = useState('editor'); // 'editor' or 'bookBuilder'
  
  // Use book data from props, with fallback for development
  const bookData = bookProp || {
    id: bookId,
    title: 'My First eBook',
    chapters: []
  };

  // Ensure chapters array exists
  if (!bookData.chapters) {
    bookData.chapters = [];
  }



  // Calculate progress
  const calculateProgress = () => {
    const totalPages = bookData.chapters.reduce((total, chapter) => {
      return total + chapter.pages.length;
    }, 0);
    
    const completedPages = bookData.chapters.reduce((total, chapter) => {
      return total + chapter.pages.filter(page => page.status === 'completed').length;
    }, 0);
    
    return totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;
  };



  return (
    <>
      {currentView === 'editor' ? (
        <EditorView
          book={bookData}
          setBook={setBook}
          calculateProgress={calculateProgress}
          onSwitchToBookBuilder={() => setCurrentView('bookBuilder')}
        />
      ) : (
        <BookBuilderView
          book={bookData}
          setBook={setBook}
          calculateProgress={calculateProgress}
          onSwitchToEditor={() => setCurrentView('editor')}
        />
      )}
    </>
  );
};

export default BookEditorMain; 