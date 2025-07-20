import React, { useState } from 'react';
import BookEditor from './components/BookEditor';
import BookBuilder from './components/BookBuilder';
import BookPreview from './pages/BookPreview';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('editor'); // 'editor', 'bookBuilder', or 'preview'
  const [bookTitle, setBookTitle] = useState('My First eBook');

  const handleSwitchToBookBuilder = () => {
    setCurrentView('bookBuilder');
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
  };

  const handleSwitchToPreview = () => {
    console.log('Switching to preview...');
    setCurrentView('preview');
  };

  const handleBackFromPreview = () => {
    setCurrentView('editor');
  };

  console.log('App rendering, currentView:', currentView);

  return (
    <div className="App">
      {currentView === 'editor' ? (
        <BookEditor 
          bookTitle={bookTitle}
          onSwitchToBookBuilder={handleSwitchToBookBuilder}
          onSwitchToPreview={handleSwitchToPreview}
        />
      ) : currentView === 'bookBuilder' ? (
        <BookBuilder 
          bookTitle={bookTitle}
          onBackToEditor={handleBackToEditor}
          onSwitchToPreview={handleSwitchToPreview}
        />
      ) : (
        <BookPreview 
          onBackToEditor={handleBackFromPreview}
        />
      )}
    </div>
  );
}

export default App; 