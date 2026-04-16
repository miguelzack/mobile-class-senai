import { StyleSheet } from "react-native";
import { theme } from "../../styles/global";

export const styles = StyleSheet.create({

    modal: {
        flex: 1,
        padding: 30,
        backgroundColor: theme.colors.background
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20
    },
    input: {
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#DDDDDD"
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
    }
});