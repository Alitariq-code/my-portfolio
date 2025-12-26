import { motion } from 'framer-motion';
import { Heart, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/software-engineerali', 
      label: 'LinkedIn',
      color: 'hover:text-teal',
    },
    { 
      icon: Github, 
      href: 'https://github.com/Alitariq-code', 
      label: 'GitHub',
      color: 'hover:text-cyan',
    },
    { 
      icon: Mail, 
      href: 'mailto:alitariqcode@gmail.com', 
      label: 'Email',
      color: 'hover:text-teal',
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-slate-800/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Ali Tariq</h3>
            <p className="text-slate-400 text-sm mb-4">
              Full Stack Developer specializing in IoT platforms & enterprise solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-slate-400 ${link.color} transition-colors`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-slate-400 hover:text-teal transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="mailto:alitariqcode@gmail.com" className="hover:text-teal transition-colors">
                  alitariqcode@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/software-engineerali" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors"
                >
                  LinkedIn Profile
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Alitariq-code" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors"
                >
                  GitHub Profile
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            © {currentYear} Ali Tariq. All rights reserved.
          </motion.p>
          <motion.p
            className="text-slate-400 text-sm flex items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Made with{' '}
            <motion.span
              className="mx-1 text-teal"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              <Heart size={16} fill="currentColor" />
            </motion.span>{' '}
            using React & Vite
          </motion.p>
        </div>
      </div>

    </footer>
  );
}
