import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Sparkles, Mail, Lock, ArrowRight, Shield, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-1.5-3.8c-.5 0-1.2.3-2.6 1.2a10.6 10.6 0 0 0-5.3 0C6.1 1.7 5.4 1.4 4.9 1.4c-.5 0-1.5 1-1.5 3.8A5.4 5.4 0 0 0 2 9a5.4 5.4 0 0 0-1.5 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationKey, setVerificationKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationKey, setShowVerificationKey] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userName')) {
      const role = localStorage.getItem('role');
      const profileComplete = localStorage.getItem('profileComplete') === 'true';
      if (role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else {
        if (!profileComplete) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (!isLogin) {
        if (!fullName.trim()) return;
        const res = await api.post('/auth/register', {
          fullName,
          email,
          password,
          role: isAdminPortal ? 'ADMIN' : 'STUDENT',
          adminPasskey: isAdminPortal ? verificationKey : null
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.fullName);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('profileComplete', res.data.profileComplete);
        
        // Generate and store permanent enrollment number
        let enr = localStorage.getItem(`enrollment_${email}`);
        if (!enr) {
           enr = 'ENR' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
           localStorage.setItem(`enrollment_${email}`, enr);
        }
        localStorage.setItem('enrollmentNumber', enr);
        
        
        if (res.data.role === 'ADMIN') {
          navigate('/dashboard/admin');
        } else {
          if (!res.data.profileComplete) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        const res = await api.post('/auth/login', {
          email,
          password,
          adminPasskey: isAdminPortal ? verificationKey : null
        });
        
        // Extra role validation on frontend
        if (isAdminPortal && res.data.role !== 'ADMIN') {
          setErrorMsg("Access Denied: You are not an Admin.");
          return;
        }

        if (!isAdminPortal && res.data.role === 'ADMIN') {
           // Admin logging in via Student portal. Redirect to admin anyway.
           console.log("Admin logged in via student portal");
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.fullName);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('profileComplete', res.data.profileComplete);
        
        // Ensure enrollment number exists
        let enr = localStorage.getItem(`enrollment_${email}`);
        if (!enr) {
           enr = 'ENR' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
           localStorage.setItem(`enrollment_${email}`, enr);
        }
        localStorage.setItem('enrollmentNumber', enr);
        
        if (res.data.role === 'ADMIN') {
          navigate('/dashboard/admin');
        } else {
          if (!res.data.profileComplete) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (err) {
      console.error("Auth Error: ", err.response?.data || err.message);
      setErrorMsg(typeof err.response?.data === 'string' ? err.response.data : "Authentication failed! Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      {/* Background Ambient Effects */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/4 left-1/4 w-96 h-96 ${isAdminPortal ? 'bg-rose-500/10' : 'bg-indigo-500/10'} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000`}
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isAdminPortal ? 'bg-orange-500/10' : 'bg-cyan-500/10'} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000`}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 px-6"
      >
        
        {/* Portal Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 relative border border-white/10">
          <motion.div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl ${isAdminPortal ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`}
            initial={false}
            animate={{ x: isAdminPortal ? '100%' : '0%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            type="button"
            onClick={() => setIsAdminPortal(false)}
            className={`w-1/2 py-2 text-sm font-semibold relative z-10 flex items-center justify-center gap-2 ${!isAdminPortal ? 'text-white' : 'text-white/50'}`}
          >
            <UserIcon className="w-4 h-4" /> Student
          </button>
          <button 
            type="button"
            onClick={() => setIsAdminPortal(true)}
            className={`w-1/2 py-2 text-sm font-semibold relative z-10 flex items-center justify-center gap-2 ${isAdminPortal ? 'text-white' : 'text-white/50'}`}
          >
            <Shield className="w-4 h-4" /> Teacher
          </button>
        </div>

        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${isAdminPortal ? 'bg-gradient-to-br from-rose-500 to-orange-600 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-br from-indigo-500 to-cyan-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CourseFlow {isAdminPortal && <span className="text-rose-400">Teacher</span>}</span>
          </Link>
          <h1 className="text-2xl font-semibold mb-2 text-center">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-white/50 text-sm text-center">
            {isLogin 
              ? `Enter your credentials to access the ${isAdminPortal ? 'Teacher' : 'Student'} dashboard` 
              : `Sign up for a ${isAdminPortal ? 'secure teacher' : 'student learning'} experience`}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6 text-center shadow-lg"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glassmorphic Card */}
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Card subtle top glow */}
          <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-${isAdminPortal ? 'rose-500/50' : 'indigo-500/50'} to-transparent transition-colors duration-500`}></div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-sm focus:outline-none transition-all placeholder:text-white/20 ${isAdminPortal ? 'focus:border-rose-500 focus:bg-rose-900/10' : 'focus:border-indigo-500 focus:bg-white/10'}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors ${isAdminPortal ? 'group-focus-within:text-rose-400' : 'group-focus-within:text-indigo-400'}`} />
                <input 
                  type="email" 
                  placeholder={isAdminPortal ? "admin@university.edu" : "name@university.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none transition-all placeholder:text-white/20 ${isAdminPortal ? 'focus:border-rose-500 focus:bg-rose-900/10' : 'focus:border-indigo-500 focus:bg-white/10'}`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className={`text-xs hover:text-white transition-colors ${isAdminPortal ? 'text-rose-400' : 'text-indigo-400'}`}>Forgot password?</a>}
              </div>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors ${isAdminPortal ? 'group-focus-within:text-rose-400' : 'group-focus-within:text-indigo-400'}`} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none transition-all placeholder:text-white/20 ${isAdminPortal ? 'focus:border-rose-500 focus:bg-rose-900/10' : 'focus:border-indigo-500 focus:bg-white/10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isAdminPortal && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-medium text-rose-400 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Verification Key
                  </label>
                  <div className="relative">
                    <input 
                      type={showVerificationKey ? "text" : "password"}
                      placeholder="Enter Verification Key"
                      value={verificationKey}
                      onChange={(e) => setVerificationKey(e.target.value)}
                      className="w-full bg-rose-500/5 border border-rose-500/20 rounded-xl py-3 pl-4 pr-11 text-sm focus:outline-none focus:border-rose-500 focus:bg-rose-500/10 transition-all placeholder:text-white/20 text-rose-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowVerificationKey(!showVerificationKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400/50 hover:text-rose-400 transition-colors focus:outline-none"
                    >
                      {showVerificationKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 mt-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all group ${isAdminPortal ? 'bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}
            >
              {isLogin ? (isAdminPortal ? "Teacher Login" : "Sign In") : "Create Account"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#05050A] px-2 text-white/40 uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => navigate(isAdminPortal ? '/dashboard/admin' : '/dashboard')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
              <GithubIcon className="w-4 h-4" /> GitHub
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => navigate(isAdminPortal ? '/dashboard/admin' : '/dashboard')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
              <GoogleIcon className="w-4 h-4" /> Google
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Toggle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-sm text-white/50"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className={`font-semibold transition-colors ${isAdminPortal ? 'text-rose-400 hover:text-rose-300' : 'text-indigo-400 hover:text-indigo-300'}`}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </motion.p>

      </motion.div>
    </div>
  );
}
