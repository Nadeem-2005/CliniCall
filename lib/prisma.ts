// // lib/prisma.ts
// import { PrismaClient } from "../app/generated/prisma";

// // Global variable to store Prisma client instance
// declare global {
//   var __prisma: PrismaClient | undefined;
// }

// // Prisma client with optimized configuration
// const createPrismaClient = () => {
//   return new PrismaClient({
//     datasources: {
//       db: {
//         url: process.env.DATABASE_URL,
//       },
//     },
//     // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//   });
// };

// // Singleton pattern for Prisma client to prevent multiple instances
// const prisma = globalThis.__prisma ?? createPrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.__prisma = prisma;
// }

// // Connection pool optimization
// prisma.$connect().catch((error) => {
//   console.error("Failed to connect to database:", error);
// });

// // Graceful shutdown
// process.on("beforeExit", async () => {
//   await prisma.$disconnect();
// });

// export default prisma;
// lib/prisma.ts
import { PrismaClient } from "../app/generated/prisma";

declare global {
  // Prevent multiple instances in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
