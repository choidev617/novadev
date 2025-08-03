import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login', 'register'
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'wallet'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = (key) => window.LanguageManager.t(key);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (authMethod === 'email') {
      if (!formData.email || !formData.password) {
        setError(t('fillAllFields'));
        return false;
      }
      
      if (mode === 'register') {
        if (!formData.username) {
          setError(t('usernameRequired'));
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t('passwordMismatch'));
          return false;
        }
        if (formData.password.length < 6) {
          setError(t('passwordTooShort'));
          return false;
        }
      }
    }
    return true;
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let user;
      if (mode === 'register') {
        user = await window.AuthManager.registerWithEmail(
          formData.email,
          formData.password,
          formData.username
        );
      } else {
        user = await window.AuthManager.loginWithEmail(
          formData.email,
          formData.password
        );
      }

      onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const user = await window.AuthManager.connectWallet();
      onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      confirmPassword: ''
    });
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const switchAuthMethod = (method) => {
    setAuthMethod(method);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md glass-morphism rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? t('login') : t('register')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => switchAuthMethod('email')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium ${
                authMethod === 'email'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📧 {t('emailLogin')}
            </button>
            <button
              onClick={() => switchAuthMethod('wallet')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium ${
                authMethod === 'wallet'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🦊 {t('walletLogin')}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
            >
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {authMethod === 'email' ? (
            <div className="space-y-4">
              {/* Email Form */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('username')}
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                    placeholder={t('enterUsername')}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                  placeholder={t('enterEmail')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                  placeholder={t('enterPassword')}
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('confirmPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                    placeholder={t('confirmPassword')}
                  />
                </div>
              )}

              <button
                onClick={handleEmailAuth}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('processing')}</span>
                  </div>
                ) : (
                  mode === 'login' ? t('login') : t('register')
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Wallet Connection */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🦊</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{t('connectWallet')}</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  {t('connectWalletDesc')}
                </p>
                <button
                  onClick={handleWalletAuth}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('connecting')}</span>
                    </div>
                  ) : (
                    `🦊 ${t('connectMetaMask')}`
                  )}
                </button>
              </div>
            </div>
          )}

          {authMethod === 'email' && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                <button
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-purple-400 hover:text-purple-300 ml-1 font-medium"
                >
                  {mode === 'login' ? t('registerHere') : t('loginHere')}
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

window.AuthModal = AuthModal;