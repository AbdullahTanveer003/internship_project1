import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList, Product } from '../types';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Icon } from '../components/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Favorites'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface FavoritesScreenProps {
  navigation: FavoritesScreenNavigationProp;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { isDarkMode, favorites, removeFromFavorites, addToCart } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleProductPress(item)}
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
            source={item.image}
            style={styles.image}
            resizeMode="cover"
          />
          {item.rating ? (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => removeFromFavorites(String(item.id))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="heart" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          {item.category ? (
            <Text style={[styles.category, { color: colors.primary }]}>
              {item.category}
            </Text>
          ) : null}

          <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
            {item.name}
          </Text>

          <Text numberOfLines={2} style={[styles.description, { color: colors.textSecondary }]}>
            {item.description}
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${item.price.toFixed(2)}
            </Text>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}
              style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header - Same style as Cart screen */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favorites</Text>
        
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="heart-outline" size={56} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Favorites Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Tap the heart icon on any product to save it to your favorites list.
            </Text>
            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreButtonText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs + 2,
    right: spacing.xs + 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    fontSize: 15,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm + 2,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 1.5,
    paddingHorizontal: spacing.lg,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headerTitle,
    fontSize: 22,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodyText,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  exploreButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});