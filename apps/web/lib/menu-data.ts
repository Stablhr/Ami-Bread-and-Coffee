export type MenuCategory = {
  slug: string;
  name: string;
  description: string;
};

export type MenuItem = {
  slug: string;
  name: string;
  category: string;
  /** Price in centavos, matching the API storage format. */
  price: number;
  description: string;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  /** Optional quantity deal, e.g. scones 3 for 220. */
  deal?: { quantity: number; price: number };
  weight?: string;
  featured?: boolean;
};

/**
 * Static catalog for Phase 1 pages. Phase 2 replaces this with the API
 * (`GET /api/v1/menu`) once the database is seeded.
 *
 * Ingredient and allergen lists are SAMPLE PLACEHOLDERS pending owner
 * confirmation (PLAN.md A-5, 16.1). The menu page shows a notice telling
 * customers to ask the shop before ordering if they have an allergy.
 */
export const menuCategories: MenuCategory[] = [
  {
    slug: "sourdough-breads",
    name: "Sourdough Breads",
    description: "Naturally leavened loaves, baked fresh the morning of your pickup."
  },
  {
    slug: "sampler-box",
    name: "Sampler Box",
    description: "Four half-loaves, one of each flavor, for the indecisive table."
  },
  {
    slug: "scones",
    name: "Sourdough Scones",
    description: "Crumbly, buttery, and best warmed for a minute."
  },
  {
    slug: "toast",
    name: "Sourdough Toast",
    description: "Thick slices built for a proper merienda."
  },
  {
    slug: "focaccia",
    name: "Sourdough Focaccia",
    description: "Dimpled, olive-oiled, and cut into generous squares."
  },
  {
    slug: "coffee-drinks",
    name: "Coffee & Drinks",
    description: "Poured to go with whatever comes out of the oven."
  }
];

