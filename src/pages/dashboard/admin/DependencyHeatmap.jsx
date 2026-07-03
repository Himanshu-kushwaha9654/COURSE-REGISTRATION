import React, { useState, useEffect } from 'react';
import { Activity, Info } from 'lucide-react';
import api from '../../../api/axiosConfig';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

export default function DependencyHeatmap() {
  const [courses, setCourses] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  
  const [filterUniversity, setFilterUniversity] = useState('AKTU');
  const [filterProgram, setFilterProgram] = useState('B.Tech Computer Science');
  
  const [universities, setUniversities] = useState([]);
  const [programsMap, setProgramsMap] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, graphRes] = await Promise.all([
        api.get('/courses'),
        api.get('/graph/data')
      ]);
      
      const coursesList = coursesRes.data;
      const edges = graphRes.data.edges || [];
      
      setCourses(coursesList);
      
      const univs = new Set();
      const progMap = {};
      coursesList.forEach(course => {
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
      
      // Build adjacency list for downstream dependencies (source -> targets)
      const adjList = {};
      edges.forEach(edge => {
        if (!adjList[edge.source]) adjList[edge.source] = [];
        adjList[edge.source].push(edge.target);
      });
      
      const calculateBottleneckImpact = (courseId) => {
        const visited = new Set();
        const queue = [courseId.toString()];
        visited.add(courseId.toString());
        let count = 0;
        
        while (queue.length > 0) {
          const current = queue.shift();
          const descendants = adjList[current] || [];
          for (const child of descendants) {
            if (!visited.has(child)) {
              visited.add(child);
              queue.push(child);
              count++;
            }
          }
        }
        return count;
      };
      
      const data = coursesList.map((course) => {
        const impact = calculateBottleneckImpact(course.id);
        return {
          id: course.id,
          name: course.courseCode,
          fullName: course.courseName,
          university: course.program?.university?.name,
          program: course.program?.name,
          x: course.semester, // Group by semester on X axis
          y: Math.random() * 100, // Random Y for scatter spread
          z: impact === 0 ? 0.1 : impact, // Add a tiny z so size isn't 0
          impact: impact
        };
      });

      setHeatmapData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-rose-500/20 p-4 rounded-xl shadow-xl backdrop-blur-xl">
          <p className="font-bold text-rose-400 mb-1">{data.name}</p>
          <p className="text-sm text-slate-300 mb-2">{data.fullName}</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Downstream Impact</span>
            <span className="font-black text-rose-500 text-lg">{data.impact} courses</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const filteredHeatmapData = heatmapData.filter(d => {
    const matchesUniv = filterUniversity ? d.university === filterUniversity : true;
    const matchesProg = filterProgram ? d.program === filterProgram : true;
    return matchesUniv && matchesProg;
  });

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Activity className="text-rose-400" /> Dependency Heatmap</h1>
          <p className="text-slate-400">Identifies critical path bottlenecks using BFS downstream counting.</p>
        </div>
        
        <div className="flex gap-4 min-w-[300px]">
          <select 
            value={filterUniversity} 
            onChange={(e) => { setFilterUniversity(e.target.value); setFilterProgram(''); }}
            className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 appearance-none cursor-pointer"
          >
            <option value="">All Universities</option>
            {universities.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          
          <select 
            value={filterProgram} 
            onChange={e => setFilterProgram(e.target.value)}
            className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 appearance-none cursor-pointer"
          >
            <option value="">All Programs</option>
            {(programsMap[filterUniversity] || []).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        <div className="w-80 shrink-0 flex flex-col gap-6 pr-2">
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl relative overflow-hidden shrink-0">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-rose-100 mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-rose-400"/> BFS Analysis</h3>
            <p className="text-sm text-rose-400/80 leading-relaxed">
              The graph visualizes courses sized by their bottleneck score. A high score means a course blocks many downstream paths.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[var(--glass-border)] flex-1 min-h-0 flex flex-col">
            <h3 className="font-bold mb-4 flex items-center gap-2 shrink-0"><Activity className="w-4 h-4 text-rose-400"/> Top Bottlenecks</h3>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {[...filteredHeatmapData].sort((a, b) => b.impact - a.impact).slice(0, 10).map((node, i) => (
                <div key={node.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-rose-500/30 transition-colors">
                  <div>
                    <span className="font-bold text-sm block">{node.name}</span>
                    <span className="text-xs text-slate-400">Sem {node.x}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center font-black text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                    {node.impact}
                  </div>
                </div>
              ))}
              {filteredHeatmapData.length === 0 && <p className="text-slate-500 text-sm">No courses to analyze.</p>}
            </div>
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-3xl p-8 relative flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-center text-slate-300">Bottleneck Impact by Semester</h3>
          <div className="flex-1 w-full h-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="x" type="number" name="Semester" domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748b" tickFormatter={(v) => `Sem ${v}`} />
                <YAxis dataKey="y" type="number" name="Spread" hide />
                <ZAxis dataKey="z" type="number" range={[100, 4000]} name="Impact" />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)'}} />
                <Scatter name="Courses" data={filteredHeatmapData} fill="#f43f5e" animationDuration={1500}>
                  {filteredHeatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f43f5e" opacity={entry.impact > 0 ? 0.7 : 0.2} stroke={entry.impact > 0 ? '#fda4af' : 'transparent'} strokeWidth={2} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(244,63,94,0.2) 0%, transparent 70%)' }}></div>
        </div>
      </div>
    </div>
  );
}
