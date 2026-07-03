import { motion } from 'framer-motion';
import { Sparkles, Network, ArrowDownUp, RefreshCw, BarChart3, CalendarDays } from 'lucide-react';

export default function Features() {
  const features = [
    { title: 'Smart Course Recommendations', desc: 'AI-powered suggestions based on completed prerequisites.', icon: Sparkles, color: 'text-cyan-400' },
    { title: 'Interactive Course Graph', desc: 'Visualize dependencies between courses.', icon: Network, color: 'text-purple-400' },
    { title: 'Topological Sorting Engine', desc: 'Automatically generate the best learning path.', icon: ArrowDownUp, color: 'text-blue-400' },
    { title: 'Cycle Detection', desc: 'Prevent invalid prerequisite chains.', icon: RefreshCw, color: 'text-rose-400' },
    { title: 'Progress Analytics', desc: 'Track credits and graduation progress.', icon: BarChart3, color: 'text-emerald-400' },
    { title: 'Semester Planner', desc: 'Create balanced schedules with no overload.', icon: CalendarDays, color: 'text-amber-400' }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Intelligent Academic Planning</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">Everything you need to navigate your degree from day one to graduation.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
              <feature.icon className={`w-10 h-10 mb-6 ${feature.color}`} />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}