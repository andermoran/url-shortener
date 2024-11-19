const express = require('express');
const dotenv = require('dotenv');
const shortenRoute = require('./routes/shorten'); // Shorten route
const redirectRoute = require('./routes/redirect'); // Redirect route

dotenv.config(); // Load environment variables
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/shorten', shortenRoute); // Handle shortening URLs
app.use('/', redirectRoute); // Handle redirection for short URLs

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
