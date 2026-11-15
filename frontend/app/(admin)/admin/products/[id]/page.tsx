'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {ArrowLeft, Trash2} from 'lucide-react';
import {DeleteProductDialog} from '@/components/admin/delete-product-dialog';
import {ProductForm, type ProductFormValues} from '@/components/admin/product-form';
import {FormMessage} from '@/components/auth/form-bits';
import {PageLoading} from '@/components/layout/page-loading';
import {Button} from '@/components/ui/button';
import type {MenuItem} from '@/lib/api/menuApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {useAdminMenuQuery, useDeleteProduct, useUpdateProduct} from '@/lib/hooks/admin/useAdminMenu';

function toFormValues(item: MenuItem, categoryId: string): ProductFormValues {
  return {
    categoryId,
    name: item.name,
    description: item.description,
    price: String(item.price),
    hasDeal: item.deal !== null,
    dealQuantity: String(item.deal?.quantity ?? 3),
    dealPrice: item.deal ? String(item.deal.price) : '',
    isFavorite: item.isFavorite,
    isAvailable: item.isAvailable,
    imageUrl: item.imageUrl,
    ingredients: item.ingredients,
    allergens: item.allergens
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const {id} = useParams<{id: string}>();
  const {data: categories, isPending, isError, error} = useAdminMenuQuery();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const category = categories?.find(c => c.items.some(item => item.id === id));
  const item = category?.items.find(entry => entry.id === id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <Link href="/admin/products" className="inline-flex min-h-11 items-center gap-2 font-bold text-ink-soft hover:text-ink">
        <ArrowLeft aria-hidden="true" className="size-5" />
        All products
      </Link>

      {isPending ? (
        <PageLoading />
      ) : isError ? (
        <div className="mt-6">
          <FormMessage tone="error">{getFriendlyErrorMessage(error, 'Could not load this product.')}</FormMessage>
        </div>
      ) : !item || !category ? (
        <div className="mt-6">
          <FormMessage tone="error">This product no longer exists. It may have been deleted.</FormMessage>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-sans text-3xl font-extrabold">Edit {item.name}</h1>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                remove.reset();
                setConfirmOpen(true);
              }}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          </div>
          <div className="mt-8">
            <ProductForm
              // Re-mount the form if another tab changes the product meanwhile.
              key={item.id}
              categories={categories}
              initialValues={toFormValues(item, category.id)}
              submitLabel="Save changes"
              isSaving={update.isPending}
              serverError={update.isError ? getFriendlyErrorMessage(update.error, 'Could not save your changes.') : null}
              onSubmit={input =>
                update.mutate(
                  {id: item.id, input},
                  {onSuccess: () => router.push(`/admin/products?saved=${encodeURIComponent(input.name)}`)}
                )
              }
            />
          </div>
          <DeleteProductDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            productName={item.name}
            isDeleting={remove.isPending}
            error={remove.isError ? getFriendlyErrorMessage(remove.error, 'Could not delete it.') : null}
            onConfirm={() =>
              remove.mutate(item.id, {
                onSuccess: () => router.push('/admin/products')
              })
            }
          />
        </>
      )}
    </div>
  );
}
