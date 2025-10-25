import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Palette, Award, Users, Globe, Brush, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useArtwork } from '@/contexts/ArtworkContext';
import ProtectedImage from './ProtectedImage';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { artworks } = useArtwork();
  
  // Get the artist name from the first artwork or use default
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';
  
  // Get featured artworks for the carousel - include a default artwork if none exist
  const defaultArtwork = {
    id: 'default-artwork',
    title: 'Œuvre Contemporaine',
    image_url: '/sedibatr.JPG',
    year: '2024',
    category: 'Peinture',
    artist_name: artistName
  };
  
  const featuredArtworks = artworks.length > 0 ? artworks.slice(0, 6) : [defaultArtwork];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-rotate artwork every 10 seconds
  useEffect(() => {
    if (featuredArtworks.length > 0) {
      const interval = setInterval(() => {
        setCurrentArtworkIndex((prev) => (prev + 1) % featuredArtworks.length);
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [featuredArtworks.length]);

  const handleScrollDown = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const handleExploreGallery = () => {
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleViewWorks = () => {
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden luxury-bg-admin"
    >
      {/* Luxury art gallery background */}
      <div className="absolute inset-0">
        {/* Sophisticated gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(254, 252, 232, 0.9) 50%, rgba(255, 247, 237, 0.95) 100%)'
          }}
        />
        
        {/* Elegant gold accents */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-2xl" />
        </div>
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E0A85D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="luxury-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-screen py-12">
          
          {/* Left Column - Brand & Text */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-8">
          
            {/* Brand Identity */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <Logo size="lg" />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury-display luxury-text-primary tracking-wide leading-tight mb-4">
                    {artistName.toUpperCase()}
                  </h1>
                  <div className="w-32 h-px mx-auto lg:mx-0 mb-4" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)' }} />
                  <p className="text-lg md:text-xl lg:text-2xl font-luxury-accent luxury-text-secondary leading-relaxed tracking-wider">
                    COLLECTION EXCLUSIVE • ART CONTEMPORAIN
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={handleExploreGallery}
                className="luxury-btn-primary px-8 sm:px-12 py-4 text-lg font-semibold rounded-full luxury-magnetic-hover luxury-sparkle-effect min-w-[200px]"
              >
                COLLECTION
              </button>
              <button 
                onClick={handleViewWorks}
                className="luxury-btn-secondary px-8 sm:px-12 py-4 text-lg font-semibold rounded-full luxury-magnetic-hover luxury-sparkle-effect min-w-[200px]"
              >
                DÉCOUVERTE
              </button>
            </div>

            {/* Artist Statement */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.6s' }}>
              <div className="relative max-w-lg mx-auto">
                <p className="luxury-artist-statement-premium text-center">
                  Artiste plasticienne renommée, je façonne des œuvres singulières qui transcendent l'ordinaire, 
                  mêlant matériaux précieux et couleurs sublimes pour créer des compositions d'une élégance rare.
                </p>
                
                {/* Luxury decorative elements */}
                <div className="absolute -top-6 -left-6 w-10 h-10 luxury-floating-elements opacity-40">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-indigo-400"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-8 h-8 luxury-floating-elements opacity-40" style={{ animationDelay: '1s' }}>
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-400 to-pink-400"></div>
                </div>
                <div className="absolute top-1/2 -right-8 w-6 h-6 luxury-floating-elements opacity-30" style={{ animationDelay: '2s' }}>
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-400"></div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className={`grid grid-cols-3 gap-4 transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '1.2s' }}>
              {[
                { number: "40+", label: "Années d'Excellence" },
                { number: "200+", label: "Pièces Uniques" },
                { number: "50+", label: "Expositions Internationales" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="luxury-card-premium p-4 text-center hover:shadow-2xl transition-all duration-300 cursor-default group"
                  style={{ cursor: 'default' }}
                >
                  <div className="text-2xl md:text-3xl lg:text-4xl font-luxury-display luxury-text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs font-luxury-body luxury-text-secondary uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Featured Artwork */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">

            {/* Featured Artwork Showcase */}
            {featuredArtworks.length > 0 && (
              <div className={`transition-all duration-1000 ${
                isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.9s' }}>
                <div className="relative">
                  <div 
                    className="luxury-card-premium overflow-hidden relative shadow-2xl"
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      aspectRatio: '4/5'
                    }}
                  >
                    {/* Fade transition effect */}
                    <div className="relative w-full h-full">
                      {featuredArtworks.map((artwork, index) => (
                        <div
                          key={artwork.id}
                          className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentArtworkIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <ProtectedImage
                            src={artwork.image_url}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      
                      {/* Luxury decorative frame overlay */}
                      <div className="absolute inset-0 border-8 opacity-60 shadow-2xl" style={{ 
                        borderColor: 'var(--luxury-gold)',
                        borderRadius: '12px',
                        boxShadow: 'inset 0 0 0 4px rgba(224, 168, 93, 0.3), 0 0 30px rgba(224, 168, 93, 0.4)'
                      }} />
                      
                      {/* Inner frame detail */}
                      <div className="absolute inset-2 border-2 opacity-80" style={{ 
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px'
                      }} />
                      
                      {/* Corner decorative elements */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 opacity-60" style={{ borderColor: 'var(--luxury-gold)' }} />
                      <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 opacity-60" style={{ borderColor: 'var(--luxury-gold)' }} />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 opacity-60" style={{ borderColor: 'var(--luxury-gold)' }} />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 opacity-60" style={{ borderColor: 'var(--luxury-gold)' }} />
                      
                      {/* Copyright watermark */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-medium tracking-wide">© {artistName}</span>
                      </div>
                      
                      {/* Artwork title overlay */}
                      {featuredArtworks[currentArtworkIndex] && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 backdrop-blur-sm">
                          <h3 className="text-white font-luxury-accent text-lg font-bold text-center mb-1 tracking-wide">
                            {featuredArtworks[currentArtworkIndex].title}
                          </h3>
                          <p className="text-white/90 text-sm font-luxury-body text-center tracking-wider">
                            {featuredArtworks[currentArtworkIndex].year} • {featuredArtworks[currentArtworkIndex].category}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced indicator dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                      {featuredArtworks.map((_, index) => (
                        <div
                          key={index}
                          className={`transition-all duration-300 cursor-pointer ${
                            index === currentArtworkIndex 
                              ? 'w-3 h-3 bg-white shadow-lg' 
                              : 'w-2 h-2 bg-white/40'
                          } rounded-full`}
                          onClick={() => setCurrentArtworkIndex(index)}
                        />
                      ))}
                    </div>

                    {/* Gold corner accents */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Elegant Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 cursor-pointer"
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleScrollDown();
          }
        }}
        aria-label="Scroll down to portfolio section"
      >
        <div className="w-10 h-14 border-2 rounded-full flex justify-center shadow-lg" style={{ 
          borderColor: 'var(--luxury-gold)', 
          backgroundColor: 'rgba(250, 248, 245, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="w-2 h-4 rounded-full mt-2 animate-pulse" style={{ backgroundColor: 'var(--luxury-gold)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;