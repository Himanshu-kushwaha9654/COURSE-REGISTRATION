import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';

export default function Onboarding() {
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [currentSemester, setCurrentSemester] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      fetchPrograms(selectedUniversity);
      setSelectedProgram('');
    } else {
      setPrograms([]);
    }
  }, [selectedUniversity]);

  const fetchUniversities = async () => {
    try {
      const res = await api.get('/public/universities');
      setUniversities(res.data);
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to load universities");
    }
  };

  const fetchPrograms = async (uniId) => {
    try {
      const res = await api.get(`/public/programs?universityId=${uniId}`);
      setPrograms(res.data);
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to load programs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !currentSemester) {
      setErrorMsg("Please select all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/user/onboarding', {
        programId: parseInt(selectedProgram),
        currentSemester: parseInt(currentSemester)
      });
      
      // Update local storage so we don't hit onboarding again
      localStorage.setItem('profileComplete', 'true');
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to complete onboarding.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      {/* Background Ambient Effects */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 px-6"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2 text-center tracking-tight">Complete Your Profile</h1>
          <p className="text-white/50 text-sm text-center">Tell us about your academic journey to get a personalized roadmap.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6 text-center shadow-lg">
            {errorMsg}
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* University Selection */}
            <div>
              <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-2">
                 University
              </label>
              <div className="relative">
                <select 
                  value={selectedUniversity} 
                  onChange={e => setSelectedUniversity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">Select your University</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id} className="bg-slate-900">{u.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
              </div>
            </div>

            {/* Program Selection */}
            <motion.div 
              animate={{ opacity: selectedUniversity ? 1 : 0.5 }}
              className="relative"
            >
              <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-3 h-3 text-indigo-400" /> Program
              </label>
              <div className="relative">
                <select 
                  disabled={!selectedUniversity}
                  value={selectedProgram} 
                  onChange={e => setSelectedProgram(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all appearance-none cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">Select your Program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
              </div>
            </motion.div>

            {/* Semester Selection */}
            <motion.div 
              animate={{ opacity: selectedProgram ? 1 : 0.5 }}
              className="relative"
            >
              <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3 text-cyan-400" /> Current Semester
              </label>
              <input 
                type="number" 
                min="1" 
                max="10"
                disabled={!selectedProgram}
                value={currentSemester} 
                onChange={e => setCurrentSemester(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all disabled:cursor-not-allowed"
              />
            </motion.div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              disabled={loading || !selectedProgram || !currentSemester}
              className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving Profile...' : 'Complete Setup'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
