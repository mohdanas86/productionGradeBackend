import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Controller to handle user registration
const registerUser = asyncHandler(async (req, res, next) => {
    // Get user data from frontend
    const { username, email, password, fullName } = req.body;

    // Validate user data: all fields must be non-empty
    if ([fullName, username, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists (by email or username)
    const existingUser = await User.find({
        $or: [{ email }, { username }]
    });
    if (existingUser.length > 0) {
        throw new ApiError(409, "User already exists");
    }

    // Check for avatar image
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Upload images to Cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    let coverImage = null;
    if (coverImageLocalPath) {
        coverImage = await uploadToCloudinary(coverImageLocalPath);
    }

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // Create user object and save in database
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar?.url,
        coverImage: coverImage?.url || ""
    });

    // Remove password and refreshToken from response
    const createdUserCheck = await User.findById(user._id).select("-password -refreshToken");

    // Check user creation
    if (!createdUserCheck) {
        throw new ApiError(500, "Failed to create user");
    }

    // Respond to frontend
    return res.status(201).json(
        new ApiResponse(200, createdUserCheck, "User created successfully")
    );
});

export { registerUser };