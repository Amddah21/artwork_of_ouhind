import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Palette, ArrowLeft } from 'lucide-react';
import ArtworkGrid from '@/components/artwork/ArtworkGrid';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useReview } from '@/contexts/ReviewContext';
import '@/components/artwork/artwork-grid.css';
import '@/components/artwork/artwork-card.css';
import '@/components/portfolio-clean.css';

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

const AllArtworks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { artworks, isLoading } = useArtwork();
  const { getArtworkRating } = useReview();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Enhanced artworks with color palettes
  const enhancedArtworks: Artwork[] = artworks.map(artwork => ({
    ...artwork,
    year: artwork.year || new Date().getFullYear(),
    isAvailable: artwork.available,
    medium: artwork.materials?.join(', ') || 'Technique mixte',
    dimensions: artwork.size || 'Dimensions non spécifiées',
    rating: getArtworkRating(artwork.id).average || 0,
    ratingCount: getArtworkRating(artwork.id).count || 0,
    artist: artwork.artist_name || 'Omhind',
    colorPalette: [
      '#FF6B9D', '#C44569', '#F8B500', '#6C5CE7',
      '#00B894', '#E17055', '#74B9FF', '#A29BFE'
    ].sort(() => Math.random() - 0.5).slice(0, 4)
  }));

  // Generate categories dynamically from artworks
  const categories = ['Tous', ...Array.from(new Set(enhancedArtworks.map(artwork => artwork.category)))];

  const filteredArtworks = selectedCategory === 'Tous' 
    ? enhancedArtworks.filter(artwork => artwork.isAvailable)
    : enhancedArtworks.filter(artwork => artwork.category === selectedCategory && artwork.isAvailable);

  // Map artworks to ArtworkGrid format
  const mappedArtworks = filteredArtworks.map((artwork) => ({
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
    <div className="min-h-screen" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
      {/* Header Section */}
      <div className="gallery-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-6 sm:mb-8 transition-all duration-300 hover:opacity-80 group"
            style={{
              fontFamily: "'Proza Libre', sans-serif",
              color: '#873F31' /* PIPE */
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Retour à l'accueil</span>
          </button>

          {/* Header Content */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(135, 63, 49, 0.08) 0%, rgba(135, 63, 49, 0.04) 100%)',
                border: '1.5px solid rgba(135, 63, 49, 0.2)' /* PIPE */
              }}
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#873F31' /* PIPE */ }} />
              <span 
                className="text-xs sm:text-sm font-medium uppercase tracking-wider"
                style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#873F31' /* PIPE */
                }}
              >
                Collection Complète
              </span>
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium mb-4 sm:mb-6"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                color: '#4B4A46' /* CHARCOAL TAUPE */
              }}
            >
              Toutes les Œuvres
            </h1>
            
            <p 
              className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ 
                fontFamily: "'Proza Libre', sans-serif",
                color: '#717871' /* SAGE */
              }}
            >
              Découvrez l'ensemble de ma collection d'œuvres d'art originales, chacune racontant une histoire unique à travers la couleur et la forme.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-6 sm:gap-8 mt-6 sm:mt-8">
              <div className="text-center">
                <div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-1"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#873F31' /* PIPE */
                  }}
                >
                  {filteredArtworks.length}
                </div>
                <div 
                  className="text-xs sm:text-sm uppercase tracking-wide"
                  style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}
                >
                  Œuvres
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-1"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#873F31' /* PIPE */
                  }}
                >
                  {categories.length - 1}
                </div>
                <div 
                  className="text-xs sm:text-sm uppercase tracking-wide"
                  style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}
                >
                  Catégories
                </div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="portfolio-clean__filters mb-8 sm:mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`portfolio-clean__filter ${
                  selectedCategory === category ? 'active' : ''
                }`}
                style={{
                  fontFamily: "'Proza Libre', sans-serif",
                  ...(selectedCategory === category ? {
                    backgroundColor: '#873F31' /* PIPE */,
                    color: '#F9F8F3' /* FROSTY WHITE */,
                    borderColor: '#873F31'
                  } : {
                    backgroundColor: 'transparent',
                    color: '#4B4A46' /* CHARCOAL TAUPE */,
                    borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */
                  })
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Artwork Grid */}
          <ArtworkGrid artworks={mappedArtworks} isLoading={isLoading} />

          {/* Empty State */}
          {!isLoading && filteredArtworks.length === 0 && (
            <div className="text-center py-16">
              <Palette className="w-16 h-16 mx-auto mb-4" style={{ color: '#717871' /* SAGE */ }} />
              <h3 
                className="text-xl font-medium mb-2"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}
              >
                Aucune œuvre trouvée
              </h3>
              <p 
                className="text-sm"
                style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#717871' /* SAGE */
                }}
              >
                Aucune œuvre disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllArtworks;

