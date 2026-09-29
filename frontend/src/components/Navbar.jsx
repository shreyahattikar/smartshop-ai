import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const NAV_LINKS = [
  { path: '/',             label: 'Home' },
  { path: '/assistant',    label: 'AI Assistant' },
  { path: '/discover',     label: 'Discover' },
  { path: '/search',       label: 'Search' },
  { path: '/compare',      label: 'Compare' },
  { path: '/reviews',      label: 'Reviews' },
  { path: '/price-tracking', label: 'Prices' },
  { path: '/dashboard',    label: 'Pulse' },
  { path: '/profile',      label: 'Profile' },
];

export default function Navbar() {
  const { wishlist, comparison } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav style={{ background:'#fff', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:1000, boxShadow:'var(--shadow-sm)' }}>
      <div className="page-container" style={{ display:'flex', alignItems:'center', height:60, gap:'1rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'.5rem', fontWeight:700, fontSize:'1.15rem', color:'var(--primary)', flexShrink:0 }}>
          <span style={{ fontSize:'1.4rem' }}>🛍️</span>
          <span>SmartShop <span style={{ color:'var(--secondary)' }}>AI</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display:'flex', gap:'.15rem', flex:1, overflowX:'auto', msOverflowStyle:'none', scrollbarWidth:'none' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} style={{
              padding:'.35rem .7rem', borderRadius:'var(--radius-sm)', fontSize:'.87rem', fontWeight:500, whiteSpace:'nowrap',
              background: location.pathname === l.path ? 'var(--primary)' : 'transparent',
              color: location.pathname === l.path ? '#fff' : 'var(--text-muted)',
              transition:'all var(--transition)'
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginLeft:'auto' }}>
          <Link to="/compare" style={{ position:'relative', padding:'.35rem .6rem', borderRadius:'var(--radius-sm)', background: comparison.length ? '#ede9fe' : 'transparent', color: comparison.length ? 'var(--secondary)' : 'var(--text-muted)', fontSize:'.87rem', fontWeight:500 }}>
            ⚖️ {comparison.length > 0 && <span style={{ background:'var(--secondary)', color:'#fff', borderRadius:'50%', fontSize:'.7rem', padding:'0 .3rem', marginLeft:'.25rem' }}>{comparison.length}</span>}
          </Link>
          <Link to="/profile" style={{ position:'relative', padding:'.35rem .6rem', borderRadius:'var(--radius-sm)', background: wishlist.length ? '#dcfce7' : 'transparent', color: wishlist.length ? 'var(--accent-green)' : 'var(--text-muted)', fontSize:'.87rem', fontWeight:500 }}>
            ❤️ {wishlist.length > 0 && <span style={{ background:'var(--accent-green)', color:'#fff', borderRadius:'50%', fontSize:'.7rem', padding:'0 .3rem', marginLeft:'.25rem' }}>{wishlist.length}</span>}
          </Link>
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ display:'none', background:'none', border:'none', fontSize:'1.5rem', color:'var(--text)', padding:'.25rem' }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background:'#fff', borderTop:'1px solid var(--border)', padding:'.75rem 1rem' }} className="mobile-menu">
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)} style={{
              display:'block', padding:'.6rem .75rem', borderRadius:'var(--radius-sm)', fontSize:'.95rem', fontWeight:500,
              background: location.pathname === l.path ? '#ede9fe' : 'transparent',
              color: location.pathname === l.path ? 'var(--secondary)' : 'var(--text)',
              marginBottom:'.2rem'
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
