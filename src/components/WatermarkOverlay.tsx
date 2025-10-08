import { FC } from 'react';

interface WatermarkOverlayProps {
  artistName?: string;
  className?: string;
  position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  opacity?: number;
}

const WatermarkOverlay: FC<WatermarkOverlayProps> = ({
  artistName = 'Omhind Fatima Douirani',
  className = '',
  position = 'center',
  opacity = 0.7
}) => {
  const positionClasses = {
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} pointer-events-none z-10 ${className}`}
      style={{ opacity }}
    >
      <div className="bg-black/60 px-2 py-1 rounded text-xs">
        <div className="text-white text-center">
          <div className="text-xs font-medium">
            {artistName}
          </div>
          <div className="text-xs opacity-70">
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatermarkOverlay;
