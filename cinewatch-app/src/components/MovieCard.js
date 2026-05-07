import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { getPosterUrl } from "../services/tmdb";
import { colors } from "../styles/theme";

export default function MovieCard({ movie, navigation, horizontal = false, fullWidth = false }) {
  const poster = getPosterUrl(movie.poster_path, "w342");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate("MovieDetail", { movie })}
      style={{
        width: fullWidth ? "100%" : horizontal ? 150 : "48%",
        marginRight: horizontal ? 14 : 0,
        marginBottom: 18,
        backgroundColor: colors.surface,
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {poster ? (
        <Image
          source={{ uri: poster }}
          style={{ width: "100%", height: horizontal ? 220 : 240, backgroundColor: colors.surfaceLight }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: horizontal ? 220 : 240,
            backgroundColor: colors.surfaceLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.muted, textAlign: "center" }}>Sem imagem</Text>
        </View>
      )}

      <View style={{ padding: 10 }}>
        <Text
          numberOfLines={2}
          style={{ color: colors.text, fontSize: 14, fontWeight: "800", minHeight: 36 }}
        >
          {movie.title || "Filme sem título"}
        </Text>

        <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.secondary, fontWeight: "800" }}>
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </Text>
          <Text style={{ color: colors.muted }}>
            {(movie.release_date || "----").slice(0, 4)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
