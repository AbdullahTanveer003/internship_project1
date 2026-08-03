import { ImageSourcePropType } from 'react-native';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: ImageSourcePropType;
  category?: string;
  rating?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainApp: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};
