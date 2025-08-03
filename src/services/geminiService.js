import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, getGeminiApiKey, isGeminiConfigured } from '../config/gemini.js';

// Initialize Gemini AI
let genAI = null;
let model = null;

// Initialize the Gemini client
const initializeGemini = () => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key is not configured');
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(getGeminiApiKey());
    model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: {
        maxOutputTokens: GEMINI_CONFIG.maxTokens,
        temperature: GEMINI_CONFIG.temperature,
      }
    });
  }
  
  return { genAI, model };
};

// Generate text content using Gemini
export const generateText = async (prompt, options = {}) => {
  try {
    const { model } = initializeGemini();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};

// Alias for AI action service
export const generateContentWithAI = generateText;

// Generate chapter content for books
export const generateChapterContent = async (chapterTitle, bookContext, chapterNumber) => {
  const prompt = `
    Write a detailed chapter for an e-book with the following details:
    
    Chapter Title: ${chapterTitle}
    Chapter Number: ${chapterNumber}
    Book Context: ${bookContext}
    
    Please write a comprehensive chapter that:
    1. Has a clear introduction that hooks the reader
    2. Develops the main ideas thoroughly
    3. Includes relevant examples and explanations
    4. Has a strong conclusion that ties everything together
    5. Is well-structured with proper paragraphs
    6. Uses engaging and professional language
    
    Make the content informative, engaging, and suitable for an e-book format.
  `;
  
  return await generateText(prompt);
};

// Generate book introduction/preface
export const generateBookIntroduction = async (bookTitle, bookDescription, targetAudience) => {
  const prompt = `
    Write an engaging introduction for an e-book with the following details:
    
    Book Title: ${bookTitle}
    Book Description: ${bookDescription}
    Target Audience: ${targetAudience}
    
    Please write an introduction that:
    1. Captures the reader's attention immediately
    2. Explains what the book is about and why it's valuable
    3. Sets expectations for what the reader will learn
    4. Establishes credibility and authority
    5. Has a warm, welcoming tone
    6. Is concise but comprehensive
    
    Make it compelling enough to make readers want to continue reading the book.
  `;
  
  return await generateText(prompt);
};

// Generate table of contents
export const generateTableOfContents = async (bookTitle, bookDescription, numberOfChapters = 10) => {
  const prompt = `
    Create a comprehensive table of contents for an e-book with the following details:
    
    Book Title: ${bookTitle}
    Book Description: ${bookDescription}
    Number of Chapters: ${numberOfChapters}
    
    Please create a table of contents that:
    1. Has logical chapter progression
    2. Covers all important aspects of the topic
    3. Uses clear, descriptive chapter titles
    4. Includes sub-sections where appropriate
    5. Follows a natural learning progression
    6. Is comprehensive but not overwhelming
    
    Format the response as a structured list with chapter numbers and titles.
  `;
  
  return await generateText(prompt);
};

// Generate book summary/conclusion
export const generateBookSummary = async (bookTitle, mainTopics, keyTakeaways) => {
  const prompt = `
    Write a compelling book summary/conclusion for an e-book with the following details:
    
    Book Title: ${bookTitle}
    Main Topics Covered: ${mainTopics}
    Key Takeaways: ${keyTakeaways}
    
    Please write a summary that:
    1. Recaps the main points covered in the book
    2. Reinforces the key takeaways
    3. Provides actionable next steps for readers
    4. Encourages further learning or application
    5. Has a motivational and inspiring tone
    6. Ties everything together in a satisfying conclusion
    
    Make it memorable and motivating for readers to apply what they've learned.
  `;
  
  return await generateText(prompt);
};

// Generate content based on specific requirements
export const generateCustomContent = async (contentType, requirements, context = '') => {
  const prompt = `
    Generate ${contentType} content with the following requirements:
    
    Requirements: ${requirements}
    Context: ${context}
    
    Please create content that:
    1. Meets all the specified requirements
    2. Is well-structured and professional
    3. Uses appropriate tone and style
    4. Is informative and engaging
    5. Follows best practices for ${contentType}
    
    Make the content high-quality and suitable for publication.
  `;
  
  return await generateText(prompt);
};

// Test the Gemini API connection
export const testGeminiConnection = async () => {
  try {
    const result = await generateText('Hello! Please respond with "Gemini API is working correctly."');
    return {
      success: true,
      message: 'Gemini API connection successful',
      response: result
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gemini API connection failed',
      error: error.message
    };
  }
};

// Get available models (for future use)
export const getAvailableModels = () => {
  return [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro'
  ];
};

// Generate complete book structure with AI
export const generateBookWithAI = async (prompt) => {
  try {
    const { model } = initializeGemini();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating book with AI:', error);
    throw new Error(`Failed to generate book: ${error.message}`);
  }
};

// Update model configuration
export const updateModelConfig = (newConfig) => {
  if (newConfig.model) {
    GEMINI_CONFIG.model = newConfig.model;
  }
  if (newConfig.temperature !== undefined) {
    GEMINI_CONFIG.temperature = newConfig.temperature;
  }
  if (newConfig.maxTokens) {
    GEMINI_CONFIG.maxTokens = newConfig.maxTokens;
  }
  
  // Reset the model instance to use new configuration
  genAI = null;
  model = null;
}; 