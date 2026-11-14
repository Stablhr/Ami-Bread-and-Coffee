import mongoose, {Schema} from 'mongoose';

export interface CategoryDocument extends mongoose.Document {
  name: string;
  slug: string;
  /** Short line shown under the heading, e.g. "All drinks available hot and iced". */
  note?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
    note: {type: String, default: null},
    sortOrder: {type: Number, default: 0},
    isActive: {type: Boolean, default: true}
  },
  {timestamps: true}
);

export const CategoryModel = mongoose.model<CategoryDocument>(
  'Category',
  CategorySchema,
  'categories'
);
