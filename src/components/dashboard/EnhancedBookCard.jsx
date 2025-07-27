import React, { useState } from 'react';
import { MoreVertical, Edit, Eye, Copy, Trash2, Calendar, BookOpen } from 'lucide-react';

const EnhancedBookCard = ({ book, onEdit, onPreview, onDelete, onDuplicate, onRename }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      published: { label: 'Published', color: 'bg-green-100 text-green-800' },
      draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' }
    };
    
    const badge = badges[status] || badges.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return d.toLocaleDateString();
  };

  const getChaptersCount = () => {
    return book.chapters?.length || 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
              {book.title || 'Untitled Book'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {book.cover?.author || book.author || 'Unknown Author'}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="ml-3">
            {getStatusBadge(book.status)}
          </div>
        </div>

        {/* Book Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{getChaptersCount()} chapters</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Updated {formatDate(book.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(book.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onPreview(book.id)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>

          {/* More Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onRename(book.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(book.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(book.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default EnhancedBookCard; 