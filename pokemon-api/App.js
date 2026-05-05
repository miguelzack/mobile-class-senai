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

export default function App() {
    const fontsLoaded = useGlobalFonts();

    const listRef = useRef(null);

    const [mode, setMode] = useState("all"); // all | gen
    const [selectedGeneration, setSelectedGeneration] = useState(1);
    const [generationLoading, setGenerationLoading] = useState(false);

    if (!fontsLoaded) return null;

    const openGitHub = () => {
        Linking.openURL('https://github.com/miguelzack');
    };

    const scrollToTop = () => {
        listRef.current?.scrollToTop();
    };

    const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
                            setGenerationLoading(false);
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
                            setGenerationLoading(true);
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
                                    setGenerationLoading(true);
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

            {mode === "all" ? (
                <CardAll
                    ref={listRef}
                    headerComponent={HeaderComponent}
                />
            ) : (
                <CardGen
                    ref={listRef}
                    headerComponent={HeaderComponent}
                    generation={selectedGeneration}
                    onLoadingChange={setGenerationLoading}
                />
            )}

            {generationLoading && (
                <View style={styles.fullScreenLoading} pointerEvents="auto">
                    <ActivityIndicator size="large" color="red" />

                    <Text style={styles.fullScreenLoadingText}>
                        Carregando geração...
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.fab} onPress={scrollToTop} activeOpacity={0.7}>
                <Text style={styles.fabText}>↑</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}