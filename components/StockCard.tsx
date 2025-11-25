import React from 'react';
import { StockRecommendation } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface StockCardProps {
  stock: StockRecommendation;
  delay: number;
}

const StockCard: React.FC<StockCardProps> = ({ stock, delay }) => {
  const isPositive = !stock.changePercent?.startsWith('-');
  
  const getRiskIcon = (level: string) => {
    switch(level.toLowerCase()) {
      case 'low': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'high': return <Zap className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg transform transition-all duration-700 ease-out hover:scale-105 hover:border-blue-500/50"
      style={{ 
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{stock.symbol}</h3>
          <p className="text-sm text-gray-400">{stock.name}</p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{stock.changePercent || '0.00%'}</span>
        </div>
      </div>

      <div className="flex items-end space-x-2 mb-4">
        <span className="text-3xl font-semibold text-white">{stock.price}</span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Sector</span>
          <span className="text-gray-300 font-medium">{stock.sector}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Risk Profile</span>
          <div className="flex items-center space-x-2">
            {getRiskIcon(stock.riskRating)}
            <span className="text-gray-300 font-medium">{stock.riskRating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Potential Upside</span>
          <span className="text-blue-400 font-medium">{stock.potentialUpside}</span>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Agent Rationale</p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {stock.rationale}
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StockCard;