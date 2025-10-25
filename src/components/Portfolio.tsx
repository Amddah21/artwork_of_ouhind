import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Share2, MessageCircle, Star, Tag, Eye, Palette, Calendar, Sparkles, Euro, Phone, Mail, ShoppingCart } from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import ProtectedImage from './ProtectedImage';
import ArtworkFrame from './ArtworkFrame';
import ScreenshotDetection from './ScreenshotDetection';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useReview } from '@/contexts/ReviewContext';
import { useGallery } from '@/contexts/GalleryContext';
import '../styles/artwork-frame.css';

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
  const [visibleArtworks, setVisibleArtworks] = useState<number>(6);
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
    artist: artwork.artist_name || 'Omhind', // Use dynamic artist name from database
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
    setVisibleArtworks(prev => Math.min(prev + 6, filteredArtworks.length));
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

  const handleScreenshotAttempt = () => {
    console.warn('🚫 Screenshot attempt detected in gallery - Copyright protection active');
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
    <ScreenshotDetection onScreenshotAttempt={handleScreenshotAttempt}>
      <section id="portfolio" className="luxury-section luxury-bg-secondary" ref={portfolioRef}>
      <div className="luxury-container">
        {/* Featured Gallery Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-3 mb-8 px-8 py-4 rounded-full" style={{ 
            backgroundColor: 'rgba(224, 168, 93, 0.1)', 
            border: '1px solid rgba(224, 168, 93, 0.2)' 
          }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-luxury-body font-medium luxury-text-secondary uppercase tracking-wider">
              Collection Exclusive
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-luxury-display luxury-text-primary mb-8">
            GALERIE D'ART
          </h2>
          
          <p className="text-xl max-w-4xl mx-auto leading-relaxed font-luxury-body luxury-text-secondary">
            Découvrez une sélection exclusive d'œuvres d'art originales, chacune racontant une histoire unique à travers la couleur et la forme.
          </p>
        </div>

        {/* Elegant Artworks Grid */}
        <div className="luxury-grid luxury-grid-4 gap-4 sm:gap-6 lg:gap-8">
          {displayedArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`luxury-gallery-item cursor-pointer ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
              onClick={() => handleViewArtwork(artwork)}
            >
              {/* Luxury Artwork Frame */}
              <ArtworkFrame
                variant="gallery"
                size="medium"
                artistName="Omhind"
                artworkTitle={artwork.title}
                year={artwork.year?.toString()}
                className="w-full"
              >
                <ProtectedImage
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </ArtworkFrame>

              {/* Content Below Frame */}
              <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-center px-2">
                {/* Title */}
                <h3 className="luxury-text-primary text-base sm:text-lg font-semibold leading-tight">
                  {artwork.title}
                </h3>
                
                {/* Category */}
                <p className="luxury-text-secondary text-xs sm:text-sm uppercase tracking-wider">
                  {artwork.category}
                </p>
                
                {/* Year */}
                <p className="luxury-text-muted text-xs">
                  {artwork.year}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center luxury-floating-elements">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <div className="absolute inset-0 rounded-full border-2 border-yellow-300 opacity-30 animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 luxury-text-primary">
                Chargement des œuvres...
              </h3>
              <p className="text-lg luxury-text-secondary">
                Veuillez patienter pendant que nous chargeons votre galerie.
              </p>
              <div className="mt-8 w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full luxury-artwork-loading rounded-full"></div>
              </div>
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
    </ScreenshotDetection>
  );
};

export default Portfolio;