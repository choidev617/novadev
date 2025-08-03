import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

function GameStudio() {
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    scenes: []
  });
  const [currentScene, setCurrentScene] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [language, setLanguage] = useState(window.LanguageManager.getCurrentLanguage());
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const handleLanguageChange = (lang) => {
      setLanguage(lang);
    };
    window.LanguageManager.addListener(handleLanguageChange);
    return () => window.LanguageManager.removeListener(handleLanguageChange);
  }, []);

  const t = (key) => window.LanguageManager.t(key);

  const storyElements = [
    { id: 'dialogue', name: t('dialogue'), icon: '💬', color: 'bg-blue-500' },
    { id: 'choice', name: t('choice'), icon: '🔀', color: 'bg-green-500' },
    { id: 'combat', name: t('combat'), icon: '⚔️', color: 'bg-red-500' },
    { id: 'character', name: t('character'), icon: '👤', color: 'bg-purple-500' },
    { id: 'item', name: t('item'), icon: '💎', color: 'bg-yellow-500' },
    { id: 'location', name: t('location'), icon: '🏰', color: 'bg-indigo-500' }
  ];

  const handleDragStart = (e, element) => {
    setDraggedItem(element);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
    
    if (draggedItem) {
      const newElement = {
        id: Date.now(),
        type: draggedItem.id,
        name: draggedItem.name,
        content: `New ${draggedItem.name}`,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };

      if (currentScene) {
        setCurrentScene({
          ...currentScene,
          elements: [...(currentScene.elements || []), newElement]
        });
      }
    }
    setDraggedItem(null);
  };

  const createNewScene = () => {
    const newScene = {
      id: Date.now(),
      name: `${t('scenes')} ${gameData.scenes.length + 1}`,
      elements: []
    };
    setGameData({
      ...gameData,
      scenes: [...gameData.scenes, newScene]
    });
    setCurrentScene(newScene);
  };

  const saveGame = () => {
    const savedGames = JSON.parse(localStorage.getItem('rpgGames') || '[]');
    const gameToSave = {
      ...gameData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      scenes: currentScene ? gameData.scenes.map(scene => 
        scene.id === currentScene.id ? currentScene : scene
      ) : gameData.scenes
    };
    savedGames.push(gameToSave);
    localStorage.setItem('rpgGames', JSON.stringify(savedGames));
    alert(t('gameSaved'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Game Settings */}
      <div className="lg:col-span-1">
        <div className="glass-morphism rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-purple-300">{t('gameSettings')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('title')}</label>
              <input
                type="text"
                value={gameData.title}
                onChange={(e) => setGameData({...gameData, title: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                placeholder={t('enterTitle')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('description')}</label>
              <textarea
                value={gameData.description}
                onChange={(e) => setGameData({...gameData, description: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none h-24 resize-none"
                placeholder={t('enterDescription')}
              />
            </div>
            <button
              onClick={saveGame}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300"
            >
              💾 {t('saveGame')}
            </button>
          </div>
        </div>

        {/* Story Elements */}
        <div className="glass-morphism rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-purple-300">{t('storyElements')}</h3>
          <div className="space-y-2">
            {storyElements.map(element => (
              <motion.div
                key={element.id}
                className={`drag-item ${element.color} rounded-lg p-3 cursor-grab flex items-center space-x-3 hover:scale-105 transition-transform`}
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{element.icon}</span>
                <span className="font-medium text-white">{element.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scene Management */}
      <div className="lg:col-span-1">
        <div className="glass-morphism rounded-lg p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-300">{t('scenes')}</h3>
            <button
              onClick={createNewScene}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 text-sm"
            >
              + {t('newScene')}
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {gameData.scenes.map(scene => (
              <div
                key={scene.id}
                onClick={() => setCurrentScene(scene)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  currentScene?.id === scene.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <div className="font-medium">{scene.name}</div>
                <div className="text-sm opacity-70">
                  {scene.elements?.length || 0} {t('elements')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scene Editor */}
      <div className="lg:col-span-2">
        <div className="glass-morphism rounded-lg p-6 h-full">
          <h3 className="text-xl font-bold mb-4 text-purple-300">
            {currentScene ? currentScene.name : t('sceneEditor')}
          </h3>
          {currentScene ? (
            <div
              ref={dropZoneRef}
              className="drop-zone relative w-full h-96 bg-gray-800 rounded-lg border-2 border-dashed border-purple-500/30 overflow-hidden"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {currentScene.elements?.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎭</div>
                    <p>{t('dragElements')}</p>
                  </div>
                </div>
              ) : (
                currentScene.elements?.map(element => (
                  <motion.div
                    key={element.id}
                    className="story-node absolute glass-morphism rounded-lg p-3 cursor-move"
                    style={{ left: element.x, top: element.y }}
                    drag
                    dragMomentum={false}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {storyElements.find(e => e.id === element.type)?.icon}
                      </span>
                      <span className="font-medium text-white">{element.name}</span>
                    </div>
                    <div className="text-sm text-gray-300">{element.content}</div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p>{t('createScene')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.GameStudio = GameStudio;