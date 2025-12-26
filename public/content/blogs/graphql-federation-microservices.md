---
title: GraphQL Federation: Building Distributed GraphQL APIs Across Microservices
excerpt: Master GraphQL Federation to build scalable, distributed GraphQL APIs. Learn Apollo Federation patterns, schema composition, entity resolution, and how to federate multiple microservices into a unified GraphQL API.
category: Backend
readTime: 16 min read
date: 2024-12-16
tags: [GraphQL, Federation, Microservices, Apollo, API Design]
featured: true
---

# GraphQL Federation: Building Distributed GraphQL APIs Across Microservices

GraphQL Federation enables teams to build a unified GraphQL API from multiple independent GraphQL services. This approach allows different teams to own and evolve their services independently while presenting a single, cohesive API to clients. This comprehensive guide explores federation patterns, implementation strategies, and best practices.

## Understanding GraphQL Federation

Traditional monolithic GraphQL APIs face challenges:
- Single team bottleneck
- Tight coupling between domains
- Difficult to scale teams
- Schema conflicts and merge conflicts

GraphQL Federation solves these by:
- **Distributed Ownership**: Each team owns their subgraph
- **Schema Composition**: Automatic composition of subgraphs
- **Entity Resolution**: Cross-service data fetching
- **Independent Deployment**: Deploy services independently

## Federation Architecture

```
Client Application
    ↓
Gateway (Apollo Router / Apollo Gateway)
    ↓
Subgraph Services
    ├── User Service (users.graphql)
    ├── Product Service (products.graphql)
    ├── Order Service (orders.graphql)
    └── Review Service (reviews.graphql)
    ↓
Backend Services
    ├── PostgreSQL
    ├── MongoDB
    └── Redis
```

## Core Concepts

### 1. Subgraphs

A subgraph is an independent GraphQL service that defines part of the overall schema.

```graphql
# User Service Subgraph
extend type Query {
  user(id: ID!): User
  users: [User!]!
}

type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]! @requires(fields: "id")
}

# Product Service Subgraph
extend type Query {
  product(id: ID!): Product
  products: [Product!]!
}

type Product @key(fields: "id") {
  id: ID!
  name: String!
  price: Float!
  reviews: [Review!]!
}

# Order Service Subgraph
type Order @key(fields: "id") {
  id: ID!
  userId: ID!
  productId: ID!
  quantity: Int!
  user: User @provides(fields: "id")
  product: Product @provides(fields: "id")
}
```

### 2. Entity Keys

Entities are types that can be referenced across subgraphs using `@key` directive.

```graphql
type User @key(fields: "id") {
  id: ID!
  name: String!
}

# In another subgraph
type Order {
  userId: ID!
  user: User @provides(fields: "id")
}
```

### 3. Schema Composition

The gateway automatically composes subgraphs into a unified schema:

```graphql
# Composed Schema
type Query {
  user(id: ID!): User
  users: [User!]!
  product(id: ID!): Product
  products: [Product!]!
  order(id: ID!): Order
}

type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Product {
  id: ID!
  name: String!
  price: Float!
  reviews: [Review!]!
}

type Order {
  id: ID!
  userId: ID!
  productId: ID!
  user: User
  product: Product
}
```

## Implementation: Apollo Federation

### 1. User Service Implementation

```typescript
// user-service/src/schema.ts
import { gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
    orders: [Order!]!
  }

  type Order @extends @key(fields: "id") {
    id: ID! @external
    userId: ID! @external
  }
`;

export const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, { dataSources }: any) => {
      return dataSources.userAPI.getUser(id);
    },
    users: async (_: any, __: any, { dataSources }: any) => {
      return dataSources.userAPI.getUsers();
    },
  },
  User: {
    __resolveReference: async (reference: { id: string }, { dataSources }: any) => {
      return dataSources.userAPI.getUser(reference.id);
    },
    orders: async (user: { id: string }, __: any, { dataSources }: any) => {
      return dataSources.orderAPI.getOrdersByUserId(user.id);
    },
  },
};

export const schema = buildSubgraphSchema({ typeDefs, resolvers });
```

```typescript
// user-service/src/server.ts
import { ApolloServer } from 'apollo-server';
import { schema } from './schema';
import { UserDataSource } from './datasources/user';

