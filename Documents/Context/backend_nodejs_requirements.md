# Backend Requirements - General Node.js Best Practices

## Project Overview
This document outlines comprehensive backend development requirements and best practices for Node.js applications. The guidelines focus on modern JavaScript/TypeScript development standards, performance optimization, maintainability, and scalability principles that apply to any Node.js project using the latest Node.js 23+ features and modern ecosystem tools.

## Core Technology Stack Requirements

### Runtime & Language
- **Runtime**: Node.js 23+ (mandatory - leverage latest features including native TypeScript support)
- **Language**: TypeScript 5.7+ (strictly enforced - utilize native Node.js TypeScript support when available)
- **Package Manager**: 
  - **Primary**: pnpm 9+ (recommended for performance and security)
  - **Alternative**: npm 11+ with proper lockfile management
  - **Enterprise**: Yarn 4+ for enterprise environments requiring specific features
- **Module System**: ECMAScript Modules (ESM) exclusively - no CommonJS for new projects
- **Build Tools**: 
  - **Development**: Native Node.js TypeScript support (Node.js 23+) or tsx for older versions
  - **Production**: tsc or swc for high-performance compilation
  - **Bundling**: esbuild or Rollup for optimized production bundles when needed

### Framework Selection & Architecture
- **Web Frameworks**: 
  - **Enterprise/Large-Scale**: NestJS 10+ for OOP and complex applications
  - **High-Performance APIs**: Fastify 5+ for lightweight, fast applications
  - **Traditional/Familiar**: Express 5+ for simple, well-understood applications
  - **Modern Alternative**: Koa 2+ for next-generation middleware patterns
- **API Standards**: 
  - **REST**: OpenAPI 3.1+ specification compliance
  - **GraphQL**: Apollo Server 4+ or type-graphql for type-safe GraphQL APIs
  - **Real-time**: Socket.IO 4+ or native WebSockets for real-time features

### Database & Data Management
- **SQL Databases**: 
  - **Primary**: PostgreSQL 16+ (recommended for ACID compliance and advanced features)
  - **Alternative**: MySQL 8.4+ or MariaDB 11+ for compatibility requirements
- **NoSQL Databases**: 
  - **Document**: MongoDB 8+ with Mongoose 8+ ODM
  - **Key-Value**: Redis 7+ for caching and session management
  - **Graph**: Neo4j 5+ for complex relationship modeling
- **ORMs/Query Builders**: 
  - **Type-Safe**: Prisma 6+ or Drizzle ORM for modern type-safe database access
  - **Traditional**: TypeORM 0.3+ or Sequelize 6+ for established patterns
  - **Lightweight**: Kysely for SQL query building with TypeScript

