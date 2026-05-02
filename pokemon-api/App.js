import React from 'react';
import {
    View, Text, TouchableOpacity, Linking, Image, FlatList, SafeAreaView, StatusBar
} from 'react-native';

import {styles} from "./appStyles";
import LogoGitHub from "./src/assets/icons/logoGitHub";
import {useGlobalFonts} from "./src/styles/global";
import ActionButtons from "./src/components/ActionButtons";
import {LinearGradient} from "expo-linear-gradient";
import {CardAll} from "./src/components/CardAll";

export default function App() {

    const fontsLoaded = useGlobalFonts();

    if (!fontsLoaded) return null;

    const openGitHub = () => {
        Linking.openURL('https://github.com/miguelzack');
    };

    const DATA = [{id: "screen"}];

    const renderScreen = () => (<SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>

        <StatusBar barStyle="light-content" backgroundColor="#000"/>
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.linkHeader}
                onPress={openGitHub}
            >
                <Text style={styles.textLinkHeader}>
                    MiguelZack
                </Text>
                <LogoGitHub/>
            </TouchableOpacity>
        </View>

        <FlatList
            data={[{key: "content"}]}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            renderItem={() => (<>
                <LinearGradient
                    colors={["#000", "#bb0d0d"]}
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

                <View style={styles.sectionViewCards}>
                    <Text style={styles.textSectionView}>
                        Veja os <Text style={styles.textSectionSpan}>Pokémon</Text>
                    </Text>
                </View>

                <CardAll/>
            </>)}
        />

    </SafeAreaView>);

    return (<FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderScreen}
    />);
}