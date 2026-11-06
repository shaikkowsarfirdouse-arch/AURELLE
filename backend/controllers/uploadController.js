import multer from 'multer';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Memory storage for multer
const storage = multer.memoryStorage();

// File filter: accept images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const folder = req.body.folder || 'aurelle/products';
    const secureUrl = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: secureUrl,
    });
  } catch (error) {
    next(error);
  }
};

