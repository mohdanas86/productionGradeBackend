# Redis Caching in Production Backend

## What is Redis?

Redis is an in-memory data structure store used as a database, cache, and message broker. In this project, Redis serves as a high-performance cache to improve API response times and reduce database load.

## Why Redis in This Project?

- **Speed**: Redis stores data in memory, making it much faster than disk-based databases
- **Caching**: Reduces database queries for frequently accessed data
- **Session Storage**: Can store user sessions across multiple servers
- **Rate Limiting**: Stores rate limit counters for better scalability

## How Redis Works in This Project

### 1. Connection Setup

Redis connects automatically when the server starts:

```javascript
// src/config/redis.js
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});
```

### 2. Basic Caching Flow

```
User Request → Check Redis Cache → Cache Hit? → Return Cached Data
                                      ↓
                                 Cache Miss → Query Database → Store in Cache → Return Data
```

### 3. Cache Middleware

The project includes a caching middleware:

```javascript
// src/middlewares/cache.middleware.js
export const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    // Check if data exists in cache
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Store response in cache before sending
    const originalSend = res.json;
    res.json = function(data) {
      redis.setex(key, duration, JSON.stringify(data));
      originalSend.call(this, data);
    };

    next();
  };
};
```

## How to Use Redis Caching

### Apply Cache to Routes

```javascript
// In your routes file
import { cache } from '../middlewares/cache.middleware.js';

router.get('/users', cache(300), getUsers); // Cache for 5 minutes
router.get('/posts', cache(600), getPosts); // Cache for 10 minutes
```

### Manual Cache Operations

```javascript
import { redis } from '../config/redis.js';

// Store data
await redis.set('key', 'value');
await redis.setex('key', 3600, 'value'); // Expires in 1 hour

// Get data
const data = await redis.get('key');

// Delete data
await redis.del('key');

// Check if key exists
const exists = await redis.exists('key');
```

## Cache Key Patterns

The project uses these cache key patterns:

- `cache:/api/v1/users` - API response cache
- `ratelimit:ip:192.168.1.1` - Rate limiting counters
- `session:user123` - User session data

## Cache Duration Guidelines

- **User profiles**: 5-10 minutes
- **Post lists**: 2-5 minutes
- **Static data**: 30-60 minutes
- **Frequently changing data**: 1-2 minutes

## Environment Configuration

Add these to your `.env` file:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

For Docker Compose:
```env
REDIS_HOST=redis
REDIS_PORT=6379
```

## Docker Setup

Redis runs as a separate service in Docker Compose:

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
```

## Monitoring Cache Performance

### Check Cache Hit Rate

```javascript
// Get cache statistics
const info = await redis.info('stats');
console.log('Cache hits:', info.keyspace_hits);
console.log('Cache misses:', info.keyspace_misses);
```

### Clear Cache

```javascript
// Clear all cache
await redis.flushall();

// Clear specific pattern
const keys = await redis.keys('cache:*');
if (keys.length > 0) {
  await redis.del(keys);
}
```

## When to Use Redis vs Database

### Use Redis Cache For:
- Frequently accessed data
- Data that changes infrequently
- API responses that are expensive to compute
- Session data
- Rate limiting counters

### Use Database For:
- Persistent data storage
- Complex queries
- Data that needs ACID transactions
- Large datasets that don't fit in memory

## Best Practices

1. **Set appropriate TTL**: Don't cache data indefinitely
2. **Use descriptive keys**: Make keys easy to identify and debug
3. **Handle cache failures**: App should work even if Redis is down
4. **Monitor memory usage**: Redis is in-memory, so monitor RAM usage
5. **Cache invalidation**: Clear cache when data changes

## Troubleshooting

### Connection Issues
```bash
# Check if Redis is running
docker-compose ps redis

# Check Redis logs
docker-compose logs redis

# Test connection
docker-compose exec redis redis-cli ping
```

### Cache Not Working
- Check Redis connection in application logs
- Verify cache keys are being set correctly
- Check TTL values
- Ensure middleware is applied to routes

## Performance Benefits

With Redis caching, you can expect:
- **50-90% faster** API response times for cached data
- **Reduced database load** by 60-80%
- **Better scalability** for high-traffic applications
- **Improved user experience** with faster page loads

Redis caching is a simple but powerful optimization that can significantly improve your application's performance! 🚀