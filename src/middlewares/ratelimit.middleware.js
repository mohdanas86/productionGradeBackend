import rateLimit from 'express-rate-limit';
import {
    APIRATELIMIT_15MIN,
} from '../constants.js';

// general Api rate limit (100 requests per 15 minutes)
export const apiRateLimit = rateLimit({
    windowMs: APIRATELIMIT_15MIN, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        statusCode: 429,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});