/**
 * Shrinks a photo in the browser before upload, so phone pictures (often
 * 4–10 MB) become ~150–400 KB. Keeps the aspect ratio; longest side ≤ maxSide.
 */
export async function resizeImage(
  file: File,
  {maxSide = 1400, quality = 0.82}: {maxSide?: number; quality?: number} = {}
): Promise<{blob: Blob; filename: string}> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

  // WebP where the browser supports encoding it, JPEG otherwise (older Safari).
  const webp = await toBlob('image/webp');
  if (webp && webp.type === 'image/webp') {
    return {blob: webp, filename: 'photo.webp'};
  }
  const jpeg = await toBlob('image/jpeg');
  if (!jpeg) throw new Error('Could not read that photo');
  return {blob: jpeg, filename: 'photo.jpg'};
}
