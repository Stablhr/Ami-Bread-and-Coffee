import {menuRepository} from '../repositories/menu.repository';
import {ApiError} from '../utils/error';
import {ErrorCodes} from '../constants/errorCodes';

export type MenuItemView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  deal: {quantity: number; price: number} | null;
  isFavorite: boolean;
  isAvailable: boolean;
  imageUrl: string | null;
};

export type MenuCategoryView = {
  id: string;
  slug: string;
  name: string;
  note: string | null;
  items: MenuItemView[];
};

type ItemLike = {
  _id: unknown;
  slug: string;
  name: string;
  description?: string;
  price: number;
  deal?: {quantity: number; price: number} | null;
  isFavorite?: boolean;
  isAvailable?: boolean;
  imageUrl?: string | null;
};

function toItemView(item: ItemLike): MenuItemView {
  return {
    id: String(item._id),
    slug: item.slug,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    deal: item.deal ? {quantity: item.deal.quantity, price: item.deal.price} : null,
    isFavorite: Boolean(item.isFavorite),
    isAvailable: item.isAvailable !== false,
    imageUrl: item.imageUrl ?? null
  };
}

export const menuService = {
  /** Full public menu grouped by category, in display order. */
  async getMenu(): Promise<MenuCategoryView[]> {
    const [categories, items] = await Promise.all([
      menuRepository.listActiveCategories(),
      menuRepository.listItems()
    ]);

    return categories.map(category => ({
      id: String(category._id),
      slug: category.slug,
      name: category.name,
      note: category.note ?? null,
      items: items
        .filter(item => String(item.category) === String(category._id))
        .map(toItemView)
    }));
  },

  async getItem(slug: string) {
    const item = await menuRepository.findItemBySlug(slug);
    if (!item) {
      throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Menu item not found');
    }
    return {
      ...toItemView(item),
      category: {name: item.category.name, slug: item.category.slug}
    };
  }
};
