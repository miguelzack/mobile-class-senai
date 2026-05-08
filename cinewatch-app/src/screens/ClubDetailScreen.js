import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RatingStars from "../components/RatingStars";
import { useAuth } from "../contexts/AuthContext";
import { useMovies } from "../contexts/MovieContext";
import {
  DEFAULT_ALLOWED_GENRES,
  clearClubSuggestions,
  deleteClub,
  deleteClubMovie,
  generateWeeklySuggestions,
  getClub,
  getCurrentWeekStart,
  isAdminRole,
  leaveClub,
  listClubMembers,
  listClubMovies,
  listClubReviews,
  listClubVotes,
  markClubMovieWatched,
  MOVIE_GENRES,
  regenerateClubInviteCode,
  removeClubMember,
  selectWeeklyMovie,
  setClubMemberRole,
  setVotingCandidates,
  submitClubReview,
  suggestMovieToClub,
  updateClubMemberNickname,
  updateClubSettings,
  voteForClubMovie,
} from "../services/clubService";
import { getBackdropUrl, getPosterUrl, searchMovies } from "../services/tmdb";
import { colors } from "../styles/theme";

function SmallButton({ label, onPress, danger = false, secondary = false, disabled = false, fullWidth = false, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          minHeight: 38,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: danger ? colors.danger : secondary ? colors.surfaceLight : colors.primary,
          borderColor: secondary ? colors.border : "transparent",
          borderWidth: secondary ? 1 : 0,
          borderRadius: 999,
          paddingHorizontal: 13,
          paddingVertical: 9,
          opacity: disabled ? 0.55 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
    >
      <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "900", fontSize: 12, textAlign: "center" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function GenreChip({ genre, selected, onPress, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
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
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "800", fontSize: 12 }}>{genre.name}</Text>
    </TouchableOpacity>
  );
}

function Avatar({ profile, size = 38 }) {
  if (profile?.avatar_url) {
    return <Image source={{ uri: profile.avatar_url }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceLight }} />;
  }
  const letter = (profile?.full_name || profile?.username || "M").slice(0, 1).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text, fontWeight: "900" }}>{letter}</Text>
    </View>
  );
}

function statusLabel(status) {
  if (status === "voting") return "Em votação";
  if (status === "selected") return "Filme da semana";
  if (status === "watched") return "Assistido pelo grupo";
  return "Sugestão";
}

function WeekMovieHero({ selectedMovie, groupAverage, selectedReviews, navigation, onMarkWatched, isAdmin }) {
  const movie = selectedMovie?.movie || {};
  const backdrop = getBackdropUrl(movie.backdrop_path, "w780");
  const poster = getPosterUrl(movie.poster_path, "w342");

  if (!selectedMovie) {
    return (
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 28, padding: 18, marginTop: 18 }}>
        <Text style={{ color: colors.secondary, fontSize: 12, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase" }}>Sessão da semana</Text>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 6 }}>Nenhum filme escolhido</Text>
        <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 21 }}>O ADM pode adicionar sugestões, abrir uma votação com até 3 filmes e definir o vencedor como filme da semana.</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 30, overflow: "hidden", borderWidth: 1, borderColor: colors.border, marginTop: 18 }}>
      {backdrop ? (
        <Image source={{ uri: backdrop }} style={{ width: "100%", height: 160, backgroundColor: colors.surfaceLight }} />
      ) : (
        <View style={{ width: "100%", height: 96, backgroundColor: colors.surfaceLight }} />
      )}

      <View style={{ padding: 16, marginTop: poster ? -60 : 0 }}>
        <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-end" }}>
          {poster ? (
            <Image source={{ uri: poster }} style={{ width: 94, height: 140, borderRadius: 18, backgroundColor: colors.surfaceLight, borderWidth: 3, borderColor: colors.surface }} />
          ) : null}
          <View style={{ flex: 1, paddingBottom: 4 }}>
            <View style={{ alignSelf: "flex-start", backgroundColor: selectedMovie.status === "watched" ? colors.success : colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 11 }}>{selectedMovie.status === "watched" ? "Assistido pelo grupo" : "Filme da semana"}</Text>
            </View>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 8 }} numberOfLines={2}>{movie.title || "Filme sem título"}</Text>
            <Text style={{ color: colors.muted, marginTop: 5 }}>{(movie.release_date || "----").slice(0, 4)} • ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</Text>
          </View>
        </View>

        <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 12 }} numberOfLines={4}>{movie.overview || "Sem descrição."}</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <View style={{ flex: 1, minWidth: 120, backgroundColor: colors.background, borderRadius: 18, padding: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 12 }}>Média do grupo</Text>
            <Text style={{ color: colors.secondary, fontWeight: "900", fontSize: 22, marginTop: 4 }}>{groupAverage ? groupAverage.toFixed(1) : "--"}/5</Text>
          </View>
          <View style={{ flex: 1, minWidth: 120, backgroundColor: colors.background, borderRadius: 18, padding: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 12 }}>Avaliações</Text>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 22, marginTop: 4 }}>{selectedReviews.length}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          <SmallButton label="Abrir detalhes" onPress={() => navigation.navigate("MovieDetail", { movie })} />
          {isAdmin && selectedMovie.status !== "watched" && <SmallButton label="Marcar como assistido" secondary onPress={onMarkWatched} />}
        </View>
      </View>
    </View>
  );
}

