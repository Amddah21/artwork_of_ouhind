import { useState, useRef, useEffect } from 'react';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
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
  const [isBlurred, setIsBlurred] = useState(false);
  const [protectionMessage, setProtectionMessage] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showProtectionMessage = (message: string) => {
      setProtectionMessage(message);
      setShowProtection(true);
      setIsBlurred(true);
      setTimeout(() => {
        setShowProtection(false);
        setIsBlurred(false);
        setProtectionMessage('');
      }, 3000);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showProtectionMessage('❌ Vous ne pouvez pas télécharger l\'image, elle est protégée');
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showProtectionMessage('❌ Glisser-déposer désactivé - Image protégée');
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common screenshot and save shortcuts
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'S') || // Ctrl+Shift+S
        (e.metaKey && e.shiftKey && e.key === '4') || // Cmd+Shift+4 (Mac)
        (e.metaKey && e.shiftKey && e.key === '3') || // Cmd+Shift+3 (Mac)
        (e.key === 'F12') || // F12 (DevTools)
        (e.ctrlKey && e.key === 'u') || // Ctrl+U (View Source)
        (e.ctrlKey && e.key === 's') || // Ctrl+S (Save)
        (e.ctrlKey && e.key === 'c') || // Ctrl+C (Copy)
        (e.ctrlKey && e.key === 'v') || // Ctrl+V (Paste)
        (e.ctrlKey && e.key === 'a') || // Ctrl+A (Select All)
        (e.ctrlKey && e.key === 'p') || // Ctrl+P (Print)
        (e.metaKey && e.key === 's') || // Cmd+S (Mac Save)
        (e.metaKey && e.key === 'c') || // Cmd+C (Mac Copy)
        (e.metaKey && e.key === 'a') || // Cmd+A (Mac Select All)
        (e.altKey && e.key === 'PrintScreen') // Alt+PrintScreen
      ) {
        e.preventDefault();
        showProtectionMessage('❌ Capture d\'écran et outils bloqués - Image protégée');
      }
    };

    const handleMouseLeave = () => {
      // Blur image when mouse leaves to prevent screenshots
      setIsBlurred(true);
      setTimeout(() => setIsBlurred(false), 1000);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Prevent long press on mobile
      e.preventDefault();
    };

    // Screenshot detection and prevention
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showProtectionMessage('❌ Capture d\'écran détectée - Image protégée');
      }
    };

    // Detect if user tries to take screenshot or use dev tools
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      showProtectionMessage('❌ Tentative de capture détectée - Image protégée');
    };

    const img = imgRef.current;
    const container = containerRef.current;
    
    if (img && container) {
      img.addEventListener('contextmenu', handleContextMenu);
      img.addEventListener('dragstart', handleDragStart);
      img.addEventListener('selectstart', handleSelectStart);
      img.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        img.removeEventListener('contextmenu', handleContextMenu);
        img.removeEventListener('dragstart', handleDragStart);
        img.removeEventListener('selectstart', handleSelectStart);
        img.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block overflow-hidden protected-image screenshot-protection"
      style={{
        filter: isBlurred ? 'blur(3px)' : 'none',
        transition: 'filter 0.3s ease-in-out'
      }}
    >
      {/* Copyright Protection Overlay - Always visible */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black/70 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
          <span className="hidden sm:inline">© Omhind</span>
          <span className="sm:hidden">© M-A</span>
        </div>
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/70 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
          <span className="hidden sm:inline">Droits réservés</span>
          <span className="sm:hidden">©</span>
        </div>
      </div>

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
          KhtmlUserSelect: 'none',
          outline: 'none',
          border: 'none'
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
      
      {/* Enhanced Protection Overlay */}
      {showProtection && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 rounded">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-2xl text-center max-w-xs sm:max-w-sm mx-2 sm:mx-4">
            <div className="flex justify-center mb-2">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1">
              Image Protégée
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              {protectionMessage}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Lock className="w-2 h-2 sm:w-3 sm:h-3" />
              <span>Copyright © Omhind</span>
            </div>
          </div>
        </div>
      )}

      {/* Visible Copyright Watermark */}
      {showWatermark && (
        <WatermarkOverlay 
          position={watermarkPosition}
          opacity={0.6}
        />
      )}

      {/* Enhanced Invisible Watermark Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'transparent',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ctext x='100' y='100' font-family='Arial, sans-serif' font-size='16' font-weight='bold' fill='rgba(0,0,0,0.03)' text-anchor='middle' dominant-baseline='middle' transform='rotate(-45 100 100)'%3E© Omhind 2025%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.15,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Additional Protection Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: 'linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%), linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%)',
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
};

export default ProtectedImage;
