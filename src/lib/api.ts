// 🔧 BACKEND API CONFIGURATION
// Configure your Spring Boot backend endpoint here

export const API_BASE_URL = 'http://localhost:8091/api' // Your Spring Boot backend URL
// Change this to your actual Spring Boot backend URL
// Example: 'http://localhost:8091/api' or 'https://your-domain.com/api'

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    validate: '/auth/validate',
    createAdmin: '/auth/create-admin'
  },
  // Add more endpoints as needed
  artworks: '/artworks',
  users: '/users'
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

// API Service Class
export class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // Generic API call method
  private async apiCall<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    // Add Authorization header if token exists
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
      console.log('🌐 API Call:', { url, method: config.method, headers: config.headers })
      
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
      console.error('❌ API call failed:', error)
      throw error
    }
  }

  // Authentication methods
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

  // Add more API methods as needed
  async getArtworks() {
    return this.apiCall(API_ENDPOINTS.artworks, {
      method: 'GET',
    })
  }

  async createArtwork(artwork: any) {
    return this.apiCall(API_ENDPOINTS.artworks, {
      method: 'POST',
      body: JSON.stringify(artwork),
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()
