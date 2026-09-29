/**
 * RAG Service - Retrieval-Augmented Generation
 * Retrieves relevant product data before passing to IBM Granite
 */
const { query } = require('../database/db');

// Retrieve relevant products based on query intent
async function retrieveRelevantProducts(userQuery, filters = {}) {
  try {
    const keywords = extractKeywords(userQuery);
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Keyword-based retrieval
    if (keywords.length > 0) {
      const kClauses = keywords.map(() => '(name LIKE ? OR description LIKE ? OR category LIKE ? OR tags LIKE ?)').join(' OR ');
      sql += ` AND (${kClauses})`;
      keywords.forEach(k => params.push(`%${k}%`, `%${k}%`, `%${k}%`, `%${k}%`));
    }

    // Budget filter
    if (filters.maxPrice) {
      sql += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    // Category filter
    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    sql += ' ORDER BY rating DESC LIMIT 6';
    const products = await query(sql, params);
    return products;
  } catch (err) {
    console.error('[RAG Retrieve Error]', err.message);
    return [];
  }
}

// Build a context document from retrieved products
function buildContext(products, userQuery) {
  if (products.length === 0) {
    return 'No specific products found in the catalog for this query.';
  }

  const productContext = products.map(p => {
    const specs = typeof p.specifications === 'string'
      ? JSON.parse(p.specifications || '{}')
      : (p.specifications || {});
    return `Product: ${p.name} | Category: ${p.category} | Price: ₹${p.price} | Rating: ${p.rating}/5 | Brand: ${p.brand} | Sustainability Score: ${p.sustainability_score}/100 | Key Specs: ${JSON.stringify(specs)}`;
  }).join('\n');

  return `[Retrieved from SmartShop AI Demo Catalog]\n${productContext}`;
}

// Build a full RAG prompt
function buildRAGPrompt(userQuery, context) {
  return `You are SmartShop AI, an intelligent shopping assistant. Use the following product information to answer the user's question accurately.

PRODUCT CATALOG (Demo Data):
${context}

USER QUERY: ${userQuery}

INSTRUCTIONS:
- Only recommend products from the catalog above
- Mention prices and ratings accurately
- If the query cannot be answered from the catalog, say so honestly
- Always add: "Note: This is demo data. Please verify prices before purchase."
- Be concise and helpful

RESPONSE:`;
}

// Simple keyword extraction
function extractKeywords(text) {
  const stopWords = new Set(['a','an','the','is','in','on','for','and','or','with','that','this','me','my','i','find','get','best','good','under','below','above','want','need']);
  return text
    .toLowerCase()
    .replace(/[₹,\.!?]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))
    .slice(0, 8);
}

module.exports = { retrieveRelevantProducts, buildContext, buildRAGPrompt };
