import { supabase, Artwork } from '@/lib/supabase'

export class SupabaseArtworkService {
  // Get all artworks
  static async getAllArtworks(): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching artworks:', error)
      throw new Error('Failed to fetch artworks')
    }

    return data || []
  }

  // Get artwork by ID
  static async getArtworkById(id: number): Promise<Artwork | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching artwork:', error)
      return null
    }

    return data
  }

  // Create new artwork
  static async createArtwork(artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>): Promise<Artwork> {
    const { data, error } = await supabase
      .from('artworks')
      .insert([artwork])
      .select()
      .single()

    if (error) {
      console.error('Error creating artwork:', error)
      throw new Error('Failed to create artwork')
    }

    return data
  }

  // Update artwork
  static async updateArtwork(id: number, artwork: Partial<Omit<Artwork, 'id' | 'created_at' | 'updated_at'>>): Promise<Artwork> {
    const { data, error } = await supabase
      .from('artworks')
      .update({ ...artwork, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating artwork:', error)
      throw new Error('Failed to update artwork')
    }

    return data
  }

  // Delete artwork
  static async deleteArtwork(id: number): Promise<void> {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting artwork:', error)
      throw new Error('Failed to delete artwork')
    }
  }

  // Search artworks
  static async searchArtworks(query: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .or(`titre.ilike.%${query}%,description.ilike.%${query}%,technique.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching artworks:', error)
      throw new Error('Failed to search artworks')
    }

    return data || []
  }

  // Get artworks by technique
  static async getArtworksByTechnique(technique: string): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('technique', technique)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching artworks by technique:', error)
      throw new Error('Failed to fetch artworks by technique')
    }

    return data || []
  }

  // Get artworks by year
  static async getArtworksByYear(year: number): Promise<Artwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('annee', year)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching artworks by year:', error)
      throw new Error('Failed to fetch artworks by year')
    }

    return data || []
  }
}
