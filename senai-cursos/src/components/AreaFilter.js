import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { courseAreas } from '../data/coursesSeed';
import { colors } from '../styles/colors';

export default function AreaFilter({ selectedArea, onChangeArea }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {courseAreas.map((area) => {
        const selected = area === selectedArea;

        return (
          <Chip
            key={area}
            selected={selected}
            onPress={() => onChangeArea(area)}
            style={[styles.chip, selected && styles.selectedChip]}
            textStyle={[styles.text, selected && styles.selectedText]}
          >
            {area}
          </Chip>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    color: colors.text,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
