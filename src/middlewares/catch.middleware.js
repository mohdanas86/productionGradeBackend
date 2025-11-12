import { ApiResponse } from '../utils/apiResponse.js';
import { redis } from '../utils/redis.js';

export const catchAsync = (duration) => {
  return async (req, res, next) => {
    const key = `catchAsync:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              JSON.parse(cached),
              'Data retrieved from cache'
            )
          );
      }

      // store original res.json method
      const originalSend = res.json;
      res.json = function (data) {
        redis.setex(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};
