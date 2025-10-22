import React, { useRef, useEffect, useState } from 'react';

interface CanvasWatermarkProps {
  imageSrc: string;
  watermarkText?: string;
  opacity?: number;
  fontSize?: number;
  rotation?: number;
  spacing?: number;
  className?: string;
  alt?: string;
}

const CanvasWatermark: React.FC<CanvasWatermarkProps> = ({
  imageSrc,
  watermarkText = '© Omhind',
  opacity = 0.3,
  fontSize = 24,
  rotation = -45,
  spacing = 200,
  className = '',
  alt = 'Watermarked artwork'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Save the context state
        ctx.save();

        // Set watermark properties
        ctx.globalAlpha = opacity;
        ctx.font = `${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;

        // Create watermark pattern
        const patternSize = spacing;
        const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

        for (let x = -diagonal; x < canvas.width + diagonal; x += patternSize) {
          for (let y = -diagonal; y < canvas.height + diagonal; y += patternSize) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            
            // Add text shadow for better visibility
            ctx.strokeText(watermarkText, 0, 0);
            ctx.fillText(watermarkText, 0, 0);
            
            ctx.restore();
          }
        }

        // Restore the context state
        ctx.restore();
        setIsLoaded(true);
      } catch (err) {
        console.error('Error creating watermark:', err);
        setError('Failed to create watermark');
      }
    };

    img.onerror = () => {
      setError('Failed to load image');
    };

    img.src = imageSrc;
  }, [imageSrc, watermarkText, opacity, fontSize, rotation, spacing]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500 text-sm">{error}</p>
          <img 
            src={imageSrc} 
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasWatermark;
