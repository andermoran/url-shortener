const express = require('express');
const router = express.Router(); // Create a new router instance
const connectToDb = require('../db'); // Adjust the path if necessary


router.post('/', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !/^https?:\/\/.+/.test(originalUrl)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const db = await connectToDb();

    let shortCode;
    let isUnique = false;

    // Retry until a unique short code is generated
    while (!isUnique) {
      shortCode = Math.random().toString(36).substring(2, 8);

      try {
        // Attempt to insert the new short code
        await db.collection('urls').insertOne({
          originalUrl,
          shortCode,
          createdAt: new Date(),
        });
        isUnique = true; // If successful, exit the loop
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key error, try again
          console.log('Duplicate short code detected, retrying...');
        } else {
          // Other errors
          throw err;
        }
      }
    }

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.status(200).json({ originalUrl, shortUrl, shortCode });
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router; // Export the router