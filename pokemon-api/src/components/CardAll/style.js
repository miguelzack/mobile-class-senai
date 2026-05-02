import {StyleSheet} from "react-native";
import {COLORS, FONTS} from "../../styles/global";

export const styles = StyleSheet.create({
    wrapper: {
        width: "100%", flex: 1, backgroundColor: COLORS.danger,
    },

    list: {
        paddingBottom: 40, alignItems: "center",
    },

    card: {
        backgroundColor: COLORS.redSecondary,
        borderRadius: 20,
        borderWidth: 6,
        borderColor: COLORS.textDark,
        width: "76%",
        alignSelf: "center",
        marginVertical: 10,
        padding: 16,
        alignItems: "center",

    },

    image: {
        width: 170, height: 170, resizeMode: "contain",
    },

    name: {
        color: COLORS.text,
        fontSize: 18,
        textTransform: "capitalize",
        marginTop: 6,
        fontFamily: FONTS.minecraft,
        textAlign: "center",
    },

    id: {
        color: COLORS.text, fontSize: 16, fontFamily: FONTS.minecraft,
    },

    types: {
        flexDirection: "row", gap: 6, marginTop: 6,
    },

    typeIcon: {
        width: 80, height: 20, resizeMode: "contain",
    },

    loadingOverlay: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,

        backgroundColor: "rgba(0,0,0,0.4)",

        alignItems: "center", justifyContent: "center",

        zIndex: 999, elevation: 10,
    },
});