export const menuItems: MenuItem[] = [
  // Sourdough breads (~800 g)
  {
    slug: "plain-sourdough",
    name: "Plain Sourdough",
    category: "sourdough-breads",
    price: 20000,
    weight: "~800 g",
    description:
      "Our everyday loaf: a crackling crust, an open crumb, and a gentle tang. Good for toast, sandwiches, or tearing into while it is still warm.",
    ingredients: ["Wheat flour", "Water", "Sourdough starter", "Sea salt"],
    allergens: ["Gluten"],
    tags: ["Bestseller", "Vegan"],
    featured: true
  },
  {
    slug: "multigrain-sourdough",
    name: "Multigrain Sourdough",
    category: "sourdough-breads",
    price: 25000,
    weight: "~800 g",
    description:
      "A seeded loaf with oats, flax, and sunflower. Nutty, hearty, and happy under a layer of butter.",
    ingredients: ["Wheat flour", "Water", "Sourdough starter", "Sea salt", "Oats", "Flaxseed", "Sunflower seeds"],
    allergens: ["Gluten"],
    tags: ["Seeded", "Vegan"],
    featured: true
  },
  {
    slug: "dried-fruits-nuts-sourdough",
    name: "Dried Fruits & Nuts Sourdough",
    category: "sourdough-breads",
    price: 30000,
    weight: "~800 g",
    description:
      "Raisins, cranberries, walnuts, and a whisper of cinnamon folded through a soft sourdough crumb.",
    ingredients: ["Wheat flour", "Water", "Sourdough starter", "Sea salt", "Raisins", "Cranberries", "Walnuts", "Cinnamon"],
    allergens: ["Gluten", "Tree nuts"],
    tags: ["Sweet", "Vegan"]
  },
  {
    slug: "blueberry-sourdough",
    name: "Blueberry Sourdough",
    category: "sourdough-breads",
    price: 30000,
    weight: "~800 g",
    description:
      "Bursts of blueberry in a lightly sweet loaf. Lovely toasted with cream cheese.",
    ingredients: ["Wheat flour", "Water", "Sourdough starter", "Sea salt", "Blueberries", "Sugar"],
    allergens: ["Gluten"],
    tags: ["Sweet"],
    featured: true
  },
  {
    slug: "espresso-sourdough",
    name: "Espresso Sourdough",
    category: "sourdough-breads",
    price: 30000,
    weight: "~800 g",
    description:
      "A dark, malty loaf with a shot of espresso in the dough. Pairs well with the morning brew it borrowed from.",
    ingredients: ["Wheat flour", "Water", "Sourdough starter", "Sea salt", "Espresso", "Cocoa"],
    allergens: ["Gluten"],
    tags: ["Coffee"]
  },

  // Sampler box
  {
    slug: "sampler-box",
    name: "Sampler Box",
    category: "sampler-box",
    price: 70000,
    description:
      "Four half-loaves — Dried Fruits & Nuts, Multigrain, Plain, and Blueberry — boxed up so everyone at the table gets a favorite.",
    ingredients: ["Wheat flour", "Water", "Sourdough starter", "Sea salt", "Oats", "Flaxseed", "Sunflower seeds", "Raisins", "Cranberries", "Walnuts", "Blueberries"],
    allergens: ["Gluten", "Tree nuts"],
    tags: ["Bundle", "Four flavors"],
    featured: true
  },

  // Scones
  {
    slug: "chocochip-scone",
    name: "Chocochip Scone",
    category: "scones",
    price: 8000,
    deal: { quantity: 3, price: 22000 },
    description:
      "A tender sourdough scone studded with chocolate chips. Warm it for twenty seconds and thank us later.",
    ingredients: ["Wheat flour", "Butter", "Sugar", "Sourdough starter", "Chocolate chips", "Cream", "Sea salt"],
    allergens: ["Gluten", "Dairy"],
    tags: ["Bestseller"],
    featured: true
  },
  {
    slug: "apple-cinnamon-scone",
    name: "Apple Cinnamon Scone",
    category: "scones",
    price: 8000,
    deal: { quantity: 3, price: 22000 },
    description:
      "Soft apple pieces and cinnamon sugar in every bite. Tastes like the first cool morning of the year.",
    ingredients: ["Wheat flour", "Butter", "Sugar", "Sourdough starter", "Apple", "Cinnamon", "Cream", "Sea salt"],
    allergens: ["Gluten", "Dairy"],
    tags: []
  },
  {
    slug: "vanilla-almond-scone",
    name: "Vanilla Almond Scone",
    category: "scones",
    price: 8000,
    deal: { quantity: 3, price: 22000 },
    description:
      "Toasted almonds and vanilla in a scone that is just sweet enough.",
    ingredients: ["Wheat flour", "Butter", "Sugar", "Sourdough starter", "Almonds", "Vanilla", "Cream", "Sea salt"],
    allergens: ["Gluten", "Dairy", "Tree nuts"],
    tags: []
  },

  // Toast
  {
    slug: "triple-cheese-toast",
    name: "Triple Cheese Toast",
    category: "toast",
    price: 12000,
    description:
      "Three cheeses melted over a thick slice of sourdough until the edges go crisp.",
    ingredients: ["Sourdough bread", "Cheddar", "Mozzarella", "Parmesan", "Butter"],
    allergens: ["Gluten", "Dairy"],
    tags: ["Vegetarian", "Bestseller"],
    featured: true
  },
  {
    slug: "pizza-toast",
    name: "Pizza Toast",
    category: "toast",
    price: 12000,
    description:
      "Tomato, cheese, and herbs on sourdough — the after-school snack, all grown up.",
    ingredients: ["Sourdough bread", "Tomato sauce", "Mozzarella", "Oregano", "Olive oil"],
    allergens: ["Gluten", "Dairy"],
    tags: ["Vegetarian"]
  },

  // Focaccia
  {
    slug: "pepper-jack-jalapeno-focaccia",
    name: "Pepper Jack Jalapeño Focaccia",
    category: "focaccia",
    price: 15000,
    description:
      "Pepper jack and sliced jalapeño over a pillowy focaccia base. A little heat, a lot of cheese.",
    ingredients: ["Wheat flour", "Olive oil", "Water", "Sourdough starter", "Sea salt", "Pepper jack", "Jalapeño"],
    allergens: ["Gluten", "Dairy"],
    tags: ["Spicy", "Vegetarian"],
    featured: true
  },
  {
    slug: "brown-sugar-cinnamon-focaccia",
    name: "Toasted Brown Sugar Cinnamon Focaccia",
    category: "focaccia",
    price: 15000,
    description:
      "Brown sugar and cinnamon toasted onto olive-oiled focaccia. Dessert, or breakfast, depending on your day.",
    ingredients: ["Wheat flour", "Olive oil", "Water", "Sourdough starter", "Sea salt", "Brown sugar", "Cinnamon"],
    allergens: ["Gluten"],
    tags: ["Sweet", "Vegan"]
  },
  {
    slug: "pesto-focaccia",
    name: "Pesto Focaccia",
    category: "focaccia",
    price: 15000,
    description:
      "Basil pesto swirled into the dimples, with a final shower of parmesan.",
    ingredients: ["Wheat flour", "Olive oil", "Water", "Sourdough starter", "Sea salt", "Basil", "Pine nuts", "Parmesan"],
    allergens: ["Gluten", "Dairy", "Tree nuts"],
    tags: ["Vegetarian"]
  },

  // Coffee and drinks (sample prices pending owner confirmation)
  {
    slug: "americano",
    name: "Americano",
    category: "coffee-drinks",
    price: 12000,
    description: "Espresso and hot water. Simple, dark, and honest.",
    ingredients: ["Coffee", "Water"],
    allergens: [],
    tags: ["Vegan"],
    featured: true
  },
  {
    slug: "latte",
    name: "Latte",
    category: "coffee-drinks",
    price: 15000,
    description: "A double shot softened with steamed milk.",
    ingredients: ["Coffee", "Milk"],
    allergens: ["Dairy"],
    tags: ["Vegetarian"]
  },
  {
    slug: "cappuccino",
    name: "Cappuccino",
    category: "coffee-drinks",
    price: 15000,
    description: "Equal parts espresso, steamed milk, and foam.",
    ingredients: ["Coffee", "Milk"],
    allergens: ["Dairy"],
    tags: ["Vegetarian"]
  },
  {
    slug: "iced-coffee",
    name: "Iced Coffee",
    category: "coffee-drinks",
    price: 14000,
    description: "Cold, strong, and made for a warm afternoon.",
    ingredients: ["Coffee", "Water", "Ice", "Sugar"],
    allergens: [],
    tags: ["Iced", "Vegan"]
  },
  {
    slug: "hot-chocolate",
    name: "Hot Chocolate",
    category: "coffee-drinks",
    price: 13000,
    description: "Thick, dark hot chocolate — no coffee, all comfort.",
    ingredients: ["Cocoa", "Milk", "Sugar"],
    allergens: ["Dairy"],
    tags: ["Vegetarian"]
  },
  {
    slug: "iced-tea",
    name: "Iced Tea",
    category: "coffee-drinks",
    price: 9000,
    description: "Brewed black tea over ice with a slice of lemon.",
    ingredients: ["Black tea", "Water", "Ice", "Lemon", "Sugar"],
    allergens: [],
    tags: ["Iced", "Vegan"]
  }
];

export { formatPeso } from "@ami/shared";

export function getItemBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export const featuredItems = menuItems.filter((item) => item.featured);
