import { ApiResponse } from '../utils/apiResponse.js';
import { redis } from '../config/redis.js';

export const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache only successful responses
      res.json = function (data) {
        // Only cache if status is 2xx (successful)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.setex(key, duration, JSON.stringify(data));
        }

        // Call original json method
        originalJson.call(this, data);
      };

      next();
    } catch (error) {
      // If Redis fails, continue without caching
      next();
    }
  };
};
