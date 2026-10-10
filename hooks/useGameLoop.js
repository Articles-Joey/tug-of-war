import { useEffect } from "react";
import { GAME_RULES, useGameStore } from "./useGameStore";

export function useGameLoop() {
    const gameStatus = useGameStore((state) => state.gameStatus);

    useEffect(() => {
        if (gameStatus !== "In Progress") return;
        const tick = () => useGameStore.getState().tick();
        const timer = setInterval(tick, GAME_RULES.simulationStepMs);
        return () => clearInterval(timer);
    }, [gameStatus]);

    // Leaving the play page returns to the lobby for the next visit.
    useEffect(() => () => useGameStore.getState().resetGame(), []);
}
