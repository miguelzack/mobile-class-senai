import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useMovies } from "../contexts/MovieContext";
import { getMyProfile, updateMyProfile, uploadProfilePhoto } from "../services/profileService";
import { colors } from "../styles/theme";

function StatusPill({ status }) {
  const label = {
    idle: "Aguardando",
    syncing: "Sincronizando",
    saving: "Salvando",
    synced: "Sincronizado",
    error: "Erro na sincronização",
  }[status] || status;

  const color = status === "error" ? colors.danger : status === "synced" ? colors.success : colors.secondary;

  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: colors.surfaceLight, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 }}>
      <Text style={{ color, fontWeight: "900" }}>{label}</Text>
    </View>
  );
}

function Button({ label, onPress, danger = false, secondary = false, disabled = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: danger ? colors.danger : secondary ? colors.surfaceLight : colors.primary,
        borderWidth: secondary ? 1 : 0,
        borderColor: colors.border,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 12,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "900" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, signOut, updatePassword } = useAuth();
  const { cloudSyncStatus, syncWithCloud, forceSaveCloud, state, watchedList } = useMovies();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function loadProfile() {
    if (!user?.id) return;
    try {
      const data = await getMyProfile(user.id);
      setProfile(data);
      setUsername(data?.username || "");
      setFullName(data?.full_name || "");
      setBio(data?.bio || "");
    } catch (error) {
      Alert.alert("Erro ao carregar perfil", error.message);
    } finally {
      setLoadingProfile(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [user?.id])
  );

  async function handleSaveProfile() {
    if (!username.trim()) {
      Alert.alert("Nome obrigatório", "Digite um nome de usuário.");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateMyProfile(user.id, { username, full_name: fullName, bio });
      setProfile(updated);
      Alert.alert("Perfil atualizado", "Seus dados foram salvos.");
    } catch (error) {
      Alert.alert("Erro ao salvar perfil", error.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Autorize o acesso às fotos para escolher uma imagem de perfil.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setUploadingPhoto(true);
    try {
      const updated = await uploadProfilePhoto({ userId: user.id, asset: result.assets[0] });
      setProfile(updated);
      Alert.alert("Foto atualizada", "Sua foto de perfil foi salva com sucesso.");
    } catch (error) {
      Alert.alert("Erro ao salvar foto", error.message);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleUpdatePassword() {
    if (newPassword.length < 6) {
      Alert.alert("Senha muito curta", "Digite uma senha com pelo menos 6 caracteres.");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      setNewPassword("");
      Alert.alert("Senha atualizada", "Sua nova senha foi salva.");
    } catch (error) {
      Alert.alert("Erro ao alterar senha", error.message);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.muted, marginTop: 12 }}>Carregando seus dados...</Text>
      </View>
    );
  }

  const avatar = profile?.avatar_url;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 18, paddingTop: 58, paddingBottom: 150 }}>
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900" }}>Usuário e configurações</Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
        Edite seus dados pessoais, foto de perfil, senha e controle a sincronização dos seus filmes na nuvem.
      </Text>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 20, alignItems: "center" }}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surfaceLight }} />
        ) : (
          <View style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.text, fontSize: 38, fontWeight: "900" }}>{(username || user?.email || "C").slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <Button label={uploadingPhoto ? "Enviando foto..." : "Trocar foto de perfil"} onPress={handlePickPhoto} disabled={uploadingPhoto} secondary />
      </View>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Dados pessoais</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>{user?.email}</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Nome de usuário"
          placeholderTextColor={colors.muted}
          style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
        />
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nome completo opcional"
          placeholderTextColor={colors.muted}
          style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 10 }}
        />
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Bio opcional"
          placeholderTextColor={colors.muted}
          multiline
          style={{ minHeight: 80, textAlignVertical: "top", backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 10 }}
        />
        <Button label={savingProfile ? "Salvando..." : "Salvar dados"} onPress={handleSaveProfile} disabled={savingProfile} />
      </View>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Alterar senha</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nova senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
        />
        <Button label={savingPassword ? "Alterando..." : "Alterar senha"} onPress={handleUpdatePassword} disabled={savingPassword} secondary />
      </View>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Sincronização</Text>
        <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>
          Favoritos, watchlist, assistidos, estrelas, anotações e listas ficam salvos na sua conta.
        </Text>
        <StatusPill status={cloudSyncStatus} />
        <Text style={{ color: colors.muted, marginTop: 12 }}>Favoritos: {state.favorites.length}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Watchlist: {state.watchlist.length}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Assistidos: {watchedList.length}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Listas personalizadas: {state.customLists.length}</Text>
      </View>

      <Button label="Sincronizar agora" onPress={syncWithCloud} />
      <Button label="Forçar backup na nuvem" onPress={forceSaveCloud} secondary />
      <Button
        label="Sair da conta"
        danger
        onPress={() => {
          Alert.alert("Sair da conta", "Você quer sair do CineMood neste aparelho?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: signOut },
          ]);
        }}
      />
    </ScrollView>
  );
}
