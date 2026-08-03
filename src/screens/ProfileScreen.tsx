import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile, isDarkMode, toggleTheme } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setAddress(user.address);
  }, [user]);

  const handleSaveProfile = () => {
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScreenHeader title="My Profile" showBack={false} />

      {saveSuccess ? (
        <View style={[styles.successBanner, { backgroundColor: colors.success }]}>
          <Icon name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.successText}>Profile Saved Successfully!</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar Header */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
            <TouchableOpacity
              style={[styles.editBadge, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Icon name="camera-outline" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user.name || 'User Profile'}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {user.email || 'No email provided'}
          </Text>
        </View>

        {/* Theme Settings Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
              marginBottom: spacing.md,
            },
          ]}
        >
          <View style={styles.themeRow}>
            <View style={styles.themeLeft}>
              <Icon name={isDarkMode ? 'moon' : 'sun'} size={22} color={colors.primary} />
              <View style={styles.themeTextWrapper}>
                <Text style={[styles.themeTitle, { color: colors.text }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.themeSubtitle, { color: colors.textSecondary }]}>
                  {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Editable Form Card */}
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
          <Text style={[styles.formTitle, { color: colors.text }]}>
            Personal Information
          </Text>

          <CustomInput
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <CustomInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Delivery Address"
            placeholder="Enter shipping address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />

          <CustomButton
            title="Save Profile"
            onPress={handleSaveProfile}
            style={styles.saveBtn}
            icon={<Icon name="save-outline" size={20} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  successText: {
    color: '#FFFFFF',
    ...typography.bodyTextBold,
    marginLeft: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: spacing.sm,
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    ...typography.headerTitle,
    fontSize: 22,
  },
  profileEmail: {
    ...typography.caption,
    marginTop: 2,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeTextWrapper: {
    marginLeft: spacing.sm,
  },
  themeTitle: {
    ...typography.cardTitle,
    fontSize: 16,
  },
  themeSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  formTitle: {
    ...typography.sectionTitle,
    fontSize: 18,
    marginBottom: spacing.md,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
