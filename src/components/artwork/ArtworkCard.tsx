import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { Badge } from '../ui/badge';
import '../artwork/artwork-card.css';

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

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const navigate = useNavigate();
  const imageUrl = artwork.coverUrl || artwork.image_url;

  const handleClick = () => {
    navigate(`/artwork/${artwork.id}`);
  };

  return (
    <article 
      className="artwork-card group cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View artwork: ${artwork.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="artwork-card__image-container">
        {imageUrl && (
          <OptimizedImage
            src={imageUrl}
            alt={artwork.title}
            className="artwork-card__image"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
        )}
        
        {/* Protected Badge */}
        {artwork.protected && (
          <Badge className="artwork-card__badge">
            <Lock className="w-3 h-3 mr-1" />
            Protégé
          </Badge>
        )}
        
        {/* Hover Overlay */}
        <div className="artwork-card__overlay">
          <Eye className="w-5 h-5" />
          <span className="text-sm font-medium">Voir détails</span>
        </div>
      </div>

      {/* Card Body - Fixed Height */}
      <div className="artwork-card__body">
        <h3 className="artwork-card__title" title={artwork.title}>
          {artwork.title}
        </h3>
        
        {/* Meta Information */}
        <div className="artwork-card__meta">
          {artwork.year && (
            <span className="artwork-card__meta-item">{artwork.year}</span>
          )}
          {artwork.dimensions && (
            <span className="artwork-card__meta-item">
              📏 {artwork.dimensions}
            </span>
          )}
          {(artwork.technique || artwork.medium) && (
            <span className="artwork-card__meta-item">
              🎨 {artwork.technique || artwork.medium}
            </span>
          )}
        </div>
        
        {/* Category Badge */}
        {artwork.category && (
          <div className="artwork-card__category">
            {artwork.category}
          </div>
        )}
      </div>
    </article>
  );
};

export default ArtworkCard;

