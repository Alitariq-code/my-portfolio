import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail, Linkedin, Github, Mouse, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import ParticleBackground from '../components/ParticleBackground';
import TechMarquee from '../components/TechMarquee';
import ProfileImage from '../components/ProfileImage';
import { trackButtonClick, trackDownload } from '../components/Analytics';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
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

export default function Hero() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setCursor({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = heroRef.current;
    section?.addEventListener('mousemove', handleMouseMove);
    return () => section?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
      aria-label="Hero section"
    >
      {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Gradient Mesh */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'linear-gradient(135deg, #14B8A6 0%, #06B6D4 50%, #22D3EE 100%)',
              'linear-gradient(135deg, #06B6D4 0%, #14B8A6 50%, #22D3EE 100%)',
              'linear-gradient(135deg, #22D3EE 0%, #06B6D4 50%, #14B8A6 100%)',
              'linear-gradient(135deg, #14B8A6 0%, #06B6D4 50%, #22D3EE 100%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Base Grid Pattern - Always Visible */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20, 184, 166, 0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(20, 184, 166, 0.08) 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
          }}
        />

        {/* Spotlight Grid Mask - Follows Mouse */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20, 184, 166, 0.25) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(20, 184, 166, 0.25) 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            maskImage: `radial-gradient(circle 250px at ${cursor.x}px ${cursor.y}px, white 0%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(circle 250px at ${cursor.x}px ${cursor.y}px, white 0%, transparent 80%)`,
            opacity: 0.9,
            transition: 'mask-position 0.1s ease-out',
          }}
        />

        {/* Spotlight Glow - Follows Mouse */}
        <motion.div
          className="absolute z-20 pointer-events-none blur-3xl rounded-full"
          style={{
            width: 400,
            height: 400,
            left: cursor.x - 200,
            top: cursor.y - 200,
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          }}
          animate={{ left: cursor.x - 200, top: cursor.y - 200 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Particle Background */}
      <ParticleBackground />

      {/* Content - Two Column Layout */}
      <div className="relative z-10 section-container pb-32 pt-24">
        <div className="grid md:grid-cols-[60%_40%] gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center md:text-left order-2 md:order-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Availability Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  👋
                </motion.span>
                <span className="text-sm font-medium text-slate-300">
                  Available for opportunities
                </span>
              </motion.div>

              {/* Name and Role with Typewriter Effect */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight tracking-wide select-none"
                style={{ cursor: 'default' }}
              >
                Hey! I'm{' '}
                <motion.span 
                  className="hero-name-gradient-enhanced"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  Ali Tariq
                </motion.span>
                , a{' '}
                <span className="text-teal">
                  <Typewriter
                    options={{
                      strings: ['Full Stack', 'IoT', 'Software'],
                      autoStart: true,
                      loop: true,
                      delay: 75,
                      deleteSpeed: 50,
                    }}
                  />
                </span>{' '}
                Developer.
              </motion.h1>

              {/* Tagline */}
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl max-w-[600px] mx-auto md:mx-0 mb-4 text-slate-200 leading-relaxed font-medium select-none"
                style={{ cursor: 'default' }}
              >
                Building scalable IoT platforms & enterprise solutions
              </motion.p>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base max-w-[600px] mx-auto md:mx-0 mb-10 text-slate-300 leading-relaxed select-none"
                style={{ cursor: 'default' }}
              >
                5+ years of experience creating mission-critical systems for enterprise clients and government organizations.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start items-center mb-8 mt-8"
              >
                {/* Primary Button - Download Resume (Now Primary) */}
                <motion.a
                  href="/Ali-Tariq-Resume.pdf"
                  download="Ali-Tariq-Resume.pdf"
                  onClick={() => {
                    trackDownload('Ali-Tariq-Resume.pdf');
                    trackButtonClick('Download Resume', 'Hero');
                  }}
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal via-cyan to-teal focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-slate-900 relative select-none shadow-lg hover:shadow-teal/50 transition-shadow"
                  style={{ cursor: 'pointer', transition: 'none', willChange: 'transform' }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 40px rgba(20, 184, 166, 0.5)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="Download resume PDF"
                >
                  <span className="flex items-center gap-2 pointer-events-none">
                    <motion.span
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Download className="w-5 h-5" />
                    </motion.span>
                    Download Resume
                  </span>
                </motion.a>

                {/* Secondary Button - View My Work */}
                <motion.button
                  onClick={() => {
                    trackButtonClick('View My Work', 'Hero');
                    scrollToProjects();
                  }}
                  className="px-8 py-3 rounded-lg font-semibold border-2 border-teal text-teal hover:bg-teal/10 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-slate-900 select-none transition-colors"
                  style={{ cursor: 'pointer', transition: 'none', willChange: 'transform' }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 40px rgba(20, 184, 166, 0.4)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="View my projects"
                >
                  <span className="flex items-center gap-2 pointer-events-none">
                    <Briefcase className="w-5 h-5" />
                    View My Work
                  </span>
                </motion.button>

                {/* Tertiary Button - Contact Me */}
                <motion.button
                  onClick={() => {
                    trackButtonClick('Contact Me', 'Hero');
                    scrollToContact();
                  }}
                  className="px-8 py-3 rounded-lg font-semibold glass border border-white/20 text-cyan hover:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-slate-900 select-none transition-all"
                  style={{ cursor: 'pointer', transition: 'none', willChange: 'transform' }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 40px rgba(6, 182, 212, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="Contact me"
                >
                  <span className="flex items-center gap-2 pointer-events-none">
                    <Mail size={18} />
                    Contact Me
                  </span>
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center md:justify-start items-center gap-6 mb-8"
              >
                <motion.a
                  href="https://www.linkedin.com/in/software-engineerali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 group select-none"
                  style={{ cursor: 'pointer', transition: 'none', willChange: 'transform' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="LinkedIn profile"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full glass"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    style={{ transition: 'none' }}
                  />
                  <Linkedin size={24} className="relative z-10" />
                </motion.a>
                <motion.a
                  href="https://github.com/Alitariq-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 group select-none"
                  style={{ cursor: 'pointer', transition: 'none', willChange: 'transform' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="GitHub profile"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full glass"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    style={{ transition: 'none' }}
                  />
                  <Github size={24} className="relative z-10" />
                </motion.a>
                <motion.a
                  href="mailto:alitariqcode@gmail.com"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 group select-none"
                  style={{ cursor: 'pointer', transition: 'none', willChange: 'transform' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="Send email"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full glass"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    style={{ transition: 'none' }}
                  />
                  <Mail size={24} className="relative z-10" />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Profile Image (Desktop) / Above Text (Mobile) */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <ProfileImage size="large" showParticles={true} />
          </div>
        </div>

        {/* Scroll Indicator - Enhanced */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: showScrollIndicator ? 1 : 0,
            y: showScrollIndicator ? 0 : -20,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-teal-light text-xs uppercase tracking-wider font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll Down
          </motion.p>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            >
              <Mouse className="text-teal-light" size={20} />
            </motion.div>
            <ChevronDown className="text-teal-light" size={16} />
          </motion.div>
        </motion.div>
      </div>

      {/* Tech Stack Marquee */}
      <TechMarquee />
    </section>
  );
}
