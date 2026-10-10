"use client";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useStore } from "@/hooks/useStore";
import { useKeyboard } from "@/hooks/useKeyboard";

import { GAME_RULES, useGameStore } from "@/hooks/useGameStore";

export default function PowerMeter() {
    const gameStatus = useGameStore((state) => state.gameStatus);
    const recordTap = useGameStore((state) => state.recordTap);
    const currentPace = useGameStore((state) => state.currentTapsPerSecond);
    const targetPace = useGameStore((state) => state.targetTapsPerSecond);
    const accuracy = useGameStore((state) => state.playerAccuracy);
    const nextMove = useGameStore((state) => state.nextMove);
    const { moveRight, moveLeft } = useKeyboard({
        enabled: gameStatus === "In Progress",
        onTap: recordTap,
    });

    const darkMode = useStore((state) => state.darkMode);
    const screenshotMode = useStore((state) => state.screenshotMode);

    const calculatedHeight = `${Math.min(
        100,
        (currentPace / GAME_RULES.meterMaxTapsPerSecond) * 100,
    )}%`;
    const targetHeight = `${
        (targetPace / GAME_RULES.meterMaxTapsPerSecond) * 100
    }%`;

    return (
        <Box
            className="power-meter"
            sx={{
                position: "absolute",
                top: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                maxWidth: 200,
                maxHeight: 300,
                width: "100%",
                height: "100%",
                zIndex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                userSelect: "none",
                display: screenshotMode ? "none" : "flex",
            }}
        >
            <Box
                component="img"
                src="/img/panel_bg.png"
                alt=""
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    filter: darkMode !== false ? "brightness(0.5)" : "none",
                }}
            />
            <Box
                component="span"
                sx={{ fontFamily: "Minnie, sans-serif", fontSize: "1.25rem" }}
            >
                Power Meter
            </Box>
            <Box
                className="meter"
                role="meter"
                aria-label="Current tapping pace"
                aria-valuemin={0}
                aria-valuemax={GAME_RULES.meterMaxTapsPerSecond}
                aria-valuenow={Math.min(
                    currentPace,
                    GAME_RULES.meterMaxTapsPerSecond,
                )}
                aria-valuetext={`${currentPace.toFixed(1)} taps per second; target ${targetPace.toFixed(1)}`}
                sx={{
                    position: "relative",
                    bgcolor: "#fff",
                    width: 50,
                    height: 110,
                    border: "2px solid #000",
                    my: "1rem",
                }}
            >
                <Box
                    className="current-bar"
                    sx={{
                        position: "absolute",
                        left: 0,
                        width: "100%",
                        bottom: 0,
                        height: calculatedHeight,
                        bgcolor: "green",
                        transition: "height 100ms linear",
                    }}
                />
                <Box
                    className="target-bar"
                    sx={{
                        position: "absolute",
                        left: 0,
                        width: "100%",
                        bottom: targetHeight,
                        height: 5,
                        bgcolor: "red",
                        transform: "translateY(50%)",
                    }}
                />
            </Box>
            <Box sx={{ fontSize: "0.75rem", textAlign: "center", mb: 1 }}>
                <Box>
                    Pace: {currentPace.toFixed(1)} / {targetPace.toFixed(1)}{" "}
                    taps/s
                </Box>
                <Box>Accuracy: {Math.round(accuracy * 100)}%</Box>
            </Box>
            <Box sx={{ display: "flex", fontSize: "1.25rem" }}>
                <ArrowBackIcon
                    titleAccess="Pull left"
                    sx={{
                        fontSize: "2.5rem",
                        mx: "0.25rem",
                        color: moveLeft ? "limegreen" : "yellow",
                        bgcolor: moveLeft ? "green" : "orangered",
                        borderRadius: "0.25rem",
                    }}
                />
                <ArrowForwardIcon
                    titleAccess="Pull right"
                    sx={{
                        fontSize: "2.5rem",
                        mx: "0.25rem",
                        color: moveRight ? "limegreen" : "yellow",
                        bgcolor: moveRight ? "green" : "orangered",
                        borderRadius: "0.25rem",
                    }}
                />
            </Box>
            <Box sx={{ fontSize: "0.75rem", mt: 0.5 }}>
                {gameStatus === "In Progress"
                    ? nextMove
                        ? `Next: ${nextMove === "Left" ? "← / A" : "→ / D"}`
                        : "Start with either direction"
                    : "Alternate ← / → or A / D"}
            </Box>
        </Box>
    );
}
