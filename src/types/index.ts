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
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  profileImage?: string; 
  address: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  username?: string;
  token?: string;
  refreshToken?: string;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;  
  MainApp: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Cart: undefined;
  Profile: undefined;
};