import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmptyState from "../components/EmptyState";
import RatingStars from "../components/RatingStars";
import { useMovies } from "../contexts/MovieContext";
import { getBackdropUrl, getMovieDetails, getPosterUrl } from "../services/tmdb";
import { colors } from "../styles/theme";

function ActionButton({ label, active, onPress, danger = false, full = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flex: full ? 0 : 1,
        width: full ? "100%" : undefined,
        minHeight: 48,
        backgroundColor: danger ? colors.danger : active ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: danger ? colors.danger : active ? colors.primary : colors.border,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.86}
        style={{ color: colors.text, fontWeight: "900", textAlign: "center", lineHeight: 18 }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function MovieDetailScreen({ route }) {
  const baseMovie = route.params.movie;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  const {
    state,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    removeMovieFromWatched,
    saveMovieRating,
    addMovieNote,
    updateMovieNote,
    removeMovieNote,
    getMovieNotes,
    setMovieReaction,
    toggleMovieInCustomList,
    isFavorite,
    isInWatchlist,
    isWatched,
    getMovieReaction,
    isInCustomList,
  } = useMovies();

  const movie = details || baseMovie;
  const watchedInfo = state.watched[movie.id];
  const notes = getMovieNotes(movie.id);
  const rating = watchedInfo?.rating || 0;
  const reaction = getMovieReaction(movie.id);
  const watched = isWatched(movie.id);

  const backdrop = getBackdropUrl(movie.backdrop_path, "w780");
  const poster = getPosterUrl(movie.poster_path, "w342");

  const genreText = useMemo(() => {
    if (details?.genres?.length) return details.genres.map((genre) => genre.name).join(", ");
    return "Gêneros não carregados";
  }, [details]);

  useEffect(() => {
    async function loadDetails() {
      try {
        const data = await getMovieDetails(baseMovie.id);
        setDetails(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [baseMovie.id]);

  function handleAddNote() {
    addMovieNote(movie, note);
    setNote("");
  }

  function handleToggleWatched() {
    if (!watched) {
      toggleWatched(movie);
      return;
    }

    Alert.alert(
      "Remover de assistidos",
      "Isso remove o filme apenas da lista de assistidos. As anotações salvas serão mantidas.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () => removeMovieFromWatched(movie.id) },
      ]
    );
  }

  function startEditNote(item) {
    setEditingNoteId(item.id);
    setEditingNoteText(item.text);
  }

  function cancelEditNote() {
    setEditingNoteId(null);
    setEditingNoteText("");
  }

  function saveEditNote() {
    updateMovieNote(movie.id, editingNoteId, editingNoteText);
    cancelEditNote();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 130 }}>
      {backdrop ? (
        <Image source={{ uri: backdrop }} style={{ width: "100%", height: 230, backgroundColor: colors.surface }} />
      ) : (
        <View style={{ width: "100%", height: 160, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>Sem banner</Text>
        </View>
      )}

      <View style={{ padding: 18 }}>
        <View style={{ flexDirection: "row", gap: 14 }}>
          {poster ? (
            <Image source={{ uri: poster }} style={{ width: 120, height: 180, borderRadius: 16, backgroundColor: colors.surface }} />
          ) : (
            <View style={{ width: 120, height: 180, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.muted }}>Sem imagem</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900" }}>{movie.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 8 }}>{genreText}</Text>
            <Text style={{ color: colors.secondary, marginTop: 10, fontWeight: "900" }}>
              ⭐ TMDB: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </Text>
            <Text style={{ color: colors.muted, marginTop: 8 }}>
              Ano: {(movie.release_date || "----").slice(0, 4)}
            </Text>
            {!!details?.runtime && <Text style={{ color: colors.muted, marginTop: 6 }}>Duração: {details.runtime} min</Text>}
            {!!details?.tagline && <Text style={{ color: colors.muted, marginTop: 8, fontStyle: "italic" }}>“{details.tagline}”</Text>}
          </View>
        </View>

        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 18 }} />}

        <View style={{ flexDirection: "row", gap: 10, marginTop: 22 }}>
          <ActionButton
            label={isFavorite(movie.id) ? "♥ Favorito" : "♡ Favoritar"}
            active={isFavorite(movie.id)}
            onPress={() => toggleFavorite(movie)}
          />
          <ActionButton
            label={isInWatchlist(movie.id) ? "✓ Watchlist" : "+ Watchlist"}
            active={isInWatchlist(movie.id)}
            onPress={() => toggleWatchlist(movie)}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <ActionButton
            label={watched ? "✓ Assistido — tocar para remover" : "+ Adicionar em assistidos"}
            active={watched}
            danger={watched}
            full
            onPress={handleToggleWatched}
          />

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <ActionButton
              label={reaction === "like" ? "👍 Curtido" : "👍 Like"}
              active={reaction === "like"}
              onPress={() => setMovieReaction(movie, "like")}
            />
            <ActionButton
              label={reaction === "dislike" ? "👎 Não curti" : "👎 Dislike"}
              active={reaction === "dislike"}
              onPress={() => setMovieReaction(movie, "dislike")}
            />
          </View>
        </View>

        <View style={{ marginTop: 26 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Descrição</Text>
          <Text style={{ color: colors.muted, marginTop: 10, lineHeight: 22 }}>
            {movie.overview || "Este filme não possui descrição em português."}
          </Text>
        </View>

        <View style={{ marginTop: 26, backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Minha nota</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            Toque em uma estrela para salvar. Toque na mesma estrela de novo para remover a nota.
          </Text>
          <View style={{ marginTop: 12 }}>
            <RatingStars rating={rating} onChange={(value) => saveMovieRating(movie, value)} />
          </View>

          {rating > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => saveMovieRating(movie, 0)}
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.surfaceLight,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 9,
                marginTop: 12,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "900" }}>Remover estrelas</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginTop: 26 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Anotações</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            As anotações ficam salvas no aparelho e continuam existindo mesmo se você remover o filme dos assistidos.
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Escreva uma anotação sobre o filme..."
            placeholderTextColor={colors.muted}
            multiline
            style={{
              minHeight: 95,
              textAlignVertical: "top",
              marginTop: 12,
              backgroundColor: colors.surface,
              color: colors.text,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 14,
            }}
          />
          <TouchableOpacity
            onPress={handleAddNote}
            style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 14, alignItems: "center", marginTop: 10 }}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>Salvar anotação</Text>
          </TouchableOpacity>

          {notes.length === 0 ? (
            <EmptyState title="Sem anotações" description="Suas observações sobre o filme aparecem aqui." />
          ) : (
            notes.map((item) => {
              const editing = editingNoteId === item.id;

              return (
                <View key={item.id} style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginTop: 12, borderWidth: 1, borderColor: colors.border }}>
                  {editing ? (
                    <>
                      <TextInput
                        value={editingNoteText}
                        onChangeText={setEditingNoteText}
                        multiline
                        placeholder="Editar anotação..."
                        placeholderTextColor={colors.muted}
                        style={{
                          minHeight: 90,
                          textAlignVertical: "top",
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: colors.border,
                          padding: 12,
                        }}
                      />
                      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                        <ActionButton label="Salvar edição" active onPress={saveEditNote} />
                        <ActionButton label="Cancelar" onPress={cancelEditNote} />
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: colors.text, lineHeight: 21 }}>{item.text}</Text>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          {item.updatedAt ? "Editado em " : "Criado em "}
                          {new Date(item.updatedAt || item.createdAt).toLocaleDateString("pt-BR")}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 16 }}>
                          <TouchableOpacity onPress={() => startEditNote(item)}>
                            <Text style={{ color: colors.secondary, fontWeight: "800" }}>Editar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert("Excluir anotação", "Deseja remover esta anotação?", [
                                { text: "Cancelar", style: "cancel" },
                                { text: "Excluir", style: "destructive", onPress: () => removeMovieNote(movie.id, item.id) },
                              ]);
                            }}
                          >
                            <Text style={{ color: colors.danger, fontWeight: "800" }}>Excluir</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={{ marginTop: 26 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Listas personalizadas</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            Crie listas na aba “Minhas listas” e adicione o filme por aqui.
          </Text>

          {state.customLists.length === 0 ? (
            <EmptyState title="Nenhuma lista criada" description="Depois de criar uma lista, ela aparecerá nesta seção." />
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
              {state.customLists.map((list) => {
                const active = isInCustomList(list.id, movie.id);

                return (
                  <TouchableOpacity
                    key={list.id}
                    onPress={() => toggleMovieInCustomList(list.id, movie)}
                    style={{
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                      borderWidth: 1,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: colors.text, fontWeight: "800" }}>
                      {active ? "✓ " : "+ "}{list.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
