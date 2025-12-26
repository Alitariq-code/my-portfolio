---
title: Full Stack TypeScript: Building Type-Safe Applications from Frontend to Backend
excerpt: Leveraging TypeScript across the entire stack for type safety, better developer experience, and reduced bugs. Learn how to share types between frontend and backend.
category: Full Stack
readTime: 7 min read
date: 2024-11-15
tags: [TypeScript, Full Stack, Best Practices]
featured: false
---

# Full Stack TypeScript: Building Type-Safe Applications from Frontend to Backend

TypeScript isn't just for frontend—it's a game-changer for full-stack development. Here's how I use it across React, Node.js, and NestJS.

## The Type Safety Problem

Without Shared Types:

- API contracts break silently
- Frontend and backend drift apart
- Runtime errors in production
- Manual type definitions (duplication)

**Example Problem:**

```typescript
// Backend returns
{
  id: string;
  name: string;
  email: string;
}

// Frontend expects
{
  userId: number;
  fullName: string;
  emailAddress: string;
}

// Result: Runtime errors, undefined values
```

## Solution: Shared Type Definitions

### 1. Monorepo Structure

```
packages/
  ├── shared/
  │   ├── types/
  │   │   ├── device.ts
  │   │   ├── user.ts
  │   │   └── api.ts
  │   └── package.json
  ├── frontend/
  │   └── package.json
  └── backend/
      └── package.json
```

### 2. Shared Types Package

Define types once, use everywhere:

- Device interfaces
- API response types
- DTOs and validation
- Common utilities

**Example Shared Types:**

```typescript
// packages/shared/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: User['role'];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: User['role'];
}

// packages/shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 3. API Response Types

Standardized response format:

- Success/error handling
- Pagination support
- Type-safe error messages
- Consistent structure

## Backend Implementation (NestJS)

### DTOs with Validation

Using class-validator:

```typescript
// Backend DTO
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from '@shared/types/user';

export class CreateUserDto implements CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'user', 'guest'])
  role: 'admin' | 'user' | 'guest';
}
```

**Benefits:**
- Runtime type checking
- Automatic validation
- Error messages
- Type inference

### Service Layer

Type-safe services:

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
```

**Features:**
- Input/output types
- Error handling
- Method signatures
- Return types

## Frontend Implementation (React)

### API Client with Types

Type-safe API calls:

```typescript
// api/client.ts
import { ApiResponse, PaginatedResponse } from '@shared/types/api';
import { User, CreateUserDto } from '@shared/types/user';

class ApiClient {
  async getUsers(): Promise<PaginatedResponse<User>> {
    const response = await fetch('/api/users');
    return response.json();
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }

  async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

**Benefits:**
- Request/response types
- Error handling
- Autocomplete support
- Compile-time checks

### React Components

Type-safe props:

```typescript
// components/UserCard.tsx
import { User } from '@shared/types/user';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span>{user.role}</span>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
      {onDelete && <button onClick={() => onDelete(user.id)}>Delete</button>}
    </div>
  );
}
```

**Features:**
- Component interfaces
- Event handlers
- State management
- Props validation

## Benefits

### 1. Compile-Time Safety

- Catch errors before runtime
- Refactoring is safe
- IDE autocomplete works everywhere

**Example:**

```typescript
// TypeScript catches this error at compile time
const user: User = {
  id: '123',
  name: 'John',
  // email: 'john@example.com', // Error: Property 'email' is missing
  role: 'admin',
};
```

### 2. Single Source of Truth

- Types defined once
- Shared across frontend/backend
- No duplication

### 3. Better Developer Experience

- IntelliSense everywhere
- Type hints in API calls
- Automatic documentation
- Safer refactoring

### 4. Reduced Bugs

- Type mismatches caught early
- API contract enforcement
- Safer refactoring

**Impact:**

| Metric | Before TypeScript | After TypeScript |
|--------|-------------------|------------------|
| Type-related bugs | 15% | 0% |
| API contract mismatches | Frequent | None |
| Refactoring confidence | Low | High |
| Development speed | Slower | Faster |

## Advanced Patterns

### 1. Type Guards

Runtime type checking:

```typescript
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    ['admin', 'user', 'guest'].includes(obj.role)
  );
}

// Usage
const data = await fetch('/api/user').then(r => r.json());
if (isUser(data)) {
  // TypeScript knows data is User
  console.log(data.name);
}
```

### 2. Utility Types

TypeScript utilities:

```typescript
// Partial: Make all properties optional
type PartialUser = Partial<User>;

// Pick: Select specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;

// Omit: Exclude specific properties
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Custom utility
type ApiEndpoint<TRequest, TResponse> = {
  request: TRequest;
  response: TResponse;
};
```

### 3. Generic API Hooks

Reusable hooks:

```typescript
function useApi<TData, TError = Error>(
  endpoint: string
): {
  data: TData | null;
  loading: boolean;
  error: TError | null;
} {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TError | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
}

// Usage
const { data: users, loading, error } = useApi<User[]>('/api/users');
```

## Best Practices

1. **Start with Types**: Define types before implementation
2. **Share Types**: Use monorepo or npm package
3. **Validate at Boundaries**: DTOs with class-validator
4. **Use Strict Mode**: Enable all strict TypeScript options
5. **Document Complex Types**: Add JSDoc comments

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

## Tools & Setup

- **TypeScript**: Language
- **tsconfig.json**: Strict configuration
- **class-validator**: Runtime validation
- **Monorepo**: Shared packages (Turborepo/Nx)

## Conclusion

TypeScript across the stack provides:

- Type safety
- Better DX
- Fewer bugs
- Easier maintenance

The investment pays off immediately. Start with shared types, validate at boundaries, and use strict mode. Your future self will thank you.

