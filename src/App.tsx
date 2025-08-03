import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './hooks/useAuth.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookEditor from './pages/BookEditor.jsx';
import BookPreview from './pages/BookPreview.jsx';
import ApiKeysSettings from './pages/ApiKeysSettings.jsx';
import ReaderMode from './pages/ReaderMode.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor/:bookId" 
              element={
                <ProtectedRoute>
                  <BookEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preview/:bookId" 
              element={
                <ProtectedRoute>
                  <BookPreview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/api-keys" 
              element={
                <ProtectedRoute>
                  <ApiKeysSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/main" 
              element={
                <ProtectedRoute>
                  <ReaderMode />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/main/book/:bookId" 
              element={
                <ProtectedRoute>
                  <BookDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
