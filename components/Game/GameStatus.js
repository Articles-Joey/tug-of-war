"use client";

import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";

const results = {
    Player: "You win!",
    Computer: "Computer wins!",
    Tie: "It's a tie!",
};

export default function GameStatus() {
    const gameStatus = useGameStore((state) => state.gameStatus);
    const timeRemaining = useGameStore((state) => state.timeRemaining);
    const winner = useGameStore((state) => state.winner);
    const screenshotMode = useStore((state) => state.screenshotMode);
    const seconds = Math.ceil(timeRemaining);

    if (screenshotMode) return null;

    return (
        <Box
            className="game-status"
            sx={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                zIndex: 1,
                bgcolor: "game.card",
                color: "text.primary",
                border: "3px solid",
                borderColor: "game.cardBorder",
                borderRadius: 1,
                px: 2,
                py: 1,
                textAlign: "right",
                pointerEvents: "none",
            }}
        >
            <Box role="status">{gameStatus}</Box>
            {gameStatus === "In Progress" && (
                <Box
                    role="timer"
                    aria-label="Time remaining"
                    sx={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        fontVariantNumeric: "tabular-nums",
                        color: seconds <= 10 ? "error.main" : "text.primary",
                    }}
                >
                    {Math.floor(seconds / 60)}:
                    {String(seconds % 60).padStart(2, "0")}
                </Box>
            )}
            {gameStatus === "Game Over" && (
                <Box
                    role="status"
                    sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                    {results[winner]}
                </Box>
            )}
        </Box>
    );
}
