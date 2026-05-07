import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import EmptyState from "../components/EmptyState";
import MovieCard from "../components/MovieCard";
import { franchiseCollections, getFranchiseMovies } from "../services/tmdb";
import { colors } from "../styles/theme";

function FranchiseCard({ franchise, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.87}
      onPress={() => onPress(franchise)}
      style={{
        width: "48%",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 15,
        marginBottom: 12,
        minHeight: 150,
      }}
    >
      <Text style={{ fontSize: 34 }}>{franchise.emoji}</Text>
      <Text style={{ color: colors.text, fontSize: 17, fontWeight: "900", marginTop: 10 }}>{franchise.title}</Text>
      <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 18, fontSize: 12 }}>{franchise.description}</Text>
      <Text style={{ color: colors.primary, fontWeight: "900", marginTop: 12 }}>Abrir ordem ›</Text>
    </TouchableOpacity>
  );
}

function OrderButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: active ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        borderRadius: 999,
        paddingVertical: 11,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "900" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function FranchisesScreen({ navigation }) {
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [orderMode, setOrderMode] = useState("release");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [franchiseQuery, setFranchiseQuery] = useState("");

  const filteredFranchises = franchiseCollections.filter((franchise) => {
    const query = franchiseQuery.trim().toLowerCase();
    if (!query) return true;
    return `${franchise.title} ${franchise.description}`.toLowerCase().includes(query);
  });

  async function loadFranchise(franchise, mode = orderMode) {
    try {
      setLoading(true);
      setErrorMessage("");
      setMovies([]);
      const data = await getFranchiseMovies(franchise, mode);
      setMovies(data);

      if (!data.length) {
        setErrorMessage("Não consegui encontrar filmes para essa franquia agora.");
      }
    } catch (error) {
      console.log(error);
      setMovies([]);
      setErrorMessage("Não foi possível carregar essa franquia agora.");
    } finally {
      setLoading(false);
    }
  }

  function openFranchise(franchise) {
    setSelectedFranchise(franchise);
    setOrderMode("release");
    loadFranchise(franchise, "release");
  }

  function changeOrder(mode) {
    setOrderMode(mode);
    if (selectedFranchise) loadFranchise(selectedFranchise, mode);
  }

  function clearSelection() {
    setSelectedFranchise(null);
    setOrderMode("release");
    setMovies([]);
    setErrorMessage("");
  }

  if (!selectedFranchise) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58 }}>
        <View style={{ paddingHorizontal: 18 }}>
          <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>Franquias 🎞️</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
            Veja sagas famosas na ordem de lançamento ou, quando cadastrada, na ordem da história.
          </Text>
          <Text style={{ color: colors.secondary, fontWeight: "900", marginTop: 10 }}>
            {franchiseCollections.length} franquias disponíveis
          </Text>

          <TextInput
            value={franchiseQuery}
            onChangeText={setFranchiseQuery}
            placeholder="Pesquisar franquia, ex: Marvel, DC, Toy Story..."
            placeholderTextColor={colors.muted}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.text,
              marginTop: 16,
            }}
          />
        </View>

        <FlatList
          data={filteredFranchises}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <FranchiseCard franchise={item} onPress={openFranchise} />}
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title="Nenhuma franquia encontrada" description="Tente pesquisar por outro nome." />}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58 }}>
      <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={clearSelection}
          style={{
            alignSelf: "flex-start",
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 9,
            marginBottom: 14,
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>← Trocar franquia</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>
          {selectedFranchise.emoji} {selectedFranchise.title}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{selectedFranchise.description}</Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <OrderButton label="Lançamento" active={orderMode === "release"} onPress={() => changeOrder("release")} />
          <OrderButton label="História" active={orderMode === "story"} onPress={() => changeOrder("story")} />
        </View>

        {orderMode === "story" && !selectedFranchise.storyOrder?.length && (
          <Text style={{ color: colors.muted, marginTop: 10, fontSize: 12 }}>
            Essa franquia ainda não tem ordem da história cadastrada, então o app usa lançamento.
          </Text>
        )}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={{ color: colors.muted, marginTop: 12 }}>Carregando franquia...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => (
            <View style={{ width: "48%" }}>
              <Text style={{ color: colors.secondary, fontWeight: "900", marginBottom: 6 }}>
                #{index + 1}
              </Text>
              <MovieCard movie={item} navigation={navigation} fullWidth />
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title="Nada encontrado" description={errorMessage || "Tente outra franquia."} />}
        />
      )}
    </View>
  );
}
