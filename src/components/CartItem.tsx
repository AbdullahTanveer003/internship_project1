import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { CartItem as CartItemType } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { isDarkMode, updateQuantity, removeFromCart } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;
  const subtotal = item.product.price * item.quantity;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Image
        source={item.product.image}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text
            numberOfLines={1}
            style={[styles.name, { color: colors.text }]}
          >
            {item.product.name}
          </Text>
          <TouchableOpacity
            onPress={() => removeFromCart(item.product.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.unitPrice, { color: colors.textSecondary }]}>
          ${item.product.price.toFixed(2)} each
        </Text>

        <View style={styles.footerRow}>
          {/* Quantity Controls */}
          <View style={[styles.quantityContainer, { borderColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.product.id, -1)}
              style={[styles.qtyButton, { backgroundColor: colors.inputBackground }]}
            >
              <Icon name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.qtyText, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.product.id, 1)}
              style={[styles.qtyButton, { backgroundColor: colors.inputBackground }]}
            >
              <Icon name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Subtotal */}
          <Text style={[styles.subtotal, { color: colors.primary }]}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: '#F3F4F6',
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.cardTitle,
    flex: 1,
    marginRight: spacing.xs,
  },
  unitPrice: {
    ...typography.caption,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  qtyButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    ...typography.bodyTextBold,
    paddingHorizontal: spacing.sm + 2,
  },
  subtotal: {
    ...typography.priceTag,
    fontSize: 16,
  },
});
