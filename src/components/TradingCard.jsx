import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const TradingCard = ({ asset, onClose, onTrade, currentCredits, portfolio }) => {
  const [amount, setAmount] = useState(1);
  const [tradeType, setTradeType] = useState('buy');
  
  const holding = portfolio.find(p => p.id === asset.id);
  const maxBuy = Math.floor(currentCredits / asset.price);
  const maxSell = holding ? holding.amount : 0;
  const totalCost = asset.price * amount;
  
  const canExecuteTrade = tradeType === 'buy' 
    ? amount <= maxBuy && amount > 0
    : amount <= maxSell && amount > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-800 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold">{asset.name}</h3>
            <p className="text-gray-400">{asset.symbol}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">Current Price</span>
            <span className="text-xl font-bold">₹{asset.price}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">24h Change</span>
            <span className={`text-xl font-bold flex items-center gap-1 ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {asset.change > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {Math.abs(asset.change)}%
            </span>
          </div>

          {holding && (
            <div className="flex justify-between items-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <span className="text-gray-400">Your Holdings</span>
              <span className="text-xl font-bold text-purple-400">{holding.amount} units</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                tradeType === 'buy'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                tradeType === 'sell'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Sell
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <input
              type="number"
              min="1"
              max={tradeType === 'buy' ? maxBuy : maxSell}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max {tradeType === 'buy' ? 'buyable' : 'sellable'}: {tradeType === 'buy' ? maxBuy : maxSell} units
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Cost</span>
              <span className="font-semibold">₹{totalCost.toLocaleString()}</span>
            </div>
            {tradeType === 'buy' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Credits After</span>
                <span className="font-semibold text-purple-400">
                  ₹{(currentCredits - totalCost).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {!canExecuteTrade && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
              <AlertCircle size={16} className="text-red-400" />
              <p className="text-sm text-red-400">
                {tradeType === 'buy' 
                  ? 'Insufficient credits for this trade'
                  : 'You don\'t have enough units to sell'}
              </p>
            </div>
          )}

          <button
            onClick={() => canExecuteTrade && onTrade(asset, amount, tradeType)}
            disabled={!canExecuteTrade}
            className={`w-full py-4 rounded-lg font-bold transition-all ${
              canExecuteTrade
                ? tradeType === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {amount} {asset.symbol}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TradingCard;