import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_PRODUCTS, formatPrice, getSustainabilityLabel } from '../data/demoData';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

function BestBadge({ label }) {
  return <span style={{ background:'#dcfce7', color:'#166534', fontSize:'.72rem', fontWeight:700, padding:'.15rem .4rem', borderRadius:4, marginLeft:'.4rem' }}>{label}</span>;
}

function CompareRow({ label, values, format = v => v, higher = true, icon }) {
  const nums = values.map(v => (typeof v === 'number' ? v : null)).filter(v => v !== null);
  const best = higher ? Math.max(...nums) : Math.min(...nums);
  const worst = higher ? Math.min(...nums) : Math.max(...nums);
  return (
    <tr>
      <td style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{icon} {label}</td>
      {values.map((v, i) => {
        const isBest = typeof v === 'number' && v === best && nums.length > 1;
        const isWorst = typeof v === 'number' && v === worst && worst !== best && nums.length > 1;
        return (
          <td key={i} className={isBest ? 'compare-best' : isWorst ? 'compare-worst' : ''}>
            {format(v)}
            {isBest && <BestBadge label="✓ Best" />}
          </td>
        );
      })}
    </tr>
  );
}

function AIComparisonSummary({ products }) {
  const [open, setOpen] = useState(false);
  if (products.length < 2) return null;

  const byPrice   = [...products].sort((a,b) => a.price - b.price)[0];
  const byRating  = [...products].sort((a,b) => b.rating - a.rating)[0];
  const bySust    = [...products].sort((a,b) => b.sustainability_score - a.sustainability_score)[0];

  return (
    <div className="card-flat" style={{ padding:'1.25rem', marginTop:'1.5rem' }}>
      <button onClick={() => setOpen(v=>!v)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', background:'none', border:'none', fontWeight:700, fontSize:'1rem', color:'var(--text)', cursor:'pointer' }}>
        🤖 AI Comparison Summary (Demo)
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ marginTop:'1rem' }}>
          <div className="disclaimer">
            <strong>ℹ️ Demo Mode:</strong> This summary is generated from product data. Connect IBM Granite for AI-generated personalized insights.
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginTop:'1rem' }}>
            <div style={{ background:'#dcfce7', borderRadius:8, padding:'1rem' }}>
              <div style={{ fontSize:'.78rem', color:'#166534', fontWeight:600, marginBottom:'.4rem' }}>💰 Best Price</div>
              <div style={{ fontWeight:700 }}>{byPrice.name}</div>
              <div style={{ fontSize:'.88rem', color:'var(--text-muted)' }}>{formatPrice(byPrice.price)}</div>
            </div>
            <div style={{ background:'#ede9fe', borderRadius:8, padding:'1rem' }}>
              <div style={{ fontSize:'.78rem', color:'var(--secondary)', fontWeight:600, marginBottom:'.4rem' }}>⭐ Highest Rated</div>
              <div style={{ fontWeight:700 }}>{byRating.name}</div>
              <div style={{ fontSize:'.88rem', color:'var(--text-muted)' }}>{byRating.rating}★</div>
            </div>
            <div style={{ background:'#d1fae5', borderRadius:8, padding:'1rem' }}>
              <div style={{ fontSize:'.78rem', color:'#065f46', fontWeight:600, marginBottom:'.4rem' }}>🌿 Most Sustainable</div>
              <div style={{ fontWeight:700 }}>{bySust.name}</div>
              <div style={{ fontSize:'.88rem', color:'var(--text-muted)' }}>Score: {bySust.sustainability_score}/100</div>
            </div>
          </div>
          <div style={{ marginTop:'1rem', fontSize:'.88rem', color:'var(--text-muted)', background:'var(--bg-surface)', padding:'1rem', borderRadius:8 }}>
            <strong>Summary:</strong> {byPrice.name} offers the best value at {formatPrice(byPrice.price)}. {byRating.name} has the highest user satisfaction ({byRating.rating}★). {bySust.name} is the most eco-friendly choice with a sustainability score of {bySust.sustainability_score}/100. The best choice depends on your personal priorities.
          </div>
          <div style={{ fontSize:'.78rem', color:'var(--text-light)', marginTop:'.5rem' }}>⚠️ This is an automated comparison. Verify specifications and prices before purchase.</div>
        </div>
      )}
    </div>
  );
}

