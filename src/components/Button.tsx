import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  href,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy';
  
  const variants = {
    primary: 'bg-gradient-to-r from-teal to-cyan text-white hover:shadow-glow-blue hover:scale-105 active:scale-95',
    secondary: 'bg-gradient-to-r from-cyan to-cyan-light text-white hover:shadow-glow-cyan hover:scale-105 active:scale-95',
    outline: 'border-2 border-teal text-teal hover:bg-teal/10 hover:border-teal-light transition-all duration-300 hover:scale-105 active:scale-95',
  };

  const buttonContent = (
    <motion.button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant !== 'outline' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0"
          whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variants[variant]} ${className} inline-block text-center`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        {variant !== 'outline' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0"
            whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.a>
    );
  }

  return buttonContent;
}
