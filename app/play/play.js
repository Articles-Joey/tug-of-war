"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic'
import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useControllerStore } from '@/hooks/useControllerStore';
// import ControllerPreview from '@/components/Games/ControllerPreview';
// import { useGameStore } from '@/components/Games/Ocean Rings/hooks/useGameStore';
// import { Dropdown, DropdownButton } from 'react-bootstrap';
// import TouchControls from 'app/(site)/community/games/glass-ceiling/components/UI/TouchControls';
// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import PowerMeter from '@/components/Game/PowerMeter';
import { useGameStore } from '@/hooks/useGameStore';
import { useHotkeys } from 'react-hotkeys-hook';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function IceSlideGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const sidebar = useGameStore(state => state.sidebar)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    // const { controllerState, setControllerState } = useControllerStore()
    // const [showControllerState, setShowControllerState] = useState(false)

    // const [ cameraMode, setCameraMode ] = useState('Player')

    const [players, setPlayers] = useState([])

    // useEffect(() => {

    //     if (server && socket.connected) {
    //         socket.emit('join-room', `game:cannon-room-${server}`, {
    //             game_id: server,
    //             nickname: JSON.parse(localStorage.getItem('game:nickname')),
    //             client_version: '1',

    //         });
    //     }

    //     // return function cleanup() {
    //     //     socket.emit('leave-room', 'game:glass-ceiling-landing')
    //     // };

    // }, [server, socket.connected]);

    const [showMenu, setShowMenu] = useState(false)

    // const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    // const [sceneKey, setSceneKey] = useState(0);

    const sceneKey = useGameStore(state => state.sceneKey)
    // const setSceneKey = useGameStore(state => state.setSceneKey)
    const reloadScene = useGameStore(state => state.reloadScene)

    useHotkeys('r', () => {
        reloadScene()
    });

    const [gameState, setGameState] = useState(false)

    // Function to handle scene reload
    // const reloadScene = () => {
    //     reloadScene()
    // };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        server,
        players,
        // touchControlsEnabled,
        // setTouchControlsEnabled,
        // reloadScene,
        // controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        setShowMenu
    }

    const game_name = 'Tug of War'
    const game_key = 'tug-of-war'

    useEffect(() => {
        setShowMenu(false)
    }, [sidebar])

    return (
        <div
            className={`tug-of-war-game-page ${isFullscreen && 'fullscreen'} ${sidebar ? 'sidebar-show' : 'sidebar-hide'}`}
            id="tug-of-war-game-page"
        >

            <div className="menu-bar card card-articles p-1 justify-content-center">

                <div className='flex-header align-items-center h-100'>

                    <ArticlesButton
                        small
                        active={showMenu}
                        onClick={() => {
                            setShowMenu(prev => !prev)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        <span>Menu</span>
                    </ArticlesButton>

                    <div>

                        <ArticlesButton
                            small
                            // active={showMenu}
                            onClick={() => {

                            }}
                        >
                            <i className="fad fa-arrow-left me-0 px-3"></i>
                        </ArticlesButton>

                        <ArticlesButton
                            small
                            // active={showMenu}
                            onClick={() => {

                            }}
                        >
                            <i className="fad fa-arrow-right me-0 px-3"></i>
                        </ArticlesButton>

                    </div>

                    <div style={{ width: '60px' }}>

                    </div>

                </div>

            </div>

            <div className={`mobile-menu ${showMenu && 'show'}`}>
                <LeftPanelContent
                    {...panelProps}
                />
            </div>

            {/* <TouchControls
                touchControlsEnabled={touchControlsEnabled}
            /> */}

            <div
                className={`menu-icon ${sidebar ? 'sidebar-show' : ''}`}
                onClick={() => {
                    setShowMenu(prev => !prev)
                }}
            >

            </div>

            <div
                className={`panel-left rounded-0 d-none d-lg-flex ${sidebar ? 'sidebar-show' : 'sidebar-hide'}`}
            >

                <LeftPanelContent
                    {...panelProps}
                />

            </div>

            {/* <div className='game-info'>
                <div className="card card-articles card-sm">
                    <div className="card-body">
                        <pre> 
                            {JSON.stringify(playerData, undefined, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <div className='canvas-wrap'>

                <PowerMeter />

                <GameCanvas
                    key={sceneKey}
                    gameState={gameState}
                    // playerData={playerData}
                    // setPlayerData={setPlayerData}
                    players={players}
                />

            </div>

        </div>
    );
}

