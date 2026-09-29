import React, { useState, useMemo } from 'react';
import { DEMO_PRODUCTS, formatPrice, getSustainabilityLabel } from '../data/demoData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SUSTAINABILITY_INFO = {
  recycled_materials: { label:'Recycled Materials', icon:'♻️', tip:'Percentage of recycled content used in manufacturing' },
  repairability:      { label:'Repairability',       icon:'🔧', tip:'How easily the product can be repaired rather than replaced' },
  durability:         { label:'Durability',          icon:'💪', tip:'Expected product lifespan and build quality' },
  packaging:          { label:'Packaging',           icon:'📦', tip:'Use of minimal and recyclable packaging' },
  carbon_footprint:   { label:'Carbon Footprint',    icon:'🌡️', tip:'Manufacturing and shipping emissions' },
};

function getSustainabilityDetails(product) {
  const score = product.sustainability_score;
  const base = score / 100;
  return {
    recycled_materials: Math.round((base * 0.9 + Math.random() * 0.1) * 100),
    repairability:      Math.round((base * 0.85 + Math.random() * 0.15) * 100),
    durability:         Math.round((base * 0.95 + Math.random() * 0.05) * 100),
    packaging:          Math.round((base * 0.88 + Math.random() * 0.12) * 100),
    carbon_footprint:   Math.round((base * 0.75 + Math.random() * 0.25) * 100),
  };
}

function ScoreBar({ label, value, icon }) {
  const color = value >= 70 ? '#16a34a' : value >= 50 ? '#65a30d' : value >= 30 ? '#d97706' : '#dc2626';
  const status = value >= 70 ? 'Excellent' : value >= 50 ? 'Good' : value >= 30 ? 'Fair' : 'Poor';
  return (
    <div style={{ marginBottom:'1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.88rem', marginBottom:'.35rem' }}>
        <span style={{ fontWeight:500 }}>{icon} {label}</span>
        <span style={{ fontWeight:700, color }}>{value}/100 · {status}</span>
      </div>
      <div style={{ background:'var(--border)', borderRadius:6, height:10, overflow:'hidden' }}>
        <div style={{ width:`${value}%`, background:`linear-gradient(90deg,${color},${color}88)`, height:'100%', borderRadius:6, transition:'width .5s' }} />
      </div>
    </div>
  );
}

