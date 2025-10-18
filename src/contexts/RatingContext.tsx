import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface Rating {
  id: string;
  artwork_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface RatingContextType {
  ratings: { [artworkId: string]: Rating[] };
  userRatings: { [artworkId: string]: number };
  addRating: (artworkId: string, rating: number) => Promise<void>;
  getAverageRating: (artworkId: string) => number;
  getRatingCount: (artworkId: string) => number;
  getUserRating: (artworkId: string) => number;
  loadRatings: () => Promise<void>;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};

interface RatingProviderProps {
  children: React.ReactNode;
}

export const RatingProvider: React.FC<RatingProviderProps> = ({ children }) => {
  const [ratings, setRatings] = useState<{ [artworkId: string]: Rating[] }>({});
  const [userRatings, setUserRatings] = useState<{ [artworkId: string]: number }>({});
  const { user } = useAuth();

  // Load ratings from Supabase on mount
  useEffect(() => {
    loadRatings();
  }, []);

  // Update user ratings when user changes
  useEffect(() => {
    if (user) {
      updateUserRatings();
    } else {
      setUserRatings({});
    }
  }, [user, ratings]);

  const loadRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading ratings:', error);
        return;
      }

      // Group ratings by artwork_id
      const groupedRatings: { [artworkId: string]: Rating[] } = {};
      data?.forEach(rating => {
        if (!groupedRatings[rating.artwork_id]) {
          groupedRatings[rating.artwork_id] = [];
        }
        groupedRatings[rating.artwork_id].push(rating);
      });

      setRatings(groupedRatings);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const updateUserRatings = () => {
    if (!user) return;

    const userRatingsMap: { [artworkId: string]: number } = {};
    Object.values(ratings).forEach(artworkRatings => {
      const userRating = artworkRatings.find(r => r.user_id === user.id);
      if (userRating) {
        userRatingsMap[userRating.artwork_id] = userRating.rating;
      }
    });

    setUserRatings(userRatingsMap);
  };

  const addRating = async (artworkId: string, rating: number) => {
    if (!user) {
      throw new Error('User must be authenticated to rate artworks');
    }

    try {
      const { data, error } = await supabase
        .from('ratings')
        .upsert({
          artwork_id: artworkId,
          user_id: user.id,
          rating: rating
        }, {
          onConflict: 'artwork_id,user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding rating:', error);
        throw error;
      }

      // Update local state
      setRatings(prev => ({
        ...prev,
        [artworkId]: [
          ...(prev[artworkId] || []).filter(r => r.user_id !== user.id),
          data
        ]
      }));

      setUserRatings(prev => ({
        ...prev,
        [artworkId]: rating
      }));
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  };

  const getAverageRating = (artworkId: string): number => {
    const artworkRatings = ratings[artworkId] || [];
    if (artworkRatings.length === 0) return 0;
    
    const sum = artworkRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / artworkRatings.length) * 10) / 10;
  };

  const getRatingCount = (artworkId: string): number => {
    return ratings[artworkId]?.length || 0;
  };

  const getUserRating = (artworkId: string): number => {
    return userRatings[artworkId] || 0;
  };

  return (
    <RatingContext.Provider value={{
      ratings,
      userRatings,
      addRating,
      getAverageRating,
      getRatingCount,
      getUserRating,
      loadRatings
    }}>
      {children}
    </RatingContext.Provider>
  );
};
