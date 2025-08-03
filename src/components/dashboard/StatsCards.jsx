import React from 'react';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="space-y-4">
      {/* Total Books */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 shadow-lg hover:shadow-xl border border-blue-200/50 transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">Total Books</p>
            <p className="text-3xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors">{stats.totalBooks}</p>
            </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
      {/* Published Books */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 shadow-lg hover:shadow-xl border border-green-200/50 transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-900 group-hover:text-green-800 transition-colors">{stats.published}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* In Progress Books */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 shadow-lg hover:shadow-xl border border-orange-200/50 transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-orange-900 group-hover:text-orange-800 transition-colors">{stats.inProgress}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Clock className="w-6 h-6 text-white" />
          </div>
              </div>
            </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 shadow-lg hover:shadow-xl border border-purple-200/50 transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">Completion Rate</p>
            <p className="text-3xl font-bold text-purple-900 group-hover:text-purple-800 transition-colors">{stats.completionRate}%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 