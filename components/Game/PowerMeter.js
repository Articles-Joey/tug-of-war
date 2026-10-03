"use client"
import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useStore } from '@/hooks/useStore';
import { useKeyboard } from '@/hooks/useKeyboard';

import { useGameStore } from '@/hooks/useGameStore';

export default function PowerMeter() {

    const { moveRight, moveLeft } = useKeyboard()

    const history = useGameStore((state) => state.history);
    const darkMode = useStore((state) => state.darkMode);
    const addToHistory = useGameStore((state) => state.addToHistory);

    const [averageInterval, setAverageInterval] = useState(0);

    useEffect(() => {
        // console.log("Test")
        if (moveRight || moveLeft) {

            // Build a history of moves
            // Calculate meter percent

            addToHistory(
                {
                    ...(moveRight && { move: 'Right' }),
                    ...(moveLeft && { move: 'Left' }),
                    date: new Date()
                }
            )

        }
    }, [moveRight, moveLeft])

    useEffect(() => {
        const interval = setInterval(() => {

            useGameStore.getState().removeOldHistoryEntries();

        }, 1000); // Run cleanup every second

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (history.length > 1) {
            const intervals = history
                .map((entry, index) => {
                    if (index === 0) return null;
                    const previous = new Date(history[index - 1].date).getTime();
                    const current = new Date(entry.date).getTime();
                    return current - previous;
                })
                .filter((difference) => difference !== null);
            const total = intervals.reduce((sum, difference) => sum + difference, 0);
            setAverageInterval(total / intervals.length);
        } else {
            setAverageInterval(0);
        }
    }, [history]);

    const calculatedHeight = useMemo(() => {
        if (averageInterval > 0 && averageInterval < 100) {
            return "100%";
        } else if (averageInterval > 100 && averageInterval < 200) {
            return "80%";
        } else if (averageInterval > 150 && averageInterval < 200) {
            return "60%";
        } else if (averageInterval > 200 && averageInterval < 250) {
            return "40%";
        } else if (averageInterval > 250 && averageInterval < 300) {
            return "20%";
        } else if (averageInterval === 0) {
            return "0%";
        }
    }, [averageInterval]);

    return (
        <Box className="power-meter" sx={{
            position: "absolute", top: "1rem", left: "50%", transform: "translateX(-50%)",
            maxWidth: 200, maxHeight: 300, width: "100%", height: "100%", zIndex: 1,
            display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", userSelect: "none",
        }}>
            <Box component="img" src="/img/panel_bg.png" alt="" sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, filter: darkMode !== false ? "brightness(0.5)" : "none" }} />
            <Box component="span" sx={{ fontFamily: "Minnie, sans-serif", fontSize: "1.25rem" }}>Power Meter</Box>
            <Box className="meter" sx={{ position: "relative", bgcolor: "#fff", width: 50, height: 110, border: "2px solid #000", my: "1rem" }}>
                <Box className="current-bar" sx={{ position: "absolute", left: 0, width: "100%", bottom: 0, height: calculatedHeight, bgcolor: "green" }} />
                <Box className="target-bar" sx={{ position: "absolute", left: 0, width: "100%", bottom: "50%", height: 5, bgcolor: "red", transform: "translateY(50%)" }} />
            </Box>
            <Box sx={{ display: "flex", fontSize: "1.25rem" }}>
                <ArrowBackIcon titleAccess="Pull left" sx={{ fontSize: "2.5rem", mx: "0.25rem", color: moveLeft ? "limegreen" : "yellow", bgcolor: moveLeft ? "green" : "orangered", borderRadius: "0.25rem" }} />
                <ArrowForwardIcon titleAccess="Pull right" sx={{ fontSize: "2.5rem", mx: "0.25rem", color: moveRight ? "limegreen" : "yellow", bgcolor: moveRight ? "green" : "orangered", borderRadius: "0.25rem" }} />
            </Box>
        </Box>
    );
}
