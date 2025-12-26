import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, Shield, Globe, Briefcase } from 'lucide-react';

interface Client {
  name: string;
  category: string;
  icon: typeof Building2;
  description?: string;
}

const clients: Client[] = [
  {
    name: 'Energy Sector',
    category: 'Energy',
    icon: Building2,
    description: 'Industrial IoT Solutions',
  },
  {
    name: 'Government Organizations',
    category: 'Government',
    icon: Shield,
    description: 'Asset & Evidence Management',
  },
  {
    name: 'Municipal Services',
    category: 'Government',
    icon: Building2,
    description: 'Smart City IoT Systems',
  },
  {
    name: 'Financial Institutions',
    category: 'Finance',
    icon: Globe,
    description: 'Trading & Analytics Platforms',
  },
  {
    name: 'Enterprise Clients',
    category: 'Enterprise',
    icon: Briefcase,
    description: 'Business Intelligence Systems',
  },
  {
    name: 'Healthcare Sector',
    category: 'Enterprise',
    icon: Shield,
    description: 'Healthcare Management Systems',
  },
];

const categoryColors: Record<string, string> = {
  Energy: 'from-amber-500 to-orange-500',
  Government: 'from-blue-500 to-cyan-500',
  Finance: 'from-green-500 to-emerald-500',
  Enterprise: 'from-purple-500 to-pink-500',
};

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="clients" ref={ref} className="section-spacing relative bg-slate-800/30 overflow-hidden">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-wide text-white">
            Trusted by Leading Organizations
          </h2>
          
          {/* Decorative Gradient Line */}
          <div 
            className="w-[100px] h-[3px] bg-gradient-to-r from-teal via-cyan to-cyan-light rounded-full mx-auto mb-4 sm:mb-6" 
            style={{ boxShadow: '0 2px 8px rgba(20, 184, 166, 0.5)' }}
          />

          {/* Subtitle */}
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Delivering innovative solutions across multiple industries and sectors
          </p>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {clients.map((client) => {
            const Icon = client.icon;
            const gradient = categoryColors[client.category] || 'from-teal to-cyan';
            
            return (
              <motion.div
                key={client.name}
                variants={itemVariants}
                className="group relative"
              >
                <motion.div
                  className="glass rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-white/10 backdrop-blur-lg h-full min-h-[140px] transition-all duration-300"
                  style={{ background: 'rgba(30, 41, 59, 0.5)' }}
                  whileHover={{ 
                    y: -4,
                    background: 'rgba(30, 41, 59, 0.7)',
                    borderColor: 'rgba(20, 184, 166, 0.3)',
                  }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={24} />
                  </div>

                  {/* Client Name */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    {client.name}
                  </h3>

                  {/* Category Badge */}
                  <span className="text-xs text-slate-400">
                    {client.category}
                  </span>

                  {/* Description */}
                  {client.description && (
                    <p className="text-xs text-slate-500 mt-2">
                      {client.description}
                    </p>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal/0 via-teal/10 to-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

