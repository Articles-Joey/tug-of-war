import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";

export default function TouchUi() {

    const enabled = useTouchControlsStore(state => state.enabled)
    const setTouchControls = useTouchControlsStore(state => state.setTouchControls)

    const addToHistory = useGameStore((state) => state.addToHistory);

    if (!enabled) return null;

    return (
        <div className="touch-controls-wrap">

            <ArticlesButton
                onClick={() => {
                    addToHistory(
                        {
                            move: 'Left',
                            date: new Date()
                        }
                    )
                }}
            >
                <i className="fad fa-arrow-left me-0 px-3"></i>
            </ArticlesButton>

            <ArticlesButton
                onClick={() => {
                    addToHistory(
                        {
                            move: 'Right',
                            date: new Date()
                        }
                    )
                }}
            >
                <i className="fad fa-arrow-right me-0 px-3"></i>
            </ArticlesButton>

        </div>
    )
}
