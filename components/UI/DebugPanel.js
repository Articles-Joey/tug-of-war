"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import ArticlesButton from "./Button";

export default function DebugPanel() {
    const debug = useStore((state) => state.debug);
    const toontownMode = useStore((state) => state.toontownMode);
    const toggleToontownMode = useStore((state) => state.toggleToontownMode);
    const reloadScene = useStore((state) => state.reloadScene);
    const history = useGameStore((state) => state.history);
    const forceWin = useGameStore((state) => state.forceWin);

    if (!debug) return null;

    return (
        <Card
            sx={{
                bgcolor: "game.card",
                backgroundImage: "none",
                fontSize: "0.875rem",
                border: "3px solid",
                borderColor: "game.cardBorder",
            }}
        >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box sx={{ fontSize: "0.875em", color: "text.secondary" }}>
                    Debug Controls
                </Box>
                <Box
                    sx={{
                        fontSize: "0.875em",
                        border: 1,
                        borderColor: "divider",
                        p: 1,
                        mb: 1,
                    }}
                >
                    <ArticlesButton
                        small
                        variant="link"
                        onClick={toggleToontownMode}
                        endIcon={<RestartAltIcon />}
                    >
                        Toontown: {toontownMode ? "On" : "Off"}
                    </ArticlesButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        border: 1,
                        borderColor: "divider",
                        p: 1,
                        mb: 1,
                    }}
                >
                    <ArticlesButton
                        small
                        onClick={() => forceWin("Player")}
                    >
                        Force Player Win
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        onClick={() => forceWin("Computer")}
                    >
                        Force Computer Win
                    </ArticlesButton>
                </Box>
                <Box sx={{ border: 1, borderColor: "divider", p: 1, mb: 1 }}>
                    {history?.map((entry, index) => (
                        <Box
                            key={index}
                            sx={{ fontSize: "0.875em" }}
                        >
                            {entry.move} -{" "}
                            {new Date(entry.date).toLocaleTimeString()}
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: "flex" }}>
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        onClick={reloadScene}
                        startIcon={<RestartAltIcon />}
                    >
                        Reload Game
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        onClick={reloadScene}
                        startIcon={<RestartAltIcon />}
                    >
                        Reset Camera
                    </ArticlesButton>
                </Box>
            </CardContent>
        </Card>
    );
}
