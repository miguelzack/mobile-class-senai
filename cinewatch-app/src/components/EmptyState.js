import React from "react";
import { Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function EmptyState({ title, description }) {
  return (
    <View style={{ padding: 24, alignItems: "center" }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800", textAlign: "center" }}>
        {title}
      </Text>
      {!!description && (
        <Text style={{ color: colors.muted, textAlign: "center", marginTop: 8, lineHeight: 20 }}>
          {description}
        </Text>
      )}
    </View>
  );
}
