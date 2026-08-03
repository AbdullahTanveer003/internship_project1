import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useColorScheme,
  TextInputProps,
} from 'react-native';
import { lightColors, darkColors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useApp } from '../context/AppContext';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const { isDarkMode } = useApp();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
          props.multiline && styles.multiline,
          style,
        ]}
        {...props}
      />
      {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.bodyTextBold,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.bodyText,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    minHeight: 48,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  errorText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
