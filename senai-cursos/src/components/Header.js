import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../styles/colors';

export default function Header({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Image
          source={require('../../assets/senai-logo-white.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  logoArea: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 50,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#FFE5E7',
    marginTop: 6,
    lineHeight: 21,
    maxWidth: 330,
  },
});
