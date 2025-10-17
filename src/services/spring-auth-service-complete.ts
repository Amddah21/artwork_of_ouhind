import { apiService, LoginRequest, AuthResponse } from '@/lib/api'

export interface User {
  id: number
  username: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export class SpringAuthService {
  // Connexion utilisateur
  static async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('🔐 [SpringAuthService] Attempting login for:', email)
      
      const credentials: LoginRequest = { email, password }
      const response: AuthResponse = await apiService.login(credentials)
      
      console.log('🔐 [SpringAuthService] Login successful:', response)
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      console.log('🔐 [SpringAuthService] Token and user data stored in localStorage')
      
      return response.user
    } catch (error: any) {
      console.error('🔐 [SpringAuthService] Login failed:', error)
      
      // Gestion des erreurs spécifiques
      if (error.message?.includes('401')) {
        throw new Error('Email ou mot de passe incorrect')
      } else if (error.message?.includes('403')) {
        throw new Error('Accès refusé')
      } else if (error.message?.includes('404')) {
        throw new Error('Service d\'authentification non disponible')
      } else {
        throw new Error('Erreur de connexion. Veuillez réessayer.')
      }
    }
  }

  // Déconnexion utilisateur
  static async signOut(): Promise<void> {
    try {
      console.log('🔐 [SpringAuthService] Signing out user')
      
      // Supprimer les données stockées
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      console.log('🔐 [SpringAuthService] User signed out successfully')
    } catch (error) {
      console.error('🔐 [SpringAuthService] Sign out error:', error)
      // Même en cas d'erreur, on supprime les données locales
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  // Récupérer la session actuelle
  static async getSession(): Promise<User | null> {
    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('user')
      
      if (!token || !userData) {
        console.log('🔐 [SpringAuthService] No token or user data found')
        return null
      }
      
      console.log('🔐 [SpringAuthService] Validating existing token')
      
      // Valider le token avec le backend
      const isValid = await apiService.validateToken()
      
      if (isValid.valid) {
        const user = JSON.parse(userData)
        console.log('🔐 [SpringAuthService] Token is valid, user:', user)
        return user
      } else {
        console.log('🔐 [SpringAuthService] Token is invalid, clearing data')
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        return null
      }
    } catch (error) {
      console.error('🔐 [SpringAuthService] Session validation error:', error)
      // En cas d'erreur, supprimer les données locales
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return null
    }
  }

  // Écouter les changements d'état d'authentification
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    console.log('🔐 [SpringAuthService] Setting up auth state listener')
    
    // Vérifier l'état initial
    this.getSession().then(callback)
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        console.log('🔐 [SpringAuthService] Auth data changed, updating state')
        this.getSession().then(callback)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Retourner une fonction de nettoyage
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }

  // Vérifier si l'utilisateur est admin
  static isAdmin(user: User | null): boolean {
    return user?.role === 'ADMIN' || user?.role === 'admin'
  }

  // Obtenir le token actuel
  static getCurrentToken(): string | null {
    return localStorage.getItem('authToken')
  }

  // Créer un admin (pour le développement)
  static async createAdmin(): Promise<{ message: string; username: string; email: string }> {
    try {
      console.log('🔐 [SpringAuthService] Creating admin user')
      const result = await apiService.createAdmin()
      console.log('🔐 [SpringAuthService] Admin created:', result)
      return result
    } catch (error: any) {
      console.error('🔐 [SpringAuthService] Admin creation failed:', error)
      throw new Error('Erreur lors de la création de l\'administrateur')
    }
  }
}
