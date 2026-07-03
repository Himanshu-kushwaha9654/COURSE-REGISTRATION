import React from 'react';
import { Cpu, Map, Activity, Network, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlgorithmPlaygroundView() {
  const algorithms = [
    {
      title: "Topological Sort (Kahn's)",
      description: "Automatically resolves course prerequisites into a linear valid sequence. Used for the smart Curriculum Builder.",
      icon: Map,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      link: "/dashboard/admin/curriculum"
    },
    {
      title: "Breadth-First Search (BFS)",
      description: "Traverses downstream dependencies to calculate bottleneck impact scores for every course.",
      icon: Activity,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      link: "/dashboard/admin/heatmap"
    },
    {
      title: "Depth-First Search (DFS)",
      description: "Live cycle detection during graph modification. Prevents circular dependencies instantly.",
      icon: Network,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
      link: "/dashboard/admin/prerequisites"
    }
  ];

  return (
    <div className="p-8 pb-32 h-full flex flex-col relative">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Cpu className="text-cyan-400" /> Algorithm Lab</h1>
        <p className="text-slate-400">The core Graph DSA algorithms driving the intelligence of CourseFlow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {algorithms.map((algo, i) => (
          <div key={i} className={`glass-panel rounded-3xl p-8 border ${algo.border} relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${algo.bg} rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className={`p-4 rounded-2xl ${algo.bg} inline-block mb-6 relative z-10 shadow-lg`}>
              <algo.icon className={`w-8 h-8 ${algo.color}`} />
            </div>
            
            <h3 className="text-2xl font-black mb-3 relative z-10">{algo.title}</h3>
            <p className="text-slate-400 mb-8 relative z-10 min-h-[60px]">{algo.description}</p>
            
            <Link to={algo.link} className={`flex items-center gap-2 font-bold ${algo.color} group/link relative z-10 w-fit`}>
              Launch Visualizer <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
