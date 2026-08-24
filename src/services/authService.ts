import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { UserProfile } from '../types';

export interface StoredUser extends UserProfile {
  password?: string;
}

const REGISTERED_USERS_KEY = '@registered_users';
const CURRENT_USER_KEY = 'userData';
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Initial pre-seeded mock users for testing
const INITIAL_MOCK_USERS: StoredUser[] = [
  {
    id: '1',
    name: 'Emily Johnson',
    firstName: 'Emily',
    lastName: 'Johnson',
    username: 'emilys',
    email: 'emily.johnson@x.dummyjson.com',
    password: 'emilyspass',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield',
    profileImage: 'https://dummyjson.com/icon/emilys/128',
    gender: 'female',
    token: 'mock_token_emilys_123',
  },
  {
    id: '2',
    name: 'Alex Johnson',
    firstName: 'Alex',
    lastName: 'Johnson',
    username: 'alex',
    email: 'alex.johnson@example.com',
    password: 'password123',
    phone: '+1 (555) 987-6543',
    address: '123 Main Street, New York, NY',
    gender: 'male',
    token: 'mock_token_alex_456',
  },
];

export const authService = {
  // Get all registered users from AsyncStorage (pre-seeds defaults if empty)
  getRegisteredUsers: async (): Promise<StoredUser[]> => {
    try {
      const data = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      if (!data) {
        await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_MOCK_USERS));
        return INITIAL_MOCK_USERS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error fetching registered users:', error);
      return INITIAL_MOCK_USERS;
    }
  },

  // Register a new user
  registerUser: async (newUser: StoredUser): Promise<{ user: UserProfile; token: string }> => {
    try {
      const users = await authService.getRegisteredUsers();
      
      const existingUser = users.find(
        (u) =>
          u.username?.toLowerCase() === newUser.username?.toLowerCase() ||
          u.email?.toLowerCase() === newUser.email?.toLowerCase()
      );

      if (existingUser) {
        throw new Error('User with this username or email already exists');
      }

      const token = `local_token_${Date.now()}`;
      const userToSave: StoredUser = {
        ...newUser,
        id: String(Date.now()),
        token,
      };

      users.push(userToSave);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

      // Set as current user session
      const { password, ...userProfile } = userToSave;
      await authService.setCurrentSession(userProfile, token);

      return { user: userProfile, token };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Authenticate login with local storage users
  loginUser: async (username: string, password: string): Promise<{ user: UserProfile; token: string }> => {
    try {
      const users = await authService.getRegisteredUsers();
      
      const foundUser = users.find(
        (u) =>
          (u.username?.toLowerCase() === username.trim().toLowerCase() ||
            u.email?.toLowerCase() === username.trim().toLowerCase()) &&
          u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid username or password');
      }

      const token = foundUser.token || `local_token_${Date.now()}`;
      const { password: _, ...userProfile } = foundUser;
      
      await authService.setCurrentSession(userProfile, token);

      return { user: userProfile, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Save current active session
  setCurrentSession: async (user: UserProfile, token: string) => {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      try {
        await EncryptedStorage.setItem(AUTH_TOKEN_KEY, token);
      } catch {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error setting current session:', error);
    }
  },

  // Update current user profile locally
  updateUserProfile: async (updatedFields: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const storedUserData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      const currentUser: UserProfile = storedUserData ? JSON.parse(storedUserData) : {};

      const updatedUser: UserProfile = {
        ...currentUser,
        ...updatedFields,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update in registered users list as well
      const users = await authService.getRegisteredUsers();
      const updatedUsers = users.map((u) => {
        if (
          (u.id && String(u.id) === String(updatedUser.id)) ||
          (u.username && u.username === updatedUser.username) ||
          (u.email && u.email === updatedUser.email)
        ) {
          return { ...u, ...updatedFields };
        }
        return u;
      });

      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile in storage:', error);
      throw error;
    }
  },

  // Clear current active session
  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      try {
        await EncryptedStorage.removeItem(AUTH_TOKEN_KEY);
        await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
      } catch (err) {
        // ignore encrypted storage failure
      }
    } catch (error) {
      console.error('Error during authService logout:', error);
    }
  },
};
