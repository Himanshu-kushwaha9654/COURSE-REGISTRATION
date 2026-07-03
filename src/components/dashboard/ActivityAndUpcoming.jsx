import React, { useState, useEffect } from 'react';
import { Clock, CalendarDays, Bell } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function ActivityAndUpcoming() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.slice(0, 5)); // Show latest 5
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="font-bold flex items-center gap-2 mb-4"><Bell className="w-4 h-4 opacity-50"/> Recent Activity</h3>
        {loading ? (
          <div className="text-sm opacity-50 animate-pulse">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-sm opacity-50">No recent activity yet.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, i) => (
              <div key={notif.id || i} className="flex gap-4 relative">
                {i < notifications.length - 1 && <div className="w-px bg-[var(--glass-border)] absolute left-1.5 top-5 bottom-0"></div>}
                <div className={`w-3 h-3 rounded-full ${notif.read ? 'bg-slate-500/50' : 'bg-indigo-500'} border-2 border-[var(--bg-color)] relative z-10 mt-1 shrink-0`}></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{notif.title}</p>
                  <p className="text-xs opacity-50">{timeAgo(notif.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="glass-panel bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-6">
        <h3 className="font-bold flex items-center gap-2 mb-4"><CalendarDays className="w-4 h-4 text-indigo-500"/> Quick Tip</h3>
        <div className="bg-[var(--glass-bg)] rounded-xl p-4 border border-[var(--glass-border)]">
          <p className="text-sm opacity-70">Head over to the <strong>Course Catalog</strong> to explore and enroll in courses for your current semester!</p>
        </div>
      </div>
    </div>
  );
}