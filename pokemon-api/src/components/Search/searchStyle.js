import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/global";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 16,
        marginTop: 20,
        gap: 10
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 45
    },
    button: {
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16
    },
    buttonText: {
        fontWeight: "bold",
        color: "#000"
    }
});