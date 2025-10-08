import { useState } from "react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";
import artwork6 from "@/assets/artwork-6.jpg";

const artworks = [
  { id: 1, title: "Abstract Flow", category: "Watercolor", image: artwork1 },
  { id: 2, title: "Portrait Study", category: "Pencil Drawing", image: artwork2 },
  { id: 3, title: "Mountain Vista", category: "Charcoal", image: artwork3 },
  { id: 4, title: "Color Symphony", category: "Mixed Media", image: artwork4 },
  { id: 5, title: "Botanical Dreams", category: "Illustration", image: artwork5 },
  { id: 6, title: "Bold Expression", category: "Ink", image: artwork6 },
];

const Portfolio = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of original artwork showcasing various styles and techniques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="group relative overflow-hidden rounded-lg shadow-elegant hover:shadow-hover transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === artwork.id ? "scale-110" : "scale-100"
                  }`}
                />
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 ${
                  hoveredId === artwork.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-accent-foreground text-sm font-medium mb-1">
                  {artwork.category}
                </p>
                <h3 className="font-serif text-2xl font-bold text-primary-foreground">
                  {artwork.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
