'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Save} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {FormMessage} from '@/components/auth/form-bits';
import {PhotoField} from './photo-field';
import {TagListField} from './tag-list-field';
import type {ProductInput} from '@/lib/api/adminMenuApi';
import type {MenuCategory} from '@/lib/api/menuApi';
import {cn} from '@/lib/utils';

export const COMMON_ALLERGENS = [
  'Wheat (gluten)',
  'Milk',
  'Egg',
  'Tree nuts',
  'Peanuts',
  'Soy',
  'Sesame',
  'Fish',
  'Shellfish'
];

export type ProductFormValues = {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  hasDeal: boolean;
  dealQuantity: string;
  dealPrice: string;
  isFavorite: boolean;
  isAvailable: boolean;
  imageUrl: string | null;
  ingredients: string[];
  allergens: string[];
};

export const EMPTY_PRODUCT: ProductFormValues = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  hasDeal: false,
  dealQuantity: '3',
  dealPrice: '',
  isFavorite: false,
  isAvailable: true,
  imageUrl: null,
  ingredients: [],
  allergens: []
};

type Errors = Partial<Record<'categoryId' | 'name' | 'price' | 'deal', string>>;

const FIELD_ERROR: Partial<Record<keyof ProductFormValues, keyof Errors>> = {
  name: 'name',
  categoryId: 'categoryId',
  price: 'price',
  hasDeal: 'deal',
  dealQuantity: 'deal',
  dealPrice: 'deal'
};

const wholePesos = (value: string) => /^\d{1,6}$/.test(value.trim());

function validate(values: ProductFormValues): {errors: Errors; input?: ProductInput} {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Give the product a name.';
  if (!values.categoryId) errors.categoryId = 'Choose where it goes on the menu.';
  if (!wholePesos(values.price)) errors.price = 'Enter the price in whole pesos, e.g. 150.';
  if (values.hasDeal) {
    const qty = Number(values.dealQuantity);
    if (!Number.isInteger(qty) || qty < 2 || qty > 50 || !wholePesos(values.dealPrice)) {
      errors.deal = 'Enter how many (2 or more) and the bundle price in whole pesos.';
    }
  }
  if (Object.keys(errors).length > 0) return {errors};

  return {
    errors,
    input: {
      categoryId: values.categoryId,
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      deal: values.hasDeal ? {quantity: Number(values.dealQuantity), price: Number(values.dealPrice)} : null,
      isFavorite: values.isFavorite,
      isAvailable: values.isAvailable,
      imageUrl: values.imageUrl,
      ingredients: values.ingredients,
      allergens: values.allergens
    }
  };
}

