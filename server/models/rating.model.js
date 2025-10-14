import { getDatabase } from '../database/db.js';

export class RatingModel {
  // Get average rating for artwork
  static async getAverageForArtwork(artworkId) {
    const db = await getDatabase();
    
    const result = await db.get(
      'SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE artwork_id = ?',
      [artworkId]
    );
    
    return {
      average: result.average || 0,
      count: result.count || 0
    };
  }

  // Add rating
  static async create(ratingData) {
    const db = await getDatabase();
    
    const result = await db.run(
      'INSERT INTO ratings (artwork_id, rating, ip_address) VALUES (?, ?, ?)',
      [ratingData.artworkId, ratingData.rating, ratingData.ipAddress || null]
    );
    
    return {
      id: result.lastID,
      ...ratingData
    };
  }

  // Get all ratings for artwork
  static async getByArtwork(artworkId) {
    const db = await getDatabase();
    return await db.all(
      'SELECT * FROM ratings WHERE artwork_id = ? ORDER BY created_at DESC',
      [artworkId]
    );
  }
}

export default RatingModel;

