import { API_CONFIG, API_ENDPOINTS } from '@/lib/api-config';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Base API client
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: 'An unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

// Artwork API Services
export const artworkService = {
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.artworks.getAll);
  },

  getById: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.artworks.getById(id));
  },

  create: async (artwork: any) => {
    return apiClient.post(API_ENDPOINTS.artworks.create, artwork);
  },

  update: async (id: string, artwork: any) => {
    return apiClient.put(API_ENDPOINTS.artworks.update(id), artwork);
  },

  delete: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.artworks.delete(id));
  },
};

// Review API Services
export const reviewService = {
  getByArtwork: async (artworkId: string) => {
    return apiClient.get(API_ENDPOINTS.reviews.getByArtwork(artworkId));
  },

  create: async (review: any) => {
    return apiClient.post(API_ENDPOINTS.reviews.create, review);
  },

  update: async (id: string, review: any) => {
    return apiClient.put(API_ENDPOINTS.reviews.update(id), review);
  },

  delete: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.reviews.delete(id));
  },
};

// Rating API Services
export const ratingService = {
  getByArtwork: async (artworkId: string) => {
    return apiClient.get(API_ENDPOINTS.ratings.getByArtwork(artworkId));
  },

  submit: async (rating: any) => {
    return apiClient.post(API_ENDPOINTS.ratings.submit, rating);
  },

  update: async (id: string, rating: any) => {
    return apiClient.put(API_ENDPOINTS.ratings.update(id), rating);
  },
};

// Contact API Services
export const contactService = {
  send: async (contactData: any) => {
    return apiClient.post(API_ENDPOINTS.contact.send, contactData);
  },

  sendInquiry: async (inquiryData: any) => {
    return apiClient.post(API_ENDPOINTS.contact.inquiry, inquiryData);
  },

  sendPurchaseRequest: async (purchaseData: any) => {
    return apiClient.post(API_ENDPOINTS.contact.purchase, purchaseData);
  },
};

// Admin API Services
export const adminService = {
  login: async (credentials: { username: string; password: string }) => {
    return apiClient.post(API_ENDPOINTS.admin.login, credentials);
  },

  verify: async (token: string) => {
    return apiClient.post(API_ENDPOINTS.admin.verify, { token });
  },

  logout: async () => {
    return apiClient.post(API_ENDPOINTS.admin.logout);
  },
};

export default apiClient;

