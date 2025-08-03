import { generateContentWithAI } from './geminiService';

class AIActionService {
  constructor() {
    this.originalContent = null;
    this.isProcessing = false;
    this.currentAction = null;
    this.currentField = null;
  }

  /**
   * Execute an AI action with the given configuration
   * @param {Object} config - Configuration object
   * @param {string} config.label - Button label
   * @param {string} config.tooltip - Tooltip text
   * @param {Function} config.promptBuilder - Function that builds the prompt from current text
   * @param {Function} config.onResponse - Optional callback to handle response
   * @param {string} currentContent - Current editor content
   * @param {Function} updateContent - Function to update editor content
   * @param {Function} onError - Error callback
   * @param {Function} onSuccess - Success callback
   * @param {Object} options - Additional options
   * @param {number} options.maxCharLimit - Maximum character limit
   * @param {number} options.minCharRequired - Minimum characters required for operation
   * @param {boolean} options.isAdditive - Whether this operation adds content (true) or replaces (false)
   * @param {string} options.selectedLanguage - Selected language for translation
   * @param {string} options.targetField - Target field ('title', 'chapter', or 'content')
   * @param {string} options.titleContent - Current title content (if targeting title)
   * @param {Function} options.updateTitle - Function to update title (if targeting title)
   * @param {string} options.chapterContent - Current chapter content (if targeting chapter)
   * @param {Function} options.updateChapter - Function to update chapter (if targeting chapter)
   */
  async executeAction({
    label,
    tooltip,
    promptBuilder,
    onResponse,
    currentContent,
    updateContent,
    onError,
    onSuccess,
    maxCharLimit = 1500,
    minCharRequired = 10,
    isAdditive = true,
    selectedLanguage = null,
         targetField = 'content',
     titleContent = '',
     updateTitle = null,
     chapterContent = '',
     updateChapter = null
  }) {
    try {
             // Determine which content to process based on target field
       let contentToProcess = '';
       let updateFunction = updateContent;
       
       if (targetField === 'title') {
         contentToProcess = titleContent || '';
         updateFunction = updateTitle || updateContent;
       } else if (targetField === 'chapter') {
         contentToProcess = chapterContent || '';
         updateFunction = updateChapter || updateContent;
       } else {
         // Convert HTML content to plain text for validation
         const tempDiv = document.createElement('div');
         tempDiv.innerHTML = currentContent;
         contentToProcess = tempDiv.textContent || tempDiv.innerText || '';
       }
      
      // Validate minimum content requirement
      if (contentToProcess.trim().length < minCharRequired) {
        const error = `Enter more content before using AI enhancement. (Minimum ${minCharRequired} characters required)`;
        onError && onError(error);
        return;
      }

      // Calculate current character count and available space (only for content field)
      let currentCharCount = contentToProcess.length;
      let maxAllowedNewCharacters = maxCharLimit - currentCharCount;
      
      // For content field, check character limits
      if (targetField === 'content') {
        // For additive operations, check if we have space for new content
        if (isAdditive && maxAllowedNewCharacters <= 0) {
          const error = `Text limit reached (${currentCharCount}/${maxCharLimit} characters). Cannot generate more content.`;
          onError && onError(error);
          return;
        }
      }

      // Store original content for revert functionality
      if (!this.originalContent) {
        this.originalContent = contentToProcess;
        this.originalField = targetField;
        console.log('Stored original content for field:', targetField, this.originalContent);
      }

      this.isProcessing = true;
      this.currentAction = label;
      this.currentField = targetField;

      // Build the prompt using the provided function
      // Add character limit to the prompt for additive operations
      let prompt;
      if (selectedLanguage) {
        prompt = promptBuilder(contentToProcess, selectedLanguage);
      } else {
        prompt = promptBuilder(contentToProcess);
      }
      
      if (targetField === 'content' && isAdditive && maxAllowedNewCharacters > 0) {
        prompt += `\n\nIMPORTANT: Generate no more than ${maxAllowedNewCharacters} characters to stay within the text limit.`;
      }

      // Call Gemini API
      console.log('Sending prompt to Gemini:', prompt);
      const response = await generateContentWithAI(prompt);
      console.log('Received response from Gemini:', response);

      // Handle the response
      if (onResponse) {
        // Custom response handler
        const processedContent = onResponse(contentToProcess, response);
        console.log('Processed content:', processedContent);
        
                 if (targetField === 'title') {
           // Update title field
           updateFunction({ target: { value: processedContent } });
         } else if (targetField === 'chapter') {
           // Update chapter field
           updateFunction({ target: { value: processedContent } });
         } else {
           // Convert plain text to HTML format for content field
           const htmlContent = processedContent.replace(/\n/g, '<br>');
           updateFunction({ target: { value: htmlContent } });
         }
      } else {
        // Default: append the response
        const newContent = contentToProcess + '\n\n' + response;
        console.log('New content (append):', newContent);
        
                 if (targetField === 'title') {
           // Update title field
           updateFunction({ target: { value: newContent } });
         } else if (targetField === 'chapter') {
           // Update chapter field
           updateFunction({ target: { value: newContent } });
         } else {
           // Convert plain text to HTML format for content field
           const htmlContent = newContent.replace(/\n/g, '<br>');
           updateFunction({ target: { value: htmlContent } });
         }
      }

      onSuccess && onSuccess(label, response);
      
    } catch (error) {
      console.error(`AI Action Error (${label}):`, error);
      onError && onError(error.message || `Failed to execute ${label}`);
    } finally {
      this.isProcessing = false;
      this.currentAction = null;
      this.currentField = null;
    }
  }

  /**
   * Revert to the original content
   * @param {Function} updateContent - Function to update editor content
   * @param {Function} updateTitle - Function to update title (if needed)
   * @param {Function} updateChapter - Function to update chapter (if needed)
   */
  revert(updateContent, updateTitle = null, updateChapter = null) {
    if (this.originalContent !== null) {
      if (this.originalField === 'title' && updateTitle) {
        updateTitle({ target: { value: this.originalContent } });
      } else if (this.originalField === 'chapter' && updateChapter) {
        updateChapter({ target: { value: this.originalContent } });
      } else {
        // Convert plain text to HTML format for content field revert
        const htmlContent = this.originalContent.replace(/\n/g, '<br>');
        updateContent({ target: { value: htmlContent } });
      }
      this.originalContent = null;
      this.originalField = null;
      this.currentAction = null;
      return true;
    }
    return false;
  }

  /**
   * Check if content has been modified by AI
   * @returns {boolean}
   */
  hasModifications() {
    return this.originalContent !== null;
  }

  /**
   * Get current processing state
   * @returns {boolean}
   */
  isCurrentlyProcessing() {
    return this.isProcessing;
  }

  /**
   * Get current action label
   * @returns {string|null}
   */
  getCurrentAction() {
    return this.currentAction;
  }

  /**
   * Get current field being processed
   * @returns {string|null}
   */
  getCurrentField() {
    return this.currentField;
  }

  /**
   * Reset the service state
   */
  reset() {
    this.originalContent = null;
    this.isProcessing = false;
    this.currentAction = null;
    this.currentField = null;
  }
}

// Create a singleton instance
const aiActionService = new AIActionService();

export default aiActionService; 