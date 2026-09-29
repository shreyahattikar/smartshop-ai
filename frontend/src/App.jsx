import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Notification from './components/Notification';

import Home                 from './pages/Home';
import AIAssistant          from './pages/AIAssistant';
import MultimodalSearch     from './pages/MultimodalSearch';
import ProductDiscovery     from './pages/ProductDiscovery';
import ProductDetail        from './pages/ProductDetail';
import ProductComparison    from './pages/ProductComparison';
import ReviewIntelligence   from './pages/ReviewIntelligence';
import PriceTracking        from './pages/PriceTracking';
import Dashboard            from './pages/Dashboard';
import SustainabilityInsights from './pages/SustainabilityInsights';
import UserProfile          from './pages/UserProfile';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
          <Navbar />
          <main style={{ flex:1 }}>
            <ScrollToTop />
            <Routes>
              <Route path="/"                element={<Home />} />
              <Route path="/assistant"       element={<AIAssistant />} />
              <Route path="/search"          element={<MultimodalSearch />} />
              <Route path="/discover"        element={<ProductDiscovery />} />
              <Route path="/product/:id"     element={<ProductDetail />} />
              <Route path="/compare"         element={<ProductComparison />} />
              <Route path="/reviews"         element={<ReviewIntelligence />} />
              <Route path="/price-tracking"  element={<PriceTracking />} />
              <Route path="/dashboard"       element={<Dashboard />} />
              <Route path="/sustainability"  element={<SustainabilityInsights />} />
              <Route path="/profile"         element={<UserProfile />} />
              <Route path="*" element={
                <div style={{ textAlign:'center', padding:'6rem 2rem', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🔍</div>
                  <h2 style={{ marginBottom:'.5rem' }}>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" style={{ display:'inline-block', marginTop:'1.25rem' }} className="btn btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
          <Notification />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}
