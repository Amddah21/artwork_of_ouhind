import { getDatabase } from '../database/db.js';

export class LogModel {
  // Create log entry
  static async create(logData) {
    const db = await getDatabase();
    
    // Check if it's a mock database
    if (db.isMock) {
      console.log('Mock log entry created:', logData);
      return { id: Date.now(), ...logData };
    }
    
    const result = await db.run(
      `INSERT INTO activity_logs (level, category, message, details, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        logData.level,
        logData.category,
        logData.message,
        logData.details ? JSON.stringify(logData.details) : null,
        logData.ipAddress || null,
        logData.userAgent || null
      ]
    );
    
    return { id: result.lastID, ...logData };
  }

  // Get all logs
  static async getAll(filters = {}) {
    const db = await getDatabase();
    
    // Check if it's a mock database
    if (db.isMock) {
      console.log('Mock logs requested with filters:', filters);
      return [];
    }
    
    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    const params = [];
    
    if (filters.level) {
      query += ' AND level = ?';
      params.push(filters.level);
    }
    
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    
    if (filters.search) {
      query += ' AND (message LIKE ? OR category LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(filters.limit || 100);
    
    const logs = await db.all(query, params);
    
    // Parse details JSON
    return logs.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null
    }));
  }

  // Get statistics
  static async getStatistics() {
    const db = await getDatabase();
    
    // Check if it's a mock database
    if (db.isMock) {
      console.log('Mock statistics requested');
      return {
        totalVisits: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        artworkViews: 0,
        errorCount: 0,
        lastActivity: new Date()
      };
    }
    
    const stats = await db.get(`
      SELECT 
        (SELECT metric_value FROM site_statistics WHERE metric_name = 'total_visits') as totalVisits,
        (SELECT metric_value FROM site_statistics WHERE metric_name = 'unique_visitors') as uniqueVisitors,
        (SELECT metric_value FROM site_statistics WHERE metric_name = 'page_views') as pageViews,
        (SELECT metric_value FROM site_statistics WHERE metric_name = 'artwork_views') as artworkViews,
        (SELECT COUNT(*) FROM activity_logs WHERE level = 'error') as errorCount
    `);
    
    return {
      totalVisits: stats.totalVisits || 0,
      uniqueVisitors: stats.uniqueVisitors || 0,
      pageViews: stats.pageViews || 0,
      artworkViews: stats.artworkViews || 0,
      errorCount: stats.errorCount || 0,
      lastActivity: new Date()
    };
  }

  // Update site statistics
  static async updateStatistic(metricName, increment = 1) {
    const db = await getDatabase();
    
    // Check if it's a mock database
    if (db.isMock) {
      console.log(`Mock statistic updated: ${metricName} +${increment}`);
      return;
    }
    
    await db.run(
      `UPDATE site_statistics 
       SET metric_value = metric_value + ?, updated_at = CURRENT_TIMESTAMP 
       WHERE metric_name = ?`,
      [increment, metricName]
    );
  }
}

export default LogModel;

