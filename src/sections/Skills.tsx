import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const techCategories = {
  frontend: {
    title: 'Frontend Development',
    description: 'Technologies for building responsive, type-safe, and high-performance user interfaces.',
    icons: [
      {
        name: 'React.js',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        tooltipColor: '#61DAFB',
      },
      {
        name: 'Next.js',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        tooltipColor: '#000000',
      },
      {
        name: 'TypeScript',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        tooltipColor: '#3178C6',
      },
      {
        name: 'JavaScript',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        tooltipColor: '#F7DF1E',
      },
      {
        name: 'Tailwind CSS',
        src: 'https://raw.githubusercontent.com/devicons/devicon/v2.16.0/icons/tailwindcss/tailwindcss-original.svg',
        tooltipColor: '#38B2AC',
      },
      {
        name: 'Redux Toolkit',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
        tooltipColor: '#764ABC',
      },
      {
        name: 'HTML5',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        tooltipColor: '#E34F26',
      },
      {
        name: 'CSS3',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
        tooltipColor: '#1572B6',
      },
    ],
  },
  backend: {
    title: 'Backend & APIs',
    description: 'Server-side technologies, frameworks, and message queues for building scalable applications.',
    icons: [
      {
        name: 'Node.js',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        tooltipColor: '#339933',
      },
      {
        name: 'NestJS',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-plain.svg',
        tooltipColor: '#E0234E',
      },
      {
        name: 'Express.js',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
        tooltipColor: '#000000',
      },
      {
        name: 'Python',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        tooltipColor: '#3776AB',
      },
      {
        name: 'Django',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
        tooltipColor: '#092E20',
      },
      {
        name: 'FastAPI',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
        tooltipColor: '#009688',
      },
      {
        name: 'GraphQL',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
        tooltipColor: '#E10098',
      },
      {
        name: 'Apache Kafka',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
        tooltipColor: '#231F20',
      },
      {
        name: 'RabbitMQ',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg',
        tooltipColor: '#FF6600',
      },
      {
        name: 'REST API',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original.svg',
        tooltipColor: '#D22128',
      },
      {
        name: 'gRPC',
        src: 'https://raw.githubusercontent.com/grpc/grpc/master/doc/grpc-logo.svg',
        tooltipColor: '#4285F4',
      },
      {
        name: 'Microservices',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
        tooltipColor: '#2496ED',
      },
    ],
  },
  database: {
    title: 'Database & Storage',
    description: 'Database technologies for efficient data management and storage.',
    icons: [
      {
        name: 'MongoDB',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        tooltipColor: '#47A248',
      },
      {
        name: 'PostgreSQL',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        tooltipColor: '#336791',
      },
      {
        name: 'MySQL',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        tooltipColor: '#4479A1',
      },
      {
        name: 'Redis',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
        tooltipColor: '#DC382D',
      },
      {
        name: 'InfluxDB',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/influxdb/influxdb-original.svg',
        tooltipColor: '#22ADF6',
      },
    ],
  },
  cloud: {
    title: 'Cloud & DevOps',
    description: 'Cloud infrastructure, containerization, and automation tools for deployment.',
    icons: [
      {
        name: 'AWS',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
        tooltipColor: '#FF9900',
      },
      {
        name: 'Docker',
        src: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png',
        tooltipColor: '#2496ED',
      },
      {
        name: 'Kubernetes',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
        tooltipColor: '#326CE5',
      },
      {
        name: 'Terraform',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg',
        tooltipColor: '#7B42BC',
      },
      {
        name: 'Ansible',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ansible/ansible-original.svg',
        tooltipColor: '#EE0000',
      },
      {
        name: 'Linux',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
        tooltipColor: '#FCC624',
      },
      {
        name: 'Jenkins',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
        tooltipColor: '#D24939',
      },
      {
        name: 'Nginx',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
        tooltipColor: '#009639',
      },
      {
        name: 'Apache',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original-wordmark.svg',
        tooltipColor: '#D22128',
      },
      {
        name: 'GitHub Actions',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
        tooltipColor: '#181717',
      },
      {
        name: 'GitLab CI/CD',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg',
        tooltipColor: '#FC6D26',
      },
      {
        name: 'Helm',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/helm/helm-original-wordmark.svg',
        tooltipColor: '#0F1689',
      },
    ],
  },
  realtime: {
    title: 'Real-Time & IoT',
    description: 'Technologies for real-time communication and IoT platforms.',
    icons: [
      {
        name: 'Socket.IO',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg',
        tooltipColor: '#010101',
      },
      {
        name: 'Grafana',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg',
        tooltipColor: '#F46800',
      },
      {
        name: 'MQTT',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mqtt/mqtt-original.svg',
        tooltipColor: '#660066',
      },
      {
        name: 'WebSocket',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/websocket/websocket-original.svg',
        tooltipColor: '#010101',
      },
      {
        name: 'Apache Kafka',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
        tooltipColor: '#231F20',
      },
      {
        name: 'NATS',
        src: 'https://nats.io/img/nats-icon-color.svg',
        tooltipColor: '#00A8E8',
  },
      {
        name: 'Prometheus',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg',
        tooltipColor: '#E6522C',
    },
    ],
  },
  architecture: {
    title: 'System Design & Architecture',
    description: 'Designing scalable, distributed systems and enterprise solutions.',
    icons: [
      {
        name: 'System Design',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
        tooltipColor: '#14B8A6',
      },
      {
        name: 'Solution Architecture',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg',
        tooltipColor: '#06B6D4',
      },
      {
        name: 'Microservices',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
        tooltipColor: '#2496ED',
      },
      {
        name: 'Distributed Systems',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg',
        tooltipColor: '#231F20',
      },
      {
        name: 'Cloud Architecture',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
        tooltipColor: '#FF9900',
      },
      {
        name: 'API Design',
        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
        tooltipColor: '#E10098',
      },
    ],
  },
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section
      id="skills"
      ref={ref}
      className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden bg-slate-800/30"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div
          className="absolute -top-1/3 -left-1/3 w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, #14B8A6 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute -bottom-1/3 -right-1/3 w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, #06B6D4 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            Explore My{' '}
            <span
              className="inline-block font-bold"
              style={{
                backgroundImage: 'linear-gradient(90deg, #14B8A6, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Skills
            </span>
          </motion.h2>

          <motion.div
            className="w-24 h-1.5 rounded-full relative overflow-hidden mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, #14B8A6, #06B6D4)',
                boxShadow: '0 0 12px rgba(20, 184, 166, 0.5)',
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {Object.entries(techCategories).map(([key, category], i) => (
        <motion.div
              key={key}
              className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden glass"
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2 + 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 sm:mb-6">
                <motion.h3
                  className="text-xl sm:text-2xl font-bold mb-2 text-teal"
                  whileHover={{ x: 5 }}
                >
                  {category.title}
                </motion.h3>
                <motion.p
                  className="text-xs sm:text-sm text-slate-400"
              >
                  {category.description}
                </motion.p>
              </div>

              <div className="grid grid-cols-3 min-[375px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4">
                {category.icons.map((tech) => (
                  <motion.div
                    key={tech.name}
                    className="relative group flex flex-col items-center"
                    onMouseEnter={() => setHoveredTech(tech.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                  >
                    <motion.div
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg sm:rounded-xl relative"
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      whileHover={{
                        scale: 1.15,
                        boxShadow: `0 0 20px ${tech.tooltipColor}40`,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle at center, ${tech.tooltipColor}20, transparent 70%)`,
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      <img
                        src={tech.src}
                        alt=""
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain z-10"
                        style={{
                          filter: 'brightness(0.9)',
                        }}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.icon-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'icon-fallback';
                            fallback.style.width = '100%';
                            fallback.style.height = '100%';
                            fallback.style.backgroundColor = tech.tooltipColor;
                            fallback.style.borderRadius = '8px';
                            fallback.style.display = 'flex';
                            fallback.style.alignItems = 'center';
                            fallback.style.justifyContent = 'center';
                            fallback.style.color = 'white';
                            fallback.style.fontSize = '10px';
                            fallback.style.fontWeight = 'bold';
                            fallback.textContent = tech.name.substring(0, 2).toUpperCase();
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </motion.div>
                    
                    <AnimatePresence>
                      {hoveredTech === tech.name && (
                    <motion.div
                          className="absolute bottom-full mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-semibold z-50 whitespace-nowrap"
                      style={{
                            backgroundColor: tech.tooltipColor,
                            color: '#FFFFFF',
                            boxShadow: `0 4px 12px ${tech.tooltipColor}60`,
                      }}
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              type: 'spring',
                              stiffness: 400,
                              damping: 20,
                            },
                          }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        >
                          {tech.name}
                          <div
                            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] sm:border-l-4 border-r-[3px] sm:border-r-4 border-t-[3px] sm:border-t-4 border-l-transparent border-r-transparent"
                            style={{
                              borderTopColor: tech.tooltipColor,
                              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                </div>
              </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: '#14B8A6',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 60],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
}
