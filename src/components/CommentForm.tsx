import React, { useState } from 'react';
import { Send, Star, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from './StarRating';

interface CommentFormProps {
  artworkId: string;
  artworkTitle: string;
  onSubmit: (comment: { rating: number; content: string }) => void;
  className?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  artworkId,
  artworkTitle,
  onSubmit,
  className
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({ rating, content: content.trim() });
      setContent('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`deep-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-burnt-gold/10 rounded-full">
            <MessageCircle className="h-5 w-5 text-burnt-gold" />
          </div>
          <div>
            <h3 className="font-display text-deep-charcoal">Ajouter un commentaire</h3>
            <p className="text-sm text-charcoal-600">Partagez votre avis sur "{artworkTitle}"</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal flex items-center gap-2">
              <Star className="h-4 w-4 text-burnt-gold" />
              Votre note
            </label>
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={setRating}
              size="lg"
              className="justify-start"
            />
            {rating > 0 && (
              <p className="text-xs text-charcoal-500">
                {rating === 1 && "Très décevant"}
                {rating === 2 && "Décevant"}
                {rating === 3 && "Correct"}
                {rating === 4 && "Très bien"}
                {rating === 5 && "Excellent !"}
              </p>
            )}
          </div>

          {/* Comment Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal flex items-center gap-2">
              <User className="h-4 w-4 text-burnt-gold" />
              Votre commentaire
            </label>
            <Textarea
              placeholder="Décrivez votre expérience avec cette œuvre... Qu'est-ce qui vous a marqué ? Comment résonne-t-elle avec vous ?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] deep-input resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center text-xs text-charcoal-500">
              <span>Votre commentaire sera visible par tous les visiteurs</span>
              <span>{content.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim() || rating === 0 || isSubmitting}
              className="deep-button"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publication...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publier le commentaire
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-6 p-4 bg-charcoal-50 rounded-lg">
          <h4 className="text-sm font-medium text-deep-charcoal mb-2">Conseils pour un bon commentaire :</h4>
          <ul className="text-xs text-charcoal-600 space-y-1">
            <li>• Partagez votre ressenti personnel et authentique</li>
            <li>• Mentionnez ce qui vous a particulièrement touché</li>
            <li>• Respectez l'artiste et les autres commentateurs</li>
            <li>• Évitez les commentaires trop généraux ou vagues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
