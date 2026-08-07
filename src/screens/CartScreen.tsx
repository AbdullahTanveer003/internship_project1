import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Icon } from '../components/Icon';
import { CustomButton } from '../components/CustomButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Toast Component - Simple white box at bottom
const Toast: React.FC<{
  message: string;
  visible: boolean;
  onHide: () => void;
  isDarkMode: boolean;
}> = ({ message, visible, onHide, isDarkMode }) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show toast from bottom
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF',
          borderColor: isDarkMode ? '#444' : '#E0E0E0',
          transform: [{ translateY }],
          opacity,
          shadowColor: isDarkMode ? '#000' : '#000',
        },
      ]}
    >
      <Text 
        style={[
          styles.toastText, 
          { 
            color: isDarkMode ? '#FFFFFF' : '#333333' 
          }
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

// Separate component for each cart item with swipe functionality
const SwipeableCartItem: React.FC<{
  item: CartItem;
  onDelete: (id: string, productName: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  colors: any;
}> = ({ item, onDelete, onUpdateQuantity, colors }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          pan.x.setValue(gestureState.dx);
        } else {
          pan.x.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80) {
          // Swipe threshold met - delete directly with animation
          Animated.timing(pan.x, {
            toValue: -400,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            // Delete the item after animation completes with product name
            onDelete(item.product.id, item.product.name);
          });
        } else {
          // Reset position
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.itemWrapper}>
      <Animated.View
        style={[
          styles.cartItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={item.product.image}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>
            ${item.product.price.toFixed(2)}
          </Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.border }]}
              onPress={() => onUpdateQuantity(item.product.id, -1)}
            >
              <Icon name="remove" size={16} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.quantityText, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.border }]}
              onPress={() => onUpdateQuantity(item.product.id, 1)}
            >
              <Icon name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onDelete(item.product.id, item.product.name)}
        >
          <Icon name="trash-outline" size={22} color={colors.error} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isDarkMode,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useApp();

  const colors = isDarkMode ? darkColors : lightColors;
  const totalPrice = getCartTotal();
  const itemCount = getCartItemCount();

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Reset empty state when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      setShowEmptyState(false);
    }
  }, [cart]);

  const handleDeleteItem = (productId: string, productName: string) => {
    // Check if this is the last item
    const isLastItem = cart.length === 1;
    
    // Show toast message
    setToastMessage(`${productName} removed from cart`);
    setToastVisible(true);
    
    // Remove item from cart
    removeFromCart(productId);
    
    // If it's the last item, show empty state after a delay
    if (isLastItem) {
      // Keep showing the cart items list until toast disappears
      setTimeout(() => {
        setShowEmptyState(true);
      }, 2000); // Match the toast duration
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Add some products to your cart first!');
      return;
    }
    Alert.alert(
      'Checkout',
      `Total: $${totalPrice.toFixed(2)}\n\nProceed to checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Checkout',
          onPress: () => {
            Alert.alert('Success!', 'Your order has been placed!');
            clearCart();
          },
        },
      ]
    );
  };

  const handleToastHide = () => {
    setToastVisible(false);
    // If cart is empty, show empty state
    if (cart.length === 0) {
      setShowEmptyState(true);
    }
  };

  const handleStartShopping = () => {
    // Navigate back to Home tab using navigation.dispatch with reset
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainApp',
            state: {
              routes: [
                {
                  name: 'Home',
                },
              ],
            },
          },
        ],
      })
    );
  };

  // Check if we should show empty state
  if ((cart.length === 0 || showEmptyState) && !toastVisible) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.card,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={60} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <TouchableOpacity
            onPress={handleStartShopping}
          >
            <Text style={[styles.shopLink, { color: colors.primary }]}>
              Start Shopping →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Toast Notification - White box at bottom */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={handleToastHide}
        isDarkMode={isDarkMode}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Cart</Text>
        <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => (
          <SwipeableCartItem
            item={item}
            onDelete={handleDeleteItem}
            onUpdateQuantity={updateQuantity}
            colors={colors}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Checkout Bar - Hide when cart is empty */}
      {cart.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
              Total
            </Text>
            <Text style={[styles.totalPrice, { color: colors.text }]}>
              ${totalPrice.toFixed(2)}
            </Text>
          </View>

          <CustomButton
            title="Checkout"
            onPress={handleCheckout}
            style={styles.checkoutButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.headerTitle,
    fontSize: 24,
  },
  itemCount: {
    ...typography.bodyText,
    fontSize: 14,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  itemWrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  productName: {
    ...typography.bodyTextBold,
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    ...typography.priceTag,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...typography.bodyTextBold,
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    ...typography.caption,
  },
  totalPrice: {
    ...typography.priceTag,
    fontSize: 22,
  },
  checkoutButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.bodyText,
    fontSize: 16,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  shopLink: {
    ...typography.bodyTextBold,
    fontSize: 16,
  },
  // Toast styles - White box at bottom
  toastContainer: {
    position: 'absolute',
    bottom: 10,
    left: spacing.md,
    right: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    zIndex: 999,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    ...typography.bodyText,
    fontSize: 14,
    textAlign: 'center',
  },
});