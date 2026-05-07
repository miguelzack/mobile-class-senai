import {useFonts} from 'expo-font';

export function useGlobalFonts() {
    const [fontsLoaded] = useFonts({
        Minecraft: require('../assets/fonts/Minecraft.ttf'),
    });

    return fontsLoaded;
}

export const COLORS = {
    background: '#1E1E1E',
    primary: '#3C8527',
    secondary: '#8B8B8B',
    accent: '#FFD700',
    text: '#FFFFFF',
    textDark: '#000000',
    danger: '#AA0000',
    redSecondary: '#4e0e0e'
};

export const FONTS = {
    minecraft: 'Minecraft',
};

