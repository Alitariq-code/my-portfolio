---
title: Observability in Modern Applications: Implementing Distributed Tracing, Metrics, and Logging with OpenTelemetry
excerpt: Master observability in distributed systems with OpenTelemetry. Learn how to implement distributed tracing, metrics collection, structured logging, and build comprehensive observability pipelines for microservices and cloud-native applications.
category: Backend
readTime: 17 min read
date: '2024-12-14'
tags: [Observability, OpenTelemetry, Distributed Tracing, Monitoring, DevOps]
featured: true
---

# Observability in Modern Applications: Implementing Distributed Tracing, Metrics, and Logging with OpenTelemetry

Observability has become critical in modern distributed systems. As applications scale across multiple services, understanding system behavior, debugging issues, and optimizing performance requires comprehensive observability. OpenTelemetry has emerged as the standard for instrumenting applications and collecting telemetry data. This guide explores implementing observability in production systems.

## Understanding Observability

Observability is the ability to understand the internal state of a system by examining its outputs. It consists of three pillars:

1. **Traces**: Request flows across services
2. **Metrics**: Quantitative measurements over time
3. **Logs**: Discrete events with context

### Why Observability Matters

- **Faster Debugging**: Identify root causes quickly
- **Performance Optimization**: Find bottlenecks
- **Proactive Monitoring**: Detect issues before users
- **Business Insights**: Understand user behavior
- **Cost Optimization**: Identify resource waste

## OpenTelemetry Overview

OpenTelemetry is a vendor-neutral, open-source observability framework that provides:

- **APIs**: Language-specific instrumentation APIs
- **SDKs**: Implementation of the APIs
- **Collector**: Receives, processes, and exports telemetry
- **Instrumentation**: Auto-instrumentation for common libraries

### Architecture

```
Application
    ↓
OpenTelemetry SDK
    ↓
OpenTelemetry Collector
    ↓
Backend Systems
    ├── Jaeger (Tracing)
    ├── Prometheus (Metrics)
    ├── Loki (Logs)
    └── Grafana (Visualization)
```

## Implementing Distributed Tracing

### 1. Setting Up OpenTelemetry

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'user-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-pg': {
        enabled: true,
      },
    }),
  ],
});

sdk.start();
console.log('OpenTelemetry initialized');
```

### 2. Manual Instrumentation

```typescript
// src/tracing.ts
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

const tracer = trace.getTracer('user-service');

