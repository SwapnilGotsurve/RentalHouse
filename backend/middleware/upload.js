import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on file type and route
    if (req.route.path.includes('properties')) {
      uploadPath += 'properties/';
    } else if (req.route.path.includes('users') || req.route.path.includes('profile')) {
      uploadPath += 'profiles/';
    } else if (req.route.path.includes('maintenance')) {
      uploadPath += 'maintenance/';
    } else if (req.route.path.includes('reviews')) {
      uploadPath += 'reviews/';
    } else {
      uploadPath += 'misc/';
    }
    
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocumentTypes = /pdf|doc|docx/;
  
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedDocumentTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = allowedImageTypes.test(file.mimetype) ||
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX) are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Middleware for single file upload
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File size too large. Maximum size is 10MB.'
            });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
              success: false,
              message: `Unexpected field. Expected field name: ${fieldName}`
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      // Add file URL to request if file was uploaded
      if (req.file) {
        req.file.url = `/uploads/${path.relative('uploads/', req.file.path)}`.replace(/\\/g, '/');
      }
      
      next();
    });
  };
};

// Middleware for multiple files upload
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'One or more files are too large. Maximum size is 10MB per file.'
            });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
              success: false,
              message: `Too many files. Maximum allowed: ${maxCount}`
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      // Add file URLs to request if files were uploaded
      if (req.files && req.files.length > 0) {
        req.files = req.files.map(file => ({
          ...file,
          url: `/uploads/${path.relative('uploads/', file.path)}`.replace(/\\/g, '/')
        }));
      }
      
      next();
    });
  };
};

// Middleware for mixed file uploads (different field names)
export const uploadFields = (fields) => {
  return (req, res, next) => {
    const fieldsUpload = upload.fields(fields);
    
    fieldsUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'One or more files are too large. Maximum size is 10MB per file.'
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      // Add file URLs to request if files were uploaded
      if (req.files) {
        Object.keys(req.files).forEach(fieldName => {
          req.files[fieldName] = req.files[fieldName].map(file => ({
            ...file,
            url: `/uploads/${path.relative('uploads/', file.path)}`.replace(/\\/g, '/')
          }));
        });
      }
      
      next();
    });
  };
};

// Utility function to delete uploaded file
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Middleware to clean up files on error
export const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // If response is an error and files were uploaded, clean them up
    if (res.statusCode >= 400) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      
      if (req.files) {
        if (Array.isArray(req.files)) {
          req.files.forEach(file => deleteFile(file.path));
        } else {
          Object.values(req.files).forEach(fileArray => {
            fileArray.forEach(file => deleteFile(file.path));
          });
        }
      }
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Image processing middleware (optional - requires sharp package)
export const processImage = (options = {}) => {
  return async (req, res, next) => {
    if (!req.file || !req.file.mimetype.startsWith('image/')) {
      return next();
    }
    
    try {
      // This would require installing sharp: npm install sharp
      // const sharp = require('sharp');
      
      // const { width = 800, height = 600, quality = 80 } = options;
      
      // await sharp(req.file.path)
      //   .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      //   .jpeg({ quality })
      //   .toFile(req.file.path.replace(path.extname(req.file.path), '.jpg'));
      
      // // Update file info
      // req.file.filename = req.file.filename.replace(path.extname(req.file.filename), '.jpg');
      // req.file.path = req.file.path.replace(path.extname(req.file.path), '.jpg');
      // req.file.mimetype = 'image/jpeg';
      
      next();
    } catch (error) {
      next(error);
    }
  };
};