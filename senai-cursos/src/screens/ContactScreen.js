import React, { useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, List, Text, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import { initDatabase, saveContactMessage } from '../database/database';
import { schoolInfo } from '../data/schoolInfo';
import { colors } from '../styles/colors';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, e-mail e mensagem.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido para contato.');
      return;
    }

    try {
      setSaving(true);
      await initDatabase();
      await saveContactMessage({ name, email, message });

      Alert.alert(
        'Mensagem registrada',
        'Sua mensagem foi enviada.'
      );

      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar sua mensagem.');
    } finally {
      setSaving(false);
    }
  }

  function handleEmail() {
    const subject = encodeURIComponent('Contato pelo app SENAI Cursos');
    const body = encodeURIComponent(
      `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`
    );
    Linking.openURL(`mailto:${schoolInfo.email}?subject=${subject}&body=${body}`);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Olá, SENAI! Meu nome é ${name || 'aluno(a)'} e gostaria de informações sobre os cursos de desenvolvimento.\n\n${message}`
    );
    Linking.openURL(`https://wa.me/${schoolInfo.whatsappDigits}?text=${text}`);
  }

  function handlePhone() {
    Linking.openURL('tel:+551156423400');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header
          title="Contato e atendimento"
          subtitle="Fale com a escola, envie uma mensagem ou registre seu interesse."
        />

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Formulário de contato
            </Text>
            <Text style={styles.cardSubtitle}>
              A mensagem pode ser salva localmente no banco SQLite ou enviada pelos canais de atendimento.
            </Text>

            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
            />

            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Mensagem"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              multiline
              numberOfLines={5}
              style={styles.messageInput}
            />

            <Button
              mode="contained"
              icon="content-save"
              onPress={handleSubmit}
              loading={saving}
              disabled={saving}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Enviar
            </Button>

            <View style={styles.buttonGrid}>
              <Button
                mode="outlined"
                icon="whatsapp"
                onPress={handleWhatsApp}
                style={styles.halfButton}
                contentStyle={styles.buttonContent}
              >
                WhatsApp
              </Button>

              <Button
                mode="outlined"
                icon="email-send"
                onPress={handleEmail}
                style={styles.halfButton}
                contentStyle={styles.buttonContent}
              >
                E-mail
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Dados de atendimento
            </Text>

            <List.Item
              title={schoolInfo.fullName}
              description="Unidade de atendimento"
              left={(props) => <List.Icon {...props} icon="domain" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
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
              onPress={handlePhone}
              left={(props) => <List.Icon {...props} icon="phone" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="WhatsApp"
              description={schoolInfo.whatsapp}
              onPress={handleWhatsApp}
              left={(props) => <List.Icon {...props} icon="whatsapp" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            <Divider />
            <List.Item
              title="E-mail"
              description={schoolInfo.email}
              onPress={handleEmail}
              left={(props) => <List.Icon {...props} icon="email" color={colors.primary} />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
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
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '900',
  },
  cardSubtitle: {
    color: colors.muted,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 14,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    marginBottom: 14,
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
  button: {
    borderRadius: 16,
    marginTop: 4,
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  halfButton: {
    flex: 1,
    borderRadius: 16,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '900',
    marginBottom: 10,
  },
  listTitle: {
    color: colors.text,
    fontWeight: '900',
  },
  listDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
});
