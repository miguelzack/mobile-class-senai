import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Divider, List, Text } from 'react-native-paper';
import Header from '../components/Header';
import { getSchoolOnlineNotice } from '../services/api';
import { schoolInfo, teachers } from '../data/schoolInfo';
import { colors } from '../styles/colors';

export default function SchoolScreen() {
  const [notice, setNotice] = useState(null);
  const [loadingNotice, setLoadingNotice] = useState(true);

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

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Professores dos cursos
            </Text>

            {teachers.map((teacher, index) => (
              <View key={teacher.name}>
                <List.Item
                  title={teacher.name}
                  description={teacher.specialties}
                  left={(props) => <List.Icon {...props} icon="account-tie" color={colors.primary} />}
                  titleStyle={styles.listTitle}
                  descriptionStyle={styles.listDescription}
                />
                {index < teachers.length - 1 ? <Divider /> : null}
              </View>
            ))}
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
  sectionTitle: {
    color: colors.text,
    fontWeight: '900',
    marginBottom: 8,
  },
  paragraph: {
    color: colors.text,
    lineHeight: 22,
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
