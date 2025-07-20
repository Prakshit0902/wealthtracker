import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Portfolio3D from './components/Portfolio3D';
import SpaceMissions from './components/SpaceMissions';
import Leaderboard from './components/Leaderboard';
import { BackgroundBeams } from './components/ui/background-beams';
import { FloatingNav } from './components/ui/floating-navbar';
import { SparklesCore } from './components/ui/sparkles';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [userCredits, setUserCredits] = useState(10000);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const navItems = [
    { name: 'Mission Control', link: 'dashboard', icon: '🚀' },
    { name: 'Galaxy Portfolio', link: 'portfolio', icon: '🌌' },
    { name: 'Space Missions', link: 'missions', icon: '🛸' },
    { name: 'Crew Rankings', link: 'leaderboard', icon: '👨‍🚀' },
  ];

  useEffect(() => {
    // Check for level up
    if (xp >= 100) {
      setLevel(prev => prev + 1);
      setXp(xp - 100);
      // Add achievement
      setAchievements(prev => [...prev, {
        id: Date.now(),
        title: `Reached Level ${level + 1}!`,
        icon: '⭐',
        timestamp: new Date()
      }]);
    }
  }, [xp, level]);

  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            credits={userCredits} 
            setCredits={setUserCredits} 
            level={level} 
            xp={xp} 
            setXp={setXp} 
            setLevel={setLevel}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            achievements={achievements}
          />
        );
      case 'portfolio':
        return <Portfolio3D portfolio={portfolio} credits={userCredits} />;
      case 'missions':
        return (
          <SpaceMissions 
            credits={userCredits} 
            setCredits={setUserCredits} 
            xp={xp} 
            setXp={setXp}
            setAchievements={setAchievements}
          />
        );
      case 'leaderboard':
        return <Leaderboard currentUser={{ name: 'You', credits: userCredits, level }} />;
      default:
        return <Dashboard credits={userCredits} setCredits={setUserCredits} />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <BackgroundBeams />
      
      <FloatingNav 
        navItems={navItems} 
        className="top-10"
        onClick={(item) => setActiveView(item.link)}
      />
      
      <div className="relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-24 pb-8"
        >
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-2">
            AstroWealth
          </h1>
          <p className="text-gray-400 text-xl">Navigate the Cosmic Economy</p>
          
          <div className="flex justify-center gap-6 mt-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl px-8 py-4 border border-purple-500/20"
            >
              <p className="text-sm text-gray-400">Space Credits</p>
              <p className="text-3xl font-bold text-purple-400">₹{userCredits.toLocaleString()}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl px-8 py-4 border border-pink-500/20"
            >
              <p className="text-sm text-gray-400">Pilot Level</p>
              <p className="text-3xl font-bold text-pink-400">Level {level}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl px-8 py-4 border border-blue-500/20"
            >
              <p className="text-sm text-gray-400">XP Progress</p>
              <div className="w-40 h-3 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xp}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{xp}/100 XP</p>
            </motion.div>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 pb-20 max-w-7xl">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;