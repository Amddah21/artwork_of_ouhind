import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showCount = false,
  count = 0,
  className
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    // Could add hover effects here
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isHalfFilled = starRating === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                {
                  'text-burnt-gold fill-current': isFilled,
                  'text-charcoal-300': !isFilled,
                  'cursor-pointer hover:scale-110 transition-transform duration-200': interactive,
                  'cursor-default': !interactive
                }
              )}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => interactive && handleStarHover(starRating)}
            />
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span className="text-sm text-charcoal-600 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
