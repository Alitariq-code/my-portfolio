import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, CheckCircle, Download } from 'lucide-react';
import ProfileImage from '../components/ProfileImage';
import GitHubActivity from '../components/GitHubActivity';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const leftItemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const rightItemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative bg-slate-800/30 py-16">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-purple/20 to-cyan/20 rounded-full blur-[120px] opacity-30 -z-0" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-wide text-white">
            About Me
          </h2>
          {/* Decorative gradient line */}
          <div className="w-[60px] h-[3px] bg-gradient-to-r from-teal via-cyan to-cyan-light rounded-full mx-auto" />
        </motion.div>

        {/* Main Content - Two Column Layout (35% / 65%) */}
        <div className="grid lg:grid-cols-[35%_65%] gap-8 lg:gap-12">
          {/* Left Column - Image + Quick Info Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            {/* Professional Image */}
            <motion.div
              variants={leftItemVariants}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative w-[220px] h-[220px]">
                <ProfileImage size="medium" showParticles={false} />
                {/* Available Badge */}
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass backdrop-blur-lg border border-emerald/30">
                  <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  <span className="text-xs font-semibold text-emerald">Available</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              variants={leftItemVariants}
              className="space-y-3"
            >
              {/* Location Card */}
              <motion.div
                variants={itemVariants}
                className="glass rounded-lg p-4 flex items-center gap-3 border border-white/10"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-teal/20 to-cyan/20 border border-teal/30 flex-shrink-0">
                  <MapPin className="text-teal" size={20} />
                </div>
                <span className="text-sm font-medium text-slate-300">Lahore, Pakistan</span>
              </motion.div>

              {/* Status Card */}
              <motion.div
                variants={itemVariants}
                className="glass rounded-lg p-4 flex items-center gap-3 border border-white/10"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald/20 to-emerald/20 border border-emerald/30 flex-shrink-0">
                  <CheckCircle className="text-emerald" size={20} />
                </div>
                <span className="text-sm font-medium text-slate-300">Available for opportunities</span>
              </motion.div>

              {/* Download CV Card */}
              <motion.a
                variants={itemVariants}
                href="/Ali-Tariq-Resume.pdf"
                download="Ali-Tariq-Resume.pdf"
                className="glass rounded-lg p-4 flex items-center gap-3 border border-white/10 cursor-pointer select-none"
                style={{ transition: 'none' }}
                whileHover={{ 
                  y: -2, 
                  scale: 1.02,
                    boxShadow: '0 10px 40px rgba(20, 184, 166, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-teal/20 to-teal-dark/20 border border-teal/30 flex-shrink-0">
                  <Download className="text-teal" size={20} />
                </div>
                <span className="text-sm font-medium text-teal">Download Resume</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Professional Summary + Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-10"
          >
            {/* Professional Summary */}
            <motion.div
              variants={rightItemVariants}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">
                Professional Summary
              </h3>
              
              <div className="space-y-4 text-base leading-relaxed">
                <p className="text-[#E2E8F0]">
                  Senior Full Stack Developer and IoT Platform Architect with 5+ years of experience building enterprise-grade applications and industrial IoT ecosystems. Currently leading development of NeoTAQ platform at Green Fuel Energy, serving 15+ enterprise clients with real-time energy management solutions.
                </p>
                
                <p className="text-[#E2E8F0]">
                  Expert in full-stack development, distributed microservices, and cloud infrastructure. Specialized in system design and solution architecture, designing scalable, high-performance systems that handle millions of operations. Proven track record delivering mission-critical solutions for government and enterprise clients with 99.9% reliability and 1000+ concurrent user support.
                </p>
              </div>
            </motion.div>

            {/* GitHub Activity */}
            <motion.div
              variants={rightItemVariants}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <GitHubActivity username="Alitariq-code" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
