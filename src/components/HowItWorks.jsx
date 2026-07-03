import { motion } from 'framer-motion';
import { Search, Map, Zap, Award } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    { icon: Search, title: 'Explore Courses', desc: 'Browse the entire catalog with AI-assisted search.' },
    { icon: Map, title: 'Build Your Academic Roadmap', desc: 'Drag and drop courses to plan multiple semesters.' },
    { icon: Zap, title: 'Receive Smart Recommendations', desc: 'Let our algorithm fill in the gaps and meet requirements.' },
    { icon: Award, title: 'Graduate Faster', desc: 'Stay on track and never miss a prerequisite.' }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
        <div className="space-y-12 relative">
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 opacity-20"></div>
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="flex items-start gap-8 relative"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#0A0A0F] border border-white/20 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <step.icon className="w-6 h-6 text-white/80" />
              </div>
              <div className="pt-3">
                <h3 className="text-2xl font-bold mb-2">Step {idx + 1}: {step.title}</h3>
                <p className="text-white/60 text-lg">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}