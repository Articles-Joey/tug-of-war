"use client"
import { useEffect, useContext, useState } from 'react';

import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useSocketStore } from '@/hooks/useSocketStore';

// import logo from '@/app/icon.png'

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';

const RotatingMascot = dynamic(() =>
    import('@/components/UI/RotatingMascot'),
    { ssr: false }
);

import { useStore } from '@/hooks/useStore';
import LandingBackgroundAnimation from '@/components/Game/LandingBackgroundAnimation';

export default function GameLobbyPage() {

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                logoImage={"/img/hd-icon.webp"}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                // CardBodyOverride={<>

                // </>}
                // disableHero
                // heroOverride={<>
                // </>}
                backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Tug of War/tug-of-war-thumbnail.png`}
                singlePlayerConfig={{

                }}
                NicknameInputConfig={{
                    PreComponent: <>
                        <img
                            className='panel-bg me-2'
                            src="img/icon.png"
                            width={70}
                            height={70}
                        >

                        </img>
                    </>,
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: 'Games Won',
                            key: "score",
                            format: (value) => `${value} m`
                        },
                        // {
                        //     label: 'Distance Swam',
                        //     key: "total_distance",
                        //     format: (value) => `${value} m`
                        // }
                    ]
                }}
                brandingTextClass="CowboyRope"
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </>
    );
}