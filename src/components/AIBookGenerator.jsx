import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { generateBookWithAI } from '../services/geminiService';
import { createChapter, createPage, updateBook, createBook } from '../services/booksService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AIBookGenerator = ({ 
  bookDescription, 
  genre, 
  targetAudience, 
  numberOfChapters,
  onSuccess,
  onError 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const constructPrompt = () => {
    return `You're an AI writing assistant. Based on the following user input, generate a complete book structure in JSON format.

Inputs:

Book Idea: "${bookDescription}"

Genre: "${genre}"

Target Audience: "${targetAudience}"

Chapters: ${numberOfChapters}

Output JSON schema:
{
"title": "Book Title",
"description": "Short overview of the book",
"chapters": [
{
"title": "Chapter 1 Title",
"pages": [
{
"title": "Page 1 Title",
"content": "Full page content here"
}
]
}
]
}

Keep chapter count limited to ${numberOfChapters}. Each chapter should have 1–3 pages max and max 1000 characters per page.
Return only the JSON object. No extra explanation or formatting.`;
  };

  const generateBook = async () => {
    if (!user) {
      setError('You must be logged in to create a book');
      return;
    }

    if (!bookDescription || !genre || !targetAudience) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationStep('Generating book structure...');

    try {
      // Step 1: Generate book content with AI
      const prompt = constructPrompt();
      setGenerationStep('Sending request to AI...');
      
      const aiResponse = await generateBookWithAI(prompt);
      
      // Log the Gemini response
      console.log('-----Response from gemini--------');
      console.log(aiResponse);
      console.log('--------------------------------------');
      
      setGenerationStep('Parsing AI response...');

      // Step 2: Parse the JSON response
      let bookData;
      try {
        // Clean the response to remove any markdown formatting
        const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
        bookData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('AI Response:', aiResponse);
        throw new Error('Failed to parse AI response. Please try again.');
      }

      // Step 3: Validate the parsed data
      if (!bookData.title || !bookData.chapters || !Array.isArray(bookData.chapters)) {
        console.error('Invalid book structure:', bookData);
        throw new Error('Invalid book structure received from AI. Please try again.');
      }

      // Validate chapters structure
      for (let i = 0; i < bookData.chapters.length; i++) {
        const chapter = bookData.chapters[i];
        if (!chapter.title || !chapter.pages || !Array.isArray(chapter.pages)) {
          console.error('Invalid chapter structure:', chapter);
          throw new Error(`Invalid structure for chapter ${i + 1}. Please try again.`);
        }
        
        // Validate pages in chapter
        for (let j = 0; j < chapter.pages.length; j++) {
          const page = chapter.pages[j];
          if (!page.content) {
            console.error('Invalid page structure:', page);
            throw new Error(`Invalid structure for page ${j + 1} in chapter ${i + 1}. Please try again.`);
          }
        }
      }

      setGenerationStep('Creating book in database...');

      // Step 4: Create book directly without default chapter
      const bookCreationData = {
        title: bookData.title || 'AI Generated Book',
        author: 'AI Generated',
        genre: genre,
        language: 'en',
        description: bookData.description || bookDescription,
        // Populate About Book fields
        shortDescription: bookData.description || bookDescription,
        fullDescription: bookData.description || bookDescription,
        tags: genre,
        tone: 'thoughtful',
        publishedYear: new Date().getFullYear(),
        viewType: 'page',
        aiGenerated: true,
        aiContent: {
          originalPrompt: prompt,
          generatedResponse: aiResponse
        }
      };

      const result = await createBook(user.uid, bookCreationData);
      
      if (result) {
        setGenerationStep('Book created successfully!');
        
        // Step 5: Create chapters and pages in Firebase
        const bookId = result.id;
        console.log('Creating AI-generated chapters and pages for book:', bookId);
        await createChaptersAndPages(bookId, bookData.chapters);
        
        // Step 6: Navigate to editor
        setTimeout(() => {
          navigate(`/editor/${bookId}`);
          onSuccess && onSuccess();
        }, 1000);
      }
    } catch (err) {
      console.error('Error generating book:', err);
      setError(err.message || 'Failed to generate book. Please try again.');
      onError && onError(err.message);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const createChaptersAndPages = async (bookId, chapters) => {
    try {
      console.log('-----Creating AI-generated chapters and pages-----');
      console.log('Book ID:', bookId);
      console.log('Number of chapters to create:', chapters.length);
      console.log('Chapters data:', chapters);
      
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        console.log(`Creating chapter ${i + 1}:`, chapter.title);
        
        // Create chapter
        const chapterData = {
          title: chapter.title,
          description: chapter.description || `Chapter ${i + 1}: ${chapter.title}`,
          order: i + 1,
          isVisible: true,
          includeInTOC: true,
          pageBreakBefore: false,
          pageBreakAfter: false,
          wordCount: 0,
          estimatedReadingTime: 0,
          status: 'completed'
        };
        
        const chapterId = await createChapter(bookId, chapterData);
        console.log(`✅ Created chapter ${i + 1}:`, chapterId, chapter.title);
        
        // Create pages for this chapter
        if (chapter.pages && Array.isArray(chapter.pages)) {
          console.log(`Creating ${chapter.pages.length} pages for chapter ${i + 1}`);
          
          for (let j = 0; j < chapter.pages.length; j++) {
            const page = chapter.pages[j];
            console.log(`Creating page ${j + 1} for chapter ${i + 1}:`, page.title || `Page ${j + 1}`);
            
            const pageData = {
              title: page.title || `Page ${j + 1}`,
              content: page.content,
              pageType: 'text',
              order: j + 1,
              alignment: 'left',
              fontSize: 14,
              fontFamily: 'Arial',
              fontWeight: 'normal',
              color: '#000000',
              backgroundColor: '#ffffff',
              margins: 16,
              padding: 16,
              pageBreakBefore: false,
              pageBreakAfter: false,
              showPageNumber: true,
              showHeader: false,
              showFooter: false,
              isVisible: true
            };
            
            const pageId = await createPage(bookId, chapterId, pageData);
            console.log(`✅ Created page ${j + 1} for chapter ${i + 1}:`, pageId, page.title || `Page ${j + 1}`);
          }
        } else {
          console.log(`⚠️ No pages found for chapter ${i + 1}`);
        }
      }
      
      console.log('✅ All AI-generated chapters and pages created successfully');
      console.log('-----End of chapter/page creation-----');
    } catch (error) {
      console.error('❌ Error creating chapters and pages:', error);
      throw new Error('Failed to create chapters and pages. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Generation Status */}
      {isGenerating && (
        <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center">
          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          <div>
            <div className="font-medium">Generating your book...</div>
            <div className="text-sm opacity-75">{generationStep}</div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {generationStep === 'Book created successfully!' && (
        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
          <CheckCircle className="w-5 h-5 mr-3" />
          <div>
            <div className="font-medium">Book generated successfully!</div>
            <div className="text-sm opacity-75">Redirecting to editor...</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 mr-3" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateBook}
        disabled={isGenerating || !bookDescription || !genre || !targetAudience}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {generationStep || 'Generating...'}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </>
        )}
      </button>
    </div>
  );
};

export default AIBookGenerator; 