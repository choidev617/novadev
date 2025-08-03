import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

function CreatorDashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlays: 0,
    totalRating: 0,
    activeProjects: 0
  });
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Load projects from localStorage
    const savedGames = JSON.parse(localStorage.getItem('rpgGames') || '[]');
    setProjects(savedGames);
    
    // Calculate stats
    const totalGames = savedGames.length;
    const totalPlays = savedGames.reduce((sum, game) => sum + (game.plays || 0), 0);
    const totalRating = savedGames.reduce((sum, game) => sum + (game.rating || 0), 0) / (savedGames.length || 1);
    const activeProjects = savedGames.filter(game => game.status === 'active' || !game.status).length;

    setStats({
      totalGames,
      totalPlays,
      totalRating: totalRating.toFixed(1),
      activeProjects
    });
  }, []);

  const publishGame = (projectId) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { ...project, status: 'published', publishedAt: new Date().toISOString() }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('rpgGames', JSON.stringify(updatedProjects));
  };

  const deleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('rpgGames', JSON.stringify(updatedProjects));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20';
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="glass-morphism rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="text-3xl font-bold text-purple-400 mb-2">{stats.totalGames}</div>
          <div className="text-gray-300">Total Games</div>
        </motion.div>
        
        <motion.div 
          className="glass-morphism rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalPlays}</div>
          <div className="text-gray-300">Total Plays</div>
        </motion.div>
        
        <motion.div 
          className="glass-morphism rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.totalRating}⭐</div>
          <div className="text-gray-300">Avg Rating</div>
        </motion.div>
        
        <motion.div 
          className="glass-morphism rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.activeProjects}</div>
          <div className="text-gray-300">Active Projects</div>
        </motion.div>
      </div>

      {/* Projects List */}
      <div className="glass-morphism rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-300">Your Projects</h2>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300">
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">No projects yet</h3>
            <p className="text-gray-400 mb-6">Create your first RPG game to get started!</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300">
              Create Your First Game
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-white">{project.title || 'Untitled Game'}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status || 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">{project.description || 'No description'}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-500">Scenes:</span> {project.scenes?.length || 0}
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-gray-500">Plays:</span> {project.plays || 0}
                      </div>
                      <div>
                        <span className="text-gray-500">Rating:</span> {project.rating || 'N/A'}⭐
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 text-sm"
                      onClick={() => window.open(`/play/${project.id}`, '_blank')}
                    >
                      ▶️ Play
                    </button>
                    <button className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 text-sm">
                      ✏️ Edit
                    </button>
                    {project.status !== 'published' && (
                      <button 
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 text-sm"
                        onClick={() => publishGame(project.id)}
                      >
                        📤 Publish
                      </button>
                    )}
                    <button 
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 text-sm"
                      onClick={() => deleteProject(project.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="glass-morphism rounded-lg p-6">
        <h2 className="text-2xl font-bold text-purple-300 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {projects.slice(0, 5).map((project, index) => (
            <div key={project.id} className="flex items-center space-x-4 py-2 border-b border-gray-700 last:border-b-0">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {project.title?.charAt(0) || 'G'}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{project.title || 'Untitled Game'}</div>
                <div className="text-gray-400 text-sm">
                  {project.publishedAt ? 'Published' : 'Created'} {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {project.plays || 0} plays
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.CreatorDashboard = CreatorDashboard;