### File Naming Conventions & Project Structure
- **Source Files**: camelCase with descriptive names (e.g., `userService.ts`, `authController.ts`)
- **Modules/Packages**: kebab-case (e.g., `user-management`, `auth-service`)
- **Classes**: PascalCase (e.g., `UserService`, `DatabaseConnection`)
- **Interfaces/Types**: PascalCase with descriptive prefixes (e.g., `IUserRepository`, `UserCreateRequest`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`, `DEFAULT_TIMEOUT`)
- **Environment Files**: `.env` for development, `.env.production` for production-specific variables
- **Test Files**: `*.test.ts` or `*.spec.ts` alongside source files or in dedicated `__tests__` directories

## Node.js 23+ Features & Modern Development

#### ESM-First Development
- **Pure ESM**: Use ECMAScript modules exclusively for new projects
- **Top-Level Await**: Leverage top-level await for cleaner async initialization
- **Import Maps**: Use import maps for clean path resolution
- **Dynamic Imports**: Use dynamic imports for code splitting and lazy loading

### Modern Node.js Features Usage

#### Performance Enhancements
- **V8 Code Caching**: Leverage built-in on-disk code caching for faster startup
- **Worker Threads**: Use worker threads for CPU-intensive operations
- **AsyncLocalStorage**: Use for request context tracking without explicit passing
- **AbortController**: Implement proper request cancellation and timeout handling
- **Streams**: Use Node.js streams for memory-efficient data processing

#### Security & Reliability Features
- **Permission Model**: Use Node.js permission model for enhanced security
- **Crypto Web APIs**: Leverage Web Crypto API for cryptographic operations
- **Fetch API**: Use native fetch instead of external HTTP clients when appropriate
- **Test Runner**: Use Node.js built-in test runner for testing without external dependencies

### Component Architecture Requirements

#### Modular Component Design
- **Business Components**: Structure code around business domains, not technical concerns
- **Autonomous Modules**: Each component should have its own API, logic, and data access
- **Clear Boundaries**: Implement clear interfaces between components to prevent tight coupling
- **Dependency Injection**: Use dependency injection for better testability and modularity
#### Service Layer Implementation
- **Business Logic Separation**: All business logic resides in service classes
- **Single Responsibility**: Each service handles one business domain
- **Interface Contracts**: Define clear interfaces for all services
- **Error Handling**: Implement comprehensive error handling with custom error classes
- **Async/Await**: Use async/await exclusively, avoid callbacks and Promise chains

#### Repository Pattern (When Appropriate)
- **Data Access Abstraction**: Abstract database operations behind repository interfaces
- **Technology Agnostic**: Keep business logic independent of specific database technologies
- **Testing Support**: Enable easy mocking for unit tests
- **Query Optimization**: Implement efficient querying patterns and caching strategies

## Modern Development Patterns

### Error Handling & Resilience
- **Custom Error Classes**: Extend built-in Error class for application-specific errors
- **Operational vs Programming Errors**: Distinguish between recoverable and non-recoverable errors
- **Centralized Error Handling**: Implement centralized error handling middleware
- **Circuit Breaker Pattern**: Implement circuit breakers for external service calls
- **Retry Logic**: Implement exponential backoff for transient failures
- **Graceful Degradation**: Design systems to continue operating with reduced functionality
### API Development Best Practices
- **OpenAPI Documentation**: Generate API documentation from code using decorators or schemas
- **Input Validation**: Use libraries like Zod or Joi for runtime type validation
- **Rate Limiting**: Implement rate limiting to prevent abuse and ensure fair usage
- **API Versioning**: Design APIs with versioning strategy from the start
- **Response Serialization**: Use consistent response formats with proper HTTP status codes
- **Request/Response Logging**: Implement comprehensive logging for debugging and monitoring
- **CORS Configuration**: Properly configure Cross-Origin Resource Sharing for web applications

### Security Best Practices
- **Input Sanitization**: Sanitize all inputs to prevent injection attacks
- **Authentication**: Implement JWT-based authentication with refresh token rotation
- **Authorization**: Use role-based or attribute-based access control
- **Security Headers**: Set appropriate security headers using helmet.js or similar
- **Secrets Management**: Use environment variables and secret management systems
- **SQL Injection Prevention**: Use parameterized queries and ORM/ODM protection
- **XSS Prevention**: Implement proper output encoding and CSP headers
- **CSRF Protection**: Implement CSRF protection for state-changing operations

## Performance & Optimization

### Runtime Performance Optimization
- **Event Loop Monitoring**: Monitor event loop lag and optimize blocking operations
- **Memory Management**: Implement proper memory management and leak detection
- **CPU Profiling**: Regular CPU profiling to identify performance bottlenecks
- **Clustering**: Use Node.js cluster module or PM2 for multi-core utilization
- **Caching Strategies**: Implement multi-layer caching (memory, Redis, CDN)
- **Connection Pooling**: Use connection pooling for database and external service connections

### Database Performance
- **Query Optimization**: Analyze and optimize database queries
- **Indexing Strategy**: Implement comprehensive database indexing
- **Connection Management**: Proper database connection lifecycle management
- **Read Replicas**: Use read replicas for read-heavy applications
- **Query Caching**: Implement query result caching where appropriate
- **Batch Operations**: Use batch operations for bulk data processing

### Microservices & Scalability Patterns
- **Service Discovery**: Implement service discovery mechanisms
- **Load Balancing**: Design for horizontal scaling with load balancers
- **Message Queues**: Use message queues for asynchronous processing
- **Event-Driven Architecture**: Implement event-driven patterns for loose coupling
- **API Gateway**: Use API gateways for service orchestration and cross-cutting concerns
- **Distributed Tracing**: Implement distributed tracing for microservices debugging

## Testing Strategy & Requirements

### Testing Pyramid Implementation
- **Unit Tests (70%)**: Test individual functions and classes in isolation
- **Integration Tests (20%)**: Test component interactions and database operations
- **End-to-End Tests (10%)**: Test complete application workflows

### Testing Tools & Frameworks
- **Test Runners**: 
  - **Built-in**: Node.js native test runner for simple testing needs
  - **Feature-Rich**: Jest 29+ for comprehensive testing with mocking capabilities
  - **Modern**: Vitest for fast, modern testing with native ESM support
- **Assertion Libraries**: Built-in Node.js assert or Chai for expressive assertions
- **Mocking**: Jest mocks, Sinon.js, or MSW for API mocking
- **E2E Testing**: Playwright or Cypress for browser-based testing
- **Load Testing**: Artillery or k6 for performance testing

### Testing Best Practices
- **Test Organization**: Follow AAA pattern (Arrange, Act, Assert)
- **Test Isolation**: Each test should be independent and repeatable
- **Mock External Dependencies**: Mock external APIs, databases, and services
- **Test Coverage**: Maintain minimum 80% code coverage with meaningful tests
- **Error Path Testing**: Test error conditions and edge cases
- **Performance Testing**: Include performance benchmarks in test suites

## Code Quality & Standards

### ESLint & Code Quality Configuration
- **ESLint Configuration**: Use @typescript-eslint/recommended with Node.js specific rules
- **Prettier Integration**: Consistent code formatting with Prettier
- **Pre-commit Hooks**: Use Husky and lint-staged for pre-commit quality checks
- **Static Analysis**: Use SonarQube or CodeClimate for code quality analysis
- **Import Organization**: Use eslint-plugin-import for consistent import ordering
- **Security Linting**: Use eslint-plugin-security for security vulnerability detection

### TypeScript Best Practices
- **Strict Configuration**: Enable all strict TypeScript compiler options
- **Type Safety**: Define comprehensive interfaces for all data structures
- **Generic Types**: Use generics for reusable type definitions
- **Utility Types**: Leverage TypeScript utility types (Pick, Omit, Partial, etc.)
- **Path Mapping**: Configure path mapping for clean import statements
- **No any Types**: Avoid any type, use unknown or proper types
- **Runtime Validation**: Combine compile-time types with runtime validation

### Coding Conventions & Style Guide
- **Naming Conventions**: Follow established JavaScript/TypeScript naming patterns
- **Function Design**: Prefer pure functions and avoid side effects where possible
- **Async Patterns**: Use async/await consistently, avoid callback patterns
- **Error Handling**: Use try/catch blocks and proper error propagation
- **Code Organization**: Organize code by feature/domain rather than by technical type
- **Documentation**: Use JSDoc comments for public APIs and complex logic

## Build & Production Readiness

### Build-First Development Philosophy
Writing code with production considerations ensures deployment readiness and prevents runtime issues:

#### Node.js Application Build Requirements
- **Zero TypeScript Errors**: All code must compile without TypeScript errors
- **ESLint Compliance**: Code must pass all ESLint rules without warnings or errors
- **Test Coverage**: All tests must pass with required coverage thresholds
- **Dependency Security**: No known security vulnerabilities in dependencies
- **Environment Validation**: All required environment variables must be properly configured
- **Build Performance**: Optimize build times for faster development and deployment cycles

#### Production Optimization Standards
- **Bundle Analysis**: Analyze and optimize production bundle sizes
- **Tree Shaking**: Ensure effective tree shaking to eliminate dead code
- **Code Splitting**: Implement appropriate code splitting strategies
- **Minification**: Use proper minification for production builds
- **Source Maps**: Generate source maps for production debugging
- **Asset Optimization**: Optimize static assets and implement proper caching headers

#### Deployment & Runtime Configuration
- **Environment Separation**: Clear separation between development, staging, and production
- **Health Checks**: Implement comprehensive health check endpoints
- **Graceful Shutdown**: Handle SIGTERM and SIGINT signals for graceful shutdowns
- **Process Management**: Use PM2, Docker, or Kubernetes for process management
- **Logging Configuration**: Structured logging with appropriate log levels
- **Monitoring Integration**: APM and error tracking service integration

## Monitoring & Observability

### Application Performance Monitoring
- **APM Integration**: Use APM tools like New Relic, Datadog, or open-source alternatives
- **Error Tracking**: Implement error tracking with Sentry or similar services
- **Custom Metrics**: Define and track business-specific metrics
- **Performance Profiling**: Regular performance profiling and optimization
- **Memory Leak Detection**: Monitor and detect memory leaks in production
- **Database Monitoring**: Monitor database performance and query execution

### Logging & Debugging
- **Structured Logging**: Use structured logging with JSON format
- **Log Levels**: Implement appropriate log levels (error, warn, info, debug)
- **Request Tracing**: Implement request tracing with correlation IDs
- **Centralized Logging**: Use centralized logging systems (ELK stack, Fluentd)
- **Debug Information**: Include relevant context in log messages
- **Log Rotation**: Implement proper log rotation and retention policies

### Security Monitoring
- **Security Scanning**: Regular dependency vulnerability scanning
- **Runtime Security**: Monitor for suspicious activities and patterns
- **Access Logging**: Log all access attempts and authentication events
- **Audit Trails**: Maintain audit trails for sensitive operations
- **Compliance Monitoring**: Monitor compliance with security standards
- **Incident Response**: Implement incident response procedures and playbooks

## Package Management & Dependencies

### Dependency Management Best Practices
- **Semantic Versioning**: Use appropriate semantic versioning constraints
- **Lock Files**: Commit and maintain package lock files
- **Regular Updates**: Regular dependency updates with security focus
- **Bundle Size Analysis**: Monitor and optimize dependency bundle sizes
- **License Compliance**: Track and ensure license compliance
- **Private Packages**: Use private npm registries for proprietary code

### Popular Node.js Ecosystem Libraries

| Category | Recommended Libraries | Alternatives |
|----------|----------------------|--------------|
| Web Framework | Fastify, NestJS, Express | Koa, Hapi |
| Database ORM | Prisma, Drizzle | TypeORM, Sequelize |
| Validation | Zod, Joi | Yup, class-validator |
| HTTP Client | Axios, node-fetch | got, undici |
| Testing | Jest, Vitest | Mocha, Ava |
| Logging | Winston, Pino | Bunyan, log4js |
| Authentication | Passport, jose | jsonwebtoken, auth0 |
| File Processing | Multer, formidable | express-fileupload |
| Task Queues | Bull, Agenda | Bee-queue |
| Config Management | convict, env-var | dotenv, config |

## AI Assistant Guidelines

When working with these requirements:

### Code Generation Guidelines
1. Always use Node.js 23+ features and TypeScript 5.7+ syntax
2. Implement ESM modules exclusively with proper import/export statements
3. Use async/await patterns consistently, avoiding callbacks and Promise chains
4. Follow established TypeScript and JavaScript naming conventions
5. Implement comprehensive error handling with custom error classes
6. Use native Node.js features when available instead of third-party alternatives
7. Ensure all code is production-ready with proper error handling and validation
8. Leverage Node.js native TypeScript support when generating TypeScript code

### Architecture Guidelines
1. Structure applications by business components, not technical layers
2. Implement proper dependency injection and inversion of control
3. Use service layer pattern for business logic organization
4. Design for testability with clear separation of concerns
5. Follow SOLID principles in class and module design
6. Implement proper caching strategies at multiple levels
7. Design for horizontal scaling and microservices architecture
8. Use event-driven patterns for loose coupling between components

### Performance Guidelines
1. Optimize for Node.js single-threaded event loop characteristics
2. Use worker threads for CPU-intensive operations
3. Implement proper connection pooling and resource management
4. Use streaming APIs for large data processing
5. Implement efficient caching strategies (memory, Redis, CDN)
6. Monitor and optimize memory usage and garbage collection
7. Use clustering or process management for multi-core utilization
8. Implement proper rate limiting and backpressure handling

### Security Guidelines
1. Validate all inputs using runtime validation libraries (Zod, Joi)
2. Implement proper authentication and authorization mechanisms
3. Use parameterized queries and ORM protection against injection attacks
4. Set appropriate security headers and CORS policies
5. Implement proper secret management and environment variable usage
6. Use HTTPS and secure communication protocols
7. Implement audit logging for security-sensitive operations
8. Regular security dependency scanning and updates

### Best Practice Enforcement
1. Use TypeScript strict mode with comprehensive type definitions
2. Implement comprehensive error handling with proper error classes
3. Use ESM modules with proper import/export patterns
4. Follow RESTful API design principles with OpenAPI documentation
5. Implement proper logging with structured data and correlation IDs
6. Use modern Node.js features and avoid deprecated patterns
7. Write comprehensive tests with good coverage and meaningful assertions
8. Implement proper build and deployment pipelines with quality gates

This document serves as a comprehensive guide for Node.js development, focusing on modern JavaScript/TypeScript features, Node.js 23+ capabilities, performance optimization, security best practices, and maintainability. The requirements should be adapted based on specific project needs while maintaining the core principles outlined here.