// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Artwork endpoints
  artworks: {
    getAll: '/artworks',
    getById: (id: string) => `/artworks/${id}`,
    create: '/artworks',
    update: (id: string) => `/artworks/${id}`,
    delete: (id: string) => `/artworks/${id}`,
  },
  
  // Reviews endpoints
  reviews: {
    getByArtwork: (artworkId: string) => `/reviews/artwork/${artworkId}`,
    create: '/reviews',
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
  },
  
  // Ratings endpoints
  ratings: {
    getByArtwork: (artworkId: string) => `/ratings/artwork/${artworkId}`,
    submit: '/ratings',
    update: (id: string) => `/ratings/${id}`,
  },
  
  // Contact/Commerce endpoints
  contact: {
    send: '/contact',
    inquiry: '/contact/inquiry',
    purchase: '/contact/purchase',
  },
  
  // Auth endpoints
  auth: {
    login: '/auth/login',
    verify: '/auth/verify',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // Admin endpoints
  admin: {
    verify: '/admin/verify',
    logout: '/admin/logout',
  },
};

export default API_CONFIG;

