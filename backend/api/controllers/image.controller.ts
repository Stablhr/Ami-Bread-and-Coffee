import {Request, Response, NextFunction} from 'express';
import {imageService} from '../services/image.service';

/** .lean() returns BSON Binary for Buffer fields; normalise to a Node Buffer. */
function toBuffer(data: unknown): Buffer {
  if (Buffer.isBuffer(data)) return data;
  const inner = (data as {buffer?: unknown}).buffer;
  if (inner instanceof Uint8Array) return Buffer.from(inner.buffer, inner.byteOffset, inner.byteLength);
  throw new Error('Unreadable image data');
}

export const imageController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await imageService.get(String(req.params.id));
      res.set({
        'Content-Type': image.contentType,
        // Each upload gets a new id, so a photo never changes: cache it hard.
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Helmet defaults to same-origin; the website runs on another origin.
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'X-Content-Type-Options': 'nosniff'
      });
      res.status(200).send(toBuffer(image.data));
    } catch (error) {
      next(error);
    }
  }
};
