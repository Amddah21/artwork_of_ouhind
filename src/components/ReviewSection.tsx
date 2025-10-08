import { useState } from 'react';
import { ThumbsUp, Trash2, CheckCircle } from 'lucide-react';
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
  artworkId: number;
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
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.userName || !formData.comment) {
      alert('Veuillez remplir tous les champs et donner une note');
      return;
    }

    addReview({
      artworkId,
      userName: formData.userName,
      userEmail: formData.userEmail,
      rating: formData.rating,
      comment: formData.comment
    });

    // Reset form
    setFormData({
      userName: '',
      userEmail: '',
      rating: 0,
      comment: ''
    });
    setShowForm(false);
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
      <Card>
        <CardHeader>
          <CardTitle>Évaluations et Avis</CardTitle>
        </CardHeader>
        <CardContent>
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
        <Button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto"
          variant="outline"
        >
          Écrire un avis
        </Button>
      )}

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Votre avis sur "{artworkTitle}"</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName">Nom *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
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

              <div className="flex gap-2">
                <Button type="submit">Publier l'avis</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
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
                        <h4 className="font-semibold">{review.userName}</h4>
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
                        {formatDate(review.date)}
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewSection;
