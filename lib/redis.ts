import Redis from "ioredis";

// Redis client configuration
console.log(
  process.env.REDIS_URL
    ? "Using Upstash Redis URL"
    : "Using local Redis configuration"
);
const redis = new Redis(process.env.REDIS_URL!, {
  //the 3 comments below are for local development
  // host: process.env.REDIS_HOST || "localhost",
  // port: parseInt(process.env.REDIS_PORT || "6379"),
  // password: process.env.REDIS_PASSWORD,

  //the line below is for production using Upstash

  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 2000); // exponential backoff
    return delay;
  },
});

// Handle Redis connection events
redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redis.on("reconnecting", () => {
  console.log("Reconnecting to Redis...");
});

// Cache helper functions
export const cache = {
  // Get cached data
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  },

  // Set cached data with TTL (Time To Live) in seconds
  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }
  },

  // Delete cached data
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }
  },

  // Delete multiple keys with pattern
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        return await redis.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error("Cache delete pattern error:", error);
      return 0;
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Cache exists error:", error);
      return false;
    }
  },

  // Get TTL of a key
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error("Cache TTL error:", error);
      return -1;
    }
  },
};

export default redis;
