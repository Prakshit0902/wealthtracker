import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Users, Star } from 'lucide-react';
import { cn } from '../utils/cn';

const Leaderboard = ({ currentUser }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');

  // Generate mock leaderboard data
  useEffect(() => {
    const generateLeaderboard = () => {
      const names = [
        'AstroTrader42', 'CosmicWhale', 'MoonHodler', 'StarSeeker99',
        'GalaxyMaster', 'NebulaNinja', 'RocketMan21', 'SpaceAce',
        'PlutoRich', 'MarsMillionaire', 'SaturnSavvy', 'VenusVIP'
      ];

      const data = names.map((name, index) => ({
        id: index + 1,
        name,
        credits: Math.floor(Math.random() * 50000 + 10000),
        level: Math.floor(Math.random() * 15 + 5),
        trades: Math.floor(Math.random() * 100 + 20),
        profit: Math.random() * 50 - 10,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        rank: index + 1
      }));

      // Add current user
      const userRank = Math.floor(Math.random() * 20 + 5);
      data.splice(userRank - 1, 0, {
        id: 999,
        name: currentUser.name,
        credits: currentUser.credits,
        level: currentUser.level,
        trades: Math.floor(Math.random() * 50 + 10),
        profit: Math.random() * 30,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
        rank: userRank,
        isCurrentUser: true
      });

      // Sort by credits and assign ranks
      data.sort((a, b) => b.credits - a.credits);
      data.forEach((user, index) => {
        user.rank = index + 1;
      });

      setLeaderboardData(data);
    };

    generateLeaderboard();
  }, [currentUser, timeframe]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'from-yellow-900/50 to-yellow-700/50 border-yellow-500/30';
      case 2: return 'from-gray-700/50 to-gray-600/50 border-gray-500/30';
      case 3: return 'from-orange-900/50 to-orange-700/50 border-orange-500/30';
      default: return 'from-gray-900/50 to-gray-800/50 border-gray-700/30';
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
          Galactic Leaderboard
        </h2>
        <p className="text-gray-400">Top traders in the cosmic economy</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {['daily', 'weekly', 'monthly', 'all-time'].map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={cn(
              "px-6 py-2 rounded-lg font-semibold transition-all capitalize",
              timeframe === period
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {period.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {leaderboardData.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative rounded-2xl p-6 backdrop-blur-xl border",
              index === 0 ? "md:order-2 md:scale-110" : index === 1 ? "md:order-1" : "md:order-3",
              `bg-gradient-to-br ${getRankColor(index + 1)}`
            )}
          >
            <div className="text-center">
              <div className="mb-4">{getRankIcon(index + 1)}</div>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-white/20"
              />
              <h3 className="text-xl font-bold mb-1">{user.name}</h3>
              <p className="text-2xl font-bold text-purple-400 mb-2">
                ₹{user.credits.toLocaleString()}
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <span>Level {user.level}</span>
                <span>{user.trades} trades</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-purple-400" />
            Top Space Traders
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-gray-400 font-medium">Rank</th>
                <th className="text-left p-4 text-gray-400 font-medium">Trader</th>
                <th className="text-right p-4 text-gray-400 font-medium">Credits</th>
                <th className="text-right p-4 text-gray-400 font-medium">Level</th>
                <th className="text-right p-4 text-gray-400 font-medium">Trades</th>
                <th className="text-right p-4 text-gray-400 font-medium">Profit %</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.slice(3).map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors",
                    user.isCurrentUser && "bg-purple-900/20"
                  )}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.isCurrentUser && <Star className="w-4 h-4 text-purple-400" />}
                      <span className="font-bold text-gray-500">#{user.rank}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        {user.isCurrentUser && (
                          <p className="text-xs text-purple-400">You</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold">
                    ₹{user.credits.toLocaleString()}
                  </td>
                                    <td className="p-4 text-right">
                    <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                      Level {user.level}
                    </span>
                  </td>
                  <td className="p-4 text-right text-gray-400">
                    {user.trades}
                  </td>
                  <td className="p-4 text-right">
                    <span className={cn(
                      "font-semibold flex items-center justify-end gap-1",
                      user.profit > 0 ? "text-green-400" : "text-red-400"
                    )}>
                      <TrendingUp size={14} className={user.profit < 0 ? "rotate-180" : ""} />
                      {Math.abs(user.profit).toFixed(1)}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 text-center"
        >
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Total Traders</p>
          <p className="text-2xl font-bold">{leaderboardData.length}</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 text-center"
        >
          <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Your Rank</p>
          <p className="text-2xl font-bold">
            #{leaderboardData.find(u => u.isCurrentUser)?.rank || '-'}
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 text-center"
        >
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Avg. Profit</p>
          <p className="text-2xl font-bold">
            {(leaderboardData.reduce((sum, u) => sum + u.profit, 0) / leaderboardData.length).toFixed(1)}%
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 text-center"
        >
          <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Top Credits</p>
          <p className="text-2xl font-bold">
            ₹{leaderboardData[0]?.credits.toLocaleString() || '0'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;