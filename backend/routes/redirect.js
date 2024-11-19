const express = require('express');
const router = express.Router();
const connectToDb = require('../db');

// GET endpoint to redirect using the short code
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const db = await connectToDb();

    // Find the original URL for the given short code
    const url = await db.collection('urls').findOne({ shortCode });

    if (url) {
      // Redirect to the original URL
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
