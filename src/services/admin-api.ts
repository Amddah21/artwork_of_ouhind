// Admin API Service for managing artworks with file uploads
const API_BASE_URL = 'http://localhost:3001/api';

export interface Artwork {
  id?: string;
  title: string;
  description: string;
  year: number;
  medium: string;
  dimensions: string;
  category: string;
  price?: number;
  isAvailable: boolean;
  imageUrl: string;
  thumbnailUrl?: string;
  story?: string;
  tags?: string[];
  multipleViews?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

class AdminApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request handler
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Get all artworks
  async getAllArtworks(filters?: { category?: string; available?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Artwork[]>(`/artworks${query}`, { method: 'GET' });
  }

  // Get artwork by ID
  async getArtworkById(id: string) {
    return this.request<Artwork>(`/artworks/${id}`, { method: 'GET' });
  }

  // Create artwork with image upload
  async createArtwork(artworkData: Partial<Artwork>, imageFile?: File) {
    const formData = new FormData();
    
    // Append artwork data
    Object.entries(artworkData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key === 'isAvailable') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`${this.baseURL}/artworks`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create artwork',
        };
      }

      return data;
    } catch (error) {
      console.error('Create artwork error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create artwork',
      };
    }
  }

  // Update artwork with optional image upload
  async updateArtwork(id: string, artworkData: Partial<Artwork>, imageFile?: File) {
    const formData = new FormData();
    
    // Append artwork data
    Object.entries(artworkData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key === 'isAvailable') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`${this.baseURL}/artworks/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to update artwork',
        };
      }

      return data;
    } catch (error) {
      console.error('Update artwork error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update artwork',
      };
    }
  }

  // Delete artwork
  async deleteArtwork(id: string) {
    return this.request(`/artworks/${id}`, { method: 'DELETE' });
  }

  // Get admin statistics
  async getStatistics() {
    return this.request(`/admin/stats`, { method: 'GET' });
  }

  // Get activity logs
  async getLogs(filters?: { level?: string; category?: string; search?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.level) params.append('level', filters.level);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/admin/logs${query}`, { method: 'GET' });
  }

  // Get admin overview
  async getOverview() {
    return this.request(`/admin/overview`, { method: 'GET' });
  }

  // Reviews
  async getAllReviews(filters?: { artworkId?: string; approved?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.artworkId) params.append('artworkId', filters.artworkId);
    if (filters?.approved !== undefined) params.append('approved', String(filters.approved));
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/reviews${query}`, { method: 'GET' });
  }

  async approveReview(id: string) {
    return this.request(`/reviews/${id}/approve`, { method: 'PATCH' });
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, { method: 'DELETE' });
  }

  // Contact messages
  async getAllMessages(filters?: { isRead?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.isRead !== undefined) params.append('isRead', String(filters.isRead));
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/contact${query}`, { method: 'GET' });
  }

  async markMessageAsRead(id: string) {
    return this.request(`/contact/${id}/read`, { method: 'PATCH' });
  }

  async deleteMessage(id: string) {
    return this.request(`/contact/${id}`, { method: 'DELETE' });
  }
}

// Export a singleton instance
export const adminApi = new AdminApiClient();
export default adminApi;

