import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Palette, Award, Users, Globe, Brush, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useArtwork } from '@/contexts/ArtworkContext';
import OptimizedImage from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';
import ScreenshotDetection from './ScreenshotDetection';
import '../styles/artist-palette-3d.css';
import '../styles/artwork-frame.css';
import '../styles/artwork-3d.css';
import '../styles/mobile-content-fix.css';

// Lazy load heavy 3D components
const ArtistPalette3D = lazy(() => import('./ArtistPalette3D'));
const Artwork3D = lazy(() => import('./Artwork3D'));

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { artworks } = useArtwork();
  
  // Get the artist name from the first artwork or use default
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';
  
  // Get the first featured artwork - include a default artwork if none exist
  const defaultArtwork = {
    id: 'default-artwork',
    title: 'Œuvre Contemporaine',
    image_url: '/sedibatr.JPG',
    year: '2024',
    category: 'Peinture',
    artist_name: artistName
  };
  
  const featuredArtwork = artworks.length > 0 ? artworks[0] : defaultArtwork;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  const handleScreenshotAttempt = () => {
    console.warn('🚫 Screenshot attempt detected - Copyright protection active');
    // You can add additional actions here like:
    // - Show a warning message
    // - Log the attempt
    // - Redirect or blur the content
  };

  return (
    <ScreenshotDetection onScreenshotAttempt={handleScreenshotAttempt}>
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
      <div className="luxury-container relative z-10 w-full px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center min-h-screen py-6 sm:py-8 lg:py-12">
          
          {/* Left Column - Brand & Text */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8">
          
            {/* Brand Identity */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <Logo size="lg" />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-luxury-display luxury-text-primary tracking-wide leading-tight mb-2 sm:mb-3 lg:mb-4">
                    {artistName.toUpperCase()}
                  </h1>
                  <div className="w-20 sm:w-24 lg:w-32 h-px mx-auto lg:mx-0 mb-2 sm:mb-3 lg:mb-4" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)' }} />
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-luxury-accent luxury-text-secondary leading-relaxed tracking-wider">
                    COLLECTION EXCLUSIVE • ART CONTEMPORAIN
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 justify-center lg:justify-start transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={handleExploreGallery}
                className="luxury-btn-primary px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-full luxury-magnetic-hover luxury-sparkle-effect w-full max-w-xs mx-auto lg:mx-0"
              >
                COLLECTION
              </button>
              <button 
                onClick={handleViewWorks}
                className="luxury-btn-secondary px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-full luxury-magnetic-hover luxury-sparkle-effect w-full max-w-xs mx-auto lg:mx-0"
              >
                DÉCOUVERTE
              </button>
            </div>

            {/* Artist Statement */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.6s' }}>
              <div className="relative max-w-lg mx-auto px-2 sm:px-4 lg:px-0">
                <p className="luxury-artist-statement-premium text-center text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                  Artiste plasticienne renommée, je façonne des œuvres singulières qui transcendent l'ordinaire, 
                  mêlant matériaux précieux et couleurs sublimes pour créer des compositions d'une élégance rare.
                </p>
                
                {/* Luxury decorative elements - Hidden on mobile to prevent overlap */}
                <div className="absolute -top-6 -left-6 w-10 h-10 luxury-floating-elements opacity-40 hidden sm:block">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-indigo-400"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-8 h-8 luxury-floating-elements opacity-40 hidden sm:block" style={{ animationDelay: '1s' }}>
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-400 to-pink-400"></div>
                </div>
                <div className="absolute top-1/2 -right-8 w-6 h-6 luxury-floating-elements opacity-30 hidden sm:block" style={{ animationDelay: '2s' }}>
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-400"></div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className={`grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4 transition-all duration-1000 luxury-content-visible ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '1.2s' }}>
              {[
                { number: "40+", label: "Années d'Excellence" },
                { number: "200+", label: "Pièces Uniques" },
                { number: "50+", label: "Expositions Internationales" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="luxury-card-premium p-2 sm:p-3 lg:p-4 text-center hover:shadow-2xl transition-all duration-300 cursor-default group"
                  style={{ cursor: 'default' }}
                >
                  <div className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-luxury-display luxury-text-gradient mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
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
          <div className="lg:col-span-7 flex flex-col justify-center lg:justify-end space-y-4 sm:space-y-6 lg:space-y-8 order-first lg:order-last">

            {/* 3D Artist Palette */}
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.9s' }}>
              <div className="flex justify-center lg:justify-end px-2 sm:px-4 lg:px-0">
                <div className="relative">
                  {/* Luxury background for 3D palette */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 to-orange-100/20 rounded-full blur-3xl scale-150" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/10 to-purple-100/10 rounded-full blur-2xl scale-125" />
                  
                  {/* 3D Artist Palette - Responsive sizing with lazy loading */}
                  <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100/20 to-orange-100/20 rounded-full">
                        <LoadingSpinner size="md" text="" />
                      </div>
                    }>
                      <ArtistPalette3D className="relative z-10 w-full h-full" />
                    </Suspense>
                  </div>
                  
                  {/* Floating luxury elements around palette - Hidden on mobile */}
                  <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-8 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 luxury-floating-elements opacity-30 hidden sm:block">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 animate-pulse"></div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 luxury-floating-elements opacity-40 hidden sm:block" style={{ animationDelay: '1s' }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-pulse"></div>
                  </div>
                  <div className="absolute top-1/2 -right-6 sm:-right-8 lg:-right-12 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 luxury-floating-elements opacity-50 hidden sm:block" style={{ animationDelay: '2s' }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-teal-400 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Artwork Showcase with 3D Effect */}
            {featuredArtwork && (
              <div className={`transition-all duration-1000 ${
                isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '1.2s' }}>
                <div className="flex justify-center lg:justify-end px-2 sm:px-4 lg:px-0">
                  <div className="relative max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] w-full h-[350px] sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[600px]">
                    {/* 3D Artwork with lazy loading */}
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <LoadingSpinner size="md" text="Chargement de l'œuvre..." />
                      </div>
                    }>
                      <Artwork3D
                        artwork={featuredArtwork}
                        artistName={artistName}
                        className="w-full h-full"
                      />
                    </Suspense>
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
    </ScreenshotDetection>
  );
};

export default Hero;