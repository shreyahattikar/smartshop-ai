import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DEMO_PRODUCTS, DEMO_PRICE_HISTORY, formatPrice } from '../data/demoData';
import { useShop } from '../context/ShopContext';

function PriceChart({ history, currentPrice, targetPrice }) {
  const data = history.map(h => ({
    date: new Date(h.recorded_at).toLocaleDateString('en-IN', { month:'short', day:'numeric' }),
    price: h.recorded_price
  }));
  const min = Math.min(...history.map(h=>h.recorded_price));
  const max = Math.max(...history.map(h=>h.recorded_price));

  return (
    <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'.5rem', marginBottom:'1rem' }}>
        <div>
          <div style={{ fontSize:'.82rem', color:'var(--text-muted)' }}>Current Price</div>
          <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--primary)' }}>{formatPrice(currentPrice)}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'.78rem', color:'var(--text-muted)' }}>Range</div>
          <div style={{ fontSize:'.9rem' }}>
            <span style={{ color:'var(--accent-green)', fontWeight:600 }}>{formatPrice(min)}</span>
            <span style={{ color:'var(--text-muted)' }}> – </span>
            <span style={{ color:'var(--accent-red)', fontWeight:600 }}>{formatPrice(max)}</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top:5, right:10, bottom:5, left:10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize:11 }} />
          <YAxis tick={{ fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [formatPrice(v), 'Price']} />
          <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.5} dot={{ r:3 }} activeDot={{ r:6 }} />
          {targetPrice && <ReferenceLine y={targetPrice} stroke="#16a34a" strokeDasharray="5 5" label={{ value:`Target: ${formatPrice(targetPrice)}`, position:'right', fontSize:11 }} />}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.5rem', textAlign:'center' }}>
        <span className="demo-badge">Simulated Price History</span> — Prices for demonstration only
      </div>
    </div>
  );
}

function generateSimulatedHistory(basePrice) {
  const history = [];
  const today = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    const variation = (Math.random() - 0.4) * basePrice * 0.08;
    history.push({ recorded_price: Math.round(basePrice + variation), recorded_at: d.toISOString() });
  }
  history[history.length - 1].recorded_price = basePrice;
  return history;
}

