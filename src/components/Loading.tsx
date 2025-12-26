import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #14B8A6 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #06B6D4 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, #22D3EE 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #14B8A6 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(20, 184, 166, 0.1) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Simple Loading Animation */}
      <div className="flex flex-col items-center justify-center relative z-10">
        {/* Spinning Circle */}
        <motion.div
          className="relative"
          style={{
            width: '80px',
            height: '80px',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal border-r-cyan"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Middle Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-b-teal border-l-cyan"
            style={{
              padding: '12px',
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Inner Pulsing Circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '24px',
              height: '24px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.8) 0%, rgba(6, 182, 212, 0.4) 100%)',
              boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% auto',
            }}
          >
            Loading...
          </motion.h2>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          className="flex gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-teal-400"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
