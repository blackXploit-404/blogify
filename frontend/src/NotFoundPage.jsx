import React from 'react';

const NotFoundPage = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-9xl font-bold text-blue-200 blur-sm">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best writers sometimes lose their way!
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8h.01M12 2L2 7l10 5 10-5-10-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17v5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l8-4-8-4" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onGoHome}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            🏠 Go Back Home
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              ← Go Back
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Fun Fact:</span> The term "404" comes from the room number 404 at CERN, 
            where the World Wide Web was invented. When researchers couldn't find a file, 
            they'd say it was "404" (not found in room 404)!
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};

export default NotFoundPage;