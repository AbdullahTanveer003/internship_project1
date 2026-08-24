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
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { updateProfile, isDarkMode } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      fullName?: string;
      username?: string;
      email?: string;
      password?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const parts = fullName.trim().split(' ');
      const firstName = parts[0] || fullName.trim();
      const lastName = parts.slice(1).join(' ') || '';

      const { user } = await authService.registerUser({
        name: fullName.trim(),
        firstName,
        lastName,
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        password,
      });

      // Update global context profile state
      updateProfile(user);

      // Navigate directly into main application
      navigation.replace('MainApp');
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Could not register user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignInNav = () => {
    navigation.navigate('Login');
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
        {/* Header Branding */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Sign up to start exploring top products
          </Text>
        </View>

        {/* Form Card */}
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
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            error={errors.fullName}
          />

          <CustomInput
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            autoCapitalize="none"
            error={errors.username}
          />

          <CustomInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Delivery Address"
            placeholder="Enter shipping address"
            value={address}
            onChangeText={setAddress}
          />

          <CustomInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            error={errors.password}
          />

          <CustomButton
            title={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignUp}
            style={styles.signUpButton}
            disabled={loading}
          />

          {/* Sign In Navigation */}
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={handleSignInNav}>
              <Text style={[styles.signInLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
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
    width: 90,
    height: 90,
    borderRadius: 18,
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
  signUpButton: {
    marginTop: spacing.sm,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  signInText: {
    ...typography.bodyText,
  },
  signInLink: {
    ...typography.bodyText,
    fontWeight: '600',
  },
});
