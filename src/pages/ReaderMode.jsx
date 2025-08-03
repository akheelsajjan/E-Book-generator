import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { User, CreditCard, Key, Settings, ChevronDown, LogOut, BookOpen, ArrowLeft, Eye } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ReaderMode = () => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  
  // User profile dropdown state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  
  // Books state
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch published books
  useEffect(() => {
    const fetchPublishedBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const booksRef = collection(db, 'books');
        const q = query(booksRef, where('status', '==', 'published'));
        const querySnapshot = await getDocs(q);
        
        const books = [];
        querySnapshot.forEach((doc) => {
          books.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort by most recently updated
        books.sort((a, b) => {
          const aTime = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
          const bTime = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
          return bTime - aTime;
        });
        
        setPublishedBooks(books);
        console.log('Fetched published books:', books.length);
      } catch (error) {
        console.error('Error fetching published books:', error);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedBooks();
  }, []);

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  const getUserName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const handleApiKeysManage = () => {
    setShowUserDropdown(false);
    navigate('/settings/api-keys');
  };

  const handleSettingsConfigure = () => {
    setShowUserDropdown(false);
    // TODO: Navigate to general settings page
    console.log('Settings clicked');
  };

  const handleSubscriptionUpgrade = () => {
    setShowUserDropdown(false);
    // TODO: Navigate to subscription page
    console.log('Upgrade clicked');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowUserDropdown(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleReadBook = (bookId) => {
    // Navigate to book detail page
    navigate(`/main/book/${bookId}`);
  };

  const truncateDescription = (description, maxLength = 120) => {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand - Left Aligned */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Logo Icon */}
              <div className="logo-icon">
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-400/80 rounded-sm"></div>
                  <div className="w-2 h-2 bg-red-400/80 rounded-sm"></div>
                  <div className="w-2 h-2 bg-blue-400/80 rounded-sm"></div>
                </div>
              </div>
              
              {/* Brand Name */}
              <h1 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">
                Ebook-AI
              </h1>
            </div>

            {/* Right Side - User Profile */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* User Profile Dropdown - Always Right Aligned */}
              <div className="relative flex-shrink-0" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
                >
                  {/* User Info */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-300">Reader</p>
                  </div>
                  
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20 hover:border-white/30 transition-all duration-200">
                    {getUserInitial()}
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                          {getUserInitial()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{getUserName()}</h3>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Author Mode Switch */}
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <ArrowLeft className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Switch to Author Mode</h4>
                            <p className="text-sm text-gray-600">Create and edit books</p>
                          </div>
                          <button 
                            onClick={() => {
                              setShowUserDropdown(false);
                              navigate('/dashboard');
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Switch
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2"></div>

                      {/* Subscription Plan Section */}
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Subscription Plan</h4>
                            <p className="text-sm text-gray-600">Free Plan</p>
                          </div>
                          <button 
                            onClick={handleSubscriptionUpgrade}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Upgrade
                          </button>
                        </div>
                      </div>

                      {/* API Keys Section */}
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <Key className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">API Keys</h4>
                            <p className="text-sm text-gray-600">Manage your API keys</p>
                          </div>
                          <button
                            onClick={handleApiKeysManage}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Manage
                          </button>
                        </div>
                      </div>

                      {/* Settings Section */}
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Settings</h4>
                            <p className="text-sm text-gray-600">Account preferences</p>
                          </div>
                          <button
                            onClick={handleSettingsConfigure}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Configure
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2"></div>

                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-200 text-left"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Sign Out</h4>
                          <p className="text-sm text-gray-600">Log out of your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

             {/* Main Content */}
       <div className="pt-20 px-6 py-8 mt-8">
        <div className="max-w-7xl mx-auto">
                     {/* Page Header */}
           <div className="mb-8">
             <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 All Published Books</h1>
             <p className="text-gray-600">Discover amazing books from our community of authors</p>
           </div>

           {/* Section Heading */}
           <div className="mb-6">
             <h2 className="text-2xl font-semibold text-gray-800">Featured Books</h2>
             <p className="text-gray-600 mt-1">Explore our collection of published books</p>
           </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading published books...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-2">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Books Grid */}
          {!loading && !error && publishedBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Card Layout - About Book Preview Design */}
                  <div className="p-6">
                    {/* Header with Title and Published Year */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {book.title || 'Untitled Book'}
                        </h3>
                        <p className="text-sm text-gray-500 italic">
                          {book.shortDescription || book.description?.short || 'No description available.'}
                        </p>
                      </div>
                      {book.updatedAt && (
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500">
                            Published<br />
                            {formatDate(book.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Cover Image */}
                    <div className="mb-4">
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                                                 {book.cover?.imageUrl ? (
                           <img 
                             src={book.cover.imageUrl} 
                             alt={book.title}
                             className="w-full h-full object-cover"
                           />
                         ) : (
                          <div className="text-white text-center">
                            <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-80" />
                            <p className="text-sm opacity-80">Cover Image</p>
                          </div>
                        )}
                        
                      </div>
                    </div>

                    {/* Author Name */}
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Author:</span> {book.author?.name || book.userName || 'Unknown Author'}
                      </p>
                    </div>

                    {/* Genre Tag */}
                    {book.tags && Array.isArray(book.tags) && book.tags.length > 0 && (
                      <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {book.tags[0]}
                        </span>
                      </div>
                    )}

                                         {/* View Button - Bottom Left */}
                     <div className="flex justify-start">
                       <button
                         onClick={() => handleReadBook(book.id)}
                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 hover:shadow-lg"
                       >
                         <Eye className="w-4 h-4" />
                         <span>View</span>
                       </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && publishedBooks.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No books have been published yet</h2>
              <p className="text-gray-600 mb-6">
                Come back soon! Authors are working on amazing books for you to read.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">What to expect:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Diverse genres and topics</li>
                  <li>• High-quality content from our community</li>
                  <li>• Regular updates with new releases</li>
                  <li>• Beautiful reading experience</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderMode; 