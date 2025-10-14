import express from 'express';
import { ContactModel } from '../models/contact.model.js';
import { LogModel } from '../models/log.model.js';

const router = express.Router();

// GET all contact messages
router.get('/', async (req, res) => {
  try {
    const filters = {
      isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined
    };
    
    const messages = await ContactModel.getAll(filters);
    
    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET single message
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactModel.getById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST new contact message
router.post('/', async (req, res) => {
  try {
    const messageData = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      phone: req.body.phone
    };
    
    // Basic validation
    if (!messageData.name || !messageData.email || !messageData.subject || !messageData.message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, subject, and message are required',
      });
    }
    
    const newMessage = await ContactModel.create(messageData);
    
    // Log the contact
    await LogModel.create({
      level: 'info',
      category: 'user',
      message: `New contact message from ${messageData.name}`,
      details: { messageId: newMessage.id, subject: messageData.subject }
    });
    
    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully',
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'user',
      message: 'Failed to send contact message',
      details: { error: error.message }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactModel.markAsRead(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    res.json({
      success: true,
      data: message,
      message: 'Message marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ContactModel.delete(id);
    
    // Log the deletion
    await LogModel.create({
      level: 'warning',
      category: 'user',
      message: `Contact message deleted`,
      details: { messageId: id }
    });
    
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
