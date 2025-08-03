import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function UserMenu() {
  const [user, setUser] = useState(window.AuthManager.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const t = (key) => window.LanguageManager.t(key);

  useEffect(() => {
    const handleUserChange = (newUser) => {
      setUser(newUser);
    };

    window.AuthManager.addListener(handleUserChange);

    return () => {
      window.AuthManager.removeListener(handleUserChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    setShowAuthModal(true);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    window.AuthManager.logout();
    setShowDropdown(false);
  };

  const handleProfile = () => {
    setShowUserProfile(true);
    setShowDropdown(false);
  };

  const handleAuthSuccess = (user) => {
    console.log('Authentication successful:', user);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const getNetworkDisplay = (chainId) => {
    const networks = {
      '0x1': { name: 'ETH', color: 'text-blue-400' },
      '0x38': { name: 'BSC', color: 'text-yellow-400' },
      '0x89': { name: 'MATIC', color: 'text-purple-400' },
      '0xa86a': { name: 'AVAX', color: 'text-red-400' },
    };
    return networks[chainId] || { name: 'Unknown', color: 'text-gray-400' };
  };

  if (!user) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 font-semibold flex items-center space-x-2"
        >
          <span>🔐</span>
          <span>{t('login')}</span>
        </button>
        
        {showAuthModal && (
          <window.AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300"
      >
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full border-2 border-purple-400"
        />
        <div className="text-left">
          <p className="text-white font-medium text-sm">{user.username}</p>
          <div className="flex items-center space-x-2">
            {user.authMethod === 'wallet' ? (
              <div className="flex items-center space-x-1">
                <span className="text-orange-400 text-xs">🦊</span>
                <span className={`text-xs font-medium ${getNetworkDisplay(user.chainId).color}`}>
                  {getNetworkDisplay(user.chainId).name}
                </span>
              </div>
            ) : (
              <span className="text-blue-400 text-xs">📧 Email</span>
            )}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 glass-morphism rounded-lg border border-purple-500/30 py-2 z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-600">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-purple-400"
                />
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">
                    {user.authMethod === 'wallet' 
                      ? `${user.walletAddress?.slice(0, 6)}...${user.walletAddress?.slice(-4)}`
                      : user.email
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleProfile}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
              >
                <span>👤</span>
                <span>{t('viewProfile')}</span>
              </button>
              
              <a
                href="/dashboard"
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
                onClick={() => setShowDropdown(false)}
              >
                <span>📊</span>
                <span>{t('dashboard')}</span>
              </a>
              
              <a
                href="/studio"
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-3"
                onClick={() => setShowDropdown(false)}
              >
                <span>🎮</span>
                <span>{t('createGame')}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-t border-gray-600">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-400">{t('games')}</p>
                  <p className="text-purple-300 font-medium">{user.profile?.gamesCreated || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">{t('plays')}</p>
                  <p className="text-green-300 font-medium">{user.profile?.totalPlays || 0}</p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-600 py-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors flex items-center space-x-3"
              >
                <span>🚪</span>
                <span>{t('logout')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showAuthModal && (
        <window.AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showUserProfile && (
        <window.UserProfile
          user={user}
          onClose={() => setShowUserProfile(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

window.UserMenu = UserMenu;