const server = new ApolloServer({
  schema,
  dataSources: () => ({
    userAPI: new UserDataSource(),
  }),
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`User service ready at ${url}`);
});
```

### 2. Product Service Implementation

```typescript
// product-service/src/schema.ts
import { gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';

export const typeDefs = gql`
  extend type Query {
    product(id: ID!): Product
    products: [Product!]!
  }

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    description: String
    price: Float!
    reviews: [Review!]!
  }

  type Review @extends @key(fields: "id") {
    id: ID! @external
    productId: ID! @external
  }
`;

export const resolvers = {
  Query: {
    product: async (_: any, { id }: { id: string }, { dataSources }: any) => {
      return dataSources.productAPI.getProduct(id);
    },
    products: async (_: any, __: any, { dataSources }: any) => {
      return dataSources.productAPI.getProducts();
    },
  },
  Product: {
    __resolveReference: async (reference: { id: string }, { dataSources }: any) => {
      return dataSources.productAPI.getProduct(reference.id);
    },
    reviews: async (product: { id: string }, __: any, { dataSources }: any) => {
      return dataSources.reviewAPI.getReviewsByProductId(product.id);
    },
  },
};

export const schema = buildSubgraphSchema({ typeDefs, resolvers });
```

### 3. Order Service Implementation

```typescript
// order-service/src/schema.ts
import { gql } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';

export const typeDefs = gql`
  extend type Query {
    order(id: ID!): Order
    orders(userId: ID!): [Order!]!
  }

  type Order @key(fields: "id") {
    id: ID!
    userId: ID!
    productId: ID!
    quantity: Int!
    total: Float!
    status: OrderStatus!
    user: User!
    product: Product!
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  type User @extends @key(fields: "id") {
    id: ID! @external
  }

  type Product @extends @key(fields: "id") {
    id: ID! @external
  }
`;

export const resolvers = {
  Query: {
    order: async (_: any, { id }: { id: string }, { dataSources }: any) => {
      return dataSources.orderAPI.getOrder(id);
    },
    orders: async (_: any, { userId }: { userId: string }, { dataSources }: any) => {
      return dataSources.orderAPI.getOrdersByUserId(userId);
    },
  },
  Order: {
    __resolveReference: async (reference: { id: string }, { dataSources }: any) => {
      return dataSources.orderAPI.getOrder(reference.id);
    },
    user: async (order: { userId: string }, __: any, { dataSources }: any) => {
      // This will be resolved by the User service
      return { __typename: 'User', id: order.userId };
    },
    product: async (order: { productId: string }, __: any, { dataSources }: any) => {
      // This will be resolved by the Product service
      return { __typename: 'Product', id: order.productId };
    },
  },
};

export const schema = buildSubgraphSchema({ typeDefs, resolvers });
```

### 4. Apollo Gateway Setup

```typescript
// gateway/src/index.ts
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'user', url: 'http://localhost:4001/graphql' },
    { name: 'product', url: 'http://localhost:4002/graphql' },
    { name: 'order', url: 'http://localhost:4003/graphql' },
    { name: 'review', url: 'http://localhost:4004/graphql' },
  ],
  // Poll for schema updates
  pollIntervalInMs: 10000,
});

