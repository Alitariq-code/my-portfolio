                                                                                    import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, Linkedin, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  relationship: string;
  date: string;
  highlight?: boolean;
}

const testimonials: Testimonial[] = [
  {
    name: 'Anjum Zaki',
    role: 'Lead Solutions Architect',
    company: 'FinTech | RFID & IoT Solutions Expert',
    text: 'I had the pleasure of working with Ali Tariq as his direct supervisor for over a year. What impressed me most was his remarkable versatility and willingness to step outside his comfort zone. Whether I assigned him DevOps tasks, IoT integrations, or full stack development, Ali would dive in with enthusiasm. He\'s reliable, communicates well, and actively looks for ways to contribute to project success.',
    relationship: 'Managed Ali directly',
    date: 'August 2025',
    highlight: true,
  },
  {
    name: 'Hamza Afzal',
    role: 'Founder & AI/AR Lead',
    company: 'EnlivenAI',
    text: 'Ali\'s deep expertise in CI/CD processes, combined with his proficiency in both frontend and backend development, has significantly accelerated our project timelines while ensuring the highest quality standards. His ability to diagnose and resolve complex issues rapidly has been crucial.',
    relationship: 'Managed Ali directly',
    date: 'March 2024',
    highlight: true,
  },
  {
    name: 'Maria Naz',
    role: 'SQA Engineer',
    company: 'IoT & RFID | Web & Mobile Testing',
    text: 'I had the pleasure of working with Ali for over a year on a large-scale project, and he consistently impressed the team with his problem-solving skills and steady approach under pressure. His strong grip on development, especially in fast-paced sprints, made a real difference.',
    relationship: 'Worked with Ali on the same team',
    date: 'August 2025',
  },
  {
    name: 'Haris Ejaz',
    role: 'Founder & Solopreneur',
    company: 'Quickevent.app | Creator of F1IQ.com',
    text: 'Ali is Mr. Dependable. Throw any tech stack at him: backend, frontend, IoT; and he\'ll just figure it out without making a fuss. I\'ve seen him go from zero to shipping in areas most devs would hesitate to touch. No ego, no drama. Just solid execution.',
    relationship: 'Worked with Ali on the same team',
    date: 'June 2025',
  },
  {
    name: 'Syed Muhammad Usama',
    role: 'Frontend Lead - Senior Software Engineer',
    company: 'React.js / Next.js Specialist',
    text: 'I had the pleasure of closely collaborating with Ali Tariq, a true problem solver in full-stack development. His expertise spans frontend and backend tasks, showcasing versatility and skill. His mastery of JavaScript, especially in backend API design and optimization, is impressive.',
    relationship: 'Worked with Ali on the same team',
    date: 'July 2024',
  },
  {
    name: 'Bilal Shabbir',
    role: 'React Native Developer',
    company: 'Node.js | MongoDB',
    text: 'I had the pleasure of working with Ali, a true team player with excellent problem-solving skills. His expertise spans both frontend and backend development, with a strong grasp of scalable system design. Ali effortlessly adapts to different architectures.',
    relationship: 'Worked with Ali on the same team',
    date: 'December 2024',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <section id="testimonials" ref={ref} className="relative bg-slate-800/30 py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            Recommendations
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            From colleagues, supervisors, and team members
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal via-cyan to-teal rounded-full mx-auto" />
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-teal/30 transition-all duration-300 flex flex-col"
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal via-cyan to-teal rounded-t-xl" />

              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-5">
                <Quote size={40} className="text-teal" />
              </div>

              {/* Highlight Badge - Positioned to not overlap text */}
              {testimonial.highlight && (
                <div className="absolute top-3 left-3 z-20">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal/10 border border-teal/30 backdrop-blur-sm">
                    <Star size={10} className="text-teal fill-teal" />
                    <span className="text-xs font-medium text-teal">Supervisor</span>
                  </div>
                </div>
              )}

              {/* Testimonial Text - Add padding when badge is present */}
              <div className={`flex-1 mb-4 relative z-10 ${testimonial.highlight ? 'pt-8' : ''}`}>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-teal/50 text-xl font-serif leading-none mr-1">"</span>
                  {testimonial.text}
                  <span className="text-teal/50 text-xl font-serif leading-none ml-1">"</span>
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-teal to-cyan flex items-center justify-center text-white font-bold text-xs border border-white/20">
                    {getInitials(testimonial.name)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-0.5 truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-teal-300 text-xs font-medium truncate">
                      {testimonial.role}
                    </p>
                    <p className="text-slate-500 text-xs truncate">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <span>{testimonial.relationship}</span>
                  <span>•</span>
                  <span>{testimonial.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* LinkedIn Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-10"
        >
          <motion.a
            href="https://www.linkedin.com/in/software-engineerali"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-teal via-cyan to-teal overflow-hidden transition-all duration-300 shadow-lg shadow-teal/30 hover:shadow-xl hover:shadow-teal/40"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'linear',
              }}
            />

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal via-cyan to-teal opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

            {/* Icon */}
            <motion.div
              className="relative z-10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </motion.div>

            {/* Text */}
            <span className="relative z-10">View All on LinkedIn</span>

            {/* Arrow Indicator */}
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
