"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

const RotatingMascot = dynamic(() => import("@/components/UI/RotatingMascot"), { ssr: false });
const LandingBackgroundAnimation = dynamic(() => import("@/components/Game/LandingBackgroundAnimation"), { ssr: false });

export default function GameLobbyPage() {
    const darkMode = useStore((state) => state.darkMode);

    return (
        <Box sx={{
            position: "relative",
            isolation: "isolate",
            "& .landing-page": { flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
            "& .CowboyRope": { fontFamily: '"CowboyRope", cursive, sans-serif' },
            "& h1": { fontSize: "5rem", mb: 0, bgcolor: "#fce53b", color: "#000", mt: "-2.5rem", borderRadius: "1rem", boxShadow: "inset 0 0 10px #000" },
            "& button": { fontSize: "0.74rem !important" },
            "& .card, & .MuiCard-root": { bgcolor: "game.card", border: "3px solid", borderColor: "game.cardBorder", ...(darkMode !== false && { boxShadow: "0px 0px 34px -10px #a7eefc" }) },
            "& .servers": { display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
            "& .server": { p: "0.5rem", border: "1px solid rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center" },
            "& .ad-wrap": {
                mt: "1rem",
                ...(darkMode !== false && { boxShadow: "0px 0px 34px -10px #a7eefc" }),
                "@media (min-width: 992px)": { mt: 0, display: "block", position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" },
            },
            "& .background-wrap": {
                position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1,
                "& img": { filter: "blur(5px)", objectPosition: "0 50% !important", ...(darkMode !== false && { opacity: "0.25 !important" }) },
            },
        }}>
            <Suspense>
                <PageTemplateLandingPage
                    useSocketStore={useSocketStore}
                    useStore={useStore}
                    RotatingMascot={RotatingMascot}
                    Link={Link}
                    useRouter={useRouter}
                    logoImage="/img/hd-icon.webp"
                    LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                    backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Tug of War/tug-of-war-thumbnail.png`}
                    singlePlayerConfig={{}}
                    NicknameInputConfig={{
                        PreComponent: <Box component="img" src="/img/icon.png" alt="Tug of War" width={70} height={70} sx={{ mr: "0.5rem", filter: darkMode !== false ? "brightness(0.5)" : "none" }} />,
                    }}
                    multiplayerConfig={{ type: "WebSocket", defaultServers: 2 }}
                    gameScoreboardConfig={{
                        append_score_text: "m",
                        metrics: [{ label: "Games Won", key: "score", format: (value) => `${value} m` }],
                    }}
                    brandingTextClass="CowboyRope"
                    disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
                    disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
                />
            </Suspense>
        </Box>
    );
}
