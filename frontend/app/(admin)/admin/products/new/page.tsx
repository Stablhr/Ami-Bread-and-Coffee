'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {EMPTY_PRODUCT, ProductForm} from '@/components/admin/product-form';
import {FormMessage} from '@/components/auth/form-bits';
import {PageLoading} from '@/components/layout/page-loading';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {useAdminMenuQuery, useCreateProduct} from '@/lib/hooks/admin/useAdminMenu';

export default function NewProductPage() {
  const router = useRouter();
  const {data: categories, isPending, isError, error} = useAdminMenuQuery();
  const create = useCreateProduct();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <Link href="/admin/products" className="inline-flex min-h-11 items-center gap-2 font-bold text-ink-soft hover:text-ink">
        <ArrowLeft aria-hidden="true" className="size-5" />
        All products
      </Link>
      <h1 className="mt-2 font-sans text-3xl font-extrabold">Add a product</h1>

      <div className="mt-8">
        {isPending ? (
          <PageLoading />
        ) : isError ? (
          <FormMessage tone="error">{getFriendlyErrorMessage(error, 'Could not load menu sections.')}</FormMessage>
        ) : (
          <ProductForm
            categories={categories}
            initialValues={EMPTY_PRODUCT}
            submitLabel="Add product"
            isSaving={create.isPending}
            serverError={create.isError ? getFriendlyErrorMessage(create.error, 'Could not save the product.') : null}
            onSubmit={input =>
              create.mutate(input, {
                onSuccess: () => router.push(`/admin/products?saved=${encodeURIComponent(input.name)}`)
              })
            }
          />
        )}
      </div>
    </div>
  );
}
