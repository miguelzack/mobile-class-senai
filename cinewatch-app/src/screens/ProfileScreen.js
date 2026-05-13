import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useMovies } from "../contexts/MovieContext";
import { getMyProfile, updateMyProfile, uploadProfilePhoto } from "../services/profileService";
import { colors } from "../styles/theme";

const GENRE_OPTIONS = [
  { id: 28, label: "Ação", emoji: "💥" },
  { id: 12, label: "Aventura", emoji: "🧭" },
  { id: 16, label: "Animação", emoji: "🎨" },
  { id: 35, label: "Comédia", emoji: "😂" },
  { id: 80, label: "Crime", emoji: "🕵️" },
  { id: 18, label: "Drama", emoji: "🎭" },
  { id: 10751, label: "Família", emoji: "👨‍👩‍👧" },
  { id: 14, label: "Fantasia", emoji: "✨" },
  { id: 27, label: "Terror", emoji: "👻" },
  { id: 9648, label: "Mistério", emoji: "🧩" },
  { id: 10749, label: "Romance", emoji: "💘" },
  { id: 878, label: "Ficção científica", emoji: "🚀" },
  { id: 53, label: "Suspense", emoji: "🔪" },
  { id: 10752, label: "Guerra", emoji: "🪖" },
  { id: 37, label: "Faroeste", emoji: "🤠" },
  { id: 99, label: "Documentário", emoji: "🎙️" },
];

