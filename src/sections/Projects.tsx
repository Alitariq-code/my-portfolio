import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, Building2, Globe, ChevronDown, FileText, Radio, Shield, Briefcase, Code2 } from 'lucide-react';
import CaseStudyModal from '../components/CaseStudyModal';
import { caseStudies, type CaseStudy } from '../data/caseStudies';

type ProjectCategory = 'All' | 'IoT' | 'Government' | 'Enterprise' | 'Open Source';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  caseStudy?: string;
  featured: boolean;
  category: ProjectCategory;
  badge: string;
  badgeColor: 'gold' | 'green' | 'blue' | 'purple' | 'orange' | 'cyan';
  icon: typeof Building2;
  isCurrent?: boolean;
  isLive?: boolean;
}

const projects: Project[] = [
  {
    title: 'NeoTAQ IoT Platform',
    description: 'NeoTAQ is an industrial IoT platform that enables real-time energy management for enterprise clients. Built with distributed microservices architecture, it serves 15+ clients managing 100+ energy assets. The platform provides multi-protocol data acquisition (Modbus, OPC UA), cloud analytics, and predictive maintenance with 99.9% reliability.',
    technologies: ['React', 'Node.js', 'NestJS', 'NATS', 'InfluxDB', 'Modbus', 'OPC UA', 'Docker', 'Kubernetes'],
    github: '',
    live: '',
    caseStudy: '',
    featured: true,
    category: 'IoT',
    badge: 'Current',
    badgeColor: 'gold',
    icon: Radio,
    isCurrent: true,
  },
  {
    title: 'KubeArchitect Microservices',
    description: 'Comprehensive microservices architecture with Kubernetes orchestration and automated CI/CD pipeline from GitHub to cluster. Demonstrates production-ready containerization, service mesh patterns, and scalable infrastructure design.',
    technologies: ['Kubernetes', 'Docker', 'Microservices', 'CI/CD', 'GitHub Actions'],
    github: 'https://github.com/Alitariq-code/KubeArchitect-Microservices',
    live: '',
    caseStudy: '',
    featured: true,
    category: 'Open Source',
    badge: 'Featured',
    badgeColor: 'purple',
    icon: Code2,
  },
  {
    title: 'Flowtopia Options Trading Platform',
    description: 'Real-time options activity tracking system monitoring institutional trading patterns with live market sentiment analysis. Provides advanced analytics dashboard for traders and financial institutions.',
    technologies: ['React', 'Node.js', 'Socket.IO', 'Real-time Analytics'],
    github: '',
    live: 'https://flowtopia.co',
    caseStudy: '',
    featured: true,
    category: 'Enterprise',
    badge: 'Live',
    badgeColor: 'green',
    icon: Globe,
    isLive: true,
  },
  {
    title: 'Abu Dhabi Civil Defence - Asset Tracking',
    description: 'Offline-capable ambulance asset tracking system ensuring emergency equipment readiness with real-time monitoring. Secure government healthcare asset management with tamper-proof tracking and compliance reporting.',
    technologies: ['React', 'Node.js', 'Offline-First Architecture'],
    github: '',
    live: '',
    caseStudy: '',
    featured: true,
    category: 'Government',
    badge: 'Government',
    badgeColor: 'blue',
    icon: Shield,
  },
  {
    title: 'Saudi MOI - Evidence Tracking',
    description: 'Evidence chain-of-custody system with hardware integration providing tamper-proof tracking and real-time location updates. RFID-based evidence management ensuring legal compliance and audit trails.',
    technologies: ['Node.js', 'RFID Integration', 'Hardware APIs'],
    github: '',
    live: '',
    caseStudy: '',
    featured: false,
    category: 'Government',
    badge: 'Government',
    badgeColor: 'blue',
    icon: Shield,
  },
  {
    title: 'Dubai Municipality Smart Parks POC',
    description: 'Multi-park IoT management system with centralized monitoring dashboard and remote sensor control capabilities via APIs. Enables real-time environmental monitoring and automated park management.',
    technologies: ['IoT', 'MQTT', 'Node.js', 'React Dashboard'],
    github: '',
    live: '',
    caseStudy: '',
    featured: false,
    category: 'IoT',
    badge: 'IoT',
    badgeColor: 'cyan',
    icon: Radio,
  },
  {
    title: 'Inffini IoT Platform',
    description: 'No-code IoT platform enabling dynamic API generation and real-time data pipelines with custom schema builder. Empowers non-technical users to create IoT integrations without coding.',
    technologies: ['Node.js', 'React', 'MongoDB', 'Real-time Data'],
    github: '',
    live: '',
    caseStudy: '',
    featured: false,
    category: 'IoT',
    badge: 'Enterprise',
    badgeColor: 'orange',
    icon: Radio,
  },
  {
    title: 'RAK Ceramics Reporting System',
    description: 'High-volume transaction reporting system processing thousands of daily transactions with automated file generation. Enterprise-grade reporting solution with real-time data processing and compliance features.',
    technologies: ['Node.js', 'PostgreSQL', 'Automated Reporting'],
    github: '',
    live: '',
    caseStudy: '',
    featured: false,
    category: 'Enterprise',
    badge: 'Enterprise',
    badgeColor: 'orange',
    icon: Briefcase,
  },
];

