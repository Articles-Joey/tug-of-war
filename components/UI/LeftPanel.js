import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import { useStore } from "@/hooks/useStore";
import DebugPanel from "./DebugPanel";
import { useRouter } from "next/navigation";

export default function LeftPanelContent(props) {

    const {
        server,
        controllerState,
    } = props;

    const touchControls = useGameStore(state => state.touchControls)
    const setTouchControls = useGameStore(state => state.setTouchControls)

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <div className='mobile-menu-container w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className="d-flex flex-wrap mb-2">
                        <GameMenuPrimaryButtonGroup 
                            useStore={useStore}
                            type="GameMenu"
                            useRouter={useRouter}
                        />
                    </div>

                    {server !== "single-player" &&
                        <div className='flex-header'>
                            <div>Server: {server}</div>
                            <div>Players: {0}/4</div>
                        </div>
                    }

                    {(
                        server !== "single-player"
                        &&
                        !socket?.connected
                    ) &&
                        <div
                            className=""
                        >

                            <div className="">

                                <div className="h6 mb-1">Not connected</div>

                                <ArticlesButton
                                    onClick={() => {
                                        console.log("Reconnect")
                                        socket.connect()
                                    }}
                                >
                                    Reconnect!
                                </ArticlesButton>

                            </div>

                        </div>
                    }

                </div>
            </div>

            <DebugPanel />

            {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {/* {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>} */}

                </div>
            }

        </div>
    )

}

