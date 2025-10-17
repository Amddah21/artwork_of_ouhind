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
  artworks: '/artworks',
  reviews: '/reviews',
  contact: '/contact',
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
  
  async getArtworks() {
    return this.apiCall(API_ENDPOINTS.artworks, {
      method: 'GET',
    })
  }

  async getArtworkById(id: number) {
    return this.apiCall(`${API_ENDPOINTS.artworks}/${id}`, {
      method: 'GET',
    })
  }

  async createArtwork(artwork: any) {
    return this.apiCall(API_ENDPOINTS.artworks, {
      method: 'POST',
      body: JSON.stringify(artwork),
    })
  }

  async updateArtwork(id: number, artwork: any) {
    return this.apiCall(`${API_ENDPOINTS.artworks}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artwork),
    })
  }

  async deleteArtwork(id: number) {
    return this.apiCall(`${API_ENDPOINTS.artworks}/${id}`, {
      method: 'DELETE',
    })
  }

  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.apiCall(`${API_ENDPOINTS.artworks}/upload`, {
      method: 'POST',
      headers: {
        // Ne pas définir Content-Type pour multipart/form-data
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData,
    })
  }

  // ===== MÉTHODES SPÉCIFIQUES AUX COMMENTAIRES =====
  
  async getReviews() {
    return this.apiCall(API_ENDPOINTS.reviews, {
      method: 'GET',
    })
  }

  async createReview(review: any) {
    return this.apiCall(API_ENDPOINTS.reviews, {
      method: 'POST',
      body: JSON.stringify(review),
    })
  }

  async markReviewHelpful(id: number) {
    return this.apiCall(`${API_ENDPOINTS.reviews}/${id}/helpful`, {
      method: 'POST',
    })
  }

  // ===== MÉTHODES SPÉCIFIQUES AU CONTACT =====
  
  async sendContactMessage(contactData: any) {
    return this.apiCall(API_ENDPOINTS.contact, {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  // ===== MÉTHODES SPÉCIFIQUES AUX STATISTIQUES =====
  
  async getStats() {
    return this.apiCall(API_ENDPOINTS.stats, {
      method: 'GET',
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()
