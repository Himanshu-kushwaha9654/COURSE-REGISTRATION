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