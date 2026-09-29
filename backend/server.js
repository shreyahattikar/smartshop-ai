require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// Uploads directory
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/products',    require('./routes/products'));
app.use('/api/ai',          require('./routes/ai'));
app.use('/api/search',      require('./routes/search'));
app.use('/api/reviews',     require('./routes/reviews'));
app.use('/api/price-alerts',require('./routes/priceAlerts'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/wishlist',    require('./routes/wishlist'));
app.use('/api/auth',        require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'live',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 SmartShop AI Backend running on http://localhost:${PORT}`);
  console.log(`📦 Mode: ${process.env.DEMO_MODE === 'true' ? 'DEMO' : 'LIVE'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'smartshop_ai'} @ ${process.env.DB_HOST || 'localhost'}\n`);
});

module.exports = app;
