import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmptyState from "../components/EmptyState";
import MovieCard from "../components/MovieCard";
import { MOVIE_GENRES } from "../services/clubService";
import { discoverMoviesPage, searchMoviesPage } from "../services/tmdb";
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

function mergeUniqueMovies(current, next) {
  const seen = new Set(current.map((movie) => String(movie.id)));
  const safeNext = (next || []).filter((movie) => {
    if (!movie?.id || seen.has(String(movie.id))) return false;
    seen.add(String(movie.id));
    return true;
  });
  return [...current, ...safeNext];
}

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const requestIdRef = useRef(0);

  const activeGenreName = useMemo(() => MOVIE_GENRES.find((genre) => genre.id === selectedGenre)?.name, [selectedGenre]);
  const hasSearch = !!query.trim() || !!selectedGenre;

  const fetchMovies = useCallback(
    async ({ nextPage = 1, append = false } = {}) => {
      const term = query.trim();
      const requestId = ++requestIdRef.current;

      if (!term && !selectedGenre) {
        setMovies([]);
        setPage(1);
        setHasMore(false);
        return;
      }

      try {
        append ? setLoadingMore(true) : setLoading(true);

        let payload;
        if (term) {
          payload = await searchMoviesPage(term, nextPage);
          if (selectedGenre) {
            payload = {
              ...payload,
              results: (payload.results || []).filter((movie) => movie.genre_ids?.includes(selectedGenre)),
            };
          }
        } else {
          payload = await discoverMoviesPage(
            {
              with_genres: String(selectedGenre),
              sort_by: "popularity.desc",
              "vote_count.gte": "100",
            },
            nextPage
          );
        }

        if (requestId !== requestIdRef.current) return;

        const nextResults = payload.results || [];
        setPage(payload.page || nextPage);
        setHasMore((payload.page || nextPage) < (payload.totalPages || 1));
        setMovies((current) => (append ? mergeUniqueMovies(current, nextResults) : nextResults));
      } catch (error) {
        if (!append) setMovies([]);
        setHasMore(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [query, selectedGenre]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMovies({ nextPage: 1, append: false });
    }, 450);

    return () => clearTimeout(timeout);
  }, [fetchMovies]);

  async function loadMore() {
    if (loading || loadingMore || !hasMore || !hasSearch) return;
    await fetchMovies({ nextPage: page + 1, append: true });
  }

  const ListHeader = (
    <View style={{ paddingTop: 58, paddingHorizontal: 18 }}>
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>Pesquisar</Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
        Busque por nome ou escolha um gênero. A lista carrega mais filmes automaticamente quando você chega no fim.
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

      {!loading && !hasSearch && (
        <EmptyState title="Digite um nome ou escolha um gênero" description="A pesquisa começa automaticamente enquanto você digita ou filtra." />
      )}

      {!loading && hasSearch && movies.length === 0 && (
        <EmptyState title="Nenhum filme encontrado" description="Tente procurar outro título ou mudar o gênero." />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 18 }}
        renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator color={colors.primary} />
              <Text style={{ color: colors.muted, textAlign: "center", marginTop: 8 }}>Carregando mais filmes...</Text>
            </View>
          ) : hasSearch && movies.length > 0 && !hasMore ? (
            <Text style={{ color: colors.muted, textAlign: "center", paddingVertical: 18 }}>Fim dos resultados por enquanto.</Text>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.55}
        contentContainerStyle={{ paddingBottom: 130 }}
      />
    </View>
  );
}
