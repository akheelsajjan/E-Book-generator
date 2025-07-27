# 📘 Product Requirements Document (PRD) — Firestore Book Schema UI Integration

## 🧩 Overview

This document defines the structure, relationships, and UI integration strategy for storing and retrieving a complex eBook system in Firebase Firestore. It is designed to be consumed by the Cursor IDE or AI assistant to automatically generate or refactor UI components.

---

## 🏗️ Firestore Database Structure

### 🔖 Collection: `books/{bookId}` (Root Document)

Stores top-level metadata and design settings of a book.

```json
{
  title: "string",
  subtitle: "string",
  author: "string",
  description: "string",
  genre: "string",
  tags: ["string"],
  language: "string",
  status: "draft" | "in-progress" | "review" | "completed" | "published",
  progress: number,
  templateId: "string",
  createdAt: timestamp,
  updatedAt: timestamp,
  publishedAt: timestamp,
  lastEditedAt: timestamp,
  cover: {
    imageUrl: "string",
    design: {
      backgroundColor: "string",
      textColor: "string",
      fontFamily: "string",
      fontSize: number
    }
  },
  layout: {
    pageSize: "A4" | "A5" | "Letter",
    margins: { top: number, bottom: number, left: number, right: number },
    fontFamily: "string",
    fontSize: number,
    lineSpacing: number
  },
  shareSettings: {
    allowComments: boolean,
    allowDownload: boolean,
    passwordProtected: boolean,
    password: string
  }
}
```

---

## 📚 Subcollections

### 📁 `books/{bookId}/chapters/{chapterId}`

```json
{
  title: "string",
  description: "string",
  order: number,
  isVisible: boolean,
  includeInTOC: boolean,
  pageBreakBefore: boolean,
  pageBreakAfter: boolean,
  wordCount: number,
  estimatedReadingTime: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 📁 `books/{bookId}/chapters/{chapterId}/pages/{pageId}`

```json
{
  title: "string",
  content: "string",
  pageType: "text" | "image" | "video" | "code",
  order: number,
  alignment: "left" | "center" | "right",
  fontSize: number,
  fontFamily: "string",
  fontWeight: string,
  color: string,
  backgroundColor: string,
  margins: number,
  padding: number,
  pageBreakBefore: boolean,
  pageBreakAfter: boolean,
  showPageNumber: boolean,
  showHeader: boolean,
  showFooter: boolean,
  isVisible: boolean,
  updatedAt: timestamp
}
```

### 📁 `books/{bookId}/collaborators/{userId}`

```json
{
  role: "viewer" | "editor" | "admin",
  addedAt: timestamp
}
```

### 📁 `books/{bookId}/history/{version}`

```json
{
  version: number,
  changes: "string",
  timestamp: timestamp,
  userId: "string"
}
```

### 📁 `books/{bookId}/backMatter/glossary/{termId}`

```json
{
  term: "string",
  definition: "string",
  order: number
}
```

---

## 🎨 UI Requirements for Cursor

### ✅ Refactor Goals

* Convert large single-book components into modular subcomponents.
* Use dynamic fetching per Firestore document/subcollection.
* Match the visual structure to:

```plaintext
books/
└── bookId
    ├── title, author, genre, etc.
    ├── chapters/
    │   └── chapterId
    │       ├── title, order
    │       └── pages/
    │           └── pageId
    └── backMatter/glossary/
```

### 🔧 Component Suggestions

* `<BookMeta />` - renders root metadata fields
* `<ChapterList />` - lists chapters using chapter subcollection
* `<PageEditor />` - renders page content block
* `<GlossaryEditor />` - manages glossary terms
* `<CollaboratorManager />` - permissions UI

### 📦 Load Order

* Fetch `bookId` document
* Load `chapters` subcollection
* Lazy-load `pages` when editing a chapter
* Back matter sections lazy-loaded when toggled in UI

---

## 🧪 Testing Strategy

* Mock Firestore data using emulators or test seed
* Test for edge cases: missing chapters, empty books, non-sequential page order
* Validate document size stays < 1 MB per document
* Enable offline support for document edits

---

This PRD supports modular UI generation using Firestore and scalable component logic in Cursor.
