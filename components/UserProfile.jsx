import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

function UserProfile({ user, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = (key) => window.LanguageManager.t(key);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      const updatedUser = await window.AuthManager.updateProfile(formData);
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
    setError('');
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setFormData({ ...formData, avatar: newAvatar });
  };

  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x38': 'BSC Mainnet',
      '0x89': 'Polygon',
      '0xa86a': 'Avalanche',
    };
    return networks[chainId] || 'Unknown Network';
  };

  if (!user) return null;

  return (
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
        className="relative w-full max-w-lg glass-morphism rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t('userProfile')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-purple-500"
              />
              {isEditing && (
                <button
                  onClick={generateRandomAvatar}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                  title={t('generateAvatar')}
                >
                  🎲
                </button>
              )}
            </div>
            
            {/* Auth Method Badge */}
            <div className="mt-2">
              {user.authMethod === 'wallet' ? (
                <span className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                  <span>🦊</span>
                  <span>{t('walletUser')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  <span>📧</span>
                  <span>{t('emailUser')}</span>
                </span>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('username')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                />
              ) : (
                <p className="text-white bg-gray-800 px-4 py-3 rounded-lg">{user.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('bio')}
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none resize-none"
                  placeholder={t('enterBio')}
                />
              ) : (
                <p className="text-gray-300 bg-gray-800 px-4 py-3 rounded-lg min-h-[3rem]">
                  {user.bio || t('noBio')}
                </p>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400">{t('joined')}</p>
                <p className="text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400">{t('gamesCreated')}</p>
                <p className="text-purple-300 font-medium">{user.profile?.gamesCreated || 0}</p>
              </div>
            </div>

            {/* Wallet Info */}
            {user.authMethod === 'wallet' && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">{t('walletInfo')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('address')}:</span>
                    <span className="text-green-300 font-mono">
                      {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('network')}:</span>
                    <span className="text-blue-300">{getNetworkName(user.chainId)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Info */}
            {user.authMethod === 'email' && user.email && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">{t('accountInfo')}</h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('email')}:</span>
                    <span className="text-blue-300">{user.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-300"
                >
                  {isLoading ? t('saving') : t('save')}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300"
                >
                  {t('cancel')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300"
              >
                ✏️ {t('editProfile')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

window.UserProfile = UserProfile;