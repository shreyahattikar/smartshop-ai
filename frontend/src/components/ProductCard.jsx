import React from 'react';
import { formatPrice, getSustainabilityLabel } from '../data/demoData';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

function StarRating({ rating }) {
  return (
    <span className="product-card-rating">
      <span className="star">★</span>
      <span>{rating}</span>
    </span>
  );
}

export default function ProductCard({ product, compact = false }) {
  const { toggleWishlist, toggleComparison, isInWishlist, isInComparison } = useShop();
  const { label: sLabel, color: sColor } = getSustainabilityLabel(product.sustainability_score);
  const inWish = isInWishlist(product.id);
  const inComp = isInComparison(product.id);

  return (
    <div className="card product-card">
      <div style={{ position:'relative' }}>
        <img
          src={product.image_url}
          alt={product.name}
          className="product-card-img"
          onError={e => { e.target.src = `https://placehold.co/400x200/e2e8f0/64748b?text=${encodeURIComponent(product.category)}`; }}
        />
        {product.discount_percent > 0 && (
          <span style={{ position:'absolute', top:'.5rem', left:'.5rem', background:'#dc2626', color:'#fff', fontSize:'.72rem', fontWeight:700, padding:'.2rem .5rem', borderRadius:4 }}>
            -{product.discount_percent}%
          </span>
        )}
        <button
          className={`wishlist-btn${inWish ? ' active' : ''}`}
          onClick={() => toggleWishlist(product)}
          title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWish ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>

        <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:'.2rem', margin:'.4rem 0' }}>
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.original_price > product.price && (
            <span className="product-card-original">{formatPrice(product.original_price)}</span>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', flexWrap:'wrap' }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize:'.78rem', color:'var(--text-light)' }}>({product.review_count?.toLocaleString('en-IN')})</span>
          <span className="sustainability-badge" style={{ background:`${sColor}18`, color:sColor }}>
            🌿 {product.sustainability_score}
          </span>
        </div>

        {!compact && (
          <div style={{ marginTop:'.5rem' }}>
            <span className="badge-marketplace">📦 {product.marketplace}</span>
          </div>
        )}

        <div className="product-card-actions">
          <Link to={`/product/${product.id}`} className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }}>
            View Details
          </Link>
          <button
            className={`btn btn-sm ${inComp ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => toggleComparison(product)}
            title={inComp ? 'Remove from comparison' : 'Add to comparison'}
          >
            {inComp ? '✓ Added' : '⚖️'}
          </button>
        </div>
      </div>
    </div>
  );
}