const PLATFORM_OPTIONS = [
  { id: "netflix", label: "Netflix", emoji: "🎬" },
  { id: "prime", label: "Prime Video", emoji: "📦" },
  { id: "disney", label: "Disney+", emoji: "🏰" },
  { id: "max", label: "Max", emoji: "💙" },
  { id: "globoplay", label: "Globoplay", emoji: "🌐" },
  { id: "apple", label: "Apple TV+", emoji: "🍎" },
  { id: "paramount", label: "Paramount+", emoji: "⛰️" },
  { id: "star", label: "Star+", emoji: "⭐" },
  { id: "mubi", label: "MUBI", emoji: "🎞️" },
  { id: "crunchyroll", label: "Crunchyroll", emoji: "🍥" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function genreName(genreId) {
  return GENRE_OPTIONS.find((genre) => Number(genre.id) === Number(genreId))?.label || "Sem gênero";
}

function formatMonthKey(dateText) {
  if (!dateText) return "Sem data";
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function getMovieYear(movie) {
  return movie?.release_date ? String(movie.release_date).slice(0, 4) : "Ano desconhecido";
}

function calculateUserStats({ watchedList, state }) {
  const safeWatched = watchedList || [];
  const ratings = safeWatched.map((entry) => Number(entry.rating) || 0).filter((rating) => rating > 0);
  const genreCounts = {};
  const monthCounts = {};

  safeWatched.forEach((entry) => {
    const month = formatMonthKey(entry.watchedAt);
    monthCounts[month] = (monthCounts[month] || 0) + 1;

    const movieGenres = entry.movie?.genre_ids || [];
    movieGenres.forEach((genreId) => {
      genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
    });
  });

  const topGenreEntry = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
  const topMonthEntry = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
  const notesCount = Object.values(state.movieNotes || {}).reduce((total, item) => total + (item.notes?.length || 0), 0);
  const maxMonthCount = Math.max(0, ...Object.values(monthCounts));

  return {
    watchedCount: safeWatched.length,
    ratedCount: ratings.length,
    averageRating: ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0,
    topGenreId: topGenreEntry?.[0] || null,
    topGenreCount: topGenreEntry?.[1] || 0,
    topMonth: topMonthEntry?.[0] || "Nenhum mês ainda",
    topMonthCount: topMonthEntry?.[1] || 0,
    uniqueGenreCount: Object.keys(genreCounts).length,
    notesCount,
    customListsCount: state.customLists?.length || 0,
    favoritesCount: state.favorites?.length || 0,
    watchlistCount: state.watchlist?.length || 0,
    maxMonthCount,
    horrorCount: genreCounts[27] || 0,
  };
}

function buildBadges(stats) {
  const criticProgress = Math.min(1, ((stats.ratedCount / 10) + (stats.notesCount / 3)) / 2);

  return [
    {
      id: "first-movie",
      title: "Primeira sessão",
      emoji: "🎟️",
      unlocked: stats.watchedCount >= 1,
      description: "Marcou o primeiro filme como assistido.",
      progress: Math.min(1, stats.watchedCount / 1),
      helper: `${Math.min(stats.watchedCount, 1)}/1 filme`,
    },
    {
      id: "marathon",
      title: "Maratonista",
      emoji: "🏃",
      unlocked: stats.watchedCount >= 20,
      description: "Assistiu 20 filmes no CineMood.",
      progress: Math.min(1, stats.watchedCount / 20),
      helper: `${Math.min(stats.watchedCount, 20)}/20 filmes`,
    },
    {
      id: "horror-fan",
      title: "Fã de terror",
      emoji: "👻",
      unlocked: stats.horrorCount >= 5,
      description: "Assistiu 5 filmes de terror.",
      progress: Math.min(1, stats.horrorCount / 5),
      helper: `${Math.min(stats.horrorCount, 5)}/5 terrores`,
    },
    {
      id: "critic",
      title: "Crítico de cinema",
      emoji: "✍️",
      unlocked: stats.ratedCount >= 10 && stats.notesCount >= 3,
      description: "Avaliou 10 filmes e criou 3 anotações.",
      progress: criticProgress,
      helper: `${Math.min(stats.ratedCount, 10)}/10 notas • ${Math.min(stats.notesCount, 3)}/3 notas escritas`,
    },
    {
      id: "month-10",
      title: "Viu 10 filmes no mês",
      emoji: "📅",
      unlocked: stats.maxMonthCount >= 10,
      description: "Assistiu pelo menos 10 filmes em um único mês.",
      progress: Math.min(1, stats.maxMonthCount / 10),
      helper: `${Math.min(stats.maxMonthCount, 10)}/10 no melhor mês`,
    },
    {
      id: "genre-explorer",
      title: "Explorador de gêneros",
      emoji: "🧭",
      unlocked: stats.uniqueGenreCount >= 6,
      description: "Assistiu filmes de 6 gêneros diferentes.",
      progress: Math.min(1, stats.uniqueGenreCount / 6),
      helper: `${Math.min(stats.uniqueGenreCount, 6)}/6 gêneros`,
    },
    {
      id: "curator",
      title: "Curador de listas",
      emoji: "🗂️",
      unlocked: stats.customListsCount >= 3,
      description: "Criou pelo menos 3 listas personalizadas.",
      progress: Math.min(1, stats.customListsCount / 3),
      helper: `${Math.min(stats.customListsCount, 3)}/3 listas`,
    },
    {
      id: "collector",
      title: "Colecionador",
      emoji: "⭐",
      unlocked: stats.watchlistCount >= 15,
      description: "Guardou 15 filmes na watchlist.",
      progress: Math.min(1, stats.watchlistCount / 15),
      helper: `${Math.min(stats.watchlistCount, 15)}/15 na watchlist`,
    },
  ];
}

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

function Button({ label, onPress, danger = false, secondary = false, disabled = false, loading = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={{
        backgroundColor: danger ? colors.danger : secondary ? colors.surfaceLight : colors.primary,
        borderWidth: secondary ? 1 : 0,
        borderColor: colors.border,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        opacity: disabled || loading ? 0.55 : 1,
        minHeight: 48,
      }}
    >
      {loading ? <ActivityIndicator color={colors.text} /> : <Text style={{ color: colors.text, fontWeight: "900" }}>{label}</Text>}
    </TouchableOpacity>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>{title}</Text>
      {!!subtitle && <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{subtitle}</Text>}
      {children}
    </View>
  );
}

function Chip({ label, emoji, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: selected ? colors.primary : colors.surfaceLight,
        borderColor: selected ? colors.primary : colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 8,
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {!!emoji && <Text style={{ marginRight: 6 }}>{emoji}</Text>}
      <Text style={{ color: colors.text, fontWeight: "800" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <View style={{ width: "48%", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14, marginTop: 12 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 6 }}>{value}</Text>
      {!!hint && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 16 }}>{hint}</Text>}
    </View>
  );
}

function ProgressBar({ value }) {
  const safeValue = Math.max(0, Math.min(1, Number(value) || 0));
  return (
    <View style={{ height: 8, backgroundColor: colors.background, borderRadius: 99, overflow: "hidden", marginTop: 10 }}>
      <View style={{ width: `${safeValue * 100}%`, height: "100%", backgroundColor: colors.primary, borderRadius: 99 }} />
    </View>
  );
}

function BadgeCard({ badge }) {
  return (
    <View
      style={{
        backgroundColor: badge.unlocked ? "rgba(229, 9, 20, 0.14)" : colors.background,
        borderWidth: 1,
        borderColor: badge.unlocked ? colors.primary : colors.border,
        borderRadius: 18,
        padding: 14,
        marginTop: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>{badge.emoji} {badge.title}</Text>
        <Text style={{ color: badge.unlocked ? colors.success : colors.muted, fontWeight: "900", fontSize: 12 }}>{badge.unlocked ? "Liberada" : "Bloqueada"}</Text>
      </View>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 19 }}>{badge.description}</Text>
      <ProgressBar value={badge.progress} />
      <Text style={{ color: colors.muted, marginTop: 6, fontSize: 12 }}>{badge.helper}</Text>
    </View>
  );
}

function LastWatchedItem({ entry }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 10, marginTop: 10 }}>
      {entry.movie?.poster_path ? (
        <Image source={{ uri: `https://image.tmdb.org/t/p/w185${entry.movie.poster_path}` }} style={{ width: 42, height: 62, borderRadius: 10, backgroundColor: colors.surfaceLight }} />
      ) : (
        <View style={{ width: 42, height: 62, borderRadius: 10, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
          <Text>🎬</Text>
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ color: colors.text, fontWeight: "900" }} numberOfLines={1}>{entry.movie?.title || "Filme"}</Text>
        <Text style={{ color: colors.muted, marginTop: 3 }}>{getMovieYear(entry.movie)} • {entry.rating ? `${entry.rating}/5 ⭐` : "sem nota"}</Text>
      </View>
    </View>
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
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [streamingPlatforms, setStreamingPlatforms] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const stats = useMemo(() => calculateUserStats({ watchedList, state }), [watchedList, state]);
  const badges = useMemo(() => buildBadges(stats), [stats]);
  const unlockedBadges = badges.filter((badge) => badge.unlocked).length;
  const recentWatched = useMemo(() => [...watchedList].sort((a, b) => String(b.watchedAt || "").localeCompare(String(a.watchedAt || ""))).slice(0, 3), [watchedList]);

  async function loadProfile() {
    if (!user?.id) return;
    setLoadingProfile(true);
    try {
      const data = await getMyProfile(user.id);
      setProfile(data);
      setUsername(data?.username || "");
      setFullName(data?.full_name || "");
      setBio(data?.bio || "");
      setFavoriteGenres(asArray(data?.favorite_genres).map((id) => Number(id)).filter(Boolean));
      setStreamingPlatforms(asArray(data?.streaming_platforms));
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

  function toggleFavoriteGenre(genreId) {
    setFavoriteGenres((current) => {
      const id = Number(genreId);
      return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    });
  }

  function toggleStreamingPlatform(platformId) {
    setStreamingPlatforms((current) => (
      current.includes(platformId) ? current.filter((item) => item !== platformId) : [...current, platformId]
    ));
  }

  async function handleSaveProfile() {
    if (!username.trim()) {
      Alert.alert("Nome obrigatório", "Digite um nome de usuário.");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateMyProfile(user.id, {
        username,
        full_name: fullName,
        bio,
        favorite_genres: favoriteGenres,
        streaming_platforms: streamingPlatforms,
      });
      setProfile(updated);
      Alert.alert("Perfil atualizado", "Seus dados, preferências e plataformas foram salvos.");
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
  const selectedPlatformLabels = PLATFORM_OPTIONS.filter((platform) => streamingPlatforms.includes(platform.id)).map((platform) => platform.label).join(", ");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 18, paddingTop: 58, paddingBottom: 150 }}>
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900" }}>Usuário e configurações</Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
        Edite seu perfil, preferências, plataformas de streaming, estatísticas e conquistas do CineMood.
      </Text>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 18, marginTop: 20, alignItems: "center" }}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: colors.surfaceLight }} />
        ) : (
          <View style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.text, fontSize: 42, fontWeight: "900" }}>{(username || user?.email || "C").slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 20, marginTop: 12 }}>{username || "CineMood user"}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>{user?.email}</Text>
        <Button label="Trocar foto de perfil" onPress={handlePickPhoto} loading={uploadingPhoto} secondary />
      </View>

      <SectionCard title="Dados pessoais" subtitle="Essas informações aparecem no seu perfil e nos clubes onde você participa.">
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
      </SectionCard>

      <SectionCard title="Preferências de gêneros" subtitle="Escolha seus gêneros favoritos. Essas preferências já ficam salvas no Supabase para futuras recomendações e filtros.">
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
          {GENRE_OPTIONS.map((genre) => (
            <Chip key={genre.id} label={genre.label} emoji={genre.emoji} selected={favoriteGenres.includes(genre.id)} onPress={() => toggleFavoriteGenre(genre.id)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Plataformas que você assina" subtitle="Marque os streamings que você tem. Isso prepara o app para sugerir filmes que façam sentido para você.">
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
          {PLATFORM_OPTIONS.map((platform) => (
            <Chip key={platform.id} label={platform.label} emoji={platform.emoji} selected={streamingPlatforms.includes(platform.id)} onPress={() => toggleStreamingPlatform(platform.id)} />
          ))}
        </View>
        <Text style={{ color: colors.muted, marginTop: 12, lineHeight: 19 }}>
          Selecionadas: {selectedPlatformLabels || "nenhuma plataforma ainda"}
        </Text>
        <Button label="Salvar dados e preferências" onPress={handleSaveProfile} loading={savingProfile} />
      </SectionCard>

      <SectionCard title="Estatísticas pessoais" subtitle="Resumo automático baseado nos seus filmes assistidos, notas, listas e anotações.">
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <StatCard label="Filmes assistidos" value={stats.watchedCount} hint="Marcados como já vistos" />
          <StatCard label="Média das notas" value={stats.averageRating ? stats.averageRating.toFixed(1) : "—"} hint={`${stats.ratedCount} filmes avaliados`} />
          <StatCard label="Gênero mais assistido" value={stats.topGenreId ? genreName(stats.topGenreId) : "—"} hint={stats.topGenreCount ? `${stats.topGenreCount} filmes` : "Sem dados ainda"} />
          <StatCard label="Melhor mês" value={stats.topMonth} hint={stats.topMonthCount ? `${stats.topMonthCount} filmes assistidos` : "Sem dados ainda"} />
          <StatCard label="Anotações" value={stats.notesCount} hint="Notas pessoais salvas" />
          <StatCard label="Conquistas" value={`${unlockedBadges}/${badges.length}`} hint="Badges liberadas" />
        </View>
        {recentWatched.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Últimos assistidos</Text>
            {recentWatched.map((entry) => <LastWatchedItem key={entry.movie?.id || entry.watchedAt} entry={entry} />)}
          </View>
        )}
      </SectionCard>

      <SectionCard title="Conquistas e badges" subtitle="O progresso é atualizado automaticamente conforme você usa o app.">
        {badges.map((badge) => <BadgeCard key={badge.id} badge={badge} />)}
      </SectionCard>

      <SectionCard title="Alterar senha" subtitle="Atualize sua senha de acesso ao CineMood.">
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nova senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
        />
        <Button label="Alterar senha" onPress={handleUpdatePassword} loading={savingPassword} secondary />
      </SectionCard>

      <SectionCard title="Sincronização" subtitle="Favoritos, watchlist, assistidos, estrelas, anotações e listas ficam salvos na sua conta.">
        <StatusPill status={cloudSyncStatus} />
        <Text style={{ color: colors.muted, marginTop: 12 }}>Favoritos: {state.favorites.length}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Watchlist: {state.watchlist.length}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Assistidos: {watchedList.length}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Listas personalizadas: {state.customLists.length}</Text>
      </SectionCard>

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
