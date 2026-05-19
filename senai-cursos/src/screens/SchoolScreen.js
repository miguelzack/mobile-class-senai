import React, { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  List,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { getSchoolOnlineNotice } from '../services/api';
import { schoolInfo, teachers } from '../data/schoolInfo';
import { colors } from '../styles/colors';

function getTeacherInitials(name) {
  return name
    .replace('Prof.', '')
    .trim()
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TeacherDetailsModal({ visible, teacher, onClose }) {
  if (!teacher) return null;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.teacherModal}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.teacherModalHeader}>
            <View style={styles.teacherModalAvatar}>
              <Text style={styles.teacherModalInitials}>{getTeacherInitials(teacher.name)}</Text>
            </View>

            <View style={styles.teacherModalTitleBox}>
              <Text style={styles.teacherModalOverline}>Professor responsável</Text>
              <Text variant="headlineSmall" style={styles.teacherModalName}>
                {teacher.name}
              </Text>
              <Text style={styles.teacherModalRole}>{teacher.role}</Text>
            </View>
          </View>

          <View style={styles.teacherModalDivider} />

          <Text style={styles.teacherModalSectionTitle}>Descrição completa</Text>
          <Text style={styles.teacherModalDescription}>{teacher.fullDescription}</Text>

          <Text style={styles.teacherModalSectionTitle}>Áreas de atuação</Text>
          <View style={styles.teacherModalChips}>
            {teacher.specialtyAreas.map((area) => (
              <Chip key={area} compact style={styles.teacherModalChip} textStyle={styles.teacherModalChipText}>
                {area}
              </Chip>
            ))}
          </View>

          <View style={styles.teacherModalInfoBox}>
            <MaterialCommunityIcons name="school-outline" size={22} color={colors.primary} />
            <Text style={styles.teacherModalInfoText}>
              As informações dos professores aparecem no aplicativo para facilitar a escolha dos cursos e ajudar o aluno a entender a área principal de cada docente.
            </Text>
          </View>

          <Button
            mode="contained"
            icon="check"
            onPress={onClose}
            style={styles.teacherModalButton}
            contentStyle={styles.teacherModalButtonContent}
          >
            Entendi
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

function TeacherCard({ teacher, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.teacherCard, pressed && styles.teacherCardPressed]}
    >
      <View style={styles.teacherCardTop}>
        <View style={styles.teacherAvatar}>
          <Text style={styles.teacherInitials}>{getTeacherInitials(teacher.name)}</Text>
        </View>

        <View style={styles.teacherMainInfo}>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherRole}>{teacher.role}</Text>
        </View>

        <View style={styles.teacherArrowBox}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.teacherShortDescription} numberOfLines={3}>
        {teacher.shortDescription}
      </Text>

      <View style={styles.teacherChipRow}>
        {teacher.specialtyAreas.slice(0, 3).map((area) => (
          <View key={area} style={styles.teacherMiniChip}>
            <Text style={styles.teacherMiniChipText}>{area}</Text>
          </View>
        ))}
      </View>

      <View style={styles.teacherCardFooter}>
        <MaterialCommunityIcons name="gesture-tap-button" size={16} color={colors.primary} />
        <Text style={styles.teacherFooterText}>Toque para ver a descrição completa</Text>
      </View>
    </Pressable>
  );
}

