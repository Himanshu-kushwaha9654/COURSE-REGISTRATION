import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle2, Info, Megaphone, Trash2, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../api/axiosConfig';

export default function BroadcastCenter() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('info'); // info, success, warning, critical
  const [broadcasts, setBroadcasts] = useState([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // We fetch global broadcasts from standard notifications now,
    // so Broadcast Center will just display what's returned by the backend.
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/notifications');
      // For Admin, we can filter to show only broadcasts they sent, 
      // or just show recent broadcasts. Since our backend saves it to students, 
      // the admin's own fetch won't show it unless we added a sender record.
      // For now, we will keep a local history just for the Admin's view in this tab,
      // or we can just fetch. Since backend doesn't save to ADMIN, we'll keep 
      // Admin's sent history in local state.
      const stored = localStorage.getItem('admin_sent_history');
      if (stored) {
        setBroadcasts(JSON.parse(stored));
      }
    } catch(e) {}
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    setSuccess(false);

    try {
      const payload = { title, message, priority };
      await api.post('/notifications/broadcast', payload);

      const newHistory = {
        id: Date.now().toString(),
        title,
        message,
        type: priority,
        createdAt: new Date().toISOString(),
        sender: 'Admin'
      };

      const updatedHistory = [newHistory, ...broadcasts];
      localStorage.setItem('admin_sent_history', JSON.stringify(updatedHistory));
      setBroadcasts(updatedHistory);
      
      setSuccess(true);
      setTitle('');
      setMessage('');
      setPriority('info');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to broadcast", err);
    } finally {
      setSending(false);
    }
  };

  const deleteBroadcast = (id) => {
    const updated = broadcasts.filter(b => b.id !== id);
    setBroadcasts(updated);
    localStorage.setItem('admin_sent_history', JSON.stringify(updated));
  };

  const priorityConfig = {
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    critical: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-indigo-500" />
          Broadcast Center
        </h1>
        <p className="opacity-50 text-[var(--text-color)]">Push real-time alerts and announcements to all active students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Composer */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-3xl p-6 h-fit"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-400" /> Compose Message
          </h2>
          
          <form onSubmit={handleBroadcast} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Priority Level</label>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(priorityConfig).map((p) => {
                  const Icon = priorityConfig[p].icon;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        priority === p 
                          ? `${priorityConfig[p].bg} ${priorityConfig[p].border} ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--bg-color)]`
                          : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[var(--glass-border)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${priorityConfig[p].color}`} />
                      <span className="text-[10px] font-bold capitalize">{p}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Broadcast Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Campus Closed Tomorrow"
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Message Body</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement here..."
                rows={5}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending || !title.trim() || !message.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <> <CheckCircle2 className="w-5 h-5" /> Broadcast Sent Successfully! </>
              ) : (
                <> <Send className="w-5 h-5" /> Transmit Broadcast </>
              )}
            </button>
          </form>
        </motion.div>

        {/* History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-3xl p-6 flex flex-col h-[600px]"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Transmission History
            </h2>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              {broadcasts.length} Sent
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {broadcasts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Megaphone className="w-12 h-12 mb-4 opacity-50" />
                <p>No broadcasts transmitted yet.</p>
                <p className="text-sm">Use the composer to send your first alert.</p>
              </div>
            ) : (
              broadcasts.map((b) => {
                const config = priorityConfig[b.type] || priorityConfig.info;
                const Icon = config.icon;
                return (
                  <div key={b.id} className={`p-4 rounded-2xl border ${config.bg} ${config.border} relative group`}>
                    <button 
                      onClick={() => deleteBroadcast(b.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-1 pr-6">{b.title}</h4>
                        <p className="text-sm opacity-80 mb-3">{b.message}</p>
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold opacity-50">
                          <span>{new Date(b.createdAt).toLocaleString()}</span>
                          <span>{b.sender}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
