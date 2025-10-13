import express from 'express';

const router = express.Router();

// POST general contact message
router.post('/', async (req, res) => {
  try {
    const contactData = req.body;
    
    // Validation
    if (!contactData.name || !contactData.email || !contactData.message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required',
      });
    }
    
    // TODO: Send email or save to database
    console.log('Contact form submission:', contactData);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST artwork inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const inquiryData = req.body;
    
    // Validation
    if (!inquiryData.artworkId || !inquiryData.email) {
      return res.status(400).json({
        success: false,
        error: 'Artwork ID and email are required',
      });
    }
    
    // TODO: Send email notification
    console.log('Artwork inquiry:', inquiryData);
    
    res.json({
      success: true,
      message: 'Inquiry sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST purchase request
router.post('/purchase', async (req, res) => {
  try {
    const purchaseData = req.body;
    
    // Validation
    if (!purchaseData.artworkId || !purchaseData.email || !purchaseData.name) {
      return res.status(400).json({
        success: false,
        error: 'Artwork ID, email, and name are required',
      });
    }
    
    // TODO: Process purchase request, send notifications
    console.log('Purchase request:', purchaseData);
    
    res.json({
      success: true,
      message: 'Purchase request received successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

