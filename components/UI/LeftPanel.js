"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import ArticlesButton from "./Button";
import DebugPanel from "./DebugPanel";
import { useStore } from "@/hooks/useStore";
import { useSocketStore } from "@/hooks/useSocketStore";

export default function LeftPanelContent({ server: suppliedServer, controllerState } = {}) {
    const searchParams = useSearchParams();
    const server = suppliedServer ?? searchParams.get("server");
    const socket = useSocketStore((state) => state.socket);
    const [showControllerState, setShowControllerState] = useState(false);

    return (
        <Box className="mobile-menu-container" sx={{ width: "100%" }}>
            <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: "3px solid", borderColor: "game.cardBorder" }}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", mb: "0.5rem" }}>
                        <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                    </Box>
                    {server !== "single-player" && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>Server: {server}</Box>
                            <Box>Players: {0}/4</Box>
                        </Box>
                    )}
                    {server !== "single-player" && !socket?.connected && (
                        <Box>
                            <Box sx={{ fontSize: "1rem", mb: "0.25rem" }}>Not connected</Box>
                            <ArticlesButton onClick={() => socket?.connect()}>Reconnect!</ArticlesButton>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <DebugPanel />
            {controllerState?.connected && (
                <Box className="panel-content-group" sx={{ p: 0, color: "text.primary" }}>
                    <Box sx={{ p: "0.25rem", borderBottom: 1, borderColor: "divider" }}>
                        <Box sx={{ fontWeight: "bold", fontSize: "0.7rem" }}>{controllerState.id}</Box>
                    </Box>
                    <Box sx={{ p: "0.25rem" }}>
                        <ArticlesButton small sx={{ width: "100%" }} active={showControllerState} onClick={() => setShowControllerState((previous) => !previous)}>
                            {showControllerState ? "Hide" : "Show"} Controller Preview
                        </ArticlesButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
