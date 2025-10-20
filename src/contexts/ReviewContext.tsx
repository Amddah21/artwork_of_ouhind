import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/api';

export interface Review {
  id: string;
  artwork_id: string;
  user_name: string;
  user_email: string;
  rating: number; // 1-5 stars
  comment: string;
  helpful: number; // number of helpful votes
  verified: boolean; // verified purchase
  approved: boolean; // admin approval status
  created_at: string;
  updated_at: string;
}

interface ReviewState {
  reviews: Review[];
}

type ReviewAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: string }
  | { type: 'MARK_HELPFUL'; payload: string }
  | { type: 'APPROVE_REVIEW'; payload: string }
  | { type: 'LOAD_REVIEWS'; payload: Review[] };

interface ReviewContextType {
  state: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
  addReview: (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful' | 'verified' | 'approved'>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  markHelpful: (id: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  getArtworkReviews: (artworkId: string) => Review[];
  getArtworkRating: (artworkId: string) => { average: number; count: number; distribution: number[] };
  loadReviews: () => Promise<void>;
  getAllReviews: () => Review[];
}

const ReviewContext = createContext<ReviewContextType | null>(null);

const reviewReducer = (state: ReviewState, action: ReviewAction): ReviewState => {
  switch (action.type) {
    case 'ADD_REVIEW':
      const newReviews = [...state.reviews, action.payload];
      // Save to localStorage
      localStorage.setItem('artspark-reviews', JSON.stringify(newReviews));
      return {
        ...state,
        reviews: newReviews
      };
    case 'DELETE_REVIEW':
      const filteredReviews = state.reviews.filter(r => r.id !== action.payload);
      // Save to localStorage
      localStorage.setItem('artspark-reviews', JSON.stringify(filteredReviews));
      return {
        ...state,
        reviews: filteredReviews
      };
    case 'MARK_HELPFUL':
      return {
        ...state,
        reviews: state.reviews.map(r =>
          r.id === action.payload ? { ...r, helpful: r.helpful + 1 } : r
        )
      };
    case 'APPROVE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(r =>
          r.id === action.payload ? { ...r, approved: true } : r
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

  // Load reviews from Supabase on mount
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage for development
        console.log('🎨 [ReviewContext] Supabase not configured, loading reviews from localStorage');
        const storedReviews = localStorage.getItem('artspark-reviews');
        if (storedReviews) {
          const parsedReviews = JSON.parse(storedReviews);
          dispatch({ type: 'LOAD_REVIEWS', payload: parsedReviews });
          console.log('Loaded', parsedReviews.length, 'reviews from localStorage');
        } else {
          dispatch({ type: 'LOAD_REVIEWS', payload: [] });
          console.log('No reviews found in localStorage');
        }
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reviews:', error);
        return;
      }

      dispatch({ type: 'LOAD_REVIEWS', payload: data || [] });
      console.log('Loaded', (data || []).length, 'reviews from Supabase');
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful' | 'verified' | 'approved'>) => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage for development
        console.log('🎨 [ReviewContext] Supabase not configured, using localStorage fallback for addReview');
        
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
          helpful: 0,
          verified: false,
          approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_REVIEW', payload: newReview });
        console.log('Review added to localStorage successfully');
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...review,
          helpful: 0,
          verified: false,
          approved: false // New reviews need admin approval
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding review to Supabase:', error);
        // Provide more specific error message
        if (error.code === '23505') {
          throw new Error('Vous avez déjà laissé un avis pour cette œuvre.');
        } else if (error.code === '23503') {
          throw new Error('Cette œuvre n\'existe plus.');
        } else {
          throw new Error('Erreur lors de la sauvegarde de votre avis. Veuillez réessayer.');
        }
      }

      dispatch({ type: 'ADD_REVIEW', payload: data });
      console.log('Review added to Supabase successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage for development
        console.log('🎨 [ReviewContext] Supabase not configured, deleting review locally');
        dispatch({ type: 'DELETE_REVIEW', payload: id });
        console.log('Review deleted from localStorage successfully');
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }

      dispatch({ type: 'DELETE_REVIEW', payload: id });
      console.log('Review deleted from Supabase successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  const markHelpful = async (id: string) => {
    try {
      // Get current helpful count and increment it
      const { data: review, error: fetchError } = await supabase
        .from('reviews')
        .select('helpful')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching review:', fetchError);
        throw fetchError;
      }

      const { error } = await supabase
        .from('reviews')
        .update({ helpful: (review.helpful || 0) + 1 })
        .eq('id', id);

      if (error) {
        console.error('Error marking review as helpful:', error);
        throw error;
      }

      dispatch({ type: 'MARK_HELPFUL', payload: id });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  };

  const approveReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ approved: true })
        .eq('id', id);

      if (error) {
        console.error('Error approving review:', error);
        throw error;
      }

      dispatch({ type: 'APPROVE_REVIEW', payload: id });
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  };

  const getArtworkReviews = (artworkId: string): Review[] => {
    return state.reviews
      .filter(r => r.artwork_id === artworkId && r.approved)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getAllReviews = (): Review[] => {
    return state.reviews
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getArtworkRating = (artworkId: string) => {
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
      approveReview,
      getArtworkReviews,
      getArtworkRating,
      loadReviews,
      getAllReviews
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
