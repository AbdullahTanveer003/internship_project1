import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showCart?: boolean;
  onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showCart = false,
  onBackPress,
}) => {
  const { isDarkMode, toggleTheme, getCartItemCount } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartCount = getCartItemCount();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  // Clean, consistent safe area top calculation
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 12 : 8);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          paddingTop: topInset - 10,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={[
              styles.backBtn,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
              },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="arrow-back-outline" size={18} color={colors.text} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleWrapper}>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.primary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.text }]}
          >
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.rightActions}>
        {/* Dark/Light Mode Toggle */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleTheme}
          style={[
            styles.actionBtn,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
            },
          ]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name={isDarkMode ? 'sun' : 'moon'} size={18} color={colors.text} />
        </TouchableOpacity>

        {showCart ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCartPress}
            style={[
              styles.actionBtn,
              styles.cartBtn,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="cart-outline" size={20} color={colors.text} />
            {cartCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: colors.card }]}>
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs + 2,
    borderWidth: 1,
  },
  cartBtn: {
    position: 'relative',
  },
  titleWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  title: {
    ...typography.headerTitle,
    fontSize: 18,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
