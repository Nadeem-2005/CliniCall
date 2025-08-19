import { NextResponse } from "next/server";
import redis from "./redis";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  total: number;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (req) => this.getDefaultKey(req),
      ...config,
    };
  }

  private getDefaultKey(req: Request): string {
    // Extract IP from request headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    return `rate_limit:${ip}`;
  }

  async checkLimit(req: Request): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(req);
    const now = Date.now();
    const windowStart = Math.floor(now / this.config.windowMs);
    const windowKey = `${key}:${windowStart}`;

    try {
      // Use simple counter with expiration - much more efficient than sorted sets
      const pipe = redis.pipeline();
      
      // Get current count and increment atomically
      pipe.incr(windowKey);
      pipe.expire(windowKey, Math.ceil(this.config.windowMs / 1000));
      
      // Track pipeline operation
      console.log("Rate limiter: Using Redis pipeline for rate limiting");
      const results = await pipe.exec();
      
      if (!results) {
        throw new Error("Redis pipeline failed");
      }

      const currentCount = (results[0][1] as number) || 0;
      const remaining = Math.max(0, this.config.maxRequests - currentCount);
      const resetTime = (windowStart + 1) * this.config.windowMs;

      return {
        success: currentCount <= this.config.maxRequests,
        remaining,
        resetTime,
        total: this.config.maxRequests,
      };
    } catch (error) {
      console.error("Rate limiting error:", error);
      // Fail open - allow request if Redis is down
      return {
        success: true,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
        total: this.config.maxRequests,
      };
    }
  }

  async middleware(req: Request): Promise<NextResponse | null> {
    const result = await this.checkLimit(req);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${Math.ceil(
            (result.resetTime - Date.now()) / 1000
          )} seconds.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": this.config.maxRequests.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.resetTime.toString(),
            "Retry-After": Math.ceil(
              (result.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set(
      "X-RateLimit-Limit",
      this.config.maxRequests.toString()
    );
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.resetTime.toString());

    return null; // Allow request to continue
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
});

export const appointmentRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  // windowMs: 60 * 60,
  maxRequests: 10, // 10 appointment bookings per hour
  keyGenerator: (req) => {
    // Rate limit by user ID for appointment bookings
    const url = new URL(req.url);
    const userId = req.headers.get("user-id") || "anonymous";
    return `appointment_limit:${userId}`;
  },
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyGenerator: (req) => {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    return `auth_limit:${ip}`;
  },
});

// Utility function to apply rate limiting to API routes
export function withRateLimit(
  rateLimiter: RateLimiter,
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    const limitResponse = await rateLimiter.middleware(req);

    if (limitResponse) {
      return limitResponse;
    }

    return handler(req);
  };
}
