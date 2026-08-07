import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Product } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { isDarkMode, addToCart, toggleFavorite, isFavorite } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;
  const isFav = isFavorite(String(product.id));

  const handleQuickAdd = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleFavoriteToggle = (e: any) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.inputBackground }]}>
        <Image
          source={product.image}
          style={styles.image}
          resizeMode="cover"
        />
        {product.rating ? (
          <View style={[styles.ratingBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Icon name="star" size={12} color="#FBBF24" />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.favButton}
          onPress={handleFavoriteToggle}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={18}
            color={isFav ? "#EF4444" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {product.category ? (
          <Text style={[styles.category, { color: colors.primary }]}>
            {product.category}
          </Text>
        ) : null}
        <Text
          numberOfLines={1}
          style={[styles.name, { color: colors.text }]}
        >
          {product.name}
        </Text>
        
        <Text
          numberOfLines={2}
          style={[styles.description, { color: colors.textSecondary }]}
        >
          {product.description}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.text }]}>
            ${product.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            onPress={handleQuickAdd}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="add-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    width: '48%',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.xs + 2,
    left: spacing.xs + 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs + 2,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  favButton: {
    position: 'absolute',
    top: spacing.xs + 2,
    right: spacing.xs + 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  infoContainer: {
    padding: spacing.sm + 2,
    justifyContent: 'space-between',
    flex: 1,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    ...typography.cardTitle,
    fontSize: 15,
    marginBottom: 4,
  },
  description: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  price: {
    ...typography.priceTag,
    fontSize: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
