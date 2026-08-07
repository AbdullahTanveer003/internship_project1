import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add product-specific API methods
export const productApi = {
  getProducts: () => api.get('/products'),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getProductsByCategory: (category: string) => api.get(`/products/category/${category}`),
  searchProducts: (query: string) => api.get(`/products/search?q=${query}`),
};

export default api;