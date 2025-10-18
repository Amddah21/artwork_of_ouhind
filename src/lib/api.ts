// 🔧 BACKEND API CONFIGURATION
// Configuration complète pour Spring Boot Backend

export const API_BASE_URL = 'http://localhost:8091/api' // Spring Boot backend URL

// API Endpoints complets
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    validate: '/auth/validate',
    createAdmin: '/auth/create-admin'
  },
  artworks: {
    base: '/artworks',
    search: '/artworks/search',
    images: '/artworks/images',
    upload: '/artworks/upload'
  },
  reviews: {
    base: '/reviews',
    artwork: '/reviews/artwork',
    pending: '/reviews/pending',
    helpful: '/reviews',
    approve: '/reviews',
    delete: '/reviews'
  },
  contact: {
    base: '/contact',
    unread: '/contact/unread',
    read: '/contact',
    responded: '/contact',
    delete: '/contact'
  },
  stats: '/stats'
}

// API Response Types
export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    role: string
  }
}

export interface ValidateTokenResponse {
  valid: boolean
}

// Interfaces pour les œuvres
export interface Artwork {
  id: number
  titre: string
  description: string
  technique: string
  dimensions: string
  annee: number
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface ArtworkSearchParams {
  q?: string
  technique?: string
  annee?: number
  limit?: number
  offset?: number
}

export interface UploadResponse {
  imageUrl: string
  fileName: string
}

// Interfaces pour les reviews
export interface Review {
  id: number
  authorName: string
  rating: number
  comment: string
  helpful: number
  artworkId?: number
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export interface ReviewRequest {
  authorName: string
  rating: number
  comment: string
  artworkId?: number
}

// Interfaces pour le contact
export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  isResponded: boolean
  createdAt: string
}

export interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

// Interfaces pour les statistiques
export interface StatsResponse {
  totalArtworks: number
  totalReviews: number
  totalContactMessages: number
  unreadMessages: number
  pendingReviews: number
  averageRating: number
  totalViews?: number
}

// Gestion des erreurs API
const handleApiError = (error: any) => {
  console.error('🚨 API Error:', error)
  
  if (error.message?.includes('401')) {
    // Token expiré, rediriger vers login
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/admin'
  } else if (error.message?.includes('403')) {
    // Accès refusé
    console.error('🚨 Accès refusé - Privilèges administrateur requis')
  } else if (error.message?.includes('404')) {
    // Ressource non trouvée
    console.error('🚨 Ressource non trouvée')
  } else {
    // Autre erreur
    console.error('🚨 Erreur API:', error.message)
  }
  
  throw error
}

// API Service Class complète
export class ApiService {
  private baseUrl: string
  public defaults: { baseURL: string }

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.defaults = { baseURL: baseUrl }
  }

  // Méthode générique pour les appels API
  private async apiCall<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('authToken')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      console.log('🌐 API Call:', { 
        url, 
        method: config.method || 'GET', 
        headers: config.headers 
      })
      
      const response = await fetch(url, config)
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ API Response:', data)
      return data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  // ===== MÉTHODES D'AUTHENTIFICATION =====
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.apiCall<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async validateToken(): Promise<ValidateTokenResponse> {
    return this.apiCall<ValidateTokenResponse>(API_ENDPOINTS.auth.validate, {
      method: 'POST',
    })
  }

  async createAdmin(): Promise<{ message: string; username: string; email: string }> {
    return this.apiCall(API_ENDPOINTS.auth.createAdmin, {
      method: 'POST',
    })
  }

  // ===== MÉTHODES GÉNÉRIQUES HTTP =====
  
  async get(endpoint: string) {
    return this.apiCall(endpoint, { method: 'GET' })
  }

