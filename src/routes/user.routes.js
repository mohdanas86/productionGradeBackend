import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from '../controllers/user.controllers.js';
import { authRateLimit } from '../middlewares/ratelimit.middleware.js';
import { catchAsync } from '../middlewares/catch.middleware.js';

// Create a router instance
const userRouter = Router();

// Route for user registration
userRouter.route('/register').post(
  authRateLimit,
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);

// Route for user login
userRouter.route('/login').post(authRateLimit, loginUser);

// ======================================================================
// secured route only for logged in users
// ======================================================================

// Route for user logout
userRouter.route('/logout').post(verifyJWT, logoutUser);

// Route for refreshing access token
userRouter.route('/refresh-token').post(refreshAccessToken);

// Route for getting user profile
userRouter.route('/me').get(catchAsync(300), verifyJWT, getCurrentUser);

// Export the router to be used in the main application
export default userRouter;
