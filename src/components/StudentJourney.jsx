import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function StudentJourney() {
  const journey = [
    { sem: 'Semester 1', desc: 'Programming Fundamentals' },
    { sem: 'Semester 2', desc: 'Data Structures and OOP' },
    { sem: 'Semester 3', desc: 'DBMS and Operating Systems' },
    { sem: 'Semester 4', desc: 'Artificial Intelligence and ML' }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-8 overflow-hidden">
        <h2 className="text-4xl font-bold mb-16 text-center">Your Academic Journey</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-emerald-500/20 -translate-y-1/2 -z-10"></div>
          
          {journey.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex-1 w-full bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">{item.sem}</div>
              <h3 className="text-lg font-semibold">{item.desc}</h3>
              {i < journey.length - 1 && (
                <div className="md:hidden my-4 flex justify-center"><ArrowRight className="text-white/20" /></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}