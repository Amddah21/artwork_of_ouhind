import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number; // 0-5
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingDisplay = ({
  rating,
  size = 'md',
  showNumber = false,
  count,
  interactive = false,
  onRatingChange
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const starSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 !== 0;
          
          return (
            <div
              key={index}
              className={`relative ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => handleStarClick(index)}
            >
              {partial ? (
                <div className="relative">
                  <Star className={`${starSize} text-muted-foreground`} />
                  <div 
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${(rating % 1) * 100}%` }}
                  >
                    <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${starSize} ${
                    filled
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  } ${interactive ? 'hover:fill-yellow-300 hover:text-yellow-300 transition-colors' : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className={`${textSize} font-medium text-foreground ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={`${textSize} text-muted-foreground`}>
          ({count} {count === 1 ? 'avis' : 'avis'})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
