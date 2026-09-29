import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background:'var(--text)', color:'#cbd5e1', marginTop:'4rem', padding:'2.5rem 0 1rem' }}>
      <div className="page-container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'2rem', marginBottom:'2rem' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:'1.1rem', color:'#fff', marginBottom:'.6rem' }}>🛍️ SmartShop AI</div>
            <p style={{ fontSize:'.85rem', lineHeight:1.7 }}>Your intelligent shopping companion. Shop smarter with AI-powered insights.</p>
            <div style={{ marginTop:'.75rem' }} className="demo-badge">Demo Mode Active</div>
          </div>
          <div>
            <div style={{ fontWeight:600, color:'#fff', marginBottom:'.75rem', fontSize:'.9rem' }}>Navigation</div>
            {[['/','/Home'],  ['/assistant','AI Assistant'], ['/discover','Products'], ['/compare','Compare']].map(([p,l]) =>
              <Link key={p} to={p} style={{ display:'block', fontSize:'.85rem', marginBottom:'.3rem', color:'#94a3b8' }}>{l.replace('/','')}</Link>
            )}
          </div>
          <div>
            <div style={{ fontWeight:600, color:'#fff', marginBottom:'.75rem', fontSize:'.9rem' }}>Features</div>
            {[['/reviews','Review Intelligence'],['/price-tracking','Price Tracking'],['/dashboard','Shopping Pulse'],['/sustainability','Sustainability']].map(([p,l]) =>
              <Link key={p} to={p} style={{ display:'block', fontSize:'.85rem', marginBottom:'.3rem', color:'#94a3b8' }}>{l}</Link>
            )}
          </div>
          <div>
            <div style={{ fontWeight:600, color:'#fff', marginBottom:'.75rem', fontSize:'.9rem' }}>Tech Stack</div>
            {['React.js', 'Node.js + Express', 'MySQL', 'IBM Granite Models', 'LangChain + RAG'].map(t =>
              <div key={t} style={{ fontSize:'.82rem', marginBottom:'.3rem', color:'#94a3b8' }}>• {t}</div>
            )}
          </div>
        </div>
        <div style={{ borderTop:'1px solid #334155', paddingTop:'1rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'.5rem', fontSize:'.82rem' }}>
          <span>© 2024 SmartShop AI — Intelligent Shopping Agent Demo</span>
          <span style={{ color:'#64748b' }}>Powered by IBM Granite Models · All data is for demonstration only</span>
        </div>
      </div>
    </footer>
  );
}
