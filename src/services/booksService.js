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
    console.log('Fetching books for user:', userId);
    const booksRef = collection(db, 'books');
    
    // First, get all books for the user without ordering
    const q = query(booksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const books = [];
    
    querySnapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort the books by updatedAt in descending order on the client side
    books.sort((a, b) => {
      const aTime = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
      const bTime = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
      return bTime - aTime;
    });
    
    console.log('Fetched books:', books.length);
    return books;
  } catch (error) {
    console.error('Error fetching user books:', error);
    throw error;
  }
};

// Get a single book by ID (basic book data only)
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

// Get complete book structure including chapters and pages
export const getBookWithChapters = async (bookId) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);
    
    if (!bookSnap.exists()) {
      throw new Error('Book not found');
    }

    const bookData = {
      id: bookSnap.id,
      ...bookSnap.data()
    };

    // Load chapters
    const chaptersRef = collection(db, 'books', bookId, 'chapters');
    const chaptersQuery = query(chaptersRef, orderBy('order', 'asc'));
    const chaptersSnapshot = await getDocs(chaptersQuery);
    
    console.log('getBookWithChapters - Chapters snapshot:', chaptersSnapshot.docs.length, 'chapters found');
    
    const chapters = [];
    
    // Load pages for each chapter
    for (const chapterDoc of chaptersSnapshot.docs) {
      const chapterData = {
        id: chapterDoc.id,
        ...chapterDoc.data()
      };

      console.log('getBookWithChapters - Processing chapter:', chapterData);

      // Load pages for this chapter
      const pagesRef = collection(db, 'books', bookId, 'chapters', chapterDoc.id, 'pages');
      const pagesQuery = query(pagesRef, orderBy('order', 'asc'));
      const pagesSnapshot = await getDocs(pagesQuery);
      
      console.log('getBookWithChapters - Pages for chapter', chapterData.title, ':', pagesSnapshot.docs.length, 'pages found');
      
      const pages = pagesSnapshot.docs.map(pageDoc => ({
        id: pageDoc.id,
        ...pageDoc.data()
      }));

      console.log('getBookWithChapters - Pages data:', pages);

      chapterData.pages = pages;
      chapters.push(chapterData);
    }

    // Add chapters to book data
    bookData.chapters = chapters;

    console.log('getBookWithChapters - Final book data being returned:', bookData);
    console.log('getBookWithChapters - Total chapters:', bookData.chapters.length);
    console.log('getBookWithChapters - Total pages:', bookData.chapters.reduce((total, chapter) => total + chapter.pages.length, 0));

    return bookData;
  } catch (error) {
    console.error('Error fetching book with chapters:', error);
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

// Create a new page in Firestore
export const createPage = async (bookId, chapterId, pageData) => {
  try {
    console.log('Creating page in Firestore:', { bookId, chapterId, pageData });
    
    const pagesRef = collection(db, 'books', bookId, 'chapters', chapterId, 'pages');
    const pageRef = await addDoc(pagesRef, {
      ...pageData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Page created successfully in Firestore with ID:', pageRef.id);
    return pageRef.id;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

// Update a page in Firestore
export const updatePage = async (bookId, chapterId, pageId, pageData) => {
  try {
    console.log('Updating page in Firestore:', { bookId, chapterId, pageId, pageData });
    
    const pageRef = doc(db, 'books', bookId, 'chapters', chapterId, 'pages', pageId);
    await updateDoc(pageRef, {
      ...pageData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Page updated successfully in Firestore');
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

// Create a new chapter in Firestore
export const createChapter = async (bookId, chapterData) => {
  try {
    console.log('Creating chapter in Firestore:', { bookId, chapterData });
    
    const chaptersRef = collection(db, 'books', bookId, 'chapters');
    const chapterRef = await addDoc(chaptersRef, {
      ...chapterData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Chapter created successfully in Firestore with ID:', chapterRef.id);
    return chapterRef.id;
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
};

// Delete a chapter from Firestore
export const deleteChapter = async (bookId, chapterId) => {
  try {
    console.log('Deleting chapter from Firestore:', { bookId, chapterId });
    
    const chapterRef = doc(db, 'books', bookId, 'chapters', chapterId);
    await deleteDoc(chapterRef);
    
    console.log('Chapter deleted successfully from Firestore');
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
};

// Delete a page from Firestore
export const deletePage = async (bookId, chapterId, pageId) => {
  try {
    console.log('Deleting page from Firestore:', { bookId, chapterId, pageId });
    
    const pageRef = doc(db, 'books', bookId, 'chapters', chapterId, 'pages', pageId);
    await deleteDoc(pageRef);
    
    console.log('Page deleted successfully from Firestore');
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

// Update a chapter in Firestore
export const updateChapter = async (bookId, chapterId, chapterData) => {
  try {
    console.log('Updating chapter in Firestore:', { bookId, chapterId, chapterData });
    
    const chapterRef = doc(db, 'books', bookId, 'chapters', chapterId);
    await updateDoc(chapterRef, {
      ...chapterData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Chapter updated successfully in Firestore');
  } catch (error) {
    console.error('Error updating chapter:', error);
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
      author: {
        name: 'John Doe',
        title: 'Senior Software Engineer',
        bio: 'John Doe is a passionate software engineer with over 8 years of experience in web development and system architecture.',
        credentials: [
          'MSc in Computer Science',
          'Certified AWS Solutions Architect',
          'Published author of 3 technical books'
        ],
        achievements: [
          'Best Technical Book Award 2023',
          'Featured speaker at ReactConf 2023',
          'Open source contributor to major frameworks'
        ],
        email: 'john.doe@example.com'
      },
      preface: {
        content: 'This book represents years of experience and learning in the field of software development. It is my hope that readers will find valuable insights and practical knowledge within these pages.',
        author: 'John Doe',
        date: 'January 2024',
        location: 'San Francisco, CA'
      },
      chapters: [
        { 
          id: '1', 
          title: 'Introduction', 
          status: 'completed',
          pages: [
            { id: '1.1', title: 'Getting Started', content: 'Welcome to this comprehensive guide...' },
            { id: '1.2', title: 'Overview', content: 'This book covers essential concepts...' },
            { id: '1.3', title: 'Prerequisites', content: 'What you need to know before starting...' }
          ]
        },
        { 
          id: '2', 
          title: 'Getting Started', 
          status: 'completed',
          pages: [
            { id: '2.1', title: 'Setup Environment', content: 'Setting up your development environment...' },
            { id: '2.2', title: 'First Steps', content: 'Taking your first steps with the technology...' },
            { id: '2.3', title: 'Basic Concepts', content: 'Understanding the fundamental concepts...' }
          ]
        },
        { 
          id: '3', 
          title: 'Advanced Concepts', 
          status: 'completed',
          pages: [
            { id: '3.1', title: 'Advanced Techniques', content: 'Exploring advanced techniques...' },
            { id: '3.2', title: 'Best Practices', content: 'Following industry best practices...' },
            { id: '3.3', title: 'Optimization', content: 'Optimizing your code for performance...' }
          ]
        }
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
      author: {
        name: 'Jane Smith',
        title: 'Creative Writing Instructor',
        bio: 'Jane Smith is an accomplished writer and educator who has helped hundreds of students develop their creative writing skills.',
        credentials: [
          'MFA in Creative Writing',
          'Published author of 5 novels',
          'Writing instructor at prestigious universities'
        ],
        achievements: [
          'National Book Award Finalist 2022',
          'Best Fiction Book Award 2021',
          'Guest lecturer at writing workshops nationwide'
        ],
        email: 'jane.smith@example.com'
      },
      preface: {
        content: 'Writing is a journey of discovery, both for the writer and the reader. In this book, I share the techniques and insights that have guided my own writing journey.',
        author: 'Jane Smith',
        date: 'January 2024',
        location: 'New York, NY'
      },
      chapters: [
        { 
          id: '1', 
          title: 'Chapter 1', 
          status: 'completed',
          pages: [
            { id: '1.1', title: 'Introduction to Writing', content: 'Understanding the fundamentals of writing...' },
            { id: '1.2', title: 'Finding Your Voice', content: 'Discovering your unique writing style...' },
            { id: '1.3', title: 'Writing Techniques', content: 'Essential techniques for effective writing...' }
          ]
        },
        { 
          id: '2', 
          title: 'Chapter 2', 
          status: 'in-progress',
          pages: [
            { id: '2.1', title: 'Character Development', content: 'Creating compelling characters...' },
            { id: '2.2', title: 'Plot Structure', content: 'Building engaging plot structures...' },
            { id: '2.3', title: 'Dialogue Writing', content: 'Writing natural and engaging dialogue...' }
          ]
        },
        { 
          id: '3', 
          title: 'Chapter 3', 
          status: 'not-started',
          pages: [
            { id: '3.1', title: 'Editing and Revision', content: 'The importance of editing your work...' },
            { id: '3.2', title: 'Publishing Process', content: 'Understanding the publishing industry...' },
            { id: '3.3', title: 'Marketing Your Book', content: 'Strategies for promoting your work...' }
          ]
        }
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
      author: {
        name: 'Sarah Johnson',
        title: 'React Developer Advocate',
        bio: 'Sarah Johnson is a React Developer Advocate with extensive experience in building scalable web applications. She has contributed to major open-source projects and mentored hundreds of developers.',
        credentials: [
          'BS in Computer Science',
          'React Core Team Contributor',
          'Published author of 4 React books'
        ],
        achievements: [
          'React Community Award 2023',
          'Featured speaker at React Summit 2023',
          'Creator of popular React libraries'
        ],
        email: 'sarah.johnson@example.com'
      },
      preface: {
        content: 'React has transformed the way we build web applications. This comprehensive guide is designed to take you from your first component to building complex, production-ready applications.',
        author: 'Sarah Johnson',
        date: 'January 2024',
        location: 'Seattle, WA'
      },
      chapters: [
        { 
          id: '1', 
          title: 'Introduction to React', 
          status: 'completed',
          pages: [
            { id: '1.1', title: 'What is React?', content: 'React is a JavaScript library for building user interfaces...' },
            { id: '1.2', title: 'Setting Up React', content: 'Learn how to set up a new React project...' },
            { id: '1.3', title: 'Your First Component', content: 'Create your first React component...' },
            { id: '1.4', title: 'JSX Basics', content: 'JSX allows you to write HTML-like code in JavaScript...' }
          ]
        },
        { 
          id: '2', 
          title: 'Components and Props', 
          status: 'completed',
          pages: [
            { id: '2.1', title: 'Component Structure', content: 'Components are the building blocks of React apps...' },
            { id: '2.2', title: 'Functional Components', content: 'Functional components are simple JavaScript functions...' },
            { id: '2.3', title: 'Props Overview', content: 'Props allow you to pass data to components...' },
            { id: '2.4', title: 'Prop Types', content: 'PropTypes help validate component props...' }
          ]
        },
        { 
          id: '3', 
          title: 'State and Lifecycle', 
          status: 'completed',
          pages: [
            { id: '3.1', title: 'Understanding State', content: 'State allows components to manage data...' },
            { id: '3.2', title: 'setState Method', content: 'setState is used to update component state...' },
            { id: '3.3', title: 'Component Lifecycle', content: 'Components have a lifecycle with different phases...' },
            { id: '3.4', title: 'Lifecycle Methods', content: 'Lifecycle methods let you run code at specific times...' }
          ]
        },
        { 
          id: '4', 
          title: 'Hooks', 
          status: 'completed',
          pages: [
            { id: '4.1', title: 'Introduction to Hooks', content: 'Hooks allow you to use state in functional components...' },
            { id: '4.2', title: 'useState Hook', content: 'useState is the most basic React hook...' },
            { id: '4.3', title: 'useEffect Hook', content: 'useEffect lets you perform side effects...' },
            { id: '4.4', title: 'Custom Hooks', content: 'You can create your own custom hooks...' }
          ]
        },
        { 
          id: '5', 
          title: 'Advanced Patterns', 
          status: 'completed',
          pages: [
            { id: '5.1', title: 'Context API', content: 'Context provides a way to share data...' },
            { id: '5.2', title: 'Higher-Order Components', content: 'HOCs are functions that enhance components...' },
            { id: '5.3', title: 'Render Props', content: 'Render props is a technique for sharing code...' },
            { id: '5.4', title: 'Performance Optimization', content: 'Learn techniques to optimize React performance...' }
          ]
        }
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
      author: {
        name: 'Mike Wilson',
        title: 'JavaScript Developer & Educator',
        bio: 'Mike Wilson is a JavaScript developer and educator with a passion for teaching programming fundamentals. He has helped thousands of students learn JavaScript through his courses and workshops.',
        credentials: [
          'BS in Computer Science',
          'Certified JavaScript Developer',
          'Published author of 2 programming books'
        ],
        achievements: [
          'Best Programming Book Award 2022',
          'Featured speaker at JSConf 2023',
          'Creator of popular JavaScript learning resources'
        ],
        email: 'mike.wilson@example.com'
      },
      preface: {
        content: 'JavaScript is the language of the web, and mastering its fundamentals is essential for any modern developer. This book provides a solid foundation for your JavaScript journey.',
        author: 'Mike Wilson',
        date: 'January 2024',
        location: 'Austin, TX'
      },
      chapters: [
        { 
          id: '1', 
          title: 'Variables and Data Types', 
          status: 'completed',
          pages: [
            {
              id: "1.1",
              title: "Introduction to Variables",
              subtitle: "var, let, and const declarations",
              content: "Variables are containers for storing data values. In JavaScript, you can declare variables using var, let, or const. Each has different scoping rules and behavior..."
            },
            {
              id: "1.2",
              title: "Number Data Type",
              subtitle: "Integers, floats, and special numeric values",
              content: "JavaScript has one number type that can represent both integers and floating-point numbers. Numbers can be written with or without decimals..."
            },
            {
              id: "1.3",
              title: "String Data Type",
              subtitle: "Text manipulation and string methods",
              content: "Strings are used to store and manipulate text. In JavaScript, strings can be created using single quotes, double quotes, or backticks..."
            },
            {
              id: "1.4",
              title: "Boolean Data Type",
              subtitle: "True, false, and logical operations",
              content: "Booleans represent one of two values: true or false. They are often used in conditional statements and logical operations..."
            },
            {
              id: "1.5",
              title: "Undefined and Null",
              subtitle: "Understanding empty and missing values",
              content: "Undefined and null are special values in JavaScript that represent the absence of a value. Understanding the difference is crucial..."
            }
          ]
        },
        { 
          id: '2', 
          title: 'Functions', 
          status: 'completed',
          pages: [
            {
              id: "2.1",
              title: "Function Declaration",
              subtitle: "Traditional function syntax and hoisting",
              content: "Function declarations are the traditional way to define functions in JavaScript. They are hoisted, meaning they can be called before they are defined..."
            },
            {
              id: "2.2",
              title: "Function Expressions",
              subtitle: "Anonymous functions and function assignments",
              content: "Function expressions allow you to create anonymous functions and assign them to variables. They are not hoisted like function declarations..."
            },
            {
              id: "2.3",
              title: "Arrow Functions",
              subtitle: "Modern ES6 syntax and implicit returns",
              content: "Arrow functions are a concise way to write functions introduced in ES6. They have implicit returns and do not bind their own this context..."
            },
            {
              id: "2.4",
              title: "Parameters and Arguments",
              subtitle: "Passing data to functions",
              content: "Functions can accept parameters, which are variables that receive values when the function is called. These values are called arguments..."
            },
            {
              id: "2.5",
              title: "Return Values",
              subtitle: "Sending data back from functions",
              content: "Functions can return values using the return statement. The returned value can be used by the calling code or assigned to variables..."
            },
            {
              id: "2.6",
              title: "Scope and Closures",
              subtitle: "Understanding variable scope and closure patterns",
              content: "Scope determines where variables can be accessed. Closures allow functions to access variables from their outer scope even after the outer function has returned..."
            }
          ]
        },
        { 
          id: '3', 
          title: 'Objects and Arrays', 
          status: 'in-progress',
          pages: [
            {
              id: "3.1",
              title: "Creating Objects",
              subtitle: "Object literals and constructor functions",
              content: "Objects in JavaScript are collections of key-value pairs. You can create them using object literals or constructor functions..."
            },
            {
              id: "3.2",
              title: "Object Properties",
              subtitle: "Accessing and modifying object data",
              content: "Object properties can be accessed using dot notation or bracket notation. You can add, modify, or delete properties dynamically..."
            },
            {
              id: "3.3",
              title: "Array Basics",
              subtitle: "Creating and accessing array elements",
              content: "Arrays are ordered collections of values. You can access elements by their index and modify them as needed..."
            },
            {
              id: "3.4",
              title: "Array Methods",
              subtitle: "Built-in methods for array manipulation",
              content: "JavaScript provides many built-in methods for working with arrays, including push, pop, shift, unshift, and more..."
            },
            {
              id: "3.5",
              title: "Object Methods",
              subtitle: "Functions as object properties",
              content: "Objects can contain functions as properties. These are called methods and can access the object's other properties using this..."
            },
            {
              id: "3.6",
              title: "Destructuring",
              subtitle: "Extracting values from objects and arrays",
              content: "Destructuring allows you to extract values from objects and arrays into distinct variables using a syntax that mirrors the construction of array and object literals..."
            },
            {
              id: "3.7",
              title: "Spread and Rest",
              subtitle: "Modern syntax for copying and combining data",
              content: "The spread operator (...) allows you to expand arrays and objects. The rest parameter allows you to collect multiple elements into an array..."
            }
          ]
        },
        { 
          id: '4', 
          title: 'DOM Manipulation', 
          status: 'not-started',
          pages: [
            {
              id: "4.1",
              title: "Understanding the DOM",
              subtitle: "Document structure and node relationships",
              content: "The DOM is a tree-like structure that represents the HTML document. Each HTML element becomes a node in this tree..."
            },
            {
              id: "4.2",
              title: "Selecting Elements",
              subtitle: "Finding elements by ID, class, and tag name",
              content: "JavaScript provides several methods for selecting elements from the DOM, including getElementById, getElementsByClassName, and querySelector..."
            },
            {
              id: "4.3",
              title: "Modifying Elements",
              subtitle: "Changing content, attributes, and styles",
              content: "Once you've selected an element, you can modify its content, attributes, and CSS styles using JavaScript..."
            },
            {
              id: "4.4",
              title: "Creating Elements",
              subtitle: "Dynamically adding new elements to the page",
              content: "You can create new HTML elements dynamically using JavaScript and add them to the DOM..."
            },
            {
              id: "4.5",
              title: "Event Handling",
              subtitle: "Responding to user interactions",
              content: "Events are actions that occur on web pages, such as clicks, key presses, and form submissions. You can listen for these events and respond to them..."
            },
            {
              id: "4.6",
              title: "Event Delegation",
              subtitle: "Efficient event handling for dynamic content",
              content: "Event delegation allows you to handle events for elements that don't exist yet or for many elements using a single event listener..."
            },
            {
              id: "4.7",
              title: "Form Handling",
              subtitle: "Working with form data and validation",
              content: "Forms are a common way to collect user input. JavaScript can be used to validate form data and handle form submissions..."
            },
            {
              id: "4.8",
              title: "AJAX and Fetch",
              subtitle: "Making HTTP requests from JavaScript",
              content: "AJAX allows you to make HTTP requests from JavaScript without reloading the page. The Fetch API provides a modern way to make these requests..."
            }
          ]
        },
        { 
          id: '5', 
          title: 'Async Programming', 
          status: 'not-started',
          pages: [
            {
              id: "5.1",
              title: "Callbacks",
              subtitle: "Traditional approach to async operations",
              content: "Callbacks are functions passed as arguments to other functions, to be executed when the outer function completes..."
            },
            {
              id: "5.2",
              title: "Promises",
              subtitle: "Modern way to handle async operations",
              content: "Promises provide a cleaner way to handle asynchronous operations. They represent a value that may not be available immediately..."
            },
            {
              id: "5.3",
              title: "Async/Await",
              subtitle: "Synchronous-looking async code",
              content: "Async/await is syntactic sugar over promises that makes asynchronous code look and behave more like synchronous code..."
            },
            {
              id: "5.4",
              title: "Error Handling",
              subtitle: "Managing errors in async operations",
              content: "Proper error handling is crucial in asynchronous programming. You need to handle both synchronous and asynchronous errors..."
            },
            {
              id: "5.5",
              title: "Promise Methods",
              subtitle: "Promise.all, Promise.race, and more",
              content: "JavaScript provides several utility methods for working with promises, including Promise.all, Promise.race, and Promise.allSettled..."
            },
            {
              id: "5.6",
              title: "Real-world Examples",
              subtitle: "Practical async programming patterns",
              content: "Real-world applications often involve multiple asynchronous operations. Understanding how to coordinate these operations is essential..."
            },
            {
              id: "5.7",
              title: "Web APIs",
              subtitle: "Browser APIs and async operations",
              content: "Many browser APIs are asynchronous, including the Fetch API, File API, and various storage APIs..."
            },
            {
              id: "5.8",
              title: "Performance Considerations",
              subtitle: "Optimizing async code for better performance",
              content: "Asynchronous programming can impact performance. Understanding how to optimize async operations is important for building fast applications..."
            },
            {
              id: "5.9",
              title: "Testing Async Code",
              subtitle: "Writing tests for asynchronous functions",
              content: "Testing asynchronous code requires special consideration. You need to ensure that your tests wait for async operations to complete..."
            }
          ]
        }
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
      author: {
        name: 'Emily Chen',
        title: 'Software Architect',
        bio: 'Emily Chen is a software architect with over 12 years of experience in designing scalable software systems. She specializes in design patterns and software architecture best practices.',
        credentials: [
          'MS in Software Engineering',
          'Certified Software Architect',
          'Published author of 3 architecture books'
        ],
        achievements: [
          'Software Architecture Excellence Award 2023',
          'Featured speaker at Architecture Summit 2023',
          'Contributor to major open-source frameworks'
        ],
        email: 'emily.chen@example.com'
      },
      preface: {
        content: 'Design patterns are the building blocks of robust software architecture. This book presents these patterns in a practical, accessible way that will help you write better, more maintainable code.',
        author: 'Emily Chen',
        date: 'January 2024',
        location: 'Boston, MA'
      },
      chapters: [
        { 
          id: '1', 
          title: 'Creational Patterns', 
          status: 'completed',
          pages: [
            { id: '1.1', title: 'Singleton Pattern', content: 'Ensuring a class has only one instance...' },
            { id: '1.2', title: 'Factory Pattern', content: 'Creating objects without specifying their exact class...' },
            { id: '1.3', title: 'Builder Pattern', content: 'Constructing complex objects step by step...' },
            { id: '1.4', title: 'Prototype Pattern', content: 'Creating new objects by cloning existing ones...' }
          ]
        },
        { 
          id: '2', 
          title: 'Structural Patterns', 
          status: 'completed',
          pages: [
            { id: '2.1', title: 'Adapter Pattern', content: 'Allowing incompatible interfaces to work together...' },
            { id: '2.2', title: 'Bridge Pattern', content: 'Separating abstraction from implementation...' },
            { id: '2.3', title: 'Composite Pattern', content: 'Treating individual and composite objects uniformly...' },
            { id: '2.4', title: 'Decorator Pattern', content: 'Adding behavior to objects dynamically...' }
          ]
        },
        { 
          id: '3', 
          title: 'Behavioral Patterns', 
          status: 'completed',
          pages: [
            { id: '3.1', title: 'Observer Pattern', content: 'Defining a one-to-many dependency between objects...' },
            { id: '3.2', title: 'Strategy Pattern', content: 'Defining a family of algorithms...' },
            { id: '3.3', title: 'Command Pattern', content: 'Encapsulating a request as an object...' },
            { id: '3.4', title: 'State Pattern', content: 'Allowing an object to alter its behavior...' }
          ]
        },
        { 
          id: '4', 
          title: 'Anti-Patterns', 
          status: 'completed',
          pages: [
            { id: '4.1', title: 'God Object', content: 'Avoiding objects that do too much...' },
            { id: '4.2', title: 'Spaghetti Code', content: 'Maintaining clean, readable code...' },
            { id: '4.3', title: 'Copy-Paste Programming', content: 'The dangers of code duplication...' },
            { id: '4.4', title: 'Premature Optimization', content: 'When optimization becomes a problem...' }
          ]
        }
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
      author: {
        name: 'David Brown',
        title: 'Machine Learning Researcher',
        bio: 'David Brown is a machine learning researcher and educator who has published numerous papers on AI and ML. He has taught machine learning courses at top universities.',
        credentials: [
          'PhD in Computer Science',
          'Research Scientist at leading AI labs',
          'Published author of 4 ML books'
        ],
        achievements: [
          'Best ML Book Award 2023',
          'Featured speaker at NeurIPS 2023',
          'Contributor to major ML frameworks'
        ],
        email: 'david.brown@example.com'
      },
      preface: {
        content: 'Machine learning is transforming the world around us. This book demystifies the core concepts and provides a practical foundation for understanding and applying ML techniques.',
        author: 'David Brown',
        date: 'January 2024',
        location: 'Palo Alto, CA'
      },
      chapters: [
        { 
          id: '1', 
          title: 'Introduction to ML', 
          status: 'completed',
          pages: [
            { id: '1.1', title: 'What is Machine Learning?', content: 'Understanding the basics of ML...' },
            { id: '1.2', title: 'Types of Machine Learning', content: 'Supervised, unsupervised, and reinforcement learning...' },
            { id: '1.3', title: 'Applications of ML', content: 'Real-world applications of machine learning...' },
            { id: '1.4', title: 'Getting Started', content: 'Setting up your ML development environment...' }
          ]
        },
        { 
          id: '2', 
          title: 'Supervised Learning', 
          status: 'in-progress',
          pages: [
            { id: '2.1', title: 'Linear Regression', content: 'Understanding linear regression algorithms...' },
            { id: '2.2', title: 'Logistic Regression', content: 'Classification with logistic regression...' },
            { id: '2.3', title: 'Decision Trees', content: 'Tree-based classification and regression...' },
            { id: '2.4', title: 'Support Vector Machines', content: 'SVM for classification problems...' }
          ]
        },
        { 
          id: '3', 
          title: 'Unsupervised Learning', 
          status: 'not-started',
          pages: [
            { id: '3.1', title: 'Clustering Algorithms', content: 'K-means and hierarchical clustering...' },
            { id: '3.2', title: 'Dimensionality Reduction', content: 'PCA and other reduction techniques...' },
            { id: '3.3', title: 'Association Rules', content: 'Finding patterns in data...' }
          ]
        },
        { 
          id: '4', 
          title: 'Neural Networks', 
          status: 'not-started',
          pages: [
            { id: '4.1', title: 'Neural Network Basics', content: 'Understanding artificial neural networks...' },
            { id: '4.2', title: 'Deep Learning', content: 'Introduction to deep neural networks...' },
            { id: '4.3', title: 'Convolutional Neural Networks', content: 'CNNs for image processing...' },
            { id: '4.4', title: 'Recurrent Neural Networks', content: 'RNNs for sequential data...' }
          ]
        }
      ]
    }
  ];
}; 