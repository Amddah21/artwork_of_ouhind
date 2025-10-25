import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArtworkSkeletonProps {
  count?: number;
  className?: string;
}

const ArtworkSkeleton: React.FC<ArtworkSkeletonProps> = ({ 
  count = 6, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          {/* Image skeleton */}
          <Skeleton className="aspect-square w-full rounded-lg" />
          
          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default ArtworkSkeleton;
