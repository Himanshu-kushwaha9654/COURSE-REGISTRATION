const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'dashboard');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

const components = {
  'HeroProgress.jsx': `
import React from 'react';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

export default function HeroProgress() {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Welcome back, Piyush 👋</h2>
          <p className="text-white/50 mb-6">Semester 5 • B.Tech Computer Science</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><BookOpen className="w-5 h-5"/></div>
              <div><p className="text-2xl font-bold">8</p><p className="text-xs text-white/50">Completed</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center"><Award className="w-5 h-5"/></div>
              <div><p className="text-2xl font-bold">18</p><p className="text-xs text-white/50">Credits Earned</p></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.78)} strokeLinecap="round" className="transition-all duration-1000 ease-out"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#22d3ee"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black">78%</span>
            </div>
          </div>
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase mt-4">Degree Completion</span>
        </div>
      </div>
    </div>
  );
}
  `,

  'RecommendationEngine.jsx': `
import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { getRecommendations } from '../../utils/dsaLogic';

export default function RecommendationEngine() {
  const recommendations = getRecommendations();
  
  return (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400"/> Smart Recommendation Engine</h3>
          <p className="text-xs text-white/40 mt-1 font-mono">Generated using Graph Traversal & HashSet validation</p>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">What Can I Take Next?</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300">{rec.course.id}</span>
              <span className="text-xs font-mono text-cyan-400">{rec.confidence}% Match</span>
            </div>
            <h4 className="font-semibold text-sm mb-2">{rec.course.name}</h4>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Prerequisites Met
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  `,

  'DependencyGraph.jsx': `
import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network } from 'lucide-react';
import { courses, completedCourses, checkEligibility } from '../../utils/dsaLogic';

const customNodeStyle = {
  background: '#0A0A0F',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '10px 15px',
  fontSize: '12px',
  fontWeight: 'bold'
};

export default function DependencyGraph() {
  const { nodes, edges } = useMemo(() => {
    const nds = courses.map((course, idx) => {
      let bg = '#1e1e2d'; // default
      let border = 'rgba(255,255,255,0.1)';
      if (completedCourses.has(course.id)) {
        bg = 'rgba(16, 185, 129, 0.1)'; // green
        border = 'rgba(16, 185, 129, 0.3)';
      } else if (checkEligibility(course.id).eligible) {
        bg = 'rgba(56, 189, 248, 0.1)'; // blue
        border = 'rgba(56, 189, 248, 0.4)';
      }
      
      return {
        id: course.id,
        position: { x: (idx % 3) * 200, y: Math.floor(idx / 3) * 150 },
        data: { label: course.name },
        style: { ...customNodeStyle, background: bg, border: \`1px solid \${border}\` }
      };
    });

    const eds = [];
    courses.forEach(course => {
      course.prereqs.forEach(pre => {
        eds.push({
          id: \`e-\${pre}-\${course.id}\`,
          source: pre,
          target: course.id,
          animated: true,
          style: { stroke: 'rgba(255,255,255,0.2)' }
        });
      });
    });

    return { nodes: nds, edges: eds };
  }, []);

  return (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 mb-8 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><Network className="w-5 h-5 text-purple-400"/> Course Dependency Graph</h3>
          <p className="text-xs text-white/40 mt-1 font-mono">Adjacency List Visualization</p>
        </div>
        <div className="flex gap-3 text-xs font-medium">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Completed</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Available</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/20"></div> Locked</span>
        </div>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden border border-white/5 bg-black/20">
        <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark">
          <Background color="#ffffff" gap={20} size={1} variant="dots" />
          <Controls className="bg-[#0A0A0F] border-white/10 fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
}
  `,

  'RoadmapTimeline.jsx': `
import React from 'react';
import { Map, ArrowDown } from 'lucide-react';
import { generateRoadmap } from '../../utils/dsaLogic';

export default function RoadmapTimeline() {
  const { semesters } = generateRoadmap();

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2"><Map className="w-5 h-5 text-emerald-400"/> Roadmap Timeline</h3>
          <p className="text-xs text-white/40 mt-1 font-mono">Generated using Kahn's Algorithm (Topological Sort)</p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">Generate My Roadmap</button>
      </div>
      
      <div className="space-y-4">
        {semesters.map((sem, idx) => (
          <div key={idx} className="relative">
            <div className="flex items-center gap-4">
              <div className="w-24 text-right">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Sem {idx + 1}</span>
              </div>
              <div className="flex gap-2 flex-wrap flex-1">
                {sem.map(course => (
                  <div key={course} className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm">{course}</div>
                ))}
              </div>
            </div>
            {idx < semesters.length - 1 && (
              <div className="pl-32 py-2">
                <ArrowDown className="w-4 h-4 text-white/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
  `,

  'EligibilityChecker.jsx': `
import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { courses, checkEligibility } from '../../utils/dsaLogic';

export default function EligibilityChecker() {
  const [selected, setSelected] = useState(courses[7].id); // ML

  const res = checkEligibility(selected);

  return (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-1">Eligibility Checker</h3>
      <p className="text-xs text-white/40 font-mono mb-6">O(1) HashSet Lookup</p>
      
      <select 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm mb-4 outline-none focus:border-indigo-500/50"
      >
        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <div className={\`p-4 rounded-xl border \${res.eligible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}\`}>
        {res.eligible ? (
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Check className="w-5 h-5"/> Eligible (Prerequisites Met)
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
              <X className="w-5 h-5"/> Missing Prerequisites
            </div>
            <div className="flex gap-2">
              {res.missing.map(m => <span key={m} className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded">{m}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  `,

  'SemesterPlanner.jsx': `
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { planSemesterGreedy } from '../../utils/dsaLogic';

export default function SemesterPlanner() {
  const [credits, setCredits] = useState(12);
  const { planned, totalCredits } = planSemesterGreedy(credits);

  return (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-400"/> Semester Planner</h3>
      <p className="text-xs text-white/40 font-mono mt-1 mb-6">Greedy Algorithm Optimization</p>
      
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-white/70">Max Credits:</label>
        <input 
          type="range" min="3" max="24" step="1" 
          value={credits} onChange={e => setCredits(parseInt(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <span className="font-mono bg-white/10 px-3 py-1 rounded text-sm">{credits}</span>
      </div>

      <div className="space-y-3">
        {planned.map(c => (
          <div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-sm font-medium">{c.name}</span>
            <span className="text-xs text-white/50 bg-black/50 px-2 py-1 rounded">{c.credits} cr</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm font-bold">
        <span>Total Planned:</span>
        <span className="text-indigo-400">{totalCredits} Credits</span>
      </div>
    </div>
  );
}
  `,

  'AIAssistant.jsx': `
import React from 'react';
import { Bot, Send } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 flex flex-col h-[400px]">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-1"><Bot className="w-5 h-5 text-cyan-400"/> Graph-Powered AI Assistant</h3>
      <p className="text-xs text-white/40 font-mono mb-6 border-b border-white/10 pb-4">Answers driven by DFS</p>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <div className="flex justify-end">
          <div className="bg-indigo-500 text-white p-3 rounded-t-xl rounded-bl-xl max-w-[80%] text-sm">
            Can I take Machine Learning next semester?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white/10 text-white p-3 rounded-t-xl rounded-br-xl max-w-[80%] text-sm border border-white/5">
            No, you are missing <strong>Artificial Intelligence</strong>. AI requires CS102 and Math101, which you have completed. You should plan AI for next semester!
          </div>
        </div>
      </div>
      
      <div className="relative mt-auto">
        <input type="text" placeholder="Ask about prerequisites..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500/50" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors">
          <Send className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
}
  `,

  'ProgressAnalytics.jsx': `
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const data = [
  { name: 'Sem 1', credits: 16 },
  { name: 'Sem 2', credits: 14 },
  { name: 'Sem 3', credits: 18 },
  { name: 'Sem 4', credits: 15 },
  { name: 'Sem 5', credits: 18 }
];

export default function ProgressAnalytics() {
  return (
    <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><PieIcon className="w-5 h-5 text-pink-400"/> Progress Analytics</h3>
      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} />
            <Bar dataKey="credits" fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
  `,

  'AlgorithmPlayground.jsx': `
import React, { useState } from 'react';
import { Terminal, Play } from 'lucide-react';

export default function AlgorithmPlayground() {
  const [step, setStep] = useState(0);
  
  const steps = [
    { q: '[Math101]', log: 'Queue initialized with 0-indegree nodes.' },
    { q: '[]', log: 'Processing Math101... Removed.' },
    { q: '[CS101]', log: 'In-degree of CS101 becomes 0. Added to Queue.' },
    { q: '[]', log: 'Processing CS101... Removed.' },
    { q: '[CS102]', log: 'In-degree of CS102 becomes 0. Added to Queue.' },
    { q: '[]', log: 'Processing CS102... Roadmap updated.' }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-950/40 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[50px] rounded-full"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2"><Terminal className="w-6 h-6 text-indigo-400"/> Algorithm Playground</h3>
          <p className="text-xs text-white/50 mt-1 font-mono">Live Topological Sort (Kahn's) - O(V+E)</p>
        </div>
        <button 
          onClick={() => setStep(s => (s + 1) % steps.length)}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <Play className="w-4 h-4 fill-current"/> Step Forward
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-sm">
          <div className="text-white/40 mb-2">Queue State</div>
          <div className="text-cyan-400 text-xl tracking-widest">{steps[step].q}</div>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-sm">
          <div className="text-white/40 mb-2">Algorithm Log</div>
          <div className="text-emerald-400">{steps[step].log}</div>
        </div>
      </div>
    </div>
  );
}
  `,
  
  'ActivityAndUpcoming.jsx': `
import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';

export default function ActivityAndUpcoming() {
  return (
    <div className="space-y-6">
      <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6">
        <h3 className="font-bold flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-white/40"/> Recent Activity</h3>
        <div className="space-y-4">
          {['Enrolled in DBMS', 'Completed CS201', 'Generated Roadmap'].map((act, i) => (
            <div key={i} className="flex gap-4 relative">
              <div className="w-px bg-white/10 absolute left-1.5 top-5 bottom-0"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-500/50 border-2 border-[#0A0A0F] relative z-10 mt-1"></div>
              <div>
                <p className="text-sm font-medium">{act}</p>
                <p className="text-xs text-white/40">2 days ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
        <h3 className="font-bold flex items-center gap-2 mb-4"><CalendarDays className="w-4 h-4 text-indigo-400"/> Upcoming Courses</h3>
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-indigo-500/30 transition-colors cursor-pointer">
          <p className="font-bold text-sm mb-1">Machine Learning</p>
          <div className="flex justify-between text-xs text-white/50">
            <span>Starts: Aug 10</span>
            <span>4 Credits</span>
          </div>
        </div>
      </div>
    </div>
  );
}
  `
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content.trim());
}
console.log('Dashboard components generated successfully.');
