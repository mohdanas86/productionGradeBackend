import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

// Create a router instance
const userRouter = Router();

// Route for user registration
userRouter.route('/register').post(
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
userRouter
    .route('/login')
    .post(loginUser);


// Route for user logout
userRouter
    .route('/logout')
    .post(verifyJWT, logoutUser);;

// Export the router to be used in the main application
export default userRouter;
