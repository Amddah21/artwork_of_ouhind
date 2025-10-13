/**
 * API Usage Examples
 * 
 * This file demonstrates how to use the backend API services
 * in your React components.
 */

import { useEffect, useState } from 'react';
import { 
  artworkService, 
  reviewService, 
  ratingService, 
  contactService,
  adminService 
} from '@/services/api';

// Example 1: Fetch all artworks
export function ArtworkListExample() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      const response = await artworkService.getAll();
      
      if (response.success) {
        setArtworks(response.data);
      } else {
        setError(response.error || 'Failed to fetch artworks');
      }
      
      setLoading(false);
    };

    fetchArtworks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {artworks.map((artwork: any) => (
        <div key={artwork.id}>{artwork.title}</div>
      ))}
    </div>
  );
}

// Example 2: Submit a review
export function ReviewFormExample({ artworkId }: { artworkId: string }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const response = await reviewService.create({
      artworkId,
      content,
      userName: 'Anonymous',
    });

    if (response.success) {
      alert('Review submitted successfully!');
      setContent('');
    } else {
      alert(`Error: ${response.error}`);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review..."
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

// Example 3: Submit a rating
export function RatingExample({ artworkId }: { artworkId: string }) {
  const submitRating = async (rating: number) => {
    const response = await ratingService.submit({
      artworkId,
      rating,
    });

    if (response.success) {
      alert('Rating submitted!');
    } else {
      alert(`Error: ${response.error}`);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => submitRating(star)}>
          ⭐
        </button>
      ))}
    </div>
  );
}

// Example 4: Contact form
export function ContactFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await contactService.send(formData);

    if (response.success) {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert(`Error: ${response.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  );
}

// Example 5: Admin login
export function AdminLoginExample() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await adminService.login(credentials);

    if (response.success) {
      // Store token in localStorage or context
      localStorage.setItem('adminToken', response.data.token);
      alert('Login successful!');
    } else {
      alert(`Login failed: ${response.error}`);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        placeholder="Username"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Example 6: Using React Query (recommended for better caching and state management)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function ArtworkDetailWithReactQuery({ artworkId }: { artworkId: string }) {
  const queryClient = useQueryClient();

  // Fetch artwork
  const { data: artwork, isLoading, error } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      const response = await artworkService.getById(artworkId);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });

  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: (reviewData: any) => reviewService.create(reviewData),
    onSuccess: () => {
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews', artworkId] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{artwork?.title}</h1>
      <button onClick={() => reviewMutation.mutate({ artworkId, content: 'Great!' })}>
        Submit Review
      </button>
    </div>
  );
}

