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
    <div className="space-y-4 sm:space-y-6">
      {/* Rating Overview */}
      <Card className="rounded-lg border shadow-lg" style={{
        backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
        borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
      }}>
        <CardHeader className="rounded-t-lg" style={{
          background: 'linear-gradient(135deg, rgba(135, 63, 49, 0.05) 0%, rgba(135, 63, 49, 0.02) 100%)',
          borderBottom: '1px solid rgba(122, 119, 113, 0.1)'
        }}>
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2" style={{
            color: '#433D38' /* CHARCOAL TAUPE */,
            fontFamily: "'Cormorant Garamond', serif"
          }}>
            <Star className="h-5 w-5" style={{ color: '#873F31' /* PIPE */ }} />
            Évaluations et Avis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg" style={{
              backgroundColor: '#EBE2D1' /* PEACH CREAM */
            }}>
              <div className="text-4xl sm:text-5xl font-bold mb-2" style={{
                color: '#433D38' /* CHARCOAL TAUPE */,
                fontFamily: "'Cormorant Garamond', serif"
              }}>
                {ratingData.average > 0 ? ratingData.average.toFixed(1) : '0.0'}
              </div>
              <RatingDisplay rating={ratingData.average} size="lg" />
              <p className="text-xs sm:text-sm mt-2" style={{
                color: '#717871' /* SAGE */,
                fontFamily: "'Proza Libre', sans-serif"
              }}>
                {ratingData.count} {ratingData.count === 1 ? 'avis' : 'avis'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2 sm:space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingData.distribution[stars - 1];
                const percentage = ratingData.count > 0 ? (count / ratingData.count) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm w-6 sm:w-8" style={{
                      color: '#433D38' /* CHARCOAL TAUPE */,
                      fontFamily: "'Proza Libre', sans-serif"
                    }}>{stars} ★</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{
                      backgroundColor: '#EBE2D1' /* PEACH CREAM */
                    }}>
                      <div
                        className="h-full transition-all"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: '#873F31' /* PIPE */
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm w-10 sm:w-12 text-right" style={{
                      color: '#717871' /* SAGE */,
                      fontFamily: "'Proza Libre', sans-serif"
                    }}>
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
        <div className="flex justify-center px-4">
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7"
            style={{
              backgroundColor: '#873F31' /* PIPE */,
              color: '#F9F8F3' /* FROSTY WHITE */,
              border: 'none',
              fontFamily: "'Proza Libre', sans-serif",
              fontWeight: 600
            }}
            size="lg"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Écrire un avis
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <Card className="rounded-lg border shadow-xl" style={{
          backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
          borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
        }}>
          <CardHeader className="rounded-t-lg" style={{
            background: 'linear-gradient(135deg, rgba(135, 63, 49, 0.05) 0%, rgba(135, 63, 49, 0.02) 100%)',
            borderBottom: '1px solid rgba(122, 119, 113, 0.1)'
          }}>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2" style={{
              color: '#433D38' /* CHARCOAL TAUPE */,
              fontFamily: "'Cormorant Garamond', serif"
            }}>
              <MessageCircle className="h-5 w-5" style={{ color: '#873F31' /* PIPE */ }} />
              Votre avis sur "{artworkTitle}"
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName" className="text-sm sm:text-base mb-1.5" style={{
                    color: '#433D38' /* CHARCOAL TAUPE */,
                    fontFamily: "'Proza Libre', sans-serif"
                  }}>Nom *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                    placeholder="Votre nom complet"
                    className="text-sm sm:text-base"
                    style={{
                      backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                      borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */,
                      fontFamily: "'Proza Libre', sans-serif"
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail" className="text-sm sm:text-base mb-1.5" style={{
                    color: '#433D38' /* CHARCOAL TAUPE */,
                    fontFamily: "'Proza Libre', sans-serif"
                  }}>Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    required
                    placeholder="votre@email.com"
                    className="text-sm sm:text-base"
                    style={{
                      backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                      borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */,
                      fontFamily: "'Proza Libre', sans-serif"
                    }}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm sm:text-base mb-2 block" style={{
                  color: '#433D38' /* CHARCOAL TAUPE */,
                  fontFamily: "'Proza Libre', sans-serif"
                }}>Note *</Label>
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
                <Label htmlFor="comment" className="text-sm sm:text-base mb-1.5" style={{
                  color: '#433D38' /* CHARCOAL TAUPE */,
                  fontFamily: "'Proza Libre', sans-serif"
                }}>Votre avis *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Partagez votre expérience avec cette œuvre..."
                  rows={5}
                  required
                  className="text-sm sm:text-base"
                  style={{
                    backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                    borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */,
                    fontFamily: "'Proza Libre', sans-serif"
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                  style={{
                    borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */,
                    color: '#717871' /* SAGE */,
                    backgroundColor: 'transparent',
                    fontFamily: "'Proza Libre', sans-serif"
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: '#873F31' /* PIPE */,
                    color: '#F9F8F3' /* FROSTY WHITE */,
                    border: 'none',
                    fontFamily: "'Proza Libre', sans-serif",
                    fontWeight: 600
                  }}
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
        <div className="space-y-4 sm:space-y-6">
          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap px-4">
            <span className="text-xs sm:text-sm" style={{
              color: '#717871' /* SAGE */,
              fontFamily: "'Proza Libre', sans-serif"
            }}>Trier par:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'recent', label: 'Plus récents' },
                { value: 'helpful', label: 'Plus utiles' },
                { value: 'highest', label: 'Note élevée' },
                { value: 'lowest', label: 'Note basse' }
              ].map((option) => {
                const isActive = sortBy === option.value;
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(option.value as any)}
                    className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2"
                    style={{
                      backgroundColor: isActive ? '#873F31' /* PIPE */ : 'transparent',
                      color: isActive ? '#F9F8F3' /* FROSTY WHITE */ : '#717871' /* SAGE */,
                      borderColor: isActive ? '#873F31' /* PIPE */ : 'rgba(122, 119, 113, 0.3)' /* SAGE */,
                      fontFamily: "'Proza Libre', sans-serif"
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator style={{ backgroundColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */ }} />

          {/* Review Cards */}
          <div className="space-y-3 sm:space-y-4">
            {sortedReviews.map((review) => (
              <Card key={review.id} className="rounded-lg border" style={{
                backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
              }}>
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 mb-3">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base" style={{
                          color: '#433D38' /* CHARCOAL TAUPE */,
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>{review.user_name}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs rounded-full px-2 py-0.5" style={{
                            backgroundColor: '#EBE2D1' /* PEACH CREAM */,
                            color: '#873F31' /* PIPE */,
                            borderColor: 'rgba(135, 63, 49, 0.2)',
                            fontFamily: "'Proza Libre', sans-serif"
                          }}>
                            <CheckCircle className="w-3 h-3" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <RatingDisplay rating={review.rating} size="sm" />
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm" style={{
                        color: '#717871' /* SAGE */,
                        fontFamily: "'Proza Libre', sans-serif"
                      }}>
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base mb-4 leading-relaxed" style={{
                    color: '#433D38' /* CHARCOAL TAUPE */,
                    fontFamily: "'Proza Libre', sans-serif"
                  }}>
                    {review.comment}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpful(review.id)}
                      className="flex items-center gap-1 text-xs sm:text-sm"
                      style={{
                        color: '#717871' /* SAGE */,
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
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
                      className="flex items-center gap-1 text-xs sm:text-sm"
                      style={{
                        color: '#dc2626',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
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
        <Card className="rounded-lg border shadow-xl" style={{
          backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
          borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
        }}>
          <CardContent className="py-8 sm:py-12 text-center px-4">
            <div className="flex flex-col items-center gap-4 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-full" style={{
                backgroundColor: 'rgba(135, 63, 49, 0.1)' /* PIPE with opacity */
              }}>
                <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: '#873F31' /* PIPE */ }} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2" style={{
                  color: '#433D38' /* CHARCOAL TAUPE */,
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  Aucun avis pour le moment
                </h3>
                <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{
                  color: '#717871' /* SAGE */,
                  fontFamily: "'Proza Libre', sans-serif"
                }}>
                  Soyez le premier à donner votre avis sur cette œuvre !
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-6 sm:py-7"
                  style={{
                    backgroundColor: '#873F31' /* PIPE */,
                    color: '#F9F8F3' /* FROSTY WHITE */,
                    border: 'none',
                    fontFamily: "'Proza Libre', sans-serif",
                    fontWeight: 600
                  }}
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
