import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../styles/theme';

export default function SectionTitle({ title, subtitle, right }) {
  return (
    <View style={{ paddingHorizontal: 18, marginBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '900' }}>{title}</Text>
        {!!subtitle && <Text style={{ color: colors.muted, marginTop: 4, fontSize: 13, lineHeight: 18 }}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}
