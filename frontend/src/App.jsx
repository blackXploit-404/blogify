import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import BlogList from './BlogList';
import CreateBlog from './CreateBlog';
import AdminDashboard from './AdminDashboard';
import './App.css';

const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [refreshBlogs, setRefreshBlogs] = useState(0);
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing'); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user && showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!user) {
    return (
      <div>
        {showRegister ? (
          <Register onToggle={() => setShowRegister(false)} />
        ) : (
          <Login onToggle={() => setShowRegister(true)} />
        )}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Brand */}
            <div className="flex items-center space-x-4">
              <img src="/blog.png" alt="BlogApp" className="h-10 w-14 object-contain" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BlogApp</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {user.role}
              </span>
              
              <button
                onClick={() => {
                  setShowCreateBlog(!showCreateBlog);
                  setShowAdminDashboard(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                {showCreateBlog ? 'View Blogs' : 'Create Blog'}
              </button>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    setShowAdminDashboard(!showAdminDashboard);
                    setShowCreateBlog(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {showAdminDashboard ? 'Exit Admin' : 'Admin'}
                </button>
              )}
              
              <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {showAdminDashboard ? (
          <AdminDashboard />
        ) : showCreateBlog ? (
          <CreateBlog
            onBlogCreated={() => {
              setRefreshBlogs(prev => prev + 1);
              setShowCreateBlog(false);
            }}
          />
        ) : (
          <BlogList key={refreshBlogs} />
        )}
      </main>
    </div>
  );
};

function App() {
  return (

    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
