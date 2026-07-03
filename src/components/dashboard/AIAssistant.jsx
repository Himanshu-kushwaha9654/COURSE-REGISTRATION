import React from 'react';
import { Bot, Send } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-1"><Bot className="w-5 h-5 text-cyan-500"/> Graph-Powered AI Assistant</h3>
      <p className="text-xs opacity-50 font-mono mb-6 border-b border-[var(--glass-border)] pb-4">Answers driven by DFS</p>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <div className="flex justify-end">
          <div className="bg-indigo-500 text-white p-3 rounded-t-xl rounded-bl-xl max-w-[80%] text-sm">
            Can I take Machine Learning next semester?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-[var(--glass-bg)] text-[var(--text-color)] p-3 rounded-t-xl rounded-br-xl max-w-[80%] text-sm border border-[var(--glass-border)]">
            No, you are missing <strong>Artificial Intelligence</strong>. AI requires CS102 and Math101, which you have completed. You should plan AI for next semester!
          </div>
        </div>
      </div>
      
      <div className="relative mt-auto">
        <input type="text" placeholder="Ask about prerequisites..." className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500/50" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors">
          <Send className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
}