import React, { useState, useEffect } from 'react';

function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState(window.LanguageManager.getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (lang) => {
      setCurrentLanguage(lang);
    };

    window.LanguageManager.addListener(handleLanguageChange);

    return () => {
      window.LanguageManager.removeListener(handleLanguageChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'ko' : 'en';
    window.LanguageManager.setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 text-sm"
      title={window.LanguageManager.t('language')}
    >
      <span className="text-lg">🌐</span>
      <span className="font-medium">
        {currentLanguage === 'en' ? window.LanguageManager.t('english') : window.LanguageManager.t('korean')}
      </span>
    </button>
  );
}

window.LanguageToggle = LanguageToggle;