"use client"
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
// import IsDev from '@/components/IsDev';
// import { ChromePicker } from 'react-color';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useGameStore } from '@/hooks/useGameStore';

// import GameScoreboard from 'components/Games/GameScoreboard'

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

// const PrivateGameModal = dynamic(
//     () => import('@/components/UI/PrivateGameModal'),
//     { ssr: false }
// )

const assets_src = 'games/Cannon/'

const game_key = 'tug-of-war'
const game_name = 'Tug of War'

export default function GameLobbyPage() {

    // const theme = useGameStore(state => state.theme)
    // const toggleTheme = useGameStore(state => state.toggleTheme)

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const darkMode = useGameStore((state) => state.darkMode)
    const toggleDarkMode = useGameStore((state) => state.toggleDarkMode)

    const nickname = useGameStore(state => state.nickname)
    const setNickname = useGameStore(state => state.setNickname)
    const randomNickname = useGameStore(state => state.randomNickname)

    const _hasHydrated = useGameStore(state => state._hasHydrated)
    // const setHasHydrated = useGameStore(state => state.setHasHydrated)

    // const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)

    // const showInfoModal = useGameStore((state) => state.showInfoModal)
    // const showSettingsModal = useGameStore((state) => state.showSettingsModal)
    // const showCreditsModal = useGameStore((state) => state.showCreditsModal)
    const setShowInfoModal = useGameStore((state) => state.setShowInfoModal)
    const setShowSettingsModal = useGameStore((state) => state.setShowSettingsModal)
    const setShowCreditsModal = useGameStore((state) => state.setShowCreditsModal)

    const lobbyDetails = useGameStore((state) => state.lobbyDetails)
    const setLobbyDetails = useGameStore((state) => state.setLobbyDetails)

    useEffect(() => {

        // setShowInfoModal(localStorage.getItem('game:four-frogs:rulesAnControls') === 'true' ? true : false)

        // if (userReduxState._id) {
        //     console.log("Is user")
        // }

        socket.on('game:death-race-landing-details', function (msg) {
            console.log('game:death-race-landing-details', msg)

            if (JSON.stringify(msg) !== JSON.stringify(lobbyDetails)) {
                setLobbyDetails(msg)
            }
        });

        return () => {
            socket.off('game:death-race-landing-details');
        };

    }, [])

    useEffect(() => {

        if (socket.connected) {
            socket.emit('join-room', 'game:death-race-landing');
        }

        return function cleanup() {
            socket.emit('leave-room', 'game:death-race-landing')
        };

    }, [socket.connected]);

    return (

        <div className="tug-of-war-landing-page">

            {/* {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            } */}

            {/* {showPrivateGameModal &&
                <PrivateGameModal
                    show={showPrivateGameModal}
                    setShow={setShowPrivateGameModal}
                />
            } */}

            <div className='background-wrap'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Tug of War/tug-of-war-thumbnail.png`}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

                <div
                    className="card card-articles card-sm mb-3 mb-lg-0"
                    style={{ "width": "20rem" }}
                >

                    {/* <div style={{ position: 'relative', height: '200px' }}>
                        <Image
                            src={Logo}
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div> */}

                    <div className='card-header d-flex align-items-center'>

                        <div className='d-flex align-items-center'>

                            <img
                                className='panel-bg me-2'
                                src="img/icon.png"
                                width={70}
                                height={70}
                            >

                            </img>

                            <div className="flex-grow-1">

                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Nickname</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                        noMargin
                                    /> */}
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="text"
                                            value={(_hasHydrated && nickname !== null) ? nickname : ''}
                                            disabled={!_hasHydrated}
                                            placeholder="Enter your nickname"
                                            onChange={(e) => {
                                                setNickname(e.target.value)
                                            }}
                                            className={`form-control form-control-sm`}
                                        />
                                        <ArticlesButton
                                            small
                                            className=""
                                            onClick={() => {
                                                randomNickname()
                                            }}
                                        >
                                            <i className="fad fa-random"></i>
                                        </ArticlesButton>
                                    </div>
                                </div>

                                <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                            </div>

                        </div>

                    </div>

                    <div className="card-body">

                        <Link href={{
                            pathname: `/play`,
                            query: {
                                server: "single-player"
                            }
                        }}>
                            <ArticlesButton
                                className={`w-100 mb-3`}
                                small
                            >
                                <i className="fas fa-play"></i>
                                Play Single Player
                            </ArticlesButton>
                        </Link>

                        <div className="fw-bold mb-1 small text-center">
                            {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                        </div>

                        {/* <div className='small fw-bold'>Public Servers</div> */}

                        <div className="servers">

                            {[1, 2, 3, 4].map(id => {

                                let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                    parseInt(lobby.server_id) == id
                                )

                                return (
                                    <div key={id} className="server">

                                        <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                            <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                            <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                        </div>

                                        <div className='d-flex justify-content-around w-100 mb-1'>
                                            {[1, 2, 3, 4].map(player_count => {

                                                let playerLookup = false

                                                if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                return (
                                                    <div key={player_count} className="icon" style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        ...(playerLookup ? {
                                                            backgroundColor: 'black',
                                                        } : {
                                                            backgroundColor: 'gray',
                                                        }),
                                                        border: '1px solid black'
                                                    }}>

                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <Link
                                            className={``}
                                            href={{
                                                pathname: `/play`,
                                                query: {
                                                    server: id
                                                }
                                            }}
                                        >
                                            <ArticlesButton
                                                className="px-5"
                                                small
                                            >
                                                Join
                                            </ArticlesButton>
                                        </Link>

                                    </div>
                                )
                            })}

                        </div>

                    </div>

                    <div className="card-footer d-flex flex-wrap justify-content-center">

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
                            className={`w-50`}
                            small
                            onClick={() => {
                                setShowInfoModal(true)
                            }}
                        >
                            <i className="fad fa-info-square"></i>
                            Info
                        </ArticlesButton>

                        <Link
                            href={'https://github.com/Articles-Joey/tug-of-war'}
                            className='w-50'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <ArticlesButton
                                className={`w-100`}
                                small
                                onClick={() => {

                                }}
                            >
                                <i className="fab fa-github"></i>
                                Github
                            </ArticlesButton>
                        </Link>

                        <ArticlesButton
                            className={`w-50`}
                            small
                            onClick={() => {
                                setShowCreditsModal(true)
                            }}
                        >
                            <i className="fad fa-users"></i>
                            Credits
                        </ArticlesButton>

                        {process.env.NODE_ENV === 'development' &&
                            <ArticlesButton
                                small
                                className="w-50"
                                onClick={() => {
                                    fetch('/api/openCode')
                                        .then(response => response.json())
                                        .then(data => {
                                            console.log('API Response:', data);
                                        })
                                        .catch(error => {
                                            console.error('API Error:', error);
                                        });
                                }}
                            >
                                <i className="fad fa-code"></i>
                                Open Code
                            </ArticlesButton>
                        }

                    </div>

                </div>

                {/* <GameScoreboard game="Death Race" /> */}

                {/* <Ad section={"Games"} section_id={game_name} /> */}

            </div>

        </div>
    );
}