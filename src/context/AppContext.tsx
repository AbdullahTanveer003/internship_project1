import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
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
}

const defaultUser: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const deviceScheme = useDeviceColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceScheme === 'dark');
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [cart, setCart] = useState<CartItem[]>([]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
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
        (item) => item.product.id === product.id
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
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
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
