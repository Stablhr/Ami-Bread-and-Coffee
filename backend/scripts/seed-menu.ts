/**
 * Seeds the Ami Bread & Coffee menu (from the shop's printed menus and posters).
 *
 *   npm run seed:menu
 *
 * Safe to re-run, and safe after the admin has edited products:
 *  - categories are upserted by slug;
 *  - missing items are created;
 *  - existing items are NEVER overwritten. Only empty fields (no photo, no
 *    description, no ingredients/allergens) are filled in from this file.
 *  - items the admin deleted are not brought back unless you pass --restore.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {CategoryModel} from '../api/models/Category.model';
import {MenuItemModel} from '../api/models/MenuItem.model';
import {slugify} from '../api/utils/slug';

dotenv.config();

type SeedItem = {
  name: string;
  /** Set when the display name differs from the slug already in use. */
  slug?: string;
  price: number;
  description?: string;
  isFavorite?: boolean;
  deal?: {quantity: number; price: number};
  imageUrl?: string;
  ingredients?: string[];
  allergens?: string[];
};

type SeedCategory = {
  slug: string;
  name: string;
  note?: string;
  items: SeedItem[];
};

/*
 * Ingredients and allergens are a FIRST DRAFT from the menus and posters.
 * The owner should check and correct them in Admin → Products.
 */
const WHEAT = 'Wheat (gluten)';
const MILK = 'Milk';
const EGG = 'Egg';
const TREE_NUTS = 'Tree nuts';

const SOURDOUGH_BASE = ['Bread flour', 'Water', 'Sourdough starter', 'Salt'];
const SCONE_BASE = ['Flour', 'Sourdough starter', 'Butter', 'Sugar', 'Milk', 'Egg'];
const FOCACCIA_BASE = ['Bread flour', 'Water', 'Sourdough starter', 'Olive oil', 'Salt'];
const ESPRESSO = 'Espresso';

const SCONE_DEAL = {quantity: 3, price: 220};
const DRINK_NOTE = 'All drinks available hot and iced.';

