import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function GamePlayer({ game, onBack }) {
  const [gameState, setGameState] = useState({
    currentScene: 0,
    playerStats: { health: 100, mana: 50, level: 1, experience: 0 },
    inventory: [],
    choices: [],
    gameLog: []
  });
  const [currentStory, setCurrentStory] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample story content for demo games
  const storyContent = {
    1: { // The Crystal of Eternity
      scenes: [
        {
          text: "You stand at the entrance of the Enchanted Forest, ancient trees towering above you. The Crystal of Eternity lies somewhere within these mystical woods. A path splits in two directions ahead.",
          choices: [
            { text: "Take the left path through the glowing mushrooms", next: 1 },
            { text: "Take the right path following the crystal stream", next: 2 },
            { text: "Cast a detection spell to sense magical energy", next: 3 }
          ]
        },
        {
          text: "The glowing mushrooms illuminate your way as you venture deeper. You discover a fairy grove where ancient spirits dwell. They offer to guide you, but their aid comes with a price.",
          choices: [
            { text: "Accept their guidance and offer your memories as payment", next: 4 },
            { text: "Politely decline and continue alone", next: 5 },
            { text: "Challenge them to a riddle contest instead", next: 6 }
          ]
        },
        {
          text: "Following the crystal stream, you find it leads to a magnificent waterfall. Behind the cascading water, you glimpse the entrance to a hidden cave that pulses with magical energy.",
          choices: [
            { text: "Dive through the waterfall into the cave", next: 7 },
            { text: "Search for another way around the waterfall", next: 8 },
            { text: "Study the magical patterns in the water first", next: 9 }
          ]
        }
      ]
    },
    2: { // Cyberpunk Detective
      scenes: [
        {
          text: "Rain pounds the neon-lit streets of Neo-Tokyo. You're Detective Morgan, investigating a series of cyber-crimes. Your neural implant buzzes with an incoming call from the precinct.",
          choices: [
            { text: "Answer the call immediately", next: 1 },
            { text: "Ignore the call and investigate the alley", next: 2 },
            { text: "Hack into nearby surveillance cameras first", next: 3 }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    if (game && game.scenes && game.scenes.length > 0) {
      // Use created game content
      const firstScene = game.scenes[0];
      setCurrentStory(`Welcome to ${game.title}! ${game.description}\n\n${firstScene.elements?.map(e => e.content).join(' ') || 'Your adventure begins...'}`);
    } else {
      // Use sample story content
      const story = storyContent[game.id];
      if (story && story.scenes[0]) {
        setCurrentStory(story.scenes[0].text);
        setGameState(prev => ({ ...prev, choices: story.scenes[0].choices }));
      } else {
        setCurrentStory(`Welcome to ${game.title}! ${game.description}\n\nYour adventure begins in this mysterious world. What would you like to do first?`);
        setGameState(prev => ({ 
          ...prev, 
          choices: [
            { text: "Explore the surrounding area", next: 1 },
            { text: "Check your inventory", next: 2 },
            { text: "Look for other characters", next: 3 }
          ]
        }));
      }
    }
    setShowChoices(true);
  }, [game]);

  const makeChoice = (choice) => {
    setIsLoading(true);
    setShowChoices(false);

    // Add choice to game log
    const newLogEntry = `> You chose: ${choice.text}`;
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog, newLogEntry]
    }));

    // Simulate story progression
    setTimeout(() => {
      const story = storyContent[game.id];
      if (story && story.scenes[choice.next]) {
        setCurrentStory(story.scenes[choice.next].text);
        setGameState(prev => ({ 
          ...prev, 
          currentScene: choice.next,
          choices: story.scenes[choice.next].choices || []
        }));
      } else {
        // Generate dynamic response
        const responses = [
          "Your choice leads you to new discoveries...",
          "The path ahead becomes clearer as you make your decision...",
          "Something unexpected happens as a result of your action...",
          "You feel the weight of your decision as the story unfolds..."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setCurrentStory(randomResponse);
        
        // Generate new choices
        const dynamicChoices = [
          { text: "Continue forward", next: Math.floor(Math.random() * 5) },
          { text: "Rest and recover", next: Math.floor(Math.random() * 5) },
          { text: "Investigate further", next: Math.floor(Math.random() * 5) }
        ];
        setGameState(prev => ({ ...prev, choices: dynamicChoices }));
      }
      
      setIsLoading(false);
      setShowChoices(true);
    }, 2000);
  };

  const restartGame = () => {
    setGameState({
      currentScene: 0,
      playerStats: { health: 100, mana: 50, level: 1, experience: 0 },
      inventory: [],
      choices: [],
      gameLog: []
    });
    
    const story = storyContent[game.id];
    if (story && story.scenes[0]) {
      setCurrentStory(story.scenes[0].text);
      setGameState(prev => ({ ...prev, choices: story.scenes[0].choices }));
    }
    setShowChoices(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{game.title}</h1>
              <p className="text-purple-300">{game.description}</p>
            </div>
          </div>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Restart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Player Stats */}
          <div className="lg:col-span-1">
            <div className="glass-morphism rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Player Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health</span>
                    <span>{gameState.playerStats.health}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{width: `${gameState.playerStats.health}%`}}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mana</span>
                    <span>{gameState.playerStats.mana}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{width: `${gameState.playerStats.mana}%`}}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Level</span>
                  <span className="font-bold text-yellow-400">{gameState.playerStats.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience</span>
                  <span className="font-bold text-green-400">{gameState.playerStats.experience}</span>
                </div>
              </div>
            </div>

            {/* Game Log */}
            <div className="glass-morphism rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Game Log</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto text-sm">
                {gameState.gameLog.length === 0 ? (
                  <p className="text-gray-400 italic">No actions yet...</p>
                ) : (
                  gameState.gameLog.map((entry, index) => (
                    <div key={index} className="text-gray-300 border-l-2 border-purple-500 pl-3">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3">
            <div className="glass-morphism rounded-lg p-8 min-h-[400px] flex flex-col">
              {/* Story Display */}
              <div className="flex-1 mb-6">
                <motion.div
                  key={currentStory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="prose prose-invert max-w-none"
                >
                  <p className="text-lg leading-relaxed text-gray-100 whitespace-pre-line">
                    {currentStory}
                  </p>
                </motion.div>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="flex items-center space-x-3 text-purple-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      <span className="ml-3">Processing your choice...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Choices */}
              <AnimatePresence>
                {showChoices && gameState.choices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">What do you choose?</h4>
                    {gameState.choices.map((choice, index) => (
                      <motion.button
                        key={index}
                        onClick={() => makeChoice(choice)}
                        className="choice-button w-full p-4 text-left bg-gradient-to-r from-gray-800 to-gray-700 hover:from-purple-800 hover:to-blue-800 rounded-lg border border-purple-500/30 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex items-center">
                          <span className="text-purple-400 font-bold mr-3">{index + 1}.</span>
                          <span className="text-white">{choice.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.GamePlayer = GamePlayer;