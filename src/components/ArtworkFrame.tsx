import React from 'react';

interface ArtworkFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'luxury' | 'gallery' | 'minimal' | 'ornate';
  size?: 'small' | 'medium' | 'large' | 'hero';
  showCopyright?: boolean;
  artistName?: string;
  artworkTitle?: string;
  year?: string;
}

const ArtworkFrame: React.FC<ArtworkFrameProps> = ({
  children,
  className = '',
  variant = 'luxury',
  size = 'medium',
  showCopyright = true,
  artistName = 'Omhind',
  artworkTitle,
  year = '2025'
}) => {
  const frameClasses = {
    luxury: 'luxury-frame-luxury',
    gallery: 'luxury-frame-gallery',
    minimal: 'luxury-frame-minimal',
    ornate: 'luxury-frame-ornate'
  };

  const sizeClasses = {
    small: 'luxury-frame-small',
    medium: 'luxury-frame-medium',
    large: 'luxury-frame-large',
    hero: 'luxury-frame-hero'
  };

  return (
    <div className={`luxury-artwork-frame ${frameClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {/* Outer Frame */}
      <div className="luxury-frame-outer">
        {/* Frame Corners */}
        <div className="luxury-frame-corner luxury-frame-corner-tl" />
        <div className="luxury-frame-corner luxury-frame-corner-tr" />
        <div className="luxury-frame-corner luxury-frame-corner-bl" />
        <div className="luxury-frame-corner luxury-frame-corner-br" />
        
        {/* Frame Borders */}
        <div className="luxury-frame-border luxury-frame-border-top" />
        <div className="luxury-frame-border luxury-frame-border-right" />
        <div className="luxury-frame-border luxury-frame-border-bottom" />
        <div className="luxury-frame-border luxury-frame-border-left" />
        
        {/* Inner Frame */}
        <div className="luxury-frame-inner">
          {/* Artwork Content */}
          <div className="luxury-frame-content">
            {children}
          </div>
          
          {/* Copyright Overlay */}
          {showCopyright && (
            <div className="luxury-frame-copyright">
              <div className="luxury-copyright-badge">
                <span className="luxury-copyright-text">© {artistName}</span>
                {year && <span className="luxury-copyright-year">{year}</span>}
              </div>
            </div>
          )}
          
          {/* Artwork Title Overlay */}
          {artworkTitle && (
            <div className="luxury-frame-title">
              <div className="luxury-title-badge">
                <span className="luxury-title-text">{artworkTitle}</span>
                <span className="luxury-title-subtitle">Droits réservés</span>
              </div>
            </div>
          )}
          
          {/* Luxury Accents */}
          <div className="luxury-frame-accents">
            <div className="luxury-accent luxury-accent-1" />
            <div className="luxury-accent luxury-accent-2" />
            <div className="luxury-accent luxury-accent-3" />
            <div className="luxury-accent luxury-accent-4" />
          </div>
        </div>
      </div>
      
      {/* Frame Shadow */}
      <div className="luxury-frame-shadow" />
    </div>
  );
};

export default ArtworkFrame;
