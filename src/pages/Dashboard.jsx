import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { booksService } from '../services/booksService';
import {
  DashboardHeader,
  SearchFilters,
  TabNavigation,
  EnhancedBookCard,
  EmptyState,
  StatsCards
} from '../components/dashboard';
import CreateBookModal from '../components/CreateBookModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6; // 3 books per row × 2 rows

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  // Add a controlled refresh mechanism based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldRefresh = urlParams.get('refresh');
    
    if (shouldRefresh === 'true' && user && !loading) {
      // Remove the refresh parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Refresh the books data
      refreshBooks();
    }
  }, [user, window.location.search]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await booksService.getBooks(user.uid);
      console.log('Dashboard - Loaded basic books:', booksData);
      
      // Fetch complete book data with chapters and pages for accurate statistics
      const completeBooksData = await Promise.all(
        booksData.map(async (book) => {
          try {
            const completeBook = await booksService.getBookWithChapters(book.id);
            console.log(`Dashboard - Complete book data for ${book.title}:`, {
              id: completeBook.id,
              title: completeBook.title,
              status: completeBook.status,
              chapters: completeBook.chapters?.length || 0,
              pages: completeBook.chapters?.reduce((total, chapter) => 
                total + (chapter.pages?.length || 0), 0) || 0
            });
            return completeBook;
          } catch (error) {
            console.error(`Error fetching complete data for book ${book.id}:`, error);
            // Return basic book data if complete fetch fails
            return book;
          }
        })
      );
      
      console.log('Dashboard - Complete books data:', completeBooksData);
      setBooks(completeBooksData);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function for when returning from editor/preview
  const refreshBooks = () => {
    if (user && !loading) {
      loadBooks();
    }
  };

  const handleCreateBook = () => {
    setShowCreateModal(true);
  };

  const handleCreateBookSuccess = (newBook) => {
    // Refresh the entire book list to get complete data
    refreshBooks();
    setShowCreateModal(false);
  };

  const handleEditBook = (book) => {
    console.log('Edit book clicked:', book);
    console.log('Book ID:', book.id);
    console.log('Book title:', book.title);
    // Navigate to book editor using React Router
    navigate(`/editor/${book.id}`);
  };

  const handlePreviewBook = (book) => {
    console.log('Dashboard - handlePreviewBook called with book:', book);
    console.log('Dashboard - Book ID:', book?.id);
    
    if (!book?.id) {
      console.error('Dashboard - Book ID is undefined or null');
      alert('Error: Book ID is missing. Please try again.');
      return;
    }
    
    // Navigate to book preview using React Router
    navigate(`/preview/${book.id}`);
  };

  const handleDeleteBook = async (book) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksService.deleteBook(book.id);
        // Refresh the entire book list to get updated data
        refreshBooks();
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const handleDuplicateBook = async (book) => {
    try {
      const duplicatedBook = await booksService.duplicateBook(book.id);
      // Refresh the entire book list to get updated data
      refreshBooks();
    } catch (err) {
      console.error('Error duplicating book:', err);
      alert('Failed to duplicate book. Please try again.');
    }
  };

  const handleRenameBook = async (book) => {
    const newTitle = prompt('Enter new book title:', book.title);
    if (newTitle && newTitle.trim() !== book.title) {
      try {
        await booksService.updateBook(book.id, { title: newTitle.trim() });
        // Refresh the entire book list to get updated data
        refreshBooks();
      } catch (err) {
        console.error('Error renaming book:', err);
        alert('Failed to rename book. Please try again.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('recent');
  };

  // Calculate real statistics from books data
  const calculateStats = React.useMemo(() => {
    const totalBooks = books.length;
    const publishedBooks = books.filter(book => book.status === 'published').length;
    const inProgressBooks = books.filter(book => book.status !== 'published').length;
    
    // Calculate completion rate based on published books
    const completionRate = totalBooks > 0 ? Math.round((publishedBooks / totalBooks) * 100) : 0;
    
    return {
      totalBooks,
      published: publishedBooks,
      inProgress: inProgressBooks,
      completionRate
    };
  }, [books]);

  // Get filtered and sorted books
  const getFilteredBooks = () => {
    let filtered = books;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.cover?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => book.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => {
          const aTime = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
          const bTime = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
          return bTime - aTime;
        });
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'status':
        filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Memoize filtered books to prevent unnecessary recalculations
  const filteredBooks = React.useMemo(() => getFilteredBooks(), [books, searchTerm, statusFilter, sortBy]);

  // Get books filtered by active tab
  const tabFilteredBooks = React.useMemo(() => {
    return activeTab === 'all' 
      ? filteredBooks 
      : filteredBooks.filter(book => book.status === activeTab);
  }, [filteredBooks, activeTab]);

  // Calculate tab counts
  const tabCounts = React.useMemo(() => ({
    all: books.length,
    draft: books.filter(book => book.status === 'draft').length,
    'in-progress': books.filter(book => book.status === 'in-progress').length,
    published: books.filter(book => book.status === 'published').length
  }), [books]);

  // Pagination logic
  const totalPages = Math.ceil(tabFilteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = tabFilteredBooks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]); // Removed activeTab from dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <DashboardHeader 
        onCreateBook={handleCreateBook}
        onSignOut={handleSignOut}
        user={user}
      />

      {/* Main Content - 70/30 Split Layout */}
      <div className="flex flex-col lg:flex-row w-full pt-16 flex-1">
        {/* Left Section - 70% width */}
        <div className="w-full lg:w-[70%] px-6 py-4 space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Search and Filters Card */}
          <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1">
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredCount={filteredBooks.length}
              totalCount={books.length}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Combined Tab Navigation and Books Grid Card */}
          <div className="bg-gradient-to-br from-white via-blue-50/40 to-blue-100/30 rounded-xl shadow-xl hover:shadow-2xl border border-blue-200 p-6 transition-all duration-300 hover:-translate-y-1">
            {/* Tab Navigation */}
            <div className="mb-4">
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabCounts={tabCounts}
              />
            </div>

            {/* Books Grid */}
            {tabFilteredBooks.length === 0 ? (
              <div className="flex items-center justify-center" style={{ height: '76vh' }}>
                <EmptyState 
                  type={activeTab} 
                  onCreateBook={handleCreateBook}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentBooks.map((book) => (
                    <EnhancedBookCard
                      key={book.id}
                      book={book}
                      onEdit={handleEditBook}
                      onPreview={handlePreviewBook}
                      onDelete={handleDeleteBook}
                      onDuplicate={handleDuplicateBook}
                      onRename={handleRenameBook}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Section - 30% width with Stats Cards */}
        <div className="w-full lg:w-[30%] bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8">
          <div className="sticky top-8">
            {/* Stats Cards Card */}
            <div className="bg-gradient-to-br from-white via-green-50/40 to-green-100/30 rounded-xl shadow-xl hover:shadow-2xl border border-green-200 p-6 transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Stats</h2>
              <StatsCards stats={calculateStats} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center">
        <p className="text-sm text-gray-500">
          © 2025 Ebook-AI. All rights reserved.
        </p>
      </footer>

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