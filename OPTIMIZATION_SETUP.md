# CliniCall Optimization Setup Guide

This guide covers the performance optimizations implemented in my CliniCall application.

## 🚀 Implemented Optimizations

### 1. Redis Caching Infrastructure

- **File**: `lib/redis.ts`
- **Purpose**: Centralized caching layer for database queries and session data
- **Benefits**: Reduces database load, faster response times

### 2. Prisma Connection Optimization

- **File**: `lib/prisma.ts`
- **Features**: Singleton pattern, connection pooling, graceful shutdown
- **Benefits**: Prevents connection leaks, better resource management

### 3. Email Queue System

- **Files**: `lib/queue.ts`, `lib/mail-queue.ts`
- **Features**: Bull Queue with Redis, batch processing, retry logic
- **Benefits**: Non-blocking email sending, better reliability

### 4. API Route Caching

- **Files**: `app/api/appointments/doctor/route.ts`, `app/api/appointments/hospital/route.ts`
- **Features**: Doctor/Hospital profile caching, cache invalidation
- **Benefits**: Faster appointment booking, reduced database queries

### 5. Pusher Optimization

- **File**: `lib/pusher-server.ts`
- **Features**: Connection pooling, notification batching, singleton pattern
- **Benefits**: Efficient real-time notifications, reduced Pusher costs

### 6. Rate Limiting

- **File**: `lib/rate-limiter.ts`
- **Features**: Redis-based rate limiting, configurable limits, proper headers
- **Benefits**: API protection, abuse prevention

### 7. Pagination

- **File**: `app/(rest)/doctor/appointment-history/page.tsx`
- **Features**: Database pagination, caching, navigation controls
- **Benefits**: Faster page loads, better UX for large datasets

## 📋 Setup Requirements

### 1. Redis Installation

**macOS (using Homebrew):**

```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Docker:**

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required new variables:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Pusher (if using real-time features)
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
```

### 3. Dependencies Installation

The following packages were added:

```bash
npm install redis ioredis bull @types/bull
```

## 🔧 Configuration Options

### Redis Cache TTL Settings

- Doctor/Hospital profiles: 1 hour (3600s)
- Appointment lists: 5 minutes (300s)
- Session data: 24 hours (86400s)

### Rate Limiting Settings

- General API: 100 requests/15 minutes
- Appointment booking: 10 requests/hour
- Authentication: 5 attempts/15 minutes

### Email Queue Settings

- Max attempts: 3 with exponential backoff
- Batch processing: 10 concurrent jobs
- Cleanup: 100 completed, 50 failed jobs retained

### Pagination Settings

- Default page size: 10 appointments
- Maximum page size: 50 appointments
- Cache duration: 5 minutes per page

## 🚦 Monitoring & Health Checks

### Redis Health Check

```bash
redis-cli ping
# Should return "PONG"
```

### Queue Monitoring

Check queue status in your application logs:

- Email queue processing
- Failed job counts
- Retry attempts

### Cache Hit Rates

Monitor Redis for cache effectiveness:

```bash
redis-cli info stats
```

## 🔄 Cache Invalidation Strategy

### Automatic Invalidation

- New appointments: Clears user and provider caches
- Profile updates: Clears specific doctor/hospital cache
- Status changes: Clears related appointment caches

### Manual Cache Clearing

```javascript
// Clear specific cache
await cache.del("doctor:doctorId");

// Clear pattern-based cache
await cache.delPattern("appointments:doctor:*");
```

## 📈 Performance Impact

### Expected Improvements

- **Database Load**: 60-80% reduction in repeated queries
- **Response Time**: 40-60% faster for cached data
- **Email Reliability**: 95%+ delivery success rate
- **Page Load Speed**: 50-70% faster for paginated lists
- **Real-time Efficiency**: 40% reduction in Pusher costs

### Monitoring Metrics

- Cache hit ratio (target: >80%)
- Average response time (target: <200ms)
- Queue processing time (target: <1s)
- Error rates (target: <1%)

## 🐛 Troubleshooting

### Common Issues

**Redis Connection Failed:**

```bash
# Check if Redis is running
sudo systemctl status redis-server

# Check Redis logs
sudo journalctl -u redis-server
```

**Queue Not Processing:**

- Verify Redis connection
- Check Bull Queue dashboard
- Review error logs in application

**Cache Not Working:**

- Verify Redis connection
- Check cache key patterns
- Monitor TTL settings

**Rate Limiting Too Aggressive:**

- Adjust limits in `lib/rate-limiter.ts`
- Check Redis key patterns
- Review error logs

## 🔐 Security Considerations

1. **Redis Security**: Use password authentication in production
2. **Rate Limiting**: Monitor for bypass attempts
3. **Cache Invalidation**: Ensure sensitive data isn't cached too long
4. **Queue Security**: Validate job data before processing

## 🚀 Deployment Notes

### Production Checklist

- [ ] Redis cluster setup for high availability
- [ ] Environment variables configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy for Redis data
- [ ] Queue worker scaling configured
- [ ] Cache warming strategy implemented

### Scaling Considerations

- Redis: Consider Redis Cluster for horizontal scaling
- Queues: Add more workers for higher throughput
- Caching: Implement cache warming for critical data
- Rate Limiting: Use distributed rate limiting for multiple servers

This optimization setup should significantly improve your CliniCall application's performance and reliability!
