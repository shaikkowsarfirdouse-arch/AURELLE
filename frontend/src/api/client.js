import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to outgoing requests
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aurelle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common error statuses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 and token exists, clear expired token
      if (localStorage.getItem('aurelle_token')) {
        localStorage.removeItem('aurelle_token');
        localStorage.removeItem('aurelle_user');
      }
    }
    return Promise.reject(error);
  }
);

// 1. Auth API
export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  getMe: () => client.get('/auth/me'),
  updateProfile: (data) => client.put('/auth/profile', data),
};

// 2. Products API
export const productsAPI = {
  getProducts: (params) => client.get('/products', { params }),
  getHighlights: () => client.get('/products/highlights'),
  getProductById: (idOrSlug) => client.get(`/products/${idOrSlug}`),
  createProduct: (data) => client.post('/products', data),
  updateProduct: (id, data) => client.put(`/products/${id}`, data),
  deleteProduct: (id) => client.delete(`/products/${id}`),
};

// 3. Categories API
export const categoriesAPI = {
  getCategories: () => client.get('/categories'),
  getCategoryBySlug: (slug) => client.get(`/categories/${slug}`),
  createCategory: (data) => client.post('/categories', data),
  updateCategory: (id, data) => client.put(`/categories/${id}`, data),
  deleteCategory: (id) => client.delete(`/categories/${id}`),
};

// 4. Cart API
export const cartAPI = {
  getCart: () => client.get('/cart'),
  addToCart: (data) => client.post('/cart', data),
  updateItem: (itemId, data) => client.put(`/cart/item/${itemId}`, data),
  removeItem: (itemId) => client.delete(`/cart/item/${itemId}`),
  clearCart: () => client.delete('/cart'),
};

// 5. Wishlist API
export const wishlistAPI = {
  getWishlist: () => client.get('/wishlist'),
  toggleWishlist: (productId) => client.post('/wishlist/toggle', { productId }),
  removeItem: (productId) => client.delete(`/wishlist/${productId}`),
};

// 6. Orders API
export const ordersAPI = {
  createOrder: (data) => client.post('/orders', data),
  getMyOrders: () => client.get('/orders/myorders'),
  getOrderById: (id) => client.get(`/orders/${id}`),
  getAllOrders: (params) => client.get('/orders', { params }),
  updateOrderStatus: (id, data) => client.put(`/orders/${id}/status`, data),
};

// 7. Reviews API
export const reviewsAPI = {
  getProductReviews: (productId) => client.get(`/reviews/product/${productId}`),
  createReview: (productId, data) => client.post(`/reviews/product/${productId}`, data),
  deleteReview: (id) => client.delete(`/reviews/${id}`),
};

// 8. Admin API
export const adminAPI = {
  getStats: () => client.get('/admin/stats'),
  getUsers: () => client.get('/admin/users'),
  updateUserRole: (id, role) => client.put(`/admin/users/${id}/role`, { role }),
};

// 9. Upload API
export const uploadAPI = {
  uploadImage: (formData) =>
    client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default client;

