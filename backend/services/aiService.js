/**
 * AI Service - IBM Granite / watsonx.ai Integration Layer
 * Falls back to demo responses when DEMO_MODE=true or API not configured.
 */
const axios = require('axios');

const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.WATSONX_API_KEY;

// ── IBM watsonx.ai token cache ────────────────────────────────
let ibmToken = null;
let ibmTokenExpiry = 0;

async function getIBMToken() {
  if (ibmToken && Date.now() < ibmTokenExpiry) return ibmToken;
  try {
    const resp = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({ grant_type: 'urn:ibm:params:oauth:grant-type:apikey', apikey: process.env.WATSONX_API_KEY }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    ibmToken = resp.data.access_token;
    ibmTokenExpiry = Date.now() + (resp.data.expires_in - 300) * 1000;
    return ibmToken;
  } catch (err) {
    console.error('[IBM Auth Error]', err.message);
    return null;
  }
}

async function callGranite(prompt, maxTokens = 512) {
  if (DEMO_MODE) return null;
  try {
    const token = await getIBMToken();
    if (!token) return null;

    const resp = await axios.post(
      `${process.env.WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
      {
        model_id: process.env.GRANITE_MODEL_ID || 'ibm/granite-13b-chat-v2',
        input: prompt,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: maxTokens,
          temperature: 0.7,
          repetition_penalty: 1.1
        },
        project_id: process.env.WATSONX_PROJECT_ID
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    return resp.data?.results?.[0]?.generated_text || null;
  } catch (err) {
    console.error('[Granite Error]', err.message);
    return null;
  }
}

// ── Demo response bank ─────────────────────────────────────────
const demoResponses = {
  laptop: `Based on your requirements, here are my top recommendations:

**1. MacBook Air M3 (₹1,14,900)** — Best for battery life and silent operation. Perfect for students and professionals needing 18+ hours on the go.

**2. Lenovo IdeaPad Slim 5 (₹54,990)** — Best budget option with AMD Ryzen 5, solid performance for coding and everyday use.

**3. ASUS VivoBook 16X (₹74,990)** — Great 16" display with AMD Ryzen 7, ideal if you need a larger screen.

*Note: Prices are from demo data. Please verify current prices on the respective marketplaces.*`,

  smartphone: `Here are the best smartphones matching your needs:

**1. OnePlus 12 (₹64,999)** — Exceptional camera with Hasselblad tuning, 100W charging, flagship Snapdragon 8 Gen 3.

**2. Samsung Galaxy S24 Ultra (₹1,24,999)** — Best-in-class 200MP camera system with S-Pen. For power users only.

**3. Redmi Note 13 Pro+ (₹29,999)** — Best value for money with 200MP camera at mid-range price.

*Recommendations are based on demo data and public specifications.*`,

  headphones: `Top headphone picks for you:

**1. Sony WH-1000XM5 (₹26,990)** — Industry-leading ANC, 30-hour battery. Ideal for work and travel.

**2. Apple AirPods Pro 2 (₹26,900)** — Best choice for iPhone users with adaptive transparency.

**3. boAt Rockerz 550 (₹1,499)** — Best budget option with 20-hour battery at an unbeatable price.`,

  budget: `For budget-conscious shopping, I recommend focusing on:

- **Redmi Note 13 Pro+** — Best smartphone under ₹30,000
- **Campus OFC Running Shoes** — Best shoes under ₹2,000  
- **boAt Wave Sigma** — Best smartwatch under ₹2,000
- **Lenovo IdeaPad Slim 5** — Best laptop under ₹60,000
- **boAt Rockerz 550** — Best headphones under ₹2,000

*Demo mode: Prices shown are sample data.*`,

  default: `I'm SmartShop AI, your intelligent shopping assistant! I can help you:

• 🔍 **Find products** matching your budget and requirements
• ⚖️ **Compare** multiple products side by side
• 📊 **Analyze reviews** to identify genuine feedback
• 💰 **Track prices** and alert you about drops
• 🌿 **Discover sustainable** product alternatives

Try asking: "Find the best laptop under ₹60,000" or "Compare Samsung Galaxy S24 with OnePlus 12"`
};

function getDemoResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('laptop') || msg.includes('computer') || msg.includes('notebook')) return demoResponses.laptop;
  if (msg.includes('phone') || msg.includes('smartphone') || msg.includes('mobile')) return demoResponses.smartphone;
  if (msg.includes('headphone') || msg.includes('earphone') || msg.includes('audio')) return demoResponses.headphones;
  if (msg.includes('budget') || msg.includes('cheap') || msg.includes('affordable') || msg.includes('under ₹')) return demoResponses.budget;
  return demoResponses.default;
}

// ── Public API ────────────────────────────────────────────────
async function generateResponse(prompt, userMessage) {
  const graniteResponse = await callGranite(prompt);
  if (graniteResponse) return { text: graniteResponse, source: 'ibm-granite' };
  return { text: getDemoResponse(userMessage), source: 'demo' };
}

async function summarizeReviews(reviews, context) {
  const reviewTexts = reviews.slice(0, 10).map(r => `[${r.rating}★] ${r.review_text}`).join('\n');
  const prompt = `Summarize these product reviews concisely. Identify main pros and cons.\nReviews:\n${reviewTexts}\n\nSummary:`;

  const granite = await callGranite(prompt, 256);
  if (granite) return { text: granite, source: 'ibm-granite' };

  const posReviews = reviews.filter(r => r.rating >= 4);
  const negReviews = reviews.filter(r => r.rating <= 2);
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return {
    text: `Average rating: ${avgRating}/5 based on ${reviews.length} reviews. ${posReviews.length} positive reviews highlight good value and performance. ${negReviews.length} critical review(s) mention areas for improvement.`,
    pros: ['Good overall performance', 'Value for money', 'Good build quality'],
    cons: negReviews.length > 0 ? ['Some users report minor issues'] : [],
    source: 'demo-analysis'
  };
}

async function compareProducts(products, userPriorities) {
  const prompt = `Compare these products and explain key differences:\n${products.map(p => `${p.name}: ₹${p.price}, Rating: ${p.rating}`).join('\n')}\nUser priorities: ${userPriorities.join(', ')}\n\nComparison:`;

  const granite = await callGranite(prompt, 400);
  if (granite) return { text: granite, source: 'ibm-granite' };

  // Demo comparison
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  const cheapest = [...products].sort((a, b) => a.price - b.price)[0];

  return {
    text: `**${sorted[0].name}** has the highest rating (${sorted[0].rating}★). **${cheapest.name}** offers the best value at ₹${cheapest.price.toLocaleString('en-IN')}. The choice depends on your priorities between performance and budget.`,
    highlights: products.map(p => ({
      id: p.id,
      name: p.name,
      pros: [`Rating: ${p.rating}★`, `Price: ₹${p.price.toLocaleString('en-IN')}`],
      cons: []
    })),
    source: 'demo-comparison',
    disclaimer: 'This comparison is AI-generated and based on available demo data. Verify specifications before purchase.'
  };
}

async function analyzePriceTrend({ productId, currentPrice, priceHistory, targetPrice }) {
  if (!priceHistory || priceHistory.length < 2) {
    return {
      text: 'Insufficient price history to determine a reliable trend.',
      trend: 'unknown',
      source: 'demo'
    };
  }

  const prices = priceHistory.map(h => h.recorded_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const firstPrice = prices[0];
  const trend = currentPrice < firstPrice ? 'declining' : currentPrice > firstPrice ? 'rising' : 'stable';

  let advice = '';
  if (targetPrice && currentPrice <= targetPrice) {
    advice = `✅ Great news! The current price (₹${currentPrice.toLocaleString('en-IN')}) is at or below your target of ₹${targetPrice.toLocaleString('en-IN')}.`;
  } else if (targetPrice) {
    advice = `📉 Price hasn't reached your target of ₹${targetPrice.toLocaleString('en-IN')} yet. We'll alert you when it does.`;
  }

  return {
    text: `Price trend is **${trend}**. Historical range: ₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}. ${advice}`,
    trend,
    minPrice,
    maxPrice,
    advice,
    disclaimer: 'Price forecasts are estimates only. Future prices cannot be guaranteed.',
    source: 'demo-price-analysis'
  };
}

module.exports = { generateResponse, summarizeReviews, compareProducts, analyzePriceTrend };
