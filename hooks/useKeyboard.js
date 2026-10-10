import { useEffect, useState } from "react";

const keyMoves = {
    KeyA: "Left",
    ArrowLeft: "Left",
    KeyD: "Right",
    ArrowRight: "Right",
};

const idleActions = { moveLeft: false, moveRight: false };

export const useKeyboard = ({ enabled = true, onTap } = {}) => {
    const [actions, setActions] = useState(idleActions);

    useEffect(() => {
        if (!enabled) return;
        const pressed = new Set();
        const updateActions = () =>
            setActions({
                moveLeft: pressed.has("KeyA") || pressed.has("ArrowLeft"),
                moveRight: pressed.has("KeyD") || pressed.has("ArrowRight"),
            });

        const handleKeyDown = (event) => {
            const move = keyMoves[event.code];
            const editing = event.target?.closest?.(
                "input, textarea, select, [contenteditable]:not([contenteditable='false'])",
            );
            if (
                !move ||
                editing ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey
            )
                return;

            event.preventDefault();
            if (event.repeat || pressed.has(event.code)) return;
            pressed.add(event.code);
            updateActions();
            // Score keydowns directly so batching and overlapping key releases
            // cannot create or drop gameplay taps.
            onTap?.(move);
        };
        const handleKeyUp = (event) => {
            if (!pressed.delete(event.code)) return;
            updateActions();
        };
        const clearActions = () => {
            pressed.clear();
            setActions(idleActions);
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", clearActions);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("blur", clearActions);
            clearActions();
        };
    }, [enabled, onTap]);

    return enabled ? actions : idleActions;
};
