import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Share2, MessageCircle, Star } from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import ProtectedImage from './ProtectedImage';

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
    id: number;
    title: string;
    image: string;
    year: number;
    medium: string;
    dimensions: string;
    category: string;
    description: string;
    story?: string;
    price?: number;
    isAvailable: boolean;
    rating: number;
    ratingCount: number;
    colorPalette: string[];
    additionalImages?: string[];
  };
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
  isOpen,
  onClose,
  artwork,
  onNavigate,
  hasNext = false,
  hasPrev = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const allImages = [artwork.image, ...(artwork.additionalImages || [])];

  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setRotation(0);
      setCurrentImageIndex(0);
    }
  }, [isOpen, artwork.id]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = allImages[currentImageIndex];
    link.download = `${artwork.title}_${currentImageIndex + 1}.jpg`;
    link.click();
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: artwork.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Side - Image Display (60%) */}
          <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {hasPrev && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate?.('prev')}
                    className="painterly-card"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
                {hasNext && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate?.('next')}
                    className="painterly-card"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="painterly-card"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="painterly-card"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Main Image Display */}
            <div className="flex items-center justify-center h-full p-8">
              <div className="relative max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={allImages[currentImageIndex]}
                  alt={`${artwork.title} - Vue ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))'
                  }}
                />
              </div>
            </div>

            {/* Image Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 painterly-card">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-gray-300" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4">
                <div className="flex space-x-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-yellow-400 ring-2 ring-yellow-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Vue ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Artwork Information (40%) */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <DialogTitle className="text-2xl font-display mb-2 text-gradient">
                {artwork.title}
              </DialogTitle>
              <p className="text-sm text-gray-600 font-body mb-4">
                Par Oum Hind F. Douirani
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <RatingDisplay 
                  rating={artwork.rating} 
                  count={artwork.ratingCount}
                  size="sm"
                />
              </div>

              {/* Availability Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  artwork.isAvailable 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {artwork.isAvailable ? 'Disponible à la vente' : 'Indisponible'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Color Palette */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 font-body">
                  Palette de Couleurs
                </h3>
                <div className="flex space-x-2">
                  {artwork.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Artwork Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 font-body">
                  Détails de l'Œuvre
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Année:</span>
                    <span className="font-medium">{artwork.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Médium:</span>
                    <span className="font-medium">{artwork.medium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">{artwork.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catégorie:</span>
                    <span className="font-medium">{artwork.category}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 font-body">
                  Description
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-body">
                  {artwork.description}
                </p>
              </div>

              {/* Story */}
              {artwork.story && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 font-body">
                    L'Histoire de cette Œuvre
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-body">
                    {artwork.story}
                  </p>
                </div>
              )}

            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              {artwork.isAvailable ? (
                <Button 
                  className="w-full hover-painterly-lift"
                  style={{
                    background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                    color: 'hsl(45, 100%, 97%)'
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Faire une Demande
                </Button>
              ) : (
                <Button 
                  disabled
                  className="w-full"
                  variant="outline"
                >
                  Indisponible
                </Button>
              )}
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkModal;
