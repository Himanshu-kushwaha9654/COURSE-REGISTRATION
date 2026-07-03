import React, { useState, useEffect, useMemo } from 'react';
import { Search, Check, X, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function EligibilityChecker() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollRes, graphRes] = await Promise.all([
          api.get('/courses'),
          api.get('/enrollments/my'),
          api.get('/graph/data')
        ]);
        setCourses(coursesRes.data);
        setEnrollments(enrollRes.data);
        setGraphEdges(graphRes.data.edges || []);
        if (coursesRes.data.length > 0) {
          setSelected(coursesRes.data[0].id.toString());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const result = useMemo(() => {
    if (!selected) return { eligible: true, missing: [] };

    const completedIds = new Set(
      enrollments
        .filter(e => ['APPROVED', 'COMPLETED'].includes(e.status))
        .map(e => e.course?.id?.toString())
    );

    // Prerequisite map: target -> [source course IDs]
    const prereqMap = {};
    graphEdges.forEach(edge => {
      if (!prereqMap[edge.target]) prereqMap[edge.target] = [];
      prereqMap[edge.target].push(edge.source);
    });

    const courseMap = {};
    courses.forEach(c => { courseMap[c.id.toString()] = c; });

    const reqs = prereqMap[selected] || [];
    const missing = reqs
      .filter(reqId => !completedIds.has(reqId))
      .map(reqId => courseMap[reqId]?.courseName || `Course #${reqId}`);

    return { eligible: missing.length === 0, missing };
  }, [selected, enrollments, graphEdges, courses]);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 flex items-center justify-center h-[200px]">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-1">Eligibility Checker</h3>
      <p className="text-xs opacity-50 font-mono mb-6">Prerequisite Validation using Graph Edges</p>
      
      <select 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg p-3 text-sm mb-4 outline-none focus:border-indigo-500/50 [&>option]:bg-[var(--bg-color)] [&>option]:text-[var(--text-color)]"
      >
        {courses.map(c => <option key={c.id} value={c.id.toString()}>{c.courseCode} — {c.courseName}</option>)}
      </select>

      <div className={`p-4 rounded-xl border ${result.eligible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        {result.eligible ? (
          <div className="flex items-center gap-2 text-emerald-500 font-medium">
            <Check className="w-5 h-5"/> Eligible (All Prerequisites Met)
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-red-500 font-medium mb-2">
              <X className="w-5 h-5"/> Missing Prerequisites
            </div>
            <div className="flex flex-wrap gap-2">
              {result.missing.map(m => <span key={m} className="px-2 py-1 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded font-medium">{m}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}