const categories: ProjectCategory[] = ['All', 'IoT', 'Government', 'Enterprise', 'Open Source'];

const badgeColors = {
  gold: 'from-[#F59E0B] to-[#FBBF24]',
  green: 'from-[#10B981] to-[#34D399]',
  blue: 'from-[#14B8A6] to-[#2DD4BF]',
  purple: 'from-[#06B6D4] to-[#22D3EE]',
  orange: 'from-[#F97316] to-[#FB923C]',
  cyan: 'from-[#06B6D4] to-[#22D3EE]',
};

const iconColors = {
  IoT: 'from-cyan to-cyan-light',
  Government: 'from-teal to-teal-dark',
  Enterprise: 'from-cyan to-cyan-light',
  'Open Source': 'from-emerald to-cyan',
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First item expanded by default
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  // Map project titles to case study IDs
  const projectToCaseStudyMap: Record<string, string> = {
    'NeoTAQ IoT Platform': 'neotaq-iot-platform',
    'KubeArchitect Microservices': 'kubearchitect-microservices',
    'Flowtopia Options Trading Platform': 'flowtopia-options-trading',
  };

  const handleViewCaseStudy = (projectTitle: string) => {
    const caseStudyId = projectToCaseStudyMap[projectTitle];
    const caseStudy = caseStudies.find(cs => cs.projectId === caseStudyId);
    if (caseStudy) {
      setSelectedCaseStudy(caseStudy);
      setIsCaseStudyOpen(true);
    }
  };

  // Sort projects: Featured first, then by category
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return 0;
  });

  const filteredProjects = selectedCategory === 'All' 
    ? sortedProjects 
    : sortedProjects.filter(project => project.category === selectedCategory);

  // Reset expanded index when category changes
  const handleCategoryChange = (category: ProjectCategory) => {
    setExpandedIndex(null); // Close all expanded items first
    setSelectedCategory(category);
  };

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const tabVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const accordionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section id="projects" ref={ref} className="section-spacing relative bg-slate-800/30 overflow-hidden">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-wide text-white">
            Featured Projects
          </h2>
          
          {/* Decorative Gradient Line */}
          <div 
            className="w-[100px] h-[3px] bg-gradient-to-r from-teal via-cyan to-cyan-light rounded-full mx-auto mb-4 sm:mb-6" 
            style={{ boxShadow: '0 2px 8px rgba(20, 184, 166, 0.5)' }}
          />

          {/* Subtitle */}
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12 sm:mb-16">
            A showcase of my recent work and side projects
          </p>

          {/* Filter Tabs */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap justify-center gap-3 mb-12 sm:mb-16"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                variants={tabVariants}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCategoryChange(category)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-200 select-none
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-teal to-cyan text-white font-semibold scale-105 shadow-lg'
                    : 'bg-slate-800/40 backdrop-blur-lg text-[#CBD5E1] border border-white/10 hover:bg-slate-800/60 hover:text-white hover:scale-105'
                  }
                `}
                style={{
                  boxShadow: selectedCategory === category 
                    ? '0 4px 20px rgba(20, 184, 166, 0.4), 0 0 15px rgba(6, 182, 212, 0.3)'
                    : 'none',
                  transition: 'none',
                }}
                whileHover={{ scale: selectedCategory === category ? 1.05 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Accordion Container */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <FileText className="mx-auto mb-4 text-gray-light" size={48} />
                <p className="text-gray-light text-lg mb-2">No projects found in this category</p>
                <p className="text-gray-light text-sm">Try viewing all projects</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${selectedCategory}-${filteredProjects.length}`}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                exit="hidden"
                variants={accordionVariants}
                className="space-y-4"
              >
                {filteredProjects.map((project, index) => {
                  const Icon = project.icon;
                  const isExpanded = expandedIndex === index;
                  const categoryIconColor = (project.category !== 'All' && iconColors[project.category as keyof typeof iconColors]) 
                    ? iconColors[project.category as keyof typeof iconColors] 
                    : 'from-teal to-teal-dark';

                  return (
                    <motion.article
                      key={project.title}
                      variants={accordionVariants}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      {/* Accordion Header */}
                      <motion.button
                        onClick={() => handleToggle(index)}
                        className="w-full glass rounded-xl px-6 py-5 flex items-center gap-4 border border-white/10 backdrop-blur-lg cursor-pointer select-none"
                        style={{ 
                          background: 'rgba(30, 41, 59, 0.5)',
                          transition: 'none',
                        }}
                        whileHover={{ 
                          y: -2,
                          background: 'rgba(30, 41, 59, 0.7)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        aria-expanded={isExpanded}
                        aria-controls={`project-${index}-content`}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.title} project details`}
                      >
                        {/* Project Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${categoryIconColor} flex items-center justify-center`}>
                          <Icon className="text-white" size={20} />
                        </div>

                        {/* Project Title */}
                        <h3 className="flex-1 text-left text-xl sm:text-2xl font-bold text-white">
                          {project.title}
                        </h3>

                        {/* Status Badge */}
                        {project.badge && (
                          <motion.div
                            className={`px-3 py-1 rounded-full bg-gradient-to-r ${badgeColors[project.badgeColor]} text-white text-xs font-semibold flex-shrink-0 mr-3`}
                            animate={project.isCurrent || project.isLive ? {
                              opacity: [0.9, 1, 0.9],
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {project.badge}
                          </motion.div>
                        )}

                        {/* Dropdown Arrow */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="text-[#94A3B8]" size={20} />
                        </motion.div>
                      </motion.button>

                      {/* Accordion Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            id={`project-${index}-content`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
                            className="overflow-hidden"
                            role="region"
                            aria-labelledby={`project-${index}-header`}
                          >
                            <div className="glass rounded-xl mt-2 px-6 pt-4 pb-6 border border-white/10 backdrop-blur-lg"
                              style={{ background: 'rgba(30, 41, 59, 0.5)' }}
                            >
                              {/* Border Top */}
                              <div className="border-t border-white/5 mb-6 -mx-6 px-6 pt-4" />

                              {/* Project Description */}
                              <p className="text-base text-[#CBD5E1] leading-relaxed mb-6">
                                {project.description}
                              </p>

                              {/* Tech Stack Section */}
                              <div className="mb-6">
                                <p className="text-sm uppercase tracking-wider text-[#94A3B8] mb-3">
                                  Tech Stack
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.slice(0, 8).map((tech) => (
                                    <motion.span
                                      key={tech}
                                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/50 border border-white/10 text-[#CBD5E1]"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      transition={{ duration: 0.2 }}
                                      onMouseEnter={(e) => {
                                        const target = e.currentTarget as HTMLElement;
                                        target.style.background = 'linear-gradient(135deg, rgba(20, 184, 166, 0.3), rgba(6, 182, 212, 0.2))';
                                        target.style.borderColor = 'rgba(20, 184, 166, 0.6)';
                                        target.style.color = '#FFFFFF';
                                        target.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)';
                                      }}
                                      onMouseLeave={(e) => {
                                        const target = e.currentTarget as HTMLElement;
                                        target.style.background = 'rgba(51, 65, 85, 0.5)';
                                        target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        target.style.color = '#CBD5E1';
                                        target.style.boxShadow = 'none';
                                      }}
                                    >
                                      {tech}
                                    </motion.span>
                                  ))}
                                  {project.technologies.length > 8 && (
                                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/50 border border-white/10 text-[#CBD5E1]">
                                      +{project.technologies.length - 8} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-3">
                                {project.live && (
                                  <motion.a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal to-teal-dark text-white font-medium text-sm flex items-center gap-2 select-none"
                                    style={{ transition: 'none', cursor: 'pointer' }}
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(20, 184, 166, 0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <ExternalLink size={16} />
                                    View Live
                                  </motion.a>
                                )}
                                {project.github && (
                                  <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-lg border border-white/20 text-cyan font-medium text-sm flex items-center gap-2 select-none"
                                    style={{ transition: 'none', cursor: 'pointer' }}
                                    whileHover={{ 
                                      scale: 1.05,
                                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(34, 211, 238, 0.2))',
                                      borderColor: 'rgba(6, 182, 212, 0.6)',
                                      color: '#FFFFFF',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <Github size={16} />
                                    View Code
                                  </motion.a>
                                )}
                                {projectToCaseStudyMap[project.title] && (
                                  <motion.button
                                    onClick={() => handleViewCaseStudy(project.title)}
                                    className="px-4 py-2 rounded-lg border border-white/20 text-cyan font-medium text-sm flex items-center gap-2 select-none"
                                    style={{ transition: 'none', cursor: 'pointer' }}
                                    whileHover={{ 
                                      scale: 1.05,
                                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(34, 211, 238, 0.2))',
                                      borderColor: 'rgba(6, 182, 212, 0.6)',
                                      color: '#FFFFFF',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    aria-label={`View case study for ${project.title}`}
                                  >
                                    <FileText size={16} />
                                    Case Study
                                  </motion.button>
                                )}
                                {!project.live && !project.github && !project.caseStudy && (
                                  <span className="px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-gray-light font-medium text-sm flex items-center gap-2 opacity-50">
                                    <FileText size={16} />
                                    Details Available on Request
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        isOpen={isCaseStudyOpen}
        onClose={() => setIsCaseStudyOpen(false)}
        caseStudy={selectedCaseStudy}
      />
    </section>
  );
}
