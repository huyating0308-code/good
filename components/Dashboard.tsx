import React from 'react';
import { AgentResponse, UserPreferences } from '../types';
import StockCard from './StockCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, ExternalLink, Activity, Target } from 'lucide-react';

interface DashboardProps {
  data: AgentResponse;
  prefs: UserPreferences;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, prefs, onReset }) => {
  // Parse potential upside string to number for chart, handle different formats
  const parsePotential = (pot: string) => {
    const num = parseFloat(pot.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 10 : num;
  };

  const chartData = data.recommendations.map(rec => ({
    name: rec.symbol,
    potential: parsePotential(rec.potentialUpside),
    risk: rec.riskRating === 'High' ? 3 : rec.riskRating === 'Medium' ? 2 : 1
  }));

  return (
    <div className="max-w-6xl mx-auto w-full p-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AlphaAgent Report</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-2">
               <Activity className="w-3 h-3" /> Active
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-blue-400 font-medium flex items-center gap-1">
               <Target className="w-3 h-3" /> {prefs.strategy}
            </span>
            <span className="text-gray-600">|</span> 
            <span className="text-gray-400">{prefs.horizon}</span>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </header>

      {/* Market Sentiment Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-10 flex items-start gap-4 shadow-lg">
        <div className="p-3 bg-blue-500/10 rounded-full flex-shrink-0">
            <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white mb-1">Market Context</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{data.marketSentiment}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {data.recommendations.map((stock, idx) => (
          <StockCard key={stock.symbol} stock={stock} delay={idx * 200} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sources Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Intelligence Sources</h3>
          <ul className="space-y-3">
            {data.sources.length > 0 ? (
              data.sources.map((source, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-400 group">
                  <ExternalLink className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-blue-400 transition-colors line-clamp-1"
                  >
                    {source.title}
                  </a>
                </li>
              ))
            ) : (
               <li className="text-gray-500 text-sm">Real-time market data aggregators and financial news feeds.</li>
            )}
          </ul>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Projected Upside Potential</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#9ca3af" width={50} tick={{fill: '#9ca3af'}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                            itemStyle={{ color: '#60a5fa' }}
                            cursor={{ fill: '#374151', opacity: 0.4 }}
                        />
                        <Bar dataKey="potential" name="Upside %" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                           {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.potential > 100 ? '#34d399' : '#60a5fa'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <p className="text-xs text-gray-500 mt-2 text-center">Estimated percentage gain based on intrinsic value gap.</p>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fadeIn {
            animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;