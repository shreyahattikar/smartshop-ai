import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('smai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response normalizer
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id)          => api.get(`/products/${id}`),
  getPriceHistory: (id)  => api.get(`/products/${id}/price-history`),
  getCategories: ()      => api.get('/products/categories'),
  compare: (ids)         => api.post('/products/compare', { ids }),
  getRecommendations: (p)=> api.get('/products/recommendations', { params: p })
};

export const searchAPI = {
  text:  (q)         => api.post('/search/text', { q }),
  voice: (transcript)=> api.post('/search/voice', { transcript }),
  image: (formData)  => api.post('/search/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};

export const aiAPI = {
  chat:           (message, sessionId, conversationHistory) =>
    api.post('/ai/chat', { message, sessionId, conversationHistory }),
  compareSummary: (products, userPriorities) =>
    api.post('/ai/compare-summary', { products, userPriorities }),
  priceInsight:   (data) => api.post('/ai/price-insight', data)
};

export const reviewsAPI = {
  getByProduct: (productId) => api.get('/reviews', { params: { productId } }),
  analyze:      (productId) => api.post('/reviews/analyze', { productId })
};

export const dashboardAPI = {
  get: (userId = 1) => api.get('/dashboard', { params: { userId } })
};

export const preferencesAPI = {
  get:    (userId = 1) => api.get('/preferences', { params: { userId } }),
  update: (data)       => api.put('/preferences', data)
};

export const wishlistAPI = {
  get:    (userId = 1) => api.get('/wishlist', { params: { userId } }),
  add:    (productId)  => api.post('/wishlist', { productId }),
  remove: (productId)  => api.delete(`/wishlist/${productId}`)
};

export const alertsAPI = {
  get:    (userId = 1) => api.get('/price-alerts', { params: { userId } }),
  create: (data)       => api.post('/price-alerts', data),
  delete: (id)         => api.delete(`/price-alerts/${id}`)
};

export const authAPI = {
  demo:  () => api.post('/auth/demo'),
  login: (email, password) => api.post('/auth/login', { email, password })
};

export default api;
