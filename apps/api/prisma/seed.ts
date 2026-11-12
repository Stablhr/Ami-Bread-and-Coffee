import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { addDays, toDateString } from "@ami/shared";
import catalog from "./seed-data/catalog.json";

const prisma = new PrismaClient();

type SeedComponent = { slug: string; quantity: number };

type SeedItem = {
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  weightLabel?: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  dealQuantity?: number;
  dealPrice?: number;
  defaultDailyCap: number;
  maxPerOrder: number;
  sortOrder: number;
  stockComponents?: SeedComponent[];
};

const items = catalog.items as SeedItem[];

/** Number of days of DailyItemCap rows to pre-create. */
const CAP_DAYS = 14;

async function seedCategories() {
  const ids = new Map<string, string>();

  for (const category of catalog.categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        active: true
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder
      }
    });
    ids.set(category.slug, row.id);
  }

  return ids;
}

async function seedItems(categoryIds: Map<string, string>) {
  const ids = new Map<string, string>();

  for (const item of items) {
    const categoryId = categoryIds.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category "${item.categorySlug}" for item "${item.slug}"`);
    }

    const data = {
      categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      weightLabel: item.weightLabel ?? null,
      dealQuantity: item.dealQuantity ?? null,
      dealPrice: item.dealPrice ?? null,
      ingredients: item.ingredients,
      allergens: item.allergens,
      tags: item.tags,
      defaultDailyCap: item.defaultDailyCap,
      maxPerOrder: item.maxPerOrder,
      sortOrder: item.sortOrder,
      active: true
    };

    const row = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: data,
      create: { slug: item.slug, ...data }
    });
    ids.set(item.slug, row.id);
  }

  // Second pass: bundles reference other items by id.
  for (const item of items) {
    if (!item.stockComponents?.length) continue;
    const components = item.stockComponents.map((component) => {
      const menuItemId = ids.get(component.slug);
      if (!menuItemId) {
        throw new Error(`Unknown stock component "${component.slug}" for "${item.slug}"`);
      }
      return { menuItemId, quantity: component.quantity };
    });
    await prisma.menuItem.update({
      where: { slug: item.slug },
      data: { stockComponents: components }
    });
  }

  return ids;
}

async function seedCaps(itemIds: Map<string, string>) {
  const today = toDateString();
  let created = 0;

  for (let offset = 0; offset < CAP_DAYS; offset += 1) {
    const date = new Date(`${addDays(today, offset)}T00:00:00.000Z`);

    for (const item of items) {
      if (item.stockComponents?.length) continue; // bundles consume component caps
      const menuItemId = itemIds.get(item.slug);
      if (!menuItemId) continue;

      await prisma.dailyItemCap.upsert({
        where: { menuItemId_date: { menuItemId, date } },
        update: { cap: item.defaultDailyCap },
        create: { menuItemId, date, cap: item.defaultDailyCap }
      });
      created += 1;
    }
  }

  return created;
}

async function seedZones() {
  for (const zone of catalog.zones) {
    const existing = await prisma.deliveryZone.findFirst({ where: { name: zone.name } });
    if (existing) {
      await prisma.deliveryZone.update({
        where: { id: existing.id },
        data: { areas: zone.areas, fee: zone.fee, active: true }
      });
    } else {
      await prisma.deliveryZone.create({
        data: { name: zone.name, areas: zone.areas, fee: zone.fee }
      });
    }
  }
  return catalog.zones.length;
}

async function seedOwner() {
  return prisma.user.upsert({
    where: { email: catalog.owner.email },
    update: { name: catalog.owner.name, role: Role.OWNER, phone: catalog.owner.phone },
    create: {
      email: catalog.owner.email,
      phone: catalog.owner.phone,
      name: catalog.owner.name,
      role: Role.OWNER
    }
  });
}

async function main() {
  const categoryIds = await seedCategories();
  const itemIds = await seedItems(categoryIds);
  const capRows = await seedCaps(itemIds);
  const zones = await seedZones();
  const owner = await seedOwner();

  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: catalog.settings,
    create: { id: 1, ...catalog.settings }
  });

  console.log("Seed complete:");
  console.log(`  categories: ${categoryIds.size}`);
  console.log(`  menu items: ${itemIds.size}`);
  console.log(`  daily cap rows: ${capRows} (${CAP_DAYS} days)`);
  console.log(`  delivery zones: ${zones}`);
  console.log(`  owner account: ${owner.email}`);
  console.log("");
  console.log("OWNER TO CONFIRM before launch:");
  for (const field of catalog._meta.ownerToConfirm) {
    console.log(`  - ${field}`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
