'use client';

import {Suspense, useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Heart, Pencil, Plus, Search, Trash2} from 'lucide-react';
import {DeleteProductDialog} from '@/components/admin/delete-product-dialog';
import {ProductPhoto} from '@/components/admin/product-photo';
import {FormMessage} from '@/components/auth/form-bits';
import {PageLoading} from '@/components/layout/page-loading';
import {Button, buttonVariants} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Switch} from '@/components/ui/switch';
import type {MenuItem} from '@/lib/api/menuApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {useAdminMenuQuery, useDeleteProduct, useUpdateProduct} from '@/lib/hooks/admin/useAdminMenu';
import {formatPeso} from '@/lib/shop';

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ProductsList />
    </Suspense>
  );
}

function ProductsList() {
  const params = useSearchParams();
  const router = useRouter();
  const saved = params.get('saved');

  // Show "Saved …" once, then tidy the URL so a refresh doesn't repeat it.
  useEffect(() => {
    if (saved) router.replace('/admin/products', {scroll: false});
  }, [saved, router]);
  const {data: categories, isPending, isError, error, refetch} = useAdminMenuQuery();
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<MenuItem | null>(null);
  // Kept after closing so the dialog's fade-out doesn't flash an empty name.
  const [deleteName, setDeleteName] = useState('');
  const [notice, setNotice] = useState<string | null>(saved ? `Saved “${saved}”.` : null);
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!categories) return [];
    return categories
      .map(category => ({
        ...category,
        items: q ? category.items.filter(item => item.name.toLowerCase().includes(q)) : category.items
      }))
      .filter(category => category.items.length > 0 || !q);
  }, [categories, query]);

  const total = categories?.reduce((sum, c) => sum + c.items.length, 0) ?? 0;

  if (isPending) return <PageLoading label="Loading products…" />;
  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <FormMessage tone="error">{getFriendlyErrorMessage(error, 'Could not load the products.')}</FormMessage>
        <Button className="mt-4" variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const confirmDelete = () => {
    if (!toDelete) return;
    const name = toDelete.name;
    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => {
        setToDelete(null);
        setNotice(`Deleted “${name}”.`);
      }
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold">Products</h1>
          <p className="mt-1 text-lg text-ink-soft">{total} items on the menu. Changes show on the website right away.</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants()}>
          <Plus aria-hidden="true" />
          Add product
        </Link>
      </div>

      {notice && (
        <div className="mt-6">
          <FormMessage tone="success">{notice}</FormMessage>
        </div>
      )}
      {updateMutation.isError && (
        <div className="mt-6">
          <FormMessage tone="error">
            {getFriendlyErrorMessage(updateMutation.error, 'Could not update availability.')}
          </FormMessage>
        </div>
      )}

      <div className="relative mt-6 max-w-md">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
        <Input
          type="search"
          aria-label="Search products"
          placeholder="Search products"
          className="pl-12"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-8 space-y-10">
        {filtered.map(category => (
          <section key={category.id} aria-labelledby={`admin-cat-${category.id}`}>
            <h2 id={`admin-cat-${category.id}`} className="font-sans text-xl font-extrabold">
              {category.name} <span className="font-normal text-ink-soft">({category.items.length})</span>
            </h2>
            {category.items.length === 0 ? (
              <p className="mt-3 text-ink-soft">No products in this section yet.</p>
            ) : (
              <ul className="mt-3 divide-y-2 divide-ink/10 overflow-hidden rounded-2xl border-2 border-ink/80 bg-linen">
                {category.items.map(item => (
                  <li key={item.id} className="flex flex-wrap items-center gap-4 p-4">
                    <ProductPhoto url={item.imageUrl} alt={item.name} className="w-16 shrink-0" sizes="64px" />
                    <div className="min-w-[10rem] flex-1">
                      <p className="flex items-center gap-2 text-lg font-bold">
                        <span className="truncate">{item.name}</span>
                        {item.isFavorite && <Heart aria-label="Customer favorite" className="size-4 shrink-0 fill-cocoa text-cocoa" />}
                      </p>
                      <p className="text-ink-soft">
                        {formatPeso(item.price)}
                        {item.deal && ` · ${item.deal.quantity} for ${formatPeso(item.deal.price)}`}
                        {item.ingredients.length === 0 && ' · no ingredients yet'}
                        {!item.imageUrl && ' · no photo yet'}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <label className="flex items-center gap-2 text-sm font-bold">
                      <Switch
                        size="sm"
                        checked={item.isAvailable}
                        disabled={updateMutation.isPending}
                        onCheckedChange={checked =>
                          updateMutation.mutate({id: item.id, input: {isAvailable: checked}})
                        }
                      />
                      {item.isAvailable ? 'Available' : 'Sold out'}
                    </label>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${item.id}`}
                        className={buttonVariants({variant: 'outline', size: 'sm'})}
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil aria-hidden="true" />
                        Edit
                      </Link>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => {
                          deleteMutation.reset();
                          setDeleteName(item.name);
                          setToDelete(item);
                        }}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        {filtered.length === 0 && <p className="text-lg text-ink-soft">No products match “{query}”.</p>}
      </div>

      <DeleteProductDialog
        open={toDelete !== null}
        onOpenChange={open => !open && setToDelete(null)}
        productName={deleteName}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
        error={deleteMutation.isError ? getFriendlyErrorMessage(deleteMutation.error, 'Could not delete it.') : null}
      />
    </div>
  );
}
