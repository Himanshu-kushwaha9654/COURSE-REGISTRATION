import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Filter, GraduationCap, Map } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function SemesterPlanner() {
  const [credits, setCredits] = useState(18);
  const [targetSemester, setTargetSemester] = useState(1);
  const [capacities, setCapacities] = useState([]);
  
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);

  // New states for filtering
  const [universities, setUniversities] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollRes, graphRes, capRes] = await Promise.all([
          api.get('/courses'),
          api.get('/enrollments/my'),
          api.get('/graph/data'),
          api.get('/capacities')
        ]);
        setCourses(coursesRes.data);
        setEnrollments(enrollRes.data);
        setPrerequisites(graphRes.data.edges || []);
        setCapacities(capRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Process unique universities and programs when courses change
  useEffect(() => {
    if (!courses.length) return;
    const univs = new Set();
    const progMap = {};
    
    courses.forEach(course => {
      if (course.program?.university?.name) {
        const uName = course.program.university.name;
        univs.add(uName);
        if (!progMap[uName]) progMap[uName] = new Set();
        if (course.program.name) progMap[uName].add(course.program.name);
      }
    });
    
    const sortedUnivs = Array.from(univs).sort();
    Object.keys(progMap).forEach(k => {
      progMap[k] = Array.from(progMap[k]).sort();
    });

    setUniversities(sortedUnivs);
    setProgramsMap(progMap);

    if (sortedUnivs.length > 0 && !selectedUniversity) {
      setSelectedUniversity(sortedUnivs[0]);
      if (progMap[sortedUnivs[0]]?.length > 0) {
        setSelectedProgram(progMap[sortedUnivs[0]][0]);
      }
    }
  }, [courses, selectedUniversity]);

  const handleUniversityChange = (e) => {
    const u = e.target.value;
    setSelectedUniversity(u);
    if (programsMap[u] && programsMap[u].length > 0) {
      setSelectedProgram(programsMap[u][0]);
    } else {
      setSelectedProgram('');
    }
  };

  // Calculate max credits for the selected semester
  const maxCreditsForSemester = useMemo(() => {
    const cap = capacities.find(c => c.semester === targetSemester);
    return cap ? cap.maxCapacity : 24; // Default to 24 if admin hasn't configured it
  }, [capacities, targetSemester]);

  // Clamp current credits slider if the new max is lower
  useEffect(() => {
    if (credits > maxCreditsForSemester) {
      setCredits(maxCreditsForSemester);
    }
  }, [maxCreditsForSemester, credits]);

  const { planned, totalCredits } = useMemo(() => {
    // Build set of completed/approved course IDs
    const completedIds = new Set(
      enrollments
        .filter(e => ['APPROVED', 'COMPLETED', 'PENDING'].includes(e.status))
        .map(e => e.course?.id?.toString())
    );

    // Build prerequisite map: courseId -> [required course IDs]
    const prereqMap = {};
    prerequisites.forEach(edge => {
      if (!prereqMap[edge.target]) prereqMap[edge.target] = [];
      prereqMap[edge.target].push(edge.source);
    });

    let plannedList = [];
    let currentTotalCredits = 0;
    let currentCompleted = new Set(completedIds);
    let addedSomething = true;

    // Iterative Greedy Algorithm: Allows co-requisites in the same semester to be planned together
    while (addedSomething && plannedList.length < 10) {
      addedSomething = false;

      // Find all courses eligible in this iteration
      const eligibleNow = courses.filter(c => {
        if (c.semester !== targetSemester) return false;
        if (c.program?.university?.name !== selectedUniversity) return false;
        if (c.program?.name !== selectedProgram) return false;
        
        const cId = c.id?.toString();
        if (currentCompleted.has(cId)) return false; // Already completed or planned
        
        const reqs = prereqMap[cId] || [];
        // Eligible if ALL prerequisites are either completed or already planned in this session
        return reqs.every(reqId => currentCompleted.has(reqId));
      });

      // Sort by credits descending
      eligibleNow.sort((a, b) => (b.credits || 0) - (a.credits || 0));

      // Try to add the highest credit course that fits
      for (const course of eligibleNow) {
        const courseCredits = course.credits || 0;
        if (currentTotalCredits + courseCredits <= credits) {
          plannedList.push(course);
          currentTotalCredits += courseCredits;
          currentCompleted.add(course.id?.toString());
          addedSomething = true;
          break; // Break and re-evaluate eligibility for remaining courses (e.g., unlocking labs)
        }
      }
    }

    return { planned: plannedList, totalCredits: currentTotalCredits };
  }, [courses, enrollments, prerequisites, credits, targetSemester, selectedUniversity, selectedProgram]);

  // Extract unique semesters from available courses
  const availableSemesters = useMemo(() => {
    const sems = new Set(courses.map(c => c.semester).filter(s => s != null));
    return Array.from(sems).sort((a, b) => a - b);
  }, [courses]);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-500"/> Semester Planner</h3>
          <p className="text-xs opacity-50 font-mono mt-1">Greedy Algorithm Optimization</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-[#0f172a]/50 p-3 rounded-xl border border-slate-700/30">
          <div className="relative flex-1 min-w-[140px]">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
            <select
              value={selectedUniversity}
              onChange={handleUniversityChange}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer hover:bg-[#27354f] transition-colors"
            >
              {universities.map(u => <option key={u} value={u}>{u}</option>)}
              {universities.length === 0 && <option value="">Select University</option>}
            </select>
          </div>
          
          <div className="relative flex-1 min-w-[140px]">
            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400 pointer-events-none" />
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none cursor-pointer hover:bg-[#27354f] transition-colors"
            >
              {(programsMap[selectedUniversity] || []).map(p => <option key={p} value={p}>{p}</option>)}
              {(!programsMap[selectedUniversity] || programsMap[selectedUniversity].length === 0) && <option value="">Select Program</option>}
            </select>
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
            <select
              value={targetSemester}
              onChange={(e) => setTargetSemester(parseInt(e.target.value))}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer hover:bg-[#27354f] transition-colors"
            >
              {availableSemesters.map(sem => (
                <option key={sem} value={sem}>Sem {sem}</option>
              ))}
              {availableSemesters.length === 0 && <option value={1}>Sem 1</option>}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm opacity-70 whitespace-nowrap">Target Credits:</label>
        <input 
          type="range" min="3" max={maxCreditsForSemester} step="1" 
          value={credits} onChange={e => setCredits(parseInt(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <div className="flex flex-col items-end shrink-0 w-16">
          <span className="font-mono bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3 py-1 rounded text-sm w-full text-center">{credits}</span>
          <span className="text-[10px] opacity-40 mt-1">Max: {maxCreditsForSemester}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        </div>
      ) : planned.length === 0 ? (
        <div className="text-sm opacity-50 py-4 text-center border border-dashed border-slate-700 rounded-xl">
          No eligible courses for Semester {targetSemester} within this credit limit.
        </div>
      ) : (
        <div className="space-y-3">
          {planned.map(c => (
            <div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div>
                <span className="text-sm font-medium">{c.courseName}</span>
                <span className="text-xs opacity-50 ml-2">{c.courseCode}</span>
              </div>
              <span className="text-xs opacity-70 bg-[var(--glass-border)] px-2 py-1 rounded font-medium">{c.credits} cr</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-between items-center text-sm font-bold">
        <span>Total Planned:</span>
        <span className="text-indigo-500">{totalCredits} Credits</span>
      </div>
    </div>
  );
}