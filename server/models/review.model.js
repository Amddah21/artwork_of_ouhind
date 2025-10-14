import { getDatabase } from '../database/db.js';

export class ReviewModel {
  // Get all reviews
  static async getAll(filters = {}) {
    const db = await getDatabase();
    let query = 'SELECT * FROM reviews';
    const params = [];
    
    if (filters.artworkId) {
      query += ' WHERE artwork_id = ?';
      params.push(filters.artworkId);
    }
    
    if (filters.approved !== undefined) {
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ' is_approved = ?';
      params.push(filters.approved ? 1 : 0);
    }
    
    query += ' ORDER BY created_at DESC';
    
    return await db.all(query, params);
  }

  // Get review by ID
  static async getById(id) {
    const db = await getDatabase();
    return await db.get('SELECT * FROM reviews WHERE id = ?', [id]);
  }

  // Create new review
  static async create(reviewData) {
    const db = await getDatabase();
    
    const result = await db.run(
      `INSERT INTO reviews (artwork_id, name, email, rating, comment, is_approved)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        reviewData.artworkId || null,
        reviewData.name,
        reviewData.email,
        reviewData.rating,
        reviewData.comment,
        reviewData.isApproved ? 1 : 0
      ]
    );
    
    return this.getById(result.lastID);
  }

  // Approve review
  static async approve(id) {
    const db = await getDatabase();
    await db.run('UPDATE reviews SET is_approved = 1 WHERE id = ?', [id]);
    return this.getById(id);
  }

  // Delete review
  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM reviews WHERE id = ?', [id]);
    return true;
  }
}

export default ReviewModel;

