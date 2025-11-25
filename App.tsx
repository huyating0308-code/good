import React, { useState } from 'react';
import { AppState, UserPreferences, AgentResponse } from './types';
import Onboarding from './components/Onboarding';
import AgentStatus from './components/AgentStatus';
import Dashboard from './components/Dashboard';
import { generateDailyPicks } from './services/geminiService';
import { BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('onboarding');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [agentData, setAgentData] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePreferencesSubmit = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setView('analyzing');
    setError(null);

    try {
      // Trigger the API call in parallel with the UI animation
      // The AgentStatus component has a minimum duration for visual effect
      const data = await generateDailyPicks(prefs);
      setAgentData(data);
      
      // We rely on AgentStatus logic or a simple timeout to transition
      // But here, once data is ready, we wait a bit if it was too fast, or show immediately
      // For UX, let's ensure the "analyzing" view stays for at least 3 seconds
    } catch (err: any) {
      console.error(err);
      setError("Market data streams disrupted. Please try again.");
      setView('onboarding');
    }
  };

  // This function is triggered by the AgentStatus component when its visual sequence finishes
  // OR we can just control it here. 
  // Simplified: We wait for BOTH data to be ready AND a minimum time.
  
  React.useEffect(() => {
     if (view === 'analyzing' && agentData) {
         const timer = setTimeout(() => {
             setView('results');
         }, 4000); // Ensure users see the cool animation for at least 4s total (including API time roughly)
         return () => clearTimeout(timer);
     }
  }, [view, agentData]);


  const handleReset = () => {
    setAgentData(null);
    setPreferences(null);
    setView('onboarding');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500/30">
      <nav className="border-b border-gray-800 bg-gray-900/95 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AlphaAgent</span>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {error && (
            <div className="absolute top-24 mx-auto bg-red-900/50 border border-red-500/50 text-red-200 px-6 py-3 rounded-lg shadow-xl backdrop-blur-sm z-50">
                {error}
            </div>
        )}

        {view === 'onboarding' && (
          <Onboarding onSubmit={handlePreferencesSubmit} />
        )}

        {view === 'analyzing' && (
          <AgentStatus onComplete={() => {}} />
        )}

        {view === 'results' && agentData && preferences && (
          <Dashboard 
            data={agentData} 
            prefs={preferences} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;