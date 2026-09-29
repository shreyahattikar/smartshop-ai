import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_PRODUCTS } from '../data/demoData';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [wishlist, setWishlist]       = useState([]);
  const [comparison, setComparison]   = useState([]);
  const [notification, setNotification] = useState(null);
  const [priceAlerts, setPriceAlerts] = useState([]);

  const showNotification = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showNotification(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showNotification(`Added "${product.name}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  }, [showNotification]);

  const toggleComparison = useCallback((product) => {
    setComparison(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) {
        showNotification('You can compare up to 4 products at once', 'warning');
        return prev;
      }
      showNotification(`Added "${product.name}" to comparison`, 'info');
      return [...prev, product];
    });
  }, [showNotification]);

  const isInWishlist   = (id) => wishlist.some(p => p.id === id);
  const isInComparison = (id) => comparison.some(p => p.id === id);

  const addPriceAlert = useCallback((productId, targetPrice) => {
    const product = DEMO_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    setPriceAlerts(prev => {
      const exists = prev.some(a => a.productId === productId);
      if (exists) return prev.map(a => a.productId === productId ? { ...a, targetPrice } : a);
      return [...prev, { id: Date.now(), productId, targetPrice, productName: product.name, status: 'active' }];
    });
    showNotification(`Price alert set for ₹${targetPrice.toLocaleString('en-IN')}`, 'success');
  }, [showNotification]);

  return (
    <ShopContext.Provider value={{
      wishlist, toggleWishlist, isInWishlist,
      comparison, toggleComparison, isInComparison, setComparison,
      priceAlerts, addPriceAlert,
      notification, showNotification
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
