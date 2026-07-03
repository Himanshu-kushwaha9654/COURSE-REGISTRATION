import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerAssistant() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('careerAssistantChat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default if parsing fails
      }
    }
    return [
      {
        role: 'model',
        text: "Hello! I am your AI Career and Academic Counselor. How can I help you plan your courses, explore career paths, or achieve your academic goals today?"
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem('careerAssistantChat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (userText) => {
    if (!apiKey) {
      setError("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    setError('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are an expert University Academic and Career Counselor. Your goal is to help computer science students plan their courses, choose specializations, explore career paths, and stay motivated. Keep your responses concise, encouraging, and formatted beautifully with markdown where appropriate."
      });

      // The Gemini API requires the history to start with a 'user' role.
      // We skip the first hardcoded greeting message.
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (err) {
      console.error(err);
      setError("Failed to get a response from the AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setInput('');
    await sendMessageToGemini(userText);
  };

  const handleSuggestionClick = (text) => {
    if (isLoading) return;
    sendMessageToGemini(text);
  };

  // Simple markdown-like parser to make bold text look nice and clickable for quick actions
  const parseMarkdown = (text, isModel) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        if (isModel) {
          return (
            <button 
              key={i}
              onClick={() => handleSuggestionClick(content)}
              disabled={isLoading}
              className="font-bold text-teal-400 hover:text-white hover:bg-teal-500/20 px-2.5 py-1 rounded-lg cursor-pointer transition-all disabled:opacity-50 disabled:cursor-default inline-block my-1 mx-1 border border-teal-500/30 hover:border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.1)] hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] active:scale-95"
              title="Click to ask about this"
            >
              {content}
            </button>
          );
        }
        return <strong key={i} className="font-bold text-teal-400">{content}</strong>;
      }
      // Simple newline to <br> conversion
      return <span key={i}>{part.split('\n').map((line, j) => <React.Fragment key={j}>{line}{j < part.split('\n').length - 1 && <br/>}</React.Fragment>)}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-[calc(100vh-10rem)] flex flex-col relative"
    >
      <div className="mb-6 flex items-center gap-4 shrink-0 px-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-emerald-400 to-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.4)]">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">AI Career Assistant</h1>
          <p className="text-[var(--text-color)] opacity-60 text-sm font-medium tracking-wide mt-1">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl border border-[var(--glass-border)] flex flex-col overflow-hidden relative">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-teal-500/20 text-teal-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-md backdrop-blur-md ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(20,184,166,0.3)]' 
                  : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-tl-sm text-[var(--text-color)]'
              }`}>
                {/* Parse basic markdown formatting */}
                {parseMarkdown(msg.text, msg.role === 'model')}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-4 max-w-[80%]"
            >
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span className="text-slate-400 text-sm">Gemini is thinking...</span>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm w-fit"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-transparent shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-2xl blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about your career, courses, or future..."
              className="w-full relative bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-6 pr-14 text-[15px] focus:outline-none focus:border-teal-500/50 focus:bg-white/5 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-xl"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-[10px] text-[var(--text-color)] opacity-40 font-medium tracking-wide">AI can make mistakes. Verify important academic decisions with your advisor.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
