const express = require('express');
const shortid = require('shortid');
const { saveUrl } = require('../database');
const { generateQRCode } = require('../utils/qrcode');

const router = express.Router();

router.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // URL validation (basic)
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate short code
    const shortCode = shortid.generate();
    const baseUrl = process.env.BASE_URL || `http://${req.headers.host}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    // Save to database
    await saveUrl(originalUrl, shortCode);

    // Generate QR code
    const qrCode = await generateQRCode(shortUrl);

    res.json({
      originalUrl,
      shortUrl,
      shortCode,
      qrCode
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
