const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { query }= require('../database/db');
const router   = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// POST /api/auth/demo — instant demo login
router.post('/demo', (req, res) => {
  const token = jwt.sign({ id: 1, email: 'demo@smartshop.ai' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
  res.json({ success: true, token, user: { id: 1, name: 'Demo User', email: 'demo@smartshop.ai' } });
});

module.exports = router;
