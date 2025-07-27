import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { getUserBooks, deleteBook } from '../services/booksService';
import BookCard from '../components/book/BookCard';
import CreateBookModal from '../components/CreateBookModal';

const Dashboard = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, [user]);

  // Filter books when search term or status filter changes
  useEffect(() => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.cover?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.cover?.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.cover?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => book.status === statusFilter);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, statusFilter]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (user) {
        console.log('Loading books for user:', user.uid);
        const userBooks = await getUserBooks(user.uid);
        console.log('Loaded books:', userBooks);
        setBooks(userBooks || []);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      // Don't show error if it's just that no books exist yet
      if (error.message && error.message.includes('index')) {
        console.log('Index error - this is expected for new users with no books');
        setBooks([]);
      } else {
        setError('Failed to load books. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = () => {
    setShowCreateModal(true);
  };

  const handleCreateBookSuccess = (result) => {
    // The modal will handle navigation automatically
    console.log('Book created successfully:', result);
    // You could add a toast notification here
    // toast.success('Book initialized with 1 chapter and 1 page.');
  };

  const handleEditBook = (bookId) => {
    navigate(`/editor/${bookId}`);
  };

  const handlePreviewBook = (bookId) => {
    navigate(`/preview/${bookId}`);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const publishedBooks = filteredBooks.filter(book => book.status === 'published');
  const draftBooks = filteredBooks.filter(book => book.status === 'draft');
  const totalBooks = books.length;
  const filteredTotal = filteredBooks.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info and sign out */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My eBooks</h1>
            {user && (
              <p className="text-gray-600 mt-1">
                Welcome, {user.displayName || user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCreateBook}
              className="btn-primary"
            >
              Create New Book
            </button>
            <button 
              onClick={handleSignOut}
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedBooks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{draftBooks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalBooks > 0 ? Math.round((publishedBooks.length / totalBooks) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search books by title, author, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Books</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results count */}
          {filteredTotal !== totalBooks && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredTotal} of {totalBooks} books
            </div>
          )}
        </div>
        
        {/* Published Books Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Published Books</h2>
          {publishedBooks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No published books yet.</p>
              <p className="text-sm text-gray-400 mt-1">Start writing to publish your first book!</p>
            </div>
          ) : (
            <div className="dashboard-grid">
              {publishedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                  onPreview={handlePreviewBook}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Draft Books Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Books in Progress</h2>
          {draftBooks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-gray-500">No draft books yet. Create your first book!</p>
              <button 
                onClick={handleCreateBook}
                className="mt-4 btn-primary"
              >
                Create New Book
              </button>
            </div>
          ) : (
            <div className="dashboard-grid">
              {draftBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                  onPreview={handlePreviewBook}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Book Modal */}
      <CreateBookModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateBookSuccess}
      />
    </div>
  );
};

export default Dashboard; 