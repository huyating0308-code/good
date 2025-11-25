import React, { useEffect, useState } from 'react';
import { MOCK_AGENT_LOGS } from '../constants';
import { Loader2, Terminal, CheckCircle2 } from 'lucide-react';

interface AgentStatusProps {
  onComplete: () => void; // Called when mock animation finishes, though real data might take longer
}

const AgentStatus: React.FC<AgentStatusProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  useEffect(() => {
    if (currentLogIndex < MOCK_AGENT_LOGS.length) {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, MOCK_AGENT_LOGS[currentLogIndex]]);
        setCurrentLogIndex(prev => prev + 1);
      }, Math.random() * 800 + 400); // Random delay between 400ms and 1200ms
      return () => clearTimeout(timeout);
    } else {
      // Keep showing logs for a moment before potentially finishing
      // The parent controls when this unmounts based on actual API return
    }
  }, [currentLogIndex]);

  return (
    <div className="max-w-xl mx-auto w-full p-8">
      <div className="bg-black/80 rounded-xl border border-gray-800 p-6 shadow-2xl font-mono text-sm relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-30 animate-scan" />
        
        <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-auto text-xs text-gray-500">AGENT_v2.5.0</span>
        </div>

        <div className="space-y-3 min-h-[300px]">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-3 animate-slideIn">
              <span className="text-blue-500 mt-0.5">➜</span>
              <span className="text-green-400">{log}</span>
            </div>
          ))}
          {currentLogIndex < MOCK_AGENT_LOGS.length && (
             <div className="flex items-center space-x-2 text-blue-400 animate-pulse">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span>Processing...</span>
             </div>
          )}
           {currentLogIndex >= MOCK_AGENT_LOGS.length && (
             <div className="flex items-center space-x-2 text-emerald-400 font-bold border-t border-gray-800 pt-4 mt-4">
               <CheckCircle2 className="w-5 h-5" />
               <span>ANALYSIS COMPLETE. RENDERING REPORT.</span>
             </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AgentStatus;