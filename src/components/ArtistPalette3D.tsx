import React, { useEffect, useRef, useState } from 'react';

interface ArtistPalette3DProps {
  className?: string;
}

const ArtistPalette3D: React.FC<ArtistPalette3DProps> = ({ className = '' }) => {
  const paletteRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (paletteRef.current) {
        const rect = paletteRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setMousePosition({
          x: (e.clientX - centerX) / 20,
          y: (e.clientY - centerY) / 20
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={paletteRef}
      className={`luxury-3d-palette-container ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Main Palette */}
      <div className="luxury-palette-3d">
        {/* Palette Base */}
        <div className="luxury-palette-base">
          {/* Paint Blobs */}
          <div className="luxury-paint-blob luxury-paint-red" />
          <div className="luxury-paint-blob luxury-paint-blue" />
          <div className="luxury-paint-blob luxury-paint-yellow" />
          <div className="luxury-paint-blob luxury-paint-green" />
          <div className="luxury-paint-blob luxury-paint-orange" />
          
          {/* Paint Drips */}
          <div className="luxury-paint-drip luxury-drip-blue" />
          <div className="luxury-paint-drip luxury-drip-red" />
        </div>
        
        {/* Brushes */}
        <div className="luxury-brush-container luxury-brush-blue">
          <div className="luxury-brush-handle" />
          <div className="luxury-brush-ferrule" />
          <div className="luxury-brush-bristles luxury-bristles-blue" />
        </div>
        
        <div className="luxury-brush-container luxury-brush-brown">
          <div className="luxury-brush-handle" />
          <div className="luxury-brush-ferrule" />
          <div className="luxury-brush-bristles luxury-bristles-clean" />
        </div>
        
        {/* Floating Particles */}
        <div className="luxury-particles">
          <div className="luxury-particle luxury-particle-1" />
          <div className="luxury-particle luxury-particle-2" />
          <div className="luxury-particle luxury-particle-3" />
          <div className="luxury-particle luxury-particle-4" />
          <div className="luxury-particle luxury-particle-5" />
        </div>
        
        {/* Light Reflections */}
        <div className="luxury-light-reflection" />
        <div className="luxury-light-reflection luxury-light-reflection-2" />
      </div>
    </div>
  );
};

export default ArtistPalette3D;
