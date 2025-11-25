import React, { useState } from 'react';
import { UserPreferences, RiskLevel, InvestmentHorizon, InvestmentStrategy } from '../types';
import { SECTORS } from '../constants';
import { Settings, DollarSign, Target, PieChart, TrendingUp, Search, Shield } from 'lucide-react';

interface OnboardingProps {
  onSubmit: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSubmit }) => {
  const [risk, setRisk] = useState<RiskLevel>(RiskLevel.HIGH); // Default to High for 5x strategy
  const [horizon, setHorizon] = useState<InvestmentHorizon>(InvestmentHorizon.LONG);
  const [strategy, setStrategy] = useState<InvestmentStrategy>(InvestmentStrategy.VALUE); // Default to the 5x strategy
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [capital, setCapital] = useState<number>(10000);

  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      if (selectedSectors.length < 3) {
        setSelectedSectors([...selectedSectors, sector]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      riskLevel: risk,
      horizon: horizon,
      strategy: strategy,
      sectors: selectedSectors.length > 0 ? selectedSectors : ['Technology', 'Consumer Discretionary'], 
      capital: capital
    });
  };

  const getStrategyIcon = (s: InvestmentStrategy) => {
    switch(s) {
      case InvestmentStrategy.GROWTH: return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case InvestmentStrategy.VALUE: return <Search className="w-5 h-5 text-emerald-400" />;
      case InvestmentStrategy.INCOME: return <Shield className="w-5 h-5 text-purple-400" />;
    }
  };

  const getStrategyDesc = (s: InvestmentStrategy) => {
    switch(s) {
      case InvestmentStrategy.GROWTH: return "Chasing high-flying stocks with strong current momentum.";
      case InvestmentStrategy.VALUE: return "Find undervalued companies with 5x+ potential, declined charts, but strong fundamentals.";
      case InvestmentStrategy.INCOME: return "Stable companies with consistent dividends and lower volatility.";
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-3">
          Configure Your Agent
        </h1>
        <p className="text-gray-400 text-lg">
          Define your criteria. Our AI scans the market for opportunities matching your strategy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-2xl">
        
        {/* Strategy Selection */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Investment Strategy</span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {Object.values(InvestmentStrategy).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStrategy(s)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start space-x-4 ${
                  strategy === s
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10' 
                    : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <div className={`mt-1 p-2 rounded-lg ${strategy === s ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                  {getStrategyIcon(s)}
                </div>
                <div>
                  <div className={`font-bold text-lg mb-1 ${strategy === s ? 'text-white' : 'text-gray-300'}`}>{s}</div>
                  <div className="text-sm text-gray-400">{getStrategyDesc(s)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Risk Level */}
          <div>
            <label className="flex items-center space-x-2 text-md font-semibold text-white mb-3">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Risk Tolerance</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(RiskLevel).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRisk(level)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                    risk === level 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon */}
          <div>
            <label className="flex items-center space-x-2 text-md font-semibold text-white mb-3">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>Investment Horizon</span>
            </label>
            <select 
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as InvestmentHorizon)}
              className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.values(InvestmentHorizon).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sectors */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Focus Sectors (Optional)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SECTORS.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => toggleSector(sector)}
                disabled={!selectedSectors.includes(sector) && selectedSectors.length >= 3}
                className={`p-2 text-xs rounded-md border transition-all ${
                  selectedSectors.includes(sector)
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                } ${(!selectedSectors.includes(sector) && selectedSectors.length >= 3) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* Capital */}
        <div>
          <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <span>Investment Capital</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-400">$</span>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full pl-8 p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10000"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] text-lg"
        >
          Activate AlphaAgent
        </button>
      </form>
    </div>
  );
};

export default Onboarding;