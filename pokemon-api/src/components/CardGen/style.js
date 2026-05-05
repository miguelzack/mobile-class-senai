import {StyleSheet} from "react-native";
import {COLORS, FONTS} from "../../styles/global";

export const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        flex: 1,
        backgroundColor: COLORS.danger,
    },

    list: {
        paddingBottom: 40,
        justifyContent: "space-between",
    },

    generationTitleContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 6,
    },

    generationTitle: {
        color: COLORS.text,
        fontFamily: FONTS.minecraft,
        fontSize: 20,
        textAlign: "center",
    },

    card: {
        backgroundColor: COLORS.redSecondary,
        borderRadius: 20,
        borderWidth: 6,
        borderColor: COLORS.textDark,
        width: "44%",
        marginHorizontal: "3%",
        marginVertical: 10,
        padding: 16,
        alignItems: "center",
    },

    image: {
        width: 120,
        height: 120,
        resizeMode: "contain",
    },

    name: {
        color: COLORS.text,
        fontSize: 16,
        textTransform: "capitalize",
        marginTop: 6,
        fontFamily: FONTS.minecraft,
        textAlign: "center",
    },

    id: {
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONTS.minecraft,
    },

    types: {
        flexDirection: "row",
        gap: 6,
        marginTop: 6,
        flexWrap: "wrap",
        justifyContent: "center",
    },

    typeIcon: {
        width: 60,
        height: 18,
        resizeMode: "contain",
    },

    footerLoader: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    searchContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 20,
        gap: 10
    },

    searchInput: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        fontFamily: FONTS.minecraft,
        paddingTop: 20
    },

    searchButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16
    },

    searchButtonText: {
        color: "#000",
        fontFamily: FONTS.minecraft,
        top: 3
    },

    searchCard: {
        backgroundColor: COLORS.redSecondary,
        borderRadius: 30,
        borderWidth: 6,
        borderColor: COLORS.textDark,
        width: "80%",
        padding: 24,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20
    },

    searchImage: {
        width: 200,
        height: 200,
        resizeMode: "contain"
    },

    searchName: {
        fontSize: 24,
        color: COLORS.text,
        fontFamily: FONTS.minecraft,
        textTransform: "capitalize",
        marginTop: 10
    },

    searchId: {
        fontSize: 18,
        color: COLORS.text,
        fontFamily: FONTS.minecraft
    },

    errorContainer: {
        marginTop: 30,
        alignItems: "center"
    },

    errorText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: FONTS.minecraft,
        textAlign: "center"
    },

    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },

    suggestionsContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        borderRadius: 10,
        marginTop: 5,
        overflow: "hidden",
        zIndex: 5
    },

    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },

    suggestionText: {
        fontSize: 14,
        color: "#000",
        fontFamily: FONTS.minecraft,
        top: 3
    }
});