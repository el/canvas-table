import { CTOptions } from "./types";

export const defaultOptions: CTOptions = {
    borders: {
        header: { color: "#ccc", width: 1 }
    },
    header: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        color: "#666666",
        lineHeight: 1.2,
        textAlign: "left",
        padding: {
            bottom: 5,
            left: 5,
            right: 5,
            top: 5
        }
    },
    cell: {
        fontSize: 12,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        color: "#444444",
        lineHeight: 1.2,
        padding: {
            bottom: 5,
            left: 5,
            right: 5,
            top: 5
        },
        textAlign: "left"
    },
    background: "#ffffff",
    devicePixelRatio: 2,
    fader: {
        right: true,
        size: 40,
        bottom: true
    },
    fit: false,
    padding: {
        bottom: 20,
        left: 20,
        right: 20,
        top: 20
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        color: "#888888",
        lineHeight: 1,
        textAlign: "center"
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        color: "#666666",
        lineHeight: 1,
        textAlign: "center"
    }
};

export default defaultOptions;