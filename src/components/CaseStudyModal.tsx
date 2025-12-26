import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Globe, CheckCircle2 } from 'lucide-react';

interface CaseStudy {
  title: string;
  company: string;
  category: string;
  overview: string;
  challenge: string;
  solution: string[];
  technologies: string[];
  results: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  github?: string;
  live?: string;
  architecture?: string;
}

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudy: CaseStudy | null;
}

export default function CaseStudyModal({ isOpen, onClose, caseStudy }: CaseStudyModalProps) {
  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 py-5 flex items-center justify-between z-10">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 text-xs font-bold text-teal bg-teal/10 border border-teal/30 rounded-full">
                    {caseStudy.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {caseStudy.company}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {caseStudy.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close case study"
              >
                <X size={24} className="text-slate-300" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* Overview */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Overview</h3>
                <p className="text-slate-300 leading-relaxed">
                  {caseStudy.overview}
                </p>
              </section>

              {/* Challenge */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Challenge</h3>
                <p className="text-slate-300 leading-relaxed">
                  {caseStudy.challenge}
                </p>
              </section>

              {/* Solution */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Solution</h3>
                <ul className="space-y-2">
                  {caseStudy.solution.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 size={18} className="text-teal flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Technologies */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-semibold text-slate-300 bg-slate-700/50 border border-white/10 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {/* Results */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Results</h3>
                <ul className="space-y-2">
                  {caseStudy.results.map((result, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 size={18} className="text-teal flex-shrink-0 mt-0.5" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Metrics */}
              {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-3">Key Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {caseStudy.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/30 rounded-lg p-4 border border-white/10"
                      >
                        <div className="text-2xl font-bold text-teal mb-1">{metric.value}</div>
                        <div className="text-xs text-slate-400">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Architecture */}
              {caseStudy.architecture && (
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-3">Architecture</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
                    <p className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
                      {caseStudy.architecture}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-slate-800/95 via-slate-800/95 to-transparent backdrop-blur-xl px-6 sm:px-8 py-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-3">
                {caseStudy.github && (
                  <motion.a
                    href={caseStudy.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-slate-300 hover:bg-teal/20 hover:border-teal/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={18} />
                    <span className="text-sm font-medium">GitHub</span>
                  </motion.a>
                )}
                {caseStudy.live && (
                  <motion.a
                    href={caseStudy.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal to-cyan text-white hover:from-teal-dark hover:to-cyan-dark transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Globe size={18} />
                    <span className="text-sm font-medium">Live Demo</span>
                    <ExternalLink size={16} />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

