import mongoose from 'mongoose';
import {BaseUserDocument, createBaseUserSchema} from './base/BaseUser.schema';

export interface UserAddress {
  street: string;
  barangay: string;
  city: string;
  province: string;
  landmark: string;
}

export interface UserDocument extends BaseUserDocument {
  /** Mobile number, e.g. 09171234567. Required to place orders. */
  phone?: string | null;
  /** Home address. Required to place orders (anti-scam / future delivery). */
  address?: UserAddress | null;
}

const AddressSchema = new mongoose.Schema<UserAddress>(
  {
    street: {type: String, required: true, trim: true},
    barangay: {type: String, required: true, trim: true},
    city: {type: String, required: true, trim: true},
    province: {type: String, required: true, trim: true},
    landmark: {type: String, default: '', trim: true}
  },
  {_id: false}
);

const UserSchema = createBaseUserSchema<UserDocument>();
// Optional in the database so accounts made before this change still load;
// sign-up and checkout make them required.
UserSchema.add({
  phone: {type: String, default: null},
  address: {type: AddressSchema, default: null}
});

export const UserModel = mongoose.model<UserDocument>(
  'User',
  UserSchema,
  'users'
);