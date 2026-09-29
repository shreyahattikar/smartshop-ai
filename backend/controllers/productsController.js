const { query } = require('../database/db');

// GET /api/products
async function getProducts(req, res) {
  try {
    const {
      category, brand, marketplace,
      minPrice, maxPrice,
      minRating, minSustainability,
      minDiscount,
      sortBy = 'id', sortOrder = 'ASC',
      page = 1, limit = 20,
      search
    } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category)         { sql += ' AND category = ?';            params.push(category); }
    if (brand)            { sql += ' AND brand = ?';               params.push(brand); }
    if (marketplace)      { sql += ' AND marketplace = ?';         params.push(marketplace); }
    if (minPrice)         { sql += ' AND price >= ?';              params.push(parseFloat(minPrice)); }
    if (maxPrice)         { sql += ' AND price <= ?';              params.push(parseFloat(maxPrice)); }
    if (minRating)        { sql += ' AND rating >= ?';             params.push(parseFloat(minRating)); }
    if (minSustainability){ sql += ' AND sustainability_score >= ?'; params.push(parseInt(minSustainability)); }
    if (minDiscount)      { sql += ' AND discount_percent >= ?';   params.push(parseInt(minDiscount)); }

    const allowedSort = ['price', 'rating', 'discount_percent', 'sustainability_score', 'review_count', 'id'];
    const col = allowedSort.includes(sortBy) ? sortBy : 'id';
    const dir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${col} ${dir}`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const products = await query(sql, params);
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const [product] = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
}

// GET /api/products/:id/price-history
async function getPriceHistory(req, res) {
  try {
    const rows = await query(
      'SELECT recorded_price, recorded_at FROM price_history WHERE product_id = ? ORDER BY recorded_at ASC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price history', details: err.message });
  }
}

// GET /api/products/categories
async function getCategories(req, res) {
  try {
    const rows = await query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json({ success: true, data: rows.map(r => r.category) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
}

// POST /api/products/compare
async function compareProducts(req, res) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length < 2) {
      return res.status(400).json({ error: 'Provide at least 2 product IDs to compare' });
    }
    const placeholders = ids.map(() => '?').join(',');
    const products = await query(`SELECT * FROM products WHERE id IN (${placeholders})`, ids);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ error: 'Comparison failed', details: err.message });
  }
}

// GET /api/recommendations
async function getRecommendations(req, res) {
  try {
    const { category, maxPrice, excludeId } = req.query;
    let sql = 'SELECT * FROM products WHERE rating >= 4.0';
    const params = [];
    if (category)  { sql += ' AND category = ?'; params.push(category); }
    if (maxPrice)  { sql += ' AND price <= ?';   params.push(parseFloat(maxPrice)); }
    if (excludeId) { sql += ' AND id != ?';       params.push(parseInt(excludeId)); }
    sql += ' ORDER BY rating DESC, review_count DESC LIMIT 6';
    const products = await query(sql, params);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations', details: err.message });
  }
}

module.exports = { getProducts, getProductById, getPriceHistory, getCategories, compareProducts, getRecommendations };
