---
title: Backend Optimization: Reducing API Response Time from 2s to 50ms
excerpt: Deep dive into backend optimization techniques that reduced API response times by 97%. Learn about database query optimization, caching strategies, and connection pooling.
category: Backend
readTime: 6 min read
date: 2024-12-10
tags: [Backend, Optimization, Performance, Database]
featured: true
---

# Backend Optimization: Reducing API Response Time from 2s to 50ms

Performance optimization is not just about code—it's about understanding your entire stack. Here's how I optimized a critical API endpoint handling 10K+ requests per minute.

## The Problem

An API endpoint was taking 2+ seconds to respond, causing:

- Poor user experience
- High server costs
- Database connection exhaustion
- Timeout errors

**Initial Metrics:**
- Response Time: 2000ms average
- Database Queries: 15 per request
- Cache Hit Rate: 0%
- Server CPU: 80% utilization
- Error Rate: 2%

## Optimization Strategies

### 1. Database Query Optimization

**Before (Unoptimized):**

```sql
SELECT * FROM devices d
JOIN readings r ON d.id = r.device_id
WHERE d.status = 'active'
ORDER BY r.timestamp DESC
LIMIT 100;
```

**After (Optimized):**

```sql
SELECT d.id, d.name, d.status, r.temperature, r.timestamp
FROM devices d
INNER JOIN readings r ON d.id = r.device_id
WHERE d.status = 'active'
  AND r.timestamp > NOW() - INTERVAL '1 day'
ORDER BY r.timestamp DESC
LIMIT 100;
```

**Optimizations Applied:**
- Added composite indexes on `(status, id)` and `(device_id, timestamp)`
- Used SELECT specific columns instead of `*`
- Implemented pagination with cursor-based approach
- Added time-based filtering to reduce dataset size

**Result:** 80% reduction in query time

### 2. Redis Caching Layer

Implemented multi-level caching:

- **L1**: In-memory cache (Node.js Map) for frequently accessed data
- **L2**: Redis for shared cache across instances
- **TTL Strategy**: 5 minutes for static data, 30 seconds for dynamic

**Cache Implementation:**

```typescript
// L1 Cache (In-Memory)
const memoryCache = new Map<string, { data: any; expires: number }>();

// L2 Cache (Redis)
async function getCachedData(key: string) {
  // Check L1 first
  const cached = memoryCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  // Check L2 (Redis)
  const redisData = await redis.get(key);
  if (redisData) {
    memoryCache.set(key, { data: JSON.parse(redisData), expires: Date.now() + 5000 });
    return JSON.parse(redisData);
  }
  
  return null;
}
```

**Cache hit rate:** 85% → Reduced database load by 85%

### 3. Connection Pooling

**Before:** Creating new connections for each request

**After:** PostgreSQL connection pool (max: 20, min: 5)

**Benefits:**
- Reduced connection overhead
- Better resource utilization
- Connection reuse
- Automatic connection management

**Configuration:**

```typescript
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'iot_platform',
  user: 'user',
  password: 'password',
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 4. Response Compression

Enabled gzip compression:

- Reduced payload size by 70%
- Faster network transfer
- Lower bandwidth costs

**Implementation:**

```typescript
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
}));
```

### 5. Async Processing

Moved heavy operations to background jobs:

- Email sending → Queue
- Report generation → Worker process
- Data aggregation → Scheduled tasks

**Queue Implementation:**

```typescript
// Instead of blocking the request
await sendEmail(user.email, report);

// Use background job
await jobQueue.add('send-email', {
  email: user.email,
  report: report,
});
```

## Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Response Time | 2000ms | 50ms | 97% faster |
| Database Queries | 15/request | 2/request | 87% reduction |
| Cache Hit Rate | 0% | 85% | New capability |
| Server CPU | 80% | 25% | 69% reduction |
| Error Rate | 2% | 0.1% | 95% reduction |

## Key Takeaways

1. **Measure First**: Use APM tools to identify bottlenecks
2. **Index Strategically**: Not all indexes are beneficial
3. **Cache Aggressively**: But invalidate intelligently
4. **Pool Connections**: Don't create new connections per request
5. **Compress Responses**: Especially for JSON APIs

## Tools Used

- **PostgreSQL EXPLAIN ANALYZE**: Query optimization
- **Redis**: Caching layer
- **New Relic**: Performance monitoring
- **pgBouncer**: Connection pooling
- **Node.js Cluster**: Multi-core utilization

## Conclusion

Backend optimization is an iterative process. Start by measuring, identify bottlenecks, optimize systematically, and measure again. The 97% improvement didn't happen overnight—it required careful analysis and strategic changes.

