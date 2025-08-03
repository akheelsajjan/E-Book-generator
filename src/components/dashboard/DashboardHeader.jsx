import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { User, CreditCard, Key, Settings, ChevronDown, LogOut, BookOpen } from 'lucide-react';

const DashboardHeader = ({ onCreateBook, onSignOut, user }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
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
    setShowDropdown(false);
    navigate('/settings/api-keys');
  };

  const handleSettingsConfigure = () => {
    setShowDropdown(false);
    // TODO: Navigate to general settings page
    console.log('Settings clicked');
  };

  const handleSubscriptionUpgrade = () => {
    setShowDropdown(false);
    // TODO: Navigate to subscription page
    console.log('Upgrade clicked');
  };

  return (
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

          {/* Right Side - User Actions and Profile */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Create New Book Button - Only show if onCreateBook is provided */}
            {onCreateBook && (
              <button
                onClick={() => {
                  console.log('Button clicked!');
                  onCreateBook();
                }}
                className="create-book-btn flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Create New Book</span>
              </button>
            )}

            {/* User Profile Dropdown - Always Right Aligned */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
              >
                {/* User Info */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-gray-300">Author</p>
                </div>
                
                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20 hover:border-white/30 transition-all duration-200">
                  {getUserInitial()}
                </div>
                
                {/* Dropdown Arrow */}
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
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
                    {/* Reader Mode Switch */}
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
                            setShowDropdown(false);
                            navigate('/main');
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
                      onClick={onSignOut}
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
  );
};

export default DashboardHeader; 