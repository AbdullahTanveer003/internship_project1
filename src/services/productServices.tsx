import api from '../api/api';
import { Product } from '../types';

// Transform DummyJSON product to our Product type
const transformProduct = (dummyProduct: any): Product => ({
  id: String(dummyProduct.id),
  name: dummyProduct.title,
  price: dummyProduct.price,
  description: dummyProduct.description,
  image: { uri: dummyProduct.thumbnail },
  category: dummyProduct.category,
  rating: dummyProduct.rating,
});

export const productService = {
  // Fetch all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch a single product by ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return transformProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Fetch products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await api.get(`/products/search?q=${query}`);
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};