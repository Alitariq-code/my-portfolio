import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, Github, CheckCircle, X, Loader2 } from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const socialLinks = [
  { 
    icon: Linkedin, 
    href: 'https://www.linkedin.com/in/software-engineerali', 
    label: 'LinkedIn',
    gradient: 'from-teal to-teal-dark',
  },
  { 
    icon: Github, 
    href: 'https://github.com/Alitariq-code', 
    label: 'GitHub',
    gradient: 'from-cyan to-gray-800',
  },
  { 
    icon: Mail, 
    href: 'mailto:alitariqcode@gmail.com', 
    label: 'Email',
    gradient: 'from-cyan-500 to-cyan-600',
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Please enter your name';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Please enter your email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return undefined;
      case 'subject':
        if (!value.trim()) return 'Please enter a subject';
        if (value.trim().length < 3) return 'Subject must be at least 3 characters';
        return undefined;
      case 'message':
        if (!value.trim()) return 'Please enter a message';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormState]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitState('loading');

    // Simulate API call (replace with actual email service integration)
    try {
      // Using mailto as fallback
      const mailtoLink = `mailto:alitariqcode@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      
      // For demo, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Open mailto link
      window.location.href = mailtoLink;
      
      setSubmitState('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
        setSubmitState('idle');
      }, 3000);
    } catch (error) {
      setSubmitState('error');
      setTimeout(() => {
        setSubmitState('idle');
      }, 3000);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: 'alitariqcode@gmail.com',
      href: 'mailto:alitariqcode@gmail.com',
      clickable: true,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+92 306 7895964',
      href: 'tel:+923067895964',
      clickable: true,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Lahore, Pakistan',
      href: '',
      clickable: false,
    },
  ];

  return (
    <section id="contact" ref={ref} className="section-spacing relative bg-slate-800/30 overflow-hidden">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-wide text-white">
            Get In Touch
          </h2>
          
          {/* Decorative Gradient Line */}
          <div 
            className="w-[100px] h-[3px] bg-gradient-to-r from-teal via-cyan to-cyan-light rounded-full mx-auto mb-4" 
            style={{ boxShadow: '0 2px 8px rgba(20, 184, 166, 0.5)' }}
          />

          {/* Subtitle 1 */}
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-2">
            Let's discuss how we can work together to bring your ideas to life
          </p>

          {/* Subtitle 2 */}
          <p className="text-base text-[#22D3EE] font-medium mb-12 sm:mb-16">
            Open to freelance projects and full-time opportunities
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%] gap-8 lg:gap-10">
          {/* Left Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div 
              className="glass rounded-2xl p-8 lg:p-10 border border-white/10 backdrop-blur-xl h-fit"
              style={{ 
                background: 'rgba(30, 41, 59, 0.6)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 20px rgba(20, 184, 166, 0.1)',
              }}
            >
              <h3 className="text-2xl font-bold text-white mb-8">
                Contact Information
              </h3>

              {/* Contact Items */}
              <div className="space-y-6 mb-8">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-4 group"
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Icon */}
                      <div 
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-teal via-cyan to-cyan-light flex items-center justify-center"
                        style={{
                          boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)',
                        }}
                      >
                        <Icon className="text-white" size={24} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm uppercase tracking-wider text-[#94A3B8] font-medium mb-1">
                          {item.label}
                        </p>
                        {item.clickable ? (
                          <a
                            href={item.href}
                            className="text-base text-[#E2E8F0] font-medium hover:text-teal hover:underline transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-base text-[#E2E8F0] font-medium">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Links Section */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-xl font-bold text-white mb-4">
                  Connect With Me
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className="w-12 h-12 rounded-lg bg-slate-700/50 border border-white/10 flex items-center justify-center select-none group"
                        style={{ transition: 'none', cursor: 'pointer' }}
                        whileHover={{ 
                          y: -4,
                          boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        aria-label={social.label}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          if (social.label === 'LinkedIn') {
                            target.style.background = 'linear-gradient(135deg, #14B8A6, #0D9488)';
                          } else if (social.label === 'GitHub') {
                            target.style.background = 'linear-gradient(135deg, #06B6D4, #4B5563)';
                          } else if (social.label === 'Email') {
                            target.style.background = 'linear-gradient(135deg, #06B6D4, #0891B2)';
                          }
                          const icon = target.querySelector('svg');
                          if (icon) {
                            icon.style.color = '#FFFFFF';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          target.style.background = 'rgba(51, 65, 85, 0.5)';
                          const icon = target.querySelector('svg');
                          if (icon) {
                            icon.style.color = '#94A3B8';
                          }
                        }}
                      >
                        <Icon 
                          className="text-[#94A3B8] transition-colors duration-300" 
                          size={24}
                        />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="glass rounded-2xl p-8 lg:p-10 border border-white/10 backdrop-blur-xl"
              style={{ 
                background: 'rgba(30, 41, 59, 0.6)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 20px rgba(20, 184, 166, 0.1)',
              }}
            >
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#E2E8F0] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 text-[#E2E8F0] placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-500 ring-4 ring-red-500/20' 
                        : 'border-white/10 focus:border-teal focus:ring-4 focus:ring-teal/20'
                    }`}
                    placeholder="Your Name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        id="name-error"
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-400 mt-2"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#E2E8F0] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 text-[#E2E8F0] placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 ring-4 ring-red-500/20' 
                        : 'border-white/10 focus:border-teal focus:ring-4 focus:ring-teal/20'
                    }`}
                    placeholder="your.email@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        id="email-error"
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-400 mt-2"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#E2E8F0] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 text-[#E2E8F0] placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                      errors.subject 
                        ? 'border-red-500 ring-4 ring-red-500/20' 
                        : 'border-white/10 focus:border-teal focus:ring-4 focus:ring-teal/20'
                    }`}
                    placeholder="Project Inquiry"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  />
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.p
                        id="subject-error"
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-400 mt-2"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#E2E8F0] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 text-[#E2E8F0] placeholder-gray-500 focus:outline-none resize-y min-h-[150px] transition-all duration-200 ${
                      errors.message 
                        ? 'border-red-500 ring-4 ring-red-500/20' 
                        : 'border-white/10 focus:border-teal focus:ring-4 focus:ring-teal/20'
                    }`}
                    placeholder="Tell me about your project..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        id="message-error"
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-400 mt-2"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className={`w-full py-4 rounded-lg font-semibold text-base flex items-center justify-center gap-2 select-none ${
                    submitState === 'success'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : submitState === 'error'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : 'bg-gradient-to-r from-teal to-cyan text-white'
                  }`}
                  style={{ 
                    transition: 'none',
                    cursor: submitState === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: submitState === 'loading' ? 0.7 : 1,
                    boxShadow: submitState === 'idle' ? '0 10px 40px rgba(20, 184, 166, 0.4)' : 'none',
                  }}
                  whileHover={submitState === 'idle' ? { 
                    y: -2,
                    scale: 1.01,
                    boxShadow: '0 15px 50px rgba(20, 184, 166, 0.5)',
                  } : {}}
                  whileTap={submitState === 'idle' ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.3 }}
                  aria-label={submitState === 'loading' ? 'Sending message' : submitState === 'success' ? 'Message sent successfully' : 'Submit contact form'}
                >
                  {submitState === 'loading' && (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Sending...</span>
                    </>
                  )}
                  {submitState === 'success' && (
                    <>
                      <CheckCircle size={20} />
                      <span>Message Sent!</span>
                    </>
                  )}
                  {submitState === 'error' && (
                    <>
                      <X size={20} />
                      <span>Failed to Send</span>
                    </>
                  )}
                  {submitState === 'idle' && (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
