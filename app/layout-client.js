"use client"
import { useEffect } from "react";
import { useGameStore } from "@/hooks/useGameStore";

export default function LayoutClient({ children }) {

    const theme = useGameStore(state => state.theme);
    // const darkMode = useGameStore(state => state.darkMode)
    // const setDarkMode = useGameStore(state => state.setDarkMode)

    const hasHydrated = useGameStore(state => state._hasHydrated)

    useEffect(() => {
        console.log("Hydration status:", hasHydrated)
    }, [hasHydrated])

    useEffect(() => {

        if (!hasHydrated) return;

        console.log("Current theme:", theme, useGameStore.persist.hasHydrated())

        if (theme == null) {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            useGameStore.getState().setTheme(prefersDark ? "Dark" : "Light");
        }

        if (theme == "Dark") {
            document.body.setAttribute("data-bs-theme", 'dark');
        } else {
            document.body.setAttribute("data-bs-theme", 'light');
        }

    }, [theme, hasHydrated]);

    return (
        <>
        </>
    );
}
