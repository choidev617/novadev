import React, { useState } from 'react';
import { Link, useParams } from 'react-router';

function Play() {
  const { gameId } = useParams();
  const GamePlayer = window.GamePlayer;
  const [selectedGame, setSelectedGame] = useState(null);

  const sampleGames = [
    {
      id: 1,
      title: "The Crystal of Eternity",
      description: "A magical adventure through enchanted realms",
      thumbnail: "🔮",
      genre: "Fantasy",
      difficulty: "Medium",
      playtime: "45 min"
    },
    {
      id: 2,
      title: "Cyberpunk Detective",
      description: "Solve crimes in a futuristic neon city",
      thumbnail: "🌃",
      genre: "Sci-Fi",
      difficulty: "Hard",
      playtime: "60 min"
    },
    {
      id: 3,
      title: "Dragon's Keep",
      description: "Rescue the princess from an ancient dragon",
      thumbnail: "🐉",
      genre: "Adventure",
      difficulty: "Easy",
      playtime: "30 min"
    },
    {
      id: 4,
      title: "Space Station Alpha",
      description: "Survival horror on an abandoned space station",
      thumbnail: "🚀",
      genre: "Horror",
      difficulty: "Hard",
      playtime: "90 min"
    }
  ];

  // Load saved games from localStorage
  const savedGames = JSON.parse(localStorage.getItem('rpgGames') || '[]');
  const allGames = [...savedGames, ...sampleGames];

  if (selectedGame || gameId) {
    const game = selectedGame || allGames.find(g => g.id.toString() === gameId);
    return <GamePlayer game={game} onBack={() => setSelectedGame(null)} />;
  }

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
              Play Games
            </h1>
          </div>
          <Link 
            to="/studio" 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <span>🎮</span>
            <span>Create Game</span>
          </Link>
        </div>

        {/* Game Library */}
        <div className="space-y-8">
          {savedGames.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-300 mb-4">Your Created Games</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPlay={() => setSelectedGame(game)}
                    isCreated={true}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Featured Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlay={() => setSelectedGame(game)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameCard({ game, onPlay, isCreated = false }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="glass-morphism rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="text-center mb-4">
        <div className="text-6xl mb-2 group-hover:animate-bounce">
          {game.thumbnail || '🎮'}
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
          {game.title}
        </h3>
      </div>

      <p className="text-gray-300 text-sm mb-4 h-12 overflow-hidden">
        {game.description}
      </p>

      <div className="space-y-2 mb-4">
        {game.genre && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Genre:</span>
            <span className="text-purple-300 font-medium">{game.genre}</span>
          </div>
        )}
        {game.difficulty && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Difficulty:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
              {game.difficulty}
            </span>
          </div>
        )}
        {game.playtime && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Playtime:</span>
            <span className="text-blue-300 font-medium">{game.playtime}</span>
          </div>
        )}
        {isCreated && game.createdAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Created:</span>
            <span className="text-green-300 font-medium">
              {new Date(game.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onPlay}
        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
      >
        <span>▶️</span>
        <span>Play Now</span>
      </button>
    </div>
  );
}

window.Play = Play;