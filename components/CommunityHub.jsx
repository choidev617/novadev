import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

function CommunityHub() {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState([]);
  const [creators, setCreators] = useState([]);

  const tabs = [
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'new', name: 'New Releases', icon: '✨' },
    { id: 'top-rated', name: 'Top Rated', icon: '⭐' },
    { id: 'creators', name: 'Featured Creators', icon: '👥' }
  ];

  // Sample community data
  const sampleGames = [
    {
      id: 'c1',
      title: "The Lost Kingdom",
      creator: "FantasyMaster",
      description: "Epic fantasy adventure with dragons and magic",
      rating: 4.8,
      plays: 15420,
      thumbnail: "🏰",
      tags: ["Fantasy", "Adventure", "Dragons"],
      featured: true
    },
    {
      id: 'c2',
      title: "Neon Streets",
      creator: "CyberPunk2024",
      description: "Cyberpunk thriller in a dystopian future",
      rating: 4.6,
      plays: 8930,
      thumbnail: "🌃",
      tags: ["Cyberpunk", "Thriller", "Sci-Fi"]
    },
    {
      id: 'c3',
      title: "Pirate's Treasure",
      creator: "SeaAdventurer",
      description: "Swashbuckling adventure on the high seas",
      rating: 4.4,
      plays: 12100,
      thumbnail: "🏴‍☠️",
      tags: ["Pirates", "Adventure", "Ocean"]
    },
    {
      id: 'c4',
      title: "Space Station Omega",
      creator: "SciFiWriter",
      description: "Survival horror in deep space",
      rating: 4.7,
      plays: 6850,
      thumbnail: "🚀",
      tags: ["Space", "Horror", "Survival"]
    },
    {
      id: 'c5',
      title: "Medieval Quest",
      creator: "KnightTales",
      description: "Classic medieval adventure with knights and quests",
      rating: 4.3,
      plays: 9240,
      thumbnail: "⚔️",
      tags: ["Medieval", "Knights", "Quest"]
    }
  ];

  const featuredCreators = [
    {
      name: "FantasyMaster",
      gamesCreated: 12,
      totalPlays: 45000,
      avgRating: 4.7,
      followers: 2340,
      badge: "🏆",
      specialization: "Fantasy Adventures"
    },
    {
      name: "CyberPunk2024",
      gamesCreated: 8,
      totalPlays: 22000,
      avgRating: 4.5,
      followers: 1850,
      badge: "🚀",
      specialization: "Sci-Fi Stories"
    },
    {
      name: "SciFiWriter",
      gamesCreated: 15,
      totalPlays: 38000,
      avgRating: 4.6,
      followers: 2100,
      badge: "⭐",
      specialization: "Space Horror"
    }
  ];

  useEffect(() => {
    // Load community games (including user-created ones)
    const savedGames = JSON.parse(localStorage.getItem('rpgGames') || '[]');
    const publishedUserGames = savedGames
      .filter(game => game.status === 'published')
      .map(game => ({
        ...game,
        creator: 'You',
        rating: game.rating || 4.0,
        plays: game.plays || 0,
        thumbnail: '🎮',
        tags: ['User Created']
      }));
    
    setGames([...publishedUserGames, ...sampleGames]);
    setCreators(featuredCreators);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSortedGames = () => {
    switch (activeTab) {
      case 'trending':
        return filteredGames.sort((a, b) => b.plays - a.plays);
      case 'new':
        return filteredGames.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
      case 'top-rated':
        return filteredGames.sort((a, b) => b.rating - a.rating);
      case 'creators':
        return creators;
      default:
        return filteredGames;
    }
  };

  const handleLike = (gameId) => {
    // Simulate liking a game
    console.log(`Liked game: ${gameId}`);
  };

  const handleFollow = (creatorName) => {
    // Simulate following a creator
    console.log(`Followed creator: ${creatorName}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-morphism rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search games, creators, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none pl-10"
            />
            <svg className="w-5 h-5 absolute left-3 top-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300">
              🎯 Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300">
              📊 Sort
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'creators' ? (
          // Featured Creators
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedGames().map((creator, index) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3 mx-auto">
                    {creator.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
                    <span>{creator.name}</span>
                    <span>{creator.badge}</span>
                  </h3>
                  <p className="text-purple-300 text-sm">{creator.specialization}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Games Created:</span>
                    <span className="text-white font-medium">{creator.gamesCreated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Plays:</span>
                    <span className="text-green-400 font-medium">{creator.totalPlays.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg Rating:</span>
                    <span className="text-yellow-400 font-medium">{creator.avgRating}⭐</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Followers:</span>
                    <span className="text-blue-400 font-medium">{creator.followers}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(creator.name)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 font-semibold"
                >
                  👤 Follow Creator
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          // Games Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getSortedGames().map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2 group-hover:animate-bounce">
                    {game.thumbnail}
                  </div>
                  {game.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ FEATURED
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-purple-300 text-sm">by {game.creator}</p>
                </div>

                <p className="text-gray-300 text-sm mb-4 h-12 overflow-hidden">
                  {game.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-yellow-400 font-medium">{game.rating}⭐</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Plays:</span>
                    <span className="text-green-400 font-medium">{game.plays.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {game.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/play/${game.id}`}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 text-center text-sm font-semibold"
                  >
                    ▶️ Play
                  </Link>
                  <button
                    onClick={() => handleLike(game.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 text-sm"
                  >
                    ❤️
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {getSortedGames().length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">No games found</h3>
            <p className="text-gray-400 text-center max-w-md">
              Try adjusting your search or browse different categories to discover amazing games
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

window.CommunityHub = CommunityHub;