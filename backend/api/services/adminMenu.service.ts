import {menuRepository, MenuItemWrite} from '../repositories/menu.repository';
import {imageRepository} from '../repositories/image.repository';
import {menuService} from './menu.service';
import {ApiError} from '../utils/error';
import {ErrorCodes} from '../constants/errorCodes';
import {slugify} from '../utils/slug';
import type {MenuItemDto, UpdateMenuItemDto} from '../dtos/menu.dto';

const UPLOADED_IMAGE = /^\/api\/images\/([a-f0-9]{24})$/i;

async function uniqueSlug(name: string, exceptId?: string) {
  const base = slugify(name) || 'item';
  let slug = base;
  for (let n = 2; await menuRepository.slugTaken(slug, exceptId); n += 1) {
    slug = `${base}-${n}`;
  }
  return slug;
}

async function assertCategory(categoryId: string) {
  if (!(await menuRepository.categoryExists(categoryId))) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Choose a category');
  }
}

/** Delete an uploaded photo once no menu item uses it any more. */
async function releaseImage(imageUrl: string | null | undefined, exceptItemId?: string) {
  const match = imageUrl?.match(UPLOADED_IMAGE);
  if (!match || !imageUrl) return;
  if (await menuRepository.imageInUse(imageUrl, exceptItemId)) return;
  await imageRepository.deleteById(match[1]);
}

async function assertImageExists(imageUrl: string | null | undefined) {
  const match = imageUrl?.match(UPLOADED_IMAGE);
  if (match && !(await imageRepository.findById(match[1]))) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'That photo is no longer available. Please upload it again.');
  }
}

function toWrite(dto: UpdateMenuItemDto): MenuItemWrite {
  const {categoryId, ...rest} = dto;
  return {...rest, ...(categoryId ? {category: categoryId} : {})};
}

export const adminMenuService = {
  /** Same shape as the public menu, but never cached. */
  async getMenu() {
    return menuService.getMenu();
  },

  async createItem(dto: MenuItemDto) {
    await assertCategory(dto.categoryId);
    await assertImageExists(dto.imageUrl);
    const item = await menuRepository.createItem({
      ...toWrite(dto),
      slug: await uniqueSlug(dto.name),
      sortOrder: await menuRepository.nextSortOrder(dto.categoryId)
    });
    return {id: String(item._id), slug: item.slug};
  },

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    const existing = await menuRepository.findItemById(id);
    if (!existing) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Menu item not found');

    if (dto.categoryId) await assertCategory(dto.categoryId);
    if (dto.imageUrl !== undefined) await assertImageExists(dto.imageUrl);

    const write = toWrite(dto);
    if (dto.name && dto.name !== existing.name) {
      write.slug = await uniqueSlug(dto.name, id);
    }
    if (dto.categoryId && dto.categoryId !== String(existing.category)) {
      write.sortOrder = await menuRepository.nextSortOrder(dto.categoryId);
    }

    const updated = await menuRepository.updateItem(id, write);
    if (!updated) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Menu item not found');

    if (dto.imageUrl !== undefined && dto.imageUrl !== existing.imageUrl) {
      await releaseImage(existing.imageUrl, id);
    }
    return {id, slug: updated.slug};
  },

  async deleteItem(id: string) {
    const existing = await menuRepository.findItemById(id);
    if (!existing) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Menu item not found');
    await menuRepository.deleteItem(id);
    await releaseImage(existing.imageUrl);
  }
};
