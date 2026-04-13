import Link from "next/link";

// import ROUTES from '@/components/constants/routes';
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

// import ControllerPreview from "../../ControllerPreview";

import { useSocketStore } from "@/hooks/useSocketStore";
// import { useIceSlideStore } from "./hooks/useIceSlideStore";
// import { useEffect, useRef } from "react";
// import { useHotkeys } from "react-hotkeys-hook";
import { Dropdown, DropdownButton } from "react-bootstrap";
// import { set } from "date-fns";

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

export default function LeftPanelContent(props) {

    const {
        server,
        // players,
        // touchControlsEnabled,
        // setTouchControlsEnabled,
        // reloadScene,
        controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        // setShowMenu
    } = props;

    // const toontownMode = useGameStore(state => state.toontownMode)
    // const toggleToontownMode = useGameStore(state => state.toggleToontownMode)

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const touchControls = useGameStore(state => state.touchControls)
    const setTouchControls = useGameStore(state => state.setTouchControls)

    // const theme = useGameStore(state => state.theme)
    // const toggleTheme = useGameStore(state => state.toggleTheme)

    const toggleDarkMode = useGameStore(state => state.toggleDarkMode)

    const sidebar = useGameStore(state => state.sidebar)
    const toggleSidebar = useGameStore(state => state.toggleSidebar)

    const cameraMode = useGameStore(state => state.cameraMode)
    const setCameraMode = useGameStore(state => state.setCameraMode)

    const setShowSettingsModal = useGameStore((state) => state.setShowSettingsModal)

    // const {
    //     hitRotation,
    //     setHitRotation,
    //     hitPower,
    //     setHitPower
    // } = useIceSlideStore(state => ({
    //     hitRotation: state.hitRotation,
    //     setHitRotation: state.setHitRotation,
    //     hitPower: state.hitPower,
    //     setHitPower: state.setHitPower,
    // }));

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <div className='mobile-menu-container w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

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

                    <Link
                        href={'/'}
                        className=""
                    >
                        <ArticlesButton
                            className='w-50'
                            small
                        >
                            <i className="fad fa-arrow-alt-square-left"></i>
                            <span>Leave Game</span>
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        small
                        className="w-50"
                        active={isFullscreen}
                        onClick={() => {
                            if (isFullscreen) {
                                exitFullscreen()
                            } else {
                                requestFullscreen('tug-of-war-game-page')
                            }
                        }}
                    >
                        {isFullscreen && <span>Exit </span>}
                        {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                        <span>Fullscreen</span>
                    </ArticlesButton>

                    {/* <ArticlesButton
                        small
                        className="w-50"
                        onClick={() => {
                            toggleTheme()
                        }}
                    >
                        Theme: {theme}
                    </ArticlesButton> */}

                    <div className="d-flex flex-wrap">
                        <div className="d-flex w-50">
                            <ArticlesButton
                                className={`w-100`}
                                small
                                onClick={() => {
                                    setShowSettingsModal(true)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                Settings
                            </ArticlesButton>
                            <ArticlesButton
                                className={``}
                                small
                                onClick={() => {
                                    toggleDarkMode()
                                }}
                            >
                                <i className="fad fa-moon"></i>
                                {/* Dark Mode */}
                            </ArticlesButton>
                        </div>

                        <ArticlesButton
                            small
                            className="w-50"
                            active={sidebar}
                            onClick={() => {
                                toggleSidebar()
                            }}
                        >
                            Sidebar: {sidebar ? 'On' : 'Off'}
                        </ArticlesButton>

                        <DropdownButton
                            variant="articles w-100"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles"
                            title={
                                <span>
                                    <i className="fad fa-bug"></i>
                                    <span>Camera: {cameraMode}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {[
                                    "Orbit",
                                    "Controlled"
                                ]
                                    .map((choice, index) =>
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => {
                                                setCameraMode(choice)
                                            }}
                                            className="d-flex justify-content-between"
                                        >
                                            {choice}
                                        </Dropdown.Item>
                                    )}

                            </div>

                        </DropdownButton>
                    </div>

                </div>
            </div>

            {/* <div
                className="card card-articles card-sm"
            >
                <div className="card-body d-flex justify-content-between">

                    <div>
                        <div className="small text-muted">playerData</div>
                        <div className="small">
                            <div>X: {playerLocation?.x}</div>
                            <div>Y: {playerLocation?.y}</div>
                            <div>Z: {playerLocation?.z}</div>
                            <div>Shift: {shift ? 'True' : 'False'}</div>
                            <div>Score: 0</div>
                        </div>
                    </div>

                    <div>
                        <div className="small text-muted">maxHeight</div>
                        <div>Y: {maxHeight}</div>
                        <ArticlesButton
                            small
                            onClick={() => {
                                setMaxHeight(playerLocation?.y)
                            }}
                        >
                            Reset
                        </ArticlesButton>
                    </div>

                </div>
            </div> */}

            {/* Touch Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!touchControls}
                                onClick={() => {
                                    setTouchControls(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={touchControls}
                                onClick={() => {
                                    setTouchControls(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div>

            {/* Debug Controls */}
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

function DebugPanel() {

    const debug = useGameStore(state => state.debug)

    const toontownMode = useGameStore(state => state.toontownMode)
    const toggleToontownMode = useGameStore(state => state.toggleToontownMode)

    // const setSceneKey = useGameStore(state => state.setSceneKey)
    const reloadScene = useGameStore(state => state.reloadScene)

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