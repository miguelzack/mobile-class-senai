import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {styles} from "./appStyles";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import LogoGitHub from "./src/assets/icons/logoGitHub";
import {useGlobalFonts} from "./src/styles/global";

export default function App() {

    const fontsLoaded = useGlobalFonts();

    const openGitHub = () => {
        Linking.openURL('https://github.com/miguelzack');
    };

    return (<SafeAreaProvider>

        <SafeAreaView>
            <View style={styles.header}>
                <TouchableOpacity style={styles.link} onPress={openGitHub}>
                    <Text style={styles.textLink}>MiguelZack</Text>
                    <LogoGitHub/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    </SafeAreaProvider>);
}