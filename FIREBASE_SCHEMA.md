# Firebase Schema Documentation

## Overview

This document outlines the complete Firebase Firestore schema for the E-Book Generator platform.

## Collections Structure

```
/books (collection)
  └── {bookId} (document)
      ├── /chapters (subcollection)
      │   └── {chapterId} (document)
      │       └── /pages (subcollection)
      │           └── {pageId} (document)
      └── (book metadata)
```

---

## 1. Books Collection (`/books`)

### Document: `{bookId}`

| Field         | Type        | Required | Description           | Example                                   |
| ------------- | ----------- | -------- | --------------------- | ----------------------------------------- |
| `id`          | `string`    | ✅       | Document ID           | `"book_123"`                              |
| `title`       | `string`    | ✅       | Book title            | `"The Complete Guide to React"`           |
| `author`      | `string`    | ✅       | Author name           | `"John Doe"`                              |
| `genre`       | `string`    | ✅       | Book genre            | `"technical"`                             |
| `language`    | `string`    | ❌       | Language code         | `"en"`                                    |
| `description` | `string`    | ❌       | Book description      | `"A comprehensive guide..."`              |
| `viewType`    | `string`    | ❌       | Layout type           | `"page"` or `"scroll"`                    |
| `userId`      | `string`    | ✅       | User ID (owner)       | `"user_456"`                              |
| `status`      | `string`    | ✅       | Book status           | `"draft"`, `"published"`, `"in-progress"` |
| `progress`    | `number`    | ❌       | Completion percentage | `75`                                      |
| `createdAt`   | `timestamp` | ✅       | Creation timestamp    | `serverTimestamp()`                       |
| `updatedAt`   | `timestamp` | ✅       | Last update timestamp | `serverTimestamp()`                       |
| `publishedAt` | `timestamp` | ❌       | Publication timestamp | `serverTimestamp()`                       |

### Complex Fields

#### `cover` (object)

```javascript
{
  title: "string",        // Book title for cover
  subtitle: "string",     // Subtitle
  author: "string",       // Author name for cover
  background: "string"    // Background image URL
}
```

#### `author` (object)

```javascript
{
  name: "string",         // Author name
  bio: "string",          // Author biography
  title: "string",        // Author title/credentials
  credentials: ["string"], // Array of credentials
  achievements: ["string"], // Array of achievements
  email: "string"         // Author email
}
```

#### `aiGenerated` (boolean)

- `true` if book was created using AI
- `false` for manually created books

#### `aiContent` (object) - Optional

```javascript
{
  introduction: "string",     // AI generated introduction
  tableOfContents: "string",  // AI generated TOC
  chapters: ["string"]        // Array of AI generated chapters
}
```

#### `chapters` (array)

- Array of chapter IDs for quick access
- Used for navigation and progress tracking

---

## 2. Chapters Subcollection (`/books/{bookId}/chapters`)

### Document: `{chapterId}`

| Field                  | Type        | Required | Description                  | Example                                         |
| ---------------------- | ----------- | -------- | ---------------------------- | ----------------------------------------------- |
| `id`                   | `string`    | ✅       | Document ID                  | `"chapter_789"`                                 |
| `title`                | `string`    | ✅       | Chapter title                | `"Introduction to React"`                       |
| `description`          | `string`    | ❌       | Chapter description          | `"Learn the basics of React"`                   |
| `order`                | `number`    | ✅       | Chapter order                | `1`                                             |
| `isVisible`            | `boolean`   | ❌       | Chapter visibility           | `true`                                          |
| `includeInTOC`         | `boolean`   | ❌       | Include in table of contents | `true`                                          |
| `pageBreakBefore`      | `boolean`   | ❌       | Page break before chapter    | `false`                                         |
| `pageBreakAfter`       | `boolean`   | ❌       | Page break after chapter     | `false`                                         |
| `wordCount`            | `number`    | ❌       | Total word count             | `1500`                                          |
| `estimatedReadingTime` | `number`    | ❌       | Reading time in minutes      | `8`                                             |
| `status`               | `string`    | ❌       | Chapter status               | `"completed"`, `"in-progress"`, `"not-started"` |
| `createdAt`            | `timestamp` | ✅       | Creation timestamp           | `serverTimestamp()`                             |
| `updatedAt`            | `timestamp` | ✅       | Last update timestamp        | `serverTimestamp()`                             |

---

## 3. Pages Subcollection (`/books/{bookId}/chapters/{chapterId}/pages`)

### Document: `{pageId}`

| Field      | Type     | Required | Description               | Example                        |
| ---------- | -------- | -------- | ------------------------- | ------------------------------ |
| `id`       | `string` | ✅       | Document ID               | `"page_101"`                   |
| `title`    | `string` | ❌       | Page title                | `"Getting Started"`            |
| `content`  | `string` | ✅       | Page content              | `"Welcome to this chapter..."` |
| `pageType` | `string` | ❌       | Type of page              | `"text"`, `"image"`, `"table"` |
| `order`    | `number` | ✅       | Page order within chapter | `1`                            |

### Typography Fields

