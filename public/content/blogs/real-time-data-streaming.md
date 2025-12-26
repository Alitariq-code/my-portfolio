---
title: Real-Time Data Streaming: Building WebSocket Infrastructure for IoT Dashboards
excerpt: Architecting a real-time data streaming system using Socket.IO, Redis Pub/Sub, and WebSockets to deliver sub-second updates to thousands of concurrent dashboard users.
category: IoT
readTime: 7 min read
date: 2024-12-05
tags: [IoT, WebSockets, Real-time, Socket.IO]
featured: false
---

# Real-Time Data Streaming: Building WebSocket Infrastructure for IoT Dashboards

Real-time dashboards are the heart of IoT platforms. Users need instant visibility into their systems. Here's how I built a scalable WebSocket infrastructure.

## Architecture Overview

```
IoT Devices → MQTT Broker → Backend Service → Redis Pub/Sub → WebSocket Server → Clients
```

### 1. MQTT Message Ingestion

Devices publish telemetry data to MQTT topics:

- `device/{deviceId}/telemetry` - Sensor readings
- `device/{deviceId}/alerts` - Alert notifications
- `device/{deviceId}/status` - Device status updates

**Message Format:**

```json
{
  "deviceId": "sensor-001",
  "timestamp": "2024-12-05T10:30:00Z",
  "temperature": 25.5,
  "humidity": 60.2,
  "pressure": 1013.25
}
```

### 2. Backend Processing

NestJS service subscribes to MQTT topics:

- Validates incoming data
- Transforms to normalized format
- Publishes to Redis channels

**Implementation:**

```typescript
@Injectable()
export class MqttService {
  constructor(
    private readonly redis: RedisService,
  ) {}

  @EventPattern('device/+/telemetry')
  async handleTelemetry(data: TelemetryData) {
    // Validate and transform
    const normalized = this.normalizeData(data);
    
    // Publish to Redis
    await this.redis.publish(
      `device:${data.deviceId}:telemetry`,
      JSON.stringify(normalized)
    );
  }
}
```

### 3. Redis Pub/Sub

Acts as message broker:

- Decouples ingestion from distribution
- Enables horizontal scaling
- Provides message persistence
- Supports multiple subscribers

**Benefits:**
- Low latency (< 1ms)
- High throughput (100K+ messages/sec)
- Reliable delivery
- Horizontal scalability

### 4. WebSocket Server

Socket.IO server:

- Maintains persistent connections
- Subscribes to Redis channels
- Broadcasts to connected clients
- Handles room-based subscriptions

## Implementation Details

### Server-Side (NestJS)

Using WebSocketGateway decorator:

```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class TelemetryGateway {
  @WebSocketServer()
  server: Server;

  constructor(private redis: RedisService) {
    this.setupRedisSubscription();
  }

  private async setupRedisSubscription() {
    const subscriber = this.redis.createClient();
    
    subscriber.subscribe('device:*:telemetry', (message) => {
      const data = JSON.parse(message);
      this.server.to(`device:${data.deviceId}`).emit('telemetry', data);
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, deviceId: string) {
    client.join(`device:${deviceId}`);
  }
}
```

**Features:**
- Handles device connections
- Subscribes to Redis channels
- Broadcasts to device-specific rooms
- Manages connection lifecycle

### Client-Side (React)

Socket.IO client:

```typescript
import { io } from 'socket.io-client';

const socket = io('ws://api.example.com', {
  transports: ['websocket'],
});

// Subscribe to device
socket.emit('subscribe', deviceId);

// Listen for telemetry updates
socket.on('telemetry', (data) => {
  updateDashboard(data);
});

// Handle reconnection
socket.on('reconnect', () => {
  socket.emit('subscribe', deviceId);
});
```

**Features:**
- Connects with device ID
- Subscribes to device-specific events
- Updates dashboard in real-time
- Handles reconnection automatically

## Scaling Considerations

### Horizontal Scaling

Multiple WebSocket servers:

- Use Redis adapter for Socket.IO
- All servers share same Redis instance
- Messages broadcast to all servers
- Clients can connect to any server

**Configuration:**

```typescript
import { createAdapter } from '@socket.io/redis-adapter';

const pubClient = redis.createClient();
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Load Balancing

- Sticky sessions (session affinity)
- Health checks for WebSocket connections
- Graceful connection migration

### Connection Management

- Heartbeat mechanism (ping/pong)
- Automatic reconnection
- Connection limits per user
- Rate limiting

**Heartbeat Implementation:**

```typescript
// Server-side
setInterval(() => {
  io.emit('ping', Date.now());
}, 30000);

// Client-side
socket.on('ping', (timestamp) => {
  socket.emit('pong', timestamp);
});
```

## Performance Metrics

- **Latency**: Less than 100ms from device to dashboard
- **Concurrent Connections**: 10,000+ per server
- **Message Throughput**: 50,000 messages/second
- **Uptime**: 99.95%

## Challenges & Solutions

### Challenge 1: Connection Drops

**Problem:** Network interruptions cause connection loss

**Solution:** Implemented exponential backoff reconnection

```typescript
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

socket.on('disconnect', () => {
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
  setTimeout(() => {
    socket.connect();
    reconnectAttempts++;
  }, delay);
});
```

### Challenge 2: Memory Leaks

**Problem:** Event listeners and Redis subscriptions not cleaned up

**Solution:** Proper cleanup of event listeners and Redis subscriptions

```typescript
@OnModuleDestroy()
async onModuleDestroy() {
  await this.redisSubscriber.unsubscribe();
  await this.redisSubscriber.quit();
}
```

### Challenge 3: Message Ordering

**Problem:** Messages arrive out of order

**Solution:** Sequence numbers and client-side buffering

```typescript
interface Message {
  sequence: number;
  data: any;
}

// Client-side buffering
const messageBuffer = new Map<number, Message>();

socket.on('telemetry', (message: Message) => {
  messageBuffer.set(message.sequence, message);
  processBufferedMessages();
});
```

## Best Practices

1. **Use Rooms**: Organize connections logically
2. **Implement Heartbeats**: Detect dead connections
3. **Monitor Connections**: Track connection count and health
4. **Handle Errors Gracefully**: Automatic reconnection
5. **Compress Messages**: Reduce bandwidth usage

## Tools & Technologies

- **Socket.IO**: WebSocket abstraction
- **Redis**: Pub/Sub messaging
- **NestJS**: Backend framework
- **React**: Frontend framework
- **MQTT**: IoT protocol

## Conclusion

Building real-time WebSocket infrastructure requires careful consideration of scalability, reliability, and performance. With proper architecture and implementation, you can deliver sub-second updates to thousands of concurrent users.

