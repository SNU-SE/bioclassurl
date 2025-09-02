const express = require('express');
const cors = require('cors');
const path = require('path');
const shortenRoute = require('./routes/shorten');
const redirectRoute = require('./routes/redirect');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (must be before other routes)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'URL Shortener is running' });
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Routes
app.use('/', redirectRoute);
app.use('/', shortenRoute);

// Start server
app.listen(PORT, () => {
  console.log(`URL Shortener server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
