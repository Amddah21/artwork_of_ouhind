import express from 'express';
import { RatingModel } from '../models/rating.model.js';
import { LogModel } from '../models/log.model.js';

const router = express.Router();

// GET average rating for artwork
router.get('/artwork/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params;
    const ratingData = await RatingModel.getAverageForArtwork(artworkId);
    
    res.json({
      success: true,
      data: ratingData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET all ratings for artwork
router.get('/artwork/:artworkId/all', async (req, res) => {
  try {
    const { artworkId } = req.params;
    const ratings = await RatingModel.getByArtwork(artworkId);
    
    res.json({
      success: true,
      data: ratings,
      count: ratings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST new rating
router.post('/', async (req, res) => {
  try {
    const ratingData = {
      artworkId: parseInt(req.body.artworkId),
      rating: parseInt(req.body.rating),
      ipAddress: req.ip || req.connection.remoteAddress
    };
    
    // Validate rating
    if (ratingData.rating < 1 || ratingData.rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }
    
    const newRating = await RatingModel.create(ratingData);
    
    // Get updated average
    const averageData = await RatingModel.getAverageForArtwork(ratingData.artworkId);
    
    // Log the rating
    await LogModel.create({
      level: 'info',
      category: 'user',
      message: `New rating submitted for artwork ${ratingData.artworkId}`,
      details: { rating: ratingData.rating, artworkId: ratingData.artworkId }
    });
    
    res.status(201).json({
      success: true,
      data: {
        rating: newRating,
        average: averageData
      },
      message: 'Rating submitted successfully',
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'user',
      message: 'Failed to submit rating',
      details: { error: error.message }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
