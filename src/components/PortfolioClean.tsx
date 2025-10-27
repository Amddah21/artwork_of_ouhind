import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Palette } from 'lucide-react';
import ArtworkGrid from './artwork/ArtworkGrid';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useReview } from '@/contexts/ReviewContext';
import './artwork/artwork-grid.css';
import './artwork/artwork-card.css';
import './portfolio-clean.css';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  year: number;
  medium?: string;
  dimensions?: string;
  category: string;
  description: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  artist: string;
  technique?: string;
  size?: string;
  available?: boolean;
  materials?: string[];
  artist_name?: string;
}

const PortfolioClean: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [visibleArtworks, setVisibleArtworks] = useState<number>(12);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { artworks, isLoading } = useArtwork();
  const { getArtworkRating } = useReview();

  useEffect(() => {
    setIsLoaded(true);
  }, [artworks]);

  // Enhanced artworks with proper formatting
  const enhancedArtworks: Artwork[] = artworks.map(artwork => ({
    ...artwork,
    year: artwork.year || new Date().getFullYear(),
    isAvailable: artwork.available,
    medium: artwork.materials?.join(', ') || 'Technique mixte',
    dimensions: artwork.size || 'Dimensions non spécifiées',
    rating: getArtworkRating(artwork.id).average || 0,
    ratingCount: getArtworkRating(artwork.id).count || 0,
    artist: artwork.artist_name || 'Omhind',
    // Map to ArtworkGrid interface
    coverUrl: artwork.image_url,
    technique: artwork.technique,
  }));

  // Generate categories dynamically
  const categories = ['Tous', ...Array.from(new Set(enhancedArtworks.map(artwork => artwork.category)))];

  const filteredArtworks = selectedCategory === 'Tous' 
    ? enhancedArtworks.filter(artwork => artwork.isAvailable)
    : enhancedArtworks.filter(artwork => artwork.category === selectedCategory && artwork.isAvailable);

  const displayedArtworks = filteredArtworks.slice(0, visibleArtworks);

  const loadMore = () => {
    setVisibleArtworks(prev => Math.min(prev + 12, filteredArtworks.length));
  };

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
        <ArtworkGrid artworks={displayedArtworks} isLoading={isLoading} />

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

export default PortfolioClean;

