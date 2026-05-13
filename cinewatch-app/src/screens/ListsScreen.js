import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmptyState from "../components/EmptyState";
import MovieCard from "../components/MovieCard";
import RatingStars from "../components/RatingStars";
import { useMovies } from "../contexts/MovieContext";
import { colors } from "../styles/theme";

const tabs = [
  { id: "watchlist", label: "Watchlist" },
  { id: "favorites", label: "Favoritos" },
  { id: "liked", label: "Curtidos" },
  { id: "disliked", label: "Não curti" },
  { id: "watched", label: "Assistidos" },
  { id: "custom", label: "Minhas listas" },
];

const sortOptions = [
  { id: "default", label: "Padrão" },
  { id: "myRatingDesc", label: "Minha nota ↓" },
  { id: "myRatingAsc", label: "Minha nota ↑" },
  { id: "tmdbDesc", label: "Nota TMDB ↓" },
  { id: "titleAsc", label: "A-Z" },
  { id: "yearDesc", label: "Ano ↓" },
];

function TabButton({ tab, activeTab, setActiveTab }) {
  const active = activeTab === tab.id;

  return (
    <TouchableOpacity
      onPress={() => setActiveTab(tab.id)}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: active ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        marginRight: 8,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "800" }}>{tab.label}</Text>
    </TouchableOpacity>
  );
}

function SmallButton({ label, onPress, danger = false, primary = false, secondary = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: primary ? colors.primary : danger ? colors.danger : secondary ? colors.background : colors.surfaceLight,
        borderWidth: 1,
        borderColor: primary ? colors.primary : danger ? colors.danger : colors.border,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function ControlChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: active ? colors.primary : colors.surface,
        borderColor: active ? colors.primary : colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginRight: 8,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function MovieListItem({ movie, navigation, rating = 0, notesCount = 0, watched = false, onRemove, removeLabel = "Remover" }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("MovieDetail", { movie })}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>{movie.title || "Filme sem título"}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} • {(movie.release_date || "----").slice(0, 4)}
            </Text>
          </View>
          {watched && (
            <View style={{ backgroundColor: colors.success, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, alignSelf: "flex-start" }}>
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 11 }}>✓ Já vi</Text>
            </View>
          )}
        </View>
        {!!rating && (
          <View style={{ marginTop: 8 }}>
            <RatingStars rating={rating} size={22} />
          </View>
        )}
        {notesCount > 0 && <Text style={{ color: colors.muted, marginTop: 8 }}>{notesCount} anotação(ões)</Text>}
      </TouchableOpacity>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        <SmallButton label="Abrir detalhes" onPress={() => navigation.navigate("MovieDetail", { movie })} />
        {!!onRemove && <SmallButton label={removeLabel} danger onPress={onRemove} />}
      </View>
    </View>
  );
}

function sortMovies(movies, sortMode, watchedMap = {}) {
  const copy = [...movies];

  function personalRating(movie) {
    return Number(watchedMap?.[movie.id]?.rating || 0);
  }

  if (sortMode === "myRatingDesc") {
    return copy.sort((a, b) => personalRating(b) - personalRating(a) || Number(b.vote_average || 0) - Number(a.vote_average || 0));
  }

  if (sortMode === "myRatingAsc") {
    return copy.sort((a, b) => personalRating(a) - personalRating(b) || Number(a.vote_average || 0) - Number(b.vote_average || 0));
  }

  if (sortMode === "tmdbDesc") {
    return copy.sort((a, b) => Number(b.vote_average || 0) - Number(a.vote_average || 0));
  }

  if (sortMode === "titleAsc") {
    return copy.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  }

  if (sortMode === "yearDesc") {
    return copy.sort((a, b) => Number((b.release_date || "0").slice(0, 4)) - Number((a.release_date || "0").slice(0, 4)));
  }

  return copy;
}

