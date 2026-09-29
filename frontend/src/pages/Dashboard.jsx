import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { DEMO_PRODUCTS, formatPrice, getSustainabilityLabel } from '../data/demoData';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const COLORS = ['#4f46e5','#7c3aed','#0891b2','#16a34a','#d97706','#dc2626'];

function StatCard({ icon, value, label, color = 'var(--primary)' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background:`${color}18` }}><span>{icon}</span></div>
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

function InsightCard({ icon, title, desc, color }) {
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' }}>
      <div style={{ display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
        <div style={{ fontSize:'1.5rem' }}>{icon}</div>
        <div>
          <div style={{ fontWeight:600, fontSize:'.9rem', marginBottom:'.25rem', color }}>{title}</div>
          <div style={{ fontSize:'.83rem', color:'var(--text-muted)', lineHeight:1.5 }}>{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { wishlist, comparison, priceAlerts } = useShop();

  // Category distribution
  const categoryData = useMemo(() => {
    const counts = {};
    DEMO_PRODUCTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // Top rated by category
  const topRated = useMemo(() =>
    DEMO_PRODUCTS.filter(p => p.rating >= 4.5).sort((a,b) => b.rating - a.rating).slice(0, 4),
    []
  );

  // Biggest discounts
  const topDeals = useMemo(() =>
    [...DEMO_PRODUCTS].sort((a,b) => b.discount_percent - a.discount_percent).slice(0, 5),
    []
  );

  // Sustainability leaders
  const sustainableLeaders = useMemo(() =>
    [...DEMO_PRODUCTS].sort((a,b) => b.sustainability_score - a.sustainability_score).slice(0, 5),
    []
  );

  // Rating bar chart data
  const ratingData = useMemo(() => {
    const cats = {};
    DEMO_PRODUCTS.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { total:0, count:0 };
      cats[p.category].total += p.rating;
      cats[p.category].count++;
    });
    return Object.entries(cats).map(([name, d]) => ({ name: name.replace('Smartwatches','Watches'), avg: parseFloat((d.total/d.count).toFixed(2)) }));
  }, []);

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div style={{ padding:'1.5rem 0 1rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'.75rem' }}>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:700 }}>📊 Smart Shopping Pulse</h1>
            <p style={{ color:'var(--text-muted)' }}>Your personalized shopping intelligence dashboard <span className="demo-badge">Demo Mode</span></p>
          </div>
          <div style={{ fontSize:'.82rem', color:'var(--text-muted)' }}>Updated: {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
        </div>

        {/* Overview Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
          <StatCard icon="❤️" value={wishlist.length} label="Wishlist Items" color="var(--accent-red)" />
          <StatCard icon="⚖️" value={comparison.length} label="Comparison List" color="var(--secondary)" />
          <StatCard icon="🔔" value={priceAlerts.length} label="Active Alerts" color="var(--accent-amber)" />
          <StatCard icon="🛍️" value={DEMO_PRODUCTS.length} label="Total Products" color="var(--primary)" />
          <StatCard icon="🌿" value={DEMO_PRODUCTS.filter(p=>p.sustainability_score>=60).length} label="Eco-Friendly Picks" color="var(--accent-green)" />
          <StatCard icon="🏷️" value={DEMO_PRODUCTS.filter(p=>p.discount_percent>=20).length} label="Products on Sale" color="#0891b2" />
        </div>

        {/* Smart Insights */}
        <div style={{ marginBottom:'1.5rem' }}>
          <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>💡 Smart Insights</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1rem' }}>
            <InsightCard icon="📉" title="Price Trends" desc="Sony WH-1000XM5 has dropped ₹8,000 (23%) from its original price — now is a great time to buy!" color="#16a34a" />
            <InsightCard icon="🔥" title="Trending Category" desc="Smartphones are the most searched category this week with 3 flagship launches in the last month." color="var(--accent-red)" />
            <InsightCard icon="🌿" title="Sustainability Tip" desc="MacBook Air M3 leads with an 80/100 sustainability score — great choice for eco-conscious buyers." color="#065f46" />
            <InsightCard icon="⭐" title="Top Rated" desc="iPhone 15 Pro (4.7★) and Apple Watch Series 9 (4.7★) lead the highest-rated products this month." color="var(--secondary)" />
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }} className="dash-charts">
          {/* Category Distribution */}
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
            <h3 style={{ marginBottom:'1rem', fontSize:'1rem', fontWeight:700 }}>📂 Category Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize:'.75rem' }}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Avg Rating by Category */}
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
            <h3 style={{ marginBottom:'1rem', fontSize:'1rem', fontWeight:700 }}>⭐ Avg Rating by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ratingData} margin={{ top:5, right:10, bottom:25, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize:10 }} angle={-30} textAnchor="end" />
                <YAxis domain={[3, 5]} tick={{ fontSize:11 }} />
                <Tooltip />
                <Bar dataKey="avg" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Deals */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:700 }}>🏷️ Best Deals Right Now</h2>
            <Link to="/discover?minDiscount=20" className="btn btn-secondary btn-sm">See All →</Link>
          </div>
          <div style={{ display:'flex', gap:'1rem', overflowX:'auto', paddingBottom:'.5rem' }}>
            {topDeals.map(p => (
              <div key={p.id} style={{ minWidth:200, background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1rem', flexShrink:0 }}>
                <img src={p.image_url} alt={p.name} style={{ width:'100%', height:100, objectFit:'cover', borderRadius:6, marginBottom:'.5rem' }} onError={e=>e.target.src='https://placehold.co/200x100'} />
                <div style={{ fontSize:'.85rem', fontWeight:600, marginBottom:'.25rem' }}>{p.name}</div>
                <div style={{ color:'var(--primary)', fontWeight:700 }}>{formatPrice(p.price)}</div>
                <span style={{ background:'#dcfce7', color:'#166534', fontSize:'.72rem', fontWeight:700, padding:'.1rem .35rem', borderRadius:4 }}>-{p.discount_percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Products */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:700 }}>🔥 Trending Products</h2>
            <Link to="/discover" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          <div className="products-grid">
            {topRated.map(p => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>

        {/* Sustainability Leaderboard */}
        <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem', marginBottom:'1.5rem' }}>
          <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>🌿 Sustainability Leaderboard</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
            {sustainableLeaders.map((p, i) => {
              const { label, color } = getSustainabilityLabel(p.sustainability_score);
              return (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ fontWeight:700, color:'var(--text-muted)', width:20, textAlign:'center' }}>#{i+1}</div>
                  <img src={p.image_url} alt="" style={{ width:36, height:36, objectFit:'cover', borderRadius:6 }} onError={e=>e.target.src='https://placehold.co/36x36'} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'.88rem', fontWeight:600 }}>{p.name}</div>
                    <div style={{ fontSize:'.78rem', color:'var(--text-muted)' }}>{p.category}</div>
                  </div>
                  <div style={{ width:120 }}>
                    <div style={{ height:8, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ width:`${p.sustainability_score}%`, background:color, height:'100%', borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:'.75rem', color, fontWeight:600, textAlign:'right', marginTop:2 }}>{p.sustainability_score}/100 · {label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/sustainability" className="btn btn-secondary btn-sm" style={{ marginTop:'1rem' }}>View Full Sustainability Report →</Link>
        </div>

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <div style={{ marginBottom:'1.5rem' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>❤️ Your Wishlist ({wishlist.length})</h2>
            <div className="products-grid">
              {wishlist.map(p => <ProductCard key={p.id} product={p} compact />)}
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width:768px){.dash-charts{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
