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
    }, linkHeader: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
    }, textLinkHeader: {
        color: COLORS.text, fontSize: 16, fontFamily: FONTS.minecraft, marginRight: 16, top: 3
    }, main: {
        // backgroundColor: COLORS.danger,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 16,
    }, contentMain: {
        display: "flex", justifyContent: "center", gap: 20, width: "100%", alignItems: "center", textAlign: "center"
    }, imageMain: {
        width: "80%", height: 108,
    }, titleMain: {
        textAlign: "center", color: COLORS.text, fontSize: 26, fontFamily: FONTS.minecraft, lineHeight: 34
    }, titleSpanMain: {
        color: COLORS.accent
    }, textMain: {
        color: COLORS.text, fontSize: 16, fontFamily: FONTS.minecraft, textAlign: "center", lineHeight: 20
    }

});