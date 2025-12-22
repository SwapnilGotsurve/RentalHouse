import multer from 'multer';
import { upload } from '../config/cloudinary.js';

// Re-export the Cloudinary upload middleware
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);

// Middleware to clean up on error (not needed for Cloudinary but kept for compatibility)
export const cleanupOnError = (req, res, next) => {
  next();
};

// Image processing middleware (handled by Cloudinary transformations)
export const processImage = (options = {}) => {
  return (req, res, next) => {
    next();
  };
};