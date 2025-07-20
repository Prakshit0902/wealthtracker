import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardBody, CardContainer, CardItem } from './ui/3d-card';
import { HoverEffect } from './ui/card-hover-effect';
import TradingCard from './TradingCard';
import { Line, LineChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = ({ credits, setCredits, level, xp, setXp, portfolio, setPortfolio, achievements }) => {
  const [marketData, setMarketData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showTrading, setShowTrading] = useState(false);

  // Space-themed assets
  const spaceAssets = [
    {
      id: 1,
      name: 'Mars Colony Shares',
      symbol: 'MARS',
      price: 2500,
      change: 5.2,
      type: 'planet',
      risk: 'medium',
      description: 'Invest in the future of Mars colonization',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 2,
      name: 'Asteroid Mining Corp',
      symbol: 'ASTRO',
      price: 850,
      change: -2.1,
      type: 'asteroid',
      risk: 'high',
      description: 'High-risk, high-reward asteroid mining ventures',
      color: 'from-gray-500 to-gray-700'
    },
    {
      id: 3,
      name: 'SpaceX Fuel Tokens',
      symbol: 'FUEL',
      price: 125,
      change: 12.5,
      type: 'crypto',
      risk: 'high',
      description: 'Cryptocurrency for space fuel transactions',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 4,
      name: 'Lunar Real Estate',
      symbol: 'MOON',
      price: 5000,
      change: 3.2,
      type: 'planet',
      risk: 'low',
      description: 'Premium lunar property investments',
      color: 'from-gray-300 to-gray-500'
    },
    {
      id: 5,
      name: 'Quantum Drive Tech',
      symbol: 'WARP',
      price: 3200,
      change: 8.7,
      type: 'tech',
      risk: 'medium',
      description: 'Next-gen space propulsion technology',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Generate market data
  useEffect(() => {
    const generateData = () => {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          value: Math.floor(Math.random() * 1000 + 9000)
        });
      }
      setMarketData(data);
    };
    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (asset, amount, type) => {
    const totalCost = asset.price * amount;
    
    if (type === 'buy') {
            if (credits >= totalCost) {
        setCredits(credits - totalCost);
        setPortfolio(prev => {
          const existing = prev.find(p => p.id === asset.id);
          if (existing) {
            return prev.map(p => 
              p.id === asset.id 
                ? { ...p, amount: p.amount + amount }
                : p
            );
          }
          return [...prev, { ...asset, amount }];
        });
        setXp(xp + Math.floor(amount * 10));
      }
    } else if (type === 'sell') {
      const holding = portfolio.find(p => p.id === asset.id);
      if (holding && holding.amount >= amount) {
        setCredits(credits + totalCost);
        setPortfolio(prev => 
          prev.map(p => 
            p.id === asset.id 
              ? { ...p, amount: p.amount - amount }
              : p
          ).filter(p => p.amount > 0)
        );
        setXp(xp + Math.floor(amount * 5));
      }
    }
    setShowTrading(false);
  };

  const totalPortfolioValue = portfolio.reduce((sum, holding) => 
    sum + (holding.price * holding.amount), 0
  );

  return (
    <div className="space-y-8">
      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Cosmic Market Overview
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#4b5563" />
                  <YAxis stroke="#4b5563" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
          >
            <h3 className="text-lg font-semibold mb-2">Portfolio Value</h3>
            <p className="text-3xl font-bold text-purple-300">
              ₹{totalPortfolioValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {portfolio.length} active positions
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20"
          >
            <h3 className="text-lg font-semibold mb-2">Today's Profit</h3>
            <p className="text-3xl font-bold text-green-400">
              +₹{Math.floor(Math.random() * 5000).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              +{(Math.random() * 10).toFixed(2)}% from yesterday
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Trading Assets */}
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Cosmic Assets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaceAssets.map((asset) => (
            <CardContainer key={asset.id} className="inter-var">
              <CardBody className="bg-gray-900/50 backdrop-blur-xl relative group/card hover:shadow-2xl hover:shadow-purple-500/[0.1] border-gray-800 w-full h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-white"
                >
                  {asset.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-gray-400 text-sm mt-2"
                >
                  {asset.description}
                </CardItem>
                
                <CardItem translateZ="100" className="w-full mt-4">
                  <div className={`h-2 w-full rounded-full bg-gradient-to-r ${asset.color}`} />
                </CardItem>
                
                <div className="flex justify-between items-end mt-6">
                  <CardItem
                    translateZ={20}
                    className="text-2xl font-bold"
                  >
                    ₹{asset.price}
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    className={`text-sm font-semibold ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </CardItem>
                </div>
                
                <CardItem
                  translateZ={20}
                  as="button"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowTrading(true);
                  }}
                  className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Trade Now
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-800"
        >
          <h3 className="text-2xl font-bold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.slice(-3).reverse().map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg"
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div>
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(achievement.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trading Modal */}
      <AnimatePresence>
        {showTrading && selectedAsset && (
          <TradingCard
            asset={selectedAsset}
            onClose={() => setShowTrading(false)}
            onTrade={handleTrade}
            currentCredits={credits}
            portfolio={portfolio}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;