export async function getUserWithOrders(userId: string) {
  return tracer.startActiveSpan('getUserWithOrders', async (span) => {
    try {
      span.setAttribute('user.id', userId);
      span.setAttribute(SemanticAttributes.DB_SYSTEM, 'postgresql');

      // Get user
      const user = await tracer.startActiveSpan('db.getUser', async (userSpan) => {
        userSpan.setAttribute('db.operation', 'SELECT');
        userSpan.setAttribute('db.statement', 'SELECT * FROM users WHERE id = ?');
        
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        userSpan.setStatus({ code: SpanStatusCode.OK });
        return result.rows[0];
      });

      // Get orders
      const orders = await tracer.startActiveSpan('db.getOrders', async (ordersSpan) => {
        ordersSpan.setAttribute('db.operation', 'SELECT');
        ordersSpan.setAttribute('db.statement', 'SELECT * FROM orders WHERE user_id = ?');
        
        const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        ordersSpan.setStatus({ code: SpanStatusCode.OK });
        return result.rows;
      });

      span.setStatus({ code: SpanStatusCode.OK });
      return { user, orders };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### 3. Express Middleware

```typescript
// src/middleware/tracing.ts
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

const tracer = trace.getTracer('express-app');

export function tracingMiddleware(req: any, res: any, next: any) {
  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    kind: 1, // SERVER
    attributes: {
      [SemanticAttributes.HTTP_METHOD]: req.method,
      [SemanticAttributes.HTTP_URL]: req.url,
      [SemanticAttributes.HTTP_ROUTE]: req.route?.path,
      [SemanticAttributes.HTTP_USER_AGENT]: req.get('user-agent'),
    },
  });

  context.with(trace.setSpan(context.active(), span), () => {
    res.on('finish', () => {
      span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, res.statusCode);
      
      if (res.statusCode >= 400) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `HTTP ${res.statusCode}`,
        });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      span.end();
    });

    next();
  });
}
```

### 4. Cross-Service Tracing

```typescript
// Propagate trace context
import { propagation, context } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

propagation.setGlobalPropagator(new W3CTraceContextPropagator());

// Client-side: Inject trace context
export async function callExternalService(url: string, data: any) {
  const span = tracer.startSpan('external.service.call');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Inject trace context into headers
  propagation.inject(context.active(), headers);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    span.setStatus({ code: SpanStatusCode.OK });
    return response.json();
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    throw error;
  } finally {
    span.end();
  }
}

// Server-side: Extract trace context
export function extractTraceContext(req: any, res: any, next: any) {
  const parentContext = propagation.extract(context.active(), req.headers);
  context.with(parentContext, () => {
    next();
  });
}
```

## Implementing Metrics

### 1. Counter Metrics

```typescript
// src/metrics.ts
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('user-service');

// Counter: Increment only
export const requestCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
});

// UpDownCounter: Increment and decrement
export const activeConnections = meter.createUpDownCounter('active_connections', {
  description: 'Number of active connections',
});

// Histogram: Distribution of values
export const requestDuration = meter.createHistogram('http_request_duration_ms', {
  description: 'HTTP request duration in milliseconds',
  unit: 'ms',
});

// Usage
export function trackRequest(method: string, path: string, duration: number, statusCode: number) {
  requestCounter.add(1, {
    method,
    path,
    status_code: statusCode.toString(),
  });

  requestDuration.record(duration, {
    method,
    path,
    status_code: statusCode.toString(),
  });
}
```

### 2. Gauge Metrics

```typescript
// Observable Gauge: Current value
export const memoryUsage = meter.createObservableGauge('memory_usage_bytes', {
  description: 'Memory usage in bytes',
});

memoryUsage.addCallback((observableResult) => {
  const usage = process.memoryUsage();
  observableResult.observe(usage.heapUsed, {
    type: 'heap',
  });
  observableResult.observe(usage.external, {
    type: 'external',
  });
});
```

### 3. Business Metrics

```typescript
// Track business events
export const ordersCreated = meter.createCounter('orders_created_total', {
  description: 'Total number of orders created',
});

export const revenue = meter.createHistogram('revenue_usd', {
  description: 'Order revenue in USD',
  unit: 'USD',
});

export function trackOrder(order: { id: string; total: number; userId: string }) {
  ordersCreated.add(1, {
    user_id: order.userId,
  });

  revenue.record(order.total, {
    order_id: order.id,
    user_id: order.userId,
  });
}
```

## Structured Logging

### 1. OpenTelemetry Logging

```typescript
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

const loggerProvider = new LoggerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'user-service',
  }),
});

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(
    new OTLPLogExporter({
      url: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT,
    })
  )
);

const logger = logs.getLogger('user-service', '1.0.0');

export function logInfo(message: string, attributes: Record<string, any> = {}) {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: message,
    attributes: {
      ...attributes,
      timestamp: new Date().toISOString(),
    },
  });
}

export function logError(error: Error, attributes: Record<string, any> = {}) {
  logger.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: 'ERROR',
    body: error.message,
    attributes: {
      ...attributes,
      'error.type': error.constructor.name,
      'error.stack': error.stack,
      timestamp: new Date().toISOString(),
    },
  });
}
```

### 2. Correlation with Traces

```typescript
import { context, trace } from '@opentelemetry/api';

export function logWithTrace(level: string, message: string, attributes: Record<string, any> = {}) {
  const span = trace.getActiveSpan();
  const spanContext = span?.spanContext();

  logger.emit({
    severityNumber: getSeverityNumber(level),
    severityText: level,
    body: message,
    attributes: {
      ...attributes,
      'trace_id': spanContext?.traceId,
      'span_id': spanContext?.spanId,
      timestamp: new Date().toISOString(),
    },
  });
}
```

## OpenTelemetry Collector Configuration

### Collector Config

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
  
  memory_limiter:
    limit_mib: 512
  
  attributes:
    actions:
      - key: environment
        value: production
        action: insert

exporters:
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  
  prometheus:
    endpoint: "0.0.0.0:8889"
  
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, attributes, batch]
      exporters: [jaeger]
    
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheus]
    
    logs:
      receivers: [otlp]
      processors: [memory_limiter, attributes, batch]
      exporters: [loki]
```

## Advanced Observability Patterns

### 1. Sampling Strategies

```typescript
// Head-based sampling
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

const sampler = new TraceIdRatioBasedSampler(0.1); // Sample 10% of traces

const sdk = new NodeSDK({
  sampler,
  // ... other config
});

// Tail-based sampling (in collector)
processors:
  tail_sampling:
    policies:
      - name: error-policy
        type: status_code
        status_code:
          status_codes: [ERROR]
      - name: latency-policy
        type: latency
        latency:
          threshold_ms: 1000
```

### 2. Custom Attributes

```typescript
// Add business context to spans
span.setAttributes({
  'user.id': userId,
  'user.plan': userPlan,
  'order.total': orderTotal,
  'payment.method': paymentMethod,
  'business.region': region,
});
```

### 3. Baggage Propagation

```typescript
import { baggage } from '@opentelemetry/api';

// Set baggage
const ctx = baggage.set(context.active(), 'user.id', userId);
const ctx2 = baggage.set(ctx, 'request.id', requestId);

// Get baggage
const userBaggage = baggage.get(context.active(), 'user.id');
```

## Performance Optimization

### 1. Async Export

```typescript
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://collector:4318',
    // Async export to avoid blocking
    exportTimeoutMillis: 30000,
  }),
});
```

### 2. Batch Processing

```typescript
// Collector batches automatically
processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
    send_batch_max_size: 2048
