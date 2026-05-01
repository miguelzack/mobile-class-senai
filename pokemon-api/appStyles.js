import {StyleSheet} from 'react-native';
import {FONTS, COLORS} from './src/styles/global';

export const styles = StyleSheet.create({
    header: {
        width: "100%",
        backgroundColor: COLORS.textDark,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
    }, link: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }, textLink: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.minecraft,
        marginRight: 16,
        top: 3
    }
});