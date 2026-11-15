import multer from 'multer';
import {Request, Response, NextFunction} from 'express';
import {ApiError} from '../utils/error';
import {ErrorCodes} from '../constants/errorCodes';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: MAX_IMAGE_BYTES, files: 1},
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    cb(new ApiError(400, ErrorCodes.INVALID_IMAGE, 'Photos must be JPG, PNG or WebP'));
  }
}).single('image');

/** Accepts one photo in the "image" form field, kept in memory. */
export function singleImage(req: Request, res: Response, next: NextFunction) {
  imageUpload(req, res, error => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(413, ErrorCodes.IMAGE_TOO_LARGE, 'Photo is too large (max 2 MB)'));
    }
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(400, ErrorCodes.INVALID_IMAGE, 'Could not read that photo'));
  });
}
