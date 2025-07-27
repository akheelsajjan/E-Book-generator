import React from 'react';

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  sortBy, 
  setSortBy,
  filteredCount,
  totalCount,
  onClearFilters 
}) => {
  const hasActiveFilters = searchTerm || statusFilter !== 'all' || sortBy !== 'recent';

  return (
    <div className="search-container">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full pl-10 pr-4 py-3 bg-glass border-border text-primary placeholder-secondary"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full px-3 py-3 bg-glass border-border text-primary"
          >
            <option value="all">All Books</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-full px-3 py-3 bg-glass border-border text-primary"
          >
            <option value="recent">Recent</option>
            <option value="title">Title A-Z</option>
            <option value="chapters">Most Chapters</option>
            <option value="updated">Last Updated</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="btn-secondary px-4 py-3 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Results count */}
      {filteredCount !== totalCount && (
        <div className="mt-4 text-sm text-secondary flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Showing {filteredCount} of {totalCount} books</span>
        </div>
      )}
    </div>
  );
};

export default SearchFilters; 