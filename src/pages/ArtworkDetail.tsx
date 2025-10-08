import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAdmin } from '@/contexts/AdminContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useReview } from '@/contexts/ReviewContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProtectedImage from '@/components/ProtectedImage';
import RatingDisplay from '@/components/RatingDisplay';
import ReviewSection from '@/components/ReviewSection';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: adminState } = useAdmin();
  const { formatPrice } = useCurrency();
  const { getArtworkRating } = useReview();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [artwork, setArtwork] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundArtwork = adminState.artworks.find(a => a.id === parseInt(id));
      if (foundArtwork) {
        setArtwork(foundArtwork);
      }
      setIsLoading(false);
    }
  }, [id, adminState.artworks]);

  const handleAddToCart = () => {
    if (artwork) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: artwork.id,
          title: artwork.title,
          price: artwork.price,
          image: artwork.image,
          size: artwork.size
        }
      });
      
      // Show success message
      toast({
        title: "Ajouté au panier",
        description: `${artwork.title} a été ajouté à votre panier`,
      });
    }
  };

  const handleContact = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Œuvre non trouvée</h1>
          <Button onClick={() => navigate('/')}>
            Retour à la galerie
          </Button>
        </div>
      </div>
    );
  }

  const ratingData = getArtworkRating(artwork.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la galerie
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{artwork.title}</h1>
              <p className="text-primary-foreground/80 text-sm">{artwork.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <ProtectedImage
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
                showWatermark={true}
                watermarkPosition="center"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={!artwork.available}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {artwork.available ? 'Ajouter au panier' : 'Indisponible'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Favoris
              </Button>
              <Button variant="outline" disabled title="Partage désactivé pour protéger les droits d'auteur">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <RatingDisplay
                  rating={ratingData.average}
                  size="md"
                  showNumber
                  count={ratingData.count}
                />
                <Badge variant="secondary">{artwork.category}</Badge>
              </div>
            </div>

            {/* Price */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  {artwork.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through mr-2">
                      {formatPrice(artwork.originalPrice)}
                    </span>
                  )}
                  <span className="text-3xl font-bold">
                    {formatPrice(artwork.price)}
                  </span>
                </div>
                {artwork.offer?.active && (
                  <Badge variant="destructive" className="text-sm">
                    -{artwork.offer.type === 'percentage' ? `${artwork.offer.value}%` : `${formatPrice(artwork.offer.value)}`}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {artwork.description}
                </p>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails Techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disponibilité:</span>
                  <Badge variant={artwork.available ? 'default' : 'secondary'}>
                    {artwork.available ? 'Disponible' : 'Indisponible'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            {artwork.materials && artwork.materials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Matériaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artwork.materials.map((material: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Reviews Section */}
        <div className="mb-12">
          <ReviewSection artworkId={artwork.id} artworkTitle={artwork.title} />
        </div>

        {/* Contact Section */}
        <div id="contact-section" className="bg-muted/50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Intéressé par cette œuvre ?</h2>
            <p className="text-muted-foreground">
              Contactez-moi pour plus d'informations ou pour discuter d'une commande personnalisée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Envoyez-moi un message
                </p>
                <Button variant="outline" size="sm" onClick={handleContact}>
                  Contacter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Appelez-moi directement
                </p>
                <Button variant="outline" size="sm" onClick={handleContact}>
                  Appeler
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Atelier</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Visitez mon atelier
                </p>
                <Button variant="outline" size="sm" onClick={handleContact}>
                  Visiter
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" onClick={handleContact}>
              <Mail className="w-4 h-4 mr-2" />
              Me contacter maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
