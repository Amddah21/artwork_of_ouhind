import React, { createContext, useContext, useState, useEffect } from 'react';

interface Rating {
  artworkId: string;
  userId: string;
  rating: number;
  timestamp: string;
}

interface RatingContextType {
  ratings: { [artworkId: string]: Rating[] };
  userRatings: { [artworkId: string]: number };
  addRating: (artworkId: string, rating: number) => void;
  getAverageRating: (artworkId: string) => number;
  getRatingCount: (artworkId: string) => number;
  getUserRating: (artworkId: string) => number;
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
  const [ratings, setRatings] = useState<{ [artworkId: string]: Rating[] }>({
    '1': [
      { artworkId: '1', userId: 'user1', rating: 5, timestamp: '2024-01-20T10:00:00Z' },
      { artworkId: '1', userId: 'user2', rating: 4, timestamp: '2024-01-19T15:30:00Z' },
      { artworkId: '1', userId: 'user3', rating: 5, timestamp: '2024-01-18T09:15:00Z' },
    ],
    '2': [
      { artworkId: '2', userId: 'user1', rating: 4, timestamp: '2024-01-20T11:00:00Z' },
      { artworkId: '2', userId: 'user2', rating: 5, timestamp: '2024-01-19T16:30:00Z' },
    ],
    '3': [
      { artworkId: '3', userId: 'user1', rating: 5, timestamp: '2024-01-20T12:00:00Z' },
      { artworkId: '3', userId: 'user2', rating: 4, timestamp: '2024-01-19T17:30:00Z' },
      { artworkId: '3', userId: 'user3', rating: 5, timestamp: '2024-01-18T10:15:00Z' },
    ],
  });

  const [userRatings, setUserRatings] = useState<{ [artworkId: string]: number }>({});

  const addRating = (artworkId: string, rating: number) => {
    const currentUserId = 'current-user';
    const timestamp = new Date().toISOString();
    
    setRatings(prev => ({
      ...prev,
      [artworkId]: [
        ...(prev[artworkId] || []).filter(r => r.userId !== currentUserId),
        { artworkId, userId: currentUserId, rating, timestamp }
      ]
    }));

    setUserRatings(prev => ({
      ...prev,
      [artworkId]: rating
    }));
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
      getUserRating
    }}>
      {children}
    </RatingContext.Provider>
  );
};
