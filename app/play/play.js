"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import classNames from "classnames";
import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";
import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import LeftPanelContent from "@/components/UI/LeftPanel";
import PowerMeter from "@/components/Game/PowerMeter";
import TouchUi from "@/components/UI/TouchUi";
import { useStore } from "@/hooks/useStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), { ssr: false });

export default function TugOfWarGamePage() {
    const sidebar = useStore((state) => state.sidebar);
    const sceneKey = useStore((state) => state.sceneKey);
    const showMenu = useStore((state) => state.showMenu);
    const enabled = useTouchControlsStore((state) => state.enabled);
    const { isFullscreen } = useFullscreen();

    return (
        <Box
            className={classNames(`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`, {
                "menu-open": showMenu,
                fullscreen: isFullscreen,
                "show-sidebar": sidebar,
            })}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{
                position: "relative", display: "flex",
                "& .background": { position: "fixed", inset: 0, height: "100%", width: "100%", zIndex: 0, overflow: "hidden", "& img": { filter: "blur(2px) brightness(0.8)", transform: "scale(1.05)" } },
                "& .container": { position: "relative", zIndex: 1 },
                "& .debug-info, & .game-info": { height: "100vh", width: 300, flexShrink: 0, "& .card, & .MuiCard-root": { height: "100%" } },
                "& .game": { p: "0.5rem 1rem", display: "flex", justifyContent: "center" },
                "& .game-panel": { width: "100%" },
                "& .card, & .MuiCard-root": { bgcolor: "game.card", border: "3px solid", borderColor: "game.cardBorder" },
            }}
        >
            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{ style: "Corner Button", menuBarButtonPosition: "Left" }}
                sidebarConfig={{ style: "Static Panel" }}
            />
            <Box className="canvas-wrap" sx={{ position: "relative", width: "100vw", height: "100vh", "& canvas": { position: "absolute", width: "100%", height: "100%", left: 0, top: 0 } }}>
                <PowerMeter />
                {enabled && <TouchUi />}
                <GameCanvas key={sceneKey} />
            </Box>
        </Box>
    );
}
