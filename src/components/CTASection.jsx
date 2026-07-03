import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-32 relative z-10 overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-16 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
            Start Building Your Academic Future Today
          </h2>
          <p className="text-xl text-white/60 mb-10">
            Experience intelligent course registration powered by graph algorithms.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">Get Started</button>
            <button className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors">Watch Demo</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}