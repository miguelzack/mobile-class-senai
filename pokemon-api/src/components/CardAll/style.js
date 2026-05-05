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

    columnWrapper: {
        zIndex: 1,
        elevation: 1,
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

    searchArea: {
        width: "100%",
        marginBottom: 16,
    },

    searchContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 20,
        gap: 10,
    },

    searchInput: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        fontFamily: FONTS.minecraft,
        paddingTop: 20,
        minHeight: 52,
    },

    searchButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        minHeight: 52,
    },

    searchButtonText: {
        color: "#000",
        fontFamily: FONTS.minecraft,
        top: 3,
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
        marginTop: 20,
    },

    searchImage: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },

    searchName: {
        fontSize: 24,
        color: COLORS.text,
        fontFamily: FONTS.minecraft,
        textTransform: "capitalize",
        marginTop: 10,
    },

    searchId: {
        fontSize: 18,
        color: COLORS.text,
        fontFamily: FONTS.minecraft,
    },

    errorContainer: {
        marginTop: 30,
        alignItems: "center",
    },

    errorText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: FONTS.minecraft,
        textAlign: "center",
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
        zIndex: 9999999,
        elevation: 9999999,
    },

    suggestionsOverlay: {
        position: "absolute",
        height: 220,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        zIndex: 9999999,
        elevation: 9999999,
        borderWidth: 4,
        borderColor: COLORS.textDark,
    },

    suggestionsList: {
        flex: 1,
        height: 220,
    },

    suggestionsContent: {
        paddingBottom: 4,
    },

    suggestionItem: {
        height: 48,
        paddingHorizontal: 14,
        paddingVertical: 8,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },

    suggestionText: {
        fontSize: 14,
        color: "#000",
        fontFamily: FONTS.minecraft,
        top: 3,
        textTransform: "capitalize",
        flex: 1,
    },

    suggestionId: {
        fontSize: 12,
        color: "#555",
        fontFamily: FONTS.minecraft,
        top: 3,
        marginLeft: 8,
    },
});