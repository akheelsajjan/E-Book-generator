// Simple test to verify Gemini API integration
import { testGeminiConnection, generateText } from './services/geminiService.js';

async function testGemini() {
  console.log('Testing Gemini API connection...');
  
  try {
    // Test connection
    const connectionResult = await testGeminiConnection();
    console.log('Connection test result:', connectionResult);
    
    if (connectionResult.success) {
      console.log('✅ Gemini API connection successful!');
      
      // Test basic text generation
      const testPrompt = 'Write a short paragraph about artificial intelligence.';
      console.log('Testing text generation with prompt:', testPrompt);
      
      const generatedText = await generateText(testPrompt);
      console.log('Generated text:', generatedText);
      console.log('✅ Text generation successful!');
    } else {
      console.log('❌ Gemini API connection failed:', connectionResult.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testGemini(); 