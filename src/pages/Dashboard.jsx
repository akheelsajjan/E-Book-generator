import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { getUserBooks, deleteBook } from '../services/booksService';
import CreateBookModal from '../components/CreateBookModal';
import {
  DashboardHeader,
  StatsCards,
  SearchFilters,
  TabNavigation,
  EnhancedBookCard,
  EmptyState
} from '../components/dashboard';

const Dashboard = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, [user]);

  // Filter and sort books when filters change
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

    // Filter by active tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(book => book.status === activeTab);
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'chapters':
          return (b.chapters?.length || 0) - (a.chapters?.length || 0);
        case 'updated':
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        case 'recent':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, statusFilter, sortBy, activeTab]);

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
    console.log('Book created successfully:', result);
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

  const handleDuplicateBook = (bookId) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate book:', bookId);
  };

  const handleRenameBook = (bookId) => {
    // TODO: Implement rename functionality
    console.log('Rename book:', bookId);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('recent');
    setActiveTab('all');
  };

  // Calculate stats
  const publishedBooks = books.filter(book => book.status === 'published');
  const draftBooks = books.filter(book => book.status === 'draft');
  const inProgressBooks = books.filter(book => book.status === 'in-progress');
  const totalBooks = books.length;
  const completionRate = totalBooks > 0 ? Math.round((publishedBooks.length / totalBooks) * 100) : 0;

  const stats = {
    totalBooks,
    publishedBooks: publishedBooks.length,
    draftBooks: draftBooks.length,
    completionRate
  };

  const tabCounts = {
    all: totalBooks,
    published: publishedBooks.length,
    draft: draftBooks.length,
    inProgress: inProgressBooks.length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-secondary">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <DashboardHeader 
        onCreateBook={handleCreateBook}
        onSignOut={handleSignOut}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Error message */}
        {error && (
          <div className="glass-effect border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Search and Filters */}
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

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabCounts={tabCounts}
        />

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <EmptyState 
            type={activeTab} 
            onCreateBook={handleCreateBook}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
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
        )}
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