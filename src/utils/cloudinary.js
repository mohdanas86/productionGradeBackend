import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // validate file path

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        console.log("Cloudinary response", response.url);
        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath); // remove file from server
        console.log("Error while uploading to Cloudinary", err);
        return null;
    }
}

export { uploadToCloudinary };