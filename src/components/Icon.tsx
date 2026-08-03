import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const ICON_MAP: Record<string, string> = {
  // App Logo & Header
  'bag-handle': '🛍️',
  'bag-handle-outline': '🛍️',
  'cart': '🛒',
  'cart-outline': '🛒',

  // Theme
  'sun': '☀️',
  'moon': '🌙',

  // Bottom Tabs Navigation
  'home': '🏠',
  'home-outline': '🏠',
  'person': '👤',
  'person-outline': '👤',

  // Actions & Controls
  'search-outline': '🔍',
  'close-circle': '✖',
  'arrow-back-outline': '←',
  'star': '★',
  'star-outline': '☆',
  'add': '+',
  'add-outline': '+',
  'remove': '−',
  'trash-outline': '🗑️',
  'checkmark-circle-outline': '✓',
  'save-outline': '💾',
  'camera-outline': '📷',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
}) => {
  if (name === 'arrow-back-outline' || name === 'arrow-back') {
    const lineThickness = Math.max(2, Math.round(size / 10));
    const chevronSize = Math.round(size * 0.42);
    const stemWidth = Math.round(size * 0.5);
    return (
      <View style={[styles.container, { width: size + 4, height: size + 4 }]}>
        <View style={styles.arrowRow}>
          <View
            style={{
              width: chevronSize,
              height: chevronSize,
              borderLeftWidth: lineThickness,
              borderBottomWidth: lineThickness,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginRight: -lineThickness + 1,
            }}
          />
          <View
            style={{
              width: stemWidth,
              height: lineThickness,
              backgroundColor: color,
              borderRadius: lineThickness / 2,
            }}
          />
        </View>
      </View>
    );
  }

  const symbol = ICON_MAP[name] ?? '•';
  const isSymbolChar = symbol === '+' || symbol === '−' || symbol === '✓' || symbol === '✖' || symbol === '★';

  return (
    <View style={[styles.container, { width: size + 4, height: size + 4 }]}>
      <Text
        style={[
          styles.iconText,
          {
            fontSize: isSymbolChar ? size * 0.85 : size * 0.75,
            color: isSymbolChar ? color : undefined,
          },
        ]}
      >
        {symbol}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
});
