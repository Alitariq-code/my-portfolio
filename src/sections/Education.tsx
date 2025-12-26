import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Calendar, Award } from 'lucide-react';

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section id="education" ref={ref} className="relative bg-slate-800/30 py-12 lg:py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            Education
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal via-cyan to-teal rounded-full mx-auto" />
        </motion.div>

        {/* Education Card - Compact */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-teal/30 transition-all duration-300"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal via-cyan to-teal rounded-t-xl" />

          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r from-teal to-cyan flex items-center justify-center"
            >
              <GraduationCap className="text-white" size={24} />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-1">
                Bachelor of Science in Computer Science
              </h3>
              <p className="text-teal-300 font-medium mb-3">
                The Islamia University of Bahawalpur
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-cyan-400" />
                  <span>2018 - 2022</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={14} className="text-cyan-400" />
                  <span>GPA: 3.4 / 4.0</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
