import {CategoryModel} from '../models/Category.model';
import {MenuItemModel} from '../models/MenuItem.model';

export const menuRepository = {
  listActiveCategories: () =>
    CategoryModel.find({isActive: true}).sort({sortOrder: 1, name: 1}).lean().exec(),

  listItems: () => MenuItemModel.find({}).sort({sortOrder: 1, name: 1}).lean().exec(),

  findItemBySlug: (slug: string) =>
    MenuItemModel.findOne({slug: slug.toLowerCase()})
      .populate<{category: {name: string; slug: string}}>('category', 'name slug')
      .lean()
      .exec()
};
