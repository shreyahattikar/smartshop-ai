const { query } = require('../database/db');

// GET /api/dashboard
async function getDashboard(req, res) {
  try {
    const userId = req.query.userId || 1; // demo user

    // Wishlist count
    const [{ wishlistCount }] = await query(
      'SELECT COUNT(*) as wishlistCount FROM wishlist WHERE user_id = ?', [userId]
    );

    // Active price alerts
    const [{ alertCount }] = await query(
      'SELECT COUNT(*) as alertCount FROM price_alerts WHERE user_id = ? AND status = "active"', [userId]
    );

    // Trending products (highest rated with most reviews)
    const trending = await query(
      'SELECT id, name, category, price, rating, review_count, discount_percent, image_url, sustainability_score FROM products ORDER BY (rating * review_count) DESC LIMIT 6'
    );

    // Category distribution
    const categories = await query(
      'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC'
    );

    // Recent price drops (products with discount > 15%)
    const priceDrops = await query(
      'SELECT id, name, price, original_price, discount_percent, image_url FROM products WHERE discount_percent >= 15 ORDER BY discount_percent DESC LIMIT 5'
    );

    // Top sustainable products
    const sustainable = await query(
      'SELECT id, name, category, price, sustainability_score, rating FROM products WHERE sustainability_score >= 60 ORDER BY sustainability_score DESC LIMIT 4'
    );

    res.json({
      success: true,
      data: {
        overview: {
          wishlistCount,
          alertCount,
          savedComparisons: 2,  // demo value
          totalProductsTracked: 8
        },
        trending,
        categories,
        priceDrops,
        sustainable,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard', details: err.message });
  }
}

module.exports = { getDashboard };
