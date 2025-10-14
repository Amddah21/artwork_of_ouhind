import express from 'express';
import { ArtworkModel } from '../models/artwork.model.js';
import { LogModel } from '../models/log.model.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET all artworks
router.get('/', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      available: req.query.available === 'true' ? true : req.query.available === 'false' ? false : undefined
    };
    
    const artworks = await ArtworkModel.getAll(filters);
    
    // Log the request
    await LogModel.create({
      level: 'info',
      category: 'artwork',
      message: 'Artworks list retrieved',
      details: { count: artworks.length, filters }
    });
    
    // Update statistics
    await LogModel.updateStatistic('page_views');
    
    res.json({
      success: true,
      data: artworks,
      count: artworks.length
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'artwork',
      message: 'Failed to retrieve artworks',
      details: { error: error.message }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET single artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await ArtworkModel.getById(id);
    
    if (!artwork) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found',
      });
    }
    
    // Log artwork view
    await LogModel.create({
      level: 'info',
      category: 'artwork',
      message: `Artwork viewed: ${artwork.title}`,
      details: { artworkId: id }
    });
    
    // Update statistics
    await LogModel.updateStatistic('artwork_views');
    
    res.json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'artwork',
      message: 'Failed to retrieve artwork',
      details: { error: error.message, artworkId: req.params.id }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST create new artwork (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const artworkData = {
      title: req.body.title,
      description: req.body.description,
      year: parseInt(req.body.year),
      medium: req.body.medium,
      dimensions: req.body.dimensions,
      category: req.body.category,
      price: req.body.price ? parseFloat(req.body.price) : null,
      isAvailable: req.body.isAvailable === 'true' || req.body.isAvailable === true,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      story: req.body.story,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(t => t.trim())) : []
    };
    
    const newArtwork = await ArtworkModel.create(artworkData);
    
    // Log the creation
    await LogModel.create({
      level: 'success',
      category: 'artwork',
      message: `New artwork created: ${artworkData.title}`,
      details: { artworkId: newArtwork.id }
    });
    
    res.status(201).json({
      success: true,
      data: newArtwork,
      message: 'Artwork created successfully',
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'artwork',
      message: 'Failed to create artwork',
      details: { error: error.message }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT update artwork
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const artworkData = {
      title: req.body.title,
      description: req.body.description,
      year: parseInt(req.body.year),
      medium: req.body.medium,
      dimensions: req.body.dimensions,
      category: req.body.category,
      price: req.body.price ? parseFloat(req.body.price) : null,
      isAvailable: req.body.isAvailable === 'true' || req.body.isAvailable === true,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      story: req.body.story,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(t => t.trim())) : []
    };
    
    const updatedArtwork = await ArtworkModel.update(id, artworkData);
    
    if (!updatedArtwork) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found',
      });
    }
    
    // Log the update
    await LogModel.create({
      level: 'success',
      category: 'artwork',
      message: `Artwork updated: ${artworkData.title}`,
      details: { artworkId: id }
    });
    
    res.json({
      success: true,
      data: updatedArtwork,
      message: 'Artwork updated successfully',
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'artwork',
      message: 'Failed to update artwork',
      details: { error: error.message, artworkId: req.params.id }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE artwork
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get artwork before deleting for logging
    const artwork = await ArtworkModel.getById(id);
    
    if (!artwork) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found',
      });
    }
    
    await ArtworkModel.delete(id);
    
    // Log the deletion
    await LogModel.create({
      level: 'warning',
      category: 'artwork',
      message: `Artwork deleted: ${artwork.title}`,
      details: { artworkId: id }
    });
    
    res.json({
      success: true,
      message: 'Artwork deleted successfully',
    });
  } catch (error) {
    await LogModel.create({
      level: 'error',
      category: 'artwork',
      message: 'Failed to delete artwork',
      details: { error: error.message, artworkId: req.params.id }
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET artwork statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await ArtworkModel.getStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
