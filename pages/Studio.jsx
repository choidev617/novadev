import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

function Studio() {
  const GameStudio = window.GameStudio;
  const AIGenerator = window.AIGenerator;
  const [activeTab, setActiveTab] = useState('studio');
  const [language, setLanguage] = useState(window.LanguageManager.getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (lang) => {
      setLanguage(lang);
    };
    window.LanguageManager.addListener(handleLanguageChange);
    return () => window.LanguageManager.removeListener(handleLanguageChange);
  }, []);

  const t = (key) => window.LanguageManager.t(key);

  const tabs = [
    { id: 'studio', label: t('gameStudio'), icon: '🎮' },
    { id: 'ai', label: t('aiGenerator'), icon: '🤖' }
  ];

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
              {t('creatorStudio')}
            </h1>
          </div>
          <div className="flex space-x-4">
            <window.LanguageToggle />
            <Link 
              to="/play" 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>▶️</span>
              <span>{t('testPlay')}</span>
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>📊</span>
              <span>{t('dashboard')}</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-500/30 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'studio' && <GameStudio />}
          {activeTab === 'ai' && <AIGenerator />}
        </div>
      </div>
    </div>
  );
}

window.Studio = Studio;