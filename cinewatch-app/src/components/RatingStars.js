import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../styles/theme";

export default function RatingStars({ rating = 0, onChange, size = 32 }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((value) => {
        const active = value <= rating;

        return (
          <TouchableOpacity
            key={value}
            activeOpacity={0.75}
            disabled={!onChange}
            onPress={() => {
              const nextValue = rating === value ? 0 : value;
              onChange?.(nextValue);
            }}
          >
            <Text style={{ color: active ? colors.secondary : colors.border, fontSize: size }}>
              ★
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
