import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

interface SkillPillProps {
  skill: string;
  level: 'primary' | 'strong' | 'supporting';
  categoryColor: string;
  categoryHoverColor: string;
  glowColor: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  isFeatured?: boolean;
  experience?: string;
  projects?: string[];
  index: number;
}

export default function SkillPill({
  skill,
  level,
  categoryColor,
  categoryHoverColor,
  glowColor,
  icon: Icon,
  isFeatured = false,
  experience,
  projects = [],
  index,
}: SkillPillProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sizeClasses = {
    primary: 'px-5 py-2.5 text-base font-bold',
    strong: 'px-4 py-2 text-sm font-medium',
    supporting: 'px-3 py-1.5 text-xs font-normal',
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Clear any pending timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    
    setIsHovered(true);
    setShowTooltip(true);
    
    // Create particles
    const newParticles = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);
    
    // Remove particles after animation
    setTimeout(() => setParticles([]), 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Hide tooltip immediately
    setShowTooltip(false);
    // Clear any pending timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.02,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ 
        scale: 1.08,
        rotate: isHovered ? 1.5 : 0,
        zIndex: 10,
      }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {/* Particles on hover */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              background: categoryColor,
              boxShadow: `0 0 8px ${glowColor}`,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0.8,
              scale: 0,
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0.8, 0],
              scale: [0, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Pill */}
      <div
        className={`
          ${sizeClasses[level]}
          rounded-full cursor-pointer transition-all duration-300
          flex items-center gap-2 relative overflow-hidden
        `}
        style={{
          background: isHovered
            ? `linear-gradient(135deg, ${categoryColor}, ${categoryHoverColor})`
            : level === 'primary'
            ? `linear-gradient(135deg, ${categoryColor}40, ${categoryHoverColor}20)`
            : 'rgba(30, 41, 59, 0.6)',
          border: `1px solid ${isHovered ? categoryColor : `${categoryColor}40`}`,
          color: isHovered ? '#FFFFFF' : level === 'primary' ? '#E2E8F0' : '#94A3B8',
          boxShadow: isHovered
            ? `0 8px 30px ${glowColor}, 0 0 20px ${glowColor}40`
            : level === 'primary'
            ? `0 4px 15px ${glowColor}30`
            : 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Icon */}
        {Icon && (
          <div
            className="opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            style={{
              color: isHovered ? '#FFFFFF' : categoryColor,
            }}
          >
            <Icon
              size={level === 'primary' ? 18 : level === 'strong' ? 16 : 14}
            />
          </div>
        )}

        {/* Skill Name */}
        <span>{skill}</span>

        {/* Featured Badge */}
        {isFeatured && (
          <Star
            size={12}
            className="text-yellow-400 fill-yellow-400"
            style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))' }}
          />
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (experience || projects.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="glass rounded-xl p-4 min-w-[200px] border backdrop-blur-lg"
              style={{
                borderColor: `${categoryColor}50`,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${glowColor}40`,
              }}
            >
              {/* Arrow */}
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid ${categoryColor}50`,
                }}
              />

              <div className="space-y-2">
                <div className="font-bold text-white text-base">{skill}</div>
                {experience && (
                  <div className="text-sm text-gray-light">{experience}</div>
                )}
                {projects.length > 0 && (
                  <div className="text-xs text-gray-light">
                    <span className="font-medium">Projects: </span>
                    {projects.slice(0, 3).join(', ')}
                    {projects.length > 3 && ` +${projects.length - 3} more`}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