function Section({title, hint, children}: {title: string; hint?: string; children: React.ReactNode}) {
  return (
    <section className="rounded-2xl border-2 border-ink/80 bg-linen p-5 md:p-6">
      <h2 className="font-sans text-xl font-extrabold">{title}</h2>
      {hint && <p className="mt-1 text-ink-soft">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function FieldError({id, message}: {id: string; message?: string}) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-bold text-tomato">
      {message}
    </p>
  );
}

export function ProductForm({
  categories,
  initialValues,
  submitLabel,
  onSubmit,
  isSaving,
  serverError
}: {
  categories: MenuCategory[];
  initialValues: ProductFormValues;
  submitLabel: string;
  onSubmit: (input: ProductInput) => void;
  isSaving: boolean;
  serverError: string | null;
}) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues(prev => ({...prev, [key]: value}));
    // Clear the matching error as soon as the field is changed.
    const errorKey = FIELD_ERROR[key];
    if (errorKey) setErrors(prev => ({...prev, [errorKey]: undefined}));
  };

  const otherAllergens = values.allergens.filter(a => !COMMON_ALLERGENS.includes(a));
  const toggleAllergen = (allergen: string, checked: boolean) =>
    set(
      'allergens',
      checked ? [...values.allergens, allergen] : values.allergens.filter(a => a !== allergen)
    );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validate(values);
    setErrors(result.errors);
    if (result.input) onSubmit(result.input);
  };

  const categoryItems = categories.map(c => ({value: c.id, label: c.name}));

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Section title="Photo" hint="Shown on the menu. A clear, close-up photo works best.">
        <PhotoField value={values.imageUrl} onChange={url => set('imageUrl', url)} productName={values.name} />
      </Section>

      <Section title="Basics">
        <div className="space-y-2">
          <Label htmlFor="name">Product name</Label>
          <Input
            id="name"
            value={values.name}
            maxLength={80}
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={e => set('name', e.target.value)}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Menu section</Label>
            <Select
              items={categoryItems}
              value={values.categoryId || null}
              onValueChange={value => set('categoryId', typeof value === 'string' ? value : '')}
            >
              <SelectTrigger
                id="category"
                aria-invalid={Boolean(errors.categoryId) || undefined}
                aria-describedby={errors.categoryId ? 'category-error' : undefined}
              >
                <SelectValue placeholder="Choose a section" />
              </SelectTrigger>
              <SelectContent>
                {categoryItems.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="category-error" message={errors.categoryId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₱)</Label>
            <Input
              id="price"
              inputMode="numeric"
              placeholder="e.g. 150"
              value={values.price}
              aria-invalid={Boolean(errors.price) || undefined}
              aria-describedby={errors.price ? 'price-error' : undefined}
              onChange={e => set('price', e.target.value.replace(/[^\d]/g, ''))}
            />
            <FieldError id="price-error" message={errors.price} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short description</Label>
          <Textarea
            id="description"
            maxLength={500}
            placeholder="One or two sentences customers will see."
            value={values.description}
            onChange={e => set('description', e.target.value)}
          />
          <p className="text-sm text-ink-soft">{values.description.length}/500</p>
        </div>

        <div className="rounded-xl border-2 border-dashed border-ink/30 p-4">
          <label className="flex items-center gap-3 font-bold">
            <Checkbox checked={values.hasDeal} onCheckedChange={checked => set('hasDeal', checked === true)} />
            Bundle deal (e.g. any 3 for ₱220)
          </label>
          {values.hasDeal && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dealQuantity">How many</Label>
                <Input
                  id="dealQuantity"
                  inputMode="numeric"
                  value={values.dealQuantity}
                  onChange={e => set('dealQuantity', e.target.value.replace(/[^\d]/g, ''))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealPrice">Bundle price (₱)</Label>
                <Input
                  id="dealPrice"
                  inputMode="numeric"
                  value={values.dealPrice}
                  onChange={e => set('dealPrice', e.target.value.replace(/[^\d]/g, ''))}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldError id="deal-error" message={errors.deal} />
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section
        title="Ingredients"
        hint="List the main ingredients in plain words. Customers see these on the menu."
      >
        <TagListField
          id="ingredients"
          value={values.ingredients}
          onChange={next => set('ingredients', next)}
          placeholder="e.g. Bread flour"
        />
      </Section>

      <Section title="Allergens" hint="Tick everything this product contains.">
        <fieldset>
          <legend className="sr-only">Allergens</legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COMMON_ALLERGENS.map(allergen => (
              <label key={allergen} className="flex min-h-11 items-center gap-3 rounded-lg px-1 text-base">
                <Checkbox
                  checked={values.allergens.includes(allergen)}
                  onCheckedChange={checked => toggleAllergen(allergen, checked === true)}
                />
                {allergen}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor="other-allergens">Other allergens</Label>
          <TagListField
            id="other-allergens"
            value={otherAllergens}
            onChange={next =>
              set('allergens', [...values.allergens.filter(a => COMMON_ALLERGENS.includes(a)), ...next])
            }
            placeholder="e.g. Mustard"
          />
        </div>
      </Section>

      <Section title="On the menu">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-bold">Available</span>
            <span className="text-ink-soft">Turn off when it&apos;s sold out. It stays on the menu as “Sold out”.</span>
          </span>
          <Switch checked={values.isAvailable} onCheckedChange={checked => set('isAvailable', checked)} />
        </label>
        <label className="flex items-center gap-3">
          <Checkbox checked={values.isFavorite} onCheckedChange={checked => set('isFavorite', checked === true)} />
          <span>
            <span className="block font-bold">Customer favorite ♥</span>
            <span className="text-ink-soft">Shows a heart and features it on the home page.</span>
          </span>
        </label>
      </Section>

      {serverError && <FormMessage tone="error">{serverError}</FormMessage>}
      {Object.values(errors).some(Boolean) && (
        <FormMessage tone="error">Please fix the fields marked in red above.</FormMessage>
      )}

      <div className={cn('sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-3 border-t-2 border-ink/20 bg-paper/95 px-4 py-4 backdrop-blur-sm md:mx-0 md:rounded-2xl md:border-2')}>
        <Link href="/admin/products" className={buttonVariants({variant: 'ghost'})}>
          Cancel
        </Link>
        <Button type="submit" disabled={isSaving}>
          <Save aria-hidden="true" />
          {isSaving ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
