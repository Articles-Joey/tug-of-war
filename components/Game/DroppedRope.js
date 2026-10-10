import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Curve, CurvePath, CubicBezierCurve3, Vector3 } from "three";
import Rope from "./Rope";

const HELD_POSITION = [0, 5, -0.6];

// World-space heights and pier distances, shared by both mirrored outcomes.
export const ROPE_DROP = {
    durationSeconds: 1.6,
    winnerReleaseDelay: 0.15,
    pierSurfaceY: 2.25,
    outerPierX: 14.5,
    innerPierX: 5,
    submergedBendY: -0.9,
    submergedTipY: -0.7,
};

class DroppingRopeCurve extends Curve {
    constructor(path, side, parentOffsetX, length) {
        super();
        this.path = path;
        this.side = side;
        this.parentOffsetX = parentOffsetX;
        this.length = length;
        this.progress = 0;
        this.version = 0;
    }

    getPoint(t, target = new Vector3()) {
        // Preserve left-to-right mesh ordering when the computer wins.
        this.path.getPointAt(this.side < 0 ? t : 1 - t, target);
        // Convert the world-space resting path into the existing Rope group's
        // coordinates: it sits at y=5 and rotates its cylinder -90 degrees.
        target.set(
            HELD_POSITION[1] - target.y,
            target.x - this.parentOffsetX,
            target.z - HELD_POSITION[2],
        );

        // The loser's end drops first; the winner's end follows onto the deck.
        const towardLoser = this.side < 0 ? t : 1 - t;
        const delay = (1 - towardLoser) * ROPE_DROP.winnerReleaseDelay;
        const progress = Math.max(
            0,
            Math.min(1, (this.progress - delay) / (1 - delay)),
        );
        const blend = progress * progress * (3 - 2 * progress);
        const straightY = (t - 0.5) * this.length;
        target.set(
            target.x * blend,
            straightY + (target.y - straightY) * blend,
            target.z * blend,
        );
        return target;
    }
}

export default function DroppedRope({
    winner,
    parentOffsetX,
    length = 20,
    radius = 0.15,
}) {
    const elapsed = useRef(0);
    const curve = useMemo(() => {
        const side = winner === "Player" ? -1 : 1;
        const deckY = ROPE_DROP.pierSurfaceY + radius;
        const point = (distance, y, z = HELD_POSITION[2]) =>
            new Vector3(side * distance, y, z);
        const path = new CurvePath();
        // Lie on top of the winner's deck, reaching just past its inner edge.
        // Starting the downward bend beyond the edge keeps the rope's radius
        // clear of the pier instead of cutting through its planks.
        const edgeX = ROPE_DROP.innerPierX - radius - 0.02;
        const deckEnd = point(edgeX, deckY);
        const submergedBend = point(3.5, ROPE_DROP.submergedBendY);
        path.add(
            new CubicBezierCurve3(
                point(ROPE_DROP.outerPierX, deckY),
                point(12, deckY, -1.1),
                point(8, deckY, -0.1),
                deckEnd,
            ),
        );
        // A rounded lip leads into a hanging section that crosses the waterline.
        path.add(
            new CubicBezierCurve3(
                deckEnd,
                point(4.1, deckY),
                point(4.75, -0.4),
                submergedBend,
            ),
        );
        // The loose tail curls below y=0, toward the model that dropped it.
        path.add(
            new CubicBezierCurve3(
                submergedBend,
                point(2.5, -1.3, 0.5),
                point(-1.2, -1.15, -1),
                point(-2.4, ROPE_DROP.submergedTipY, -0.2),
            ),
        );
        return new DroppingRopeCurve(path, side, parentOffsetX, length);
    }, [winner, parentOffsetX, length, radius]);

    useFrame((_, delta) => {
        if (elapsed.current >= ROPE_DROP.durationSeconds) return;
        elapsed.current = Math.min(
            ROPE_DROP.durationSeconds,
            elapsed.current + delta,
        );
        curve.progress = elapsed.current / ROPE_DROP.durationSeconds;
        curve.version += 1;
    });

    return (
        <Rope
            position={HELD_POSITION}
            length={length}
            radius={radius}
            curve={curve}
        />
    );
}
