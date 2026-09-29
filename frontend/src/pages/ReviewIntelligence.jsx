import React, { useState, useMemo } from 'react';
import { DEMO_PRODUCTS, DEMO_REVIEWS } from '../data/demoData';

// Demo reviews for all products (fallback)
const FALLBACK_REVIEWS = [
  { id:100, user_name:'Aarav S.', rating:5, review_text:'Excellent product! Exceeded all expectations. Would definitely recommend.', review_date:'2024-03-10', verified_purchase:true },
  { id:101, user_name:'Priya M.', rating:4, review_text:'Really good product overall. Minor issues with the packaging but the product itself is great.', review_date:'2024-03-08', verified_purchase:true },
  { id:102, user_name:'Rohit K.', rating:3, review_text:'Average product. Works fine but nothing exceptional. Good value for money though.', review_date:'2024-03-05', verified_purchase:false },
  { id:103, user_name:'Deepika L.', rating:5, review_text:'Amazing quality! Fast delivery, exactly as described. Very happy with the purchase.', review_date:'2024-03-01', verified_purchase:true },
  { id:104, user_name:'Karthik N.', rating:2, review_text:'Disappointed. The product quality is not up to the mark. Expected better at this price point.', review_date:'2024-02-28', verified_purchase:false },
  { id:105, user_name:'Sneha P.', rating:4, review_text:'Pretty good. Battery life is excellent. The build quality could be a bit better.', review_date:'2024-02-25', verified_purchase:true },
];

function analyzeReviews(reviews) {
  const totalReviews   = reviews.length;
  const avgRating      = reviews.reduce((s,r) => s+r.rating, 0) / totalReviews;
  const positive       = reviews.filter(r => r.rating >= 4);
  const negative       = reviews.filter(r => r.rating <= 2);
  const neutral        = reviews.filter(r => r.rating === 3);

  // Common themes (simple keyword extraction)
  const posThemes = ['good quality', 'fast delivery', 'value for money', 'excellent performance', 'great battery'];
  const negThemes = ['packaging issues', 'slow delivery', 'build quality concerns', 'overpriced'];

  // Suspicious indicators (heuristic)
  const veryShort      = reviews.filter(r => r.review_text.length < 25).length;
  const unverified     = reviews.filter(r => !r.verified_purchase).length;
  const texts          = reviews.map(r => r.review_text.toLowerCase().trim());
  const uniqueTexts    = new Set(texts).size;
  const duplicateRatio = 1 - uniqueTexts / texts.length;

  const suspiciousIndicators = [];
  if (veryShort / totalReviews > 0.3)  suspiciousIndicators.push(`${Math.round(veryShort/totalReviews*100)}% of reviews are very short (less than 25 characters)`);
  if (duplicateRatio > 0.1)             suspiciousIndicators.push('Some reviews appear very similar to each other');
  if (unverified / totalReviews > 0.5) suspiciousIndicators.push(`${Math.round(unverified/totalReviews*100)}% of reviews are from unverified purchases`);

  return {
    totalReviews, avgRating,
    positivePercent: Math.round(positive.length/totalReviews*100),
    negativePercent: Math.round(negative.length/totalReviews*100),
    neutralPercent:  Math.round(neutral.length/totalReviews*100),
    positive, negative,
    posThemes: posThemes.slice(0, positive.length > 2 ? 4 : 2),
    negThemes: negThemes.slice(0, negative.length > 1 ? 3 : 1),
    suspiciousIndicators,
    hasSuspicious: suspiciousIndicators.length > 0
  };
}

function StarBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round(count/total*100) : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.4rem' }}>
      <span style={{ fontSize:'.82rem', color:'var(--text-muted)', width:60 }}>{label}</span>
      <div style={{ flex:1, background:'var(--border)', borderRadius:4, height:8, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, background:color, height:'100%', borderRadius:4, transition:'width .4s' }} />
      </div>
      <span style={{ fontSize:'.82rem', color:'var(--text-muted)', width:35 }}>{pct}%</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const color = review.rating >= 4 ? '#16a34a' : review.rating === 3 ? '#d97706' : '#dc2626';
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'1rem', marginBottom:'.75rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.5rem', flexWrap:'wrap', gap:'.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--secondary))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.85rem' }}>{review.user_name?.[0]}</div>
          <span style={{ fontWeight:600, fontSize:'.9rem' }}>{review.user_name}</span>
          {review.verified_purchase && <span className="chip chip-green" style={{ fontSize:'.72rem', padding:'.1rem .4rem' }}>✓ Verified</span>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
          <span style={{ color, fontWeight:700 }}>{stars}</span>
          <span style={{ fontSize:'.78rem', color:'var(--text-muted)' }}>{review.review_date}</span>
        </div>
      </div>
      <p style={{ fontSize:'.88rem', lineHeight:1.6, color:'var(--text)' }}>{review.review_text}</p>
    </div>
  );
}

