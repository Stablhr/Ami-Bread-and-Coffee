import DishOrbitCarousel from "@/components/ui/dish-orbit-carousel";

export default function DevComponentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <h1 className="font-display text-3xl">Component library</h1>
      <div className="mt-8 h-[600px]">
        <DishOrbitCarousel
          dishes={[
            { title: "Sourdough", subtitle: "Plain", image: "/hero-section.png", rating: 4.8, chef: "Ami", description: "Classic sourdough.", likes: 10, ingredients: ["Flour", "Water", "Salt"], accent: "#7A3B14" },
            { title: "Scone", subtitle: "Chocochip", image: "/hero-section.png", rating: 4.5, chef: "Ami", description: "Chocolate chip scone.", likes: 8, ingredients: ["Flour", "Chocolate"], accent: "#B8862B" },
          ]}
          height="500px"
        />
      </div>
    </main>
  );
}
