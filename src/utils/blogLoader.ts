import { Code, Zap, Database, Cloud } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
  icon: typeof Code;
  gradient: string;
  featured?: boolean;
}

// Map categories to icons
const categoryIcons: Record<string, typeof Code> = {
  'IoT': Cloud,
  'Backend': Zap,
  'Full Stack': Code,
  'Database': Database,
};

// Map categories to gradients
const categoryGradients: Record<string, string> = {
  'IoT': 'from-teal to-cyan',
  'Backend': 'from-cyan to-teal',
  'Full Stack': 'from-cyan to-teal',
  'Database': 'from-teal to-cyan',
};

// Blog post metadata - maps to markdown files
interface BlogMetadata {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
  featured?: boolean;
}

const blogMetadata: BlogMetadata[] = [
  {
    id: 'ai-integration-fullstack',
    title: 'AI Integration in Full Stack Development: Building Intelligent Applications with LLMs and Vector Databases',
    excerpt: 'A comprehensive guide to integrating AI capabilities into full stack applications. Learn how to leverage Large Language Models, vector databases, RAG (Retrieval Augmented Generation), and AI agents to build next-generation intelligent applications.',
    category: 'Full Stack',
    readTime: '15 min read',
    date: '2024-12-20',
    tags: ['AI', 'LLM', 'Vector Databases', 'RAG', 'Full Stack'],
    featured: true,
  },
  {
    id: 'serverless-architecture-edge',
    title: 'Serverless Architecture and Edge Computing: Building Scalable Applications with Zero Infrastructure Management',
    excerpt: 'Deep dive into serverless computing, edge functions, and modern deployment strategies. Learn how to build highly scalable, cost-effective applications using AWS Lambda, Vercel Edge Functions, Cloudflare Workers, and edge computing patterns.',
    category: 'Backend',
    readTime: '18 min read',
    date: '2024-12-18',
    tags: ['Serverless', 'Edge Computing', 'AWS Lambda', 'Cloudflare Workers', 'Scalability'],
    featured: true,
  },
  {
    id: 'graphql-federation-microservices',
    title: 'GraphQL Federation: Building Distributed GraphQL APIs Across Microservices',
    excerpt: 'Master GraphQL Federation to build scalable, distributed GraphQL APIs. Learn Apollo Federation patterns, schema composition, entity resolution, and how to federate multiple microservices into a unified GraphQL API.',
    category: 'Backend',
    readTime: '16 min read',
    date: '2024-12-16',
    tags: ['GraphQL', 'Federation', 'Microservices', 'Apollo', 'API Design'],
    featured: true,
  },
  {
    id: 'observability-opentelemetry',
    title: 'Observability in Modern Applications: Implementing Distributed Tracing, Metrics, and Logging with OpenTelemetry',
    excerpt: 'Master observability in distributed systems with OpenTelemetry. Learn how to implement distributed tracing, metrics collection, structured logging, and build comprehensive observability pipelines for microservices and cloud-native applications.',
    category: 'Backend',
    readTime: '17 min read',
    date: '2024-12-14',
    tags: ['Observability', 'OpenTelemetry', 'Distributed Tracing', 'Monitoring', 'DevOps'],
    featured: true,
  },
  {
    id: 'building-scalable-iot-platforms',
    title: 'Building Scalable IoT Platforms: Architecture Patterns for Enterprise Solutions',
    excerpt: 'Learn how to design and implement robust IoT platforms that can handle millions of devices, process real-time data streams, and scale horizontally using microservices architecture.',
    category: 'IoT',
    readTime: '8 min read',
    date: '2024-12-15',
    tags: ['IoT', 'Microservices', 'Architecture', 'Scalability'],
    featured: false,
  },
  {
    id: 'backend-optimization',
    title: 'Backend Optimization: Reducing API Response Time from 2s to 50ms',
    excerpt: 'Deep dive into backend optimization techniques that reduced API response times by 97%. Learn about database query optimization, caching strategies, and connection pooling.',
    category: 'Backend',
    readTime: '6 min read',
    date: '2024-12-10',
    tags: ['Backend', 'Optimization', 'Performance', 'Database'],
    featured: true,
  },
  {
    id: 'real-time-data-streaming',
    title: 'Real-Time Data Streaming: Building WebSocket Infrastructure for IoT Dashboards',
    excerpt: 'Architecting a real-time data streaming system using Socket.IO, Redis Pub/Sub, and WebSockets to deliver sub-second updates to thousands of concurrent dashboard users.',
    category: 'IoT',
    readTime: '7 min read',
    date: '2024-12-05',
    tags: ['IoT', 'WebSockets', 'Real-time', 'Socket.IO'],
    featured: false,
  },
  {
    id: 'microservices-communication',
    title: 'Microservices Communication: Choosing Between REST, gRPC, and Message Queues',
    excerpt: 'A comprehensive guide to selecting the right communication pattern for microservices. Learn when to use REST APIs, gRPC, or message queues based on your use case.',
    category: 'Backend',
    readTime: '9 min read',
    date: '2024-11-28',
    tags: ['Microservices', 'Architecture', 'gRPC', 'REST'],
    featured: false,
  },
  {
    id: 'time-series-database-optimization',
    title: 'Time-Series Database Optimization: Handling 100M+ Data Points in InfluxDB',
    excerpt: 'Optimizing InfluxDB for massive scale: retention policies, downsampling strategies, and query optimization techniques for IoT time-series data.',
    category: 'Backend',
    readTime: '8 min read',
    date: '2024-11-20',
    tags: ['Database', 'InfluxDB', 'IoT', 'Optimization'],
    featured: false,
  },
  {
    id: 'full-stack-typescript',
    title: 'Full Stack TypeScript: Building Type-Safe Applications from Frontend to Backend',
    excerpt: 'Leveraging TypeScript across the entire stack for type safety, better developer experience, and reduced bugs. Learn how to share types between frontend and backend.',
    category: 'Full Stack',
    readTime: '7 min read',
    date: '2024-11-15',
    tags: ['TypeScript', 'Full Stack', 'Best Practices'],
    featured: false,
  },
];

// Load markdown content
async function loadMarkdownContent(id: string): Promise<string> {
  try {
    const response = await fetch(`/content/blogs/${id}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load blog: ${id}`);
    }
    const text = await response.text();
    
    // Remove frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const content = text.replace(frontmatterRegex, '');
    
    return content.trim();
  } catch (error) {
    console.error(`Error loading blog ${id}:`, error);
    return '';
  }
}

// Get all blog posts with metadata
export function getBlogPosts(): Omit<BlogPost, 'content'>[] {
  return blogMetadata.map((post): Omit<BlogPost, 'content'> => ({
    ...post,
    icon: categoryIcons[post.category] || Code,
    gradient: categoryGradients[post.category] || 'from-teal to-cyan',
  }));
}

// Get blog post with content
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const metadata = blogMetadata.find(post => post.id === id);
  if (!metadata) {
    return null;
  }

  const content = await loadMarkdownContent(id);
  if (!content) {
    return null;
  }

  return {
    ...metadata,
    content,
    icon: categoryIcons[metadata.category] || Code,
    gradient: categoryGradients[metadata.category] || 'from-teal to-cyan',
  };
}

