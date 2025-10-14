import { getDatabase } from '../database/db.js';

export class ArtworkModel {
  // Get all artworks
  static async getAll(filters = {}) {
    const pool = await getDatabase();
    let query = 'SELECT * FROM artworks';
    const params = [];
    let paramCount = 0;
    
    if (filters.category) {
      paramCount++;
      query += ' WHERE category = $' + paramCount;
      params.push(filters.category);
    }
    
    if (filters.available !== undefined) {
      paramCount++;
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ' is_available = $' + paramCount;
      params.push(filters.available);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    const artworks = result.rows;
    
    // Get tags for each artwork
    for (const artwork of artworks) {
      const tagsResult = await pool.query(
        'SELECT tag FROM artwork_tags WHERE artwork_id = $1',
        [artwork.id]
      );
      artwork.tags = tagsResult.rows.map(t => t.tag);
      
      // Get additional images
      const imagesResult = await pool.query(
        'SELECT image_url FROM artwork_images WHERE artwork_id = $1 ORDER BY display_order',
        [artwork.id]
      );
      artwork.multipleViews = imagesResult.rows.map(img => img.image_url);
    }
    
    return artworks;
  }

  // Get artwork by ID
  static async getById(id) {
    const db = await getDatabase();
    const artwork = await db.get('SELECT * FROM artworks WHERE id = ?', [id]);
    
    if (artwork) {
      // Get tags
      const tags = await db.all(
        'SELECT tag FROM artwork_tags WHERE artwork_id = ?',
        [id]
      );
      artwork.tags = tags.map(t => t.tag);
      
      // Get additional images
      const images = await db.all(
        'SELECT image_url FROM artwork_images WHERE artwork_id = ? ORDER BY display_order',
        [id]
      );
      artwork.multipleViews = images.map(img => img.image_url);
    }
    
    return artwork;
  }

  // Create new artwork
  static async create(artworkData) {
    const db = await getDatabase();
    
    const result = await db.run(
      `INSERT INTO artworks (title, description, year, medium, dimensions, category, price, is_available, image_url, thumbnail_url, story)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        artworkData.title,
        artworkData.description,
        artworkData.year,
        artworkData.medium,
        artworkData.dimensions,
        artworkData.category,
        artworkData.price || null,
        artworkData.isAvailable ? 1 : 0,
        artworkData.imageUrl,
        artworkData.thumbnailUrl || null,
        artworkData.story || null
      ]
    );
    
    const artworkId = result.lastID;
    
    // Insert tags
    if (artworkData.tags && artworkData.tags.length > 0) {
      for (const tag of artworkData.tags) {
        await db.run(
          'INSERT INTO artwork_tags (artwork_id, tag) VALUES (?, ?)',
          [artworkId, tag]
        );
      }
    }
    
    // Insert multiple images if provided
    if (artworkData.multipleViews && artworkData.multipleViews.length > 0) {
      for (let i = 0; i < artworkData.multipleViews.length; i++) {
        await db.run(
          'INSERT INTO artwork_images (artwork_id, image_url, display_order) VALUES (?, ?, ?)',
          [artworkId, artworkData.multipleViews[i], i]
        );
      }
    }
    
    return this.getById(artworkId);
  }

  // Update artwork
  static async update(id, artworkData) {
    const db = await getDatabase();
    
    await db.run(
      `UPDATE artworks 
       SET title = ?, description = ?, year = ?, medium = ?, dimensions = ?, 
           category = ?, price = ?, is_available = ?, image_url = ?, 
           thumbnail_url = ?, story = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        artworkData.title,
        artworkData.description,
        artworkData.year,
        artworkData.medium,
        artworkData.dimensions,
        artworkData.category,
        artworkData.price || null,
        artworkData.isAvailable ? 1 : 0,
        artworkData.imageUrl,
        artworkData.thumbnailUrl || null,
        artworkData.story || null,
        id
      ]
    );
    
    // Update tags - delete old ones and insert new ones
    await db.run('DELETE FROM artwork_tags WHERE artwork_id = ?', [id]);
    if (artworkData.tags && artworkData.tags.length > 0) {
      for (const tag of artworkData.tags) {
        await db.run(
          'INSERT INTO artwork_tags (artwork_id, tag) VALUES (?, ?)',
          [id, tag]
        );
      }
    }
    
    // Update multiple images
    await db.run('DELETE FROM artwork_images WHERE artwork_id = ?', [id]);
    if (artworkData.multipleViews && artworkData.multipleViews.length > 0) {
      for (let i = 0; i < artworkData.multipleViews.length; i++) {
        await db.run(
          'INSERT INTO artwork_images (artwork_id, image_url, display_order) VALUES (?, ?, ?)',
          [id, artworkData.multipleViews[i], i]
        );
      }
    }
    
    return this.getById(id);
  }

  // Delete artwork
  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM artworks WHERE id = ?', [id]);
    return true;
  }

  // Get artwork statistics
  static async getStatistics() {
    const db = await getDatabase();
    
    const total = await db.get('SELECT COUNT(*) as count FROM artworks');
    const available = await db.get('SELECT COUNT(*) as count FROM artworks WHERE is_available = 1');
    const categories = await db.all(
      'SELECT category, COUNT(*) as count FROM artworks GROUP BY category'
    );
    
    return {
      total: total.count,
      available: available.count,
      categories: categories
    };
  }
}

export default ArtworkModel;

