import { apiService, LoginRequest, AuthResponse } from '@/lib/api'

export class SpringAuthService {
  // Login with Spring Boot backend
  static async signIn(email: string, password: string): Promise<void> {
    try {
      console.log('🔐 Attempting login with:', { email, password: '***' })
      
      const loginRequest: LoginRequest = { email, password }
      console.log('📤 Sending request to backend:', loginRequest)
      
      const response: AuthResponse = await apiService.login(loginRequest)
      console.log('✅ Login successful:', response)
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      console.log('💾 User data stored in localStorage')
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      })
      throw new Error(error.message || 'Login failed')
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  // Get current user from localStorage
  static async getCurrentUser(): Promise<any> {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('authToken')
    if (!token) return false

    try {
      // Validate token with backend
      const response = await apiService.validateToken()
      return response.valid
    } catch (error) {
      console.error('Token validation failed:', error)
      // If validation fails, clear stored data
      this.signOut()
      return false
    }
  }

  // Get current session
  static async getSession(): Promise<any> {
    const isAuth = await this.isAuthenticated()
    if (isAuth) {
      return {
        user: await this.getCurrentUser(),
        token: localStorage.getItem('authToken')
      }
    }
    return null
  }

  // Create admin user (for initial setup)
  static async createAdmin(): Promise<void> {
    try {
      const response = await apiService.createAdmin()
      console.log('Admin created:', response)
    } catch (error: any) {
      console.error('Admin creation failed:', error)
      throw new Error(error.message || 'Admin creation failed')
    }
  }

  // Auth state change listener (simplified version)
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    // For Spring Boot, we'll use a simple interval to check auth state
    const checkAuthState = async () => {
      const session = await this.getSession()
      if (session) {
        callback('SIGNED_IN', session)
      } else {
        callback('SIGNED_OUT', null)
      }
    }

    // Check immediately
    checkAuthState()

    // Check every 30 seconds
    const interval = setInterval(checkAuthState, 30000)

    // Return cleanup function
    return () => clearInterval(interval)
  }
}
