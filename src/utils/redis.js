import Redis from 'ioredis';

// Create and export a Redis client instance
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Optional: Handle Redis connection events
redis.on('connect', () => {
  console.log('Connected to Redis...');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});
