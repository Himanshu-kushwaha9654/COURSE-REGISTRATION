import { motion } from 'framer-motion';

export default function StatsSection() {
  const stats = [
    { label: 'Students', value: '10K+' },
    { label: 'Courses', value: '500+' },
    { label: 'Departments', value: '50+' },
    { label: 'Graduation Success', value: '95%' }
  ];

  return (
    <section className="py-20 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{stat.value}</div>
              <div className="text-sm font-medium text-white/50 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}