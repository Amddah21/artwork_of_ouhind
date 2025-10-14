import express from 'express';
import { ReviewModel } from '../models/review.model.js';
import { LogModel } from '../models/log.model.js';

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const filters = {
      artworkId: req.query.artworkId,
      approved: req.query.approved === 'true' ? true : req.query.approved === 'false' ? false : undefined
    };
    
    const reviews = await ReviewModel.getAll(filters);
    
    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET single review
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewModel.getById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }
    
    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST create new review
router.post('/', async (req, res) => {
  try {
    const reviewData = {
      artworkId: req.body.artworkId,
      name: req.body.name,
      email: req.body.email,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
      isApproved: false // Reviews need approval by default
    };
    
    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }
    
    const newReview = await ReviewModel.create(reviewData);
    
    // Log the creation
    await LogModel.create({
      level: 'info',
      category: 'user',
      message: `New review submitted by ${reviewData.name}`,
      details: { reviewId: newReview.id, artworkId: reviewData.artworkId }
    });
    
    res.status(201).json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully and is pending approval',
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'user',
      message: 'Failed to create review',
      details: { error: error.message }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH approve review
router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const approvedReview = await ReviewModel.approve(id);
    
    if (!approvedReview) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }
    
    // Log the approval
    await LogModel.create({
      level: 'success',
      category: 'user',
      message: `Review approved`,
      details: { reviewId: id }
    });
    
    res.json({
      success: true,
      data: approvedReview,
      message: 'Review approved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewModel.delete(id);
    
    // Log the deletion
    await LogModel.create({
      level: 'warning',
      category: 'user',
      message: `Review deleted`,
      details: { reviewId: id }
    });
    
    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
