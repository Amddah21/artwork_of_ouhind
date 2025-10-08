import { useState, useRef, useEffect } from 'react';
import { Lock } from 'lucide-react';
import WatermarkOverlay from './WatermarkOverlay';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showWatermark?: boolean;
  watermarkPosition?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const ProtectedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  onClick,
  showWatermark = true,
  watermarkPosition = 'center'
}: ProtectedImageProps) => {
  const [showProtection, setShowProtection] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowProtection(true);
      setTimeout(() => setShowProtection(false), 2000);
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common screenshot shortcuts
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'S') || // Ctrl+Shift+S
        (e.metaKey && e.shiftKey && e.key === '4') || // Cmd+Shift+4 (Mac)
        (e.metaKey && e.shiftKey && e.key === '3') || // Cmd+Shift+3 (Mac)
        (e.key === 'F12') || // F12 (DevTools)
        (e.ctrlKey && e.key === 'u') || // Ctrl+U (View Source)
        (e.ctrlKey && e.key === 's') // Ctrl+S (Save)
      ) {
        e.preventDefault();
        setShowProtection(true);
        setTimeout(() => setShowProtection(false), 2000);
      }
    };

    const img = imgRef.current;
    if (img) {
      img.addEventListener('contextmenu', handleContextMenu);
      img.addEventListener('dragstart', handleDragStart);
      img.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        img.removeEventListener('contextmenu', handleContextMenu);
        img.removeEventListener('dragstart', handleDragStart);
        img.removeEventListener('selectstart', handleSelectStart);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return (
    <div className="relative inline-block">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`select-none ${className}`}
        style={{
          ...style,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          pointerEvents: 'auto',
          WebkitTouchCallout: 'none',
          WebkitUserDrag: 'none',
          KhtmlUserSelect: 'none'
        } as React.CSSProperties}
        onClick={onClick}
        draggable={false}
        onLoad={() => {
          // Additional protection when image loads
          if (imgRef.current) {
            imgRef.current.style.pointerEvents = 'auto';
          }
        }}
      />
      
      {/* Protection Overlay */}
      {showProtection && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-medium text-gray-800">
              Image protégée
            </p>
            <p className="text-xs text-gray-600">
              Droits d'auteur réservés
            </p>
          </div>
        </div>
      )}

      {/* Visible Copyright Watermark */}
      {showWatermark && (
        <WatermarkOverlay 
          position={watermarkPosition}
          opacity={0.4}
        />
      )}

      {/* Invisible watermark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'transparent',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='rgba(0,0,0,0.02)' text-anchor='middle' dominant-baseline='middle'%3E© Omhind Fatima Douirani%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.1
        }}
      />
    </div>
  );
};

export default ProtectedImage;
