import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

function Home() {
  const [language, setLanguage] = useState(window.LanguageManager.getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (lang) => {
      setLanguage(lang);
    };
    window.LanguageManager.addListener(handleLanguageChange);
    return () => window.LanguageManager.removeListener(handleLanguageChange);
  }, []);

  const t = (key) => window.LanguageManager.t(key);

  const features = [
    {
      title: t('gameStudio'),
      description: t('gameStudioDesc'),
      icon: "🎮",
      link: "/studio",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: t('aiStoryGenerator'),
      description: t('aiStoryGeneratorDesc'),
      icon: "🤖",
      link: "/studio",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: t('playGames'),
      description: t('playGamesDesc'),
      icon: "⚔️",
      link: "/play",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: t('creatorDashboard'),
      description: t('creatorDashboardDesc'),
      icon: "📊",
      link: "/dashboard",
      color: "from-orange-500 to-red-500"
    },
    {
      title: t('communityHub'),
      description: t('communityHubDesc'),
      icon: "🌟",
      link: "/community",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-4">
          <window.LanguageToggle />
          <window.UserMenu />
        </div>

        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-glow">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('heroDescription')}
          </p>
          <Link 
            to="/studio" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {t('startCreating')}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Link to={feature.link}>
                <div className="glass-morphism rounded-xl p-6 h-full hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:animate-bounce`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="glass-morphism rounded-lg p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <p className="text-gray-300">{t('gamesCreated')}</p>
          </div>
          <div className="glass-morphism rounded-lg p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <p className="text-gray-300">{t('activePlayers')}</p>
          </div>
          <div className="glass-morphism rounded-lg p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              5K+
            </div>
            <p className="text-gray-300">{t('creators')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

window.Home = Home;