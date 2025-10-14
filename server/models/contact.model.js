import { getDatabase } from '../database/db.js';

export class ContactModel {
  // Get all messages
  static async getAll(filters = {}) {
    const db = await getDatabase();
    let query = 'SELECT * FROM contact_messages';
    const params = [];
    
    if (filters.isRead !== undefined) {
      query += ' WHERE is_read = ?';
      params.push(filters.isRead ? 1 : 0);
    }
    
    query += ' ORDER BY created_at DESC';
    
    return await db.all(query, params);
  }

  // Get message by ID
  static async getById(id) {
    const db = await getDatabase();
    return await db.get('SELECT * FROM contact_messages WHERE id = ?', [id]);
  }

  // Create new message
  static async create(messageData) {
    const db = await getDatabase();
    
    const result = await db.run(
      `INSERT INTO contact_messages (name, email, subject, message, phone, is_read)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        messageData.name,
        messageData.email,
        messageData.subject,
        messageData.message,
        messageData.phone || null,
        0
      ]
    );
    
    return this.getById(result.lastID);
  }

  // Mark as read
  static async markAsRead(id) {
    const db = await getDatabase();
    await db.run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
    return this.getById(id);
  }

  // Delete message
  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM contact_messages WHERE id = ?', [id]);
    return true;
  }
}

export default ContactModel;

