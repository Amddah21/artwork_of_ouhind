import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Eye, ShoppingCart, MessageCircle, Flag, Palette, Calendar, Tag, Maximize, ZoomIn, RotateCcw, Star, Phone, Mail, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import CommentForm from '@/components/CommentForm';
import CommentsDisplay from '@/components/CommentsDisplay';
import { useRating } from '@/contexts/RatingContext';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  category: string;
  support: string;
  reference: string;
  price: string;
  priceEur: string;
  description: string;
  story: string;
  imageUrl: string;
  thumbnailUrl: string;
  views: number;
  isAvailable: boolean;
  tags: string[];
  rating: number;
  reviews: number;
}

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  
  const { addRating, getAverageRating, getRatingCount, getUserRating } = useRating();

  // Sample artwork data - in real app, this would come from API
  const getArtworkData = (artworkId: string): Artwork => {
    const artworks = {
      '1': {
        id: '1',
        title: 'Rêve Aquarelle',
        artist: 'Oum Hind F. Douirani',
        year: 2023,
        medium: 'Aquarelle sur papier',
        dimensions: '100 x 110 cm',
        category: 'Tableaux',
        support: 'Papier',
        reference: 'OHD-2023-001',
        price: '45 000 MAD',
        priceEur: '4 200 €',
        description: 'Une œuvre impressionniste qui capture l\'essence des rêves à travers la fluidité de l\'aquarelle. Les couches mesurées et les éclaboussures de couleurs créent une composition où l\'émotion se mêle à la matière.',
        story: 'Cette œuvre naît d\'une nuit d\'insomnie où les rêves se mélangent à la réalité. L\'artiste a cherché à capturer cette fluidité entre le conscient et l\'inconscient, utilisant la transparence de l\'aquarelle pour créer des couches de sens et d\'émotion.',
        imageUrl: '/artwork1.JPG',
        thumbnailUrl: '/artwork1.JPG',
        views: 2432,
        isAvailable: true,
        tags: ['Impressionniste', 'Aquarelle', 'Rêves', 'Fluidité'],
        rating: 4.8,
        reviews: 24
      },
      '7': {
        id: '7',
        title: 'Racines Silencieuses',
        artist: 'Oum Hind F. Douirani',
        year: 2025,
        medium: 'Techniques mixtes sur papier',
        dimensions: '60 x 80 cm',
        category: 'Abstrait',
        support: 'Papier',
        reference: 'OHD-2025-001',
        price: 'Valeur à discuter',
        priceEur: 'Valeur à discuter',
        description: 'Une exploration des textures naturelles et du silence intérieur. Une œuvre abstraite capturant l\'essence des racines et des formations géologiques à travers des techniques mixtes.',
        story: 'Inspirée par la nature et le cycle de la vie, cette œuvre représente le lien invisible entre la terre et l\'esprit. Les textures complexes évoquent les réseaux de racines qui se développent sous la surface, créant un dialogue entre le visible et l\'invisible.',
        imageUrl: '/artwork4.JPG',
        thumbnailUrl: '/artwork4.JPG',
        views: 1856,
        isAvailable: true,
        tags: ['Abstrait', 'Texture', 'Nature', 'Racines'],
        rating: 4.9,
        reviews: 18
      },
      '8': {
        id: '8',
        title: 'Expression de l\'Âme',
        artist: 'Oum Hind F. Douirani',
        year: 2025,
        medium: 'Techniques mixtes sur toile',
        dimensions: '70 x 90 cm',
        category: 'Abstrait',
        support: 'Toile',
        reference: 'OHD-2025-002',
        price: 'Valeur à discuter',
        priceEur: 'Valeur à discuter',
        description: 'L\'art est l\'expression de l\'âme à travers la couleur et la forme. Une œuvre qui explore les profondeurs de l\'émotion artistique et la connexion entre l\'artiste et l\'univers.',
        story: 'Cette œuvre incarne la philosophie artistique de l\'artiste : "L\'art est l\'expression de l\'âme à travers la couleur et la forme." Chaque coup de pinceau révèle une émotion, chaque couleur exprime une pensée, créant un dialogue intime entre l\'artiste et le spectateur.',
        imageUrl: '/artwork5.JPG',
        thumbnailUrl: '/artwork5.JPG',
        views: 2156,
        isAvailable: true,
        tags: ['Abstrait', 'Couleur', 'Forme', 'Âme'],
        rating: 4.8,
        reviews: 22
      },
      '9': {
        id: '9',
        title: 'Textures Organiques',
        artist: 'Oum Hind F. Douirani',
        year: 2025,
        medium: 'Techniques mixtes sur papier',
        dimensions: '80 x 100 cm',
        category: 'Abstrait',
        support: 'Papier',
        reference: 'OHD-2025-003',
        price: 'Valeur à discuter',
        priceEur: 'Valeur à discuter',
        description: 'Une exploration des textures naturelles et des formations géologiques. Cette œuvre abstraite en noir et blanc révèle la complexité des structures organiques et l\'interaction entre la lumière et l\'ombre.',
        story: 'Cette œuvre explore les profondeurs des textures naturelles, évoquant les formations géologiques et les processus d\'érosion. Le jeu entre le noir et le blanc révèle la complexité des structures organiques, créant un dialogue entre le visible et l\'invisible, entre la matière et l\'esprit.',
        imageUrl: '/artwork6.JPG',
        thumbnailUrl: '/artwork6.JPG',
        views: 1876,
        isAvailable: true,
        tags: ['Abstrait', 'Texture', 'Organique', 'Géologie'],
        rating: 4.7,
        reviews: 19
      },
      '10': {
        id: '10',
        title: 'Galerie d\'Art',
        artist: 'Oum Hind F. Douirani',
        year: 2025,
        medium: 'Photographie numérique',
        dimensions: '60 x 80 cm',
        category: 'Photographie',
        support: 'Impression',
        reference: 'OHD-2025-004',
        price: 'Valeur à discuter',
        priceEur: 'Valeur à discuter',
        description: 'Une vue intérieure d\'une galerie d\'art élégante, capturant l\'atmosphère sophistiquée et l\'éclairage naturel qui met en valeur les œuvres exposées.',
        story: 'Cette photographie capture l\'essence d\'un espace d\'exposition professionnel, où la lumière naturelle danse sur les murs blancs et révèle la beauté des œuvres d\'art. L\'architecture minimaliste et l\'éclairage subtil créent une atmosphère contemplative parfaite pour l\'appréciation artistique.',
        imageUrl: '/slider2.JPG',
        thumbnailUrl: '/slider2.JPG',
        views: 2345,
        isAvailable: true,
        tags: ['Galerie', 'Architecture', 'Éclairage', 'Exposition'],
        rating: 4.9,
        reviews: 28
      }
    };
    
    return artworks[artworkId as keyof typeof artworks] || artworks['1'];
  };

  const artwork: Artwork = getArtworkData(id || '1');

  const getMultipleViews = (artworkId: string) => {
    if (artworkId === '7') {
      return [
        { url: '/artwork4.JPG', alt: 'Vue principale' },
        { url: '/artwork1.JPG', alt: 'Détail texture' },
        { url: '/artwork2.JPG', alt: 'Vue rapprochée' }
      ];
    }
    if (artworkId === '8') {
      return [
        { url: '/artwork5.JPG', alt: 'Vue principale' },
        { url: '/artwork1.JPG', alt: 'Détail texture' },
        { url: '/artwork3.JPG', alt: 'Vue rapprochée' }
      ];
    }
    if (artworkId === '9') {
      return [
        { url: '/artwork6.JPG', alt: 'Vue principale' },
        { url: '/artwork4.JPG', alt: 'Détail texture' },
        { url: '/artwork2.JPG', alt: 'Vue rapprochée' }
      ];
    }
    if (artworkId === '10') {
      return [
        { url: '/slider2.JPG', alt: 'Vue principale' },
        { url: '/gallery-interior-1.jpg', alt: 'Vue rapprochée' },
        { url: '/gallery-interior-2.jpg', alt: 'Détail architecture' }
      ];
    }
    return [
      { url: '/artwork1.JPG', alt: 'Vue principale' },
      { url: '/artwork2.JPG', alt: 'Détail texture' },
      { url: '/artwork3.JPG', alt: 'Vue rapprochée' }
    ];
  };

  const multipleViews = getMultipleViews(id || '1');

  const handleBack = () => {
    navigate(-1);
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

  const handleRating = (rating: number) => {
    addRating(artwork.id, rating);
  };

  const handleCommentSubmit = (comment: { rating: number; content: string }) => {
    const newComment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Vous',
      content: comment.content,
      rating: comment.rating,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isEdited: false
    };
    setComments([newComment, ...comments]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleDislikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    ));
  };

  const handleReply = (commentId: string, content: string) => {
    // Handle reply logic
  };

  const handleReport = (commentId: string) => {
    // Handle report logic
  };

  const handleDelete = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleWhatsAppContact = () => {
    const message = `Bonjour ! Je suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.artist}. Pourriez-vous me donner plus d'informations sur cette pièce et discuter de sa valeur artistique ?`;
    const whatsappUrl = `https://wa.me/212666672756?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = `Demande d'information - ${artwork.title}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.artist}.\n\nDimensions: ${artwork.dimensions}\nAnnée: ${artwork.year}\nMédium: ${artwork.medium}\n\nPourriez-vous me donner plus d'informations sur cette pièce et discuter de sa valeur artistique et des modalités d'acquisition ?\n\nCordialement,`;
    const mailtoUrl = `mailto:omhind53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="min-h-screen watercolor-bg canvas-texture">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-watercolor border-b border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              className="hover-painterly-lift painterly-card"
              style={{ 
                borderColor: 'hsl(330, 20%, 88%)',
                color: 'hsl(240, 10%, 15%)'
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-4">
              <Badge 
                className="painterly-card" 
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                  color: 'hsl(38, 95%, 60%)',
                  borderColor: 'rgba(251, 191, 36, 0.3)'
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                {artwork.views.toLocaleString()} vues
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Side - Artwork Image */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <Card className="comfort-card overflow-hidden aspect-[4/3]">
                <img
                  src={multipleViews[currentImageIndex]?.url || artwork.imageUrl}
                  alt={artwork.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
                />
                
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="comfort-card opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    {isZoomed ? <Maximize className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                  </Button>
                </div>

                {/* High Resolution Badge */}
                <Badge className="absolute top-4 left-4 comfort-card" style={{backgroundColor: 'rgba(248, 248, 248, 0.9)', color: '#7A6B5A'}}>
                  Haute Résolution
                </Badge>
              </Card>

              {/* Thumbnail Navigation */}
              {multipleViews.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {multipleViews.map((view, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-[#7A6B5A] shadow-lg' 
                          : 'border-transparent hover:border-[#7A6B5A]/50'
                      }`}
                    >
                      <img
                        src={view.url}
                        alt={view.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Artwork Details */}
          <div className="space-y-8">
            
            {/* Title and Artist */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold comfort-text mb-2">
                {artwork.title}
              </h1>
              <p className="text-xl comfort-text-muted font-body">
                par <span className="font-semibold" style={{color: '#7A6B5A'}}>{artwork.artist}</span>
              </p>
            </div>

            {/* Artwork Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Palette className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Technique</p>
                    <p className="font-semibold comfort-text">{artwork.medium}</p>
                  </div>
                </div>
              </Card>

              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Maximize className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Dimensions</p>
                    <p className="font-semibold comfort-text">{artwork.dimensions}</p>
                  </div>
                </div>
              </Card>

              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Calendar className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Année</p>
                    <p className="font-semibold comfort-text">{artwork.year}</p>
                  </div>
                </div>
              </Card>

              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Tag className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Référence</p>
                    <p className="font-semibold comfort-text">{artwork.reference}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Story Behind the Piece */}
            <Card className="comfort-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-1 h-20 rounded-full" style={{backgroundColor: '#7A6B5A'}}></div>
                <div>
                  <h3 className="text-lg font-semibold comfort-text mb-3">Histoire de cette œuvre</h3>
                  <p className="comfort-text-muted font-body leading-relaxed italic">
                    {artwork.story}
                  </p>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold comfort-text mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="comfort-card">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <Card className="comfort-card p-6">
              <div className="text-center space-y-4">
                {/* Availability Status */}
                <Badge 
                  className={`px-4 py-2 ${
                    artwork.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {artwork.isAvailable ? 'Disponible' : 'Vendu'}
                </Badge>

                {/* Contact Information Display */}
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" style={{ color: 'hsl(38, 95%, 60%)' }} />
                    <span className="font-semibold comfort-text">WhatsApp: +212 666 67 27 56</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" style={{ color: 'hsl(38, 95%, 60%)' }} />
                    <span className="font-semibold comfort-text">Email: omhind53@gmail.com</span>
                  </div>
                </div>

                {/* Art Value Display */}
                <div className="flex items-center space-x-2 py-4 border-t border-gray-200">
                  <Palette className="w-6 h-6" style={{ color: 'hsl(38, 95%, 60%)' }} />
                  <span className="text-lg font-semibold text-gradient font-display">
                    Valeur Artistique Inestimable
                  </span>
                </div>

                {/* Direct Contact Buttons */}
                <div className="space-y-3 pt-4">
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 hover-painterly-lift"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: 'white'
                      }}
                      onClick={handleWhatsAppContact}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      className="flex-1 hover-painterly-lift"
                      style={{
                        background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                        color: 'hsl(45, 100%, 97%)'
                      }}
                      onClick={handleEmailContact}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="hover-ink-flow painterly-card"
                      style={{ 
                        borderColor: 'hsl(330, 20%, 88%)',
                        color: 'hsl(240, 10%, 15%)'
                      }}
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>

                {/* Acquisition Information */}
                <div className="mt-4 p-4 painterly-card rounded-lg">
                  <h4 className="font-semibold mb-2 font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                    Modalités d'Acquisition
                  </h4>
                  <ul className="text-sm space-y-1 font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                    <li>• Valeur artistique à discuter en privé</li>
                    <li>• Paiement en espèces uniquement</li>
                    <li>• Certificat d'authenticité inclus</li>
                    <li>• Livraison ou retrait à l'atelier</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Rating Section */}
            <Card className="comfort-card p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold comfort-text">Évaluation</h3>
                
                {/* Current Rating Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StarRating
                      rating={getAverageRating(artwork.id) || artwork.rating}
                      size="lg"
                      showCount={true}
                      count={getRatingCount(artwork.id) || artwork.reviews}
                    />
                  </div>
                  <span className="text-sm comfort-text-muted">
                    Votre note: {getUserRating(artwork.id) > 0 ? getUserRating(artwork.id) : 'Non noté'}
                  </span>
                </div>

                {/* Interactive Rating */}
                <div className="pt-4 border-t border-charcoal-200">
                  <p className="text-sm comfort-text-muted mb-3">Donnez votre avis :</p>
                  <StarRating
                    rating={getUserRating(artwork.id)}
                    interactive={true}
                    onRatingChange={handleRating}
                    size="lg"
                  />
                  {getUserRating(artwork.id) > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Merci pour votre évaluation !
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          {/* Comment Form */}
          <CommentForm
            artworkId={artwork.id}
            artworkTitle={artwork.title}
            onSubmit={handleCommentSubmit}
            className="mb-8"
          />

          {/* Comments Display */}
          <CommentsDisplay
            comments={comments}
            onLikeComment={handleLikeComment}
            onDislikeComment={handleDislikeComment}
            onReply={handleReply}
            onReport={handleReport}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;