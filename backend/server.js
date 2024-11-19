const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const shortenRoute = require('./routes/shorten');
const redirectRoute = require('./routes/redirect');

dotenv.config();

const app = express();

// Define allowed origins for local and production environments
const allowedOrigins = [
  'http://localhost:3000', // Local
  'https://url-shortener-ecru-seven.vercel.app' // Production
];

// Configure CORS dynamically
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/shorten', shortenRoute);
app.use('/', redirectRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
