import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefg',
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
export const uploadToCloudinary = (buffer, folder = 'aurelle/products') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are placeholder, return high quality mock fallback or data URL
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo'
    ) {
      // Convert buffer to data URI for immediate instant use without needing external Cloudinary credentials
      const mime = 'image/jpeg';
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;
      return resolve(dataUri);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;

