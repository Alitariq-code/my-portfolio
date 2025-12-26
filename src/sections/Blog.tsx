import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPosts, getBlogPost, type BlogPost } from '../utils/blogLoader';

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [blogPosts] = useState(() => getBlogPosts());

  // Load post content when selected
  useEffect(() => {
    if (selectedPostId) {
      setLoadingPost(true);
      getBlogPost(selectedPostId)
        .then((post) => {
          setSelectedPost(post);
          setLoadingPost(false);
        })
        .catch((error) => {
          console.error('Error loading blog post:', error);
          setLoadingPost(false);
        });
    } else {
      setSelectedPost(null);
    }
  }, [selectedPostId]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section id="blog" ref={ref} className="relative bg-slate-800/30 py-16 lg:py-20 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-teal/20 to-cyan/20 rounded-full blur-[120px] opacity-30 -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 text-sm font-semibold text-teal bg-gradient-to-r from-teal/10 to-cyan/10 border border-teal/30 rounded-full mb-4 shadow-sm"
          >
            Technical Insights
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
            Technical <span className="bg-gradient-to-r from-teal via-cyan to-teal bg-clip-text text-transparent">Blog</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Insights on full stack development, IoT platforms, backend optimization, and enterprise solutions
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 rounded-full mx-auto shadow-lg" />
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Featured Articles</h3>
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                <span>Latest insights</span>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => {
                const Icon = post.icon;
                return (
                  <motion.article
                    key={post.id}
                    variants={cardVariants}
                    className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-teal/30 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedPostId(post.id)}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    {/* Gradient Background Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Top Gradient Accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${post.gradient} rounded-t-2xl`} />
                    
                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${post.gradient} opacity-5 rounded-bl-full`} />
                    
                    {/* Icon */}
                    <div className={`relative inline-flex p-4 rounded-xl bg-gradient-to-r ${post.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/20`}>
                      <Icon className="text-white drop-shadow-sm" size={28} />
                    </div>

                    {/* Category Badge */}
                    <span className="inline-block px-4 py-1.5 text-xs font-bold text-teal bg-gradient-to-r from-teal/10 to-cyan/10 border border-teal/30 rounded-full mb-5 shadow-sm">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-teal transition-colors leading-tight">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-300 text-base mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-sm text-slate-400 mb-5 pb-5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-teal-500" />
                        <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-cyan-500" />
                        <span className="font-medium">{post.readTime}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-700/50 border border-white/10 rounded-lg hover:bg-teal/20 hover:border-teal/30 hover:text-teal transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-teal font-bold text-sm group-hover:text-teal-light bg-gradient-to-r from-teal/10 to-cyan/10 px-4 py-2 rounded-lg border border-teal/30 w-fit">
                      <span>Read Full Article</span>
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">All Articles</h3>
            <span className="text-sm text-slate-400 hidden md:block">{regularPosts.length} articles</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => {
              const Icon = post.icon;
              return (
                <motion.article
                  key={post.id}
                  variants={cardVariants}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-white/10 hover:border-teal/30 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPostId(post.id)}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Top Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${post.gradient} rounded-t-xl`} />
                  
                  {/* Icon */}
                  <div className={`relative inline-flex p-3 rounded-lg bg-gradient-to-r ${post.gradient} mb-5 shadow-md group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20`}>
                    <Icon className="text-white drop-shadow-sm" size={22} />
                  </div>

                  {/* Category */}
                  <span className="inline-block px-3 py-1 text-xs font-bold text-teal bg-gradient-to-r from-teal/10 to-cyan/10 border border-teal/30 rounded-full mb-4 shadow-sm">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-teal-500" />
                      <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-cyan-500" />
                      <span className="font-medium">{post.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium text-slate-300 bg-slate-700/50 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="px-2 py-0.5 text-xs font-medium text-slate-500">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center text-teal font-semibold text-sm group-hover:text-teal-light bg-gradient-to-r from-teal/10 to-cyan/10 px-3 py-1.5 rounded-lg border border-teal/30 w-fit">
                    <span>Read Article</span>
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {(selectedPostId || selectedPost) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => {
              setSelectedPostId(null);
              setSelectedPost(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            >
              {/* Header */}
              {selectedPost && (
                <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 py-5 flex items-center justify-between z-10">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 text-xs font-bold text-teal bg-teal/10 border border-teal/30 rounded-full">
                        {selectedPost.category}
                      </span>
                      <span className="text-xs text-slate-400">{selectedPost.readTime}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{selectedPost.title}</h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPostId(null);
                      setSelectedPost(null);
                    }}
                    className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X size={24} className="text-slate-300" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {loadingPost ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                  </div>
                ) : selectedPost ? (
                  <div className="prose prose-slate prose-lg max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-bold text-white mt-8 mb-6 pb-3 border-b border-white/20">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-3xl font-bold text-white mt-10 mb-4 pt-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-2xl font-bold text-white mt-8 mb-3">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-xl font-semibold text-white mt-6 mb-2">
                            {children}
                          </h4>
                        ),
                        p: ({ children }) => (
                          <p className="mb-6 text-slate-300 leading-relaxed text-base">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-6 ml-6 list-disc space-y-2 text-slate-300">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-6 ml-6 list-decimal space-y-2 text-slate-300">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed">{children}</li>
                        ),
                        code: ({ node, children, className }: any) => {
                          const inline = !node || (node as any).tagName !== 'pre';
                          if (inline) {
                            return (
                              <code className="px-1.5 py-0.5 bg-slate-700/50 text-teal-300 rounded text-sm font-mono border border-white/10">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code className={`block p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm font-mono border border-white/10 ${className || ''}`}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="mb-6 rounded-lg overflow-hidden">
                            {children}
                          </pre>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-teal pl-4 my-6 italic text-slate-300 bg-teal/10 py-2 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6">
                            <table className="min-w-full border-collapse border border-slate-300">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-slate-700/50">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="border border-white/10 px-4 py-2 text-left font-semibold text-white">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-white/10 px-4 py-2 text-slate-300">
                            {children}
                          </td>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal hover:text-teal-light underline font-medium"
                          >
                            {children}
                          </a>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-white">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-slate-300">{children}</em>
                        ),
                        hr: () => (
                          <hr className="my-8 border-t border-white/10" />
                        ),
                      }}
                    >
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              {selectedPost && (
                <div className="sticky bottom-0 bg-gradient-to-t from-slate-800/95 via-slate-800/95 to-transparent backdrop-blur-xl px-6 sm:px-8 py-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-semibold text-slate-300 bg-slate-700/50 border border-white/10 rounded-lg hover:bg-teal/20 hover:border-teal/30 hover:text-teal transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