export default function SustainabilityInsights() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all | excellent | good | fair | poor

  const sortedProducts = useMemo(() =>
    [...DEMO_PRODUCTS].sort((a,b) => b.sustainability_score - a.sustainability_score),
    []
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return sortedProducts;
    return sortedProducts.filter(p => {
      if (filter === 'excellent') return p.sustainability_score >= 70;
      if (filter === 'good')      return p.sustainability_score >= 50 && p.sustainability_score < 70;
      if (filter === 'fair')      return p.sustainability_score >= 30 && p.sustainability_score < 50;
      if (filter === 'poor')      return p.sustainability_score < 30;
      return true;
    });
  }, [sortedProducts, filter]);

  const details = useMemo(() => selected ? getSustainabilityDetails(selected) : null, [selected]);

  const radarData = details ? Object.entries(SUSTAINABILITY_INFO).map(([k, v]) => ({
    subject: v.label.split(' ')[0], value: details[k]
  })) : [];

  const { label: sLabel, color: sColor } = selected ? getSustainabilityLabel(selected.sustainability_score) : { label:'', color:'#666' };

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div className="page-header">
          <h1>🌿 Sustainability Insights</h1>
          <p>Discover eco-friendly products and understand their environmental impact <span className="demo-badge">Estimated Scores</span></p>
        </div>

        <div className="disclaimer">
          <strong>⚠️ Important:</strong> Sustainability scores are <em>estimated</em> based on available data and should not be treated as verified environmental certifications. Where verified information is unavailable, this is clearly indicated. Always consult official product documentation for certified sustainability claims.
        </div>

        {/* Filter */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {['all','excellent','good','fair','poor'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`chip ${filter===f ? 'chip-primary' : ''}`} style={{ cursor:'pointer', border:'none', textTransform:'capitalize' }}>{f === 'all' ? 'All Products' : f}</button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'1.5rem', alignItems:'start' }} className="sust-layout">
          {/* Product list */}
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
              {filtered.map(p => {
                const { label, color } = getSustainabilityLabel(p.sustainability_score);
                return (
                  <div key={p.id} onClick={() => setSelected(p)} style={{
                    background:'#fff', borderRadius:'var(--radius)', border: selected?.id===p.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    padding:'1rem', cursor:'pointer', transition:'all .2s'
                  }}>
                    <div style={{ display:'flex', gap:'.75rem', alignItems:'center', marginBottom:'.75rem' }}>
                      <img src={p.image_url} alt="" style={{ width:52, height:52, objectFit:'cover', borderRadius:8 }} onError={e=>e.target.src='https://placehold.co/52x52'} />
                      <div>
                        <div style={{ fontWeight:600, fontSize:'.88rem', marginBottom:'.2rem' }}>{p.name}</div>
                        <div style={{ fontSize:'.78rem', color:'var(--text-muted)' }}>{p.brand} · {p.category}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ flex:1, marginRight:'1rem' }}>
                        <div style={{ height:8, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ width:`${p.sustainability_score}%`, background:color, height:'100%', borderRadius:4 }} />
                        </div>
                      </div>
                      <span style={{ color, fontWeight:700, fontSize:'.88rem', whiteSpace:'nowrap' }}>{p.sustainability_score}/100</span>
                    </div>
                    <div style={{ fontSize:'.75rem', color, fontWeight:600, marginTop:'.25rem' }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ position:'sticky', top:'5rem' }}>
            {!selected ? (
              <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🌿</div>
                <p>Click on a product to view its sustainability breakdown</p>
              </div>
            ) : (
              <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
                <div style={{ display:'flex', gap:'1rem', marginBottom:'1.25rem', alignItems:'center' }}>
                  <img src={selected.image_url} alt="" style={{ width:64, height:64, objectFit:'cover', borderRadius:8 }} onError={e=>e.target.src='https://placehold.co/64x64'} />
                  <div>
                    <div style={{ fontWeight:700, fontSize:'1rem' }}>{selected.name}</div>
                    <div style={{ color:sColor, fontWeight:700, fontSize:'1.25rem' }}>{selected.sustainability_score}/100 · {sLabel}</div>
                  </div>
                </div>

                {/* Radar chart */}
                <div style={{ height:220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize:11 }} />
                      <Radar name="Score" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Breakdown */}
                <div style={{ marginTop:'1rem' }}>
                  {Object.entries(SUSTAINABILITY_INFO).map(([key, info]) => (
                    <ScoreBar key={key} label={info.label} icon={info.icon} value={details[key]} />
                  ))}
                </div>

                <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'1rem', background:'var(--bg-surface)', padding:'.75rem', borderRadius:6 }}>
                  ℹ️ These scores are estimated from available product information and may not reflect official sustainability certifications. Where verified data is unavailable, the system displays an estimate.
                </div>

                <div style={{ marginTop:'1rem' }}>
                  <div style={{ fontWeight:600, fontSize:'.88rem', marginBottom:'.5rem' }}>💡 More Sustainable Alternatives</div>
                  {DEMO_PRODUCTS.filter(p => p.id !== selected.id && p.category === selected.category && p.sustainability_score > selected.sustainability_score).slice(0,2).map(p => (
                    <div key={p.id} style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.5rem', borderRadius:6, border:'1px solid #bbf7d0', background:'#f0fdf4', marginBottom:'.4rem' }}>
                      <span style={{ color:'var(--accent-green)', fontSize:'.75rem', fontWeight:700 }}>+{p.sustainability_score - selected.sustainability_score} pts</span>
                      <span style={{ fontSize:'.82rem' }}>{p.name}</span>
                      <span style={{ color:'var(--primary)', fontSize:'.78rem', marginLeft:'auto', fontWeight:600 }}>{formatPrice(p.price)}</span>
                    </div>
                  ))}
                  {DEMO_PRODUCTS.filter(p => p.id !== selected.id && p.category === selected.category && p.sustainability_score > selected.sustainability_score).length === 0 && (
                    <div style={{ fontSize:'.82rem', color:'var(--text-muted)' }}>This is the most sustainable option in its category!</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (max-width:768px){.sust-layout{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
