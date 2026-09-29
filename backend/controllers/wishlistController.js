const { query } = require('../database/db');

// GET /api/wishlist
async function getWishlist(req, res) {
  try {
    const userId = req.query.userId || 1;
    const items = await query(`
      SELECT w.id, w.added_at, p.*
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.added_at DESC
    `, [userId]);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load wishlist', details: err.message });
  }
}

// POST /api/wishlist
async function addToWishlist(req, res) {
  try {
    const { userId = 1, productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    await query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist', details: err.message });
  }
}

// DELETE /api/wishlist/:productId
async function removeFromWishlist(req, res) {
  try {
    const userId = req.query.userId || 1;
    await query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, req.params.productId]
    );
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist', details: err.message });
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
