import React, { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useReview } from '@/contexts/ReviewContext';
import { useArtwork } from '@/contexts/ArtworkContext';

interface AdminReviewsSectionProps {
  className?: string;
}

const AdminReviewsSection: React.FC<AdminReviewsSectionProps> = ({ className }) => {
  const { getAllReviews, approveReview, deleteReview, loadReviews } = useReview();
  const { artworks } = useArtwork();
  const [isLoading, setIsLoading] = useState(false);

  const allReviews = getAllReviews();
  const pendingReviews = allReviews.filter(review => !review.approved);
  const approvedReviews = allReviews.filter(review => review.approved);

  const getArtworkTitle = (artworkId: string) => {
    const artwork = artworks.find(a => a.id === artworkId);
    return artwork ? artwork.title : 'Œuvre supprimée';
  };

  const handleApprove = async (reviewId: string) => {
    setIsLoading(true);
    try {
      await approveReview(reviewId);
      await loadReviews(); // Refresh the reviews
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Erreur lors de l\'approbation de l\'avis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteReview(reviewId);
      await loadReviews(); // Refresh the reviews
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Erreur lors de la suppression de l\'avis');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={className}>
      <Card className="deep-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-deep-charcoal">
            <Eye className="h-5 w-5 text-burnt-gold" />
            Gestion des Avis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pending Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-deep-charcoal">
                Avis en attente ({pendingReviews.length})
              </h3>
              {pendingReviews.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {pendingReviews.length} en attente
                </Badge>
              )}
            </div>

            {pendingReviews.length === 0 ? (
              <Card className="bg-charcoal-50">
                <CardContent className="py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-charcoal-600">Aucun avis en attente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <Card key={review.id} className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-deep-charcoal">
                              {review.user_name}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {getArtworkTitle(review.artwork_id)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-charcoal-600 ml-2">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-charcoal-500">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>

                      <p className="text-charcoal-700 mb-4 leading-relaxed">
                        {review.comment}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(review.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Approved Reviews */}
          <div>
            <h3 className="text-lg font-semibold text-deep-charcoal mb-4">
              Avis approuvés ({approvedReviews.length})
            </h3>

            {approvedReviews.length === 0 ? (
              <Card className="bg-charcoal-50">
                <CardContent className="py-8 text-center">
                  <Eye className="h-12 w-12 text-charcoal-400 mx-auto mb-2" />
                  <p className="text-charcoal-600">Aucun avis approuvé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {approvedReviews.slice(0, 10).map((review) => (
                  <Card key={review.id} className="border-green-200 bg-green-50/50">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-deep-charcoal text-sm">
                              {review.user_name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {getArtworkTitle(review.artwork_id)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approuvé
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-charcoal-500">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>

                      <p className="text-charcoal-600 text-sm leading-relaxed line-clamp-2">
                        {review.comment}
                      </p>

                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(review.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {approvedReviews.length > 10 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-charcoal-500">
                      Et {approvedReviews.length - 10} autres avis approuvés...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviewsSection;
