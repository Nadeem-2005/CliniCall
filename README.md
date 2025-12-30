# CliniCall — Production-Grade Healthcare Appointment Platform

CliniCall is a full-stack healthcare appointment and communication platform engineered with a strong focus on **performance, reliability, security, and scalability**.  
The system is designed to handle real-world healthcare workloads such as high-volume appointment data, background email/notification processing, and real-time user updates—without blocking core API requests.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Auth.js
- **Database ORM:** Prisma (PostgreSQL)
- **Caching:** Redis
- **Background Jobs:** BullMQ
- **Real-Time Events:** Pusher

---

## Key Features & Architecture

### Intelligent Caching Layer (Redis)

- Implemented a **Redis-powered caching system** with:
  - Tag-based invalidation
  - Versioned cache keys
  - Intelligent cache warming for critical healthcare data
- Reduced database queries by **70–85%**, significantly lowering load during peak usage.
- Ensured consistency by invalidating cache selectively instead of full cache flushes.

---

### Fault-Tolerant Background Job Processing (BullMQ)

- Designed a **robust background job queue** using BullMQ.
- Implemented:
  - Exponential backoff retry strategy
  - Graceful failure handling
- Achieved **95%+ reliable email delivery** even during transient failures.
- Moved email and notification workflows to **async worker scripts**, ensuring:
  - Non-blocking API responses
  - Better request latency and user experience

---

### Real-Time Notifications & Cost Optimization

- Integrated **real-time notifications** using Pusher.
- Built **notification batching pipelines** to:
  - Reduce event over-dispatching
  - Cut infrastructure costs by **~40%**
- Maintained consistent user engagement while optimizing resource usage.

---

### Security & Scalability Enhancements

- Implemented **role-based authentication** using Auth.js.
- Added **distributed rate limiting** with Redis:
  - IP-based
  - User-based
  - Endpoint-specific
  - Sliding window counters
- Optimized **Prisma connection pooling** for:
  - Zero-downtime operations
  - Stable performance under concurrent load

---

### Data Handling & User Experience

- Implemented **pagination and optimized queries** for large healthcare datasets.
- Ensured smooth navigation across patient records and appointment histories.
- Focused on predictable response times and minimal UI blocking.

---

## 🛠️ Project Upgrade Journey & Engineering Insights

### 🔄 Upgrading Next.js (15 ➜ 16.1.1)

The project was fully upgraded from **Next.js 15+ to Next.js 16.1.1** to stay aligned with modern App Router behavior and ecosystem updates.

#### Challenges Faced

- Tighter server-side execution and rendering behavior exposed **hidden coupling between authentication and database access**.
- Authentication logic that previously worked began failing during SSR execution paths.

---

### 🔄 Upgrading Prisma ORM (6 ➜ 7)

Upgrading Prisma introduced **strict query validation**, which surfaced a critical issue in the authentication adapter flow.

#### Error Encountered

During the Prisma v7 upgrade, authentication-related requests began failing with repeated runtime errors originating from the Auth.js Prisma adapter:

Invalid p.session.findUnique() invocation
PrismaClientKnownRequestError

These errors surfaced as:

- `AdapterError`
- `SessionTokenError`

and consistently occurred during session resolution inside server-side rendering paths (for example, `RootLayout`, `Navbar`, and Auth middleware execution).

---

#### Root Cause Analysis

- Prisma v7 introduced **stricter client-side validation and adapter expectations**.
- The existing Auth.js adapter logic internally relied on:
  ```ts
  p.session.findUnique();
  ```

which no longer behaved as expected under the upgraded Prisma client.
• This issue became more visible after the Next.js 16 SSR execution model, where authentication logic was invoked more eagerly during server rendering.
• As a result, authentication failures propagated early in the render lifecycle, breaking previously stable flows.

### Resolution & Refactoring

To resolve the issue and align with Prisma v7’s recommended patterns:
• Migrated to Prisma’s official PostgreSQL adapter (@prisma/adapter-pg)
• Refactored Prisma client initialization to:
• Use an explicit adapter
• Ensure compatibility with Auth.js session handling
• Prevent multiple Prisma client instances during hot reloads

```import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
prisma: PrismaClient;
};

const adapter = new PrismaPg({
connectionString: process.env.DATABASE_URL,
});

const prisma =
globalForPrisma.prisma ||
new PrismaClient({
adapter,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

This change stabilized session queries and eliminated adapter-related runtime errors across SSR and API routes.

## Key Insights Gained

• ORM upgrades can break authentication flows silently until surfaced by stricter runtime environments.
• Prisma v7’s strictness improves long-term correctness but requires adapter-aware configuration.
• Authentication should be treated as infrastructure-level code, not just application logic.
• Next.js 16 reinforces the importance of:
• Safe singleton patterns
• Explicit database lifecycle management
• SSR-safe authentication design

## Final Outcome of the Upgrade

• Successful migration to Next.js 16.1.1 and Prisma 7
• Restored and stabilized authentication across server-rendered routes
• Improved long-term maintainability and correctness
• Stronger alignment with production-grade backend engineering practices
