import { useState } from 'react';
import { ThumbsUp, Trash2, CheckCircle, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useReview } from '@/contexts/ReviewContext';
import RatingDisplay from './RatingDisplay';

interface ReviewSectionProps {
  artworkId: string;
  artworkTitle: string;
}

const ReviewSection = ({ artworkId, artworkTitle }: ReviewSectionProps) => {
  const { getArtworkReviews, getArtworkRating, addReview, deleteReview, markHelpful } = useReview();
  const reviews = getArtworkReviews(artworkId);
  const ratingData = getArtworkRating(artworkId);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (formData.rating === 0 || !formData.userName || !formData.comment) {
      alert('Veuillez remplir tous les champs obligatoires et donner une note');
      return;
    }

    // Ensure email is provided (required by database)
    if (!formData.userEmail || formData.userEmail.trim() === '') {
      alert('Veuillez fournir une adresse email valide');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        artwork_id: artworkId,
        user_name: formData.userName.trim(),
        user_email: formData.userEmail.trim(),
        rating: formData.rating,
        comment: formData.comment.trim()
      });

      // Reset form
      setFormData({
        userName: '',
        userEmail: '',
        rating: 0,
        comment: ''
      });
      setShowForm(false);
      alert('✅ Votre avis a été soumis avec succès ! Il sera publié après approbation par l\'administrateur.');
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la soumission de votre avis. Veuillez réessayer.';
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted; // already sorted by recent in getArtworkReviews
    }
  };

  const sortedReviews = getSortedReviews();

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-yellow-50 rounded-t-lg">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Évaluations et Avis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
              <div className="text-5xl font-bold mb-2">
                {ratingData.average > 0 ? ratingData.average.toFixed(1) : '0.0'}
              </div>
              <RatingDisplay rating={ratingData.average} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                {ratingData.count} {ratingData.count === 1 ? 'avis' : 'avis'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingData.distribution[stars - 1];
                const percentage = ratingData.count > 0 ? (count / ratingData.count) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-8">{stars} ★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Button */}
      {!showForm && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Écrire un avis
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-yellow-600" />
              Votre avis sur "{artworkTitle}"
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName">Nom *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <Label>Note *</Label>
                <div className="mt-2">
                  <RatingDisplay
                    rating={formData.rating}
                    size="lg"
                    interactive
                    onRatingChange={(rating) => setFormData({ ...formData, rating })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Votre avis *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Partagez votre expérience avec cette œuvre..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publication...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Publier l'avis
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {/* Sort Options */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Trier par:</span>
            <div className="flex gap-2">
              {[
                { value: 'recent', label: 'Plus récents' },
                { value: 'helpful', label: 'Plus utiles' },
                { value: 'highest', label: 'Note élevée' },
                { value: 'lowest', label: 'Note basse' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(option.value as any)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Review Cards */}
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{review.user_name}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <RatingDisplay rating={review.rating} size="sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground mb-4 leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpful(review.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Utile ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Voulez-vous supprimer cet avis ?')) {
                          deleteReview(review.id);
                        }
                      }}
                      className="flex items-center gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <MessageCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Aucun avis pour le moment
                </h3>
                <p className="text-slate-600 mb-4">
                  Soyez le premier à donner votre avis sur cette œuvre !
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Écrire le premier avis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewSection;
