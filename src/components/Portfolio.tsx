import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useReview } from "@/contexts/ReviewContext";
import { useToast } from "@/hooks/use-toast";
import RatingDisplay from "./RatingDisplay";
import ProtectedImage from "./ProtectedImage";


const Portfolio = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { state: adminState } = useAdmin();
  const { formatPrice } = useCurrency();
  const { getArtworkRating } = useReview();
  const { toast } = useToast();

  const handleAddToCart = (artwork: any) => {
    console.log('Adding to cart:', artwork);
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: artwork.id,
        title: artwork.title,
        price: artwork.price,
        image: artwork.image,
        size: artwork.size
      }
    });
    
    // Show success message
    toast({
      title: "Ajouté au panier",
      description: `${artwork.title} a été ajouté à votre panier`,
    });
  };

  const handleViewArtwork = (artwork: any) => {
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Boutique
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez et acquérez des œuvres d'art originales. Chaque pièce est unique et livrée avec un certificat d'authenticité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminState.artworks.filter(artwork => artwork.available).map((artwork, index) => (
            <div
              key={artwork.id}
              className="group relative overflow-hidden rounded-lg shadow-elegant hover:shadow-hover transition-all duration-500 animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleViewArtwork(artwork)}
            >
              <div className="aspect-square overflow-hidden">
                <ProtectedImage
                  src={artwork.image}
                  alt={artwork.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === artwork.id ? "scale-110" : "scale-100"
                  }`}
                  showWatermark={true}
                  watermarkPosition="bottom-right"
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
                <p className="text-primary-foreground/80 text-xs mt-1">
                  {artwork.size} • {artwork.year}
                </p>
                <div className="mt-2">
                  <RatingDisplay
                    rating={getArtworkRating(artwork.id).average}
                    size="sm"
                    showNumber
                    count={getArtworkRating(artwork.id).count}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {artwork.originalPrice && (
                    <span className="text-primary-foreground/60 text-sm line-through">
                      {formatPrice(artwork.originalPrice)}
                    </span>
                  )}
                  <p className="text-primary-foreground font-semibold text-lg">
                    {formatPrice(artwork.price)}
                  </p>
                  {artwork.offer?.active && (
                    <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                      -{artwork.offer.type === 'percentage' ? `${artwork.offer.value}%` : `${formatPrice(artwork.offer.value)}`}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(artwork);
                    }}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewArtwork(artwork);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-primary-foreground/80 text-xs mt-2">
                  © Omhind Fatima Douirani
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Copyright Notice */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} Omhind Fatima Douirani. Toutes les œuvres présentées sont originales et protégées par le droit d'auteur.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-2">
            La reproduction, distribution ou utilisation commerciale non autorisée de ces œuvres est strictement interdite.
          </p>
        </div>
      </div>

    </section>
  );
};

export default Portfolio;
