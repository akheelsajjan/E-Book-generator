import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { getBookWithChapters } from '../services/booksService';
import BookEditorMain from '../components/book-editor/BookEditorMain';

const BookEditor = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadBook = async () => {
      if (!bookId || !user) return;

      try {
        setLoading(true);
        setError(null);
        
        const bookData = await getBookWithChapters(bookId);
        
        // Debug logging
        console.log('BookEditor - Book data loaded from server:', bookData);
        console.log('BookEditor - Chapters count:', bookData?.chapters?.length);
        console.log('BookEditor - First chapter:', bookData?.chapters?.[0]);
        console.log('BookEditor - First page:', bookData?.chapters?.[0]?.pages?.[0]);
        
        // Check if the book belongs to the current user
        if (bookData.userId !== user.uid) {
          setError('You do not have permission to edit this book');
          return;
        }
        
        setBook(bookData);
      } catch (error) {
        console.error('Error loading book:', error);
        setError('Failed to load book. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your book...</p>
        </div>
          </div>
    );
  }

  if (error) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
              <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
              </button>
                    </div>
                  </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                          <div className="text-center">
          <p className="text-gray-600 mb-4">Book not found</p>
                <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
                </button>
                      </div>
                    </div>
    );
  }

  return <BookEditorMain book={book} setBook={setBook} />;
};

export default BookEditor; 