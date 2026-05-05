import React, { useRef } from 'react';
import {
    View, Text, TouchableOpacity, Linking, Image, SafeAreaView, StatusBar
} from 'react-native';
import { styles } from "./appStyles";
import LogoGitHub from "./src/assets/icons/logoGitHub";
import { useGlobalFonts } from "./src/styles/global";
import ActionButtons from "./src/components/ActionButtons";
import { LinearGradient } from "expo-linear-gradient";
import { CardAll } from "./src/components/CardAll";

export default function App() {
    const fontsLoaded = useGlobalFonts();
    const cardAllRef = useRef(null);

    if (!fontsLoaded) return null;

    const openGitHub = () => {
        Linking.openURL('https://github.com/miguelzack');
    };

    const scrollToTop = () => {
        cardAllRef.current?.scrollToTop();
    };
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
                <Text style={styles.textDescription}>Deixe o campo vazio e clique em buscar para voltar ao modo de lista.</Text>
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

            <CardAll ref={cardAllRef} headerComponent={HeaderComponent} />

            <TouchableOpacity style={styles.fab} onPress={scrollToTop} activeOpacity={0.7}>
                <Text style={styles.fabText}>↑</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}