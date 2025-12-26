import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  SiReact,
  SiNodedotjs,
  SiNestjs,
  SiTypescript,
  SiPython,
  SiMongodb,
  SiPostgresql,
  SiAmazon as SiAws,
  SiDocker,
  SiKubernetes,
  SiSocketdotio,
  SiGrafana,
} from 'react-icons/si';

interface ProfileImageProps {
  size?: 'large' | 'medium' | 'small';
  showParticles?: boolean;
  className?: string;
}

interface TechIcon {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  size: 'small' | 'large';
  angle: number;
  tooltipColor: string;
}

// Tech icons configuration
const techIcons: TechIcon[] = [
  { name: 'React', icon: SiReact, size: 'large', angle: 0, tooltipColor: '#61DAFB' },
  { name: 'Node.js', icon: SiNodedotjs, size: 'large', angle: 51, tooltipColor: '#339933' },
  { name: 'NestJS', icon: SiNestjs, size: 'large', angle: 102, tooltipColor: '#E0234E' },
  { name: 'TypeScript', icon: SiTypescript, size: 'large', angle: 153, tooltipColor: '#3178C6' },
  { name: 'Python', icon: SiPython, size: 'large', angle: 204, tooltipColor: '#3776AB' },
  { name: 'MongoDB', icon: SiMongodb, size: 'large', angle: 255, tooltipColor: '#47A248' },
  { name: 'PostgreSQL', icon: SiPostgresql, size: 'large', angle: 306, tooltipColor: '#336791' },
  { name: 'AWS', icon: SiAws, size: 'small', angle: 0, tooltipColor: '#FF9900' },
  { name: 'Docker', icon: SiDocker, size: 'small', angle: 60, tooltipColor: '#2496ED' },
  { name: 'Kubernetes', icon: SiKubernetes, size: 'small', angle: 120, tooltipColor: '#326CE5' },
  { name: 'Socket.IO', icon: SiSocketdotio, size: 'small', angle: 180, tooltipColor: '#010101' },
  { name: 'Grafana', icon: SiGrafana, size: 'small', angle: 240, tooltipColor: '#F46800' },
];

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
      delay: 0.5,
    },
  },
};

const sizeClasses = {
  large: 'w-[300px] h-[300px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]',
  medium: 'w-[200px] h-[200px]',
  small: 'w-[150px] h-[150px]',
};

const borderSizes = {
  large: 'p-[8px]',
  medium: 'p-[2px]',
  small: 'p-[4px]',
};

