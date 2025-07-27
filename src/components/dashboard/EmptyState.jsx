import React from 'react';

const EmptyState = ({ type, onCreateBook }) => {
  const getEmptyStateContent = (type) => {
    const states = {
      all: {
        title: 'No books yet',
        description: 'Start your writing journey by creating your first book.',
        icon: (
          <svg className="w-16 h-16 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        cta: 'Create Your First Book'
      },
      published: {
        title: 'No published books',
        description: 'Complete and publish your books to see them here.',
        icon: (
          <svg className="w-16 h-16 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        cta: 'Start Writing'
      },
      draft: {
        title: 'No draft books',
        description: 'Create a new book to start writing your story.',
        icon: (
          <svg className="w-16 h-16 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        cta: 'Create New Book'
      },
      'in-progress': {
        title: 'No books in progress',
        description: 'Continue working on your books to see them here.',
        icon: (
          <svg className="w-16 h-16 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        cta: 'Continue Writing'
      }
    };

    return states[type] || states.all;
  };

  const content = getEmptyStateContent(type);

  return (
    <div className="empty-state">
      <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        {content.title}
      </h3>
      <p className="text-secondary mb-6 max-w-sm mx-auto">
        {content.description}
      </p>
      <button
        onClick={onCreateBook}
        className="btn-primary flex items-center space-x-2 mx-auto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>{content.cta}</span>
      </button>
    </div>
  );
};

export default EmptyState; 