// Gemini API Configuration
export const GEMINI_CONFIG = {
  model: 'gemini-1.5-flash', // Default model to use
  maxTokens: 4096, // Maximum tokens for response
  temperature: 0.7, // Creativity level (0.0 to 1.0)
};

// Helper function to get API key from localStorage
export const getGeminiApiKey = () => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key is not configured. Please add your API key in Settings > API Keys.');
  }
  return apiKey;
};

// Helper function to check if API key is configured
export const isGeminiConfigured = () => {
  try {
    const apiKey = getGeminiApiKey();
    return apiKey && apiKey.trim() !== '';
  } catch (error) {
    return false;
  }
}; 