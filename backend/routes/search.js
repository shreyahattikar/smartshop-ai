const express = require('express');
const multer  = require('multer');
const path    = require('path');
const router  = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are accepted'));
    cb(null, true);
  }
});

const { query } = require('../database/db');

// POST /api/search/text
router.post('/text', async (req, res) => {
  try {
    const { q } = req.body;
    if (!q) return res.status(400).json({ error: 'Search query is required' });
    const products = await query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR tags LIKE ? OR category LIKE ? ORDER BY rating DESC LIMIT 12',
      [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json({ success: true, data: products, query: q, resultCount: products.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// POST /api/search/image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    // In demo mode: return random products as "similar" results
    const products = await query('SELECT * FROM products ORDER BY RAND() LIMIT 6');

    res.json({
      success: true,
      data: products,
      message: 'Image received. Showing visually similar products from demo catalog.',
      disclaimer: 'Image recognition is in demo mode. Connect a vision API for real image search.',
      filename: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ error: 'Image search failed', details: err.message });
  }
});

// POST /api/search/voice
router.post('/voice', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: 'Voice transcript is required' });

    const products = await query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR tags LIKE ? OR category LIKE ? ORDER BY rating DESC LIMIT 8',
      [`%${transcript}%`, `%${transcript}%`, `%${transcript}%`, `%${transcript}%`]
    );

    res.json({
      success: true,
      data: products,
      transcript,
      message: `Showing results for: "${transcript}"`
    });
  } catch (err) {
    res.status(500).json({ error: 'Voice search failed', details: err.message });
  }
});

module.exports = router;
