import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface Review {
  id: string;
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
  | { type: 'DELETE_REVIEW'; payload: string }
  | { type: 'MARK_HELPFUL'; payload: string }
  | { type: 'LOAD_REVIEWS'; payload: Review[] };

interface ReviewContextType {
  state: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => void;
  deleteReview: (id: string) => void;
  markHelpful: (id: string) => void;
  getArtworkReviews: (artworkId: number) => Review[];
  getArtworkRating: (artworkId: number) => { average: number; count: number; distribution: number[] };
}

const ReviewContext = createContext<ReviewContextType | null>(null);

// Load reviews from localStorage
const loadReviewsFromStorage = (): Review[] => {
  try {
    const stored = localStorage.getItem('artwork-reviews');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
  return [];
};

// Save reviews to localStorage
const saveReviewsToStorage = (reviews: Review[]) => {
  try {
    localStorage.setItem('artwork-reviews', JSON.stringify(reviews));
  } catch (error) {
    console.error('Error saving reviews:', error);
  }
};

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
    reviews: loadReviewsFromStorage()
  };

  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    saveReviewsToStorage(state.reviews);
  }, [state.reviews]);

  const addReview = (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      helpful: 0,
      verified: false // You can add logic to verify purchases
    };
    dispatch({ type: 'ADD_REVIEW', payload: newReview });
  };

  const deleteReview = (id: string) => {
    dispatch({ type: 'DELETE_REVIEW', payload: id });
  };

  const markHelpful = (id: string) => {
    dispatch({ type: 'MARK_HELPFUL', payload: id });
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
      getArtworkRating
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
