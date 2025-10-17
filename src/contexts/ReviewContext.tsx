import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { SpringReviewService, Review as SpringReview, ReviewStats } from '@/services/spring-review-service';

export interface Review {
  id: number;
  artworkId: number;
  userName: string;
  userEmail: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string;
  helpful: number; // number of helpful votes
  verified: boolean; // verified purchase
}

interface ReviewState {
  reviews: Review[];
}

type ReviewAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: number }
  | { type: 'MARK_HELPFUL'; payload: number }
  | { type: 'LOAD_REVIEWS'; payload: Review[] };

interface ReviewContextType {
  state: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
  markHelpful: (id: number) => Promise<void>;
  getArtworkReviews: (artworkId: number) => Review[];
  getArtworkRating: (artworkId: number) => { average: number; count: number; distribution: number[] };
  loadReviews: () => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

// Helper function to convert Spring Boot review to local review format
const convertSpringReview = (springReview: SpringReview): Review => ({
  id: springReview.id,
  artworkId: springReview.artworkId,
  userName: springReview.userName,
  userEmail: springReview.userEmail,
  rating: springReview.rating,
  comment: springReview.comment,
  date: springReview.createdAt,
  helpful: springReview.helpful,
  verified: springReview.verified
});

// Helper function to convert local review to Spring Boot format
const convertToSpringReview = (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => ({
  artworkId: review.artworkId,
  userName: review.userName,
  userEmail: review.userEmail,
  rating: review.rating,
  comment: review.comment
});

const reviewReducer = (state: ReviewState, action: ReviewAction): ReviewState => {
  switch (action.type) {
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload]
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(r => r.id !== action.payload)
      };
    case 'MARK_HELPFUL':
      return {
        ...state,
        reviews: state.reviews.map(r =>
          r.id === action.payload ? { ...r, helpful: r.helpful + 1 } : r
        )
      };
    case 'LOAD_REVIEWS':
      return {
        ...state,
        reviews: action.payload
      };
    default:
      return state;
  }
};

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const initialState: ReviewState = {
    reviews: []
  };

  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // Load reviews from Spring Boot on mount
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      console.log('💬 [ReviewContext] Loading reviews from Spring Boot...');
      const springReviews = await SpringReviewService.getAllReviews();
      const convertedReviews = springReviews.map(convertSpringReview);
      dispatch({ type: 'LOAD_REVIEWS', payload: convertedReviews });
      console.log('💬 [ReviewContext] Reviews loaded successfully:', convertedReviews.length);
    } catch (error) {
      console.error('💬 [ReviewContext] Error loading reviews:', error);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => {
    try {
      console.log('💬 [ReviewContext] Adding review:', review);
      const springReview = convertToSpringReview(review);
      const createdReview = await SpringReviewService.createReview(springReview);
      const convertedReview = convertSpringReview(createdReview);
      dispatch({ type: 'ADD_REVIEW', payload: convertedReview });
      console.log('💬 [ReviewContext] Review added successfully:', convertedReview);
    } catch (error) {
      console.error('💬 [ReviewContext] Error adding review:', error);
      throw error;
    }
  };

  const deleteReview = async (id: number) => {
    try {
      console.log(`💬 [ReviewContext] Deleting review ${id}...`);
      await SpringReviewService.deleteReview(id);
      dispatch({ type: 'DELETE_REVIEW', payload: id });
      console.log(`💬 [ReviewContext] Review ${id} deleted successfully`);
    } catch (error) {
      console.error(`💬 [ReviewContext] Error deleting review ${id}:`, error);
      throw error;
    }
  };

  const markHelpful = async (id: number) => {
    try {
      console.log(`💬 [ReviewContext] Marking review ${id} as helpful...`);
      const updatedReview = await SpringReviewService.markHelpful(id);
      const convertedReview = convertSpringReview(updatedReview);
      dispatch({ type: 'MARK_HELPFUL', payload: id });
      console.log(`💬 [ReviewContext] Review ${id} marked as helpful`);
    } catch (error) {
      console.error(`💬 [ReviewContext] Error marking review ${id} as helpful:`, error);
      throw error;
    }
  };

  const getArtworkReviews = (artworkId: number): Review[] => {
    return state.reviews
      .filter(r => r.artworkId === artworkId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getArtworkRating = (artworkId: number) => {
    const artworkReviews = getArtworkReviews(artworkId);
    const count = artworkReviews.length;
    
    if (count === 0) {
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const sum = artworkReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / count;

    // Calculate distribution (how many 1-star, 2-star, etc.)
    const distribution = [0, 0, 0, 0, 0];
    artworkReviews.forEach(r => {
      distribution[r.rating - 1]++;
    });

    return { average, count, distribution };
  };

  return (
    <ReviewContext.Provider value={{
      state,
      dispatch,
      addReview,
      deleteReview,
      markHelpful,
      getArtworkReviews,
      getArtworkRating,
      loadReviews
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};
