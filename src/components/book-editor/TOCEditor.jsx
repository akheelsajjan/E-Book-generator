import React from 'react';
import { FileText, Settings } from 'lucide-react';

const TOCEditor = ({ book, setBook, onTOCDataChange }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Table of Contents</h3>
        <p className="text-blue-700 text-sm">
          Manage your table of contents and chapter structure.
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <FileText className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Edit Features Coming Soon
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Advanced table of contents editing features are currently in development. 
            The preview shows your current chapter and page structure.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Planned Features:</h5>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Custom TOC entry management</li>
              <li>• Page number configuration</li>
              <li>• Chapter summary editing</li>
              <li>• Drag-and-drop reordering</li>
              <li>• Advanced formatting options</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Structure Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-4 h-4 mr-2 text-blue-600" />
          Current Structure
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Chapters</span>
            <span className="text-sm text-gray-500">{book?.chapters?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Total Pages</span>
            <span className="text-sm text-gray-500">
              {book?.chapters?.reduce((total, chapter) => total + (chapter.pages?.length || 0), 0) || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TOCEditor; 