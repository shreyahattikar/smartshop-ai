const { query } = require('../database/db');
const aiService = require('../services/aiService');

// GET /api/reviews?productId=X
async function getReviews(req, res) {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ error: 'productId is required' });
    const reviews = await query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY review_date DESC',
      [productId]
    );
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
}

// POST /api/reviews/analyze
async function analyzeReviews(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const reviews = await query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY review_date DESC',
      [productId]
    );

    if (reviews.length === 0) {
      return res.json({ success: true, data: { message: 'No reviews found for this product.' } });
    }

    // Basic stats
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / totalReviews;
    const positive = reviews.filter(r => r.rating >= 4).length;
    const negative = reviews.filter(r => r.rating <= 2).length;

    // Fake review heuristics
    const textLengths = reviews.map(r => r.review_text.length);
    const avgLen = textLengths.reduce((a, b) => a + b, 0) / textLengths.length;
    const veryShortReviews = reviews.filter(r => r.review_text.length < 20).length;
    const suspiciousRatio = veryShortReviews / totalReviews;

    // Check for duplicate text
    const texts = reviews.map(r => r.review_text.toLowerCase().trim());
    const uniqueTexts = new Set(texts).size;
    const duplicateRatio = 1 - uniqueTexts / texts.length;

    const suspiciousIndicators = [];
    if (suspiciousRatio > 0.3) suspiciousIndicators.push('High proportion of very short reviews');
    if (duplicateRatio > 0.1)  suspiciousIndicators.push('Some reviews appear very similar or identical');

    // AI summary (uses demo or real IBM Granite)
    const summary = await aiService.summarizeReviews(reviews, { productId });

    res.json({
      success: true,
      data: {
        totalReviews,
        avgRating: parseFloat(avgRating.toFixed(2)),
        positiveCount: positive,
        negativeCount: negative,
        neutralCount: totalReviews - positive - negative,
        positivePercent: Math.round((positive / totalReviews) * 100),
        negativePercent: Math.round((negative / totalReviews) * 100),
        suspiciousIndicators,
        hasSuspiciousPatterns: suspiciousIndicators.length > 0,
        disclaimer: 'Suspicious review indicators are estimates only and should not be treated as definitive proof.',
        summary,
        source: process.env.DEMO_MODE === 'true' ? 'demo-analysis' : 'ibm-granite'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Review analysis failed', details: err.message });
  }
}

module.exports = { getReviews, analyzeReviews };
