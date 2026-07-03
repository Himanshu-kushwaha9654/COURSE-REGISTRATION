import React, { useState, useEffect } from 'react';
import DependencyGraph from '../../components/dashboard/DependencyGraph';
import RoadmapTimeline from '../../components/dashboard/RoadmapTimeline';
import AlgorithmPlayground from '../../components/dashboard/AlgorithmPlayground';
import api from '../../api/axiosConfig';
import { Map, GraduationCap, Calendar, Settings2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RoadmapView() {
  const [step, setStep] = useState(() => Number(sessionStorage.getItem('roadmap_step')) || 1);
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [semesters, setSemesters] = useState([]);
  
  const [selectedUniversity, setSelectedUniversity] = useState(() => sessionStorage.getItem('roadmap_univ') || '');
  const [selectedProgram, setSelectedProgram] = useState(() => sessionStorage.getItem('roadmap_prog') || '');
  const [selectedSemester, setSelectedSemester] = useState(() => sessionStorage.getItem('roadmap_sem') || 'All');

  useEffect(() => {
    sessionStorage.setItem('roadmap_step', step.toString());
    sessionStorage.setItem('roadmap_univ', selectedUniversity);
    sessionStorage.setItem('roadmap_prog', selectedProgram);
    sessionStorage.setItem('roadmap_sem', selectedSemester);
  }, [step, selectedUniversity, selectedProgram, selectedSemester]);
  
  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const res = await api.get('/courses');
        const univs = new Set();
        const progMap = {};
        const sems = new Set();
        
        res.data.forEach(course => {
          if (course.program?.university?.name) {
            const uName = course.program.university.name;
            univs.add(uName);
            if (!progMap[uName]) progMap[uName] = new Set();
            if (course.program.name) progMap[uName].add(course.program.name);
          }
          if (course.semester) {
            sems.add(course.semester);
          }
        });
        
        const sortedUnivs = Array.from(univs).sort();
        const sortedSems = Array.from(sems).sort((a,b) => Number(a)-Number(b));
        
        // Convert Sets to sorted Arrays
        Object.keys(progMap).forEach(k => {
          progMap[k] = Array.from(progMap[k]).sort();
        });

        setUniversities(sortedUnivs);
        setProgramsMap(progMap);
        setSemesters(sortedSems);

        if (sortedUnivs.length > 0 && !sessionStorage.getItem('roadmap_univ')) {
          setSelectedUniversity(sortedUnivs[0]);
          if (progMap[sortedUnivs[0]]?.length > 0) {
            setSelectedProgram(progMap[sortedUnivs[0]][0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSetupData();
  }, []);

  const handleUniversityChange = (e) => {
    const u = e.target.value;
    setSelectedUniversity(u);
    if (programsMap[u] && programsMap[u].length > 0) {
      setSelectedProgram(programsMap[u][0]);
    } else {
      setSelectedProgram('');
    }
  };

  if (step === 1) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center relative min-h-[calc(100vh-100px)]">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-xl glass-panel rounded-3xl p-10 relative z-10 border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Roadmap Setup</h1>
            <p className="text-slate-400">Configure your parameters to generate a highly personalized curriculum graph.</p>
          </div>

          {loading ? (
            <div className="text-center text-indigo-400 font-medium py-8 animate-pulse">Loading available configurations...</div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-indigo-400" /> Target University
                </label>
                <select
                  value={selectedUniversity}
                  onChange={handleUniversityChange}
                  className="w-full bg-[#0a0f1c] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {universities.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                  <Map className="w-4 h-4 text-pink-400" /> Target Program
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full bg-[#0a0f1c] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all cursor-pointer"
                >
                  {(programsMap[selectedUniversity] || []).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-purple-400" /> Target Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full bg-[#0a0f1c] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="All">All Semesters (Full Curriculum)</option>
                  {semesters.map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedUniversity || !selectedProgram}
                className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                Generate Roadmap <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32 space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-black mb-2">Interactive Roadmap</h1>
          <p className="text-white/50 text-sm">Dynamically generated based on your curriculum.</p>
        </div>
        
        {/* Horizontal Dropdowns for Step 2 */}
        <div className="flex flex-wrap items-center gap-3 bg-[#0f172a] p-3 rounded-2xl border border-slate-700/50 shadow-lg">
          <select
            value={selectedUniversity}
            onChange={handleUniversityChange}
            className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium cursor-pointer max-w-[200px]"
          >
            {universities.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium cursor-pointer max-w-[200px]"
          >
            {(programsMap[selectedUniversity] || []).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium cursor-pointer"
          >
            <option value="All">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </div>
      <AlgorithmPlayground />
      <DependencyGraph selectedUniversity={selectedUniversity} selectedProgram={selectedProgram} selectedSemester={selectedSemester} />
      <RoadmapTimeline selectedUniversity={selectedUniversity} selectedProgram={selectedProgram} selectedSemester={selectedSemester} />
    </div>
  );
}
