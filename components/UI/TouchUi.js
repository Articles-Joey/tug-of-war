"use client";

import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";

export default function TouchUi() {
    const enabled = useTouchControlsStore((state) => state.enabled);
    const addToHistory = useGameStore((state) => state.addToHistory);
    if (!enabled) return null;

    return (
        <Box className="touch-controls-wrap" sx={{ position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)", zIndex: 1, p: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <ArticlesButton aria-label="Pull left" sx={{ fontSize: "5rem", px: "1rem" }} onClick={() => addToHistory({ move: "Left", date: new Date() })}>
                <ArrowBackIcon sx={{ fontSize: "inherit" }} />
            </ArticlesButton>
            <ArticlesButton aria-label="Pull right" sx={{ fontSize: "5rem", px: "1rem" }} onClick={() => addToHistory({ move: "Right", date: new Date() })}>
                <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
            </ArticlesButton>
        </Box>
    );
}
