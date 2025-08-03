import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');
  const [language, setLanguage] = useState(window.LanguageManager.getCurrentLanguage());

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    // Language change listener
    const handleLanguageChange = (lang) => {
      setLanguage(lang);
    };
    window.LanguageManager.addListener(handleLanguageChange);

    const checkDependencies = () => {
      if (
        window.Home &&
        window.Studio &&
        window.Play &&
        window.Dashboard &&
        window.Community &&
        window.GameStudio &&
        window.AIGenerator &&
        window.GamePlayer &&
        window.CreatorDashboard &&
        window.CommunityHub &&
        window.LanguageToggle
      ) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => {
      clearInterval(interval);
      window.LanguageManager.removeListener(handleLanguageChange);
    };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
        <p className="mt-4 text-white text-lg animate-pulse">{window.LanguageManager.t('loading')}</p>
      </div>
    );
  }

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<window.Home />} />
        <Route path="/studio" element={<window.Studio />} />
        <Route path="/play/:gameId?" element={<window.Play />} />
        <Route path="/dashboard" element={<window.Dashboard />} />
        <Route path="/community" element={<window.Community />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);