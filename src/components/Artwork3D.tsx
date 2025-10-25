import React, { useRef, useEffect, useState } from 'react';
import ProtectedImage from './ProtectedImage';
import ArtworkFrame from './ArtworkFrame';
import '../styles/artwork-3d.css';

interface Artwork3DProps {
  artwork: {
    id: string;
    title: string;
    image_url: string;
    year?: string | number;
  };
  artistName: string;
  className?: string;
}

const Artwork3D: React.FC<Artwork3DProps> = ({ artwork, artistName, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [distance, setDistance] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);

      // Smooth rotation with limits
      setRotation({
        x: Math.max(-10, Math.min(10, -offsetY * 10)),
        y: Math.max(-10, Math.min(10, offsetX * 10)),
      });

      // Distance for parallax effect
      setDistance({
        x: offsetX * 5,
        y: offsetY * 5,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
        setDistance({ x: 0, y: 0 });
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovered(true));
        container.removeEventListener('mouseleave', () => {
          setIsHovered(false);
          setRotation({ x: 0, y: 0 });
          setDistance({ x: 0, y: 0 });
        });
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`luxury-artwork-3d-container ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
    >
      {/* 3D Frame Container */}
      <div className="luxury-artwork-3d-frame">
        {/* Shadow Layer */}
        <div 
          className="luxury-artwork-shadow"
          style={{
            transform: `translateX(${distance.x * 0.3}px) translateY(${distance.y * 0.3}px)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          }}
        />

        {/* Main Frame with Luxury Border */}
        <div 
          className="luxury-artwork-3d-main"
          style={{
            transform: `translateX(${distance.x}px) translateY(${distance.y}px)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          }}
        >
          {/* Artwork Frame Component */}
          <ArtworkFrame
            variant="luxury"
            size="hero"
            artistName={artistName}
            artworkTitle={artwork.title}
            year={artwork.year?.toString()}
            className="w-full h-full"
          >
            <ProtectedImage
              src={artwork.image_url}
              alt={artwork.title}
              className="luxury-artwork-3d-image"
            />
          </ArtworkFrame>

          {/* 3D Gloss Effect */}
          <div className="luxury-artwork-gloss" />
        </div>

        {/* Decorative Corner Elements */}
        <div className="luxury-3d-corner luxury-3d-corner-tl" />
        <div className="luxury-3d-corner luxury-3d-corner-tr" />
        <div className="luxury-3d-corner luxury-3d-corner-bl" />
        <div className="luxury-3d-corner luxury-3d-corner-br" />

        {/* Floating Particles on Hover */}
        {isHovered && (
          <>
            <div className="luxury-3d-particle luxury-3d-particle-1" />
            <div className="luxury-3d-particle luxury-3d-particle-2" />
            <div className="luxury-3d-particle luxury-3d-particle-3" />
            <div className="luxury-3d-particle luxury-3d-particle-4" />
          </>
        )}
      </div>
    </div>
  );
};

export default Artwork3D;