| Field             | Type     | Default     | Description            |
| ----------------- | -------- | ----------- | ---------------------- |
| `alignment`       | `string` | `"left"`    | Text alignment         |
| `fontSize`        | `number` | `14`        | Font size in pixels    |
| `fontFamily`      | `string` | `"Arial"`   | Font family            |
| `fontWeight`      | `string` | `"normal"`  | Font weight            |
| `color`           | `string` | `"#000000"` | Text color (hex)       |
| `backgroundColor` | `string` | `"#ffffff"` | Background color (hex) |

### Layout Fields

| Field             | Type      | Default | Description       |
| ----------------- | --------- | ------- | ----------------- |
| `margins`         | `number`  | `16`    | Margin in pixels  |
| `padding`         | `number`  | `16`    | Padding in pixels |
| `pageBreakBefore` | `boolean` | `false` | Page break before |
| `pageBreakAfter`  | `boolean` | `false` | Page break after  |

### Display Fields

| Field            | Type      | Default | Description      |
| ---------------- | --------- | ------- | ---------------- |
| `showPageNumber` | `boolean` | `true`  | Show page number |
| `showHeader`     | `boolean` | `false` | Show header      |
| `showFooter`     | `boolean` | `false` | Show footer      |
| `isVisible`      | `boolean` | `true`  | Page visibility  |

### Timestamps

| Field       | Type        | Required | Description           |
| ----------- | ----------- | -------- | --------------------- |
| `updatedAt` | `timestamp` | ✅       | Last update timestamp |

---

## 4. Genre Options

```javascript
const GENRE_OPTIONS = [
  "fiction",
  "non-fiction",
  "technical",
  "poetry",
  "biography",
  "self-help",
  "business",
  "education",
  "health",
  "cooking",
  "travel",
  "history",
  "science",
  "philosophy",
  "religion",
  "art",
  "music",
  "sports",
  "other",
];
```

## 5. Language Options

```javascript
const LANGUAGE_OPTIONS = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "de", // German
  "it", // Italian
  "pt", // Portuguese
  "ru", // Russian
  "ja", // Japanese
  "ko", // Korean
  "zh", // Chinese
  "ar", // Arabic
  "hi", // Hindi
  "other",
];
```

## 6. Target Audience Options

```javascript
const TARGET_AUDIENCE_OPTIONS = [
  "kids",
  "teens",
  "adults",
  "college",
  "elderly",
  "men",
  "women",
  "all",
];
```

## 7. Status Values

### Book Status

- `"draft"` - Book is being written
- `"published"` - Book is published
- `"in-progress"` - Book is actively being worked on

### Chapter Status

- `"completed"` - Chapter is finished
- `"in-progress"` - Chapter is being written
- `"not-started"` - Chapter hasn't been started

## 8. View Types

- `"page"` - Fixed layout like physical book
- `"scroll"` - Flexible digital scroll layout

## 9. Page Types

- `"text"` - Text content
- `"image"` - Image content
- `"table"` - Table content
- `"code"` - Code blocks
- `"quote"` - Quote blocks

## 10. Indexes Required

### Composite Indexes

```javascript
// For querying user books
collection: "books";
fields: ["userId", "updatedAt"];

// For querying chapters in order
collection: "chapters";
fields: ["order", "asc"];

// For querying pages in order
collection: "pages";
fields: ["order", "asc"];
```

## 11. Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Books collection
    match /books/{bookId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;

      // Chapters subcollection
      match /chapters/{chapterId} {
        allow read, write: if request.auth != null &&
          request.auth.uid == get(/databases/$(database)/documents/books/$(bookId)).data.userId;

        // Pages subcollection
        match /pages/{pageId} {
          allow read, write: if request.auth != null &&
            request.auth.uid == get(/databases/$(database)/documents/books/$(bookId)).data.userId;
        }
      }
    }
  }
}
```

## 12. Data Validation

### Required Fields for Book Creation

```javascript
const REQUIRED_BOOK_FIELDS = ["title", "author", "genre", "userId"];
```

### Required Fields for Chapter Creation

```javascript
const REQUIRED_CHAPTER_FIELDS = ["title", "order"];
```

### Required Fields for Page Creation

```javascript
const REQUIRED_PAGE_FIELDS = ["content", "order"];
```

---

## 13. Example Document

### Complete Book Document

```javascript
{
  id: "book_123",
  title: "The Complete Guide to React",
  author: "Sarah Johnson",
  genre: "technical",
  language: "en",
  description: "A comprehensive guide to building modern web applications with React",
  viewType: "page",
  userId: "user_456",
  status: "published",
  progress: 100,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt: Timestamp,

  cover: {
    title: "The Complete Guide to React",
    subtitle: "From Beginner to Expert",
    author: "Sarah Johnson",
    background: "https://example.com/cover.jpg"
  },

  author: {
    name: "Sarah Johnson",
    bio: "React Developer Advocate with extensive experience...",
    title: "React Developer Advocate",
    credentials: ["BS in Computer Science", "React Core Team Contributor"],
    achievements: ["React Community Award 2023"],
    email: "sarah.johnson@example.com"
  },

  aiGenerated: false,
  chapters: ["chapter_1", "chapter_2", "chapter_3"],
  preface: "React has transformed the way we build web applications...",
  backMatter: "Thank you for reading this comprehensive guide..."
}
```

This schema provides a robust foundation for the e-book platform with support for complex book structures, AI integration, and flexible styling options.
