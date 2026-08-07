import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { updateProfile, isDarkMode, saveAuthToken } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.email = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      // The response contains user data directly
      const userData = response.data;

      // Store tokens securely using EncryptedStorage via AppContext
      await saveAuthToken(userData.accessToken, userData.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Update profile with all user data including image
      updateProfile({
        id: userData.id,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address?.address || '',
        profileImage: userData.image || '', 
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        username: userData.username,
        token: userData.accessToken,
        refreshToken: userData.refreshToken,
      });

      navigation.replace('MainApp');

    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || error.message || "Invalid credentials"
      );
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication will be implemented here');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Apple authentication will be implemented here');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Branding with Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Sign in to continue exploring top products
          </Text>
        </View>

        {/* Form Container */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <CustomInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            error={errors.password}
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            style={styles.signInButton}
          />

          {/* Sign Up Section */}
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.signUpLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider with OR text */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
              OR
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Login Buttons with Icons */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={handleGoogleLogin}
          >
            <Image
              source={require('../../assets/images/google-icon.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={handleAppleLogin}
          >
            <Image
              source={require('../../assets/images/apple-icon.png')}
              style={[styles.socialIcon, styles.appleIcon]}
              resizeMode="contain"
            />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  welcomeTitle: {
    ...typography.headerTitle,
    fontSize: 26,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...typography.bodyText,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  signInButton: {
    marginTop: spacing.sm,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  signUpText: {
    ...typography.bodyText,
  },
  signUpLink: {
    ...typography.bodyText,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...typography.bodyText,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  appleIcon: {
    width: 24,
    height: 24,
  },
  socialButtonText: {
    ...typography.bodyText,
    fontSize: 16,
    fontWeight: '500',
  },
});