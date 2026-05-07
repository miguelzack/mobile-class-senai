import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import EmptyState from "../components/EmptyState";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/tmdb";
import { colors } from "../styles/theme";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        const data = await searchMovies(query);
        setMovies(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58, paddingHorizontal: 18 }}>
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>Pesquisar</Text>
      <Text style={{ color: colors.muted, marginTop: 6 }}>
        Busque filmes pelo nome e abra os detalhes para salvar nas listas.
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

      {loading && <ActivityIndicator style={{ marginTop: 24 }} color={colors.primary} />}

      {!loading && !query.trim() && (
        <EmptyState title="Digite um nome de filme" description="A pesquisa começa automaticamente enquanto você digita." />
      )}

      {!loading && query.trim() && movies.length === 0 && (
        <EmptyState title="Nenhum filme encontrado" description="Tente procurar por outro título." />
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
