import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Calendar, Briefcase } from 'lucide-react';
import {
  SiReact,
  SiNodedotjs,
  SiNestjs,
  SiMongodb,
  SiPostgresql,
  SiAmazon as SiAws,
  SiDocker,
  SiSocketdotio,
  SiGrafana,
  SiPython,
  SiDjango,
  SiFlask,
  SiRedis,
  SiKubernetes,
  SiRedux,
  SiInfluxdb,
  SiSqlite,
  SiNginx,
} from 'react-icons/si';

interface Experience {
  company: string;
  role: string;
  subtitle?: string;
  period: string;
  location: string;
  achievements: string[];
  technologies: string[];
  logoColor: string;
  isCurrent?: boolean;
}

const experiences: Experience[] = [
  {
    company: 'Green Fuel Energy',
    role: 'Senior Full Stack Developer & IoT Platform Architect',
    subtitle: 'Platform Architect & Team Lead - NeoTAQ Industrial IoT Ecosystem',
    period: 'May 2025 – Present',
    location: 'Lahore, Pakistan',
    logoColor: '#10B981',
    isCurrent: true,
    achievements: [
      'Architected and led full-stack development of NeoTAQ industrial IoT platform, serving 15+ enterprise clients with real-time energy management',
      'Developed NeoLog universal datalogger handling multi-protocol industrial communications (Modbus, OPC UA) for real-time data collection',
      'Built NeoSphere cloud-based SaaS analytics platform with custom KPI engine, supporting 1000+ concurrent connections and 99.9% uptime',
    ],
    technologies: ['React.js', 'Redux Toolkit', 'Socket.IO', 'Node.js', 'NestJS', 'Python', 'NATS', 'InfluxDB', 'SQLite', 'PostgreSQL', 'Modbus', 'OPC UA', 'Linux', 'Docker', 'Kubernetes', 'Grafana', 'Nginx', 'AWS', 'Edge Computing', 'Microservices', 'SaaS'],
  },
  {
    company: 'Innovent Tech Solutions',
    role: 'Full Stack Developer',
    period: 'Feb 2024 – May 2025',
    location: 'Lahore, Pakistan',
    logoColor: '#3B82F6',
    achievements: [
      'Led development for Gulf government clients including Abu Dhabi Civil Defence and Saudi MOI',
      'Built dynamic schema-driven IoT platform (Inffini) with no-code API generation',
      'Supervised and mentored team of 4 engineers across cloud deployments',
    ],
    technologies: ['Node.js', 'React', 'MongoDB', 'IoT', 'AWS', 'Microservices'],
  },
  {
    company: 'EnlivenAi (Pvt) Ltd',
    role: 'Full Stack Developer | Cloud Engineer',
    period: 'May 2022 – Feb 2024',
    location: 'Bahawalpur, Pakistan',
    logoColor: '#8B5CF6',
    achievements: [
      'Built ShotPulse real-time analytics app with ML model integration',
      'Optimized backend performance by 60% through caching and query optimization',
      'Managed AWS infrastructure with auto-scaling, CI/CD, and monitoring',
    ],
    technologies: ['React', 'Django', 'Flask', 'AWS', 'PostgreSQL', 'ML APIs'],
  },
  {
    company: 'Digitalux',
    role: 'Backend Developer (Remote)',
    period: 'Jan 2024 – April 2024',
    location: 'Lahore, Pakistan',
    logoColor: '#06B6D4',
    achievements: [
      'Implemented real-time stock tracking for 5,000+ concurrent users with Socket.IO',
      'Improved CRM query performance by 70% through database optimization',
      'Created complex MongoDB aggregations for millisecond-latency analytics',
    ],
    technologies: ['Node.js', 'Socket.IO', 'MongoDB', 'Express.js'],
  },
  {
    company: 'Enigmatix (Pvt) Ltd',
    role: 'MERN Stack Developer',
    period: 'Dec 2021 – Dec 2022',
    location: 'Bahawalpur, Pakistan',
    logoColor: '#F59E0B',
    achievements: [
      'Developed responsive React.js interfaces increasing user engagement by 35%',
      'Achieved 95% sprint completion rate in Agile environment',
      'Collaborated with UI/UX teams for pixel-perfect implementations',
    ],
    technologies: ['React', 'Redux', 'Node.js', 'MongoDB', 'Express.js'],
  },
];

const techIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'React': SiReact,
  'React.js': SiReact,
  'Node.js': SiNodedotjs,
  'NestJS': SiNestjs,
  'MongoDB': SiMongodb,
  'PostgreSQL': SiPostgresql,
  'AWS': SiAws,
  'Docker': SiDocker,
  'Socket.IO': SiSocketdotio,
  'Grafana': SiGrafana,
  'Python': SiPython,
  'Django': SiDjango,
  'Flask': SiFlask,
  'Redis': SiRedis,
  'Kubernetes': SiKubernetes,
  'Redux': SiRedux,
  'Redux Toolkit': SiRedux,
  'InfluxDB': SiInfluxdb,
  'SQLite': SiSqlite,
  'Nginx': SiNginx,
};

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

const cardVariants = {
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

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <section id="experience" ref={ref} className="relative bg-slate-800/30 py-16 lg:py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-wide text-white">
            Work Experience
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-4">5+ Years Building Enterprise Solutions</p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal via-cyan to-cyan-light rounded-full mx-auto" />
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line - Desktop Only */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal/20 via-cyan/20 to-transparent" />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8 md:space-y-10"
          >
            {experiences.map((exp) => {
              const initials = getCompanyInitials(exp.company);

              return (
                <motion.article
                  key={exp.company}
                  variants={cardVariants}
                  className="relative md:pl-20"
                >
                  {/* Timeline Dot - Desktop Only */}
                  <div className="hidden md:flex absolute left-0 top-6 items-center justify-center">
                    <div 
                      className="w-4 h-4 rounded-full border-2 relative z-10"
                      style={{
                        backgroundColor: exp.isCurrent ? exp.logoColor : 'rgba(30, 41, 59, 0.8)',
                        borderColor: exp.logoColor,
                        boxShadow: `0 0 0 4px rgba(15, 23, 42, 0.8), 0 0 20px ${exp.logoColor}40`,
                      }}
                    >
                      {exp.isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: exp.logoColor }}
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Experience Card */}
                  <motion.div
                    className="glass rounded-xl p-6 sm:p-8 relative overflow-hidden group"
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: `1px solid ${exp.isCurrent ? `${exp.logoColor}40` : 'rgba(255, 255, 255, 0.1)'}`,
                      boxShadow: exp.isCurrent
                        ? `0 8px 32px ${exp.logoColor}20, 0 0 0 1px ${exp.logoColor}20`
                        : '0 4px 16px rgba(0, 0, 0, 0.2)',
                    }}
                    whileHover={{ 
                      y: -4,
                      boxShadow: `0 12px 40px ${exp.logoColor}30, 0 0 0 1px ${exp.logoColor}30`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Left Border Accent */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{ backgroundColor: exp.logoColor }}
                    />

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Company Logo */}
                        <div
                          className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${exp.logoColor}20, ${exp.logoColor}10)`,
                            border: `2px solid ${exp.logoColor}40`,
                        }}
                      >
                        {initials}
                        </div>

                      {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                              {exp.company}
                            </h3>
                          <p className="text-base sm:text-lg font-semibold text-slate-300 mb-1">
                              {exp.role}
                            </p>
                            {exp.subtitle && (
                            <p className="text-sm text-slate-400 italic mb-2">
                                {exp.subtitle}
                              </p>
                            )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              <span>{exp.period}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} />
                              <span>{exp.location}</span>
                          </div>
                              {exp.isCurrent && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/20 border border-emerald/40">
                                <motion.div
                                  className="w-1.5 h-1.5 rounded-full bg-emerald"
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-xs font-medium text-emerald">Current</span>
                              </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-xs uppercase tracking-wider text-teal font-semibold mb-3 flex items-center gap-2">
                        <Briefcase size={14} />
                          Key Achievements
                        </h4>
                      <ul className="space-y-2.5">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                            <div 
                              className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                              style={{ backgroundColor: exp.logoColor }}
                            />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => {
                          const TechIcon = techIcons[tech];
                          return (
                            <motion.div
                              key={tech}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5 border border-white/10"
                              style={{
                                background: 'rgba(51, 65, 85, 0.4)',
                              }}
                              whileHover={{ 
                                scale: 1.05,
                                background: `linear-gradient(135deg, ${exp.logoColor}20, ${exp.logoColor}10)`,
                                borderColor: `${exp.logoColor}40`,
                                color: '#FFFFFF',
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {TechIcon && (
                                <TechIcon size={14} className="flex-shrink-0" />
                              )}
                              <span className="whitespace-nowrap">{tech}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
