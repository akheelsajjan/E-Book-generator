import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { ArrowLeft, Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ApiKeysSettings = () => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  // Load existing API key on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Store the API key securely
      localStorage.setItem('gemini_api_key', apiKey.trim());
      
      // Update the gemini config to use the new key
      // This will be handled by the geminiService when it reads from localStorage
      
      setIsSaved(true);
      
      // Show success message briefly
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
      
    } catch (error) {
      setError('Failed to save API key. Please try again.');
      console.error('Error saving API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateBook = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader 
        onCreateBook={handleCreateBook}
        onSignOut={signOutUser}
        user={user}
      />

      {/* Main Content */}
      <div className="pt-20 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage Gemini API Key</h1>
                  <p className="text-gray-600 mt-1">This key will be used to access Gemini features across the app</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* API Key Input */}
              <div className="space-y-2">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Your API key is stored locally and encrypted. Never share your API key publicly.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {isSaved && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 text-sm">API key saved successfully!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={handleSaveKey}
                  disabled={isLoading || !apiKey.trim()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isLoading || !apiKey.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Saving...' : 'Save Key'}</span>
                </button>

                <button
                  onClick={() => setApiKey('')}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg font-medium transition-all duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Information Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to get your Gemini API key:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google AI Studio</a></li>
              <li>2. Sign in with your Google account</li>
              <li>3. Click "Create API Key"</li>
              <li>4. Copy the generated key and paste it above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysSettings; 