import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.jsx';
import { addDoc, collection, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useCreateBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const createBook = async (bookData) => {
    if (!user) {
      setError('You must be logged in to create a book');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the book document data
      const bookDocument = {
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        genre: bookData.genre,
        language: bookData.language || 'en',
        description: bookData.description.trim() || '',
        viewType: bookData.viewType || 'page',
        userId: user.uid,
        status: 'draft',
        progress: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Initialize empty structure for editor
        chapters: [],
        cover: {
          title: bookData.title.trim(),
          subtitle: '',
          author: bookData.author.trim(),
          background: ''
        },
        author: {
          name: bookData.author.trim(),
          bio: ''
        },
        preface: '',
        backMatter: ''
      };

      let bookId, chapterId, pageId;

      try {
        // Step 1: Create book document
        const booksRef = collection(db, 'books');
        const docRef = await addDoc(booksRef, bookDocument);
        bookId = docRef.id;
        console.log('Book created successfully with ID:', bookId);

        // Step 2: Create default chapter
        const chaptersRef = collection(db, 'books', bookId, 'chapters');
        const chapterDoc = await addDoc(chaptersRef, {
          title: "Introduction",
          description: "Welcome to your book! This chapter introduces your main topic and sets the stage for what readers will learn.",
          order: 1,
          isVisible: true,
          includeInTOC: true,
          pageBreakBefore: false,
          pageBreakAfter: false,
          wordCount: 0,
          estimatedReadingTime: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        chapterId = chapterDoc.id;
        console.log('Chapter created successfully with ID:', chapterId);

        // Step 3: Create default page inside the chapter
        const pagesRef = collection(db, 'books', bookId, 'chapters', chapterId, 'pages');
        
        // Set default content based on view type
        const defaultContent = bookData.viewType === 'page' 
          ? `Welcome to "${bookData.title.trim()}"!

This is your first page. Start writing your introduction here. Consider including:

• What this book is about
• Who it's written for
• What readers will learn
• How to use this book

Take your time to craft a compelling introduction that draws readers in and sets clear expectations for what's to come.` 
          : `Welcome to "${bookData.title.trim()}"!

This is your first chapter. Start writing your introduction here. Consider including:

• What this book is about
• Who it's written for
• What readers will learn
• How to use this book

Take your time to craft a compelling introduction that draws readers in and sets clear expectations for what's to come.`;
        
        const pageDoc = await addDoc(pagesRef, {
          title: "",
          content: defaultContent,
          pageType: "text",
          order: 1,
          alignment: "left",
          fontSize: 14,
          fontFamily: "Arial",
          fontWeight: "normal",
          color: "#000000",
          backgroundColor: "#ffffff",
          margins: 16,
          padding: 16,
          pageBreakBefore: false,
          pageBreakAfter: false,
          showPageNumber: true,
          showHeader: false,
          showFooter: false,
          isVisible: true,
          updatedAt: serverTimestamp()
        });
        pageId = pageDoc.id;
        console.log('Page created successfully with ID:', pageId);

        // Navigate to the editor
        navigate(`/editor/${bookId}`);

        return { bookId, chapterId, pageId };
      } catch (error) {
        // Rollback: If any step fails, delete the book document
        if (bookId) {
          try {
            const bookRef = doc(db, 'books', bookId);
            await deleteDoc(bookRef);
            console.log('Rollback: Book document deleted due to error');
          } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error creating book:', error);
      
      // Handle specific Firestore errors
      let errorMessage = 'Failed to create book. Please try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to create books.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.code === 'resource-exhausted') {
        errorMessage = 'Service quota exceeded. Please try again later.';
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    createBook,
    loading,
    error,
    resetError
  };
}; 