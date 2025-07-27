# 📚 E-Book Generator v1.0

A modern, AI-powered web application for creating, editing, and publishing professional e-books with real-time collaboration features.

## 🚀 Features

### ✨ Core Functionality

- **📖 Book Builder**: Create and structure your book with chapters and pages
- **✍️ Rich Text Editor**: Advanced content editing with formatting tools
- **👁️ Live Preview**: Real-time preview of your book as you write
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔐 User Authentication**: Secure Google Sign-In integration
- **☁️ Cloud Storage**: Firebase Firestore for reliable data persistence

### 🎯 Advanced Features

- **🤖 AI Assistant**: Intelligent writing assistance and content generation
- **📊 Progress Tracking**: Monitor your writing progress and completion status
- **🎨 Custom Styling**: Professional book formatting and layout options
- **📄 Multiple Page Types**: Support for covers, chapters, pages, and appendices
- **📋 Table of Contents**: Auto-generated and customizable TOC
- **🔍 Smart Search**: Find and navigate through your content easily

### 📝 Content Management

- **Character Limits**: Dynamic character limits based on page titles (1675 with title, 2000 without)
- **Title Management**: Flexible page title system with add/remove functionality
- **Chapter Organization**: Hierarchical chapter and page structure
- **Content Validation**: Real-time content validation and error checking

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router DOM** - Client-side routing

### Backend & Services

- **Firebase Authentication** - Google Sign-In
- **Firebase Firestore** - NoSQL cloud database
- **Vite** - Fast build tool and dev server

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Hot Module Replacement** - Instant development updates

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project setup

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/akheelsajjan/E-Book-generator.git
   cd E-Book-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google Sign-In
   - Enable Firestore Database
   - Copy your Firebase config to `src/firebase.js`

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 Usage Guide

### Getting Started

1. **Sign In**: Use Google Sign-In to access your account
2. **Create Book**: Start a new book from the dashboard
3. **Build Structure**: Use the Book Builder to organize chapters and pages
4. **Write Content**: Use the rich text editor to write your content
5. **Preview**: See your book in real-time with the preview feature
6. **Save**: Your work is automatically saved to the cloud

### Key Features Explained

#### 📖 Book Builder

- Create chapters and pages with intuitive interface
- Drag and drop organization
- Real-time structure updates

#### ✍️ Editor Features

- **Character Limits**:
  - 1675 characters when page has a title
  - 2000 characters when page has no title
- **Title Management**:
  - Add titles with "+ Add Page Title" button
  - Remove titles with the X icon
- **Formatting Tools**: Bold, italic, headings, lists, and more

#### 👁️ Preview Mode

- Full book preview with navigation
- Table of contents sidebar
- Page-by-page viewing
- Professional book layout

#### 🤖 AI Assistant

- Content generation suggestions
- Writing prompts and examples
- Style and readability analysis
- Real-time writing assistance

## �� Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── book/           # Book-related components
│   ├── book-editor/    # Editor components
│   ├── layout/         # Layout components
│   ├── preview/        # Preview components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and service functions
├── styles/             # Global styles
└── lib/                # Utility functions
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for backend services
- **Tailwind CSS** for styling
- **Lucide** for beautiful icons
- **React Community** for excellent documentation

## 📞 Support

If you have any questions or need support:

- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Version 1.0** - A powerful e-book creation platform with AI assistance and real-time collaboration.

Made with ❤️ by the E-Book Generator Team
