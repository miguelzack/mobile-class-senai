import {StyleSheet} from "react-native";
import {COLORS, FONTS} from "../../styles/global";

export const styles = StyleSheet.create({
    buttonWrapper: {
        flexDirection: "column", alignItems: "center", gap: 20, width: "100%"
    },

    btnPrimary: {
        width: "100%",
        backgroundColor: COLORS.accent,
        borderWidth: 3,
        borderColor: COLORS.textDark,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 73
    },

    btnSecondary: {
        width: "100%",
        borderWidth: 3,
        borderColor: COLORS.textDark,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 73
    },

    btnTextPrimary: {
        fontFamily: FONTS.minecraft, fontSize: 20, color: COLORS.textDark, top: 3
    },

    btnTextSecondary: {
        fontFamily: FONTS.minecraft, fontSize: 20, color: COLORS.textDark, top: 3
    },
});