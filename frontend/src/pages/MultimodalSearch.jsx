import React, { useState, useRef, useCallback } from 'react';
import { DEMO_PRODUCTS } from '../data/demoData';
import ProductCard from '../components/ProductCard';

// ── Text Search Tab ────────────────────────────────────────────
function TextSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const q2 = q.toLowerCase();
      const found = DEMO_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q2) ||
        p.category.toLowerCase().includes(q2) ||
        p.tags.toLowerCase().includes(q2) ||
        p.description.toLowerCase().includes(q2) ||
        p.brand.toLowerCase().includes(q2)
      );
      setResults({ products: found, query: q });
      setLoading(false);
    }, 600);
  };

  const exampleQueries = [
    'Black running shoes under ₹3,000',
    'Best laptop for programming',
    'Wireless headphones with ANC',
    'Budget smartphone',
    'Apple products',
    'Smartwatch with health tracking',
  ];

  return (
    <div>
      <form onSubmit={e => { e.preventDefault(); handleSearch(); }} style={{ marginBottom:'1.5rem' }}>
        <div className="search-bar" style={{ marginBottom:'1rem', maxWidth:600 }}>
          <span style={{ fontSize:'1.2rem' }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Try "Black running shoes under ₹3,000" or "laptop for programming"'
          />
          <button type="submit" className="btn btn-primary" disabled={!query.trim() || loading}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'.82rem', color:'var(--text-muted)', alignSelf:'center' }}>Try:</span>
          {exampleQueries.map(q => (
            <button key={q} type="button" className="chip chip-primary" onClick={() => { setQuery(q); handleSearch(q); }} style={{ cursor:'pointer', border:'none' }}>{q}</button>
          ))}
        </div>
      </form>

      {results && (
        <div>
          <div style={{ marginBottom:'1rem', color:'var(--text-muted)', fontSize:'.9rem' }}>
            Found <strong>{results.products.length}</strong> products for "{results.query}" <span className="demo-badge">Demo Catalog</span>
          </div>
          {results.products.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'2rem', marginBottom:'.75rem' }}>🔍</div>
              <p>No products found for "{results.query}". Try a different search term.</p>
            </div>
          ) : (
            <div className="products-grid">
              {results.products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Image Search Tab ───────────────────────────────────────────
function ImageSearch() {
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const fileRef = useRef();

  const handleFile = useCallback((file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload a valid image file (JPG, PNG, WEBP)'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be smaller than 5MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResults(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleSearch = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => {
      // Demo: return shuffled products as "similar"
      const similar = [...DEMO_PRODUCTS].sort(() => Math.random() - .5).slice(0, 6);
      setResults(similar);
      setLoading(false);
    }, 1200);
  };

  return (
    <div>
      <div className="disclaimer">
        <strong>ℹ️ Demo Mode:</strong> Image recognition requires a vision API (e.g., IBM Vision or Google Vision). In demo mode, we return sample similar products. Upload any image to try the interface.
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current.click()}
        style={{ border:'2px dashed var(--primary)', borderRadius:'var(--radius)', padding:'2.5rem', textAlign:'center', cursor:'pointer', background: preview ? 'transparent' : '#f5f3ff', transition:'all .2s', marginBottom:'1.25rem' }}
        onMouseEnter={e => e.currentTarget.style.background='#ede9fe'}
        onMouseLeave={e => e.currentTarget.style.background = preview ? 'transparent' : '#f5f3ff'}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
        {preview ? (
          <div>
            <img src={preview} alt="Preview" style={{ maxHeight:250, maxWidth:'100%', borderRadius:8, marginBottom:'.75rem', objectFit:'contain' }} />
            <div style={{ color:'var(--text-muted)', fontSize:'.88rem' }}>Image uploaded. Click to change.</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>📷</div>
            <div style={{ fontWeight:600, marginBottom:'.5rem' }}>Drop an image here or click to upload</div>
            <div style={{ color:'var(--text-muted)', fontSize:'.88rem' }}>JPG, PNG, WEBP — max 5MB</div>
          </div>
        )}
      </div>

      {error && <div className="toast error" style={{ position:'static', marginBottom:'.75rem' }}>{error}</div>}

      {image && (
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ marginBottom:'1.5rem' }}>
          {loading ? '🔍 Searching...' : '🔍 Find Similar Products'}
        </button>
      )}

      {results && (
        <div>
          <div style={{ marginBottom:'1rem', color:'var(--text-muted)', fontSize:'.9rem' }}>
            Showing visually similar products (demo) <span className="demo-badge">Simulated Results</span>
          </div>
          <div className="products-grid">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Voice Search Tab ───────────────────────────────────────────
function VoiceSearch() {
  const [status, setStatus]       = useState('idle'); // idle | listening | done | error | unsupported
  const [transcript, setTranscript] = useState('');
  const [results, setResults]     = useState(null);
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = Boolean(SpeechRecognition);

  const startListening = useCallback(() => {
    if (!supported) { setStatus('unsupported'); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    recognitionRef.current = rec;

    rec.onstart  = () => setStatus('listening');
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onerror  = () => setStatus('error');
    rec.onend    = () => {
      setStatus('done');
      if (transcript) performSearch(transcript);
    };
    rec.start();
    setStatus('listening');
  }, [supported, transcript]);

  const performSearch = (text) => {
    const q = text.toLowerCase();
    const found = DEMO_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
      p.tags.includes(q) || p.description.toLowerCase().includes(q)
    );
    setResults(found.length ? found : DEMO_PRODUCTS.sort(() => Math.random()-.5).slice(0, 4));
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div>
      {!supported ? (
        <div className="disclaimer">
          <strong>⚠️ Voice Search Unavailable:</strong> Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari. You can still use Text Search or Image Search.
        </div>
      ) : (
        <div>
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <button
              onClick={status === 'listening' ? stopListening : startListening}
              style={{
                width:100, height:100, borderRadius:'50%', border:'none',
                background: status === 'listening' ? '#ef4444' : 'linear-gradient(135deg,var(--primary),var(--secondary))',
                color:'#fff', fontSize:'2rem', cursor:'pointer', boxShadow:'0 4px 20px rgba(79,70,229,.3)',
                transition:'all .3s', transform: status === 'listening' ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {status === 'listening' ? '⏹' : '🎤'}
            </button>
            <div style={{ marginTop:'1.25rem', fontWeight:600, color: status === 'listening' ? '#ef4444' : 'var(--text)' }}>
              {status === 'idle'        && 'Click the microphone to start'}
              {status === 'listening'   && '🔴 Listening... (click to stop)'}
              {status === 'done'        && '✅ Done! Processing your query...'}
              {status === 'error'       && '⚠️ Recognition error. Please try again.'}
              {status === 'unsupported' && 'Not supported in this browser'}
            </div>
            {transcript && (
              <div style={{ marginTop:'1rem', background:'var(--bg-surface)', borderRadius:8, padding:'.75rem 1.25rem', display:'inline-block', fontStyle:'italic', color:'var(--text-muted)' }}>
                "{transcript}"
              </div>
            )}
          </div>
          <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'.88rem', marginBottom:'1.5rem' }}>
            Try saying: <em>"Find a laptop suitable for programming under 50,000 rupees"</em>
          </div>
        </div>
      )}

      {results && (
        <div>
          <div style={{ marginBottom:'1rem', color:'var(--text-muted)', fontSize:'.9rem' }}>
            Results for: "<strong>{transcript}</strong>" <span className="demo-badge">Demo Catalog</span>
          </div>
          <div className="products-grid">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main MultimodalSearch Page ─────────────────────────────────
export default function MultimodalSearch() {
  const [activeTab, setActiveTab] = useState('text');

  const tabs = [
    { id:'text',  label:'✍️ Text Search',  desc:'Natural language search' },
    { id:'image', label:'📷 Image Search', desc:'Upload product photo' },
    { id:'voice', label:'🎤 Voice Search', desc:'Speak your query' },
  ];

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div className="page-header">
          <h1>🔍 Multimodal Search</h1>
          <p>Find products using text, images, or your voice</p>
        </div>

        {/* Tab selector */}
        <div style={{ display:'flex', gap:'.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:'.75rem 1.5rem', borderRadius:'var(--radius)', border:'2px solid',
              borderColor: activeTab === t.id ? 'var(--primary)' : 'var(--border)',
              background: activeTab === t.id ? 'var(--primary)' : '#fff',
              color: activeTab === t.id ? '#fff' : 'var(--text)',
              fontWeight:600, cursor:'pointer', transition:'all .2s'
            }}>
              <div>{t.label}</div>
              <div style={{ fontSize:'.78rem', opacity:.8, fontWeight:400 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.5rem' }}>
          {activeTab === 'text'  && <TextSearch />}
          {activeTab === 'image' && <ImageSearch />}
          {activeTab === 'voice' && <VoiceSearch />}
        </div>
      </div>
    </div>
  );
}
