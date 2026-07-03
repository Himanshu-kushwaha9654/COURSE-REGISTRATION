import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, BookOpen, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function HeroProgress() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ completed: 0, creditsEarned: 0, totalCredits: 160 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, enrollRes] = await Promise.all([
          api.get('/user/me'),
          api.get('/enrollments/my')
        ]);
        setUser(userRes.data);

        const completedEnrollments = enrollRes.data.filter(e => e.status === 'COMPLETED' || e.status === 'APPROVED');
        const creditsEarned = completedEnrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0);
        
        setStats({
          completed: completedEnrollments.length,
          creditsEarned: creditsEarned,
          totalCredits: 160 // Default program total
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userName = user?.fullName || localStorage.getItem('userName') || 'Student';
  const programName = user?.program?.name || 'Your Program';
  const universityName = user?.program?.university?.name || '';
  const semester = user?.currentSemester || '—';
  const completionPercent = stats.totalCredits > 0 ? Math.round((stats.creditsEarned / stats.totalCredits) * 100) : 0;
  const dashOffset = 251.2 * (1 - completionPercent / 100);

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Welcome back, {userName} 👋</h2>
          <p className="opacity-60 mb-6 font-medium">Semester {semester} • {programName}{universityName ? ` • ${universityName}` : ''}</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5"/></div>
              <div><p className="text-2xl font-bold leading-none">{loading ? '...' : stats.completed}</p><p className="text-xs font-medium opacity-60">Enrolled</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0"><Award className="w-5 h-5"/></div>
              <div><p className="text-2xl font-bold leading-none">{loading ? '...' : stats.creditsEarned}</p><p className="text-xs font-medium opacity-60">Credits Earned</p></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--glass-border)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#22d3ee"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black">{loading ? '...' : `${completionPercent}%`}</span>
            </div>
          </div>
          <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase mt-4">Degree Completion</span>
        </div>
      </div>
    </div>
  );
}