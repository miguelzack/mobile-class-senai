import { StyleSheet, Platform } from 'react-native';
import {
    STATUS_BAR_HEIGHT,
    PRIMARY_COLOR,
    TEXT_COLOR_DARK,
    TEXT_COLOR_LIGHT,
    TEXT_COLOR_DISABLED,
    BACKGROUND_COLOR_LIGHT, BORDER_COLOR_LIGHT
} from "../constants/styles";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BORDER_COLOR_LIGHT,
        paddingTop: STATUS_BAR_HEIGHT,
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        textAlign: 'center',
        marginVertical: 20,
        color: TEXT_COLOR_DARK,
    },
    loader, listEmptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
        marginHorizontal: 15,
    },
    emptyText: {
        fontSize: 16,
        color: TEXT_COLOR_DISABLED,
    },
    addButton: {
        backgroundColor: PRIMARY_COLOR,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        right: 30,
        elevation: 6,
    }
});