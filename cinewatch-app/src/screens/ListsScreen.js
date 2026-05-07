import React, { useMemo, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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

function SmallButton({ label, onPress, danger = false, primary = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: primary ? colors.primary : danger ? colors.danger : colors.surfaceLight,
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

function MovieListItem({ movie, navigation, onRemove }) {
  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 12,
        marginTop: 10,
      }}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("MovieDetail", { movie })}>
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 15 }}>{movie.title}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} • {(movie.release_date || "----").slice(0, 4)}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        <SmallButton label="Abrir" onPress={() => navigation.navigate("MovieDetail", { movie })} />
        <SmallButton label="Remover da lista" danger onPress={onRemove} />
      </View>
    </View>
  );
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
    removeMovieFromWatched,
    getMovieNotes,
  } = useMovies();

  const [activeTab, setActiveTab] = useState("watchlist");
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

  function renderMovieGrid(data) {
    if (!data.length) {
      return <EmptyState title="Lista vazia" description="Abra um filme e adicione ele aqui." />;
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} />}
      />
    );
  }

  function renderWatched() {
    if (!watchedList.length) {
      return <EmptyState title="Nenhum filme assistido" description="Abra um filme e toque em Adicionar em assistidos." />;
    }

    return watchedList.map((item) => (
      <View
        key={item.movie.id}
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 18,
          padding: 14,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("MovieDetail", { movie: item.movie })}
        >
          <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>{item.movie.title}</Text>
          <View style={{ marginTop: 8 }}>
            <RatingStars rating={item.rating || 0} size={24} />
          </View>
          <Text style={{ color: colors.muted, marginTop: 8 }}>
            {getMovieNotes(item.movie.id).length} anotação(ões)
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          <SmallButton label="Abrir detalhes" onPress={() => navigation.navigate("MovieDetail", { movie: item.movie })} />
          <SmallButton
            label="Remover assistido"
            danger
            onPress={() => {
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
        </View>
      </View>
    ));
  }

  function renderCustomLists() {
    return (
      <View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <TextInput
            value={listName}
            onChangeText={setListName}
            placeholder="Nome da nova lista"
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
          <TouchableOpacity
            onPress={handleCreateList}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 16, justifyContent: "center", borderRadius: 14 }}
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
            backgroundColor: colors.surface,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 18,
          }}
        />

        {!state.customLists.length && (
          <EmptyState title="Nenhuma lista personalizada" description="Crie listas como Terror, Filmes com amigos ou Top 10." />
        )}

        {state.customLists.length > 0 && !filteredCustomLists.length && (
          <EmptyState title="Nenhuma lista encontrada" description="Tente pesquisar por outro nome." />
        )}

        {filteredCustomLists.map((list) => {
          const editingName = editingListId === list.id;
          const editingMovies = editingMoviesListId === list.id;

          return (
            <View
              key={list.id}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 18,
                padding: 14,
                marginBottom: 14,
              }}
            >
              {editingName ? (
                <View>
                  <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>Editar nome da lista</Text>
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
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                    }}
                  />
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    <SmallButton label="Salvar" primary onPress={saveEditList} />
                    <SmallButton label="Cancelar" onPress={cancelEditList} />
                  </View>
                </View>
              ) : (
                <>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 18 }}>{list.name}</Text>
                      <Text style={{ color: colors.muted, marginTop: 6 }}>{list.movies.length} filme(s)</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    <SmallButton label="Editar nome" onPress={() => startEditList(list)} />
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
                    <Text style={{ color: colors.muted, marginTop: 14 }}>
                      Essa lista ainda não tem filmes. Abra um filme e adicione por lá.
                    </Text>
                  )}

                  {list.movies.length > 0 && !editingMovies && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
                      {list.movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} navigation={navigation} horizontal />
                      ))}
                    </ScrollView>
                  )}

                  {list.movies.length > 0 && editingMovies && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 2 }}>
                        Remova apenas os filmes dessa lista. O restante dos dados do filme continua salvo.
                      </Text>
                      {list.movies.map((movie) => (
                        <MovieListItem
                          key={movie.id}
                          movie={movie}
                          navigation={navigation}
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
        Seus filmes ficam salvos no aparelho, mesmo fechando o app.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20, marginBottom: 18 }}>
        {tabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
        ))}
      </ScrollView>

      {activeTab === "watchlist" && renderMovieGrid(state.watchlist)}
      {activeTab === "favorites" && renderMovieGrid(state.favorites)}
      {activeTab === "liked" && renderMovieGrid(likedMovies)}
      {activeTab === "disliked" && renderMovieGrid(dislikedMovies)}
      {activeTab === "watched" && renderWatched()}
      {activeTab === "custom" && renderCustomLists()}
    </ScrollView>
  );
}
