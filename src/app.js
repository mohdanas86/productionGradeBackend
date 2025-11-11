import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '16Kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '16Kb',
  })
);
app.use(express.static('public'));
app.use(cookieParser());

// import routes here
import userRouter from './routes/user.routes.js';
import { healthCheckRateLimit } from './middlewares/ratelimit.middleware.js';

// Use routes
app.use('/api/v1/user', userRouter);

// home route for testing
app.get('/', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Welcome to the Production-Grade Backend API',
      data: {
        message: 'API is running successfully',
        status: 'API is running successfully',
      },
    });
  } catch (error) {
    console.error('Error in home route:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
});

// api health
app.get('/api/v1/health', healthCheckRateLimit, (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'API is healthy',
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'API is healthy',
      },
    });
  } catch (error) {
    console.error('Error in health check route:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
});

export { app };
