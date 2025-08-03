import React, { useState } from 'react';
import BookEditor from './components/BookEditor';
import BookBuilder from './components/BookBuilder';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('editor'); // 'editor' or 'bookBuilder'
  const [bookTitle, setBookTitle] = useState('My First eBook');

  const handleSwitchToBookBuilder = () => {
    setCurrentView('bookBuilder');
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
  };

  console.log('App rendering, currentView:', currentView);

  return (
    <div className="App dashboard-container">
      {currentView === 'editor' ? (
        <BookEditor 
          bookTitle={bookTitle}
          onSwitchToBookBuilder={handleSwitchToBookBuilder}
        />
      ) : (
        <BookBuilder 
          bookTitle={bookTitle}
          onBackToEditor={handleBackToEditor}
        />
      )}
    </div>
  );
}

export default App; 