export default function ReviewIntelligence() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const reviews = useMemo(() => {
    if (!selectedProduct) return [];
    return DEMO_REVIEWS[selectedProduct.id] || FALLBACK_REVIEWS;
  }, [selectedProduct]);

  const analysis = useMemo(() => {
    if (!analyzed || reviews.length === 0) return null;
    return analyzeReviews(reviews);
  }, [analyzed, reviews]);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => { setAnalyzed(true); setLoading(false); }, 1000);
  };

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div className="page-header">
          <h1>⭐ Review Intelligence</h1>
          <p>AI-powered review analysis with fake review detection <span className="demo-badge">Demo Mode</span></p>
        </div>

        {/* Product Selector */}
        <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem', marginBottom:'1.5rem' }}>
          <h3 style={{ marginBottom:'1rem', fontSize:'1rem' }}>Select a product to analyze reviews</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'.75rem', maxHeight:300, overflowY:'auto' }}>
            {DEMO_PRODUCTS.map(p => (
              <button key={p.id} onClick={() => { setSelectedProduct(p); setAnalyzed(false); }} style={{
                textAlign:'left', padding:'.75rem', borderRadius:8,
                border: selectedProduct?.id === p.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: selectedProduct?.id === p.id ? '#ede9fe' : '#fff',
                cursor:'pointer', transition:'all .2s'
              }}>
                <div style={{ fontWeight:600, fontSize:'.88rem', marginBottom:'.25rem' }}>{p.name}</div>
                <div style={{ color:'var(--primary)', fontSize:'.82rem' }}>{p.rating}★ ({p.review_count.toLocaleString('en-IN')} reviews)</div>
                <div style={{ color:'var(--text-muted)', fontSize:'.78rem' }}>{p.category}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }} className="review-layout">
            {/* Left: Reviews */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'.5rem' }}>
                <h3 style={{ fontSize:'1rem', fontWeight:700 }}>📝 Reviews for {selectedProduct.name}</h3>
                <button className="btn btn-primary btn-sm" onClick={handleAnalyze} disabled={loading || analyzed}>
                  {loading ? '🔍 Analyzing...' : analyzed ? '✓ Analyzed' : '🤖 Analyze with AI'}
                </button>
              </div>
              {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>

            {/* Right: Analysis */}
            <div>
              {!analyzed ? (
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🤖</div>
                  <p>Click "Analyze with AI" to run review analysis</p>
                  <div className="disclaimer" style={{ marginTop:'1rem', textAlign:'left' }}>
                    <strong>IBM Granite Demo:</strong> In demo mode, analysis uses local algorithms. Connect IBM Granite for advanced NLP insights.
                  </div>
                </div>
              ) : analysis && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  {/* Summary Stats */}
                  <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
                    <h4 style={{ marginBottom:'1rem' }}>📊 Sentiment Analysis</h4>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                      <div style={{ width:70, height:70, borderRadius:'50%', background:`conic-gradient(#16a34a ${analysis.positivePercent*3.6}deg, var(--border) 0)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ width:55, height:55, borderRadius:'50%', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                          <span style={{ fontSize:'1.1rem', fontWeight:700, color:'#16a34a' }}>{analysis.positivePercent}%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize:'.88rem' }}>Avg Rating: <strong>{analysis.avgRating.toFixed(1)}★</strong></div>
                        <div style={{ fontSize:'.88rem', color:'var(--text-muted)' }}>{analysis.totalReviews} reviews analyzed</div>
                      </div>
                    </div>
                    <StarBar label="Positive" count={analysis.positivePercent} total={100} color="#16a34a" />
                    <StarBar label="Neutral"  count={analysis.neutralPercent}  total={100} color="#d97706" />
                    <StarBar label="Negative" count={analysis.negativePercent} total={100} color="#dc2626" />
                  </div>

                  {/* Common Themes */}
                  <div style={{ background:'#fff', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'1.25rem' }}>
                    <h4 style={{ marginBottom:'.75rem' }}>💬 Common Themes</h4>
                    <div style={{ marginBottom:'.75rem' }}>
                      <div style={{ fontSize:'.82rem', color:'#166534', fontWeight:600, marginBottom:'.4rem' }}>👍 Praised</div>
                      <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
                        {analysis.posThemes.map(t => <span key={t} className="chip chip-green">{t}</span>)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize:'.82rem', color:'#991b1b', fontWeight:600, marginBottom:'.4rem' }}>👎 Concerns</div>
                      <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
                        {analysis.negThemes.map(t => <span key={t} className="chip chip-amber">{t}</span>)}
                      </div>
                    </div>
                  </div>

                  {/* Fake Review Detection */}
                  <div style={{ background: analysis.hasSuspicious ? '#fff7ed' : '#f0fdf4', borderRadius:'var(--radius)', border:`1px solid ${analysis.hasSuspicious ? '#fed7aa' : '#bbf7d0'}`, padding:'1.25rem' }}>
                    <h4 style={{ marginBottom:'.75rem', color: analysis.hasSuspicious ? '#92400e' : '#166534' }}>
                      {analysis.hasSuspicious ? '⚠️ Potential Review Concerns' : '✅ No Major Concerns Detected'}
                    </h4>
                    {analysis.hasSuspicious ? (
                      <ul style={{ paddingLeft:'1rem', fontSize:'.88rem', color:'#92400e' }}>
                        {analysis.suspiciousIndicators.map((ind, i) => <li key={i} style={{ marginBottom:'.3rem' }}>{ind}</li>)}
                      </ul>
                    ) : (
                      <p style={{ fontSize:'.88rem', color:'#166534' }}>Reviews appear generally authentic based on available indicators.</p>
                    )}
                    <div style={{ marginTop:'.75rem', fontSize:'.78rem', color:'var(--text-muted)', fontStyle:'italic' }}>
                      ⚠️ Disclaimer: These are potential indicators only, not definitive proof of fake reviews. This system may contain errors and should be used as one of many factors in your purchasing decision.
                    </div>
                  </div>

                  <div className="disclaimer">
                    <strong>Demo Mode:</strong> Analysis uses local heuristics. IBM Granite Models would provide deeper NLP analysis, context understanding, and pattern detection across larger review datasets.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width:768px){ .review-layout{grid-template-columns:1fr!important;} }`}</style>
    </div>
  );
}
