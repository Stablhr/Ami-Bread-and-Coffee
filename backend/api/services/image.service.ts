import {imageRepository} from '../repositories/image.repository';
import {ApiError} from '../utils/error';
import {ErrorCodes} from '../constants/errorCodes';

type ImageType = 'image/jpeg' | 'image/png' | 'image/webp';

/** Check the file's first bytes so a renamed non-image can't sneak in. */
function sniffImageType(buffer: Buffer): ImageType | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp';
  }
  return null;
}

export const imageService = {
  async upload(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Please choose a photo to upload');
    }
    const contentType = sniffImageType(file.buffer);
    if (!contentType) {
      throw new ApiError(400, ErrorCodes.INVALID_IMAGE, 'Photos must be JPG, PNG or WebP');
    }
    const image = await imageRepository.create({data: file.buffer, contentType, size: file.size});
    const id = String(image._id);
    return {id, url: `/api/images/${id}`};
  },

  async get(id: string) {
    const image = await imageRepository.findById(id);
    if (!image) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Photo not found');
    return image;
  }
};
