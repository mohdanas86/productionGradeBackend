import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// genarate access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(
            500,
            'Somthing went wrong while generating refresh and access token'
        );
    }
};

// user register controller
const registerUser = asyncHandler(async (req, res, next) => {
    // Get user data from frontend
    const { username, email, password, fullName } = req.body;

    // Validate user data: all fields must be non-empty
    if (
        [fullName, username, email, password].some(
            (field) => !field || field.trim() === ''
        )
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    // Check if user already exists (by email or username)
    const existingUser = await User.find({
        $or: [{ email }, { username }],
    });
    if (existingUser.length > 0) {
        throw new ApiError(409, 'User already exists');
    }

    // Check for avatar image
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar is required');
    }

    // Upload images to Cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    let coverImage = null;
    if (coverImageLocalPath) {
        coverImage = await uploadToCloudinary(coverImageLocalPath);
    }

    if (!avatar) {
        throw new ApiError(500, 'Failed to upload avatar');
    }

    // Create user object and save in database
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar?.url,
        coverImage: coverImage?.url || '',
    });

    // Remove password and refreshToken from response
    const createdUserCheck = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    // Check user creation
    if (!createdUserCheck) {
        throw new ApiError(500, 'Failed to create user');
    }

    // Respond to frontend
    return res
        .status(201)
        .json(new ApiResponse(200, createdUserCheck, 'User created successfully'));
});

// user login controller
const loginUser = asyncHandler(async (req, res, next) => {
    // req body -> data
    const { username, email, password } = req.body;

    // verify if username or email esists
    if (!username && !email) {
        throw new ApiError(400, 'Username or email is required');
    }

    // find the user
    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    // password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password');
    }
    // access token and refresh token
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    // send cookie
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged in successFully'
            )
        );
});

// user logout controller
const logoutUser = asyncHandler(async (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: null,
        }
    }, {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

export { registerUser, loginUser, logoutUser };
