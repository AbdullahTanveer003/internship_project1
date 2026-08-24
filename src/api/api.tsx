// Mock API module - Network requests removed completely for local storage operation

export const productApi = {
  getProducts: async () => ({ data: { products: [] } }),
  getProduct: async () => ({ data: {} }),
  getProductsByCategory: async () => ({ data: { products: [] } }),
  searchProducts: async () => ({ data: { products: [] } }),
};

const api = {
  get: async () => ({ data: {} }),
  post: async () => ({ data: {} }),
  put: async () => ({ data: {} }),
  delete: async () => ({ data: {} }),
};

export default api;