import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEMO_PRODUCTS, CATEGORIES, formatPrice } from '../data/demoData';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value:'relevance', label:'Relevance' },
  { value:'price_asc', label:'Price: Low to High' },
  { value:'price_desc', label:'Price: High to Low' },
  { value:'rating', label:'Highest Rated' },
  { value:'discount', label:'Biggest Discount' },
  { value:'reviews', label:'Most Reviewed' },
];

const BRANDS  = [...new Set(DEMO_PRODUCTS.map(p => p.brand))].sort();
const MARKETS = [...new Set(DEMO_PRODUCTS.map(p => p.marketplace))].sort();

export default function ProductDiscovery() {
  const [searchParams] = useSearchParams();
  const initSearch  = searchParams.get('search') || '';
  const initCat     = searchParams.get('category') || '';

  const [search,    setSearch]   = useState(initSearch);
  const [searchInput, setSearchInput] = useState(initSearch);
  const [category,  setCategory] = useState(initCat);
  const [sortBy,    setSortBy]   = useState('relevance');
  const [minPrice,  setMinPrice] = useState(0);
  const [maxPrice,  setMaxPrice] = useState(200000);
  const [minRating, setMinRating] = useState(0);
  const [brands,    setBrands]   = useState([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [minSust,   setMinSust]  = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSearch(initSearch); setSearchInput(initSearch); }, [initSearch]);
  useEffect(() => { setCategory(initCat); }, [initCat]);

  const filtered = useMemo(() => {
    let list = [...DEMO_PRODUCTS];
    if (search)      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.tags.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (category)    list = list.filter(p => p.category === category);
    if (brands.length) list = list.filter(p => brands.includes(p.brand));
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (minRating)   list = list.filter(p => p.rating >= minRating);
    if (minDiscount) list = list.filter(p => p.discount_percent >= minDiscount);
    if (minSust)     list = list.filter(p => p.sustainability_score >= minSust);

    switch (sortBy) {
      case 'price_asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price_desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating':     list.sort((a,b) => b.rating - a.rating); break;
      case 'discount':   list.sort((a,b) => b.discount_percent - a.discount_percent); break;
      case 'reviews':    list.sort((a,b) => b.review_count - a.review_count); break;
      default: list.sort((a,b) => (b.rating * Math.log(b.review_count+1)) - (a.rating * Math.log(a.review_count+1)));
    }
    return list;
  }, [search, category, brands, minPrice, maxPrice, minRating, minDiscount, minSust, sortBy]);

  const toggleBrand = (b) => setBrands(prev => prev.includes(b) ? prev.filter(x=>x!==b) : [...prev, b]);

  const resetFilters = () => {
    setSearch(''); setSearchInput(''); setCategory(''); setSortBy('relevance');
    setMinPrice(0); setMaxPrice(200000); setMinRating(0); setBrands([]); setMinDiscount(0); setMinSust(0);
  };

  const Sidebar = () => (
    <div className="filter-sidebar">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <span style={{ fontWeight:700, fontSize:'.95rem' }}>Filters</span>
        <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset All</button>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4>Category</h4>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width:'100%', padding:'.4rem .6rem', borderRadius:6, border:'1px solid var(--border)', fontSize:'.88rem', outline:'none' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem', color:'var(--text-muted)', marginBottom:'.4rem' }}>
          <span>{formatPrice(minPrice)}</span><span>{formatPrice(maxPrice)}</span>
        </div>
        <input type="range" min={0} max={200000} step={1000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="range-input" style={{ width:'100%' }} />
      </div>

      {/* Rating */}
      <div className="filter-section">
        <h4>Minimum Rating</h4>
        {[0,3,3.5,4,4.5].map(r => (
          <label key={r} className="filter-option">
            <input type="radio" name="rating" checked={minRating===r} onChange={() => setMinRating(r)} />
            {r === 0 ? 'All ratings' : `★ ${r}+`}
          </label>
        ))}
      </div>

      {/* Brand */}
      <div className="filter-section">
        <h4>Brand</h4>
        <div style={{ maxHeight:150, overflowY:'auto' }}>
          {BRANDS.map(b => (
            <label key={b} className="filter-option">
              <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div className="filter-section">
        <h4>Minimum Discount</h4>
        {[0,10,20,30,50].map(d => (
          <label key={d} className="filter-option">
            <input type="radio" name="discount" checked={minDiscount===d} onChange={() => setMinDiscount(d)} />
            {d===0 ? 'No minimum' : `${d}%+ off`}
          </label>
        ))}
      </div>

      {/* Sustainability */}
      <div className="filter-section">
        <h4>🌿 Sustainability Score</h4>
        {[0,30,50,70].map(s => (
          <label key={s} className="filter-option">
            <input type="radio" name="sust" checked={minSust===s} onChange={() => setMinSust(s)} />
            {s===0 ? 'All products' : `${s}+`}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background:'var(--bg-surface)', minHeight:'calc(100vh - 60px)' }}>
      <div className="page-container">
        <div className="page-header">
          <h1>🛍️ Discover Products</h1>
          <p>Browse, filter, and find exactly what you're looking for <span className="demo-badge">Demo Data</span></p>
        </div>

        {/* Search + Sort bar */}
        <div style={{ display:'flex', gap:'.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }} style={{ flex:1, display:'flex', gap:'.5rem', minWidth:200 }}>
            <div className="search-bar" style={{ flex:1, margin:0 }}>
              <span>🔍</span>
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search products, brands, categories..." />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </div>
          </form>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:'.5rem .85rem', borderRadius:8, border:'1.5px solid var(--border)', fontSize:'.88rem', outline:'none', background:'#fff' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={() => setSidebarOpen(v=>!v)} style={{ display:'none' }} id="filter-toggle">
            ⚙️ Filters
          </button>
        </div>

        {/* Category quick filters */}
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
          <button className={`chip ${!category ? 'chip-primary' : ''}`} onClick={() => setCategory('')} style={{ cursor:'pointer', border:'none' }}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} className={`chip ${category===c ? 'chip-primary' : ''}`} onClick={() => setCategory(category===c ? '' : c)} style={{ cursor:'pointer', border:'none' }}>{c}</button>
          ))}
        </div>

        <div className="two-col">
          {/* Sidebar */}
          <div style={{ display: sidebarOpen ? 'block' : '' }}><Sidebar /></div>

          {/* Products */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <span style={{ color:'var(--text-muted)', fontSize:'.9rem' }}>
                <strong>{filtered.length}</strong> products found
                {search && ` for "${search}"`}
                {category && ` in ${category}`}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'4rem 2rem', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
                <h3 style={{ marginBottom:'.5rem' }}>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-primary" style={{ marginTop:'1rem' }} onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #filter-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
