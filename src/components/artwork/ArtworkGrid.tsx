import React from 'react';
import ArtworkCard from './ArtworkCard';
import LoadingSpinner from '../LoadingSpinner';
import ArtworkSkeleton from '../ArtworkSkeleton';

interface Artwork {
  id: string;
  slug?: string;
  title: string;
  year?: number;
  dimensions?: string;
  technique?: string;
  medium?: string;
  category?: string;
  image_url?: string;
  coverUrl?: string;
  protected?: boolean;
  available?: boolean;
  rating?: number;
  ratingCount?: number;
}

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading?: boolean;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, isLoading = false }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="gallery-section">
        <div className="gallery-grid">
          {[...Array(6)].map((_, index) => (
            <ArtworkSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!artworks || artworks.length === 0) {
    return (
      <div className="gallery-section">
        <div className="gallery-empty-state">
          <div className="gallery-empty-state__icon">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="gallery-empty-state__title">Aucune œuvre trouvée</h3>
          <p className="gallery-empty-state__description">
            Aucune œuvre n'est disponible pour le moment.
          </p>
        </div>
      </div>
    );
  }

  // Render grid with artworks
  return (
    <div className="gallery-section">
      <div className="gallery-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;

