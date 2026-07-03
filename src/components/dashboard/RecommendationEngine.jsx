import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function RecommendationEngine() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recommendations = useMemo(() => {
    const completedIds = new Set(
      enrollments
        .filter(e => ['APPROVED', 'COMPLETED', 'PENDING'].includes(e.status))
        .map(e => e.course?.id?.toString())
    );

    // Build prereq map (target -> sources) and dependents map (source -> targets)
    const prereqMap = {};
    const dependentsMap = {};
    graphEdges.forEach(edge => {
      if (!prereqMap[edge.target]) prereqMap[edge.target] = [];
      prereqMap[edge.target].push(edge.source);
      if (!dependentsMap[edge.source]) dependentsMap[edge.source] = [];
      dependentsMap[edge.source].push(edge.target);
    });

    const eligible = courses.filter(c => {
      if (completedIds.has(c.id?.toString())) return false;
      const reqs = prereqMap[c.id?.toString()] || [];
      return reqs.every(reqId => completedIds.has(reqId));
    });

    // Score: number of downstream dependents (higher = more strategic to take)
    return eligible.map(course => {
      const dependents = dependentsMap[course.id?.toString()] || [];
      const score = Math.min(99, 70 + dependents.length * 10);
      return { course, confidence: score };
    }).sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  }, [courses, enrollments, graphEdges]);

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-teal-500"/> Smart Recommendation Engine</h3>
          <p className="text-xs opacity-50 mt-1 font-mono">Powered by Graph Traversal & Bottleneck Analysis</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 relative z-10">
          <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-sm opacity-50 py-4 relative z-10">No recommendations available. Enroll in some courses first!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {recommendations.map((rec, i) => (
            <div key={rec.course.id} className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-teal-500/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-teal-500/10 text-teal-500">{rec.course.courseCode}</span>
                <span className="text-xs font-mono text-emerald-500">{rec.confidence}% Match</span>
              </div>
              <h4 className="font-semibold text-sm mb-2">{rec.course.courseName}</h4>
              <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Prerequisites Met
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}