/**
 * Seeds the Ami Bread & Coffee menu (taken from the shop's printed menus).
 * Safe to re-run: categories and items are upserted by slug, so prices and
 * names update in place and nothing is duplicated.
 *
 *   npm run seed:menu
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {CategoryModel} from '../api/models/Category.model';
import {MenuItemModel} from '../api/models/MenuItem.model';

dotenv.config();

type SeedItem = {
  name: string;
  price: number;
  description?: string;
  isFavorite?: boolean;
  deal?: {quantity: number; price: number};
};

type SeedCategory = {
  slug: string;
  name: string;
  note?: string;
  items: SeedItem[];
};

const SCONE_DEAL = {quantity: 3, price: 220};
const DRINK_NOTE = 'All drinks available hot and iced.';

const MENU: SeedCategory[] = [
  {
    slug: 'sourdough-breads',
    name: 'Sourdough Breads',
    items: [
      {name: 'Plain Sourdough', price: 200},
      {name: 'Multigrain Sourdough', price: 250},
      {name: 'Dried Fruits & Nuts Sourdough', price: 300},
      {name: 'Blueberry Sourdough', price: 300, isFavorite: true},
      {name: 'Espresso Sourdough', price: 300}
    ]
  },
  {
    slug: 'sampler-box',
    name: 'Sourdough Sampler Box',
    items: [
      {
        name: 'Sourdough Sampler Box',
        price: 700,
        description:
          'All 4 flavors, 500g each: Plain, Multigrain, Dried Fruits & Nuts, and Blueberry.'
      }
    ]
  },
  {
    slug: 'sourdough-scones',
    name: 'Sourdough Scones',
    note: 'Mix any 3 for ₱220.',
    items: [
      {name: 'Chocochip Scone', price: 80, deal: SCONE_DEAL},
      {name: 'Apple Cinnamon Scone', price: 80, deal: SCONE_DEAL},
      {name: 'Vanilla Almond Scone', price: 80, deal: SCONE_DEAL}
    ]
  },
  {
    slug: 'sourdough-toast',
    name: 'Sourdough Toast',
    items: [
      {name: 'Triple Cheese Toast', price: 120},
      {name: 'Pizza Toast', price: 120}
    ]
  },
  {
    slug: 'sourdough-focaccia',
    name: 'Sourdough Focaccia',
    items: [
      {name: 'Pepper Jack Jalapeño Focaccia', price: 150, isFavorite: true},
      {name: 'Toasted Brown Sugar Cinnamon Focaccia', price: 150},
      {name: 'Pesto Focaccia', price: 150}
    ]
  },
  {
    slug: 'coffee',
    name: 'Coffee',
    note: DRINK_NOTE,
    items: [
      {name: 'Black Coffee', price: 120},
      {name: 'Latte', price: 150},
      {name: 'White Chocolate', price: 170},
      {name: 'Milo Coffee', price: 170},
      {name: 'Caramel Special', price: 170, isFavorite: true},
      {name: 'Cornflakes Latte', price: 200}
    ]
  },
  {
    slug: 'non-coffee',
    name: 'Non-Coffee',
    note: DRINK_NOTE,
    items: [
      {name: 'Matcha Latte', price: 180, isFavorite: true},
      {name: 'Red Juice', price: 120},
      {name: 'Milo Dino', price: 150},
      {name: "Welch's Zero", price: 120}
    ]
  },
  {
    slug: 'pasta',
    name: 'Pasta',
    items: [
      {name: 'Truffle Pasta', price: 250, isFavorite: true},
      {name: 'Chicken Parmigiana with Herb Pasta', price: 250}
    ]
  },
  {
    slug: 'snacks',
    name: 'Snacks',
    items: [
      {name: 'Regular Fries', price: 100},
      {name: 'Curly Fries', price: 100, isFavorite: true},
      {name: 'Potato Wedges', price: 100},
      {name: 'Nuggets', price: 110},
      {name: 'Onion Rings', price: 110}
    ]
  }
];

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  let itemCount = 0;
  for (const [categoryIndex, category] of MENU.entries()) {
    const savedCategory = await CategoryModel.findOneAndUpdate(
      {slug: category.slug},
      {
        name: category.name,
        slug: category.slug,
        note: category.note ?? null,
        sortOrder: categoryIndex,
        isActive: true
      },
      {upsert: true, new: true, setDefaultsOnInsert: true}
    );

    for (const [itemIndex, item] of category.items.entries()) {
      await MenuItemModel.findOneAndUpdate(
        {slug: slugify(item.name)},
        {
          // Only menu facts are overwritten; availability and photos set by
          // the admin later are left alone on re-seed.
          $set: {
            category: savedCategory._id,
            name: item.name,
            slug: slugify(item.name),
            price: item.price,
            description: item.description ?? '',
            isFavorite: Boolean(item.isFavorite),
            deal: item.deal ?? null,
            sortOrder: itemIndex
          }
        },
        {upsert: true, new: true, setDefaultsOnInsert: true}
      );
      itemCount += 1;
    }
  }

  console.log(`Menu seeded: ${MENU.length} categories, ${itemCount} items.`);
  await mongoose.disconnect();
}

seed().catch(async error => {
  console.error('Menu seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
