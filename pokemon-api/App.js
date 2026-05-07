import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    Image,
    SafeAreaView,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { styles } from "./appStyles";
import LogoGitHub from "./src/assets/icons/logoGitHub";
import { useGlobalFonts } from "./src/styles/global";
import ActionButtons from "./src/components/ActionButtons";
import { LinearGradient } from "expo-linear-gradient";
import { CardAll } from "./src/components/CardAll";
import { CardGen } from "./src/components/CardGen/CardGen";
import { CardType } from "./src/components/CardType/CardType";

export default function App() {
    const fontsLoaded = useGlobalFonts();

    const listRef = useRef(null);

    const [mode, setMode] = useState("all"); // all | gen | type
    const [selectedGeneration, setSelectedGeneration] = useState(1);
    const [selectedType, setSelectedType] = useState("water");
    const [filterLoading, setFilterLoading] = useState(false);

    if (!fontsLoaded) return null;

    const openGitHub = () => {
        Linking.openURL('https://github.com/miguelzack');
    };

    const scrollToTop = () => {
        listRef.current?.scrollToTop();
    };

    const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const pokemonTypes = [
        {label: "Normal", value: "normal"},
        {label: "Fogo", value: "fire"},
        {label: "Água", value: "water"},
        {label: "Grama", value: "grass"},
        {label: "Elétrico", value: "electric"},
        {label: "Gelo", value: "ice"},
        {label: "Lutador", value: "fighting"},
        {label: "Veneno", value: "poison"},
        {label: "Terra", value: "ground"},
        {label: "Voador", value: "flying"},
        {label: "Psíquico", value: "psychic"},
        {label: "Inseto", value: "bug"},
        {label: "Pedra", value: "rock"},
        {label: "Fantasma", value: "ghost"},
        {label: "Dragão", value: "dragon"},
        {label: "Sombrio", value: "dark"},
        {label: "Aço", value: "steel"},
        {label: "Fada", value: "fairy"},
    ];

    const selectedTypeLabel =
        pokemonTypes.find((type) => type.value === selectedType)?.label || selectedType;

    const HeaderComponent = () => (
        <>
            <LinearGradient colors={["#000", "#bb0d0d"]} style={styles.main}>
                <View style={styles.contentMain}>
                    <Image
                        resizeMode="contain"
                        style={styles.imageMain}
                        source={require('./src/assets/images/pokedexFont.png')}
                    />

                    <Text style={styles.titleMain}>
                        Bem-vindos ao{" "}
                        <Text style={styles.titleSpanMain}>consumo de API</Text>{" "}
                        de Pokémon
                    </Text>

                    <Text style={styles.textMain}>
                        Explore todos os Pokémon por geração, tipo ou busca.
                    </Text>

                    <ActionButtons />
                </View>
            </LinearGradient>

            <View style={styles.sectionViewCards}>
                <Text style={styles.textSectionView}>
                    Veja os <Text style={styles.textSectionSpan}>Pokémon</Text>
                </Text>

                <Text style={styles.textDescription}>
                    Deixe o campo vazio e clique em buscar para voltar ao modo de lista.
                </Text>

                <View style={styles.modeButtonsContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.modeButton,
                            mode === "all" && styles.modeButtonActive
                        ]}
                        onPress={() => {
                            setMode("all");
                            setFilterLoading(false);
                            setTimeout(scrollToTop, 100);
                        }}
                    >
                        <Text
                            style={[
                                styles.modeButtonText,
                                mode === "all" && styles.modeButtonTextActive
                            ]}
                        >
                            Pokédex Geral
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.modeButton,
                            mode === "gen" && styles.modeButtonActive
                        ]}
                        onPress={() => {
                            setFilterLoading(true);
                            setMode("gen");
                            setTimeout(scrollToTop, 100);
                        }}
                    >
                        <Text
                            style={[
                                styles.modeButtonText,
                                mode === "gen" && styles.modeButtonTextActive
                            ]}
                        >
                            Gerações
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.modeButton,
                            mode === "type" && styles.modeButtonActive
                        ]}
                        onPress={() => {
                            setFilterLoading(true);
                            setMode("type");
                            setTimeout(scrollToTop, 100);
                        }}
                    >
                        <Text
                            style={[
                                styles.modeButtonText,
                                mode === "type" && styles.modeButtonTextActive
                            ]}
                        >
                            Tipos
                        </Text>
                    </TouchableOpacity>
                </View>

                {mode === "gen" && (
                    <View style={styles.generationButtonsContainer}>
                        {generations.map((gen) => (
                            <TouchableOpacity
                                key={gen}
                                activeOpacity={0.8}
                                style={[
                                    styles.generationButton,
                                    selectedGeneration === gen && styles.generationButtonActive
                                ]}
                                onPress={() => {
                                    setFilterLoading(true);
                                    setSelectedGeneration(gen);
                                    setTimeout(scrollToTop, 100);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.generationButtonText,
                                        selectedGeneration === gen && styles.generationButtonTextActive
                                    ]}
                                >
                                    Gen {gen}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {mode === "type" && (
                    <View style={styles.typeButtonsContainer}>
                        {pokemonTypes.map((type) => (
                            <TouchableOpacity
                                key={type.value}
                                activeOpacity={0.8}
                                style={[
                                    styles.typeButton,
                                    selectedType === type.value && styles.typeButtonActive
                                ]}
                                onPress={() => {
                                    setFilterLoading(true);
                                    setSelectedType(type.value);
                                    setTimeout(scrollToTop, 100);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        selectedType === type.value && styles.typeButtonTextActive
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.linkHeader} onPress={openGitHub}>
                    <Text style={styles.textLinkHeader}>MiguelZack</Text>
                    <LogoGitHub />
                </TouchableOpacity>
            </View>

            {mode === "all" && (
                <CardAll
                    ref={listRef}
                    headerComponent={HeaderComponent}
                />
            )}

            {mode === "gen" && (
                <CardGen
                    ref={listRef}
                    headerComponent={HeaderComponent}
                    generation={selectedGeneration}
                    onLoadingChange={setFilterLoading}
                />
            )}

            {mode === "type" && (
                <CardType
                    ref={listRef}
                    headerComponent={HeaderComponent}
                    type={selectedType}
                    typeLabel={selectedTypeLabel}
                    onLoadingChange={setFilterLoading}
                />
            )}

            {filterLoading && (
                <View style={styles.fullScreenLoading} pointerEvents="auto">
                    <ActivityIndicator size="large" color="red" />

                    <Text style={styles.fullScreenLoadingText}>
                        Carregando Pokémon...
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.fab} onPress={scrollToTop} activeOpacity={0.7}>
                <Text style={styles.fabText}>↑</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}