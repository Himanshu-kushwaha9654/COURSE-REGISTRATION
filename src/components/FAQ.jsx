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
                <ChevronDown className={`w-5 h-5 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
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