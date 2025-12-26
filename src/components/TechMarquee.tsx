import { motion } from 'framer-motion';
import { 
  SiReact, 
  SiNodedotjs, 
  SiAmazon, 
  SiDocker, 
  SiKubernetes, 
  SiMongodb, 
  SiTypescript, 
  SiPython 
} from 'react-icons/si';

const techStack = [
  { name: 'React', icon: SiReact },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'AWS', icon: SiAmazon },
  { name: 'Docker', icon: SiDocker },
  { name: 'Kubernetes', icon: SiKubernetes },
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'Python', icon: SiPython },
];

export default function TechMarquee() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden py-8 bg-slate-900/90 backdrop-blur-sm border-t border-white/10">
      <motion.div
        className="flex gap-12 items-center"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
      >
        {[...techStack, ...techStack].map((tech, index) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={`${tech.name}-${index}`}
              className="flex items-center gap-3 text-slate-300/40 hover:text-teal transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative group">
                <Icon size={40} className="group-hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.6)] transition-all" />
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{tech.name}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
