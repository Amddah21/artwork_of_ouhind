import React from 'react';
import './artwork/artwork-grid.css';

interface ArtworkSkeletonProps {
  count?: number;
  className?: string;
}

const ArtworkSkeleton: React.FC<ArtworkSkeletonProps> = ({ 
  count = 6, 
  className = '' 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="artwork-skeleton">
          {/* Image skeleton */}
          <div className="artwork-skeleton__image" />
          
          {/* Body skeleton */}
          <div className="artwork-skeleton__body">
            <div className="artwork-skeleton__title" />
            <div className="artwork-skeleton__meta" />
            <div className="artwork-skeleton__meta" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </>
  );
};

export default ArtworkSkeleton;
