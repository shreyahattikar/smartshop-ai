import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_PRODUCTS, formatPrice } from '../data/demoData';
import ProductCard from '../components/ProductCard';
import { v4 as uuidv4 } from 'uuid';

// ── Demo AI responses ─────────────────────────────────────────
function generateDemoResponse(message) {
  const msg = message.toLowerCase();
  let text = '';
  let products = [];

  if (msg.includes('laptop') || msg.includes('notebook')) {
    text = `🤖 **SmartShop AI (Demo Mode)**\n\nBased on your laptop query, here are my top recommendations:\n\n**Best Overall:** MacBook Air M3 (₹1,14,900) — 18h battery, fanless, Apple M3 chip. Ideal for students and professionals.\n\n**Best Value:** Lenovo IdeaPad Slim 5 (₹54,990) — AMD Ryzen 5, 12h battery. Great for programming and everyday use.\n\n**For Creators:** Dell XPS 15 (₹1,59,990) — OLED display + RTX 4060. Best for video editing and design.\n\n💡 *Tip: Set a price alert to get notified when prices drop.*\n\n⚠️ *Note: Demo data only. Verify prices before purchase.*`;
    products = DEMO_PRODUCTS.filter(p => p.category === 'Laptops').slice(0, 3);
  } else if (msg.includes('phone') || msg.includes('smartphone') || msg.includes('mobile')) {
    text = `🤖 **SmartShop AI (Demo Mode)**\n\nHere are the best smartphones matching your query:\n\n**Best Camera:** Samsung Galaxy S24 Ultra (₹1,24,999) — 200MP camera system with S-Pen.\n\n**Best Value Flagship:** OnePlus 12 (₹64,999) — Hasselblad cameras + 100W charging.\n\n**Budget Pick:** Redmi Note 13 Pro+ (₹29,999) — 200MP camera at a mid-range price!\n\n💡 *Use the Compare page to compare these phones side-by-side.*`;
    products = DEMO_PRODUCTS.filter(p => p.category === 'Smartphones').slice(0, 3);
  } else if (msg.includes('headphone') || msg.includes('earphone') || msg.includes('audio')) {
    text = `🤖 **SmartShop AI (Demo Mode)**\n\nTop headphone picks for you:\n\n**Best ANC:** Sony WH-1000XM5 (₹26,990) — Industry-leading noise cancellation, 30h battery. 23% discount!\n\n**Best for iPhone:** Apple AirPods Pro 2 (₹26,900) — Adaptive ANC + Spatial Audio.\n\n**Best Budget:** boAt Rockerz 550 (₹1,499) — 57% off! Great for casual everyday use.`;
    products = DEMO_PRODUCTS.filter(p => p.category === 'Headphones').slice(0, 3);
  } else if (msg.includes('compare')) {
    text = `🤖 I can help you compare products!\n\nTo compare, visit the **Compare page** and add products you want to compare. I'll generate an AI comparison summary.\n\nYou can also ask me something like:\n• "Compare Samsung Galaxy S24 Ultra vs iPhone 15 Pro"\n• "Compare MacBook Air M3 and Dell XPS 15"`;
    products = [];
  } else if (msg.includes('budget') || msg.includes('cheap') || msg.includes('affordable') || msg.includes('under ₹') || msg.includes('under rs')) {
    const budget = message.match(/[\d,]+/);
    const budgetVal = budget ? parseInt(budget[0].replace(/,/g,'')) : 30000;
    text = `🤖 **Budget Shopping Picks (Demo Mode)**\n\nBest products under ₹${budgetVal.toLocaleString('en-IN')}:\n\n**Smartphone:** Redmi Note 13 Pro+ (₹29,999) — Best value mid-ranger.\n**Headphones:** boAt Rockerz 550 (₹1,499) — 57% discount!\n**Smartwatch:** boAt Wave Sigma (₹1,799) — SpO2, 7-day battery.\n**Shoes:** Campus OFC Running (₹1,499) — 40% off.`;
    products = DEMO_PRODUCTS.filter(p => p.price <= budgetVal).sort((a,b) => b.rating - a.rating).slice(0, 4);
  } else if (msg.includes('sustainable') || msg.includes('eco') || msg.includes('green')) {
    text = `🌿 **Sustainable Shopping (Demo Mode)**\n\nTop eco-friendly products in our catalog:\n\n**MacBook Air M3** — Score: 80/100. Apple's carbon-neutral initiatives.\n**Sennheiser Momentum 4** — Score: 74/100. Recyclable packaging.\n**Sony WH-1000XM5** — Score: 78/100. Responsible sourcing.\n\nVisit the **Sustainability Insights** page for detailed environmental scores.`;
    products = DEMO_PRODUCTS.sort((a,b) => b.sustainability_score - a.sustainability_score).slice(0, 3);
  } else if (msg.includes('watch') || msg.includes('smartwatch')) {
    text = `🤖 **Smartwatch Recommendations (Demo Mode)**\n\n**Premium:** Apple Watch Series 9 (₹41,900) — ECG, Blood O2, Double-tap gesture. Best iOS integration.\n\n**Android:** Samsung Galaxy Watch 6 (₹29,999) — BIA body composition + advanced sleep tracking.\n\n**Budget:** boAt Wave Sigma (₹1,799) — 64% off! Good starter smartwatch.`;
    products = DEMO_PRODUCTS.filter(p => p.category === 'Smartwatches');
  } else if (msg.includes('price') || msg.includes('discount') || msg.includes('deal') || msg.includes('alert')) {
    text = `💰 **Price Intelligence (Demo Mode)**\n\nCurrent best deals:\n\n• boAt Rockerz 550 — **57% off** (₹1,499)\n• boAt Wave Sigma — **64% off** (₹1,799)\n• Campus OFC Running — **40% off** (₹1,499)\n• Sony WH-1000XM5 — **23% off** (₹26,990)\n\nVisit **Price Tracking** to set alerts for specific products!`;
    products = DEMO_PRODUCTS.sort((a,b) => b.discount_percent - a.discount_percent).slice(0, 3);
  } else if (msg.includes('review') || msg.includes('fake') || msg.includes('genuine')) {
    text = `⭐ **Review Intelligence (Demo Mode)**\n\nOur AI analyzes reviews to:\n• Summarize positive and negative sentiment\n• Identify common praises and complaints\n• Flag potentially suspicious review patterns\n\n⚠️ *Suspicious patterns are indicators only — not definitive proof.*\n\nVisit the **Review Intelligence** page to analyze any product.`;
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    text = `👋 **Hello! I'm SmartShop AI — your intelligent shopping companion!**\n\nI can help you:\n• 🔍 **Find products** matching your budget and needs\n• ⚖️ **Compare** products side-by-side\n• 📊 **Analyze reviews** for genuine insights\n• 💰 **Track prices** and set alerts\n• 🌿 **Discover sustainable** alternatives\n\nTry asking:\n• "Find the best laptop under ₹60,000"\n• "Suggest headphones with good ANC"\n• "Show me sustainable products"\n\n⚠️ *Running in demo mode. Connect IBM watsonx.ai for live AI responses.*`;
  } else {
    text = `🤖 **SmartShop AI (Demo Mode)**\n\nI received your query: "${message}"\n\nLet me show you some highly-rated products that might be relevant:\n\n💡 *For more precise results, try queries like:*\n• "Best laptop under ₹60,000"\n• "Wireless headphones with ANC"\n• "Budget smartphone with good camera"\n\n⚠️ *Demo mode: Connect IBM watsonx.ai for intelligent personalized responses.*`;
    products = DEMO_PRODUCTS.filter(p => p.rating >= 4.5).sort(() => Math.random() - .5).slice(0, 3);
  }

  return { text, products };
}

