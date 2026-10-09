"use client";

import Box from "@mui/material/Box";
import ArticlesModal from "./ArticlesModal";

export default function GameInfoModal({ show, setShow }) {
    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Game Info"
            contentSx={{ p: 0 }}
        >
            <Box
                sx={{
                    aspectRatio: "16 / 9",
                    position: "relative",
                    width: "100%",
                }}
            >
                <Box
                    component="img"
                    src="/img/game-preview.gif"
                    alt="Tug of War gameplay"
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </Box>
            <Box sx={{ p: "1rem" }}>
                Click or press two different buttons to pull the rope and win!
                The more players pulling on your side, the faster you go. First
                team to get to the end wins!
                <br />
                <br />
                Controls:
                <br />
                - Keyboard: Press the A and D keys or Left and Right arrow keys
                to pull the rope.
                <br />
                - Gamepad: Press the left and right D-pad buttons to pull the
                rope.
                <br />
            </Box>
        </ArticlesModal>
    );
}
