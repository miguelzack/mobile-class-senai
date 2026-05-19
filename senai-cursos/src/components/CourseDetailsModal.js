import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Modal, Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InfoPill from './InfoPill';
import { schoolInfo } from '../data/schoolInfo';
import { colors } from '../styles/colors';
import { ratingLabel } from '../utils/format';
import { getAreaColor, getAreaIcon, getAreaSoftColor } from '../utils/courseVisuals';

export default function CourseDetailsModal({ visible, course, onClose }) {
  if (!course) return null;

  const accentColor = getAreaColor(course.area);
  const softColor = getAreaSoftColor(course.area);

  function handleEnroll() {
    Alert.alert(
      'Matrícula solicitada',
      `Sua solicitação para o curso "${course.title}" foi registrada. A equipe do ${schoolInfo.unitName} poderá entrar em contato para finalizar a matrícula.`
    );
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Olá, SENAI! Tenho interesse no curso ${course.title}.\nÁrea: ${course.area}\nProfessor: ${course.teacher}\nDuração: ${course.duration}`
    );

    Linking.openURL(`https://wa.me/${schoolInfo.whatsappDigits}?text=${text}`);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`Tenho interesse no curso ${course.title}`);
    const body = encodeURIComponent(
      `Olá, SENAI Suíço-Brasileira.\n\nTenho interesse no curso ${course.title}.\nÁrea: ${course.area}\nProfessor: ${course.teacher}\nDuração: ${course.duration}\n\nGostaria de receber mais informações.`
    );

    Linking.openURL(`mailto:${schoolInfo.email}?subject=${subject}&body=${body}`);
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: softColor }]}>
              <MaterialCommunityIcons name={getAreaIcon(course.area)} size={30} color={accentColor} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.areaText, { color: accentColor }]}>{course.area}</Text>
              <Text variant="headlineSmall" style={styles.title}>
                {course.title}
              </Text>
            </View>
          </View>

          <Text variant="bodyLarge" style={styles.subtitle}>
            {course.subtitle}
          </Text>

          <View style={styles.pills}>
            <InfoPill icon="chart-line" text={course.level} tone="blue" />
            <InfoPill icon="clock-outline" text={course.duration} tone="green" />
            <InfoPill icon="star" text={ratingLabel(course.rating)} tone="yellow" />
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sobre o curso
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            {course.description}
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Professor responsável</Text>
            <Text style={styles.infoValue}>{course.teacher}</Text>
          </View>

          <View style={styles.contactBox}>
            <Text style={styles.contactTitle}>Atendimento da escola</Text>
            <Text style={styles.contactText}>{schoolInfo.fullName}</Text>
            <Text style={styles.contactText}>Telefone: {schoolInfo.phone}</Text>
            <Text style={styles.contactText}>WhatsApp: {schoolInfo.whatsapp}</Text>
          </View>

          <Button
            mode="contained"
            icon="school"
            onPress={handleEnroll}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Realizar matrícula
          </Button>

          <Button
            mode="outlined"
            icon="whatsapp"
            onPress={handleWhatsApp}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            Contato pelo WhatsApp
          </Button>

          <Button
            mode="outlined"
            icon="email-send-outline"
            onPress={handleEmail}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            Enviar e-mail
          </Button>

          <Button onPress={onClose} textColor={colors.muted} style={styles.closeButton}>
            Fechar
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#FFFFFF',
    margin: 18,
    padding: 20,
    borderRadius: 30,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  areaText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 12,
    color: colors.muted,
    lineHeight: 22,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  divider: {
    marginVertical: 18,
  },
  sectionTitle: {
    fontWeight: '900',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    color: colors.text,
    lineHeight: 22,
  },
  infoBox: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    marginTop: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 3,
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  contactBox: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    marginBottom: 8,
  },
  contactTitle: {
    color: colors.primaryDark,
    fontWeight: '900',
    marginBottom: 4,
  },
  contactText: {
    color: colors.text,
    lineHeight: 21,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 12,
    borderRadius: 16,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 16,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  closeButton: {
    marginTop: 8,
  },
});
