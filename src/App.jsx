import React, { useState } from 'react';
import BookEditor from './components/BookEditor';
import BookBuilder from './components/BookBuilder';
import './App.css';
function App() {
  const [currentView, setCurrentView] = useState('editor'); //editor' or 'bookBuilder'
  const [bookTitle, setBookTitle] = useState('My First eBook');

  const handleSwitchToBookBuilder = () => {
    setCurrentView('bookBuilder');
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
  };

  return (
    <div className="App">
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