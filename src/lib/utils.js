import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Safe timestamp formatting function that handles different timestamp formats
export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return 'Unknown date';
  }

  try {
    let date;
    
    // Handle Firebase Timestamp
    if (timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    }
    // Handle regular Date object
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Handle timestamp as number (milliseconds)
    else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    }
    // Handle timestamp as string
    else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    }
    // Handle timestamp object with seconds/nanoseconds
    else if (timestamp && typeof timestamp.seconds === 'number') {
      date = new Date(timestamp.seconds * 1000);
    }
    else {
      return 'Invalid date';
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
}

// Book utilities
export const generateBookId = () => {
    return `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateBookData = (bookData) => {
    const errors = [];

    if (!bookData.title?.trim()) {
        errors.push('Book title is required');
    }

    if (!bookData.chapters || bookData.chapters.length === 0) {
        errors.push('At least one chapter is required');
    }

    return errors;
}; 