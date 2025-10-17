import { apiService } from '@/lib/api'

export interface Artwork {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  price: number
  technique?: string
  dimensions?: string
  year?: number
  available?: boolean
  featured?: boolean
  tags?: string[]
  materials?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateArtworkRequest {
  title: string
  description: string
  category: string
  price: number
  imageUrl: string
}

export interface UpdateArtworkRequest {
  title?: string
  description?: string
  imageUrl?: string
  technique?: string
  dimensions?: string
  year?: number
  category?: string
  available?: boolean
  featured?: boolean
  tags?: string[]
  materials?: string[]
}

export class SpringArtworkService {
  // Get all artworks
  static async getAllArtworks(): Promise<Artwork[]> {
    try {
      console.log('🎨 [SpringArtworkService] Fetching all artworks...')
      const response = await apiService.get('/artworks')
      console.log('🎨 [SpringArtworkService] Artworks fetched successfully:', response.data)
      return response.data || []
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error fetching artworks:', error)
      throw new Error('Failed to fetch artworks')
    }
  }

  // Get artwork by ID
  static async getArtworkById(id: number): Promise<Artwork | null> {
    try {
      console.log(`🎨 [SpringArtworkService] Fetching artwork ${id}...`)
      const response = await apiService.get(`/artworks/${id}`)
      console.log(`🎨 [SpringArtworkService] Artwork ${id} fetched successfully:`, response.data)
      return response.data
    } catch (error) {
      console.error(`🎨 [SpringArtworkService] Error fetching artwork ${id}:`, error)
      return null
    }
  }

  // Create new artwork (Admin only)
  static async createArtwork(artwork: CreateArtworkRequest): Promise<Artwork> {
    try {
      console.log('🎨 [SpringArtworkService] Creating artwork:', artwork)
      const response = await apiService.post('/artworks', artwork)
      console.log('🎨 [SpringArtworkService] Artwork created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error creating artwork:', error)
      throw new Error('Failed to create artwork')
    }
  }

  // Upload image (Admin only)
  static async uploadImage(file: File): Promise<{ imageUrl: string }> {
    try {
      console.log('🎨 [SpringArtworkService] Uploading image:', file.name)
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiService.post('/artworks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('🎨 [SpringArtworkService] Image uploaded successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  }

  // Update artwork (Admin only)
  static async updateArtwork(id: number, artwork: UpdateArtworkRequest): Promise<Artwork> {
    try {
      console.log(`🎨 [SpringArtworkService] Updating artwork ${id}:`, artwork)
      const response = await apiService.put(`/artworks/${id}`, artwork)
      console.log(`🎨 [SpringArtworkService] Artwork ${id} updated successfully:`, response.data)
      return response.data
    } catch (error) {
      console.error(`🎨 [SpringArtworkService] Error updating artwork ${id}:`, error)
      throw new Error('Failed to update artwork')
    }
  }

  // Delete artwork (Admin only)
  static async deleteArtwork(id: number): Promise<void> {
    try {
      console.log(`🎨 [SpringArtworkService] Deleting artwork ${id}...`)
      await apiService.delete(`/artworks/${id}`)
      console.log(`🎨 [SpringArtworkService] Artwork ${id} deleted successfully`)
    } catch (error) {
      console.error(`🎨 [SpringArtworkService] Error deleting artwork ${id}:`, error)
      throw new Error('Failed to delete artwork')
    }
  }

  // Search artworks
  static async searchArtworks(query: string): Promise<Artwork[]> {
    try {
      console.log(`🎨 [SpringArtworkService] Searching artworks with query: "${query}"`)
      const response = await apiService.get(`/artworks/search?q=${encodeURIComponent(query)}`)
      console.log(`🎨 [SpringArtworkService] Search results:`, response.data)
      return response.data || []
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error searching artworks:', error)
      throw new Error('Failed to search artworks')
    }
  }

  // Get artworks by technique
  static async getArtworksByTechnique(technique: string): Promise<Artwork[]> {
    try {
      console.log(`🎨 [SpringArtworkService] Fetching artworks by technique: "${technique}"`)
      const response = await apiService.get(`/artworks/technique/${encodeURIComponent(technique)}`)
      console.log(`🎨 [SpringArtworkService] Artworks by technique fetched:`, response.data)
      return response.data || []
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error fetching artworks by technique:', error)
      throw new Error('Failed to fetch artworks by technique')
    }
  }

  // Get artworks by year
  static async getArtworksByYear(year: number): Promise<Artwork[]> {
    try {
      console.log(`🎨 [SpringArtworkService] Fetching artworks by year: ${year}`)
      const response = await apiService.get(`/artworks/year/${year}`)
      console.log(`🎨 [SpringArtworkService] Artworks by year fetched:`, response.data)
      return response.data || []
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error fetching artworks by year:', error)
      throw new Error('Failed to fetch artworks by year')
    }
  }

  // Get featured artworks
  static async getFeaturedArtworks(): Promise<Artwork[]> {
    try {
      console.log('🎨 [SpringArtworkService] Fetching featured artworks...')
      const response = await apiService.get('/artworks/featured')
      console.log('🎨 [SpringArtworkService] Featured artworks fetched:', response.data)
      return response.data || []
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error fetching featured artworks:', error)
      throw new Error('Failed to fetch featured artworks')
    }
  }

  // Get artworks by category
  static async getArtworksByCategory(category: string): Promise<Artwork[]> {
    try {
      console.log(`🎨 [SpringArtworkService] Fetching artworks by category: "${category}"`)
      const response = await apiService.get(`/artworks/category/${encodeURIComponent(category)}`)
      console.log(`🎨 [SpringArtworkService] Artworks by category fetched:`, response.data)
      return response.data || []
    } catch (error) {
      console.error('🎨 [SpringArtworkService] Error fetching artworks by category:', error)
      throw new Error('Failed to fetch artworks by category')
    }
  }

  // Get image URL
  static getImageUrl(fileName: string): string {
    return `${apiService.defaults.baseURL}/artworks/images/${fileName}`
  }
}
