import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowChoiceModal(true);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleChoice = (choice) => {
    setShowChoiceModal(false);
    if (choice === 'write') {
      navigate('/dashboard');
    } else {
      navigate('/main');
    }
  };

  // If user is already logged in, show choice modal
  useEffect(() => {
    if (user && !showChoiceModal) {
      setShowChoiceModal(true);
    }
  }, [user]);

  // Add smooth scrolling to the page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white">📚 eBook-AI</div>
            {!user ? (
              <button
                onClick={handleSignIn}
                className="bg-white text-gray-700 font-semibold px-6 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In with Google
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-white text-sm">Welcome, {user.displayName || user.email}</span>
                <button
                  onClick={() => setShowChoiceModal(true)}
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
               Write <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smarter.</span><br />
               Read <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Better.</span>
             </h1>
             <p className="text-xl md:text-2xl font-medium text-gray-600 mb-12 max-w-4xl mx-auto">
               Create, publish, and explore books with the power of AI. Your intelligent co-author awaits.
             </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => user ? handleChoice('write') : handleSignIn()}
                                 className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 min-w-48"
              >
                ✍️ Start Writing
              </button>
              <button
                onClick={() => user ? handleChoice('read') : navigate('/main')}
                                 className="bg-gray-700 text-white font-black px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 min-w-48 border-2 border-gray-700 hover:bg-gray-800"
              >
                📖 Explore Books
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-16 animate-slide-up">
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Powerful Features</h2>
             <p className="text-xl font-medium text-gray-600">Everything you need to bring your ideas to life</p>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Create with AI',
                description: 'Let AI assist you in outlining, generating, and refining your book content from just a one-liner idea. Transform concepts into compelling narratives.'
              },
              {
                icon: '✨',
                title: 'Enhance & Expand',
                description: 'Use AI tools to enhance, refactor, continue writing, or translate your content—right inside the editor. Polish your work to perfection.'
              },
              {
                icon: '📖',
                title: 'Read & Discover',
                description: 'Browse through published works across genres and learn from other creators in reader mode. Discover your next favorite read.'
              }
            ].map((feature, index) => (
                             <div
                 key={index}
                 className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-400 border border-white/80 relative overflow-hidden group"
                 style={{
                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8), 2px 2px 8px rgba(0, 0, 0, 0.1)'
                 }}
               >
                 <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 group-hover:opacity-60 transition-opacity"></div>
                 <div className="text-4xl mb-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-300 inline-block">
                   {feature.icon}
                 </div>
                 <h3 className="text-xl font-black text-gray-900 mb-4">{feature.title}</h3>
                 <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How It Works</h2>
             <p className="text-xl font-medium text-gray-600">From idea to published book in 5 simple steps</p>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { number: '1', title: 'Give Your Idea', description: 'Share your book idea & choose a genre' },
              { number: '2', title: 'AI Suggests Structure', description: 'Get title, chapters, and page suggestions' },
              { number: '3', title: 'Edit with AI', description: 'Write and refine with AI support' },
              { number: '4', title: 'Publish', description: 'Share your work for others to read' },
              { number: '5', title: 'Read & Explore', description: 'Browse books in Reader mode' }
            ].map((step, index) => (
                             <div key={index} className="text-center group">
                 <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                   {step.number}
                 </div>
                 <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
                 <p className="text-gray-600 text-sm font-medium">{step.description}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emphasis Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
        <div className="max-w-4xl mx-auto">
                     <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center shadow-2xl" style={{
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), 4px 4px 16px rgba(0, 0, 0, 0.15)'
           }}>
             <div className="text-6xl mb-6">🔥</div>
             <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
               Built-in AI is your co-author
             </h2>
             <p className="text-xl text-white/90 leading-relaxed font-medium">
               It saves time, boosts creativity, and helps you finish faster. Experience the future of writing where human creativity meets artificial intelligence.
             </p>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="text-2xl font-bold mb-2">📚 eBook-AI</div>
              <div className="text-gray-400">© 2025 eBook-AI. All rights reserved.</div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Choice Modal */}
      {showChoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                         <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">
               What would you like to do?
             </h3>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice('write')}
                                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black py-4 rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                ✍️ Write a Book
              </button>
              <button
                onClick={() => handleChoice('read')}
                                 className="w-full bg-gray-700 text-white font-black py-4 rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                📖 Read Books
              </button>
              <button
                onClick={() => setShowChoiceModal(false)}
                className="w-full text-gray-600 font-medium py-2 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 