import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { CustomButton } from '../components/CustomButton';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';

type ProductDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;

export const ProductDetailScreen: React.FC<ProductDetailProps> = ({
  route,
}) => {
  const { product } = route.params;
  const { addToCart, isDarkMode } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={product.name}
        subtitle="Product Details"
        showBack={true}
        showCart={true}
      />

      {/* Confirmation Toast */}
      {showToast ? (
        <View style={[styles.toast, { backgroundColor: colors.success }]}>
          <Icon name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.toastText}>Added to Cart!</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Product Image */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Image
            source={product.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Product Details */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.headerRow}>
            {product.category ? (
              <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {product.category}
                </Text>
              </View>
            ) : null}

            {product.rating ? (
              <View style={styles.ratingRow}>
                <Icon name="star" size={16} color="#FBBF24" />
                <Text style={[styles.ratingValue, { color: colors.text }]}>
                  {product.rating}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {product.name}
          </Text>

          <Text style={[styles.price, { color: colors.primary }]}>
            ${product.price.toFixed(2)}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            Price
          </Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <CustomButton
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addToCartBtn}
          icon={<Icon name="cart-outline" size={20} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    top: 65,
    left: spacing.md,
    right: spacing.md,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toastText: {
    color: '#FFFFFF',
    ...typography.bodyTextBold,
    marginLeft: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    ...typography.bodyTextBold,
    marginLeft: 4,
  },
  title: {
    ...typography.headerTitle,
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.priceTag,
    fontSize: 24,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  sectionHeading: {
    ...typography.cardTitle,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodyText,
    lineHeight: 22,
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
  priceContainer: {
    marginRight: spacing.lg,
  },
  totalLabel: {
    ...typography.caption,
  },
  totalPrice: {
    ...typography.priceTag,
    fontSize: 20,
  },
  addToCartBtn: {
    flex: 1,
  },
});
