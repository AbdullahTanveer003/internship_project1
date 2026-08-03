import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { CartItemComponent } from '../components/CartItem';
import { CustomButton } from '../components/CustomButton';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';

type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { cart, getCartTotal, clearCart, isDarkMode } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const grandTotal = getCartTotal();

  const handleCheckoutDemo = () => {
    Alert.alert(
      'Checkout Demo',
      `Thank you for your order! Total amount: $${grandTotal.toFixed(2)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('MainApp');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="My Shopping Cart"
        showBack={true}
        showCart={false}
      />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.inputBackground }]}>
            <Icon name="cart-outline" size={64} color={colors.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Looks like you haven't added any products to your cart yet.
          </Text>
          <CustomButton
            title="Start Shopping"
            onPress={() => navigation.navigate('MainApp')}
            style={styles.shopNowBtn}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <CartItemComponent item={item} />}
          />

          {/* Cart Summary & Grand Total */}
          <View
            style={[
              styles.summaryContainer,
              {
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Items Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${grandTotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Shipping Fee
              </Text>
              <Text style={[styles.freeShipping, { color: colors.secondary }]}>
                FREE
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Grand Total
              </Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                ${grandTotal.toFixed(2)}
              </Text>
            </View>

            <CustomButton
              title="Proceed to Checkout"
              onPress={handleCheckoutDemo}
              style={styles.checkoutBtn}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.headerTitle,
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodyText,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  shopNowBtn: {
    width: 200,
  },
  summaryContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    elevation: 8,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  summaryLabel: {
    ...typography.bodyText,
  },
  summaryValue: {
    ...typography.bodyTextBold,
  },
  freeShipping: {
    ...typography.bodyTextBold,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    ...typography.headerTitle,
    fontSize: 18,
  },
  totalAmount: {
    ...typography.priceTag,
    fontSize: 22,
  },
  checkoutBtn: {
    marginTop: spacing.xs,
  },
});
