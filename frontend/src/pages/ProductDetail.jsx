import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEMO_PRODUCTS, DEMO_REVIEWS, DEMO_PRICE_HISTORY, formatPrice, getSustainabilityLabel } from '../data/demoData';
import { useShop } from '../context/ShopContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductDetail() {
  const { id } = useParams();
  const product = DEMO_PRODUCTS.find(p => p.id === parseInt(id));
  const { toggleWishlist, toggleComparison, isInWishlist, isInComparison, addPriceAlert, showNotification } = useShop();

  const reviews  = DEMO_REVIEWS[parseInt(id)] || [];
  const history  = DEMO_PRICE_HISTORY[parseInt(id)];
  const similar  = DEMO_PRODUCTS.filter(p => p.id !== parseInt(id) && p.category === product?.category).slice(0, 4);

  const priceData = useMemo(() => history?.map(h => ({
    date: new Date(h.recorded_at).toLocaleDateString('en-IN', { month:'short', day:'numeric' }),
    price: h.recorded_price
  })), [history]);

  if (!product) return (
    <div className="page-container" style={{ padding:'4rem 0', textAlign:'center' }}>
      <h2>Product not found</h2>
      <Link to="/discover" className="btn btn-primary" style={{ marginTop:'1rem' }}>Back to Products</Link>
    </div>
  );

  const { label: sLabel, color: sColor } = getSustainabilityLabel(product.sustainability_score);
  const specs = typeof product.specifications === 'object' ? product.specifications : {};

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container" style={{ paddingTop:'1.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize:'.85rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>
          <Link to="/" style={{ color:'var(--primary)' }}>Home</Link> / <Link to="/discover" style={{ color:'var(--primary)' }}>Products</Link> / {product.category} / <span>{product.name}</span>
        </div>

        {/* Main product layout */}
        <div style={{ display:'grid', gridTemplateColumns:'420px 1fr', gap:'2rem', marginBottom:'2rem' }} className="pd-grid">
          {/* Image */}
          <div>
            <div style={{ background:'#fff', borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid var(--border)', position:'relative' }}>
              {product.discount_percent > 0 && (
                <div style={{ position:'absolute', top:1, left:1, zIndex:1, background:'#dc2626', color:'#fff', padding:'.25rem .65rem', borderRadius:'0 0 8px 0', fontWeight:700 }}>-{product.discount_percent}%</div>
              )}
              <img src={product.image_url} alt={product.name} style={{ width:'100%', aspectRatio:'4/3', objectFit:'cover' }}
                onError={e => e.target.src = `https://placehold.co/420x315/e2e8f0/64748b?text=${encodeURIComponent(product.category)}`} />
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ color:'var(--text-muted)', fontSize:'.82rem', marginBottom:'.5rem', textTransform:'uppercase', letterSpacing:'.05em' }}>{product.category}</div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:700, marginBottom:'.75rem', lineHeight:1.3 }}>{product.name}</h1>

            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                <span style={{ color:'#f59e0b', fontSize:'1.1rem' }}>{'★'.repeat(Math.round(product.rating))}</span>
                <span style={{ fontWeight:600 }}>{product.rating}</span>
                <span style={{ color:'var(--text-muted)', fontSize:'.88rem' }}>({product.review_count?.toLocaleString('en-IN')} reviews)</span>
              </div>
              <span className="badge-marketplace">📦 {product.marketplace}</span>
              <span style={{ background:`${sColor}18`, color:sColor, fontWeight:600, fontSize:'.78rem', padding:'.2rem .5rem', borderRadius:20 }}>🌿 {sLabel} ({product.sustainability_score}/100)</span>
            </div>

            <div style={{ display:'flex', alignItems:'baseline', gap:'.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
              <span style={{ fontSize:'2rem', fontWeight:800, color:'var(--primary)' }}>{formatPrice(product.price)}</span>
              {product.original_price > product.price && (
                <>
                  <span style={{ textDecoration:'line-through', color:'var(--text-light)', fontSize:'1.1rem' }}>{formatPrice(product.original_price)}</span>
                  <span style={{ background:'#dcfce7', color:'#16a34a', fontWeight:700, padding:'.2rem .5rem', borderRadius:4, fontSize:'.88rem' }}>Save {formatPrice(product.original_price - product.price)}</span>
                </>
              )}
            </div>

            <p style={{ color:'var(--text-muted)', lineHeight:1.7, marginBottom:'1.25rem' }}>{product.description}</p>

            {/* Actions */}
            <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
              <button className={`btn btn-lg ${isInWishlist(product.id) ? 'btn-danger' : 'btn-secondary'}`} onClick={() => toggleWishlist(product)}>
                {isInWishlist(product.id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
              </button>
              <button className={`btn btn-lg ${isInComparison(product.id) ? 'btn-danger' : 'btn-primary'}`} onClick={() => toggleComparison(product)}>
                {isInComparison(product.id) ? '✓ In Comparison' : '⚖️ Compare'}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => { const target = Math.round(product.price * 0.9); addPriceAlert(product.id, target); }}>
                🔔 Alert at {formatPrice(Math.round(product.price * 0.9))}
              </button>
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div style={{ background:'var(--bg-surface)', borderRadius:'var(--radius-sm)', padding:'1rem' }}>
                <div style={{ fontWeight:600, marginBottom:'.75rem', fontSize:'.9rem' }}>📋 Key Specifications</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.4rem' }}>
                  {Object.entries(specs).map(([k,v]) => (
                    <div key={k} style={{ fontSize:'.85rem' }}>
                      <span style={{ color:'var(--text-muted)', textTransform:'capitalize' }}>{k.replace(/_/g,' ')}: </span>
                      <span style={{ fontWeight:500 }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price History Chart */}
        {priceData && (
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem', marginBottom:'1.5rem' }}>
            <div style={{ fontWeight:700, marginBottom:'1rem' }}>💰 Price History <span className="demo-badge">Simulated</span></div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [formatPrice(v), 'Price']} />
                <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.5} dot={{ r:3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem', marginBottom:'1.5rem' }}>
            <div style={{ fontWeight:700, marginBottom:'1rem' }}>⭐ Customer Reviews ({reviews.length})</div>
            {reviews.map(r => (
              <div key={r.id} style={{ borderBottom:'1px solid var(--border)', paddingBottom:'.75rem', marginBottom:'.75rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.4rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <span style={{ fontWeight:600, fontSize:'.9rem' }}>{r.user_name}</span>
                    {r.verified_purchase && <span className="chip chip-green" style={{ fontSize:'.72rem', padding:'.1rem .35rem' }}>✓ Verified</span>}
                  </div>
                  <div style={{ color:'#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                </div>
                <p style={{ fontSize:'.88rem', color:'var(--text-muted)' }}>{r.review_text}</p>
              </div>
            ))}
            <Link to="/reviews" className="btn btn-secondary btn-sm">🤖 AI Review Analysis →</Link>
          </div>
        )}

        {/* Similar Products */}
        {similar.length > 0 && (
          <div style={{ marginBottom:'2rem' }}>
            <h3 style={{ fontWeight:700, marginBottom:'1rem' }}>👀 Similar Products</h3>
            <div className="products-grid">
              {similar.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden', transition:'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-lg)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                    <img src={p.image_url} alt={p.name} style={{ width:'100%', height:140, objectFit:'cover' }} onError={e=>e.target.src='https://placehold.co/240x140'} />
                    <div style={{ padding:'.75rem' }}>
                      <div style={{ fontSize:'.85rem', fontWeight:600, marginBottom:'.25rem' }}>{p.name}</div>
                      <div style={{ color:'var(--primary)', fontWeight:700, fontSize:'.95rem' }}>{formatPrice(p.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width:768px){.pd-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
