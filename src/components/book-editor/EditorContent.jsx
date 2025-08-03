import React, { useState, useEffect, useRef } from 'react';
import { Save, Lightbulb, Zap, Bold, Italic, Type, List, ListOrdered, X, Plus, Loader2, FileText, RefreshCw, Palette, Users, BookOpen, Globe, RotateCcw, ChevronDown } from 'lucide-react';
import aiActionService from '../../services/aiActionService';
import { aiToolConfigs, aiCategories } from '../../config/aiToolConfigs';

const EditorContent = ({
  pageTitle,
  chapterTitle,
  content,
  onTitleChange,
  onChapterChange,
  onContentChange,
  lastSaved,
  viewType = 'page',
  showTitleField,
  setShowTitleField,
  getCharacterLimit,
  handleSave,
  isSaving,
  selectedAiTools = {},
  selectedCategory = 'writing',
  onDynamicMessageChange
}) => {
  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        transition: all 0.15s ease-out;
      }
      .translate-dropdown .animate-in {
        transform: scale(0.95) translateY(4px);
        opacity: 0;
      }
      .translate-dropdown .animate-in.show {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  // Determine if page has a title
  const hasTitle = pageTitle && pageTitle.trim().length > 0;
  console.log('EditorContent - pageTitle:', pageTitle, 'hasTitle:', hasTitle, 'showTitleField:', showTitleField);
  
  // Get weighted limit based on title presence
  const maxWeight = getCharacterLimit ? getCharacterLimit() : (hasTitle ? 1500 : 2000);
  
  // Calculate current weighted length
  const calculateWeightedLength = (text) => {
    if (!text) return 0;
    
    let weight = 0;
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];
      
      // Check for paragraph breaks (double line breaks)
      if (line.trim() === '' && nextLine && nextLine.trim() === '') {
        weight += 24; // Paragraph end
        continue;
      }
      
      // Check for single line breaks
      if (line.trim() === '') {
        weight += 12; // Line break
        continue;
      }
      
      // Check for markdown headings
      if (line.startsWith('# ')) {
        weight += 30; // H1 heading
        weight += line.length - 2; // Add remaining characters
        continue;
      }
      if (line.startsWith('## ')) {
        weight += 30; // H2 heading
        weight += line.length - 3; // Add remaining characters
        continue;
      }
      if (line.startsWith('### ')) {
        weight += 30; // H3 heading
        weight += line.length - 4; // Add remaining characters
        continue;
      }
      
      // Check for list bullets
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        weight += 10; // List bullet
        weight += line.length; // Add all characters including bullet
        continue;
      }
      
      // Normal text - count each character
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === ' ') {
          weight += 1; // Space
        } else {
          weight += 1; // Normal character
        }
      }
    }
    
    return weight;
  };
  
  const currentWeight = calculateWeightedLength(content);
  const isOverLimit = currentWeight > maxWeight;

  // State for translate dropdown
  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Kannada');
  
  // State for tracking focused field
  const [focusedField, setFocusedField] = useState(null); // 'title' or 'content'
  
  // State for loading indicators
  const [loadingField, setLoadingField] = useState(null); // 'title', 'chapter', or 'content'
  
  // State for dynamic guidance messages
  const [dynamicMessage, setDynamicMessage] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);

  // Set initial content in the editor
  useEffect(() => {
    const editor = document.getElementById('rich-text-editor');
    if (editor && content !== editor.innerHTML) {
      editor.innerHTML = content;
    }
  }, [content]);

  // Auto-focus content editor on component mount
  useEffect(() => {
    const editorElement = document.getElementById('rich-text-editor');
    if (editorElement && !loadingField) {
      // Small delay to ensure the element is fully rendered
      const timer = setTimeout(() => {
        editorElement.focus();
        // Set cursor to end of content if there's existing content
        if (content && content.trim().length > 0) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(editorElement);
          range.collapse(false); // false means collapse to end
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [content, loadingField]);

  // Close translate dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTranslateDropdown && !event.target.closest('.translate-dropdown')) {
        setShowTranslateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTranslateDropdown]);

  // Focus handlers for title and content fields
  const handleTitleFocus = () => {
    setFocusedField('title');
    showDynamicMessage('AI can help you refactor or translate this title.');
  };

  const handleContentFocus = () => {
    setFocusedField('content');
    showDynamicMessage('Use AI to expand, refactor, or enhance the content below.');
  };

  // Handle focus loss
  const handleBlur = () => {
    // Don't immediately clear focusedField to allow for AI operations
    // It will be cleared when user clicks elsewhere
  };

  // Function to show dynamic message with auto-clear
  const showDynamicMessage = (message, duration = 3000) => {
    // Clear existing timeout
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    
    // Set the message
    setDynamicMessage(message);
    
    // Notify parent component
    if (onDynamicMessageChange) {
      onDynamicMessageChange(message);
    }
    
    // Auto-clear after duration
    const timeout = setTimeout(() => {
      setDynamicMessage('');
      if (onDynamicMessageChange) {
        onDynamicMessageChange('');
      }
    }, duration);
    
    setMessageTimeout(timeout);
  };

  // Function to show default guidance message
  const showDefaultMessage = () => {
    showDynamicMessage('Hover over buttons or focus on fields for guidance', 2000);
  };

  // Function to clear dynamic message
  const clearDynamicMessage = () => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
      setMessageTimeout(null);
    }
    setDynamicMessage('');
    if (onDynamicMessageChange) {
      onDynamicMessageChange('');
    }
  };

  // Function to clear message and show default
  const clearMessageAndShowDefault = () => {
    clearDynamicMessage();
    // Show default message after a brief delay
    setTimeout(() => {
      showDefaultMessage();
    }, 100);
  };

  // Add animation classes when dropdown opens
  useEffect(() => {
    if (showTranslateDropdown) {
      const dropdown = document.querySelector('.translate-dropdown .animate-in');
      if (dropdown) {
        // Force reflow to ensure animation plays
        dropdown.offsetHeight;
        dropdown.classList.add('show');
      }
    } else {
      const dropdown = document.querySelector('.translate-dropdown .animate-in');
      if (dropdown) {
        dropdown.classList.remove('show');
      }
    }
  }, [showTranslateDropdown]);

  // Sync loading state with AI service
  useEffect(() => {
    const checkLoadingState = () => {
      const currentField = aiActionService.getCurrentField();
      if (currentField && aiActionService.isCurrentlyProcessing()) {
        setLoadingField(currentField);
      } else if (!aiActionService.isCurrentlyProcessing()) {
        setLoadingField(null);
      }
    };

    // Check immediately
    checkLoadingState();

    // Set up interval to check periodically
    const interval = setInterval(checkLoadingState, 100);

    return () => clearInterval(interval);
  }, []);

  // Show initial default message
  useEffect(() => {
    showDefaultMessage();
  }, []);

  // Monitor content changes for layout overflow
  useEffect(() => {
    if (editorRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        checkLayoutOverflow();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [content]);



  // State to track current formatting
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    h3: false,
    bullet: false,
    numbered: false
  });

  // State for character limit feedback
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [showPasteMessage, setShowPasteMessage] = useState(false);
  const [pasteMessage, setPasteMessage] = useState('');
  
  // Refs for layout measurement
  const editorRef = useRef(null);
  const contentRef = useRef(null);
  
  // State for layout-based limits
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [layoutLimit, setLayoutLimit] = useState(maxWeight);
  const [showLayoutWarning, setShowLayoutWarning] = useState(false);

  // Function to check current formatting
  const checkFormatting = () => {
    const editor = document.getElementById('rich-text-editor');
    if (!editor) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Check if we're in a heading or list
    let parent = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
    let inHeading = false;
    let inList = false;
    
    while (parent && parent !== editor) {
      if (parent.tagName === 'H1') {
        setCurrentFormat(prev => ({ 
          ...prev, 
          h1: true, h2: false, h3: false,
          bold: false, italic: false,
          bullet: false, numbered: false
        }));
        inHeading = true;
        break;
      } else if (parent.tagName === 'H2') {
        setCurrentFormat(prev => ({ 
          ...prev, 
          h1: false, h2: true, h3: false,
          bold: false, italic: false,
          bullet: false, numbered: false
        }));
        inHeading = true;
        break;
      } else if (parent.tagName === 'H3') {
        setCurrentFormat(prev => ({ 
          ...prev, 
          h1: false, h2: false, h3: true,
          bold: false, italic: false,
          bullet: false, numbered: false
        }));
        inHeading = true;
        break;
      } else if (parent.tagName === 'UL') {
        setCurrentFormat(prev => ({ 
          ...prev, 
          bullet: true, numbered: false,
          bold: false, italic: false,
          h1: false, h2: false, h3: false
        }));
        inList = true;
        break;
      } else if (parent.tagName === 'OL') {
        setCurrentFormat(prev => ({ 
          ...prev, 
          bullet: false, numbered: true,
          bold: false, italic: false,
          h1: false, h2: false, h3: false
        }));
        inList = true;
        break;
      }
      parent = parent.parentNode;
    }

    // If not in heading or list, check for bold and italic
    if (!inHeading && !inList) {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      
      setCurrentFormat(prev => ({
        ...prev,
        bold: isBold,
        italic: isItalic,
        h1: false,
        h2: false,
        h3: false,
        bullet: false,
        numbered: false
      }));
    }
  };

  // Rich text editor functions for WYSIWYG
  const applyFormat = (format) => {
    const editor = document.getElementById('rich-text-editor');
    if (!editor) return;

    // Check if there's a selection
    const selection = window.getSelection();
    const hasSelection = selection.toString().length > 0;

    if (hasSelection) {
      // Apply formatting to selected text
      document.execCommand(format, false, null);
    } else {
      // If no selection, apply formatting to cursor position for future typing
      document.execCommand(format, false, null);
    }
    
    editor.focus();
    
    // Update formatting state immediately
    setTimeout(checkFormatting, 10);
    
    // Check for layout overflow after formatting
    setTimeout(() => {
      checkLayoutOverflow();
    }, 50);
  };

  const insertFormat = (format) => {
    const editor = document.getElementById('rich-text-editor');
    if (!editor) return;

    let insertText = '';

    switch (format) {
      case 'h1':
        insertText = '<h1>Heading 1</h1>';
        break;
      case 'h2':
        insertText = '<h2>Heading 2</h2>';
        break;
      case 'h3':
        insertText = '<h3>Heading 3</h3>';
        break;
      case 'bullet':
        insertText = '<ul><li>List item</li></ul>';
        break;
      case 'numbered':
        insertText = '<ol><li>List item</li></ol>';
        break;
      default:
        return;
    }

    document.execCommand('insertHTML', false, insertText);
    editor.focus();
    
    // Update formatting state after a short delay
    setTimeout(checkFormatting, 10);
    
    // Check for layout overflow after inserting formatted content
    setTimeout(() => {
      checkLayoutOverflow();
    }, 50);
  };

  // Reset all formatting
  const resetFormatting = () => {
    const editor = document.getElementById('rich-text-editor');
    if (!editor) return;

    // Clear any selection first
    window.getSelection().removeAllRanges();
    
    // Remove all formatting
    document.execCommand('removeFormat', false, null);
    
    // Also remove any bold/italic from cursor position
    document.execCommand('bold', false, null);
    document.execCommand('italic', false, null);
    
    editor.focus();
    
    // Reset state
    setCurrentFormat({
      bold: false,
      italic: false,
      h1: false,
      h2: false,
      h3: false,
      bullet: false,
      numbered: false
    });
  };

  // Handle remove title
  const handleRemoveTitle = () => {
    onTitleChange({ target: { value: '' } });
    setShowTitleField(false);
  };

  // Weighted limit enforcement functions
  const isAtLimit = () => {
    return currentWeight >= maxWeight;
  };

  const getRemainingWeight = () => {
    return Math.max(0, maxWeight - currentWeight);
  };

  // Function to determine which tools are allowed for each field
  const getAllowedToolsForField = (field) => {
    if (field === 'content') {
      // All tools are allowed for content
      return null; // null means no restrictions
    } else if (field === 'title' || field === 'chapter') {
      // Only specific tools allowed for title/chapter fields
      return ['refactorText', 'translate'];
    }
    return null;
  };

  // Function to get AI tool buttons based on selected category
  const getAiToolButtons = () => {
    const category = aiCategories[selectedCategory];
    if (!category) return [];

    // Calculate current character count
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
    const currentCharCount = plainTextContent.length;
    const isAtLimit = currentCharCount >= maxWeight;

    // Get allowed tools for current field
    const allowedTools = getAllowedToolsForField(focusedField);
    
    // If no field is focused, show a message
    if (!focusedField) {
      return [
        <div key="no-field-selected" className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            <span className="font-medium">Select a field</span> (Title, Chapter, or Content) to use AI enhancements
          </div>
        </div>
      ];
    }

    const tools = category.tools.map(toolKey => {
      const config = aiToolConfigs[toolKey];
      if (!config) return null;

      const IconComponent = getIconComponent(config.icon || 'Lightbulb');
      const isProcessing = aiActionService.isCurrentlyProcessing() && aiActionService.getCurrentAction() === config.label;
      
      // Check if tool is allowed for current field
      const isToolAllowed = allowedTools === null || allowedTools.includes(toolKey);
      
      // Check if button should be disabled
      const isAdditive = config.isAdditive !== false;
      const isDisabled = !isToolAllowed || 
                        aiActionService.isCurrentlyProcessing() || 
                        (isAdditive && isAtLimit) || 
                        (plainTextContent.trim().length < (config.minCharRequired || 10)) ||
                        loadingField !== null;

      // Create tooltip with additional info
      let tooltip = config.tooltip;
      if (!isToolAllowed) {
        tooltip = 'This action is only available for page content.';
      } else if (loadingField !== null) {
        tooltip += ` (Processing ${loadingField}...)`;
      } else if (isAdditive && isAtLimit) {
        tooltip += ` (Text limit reached: ${currentCharCount}/${maxWeight} characters)`;
      } else if (plainTextContent.trim().length < (config.minCharRequired || 10)) {
        tooltip += ` (Minimum ${config.minCharRequired || 10} characters required)`;
      }

      // Special handling for translate button with dropdown
      if (toolKey === 'translate' && config.hasLanguageDropdown) {
        return (
          <div key={toolKey} className="relative translate-dropdown">
            <button
              onClick={() => setShowTranslateDropdown(!showTranslateDropdown)}
              onMouseEnter={() => {
                if (!isDisabled) {
                  showDynamicMessage('Translates selected text to the chosen language.');
                }
              }}
              onMouseLeave={clearMessageAndShowDefault}
              disabled={isDisabled}
              title={tooltip}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center shadow-lg ${
                isDisabled 
                  ? 'opacity-40 cursor-not-allowed bg-gray-400 text-gray-600' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <IconComponent className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : config.label}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showTranslateDropdown && !isDisabled && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px] animate-in">
                {/* Caret pointing down to the button */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" style={{ marginTop: '-1px' }}></div>
                
                {Object.entries(config.languages).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedLanguage(value);
                      setShowTranslateDropdown(false);
                      handleAIToolClick(toolKey, value);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-all duration-150 ease-out ${
                      selectedLanguage === value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Regular button for other tools
      return (
        <button
          key={toolKey}
          onClick={() => handleAIToolClick(toolKey)}
                      onMouseEnter={() => {
              if (!isDisabled) {
                const hoverMessages = {
                  'refactorText': 'Refines your writing for clarity.',
                  'enhanceStyle': 'Improves grammar and sentence flow.',
                  'simplifyLanguage': 'Simplifies sentences to improve readability.',
                  'convertPOV': 'Converts between first and third person.',
                  'aiWriter': 'Generates continuation of your content.',
                  'continueWriting': 'Continues writing from where you left off.',
                  'generatePageSummary': 'Creates a concise summary of the content.',
                  'addExamples': 'Adds relevant examples and analogies.',
                  'insertFacts': 'Adds supporting facts and statistics.',
                  'expandToList': 'Converts content into structured lists.',
                  'translate': 'Translates selected text to the chosen language.'
                };
                showDynamicMessage(hoverMessages[toolKey] || config.tooltip);
              }
            }}
            onMouseLeave={clearMessageAndShowDefault}
          disabled={isDisabled}
          title={tooltip}
          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center shadow-lg ${
            isDisabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-400 text-gray-600' 
              : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconComponent className="w-4 h-4 mr-2" />
          )}
          {isProcessing ? 'Processing...' : config.label}
        </button>
      );
    }).filter(Boolean);

    return tools;
  };

  // Helper function to get icon component
  const getIconComponent = (iconName) => {
    const icons = {
      Lightbulb,
      Zap,
      FileText,
      RefreshCw,
      Palette,
      Type,
      Users,
      BookOpen,
      List,
      Globe
    };
    return icons[iconName] || Lightbulb;
  };

  // Handle AI tool button click
  const handleAIToolClick = async (toolKey, selectedLanguage = null) => {
    const config = aiToolConfigs[toolKey];
    if (!config) {
      console.error('No config found for tool:', toolKey);
      return;
    }

    // Check if a field is focused
    if (!focusedField) {
      alert('Select a field (Title or Content) before using AI enhancements.');
      return;
    }

    // Check if already processing
    if (aiActionService.isCurrentlyProcessing()) {
      alert('Please wait for the current AI operation to complete.');
      return;
    }

    console.log('Executing AI tool:', toolKey, config.label, 'on field:', focusedField);

    // Set loading state for the focused field
    setLoadingField(focusedField);

    try {
      await aiActionService.executeAction({
        label: config.label,
        tooltip: config.tooltip,
        promptBuilder: config.promptBuilder,
        onResponse: config.onResponse,
        currentContent: content,
        updateContent: onContentChange,
        maxCharLimit: maxWeight,
        minCharRequired: config.minCharRequired || 5,
        isAdditive: config.isAdditive !== false, // Default to true if not specified
        selectedLanguage: selectedLanguage,
        targetField: focusedField,
        titleContent: pageTitle,
        updateTitle: onTitleChange,
        chapterContent: chapterTitle,
        updateChapter: onChapterChange,
        onError: (error) => {
          console.error('AI Action Error:', error);
          alert(`Error: ${error}`);
        },
        onSuccess: (label, response) => {
          console.log(`${label} completed successfully on ${focusedField}`);
          console.log('AI Response:', response);
        }
      });
    } catch (error) {
      console.error('AI tool error:', error);
      alert(`Failed to execute ${config.label}: ${error.message}`);
    } finally {
      // Clear loading state
      setLoadingField(null);
    }
  };

  // Handle revert button click
  const handleRevert = () => {
    const success = aiActionService.revert(onContentChange, onTitleChange, onChapterChange);
    if (!success) {
      alert('No changes to revert');
    }
  };



  // Layout measurement functions
  const measureContentHeight = () => {
    const editor = editorRef.current;
    if (!editor) return { height: 0, isOverflowing: false };
    
    // Get the content area height (excluding padding)
    const contentHeight = editor.scrollHeight;
    const containerHeight = editor.clientHeight;
    const isOverflowing = contentHeight > containerHeight;
    
    return { height: contentHeight, isOverflowing };
  };

  const calculateLayoutWeight = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    let weight = 0;
    const elements = tempDiv.querySelectorAll('*');
    
    elements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      const textContent = element.textContent || '';
      
      // Assign weights based on element type
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
          weight += textContent.length * 2; // Headings = 2x weight
          break;
        case 'li':
          weight += textContent.length * 1.5; // List items = 1.5x weight
          break;
        case 'p':
        case 'div':
          weight += textContent.length * 1; // Paragraphs = 1x weight
          break;
        case 'code':
        case 'pre':
          weight += textContent.length * 2; // Code blocks = 2x weight
          break;
        default:
          weight += textContent.length * 1; // Default = 1x weight
      }
    });
    
    return weight;
  };

  const checkLayoutOverflow = () => {
    const { isOverflowing } = measureContentHeight();
    setIsOverflowing(isOverflowing);
    
    if (isOverflowing) {
      setShowLayoutWarning(true);
      setTimeout(() => setShowLayoutWarning(false), 3000);
    }
    
    return isOverflowing;
  };

  const handleContentInput = (e) => {
    const newContent = e.target.innerHTML;
    
    // Calculate weighted length for new content
    const newWeight = calculateWeightedLength(newContent);
    
    // Check both weighted limit and layout overflow
    const weightLimitExceeded = newWeight > maxWeight;
    const layoutOverflow = checkLayoutOverflow();
    
    if (weightLimitExceeded || layoutOverflow) {
      // Prevent the change and show appropriate message
      e.preventDefault();
      e.stopPropagation();
      
      if (weightLimitExceeded) {
        setShowLimitMessage(true);
        setTimeout(() => setShowLimitMessage(false), 3000);
      }
      
      // Restore the original content
      e.target.innerHTML = content;
      return;
    }
    
    // If within both limits, allow the change
    onContentChange({ target: { value: newContent } });
  };

  const handleKeyDown = (e) => {
    // Check if we're at the limit and trying to add content
    const weightLimitReached = isAtLimit();
    const layoutOverflow = checkLayoutOverflow();
    
    if (weightLimitReached || layoutOverflow) {
      // Allow navigation keys, deletion, and formatting shortcuts
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'Tab', 'Escape', 'Enter'
      ];
      
      // Allow Ctrl/Cmd shortcuts for formatting
      if (e.ctrlKey || e.metaKey) {
        return; // Allow formatting shortcuts
      }
      
      // Allow deletion keys
      if (allowedKeys.includes(e.key)) {
        return;
      }
      
      // Block character input when at limit
      if (e.key.length === 1) {
        e.preventDefault();
        if (weightLimitReached) {
          setShowLimitMessage(true);
          setTimeout(() => setShowLimitMessage(false), 3000);
        }
        if (layoutOverflow) {
          setShowLayoutWarning(true);
          setTimeout(() => setShowLayoutWarning(false), 3000);
        }
        return;
      }
    }
    
    // Call the original checkFormatting function
    checkFormatting();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text/html') || clipboardData.getData('text');
    
    // Strip HTML tags to get plain text length
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pastedText;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const remainingWeight = getRemainingWeight();
    const layoutOverflow = checkLayoutOverflow();
    
    if (remainingWeight <= 0 || layoutOverflow) {
      // No space left
      const message = layoutOverflow 
        ? 'Content would overflow the page layout' 
        : 'No space available for pasted content';
      setPasteMessage(message);
      setShowPasteMessage(true);
      setTimeout(() => setShowPasteMessage(false), 3000);
      return;
    }
    
    // Calculate weight of pasted content
    const pastedWeight = calculateWeightedLength(plainText);
    
    if (pastedWeight <= remainingWeight) {
      // Can paste all content
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(plainText));
      }
      onContentChange({ target: { value: document.getElementById('rich-text-editor').innerHTML } });
    } else {
      // Need to trim the pasted content based on weight
      let trimmedText = '';
      let currentWeight = 0;
      
      // Find the maximum content that fits within weight limit
      const words = plainText.split(/\s+/);
      for (const word of words) {
        const testText = trimmedText + (trimmedText ? ' ' : '') + word;
        const testWeight = calculateWeightedLength(testText);
        
        if (testWeight <= remainingWeight) {
          trimmedText = testText;
          currentWeight = testWeight;
        } else {
          break;
        }
      }
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(trimmedText));
      }
      onContentChange({ target: { value: document.getElementById('rich-text-editor').innerHTML } });
      
      // Show trim message
      setPasteMessage(`Text was trimmed to fit the page (weight limit exceeded)`);
      setShowPasteMessage(true);
      setTimeout(() => setShowPasteMessage(false), 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Unified Editor Card - Page Title, Chapter, and Content */}
      <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Page Title and Chapter Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              {(showTitleField || hasTitle) ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={pageTitle}
                        onChange={onTitleChange}
                        onFocus={handleTitleFocus}
                        onBlur={handleBlur}
                        maxLength={100}
                        disabled={loadingField === 'title'}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-purple-400 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-sm ${
                          pageTitle && pageTitle.length > 80 ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/30' : 'border-purple-300'
                        } ${loadingField === 'title' ? 'opacity-75 cursor-not-allowed' : ''}`}
                        placeholder="Enter page title..."
                      />
                      {loadingField === 'title' && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleRemoveTitle}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove title"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {pageTitle && (
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>Page title for content organization</span>
                      <span>{pageTitle.length}/100 characters</span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowTitleField(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-[#4299e1] rounded-xl text-[#4299e1] hover:text-[#3182ce] hover:border-[#3182ce] hover:bg-[#4299e1]/10 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-[#4299e1]/5 to-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Page Title
                </button>
              )}
            </div>

            {/* Chapter Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={onChapterChange}
                    onFocus={() => {
                      setFocusedField('chapter');
                      showDynamicMessage('Edit or translate the chapter title. AI tools limited here.');
                    }}
                    onBlur={handleBlur}
                    maxLength={100}
                    disabled={loadingField === 'chapter'}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:border-blue-400 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm ${
                      chapterTitle && chapterTitle.length > 80 ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/30' : 'border-blue-300'
                    } ${loadingField === 'chapter' ? 'opacity-75 cursor-not-allowed' : ''}`}
                    placeholder="Enter chapter title..."
                  />
                  {loadingField === 'chapter' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>
                {chapterTitle && (
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Chapter title for book structure</span>
                    <span>{chapterTitle.length}/100 characters</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Editor Toolbar */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => applyFormat('bold')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.bold 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4 mr-1" />
                Bold
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.italic 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4 mr-1" />
                Italic
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => insertFormat('h1')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.h1 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Heading 1"
              >
                <Type className="w-4 h-4 mr-1" />
                H1
              </button>
              <button
                onClick={() => insertFormat('h2')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.h2 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Heading 2"
              >
                <Type className="w-4 h-4 mr-1" />
                H2
              </button>
              <button
                onClick={() => insertFormat('h3')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.h3 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Heading 3"
              >
                <Type className="w-4 h-4 mr-1" />
                H3
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => insertFormat('bullet')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.bullet 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Bullet List"
              >
                <List className="w-4 h-4 mr-1" />
                List
              </button>
              <button
                onClick={() => insertFormat('numbered')}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  currentFormat.numbered 
                    ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4 mr-1" />
                Numbered
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={resetFormatting}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                title="Clear All Formatting"
              >
                <X className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                {hasTitle && (
                  <div className="text-xs text-gray-500">
                    Weight limit adjusted for page title length
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <span className={`text-sm font-medium ${
                    isOverLimit ? 'text-red-500' : isAtLimit() ? 'text-orange-500' : isOverflowing ? 'text-yellow-500' : currentWeight > maxWeight * 0.9 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {currentWeight.toLocaleString()} / {maxWeight.toLocaleString()} weight
                  </span>
                  {hasTitle && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Limit adjusted based on title size
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </div>
                {isAtLimit() && (
                  <span className="text-xs text-orange-600 font-medium">
                    🔒 Limit reached
                  </span>
                )}
                {isOverflowing && (
                  <span className="text-xs text-yellow-600 font-medium">
                    📏 Layout overflow
                  </span>
                )}
                {currentWeight > maxWeight * 0.9 && !isAtLimit() && !isOverLimit && !isOverflowing && (
                  <span className="text-xs text-yellow-600">
                    ⚠️ Approaching limit
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div
                ref={editorRef}
                id="rich-text-editor"
                contentEditable={!loadingField}
                onInput={handleContentInput}
                onMouseUp={checkFormatting}
                onKeyUp={checkFormatting}
                onFocus={(e) => {
                  handleContentFocus();
                  checkFormatting(e);
                }}
                onSelectionChange={checkFormatting}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className={`w-full h-96 p-6 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 hover:border-gray-300 focus:border-purple-500 resize-none overflow-y-auto bg-gradient-to-br from-gray-50 to-white shadow-sm ${
                  isOverLimit ? 'border-red-400 bg-red-50' : isAtLimit() ? 'border-orange-400 bg-orange-50' : isOverflowing ? 'border-yellow-400 bg-yellow-50' : ''
                } ${loadingField === 'content' ? 'opacity-75 cursor-not-allowed' : ''}`}
                style={{ 
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}
                aria-label={`Content editor. ${currentWeight} of ${maxWeight} weight used. ${getRemainingWeight()} weight remaining. Layout overflow: ${isOverflowing ? 'Yes' : 'No'}.`}
              />
              {loadingField === 'content' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="flex items-center space-x-3 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                    <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-700">Enhancing content...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Character limit feedback messages */}
            {showLimitMessage && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center text-sm text-orange-600">
                  <span className="mr-2">⚠️</span>
                  <span>Maximum content length reached for this page.</span>
                </div>
              </div>
            )}
            
            {showLayoutWarning && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center text-sm text-yellow-600">
                  <span className="mr-2">⚠️</span>
                  <span>Content would overflow the page layout. Consider using shorter headings or reducing content.</span>
                </div>
              </div>
            )}
            
            {showPasteMessage && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center text-sm text-blue-600">
                  <span className="mr-2">ℹ️</span>
                  <span>{pasteMessage}</span>
                </div>
              </div>
            )}
            
            {isOverLimit && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-sm text-red-600">
                  <span className="mr-2">⚠️</span>
                  <span>
                    Weight limit exceeded. {hasTitle 
                      ? `Consider shortening the page title to increase the limit. Current limit: ${maxWeight.toLocaleString()} weight.` 
                      : 'Please reduce content to stay within the limit.'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar - Card Structure */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            {getAiToolButtons()}
          </div>
          <div className="flex items-center space-x-3">
            {/* Revert Button - Only show when AI has made changes */}
            {aiActionService.hasModifications() && (
              <button 
                onClick={handleRevert}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center shadow-lg"
                title="Revert to original content before AI changes"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Revert
              </button>
            )}
            
            <button 
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center font-semibold ${
                isOverLimit 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : isSaving 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#4299e1] text-white hover:bg-[#3182ce]'
              }`}
              disabled={isSaving || isOverLimit}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isOverLimit ? (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : isOverLimit ? 'Weight Limit Exceeded' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorContent; 