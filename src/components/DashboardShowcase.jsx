import { motion } from 'framer-motion';

export default function DashboardShowcase() {
  return (
    <section className="py-32 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Command Center for Your Degree</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">A realistic dashboard designed for clarity, giving you total control over your academic journey.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl rounded-t-2xl border border-white/10 bg-[#0A0A0F] shadow-2xl overflow-hidden"
        >
          {/* Mac window header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          
          <div className="p-8 grid grid-cols-12 gap-6 h-[600px] overflow-hidden">
            {/* Sidebar */}
            <div className="col-span-3 space-y-4 border-r border-white/10 pr-6">
              <div className="h-10 w-full bg-white/10 rounded-lg animate-pulse"></div>
              <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse"></div>
              <div className="h-8 w-1/2 bg-white/5 rounded animate-pulse"></div>
              <div className="h-8 w-2/3 bg-white/5 rounded animate-pulse"></div>
            </div>
            
            {/* Main Content */}
            <div className="col-span-9 flex flex-col gap-6">
              <div className="flex gap-6">
                <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-2">Degree Completion</div>
                  <div className="text-3xl font-bold mb-4">78%</div>
                  <div className="h-2 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[78%] bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-2">Credits Earned</div>
                  <div className="text-3xl font-bold">96 <span className="text-lg text-white/30">/ 120</span></div>
                </div>
                <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-2">Current Semester</div>
                  <div className="text-3xl font-bold">Fall 2026</div>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col">
                <div className="text-sm text-white/50 mb-4">Recommended Courses Pipeline</div>
                <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center">
                  <div className="text-white/20">Analytics Chart Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}