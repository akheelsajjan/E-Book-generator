import { generateContentWithAI } from './geminiService';

class BookBuilderAIService {
  constructor() {
    this.originalContent = null;
    this.isProcessing = false;
    this.currentAction = null;
    this.currentField = null;
  }

  /**
   * Execute an AI action for Book Builder components
   * @param {Object} config - Configuration object
   * @param {string} config.label - Button label
   * @param {string} config.tooltip - Tooltip text
   * @param {Function} config.promptBuilder - Function that builds the prompt from current text
   * @param {Function} config.onResponse - Optional callback to handle response
   * @param {string} currentContent - Current field content
   * @param {Function} updateContent - Function to update field content
   * @param {Function} onError - Error callback
   * @param {Function} onSuccess - Success callback
   * @param {Object} options - Additional options
   * @param {string} options.selectedLanguage - Selected language for translation
   * @param {string} options.targetField - Target field name
   * @param {string} options.fieldType - Type of field (title, description, etc.)
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
    selectedLanguage = null,
    targetField = 'content',
    fieldType = 'text'
  }) {
    try {
      // Validate minimum content requirement
      if (!currentContent || currentContent.trim().length < 5) {
        const error = `Enter more content before using AI enhancement. (Minimum 5 characters required)`;
        onError && onError(error);
        return;
      }

      // Store original content for revert functionality
      if (!this.originalContent) {
        this.originalContent = currentContent;
        this.originalField = targetField;
        console.log('Stored original content for field:', targetField, this.originalContent);
      }

      this.isProcessing = true;
      this.currentAction = label;
      this.currentField = targetField;

      // Build the prompt using the provided function
      let prompt;
      if (selectedLanguage) {
        prompt = promptBuilder(currentContent, selectedLanguage);
      } else {
        prompt = promptBuilder(currentContent);
      }

      // Call Gemini API
      console.log('Sending prompt to Gemini:', prompt);
      const response = await generateContentWithAI(prompt);
      console.log('Received response from Gemini:', response);

      // Handle the response
      if (onResponse) {
        // Custom response handler
        const processedContent = onResponse(currentContent, response);
        console.log('Processed content:', processedContent);
        updateContent(processedContent);
      } else {
        // Default: replace the content
        console.log('New content (replace):', response);
        updateContent(response);
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
   * @param {Function} updateContent - Function to update field content
   */
  revert(updateContent) {
    if (this.originalContent !== null) {
      updateContent(this.originalContent);
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
const bookBuilderAIService = new BookBuilderAIService();

export default bookBuilderAIService; 