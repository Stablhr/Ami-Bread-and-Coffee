import mongoose, {Schema} from 'mongoose';

/**
 * Product photos uploaded by the admin. Stored in MongoDB (not on disk) so
 * they survive deploys to serverless hosts like Vercel. The browser shrinks
 * photos before upload, so each one is small (≤ 2 MB, usually far less).
 */
export interface ProductImageDocument extends mongoose.Document {
  data: Buffer;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp';
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<ProductImageDocument>(
  {
    data: {type: Buffer, required: true},
    contentType: {type: String, required: true, enum: ['image/jpeg', 'image/png', 'image/webp']},
    size: {type: Number, required: true}
  },
  {timestamps: true}
);

export const ProductImageModel = mongoose.model<ProductImageDocument>(
  'ProductImage',
  ProductImageSchema,
  'product_images'
);
