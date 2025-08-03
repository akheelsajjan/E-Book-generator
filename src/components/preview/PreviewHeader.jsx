import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, User, Settings, Upload, ChevronDown, LogOut, CreditCard, Key, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const PreviewHeader = ({ 
  bookTitle, 
  viewMode, 
  authorMode, 
  onViewModeChange, 
  onAuthorModeChange,
  bookStatus = 'draft',
  onPublish,
  isPublishing = false,
  isReaderMode = false,
  isBookComplete = true
}) => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const isPublished = bookStatus === 'published';

  // User profile dropdown state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

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

  return (
    <div className="flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(isReaderMode ? '/main' : '/dashboard')}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isReaderMode ? 'Back to Books' : 'Back to Dashboard'}</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <h1 className="text-xl font-semibold text-gray-900 truncate">
          {bookTitle || 'Book Preview'}
        </h1>
      </div>

      {/* Center Section - View Mode Toggle */}
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-sm text-gray-600">View Mode:</span>
        <div className="flex bg-gray-100 rounded-md p-1">
          <button
            onClick={() => onViewModeChange('single')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'single'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single Page
          </button>
          <button
            onClick={() => onViewModeChange('dual')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'dual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dual Page
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Publish Button - Only show if not published */}
        {!isPublished && (
          <div className="flex flex-col items-center">
            <button
              onClick={onPublish}
              disabled={isPublishing || !isBookComplete}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                isPublishing || !isBookComplete
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isPublishing ? (
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPublishing ? 'Publishing...' : 'Publish Book'}
              </span>
            </button>
            {!isBookComplete && !isPublishing && (
              <span className="text-xs text-gray-500 mt-1">
                Complete the book to publish
              </span>
            )}
          </div>
        )}

        {/* Author Mode Toggle - Only show if not published */}
        {!isPublished && (
          <button
            onClick={() => onAuthorModeChange(!authorMode)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              authorMode
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {authorMode ? <User className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">
              {authorMode ? 'Author Mode' : 'Preview Mode'}
            </span>
          </button>
        )}

        {/* Settings Button (only in author mode and not published) */}
        {!isPublished && authorMode && (
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        )}

        {/* User Profile Dropdown */}
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
               <p className="text-xs text-gray-300">{isReaderMode ? 'Reader' : 'Author'}</p>
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
                                 {/* Mode Switch */}
                 {isReaderMode ? (
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
                 ) : (
                   <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                         <BookOpen className="w-4 h-4 text-white" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-medium text-gray-900">Switch to Reader Mode</h4>
                         <p className="text-sm text-gray-600">Browse and read books</p>
                       </div>
                       <button 
                         onClick={() => {
                           setShowUserDropdown(false);
                           navigate('/main');
                         }}
                         className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                       >
                         Switch
                       </button>
                     </div>
                   </div>
                 )}

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
  );
};

export default PreviewHeader; 