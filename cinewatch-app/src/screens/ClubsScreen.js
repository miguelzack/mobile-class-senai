import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../contexts/AuthContext";
import { createClub, DEFAULT_ALLOWED_GENRES, isAdminRole, joinClubByCode, listMyClubs, MOVIE_GENRES } from "../services/clubService";
import { colors } from "../styles/theme";

function GenreChip({ genre, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: selected ? colors.primary : colors.surfaceLight,
        borderColor: selected ? colors.primary : colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "800", fontSize: 12 }}>{genre.name}</Text>
    </TouchableOpacity>
  );
}

function ClubCard({ club, navigation }) {
  const isAdmin = isAdminRole(club.myRole);
  const genresCount = club.allowed_genres?.length || 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate("ClubDetail", { clubId: club.id })}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{club.name}</Text>
      {!!club.description && <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{club.description}</Text>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {isAdmin && (
          <View style={{ backgroundColor: colors.surfaceLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: colors.secondary, fontWeight: "900" }}>Código: {club.invite_code}</Text>
          </View>
        )}
        <View style={{ backgroundColor: colors.surfaceLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>{club.myRole === "owner" ? "ADM criador" : club.myRole === "admin" ? "ADM" : "Membro"}</Text>
        </View>
        <View style={{ backgroundColor: colors.surfaceLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ color: colors.muted, fontWeight: "900" }}>{genresCount} gêneros permitidos</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ClubsScreen({ navigation }) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [query, setQuery] = useState("");
  const [allowedGenres, setAllowedGenres] = useState(DEFAULT_ALLOWED_GENRES);

  async function loadClubs() {
    try {
      const data = await listMyClubs(user.id);
      setClubs(data);
    } catch (error) {
      Alert.alert("Erro ao carregar clubes", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadClubs();
    }, [user?.id])
  );

  const filteredClubs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return clubs;
    return clubs.filter((club) => club.name?.toLowerCase().includes(term));
  }, [clubs, query]);

  function toggleGenre(genreId) {
    setAllowedGenres((current) => {
      if (current.includes(genreId)) return current.filter((id) => id !== genreId);
      return [...current, genreId];
    });
  }

  async function handleCreateClub() {
    if (!name.trim()) {
      Alert.alert("Nome obrigatório", "Digite o nome do clube.");
      return;
    }

    if (!allowedGenres.length) {
      Alert.alert("Escolha os gêneros", "Selecione pelo menos um gênero permitido para as sugestões do clube.");
      return;
    }

    setCreating(true);
    try {
      const club = await createClub({ name, description, ownerId: user.id, allowedGenres });
      setName("");
      setDescription("");
      setAllowedGenres(DEFAULT_ALLOWED_GENRES);
      await loadClubs();
      navigation.navigate("ClubDetail", { clubId: club.id });
    } catch (error) {
      Alert.alert("Erro ao criar clube", error.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinClub() {
    if (!inviteCode.trim()) {
      Alert.alert("Código obrigatório", "Digite o código privado do clube.");
      return;
    }

    setJoining(true);
    try {
      const joinedClubId = await joinClubByCode(inviteCode);
      setInviteCode("");
      await loadClubs();
      if (joinedClubId) navigation.navigate("ClubDetail", { clubId: joinedClubId });
    } catch (error) {
      Alert.alert("Erro ao entrar no clube", error.message);
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.muted, marginTop: 12 }}>Carregando clubes...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 18, paddingTop: 58, paddingBottom: 150 }}
      data={filteredClubs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ClubCard club={item} navigation={navigation} />}
      refreshControl={
        <RefreshControl
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadClubs();
          }}
        />
      }
      ListHeaderComponent={
        <View>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900" }}>Clubes privados</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
            Crie clubes acessados apenas por código. Você pode participar de vários clubes ao mesmo tempo.
          </Text>

          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 20 }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Criar clube</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nome do clube"
              placeholderTextColor={colors.muted}
              style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição opcional"
              placeholderTextColor={colors.muted}
              multiline
              style={{ minHeight: 76, textAlignVertical: "top", backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 10 }}
            />

            <Text style={{ color: colors.text, fontWeight: "900", marginTop: 14 }}>Gêneros permitidos nas sugestões</Text>
            <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 18 }}>
              O ADM controla quais tipos de filmes podem aparecer quando o clube gerar sugestões.
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
              {MOVIE_GENRES.map((genre) => (
                <GenreChip key={genre.id} genre={genre} selected={allowedGenres.includes(genre.id)} onPress={() => toggleGenre(genre.id)} />
              ))}
            </View>

            <TouchableOpacity onPress={handleCreateClub} disabled={creating} style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 13, alignItems: "center", marginTop: 12, opacity: creating ? 0.55 : 1 }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>{creating ? "Criando..." : "Criar clube privado"}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Entrar por código</Text>
            <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>Clubes não aparecem em busca pública. O acesso é feito apenas com o código privado.</Text>
            <TextInput
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              placeholder="Ex: A1B2C3"
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
              style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
            />
            <TouchableOpacity onPress={handleJoinClub} disabled={joining} style={{ backgroundColor: colors.secondary, borderRadius: 14, padding: 13, alignItems: "center", marginTop: 12, opacity: joining ? 0.55 : 1 }}>
              <Text style={{ color: colors.background, fontWeight: "900" }}>{joining ? "Entrando..." : "Entrar no clube"}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Pesquisar meus clubes pelo nome..."
            placeholderTextColor={colors.muted}
            style={{ backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 13, marginTop: 18, marginBottom: 14 }}
          />

          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginBottom: 12 }}>Meus clubes</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState title="Nenhum clube encontrado" subtitle="Crie um clube privado ou entre usando um código." />}
    />
  );
}
