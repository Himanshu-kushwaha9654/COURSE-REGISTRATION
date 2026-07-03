const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const files = {
  'StatsSection.jsx': `
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
  `,
  'ProblemSolution.jsx': `
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
  `,
  'Features.jsx': `
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
              <feature.icon className={\`w-10 h-10 mb-6 \${feature.color}\`} />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
  `,
  'DashboardShowcase.jsx': `
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
  `,
  'HowItWorks.jsx': `
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
  `,
  'CourseGraph.jsx': `
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
  `,
  'StudentJourney.jsx': `
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
  `,
  'Testimonials.jsx': `
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    { text: 'CourseFlow made planning my degree incredibly easy. No more Excel sheets!', author: 'Sarah J.', role: 'Computer Science' },
    { text: 'The roadmap visualization helped me understand prerequisites perfectly.', author: 'Michael T.', role: 'Software Engineering' },
    { text: 'Finally a course registration platform that feels modern and intelligent.', author: 'Emily R.', role: 'Data Science' }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold mb-16 text-center">Loved by Students</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 text-yellow-400" fill="currentColor" />)}
              </div>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500"></div>
                <div>
                  <div className="font-semibold">{review.author}</div>
                  <div className="text-xs text-white/50">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
  `,
  'FAQ.jsx': `
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: 'How does CourseFlow recommend courses?', a: 'We use graph algorithms and machine learning to analyze your completed courses, major requirements, and historical data to suggest the optimal next steps.' },
    { q: 'How does prerequisite visualization work?', a: 'CourseFlow maps out dependencies as a directed acyclic graph, highlighting blocked paths until prerequisites are cleared.' },
    { q: 'Can I track my degree progress?', a: 'Yes! Our dashboard provides real-time analytics on credits earned, category requirements, and estimated graduation date.' },
    { q: 'Can I plan semesters efficiently?', a: 'Absolutely. The semester planner ensures you balance difficult core courses with easier electives without exceeding credit limits.' }
  ];

  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-3xl mx-auto px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-lg hover:bg-white/[0.02] transition-colors"
              >
                {faq.q}
                <ChevronDown className={\`w-5 h-5 transition-transform \${openIdx === i ? 'rotate-180' : ''}\`} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-white/60 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
  `,
  'CTASection.jsx': `
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
  `,
  'Footer.jsx': `
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05050A] pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-xl font-bold tracking-tight mb-6">CourseFlow</div>
            <p className="text-white/40 text-sm mb-6">The intelligent academic planning platform built for modern students.</p>
            <div className="flex gap-4">
              <a href="#" className="text-white/40 hover:text-white"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white">Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Roadmap</a></li>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">GitHub</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-white/30 text-sm">
          © 2026 CourseFlow Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
  `
};

Object.entries(files).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(dir, filename), content.trim());
});
console.log('Components generated!');
