import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isDarkMode, getAuthToken, updateProfile } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    // Text animation (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateYAnim, {
          toValue: 0,
          friction: 4,
          tension: 30,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Check authentication token from Secure EncryptedStorage
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (token && storedUserData) {
          const userData = JSON.parse(storedUserData);
          updateProfile({
            ...userData,
            token,
          });
          
          setTimeout(() => {
            navigation.replace('MainApp');
          }, 1800);
          return;
        }
      } catch (err) {
        console.error('Error checking auth state on splash screen:', err);
      }

      setTimeout(() => {
        navigation.replace('Login');
      }, 1800);
    };

    checkAuth();
  }, [fadeAnim, scaleAnim, textFadeAnim, textTranslateYAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo Image - Simple, no container */}
        <Animated.Image
          source={require('../../assets/images/logo1.png')}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode="contain"
        />

        {/* App Name with animation */}
        <Animated.View
          style={{
            opacity: textFadeAnim,
            transform: [{ translateY: textTranslateYAnim }],
          }}
        >
          <Text style={[styles.appName, { color: colors.text }]}>ElectroMart</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Your Premium Electronics Store
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});