import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { ratingLabel } from '../utils/format';
import { getAreaColor, getAreaIcon, getAreaSoftColor } from '../utils/courseVisuals';

function DetailItem({ icon, label, value }) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIconBox}>
        <MaterialCommunityIcons name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.detailTextBox}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

export default function CourseCard({ course, onPress }) {
  const accentColor = getAreaColor(course.area);
  const softColor = getAreaSoftColor(course.area);

  return (
    <Card mode="elevated" style={styles.card} onPress={onPress}>
      <View style={[styles.topStripe, { backgroundColor: accentColor }]} />

      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.areaIcon, { backgroundColor: softColor }]}> 
            <MaterialCommunityIcons name={getAreaIcon(course.area)} size={28} color={accentColor} />
          </View>

          <View style={styles.titleBox}>
            <View style={styles.areaLine}>
              <Text style={[styles.areaText, { color: accentColor }]}>{course.area}</Text>
            </View>
            <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
              {course.title}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle} numberOfLines={2}>
              {course.subtitle}
            </Text>
          </View>

          <View style={styles.ratingBox}>
            <MaterialCommunityIcons name="star" size={14} color="#92400E" />
            <Text style={styles.rating}>{ratingLabel(course.rating).replace('⭐ ', '')}</Text>
          </View>
        </View>

        <View style={styles.innerPanel}>
          <View style={styles.detailGrid}>
            <DetailItem icon="chart-line" label="Nível" value={course.level} />
            <DetailItem icon="clock-outline" label="Duração" value={course.duration} />
          </View>

          <View style={styles.professorRow}>
            <View style={[styles.professorAvatar, { backgroundColor: softColor }]}> 
              <MaterialCommunityIcons name="account-tie" size={19} color={accentColor} />
            </View>
            <View style={styles.professorTextBox}>
              <Text style={styles.professorLabel}>Professor responsável</Text>
              <Text style={styles.professorName} numberOfLines={1}>{course.teacher}</Text>
            </View>
          </View>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="contained-tonal"
          onPress={onPress}
          compact
          icon="eye-outline"
          style={styles.detailButton}
          contentStyle={styles.detailButtonContent}
        >
          Ver detalhes
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  topStripe: {
    height: 7,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  areaIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    flex: 1,
  },
  areaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  areaText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
    lineHeight: 22,
    letterSpacing: -0.15,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 19,
  },
  ratingBox: {
    backgroundColor: colors.warningSoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rating: {
    fontWeight: '900',
    color: '#92400E',
    fontSize: 12,
  },
  innerPanel: {
    marginTop: 16,
    padding: 12,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  detailIconBox: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextBox: {
    flex: 1,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    color: colors.text,
    marginTop: 1,
    fontWeight: '900',
    fontSize: 12,
  },
  professorRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  professorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  professorTextBox: {
    flex: 1,
  },
  professorLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  professorName: {
    color: colors.text,
    marginTop: 1,
    fontSize: 13,
    fontWeight: '900',
  },
  actions: {
    paddingHorizontal: 14,
    paddingBottom: 15,
    paddingTop: 14,
    marginTop: 2,
  },
  detailButton: {
    borderRadius: 16,
  },
  detailButtonContent: {
    paddingHorizontal: 4,
  },
});