const SUGGESTIONS = [
  'Find the best laptop under ₹60,000',
  'Suggest a phone with a great camera',
  'Compare Samsung and OnePlus flagship phones',
  'Best noise-cancelling headphones',
  'Should I buy this product now or wait?',
  'Find affordable and sustainable shoes',
  'What are the best deals today?',
  'Eco-friendly products under ₹5,000',
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap:'.5rem' }}>
      <div style={{ display:'flex', alignItems:'flex-end', gap:'.5rem', flexDirection: isUser ? 'row-reverse' : 'row' }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background: isUser ? 'var(--primary)' : 'linear-gradient(135deg,var(--secondary),var(--accent-teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', flexShrink:0 }}>
          {isUser ? '👤' : '🤖'}
        </div>
        <div className={`chat-bubble ${msg.role}`} style={{ whiteSpace:'pre-wrap' }}>
          {msg.content.split('\n').map((line, i) => {
            const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return <div key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
          })}
          {msg.source && <div style={{ marginTop:'.5rem', fontSize:'.75rem', opacity:.65 }}>Source: {msg.source}</div>}
        </div>
      </div>
      {msg.products && msg.products.length > 0 && (
        <div style={{ maxWidth:'90%', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
          <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginBottom:'.4rem', marginLeft:'2.5rem' }}>📦 Recommended Products:</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'.75rem', marginLeft:'2.5rem' }}>
            {msg.products.slice(0,3).map(p => (
              <div key={p.id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'.75rem', fontSize:'.85rem' }}>
                <div style={{ fontWeight:600, marginBottom:'.25rem', fontSize:'.88rem' }}>{p.name}</div>
                <div style={{ color:'var(--primary)', fontWeight:700 }}>{formatPrice(p.price)}</div>
                <div style={{ color:'#f59e0b', fontSize:'.8rem' }}>★ {p.rating}</div>
                <Link to={`/product/${p.id}`} style={{ color:'var(--primary)', fontSize:'.78rem', fontWeight:500 }}>View Details →</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([{
    id: 1, role:'assistant',
    content: '👋 **Hello! I\'m SmartShop AI — your intelligent shopping companion!**\n\nI\'m running in demo mode. I can help you find products, compare options, analyze deals, and discover sustainable choices.\n\nTry asking me something like "Find the best laptop under ₹60,000" or "Compare headphones under ₹30,000".\n\n⚠️ *Demo mode: Connect IBM watsonx.ai for live AI responses.*',
    products: []
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const userMsg = { id: Date.now(), role:'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const { text: responseText, products } = generateDemoResponse(text);
    setMessages(prev => [...prev, {
      id: Date.now() + 1, role:'assistant',
      content: responseText,
      products,
      source: 'Demo Mode (IBM Granite not connected)'
    }]);
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) sendMessage(input.trim());
  };

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container" style={{ paddingTop:'1.5rem', paddingBottom:'1.5rem' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'.75rem' }}>
          <div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:700, display:'flex', alignItems:'center', gap:'.5rem' }}>
              🤖 AI Shopping Assistant
            </h1>
            <p style={{ color:'var(--text-muted)', fontSize:'.9rem' }}>Powered by IBM Granite Models · <span className="demo-badge">Demo Mode</span></p>
          </div>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <Link to="/discover" className="btn btn-secondary btn-sm">🛍️ Browse Products</Link>
            <Link to="/compare" className="btn btn-secondary btn-sm">⚖️ Compare</Link>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1.25rem', alignItems:'start' }} className="assistant-layout">
          {/* Chat */}
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column', height:'calc(100vh - 200px)', minHeight:500 }}>
            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              {loading && (
                <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,var(--secondary),var(--accent-teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem' }}>🤖</div>
                  <div className="chat-bubble assistant" style={{ padding:'.75rem 1rem' }}>
                    <div className="loading-dots"><span/><span/><span/></div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            {/* Input */}
            <form onSubmit={handleSubmit} style={{ display:'flex', gap:'.75rem', padding:'1rem', borderTop:'1px solid var(--border)', background:'var(--bg-surface)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me about any product, budget, or shopping need..."
                className="chat-input"
                style={{ flex:1 }}
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={!input.trim() || loading} style={{ borderRadius:50, minWidth:80 }}>
                {loading ? '...' : 'Send ↑'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            <div className="card-flat" style={{ padding:'1rem' }}>
              <div style={{ fontWeight:600, marginBottom:'.75rem', fontSize:'.9rem' }}>💡 Try asking...</div>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => !loading && sendMessage(s)} style={{ width:'100%', textAlign:'left', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:8, padding:'.5rem .75rem', marginBottom:'.4rem', fontSize:'.82rem', color:'var(--text)', cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e => { e.target.style.background='#ede9fe'; e.target.style.borderColor='var(--primary)'; }}
                  onMouseLeave={e => { e.target.style.background='var(--bg-surface)'; e.target.style.borderColor='var(--border)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="disclaimer">
              <strong>ℹ️ Demo Mode</strong><br />
              Currently using pre-defined responses. Connect IBM watsonx.ai credentials in your backend .env to enable live Granite model responses.
            </div>
            <div className="card-flat" style={{ padding:'1rem' }}>
              <div style={{ fontWeight:600, marginBottom:'.5rem', fontSize:'.9rem' }}>🏗️ AI Architecture</div>
              {['🔍 RAG Retrieval', '🤖 IBM Granite 13B', '🔗 LangChain Agents', '📦 Product Search Agent', '⚖️ Comparison Agent', '⭐ Review Agent'].map(item => (
                <div key={item} style={{ fontSize:'.8rem', color:'var(--text-muted)', padding:'.2rem 0', borderBottom:'1px solid var(--border)' }}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .assistant-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
