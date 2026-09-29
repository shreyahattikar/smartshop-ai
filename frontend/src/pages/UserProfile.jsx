import React, { useState } from 'react';
import { DEMO_PRODUCTS, CATEGORIES, formatPrice } from '../data/demoData';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const DEFAULT_PREFS = {
  name: 'Demo User',
  email: 'demo@smartshop.ai',
  preferred_categories: ['Smartphones', 'Laptops'],
  budget_min: 5000,
  budget_max: 80000,
  preferred_brands: ['Sony', 'Samsung', 'Apple'],
  sustainability_preference: 'medium',
  urgency: 'medium',
  newsletter: true
};

const BRANDS = [...new Set(DEMO_PRODUCTS.map(p => p.brand))].sort();

export default function UserProfile() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);
  const { wishlist, toggleWishlist, priceAlerts } = useShop();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    setPrefs(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleCategory = (cat) => {
    setDraft(d => ({
      ...d,
      preferred_categories: d.preferred_categories.includes(cat)
        ? d.preferred_categories.filter(c => c !== cat)
        : [...d.preferred_categories, cat]
    }));
  };

  const toggleBrand = (brand) => {
    setDraft(d => ({
      ...d,
      preferred_brands: d.preferred_brands.includes(brand)
        ? d.preferred_brands.filter(b => b !== brand)
        : [...d.preferred_brands, brand]
    }));
  };

  const suggestedProducts = DEMO_PRODUCTS.filter(p =>
    prefs.preferred_categories.includes(p.category) &&
    p.price >= prefs.budget_min &&
    p.price <= prefs.budget_max
  ).slice(0, 4);

  const tabs = [
    { id:'profile',    label:'👤 Profile & Preferences' },
    { id:'wishlist',   label:`❤️ Wishlist (${wishlist.length})` },
    { id:'alerts',     label:`🔔 Alerts (${priceAlerts.length})` },
    { id:'recommendations', label:'💡 For You' },
  ];

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div className="page-header">
          <h1>👤 Profile & Preferences</h1>
          <p>Personalize your SmartShop AI experience</p>
        </div>

        {/* Profile header card */}
        <div style={{ background:'linear-gradient(135deg,var(--primary),var(--secondary))', borderRadius:'var(--radius)', padding:'1.5rem', marginBottom:'1.5rem', color:'#fff', display:'flex', gap:'1.25rem', alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0 }}>👤</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'1.3rem', fontWeight:700 }}>{prefs.name}</div>
            <div style={{ opacity:.85 }}>{prefs.email}</div>
            <div style={{ display:'flex', gap:'.5rem', marginTop:'.5rem', flexWrap:'wrap' }}>
              <span style={{ background:'rgba(255,255,255,.15)', padding:'.2rem .65rem', borderRadius:20, fontSize:'.78rem' }}>❤️ {wishlist.length} Wishlist</span>
              <span style={{ background:'rgba(255,255,255,.15)', padding:'.2rem .65rem', borderRadius:20, fontSize:'.78rem' }}>🔔 {priceAlerts.length} Alerts</span>
              <span style={{ background:'rgba(255,255,255,.15)', padding:'.2rem .65rem', borderRadius:20, fontSize:'.78rem' }}>💰 Budget: {formatPrice(prefs.budget_min)}–{formatPrice(prefs.budget_max)}</span>
            </div>
          </div>
          <span style={{ background:'rgba(255,255,255,.15)', padding:'.25rem .75rem', borderRadius:20, fontSize:'.78rem', border:'1px solid rgba(255,255,255,.3)' }}>Demo Account</span>
        </div>

        {/* Tab nav */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', borderBottom:'2px solid var(--border)', paddingBottom:'.5rem', flexWrap:'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:'.5rem 1rem', borderRadius:'var(--radius-sm) var(--radius-sm) 0 0', border:'none',
              background: activeTab===t.id ? '#fff' : 'transparent',
              color: activeTab===t.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab===t.id ? 700 : 500,
              fontSize:'.9rem', cursor:'pointer', borderBottom: activeTab===t.id ? '2px solid var(--primary)' : 'none',
              marginBottom:-2
            }}>{t.label}</button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h3 style={{ fontWeight:700, fontSize:'1rem' }}>Shopping Preferences</h3>
              <div style={{ display:'flex', gap:'.5rem' }}>
                {editing ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Preferences</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setDraft(prefs); setEditing(false); }}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => { setDraft(prefs); setEditing(true); }}>✏️ Edit</button>
                )}
              </div>
            </div>

            {saved && <div className="toast success" style={{ position:'static', marginBottom:'1rem' }}>✓ Preferences saved successfully!</div>}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="prefs-grid">
              {/* Categories */}
              <div>
                <label style={{ fontWeight:600, fontSize:'.9rem', display:'block', marginBottom:'.75rem' }}>📂 Preferred Categories</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                  {CATEGORIES.map(cat => {
                    const active = (editing ? draft : prefs).preferred_categories.includes(cat);
                    return (
                      <button key={cat} disabled={!editing} onClick={() => toggleCategory(cat)} className={`chip ${active ? 'chip-primary' : ''}`} style={{ cursor: editing ? 'pointer' : 'default', border:'none', opacity: editing && !active ? .6 : 1 }}>
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label style={{ fontWeight:600, fontSize:'.9rem', display:'block', marginBottom:'.75rem' }}>💰 Budget Range</label>
                <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginBottom:'.25rem' }}>Min</div>
                    <input type="number" disabled={!editing} value={(editing ? draft : prefs).budget_min} onChange={e => setDraft(d=>({...d,budget_min:+e.target.value}))}
                      style={{ width:110, padding:'.4rem .6rem', border:'1.5px solid var(--border)', borderRadius:6, fontSize:'.88rem', outline:'none', background: editing ? '#fff' : 'var(--bg-surface)' }} />
                  </div>
                  <span style={{ color:'var(--text-muted)', marginTop:'.75rem' }}>–</span>
                  <div>
                    <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginBottom:'.25rem' }}>Max</div>
                    <input type="number" disabled={!editing} value={(editing ? draft : prefs).budget_max} onChange={e => setDraft(d=>({...d,budget_max:+e.target.value}))}
                      style={{ width:110, padding:'.4rem .6rem', border:'1.5px solid var(--border)', borderRadius:6, fontSize:'.88rem', outline:'none', background: editing ? '#fff' : 'var(--bg-surface)' }} />
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div>
                <label style={{ fontWeight:600, fontSize:'.9rem', display:'block', marginBottom:'.75rem' }}>🏷️ Preferred Brands</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', maxHeight:120, overflowY:'auto' }}>
                  {BRANDS.map(b => {
                    const active = (editing ? draft : prefs).preferred_brands.includes(b);
                    return (
                      <button key={b} disabled={!editing} onClick={() => toggleBrand(b)} className={`chip ${active ? 'chip-green' : ''}`} style={{ cursor: editing ? 'pointer' : 'default', border:'none' }}>
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Other prefs */}
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div>
                  <label style={{ fontWeight:600, fontSize:'.9rem', display:'block', marginBottom:'.5rem' }}>🌿 Sustainability Preference</label>
                  <select disabled={!editing} value={(editing ? draft : prefs).sustainability_preference} onChange={e => setDraft(d=>({...d,sustainability_preference:e.target.value}))}
                    style={{ padding:'.4rem .75rem', border:'1.5px solid var(--border)', borderRadius:6, fontSize:'.88rem', outline:'none', background: editing ? '#fff' : 'var(--bg-surface)', width:'100%' }}>
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority — eco-friendly first</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight:600, fontSize:'.9rem', display:'block', marginBottom:'.5rem' }}>⚡ Shopping Urgency</label>
                  <select disabled={!editing} value={(editing ? draft : prefs).urgency} onChange={e => setDraft(d=>({...d,urgency:e.target.value}))}
                    style={{ padding:'.4rem .75rem', border:'1.5px solid var(--border)', borderRadius:6, fontSize:'.88rem', outline:'none', background: editing ? '#fff' : 'var(--bg-surface)', width:'100%' }}>
                    <option value="low">Low — browsing, no rush</option>
                    <option value="medium">Medium — planning to buy soon</option>
                    <option value="high">High — need ASAP</option>
                  </select>
                </div>
              </div>
            </div>

            {editing && (
              <button className="btn btn-ghost btn-sm" style={{ marginTop:'1.25rem', color:'var(--accent-red)' }} onClick={() => { setDraft(DEFAULT_PREFS); }}>
                Reset to Defaults
              </button>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🤍</div>
                <h3>Your wishlist is empty</h3>
                <p style={{ marginTop:'.5rem' }}>Browse products and click the heart icon to save them here.</p>
              </div>
            ) : (
              <div className="products-grid">
                {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden' }}>
            {priceAlerts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔔</div>
                <h3>No price alerts set</h3>
                <p style={{ marginTop:'.5rem' }}>Visit Price Tracking to set alerts for products you're watching.</p>
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-surface)', borderBottom:'1px solid var(--border)' }}>
                    <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.85rem', color:'var(--text-muted)', fontWeight:600 }}>Product</th>
                    <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.85rem', color:'var(--text-muted)', fontWeight:600 }}>Target Price</th>
                    <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.85rem', color:'var(--text-muted)', fontWeight:600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {priceAlerts.map(alert => {
                    const product = DEMO_PRODUCTS.find(p => p.id === alert.productId);
                    const triggered = product && product.price <= alert.targetPrice;
                    return (
                      <tr key={alert.id} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'.75rem 1rem', fontSize:'.9rem' }}>{alert.productName}</td>
                        <td style={{ padding:'.75rem 1rem', fontWeight:700, color:'var(--primary)' }}>{formatPrice(alert.targetPrice)}</td>
                        <td style={{ padding:'.75rem 1rem' }}>
                          <span className={`chip ${triggered ? 'chip-green' : 'chip-amber'}`}>
                            {triggered ? '✅ Target Reached!' : '⏳ Watching'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:8, padding:'1rem', marginBottom:'1.25rem', fontSize:'.88rem', color:'var(--text-muted)' }}>
              💡 Personalized for: <strong>{prefs.preferred_categories.join(', ')}</strong> · Budget: <strong>{formatPrice(prefs.budget_min)}–{formatPrice(prefs.budget_max)}</strong>
            </div>
            {suggestedProducts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>No products match your current preferences. Try adjusting your budget range.</div>
            ) : (
              <div className="products-grid">
                {suggestedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@media (max-width:768px){.prefs-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
