/**
 * Shopping Assistant Orchestrator Agent
 * Routes user queries to appropriate specialist agents and combines results.
 */
const ragService = require('../services/ragService');
const aiService = require('../services/aiService');
const { query } = require('../database/db');

// Detect query intent
function detectIntent(message) {
  const msg = message.toLowerCase();
  if (msg.includes('compare') || msg.includes('vs') || msg.includes('versus') || msg.includes('difference between')) return 'compare';
  if (msg.includes('review') || msg.includes('feedback') || msg.includes('opinion') || msg.includes('rating')) return 'review';
  if (msg.includes('price') || msg.includes('cost') || msg.includes('deal') || msg.includes('discount') || msg.includes('drop')) return 'price';
  if (msg.includes('sustainable') || msg.includes('eco') || msg.includes('green') || msg.includes('environment')) return 'sustainability';
  if (msg.includes('alternative') || msg.includes('similar') || msg.includes('instead')) return 'alternative';
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best') || msg.includes('should i buy')) return 'recommend';
  if (msg.includes('find') || msg.includes('search') || msg.includes('show') || msg.includes('under ₹') || msg.includes('under rs')) return 'search';
  return 'general';
}

// Extract budget from message
function extractBudget(message) {
  const patterns = [
    /under\s*₹?\s*([\d,]+)/i,
    /below\s*₹?\s*([\d,]+)/i,
    /₹\s*([\d,]+)/i,
    /rs\.?\s*([\d,]+)/i,
    /budget\s*of\s*₹?\s*([\d,]+)/i
  ];
  for (const p of patterns) {
    const m = message.match(p);
    if (m) return parseInt(m[1].replace(/,/g, ''));
  }
  return null;
}

// Extract category
function extractCategory(message) {
  const msg = message.toLowerCase();
  const categoryMap = {
    'Laptops':      ['laptop', 'notebook', 'computer', 'macbook', 'chromebook'],
    'Smartphones':  ['phone', 'smartphone', 'mobile', 'iphone', 'android'],
    'Headphones':   ['headphone', 'earphone', 'earbuds', 'headset', 'airpods'],
    'Shoes':        ['shoes', 'shoe', 'sneaker', 'running', 'footwear'],
    'Backpacks':    ['backpack', 'bag', 'rucksack'],
    'Smartwatches': ['watch', 'smartwatch', 'wearable']
  };
  for (const [cat, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(k => msg.includes(k))) return cat;
  }
  return null;
}

// Main orchestration handler
async function handleQuery(message, conversationHistory = []) {
  const intent = detectIntent(message);
  const budget = extractBudget(message);
  const category = extractCategory(message);

  const filters = {};
  if (budget)   filters.maxPrice = budget;
  if (category) filters.category = category;

  // 1. Retrieve relevant products via RAG
  const products = await ragService.retrieveRelevantProducts(message, filters);
  const context  = ragService.buildContext(products, message);
  const prompt   = ragService.buildRAGPrompt(message, context);

  // 2. Generate AI response
  const aiResult = await aiService.generateResponse(prompt, message);

  // 3. Build suggestions
  const suggestions = getSuggestions(intent, category);

  return {
    message: aiResult.text,
    products: products.slice(0, 4),
    agentUsed: `${intent}-agent`,
    sources: products.length > 0 ? ['SmartShop AI Demo Catalog'] : [],
    suggestions,
    intent
  };
}

function getSuggestions(intent, category) {
  const baseSuggestions = [
    'Find the best laptop under ₹60,000',
    'Compare Samsung Galaxy S24 and OnePlus 12',
    'Best headphones for noise cancellation',
    'Sustainable products under ₹5,000',
    'Best budget smartwatch in India'
  ];

  const contextual = {
    search:        ['Show me affordable options', 'Filter by rating above 4', 'Sort by price'],
    compare:       ['Compare prices', 'Which has better battery?', 'Which is more sustainable?'],
    review:        ['Are reviews genuine?', 'What do users like most?', 'Common complaints?'],
    price:         ['Set price alert', 'Best time to buy?', 'Historical price trend'],
    sustainability: ['Most eco-friendly option', 'Recycled materials products', 'Sustainability score breakdown'],
    recommend:     ['Top rated this month', 'Best value for money', 'Popular in this category'],
    alternative:   ['Similar products from different brands', 'Cheaper alternatives', 'Higher-rated alternatives']
  };

  return contextual[intent] || baseSuggestions.slice(0, 3);
}

module.exports = { handleQuery, detectIntent, extractBudget, extractCategory };
