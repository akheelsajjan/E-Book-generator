import React from 'react';
import { formatTimestamp } from '../../lib/utils';

const BookCard = ({ book, onEdit, onPreview, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      default:
        return 'Unknown';
    }
  };

  const getProgressPercentage = (book) => {
    if (!book.chapters || book.chapters.length === 0) return 0;
    const completedChapters = book.chapters.filter(chapter => chapter.status === 'completed').length;
    return Math.round((completedChapters / book.chapters.length) * 100);
  };

  return (
    <div className="book-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
      {/* Header with cover image placeholder and status */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xs text-gray-500">Cover Image</p>
          </div>
        </div>
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(book.status)}`}>
          {getStatusText(book.status)}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {book.cover?.title || book.title || 'Untitled Book'}
          </h3>
          {book.cover?.subtitle && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {book.cover.subtitle}
            </p>
          )}
          {book.cover?.author && (
            <p className="text-xs text-gray-500 mb-3">
              By {book.cover.author}
            </p>
          )}
        </div>
        
        {book.description && (
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
            {book.description}
          </p>
        )}

        {/* Progress bar for draft books */}
        {book.status === 'draft' && book.chapters && book.chapters.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium text-gray-700">{getProgressPercentage(book)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(book)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Metadata */}
        <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {book.updatedAt && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated {formatTimestamp(book.updatedAt)}
              </span>
            )}
            {book.chapters && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {book.chapters.length} chapter{book.chapters.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          {book.status === 'draft' && (
            <button 
              onClick={() => onEdit(book.id)}
              className="flex-1 btn-primary text-sm py-2"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
          <button 
            onClick={() => onPreview(book.id)}
            className="flex-1 btn-secondary text-sm py-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <button 
            onClick={() => onDelete(book.id)}
            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
            title="Delete book"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 