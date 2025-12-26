export interface CaseStudy {
  projectId: string;
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

export const caseStudies: CaseStudy[] = [
  {
    projectId: 'neotaq-iot-platform',
    title: 'NeoTAQ IoT Platform',
    company: 'Green Fuel Energy',
    category: 'IoT',
    overview: 'NeoTAQ is an industrial IoT platform enabling real-time energy management for enterprise clients. Built with distributed microservices architecture, it serves 15+ clients managing 100+ energy assets with 99.9% reliability.',
    challenge: 'The challenge was to build a scalable IoT platform that could handle millions of device connections, process real-time data streams from multiple protocols (Modbus, OPC UA, MQTT), maintain 99.9% uptime, and scale horizontally to support enterprise clients with varying load requirements.',
    solution: [
      'Designed microservices architecture with separate services for device management, data ingestion, time-series storage, real-time processing, and analytics',
      'Implemented multi-protocol support (Modbus TCP/RTU, OPC UA, MQTT, HTTP REST) with protocol-agnostic design',
      'Built high-performance data ingestion layer using NATS message queue for decoupled, scalable message processing',
      'Deployed InfluxDB for time-series data storage with optimized retention policies and downsampling strategies',
      'Created real-time WebSocket infrastructure using Socket.IO and Redis Pub/Sub for sub-second dashboard updates',
      'Implemented Kubernetes orchestration for automatic scaling and high availability',
      'Developed predictive maintenance algorithms using Python-based analytics services',
    ],
    technologies: ['React', 'Node.js', 'NestJS', 'NATS', 'InfluxDB', 'Modbus', 'OPC UA', 'Docker', 'Kubernetes', 'Redis', 'Socket.IO', 'Python', 'FastAPI'],
    results: [
      'Successfully deployed platform serving 15+ enterprise clients',
      'Achieved 99.9% uptime through redundancy and health monitoring',
      'Processes 100K+ data points per second with sub-100ms latency',
      'Manages 100+ energy assets across multiple industrial sites',
      'Reduced infrastructure costs by 40% through efficient resource utilization',
      'Enabled real-time monitoring and predictive maintenance capabilities',
    ],
    metrics: [
      { label: 'Enterprise Clients', value: '15+' },
      { label: 'Energy Assets', value: '100+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Data Points/sec', value: '100K+' },
      { label: 'Latency', value: '<100ms' },
    ],
    architecture: `Architecture Overview:
┌─────────────────┐
│   IoT Devices   │
│ (Modbus/OPC/MQTT)│
└────────┬────────┘
         │
┌────────▼────────┐
│ Data Ingestion │
│   (NATS Queue)  │
└────────┬────────┘
         │
┌────────▼────────┐
│ Time-Series DB  │
│   (InfluxDB)    │
└────────┬────────┘
         │
┌────────▼────────┐
│ Real-Time Proc  │
│  (Socket.IO)    │
└────────┬────────┘
         │
┌────────▼────────┐
│   Dashboards    │
│    (React)      │
└─────────────────┘`,
  },
  {
    projectId: 'kubearchitect-microservices',
    title: 'KubeArchitect Microservices',
    company: 'Open Source',
    category: 'Open Source',
    overview: 'Comprehensive microservices architecture with Kubernetes orchestration and automated CI/CD pipeline from GitHub to cluster. Demonstrates production-ready containerization, service mesh patterns, and scalable infrastructure design.',
    challenge: 'Building a production-ready microservices architecture that demonstrates best practices for containerization, orchestration, service communication, and CI/CD automation. The solution needed to be easily deployable, scalable, and maintainable.',
    solution: [
      'Designed microservices architecture with clear service boundaries and responsibilities',
      'Implemented Kubernetes manifests for deployment, services, and ingress configuration',
      'Created automated CI/CD pipeline using GitHub Actions for build, test, and deploy',
      'Configured service mesh patterns for inter-service communication and load balancing',
      'Set up monitoring and logging infrastructure for observability',
      'Implemented health checks and readiness probes for service reliability',
      'Created comprehensive documentation and deployment guides',
    ],
    technologies: ['Kubernetes', 'Docker', 'Microservices', 'CI/CD', 'GitHub Actions', 'YAML', 'Helm'],
    results: [
      'Demonstrated production-ready microservices patterns',
      'Automated deployment pipeline reduces deployment time by 80%',
      'Scalable architecture supports horizontal scaling',
      'Open source contribution with 50+ stars on GitHub',
      'Used as reference implementation for microservices best practices',
    ],
    metrics: [
      { label: 'GitHub Stars', value: '50+' },
      { label: 'Services', value: '5+' },
      { label: 'Deploy Time', value: '<5min' },
    ],
    github: 'https://github.com/Alitariq-code/KubeArchitect-Microservices',
    architecture: `Microservices Architecture:
┌─────────────┐
│   Gateway    │
└──────┬──────┘
       │
┌──────▼──────┐  ┌──────────┐  ┌──────────┐
│   Service   │  │ Service  │  │ Service  │
│     1      │  │    2     │  │    3     │
└────────────┘  └──────────┘  └──────────┘
       │              │              │
       └──────────────┴──────────────┘
                    │
            ┌───────▼───────┐
            │   Database     │
            └────────────────┘`,
  },
  {
    projectId: 'flowtopia-options-trading',
    title: 'Flowtopia Options Trading Platform',
    company: 'Flowtopia',
    category: 'Enterprise',
    overview: 'Real-time options activity tracking system monitoring institutional trading patterns with live market sentiment analysis. Provides advanced analytics dashboard for traders and financial institutions.',
    challenge: 'Building a real-time financial data platform that can process high-frequency market data, provide instant updates to thousands of concurrent users, and deliver actionable insights for trading decisions. The system needed to handle massive data volumes with minimal latency.',
    solution: [
      'Developed real-time data streaming infrastructure using Socket.IO and WebSockets',
      'Implemented efficient data processing pipeline for high-frequency market data',
      'Created advanced analytics dashboard with real-time charts and indicators',
      'Built sentiment analysis engine for market trend prediction',
      'Designed scalable backend architecture to handle peak trading hours',
      'Implemented caching strategies for frequently accessed data',
      'Created responsive frontend with optimized rendering for real-time updates',
    ],
    technologies: ['React', 'Node.js', 'Socket.IO', 'Real-time Analytics', 'WebSockets', 'Chart.js', 'Redis'],
    results: [
      'Delivered real-time market data with sub-second latency',
      'Supported 1000+ concurrent users during peak trading hours',
      'Enabled traders to make faster, data-driven decisions',
      'Improved user engagement with live market insights',
      'Successfully deployed and maintained production system',
    ],
    metrics: [
      { label: 'Concurrent Users', value: '1000+' },
      { label: 'Data Latency', value: '<1s' },
      { label: 'Uptime', value: '99.5%' },
    ],
    live: 'https://flowtopia.co',
  },
];

