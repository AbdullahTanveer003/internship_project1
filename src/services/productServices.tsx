import { Product } from '../types';
import { DUMMY_PRODUCTS } from '../data/products';

export const productService = {
  // Fetch all products from local dummy data
  getAllProducts: async (): Promise<Product[]> => {
    return Promise.resolve(DUMMY_PRODUCTS);
  },

  // Fetch a single product by ID from local dummy data
  getProductById: async (id: string): Promise<Product> => {
    const product = DUMMY_PRODUCTS.find((p) => String(p.id) === String(id));
    if (!product) {
      return Promise.resolve(DUMMY_PRODUCTS[0]);
    }
    return Promise.resolve(product);
  },

  // Fetch products by category from local dummy data
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    if (!category || category.toLowerCase() === 'all') {
      return Promise.resolve(DUMMY_PRODUCTS);
    }
    const filtered = DUMMY_PRODUCTS.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
    return Promise.resolve(filtered);
  },

  // Search products in local dummy data
  searchProducts: async (query: string): Promise<Product[]> => {
    const q = query.toLowerCase();
    const filtered = DUMMY_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
    return Promise.resolve(filtered);
  },

  // Get all categories dynamically from local dummy data
  getCategories: async (): Promise<string[]> => {
    const categoriesSet = new Set<string>();
    DUMMY_PRODUCTS.forEach((p) => {
      if (p.category) {
        categoriesSet.add(p.category);
      }
    });
    return Promise.resolve(['All', ...Array.from(categoriesSet)]);
  },
};