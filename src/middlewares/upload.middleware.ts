import multer from 'multer';
import cloudinary from '../config/cloudinary';
import ApiError from '../utils/ApiError';

/**
 * Multer config — stores files in memory (Buffer) for direct Cloudinary upload.
 * Max file size: 5MB.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only JPEG, PNG, WebP, and GIF images are allowed') as unknown as Error);
    }
  },
});

/**
 * Upload a buffer to Cloudinary.
 *
 * @param buffer  - File buffer from multer
 * @param folder  - Cloudinary folder path (e.g. "byu-connect/avatars")
 * @returns       - Cloudinary secure URL
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(new ApiError(500, 'Image upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by URL.
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from URL: .../folder/public_id.ext
    const parts = imageUrl.split('/');
    const folderAndFile = parts.slice(parts.indexOf('upload') + 2).join('/');
    const publicId = folderAndFile.replace(/\.[^.]+$/, ''); // Remove extension
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-critical — log but don't throw
    console.warn('⚠️  Failed to delete image from Cloudinary:', imageUrl);
  }
};
