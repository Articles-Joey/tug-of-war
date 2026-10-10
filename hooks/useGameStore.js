import { create } from "zustand";

// An accuracy of 1 is perfect alternating input at the requested pace.
export const GAME_RULES = Object.freeze({
    durationSeconds: 60,
    historyWindowMs: 5000,
    startingTapsPerSecond: 3,
    endingTapsPerSecond: 6,
    meterMaxTapsPerSecond: 8,
    computerAccuracy: 0.7,
    // A 20 percentage point advantage for 20 seconds reaches this margin.
    winMargin: 4,
    simulationStepMs: 50,
});

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function targetPace(elapsedSeconds) {
    return (
        GAME_RULES.startingTapsPerSecond +
        (GAME_RULES.endingTapsPerSecond - GAME_RULES.startingTapsPerSecond) *
            clamp(elapsedSeconds / GAME_RULES.durationSeconds)
    );
}

function initialGameState() {
    return {
        gameStatus: "In Lobby",
        winner: null,
        resultVersion: 0,
        startedAt: null,
        lastUpdatedAt: null,
        elapsedSeconds: 0,
        timeRemaining: GAME_RULES.durationSeconds,
        targetTapsPerSecond: GAME_RULES.startingTapsPerSecond,
        currentTapsPerSecond: 0,
        playerAccuracy: 0,
        computerAccuracy: GAME_RULES.computerAccuracy,
        accuracyAdvantage: 0,
        pullProgress: 0,
        nextMove: null,
        lastTapAt: null,
        history: [],
        averageInterval: 0,
    };
}

function inputMetrics(history, lastTapAt, now, pace) {
    const recent = history.filter(
        (entry) => now - entry.date <= GAME_RULES.historyWindowMs,
    );
    const timedTaps = recent.filter((entry) => entry.interval !== null);
    if (!timedTaps.length) {
        return {
            history: recent,
            averageInterval: 0,
            currentTapsPerSecond: 0,
            playerAccuracy: 0,
        };
    }

    const averageInterval =
        timedTaps.reduce((sum, entry) => sum + entry.interval, 0) /
        timedTaps.length;
    const sinceLastTap = Math.max(0, now - lastTapAt);
    // Missed beats reduce accuracy and let the green bar fall immediately.
    const freshness = clamp(2 - sinceLastTap / (1000 / pace));
    return {
        history: recent,
        averageInterval,
        currentTapsPerSecond: 1000 / Math.max(averageInterval, sinceLastTap, 1),
        playerAccuracy:
            (timedTaps.reduce((sum, entry) => sum + entry.accuracy, 0) /
                timedTaps.length) *
            freshness,
    };
}

// Match state is deliberately in memory only; refreshing always opens a lobby.
export const useGameStore = create((set, get) => ({
    ...initialGameState(),

    startGame: (now = Date.now()) => {
        if (get().gameStatus !== "In Lobby") return;
        set({
            ...initialGameState(),
            gameStatus: "In Progress",
            startedAt: now,
            lastUpdatedAt: now,
        });
    },

    resetGame: () => set(initialGameState()),

    forceWin: (winner) => {
        if (winner !== "Player" && winner !== "Computer") return;
        const pullProgress = winner === "Player" ? 1 : -1;
        set((state) => ({
            gameStatus: "Game Over",
            winner,
            pullProgress,
            accuracyAdvantage: pullProgress * GAME_RULES.winMargin,
            // Repeated debug clicks replay the same outcome animation.
            resultVersion: state.resultVersion + 1,
        }));
    },

    tick: (now = Date.now()) => {
        const state = get();
        if (state.gameStatus !== "In Progress" || now <= state.lastUpdatedAt)
            return;

        const deadline = state.startedAt + GAME_RULES.durationSeconds * 1000;
        const end = Math.min(now, deadline);
        let updatedAt = state.lastUpdatedAt;
        let accuracyAdvantage = state.accuracyAdvantage;
        let metrics;
        let elapsedSeconds = state.elapsedSeconds;
        let pace = state.targetTapsPerSecond;
        let computerAccuracy = state.computerAccuracy;
        let winner = null;

        // Small steps handle delayed timers without extending the match or
        // rewarding stale input throughout a pause in a background tab.
        while (updatedAt < end) {
            const nextAt = Math.min(
                updatedAt + GAME_RULES.simulationStepMs,
                end,
            );
            elapsedSeconds = (nextAt - state.startedAt) / 1000;
            pace = targetPace(elapsedSeconds);
            metrics = inputMetrics(
                state.history,
                state.lastTapAt,
                nextAt,
                pace,
            );
            computerAccuracy =
                GAME_RULES.computerAccuracy +
                Math.sin(elapsedSeconds * 0.8) * 0.05;
            accuracyAdvantage +=
                (metrics.playerAccuracy - computerAccuracy) *
                ((nextAt - updatedAt) / 1000);
            updatedAt = nextAt;

            if (Math.abs(accuracyAdvantage) >= GAME_RULES.winMargin) {
                winner = accuracyAdvantage > 0 ? "Player" : "Computer";
                break;
            }
        }

        if (!winner && updatedAt >= deadline) winner = "Tie";
        set({
            ...metrics,
            lastUpdatedAt: updatedAt,
            elapsedSeconds,
            timeRemaining: Math.max(
                0,
                GAME_RULES.durationSeconds - elapsedSeconds,
            ),
            targetTapsPerSecond: pace,
            computerAccuracy,
            accuracyAdvantage,
            pullProgress: clamp(
                accuracyAdvantage / GAME_RULES.winMargin,
                -1,
                1,
            ),
            ...(winner && {
                gameStatus: "Game Over",
                winner,
                resultVersion: state.resultVersion + 1,
            }),
        });
    },

    recordTap: (move, now = Date.now()) => {
        if (move !== "Left" && move !== "Right") return;
        get().tick(now);
        const state = get();
        if (state.gameStatus !== "In Progress" || now < state.lastUpdatedAt)
            return;

        const interval =
            state.lastTapAt === null ? null : now - state.lastTapAt;
        const correctOrder = state.nextMove === null || move === state.nextMove;
        const targetInterval = 1000 / state.targetTapsPerSecond;
        const timingAccuracy =
            interval === null
                ? 0
                : clamp(
                      1 - Math.abs(interval - targetInterval) / targetInterval,
                  );
        const history = [
            ...state.history,
            {
                move,
                date: now,
                interval,
                correctOrder,
                accuracy: correctOrder ? timingAccuracy : 0,
            },
        ];
        set({
            ...inputMetrics(history, now, now, state.targetTapsPerSecond),
            lastTapAt: now,
            nextMove: move === "Left" ? "Right" : "Left",
        });
    },

    // Touch controls use the same scoring path as the keyboard.
    addToHistory: (entry) =>
        get().recordTap(entry.move, new Date(entry.date).getTime()),
}));
