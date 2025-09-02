const express = require('express');
const { getUrlByShortCode, incrementClicks } = require('../database');

const router = express.Router();

// Handle short URL redirects
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Get URL from database
    const urlData = await getUrlByShortCode(shortCode);

    if (!urlData) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>URL Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            h1 { color: #e74c3c; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404 - URL Not Found</h1>
            <p>The shortened URL you are looking for does not exist.</p>
            <a href="/">Go Home</a>
          </div>
        </body>
        </html>
      `);
    }

    // Increment click count
    await incrementClicks(shortCode);

    // Redirect to original URL
    res.redirect(urlData.original_url);

  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
