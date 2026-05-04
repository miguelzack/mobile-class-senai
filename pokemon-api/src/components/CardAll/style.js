import {StyleSheet} from "react-native";
import {COLORS, FONTS} from "../../styles/global";

export const styles = StyleSheet.create({
    wrapper: {
        width: "100%", flex: 1, backgroundColor: COLORS.danger,
    }, list: {
        paddingBottom: 40, justifyContent: "space-between",
    }, card: {
        backgroundColor: COLORS.redSecondary,
        borderRadius: 20,
        borderWidth: 6,
        borderColor: COLORS.textDark,
        width: "44%",
        marginHorizontal: "3%",
        marginVertical: 10,
        padding: 16,
        alignItems: "center",
    }, image: {
        width: 120, height: 120, resizeMode: "contain",
    }, name: {
        color: COLORS.text,
        fontSize: 16,
        textTransform: "capitalize",
        marginTop: 6,
        fontFamily: FONTS.minecraft,
        textAlign: "center",
    }, id: {
        color: COLORS.text, fontSize: 14, fontFamily: FONTS.minecraft,
    }, types: {
        flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap", justifyContent: "center",
    }, typeIcon: {
        width: 60, height: 18, resizeMode: "contain",
    }, footerLoader: {
        paddingVertical: 20, alignItems: "center", justifyContent: "center",
    },
});