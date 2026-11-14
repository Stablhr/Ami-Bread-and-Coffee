import mongoose, {Schema, Types} from 'mongoose';

export interface MenuItemDeal {
  quantity: number;
  /** Bundle price in whole pesos, e.g. 3 scones for 220. */
  price: number;
}

export interface MenuItemDocument extends mongoose.Document {
  category: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  /** Price in whole Philippine pesos. */
  price: number;
  deal?: MenuItemDeal | null;
  /** Marked with a heart on the printed menu. */
  isFavorite: boolean;
  isAvailable: boolean;
  imageUrl?: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<MenuItemDeal>(
  {
    quantity: {type: Number, required: true, min: 2},
    price: {type: Number, required: true, min: 0}
  },
  {_id: false}
);

const MenuItemSchema = new Schema<MenuItemDocument>(
  {
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true},
    name: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
    description: {type: String, default: ''},
    price: {type: Number, required: true, min: 0},
    deal: {type: DealSchema, default: null},
    isFavorite: {type: Boolean, default: false},
    isAvailable: {type: Boolean, default: true},
    imageUrl: {type: String, default: null},
    sortOrder: {type: Number, default: 0}
  },
  {timestamps: true}
);

export const MenuItemModel = mongoose.model<MenuItemDocument>(
  'MenuItem',
  MenuItemSchema,
  'menu_items'
);
