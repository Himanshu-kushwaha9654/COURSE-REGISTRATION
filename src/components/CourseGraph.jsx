import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function CourseGraph() {
  const nodes = ['Math101', 'CS101', 'CS102', 'DBMS', 'Artificial Intelligence', 'Machine Learning'];

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Course Graph Visualization</h2>
          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            Under the hood, CourseFlow represents your degree as a directed acyclic graph. We use advanced algorithms to guarantee you take the right courses in the exact right order.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {['Topological Sort', 'DFS Cycle Detection', 'Smart Recommendations', 'Graph Algorithms'].map((tag, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-cyan-300">
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="relative py-10 flex flex-col items-center">
          {nodes.map((node, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-6 py-3 rounded-full bg-[#0A0A0F] border border-cyan-500/30 text-white font-medium shadow-[0_0_20px_rgba(34,211,238,0.15)] relative z-10"
              >
                {node}
              </motion.div>
              {i < nodes.length - 1 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: 40, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  className="w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500 my-2 relative"
                >
                  <ArrowDown className="absolute -bottom-4 -left-[11px] w-6 h-6 text-purple-500" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}