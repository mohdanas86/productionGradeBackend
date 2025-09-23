import multer from "multer";

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, db) {
        cb(null, file.originalname)
    }
});

export const upload = multer({
    storage
});