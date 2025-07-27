import React from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';

const DashboardHeader = ({ onCreateBook, onSignOut }) => {
  const { user } = useAuth();

  return (
    <header className="glass-effect border-b border-border mb-8">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Company Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text-blue">Ebook-AI</h1>
          </div>

          {/* Right Section - Profile & Actions */}
          <div className="flex items-center space-x-4">
            {/* Create Book Button */}
            <button
              onClick={onCreateBook}
              className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Book</span>
            </button>

            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-primary">
                  {user?.displayName || user?.email}
                </p>
                <p className="text-xs text-secondary">Author</p>
              </div>
              
              {/* Profile Avatar */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                className="p-2 text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-glass-hover"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 