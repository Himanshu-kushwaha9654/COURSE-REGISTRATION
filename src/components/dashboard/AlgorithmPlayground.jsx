import React, { useState } from 'react';
import { Terminal, Play } from 'lucide-react';

export default function AlgorithmPlayground() {
  const [step, setStep] = useState(0);
  
  const steps = [
    { q: '[Math101]', log: 'Queue initialized with 0-indegree nodes.' },
    { q: '[]', log: 'Processing Math101... Removed.' },
    { q: '[CS101]', log: 'In-degree of CS101 becomes 0. Added to Queue.' },
    { q: '[]', log: 'Processing CS101... Removed.' },
    { q: '[CS102]', log: 'In-degree of CS102 becomes 0. Added to Queue.' },
    { q: '[]', log: 'Processing CS102... Roadmap updated.' }
  ];

  return (
    <div className="glass-panel bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[50px] rounded-full"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2"><Terminal className="w-6 h-6 text-indigo-500"/> Algorithm Playground</h3>
          <p className="text-xs opacity-50 mt-1 font-mono">Live Topological Sort (Kahn's) - O(V+E)</p>
        </div>
        <button 
          onClick={() => setStep(s => (s + 1) % steps.length)}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <Play className="w-4 h-4 fill-current"/> Step Forward
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-4 font-mono text-sm shadow-inner">
          <div className="opacity-50 mb-2 font-semibold">Queue State</div>
          <div className="text-indigo-500 text-xl tracking-widest font-bold">{steps[step].q}</div>
        </div>
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-4 font-mono text-sm shadow-inner">
          <div className="opacity-50 mb-2 font-semibold">Algorithm Log</div>
          <div className="text-emerald-500 font-bold">{steps[step].log}</div>
        </div>
      </div>
    </div>
  );
}