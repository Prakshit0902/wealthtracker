import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Clock, Award, Lock, CheckCircle } from 'lucide-react';
import { BackgroundGradient } from './ui/BackgroundGradient';

const SpaceMissions = ({ credits, setCredits, xp, setXp, setAchievements }) => {
  const [activeMissions, setActiveMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);

  const missions = [
    {
      id: 1,
      title: 'First Trade',
      description: 'Complete your first trade in any cosmic asset',
      reward: 500,
      xpReward: 20,
      difficulty: 'Easy',
      icon: '🚀',
      duration: 300, // 5 minutes
      requirement: null
    },
    {
      id: 2,
      title: 'Portfolio Diversification',
      description: 'Own at least 3 different types of cosmic assets',
      reward: 1000,
      xpReward: 35,
      difficulty: 'Medium',
      icon: '🌌',
      duration: 600, // 10 minutes
      requirement: 'Own 3 assets'
    },
    {
      id: 3,
      title: 'Asteroid Hunter',
      description: 'Make a profitable trade on Asteroid Mining Corp',
      reward: 1500,
      xpReward: 50,
      difficulty: 'Hard',
      icon: '☄️',
      duration: 900, // 15 minutes
            requirement: 'Trade ASTRO with profit'
    },
    {
      id: 4,
      title: 'Moon Landing',
      description: 'Accumulate 10,000 credits in total portfolio value',
      reward: 2000,
      xpReward: 75,
      difficulty: 'Hard',
      icon: '🌙',
      duration: 1200, // 20 minutes
      requirement: 'Portfolio value ≥ 10,000'
    },
    {
      id: 5,
      title: 'Day Trader',
      description: 'Complete 5 trades within 10 minutes',
      reward: 1200,
      xpReward: 40,
      difficulty: 'Medium',
      icon: '📊',
      duration: 600,
      requirement: '5 trades in 10 min'
    },
    {
      id: 6,
      title: 'Risk Taker',
      description: 'Invest in high-risk assets and gain profit',
      reward: 2500,
      xpReward: 60,
      difficulty: 'Hard',
      icon: '🎲',
      duration: 1500,
      requirement: 'Profit from high-risk'
    }
  ];

  const startMission = (mission) => {
    const missionWithTimer = {
      ...mission,
      startTime: Date.now(),
      endTime: Date.now() + (mission.duration * 1000),
      progress: 0
    };
    
    setActiveMissions([...activeMissions, missionWithTimer]);
    
    // Simulate mission progress
    const progressInterval = setInterval(() => {
      setActiveMissions(prev => prev.map(m => {
        if (m.id === mission.id) {
          const elapsed = Date.now() - m.startTime;
          const progress = Math.min((elapsed / (mission.duration * 1000)) * 100, 100);
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            completeMission(m);
            return null;
          }
          
          return { ...m, progress };
        }
        return m;
      }).filter(Boolean));
    }, 100);
  };

  const completeMission = (mission) => {
    setCompletedMissions([...completedMissions, mission.id]);
    setCredits(prev => prev + mission.reward);
    setXp(prev => prev + mission.xpReward);
    setAchievements(prev => [...prev, {
      id: Date.now(),
      title: `Completed: ${mission.title}`,
      icon: mission.icon,
      timestamp: new Date()
    }]);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-500';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Hard': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          Space Missions
        </h2>
        <p className="text-gray-400">Complete missions to earn rewards and XP</p>
      </div>

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="text-purple-400" />
            Active Missions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMissions.map((mission) => (
              <motion.div
                key={mission.id}
                layout
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{mission.icon}</span>
                      {mission.title}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">{mission.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.floor(mission.progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        animate={{ width: `${mission.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span>
                        {Math.max(0, Math.floor((mission.endTime - Date.now()) / 1000))}s remaining
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400">+₹{mission.reward}</span>
                      <span className="text-purple-400">+{mission.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Missions */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="text-blue-400" />
          Available Missions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const isActive = activeMissions.some(m => m.id === mission.id);
            const isCompleted = completedMissions.includes(mission.id);
            
            return (
              <BackgroundGradient key={mission.id} className="rounded-2xl p-0.5">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 rounded-2xl p-6 h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{mission.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(mission.difficulty)} text-white`}>
                      {mission.difficulty}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-2">{mission.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{mission.description}</p>
                  
                  {mission.requirement && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-yellow-400">
                      <Lock size={14} />
                      <span>{mission.requirement}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-semibold">+₹{mission.reward}</span>
                      <span className="text-purple-400 font-semibold">+{mission.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock size={14} />
                      <span>{mission.duration / 60}min</span>
                    </div>
                  </div>
                  
                  {isCompleted ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-lg bg-gray-800 text-gray-500 font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Completed
                    </button>
                  ) : isActive ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-lg bg-purple-900/50 text-purple-300 font-semibold"
                    >
                      In Progress...
                    </button>
                  ) : (
                    <button
                      onClick={() => startMission(mission)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Start Mission
                    </button>
                  )}
                </motion.div>
              </BackgroundGradient>
            );
          })}
        </div>
      </div>

      {/* Mission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
        >
          <Award className="text-purple-400 mb-2" size={32} />
          <h3 className="text-lg font-semibold mb-1">Missions Completed</h3>
          <p className="text-3xl font-bold">{completedMissions.length}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20"
        >
          <Rocket className="text-green-400 mb-2" size={32} />
          <h3 className="text-lg font-semibold mb-1">Active Missions</h3>
          <p className="text-3xl font-bold">{activeMissions.length}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20"
        >
          <Target className="text-blue-400 mb-2" size={32} />
          <h3 className="text-lg font-semibold mb-1">Success Rate</h3>
          <p className="text-3xl font-bold">
            {missions.length > 0 ? Math.round((completedMissions.length / missions.length) * 100) : 0}%
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpaceMissions;   