function WatchedClubMovieCard({ item, index, navigation }) {
  const movie = item.movie || {};
  const poster = getPosterUrl(movie.poster_path, "w185");

  return (
    <TouchableOpacity activeOpacity={0.86} onPress={() => navigation.navigate("MovieDetail", { movie })} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: index === 0 && item.average ? colors.secondary : colors.border, borderRadius: 20, padding: 12, marginTop: 10 }}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: index === 0 && item.average ? colors.secondary : colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>{index + 1}</Text>
        </View>
        {poster ? (
          <Image source={{ uri: poster }} style={{ width: 48, height: 72, borderRadius: 10, backgroundColor: colors.surfaceLight }} />
        ) : (
          <View style={{ width: 48, height: 72, borderRadius: 10, backgroundColor: colors.surfaceLight }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "900", fontSize: 15 }} numberOfLines={2}>{movie.title || "Filme sem título"}</Text>
          <Text style={{ color: colors.muted, marginTop: 3 }}>{(movie.release_date || "----").slice(0, 4)} • {item.reviewCount} avaliação(ões)</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: colors.secondary, fontWeight: "900", fontSize: 18 }}>{item.average ? item.average.toFixed(1) : "--"}</Text>
          <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 11 }}>/5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MovieSuggestionCard({ item, navigation, onSelect, selected, onMarkWatched, onRemove, reviews, votes, isAdmin, onToggleVoteCandidate, voteCandidateDisabled, onVote, myVote }) {
  const movie = item.movie || {};
  const poster = getPosterUrl(movie.poster_path, "w185");
  const avg = reviews.length ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length : 0;
  const alreadyWatched = item.status === "watched";
  const voting = item.status === "voting";
  const voteCount = votes.length;
  const isMyVote = myVote?.club_movie_id === item.id;

  return (
    <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: selected || isMyVote ? colors.primary : colors.border, borderRadius: 18, padding: 12, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {poster ? (
          <Image source={{ uri: poster }} style={{ width: 78, height: 116, borderRadius: 12, backgroundColor: colors.surfaceLight }} />
        ) : (
          <View style={{ width: 78, height: 116, borderRadius: 12, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.muted, fontSize: 11 }}>Sem poster</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "900" }}>{movie.title || "Filme sem título"}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} • {(movie.release_date || "----").slice(0, 4)}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18 }} numberOfLines={3}>
            {movie.overview || "Sem descrição."}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            <View style={{ backgroundColor: voting ? colors.primary : colors.surfaceLight, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 }}>
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 11 }}>{statusLabel(item.status)}</Text>
            </View>
            {voting && (
              <View style={{ backgroundColor: colors.surfaceLight, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 }}>
                <Text style={{ color: colors.secondary, fontWeight: "900", fontSize: 11 }}>{voteCount} voto(s)</Text>
              </View>
            )}
          </View>

          {!!avg && <Text style={{ color: colors.secondary, fontWeight: "900", marginTop: 8 }}>Nota do clube: {avg.toFixed(1)}/5</Text>}
          {alreadyWatched && <Text style={{ color: colors.success, fontWeight: "900", marginTop: 6 }}>Assistido pelo grupo</Text>}
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <SmallButton label="Abrir" onPress={() => navigation.navigate("MovieDetail", { movie })} secondary />
        {voting && <SmallButton label={isMyVote ? "Seu voto" : "Votar"} onPress={onVote} secondary={isMyVote} />}
        {isAdmin && !selected && !alreadyWatched && (
          <SmallButton label={voting ? "Tirar da votação" : "Colocar na votação"} onPress={onToggleVoteCandidate} disabled={voteCandidateDisabled && !voting} />
        )}
        {isAdmin && <SmallButton label={selected ? "Filme escolhido" : "Definir da semana"} disabled={selected} onPress={onSelect} />}
        {isAdmin && selected && !alreadyWatched && <SmallButton label="Marcar assistido" onPress={onMarkWatched} />}
        {isAdmin && !alreadyWatched && <SmallButton label="Remover" danger onPress={onRemove} />}
      </View>
    </View>
  );
}

