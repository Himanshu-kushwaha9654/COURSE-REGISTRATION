import React, { useState, useEffect, useMemo } from 'react';
import { Map, Zap, CheckCircle, Clock, BookOpen, Layers, Filter } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function CurriculumBuilder() {
  const [roadmap, setRoadmap] = useState([]);
  const [courses, setCourses] = useState({});
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [roadmapRes, coursesRes] = await Promise.all([
        api.get('/graph/roadmap'),
        api.get('/courses')
      ]);
      
      const courseMap = {};
      coursesRes.data.forEach(c => {
        courseMap[c.id] = c;
      });
      
      setCourses(courseMap);
      setRoadmap(roadmapRes.data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data || "Failed to load roadmap. Check for cycles.");
    }
  };

  // Group the topologically sorted roadmap by semester
  const groupedCurriculum = useMemo(() => {
    const groups = {};
    roadmap.forEach(courseId => {
      const course = courses[courseId];
      if (!course) return;
      
      const sem = course.semester || 0;
      if (!groups[sem]) {
        groups[sem] = [];
      }
      groups[sem].push(course);
    });
    return groups;
  }, [roadmap, courses]);

  const allSemesters = Object.keys(groupedCurriculum).sort((a, b) => Number(a) - Number(b));
  
  const semestersToRender = selectedSemester === 'All' 
    ? allSemesters 
    : allSemesters.filter(sem => sem === selectedSemester);

  return (
    <div className="pb-24 flex flex-col relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Map className="text-emerald-400 w-6 h-6" />
            </div>
            Curriculum Builder
          </h1>
          <p className="text-slate-400">Auto-generated optimal course sequence using Topological Sort (Kahn's Algorithm).</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-[#0f172a] border border-emerald-500/30 rounded-xl py-2 pl-10 pr-8 text-sm text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer hover:bg-[#1e293b] transition-colors"
            >
              <option value="All">All Semesters (Full Curriculum)</option>
              {allSemesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 max-w-5xl flex-1">
        {error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 mb-8 flex items-start gap-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Topological Sort Failed</h3>
              <p className="text-red-400/80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-12 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center gap-4 relative z-10 mb-4 md:mb-0">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <CheckCircle className="text-emerald-400 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-100">Kahn's Algorithm Validated</h3>
                <p className="text-sm text-emerald-400/80 mt-1">A valid, cycle-free prerequisite sequence was successfully generated.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">{allSemesters.length}</div>
                <div className="text-xs uppercase tracking-wider text-emerald-400/60 font-bold">Semesters</div>
              </div>
              <div className="w-px h-10 bg-emerald-500/20"></div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">{roadmap.length}</div>
                <div className="text-xs uppercase tracking-wider text-emerald-400/60 font-bold">Total Courses</div>
              </div>
            </div>
          </div>
        )}

        {!error && (
          <div className="space-y-12">
            {semestersToRender.map(sem => (
              <div key={sem} className="relative">
                {/* Semester Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span className="text-xl font-black text-emerald-400">{sem}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-100 tracking-tight">Semester {sem}</h2>
                    <p className="text-sm text-emerald-400/70 font-semibold">{groupedCurriculum[sem].length} courses assigned</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent ml-4"></div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {groupedCurriculum[sem].map((course, index) => (
                    <div key={course.id} className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
                      
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-emerald-400 text-xs font-black tracking-widest uppercase">{course.courseCode}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-[#0f172a] text-emerald-400/80 text-[10px] font-bold tracking-wider border border-emerald-500/20 flex items-center gap-1.5">
                          <Layers className="w-3 h-3" /> Step {index + 1}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-[15px] leading-snug mb-2 text-slate-100 relative z-10">{course.courseName}</h4>
                      
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed relative z-10">
                        {course.description || "No description provided."}
                      </p>
                      
                      <div className="flex items-center gap-2 relative z-10 pt-4 border-t border-slate-800">
                        <span className="px-2 py-1 rounded bg-[#0f172a] border border-slate-800 text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {course.credits} Credits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {semestersToRender.length === 0 && (
              <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                <Layers className="w-12 h-12 mb-4 opacity-20" />
                <p className="italic">No courses available in the curriculum.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
