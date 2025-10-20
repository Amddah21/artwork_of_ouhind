import { useState } from 'react';
import { X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewSection from './ReviewSection';
import RatingDisplay from './RatingDisplay';
import ProtectedImage from './ProtectedImage';
import { useReview } from '@/contexts/ReviewContext';

interface ArtworkZoomModalProps {
  artwork: {
    id: string;
    title: string;
    category: string;
    image: string;
    size: string;
    year: string;
    description: string;
    technique?: string;
    materials?: string[];
    tags?: string[];
    artist_name?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ArtworkZoomModal = ({ artwork, isOpen, onClose }: ArtworkZoomModalProps) => {
  const { getArtworkRating } = useReview();

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-7xl max-h-full bg-background rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{artwork.title}</h2>
              <p className="text-sm text-muted-foreground">{artwork.category} • {artwork.size} • {artwork.year}</p>
            </div>
            

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-[calc(100%-80px)]">
            {/* Image Section */}
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/20 overflow-hidden">
              <div className="relative">
                <ProtectedImage
                  src={artwork.image}
                  alt={artwork.title}
                  className="max-w-full max-h-full object-contain"
                  showWatermark={true}
                  watermarkPosition="center"
                />
                
                {/* Copyright Watermark */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
                  © Mamany-Art
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-80 p-6 bg-background border-l overflow-y-auto">
              <div className="space-y-6">
                {/* Rating Display */}
                <div className="mt-2">
                  <RatingDisplay
                    rating={getArtworkRating(artwork.id.toString()).average}
                    size="md"
                    showNumber
                    count={getArtworkRating(artwork.id.toString()).count}
                  />
                </div>

                {/* Tabs for Details and Reviews */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="reviews">
                        Avis ({getArtworkRating(artwork.id.toString()).count})
                      </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 mt-4">
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {artwork.description}
                      </p>
                    </div>

                    {/* Technical Details */}
                    <div>
                      <h3 className="font-semibold mb-2">Détails Techniques</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span className="font-medium">{artwork.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Année:</span>
                          <span className="font-medium">{artwork.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Catégorie:</span>
                          <span className="font-medium">{artwork.category}</span>
                        </div>
                        {artwork.technique && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Technique:</span>
                            <span className="font-medium">{artwork.technique}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Materials */}
                    {artwork.materials && artwork.materials.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Matériaux</h3>
                        <div className="flex flex-wrap gap-2">
                          {artwork.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {artwork.tags && artwork.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {artwork.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={async () => {
                            const shareData = {
                              title: artwork.title,
                              text: `Découvrez "${artwork.title}" par ${artwork.artist_name || 'Mamany-Art'}`,
                              url: `${window.location.origin}/artwork/${artwork.id}`
                            };

                            try {
                              if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                                await navigator.share(shareData);
                              } else {
                                await navigator.clipboard.writeText(shareData.url);
                                alert('Lien copié dans le presse-papiers !');
                              }
                            } catch (error) {
                              console.error('Error sharing:', error);
                              await navigator.clipboard.writeText(shareData.url);
                              alert('Lien copié dans le presse-papiers !');
                            }
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </div>

                    {/* Copyright Notice */}
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground text-center">
                        © {new Date().getFullYear()} Mamany-Art. Tous droits réservés.
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Cette œuvre est protégée par le droit d'auteur.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-4">
                    <ReviewSection artworkId={artwork.id.toString()} artworkTitle={artwork.title} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkZoomModal;
