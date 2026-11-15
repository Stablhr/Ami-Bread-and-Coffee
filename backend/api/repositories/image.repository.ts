import {isValidObjectId} from 'mongoose';
import {ProductImageDocument, ProductImageModel} from '../models/ProductImage.model';

export const imageRepository = {
  create: (data: Pick<ProductImageDocument, 'data' | 'contentType' | 'size'>) =>
    ProductImageModel.create(data),

  findById: (id: string) =>
    isValidObjectId(id) ? ProductImageModel.findById(id).lean().exec() : Promise.resolve(null),

  deleteById: (id: string) =>
    isValidObjectId(id) ? ProductImageModel.deleteOne({_id: id}).exec() : Promise.resolve(null)
};
