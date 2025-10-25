import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Eye, Share2 } from 'lucide-react';
import ProtectedImage from './ProtectedImage';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  year: number;
  category: string;
  description: string;
  rating: number;
  ratingCount: number;
}

interface LuxuryArtworkCarouselProps {
  artworks: Artwork[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const LuxuryArtworkCarousel: React.FC<LuxuryArtworkCarouselProps> = ({
  artworks,
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!autoPlay || artworks.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === artworks.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, artworks.length]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === artworks.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? artworks.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (artworks.length === 0) return null;

  const currentArtwork = artworks[currentIndex];

  return (
    <div className="luxury-artwork-carousel mx-auto">
      <div className="luxury-artwork-carousel-frame">
        
        {/* Main Image Display */}
        <div className="relative w-full h-full luxury-image-reveal">
          <ProtectedImage
            src={currentArtwork.image_url}
            alt={currentArtwork.title}
            className="luxury-artwork-carousel-image w-full h-full object-cover"
          />
          
          {/* Luxury Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Luxury Floating Elements */}
          <div className="absolute top-8 left-8 w-12 h-12 luxury-floating-elements">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-20 animate-pulse"></div>
          </div>
          <div className="absolute bottom-8 right-8 w-8 h-8 luxury-floating-elements" style={{ animationDelay: '1s' }}>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-20 animate-pulse"></div>
          </div>
          <div className="absolute top-1/2 left-4 w-6 h-6 luxury-floating-elements" style={{ animationDelay: '2s' }}>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-purple-400 opacity-15 animate-pulse"></div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <button
            onClick={prevSlide}
            className="luxury-btn-secondary luxury-magnetic-hover luxury-sparkle-effect p-3 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <button
            onClick={nextSlide}
            className="luxury-btn-secondary luxury-magnetic-hover luxury-sparkle-effect p-3 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Artwork Information */}
        <div className="luxury-artwork-carousel-title">
          <div className={`transition-all duration-1000 ${
            isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-3xl font-luxury-display text-white mb-2">
              {currentArtwork.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-luxury-body text-white/90">
                  {currentArtwork.year}
                </span>
                <span className="text-sm font-luxury-body text-white/80 uppercase tracking-wider">
                  {currentArtwork.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-luxury-body">
                    {currentArtwork.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-white/70" />
                  <span className="text-white/70 font-luxury-body text-sm">
                    {currentArtwork.ratingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="luxury-artwork-carousel-indicators">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`luxury-artwork-carousel-indicator luxury-magnetic-hover transition-all duration-300 ${
                index === currentIndex ? 'active' : 'inactive'
              }`}
              style={{
                backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Luxury Action Buttons */}
        <div className="absolute top-8 right-8 flex space-x-2 z-10">
          <button className="luxury-btn-secondary luxury-magnetic-hover luxury-sparkle-effect p-2 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Luxury Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full luxury-artwork-loading transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / artworks.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LuxuryArtworkCarousel;