export default function PriceTracking() {
  const [selectedProduct, setSelectedProduct] = useState(DEMO_PRODUCTS[0]);
  const [targetPrice, setTargetPrice] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [alertSet, setAlertSet] = useState(false);
  const [search, setSearch] = useState('');
  const { showNotification } = useShop();

  const filtered = useMemo(() =>
    DEMO_PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const priceHistory = useMemo(() => {
    if (!selectedProduct) return [];
    return DEMO_PRICE_HISTORY[selectedProduct.id] || generateSimulatedHistory(selectedProduct.price);
  }, [selectedProduct]);

  const trend = useMemo(() => {
    if (priceHistory.length < 2) return 'stable';
    const first = priceHistory[0].recorded_price;
    const last  = priceHistory[priceHistory.length - 1].recorded_price;
    const change = ((last - first) / first) * 100;
    if (change < -5) return 'declining';
    if (change > 5)  return 'rising';
    return 'stable';
  }, [priceHistory]);

  const handleSetAlert = () => {
    if (!targetPrice || isNaN(+targetPrice) || +targetPrice <= 0) {
      showNotification('Please enter a valid target price', 'warning'); return;
    }
    const alert = { id: Date.now(), productId: selectedProduct.id, productName: selectedProduct.name, targetPrice: +targetPrice, currentPrice: selectedProduct.price, status: 'active' };
    setAlerts(prev => [...prev.filter(a => a.productId !== selectedProduct.id), alert]);
    setAlertSet(true);
    showNotification(`✓ Price alert set! You'll be notified when ${selectedProduct.name} drops below ₹${(+targetPrice).toLocaleString('en-IN')}`, 'success');
  };

  const trendColor = { declining:'var(--accent-green)', rising:'var(--accent-red)', stable:'var(--accent-amber)' }[trend];
  const trendIcon  = { declining:'📉', rising:'📈', stable:'➡️' }[trend];

  const insight = () => {
    if (!targetPrice) return null;
    const tp = +targetPrice;
    if (selectedProduct.price <= tp) return { type:'buy', msg:`✅ Current price (${formatPrice(selectedProduct.price)}) is already at or below your target! Consider buying now.` };
    const diff = selectedProduct.price - tp;
    return { type:'wait', msg:`💡 Price needs to drop ${formatPrice(diff)} more to reach your target. We'll notify you when it hits ${formatPrice(tp)}.` };
  };

  const priceInsight = insight();

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div className="page-header">
          <h1>💰 Price Tracking & Intelligence</h1>
          <p>Monitor prices, set alerts, and shop at the right moment <span className="demo-badge">Demo Data</span></p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'1.5rem', alignItems:'start' }} className="price-layout">
          {/* Product list */}
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden' }}>
            <div style={{ padding:'1rem', borderBottom:'1px solid var(--border)' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width:'100%', padding:'.5rem .75rem', border:'1.5px solid var(--border)', borderRadius:8, fontSize:'.88rem', outline:'none' }} />
            </div>
            <div style={{ maxHeight:500, overflowY:'auto' }}>
              {filtered.map(p => (
                <button key={p.id} onClick={() => { setSelectedProduct(p); setTargetPrice(''); setAlertSet(false); }} style={{
                  width:'100%', textAlign:'left', padding:'.75rem 1rem', border:'none', borderBottom:'1px solid var(--border)',
                  background: selectedProduct?.id === p.id ? '#ede9fe' : '#fff', cursor:'pointer', transition:'background .15s'
                }}>
                  <div style={{ display:'flex', gap:'.6rem', alignItems:'center' }}>
                    <img src={p.image_url} alt="" style={{ width:40, height:40, borderRadius:6, objectFit:'cover' }} onError={e=>e.target.src='https://placehold.co/40x40/e2e8f0/64748b?text=P'} />
                    <div>
                      <div style={{ fontSize:'.85rem', fontWeight:600 }}>{p.name}</div>
                      <div style={{ fontSize:'.78rem', color:'var(--primary)', fontWeight:700 }}>{formatPrice(p.price)}</div>
                      {p.discount_percent > 0 && <span style={{ fontSize:'.72rem', color:'var(--accent-green)' }}>-{p.discount_percent}%</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main panel */}
          {selectedProduct && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              {/* Product info + trend */}
              <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
                <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width:80, height:80, borderRadius:8, objectFit:'cover' }} onError={e=>e.target.src='https://placehold.co/80x80'} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'.3rem' }}>{selectedProduct.name}</div>
                  <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                    <div>
                      <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>Current</div>
                      <div style={{ fontSize:'1.3rem', fontWeight:700, color:'var(--primary)' }}>{formatPrice(selectedProduct.price)}</div>
                    </div>
                    {selectedProduct.original_price > selectedProduct.price && (
                      <div>
                        <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>Original</div>
                        <div style={{ fontSize:'1rem', textDecoration:'line-through', color:'var(--text-light)' }}>{formatPrice(selectedProduct.original_price)}</div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>Trend</div>
                      <div style={{ color:trendColor, fontWeight:700, fontSize:'.95rem' }}>{trendIcon} {trend.charAt(0).toUpperCase()+trend.slice(1)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price chart */}
              <PriceChart history={priceHistory} currentPrice={selectedProduct.price} targetPrice={+targetPrice || null} />

              {/* Set Alert */}
              <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
                <h4 style={{ marginBottom:'.75rem' }}>🔔 Set Price Alert</h4>
                <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'.75rem' }}>
                  <div style={{ display:'flex', alignItems:'center', flex:1, background:'var(--bg-surface)', borderRadius:8, padding:'.5rem .85rem', border:'1.5px solid var(--border)' }}>
                    <span style={{ color:'var(--text-muted)', marginRight:'.35rem' }}>₹</span>
                    <input
                      type="number"
                      placeholder="Enter your target price"
                      value={targetPrice}
                      onChange={e => { setTargetPrice(e.target.value); setAlertSet(false); }}
                      style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:'.95rem' }}
                      min={1} max={selectedProduct.price * 2}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleSetAlert} disabled={alertSet}>
                    {alertSet ? '✓ Alert Set' : '🔔 Set Alert'}
                  </button>
                </div>

                {priceInsight && (
                  <div style={{ background: priceInsight.type==='buy' ? '#dcfce7' : '#fef3c7', borderRadius:8, padding:'.75rem', fontSize:'.88rem', color: priceInsight.type==='buy' ? '#166534' : '#92400e' }}>
                    {priceInsight.msg}
                  </div>
                )}

                <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginTop:'.75rem' }}>
                  ⚠️ Disclaimer: Price forecasts are estimates only. Future prices cannot be guaranteed. Demo mode uses simulated data.
                </div>
              </div>

              {/* Active Alerts */}
              {alerts.length > 0 && (
                <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
                  <h4 style={{ marginBottom:'.75rem' }}>⏰ Your Price Alerts</h4>
                  {alerts.map(a => (
                    <div key={a.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.75rem', background:'var(--bg-surface)', borderRadius:8, marginBottom:'.5rem' }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'.88rem' }}>{a.productName}</div>
                        <div style={{ fontSize:'.82rem', color:'var(--text-muted)' }}>Alert at: <span style={{ color:'var(--accent-green)', fontWeight:600 }}>{formatPrice(a.targetPrice)}</span> · Current: {formatPrice(a.currentPrice)}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                        <span className="chip chip-green" style={{ fontSize:'.72rem' }}>Active</span>
                        <button onClick={() => setAlerts(prev => prev.filter(x=>x.id!==a.id))} style={{ background:'#fee2e2', border:'none', borderRadius:4, padding:'.15rem .4rem', fontSize:'.75rem', color:'#dc2626', cursor:'pointer' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@media (max-width:768px){.price-layout{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
