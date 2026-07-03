import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Shield, LogOut, Save, Loader2, GraduationCap, Calendar, Hash, Image as ImageIcon, Briefcase, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fullName, setFullName] = useState('');
  
  // Avatar state
  const [currentAvatar, setCurrentAvatar] = useState(localStorage.getItem('userAvatar') || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Enrollment Number
  const [enrollmentNumber, setEnrollmentNumber] = useState(localStorage.getItem('enrollmentNumber') || 'ENR-PENDING');
  
  const userRole = localStorage.getItem('role') || 'STUDENT';
  
  const navigate = useNavigate();

  const availableAvatars = [
    { id: '1', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
    { id: '2', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasmine' },
    { id: '3', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver' },
    { id: '4', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia' },
    { id: '5', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zoey' },
    { id: '6', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Max' },
    { id: '7', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Kitty' },
    { id: '8', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Panda' },
    { id: '9', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/me');
        setUser(res.data);
        setFullName(res.data.fullName || '');
        
        // Ensure enrollment number is set even if they bypassed login (e.g. dev mode)
        let enr = localStorage.getItem('enrollmentNumber');
        if (!enr && res.data.email) {
           enr = localStorage.getItem(`enrollment_${res.data.email}`);
           if (!enr) {
             enr = 'ENR' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
             localStorage.setItem(`enrollment_${res.data.email}`, enr);
           }
           localStorage.setItem('enrollmentNumber', enr);
           setEnrollmentNumber(enr);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      await api.put('/user/me', { fullName });
      localStorage.setItem('userName', fullName);
      localStorage.setItem('userAvatar', currentAvatar);
      
      // Dispatch a custom event to tell the layout header to re-render the avatar
      window.dispatchEvent(new Event('avatarUpdated'));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    // Keeping userAvatar and enrollmentNumber so it persists if they log back in
    navigate('/login');
  };

  const selectAvatar = (url) => {
    setCurrentAvatar(url);
    // Auto-save avatar selection
    localStorage.setItem('userAvatar', url);
    window.dispatchEvent(new Event('avatarUpdated'));
    setShowAvatarPicker(false);
  };

  const initial = (user?.fullName || 'U').charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black mb-2">Your Profile</h1>
          <p className="opacity-50 text-[var(--text-color)]">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center relative">
            
            <div className="relative group cursor-pointer mb-4" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="w-24 h-24 rounded-full bg-indigo-950/30 shadow-[0_0_30px_rgba(99,102,241,0.4)] object-cover ring-4 ring-[var(--glass-border)] group-hover:ring-indigo-500 transition-all" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] ring-4 ring-[var(--glass-border)] group-hover:ring-indigo-500 transition-all">
                  {initial}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold">{user?.fullName || 'Student'}</h2>
            <p className="opacity-50 text-sm mb-2">{user?.program?.name || 'No program set'}</p>
            <p className="opacity-40 text-xs mb-6">{user?.program?.university?.name || ''}</p>
            
            <div className="w-full space-y-3">
              {userRole === 'ADMIN' ? (
                <>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm">
                    <span className="opacity-60 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Position</span>
                    <span className="font-bold text-[var(--text-color)]">Senior Administrator</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm">
                    <span className="opacity-60 flex items-center gap-2"><Building2 className="w-4 h-4" /> Department</span>
                    <span className="font-bold text-[var(--text-color)]">Computer Science</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm">
                    <span className="opacity-60 flex items-center gap-2"><Calendar className="w-4 h-4" /> Semester</span>
                    <span className="font-bold text-[var(--text-color)]">{user?.currentSemester || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm">
                    <span className="opacity-60 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> CGPA</span>
                    <span className="font-bold text-[var(--text-color)]">{user?.cgpa?.toFixed(2) || '0.00'}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm">
                <span className="opacity-60 flex items-center gap-2"><Shield className="w-4 h-4" /> Role</span>
                <span className="font-bold capitalize text-[var(--text-color)]">{user?.role?.toLowerCase() || '—'}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-semibold flex items-center justify-center gap-2 mt-4"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {showAvatarPicker && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel rounded-3xl overflow-hidden border border-[var(--glass-border)]"
              >
                <div className="p-6">
                  <h3 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Choose your Avatar
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
                    {availableAvatars.map((av) => (
                      <button 
                        key={av.id}
                        onClick={() => selectAvatar(av.url)}
                        className={`aspect-square rounded-full bg-[var(--glass-bg)] p-1 hover:scale-110 transition-transform ${currentAvatar === av.url ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--bg-color)] shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border border-[var(--glass-border)]'}`}
                      >
                        <img src={av.url} alt="avatar option" className="w-full h-full rounded-full" />
                      </button>
                    ))}
                    <button 
                      onClick={() => selectAvatar('')}
                      className={`aspect-square rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 flex items-center justify-center font-bold text-white hover:scale-110 transition-transform ${currentAvatar === '' ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--bg-color)] shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border border-[var(--glass-border)]'}`}
                    >
                      {initial}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><UserIcon className="w-5 h-5 text-indigo-500"/> Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-50 mb-1.5 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors" 
                  />
                </div>
                {userRole === 'ADMIN' ? (
                  <div>
                    <label className="block text-xs font-medium opacity-50 mb-1.5 uppercase flex items-center gap-1.5">
                      <Hash className="w-3 h-3" /> Teacher / Staff UID
                    </label>
                    <div className="relative">
                      <input type="text" value="TCH-849201" disabled className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] opacity-80 rounded-xl py-2.5 px-4 text-sm font-mono text-indigo-400 font-bold" />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
                         <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">Verified</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium opacity-50 mb-1.5 uppercase flex items-center gap-1.5">
                      <Hash className="w-3 h-3" /> Enrollment Number
                    </label>
                    <div className="relative">
                      <input type="text" value={enrollmentNumber} disabled className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] opacity-80 rounded-xl py-2.5 px-4 text-sm font-mono text-indigo-400 font-bold" />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
                         <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">Permanent</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium opacity-50 mb-1.5 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                  <input type="email" value={user?.email || 'admin@university.edu'} disabled className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2.5 pl-10 pr-4 text-sm opacity-60" />
                </div>
              </div>
              
              {userRole === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-medium opacity-50 mb-1.5 uppercase">University ID</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                    <input type="text" value="UNIV-9988-XYZ" disabled className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono opacity-60" />
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end items-center gap-4">
                {saveSuccess && (
                  <span className="text-emerald-400 text-sm font-medium animate-pulse">✓ Saved successfully!</span>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


