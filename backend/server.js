const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Add CORS for cross-origin requests
const shortenRoute = require('./routes/shorten'); // Shorten route
const redirectRoute = require('./routes/redirect'); // Redirect route

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests (required for frontend-backend communication)
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/shorten', shortenRoute); // Handle shortening URLs
app.use('/', redirectRoute); // Handle redirection for short URLs

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
