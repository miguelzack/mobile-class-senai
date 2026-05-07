import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles } from "./searchStyle";

export default function Search({ onSearch }) {
    const [query, setQuery] = useState("");

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nome ou número"
                placeholderTextColor="#999"
                style={styles.input}
                value={query}
                onChangeText={setQuery}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => onSearch(query)}
            >
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
        </View>
    );
}