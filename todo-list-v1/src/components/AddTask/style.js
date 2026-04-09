import {StyleSheet} from "react-native";
import {theme} from "../../styles/global";

export const styles = StyleSheet.create({
    modal: {
        flex: 1, padding: 30, backgroundColor: theme.colors.background
    }, titulo: {
        fontSize: 20, fontWeight: "bold", marginBottom: 20
    }, input: {
        backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#DDDDDD"
    }, button: {
        backgroundColor: theme.colors.primary, padding: 15, borderRadius: 1, alignItems: "center"
    }, txtCancelar: {
        color: "#f00",
        textAlign: "center"
    }
})