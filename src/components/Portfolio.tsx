import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Share2, MessageCircle, Star, Tag, Eye, Palette, Calendar, Sparkles, Euro, Phone, Mail, ShoppingCart } from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import ProtectedImage from './ProtectedImage';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useReview } from '@/contexts/ReviewContext';
import { useGallery } from '@/contexts/GalleryContext';

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
  const { state: galleryState, refreshGalleries, updateGalleryData } = useGallery();

  useEffect(() => {
    setIsLoaded(true);
    // Debug: Log artworks to see what's loaded
    console.log('Portfolio - Artworks loaded:', artworks.length, artworks);
    
    // Update gallery data when artworks change
    if (artworks.length > 0) {
      updateGalleryData();
    }
    
    // Debug: Check localStorage directly
    const storedArtworks = localStorage.getItem('artspark-artworks');
    if (storedArtworks) {
      const parsedArtworks = JSON.parse(storedArtworks);
      console.log('Portfolio - localStorage artworks:', parsedArtworks.length, parsedArtworks);
    } else {
      console.log('Portfolio - No artworks in localStorage');
    }
  }, [artworks, updateGalleryData]);

  // Enhanced artworks with color palettes (no pricing)
  const enhancedArtworks: Artwork[] = artworks.map(artwork => ({
    ...artwork,
    year: artwork.year || new Date().getFullYear(),
    isAvailable: artwork.available,
    medium: artwork.materials?.join(', ') || 'Technique mixte',
    dimensions: artwork.size || 'Dimensions non spécifiées',
    rating: getArtworkRating(artwork.id).average || 0,
    ratingCount: getArtworkRating(artwork.id).count || 0,
    artist: artwork.artist_name || 'Mamany-Art', // Use dynamic artist name from database
    colorPalette: [
      '#FF6B9D', '#C44569', '#F8B500', '#6C5CE7',
      '#00B894', '#E17055', '#74B9FF', '#A29BFE'
    ].sort(() => Math.random() - 0.5).slice(0, 4)
  }));

  // Generate categories dynamically from gallery state or artworks
  const categories = ['Tous', ...Array.from(new Set(enhancedArtworks.map(artwork => artwork.category)))];

  const filteredArtworks = selectedCategory === 'Tous' 
    ? enhancedArtworks.filter(artwork => artwork.isAvailable)
    : enhancedArtworks.filter(artwork => artwork.category === selectedCategory && artwork.isAvailable);

  const displayedArtworks = filteredArtworks.slice(0, visibleArtworks);

  const handleShareArtwork = async (artwork: Artwork) => {
    const shareData = {
      title: artwork.title,
      text: `Découvrez "${artwork.title}" par ${artwork.artist}`,
      url: `${window.location.origin}/artwork/${artwork.id}`
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        
        // Show a temporary success message
        const button = document.querySelector('[data-share-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Lien copié !';
          button.style.backgroundColor = '#10b981';
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Lien copié dans le presse-papiers !');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Impossible de partager. Veuillez copier manuellement l\'URL.');
      }
    }
  };

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
              className={`group break-inside-avoid transition-all duration-1000 cursor-pointer bg-white shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden border border-slate-200 hover:border-yellow-300 transform hover:scale-[1.02] ${
                isLoaded ? 'animate-gallery-reveal' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleViewArtwork(artwork)}
            >
              {/* Enhanced Image Container with premium frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-yellow-50 p-2">
                <div className="relative w-full h-full overflow-hidden rounded-lg shadow-inner">
                  <ProtectedImage
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                  
                  {/* Premium overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                
                {/* Enhanced Color Palette Preview */}
                <div className="absolute top-6 left-6 flex space-x-1.5">
                  {artwork.colorPalette.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: color }}
                      title={`Color ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Premium Availability Badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm" style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    borderColor: 'rgba(34, 197, 94, 0.4)',
                    borderWidth: '1px',
                    color: '#166534'
                  }}>
                    ✓ Disponible
                  </span>
                </div>

                {/* Artist signature overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs font-medium text-slate-700 text-center">
                      {artwork.artist} @{artwork.year}
                    </p>
                  </div>
                </div>

                {/* Enhanced Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-6 left-6 right-6">
                    <Button 
                      className="w-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
                      style={{
                        background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 50%) 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </div>

                {/* Premium corner decorations */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-yellow-500 rounded-tr-xl opacity-70" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-yellow-500 rounded-bl-xl opacity-70" />
                
                {/* Floating premium sparkles */}
                {hoveredId === artwork.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 animate-pulse">
                      <Sparkles className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                    </div>
                    <div className="absolute top-3/4 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <Sparkles className="w-3 h-3 text-pink-400 drop-shadow-lg" />
                    </div>
                    <div className="absolute top-1/2 right-1/3 animate-pulse" style={{ animationDelay: '1s' }}>
                      <Sparkles className="w-3 h-3 text-purple-400 drop-shadow-lg" />
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Product Info Section */}
              <div className="p-4 space-y-3 bg-white">
                {/* Title and Artist */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {artwork.artist.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {artwork.artist}
                    </p>
                  </div>
                </div>

                {/* Compact Details */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-yellow-600" />
                    <span className="text-slate-600">Année:</span>
                    <span className="font-medium text-slate-800">{artwork.year}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Palette className="w-3 h-3 text-blue-600" />
                    <span className="text-slate-600">Médium:</span>
                    <span className="font-medium text-slate-800">{artwork.technique || artwork.medium || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-green-600" />
                    <span className="text-slate-600">Taille:</span>
                    <span className="font-medium text-slate-800">{artwork.dimensions || artwork.size || 'N/A'}</span>
                  </div>
                </div>

                {/* Rating and Category */}
                <div className="flex items-center justify-between">
                  <RatingDisplay 
                    rating={getArtworkRating(artwork.id).average}
                    count={getArtworkRating(artwork.id).count}
                    size="sm"
                  />
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ 
                    color: 'hsl(38, 95%, 60%)',
                    backgroundColor: 'rgba(251, 191, 36, 0.15)'
                  }}>
                    {artwork.category}
                  </span>
                </div>

                {/* Compact Contact Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    className="text-xs"
                    style={{
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      color: 'white',
                      border: 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppContact(artwork);
                    }}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs"
                    style={{
                      background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                      color: 'white',
                      border: 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmailContact(artwork);
                    }}
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    style={{ 
                      borderColor: 'hsl(330, 20%, 88%)',
                      color: 'hsl(240, 10%, 15%)',
                      backgroundColor: 'white'
                    }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleShareArtwork(artwork);
                    }}
                    data-share-button
                  >
                    <Share2 className="w-3 h-3 mr-1" />
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