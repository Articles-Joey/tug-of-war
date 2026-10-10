import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import { Model as ModelSoldierWoman } from "@/components/Models/Soldier";
import { Model as ModelKingMen } from "@/components/Models/King";
import CogFlunky from "@/components/Models/CogFixed";
import ModelToon from "@/components/Models/MostRecentToon";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import Rope from "./Rope";
import DroppedRope from "./DroppedRope";

// Set zero-based action indexes independently for each model and outcome.
// null uses the named animation below; a valid index takes priority.
export const PEOPLE_ANIMATIONS = {
    toon: {
        pullingActionIndex: 116,
        winnerActionIndex: null,
        loserActionIndex: null,
        pullingAction: "medium_shorts_toon_rig|tug-o-war",
        winnerAction: "medium_shorts_toon_rig|victory-dance",
        loserAction: "medium_shorts_toon_rig|swim",
    },
    cog: {
        pullingActionIndex: 40,
        winnerActionIndex: 41,
        loserActionIndex: 33,
        pullingAction: "suitC|tug-o-war",
        winnerAction: "suitC|victory",
        loserAction: "suitC|soak",
    },
    soldier: {
        pullingActionIndex: null,
        winnerActionIndex: null,
        loserActionIndex: null,
        pullingAction: "Idle",
        winnerAction: "Jump",
        loserAction: "Death",
    },
    king: {
        pullingActionIndex: null,
        winnerActionIndex: null,
        loserActionIndex: null,
        pullingAction: "Idle",
        winnerAction: "Jump",
        loserAction: "Death",
    },
};

export const PEOPLE_MOVEMENT = {
    lobbySpeed: 3,
    pullBounds: 5,
    fallDurationSeconds: 1.2,
    fallDistanceTowardCenter: 3,
    waterY: -3.5,
};

function animationProps(config, outcome) {
    return {
        actionIndex: config[`${outcome}ActionIndex`],
        action: config[`${outcome}Action`],
    };
}

export default function People({
    landingAnimationMode = false,
    animationConfig = PEOPLE_ANIMATIONS,
}) {
    const toontownMode = useStore((state) => state.toontownMode);
    const gameStatus = useGameStore((state) => state.gameStatus);
    const winner = useGameStore((state) => state.winner);
    const resultVersion = useGameStore((state) => state.resultVersion);
    const peopleRef = useRef();
    const playerRef = useRef();
    const computerRef = useRef();
    const direction = useRef(1);
    const fallElapsed = useRef(0);
    const decisiveResult =
        !landingAnimationMode &&
        gameStatus === "Game Over" &&
        (winner === "Player" || winner === "Computer");
    const playerOutcome = decisiveResult
        ? winner === "Player"
            ? "winner"
            : "loser"
        : "pulling";
    const computerOutcome = decisiveResult
        ? winner === "Computer"
            ? "winner"
            : "loser"
        : "pulling";

    useLayoutEffect(() => {
        direction.current = 1;
        fallElapsed.current = 0;
        playerRef.current?.position.set(-10, 2.25, toontownMode ? 0.2 : 0);
        computerRef.current?.position.set(10, 2.25, toontownMode ? 0.8 : 0);
        if (peopleRef.current) {
            peopleRef.current.position.x =
                !landingAnimationMode && gameStatus !== "In Lobby"
                    ? -useGameStore.getState().pullProgress *
                      PEOPLE_MOVEMENT.pullBounds
                    : 0;
        }
    }, [gameStatus, winner, resultVersion, landingAnimationMode, toontownMode]);

    useFrame((_, delta) => {
        if (!peopleRef.current) return;
        const { gameStatus, pullProgress, winner } = useGameStore.getState();
        const bounds = PEOPLE_MOVEMENT.pullBounds;
        if (!landingAnimationMode && gameStatus !== "In Lobby") {
            // The player is on the left, so a positive advantage pulls left.
            peopleRef.current.position.x = -pullProgress * bounds;

            if (
                gameStatus === "Game Over" &&
                (winner === "Player" || winner === "Computer")
            ) {
                const loser =
                    winner === "Player"
                        ? computerRef.current
                        : playerRef.current;
                if (!loser) return;

                fallElapsed.current = Math.min(
                    PEOPLE_MOVEMENT.fallDurationSeconds,
                    fallElapsed.current + delta,
                );
                const progress =
                    fallElapsed.current / PEOPLE_MOVEMENT.fallDurationSeconds;
                const easedProgress = progress * progress * (3 - 2 * progress);
                const loserSide = winner === "Player" ? 1 : -1;
                // At the winning margin the loser reaches the dock's inner
                // edge. Move only that model into the gap and down to the water.
                loser.position.x =
                    loserSide *
                    (10 -
                        PEOPLE_MOVEMENT.fallDistanceTowardCenter *
                            easedProgress);
                loser.position.y =
                    2.25 +
                    (PEOPLE_MOVEMENT.waterY - 2.25) * progress * progress;
            }
            return;
        }

        const nextX =
            peopleRef.current.position.x +
            PEOPLE_MOVEMENT.lobbySpeed *
                direction.current *
                Math.min(delta, 0.1);
        if (nextX >= bounds) direction.current = -1;
        else if (nextX <= -bounds) direction.current = 1;
        peopleRef.current.position.x = Math.max(
            -bounds,
            Math.min(bounds, nextX),
        );
    });

    return (
        <group
            key={resultVersion}
            ref={peopleRef}
        >
            <group
                ref={playerRef}
                position={[-10, 2.25, toontownMode ? 0.2 : 0]}
            >
                {toontownMode ? (
                    <ModelToon
                        scale={1.5}
                        rotation={[0, degToRad(90), 0]}
                        {...animationProps(animationConfig.toon, playerOutcome)}
                    />
                ) : (
                    <ModelSoldierWoman
                        scale={3}
                        rotation={[0, degToRad(90), 0]}
                        {...animationProps(
                            animationConfig.soldier,
                            playerOutcome,
                        )}
                    />
                )}
            </group>

            <group
                ref={computerRef}
                position={[10, 2.25, toontownMode ? 0.8 : 0]}
            >
                {toontownMode ? (
                    <CogFlunky
                        scale={0.01}
                        rotation={[0, degToRad(-90), 0]}
                        {...animationProps(
                            animationConfig.cog,
                            computerOutcome,
                        )}
                    />
                ) : (
                    <ModelKingMen
                        scale={3}
                        rotation={[0, degToRad(-90), 0]}
                        {...animationProps(
                            animationConfig.king,
                            computerOutcome,
                        )}
                    />
                )}
            </group>

            {decisiveResult ? (
                <DroppedRope
                    winner={winner}
                    parentOffsetX={
                        (winner === "Player" ? -1 : 1) *
                        PEOPLE_MOVEMENT.pullBounds
                    }
                />
            ) : (
                <Rope position={[0, 5, -0.6]} />
            )}
        </group>
    );
}
