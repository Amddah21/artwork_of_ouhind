import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Share2, MessageCircle, Star, Tag, Eye, Palette, Calendar, Sparkles, Euro, Phone, Mail, ShoppingCart } from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import ProtectedImage from './ProtectedImage';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useReview } from '@/contexts/ReviewContext';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  year: number;
  medium: string;
  dimensions: string;
  category: string;
  description: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  colorPalette: string[];
  price?: number;
  artist: string;
  technique?: string;
  size?: string;
  available?: boolean;
  materials?: string[];
}

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [visibleArtworks, setVisibleArtworks] = useState<number>(8);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { artworks, isLoading } = useArtwork();
  const { getArtworkRating } = useReview();

  useEffect(() => {
    setIsLoaded(true);
    // Debug: Log artworks to see what's loaded
    console.log('Portfolio - Artworks loaded:', artworks.length, artworks);
    
    // Debug: Check localStorage directly
    const storedArtworks = localStorage.getItem('artspark-artworks');
    if (storedArtworks) {
      const parsedArtworks = JSON.parse(storedArtworks);
      console.log('Portfolio - localStorage artworks:', parsedArtworks.length, parsedArtworks);
    } else {
      console.log('Portfolio - No artworks in localStorage');
    }
  }, [artworks]);

  // Enhanced artworks with color palettes (no pricing)
  const enhancedArtworks: Artwork[] = artworks.map(artwork => ({
    ...artwork,
    year: artwork.year || new Date().getFullYear(),
    isAvailable: artwork.available,
    medium: artwork.materials?.join(', ') || 'Technique mixte',
    dimensions: artwork.size || 'Dimensions non spécifiées',
    rating: getArtworkRating(artwork.id).average || 0,
    ratingCount: getArtworkRating(artwork.id).count || 0,
    artist: 'Oum Hind F. Douirani',
    colorPalette: [
      '#FF6B9D', '#C44569', '#F8B500', '#6C5CE7',
      '#00B894', '#E17055', '#74B9FF', '#A29BFE'
    ].sort(() => Math.random() - 0.5).slice(0, 4)
  }));

  const categories = ['Tous', ...Array.from(new Set(enhancedArtworks.map(artwork => artwork.category)))];

  const filteredArtworks = selectedCategory === 'Tous' 
    ? enhancedArtworks.filter(artwork => artwork.isAvailable)
    : enhancedArtworks.filter(artwork => artwork.category === selectedCategory && artwork.isAvailable);

  const displayedArtworks = filteredArtworks.slice(0, visibleArtworks);

  const loadMore = () => {
    setVisibleArtworks(prev => Math.min(prev + 8, filteredArtworks.length));
  };

  const handleViewGallery = (category: string) => {
    // Create gallery slug from category
    const gallerySlug = category.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    navigate(`/gallery/${gallerySlug}`);
  };

  const handleViewArtwork = (artwork: any) => {
    navigate(`/artwork/${artwork.id}`);
  };

  const handleWhatsAppContact = (artwork: any) => {
    const message = `Bonjour ! Je suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.artist}. Pourriez-vous me donner plus d'informations sur cette pièce et discuter de sa valeur artistique ?`;
    const whatsappUrl = `https://wa.me/212666672756?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = (artwork: any) => {
    const subject = `Demande d'information - ${artwork.title}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.artist}.\n\nPourriez-vous me donner plus d'informations sur cette pièce et discuter de sa valeur artistique ?\n\nCordialement,`;
    const mailtoUrl = `mailto:omhind53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <section id="portfolio" className="py-20 watercolor-bg canvas-texture" ref={portfolioRef}>
      <div className="container mx-auto px-6">
        {/* Section Header with artistic styling */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full painterly-card mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Collection Exclusive
            </span>
          </div>
          <h2 className="heading-lg mb-6 text-gradient">Boutique Artistique</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
            Découvrez des œuvres d'art originales. Chaque pièce est unique et sa valeur artistique est inestimable. Contactez-moi pour discuter de l'acquisition.
          </p>
        </div>

        {/* Category Filter with artistic buttons */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.2s' }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => {
                if (category === 'Tous') {
                  setSelectedCategory(category);
                } else {
                  handleViewGallery(category);
                }
              }}
              className="hover-painterly-lift painterly-card"
              style={{
                ...(selectedCategory === category
                  ? { // Style for selected button (any category)
                      backgroundColor: 'hsl(38, 95%, 60%)',
                      color: 'hsl(45, 100%, 97%)',
                      borderColor: 'hsl(38, 95%, 60%)',
                      borderWidth: '1px',
                      fontWeight: 'normal'
                    }
                  : category === 'Tous'
                    ? { // Style for unselected 'Tous' button
                        backgroundColor: 'hsl(45, 100%, 97%)',
                        color: 'hsl(240, 10%, 15%)',
                        borderColor: 'hsl(240, 10%, 30%)',
                        borderWidth: '2px',
                        fontWeight: '600'
                      }
                    : { // Style for other unselected buttons
                        backgroundColor: 'transparent',
                        color: 'hsl(240, 10%, 15%)',
                        borderColor: 'hsl(330, 20%, 88%)',
                        borderWidth: '1px',
                        fontWeight: 'normal'
                      }
                )
              }}
            >
              {category === 'Tous' ? category : `Voir ${category}`}
            </Button>
          ))}
        </div>

        {/* Masonry-style Artworks Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {displayedArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`group painterly-card overflow-hidden hover-painterly-lift break-inside-avoid transition-all duration-1000 cursor-pointer ${
                isLoaded ? 'animate-gallery-reveal' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleViewArtwork(artwork)}
            >
              {/* Image Container with artistic frame */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <ProtectedImage
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Color Palette Preview */}
                <div className="absolute top-4 left-4 flex space-x-1">
                  {artwork.colorPalette.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium painterly-card text-green-800" style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgba(34, 197, 94, 0.3)'
                  }}>
                    Disponible
                  </span>
                </div>

                {/* Floating Sparkles */}
                {hoveredId === artwork.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 animate-ping">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                    </div>
                    <div className="absolute top-3/4 right-1/4 animate-ping" style={{ animationDelay: '0.5s' }}>
                      <Sparkles className="w-2 h-2 text-pink-400" />
                    </div>
                    <div className="absolute top-1/2 right-1/3 animate-ping" style={{ animationDelay: '1s' }}>
                      <Sparkles className="w-2 h-2 text-purple-400" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay with artistic effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <Button className="w-full hover-watercolor-blend" style={{
                      backgroundColor: 'hsl(38, 95%, 60%)',
                      color: 'hsl(45, 100%, 97%)'
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </div>

                {/* Artistic corner decorations */}
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg opacity-60" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg opacity-60" />
              </div>

              {/* Artwork Info with enhanced styling */}
              <div className="p-6 space-y-4">
                {/* Title and Artist */}
                <div>
                  <h3 className="text-xl font-semibold font-display mb-1" style={{ color: 'hsl(240, 10%, 15%)' }}>
                    {artwork.title}
                  </h3>
                  <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                    Oum Hind F. Douirani
                  </p>
                </div>

                {/* Details with icons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" style={{ color: 'hsl(38, 95%, 60%)' }} />
                      <span style={{ color: 'hsl(240, 10%, 35%)' }}>Année:</span>
                    </div>
                    <span className="font-medium" style={{ color: 'hsl(240, 10%, 15%)' }}>{artwork.year}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4" style={{ color: 'hsl(38, 95%, 60%)' }} />
                      <span style={{ color: 'hsl(240, 10%, 35%)' }}>Médium:</span>
                    </div>
                    <span className="font-medium" style={{ color: 'hsl(240, 10%, 15%)' }}>{artwork.technique || artwork.medium || 'Non spécifié'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'hsl(240, 10%, 35%)' }}>Dimensions:</span>
                    <span className="font-medium" style={{ color: 'hsl(240, 10%, 15%)' }}>{artwork.dimensions || artwork.size || 'Non spécifié'}</span>
                  </div>
                </div>

                {/* Category and Rating Display */}
                <div className="flex items-center justify-between">
                  <RatingDisplay 
                    rating={getArtworkRating(artwork.id).average}
                    count={getArtworkRating(artwork.id).count}
                    size="sm"
                  />
                  <span className="text-xs px-2 py-1 rounded-full painterly-card font-medium" style={{ 
                    color: 'hsl(38, 95%, 60%)',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)'
                  }}>
                    {artwork.category}
                  </span>
                </div>

                {/* Art Value Note */}
                <div className="text-center py-2">
                  <p className="text-xs font-body italic" style={{ color: 'hsl(240, 10%, 35%)' }}>
                    Prix sur demande
                  </p>
                </div>

                {/* Direct Contact Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 hover-painterly-lift"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: 'white'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppContact(artwork);
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 hover-painterly-lift"
                      style={{
                        background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                        color: 'hsl(45, 100%, 97%)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmailContact(artwork);
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover-ink-flow painterly-card"
                    style={{ 
                      borderColor: 'hsl(330, 20%, 88%)',
                      color: 'hsl(240, 10%, 15%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle share action
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(240, 10%, 15%)' }}>
                Chargement des œuvres...
              </h3>
              <p className="text-lg" style={{ color: 'hsl(240, 10%, 35%)' }}>
                Veuillez patienter pendant que nous chargeons votre galerie.
              </p>
            </div>
          </div>
        )}

        {/* Empty State - when no artworks */}
        {!isLoading && displayedArtworks.length === 0 && (
          <div className={`text-center py-20 transition-all duration-1000 ${
            isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.4s' }}>
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                <Palette className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(240, 10%, 15%)' }}>
                Galerie Vide
              </h3>
              <p className="text-lg mb-6" style={{ color: 'hsl(240, 10%, 35%)' }}>
                Aucune œuvre n'est encore disponible. Utilisez le tableau de bord pour ajouter vos créations.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full painterly-card">
                <span className="text-sm font-medium" style={{ color: 'hsl(240, 10%, 15%)' }}>
                  💡 Connectez-vous en tant qu'administrateur pour ajouter des œuvres
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button with artistic styling */}
        {visibleArtworks < filteredArtworks.length && (
          <div className={`text-center mt-12 transition-all duration-1000 ${
            isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.8s' }}>
            <Button 
              size="lg" 
              className="hover-painterly-lift paint-splash"
              onClick={loadMore}
              style={{
                background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                color: 'hsl(45, 100%, 97%)',
                border: 'none'
              }}
            >
              Voir Plus d'Œuvres
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;