  async post(endpoint: string, data?: any, options?: RequestInit) {
    return this.apiCall(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put(endpoint: string, data?: any) {
    return this.apiCall(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint: string) {
    return this.apiCall(endpoint, { method: 'DELETE' })
  }

  // ===== MÉTHODES SPÉCIFIQUES AUX ŒUVRES =====
  
  // Routes publiques
  async getArtworks(): Promise<Artwork[]> {
    return this.apiCall<Artwork[]>(API_ENDPOINTS.artworks.base, {
      method: 'GET',
    })
  }

  async getArtworkById(id: number): Promise<Artwork> {
    return this.apiCall<Artwork>(`${API_ENDPOINTS.artworks.base}/${id}`, {
      method: 'GET',
    })
  }

  async searchArtworks(params: ArtworkSearchParams): Promise<Artwork[]> {
    const queryParams = new URLSearchParams()
    if (params.q) queryParams.append('q', params.q)
    if (params.technique) queryParams.append('technique', params.technique)
    if (params.annee) queryParams.append('annee', params.annee.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `${API_ENDPOINTS.artworks.search}?${queryString}` : API_ENDPOINTS.artworks.search
    
    return this.apiCall<Artwork[]>(endpoint, {
      method: 'GET',
    })
  }

  async getArtworkImage(fileName: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.artworks.images}/${fileName}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.blob()
  }

  // Routes protégées (ADMIN)
  async createArtwork(artwork: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artwork> {
    return this.apiCall<Artwork>(API_ENDPOINTS.artworks.base, {
      method: 'POST',
      body: JSON.stringify(artwork),
    })
  }

  async updateArtwork(id: number, artwork: Partial<Artwork>): Promise<Artwork> {
    return this.apiCall<Artwork>(`${API_ENDPOINTS.artworks.base}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artwork),
    })
  }

  async deleteArtwork(id: number): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(`${API_ENDPOINTS.artworks.base}/${id}`, {
      method: 'DELETE',
    })
  }

  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.apiCall<UploadResponse>(API_ENDPOINTS.artworks.upload, {
      method: 'POST',
      headers: {
        // Ne pas définir Content-Type pour multipart/form-data
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData,
    })
  }

  // ===== MÉTHODES SPÉCIFIQUES AUX REVIEWS =====
  
  // Routes publiques
  async getReviews(): Promise<Review[]> {
    return this.apiCall<Review[]>(API_ENDPOINTS.reviews.base, {
      method: 'GET',
    })
  }

  async getReviewsByArtwork(artworkId: number): Promise<Review[]> {
    return this.apiCall<Review[]>(`${API_ENDPOINTS.reviews.artwork}/${artworkId}`, {
      method: 'GET',
    })
  }

  async createReview(review: ReviewRequest): Promise<Review> {
    return this.apiCall<Review>(API_ENDPOINTS.reviews.base, {
      method: 'POST',
      body: JSON.stringify(review),
    })
  }

  async markReviewHelpful(reviewId: number): Promise<{ message: string; helpful: number }> {
    return this.apiCall<{ message: string; helpful: number }>(`${API_ENDPOINTS.reviews.helpful}/${reviewId}/helpful`, {
      method: 'POST',
    })
  }

  // Routes protégées (ADMIN)
  async getPendingReviews(): Promise<Review[]> {
    return this.apiCall<Review[]>(API_ENDPOINTS.reviews.pending, {
      method: 'GET',
    })
  }

  async approveReview(reviewId: number): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(`${API_ENDPOINTS.reviews.approve}/${reviewId}/approve`, {
      method: 'POST',
    })
  }

  async deleteReview(reviewId: number): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(`${API_ENDPOINTS.reviews.delete}/${reviewId}`, {
      method: 'DELETE',
    })
  }

  // ===== MÉTHODES SPÉCIFIQUES AU CONTACT =====
  
  // Routes publiques
  async sendContactMessage(contactData: ContactRequest): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(API_ENDPOINTS.contact.base, {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  // Routes protégées (ADMIN)
  async getContactMessages(): Promise<ContactMessage[]> {
    return this.apiCall<ContactMessage[]>(API_ENDPOINTS.contact.base, {
      method: 'GET',
    })
  }

  async getUnreadContactMessages(): Promise<ContactMessage[]> {
    return this.apiCall<ContactMessage[]>(API_ENDPOINTS.contact.unread, {
      method: 'GET',
    })
  }

  async markContactAsRead(contactId: number): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(`${API_ENDPOINTS.contact.read}/${contactId}/read`, {
      method: 'POST',
    })
  }

  async markContactAsResponded(contactId: number): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(`${API_ENDPOINTS.contact.responded}/${contactId}/responded`, {
      method: 'POST',
    })
  }

  async deleteContactMessage(contactId: number): Promise<{ message: string }> {
    return this.apiCall<{ message: string }>(`${API_ENDPOINTS.contact.delete}/${contactId}`, {
      method: 'DELETE',
    })
  }

  // ===== MÉTHODES SPÉCIFIQUES AUX STATISTIQUES =====
  
  async getStats(): Promise<StatsResponse> {
    return this.apiCall<StatsResponse>(API_ENDPOINTS.stats, {
      method: 'GET',
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()