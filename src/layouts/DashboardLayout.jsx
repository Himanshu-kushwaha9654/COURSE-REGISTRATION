import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, LayoutDashboard, Library, BookOpen, Map, Sparkles, Calendar, PieChart, User, Database, Network, Cpu, Activity, Sun, Moon, Bot, Users, Send, LogOut } from 'lucide-react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import { Client } from '@stomp/stompjs';

export default function DashboardLayout({ children }) {
  const userName = localStorage.getItem('userName') || 'Himanshu';
  const userRole = localStorage.getItem('role') || 'STUDENT'; // or 'ADMIN'
  const initial = userName.charAt(0).toUpperCase();
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar') || '');
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Dark/Light Mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (!isDarkMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isDarkMode]);

  // Listen for avatar changes from the Profile page
  useEffect(() => {
    const handleAvatarUpdate = () => {
      setUserAvatar(localStorage.getItem('userAvatar') || '');
    };
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data && Array.isArray(res.data)) {
        const sorted = [...res.data].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });
        setNotifications(sorted);
      }
    } catch (e) {
      console.error("Failed to fetch notifications from server", e);
    }
  };

  useEffect(() => {
    // Initial fetch and poll every 5 seconds (lowered for faster updates)
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    // Connect using native WebSockets (bypassing SockJS to remove the unload violation)
    const stompClient = new Client({
      brokerURL: 'wss://course-registration-production-967c.up.railway.app/ws/websocket',
      debug: function (str) {}, // Keep console clean
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to the global broadcasts topic
        stompClient.subscribe('/topic/broadcasts', (message) => {
          if (userRole !== 'ADMIN') {
            // A new broadcast arrived!
            const payload = JSON.parse(message.body);
            
            // Show the toast popup
            setToast({
              title: payload.title,
              message: payload.message,
              type: payload.priority
            });
            setTimeout(() => setToast(null), 6000);
            
            // Refresh notifications
            fetchNotifications();
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP connection error:', frame.headers['message']);
      }
    });

    stompClient.activate();

    return () => {
      clearInterval(interval);
      stompClient.deactivate();
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post(`/notifications/read-all`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', exact: true },
    { icon: Library, label: 'Course Catalog', path: '/dashboard/catalog' },
    { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
    { icon: Map, label: 'Roadmap', path: '/dashboard/roadmap' },
    { icon: Sparkles, label: 'Recommendations', path: '/dashboard/recommendations' },
    { icon: Calendar, label: 'Semester Planner', path: '/dashboard/planner' },
    { icon: Users, label: 'Study Groups', path: '/dashboard/study-groups' },
    { icon: PieChart, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Bot, label: 'AI Assistant', path: '/dashboard/assistant' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Admin Analytics', path: '/dashboard/admin', exact: true },
    { icon: Database, label: 'Course Manager', path: '/dashboard/admin/courses' },
    { icon: User, label: 'Student Manager', path: '/dashboard/admin/students' },
    { icon: BookOpen, label: 'Enrollments', path: '/dashboard/admin/enrollments' },
    { icon: Network, label: 'Prerequisite Graph', path: '/dashboard/admin/prerequisites' },
    { icon: Map, label: 'Curriculum Builder', path: '/dashboard/admin/curriculum' },
    { icon: Activity, label: 'Dependency Heatmap', path: '/dashboard/admin/heatmap' },
    { icon: Calendar, label: 'Semester Capacity', path: '/dashboard/admin/capacity' },
    { icon: Cpu, label: 'Algorithm Lab', path: '/dashboard/admin/algorithms' },
    { icon: Library, label: 'Reports Center', path: '/dashboard/admin/reports' },
    { icon: Send, label: 'Broadcast Center', path: '/dashboard/admin/broadcast' }
  ];

  const navItems = isAdminRoute ? adminNavItems : studentNavItems;

  return (
    <div className={`flex h-screen overflow-hidden font-sans relative transition-colors duration-500`}>
      
      {/* Sidebar - Floating style */}
      <div className="p-4 pr-0 h-full hidden md:flex flex-col z-20">
        <aside className="w-[260px] h-full glass-panel rounded-3xl flex flex-col relative overflow-hidden">
          {/* Top Brand */}
          <Link to="/" className="h-24 flex items-center px-8 group cursor-pointer active:scale-95 transition-all duration-200 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(45,212,191,0.4)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition-all">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight group-hover:text-teal-400 transition-colors">CourseFlow</span>
          </Link>
          
          <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto z-10">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-95 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/5 text-teal-500 border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.05)] font-bold'
                        : 'text-slate-400 hover:bg-slate-500/10 hover:text-slate-500'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-teal-500' : 'text-slate-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-[15px] ${isActive ? 'text-[var(--text-color)]' : ''}`}>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
          </nav>

          {/* Upgrade Card / Call to action */}
          <div className="p-4 z-10 flex flex-col gap-3">
             <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-500/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h4 className="font-bold mb-1">Pro Features</h4>
                <p className="text-xs opacity-70 mb-3 leading-relaxed">Unlock advanced algorithm labs and precise planning.</p>
                <button className="w-full py-2 bg-[var(--glass-border)] hover:bg-teal-500/20 text-sm font-bold rounded-xl transition-colors backdrop-blur-md">
                  Upgrade Now
                </button>
             </div>
             
             <button 
               onClick={handleSignOut}
               className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm"
             >
               <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </aside>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-[var(--bg-color)] border-r border-[var(--glass-border)] z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-[var(--glass-border)] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.4)]">
                    <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg font-black tracking-tight text-teal-400">CourseFlow</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 opacity-50 hover:opacity-100 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={index}
                      to={item.path}
                      end={item.exact}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-95 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/5 text-teal-500 border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.05)] font-bold'
                          : 'text-slate-400 hover:bg-slate-500/10 hover:text-slate-500'
                      }`}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-teal-500' : 'text-slate-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                          <span className={`text-[15px] ${isActive ? 'text-[var(--text-color)]' : ''}`}>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
              
              <div className="p-6 border-t border-[var(--glass-border)] shrink-0">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden pt-4 pr-4 pb-4 pl-4 md:pl-6">
        
        {/* Floating Top Navbar */}
        <header className="h-20 glass-panel rounded-3xl flex items-center justify-between px-6 z-10 mb-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden opacity-50 hover:opacity-100 p-2 -ml-2 rounded-full hover:bg-[var(--glass-border)] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-lg hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Search courses, skills, or professors..."
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full py-3 pl-12 pr-4 text-[15px] font-medium placeholder-slate-500 focus:outline-none focus:border-teal-500/30 focus:shadow-[0_0_15px_rgba(45,212,191,0.1)] transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Dark/Light Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative p-2.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-all"
              >
                <Bell className="w-5 h-5 opacity-70" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] border-2 border-[var(--bg-color)]"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto glass-panel rounded-2xl shadow-2xl border border-[var(--glass-border)] z-50 flex flex-col p-2">
                  <div className="flex justify-between items-center p-3 border-b border-[var(--glass-border)] mb-2">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {notifications.some(n => !n.read) && (
                      <button onClick={markAllAsRead} className="text-xs text-teal-500 hover:underline font-medium">Mark all as read</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => !n.read && markAsRead(n.id)}
                        className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors ${n.read ? 'opacity-60 hover:bg-white/5' : 'bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20'}`}
                      >
                        <h4 className={`text-sm ${n.read ? 'font-medium' : 'font-bold text-teal-400'}`}>{n.title}</h4>
                        <p className="text-xs mt-1 text-slate-400 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] mt-2 opacity-50">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="relative">
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 pl-4 border-l border-[var(--glass-border)] cursor-pointer group active:scale-95 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold group-hover:text-teal-500 transition-colors">{userName}</p>
                  <p className="text-xs font-medium opacity-50">
                    {userRole === 'ADMIN' ? 'Administrator' : (localStorage.getItem('department') || 'Computer Science')}
                  </p>
                </div>
                {userAvatar ? (
                  <img src={userAvatar} alt="Avatar" className="w-11 h-11 rounded-full bg-[var(--glass-bg)] object-cover shadow-[0_0_15px_rgba(45,212,191,0.3)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-all ring-2 ring-[var(--glass-border)] group-hover:ring-teal-500 ring-offset-2 ring-offset-[var(--bg-color)]" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(45,212,191,0.3)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-all ring-2 ring-[var(--glass-border)] group-hover:ring-teal-500 ring-offset-2 ring-offset-[var(--bg-color)]">
                    {initial}
                  </div>
                )}
              </div>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl border border-[var(--glass-border)] z-50 flex flex-col p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-[var(--glass-border)] mb-1">
                    <p className="font-bold text-sm truncate">{userName}</p>
                    <p className="text-xs opacity-50 truncate capitalize">{userRole.toLowerCase()}</p>
                  </div>
                  
                  <Link 
                    to="/dashboard/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 transition-colors cursor-pointer text-sm font-medium"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer text-sm font-medium mt-1 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto relative z-0 glass-panel rounded-3xl p-4 sm:p-8 custom-scrollbar">
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Live Broadcast Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-[100] glass-panel bg-[var(--bg-color)] rounded-2xl p-4 shadow-2xl border border-teal-500/30 flex items-start gap-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                <h4 className="font-bold text-teal-400 text-sm">Live Broadcast</h4>
              </div>
              <h5 className="font-semibold text-sm mb-1">{toast.title}</h5>
              <p className="text-xs opacity-70 line-clamp-2">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity ml-1 p-1">
              <span className="text-xl leading-none">&times;</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
