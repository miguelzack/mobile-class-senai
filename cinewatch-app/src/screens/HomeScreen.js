import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import { discoverMovies, getPopularMovies, getTrendingMovies, homeSections } from "../services/tmdb";
import { colors } from "../styles/theme";

function SectionHeader({ title, subtitle }) {
  return (
    <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>{title}</Text>
      {!!subtitle && <Text style={{ color: colors.muted, marginTop: 4, fontSize: 13 }}>{subtitle}</Text>}
    </View>
  );
}

function MovieSection({ title, subtitle, movies, navigation }) {
  if (!movies?.length) return null;

  return (
    <View style={{ marginTop: 26 }}>
      <SectionHeader title={title} subtitle={subtitle} />
      <FlatList
        horizontal
        data={movies.slice(0, 12)}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} horizontal />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18 }}
      />
    </View>
  );
}

function ShortcutCard({ emoji, title, description, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width: "48%",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={{ color: colors.text, fontWeight: "900", marginTop: 8 }}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 5, fontSize: 12, lineHeight: 17 }}>{description}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [trending, setTrending] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadMovies() {
    try {
      const trendingPromise = getTrendingMovies();

      const sectionPromises = homeSections.map(async (section) => {
        const movies = section.type === "popular" ? await getPopularMovies() : await discoverMovies(section.params);

        return {
          ...section,
          movies,
        };
      });

      const [trendingData, sectionData] = await Promise.all([
        trendingPromise,
        Promise.all(sectionPromises),
      ]);

      setTrending(trendingData);
      setSections(sectionData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.muted, marginTop: 12 }}>Carregando filmes...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: 58, paddingBottom: 150 }}
      refreshControl={
        <RefreshControl
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadMovies();
          }}
        />
      }
    >
      <View style={{ paddingHorizontal: 18 }}>
        <Text style={{ color: colors.text, fontSize: 34, fontWeight: "900" }}>CineMood</Text>
        <Text style={{ color: colors.muted, marginTop: 6, fontSize: 15, lineHeight: 22 }}>
          Descubra filmes, salve listas, registre notas e organize o que você quer assistir.
        </Text>

        <View
          style={{
            marginTop: 18,
            backgroundColor: colors.surface,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>Não sabe o que ver hoje?</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>
            Use o modo de sugestões para escolher pelo seu humor, companhia ou momento do dia.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Sugestões")}
            style={{
              alignSelf: "flex-start",
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 11,
              borderRadius: 999,
              marginTop: 14,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>Abrir sugestões 🎲</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 28 }}>
        <SectionHeader title="Filmes em alta 🔥" subtitle="O que está chamando atenção agora." />

        {trending.length > 0 ? (
          <FlatList
            horizontal
            data={trending.slice(0, 12)}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} horizontal />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18 }}
          />
        ) : (
          <EmptyState title="Nada encontrado" description="Não foi possível carregar os filmes em alta." />
        )}
      </View>

      <View style={{ marginTop: 26, paddingHorizontal: 18 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginBottom: 6 }}>
          Escolha pelo momento ✨
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 14 }}>
          Atalhos rápidos para encontrar um filme sem perder tempo.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <ShortcutCard
            emoji="👨‍👩‍👧"
            title="Família"
            description="Filmes leves para assistir com todo mundo."
            onPress={() => navigation.navigate("Sugestões", { initialSuggestionId: "family" })}
          />
          <ShortcutCard
            emoji="🌙"
            title="Antes de dormir"
            description="Histórias mais tranquilas para fechar o dia."
            onPress={() => navigation.navigate("Sugestões", { initialSuggestionId: "sleep" })}
          />
          <ShortcutCard
            emoji="🔥"
            title="Adrenalina"
            description="Ação, aventura e ficção científica."
            onPress={() => navigation.navigate("Sugestões", { initialSuggestionId: "action" })}
          />
          <ShortcutCard
            emoji="💖"
            title="Romance"
            description="Para assistir sozinho ou acompanhado."
            onPress={() => navigation.navigate("Sugestões", { initialSuggestionId: "romance" })}
          />
        </View>
      </View>

      {sections.map((section) => (
        <MovieSection
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          movies={section.movies}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  );
}
