import {isValidObjectId} from 'mongoose';
import {CategoryModel} from '../models/Category.model';
import {MenuItemDocument, MenuItemModel} from '../models/MenuItem.model';

export type MenuItemWrite = Partial<
  Pick<
    MenuItemDocument,
    | 'name'
    | 'slug'
    | 'description'
    | 'price'
    | 'deal'
    | 'isFavorite'
    | 'isAvailable'
    | 'imageUrl'
    | 'ingredients'
    | 'allergens'
    | 'sortOrder'
  >
> & {category?: string};

export const menuRepository = {
  listActiveCategories: () =>
    CategoryModel.find({isActive: true}).sort({sortOrder: 1, name: 1}).lean().exec(),

  listItems: () => MenuItemModel.find({}).sort({sortOrder: 1, name: 1}).lean().exec(),

  findItemBySlug: (slug: string) =>
    MenuItemModel.findOne({slug: slug.toLowerCase()})
      .populate<{category: {name: string; slug: string; note?: string | null}}>(
        'category',
        'name slug note'
      )
      .lean()
      .exec(),

  findItemById: (id: string) =>
    isValidObjectId(id) ? MenuItemModel.findById(id).lean().exec() : Promise.resolve(null),

  categoryExists: async (id: string) =>
    isValidObjectId(id) && (await CategoryModel.exists({_id: id})) !== null,

  slugTaken: async (slug: string, exceptId?: string) =>
    (await MenuItemModel.exists(
      exceptId ? {slug, _id: {$ne: exceptId}} : {slug}
    )) !== null,

  /** Next sort position at the end of a category. */
  nextSortOrder: async (categoryId: string) => {
    const last = await MenuItemModel.findOne({category: categoryId})
      .sort({sortOrder: -1})
      .select('sortOrder')
      .lean()
      .exec();
    return (last?.sortOrder ?? -1) + 1;
  },

  createItem: (data: MenuItemWrite) => MenuItemModel.create(data),

  updateItem: (id: string, data: MenuItemWrite) =>
    MenuItemModel.findByIdAndUpdate(id, {$set: data}, {new: true, runValidators: true})
      .lean()
      .exec(),

  deleteItem: (id: string) => MenuItemModel.deleteOne({_id: id}).exec(),

  /** True when another menu item still points at this photo URL. */
  imageInUse: async (imageUrl: string, exceptId?: string) =>
    (await MenuItemModel.exists(
      exceptId ? {imageUrl, _id: {$ne: exceptId}} : {imageUrl}
    )) !== null
};
