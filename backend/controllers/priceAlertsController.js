const { query } = require('../database/db');

// GET /api/price-alerts
async function getPriceAlerts(req, res) {
  try {
    const userId = req.query.userId || 1;
    const alerts = await query(`
      SELECT pa.*, p.name, p.price as current_price, p.image_url
      FROM price_alerts pa
      JOIN products p ON pa.product_id = p.id
      WHERE pa.user_id = ?
      ORDER BY pa.created_at DESC
    `, [userId]);
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts', details: err.message });
  }
}

// POST /api/price-alerts
async function createPriceAlert(req, res) {
  try {
    const { userId = 1, productId, targetPrice } = req.body;
    if (!productId || !targetPrice) {
      return res.status(400).json({ error: 'productId and targetPrice are required' });
    }
    if (parseFloat(targetPrice) <= 0) {
      return res.status(400).json({ error: 'Target price must be positive' });
    }
    await query(
      'INSERT INTO price_alerts (user_id, product_id, target_price) VALUES (?, ?, ?)',
      [userId, productId, parseFloat(targetPrice)]
    );
    res.json({ success: true, message: `Price alert set for ₹${targetPrice}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert', details: err.message });
  }
}

// DELETE /api/price-alerts/:id
async function deletePriceAlert(req, res) {
  try {
    await query('DELETE FROM price_alerts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Alert removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete alert', details: err.message });
  }
}

module.exports = { getPriceAlerts, createPriceAlert, deletePriceAlert };
