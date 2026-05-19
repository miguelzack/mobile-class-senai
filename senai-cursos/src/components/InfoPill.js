import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { colors } from '../styles/colors';

export default function InfoPill({ icon, text, tone = 'default' }) {
  return (
    <Chip
      icon={icon}
      compact
      style={[styles.chip, styles[tone]]}
      textStyle={styles.text}
    >
      {text}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 999,
  },
  default: {
    backgroundColor: '#F3F4F6',
  },
  red: {
    backgroundColor: colors.primarySoft,
  },
  green: {
    backgroundColor: colors.successSoft,
  },
  yellow: {
    backgroundColor: colors.warningSoft,
  },
  blue: {
    backgroundColor: colors.infoSoft,
  },
  text: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
