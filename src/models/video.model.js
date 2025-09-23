import mongoose from 'mongoose';

// Define the Video schema
const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // cloudinary url,
        required: true,
    },
    thumbnail: {
        type: String, // cloudinary url,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

// Create and export the Video model
export const Video = mongoose.model('Video', videoSchema);
