import React, { useState } from 'react';
import { MoreVertical, Edit, Eye, Copy, Trash2, Calendar, BookOpen } from 'lucide-react';

const EnhancedBookCard = ({ book, onEdit, onPreview, onDelete, onDuplicate, onRename }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      published: { label: 'Published', className: 'badge badge-published' },
      draft: { label: 'Draft', className: 'badge badge-draft' },
      'in-progress': { label: 'In Progress', className: 'badge badge-in-progress' }
    };
    
    const badge = badges[status] || badges.draft;
    return (
      <span className={badge.className}>
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
    <div className="card group hover:scale-105 transition-all duration-300">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-primary truncate mb-2">
              {book.title || 'Untitled Book'}
            </h3>
            <p className="text-sm text-secondary mb-3">
              {book.cover?.author || book.author || 'Unknown Author'}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="ml-3">
            {getStatusBadge(book.status)}
          </div>
        </div>

        {/* Book Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted">
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
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onPreview(book.id)}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>

          {/* More Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-muted hover:text-primary rounded-lg hover:bg-glass-hover transition-colors duration-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-effect shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onRename(book.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-glass-hover flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(book.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-glass-hover flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(book.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2"
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