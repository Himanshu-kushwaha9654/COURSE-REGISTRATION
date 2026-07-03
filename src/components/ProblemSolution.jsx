import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function ProblemSolution() {
  const problems = [
    'Confusing prerequisite structures',
    'Poor semester planning',
    'Missing important courses',
    'Registration conflicts'
  ];
  
  const solutions = [
    'Smart course recommendations',
    'Visual course roadmap',
    'Degree progress tracking',
    'Semester planning'
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-red-950/10 border border-red-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-red-400">The Problem</span>
            </h3>
            <ul className="space-y-6">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-4 text-white/70 text-lg">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-emerald-950/10 border border-emerald-500/20 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-emerald-400">The Solution</span>
            </h3>
            <ul className="space-y-6">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-4 text-white/90 text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}