import { apiService } from '@/lib/api'

export interface Review {
  id: number
  artworkId: number
  userName: string
  userEmail: string
  rating: number // 1-5 stars
  comment: string
  helpful: number // number of helpful votes
  verified: boolean // verified purchase
  createdAt: string
  updatedAt: string
}

export interface CreateReviewRequest {
  artworkId: number
  userName: string
  userEmail: string
  rating: number
  comment: string
}

export interface UpdateReviewRequest {
  userName?: string
  userEmail?: string
  rating?: number
  comment?: string
}

export interface ReviewStats {
  average: number
  count: number
  distribution: number[] // [1-star, 2-star, 3-star, 4-star, 5-star]
}

export class SpringReviewService {
  // Get all reviews
  static async getAllReviews(): Promise<Review[]> {
    try {
      console.log('💬 [SpringReviewService] Fetching all reviews...')
      const response = await apiService.get('/reviews')
      console.log('💬 [SpringReviewService] Reviews fetched successfully:', response.data)
      return response.data || []
    } catch (error) {
      console.error('💬 [SpringReviewService] Error fetching reviews:', error)
      throw new Error('Failed to fetch reviews')
    }
  }

  // Get reviews by artwork ID
  static async getReviewsByArtworkId(artworkId: number): Promise<Review[]> {
    try {
      console.log(`💬 [SpringReviewService] Fetching reviews for artwork ${artworkId}...`)
      const response = await apiService.get(`/reviews/artwork/${artworkId}`)
      console.log(`💬 [SpringReviewService] Reviews for artwork ${artworkId} fetched:`, response.data)
      return response.data || []
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error fetching reviews for artwork ${artworkId}:`, error)
      throw new Error('Failed to fetch reviews for artwork')
    }
  }

  // Get review by ID
  static async getReviewById(id: number): Promise<Review | null> {
    try {
      console.log(`💬 [SpringReviewService] Fetching review ${id}...`)
      const response = await apiService.get(`/reviews/${id}`)
      console.log(`💬 [SpringReviewService] Review ${id} fetched successfully:`, response.data)
      return response.data
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error fetching review ${id}:`, error)
      return null
    }
  }

  // Create new review
  static async createReview(review: CreateReviewRequest): Promise<Review> {
    try {
      console.log('💬 [SpringReviewService] Creating review:', review)
      const response = await apiService.post('/reviews', review)
      console.log('💬 [SpringReviewService] Review created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('💬 [SpringReviewService] Error creating review:', error)
      throw new Error('Failed to create review')
    }
  }

  // Update review
  static async updateReview(id: number, review: UpdateReviewRequest): Promise<Review> {
    try {
      console.log(`💬 [SpringReviewService] Updating review ${id}:`, review)
      const response = await apiService.put(`/reviews/${id}`, review)
      console.log(`💬 [SpringReviewService] Review ${id} updated successfully:`, response.data)
      return response.data
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error updating review ${id}:`, error)
      throw new Error('Failed to update review')
    }
  }

  // Delete review
  static async deleteReview(id: number): Promise<void> {
    try {
      console.log(`💬 [SpringReviewService] Deleting review ${id}...`)
      await apiService.delete(`/reviews/${id}`)
      console.log(`💬 [SpringReviewService] Review ${id} deleted successfully`)
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error deleting review ${id}:`, error)
      throw new Error('Failed to delete review')
    }
  }

  // Mark review as helpful
  static async markHelpful(id: number): Promise<Review> {
    try {
      console.log(`💬 [SpringReviewService] Marking review ${id} as helpful...`)
      const response = await apiService.post(`/reviews/${id}/helpful`)
      console.log(`💬 [SpringReviewService] Review ${id} marked as helpful:`, response.data)
      return response.data
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error marking review ${id} as helpful:`, error)
      throw new Error('Failed to mark review as helpful')
    }
  }

  // Get review statistics for an artwork
  static async getReviewStats(artworkId: number): Promise<ReviewStats> {
    try {
      console.log(`💬 [SpringReviewService] Fetching review stats for artwork ${artworkId}...`)
      const response = await apiService.get(`/reviews/artwork/${artworkId}/stats`)
      console.log(`💬 [SpringReviewService] Review stats for artwork ${artworkId}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error fetching review stats for artwork ${artworkId}:`, error)
      // Return default stats if error
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] }
    }
  }

  // Get reviews by user email
  static async getReviewsByUser(userEmail: string): Promise<Review[]> {
    try {
      console.log(`💬 [SpringReviewService] Fetching reviews for user: ${userEmail}`)
      const response = await apiService.get(`/reviews/user/${encodeURIComponent(userEmail)}`)
      console.log(`💬 [SpringReviewService] Reviews for user fetched:`, response.data)
      return response.data || []
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error fetching reviews for user:`, error)
      throw new Error('Failed to fetch reviews for user')
    }
  }

  // Verify review (admin only)
  static async verifyReview(id: number): Promise<Review> {
    try {
      console.log(`💬 [SpringReviewService] Verifying review ${id}...`)
      const response = await apiService.post(`/reviews/${id}/verify`)
      console.log(`💬 [SpringReviewService] Review ${id} verified successfully:`, response.data)
      return response.data
    } catch (error) {
      console.error(`💬 [SpringReviewService] Error verifying review ${id}:`, error)
      throw new Error('Failed to verify review')
    }
  }
}
