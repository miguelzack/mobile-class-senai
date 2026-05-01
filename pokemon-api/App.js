import React from 'react';
import {View, Text, TouchableOpacity, Linking, Image} from 'react-native';
import {styles} from "./appStyles";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import LogoGitHub from "./src/assets/icons/logoGitHub";
import {useGlobalFonts} from "./src/styles/global";
import ActionButtons from "./src/components/ActionButtons";
import { LinearGradient } from "expo-linear-gradient";


export default function App() {

    const fontsLoaded = useGlobalFonts();

    const openGitHub = () => {
        Linking.openURL('https://github.com/miguelzack');
    };

    if (!fontsLoaded) {
        return null;
    }

    return (<SafeAreaProvider>
        <SafeAreaView>
            <View style={styles.header}>
                <TouchableOpacity style={styles.linkHeader} onPress={openGitHub}>
                    <Text style={styles.textLinkHeader}>MiguelZack</Text>
                    <LogoGitHub/>
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={["#000", "#bb0d0d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.main}
            >
                <View style={styles.contentMain}>
                    <Image
                        resizeMode="contain"
                        style={styles.imageMain}
                        source={require('./src/assets/images/pokedexFont.png')}
                    />

                    <Text style={styles.titleMain}>
                        Bem-vindos ao{" "}
                        <Text style={styles.titleSpanMain}>
                            consumo de API
                        </Text>{" "}
                        de Pokémon
                    </Text>
                    <Text style={styles.textMain}>
                        Explore todos os Pokémon por geração, tipo ou busca.
                    </Text>

                    <ActionButtons/>
                </View>
            </LinearGradient>
        </SafeAreaView>
    </SafeAreaProvider>);
}