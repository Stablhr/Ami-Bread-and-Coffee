import {httpClient} from './httpClient';
import type {MenuCategory} from './menuApi';

export type ProductInput = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  deal: {quantity: number; price: number} | null;
  isFavorite: boolean;
  isAvailable: boolean;
  imageUrl: string | null;
  ingredients: string[];
  allergens: string[];
};

type SavedItem = {item: {id: string; slug: string}};

export async function getAdminMenu() {
  const res = await httpClient.get<{categories: MenuCategory[]}>('/admin/menu');
  return res.data.categories;
}

export async function createProduct(input: ProductInput) {
  const res = await httpClient.post<SavedItem>('/admin/menu/items', input);
  return res.data.item;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const res = await httpClient.patch<SavedItem>(`/admin/menu/items/${id}`, input);
  return res.data.item;
}

export async function deleteProduct(id: string) {
  await httpClient.delete(`/admin/menu/items/${id}`);
}

/** Uploads one photo and returns its URL path, e.g. "/api/images/<id>". */
export async function uploadProductPhoto(file: Blob, filename: string) {
  const form = new FormData();
  form.append('image', file, filename);
  const res = await httpClient.post<{image: {id: string; url: string}}>('/admin/uploads/image', form, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
  return res.data.image.url;
}
