import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmptyState from "../components/EmptyState";
import MovieCard from "../components/MovieCard";
import { MOVIE_GENRES } from "../services/clubService";
import { discoverMovies, searchMovies } from "../services/tmdb";
import { colors } from "../styles/theme";

function GenreFilterChip({ genre, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        minHeight: 42,
        minWidth: 74,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: selected ? colors.primary : colors.surface,
        borderColor: selected ? colors.primary : colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 9,
        marginRight: 8,
      }}
    >
      <Text numberOfLines={1} style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
        {genre.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const activeGenreName = useMemo(() => MOVIE_GENRES.find((genre) => genre.id === selectedGenre)?.name, [selectedGenre]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const term = query.trim();

      if (!term && !selectedGenre) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        if (term) {
          const data = await searchMovies(term);
          const filtered = selectedGenre ? data.filter((movie) => movie.genre_ids?.includes(selectedGenre)) : data;
          setMovies(filtered);
        } else {
          const data = await discoverMovies({
            with_genres: String(selectedGenre),
            sort_by: "popularity.desc",
            "vote_count.gte": "100",
          });
          setMovies(data);
        }
      } catch (error) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [query, selectedGenre]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58, paddingHorizontal: 18 }}>
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>Pesquisar</Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
        Busque por nome ou escolha um gênero para ver apenas filmes daquele tipo.
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Ex: Batman, Interestelar, Matrix..."
        placeholderTextColor={colors.muted}
        style={{
          marginTop: 20,
          backgroundColor: colors.surface,
          color: colors.text,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          fontSize: 16,
        }}
      />

      <View style={{ marginTop: 14, height: 48 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ alignItems: "center", paddingRight: 18 }}
        >
          <GenreFilterChip genre={{ id: null, name: "Todos" }} selected={!selectedGenre} onPress={() => setSelectedGenre(null)} />
          {MOVIE_GENRES.map((genre) => (
            <GenreFilterChip key={genre.id} genre={genre} selected={selectedGenre === genre.id} onPress={() => setSelectedGenre(genre.id)} />
          ))}
        </ScrollView>
      </View>

      {!!activeGenreName && (
        <Text style={{ color: colors.secondary, fontWeight: "900", marginTop: 10 }}>
          Filtro ativo: {activeGenreName}
        </Text>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 24 }} color={colors.primary} />}

      {!loading && !query.trim() && !selectedGenre && (
        <EmptyState title="Digite um nome ou escolha um gênero" description="A pesquisa começa automaticamente enquanto você digita ou filtra." />
      )}

      {!loading && (query.trim() || selectedGenre) && movies.length === 0 && (
        <EmptyState title="Nenhum filme encontrado" description="Tente procurar outro título ou mudar o gênero." />
      )}

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 22, paddingBottom: 130 }}
      />
    </View>
  );
}
