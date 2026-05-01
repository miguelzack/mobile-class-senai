import React from "react";
import {View, Text, TouchableOpacity, Linking} from "react-native";
import {styles} from "./styles";

export default function ActionButtons() {
    const goToSection = () => {
        console.log("Ir para seção Pokémon");
    };

    const openPokeAPI = () => {
        Linking.openURL("https://pokeapi.co/");
    };

    return (<View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.btnPrimary} onPress={goToSection}>
            <Text style={styles.btnTextPrimary}>Veja agora</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={openPokeAPI}>
            <Text style={styles.btnTextSecondary}>Saiba mais</Text>
        </TouchableOpacity>
    </View>);
}