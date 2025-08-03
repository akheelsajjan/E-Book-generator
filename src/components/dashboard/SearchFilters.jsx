import React from 'react';
import { Search, Filter, SortAsc, ChevronDown } from 'lucide-react';

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

  const statusOptions = [
    { value: 'all', label: 'All Books' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'in-progress', label: 'In Progress' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5 group-hover:text-indigo-600 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 shadow-md hover:shadow-lg text-gray-800 placeholder-gray-500 transition-all duration-300 group-hover:border-indigo-300 group-hover:shadow-xl"
            />
        </div>

        {/* Status Filter */}
        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-4 h-4 group-hover:text-indigo-600 transition-colors duration-200" />
                      <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 shadow-md hover:shadow-lg text-gray-800 appearance-none cursor-pointer transition-all duration-300 group-hover:border-indigo-300 group-hover:shadow-xl"
            >
            <option value="all">All Books</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="in-progress">In Progress</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-4 h-4 pointer-events-none group-hover:text-indigo-600 transition-colors duration-200" />
        </div>

        {/* Sort Filter */}
        <div className="relative group">
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-4 h-4 group-hover:text-indigo-600 transition-colors duration-200" />
                      <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 shadow-md hover:shadow-lg text-gray-800 appearance-none cursor-pointer transition-all duration-300 group-hover:border-indigo-300 group-hover:shadow-xl"
            >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-4 h-4 pointer-events-none group-hover:text-indigo-600 transition-colors duration-200" />
        </div>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || statusFilter !== 'all' || sortBy !== 'recent') && (
        <div className="flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-3 py-1 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters; 