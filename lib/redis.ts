import Redis from "ioredis";

// Redis operation tracking
let operationCount = 0;
const operationStats = {
  get: 0,
  set: 0,
  del: 0,
  incr: 0,
  pipeline: 0,
  other: 0,
};

// Reset stats daily
setInterval(() => {
  operationCount = 0;
  Object.keys(operationStats).forEach((key) => {
    operationStats[key as keyof typeof operationStats] = 0;
  });
  console.log("Redis operation stats reset");
}, 24 * 60 * 60 * 1000);

// Track Redis operations
function trackOperation(operation: string) {
  operationCount++;
  if (operation in operationStats) {
    operationStats[operation as keyof typeof operationStats]++;
  } else {
    operationStats.other++;
  }

  // Log every 100 operations
  if (operationCount % 100 === 0) {
    console.log(`Redis operations count: ${operationCount}`, operationStats);
  }
}

// Redis client configuration
console.log(
  process.env.REDIS_URL
    ? "Using Upstash Redis URL"
    : "Using local Redis configuration"
);

// const redis = new Redis(process.env.REDIS_URL!, {
//   //the 3 comments below are for local development
//   // host: process.env.REDIS_HOST || "localhost",
//   // port: parseInt(process.env.REDIS_PORT || "6379"),
//   // password: process.env.REDIS_PASSWORD,

//   //the line below is for production using Upstash

//   maxRetriesPerRequest: 3,
//   lazyConnect: true,
//   keepAlive: 30000,
//   connectTimeout: 10000,
//   commandTimeout: 5000,
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 100, 2000); // exponential backoff
//     return delay;
//   },
// });

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableAutoPipelining: true, // Enable auto pipelining for better performance
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      retryStrategy: (times) => Math.min(times * 100, 2000), // exponential backoff
    })
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD || undefined,
      enableAutoPipelining: true, // Enable auto pipelining for better performance
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
      trackOperation("get");
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
      trackOperation("set");
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
      trackOperation("del");
      await redis.del(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }
  },

  // Efficient cache invalidation using cache tags
  async invalidateByTags(tags: string[]): Promise<number> {
    try {
      let totalDeleted = 0;

      for (const tag of tags) {
        const tagKey = `cache_tag:${tag}`;
        trackOperation("get"); // smembers
        const keys = await redis.smembers(tagKey);

        if (keys.length > 0) {
          // Delete all keys associated with this tag
          trackOperation("del");
          const deleted = await redis.del(...keys);
          totalDeleted += deleted;

          // Remove the tag set itself
          trackOperation("del");
          await redis.del(tagKey);
        }
      }

      return totalDeleted;
    } catch (error) {
      console.error("Cache invalidate by tags error:", error);
      return 0;
    }
  },

  // Add key to cache tag for tracking
  async addToTag(key: string, tag: string): Promise<void> {
    try {
      const tagKey = `cache_tag:${tag}`;
      trackOperation("set"); // sadd
      await redis.sadd(tagKey, key);
      // Set TTL on tag key to prevent memory leaks
      trackOperation("set"); // expire
      await redis.expire(tagKey, 86400); // 24 hours
    } catch (error) {
      console.error("Cache add to tag error:", error);
    }
  },

  // Get Redis operation statistics
  getStats(): {
    totalOperations: number;
    operationBreakdown: typeof operationStats;
  } {
    return {
      totalOperations: operationCount,
      operationBreakdown: { ...operationStats },
    };
  },

  // Enhanced set method with tag support
  async setWithTags(
    key: string,
    value: any,
    ttl: number = 3600,
    tags: string[] = []
  ): Promise<boolean> {
    try {
      trackOperation("set");
      await redis.setex(key, ttl, JSON.stringify(value));

      // Add key to all specified tags
      for (const tag of tags) {
        await this.addToTag(key, tag);
      }

      return true;
    } catch (error) {
      console.error("Cache set with tags error:", error);
      return false;
    }
  },

  // Cache versioning for efficient invalidation
  async getVersion(versionKey: string): Promise<number> {
    try {
      const version = await redis.get(`version:${versionKey}`);
      return version ? parseInt(version) : 1;
    } catch (error) {
      console.error("Cache get version error:", error);
      return 1;
    }
  },

  async incrementVersion(versionKey: string): Promise<number> {
    try {
      return await redis.incr(`version:${versionKey}`);
    } catch (error) {
      console.error("Cache increment version error:", error);
      return 1;
    }
  },

  // Get with version checking
  async getVersioned(key: string, versionKey: string): Promise<any> {
    try {
      const [data, currentVersion] = await Promise.all([
        redis.get(key),
        this.getVersion(versionKey),
      ]);

      if (!data) return null;

      const parsed = JSON.parse(data);

      // Check if cached data version matches current version
      if (parsed._version && parsed._version !== currentVersion) {
        // Data is stale, delete it
        await redis.del(key);
        return null;
      }

      return parsed.data || parsed;
    } catch (error) {
      console.error("Cache get versioned error:", error);
      return null;
    }
  },

  // Set with version
  async setVersioned(
    key: string,
    value: any,
    versionKey: string,
    ttl: number = 3600
  ): Promise<boolean> {
    try {
      const version = await this.getVersion(versionKey);
      const versionedData = {
        data: value,
        _version: version,
        _timestamp: Date.now(),
      };

      await redis.setex(key, ttl, JSON.stringify(versionedData));
      return true;
    } catch (error) {
      console.error("Cache set versioned error:", error);
      return false;
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
