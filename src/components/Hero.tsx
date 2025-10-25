import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Palette, Award, Users, Globe, Brush, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useArtwork } from '@/contexts/ArtworkContext';
import ProtectedImage from './ProtectedImage';
import ArtistPalette3D from './ArtistPalette3D';
import ArtworkFrame from './ArtworkFrame';
import '../styles/artist-palette-3d.css';
import '../styles/artwork-frame.css';

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
      <div className="luxury-container relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center min-h-screen py-8 sm:py-12">
          
          {/* Left Column - Brand & Text */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6 sm:space-y-8">
          
            {/* Brand Identity */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <Logo size="lg" />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-luxury-display luxury-text-primary tracking-wide leading-tight mb-3 sm:mb-4">
                    {artistName.toUpperCase()}
                  </h1>
                  <div className="w-24 sm:w-32 h-px mx-auto lg:mx-0 mb-3 sm:mb-4" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)' }} />
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-luxury-accent luxury-text-secondary leading-relaxed tracking-wider">
                    COLLECTION EXCLUSIVE • ART CONTEMPORAIN
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={handleExploreGallery}
                className="luxury-btn-primary px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full luxury-magnetic-hover luxury-sparkle-effect w-full sm:min-w-[180px] lg:min-w-[200px]"
              >
                COLLECTION
              </button>
              <button 
                onClick={handleViewWorks}
                className="luxury-btn-secondary px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full luxury-magnetic-hover luxury-sparkle-effect w-full sm:min-w-[180px] lg:min-w-[200px]"
              >
                DÉCOUVERTE
              </button>
            </div>

            {/* Artist Statement */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.6s' }}>
              <div className="relative max-w-lg mx-auto px-4 sm:px-0">
                <p className="luxury-artist-statement-premium text-center text-sm sm:text-base lg:text-lg leading-relaxed">
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
            <div className={`grid grid-cols-3 gap-2 sm:gap-4 transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '1.2s' }}>
              {[
                { number: "40+", label: "Années d'Excellence" },
                { number: "200+", label: "Pièces Uniques" },
                { number: "50+", label: "Expositions Internationales" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="luxury-card-premium p-2 sm:p-4 text-center hover:shadow-2xl transition-all duration-300 cursor-default group"
                  style={{ cursor: 'default' }}
                >
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-luxury-display luxury-text-gradient mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-xs font-luxury-body luxury-text-secondary uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - 3D Artist Palette & Featured Artwork */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:justify-end space-y-6 sm:space-y-8 order-first lg:order-last">

            {/* 3D Artist Palette */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.9s' }}>
              <div className="flex justify-center lg:justify-end px-4 sm:px-0">
                <div className="relative">
                  {/* Luxury background for 3D palette */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 to-orange-100/20 rounded-full blur-3xl scale-150" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/10 to-purple-100/10 rounded-full blur-2xl scale-125" />
                  
                  {/* 3D Artist Palette - Responsive sizing */}
                  <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                    <ArtistPalette3D className="relative z-10 w-full h-full" />
                  </div>
                  
                  {/* Floating luxury elements around palette */}
                  <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-12 h-12 sm:w-16 sm:h-16 luxury-floating-elements opacity-30">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 animate-pulse"></div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-8 h-8 sm:w-12 sm:h-12 luxury-floating-elements opacity-40" style={{ animationDelay: '1s' }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-pulse"></div>
                  </div>
                  <div className="absolute top-1/2 -right-8 sm:-right-12 w-6 h-6 sm:w-8 sm:h-8 luxury-floating-elements opacity-50" style={{ animationDelay: '2s' }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-teal-400 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Artwork Showcase with Luxury Frame */}
            {featuredArtworks.length > 0 && (
              <div className={`transition-all duration-1000 ${
                isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '1.2s' }}>
                <div className="flex justify-center lg:justify-end px-4 sm:px-0">
                  <ArtworkFrame
                    variant="luxury"
                    size="hero"
                    artistName={artistName}
                    artworkTitle={featuredArtworks[currentArtworkIndex]?.title}
                    year={featuredArtworks[currentArtworkIndex]?.year?.toString()}
                    className="max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] w-full"
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
                    </div>
                    
                    {/* Enhanced indicator dots */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                      {featuredArtworks.map((_, index) => (
                        <div
                          key={index}
                          className={`transition-all duration-300 cursor-pointer ${
                            index === currentArtworkIndex 
                              ? 'w-3 h-3 bg-white shadow-lg' 
                              : 'w-2 h-2 bg-white/40'
                          } rounded-full hover:bg-white/80`}
                          onClick={() => setCurrentArtworkIndex(index)}
                        />
                      ))}
                    </div>
                  </ArtworkFrame>
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