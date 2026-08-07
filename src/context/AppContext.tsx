import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Product, CartItem, UserProfile } from '../types';

interface AppContextType {
  user: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isDarkMode: boolean;
  toggleTheme: () => void;
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  saveAuthToken: (token: string, refreshToken?: string) => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  clearAuthToken: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultUser: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield',
};

const THEME_KEY = '@theme_preference';
const FAVORITES_KEY = '@favorites_products';
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const deviceScheme = useDeviceColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceScheme === 'dark');
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference from AsyncStorage:', error);
      }
    };
    loadTheme();
  }, []);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from AsyncStorage:', error);
      }
    };
    loadFavorites();
  }, []);

  // Toggle and save theme preference to AsyncStorage
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      AsyncStorage.setItem(THEME_KEY, nextTheme ? 'dark' : 'light').catch((err) =>
        console.error('Error saving theme preference:', err)
      );
      return nextTheme;
    });
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => String(item.product.id) === String(product.id)
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.product.id) !== String(productId)));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Favorites Management
  const saveFavoritesToStorage = async (updatedFavorites: Product[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      if (prev.some((p) => String(p.id) === String(product.id))) {
        return prev;
      }
      const updated = [...prev, product];
      saveFavoritesToStorage(updated);
      return updated;
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((p) => String(p.id) !== String(productId));
      saveFavoritesToStorage(updated);
      return updated;
    });
  };

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => String(p.id) === String(product.id));
      const updated = exists
        ? prev.filter((p) => String(p.id) !== String(product.id))
        : [...prev, product];
      saveFavoritesToStorage(updated);
      return updated;
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => String(p.id) === String(productId));
  };

  // Secure Storage methods for Auth Token
  const saveAuthToken = async (token: string, refreshToken?: string) => {
    try {
      await EncryptedStorage.setItem(AUTH_TOKEN_KEY, token);
      if (refreshToken) {
        await EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Error storing secure auth token:', error);
    }
  };

  const getAuthToken = async () => {
    try {
      return await EncryptedStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting secure auth token:', error);
      return null;
    }
  };

  const clearAuthToken = async () => {
    try {
      await EncryptedStorage.removeItem(AUTH_TOKEN_KEY);
      await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing secure auth token:', error);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      // Clear secure storage
      await clearAuthToken();
      
      // Clear async storage items
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('cart');

      // Reset local app state
      clearCart();
      setUser(defaultUser);
    } catch (error) {
      console.error('Error during logout execution:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateProfile,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isDarkMode,
        toggleTheme,
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        saveAuthToken,
        getAuthToken,
        clearAuthToken,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
