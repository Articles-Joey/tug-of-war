"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic'
import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@/hooks/useFullScreen';
import { useControllerStore } from '@/hooks/useControllerStore';
// import ControllerPreview from '@/components/Games/ControllerPreview';
// import { useGameStore } from '@/components/Games/Ocean Rings/hooks/useGameStore';
// import { Dropdown, DropdownButton } from 'react-bootstrap';
// import TouchControls from 'app/(site)/community/games/glass-ceiling/components/UI/TouchControls';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/Game/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useKeyboard } from '@/hooks/useKeyboard';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function IceSlideGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const { controllerState, setControllerState } = useControllerStore()
    const [showControllerState, setShowControllerState] = useState(false)

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

    const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    const [sceneKey, setSceneKey] = useState(0);

    const [gameState, setGameState] = useState(false)

    // Function to handle scene reload
    const reloadScene = () => {
        setSceneKey((prevKey) => prevKey + 1);
    };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        server,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        // controllerState,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        setShowMenu
    }

    const game_name = 'Tug of War'
    const game_key = 'tug-of-war'

    return (
        <div
            className={`tug-of-war-game-page ${isFullscreen && 'fullscreen'}`}
            id="tug-of-war-game-page"
        >

            <div className="menu-bar card card-articles p-1 justify-content-center">

                <div className='flex-header align-items-center'>

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

            <div className='panel-left card rounded-0 d-none d-lg-flex'>

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

function PowerMeter() {

    const { moveRight, moveLeft } = useKeyboard()

    const [
        history,
        setHistory
    ] = useState([]);

    const [averageInterval, setAverageInterval] = useState(0);

    useEffect(() => {
        // console.log("Test")
        if (moveRight || moveLeft) {

            // Build a history of moves
            // Calculate meter percent

            setHistory([
                ...history,
                {
                    ...(moveRight && { move: 'Right' }),
                    ...(moveLeft && { move: 'Left' }),
                    date: new Date()
                }
            ])

        }
    }, [moveRight, moveLeft])

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setHistory((prevHistory) =>
                prevHistory.filter((entry) => now - new Date(entry.date) <= 5000)
            );
        }, 1000); // Run cleanup every second

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    useEffect(() => {
        if (history.length > 1) {
            // Calculate time differences between consecutive entries
            const intervals = history
                .map((entry, index) => {
                    if (index === 0) return null; // Skip the first item
                    const prev = new Date(history[index - 1].date).getTime();
                    const curr = new Date(entry.date).getTime();
                    return curr - prev;
                })
                .filter((diff) => diff !== null); // Remove null values

            // Calculate average interval
            const total = intervals.reduce((sum, diff) => sum + diff, 0);
            const average = total / intervals.length;

            setAverageInterval(average); // Store average in state
        } else {
            setAverageInterval(0); // Reset if not enough data
        }
    }, [history]);

    let calculatedHeight = useMemo(() => {

        if ( averageInterval > 0 && averageInterval < 100 ) {
            return '100%'
        } else if (averageInterval > 100 && averageInterval < 200) {
            return '80%'
        } else if (averageInterval > 150 && averageInterval < 200) {
            return '60%'
        } else if (averageInterval > 200 && averageInterval < 250) {
            return '40%'
        } else if (averageInterval > 250 && averageInterval < 300) {
            return '20%'
        }else if (averageInterval == 0) {
            return '0%'
        }

    }, [averageInterval])

    return (
        <div className="power-meter noselect">
            <div className="card card-articles card-sm h-100">

                <div className="card-header d-flex justify-content-center small">
                    Power Meter - {history.length} - {averageInterval}
                </div>

                <div className="card-body h-100 flex-grow-1 p-0 d-flex justify-content-center align-items-center">

                    <div className="meter">

                        <div
                            className="current-bar"
                            style={{
                                height: calculatedHeight
                            }}
                        >

                        </div>

                        <div className="target-bar"></div>

                    </div>

                </div>

                <div className="card-footer d-flex justify-content-center">
                    <i className={`${moveLeft ? 'fad' : 'fas'} fa-2x px-1 fa-arrow-circle-left me-0`}></i>
                    <i className={`${moveRight ? 'fad' : 'fas'} fa-2x px-1 fa-arrow-circle-right me-0`}></i>
                </div>

            </div>
        </div>
    )
}