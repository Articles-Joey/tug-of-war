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
import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import { useStore } from '@/hooks/useStore';
import classNames from 'classnames';
import useTouchControlsStore from '@/hooks/useTouchControlsStore';
import TouchUi from '@/components/UI/TouchUi';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function IceSlideGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const sidebar = useStore(state => state.sidebar)
    const sceneKey = useStore(state => state.sceneKey)
    const reloadScene = useStore(state => state.reloadScene)
    const menuOpen = useStore(state => state.menuOpen)

    useHotkeys('r', () => {
        reloadScene()
    });

    const enabled = useTouchControlsStore(state => state.enabled)

    return (
        <div
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': menuOpen,
                    'fullscreen': useFullscreen().isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <div className='canvas-wrap'>

                <PowerMeter />

                {enabled && <TouchUi />}

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}

