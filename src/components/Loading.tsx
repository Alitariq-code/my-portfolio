import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Simple Spinning Ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-teal"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Loading Text */}
        <motion.p
          className="mt-6 text-slate-400 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}
