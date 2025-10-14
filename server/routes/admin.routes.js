import express from 'express';
import { LogModel } from '../models/log.model.js';
import { ArtworkModel } from '../models/artwork.model.js';
import { ReviewModel } from '../models/review.model.js';
import { ContactModel } from '../models/contact.model.js';

const router = express.Router();

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await LogModel.getStatistics();
    const artworkStats = await ArtworkModel.getStatistics();
    
    res.json({
      success: true,
      data: {
        ...stats,
        artworks: artworkStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET activity logs
router.get('/logs', async (req, res) => {
  try {
    const filters = {
      level: req.query.level,
      category: req.query.category,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };
    
    const logs = await LogModel.getAll(filters);
    
    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET pending reviews
router.get('/reviews/pending', async (req, res) => {
  try {
    const pendingReviews = await ReviewModel.getAll({ approved: false });
    
    res.json({
      success: true,
      data: pendingReviews,
      count: pendingReviews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET unread messages
router.get('/messages/unread', async (req, res) => {
  try {
    const unreadMessages = await ContactModel.getAll({ isRead: false });
    
    res.json({
      success: true,
      data: unreadMessages,
      count: unreadMessages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST manual log entry (for testing)
router.post('/logs', async (req, res) => {
  try {
    const logData = {
      level: req.body.level || 'info',
      category: req.body.category || 'system',
      message: req.body.message,
      details: req.body.details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };
    
    const newLog = await LogModel.create(logData);
    
    res.status(201).json({
      success: true,
      data: newLog,
      message: 'Log entry created',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Dashboard overview
router.get('/overview', async (req, res) => {
  try {
    const stats = await LogModel.getStatistics();
    const artworkStats = await ArtworkModel.getStatistics();
    const pendingReviews = await ReviewModel.getAll({ approved: false });
    const unreadMessages = await ContactModel.getAll({ isRead: false });
    const recentLogs = await LogModel.getAll({ limit: 10 });
    
    res.json({
      success: true,
      data: {
        statistics: stats,
        artworks: artworkStats,
        pendingReviewsCount: pendingReviews.length,
        unreadMessagesCount: unreadMessages.length,
        recentActivity: recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
