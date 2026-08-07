import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { productService } from '../services/productServices';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ProductDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;

// Toast Component - Same style as cart screen
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
            color: isDarkMode ? '#FFFFFF' : '#333333',
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

export const ProductDetailScreen: React.FC<ProductDetailProps> = ({
  route,
  navigation,
}) => {
  const { product: initialProduct } = route.params;
  const { addToCart, isDarkMode, toggleFavorite, isFavorite } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isFav = isFavorite(String(product.id));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const freshProduct = await productService.getProductById(initialProduct.id);
        setProduct(freshProduct);
      } catch (error) {
        console.error('Error refreshing product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [initialProduct.id]);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Custom Header with Back, Favorite, and Cart Buttons */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={24}
              color={isFav ? "#EF4444" : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Cart' as any)}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Notification - Same style as cart screen */}
      <Toast
        message="Added to Cart!"
        visible={showToast}
        onHide={() => setShowToast(false)}
        isDarkMode={isDarkMode}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image with Gradient Overlay */}
        <View style={styles.imageWrapper}>
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />

          {/* Category and Rating on Image */}
          <View style={styles.imageBadges}>
            {product.category && (
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.categoryBadgeText}>{product.category}</Text>
              </View>
            )}
            {product.rating && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#FBBF24" />
                <Text style={styles.ratingBadgeText}>{product.rating}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.productPrice, { color: colors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={[styles.stockText, { color: colors.textSecondary }]}>
                In Stock
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description}
          </Text>

          {/* Additional Info */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Quality</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>Premium</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Warranty</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>1 Year</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="return-up-back-outline" size={22} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Returns</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>30 Days</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.bottomPriceContainer}>
          <Text style={[styles.bottomPriceLabel, { color: colors.textSecondary }]}>
            Total Price
          </Text>
          <Text style={[styles.bottomPrice, { color: colors.text }]}>
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={22} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 0 : spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Toast styles - Matching cart screen
  toastContainer: {
    position: 'absolute',
    bottom: 100, // Position above the bottom bar
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
  scrollContent: {
    paddingBottom: 100,
  },
  imageWrapper: {
    position: 'relative',
    height: 340,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageBadges: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsContainer: {
    paddingHorizontal: spacing.lg,
  },
  productName: {
    ...typography.headerTitle,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  productPrice: {
    ...typography.priceTag,
    fontSize: 28,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  stockText: {
    ...typography.bodyText,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.cardTitle,
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodyText,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 4,
  },
  infoValue: {
    ...typography.bodyTextBold,
    fontSize: 13,
    marginTop: 2,
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
  },
  bottomPriceContainer: {
    marginRight: spacing.lg,
  },
  bottomPriceLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  bottomPrice: {
    ...typography.priceTag,
    fontSize: 20,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});