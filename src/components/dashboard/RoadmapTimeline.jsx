import React, { useState, useEffect, useMemo } from 'react';
import { Map, ArrowDown, Clock, Filter } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function RoadmapTimeline({ selectedUniversity, selectedProgram, selectedSemester: initialSemester }) {
  const [roadmap, setRoadmap] = useState([]);
  const [courses, setCourses] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(initialSemester || 'All');

  useEffect(() => {
    setSelectedSemester(initialSemester || 'All');
  }, [initialSemester]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
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
      setError("Failed to load roadmap from server.");
    } finally {
      setLoading(false);
    }
  };

  // Group by semester
  const groupedCurriculum = useMemo(() => {
    const groups = {};
    roadmap.forEach(courseId => {
      const course = courses[courseId];
      if (!course) return;
      if (selectedUniversity && course.program?.university?.name !== selectedUniversity) return;
      if (selectedProgram && course.program?.name !== selectedProgram) return;
      
      const sem = course.semester || 0;
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(course);
    });
    return groups;
  }, [roadmap, courses, selectedUniversity, selectedProgram]);

  const allSemesters = Object.keys(groupedCurriculum).sort((a, b) => Number(a) - Number(b));
  const semestersToRender = selectedSemester === 'All' 
    ? allSemesters 
    : allSemesters.filter(sem => sem === selectedSemester);

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><Map className="w-5 h-5 text-emerald-500"/> Roadmap Timeline</h3>
          <p className="text-xs opacity-50 mt-1 font-mono">Generated using Kahn's Algorithm (Topological Sort)</p>
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
          <button onClick={fetchData} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
            Refresh
          </button>
        </div>
      </div>
      
      {loading && <p className="text-slate-400">Loading your roadmap...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && semestersToRender.length === 0 && <p className="text-slate-500 italic">No courses in the roadmap for this selection.</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {semestersToRender.map((sem, idx) => (
            <div key={sem} className="relative">
              <div className="flex items-center gap-4">
                <div className="w-24 text-right">
                  <span className="text-xs font-bold opacity-50 uppercase tracking-widest text-emerald-400">Sem {sem}</span>
                </div>
                <div className="flex gap-3 flex-wrap flex-1">
                  {groupedCurriculum[sem].map((course, cIdx) => (
                    <div key={course.id} className="px-4 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-emerald-500/30 transition-colors shadow-sm group">
                      <div className="text-xs font-black text-emerald-400 mb-1">{course.courseCode}</div>
                      <div className="text-sm font-medium text-slate-200">{course.courseName}</div>
                    </div>
                  ))}
                </div>
              </div>
              {idx < semestersToRender.length - 1 && (
                <div className="pl-[7.5rem] py-3">
                  <ArrowDown className="w-4 h-4 opacity-30 text-emerald-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}