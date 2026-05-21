"use client"
import { Suspense } from 'react';
import packageInfo from '@/package.json';

import { useStore } from '@/hooks/useStore';
import { useAudioStore } from "@/hooks/useAudioStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useSocketStore } from "@/hooks/useSocketStore";

import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import ToontownModeHandler from '@articles-media/articles-dev-box/ToontownModeHandler';
import GlobalClientModals from '@articles-media/articles-dev-box/GlobalClientModals';

export default function LayoutClient({ children }) {

    const darkMode = useStore((state) => state.darkMode);

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <ToontownModeHandler
                useStore={useStore}
            />
            <Suspense>
                <GlobalClientModals
                    useStore={useStore}
                    useAudioStore={useAudioStore}
                    useTouchControlsStore={useTouchControlsStore}
                    useSocketStore={useSocketStore}

                    packageInfo={packageInfo}
                    settingsModalConfig={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true,
                                children: <>

                                </>,
                            },
                            'Audio': {
                                sliders: [
                                    ...useAudioStore.getState().audioSettings ?
                                        Object.keys(useAudioStore.getState().audioSettings).filter(key => key !== "enabled").map(key => ({
                                            key,
                                            label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                        }))
                                        :
                                        [],
                                ]
                            },
                            'Controls': {
                                touchControls: true,
                                // defaultKeyBindings: {
                                //     // moveUp: "W",
                                //     // moveDown: "S",
                                //     // moveLeft: "A",
                                //     // moveRight: "D",
                                // }
                            },
                            'Multiplayer': {
                                serverUrl: true,
                                // children: <>Test</>
                            },
                            'Other': {
                                toontownMode: true,
                                children: <>
                                </>,
                            }
                        },
                        reset: () => {
                            useAudioStore.getState().resetAudioSettings();
                        }
                    }}
                    infoModalConfig={{
                        previewImage: darkMode ? "img/game-preview.gif" : "img/game-preview.gif",
                        appendContent: <>
                            {/* <div className='mb-2'><b>Note:</b> You can jump over the ground obstacles with the jump actions. Roll actions can be used to avoid the flying obstacles, but they have a cooldown. The game gets faster and more obstacles appear the further you go, so good luck!</div>
                            <div className=''>
                                View full controls in the settings menu
                            </div> */}
                        </>
                    }}
                />
            </Suspense>
        </>
    );
}