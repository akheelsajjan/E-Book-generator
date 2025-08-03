import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { User, CreditCard, Key, Settings, ChevronDown, LogOut, BookOpen, ArrowLeft, Eye, Star, Play, Bookmark } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BookDetailPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { user, signOutUser } = useAuth();
  
  // User profile dropdown state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  
  // Book data state
  const [book, setBook] = useState(null);
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

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookDoc = await getDoc(doc(db, 'books', bookId));
        
        if (!bookDoc.exists()) {
          setError('Book not found');
          return;
        }
        
        const bookData = bookDoc.data();
        
        // Only show published books
        if (bookData.status !== 'published') {
          setError('Book not available');
          return;
        }
        
        setBook({
          id: bookDoc.id,
          ...bookData
        });
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Failed to load book. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

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
    console.log('Settings clicked');
  };

  const handleSubscriptionUpgrade = () => {
    setShowUserDropdown(false);
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

  const handleStartReading = () => {
    // Navigate to the existing preview screen for reading with reader mode flag
    navigate(`/preview/${bookId}?mode=reader`);
  };

  const handleAddToLibrary = () => {
    // TODO: Implement add to library functionality
    console.log('Add to library:', bookId);
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.getFullYear().toString();
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => navigate('/main')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Back to Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

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
           {/* Back Button */}
           <div className="mb-6">
             <button
               onClick={() => navigate('/main')}
               className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
             >
               <ArrowLeft className="w-5 h-5" />
               <span>Back to Books</span>
             </button>
           </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="w-48 h-64 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {book.cover?.imageUrl ? (
                    <img 
                      src={book.cover.imageUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-center p-4">
                      <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-80">{book.title || 'Untitled Book'}</p>
                      <p className="text-xs opacity-60">{book.author?.name || book.userName || 'Unknown Author'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  {book.title || 'Untitled Book'}
                </h1>
                <p className="text-lg mb-4">
                  by {book.author?.name || book.userName || 'Unknown Author'}
                </p>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm">4.2 (1,247 reviews)</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleStartReading}
                    className="bg-white text-purple-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Reading</span>
                  </button>
                  <button
                    onClick={handleAddToLibrary}
                    className="bg-transparent border border-white text-white hover:bg-white hover:text-purple-600 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Add to Library</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

                     {/* Content Section */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* About This Book */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Book</h2>
                  <p className="text-gray-600 mb-6">
                    {book.shortDescription || book.description?.short || 'No description available.'}
                  </p>
                  
                  <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {book.fullDescription || book.description?.full || book.aboutBook || 'No detailed description available.'}
                    </p>
                  </div>
                </div>
              </div>

                                                   {/* Book Details Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Details</h2>
                  <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-gray-600">Published:</span>
                   <span className="font-medium">{book.publishedYear || formatDate(book.updatedAt) || 'Not Available'}</span>
                 </div>
                 
                 <div className="flex justify-between items-center">
                   <span className="text-gray-600">Genre:</span>
                   <div className="flex space-x-2">
                     {book.tags ? (
                       typeof book.tags === 'string' ? (
                         // If tags is a string, split by comma
                         book.tags.split(',').map((tag, index) => (
                           <span 
                             key={index}
                             className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full"
                           >
                             {tag.trim()}
                           </span>
                         ))
                       ) : Array.isArray(book.tags) ? (
                         // If tags is an array
                         book.tags.slice(0, 2).map((tag, index) => (
                           <span 
                             key={index}
                             className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full"
                           >
                             {tag}
                           </span>
                         ))
                       ) : (
                         <span className="text-gray-500">Not Available</span>
                       )
                     ) : (
                       <span className="text-gray-500">Not Available</span>
                     )}
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-center">
                   <span className="text-gray-600">Pages:</span>
                   <span className="font-medium">
                     {book.chapters ? 
                       book.chapters.reduce((total, chapter) => total + (chapter.pages?.length || 0), 0) 
                       : 'Not Available'}
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center">
                   <span className="text-gray-600">Language:</span>
                   <span className="font-medium">{book.language || 'English'}</span>
                 </div>
                 
                                    <div className="flex justify-between items-center">
                     <span className="text-gray-600">Tone:</span>
                     <span className="font-medium">{book.tone || 'Not Available'}</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage; 