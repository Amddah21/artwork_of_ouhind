import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Palette } from 'lucide-react';
import ArtworkGrid from './artwork/ArtworkGrid';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useReview } from '@/contexts/ReviewContext';
import { useGallery } from '@/contexts/GalleryContext';
import './artwork/artwork-grid.css';
import './artwork/artwork-card.css';
import './portfolio-clean.css';

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

  // Map artworks to ArtworkGrid format
  const mappedArtworks = displayedArtworks.map((artwork) => ({
    id: artwork.id,
    title: artwork.title,
    year: artwork.year,
    dimensions: artwork.dimensions,
    technique: artwork.technique,
    medium: artwork.medium,
    category: artwork.category,
    image_url: artwork.image_url,
    coverUrl: artwork.image_url,
    available: artwork.available,
    protected: false,
  }));

  return (
    <section id="portfolio" className="portfolio-clean">
      <div className="portfolio-clean__container">
        {/* Header */}
        <div className="portfolio-clean__header">
          <div className="portfolio-clean__badge">
            <Palette className="w-5 h-5" />
            Collection Exclusive
          </div>
          <h2 className="portfolio-clean__title">GALERIE D'ART</h2>
          <p className="portfolio-clean__description">
            Découvrez une sélection exclusive d'œuvres d'art originales, chacune racontant une histoire unique à travers la couleur et la forme.
          </p>
        </div>

        {/* Category Filters */}
        <div className="portfolio-clean__filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleArtworks(12);
              }}
              className={`portfolio-clean__filter ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Artwork Grid */}
        <ArtworkGrid artworks={mappedArtworks} isLoading={isLoading} />

        {/* Load More Button */}
        {visibleArtworks < filteredArtworks.length && (
          <div className="portfolio-clean__load-more">
            <Button 
              size="lg" 
              onClick={loadMore}
              className="portfolio-clean__button"
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