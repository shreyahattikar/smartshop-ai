const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/aiService');
const ragService = require('../services/ragService');
const orchestrator = require('../agents/orchestrator');

// POST /api/ai/chat
async function chat(req, res) {
  try {
    const { message, sessionId, conversationHistory = [] } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const sid = sessionId || uuidv4();

    // Run through orchestrator agent
    const result = await orchestrator.handleQuery(message.trim(), conversationHistory);

    res.json({
      success: true,
      sessionId: sid,
      data: {
        role: 'assistant',
        message: result.message,
        products: result.products || [],
        agentUsed: result.agentUsed || 'orchestrator',
        sources: result.sources || [],
        suggestions: result.suggestions || [],
        source: process.env.DEMO_MODE === 'true' ? 'demo-mode' : 'ibm-granite',
        disclaimer: process.env.DEMO_MODE === 'true'
          ? 'Running in demo mode. Connect IBM watsonx.ai for live AI responses.'
          : 'Powered by IBM Granite. Responses are AI-generated and may contain errors.'
      }
    });
  } catch (err) {
    console.error('[Chat Error]', err.message);
    res.status(500).json({
      error: 'AI assistant encountered an error.',
      fallback: 'I apologize, I am unable to process your request right now. Please try again.'
    });
  }
}

// POST /api/ai/compare-summary
async function compareSummary(req, res) {
  try {
    const { products, userPriorities = [] } = req.body;
    if (!Array.isArray(products) || products.length < 2) {
      return res.status(400).json({ error: 'Provide at least 2 products for comparison' });
    }
    const summary = await aiService.compareProducts(products, userPriorities);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ error: 'Comparison summary failed', details: err.message });
  }
}

// POST /api/ai/price-insight
async function priceInsight(req, res) {
  try {
    const { productId, currentPrice, priceHistory, targetPrice } = req.body;
    const insight = await aiService.analyzePriceTrend({ productId, currentPrice, priceHistory, targetPrice });
    res.json({ success: true, data: insight });
  } catch (err) {
    res.status(500).json({ error: 'Price insight failed', details: err.message });
  }
}

module.exports = { chat, compareSummary, priceInsight };
