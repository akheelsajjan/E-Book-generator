import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useRef } from 'react';
import { ArrowLeft, Lightbulb, BarChart3, Eye, Download, Plus, BookOpen, FileText, Star, Zap, Lightbulb as LightbulbIcon, User, List } from 'lucide-react';
import EditorView from './EditorView';
import BookBuilderView from './BookBuilderView';

const AI_FEATURES = [
  { key: 'aiWriter', label: 'AI Writer', icon: '✍️' },
  { key: 'aiEnhancer', label: 'AI Enhancer', icon: '✨' },
  { key: 'aiOutline', label: 'AI Outline', icon: '📋' },
  { key: 'aiAssistant', label: 'AI Assistant', icon: '🤖' },
  { key: 'aiSuggestions', label: 'AI Suggestions', icon: '💡' },
  { key: 'aiResearch', label: 'AI Research', icon: '🔍' },
  { key: 'aiAnalysis', label: 'AI Analysis', icon: '📊' },
  { key: 'aiGrammar', label: 'AI Grammar Check', icon: '📝' },
  { key: 'aiPlagiarism', label: 'AI Plagiarism Check', icon: '🔒' },
];

const BookEditorMain = ({ book: bookProp, setBook }) => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debug logging
  console.log('BookEditorMain - Book prop received:', bookProp);
  console.log('BookEditorMain - Book ID from params:', bookId);
  
  // Add custom styles for range sliders
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .draggable-text:hover {
        opacity: 0.8;
        transform: scale(1.02);
        transition: all 0.2s ease;
      }
      .draggable-text:active {
        cursor: grabbing;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // State for view switching
  const [currentView, setCurrentView] = useState('editor'); // 'editor' or 'bookBuilder'
  
  // Use book data from props, with fallback for development
  const bookData = bookProp || {
    id: bookId,
    title: 'My First eBook',
    chapters: []
  };

  // Ensure chapters array exists
  if (!bookData.chapters) {
    bookData.chapters = [];
  }

  // AI Settings State
  const [aiSettings, setAiSettings] = useState({
    aiWriter: true,
    aiEnhancer: true,
    aiOutline: false,
    aiAssistant: true,
    aiSuggestions: true,
    aiResearch: false,
    aiAnalysis: false,
    aiGrammar: true,
    aiPlagiarism: false
  });

  // AI Dropdown State
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const aiDropdownRef = useRef(null);

  // Click outside handler for AI dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) {
        setAiDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate progress
  const calculateProgress = () => {
    const totalPages = bookData.chapters.reduce((total, chapter) => {
      return total + chapter.pages.length;
    }, 0);
    
    const completedPages = bookData.chapters.reduce((total, chapter) => {
      return total + chapter.pages.filter(page => page.status === 'completed').length;
    }, 0);
    
    return totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;
  };

  // Handle AI setting changes
  const handleAiSettingChange = (key) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {currentView === 'editor' ? (
        <EditorView
          book={bookData}
          setBook={setBook}
          aiSettings={aiSettings}
          aiDropdownOpen={aiDropdownOpen}
          setAiDropdownOpen={setAiDropdownOpen}
          aiDropdownRef={aiDropdownRef}
          calculateProgress={calculateProgress}
          handleAiSettingChange={handleAiSettingChange}
          onSwitchToBookBuilder={() => setCurrentView('bookBuilder')}
          AI_FEATURES={AI_FEATURES}
        />
      ) : (
        <BookBuilderView
          book={bookData}
          setBook={setBook}
          aiSettings={aiSettings}
          aiDropdownOpen={aiDropdownOpen}
          setAiDropdownOpen={setAiDropdownOpen}
          aiDropdownRef={aiDropdownRef}
          calculateProgress={calculateProgress}
          handleAiSettingChange={handleAiSettingChange}
          onSwitchToEditor={() => setCurrentView('editor')}
          AI_FEATURES={AI_FEATURES}
        />
      )}
    </>
  );
};

export default BookEditorMain; 