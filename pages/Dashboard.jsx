import React from 'react';
import { Link } from 'react-router';

function Dashboard() {
  const CreatorDashboard = window.CreatorDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Creator Dashboard
            </h1>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/studio" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>🎮</span>
              <span>New Game</span>
            </Link>
            <Link 
              to="/community" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>🌟</span>
              <span>Community</span>
            </Link>
          </div>
        </div>

        <CreatorDashboard />
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;