export default function ClubDetailScreen({ route, navigation }) {
  const { clubId } = route.params;
  const { user } = useAuth();
  const { state: privateMovieState, getMovieNotes, markMovieAsWatched, markMoviesAsWatched, saveClubReviewToPrivateMovie } = useMovies();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [personalComment, setPersonalComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsDescription, setSettingsDescription] = useState("");
  const [settingsGenres, setSettingsGenres] = useState(DEFAULT_ALLOWED_GENRES);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingNickname, setEditingNickname] = useState("");
  const [manualQuery, setManualQuery] = useState("");
  const [manualResults, setManualResults] = useState([]);
  const [searchingManual, setSearchingManual] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState(null);

  async function loadClubData() {
    try {
      const [clubData, memberData, movieData, reviewData, voteData] = await Promise.all([
        getClub(clubId),
        listClubMembers(clubId),
        listClubMovies(clubId),
        listClubReviews(clubId),
        listClubVotes(clubId),
      ]);
      setClub(clubData);
      setMembers(memberData);
      setMovies(movieData);
      setReviews(reviewData);
      setVotes(voteData);
      setSettingsName(clubData?.name || "");
      setSettingsDescription(clubData?.description || "");
      setSettingsGenres(clubData?.allowed_genres?.length ? clubData.allowed_genres : DEFAULT_ALLOWED_GENRES);
    } catch (error) {
      Alert.alert("Erro ao carregar clube", error.message);
    } finally {
      setLoading(false);
      setGenerating(false);
      setSavingReview(false);
      setSavingSettings(false);
      setSearchingManual(false);
      setAddingMovieId(null);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadClubData();
    }, [clubId])
  );

  const myMember = useMemo(() => members.find((member) => member.user_id === user.id), [members, user.id]);
  const isAdmin = isAdminRole(myMember?.role);
  const isOwner = myMember?.role === "owner";

  const selectedMovie = useMemo(() => {
    return movies.find((item) => item.id === club?.active_club_movie_id) || movies.find((item) => item.status === "selected") || null;
  }, [movies, club]);

  const votingCandidates = useMemo(() => movies.filter((item) => item.status === "voting"), [movies]);
  const activeVoteWeek = votingCandidates[0]?.week_start || selectedMovie?.week_start || getCurrentWeekStart();

  const reviewsByMovie = useMemo(() => {
    return reviews.reduce((acc, review) => {
      const key = review.club_movie_id;
      acc[key] = acc[key] || [];
      acc[key].push(review);
      return acc;
    }, {});
  }, [reviews]);

  const votesByMovie = useMemo(() => {
    return votes.reduce((acc, vote) => {
      const key = vote.club_movie_id;
      acc[key] = acc[key] || [];
      acc[key].push(vote);
      return acc;
    }, {});
  }, [votes]);

  const myVote = useMemo(() => votes.find((vote) => vote.user_id === user.id && vote.week_start === activeVoteWeek), [votes, user.id, activeVoteWeek]);
  const selectedReviews = selectedMovie ? reviewsByMovie[selectedMovie.id] || [] : [];
  const myReview = selectedReviews.find((review) => review.user_id === user.id);
  const groupAverage = selectedReviews.length ? selectedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / selectedReviews.length : 0;

  const existingMovieByTmdbId = useMemo(() => {
    return movies.reduce((acc, item) => {
      const tmdbId = Number(item.movie_tmdb_id || item.movie?.id);
      if (!tmdbId) return acc;
      if (!acc[tmdbId] || item.status === "watched") acc[tmdbId] = item;
      return acc;
    }, {});
  }, [movies]);

  const suggestionMovies = useMemo(() => movies.filter((item) => item.status !== "watched"), [movies]);

  const watchedMovies = useMemo(() => {
    return movies
      .filter((item) => item.status === "watched")
      .map((item) => {
        const itemReviews = reviewsByMovie[item.id] || [];
        const average = itemReviews.length
          ? itemReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / itemReviews.length
          : 0;

        return {
          ...item,
          average,
          reviewCount: itemReviews.length,
        };
      })
      .sort((a, b) => (b.average || 0) - (a.average || 0));
  }, [movies, reviewsByMovie]);


  function getPrivateMovieFromClubItem(item) {
    if (!item?.movie) return null;

    return {
      ...item.movie,
      id: item.movie_tmdb_id || item.movie.id,
      title: item.movie.title || item.movie.name || "Filme sem título",
      poster_path: item.movie.poster_path || null,
      backdrop_path: item.movie.backdrop_path || null,
      vote_average: item.movie.vote_average || 0,
      release_date: item.movie.release_date || "",
      overview: item.movie.overview || "",
      genre_ids: item.movie.genre_ids || [],
    };
  }

  function saveClubMovieAsPrivateWatched(item) {
    const privateMovie = getPrivateMovieFromClubItem(item);
    if (!privateMovie) return;

    markMovieAsWatched(privateMovie);
  }

  function saveClubReviewPrivately(item, rating, noteText = "") {
    const privateMovie = getPrivateMovieFromClubItem(item);
    if (!privateMovie) return;

    const movieId = item.movie_tmdb_id || item.movie?.id;
    saveClubReviewToPrivateMovie(privateMovie, rating, `${clubId}-${movieId}`, noteText);
  }


  React.useEffect(() => {
    const missingPrivateWatched = watchedMovies
      .map(getPrivateMovieFromClubItem)
      .filter((movie) => movie && !privateMovieState.watched?.[movie.id]);

    if (missingPrivateWatched.length) {
      markMoviesAsWatched(missingPrivateWatched);
    }
  }, [clubId, watchedMovies.map((item) => item.id).join("|"), privateMovieState.watched]);

  React.useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating || 0);
      setReviewText(myReview.comment || "");
    } else {
      setReviewRating(0);
      setReviewText("");
    }
  }, [myReview?.id, selectedMovie?.id]);

  React.useEffect(() => {
    const movieId = selectedMovie?.movie_tmdb_id || selectedMovie?.movie?.id;
    if (!movieId) {
      setPersonalComment("");
      return;
    }

    const sourceId = `${clubId}-${movieId}`;
    const existingNote = getMovieNotes(movieId).find((note) => note.source === "club" && note.sourceId === sourceId);
    setPersonalComment(existingNote?.text || "");
  }, [clubId, selectedMovie?.id, selectedMovie?.movie_tmdb_id, selectedMovie?.movie?.id]);

  function toggleSettingsGenre(genreId) {
    setSettingsGenres((current) => {
      if (current.includes(genreId)) return current.filter((id) => id !== genreId);
      return [...current, genreId];
    });
  }

  async function handleSaveSettings() {
    if (!settingsName.trim()) {
      Alert.alert("Nome obrigatório", "Digite um nome para o clube.");
      return;
    }
    if (!settingsGenres.length) {
      Alert.alert("Gêneros obrigatórios", "Escolha pelo menos um gênero permitido.");
      return;
    }

    setSavingSettings(true);
    try {
      await updateClubSettings({ clubId, name: settingsName, description: settingsDescription, allowedGenres: settingsGenres });
      await loadClubData();
      Alert.alert("Clube atualizado", "As configurações foram salvas.");
    } catch (error) {
      Alert.alert("Erro ao salvar clube", error.message);
      setSavingSettings(false);
    }
  }

  async function handleDeleteClub() {
    Alert.alert("Excluir clube?", "Essa ação apaga o clube, participantes, sugestões, votos e avaliações. Não dá para desfazer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteClub({ clubId });
            Alert.alert("Clube excluído", "O clube foi removido com sucesso.");
            navigation.goBack();
          } catch (error) {
            Alert.alert("Erro ao excluir clube", error.message);
          }
        },
      },
    ]);
  }

  async function handleRegenerateCode() {
    Alert.alert("Gerar novo código?", "O código anterior deixará de funcionar para novos convites.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Gerar",
        onPress: async () => {
          try {
            await regenerateClubInviteCode(clubId);
            await loadClubData();
            Alert.alert("Código atualizado", "Um novo código privado foi gerado.");
          } catch (error) {
            Alert.alert("Erro ao gerar código", error.message);
          }
        },
      },
    ]);
  }

  async function handleGenerateSuggestions() {
    if (!isAdmin) {
      Alert.alert("Somente ADM", "Apenas o ADM do clube pode gerar sugestões da semana.");
      return;
    }
    setGenerating(true);
    try {
      const created = await generateWeeklySuggestions({ clubId, userId: user.id, allowedGenres: club?.allowed_genres || DEFAULT_ALLOWED_GENRES });
      await loadClubData();
      if (!created?.length) {
        Alert.alert("Sem novas sugestões", "Não encontrei filmes novos dentro dos gêneros do clube. Tente limpar as sugestões antigas ou liberar mais gêneros.");
      }
    } catch (error) {
      Alert.alert("Erro ao gerar sugestões", error.message);
      setGenerating(false);
    }
  }

  async function handleClearSuggestions() {
    if (!isAdmin) return;

    Alert.alert(
      "Limpar sugestões?",
      "Isso remove apenas sugestões e filmes em votação. Filmes já assistidos e o filme da semana continuam salvos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              const removed = await clearClubSuggestions({ clubId });
              await loadClubData();
              Alert.alert("Sugestões limpas", `${removed || 0} sugestão(ões) removida(s).`);
            } catch (error) {
              Alert.alert("Erro ao limpar sugestões", error.message);
            }
          },
        },
      ]
    );
  }

  async function handleSearchManualMovie() {
    if (!manualQuery.trim()) {
      Alert.alert("Digite um filme", "Escreva o nome do filme que deseja adicionar ao clube.");
      return;
    }
    setSearchingManual(true);
    try {
      const data = await searchMovies(manualQuery);
      setManualResults(data.slice(0, 8));
    } catch (error) {
      Alert.alert("Erro na busca", error.message);
    } finally {
      setSearchingManual(false);
    }
  }

  async function handleAddManualMovie(movie) {
    const existing = existingMovieByTmdbId[Number(movie.id)];

    if (existing?.status === "watched") {
      Alert.alert("Filme já assistido", `“${movie.title || "Este filme"}” já foi assistido pelo clube e continua salvo no histórico.`);
      return;
    }

    if (existing) {
      Alert.alert("Filme já adicionado", `“${movie.title || "Este filme"}” já está nas sugestões, votação ou filme da semana.`);
      return;
    }

    setAddingMovieId(movie.id);
    try {
      await suggestMovieToClub({ clubId, userId: user.id, movie });
      setManualQuery("");
      setManualResults([]);
      await loadClubData();
      Alert.alert("Filme adicionado", "O filme entrou nas sugestões do clube.");
    } catch (error) {
      Alert.alert("Erro ao adicionar filme", error.message);
      setAddingMovieId(null);
    }
  }

  async function handleToggleVotingCandidate(item) {
    const currentIds = votingCandidates.map((candidate) => candidate.id);
    const alreadyCandidate = currentIds.includes(item.id);
    const nextIds = alreadyCandidate ? currentIds.filter((id) => id !== item.id) : [...currentIds, item.id];

    if (nextIds.length > 3) {
      Alert.alert("Limite da votação", "Escolha no máximo 3 filmes para a votação da semana.");
      return;
    }

    try {
      await setVotingCandidates({ clubId, clubMovieIds: nextIds, weekStart: item.week_start || activeVoteWeek });
      await loadClubData();
    } catch (error) {
      Alert.alert("Erro na votação", error.message);
    }
  }

  async function handleVote(item) {
    try {
      await voteForClubMovie({ clubId, clubMovieId: item.id });
      await loadClubData();
    } catch (error) {
      Alert.alert("Erro ao votar", error.message);
    }
  }

  async function handleSelectMovie(item) {
    try {
      await selectWeeklyMovie({ clubId, clubMovie: item });
      await loadClubData();
    } catch (error) {
      Alert.alert("Erro ao escolher filme", error.message);
    }
  }

  async function handleMarkWatched(item) {
    try {
      await markClubMovieWatched(item.id);
      saveClubMovieAsPrivateWatched(item);
      await loadClubData();
      Alert.alert("Filme assistido", "O filme foi marcado como assistido pelo clube e também entrou nos seus assistidos privados.");
    } catch (error) {
      Alert.alert("Erro ao marcar como assistido", error.message);
    }
  }

  async function handleRemoveSuggestion(item) {
    if (item.status === "watched") {
      Alert.alert("Histórico preservado", "Filmes já assistidos não são apagados pela lista de sugestões.");
      return;
    }

    Alert.alert("Remover filme", `Remover “${item.movie?.title || "filme"}” das sugestões do clube?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteClubMovie({ clubMovieId: item.id });
            await loadClubData();
          } catch (error) {
            Alert.alert("Erro ao remover filme", error.message);
          }
        },
      },
    ]);
  }

  async function handleSubmitReview() {
    if (!selectedMovie) return;
    if (!reviewRating) {
      Alert.alert("Nota obrigatória", "Escolha uma nota de 1 a 5 estrelas para o filme do clube.");
      return;
    }

    setSavingReview(true);
    try {
      await submitClubReview({ clubId, clubMovieId: selectedMovie.id, userId: user.id, rating: reviewRating, comment: reviewText });
      saveClubReviewPrivately(selectedMovie, reviewRating, personalComment);
      await loadClubData();
      Alert.alert("Avaliação salva", "Sua avaliação foi registrada, o filme entrou nos seus assistidos privados e sua nota também foi salva nas suas estrelas.");
    } catch (error) {
      Alert.alert("Erro ao salvar avaliação", error.message);
      setSavingReview(false);
    }
  }

  async function handleSaveMemberNickname(member) {
    try {
      await updateClubMemberNickname({ clubId, memberId: member.id, nickname: editingNickname });
      setEditingMemberId(null);
      setEditingNickname("");
      await loadClubData();
    } catch (error) {
      Alert.alert("Erro ao editar apelido", error.message);
    }
  }

  async function handleChangeMemberRole(member, role) {
    const action = role === "admin" ? "tornar ADM" : "remover ADM";
    const name = member.nickname || member.profiles?.full_name || member.profiles?.username || "membro";

    Alert.alert("Alterar permissão", `Deseja ${action} de ${name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            await setClubMemberRole({ clubId, memberId: member.id, role });
            await loadClubData();
          } catch (error) {
            Alert.alert("Erro ao alterar permissão", error.message);
          }
        },
      },
    ]);
  }

  async function handleRemoveMember(member) {
    const name = member.nickname || member.profiles?.full_name || member.profiles?.username || "membro";
    Alert.alert("Remover participante", `Remover ${name} do clube?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removeClubMember({ clubId, memberId: member.id });
            await loadClubData();
          } catch (error) {
            Alert.alert("Erro ao remover participante", error.message);
          }
        },
      },
    ]);
  }

  async function handleLeaveClub() {
    Alert.alert("Sair do clube", "Você quer sair deste clube?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await leaveClub({ clubId });
            navigation.goBack();
          } catch (error) {
            Alert.alert("Erro ao sair do clube", error.message);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.muted, marginTop: 12 }}>Carregando clube...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 18, paddingBottom: 150 }}>
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 30, padding: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 58, height: 58, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 28 }}>🎬</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: "900" }}>{club?.name || "Clube"}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{isAdmin ? "Painel do clube e votação" : "Clube privado de filmes"}</Text>
          </View>
        </View>

        {!!club?.description && <Text style={{ color: colors.muted, marginTop: 14, lineHeight: 21 }}>{club.description}</Text>}

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {isAdmin && (
            <View style={{ backgroundColor: colors.background, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.secondary, fontWeight: "900" }}>Código: {club?.invite_code}</Text>
            </View>
          )}
          <View style={{ backgroundColor: colors.background, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: "900" }}>{members.length} membro(s)</Text>
          </View>
          <View style={{ backgroundColor: colors.background, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: isAdmin ? colors.secondary : colors.muted, fontWeight: "900" }}>{isAdmin ? "Você é ADM" : "Você é membro"}</Text>
          </View>
          <View style={{ backgroundColor: colors.background, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: "900" }}>{watchedMovies.length} assistido(s)</Text>
          </View>
        </View>
      </View>

      {isAdmin && (
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 20 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Configurações do clube</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>Edite nome, descrição, gêneros permitidos e código privado do clube.</Text>
          <TextInput
            value={settingsName}
            onChangeText={setSettingsName}
            placeholder="Nome do clube"
            placeholderTextColor={colors.muted}
            style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
          />
          <TextInput
            value={settingsDescription}
            onChangeText={setSettingsDescription}
            placeholder="Descrição opcional"
            placeholderTextColor={colors.muted}
            multiline
            style={{ minHeight: 76, textAlignVertical: "top", backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 10 }}
          />
          <Text style={{ color: colors.text, fontWeight: "900", marginTop: 14 }}>Gêneros permitidos</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
            {MOVIE_GENRES.map((genre) => (
              <GenreChip key={genre.id} genre={genre} selected={settingsGenres.includes(genre.id)} onPress={() => toggleSettingsGenre(genre.id)} />
            ))}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            <SmallButton label={savingSettings ? "Salvando..." : "Salvar configurações"} disabled={savingSettings} onPress={handleSaveSettings} />
            <SmallButton label="Gerar novo código" secondary onPress={handleRegenerateCode} />
            {isOwner && <SmallButton label="Excluir clube" danger onPress={handleDeleteClub} />}
          </View>
        </View>
      )}

      {isAdmin && (
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Adicionar filme manualmente</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>Use quando o clube já sabe um filme específico, sem precisar gerar sugestões automáticas.</Text>
          <View style={{ marginTop: 12 }}>
            <TextInput
              value={manualQuery}
              onChangeText={setManualQuery}
              placeholder="Ex: Interestelar"
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              onSubmitEditing={handleSearchManualMovie}
              style={{
                minHeight: 50,
                backgroundColor: colors.background,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
              }}
            />
            <SmallButton
              fullWidth
              label={searchingManual ? "Buscando..." : "Buscar filme"}
              onPress={handleSearchManualMovie}
              disabled={searchingManual}
              style={{ marginTop: 10, borderRadius: 14, minHeight: 48 }}
            />
          </View>
          {manualResults.map((movie) => {
            const existing = existingMovieByTmdbId[Number(movie.id)];
            const alreadyWatched = existing?.status === "watched";
            const alreadyAdded = !!existing && !alreadyWatched;
            const disabled = !!addingMovieId || alreadyWatched || alreadyAdded;
            const buttonLabel = alreadyWatched
              ? "Já assistido pelo clube"
              : alreadyAdded
                ? "Já está no clube"
                : addingMovieId === movie.id
                  ? "Adicionando..."
                  : "Adicionar ao clube";

            return (
            <View key={movie.id} style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                {getPosterUrl(movie.poster_path, "w92") ? (
                  <Image source={{ uri: getPosterUrl(movie.poster_path, "w92") }} style={{ width: 44, height: 66, borderRadius: 8, backgroundColor: colors.surfaceLight }} />
                ) : (
                  <View style={{ width: 44, height: 66, borderRadius: 8, backgroundColor: colors.surfaceLight, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: colors.muted, fontSize: 10, textAlign: "center" }}>Sem poster</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={{ color: colors.text, fontWeight: "900" }}>{movie.title}</Text>
                  <Text style={{ color: colors.muted, marginTop: 2 }}>{(movie.release_date || "----").slice(0, 4)} • ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</Text>
                </View>
              </View>
              {(alreadyWatched || alreadyAdded) && (
                <Text style={{ color: alreadyWatched ? colors.success : colors.secondary, fontWeight: "900", marginTop: 8 }}>
                  {alreadyWatched ? "Esse filme já está no histórico de assistidos do clube." : "Esse filme já está nas sugestões/votação do clube."}
                </Text>
              )}
              <SmallButton
                fullWidth
                label={buttonLabel}
                disabled={disabled}
                onPress={() => handleAddManualMovie(movie)}
                secondary={alreadyWatched || alreadyAdded}
                style={{ marginTop: 10, borderRadius: 14, minHeight: 44 }}
              />
            </View>
            );
          })}
        </View>
      )}

      <WeekMovieHero
        selectedMovie={selectedMovie}
        groupAverage={groupAverage}
        selectedReviews={selectedReviews}
        navigation={navigation}
        isAdmin={isAdmin}
        onMarkWatched={() => selectedMovie && handleMarkWatched(selectedMovie)}
      />

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Votação da semana</Text>
        <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>
          O ADM pode colocar até 3 sugestões em votação. Cada pessoa vota em uma opção por semana.
        </Text>
        {votingCandidates.length === 0 ? (
          <Text style={{ color: colors.muted, marginTop: 10 }}>Nenhum filme em votação agora.</Text>
        ) : (
          <View style={{ marginTop: 12 }}>
            {votingCandidates.map((candidate) => {
              const candidateVotes = votesByMovie[candidate.id] || [];
              const isMyVote = myVote?.club_movie_id === candidate.id;
              return (
                <View key={candidate.id} style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: "900" }}>{candidate.movie?.title}</Text>
                  <Text style={{ color: isMyVote ? colors.secondary : colors.muted, fontWeight: "800", marginTop: 4 }}>
                    {candidateVotes.length} voto(s){isMyVote ? " • seu voto" : ""}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    <SmallButton label={isMyVote ? "Votado" : "Votar neste"} onPress={() => handleVote(candidate)} secondary={isMyVote} />
                    {isAdmin && <SmallButton label="Definir vencedor" onPress={() => handleSelectMovie(candidate)} />}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Avaliação do filme escolhido</Text>
        {selectedMovie ? (
          <>
            <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 20 }}>Dê sua nota. Ao salvar, esse filme também entra nos seus assistidos privados com a mesma nota. O comentário do grupo aparece para todos; a anotação pessoal fica salva nas anotações do filme.</Text>
            <View style={{ marginTop: 12 }}>
              <RatingStars rating={reviewRating} onChange={setReviewRating} size={34} />
            </View>
            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Comentário para o grupo..."
              placeholderTextColor={colors.muted}
              multiline
              style={{ minHeight: 86, textAlignVertical: "top", backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 12 }}
            />
            <TextInput
              value={personalComment}
              onChangeText={setPersonalComment}
              placeholder="Anotação pessoal do filme..."
              placeholderTextColor={colors.muted}
              multiline
              style={{ minHeight: 86, textAlignVertical: "top", backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginTop: 10 }}
            />
            <TouchableOpacity onPress={handleSubmitReview} disabled={savingReview} style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 13, alignItems: "center", marginTop: 12, opacity: savingReview ? 0.55 : 1 }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>{savingReview ? "Salvando..." : myReview ? "Atualizar avaliação" : "Salvar avaliação"}</Text>
            </TouchableOpacity>

            {selectedReviews.length > 0 && (
              <View style={{ marginTop: 18 }}>
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Comentários do grupo</Text>
                {selectedReviews.map((review) => {
                  const profile = review.profiles || {};
                  return (
                    <View key={review.id} style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12, flexDirection: "row", gap: 10 }}>
                      <Avatar profile={profile} size={36} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.secondary, fontWeight: "900" }}>{profile.full_name || profile.username || "Membro"} • {review.rating}/5</Text>
                        {!!review.comment && <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{review.comment}</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        ) : (
          <Text style={{ color: colors.muted, marginTop: 8 }}>Escolha o filme da semana para liberar a avaliação.</Text>
        )}
      </View>

      <View style={{ marginTop: 22 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>Filmes assistidos pelo clube</Text>
        <Text style={{ color: colors.muted, marginTop: 5, lineHeight: 20 }}>Ranking do melhor para o pior, usando a média das avaliações do grupo.</Text>
        {watchedMovies.length === 0 ? (
          <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginTop: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.muted, lineHeight: 20 }}>Nenhum filme foi marcado como assistido pelo grupo ainda.</Text>
          </View>
        ) : (
          watchedMovies.map((item, index) => (
            <WatchedClubMovieCard key={item.id} item={item} index={index} navigation={navigation} />
          ))
        )}
      </View>

      <View style={{ marginTop: 22 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>Sugestões do clube</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{isAdmin ? "Gere opções, adicione filmes manualmente, coloque até 3 em votação e defina o filme do grupo." : "Vote nas opções que o ADM colocou na votação."}</Text>
          </View>
          {isAdmin && (
            <View style={{ gap: 8 }}>
              <SmallButton label={generating ? "Gerando..." : "Gerar"} onPress={handleGenerateSuggestions} disabled={generating} />
              <SmallButton label="Limpar" secondary danger onPress={handleClearSuggestions} />
            </View>
          )}
        </View>

        {suggestionMovies.length === 0 ? (
          <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginTop: 14 }}>
            <Text style={{ color: colors.muted, lineHeight: 20 }}>Nenhuma sugestão ainda.</Text>
          </View>
        ) : (
          <View style={{ marginTop: 14 }}>
            {suggestionMovies.map((item) => (
              <MovieSuggestionCard
                key={item.id}
                item={item}
                navigation={navigation}
                selected={selectedMovie?.id === item.id}
                reviews={reviewsByMovie[item.id] || []}
                votes={votesByMovie[item.id] || []}
                myVote={myVote}
                isAdmin={isAdmin}
                voteCandidateDisabled={votingCandidates.length >= 3}
                onToggleVoteCandidate={() => handleToggleVotingCandidate(item)}
                onVote={() => handleVote(item)}
                onSelect={() => handleSelectMovie(item)}
                onMarkWatched={() => handleMarkWatched(item)}
                onRemove={() => handleRemoveSuggestion(item)}
              />
            ))}
          </View>
        )}
      </View>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 16, marginTop: 18 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Participantes</Text>
        <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{isAdmin ? "Como ADM, você pode remover membros e editar apelidos. O ADM criador também pode promover ou remover ADMs." : "Veja quem está participando deste clube."}</Text>
        {members.map((member) => {
          const profile = member.profiles || {};
          const name = member.nickname || profile.full_name || profile.username || "Membro";
          const editing = editingMemberId === member.id;
          const protectedOwner = member.role === "owner";
          return (
            <View key={member.id} style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar profile={profile} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "900" }}>{name}</Text>
                  <Text style={{ color: colors.muted, marginTop: 2 }}>{member.role === "owner" ? "ADM criador" : member.role === "admin" ? "ADM" : "Membro"}</Text>
                </View>
              </View>

              {editing && (
                <View style={{ marginTop: 10 }}>
                  <TextInput
                    value={editingNickname}
                    onChangeText={setEditingNickname}
                    placeholder="Apelido dentro do clube"
                    placeholderTextColor={colors.muted}
                    style={{ backgroundColor: colors.background, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12 }}
                  />
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    <SmallButton label="Salvar apelido" onPress={() => handleSaveMemberNickname(member)} />
                    <SmallButton label="Cancelar" secondary onPress={() => { setEditingMemberId(null); setEditingNickname(""); }} />
                  </View>
                </View>
              )}

              {isAdmin && !editing && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  <SmallButton label="Editar apelido" secondary onPress={() => { setEditingMemberId(member.id); setEditingNickname(member.nickname || ""); }} />
                  {isOwner && !protectedOwner && (
                    <SmallButton
                      label={member.role === "admin" ? "Remover ADM" : "Tornar ADM"}
                      secondary={member.role === "admin"}
                      onPress={() => handleChangeMemberRole(member, member.role === "admin" ? "member" : "admin")}
                    />
                  )}
                  {!protectedOwner && <SmallButton label="Remover" danger onPress={() => handleRemoveMember(member)} />}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {!isOwner && <SmallButton label="Sair deste clube" danger onPress={handleLeaveClub} />}
      {isOwner && <Text style={{ color: colors.muted, marginTop: 16, lineHeight: 20 }}>Você é o ADM criador. Para encerrar o grupo, use o botão “Excluir clube” nas configurações.</Text>}
    </ScrollView>
  );
}
