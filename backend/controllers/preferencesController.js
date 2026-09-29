const { query } = require('../database/db');

// GET /api/preferences
async function getPreferences(req, res) {
  try {
    const userId = req.query.userId || 1;
    const [prefs] = await query('SELECT * FROM shopping_preferences WHERE user_id = ?', [userId]);
    if (!prefs) {
      return res.json({ success: true, data: {
        preferred_categories: [],
        budget_min: 0, budget_max: 100000,
        preferred_brands: [],
        sustainability_preference: 'medium',
        urgency: 'medium'
      }});
    }
    res.json({ success: true, data: prefs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load preferences', details: err.message });
  }
}

// PUT /api/preferences
async function updatePreferences(req, res) {
  try {
    const userId = req.body.userId || 1;
    const {
      preferred_categories, budget_min, budget_max,
      preferred_brands, sustainability_preference, urgency
    } = req.body;

    await query(`
      INSERT INTO shopping_preferences (user_id, preferred_categories, budget_min, budget_max, preferred_brands, sustainability_preference, urgency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        preferred_categories = VALUES(preferred_categories),
        budget_min = VALUES(budget_min),
        budget_max = VALUES(budget_max),
        preferred_brands = VALUES(preferred_brands),
        sustainability_preference = VALUES(sustainability_preference),
        urgency = VALUES(urgency)
    `, [
      userId,
      JSON.stringify(preferred_categories || []),
      budget_min || 0,
      budget_max || 100000,
      JSON.stringify(preferred_brands || []),
      sustainability_preference || 'medium',
      urgency || 'medium'
    ]);

    res.json({ success: true, message: 'Preferences updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update preferences', details: err.message });
  }
}

module.exports = { getPreferences, updatePreferences };
