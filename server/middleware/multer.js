import multer from "multer";
import path from "path";
import ApiError from "../utils/apiError.js";

// Storage in memory (we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only images are allowed"), false);
  }
};

// Max file size 5MB
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