export default function SchoolScreen() {
  const [notice, setNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    async function loadNotice() {
      try {
        const data = await getSchoolOnlineNotice();
        setNotice(data);
      } catch (error) {
        setNotice({
          title: 'Aviso offline',
          message:
            'O aplicativo está funcionando com dados locais. Quando houver conexão, os avisos online poderão ser atualizados via API usando Axios.',
        });
      } finally {
        setLoadingNotice(false);
      }
    }

    loadNotice();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header
          title="Sobre a escola"
          subtitle="Conheça a unidade, os professores e a proposta do aplicativo."
        />

        <Card mode="elevated" style={styles.heroCard}>
          <Card.Content>
            <View style={styles.schoolHeader}>
              <Image
                source={require('../../assets/senai-logo-symbol.png')}
                style={styles.symbolLogo}
                resizeMode="contain"
              />
              <View style={styles.schoolTextBox}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {schoolInfo.fullName}
                </Text>
                <Text style={styles.tagline}>Formação profissional, tecnologia e inovação.</Text>
              </View>
            </View>

            <Text style={styles.paragraph}>
              A unidade SENAI Suíço-Brasileira atua na formação profissional de alunos para o mercado de tecnologia, indústria e inovação. O aplicativo centraliza a divulgação dos cursos de desenvolvimento e facilita o acesso a informações de nível, duração, área, professor, classificação e contato para matrícula.
            </Text>
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.teacherSectionCard}>
          <Card.Content>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Professores dos cursos
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Toque em um professor para visualizar a descrição completa da atuação docente.
                </Text>
              </View>
            </View>

            <View style={styles.teacherList}>
              {teachers.map((teacher) => (
                <TeacherCard
                  key={teacher.name}
                  teacher={teacher}
                  onPress={() => setSelectedTeacher(teacher)}
                />
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Atendimento e localização
            </Text>

            <List.Item
              title="Endereço"
              description={schoolInfo.address}
              left={(props) => <List.Icon {...props} icon="map-marker" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="CEP"
              description={schoolInfo.cep}
              left={(props) => <List.Icon {...props} icon="map-search-outline" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="Telefone"
              description={schoolInfo.phone}
              left={(props) => <List.Icon {...props} icon="phone" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="WhatsApp"
              description={schoolInfo.whatsapp}
              left={(props) => <List.Icon {...props} icon="whatsapp" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Diferenciais do app
            </Text>

            <List.Item
              title="Cursos salvos no SQLite"
              description="Os dados ficam disponíveis no banco local do aplicativo."
              left={(props) => <List.Icon {...props} icon="database" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="Filtros avançados"
              description="Busca por texto, área, nível, professor, avaliação e ordenação."
              left={(props) => <List.Icon {...props} icon="filter-variant" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="Consumo de API com Axios"
              description="Estrutura pronta para receber avisos e dados externos."
              left={(props) => <List.Icon {...props} icon="api" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Integração online
            </Text>

            {loadingNotice ? (
              <View style={styles.noticeLoading}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.noticeLoadingText}>Carregando aviso online...</Text>
              </View>
            ) : (
              <View style={styles.noticeBox}>
                <Text style={styles.noticeTitle}>{notice?.title}</Text>
                <Text style={styles.noticeMessage}>{notice?.message}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <TeacherDetailsModal
        visible={Boolean(selectedTeacher)}
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  heroCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
  },
  teacherSectionCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  schoolHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  symbolLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  schoolTextBox: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '900',
    lineHeight: 26,
  },
  tagline: {
    color: colors.primary,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '900',
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: colors.muted,
    lineHeight: 20,
    fontWeight: '600',
  },
  paragraph: {
    color: colors.text,
    lineHeight: 22,
  },
  teacherList: {
    gap: 12,
  },
  teacherCard: {
    borderRadius: 24,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  teacherCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#FFF7F7',
    borderColor: colors.primarySoft,
  },
  teacherCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teacherAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  teacherInitials: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  teacherMainInfo: {
    flex: 1,
  },
  teacherName: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  teacherRole: {
    color: colors.muted,
    marginTop: 2,
    fontWeight: '700',
    lineHeight: 19,
  },
  teacherArrowBox: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherShortDescription: {
    color: colors.text,
    lineHeight: 21,
    marginTop: 12,
    fontWeight: '500',
  },
  teacherChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  teacherMiniChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  teacherMiniChipText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },
  teacherCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  teacherFooterText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 12,
  },
  teacherModal: {
    backgroundColor: '#FFFFFF',
    margin: 18,
    padding: 20,
    borderRadius: 30,
    maxHeight: '88%',
  },
  teacherModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  teacherModalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherModalInitials: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  teacherModalTitleBox: {
    flex: 1,
  },
  teacherModalOverline: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  teacherModalName: {
    color: colors.text,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  teacherModalRole: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 20,
  },
  teacherModalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  teacherModalSectionTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 8,
  },
  teacherModalDescription: {
    color: colors.text,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 18,
  },
  teacherModalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  teacherModalChip: {
    backgroundColor: colors.primarySoft,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 999,
  },
  teacherModalChipText: {
    color: colors.primaryDark,
    fontWeight: '900',
    fontSize: 12,
  },
  teacherModalInfoBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  teacherModalInfoText: {
    flex: 1,
    color: colors.text,
    lineHeight: 21,
    fontWeight: '600',
  },
  teacherModalButton: {
    borderRadius: 16,
  },
  teacherModalButtonContent: {
    paddingVertical: 6,
  },
  listTitle: {
    color: colors.text,
    fontWeight: '900',
  },
  listDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
  noticeLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  noticeLoadingText: {
    color: colors.muted,
    fontWeight: '600',
  },
  noticeBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeTitle: {
    color: colors.primary,
    fontWeight: '900',
    marginBottom: 6,
  },
  noticeMessage: {
    color: colors.text,
    lineHeight: 21,
  },
});
