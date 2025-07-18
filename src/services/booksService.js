import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateBookId } from '../lib/utils';

// Get all books for a user
export const getUserBooks = async (userId) => {
  try {
    const booksRef = collection(db, 'books');
    const q = query(
      booksRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const books = [];
    
    querySnapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return books;
  } catch (error) {
    console.error('Error fetching user books:', error);
    throw error;
  }
};

// Get a single book by ID
export const getBook = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);
    
    if (bookSnap.exists()) {
      return {
        id: bookSnap.id,
        ...bookSnap.data()
      };
    } else {
      throw new Error('Book not found');
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

// Create a new book
export const createBook = async (userId, bookData) => {
  try {
    const booksRef = collection(db, 'books');
    const newBook = {
      ...bookData,
      userId,
      status: 'draft', // draft, published
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      chapters: [],
      cover: {
        title: '',
        subtitle: '',
        author: '',
        background: ''
      },
      author: {
        name: '',
        bio: ''
      },
      preface: '',
      backMatter: ''
    };
    
    const docRef = await addDoc(booksRef, newBook);
    return {
      id: docRef.id,
      ...newBook
    };
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

// Update a book
export const updateBook = async (bookId, updates) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// Publish a book
export const publishBook = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error publishing book:', error);
    throw error;
  }
};

// Mock data for development
export const getMockBooks = () => {
  return [
    {
      id: '1',
      title: 'Sample Published Book',
      description: 'This is a sample published book description that demonstrates the full capabilities of our eBook platform.',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      cover: {
        title: 'Sample Published Book',
        subtitle: 'A Journey Through Technology',
        author: 'John Doe'
      },
      chapters: [
        { id: '1', title: 'Introduction', status: 'completed' },
        { id: '2', title: 'Getting Started', status: 'completed' },
        { id: '3', title: 'Advanced Concepts', status: 'completed' }
      ]
    },
    {
      id: '2',
      title: 'Sample Draft Book',
      description: 'This is a sample draft book description that shows how books in progress are displayed.',
      status: 'draft',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      cover: {
        title: 'Sample Draft Book',
        subtitle: 'The Art of Writing',
        author: 'Jane Smith'
      },
      chapters: [
        { id: '1', title: 'Chapter 1', status: 'completed' },
        { id: '2', title: 'Chapter 2', status: 'in-progress' },
        { id: '3', title: 'Chapter 3', status: 'not-started' }
      ]
    },
    {
      id: '3',
      title: 'The Complete Guide to React',
      description: 'A comprehensive guide to building modern web applications with React, covering everything from basics to advanced patterns.',
      status: 'published',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-25'),
      cover: {
        title: 'The Complete Guide to React',
        subtitle: 'From Beginner to Expert',
        author: 'Sarah Johnson'
      },
      chapters: [
        { id: '1', title: 'Introduction to React', status: 'completed' },
        { id: '2', title: 'Components and Props', status: 'completed' },
        { id: '3', title: 'State and Lifecycle', status: 'completed' },
        { id: '4', title: 'Hooks', status: 'completed' },
        { id: '5', title: 'Advanced Patterns', status: 'completed' }
      ]
    },
    {
      id: '4',
      title: 'JavaScript Fundamentals',
      description: 'Learn the core concepts of JavaScript programming language with practical examples and exercises.',
      status: 'draft',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22'),
      cover: {
        title: 'JavaScript Fundamentals',
        subtitle: 'Master the Basics',
        author: 'Mike Wilson'
      },
      chapters: [
        { id: '1', title: 'Variables and Data Types', status: 'completed' },
        { id: '2', title: 'Functions', status: 'completed' },
        { id: '3', title: 'Objects and Arrays', status: 'in-progress' },
        { id: '4', title: 'DOM Manipulation', status: 'not-started' },
        { id: '5', title: 'Async Programming', status: 'not-started' }
      ]
    },
    {
      id: '5',
      title: 'Design Patterns in Software',
      description: 'Explore common design patterns used in software development with real-world examples and best practices.',
      status: 'published',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-28'),
      cover: {
        title: 'Design Patterns in Software',
        subtitle: 'Best Practices for Developers',
        author: 'Emily Chen'
      },
      chapters: [
        { id: '1', title: 'Creational Patterns', status: 'completed' },
        { id: '2', title: 'Structural Patterns', status: 'completed' },
        { id: '3', title: 'Behavioral Patterns', status: 'completed' },
        { id: '4', title: 'Anti-Patterns', status: 'completed' }
      ]
    },
    {
      id: '6',
      title: 'Machine Learning Basics',
      description: 'An introduction to machine learning concepts, algorithms, and practical applications for beginners.',
      status: 'draft',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-30'),
      cover: {
        title: 'Machine Learning Basics',
        subtitle: 'A Beginner\'s Guide',
        author: 'David Brown'
      },
      chapters: [
        { id: '1', title: 'Introduction to ML', status: 'completed' },
        { id: '2', title: 'Supervised Learning', status: 'in-progress' },
        { id: '3', title: 'Unsupervised Learning', status: 'not-started' },
        { id: '4', title: 'Neural Networks', status: 'not-started' }
      ]
    }
  ];
}; 