const MENU: SeedCategory[] = [
  {
    slug: 'seasonal-specials',
    name: 'Seasonal Specials',
    note: 'Here for a limited time only.',
    items: [
      {
        name: 'Campfire Moka',
        price: 160,
        description: "Mocha latte topped with s'mores whipped cream. Warm, sweet and toasted, just like a campfire moment.",
        imageUrl: '/products/campfire-moka.webp',
        ingredients: [ESPRESSO, 'Chocolate', 'Milk', 'Whipped cream', 'Toasted marshmallow', 'Graham crumbs'],
        allergens: [MILK, WHEAT]
      },
      {
        name: 'Iced Peppermint Mocha',
        price: 220,
        description: 'Our Christmas mocha over ice, with a cloud of cream and crushed candy cane on top.',
        imageUrl: '/products/iced-peppermint-mocha.webp',
        ingredients: [ESPRESSO, 'Chocolate', 'Peppermint syrup', 'Milk', 'Cream foam', 'Crushed candy cane'],
        allergens: [MILK]
      },
      {
        name: 'Hot Peppermint Mocha',
        price: 220,
        description: 'A warm peppermint mocha with a thick cream cap, for the Christmas season.',
        imageUrl: '/products/hot-peppermint-mocha.webp',
        ingredients: [ESPRESSO, 'Chocolate', 'Peppermint syrup', 'Steamed milk', 'Cream foam', 'Crushed candy cane'],
        allergens: [MILK]
      },
      {
        name: 'Pistachio Matcha',
        price: 250,
        description: 'Layered iced matcha latte with pistachio cream and crushed pistachios.',
        imageUrl: '/products/pistachio-matcha.webp',
        ingredients: ['Matcha', 'Milk', 'Pistachio cream', 'Crushed pistachios'],
        allergens: [MILK, TREE_NUTS]
      }
    ]
  },
  {
    slug: 'sourdough-breads',
    name: 'Sourdough Breads',
    items: [
      {
        name: 'Plain Sourdough',
        price: 200,
        description: 'Our everyday loaf: crackly crust, soft and tangy inside.',
        imageUrl: '/products/plain-sourdough.webp',
        ingredients: SOURDOUGH_BASE,
        allergens: [WHEAT]
      },
      {
        name: 'Multigrain Sourdough',
        price: 250,
        description: 'Hearty sourdough with mixed grains and seeds.',
        imageUrl: '/products/multigrain-sourdough.webp',
        ingredients: [...SOURDOUGH_BASE, 'Whole wheat flour', 'Mixed grains and seeds'],
        allergens: [WHEAT]
      },
      {
        name: 'Dried Fruits & Nuts Sourdough',
        price: 300,
        description: 'Sourdough packed with dried fruits and nuts. Lovely toasted with butter.',
        imageUrl: '/products/dried-fruits-and-nuts-sourdough.webp',
        ingredients: [...SOURDOUGH_BASE, 'Dried fruits', 'Mixed nuts'],
        allergens: [WHEAT, TREE_NUTS]
      },
      {
        name: 'Blueberry Sourdough',
        price: 300,
        isFavorite: true,
        description: 'Sourdough with blueberries, a customer favorite.',
        imageUrl: '/products/blueberry-sourdough.webp',
        ingredients: [...SOURDOUGH_BASE, 'Blueberries'],
        allergens: [WHEAT]
      },
      {
        name: 'Espresso Choco Sourdough',
        slug: 'espresso-sourdough',
        price: 300,
        description: 'Dark, aromatic sourdough with espresso and chocolate.',
        imageUrl: '/products/espresso-sourdough.webp',
        ingredients: [...SOURDOUGH_BASE, 'Espresso', 'Chocolate'],
        allergens: [WHEAT, MILK]
      }
    ]
  },
  {
    slug: 'sampler-box',
    name: 'Sourdough Sampler Box',
    items: [
      {
        name: 'Sourdough Sampler Box',
        price: 700,
        description: 'All 4 flavors, 500g each: Plain, Multigrain, Dried Fruits & Nuts, and Blueberry.',
        ingredients: [
          'Plain Sourdough (500g)',
          'Multigrain Sourdough (500g)',
          'Dried Fruits & Nuts Sourdough (500g)',
          'Blueberry Sourdough (500g)'
        ],
        allergens: [WHEAT, TREE_NUTS]
      }
    ]
  },
  {
    slug: 'sourdough-scones',
    name: 'Sourdough Scones',
    note: 'Mix any 3 for ₱220.',
    items: [
      {name: 'Chocochip Scone', price: 80, deal: SCONE_DEAL, ingredients: [...SCONE_BASE, 'Chocolate chips'], allergens: [WHEAT, MILK, EGG]},
      {name: 'Apple Cinnamon Scone', price: 80, deal: SCONE_DEAL, ingredients: [...SCONE_BASE, 'Apple', 'Cinnamon'], allergens: [WHEAT, MILK, EGG]},
      {name: 'Vanilla Almond Scone', price: 80, deal: SCONE_DEAL, ingredients: [...SCONE_BASE, 'Vanilla', 'Almonds'], allergens: [WHEAT, MILK, EGG, TREE_NUTS]}
    ]
  },
  {
    slug: 'sourdough-toast',
    name: 'Sourdough Toast',
    items: [
      {name: 'Triple Cheese Toast', price: 120, ingredients: ['Sourdough bread', 'Three kinds of cheese', 'Butter'], allergens: [WHEAT, MILK]},
      {name: 'Pizza Toast', price: 120, ingredients: ['Sourdough bread', 'Tomato sauce', 'Cheese', 'Pizza toppings'], allergens: [WHEAT, MILK]}
    ]
  },
  {
    slug: 'sourdough-focaccia',
    name: 'Sourdough Focaccia',
    items: [
      {name: 'Pepper Jack Jalapeño Focaccia', price: 150, isFavorite: true, ingredients: [...FOCACCIA_BASE, 'Pepper jack cheese', 'Jalapeño'], allergens: [WHEAT, MILK]},
      {name: 'Toasted Brown Sugar Cinnamon Focaccia', price: 150, ingredients: [...FOCACCIA_BASE, 'Brown sugar', 'Cinnamon', 'Butter'], allergens: [WHEAT, MILK]},
      {name: 'Pesto Focaccia', price: 150, ingredients: [...FOCACCIA_BASE, 'Pesto (basil, garlic, cheese, nuts)'], allergens: [WHEAT, MILK, TREE_NUTS]}
    ]
  },
  {
    slug: 'coffee',
    name: 'Coffee',
    note: DRINK_NOTE,
    items: [
      {name: 'Black Coffee', price: 120, ingredients: [ESPRESSO, 'Water']},
      {name: 'Latte', price: 150, ingredients: [ESPRESSO, 'Milk'], allergens: [MILK]},
      {name: 'White Chocolate', price: 170, ingredients: [ESPRESSO, 'Milk', 'White chocolate sauce'], allergens: [MILK]},
      {name: 'Milo Coffee', price: 170, ingredients: [ESPRESSO, 'Milk', 'Milo'], allergens: [MILK]},
      {name: 'Caramel Special', price: 170, isFavorite: true, ingredients: [ESPRESSO, 'Milk', 'Caramel'], allergens: [MILK]},
      {name: 'Cornflakes Latte', price: 200, ingredients: [ESPRESSO, 'Milk', 'Cornflakes'], allergens: [MILK]}
    ]
  },
  {
    slug: 'non-coffee',
    name: 'Non-Coffee',
    note: DRINK_NOTE,
    items: [
      {name: 'Matcha Latte', price: 180, isFavorite: true, ingredients: ['Matcha', 'Milk'], allergens: [MILK]},
      {name: 'Red Juice', price: 120},
      {name: 'Milo Dino', price: 150, ingredients: ['Milo', 'Milk', 'Extra Milo powder on top'], allergens: [MILK]},
      {name: "Welch's Zero", price: 120, ingredients: ["Welch's Zero soda"]}
    ]
  },
  {
    slug: 'pasta',
    name: 'Pasta',
    items: [
      {name: 'Truffle Pasta', price: 250, isFavorite: true, ingredients: ['Pasta', 'Truffle oil', 'Cream', 'Parmesan cheese', 'Garlic'], allergens: [WHEAT, MILK]},
      {name: 'Chicken Parmigiana with Herb Pasta', price: 250, ingredients: ['Breaded chicken', 'Tomato sauce', 'Mozzarella', 'Parmesan cheese', 'Herb pasta'], allergens: [WHEAT, MILK, EGG]}
    ]
  },
  {
    slug: 'snacks',
    name: 'Snacks',
    items: [
      {name: 'Regular Fries', price: 100, ingredients: ['Potatoes', 'Vegetable oil', 'Salt']},
      {name: 'Curly Fries', price: 100, isFavorite: true, ingredients: ['Seasoned potatoes', 'Vegetable oil']},
      {name: 'Potato Wedges', price: 100, ingredients: ['Potatoes', 'Vegetable oil', 'Seasoning']},
      {name: 'Nuggets', price: 110, ingredients: ['Chicken nuggets', 'Vegetable oil'], allergens: [WHEAT]},
      {name: 'Onion Rings', price: 110, ingredients: ['Onions', 'Batter', 'Vegetable oil'], allergens: [WHEAT]}
    ]
  }
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }
  const restore = process.argv.includes('--restore');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // First run ever? Then every item is "new". Later runs only create items
  // when --restore is passed, so products the admin deleted stay deleted.
  const firstRun = (await MenuItemModel.estimatedDocumentCount()) === 0;
  const counts = {created: 0, filled: 0, skipped: 0};

  for (const [categoryIndex, category] of MENU.entries()) {
    const savedCategory = await CategoryModel.findOneAndUpdate(
      {slug: category.slug},
      {name: category.name, slug: category.slug, note: category.note ?? null, sortOrder: categoryIndex, isActive: true},
      {upsert: true, new: true, setDefaultsOnInsert: true}
    );

    // A category with no items yet (e.g. new Seasonal Specials) gets all of them.
    const categoryWasEmpty = !(await MenuItemModel.exists({category: savedCategory._id}));

    for (const [itemIndex, item] of category.items.entries()) {
      const slug = item.slug ?? slugify(item.name);
      const existing = await MenuItemModel.findOne({slug});

      if (!existing) {
        if (!firstRun && !restore && !categoryWasEmpty) {
          counts.skipped += 1;
          continue;
        }
        await MenuItemModel.create({
          category: savedCategory._id,
          name: item.name,
          slug,
          price: item.price,
          description: item.description ?? '',
          isFavorite: Boolean(item.isFavorite),
          deal: item.deal ?? null,
          imageUrl: item.imageUrl ?? null,
          ingredients: item.ingredients ?? [],
          allergens: item.allergens ?? [],
          sortOrder: itemIndex
        });
        counts.created += 1;
        continue;
      }

      // Existing item: only fill blanks, never overwrite admin edits.
      const fill: Record<string, unknown> = {};
      if (!existing.imageUrl && item.imageUrl) fill.imageUrl = item.imageUrl;
      if (!existing.description && item.description) fill.description = item.description;
      if (!existing.ingredients?.length && item.ingredients?.length) fill.ingredients = item.ingredients;
      if (!existing.allergens?.length && item.allergens?.length) fill.allergens = item.allergens;
      if (Object.keys(fill).length > 0) {
        await MenuItemModel.updateOne({_id: existing._id}, {$set: fill});
        counts.filled += 1;
      }
    }
  }

  console.log(
    `Menu seed: ${counts.created} created, ${counts.filled} filled in, ` +
      `${counts.skipped} skipped (deleted by admin; use --restore to bring back).`
  );
  await mongoose.disconnect();
}

seed().catch(async error => {
  console.error('Menu seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