export default function ProfileImage({ 
  size = 'large', 
  showParticles = true,
  className = '' 
}: ProfileImageProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive dimensions for orbiting icons container
  const getContainerSize = () => {
    if (!windowSize.width) return 400;
    if (windowSize.width >= 1280) return 500;
    if (windowSize.width >= 1024) return 450;
    if (windowSize.width >= 768) return 400;
    if (windowSize.width >= 640) return 350;
    return Math.min(320, windowSize.width - 40);
  };

  // Only show orbiting icons for large size
  const showOrbitingIcons = showParticles && size === 'large';
  const containerSize = showOrbitingIcons ? getContainerSize() : (size === 'medium' ? 200 : 150);
  const center = containerSize / 2;
  const smallRadius = containerSize * 0.33;
  const largeRadius = containerSize * 0.5;
  const smallIconSize = Math.max(24, containerSize * 0.08);
  const largeIconSize = Math.max(32, containerSize * 0.14);

  const renderTechIcons = (sizeFilter: 'small' | 'large', radius: number, duration: number) =>
    techIcons
      .filter((icon) => icon.size === sizeFilter)
      .map((icon, idx) => {
        const isHovered = hoveredIcon === `${sizeFilter}-${idx}`;
        const iconSize = sizeFilter === 'small' ? smallIconSize : largeIconSize;
        const IconComponent = icon.icon;
        const delay = idx * 0.1; // Stagger animation start

        return (
          <div
            key={`${sizeFilter}-${idx}`}
            className="icon-wrapper absolute"
            style={{
              left: `calc(50% - ${iconSize / 2}px)`,
              top: `calc(50% - ${iconSize / 2}px)`,
              transform: `rotate(${icon.angle}deg) translateX(${radius}px) rotate(-${icon.angle}deg)`,
              animation: `orbit-rotate ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              '--current-angle': `${icon.angle}deg`,
              '--current-radius': `${radius}px`,
              cursor: 'pointer',
            } as React.CSSProperties & { '--current-angle': string; '--current-radius': string }}
            onMouseEnter={() => setHoveredIcon(`${sizeFilter}-${idx}`)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            {/* Glowing background circle */}
            <div
              className="icon-glow absolute rounded-full"
              style={{
                width: `${iconSize * 1.8}px`,
                height: `${iconSize * 1.8}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${icon.tooltipColor}40 0%, ${icon.tooltipColor}10 50%, transparent 100%)`,
                filter: `blur(${isHovered ? '12px' : '8px'})`,
                opacity: isHovered ? 1 : 0.6,
                animation: 'icon-pulse 3s ease-in-out infinite',
                animationDelay: `${delay * 2}s`,
                zIndex: -1,
              }}
            />
            
            {/* Icon container with enhanced styling */}
            <div 
              style={{ 
                width: `${iconSize * 1.4}px`, 
                height: `${iconSize * 1.4}px`, 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Outer glow ring */}
              <div
                className="icon-ring absolute rounded-full border-2"
                style={{
                  width: `${iconSize * 1.4}px`,
                  height: `${iconSize * 1.4}px`,
                  borderColor: isHovered ? `${icon.tooltipColor}80` : `${icon.tooltipColor}30`,
                  boxShadow: isHovered 
                    ? `0 0 20px ${icon.tooltipColor}60, 0 0 40px ${icon.tooltipColor}40, inset 0 0 20px ${icon.tooltipColor}20`
                    : `0 0 10px ${icon.tooltipColor}30`,
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  animation: 'ring-rotate 4s linear infinite',
                  animationDelay: `${delay}s`,
                }}
              />
              
              {/* Icon background circle */}
              <div
                className="icon-bg absolute rounded-full"
                style={{
                  width: `${iconSize * 1.2}px`,
                  height: `${iconSize * 1.2}px`,
                  background: isHovered
                    ? `linear-gradient(135deg, ${icon.tooltipColor}30, ${icon.tooltipColor}10)`
                    : `linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isHovered ? `${icon.tooltipColor}60` : 'rgba(148, 163, 184, 0.2)'}`,
                  boxShadow: isHovered
                    ? `0 8px 32px ${icon.tooltipColor}50, inset 0 2px 10px ${icon.tooltipColor}20`
                    : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 4px rgba(255, 255, 255, 0.1)',
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Icon */}
              <div
                className="relative z-10 transition-all duration-300"
                style={{ 
                  color: isHovered ? icon.tooltipColor : '#CBD5E1',
                  filter: isHovered 
                    ? `drop-shadow(0 0 12px ${icon.tooltipColor}) drop-shadow(0 0 24px ${icon.tooltipColor}80) brightness(1.2)`
                    : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4)) brightness(0.9)',
                  transform: isHovered ? 'scale(1.25) rotate(8deg)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <IconComponent
                  size={iconSize}
                  className="transition-all duration-300"
                />
              </div>
              
              {/* Sparkle effect on hover */}
              {isHovered && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`sparkle-${i}`}
                      className="sparkle absolute"
                      style={{
                        width: '4px',
                        height: '4px',
                        background: icon.tooltipColor,
                        borderRadius: '50%',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(${iconSize * 0.8}px)`,
                        boxShadow: `0 0 10px ${icon.tooltipColor}, 0 0 20px ${icon.tooltipColor}60`,
                        animation: 'sparkle-pulse 1.5s ease-in-out infinite',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="tech-tooltip"
                  style={{ backgroundColor: icon.tooltipColor }}
                >
                  {icon.name}
                  <div
                    className="tech-tooltip-arrow"
                    style={{ borderTopColor: icon.tooltipColor }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      });

  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width: showOrbitingIcons ? `${containerSize}px` : 'auto', 
        height: showOrbitingIcons ? `${containerSize}px` : 'auto', 
        minWidth: showOrbitingIcons ? '280px' : 'auto', 
        minHeight: showOrbitingIcons ? '280px' : 'auto',
        margin: '0 auto'
      }}
    >
      {/* Background Accent Circle */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-teal via-cyan to-cyan-light rounded-full blur-[100px] opacity-30 ${
          size === 'large' ? 'w-[400px] h-[400px] -top-[50px] -left-[50px]' :
          size === 'medium' ? 'w-[300px] h-[300px] -top-[25px] -left-[25px]' :
          'w-[200px] h-[200px] -top-[25px] -left-[25px]'
        }`}
        style={{ zIndex: 0 }}
      />

      {/* SVG Background Circles with Animated Gradients */}
      {showOrbitingIcons && (
        <svg
          className="absolute top-0 left-0 orbit-circles"
          width={containerSize}
          height={containerSize}
          style={{ zIndex: 1 }}
        >
          <defs>
            {/* Animated gradient for small circle */}
            <linearGradient id="smallOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4">
                <animate attributeName="stop-opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.4">
                <animate attributeName="stop-opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            
            {/* Animated gradient for large circle */}
            <linearGradient id="largeOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.4">
                <animate attributeName="stop-opacity" values="0.4;0.6;0.4" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Small orbit circle */}
          <circle
            cx={center}
            cy={center}
            r={smallRadius}
            stroke="url(#smallOrbitGradient)"
            strokeWidth="2"
            strokeDasharray="8 4"
            fill="none"
            filter="url(#glow)"
            style={{
              animation: 'orbit-dash 20s linear infinite',
            }}
          />
          
          {/* Large orbit circle */}
          <circle
            cx={center}
            cy={center}
            r={largeRadius}
            stroke="url(#largeOrbitGradient)"
            strokeWidth="3"
            strokeDasharray="12 6"
            fill="none"
            filter="url(#glow)"
            style={{
              animation: 'orbit-dash 30s linear infinite reverse',
            }}
          />
        </svg>
      )}

      {/* Small icons layer */}
      {showOrbitingIcons && (
        <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 2 }}>
          {renderTechIcons('small', smallRadius, 6)}
        </div>
      )}

      {/* Main Profile Image Container - Perfectly Centered */}
      {showOrbitingIcons ? (
        <div
          className="relative z-10 rounded-full overflow-hidden"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
              <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="w-full h-full relative"
          >
            {/* Image wrapper */}
            <div className="w-full h-full relative">
              <img
                src="/no-backgroud.png"
                alt="Ali Tariq - Senior Full Stack Software Engineer"
                className="absolute top-[58%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-2xl"
                style={{
                  height: `${containerSize * 1.1}px`,
                  width: 'auto',
                  maxWidth: 'none',
                  boxShadow: '0 0 40px rgba(20, 184, 166, 0.3)',
                  transition: 'none',
                  backgroundColor: 'transparent',
                }}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </div>
      ) : (
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto"
      >
          {/* Static Gradient Border */}
        <div
          className={`${borderSizes[size]} rounded-full bg-gradient-to-r from-teal via-cyan to-cyan-light`}
          style={{
            background: size === 'medium' 
              ? 'linear-gradient(135deg, #14B8A6, #06B6D4, #22D3EE)'
              : 'linear-gradient(135deg, #14B8A6, #06B6D4, #22D3EE, #14B8A6)',
            backgroundSize: size === 'medium' ? '100% 100%' : '200% 200%',
          }}
          >
            {/* Inner Glass Frame */}
            <div className="p-1 rounded-full bg-slate-800/60 backdrop-blur-lg">
            {/* Actual Image */}
            <img
                src="/no-backgroud.png"
              alt="Ali Tariq - Senior Full Stack Software Engineer"
              className={`${sizeClasses[size]} rounded-full object-cover shadow-2xl`}
              style={{
                boxShadow: size === 'medium'
                  ? '0 4px 20px rgba(20, 184, 166, 0.2)'
                  : '0 0 40px rgba(20, 184, 166, 0.3)',
                transition: 'none',
                  backgroundColor: 'transparent',
              }}
              loading={size === 'large' ? 'eager' : 'lazy'}
              fetchPriority={size === 'large' ? 'high' : 'auto'}
            />
          </div>
        </div>
      </motion.div>
      )}

      {/* Large icons layer */}
      {showOrbitingIcons && (
        <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 20 }}>
          {renderTechIcons('large', largeRadius, 12)}
        </div>
      )}
    </div>
  );
}