const server = new ApolloServer({
  gateway,
  subscriptions: false, // Subscriptions not supported in federation
  context: ({ req }) => {
    // Forward auth token to subgraphs
    return {
      token: req.headers.authorization || '',
    };
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Gateway ready at ${url}`);
});
```

## Advanced Federation Patterns

### 1. Entity Resolution with External Fields

```graphql
# User Service
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]! @requires(fields: "id")
}

# Order Service
type Order @key(fields: "id") {
  id: ID!
  userId: ID!
  user: User @provides(fields: "id name")
}

type User @extends @key(fields: "id") {
  id: ID! @external
  name: String! @external
}
```

### 2. Value Types

```graphql
# Shared value types across subgraphs
type Money {
  amount: Float!
  currency: String!
}

# Used in multiple subgraphs
type Product {
  id: ID!
  price: Money!
}

type Order {
  id: ID!
  total: Money!
}
```

### 3. Interface Federation

```graphql
# Base interface
interface Node {
  id: ID!
}

# Implemented across subgraphs
type User implements Node @key(fields: "id") {
  id: ID!
  name: String!
}

type Product implements Node @key(fields: "id") {
  id: ID!
  name: String!
}
```

## Query Planning and Execution

### Query Planning

When a client sends a query, the gateway:

1. **Parses Query**: Validates against composed schema
2. **Creates Query Plan**: Determines which subgraphs to query
3. **Executes Plan**: Sends queries to subgraphs in parallel when possible
4. **Merges Results**: Combines responses from multiple subgraphs

```graphql
# Client Query
query {
  user(id: "1") {
    name
    email
    orders {
      id
      total
      product {
        name
        price
      }
    }
  }
}
```

**Query Plan:**
1. Query User service for user(id: "1")
2. Query Order service for orders(userId: "1")
3. For each order, query Product service for product(id: order.productId)
4. Merge all results

### Optimizing Query Plans

```typescript
// Batch entity resolution
const gateway = new ApolloGateway({
  serviceList: [...],
  buildService: (definition) => {
    return new RemoteGraphQLDataSource({
      url: definition.url,
      willSendRequest: ({ request, context }) => {
        // Add batching
        request.http.headers.set('apollo-federation-include-trace', 'ftv1');
      },
    });
  },
});
```

## Error Handling

### Partial Results

```typescript
// Handle partial failures gracefully
const resolvers = {
  User: {
    orders: async (user: { id: string }, __: any, { dataSources }: any) => {
      try {
        return await dataSources.orderAPI.getOrdersByUserId(user.id);
      } catch (error) {
        // Log error but don't fail entire query
        console.error('Failed to fetch orders:', error);
        return [];
      }
    },
  },
};
```

### Error Extensions

```typescript
import { GraphQLError } from 'graphql';

throw new GraphQLError('User not found', {
  extensions: {
    code: 'USER_NOT_FOUND',
    service: 'user-service',
    timestamp: new Date().toISOString(),
  },
});
```

## Performance Optimization

### Caching Strategies

```typescript
// Gateway-level caching
import { ApolloServerPluginCacheControl } from 'apollo-server-plugin-cache-control';

const server = new ApolloServer({
  gateway,
  plugins: [
    ApolloServerPluginCacheControl({
      defaultMaxAge: 60, // 60 seconds
    }),
  ],
});
```

### DataLoader for Batching

```typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds: string[]) => {
  const users = await db.users.findMany({
    where: { id: { in: userIds } },
  });
  
  return userIds.map(id => users.find(u => u.id === id));
});

// In resolver
User: {
  __resolveReference: async (reference: { id: string }) => {
    return userLoader.load(reference.id);
  },
}
```

## Security Considerations

### Authentication and Authorization

```typescript
// Gateway context
const server = new ApolloServer({
  gateway,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = verifyToken(token);
    return { user, token };
  },
});

// Forward to subgraphs
const gateway = new ApolloGateway({
  serviceList: [...],
  buildService: (definition) => {
    return new RemoteGraphQLDataSource({
      url: definition.url,
      willSendRequest: ({ request, context }) => {
        if (context.token) {
          request.http.headers.set('authorization', context.token);
        }
      },
    });
  },
});
```

### Rate Limiting

```typescript
import { createRateLimitDirective } from 'graphql-rate-limit';

const rateLimitDirective = createRateLimitDirective({
  identifyContext: (ctx) => ctx.user?.id,
});

const server = new ApolloServer({
  schema: rateLimitDirective(schema),
});
```

## Testing Federation

### Integration Testing

```typescript
import { createTestClient } from 'apollo-server-testing';
import { ApolloGateway } from '@apollo/gateway';

describe('Federation Gateway', () => {
  let gateway: ApolloGateway;
  let testClient: any;

  beforeAll(async () => {
    gateway = new ApolloGateway({
      serviceList: [
        { name: 'user', url: 'http://localhost:4001/graphql' },
        { name: 'product', url: 'http://localhost:4002/graphql' },
      ],
    });

    const server = new ApolloServer({ gateway });
    testClient = createTestClient(server);
  });

  it('should resolve user with orders', async () => {
    const query = `
      query {
        user(id: "1") {
          name
          orders {
            id
            product {
              name
            }
          }
        }
      }
    `;

    const result = await testClient.query({ query });
    expect(result.data.user.name).toBeDefined();
    expect(result.data.user.orders).toBeDefined();
  });
});
```

## Monitoring and Observability

### Apollo Studio Integration

```typescript
const server = new ApolloServer({
  gateway,
  plugins: [
    // Apollo Studio integration
    require('apollo-server-plugin-response-cache')({
      sessionId: (requestContext) => requestContext.request.http.headers.get('session-id'),
    }),
  ],
  // Enable tracing
  tracing: true,
});
```

### Custom Metrics

```typescript
import { createPrometheusMetricsPlugin } from 'apollo-server-prometheus';

const server = new ApolloServer({
  gateway,
  plugins: [
    createPrometheusMetricsPlugin({
      requestDuration: true,
      requestCount: true,
      errors: true,
    }),
  ],
});
```

## Best Practices

1. **Design for Federation**: Plan entity relationships early
2. **Use @key Wisely**: Choose stable, unique fields
3. **Minimize Cross-Service Calls**: Batch when possible
4. **Handle Partial Failures**: Graceful degradation
5. **Monitor Performance**: Track query execution times
6. **Version Subgraphs**: Support schema evolution
7. **Document Entities**: Clear ownership and contracts

## Conclusion

GraphQL Federation enables teams to build scalable, distributed GraphQL APIs while maintaining independent service ownership. By following federation patterns and best practices, you can create a unified API that scales with your organization while allowing teams to move fast and independently.

The key to successful federation is careful schema design, proper entity resolution, and continuous monitoring of query performance across services.

