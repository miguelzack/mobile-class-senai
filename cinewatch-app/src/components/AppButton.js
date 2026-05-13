import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles/theme';

export default function AppButton({ title, onPress, variant = 'primary', small = false, disabled = false, loading = false, style, textStyle }) {
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : variant === 'success' ? colors.success : colors.surfaceLight;
  const color = variant === 'ghost' ? colors.text : colors.text;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={{
        backgroundColor: bg,
        paddingHorizontal: small ? 12 : 16,
        paddingVertical: small ? 8 : 12,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.55 : 1,
        borderWidth: variant === 'ghost' ? 1 : 0,
        borderColor: colors.border,
        ...style,
      }}
    >
      {loading ? <ActivityIndicator color={colors.text} /> : <Text style={{ color, fontWeight: '900', fontSize: small ? 12 : 14, textAlign: 'center', ...textStyle }}>{title}</Text>}
    </TouchableOpacity>
  );
}
