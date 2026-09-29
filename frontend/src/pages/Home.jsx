import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEMO_PRODUCTS } from '../data/demoData';
import ProductCard from '../components/ProductCard';

const FEATURES = [
  { icon:'🤖', title:'AI-Powered Recommendations', desc:'IBM Granite models analyze your needs and suggest the best products from thousands of options.' },
  { icon:'🔍', title:'Multimodal Search', desc:'Search by text, upload product images, or use your voice to find exactly what you need.' },
  { icon:'💰', title:'Price Comparison', desc:'Compare prices across marketplaces and track price history to buy at the right time.' },
  { icon:'⭐', title:'Review Intelligence', desc:'AI-powered review analysis identifies genuine insights and flags potentially suspicious patterns.' },
  { icon:'🌿', title:'Sustainable Shopping', desc:'Discover eco-friendly alternatives and see sustainability scores for every product.' },
  { icon:'📊', title:'Smart Shopping Pulse', desc:'Personalized dashboard with trending products, price alerts, and shopping insights.' },
];

const HOW_IT_WORKS = [
  { step:'01', title:'Describe What You Need', desc:'Tell our AI assistant what you are looking for — product type, budget, preferences, or upload an image.' },
  { step:'02', title:'AI Retrieves & Analyzes', desc:'Our IBM Granite-powered RAG system searches the product catalog and analyzes specifications and reviews.' },
  { step:'03', title:'Get Smart Recommendations', desc:'Receive personalized product suggestions with clear explanations of why each product suits your needs.' },
  { step:'04', title:'Compare & Buy Confidently', desc:'Compare shortlisted products, track prices, and make an informed purchase decision.' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const trending  = DEMO_PRODUCTS.filter(p => p.rating >= 4.5).slice(0, 4);
  const featured  = DEMO_PRODUCTS.filter(p => p.discount_percent >= 20).slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        background:'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%)',
        color:'#fff', padding:'5rem 0 4rem', textAlign:'center', position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 50%, rgba(255,255,255,.05) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,.08) 0%, transparent 50%)' }} />
        <div className="page-container" style={{ position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', padding:'.35rem 1rem', borderRadius:20, fontSize:'.82rem', marginBottom:'1.25rem', border:'1px solid rgba(255,255,255,.2)' }}>
            <span>🤖</span> Powered by IBM Granite Models · Demo Mode
          </div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:800, lineHeight:1.15, marginBottom:'1rem', letterSpacing:'-.02em' }}>
            Shop Smarter.<br />Compare Better.<br />
            <span style={{ color:'#a5f3fc' }}>Buy Confidently.</span>
          </h1>
          <p style={{ fontSize:'clamp(1rem,2vw,1.2rem)', opacity:.88, maxWidth:560, margin:'0 auto 2.5rem', lineHeight:1.7 }}>
            SmartShop AI is your agentic shopping companion — personalized recommendations, price intelligence, review analysis, and sustainability insights all in one place.
          </p>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ maxWidth:620, margin:'0 auto 2rem', display:'flex', background:'#fff', borderRadius:50, padding:'.5rem .5rem .5rem 1.5rem', boxShadow:'0 8px 32px rgba(0,0,0,.2)' }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Try "best laptop under ₹60,000" or "wireless headphones"'
              style={{ flex:1, border:'none', outline:'none', fontSize:'1rem', color:'var(--text)', background:'transparent', minWidth:0 }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius:40, paddingLeft:'1.5rem', paddingRight:'1.5rem' }}>
              🔍 Search
            </button>
          </form>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/assistant" className="btn btn-lg" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', backdropFilter:'blur(4px)' }}>🤖 Start Smart Shopping</Link>
            <Link to="/discover" className="btn btn-lg" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', backdropFilter:'blur(4px)' }}>🛍️ Explore Products</Link>
            <Link to="/compare" className="btn btn-lg" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', backdropFilter:'blur(4px)' }}>⚖️ Compare Products</Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="page-section" style={{ background:'#fff' }}>
        <div className="page-container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 className="section-title">Intelligent Shopping Features</h2>
            <p className="section-subtitle">Everything you need to shop smarter, backed by agentic AI</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card-flat" style={{ padding:'1.5rem', transition:'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
              >
                <div style={{ fontSize:'2rem', marginBottom:'.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight:600, marginBottom:'.5rem' }}>{f.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'.9rem', lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────── */}
      <section className="page-section" style={{ background:'var(--bg-surface)' }}>
        <div className="page-container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 className="section-title">How SmartShop AI Works</h2>
            <p className="section-subtitle">Agentic AI powered by IBM Granite Models and RAG architecture</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.5rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign:'center', padding:'1.5rem 1rem' }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--secondary))', color:'#fff', fontWeight:800, fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>{step.step}</div>
                <h3 style={{ fontWeight:600, marginBottom:'.5rem', fontSize:'1rem' }}>{step.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'.88rem', lineHeight:1.65 }}>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{ display:'none' }} className="hide-mobile">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Products ─────────────────────────────────── */}
      <section className="page-section" style={{ background:'#fff' }}>
        <div className="page-container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'.75rem' }}>
            <div>
              <h2 className="section-title">🔥 Trending Products</h2>
              <p style={{ color:'var(--text-muted)', fontSize:'.9rem' }}>Highest rated picks this season <span className="demo-badge">Demo Data</span></p>
            </div>
            <Link to="/discover" className="btn btn-secondary">View All Products →</Link>
          </div>
          <div className="products-grid">
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Best Deals ───────────────────────────────────────── */}
      <section className="page-section" style={{ background:'var(--bg-surface)' }}>
        <div className="page-container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'.75rem' }}>
            <div>
              <h2 className="section-title">🏷️ Best Deals</h2>
              <p style={{ color:'var(--text-muted)', fontSize:'.9rem' }}>Biggest discounts right now <span className="demo-badge">Demo Data</span></p>
            </div>
            <Link to="/discover?minDiscount=20" className="btn btn-secondary">See All Deals →</Link>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg,#1e1b4b,#4c1d95)', color:'#fff', padding:'3.5rem 0', textAlign:'center' }}>
        <div className="page-container">
          <h2 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:'.75rem' }}>Ready to shop smarter?</h2>
          <p style={{ opacity:.8, marginBottom:'1.75rem', fontSize:'1.05rem' }}>Ask our AI assistant any shopping question — it's free, instant, and intelligent.</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/assistant" className="btn btn-lg" style={{ background:'#fff', color:'var(--primary)', fontWeight:700 }}>🤖 Chat with AI Assistant</Link>
            <Link to="/dashboard" className="btn btn-lg" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)' }}>📊 View Shopping Pulse</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
