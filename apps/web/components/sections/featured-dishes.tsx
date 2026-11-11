"use client";

import { useRouter } from "next/navigation";
import DishOrbitCarousel, { type Dish } from "@/components/ui/dish-orbit-carousel";

type FeaturedDishesProps = {
  dishes: Dish[];
  slugs: string[];
};

export function FeaturedDishes({ dishes, slugs }: FeaturedDishesProps) {
  const router = useRouter();

  return (
    <DishOrbitCarousel
      dishes={dishes}
      height="520px"
      loop={false}
      onChange={() => undefined}
      onOrder={(_dish, index) => {
        const slug = slugs[index];
        if (slug) router.push(`/menu/${slug}`);
      }}
    />
  );
}
