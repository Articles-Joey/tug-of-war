import { useGameStore } from "@/hooks/useGameStore"
import ArticlesButton from "./Button"
import { useStore } from "@/hooks/useStore"

export default function DebugPanel() {

    const debug = useStore(state => state.debug)
    const toontownMode = useStore(state => state.toontownMode)
    const toggleToontownMode = useStore(state => state.toggleToontownMode)
    const reloadScene = useStore(state => state.reloadScene)

    const history = useGameStore((state) => state.history);

    if (!debug) return null

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body">

                <div className="small text-muted">Debug Controls</div>

                <div className="small border p-2 mb-2">
                    {/* <div>Rotation Angle: {hitRotation}</div> */}
                    {/* <div>Power: {hitPower}/100</div> */}
                    <div
                        onClick={() => {
                            toggleToontownMode()
                        }}
                    >
                        <span>Toontown: </span>
                        <span>{toontownMode ? 'On' : 'Off'}</span>
                        <span className="badge bg-black ms-2">
                            <i className={`fad fa-redo me-0`}></i>
                        </span>
                    </div>
                </div>

                <div className="border p-2 mb-2">
                    {history?.length > 0 && history.map((entry, index) => (
                        <div key={index} className="small">
                            {entry.move} - {new Date(entry.date).toLocaleTimeString()}
                        </div>
                    ))}
                </div>

                <div className='d-flex flex-column'>

                    <div>
                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>
                    </div>

                </div>

            </div>
        </div>
    )

}