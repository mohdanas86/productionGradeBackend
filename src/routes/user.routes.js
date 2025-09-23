import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

// Create a router instance
const userRouter = Router();

// Route for user registration
userRouter
    .route("/register")
    .post(
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            },
            {
                name: "coverImage",
                maxCount: 1
            }
        ]),
        registerUser
    );

// Export the router to be used in the main application
export default userRouter;