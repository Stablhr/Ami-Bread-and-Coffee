import type { Dish } from "@/components/ui/dish-orbit-carousel";
import { formatPeso, type MenuItem } from "@/lib/menu-data";

const ACCENTS = ["#7A3B14", "#B8862B", "#A23B2A", "#2B1A10"];

/**
 * Maps catalog items to the Dish Orbit Carousel model. Rating and like
 * counts are intentionally omitted: we only show real data, and the shop
 * has no reviews yet. The carousel hides those blocks when absent.
 */
export function toDishes(items: MenuItem[]): Dish[] {
  return items.map((item, index) => ({
    title: item.name,
    subtitle: formatPeso(item.price),
    image: "/dish-placeholder.png",
    alt: `${item.name}, ${formatPeso(item.price)}`,
    eyebrow: "Fresh from the oven",
    label: item.name,
    description: item.description,
    ingredients: item.ingredients,
    accent: ACCENTS[index % ACCENTS.length]
  }));
}