export default function ProductComparison() {
  const { comparison, toggleComparison, isInComparison } = useShop();
  const [addingProduct, setAddingProduct] = useState('');

  const availableToAdd = useMemo(() => DEMO_PRODUCTS.filter(p => !isInComparison(p.id)), [comparison]);

  const specs = useMemo(() => {
    if (comparison.length === 0) return {};
    const keys = new Set();
    comparison.forEach(p => {
      if (p.specifications) Object.keys(p.specifications).forEach(k => keys.add(k));
    });
    return Object.fromEntries([...keys].map(k => [k, comparison.map(p => p.specifications?.[k] || '—')]));
  }, [comparison]);

  if (comparison.length === 0) {
    return (
      <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
        <div className="page-container">
          <div className="page-header"><h1>⚖️ Product Comparison</h1></div>
          <div style={{ textAlign:'center', padding:'4rem 2rem', background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⚖️</div>
            <h3>No products selected for comparison</h3>
            <p style={{ color:'var(--text-muted)', margin:'.75rem 0 1.5rem' }}>Browse products and click the "⚖️" button to add them here.</p>
            <Link to="/discover" className="btn btn-primary">🛍️ Browse Products</Link>
          </div>
          <div style={{ marginTop:'2rem' }}>
            <h3 style={{ marginBottom:'1rem' }}>Quick Add — Popular Products</h3>
            <div className="products-grid">
              {DEMO_PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', padding:'1.5rem 0 1rem' }}>
          <div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:700 }}>⚖️ Product Comparison</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'.9rem' }}>Comparing {comparison.length} product{comparison.length>1?'s':''}</p>
          </div>
          {comparison.length < 4 && (
            <div style={{ display:'flex', gap:'.5rem', alignItems:'center' }}>
              <select value={addingProduct} onChange={e => { if (e.target.value) { const p = DEMO_PRODUCTS.find(p=>p.id===parseInt(e.target.value)); if(p) toggleComparison(p); setAddingProduct(''); }}} style={{ padding:'.45rem .85rem', borderRadius:8, border:'1.5px solid var(--border)', fontSize:'.88rem', outline:'none' }}>
                <option value="">+ Add product to compare</option>
                {availableToAdd.map(p => <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.price)})</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Product thumbnails row */}
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${comparison.length + 1}, 1fr)`, gap:'1px', marginBottom:'1px' }}>
          <div style={{ background:'var(--bg-surface)', padding:'1rem', borderRadius:'var(--radius-sm) 0 0 0' }} />
          {comparison.map(p => (
            <div key={p.id} style={{ background:'#fff', padding:'1rem', textAlign:'center', border:'1px solid var(--border)', borderBottom:'none', position:'relative' }}>
              <button onClick={() => toggleComparison(p)} style={{ position:'absolute', top:'.5rem', right:'.5rem', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:4, padding:'.15rem .4rem', fontSize:'.75rem', cursor:'pointer' }}>✕</button>
              <img src={p.image_url} alt={p.name} style={{ width:80, height:80, objectFit:'cover', borderRadius:8, marginBottom:'.5rem' }} onError={e=>{e.target.src='https://placehold.co/80x80/e2e8f0/64748b?text=Product'}} />
              <div style={{ fontWeight:600, fontSize:'.88rem', marginBottom:'.2rem' }}>{p.name}</div>
              <div style={{ color:'var(--primary)', fontWeight:700 }}>{formatPrice(p.price)}</div>
              <div style={{ fontSize:'.78rem', color:'var(--text-muted)' }}>{p.brand}</div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX:'auto', background:'#fff', borderRadius:'0 0 var(--radius) var(--radius)', border:'1px solid var(--border)', borderTop:'none' }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ width:150 }}>Feature</th>
                {comparison.map(p => <th key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Price" values={comparison.map(p=>p.price)} format={formatPrice} higher={false} icon="💰" />
              <CompareRow label="Rating" values={comparison.map(p=>p.rating)} format={v=>`${v}★`} icon="⭐" />
              <CompareRow label="Reviews" values={comparison.map(p=>p.review_count)} format={v=>v?.toLocaleString('en-IN')} icon="📝" />
              <CompareRow label="Discount" values={comparison.map(p=>p.discount_percent)} format={v=>`${v}%`} icon="🏷️" />
              <CompareRow label="Sustainability" values={comparison.map(p=>p.sustainability_score)} format={v=>`${v}/100`} icon="🌿" />
              <tr>
                <td style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text-muted)' }}>📦 Marketplace</td>
                {comparison.map(p => <td key={p.id}>{p.marketplace}</td>)}
              </tr>
              {Object.entries(specs).map(([key, vals]) => (
                <tr key={key}>
                  <td style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text-muted)', textTransform:'capitalize' }}>🔧 {key.replace(/_/g,' ')}</td>
                  {vals.map((v,i) => <td key={i} style={{ fontSize:'.88rem' }}>{String(v)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AIComparisonSummary products={comparison} />

        {/* Alternatives */}
        {comparison.length > 0 && (
          <div style={{ marginTop:'2rem' }}>
            <h3 style={{ marginBottom:'1rem' }}>💡 You Might Also Consider</h3>
            <div className="products-grid">
              {DEMO_PRODUCTS.filter(p => !isInComparison(p.id) && comparison.some(c=>c.category===p.category)).slice(0,4).map(p=><ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
