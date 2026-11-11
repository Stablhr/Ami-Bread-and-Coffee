import { describe, expect, it } from "vitest";
import {
  formatPeso,
  getItemBySlug,
  getItemsByCategory,
  menuCategories,
  menuItems
} from "@/lib/menu-data";
import { toDishes } from "@/lib/menu-to-dish";

describe("formatPeso", () => {
  it("formats centavos as pesos without trailing decimals", () => {
    expect(formatPeso(20000).replace(/\s/g, "")).toBe("₱200");
    expect(formatPeso(22000).replace(/\s/g, "")).toBe("₱220");
  });

  it("keeps fractional pesos when needed", () => {
    expect(formatPeso(8050).replace(/\s/g, "")).toBe("₱80.50");
  });
});

describe("menu catalog", () => {
  it("gives every category at least one item", () => {
    for (const category of menuCategories) {
      expect(getItemsByCategory(category.slug).length).toBeGreaterThan(0);
    }
  });

  it("has unique slugs and positive prices", () => {
    const slugs = new Set<string>();
    for (const item of menuItems) {
      expect(slugs.has(item.slug)).toBe(false);
      slugs.add(item.slug);
      expect(item.price).toBeGreaterThan(0);
    }
  });

  it("looks items up by slug", () => {
    expect(getItemBySlug("plain-sourdough")?.name).toBe("Plain Sourdough");
    expect(getItemBySlug("does-not-exist")).toBeUndefined();
  });

  it("marks every item with at least one tag or allergen", () => {
    for (const item of menuItems) {
      expect(item.tags.length + item.allergens.length).toBeGreaterThan(0);
    }
  });
});

describe("toDishes", () => {
  it("maps catalog items without inventing ratings or likes", () => {
    const [dish] = toDishes([menuItems[0]]);
    expect(dish.title).toBe(menuItems[0].name);
    expect(dish.rating).toBeUndefined();
    expect(dish.likes).toBeUndefined();
    expect(dish.image).toBe("/dish-placeholder.png");
  });

  it("cycles accent colors for longer lists", () => {
    const dishes = toDishes(menuItems.slice(0, 5));
    expect(dishes[0].accent).not.toBe(dishes[1].accent);
    expect(dishes[0].accent).toBe(dishes[4].accent);
  });
});
