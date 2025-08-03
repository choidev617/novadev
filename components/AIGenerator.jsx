import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

function AIGenerator() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationType, setGenerationType] = useState('story');
  const chatManagerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    chatManagerRef.current = new window.ChatManager(
      'You are an expert RPG story writer and game designer. Help creators develop compelling narratives, interesting characters, engaging dialogue, and immersive world-building for their RPG games. Provide creative suggestions, plot hooks, character backstories, and detailed descriptions.'
    );
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generationTypes = [
    { id: 'story', name: 'Story Plot', icon: '📖', prompt: 'Generate an engaging RPG story plot with' },
    { id: 'character', name: 'Character', icon: '👤', prompt: 'Create a detailed RPG character with' },
    { id: 'dialogue', name: 'Dialogue', icon: '💬', prompt: 'Write compelling dialogue for' },
    { id: 'world', name: 'World Building', icon: '🌍', prompt: 'Design a fantasy world with' },
    { id: 'quest', name: 'Quest', icon: '⚔️', prompt: 'Create an exciting quest involving' },
    { id: 'location', name: 'Location', icon: '🏰', prompt: 'Describe a detailed location that' }
  ];

  const quickPrompts = [
    'A mysterious forest with ancient secrets',
    'A brave knight on a redemption quest',
    'A magical academy with dark mysteries',
    'An epic battle between good and evil',
    'A lost treasure guarded by dragons',
    'A time-traveling adventure'
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentType = generationTypes.find(t => t.id === generationType);
    const enhancedMessage = `${currentType.prompt} ${inputMessage}`;
    
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: inputMessage, type: generationType }]);
    setIsLoading(true);

    chatManagerRef.current.addMessage('user', enhancedMessage);

    try {
      const response = await chatManagerRef.current.getCharacterResponse();
      setMessages(prev => [...prev, { role: 'assistant', content: response, type: generationType }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error generating content. Please try again.',
        type: generationType
      }]);
    }

    setIsLoading(false);
  };

  const useQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  const exportData = (message) => {
    const exportData = {
      type: message.type,
      content: message.content,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rpg-${message.type}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Generation Controls */}
      <div className="lg:col-span-1">
        <div className="glass-morphism rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Generation Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {generationTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setGenerationType(type.id)}
                className={`p-3 rounded-lg transition-all duration-300 flex flex-col items-center space-y-1 ${
                  generationType === type.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-xs font-medium text-center">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-morphism rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Quick Prompts</h3>
          <div className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => useQuickPrompt(prompt)}
                className="w-full p-2 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 text-sm text-gray-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <div className="glass-morphism rounded-lg p-6 h-full flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-purple-300">AI Story Generator</h3>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI Story Generator Ready</h3>
                <p className="text-gray-400 max-w-md">
                  Select a generation type and describe what you'd like me to create for your RPG game
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'glass-morphism text-gray-100'
                  }`}>
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">
                        {message.role === 'user' ? '👤' : '🤖'}
                      </span>
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : 'AI Generator'}
                      </span>
                      {message.type && (
                        <span className="ml-2 text-xs bg-black/30 px-2 py-1 rounded">
                          {generationTypes.find(t => t.id === message.type)?.name}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => exportData(message)}
                        className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                      >
                        📥 Export
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-morphism rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">🤖</span>
                    <span className="font-medium">AI Generator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Describe what you want to generate for ${generationTypes.find(t => t.id === generationType)?.name.toLowerCase()}...`}
              className="flex-1 px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AIGenerator = AIGenerator;