function sortWatchedItems(items, sortMode) {
  const copy = [...items];

  if (sortMode === "default" || sortMode === "myRatingDesc") {
    return copy.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  if (sortMode === "myRatingAsc") {
    return copy.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
  }

  if (sortMode === "tmdbDesc") {
    return copy.sort((a, b) => Number(b.movie?.vote_average || 0) - Number(a.movie?.vote_average || 0));
  }

  if (sortMode === "titleAsc") {
    return copy.sort((a, b) => String(a.movie?.title || "").localeCompare(String(b.movie?.title || "")));
  }

  if (sortMode === "yearDesc") {
    return copy.sort((a, b) => Number((b.movie?.release_date || "0").slice(0, 4)) - Number((a.movie?.release_date || "0").slice(0, 4)));
  }

  return copy;
}

export default function ListsScreen({ navigation }) {
  const {
    state,
    watchedList,
    likedMovies,
    dislikedMovies,
    createCustomList,
    updateCustomListName,
    deleteCustomList,
    toggleMovieInCustomList,
    toggleWatchlist,
    toggleFavorite,
    setMovieReaction,
    removeMovieFromWatched,
    getMovieNotes,
    isWatched,
  } = useMovies();

  const [activeTab, setActiveTab] = useState("watchlist");
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("default");
  const [listName, setListName] = useState("");
  const [listSearch, setListSearch] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [editingMoviesListId, setEditingMoviesListId] = useState(null);

  const filteredCustomLists = useMemo(() => {
    const query = listSearch.trim().toLowerCase();
    if (!query) return state.customLists;

    return state.customLists.filter((list) => list.name.toLowerCase().includes(query));
  }, [state.customLists, listSearch]);

  function handleCreateList() {
    if (!listName.trim()) return;
    createCustomList(listName);
    setListName("");
  }

  function startEditList(list) {
    setEditingListId(list.id);
    setEditingListName(list.name);
    setEditingMoviesListId(null);
  }

  function cancelEditList() {
    setEditingListId(null);
    setEditingListName("");
  }

  function saveEditList() {
    updateCustomListName(editingListId, editingListName);
    cancelEditList();
  }

  function toggleEditMovies(listId) {
    setEditingMoviesListId((current) => (current === listId ? null : listId));
    setEditingListId(null);
  }

  function removeMovieFromCustomList(list, movie) {
    Alert.alert(
      "Remover filme da lista",
      `Deseja remover ${movie.title} da lista ${list.name}? Isso não apaga anotações, estrelas, favoritos ou assistidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () => toggleMovieInCustomList(list.id, movie) },
      ]
    );
  }

  function renderControls() {
    if (activeTab === "custom") return null;

    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 22,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>Como mostrar</Text>
            <Text style={{ color: colors.muted, marginTop: 3, fontSize: 12 }}>Troque entre grade e lista sem perder a ordenação.</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ControlChip label="Grade" active={viewMode === "grid"} onPress={() => setViewMode("grid")} />
            <ControlChip label="Lista" active={viewMode === "list"} onPress={() => setViewMode("list")} />
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 14 }} />

        <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>Ordenar filmes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortOptions.map((option) => (
            <ControlChip key={option.id} label={option.label} active={sortMode === option.id} onPress={() => setSortMode(option.id)} />
          ))}
        </ScrollView>
      </View>
    );
  }

  function renderMovieCollection(data, emptyTitle, emptyDescription, getRemoveAction) {
    const sorted = sortMovies(data, sortMode, state.watched);

    if (!sorted.length) {
      return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    if (viewMode === "list") {
      return sorted.map((movie) => {
        const removeAction = getRemoveAction?.(movie);
        return (
          <MovieListItem
            key={movie.id}
            movie={movie}
            navigation={navigation}
            watched={isWatched(movie.id)}
            rating={state.watched?.[movie.id]?.rating || 0}
            notesCount={getMovieNotes(movie.id).length}
            onRemove={removeAction?.onPress}
            removeLabel={removeAction?.label || "Remover"}
          />
        );
      });
    }

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {sorted.map((movie) => (
          <MovieCard key={movie.id} movie={movie} navigation={navigation} />
        ))}
      </View>
    );
  }

  function renderWatched() {
    const sorted = sortWatchedItems(watchedList, sortMode);

    if (!sorted.length) {
      return <EmptyState title="Nenhum filme assistido" description="Abra um filme e toque em Adicionar em assistidos." />;
    }

    if (viewMode === "grid") {
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {sorted.map((item) => (
            <MovieCard key={item.movie.id} movie={item.movie} navigation={navigation} />
          ))}
        </View>
      );
    }

    return sorted.map((item) => (
      <MovieListItem
        key={item.movie.id}
        movie={item.movie}
        navigation={navigation}
        watched
        rating={item.rating || 0}
        notesCount={getMovieNotes(item.movie.id).length}
        removeLabel="Remover assistido"
        onRemove={() => {
          Alert.alert(
            "Remover de assistidos",
            "Isso remove o filme apenas da lista de assistidos. As anotações salvas serão mantidas.",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Remover", style: "destructive", onPress: () => removeMovieFromWatched(item.movie.id) },
            ]
          );
        }}
      />
    ));
  }

  function renderCustomListControls() {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 24,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Gerenciar listas</Text>
        <Text style={{ color: colors.muted, marginTop: 5, lineHeight: 20 }}>
          Crie, pesquise, ordene e escolha como os filmes aparecem dentro das suas listas.
        </Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <TextInput
            value={listName}
            onChangeText={setListName}
            placeholder="Nome da nova lista"
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              backgroundColor: colors.background,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreateList}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 18, justifyContent: "center", borderRadius: 16 }}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>Criar</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          value={listSearch}
          onChangeText={setListSearch}
          placeholder="Pesquisar lista pelo nome"
          placeholderTextColor={colors.muted}
          style={{
            backgroundColor: colors.background,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginTop: 12,
          }}
        />

        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />

        <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>Visualização dos filmes</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
          <ControlChip label="Grade" active={viewMode === "grid"} onPress={() => setViewMode("grid")} />
          <ControlChip label="Lista" active={viewMode === "list"} onPress={() => setViewMode("list")} />
        </View>

        <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>Ordenar filmes das listas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortOptions.map((option) => (
            <ControlChip key={option.id} label={option.label} active={sortMode === option.id} onPress={() => setSortMode(option.id)} />
          ))}
        </ScrollView>
      </View>
    );
  }

  function renderCustomLists() {
    return (
      <View>
        {renderCustomListControls()}

        {!state.customLists.length && (
          <EmptyState title="Nenhuma lista personalizada" description="Crie listas como Terror, Filmes com amigos ou Top 10." />
        )}

        {state.customLists.length > 0 && !filteredCustomLists.length && (
          <EmptyState title="Nenhuma lista encontrada" description="Tente pesquisar por outro nome." />
        )}

        {filteredCustomLists.map((list) => {
          const editingName = editingListId === list.id;
          const editingMovies = editingMoviesListId === list.id;
          const sortedListMovies = sortMovies(list.movies, sortMode, state.watched);

          return (
            <View
              key={list.id}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: editingMovies ? colors.primary : colors.border,
                borderRadius: 24,
                padding: 16,
                marginBottom: 16,
              }}
            >
              {editingName ? (
                <View>
                  <Text style={{ color: colors.text, fontWeight: "900", fontSize: 18 }}>Editar nome da lista</Text>
                  <TextInput
                    value={editingListName}
                    onChangeText={setEditingListName}
                    placeholder="Novo nome da lista"
                    placeholderTextColor={colors.muted}
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 16,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      marginTop: 12,
                    }}
                  />
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    <SmallButton label="Salvar" primary onPress={saveEditList} />
                    <SmallButton label="Cancelar" secondary onPress={cancelEditList} />
                  </View>
                </View>
              ) : (
                <>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 21 }}>{list.name}</Text>
                      <Text style={{ color: colors.muted, marginTop: 5 }}>
                        {list.movies.length} filme(s) • {viewMode === "grid" ? "modo grade" : "modo lista"}
                      </Text>
                    </View>
                    {editingMovies && (
                      <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
                        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 11 }}>Editando</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    <SmallButton label="Editar nome" secondary onPress={() => startEditList(list)} />
                    <SmallButton
                      label={editingMovies ? "Concluir edição" : "Editar filmes"}
                      primary={editingMovies}
                      onPress={() => toggleEditMovies(list.id)}
                    />
                    <SmallButton
                      label="Excluir lista"
                      danger
                      onPress={() => {
                        Alert.alert("Excluir lista", `Deseja excluir a lista ${list.name}?`, [
                          { text: "Cancelar", style: "cancel" },
                          { text: "Excluir", style: "destructive", onPress: () => deleteCustomList(list.id) },
                        ]);
                      }}
                    />
                  </View>

                  {list.movies.length === 0 && (
                    <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: 14, marginTop: 14, borderWidth: 1, borderColor: colors.border }}>
                      <Text style={{ color: colors.muted, lineHeight: 20 }}>
                        Essa lista ainda não tem filmes. Abra um filme e adicione por lá.
                      </Text>
                    </View>
                  )}

                  {list.movies.length > 0 && !editingMovies && viewMode === "grid" && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 14 }}>
                      {sortedListMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} navigation={navigation} />
                      ))}
                    </View>
                  )}

                  {list.movies.length > 0 && !editingMovies && viewMode === "list" && (
                    <View style={{ marginTop: 12 }}>
                      {sortedListMovies.map((movie) => (
                        <MovieListItem
                          key={movie.id}
                          movie={movie}
                          navigation={navigation}
                          watched={isWatched(movie.id)}
                          rating={state.watched?.[movie.id]?.rating || 0}
                          notesCount={getMovieNotes(movie.id).length}
                        />
                      ))}
                    </View>
                  )}

                  {list.movies.length > 0 && editingMovies && (
                    <View style={{ marginTop: 12 }}>
                      <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 12 }}>
                        <Text style={{ color: colors.text, fontWeight: "900" }}>Modo edição de filmes</Text>
                        <Text style={{ color: colors.muted, marginTop: 5, lineHeight: 20 }}>
                          Remova apenas os filmes dessa lista. O restante dos dados do filme continua salvo.
                        </Text>
                      </View>
                      {sortedListMovies.map((movie) => (
                        <MovieListItem
                          key={movie.id}
                          movie={movie}
                          navigation={navigation}
                          watched={isWatched(movie.id)}
                          rating={state.watched?.[movie.id]?.rating || 0}
                          notesCount={getMovieNotes(movie.id).length}
                          removeLabel="Remover da lista"
                          onRemove={() => removeMovieFromCustomList(list, movie)}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingTop: 58, paddingHorizontal: 18, paddingBottom: 150 }}>
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>Minhas listas</Text>
      <Text style={{ color: colors.muted, marginTop: 6 }}>
        Organize seus filmes em grade ou lista e ordene por nota, ano ou nome.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20, marginBottom: 18 }}>
        {tabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
        ))}
      </ScrollView>

      {renderControls()}

      {activeTab === "watchlist" && renderMovieCollection(state.watchlist, "Watchlist vazia", "Abra um filme e adicione ele à sua watchlist.", (movie) => ({ label: "Remover da watchlist", onPress: () => toggleWatchlist(movie) }))}
      {activeTab === "favorites" && renderMovieCollection(state.favorites, "Nenhum favorito", "Toque no coração de um filme para salvar como favorito.", (movie) => ({ label: "Remover favorito", onPress: () => toggleFavorite(movie) }))}
      {activeTab === "liked" && renderMovieCollection(likedMovies, "Nenhum filme curtido", "Use o botão de like na tela de detalhes.", (movie) => ({ label: "Remover like", onPress: () => setMovieReaction(movie, "like") }))}
      {activeTab === "disliked" && renderMovieCollection(dislikedMovies, "Nenhum dislike", "Use o botão de dislike na tela de detalhes.", (movie) => ({ label: "Remover dislike", onPress: () => setMovieReaction(movie, "dislike") }))}
      {activeTab === "watched" && renderWatched()}
      {activeTab === "custom" && renderCustomLists()}
    </ScrollView>
  );
}