```

### 3. Sampling for High-Volume Services

```typescript
// Adaptive sampling based on load
const adaptiveSampler = {
  shouldSample: (context: any, traceId: string) => {
    const currentLoad = getCurrentLoad();
    
    if (currentLoad > 0.8) {
      return { decision: SamplingDecision.RECORD_AND_SAMPLE, attributes: {} };
    }
    
    // Lower sampling rate under high load
    return Math.random() < 0.1 
      ? { decision: SamplingDecision.RECORD_AND_SAMPLE, attributes: {} }
      : { decision: SamplingDecision.NOT_RECORD, attributes: {} };
  },
};
```

## Alerting and SLOs

### Service Level Objectives

```typescript
// Define SLOs
const slos = {
  availability: {
    target: 0.999, // 99.9%
    window: '30d',
  },
  latency: {
    p99: 500, // 99th percentile < 500ms
    window: '7d',
  },
  errorRate: {
    target: 0.001, // < 0.1% errors
    window: '7d',
  },
};

// Track SLO compliance
export function trackSLO(metric: string, value: number) {
  const slo = slos[metric];
  const compliant = value >= slo.target;
  
  if (!compliant) {
    // Alert
    sendAlert(`SLO violation: ${metric} = ${value}, target = ${slo.target}`);
  }
}
```

## Best Practices

1. **Instrument Early**: Add observability from day one
2. **Use Semantic Conventions**: Standard attribute names
3. **Sample Strategically**: Balance detail vs. cost
4. **Correlate Signals**: Link traces, metrics, and logs
5. **Monitor Costs**: Observability can be expensive
6. **Set SLOs**: Define and track service level objectives
7. **Document Context**: Add business context to spans
8. **Test Observability**: Verify instrumentation works

## Tools and Ecosystem

- **Tracing**: Jaeger, Zipkin, Tempo
- **Metrics**: Prometheus, InfluxDB, Datadog
- **Logs**: Loki, Elasticsearch, Splunk
- **Visualization**: Grafana, Datadog, New Relic
- **APM**: Datadog APM, New Relic, Dynatrace

## Conclusion

Observability is essential for building and operating modern distributed systems. OpenTelemetry provides a vendor-neutral, standardized approach to instrumenting applications and collecting telemetry data. By implementing comprehensive observability with traces, metrics, and logs, teams can debug issues faster, optimize performance, and deliver better user experiences.

The key to successful observability is starting early, using semantic conventions, and continuously refining your instrumentation based on real-world usage patterns.

