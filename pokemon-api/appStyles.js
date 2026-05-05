import {StatusBar, StyleSheet} from 'react-native';
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
        paddingTop: StatusBar.currentHeight || 0,
    },

    linkHeader: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
    },

    textLinkHeader: {
        color: COLORS.text, fontSize: 16, fontFamily: FONTS.minecraft, marginRight: 16, top: 3
    },

    main: {
        display: "flex", alignItems: "center", justifyContent: "center", paddingVertical: 40, paddingHorizontal: 16,
    },

    contentMain: {
        display: "flex", justifyContent: "center", gap: 20, width: "100%", alignItems: "center", textAlign: "center"
    },

    imageMain: {
        width: "80%", height: 108,
    },

    titleMain: {
        textAlign: "center", color: COLORS.text, fontSize: 26, fontFamily: FONTS.minecraft, lineHeight: 34
    },

    titleSpanMain: {
        color: COLORS.accent
    },

    textMain: {
        color: COLORS.text, fontSize: 16, fontFamily: FONTS.minecraft, textAlign: "center", lineHeight: 20
    },

    sectionViewCards: {
        backgroundColor: COLORS.danger,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        width: "100%"
    },

    textSectionView: {
        lineHeight: 34,
        fontStyle: "normal",
        fontFamily: FONTS.minecraft,
        color: COLORS.text,
        fontSize: 26,
        textAlign: "center"
    },

    textSectionSpan: {
        color: COLORS.accent
    },

    textDescription: {
        color: COLORS.text, textAlign: "center", fontFamily: FONTS.minecraft, paddingTop: 10
    },

    modeButtonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginTop: 24,
        flexWrap: "wrap"
    },

    modeButtonActive: {
        backgroundColor: COLORS.accent,
    },

    modeButtonText: {
        color: COLORS.text, fontFamily: FONTS.minecraft, fontSize: 13, top: 3, textAlign: "center"
    },

    modeButtonTextActive: {
        color: COLORS.textDark,
    },

    generationButtonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        rowGap: 10,
        marginTop: 16,
        flexWrap: "wrap"
    },

    generationButton: {
        backgroundColor: COLORS.redSecondary,
        borderWidth: 3,
        borderColor: COLORS.textDark,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        minWidth: 80,
        alignItems: "center",
        justifyContent: "center"
    },

    generationButtonActive: {
        backgroundColor: COLORS.accent,
    },

    generationButtonText: {
        color: COLORS.text, fontFamily: FONTS.minecraft, fontSize: 12, top: 3
    },

    generationButtonTextActive: {
        color: COLORS.textDark,
    },

    fullScreenLoading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        elevation: 99999,
    },

    fullScreenLoadingText: {
        color: COLORS.text, fontFamily: FONTS.minecraft, fontSize: 16, marginTop: 16, textAlign: "center"
    },

    fab: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        backgroundColor: COLORS.accent,
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        zIndex: 9999,
        shadowColor: COLORS.textDark,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderWidth: 4,
        borderColor: COLORS.textDark,
    },

    fabText: {
        fontSize: 36, fontWeight: '800', color: COLORS.textDark, lineHeight: 36, transform: [{translateY: -2}],
    }, typeButtonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        rowGap: 10,
        marginTop: 16,
        flexWrap: "wrap"
    },

    typeButton: {
        backgroundColor: COLORS.redSecondary,
        borderWidth: 3,
        borderColor: COLORS.textDark,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        minWidth: 88,
        alignItems: "center",
        justifyContent: "center"
    },

    typeButtonActive: {
        backgroundColor: COLORS.accent,
    },

    typeButtonText: {
        color: COLORS.text, fontFamily: FONTS.minecraft, fontSize: 11, top: 3, textAlign: "center"
    },

    typeButtonTextActive: {
        color: COLORS.textDark,
    }, modeButton: {
        backgroundColor: COLORS.redSecondary,
        borderWidth: 4,
        borderColor: COLORS.textDark,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        minWidth: 105,
        alignItems: "center",
        justifyContent: "center"
    },
});