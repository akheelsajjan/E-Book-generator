import React from 'react';

const BookPreview = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                {/* Left TOC Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
                        <nav className="space-y-2">
                            <a href="#cover" className="block text-blue-600 hover:text-blue-800">Book Cover</a>
                            <a href="#author" className="block text-gray-600 hover:text-gray-800">About the Author</a>
                            <a href="#preface" className="block text-gray-600 hover:text-gray-800">Preface</a>
                            <a href="#chapter1" className="block text-gray-600 hover:text-gray-800">Chapter 1: Introduction</a>
                            <a href="#chapter2" className="block text-gray-600 hover:text-gray-800">Chapter 2: Getting Started</a>
                            <a href="#backmatter" className="block text-gray-600 hover:text-gray-800">Back Matter</a>
                        </nav>
                    </div>
                </div>

                {/* Center Book Content */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="book-preview max-w-2xl w-full">
                        {/* Book Cover */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sample eBook Title</h1>
                            <p className="text-xl text-gray-600 mb-4">A Subtitle for the Book</p>
                            <p className="text-lg text-gray-700">By Author Name</p>
                        </div>

                        {/* Sample Content */}
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chapter 1: Introduction</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                This is a sample chapter introduction. The text is formatted to look like a real eBook with proper margins,
                                typography, and spacing. This preview shows how the final book will appear to readers.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                            <button className="btn-secondary">Previous</button>
                            <span className="text-gray-500">Page 1 of 10</span>
                            <button className="btn-secondary">Next</button>
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="w-16 bg-white border-l border-gray-200 p-4 flex flex-col items-center">
                    <button className="btn-primary mb-4 w-full text-sm">Back to Editor</button>
                    <button className="btn-secondary w-full text-sm mb-4">Export PDF</button>
                    <button className="btn-primary w-full text-sm">Publish</button>
                </div>
            </div>
        </div>
    );
};

export default BookPreview; 