"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';
import { useKeyboard } from '@/hooks/useKeyboard';
// import Arrow from '../UI/Arrow';
import { useGameStore } from '@/hooks/useGameStore';

export default function PowerMeter() {

    const { moveRight, moveLeft } = useKeyboard()

    const history = useGameStore((state) => state.history);
    const setHistory = useGameStore((state) => state.setHistory);
    const addToHistory = useGameStore((state) => state.addToHistory);

    const [averageInterval, setAverageInterval] = useState(0);

    useEffect(() => {
        // console.log("Test")
        if (moveRight || moveLeft) {

            // Build a history of moves
            // Calculate meter percent

            addToHistory(
                {
                    ...(moveRight && { move: 'Right' }),
                    ...(moveLeft && { move: 'Left' }),
                    date: new Date()
                }
            )

        }
    }, [moveRight, moveLeft])

    useEffect(() => {
        const interval = setInterval(() => {

            useGameStore.getState().removeOldHistoryEntries();

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

        if (averageInterval > 0 && averageInterval < 100) {
            return '100%'
        } else if (averageInterval > 100 && averageInterval < 200) {
            return '80%'
        } else if (averageInterval > 150 && averageInterval < 200) {
            return '60%'
        } else if (averageInterval > 200 && averageInterval < 250) {
            return '40%'
        } else if (averageInterval > 250 && averageInterval < 300) {
            return '20%'
        } else if (averageInterval == 0) {
            return '0%'
        }

    }, [averageInterval])

    return (
        <div className="power-meter noselect">

            {/* <div className="card card-articles card-sm h-100 w-100"> */}

            <img
                className='panel-bg'
                src="img/panel_bg.png"
            >

            </img>

            <span className='power-meter-label'>Power Meter</span>

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

            <div className="arrows">
                {/* <Arrow /> */}
                <i className={`left fad ${moveLeft ? 'active' : ''} fa-2x px-1 fa-arrow-alt-square-left me-0`}></i>
                <i className={`right fad ${moveRight ? 'active' : ''} fa-2x px-1 fa-arrow-alt-square-right me-0`}></i>
            </div>

            {/* <div className="card-header d-flex justify-content-center small">
                    <span>Power Meter</span>
                    <span>
                        {history.length} - {averageInterval}
                    </span>
                </div> */}

            {/* <div className="card-body h-100 flex-grow-1 p-0 d-flex justify-content-center align-items-center">

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

                </div> */}

            {/* <div className="card-footer d-flex justify-content-center">
                    <i className={`${moveLeft ? 'fad' : 'fas'} fa-2x px-1 fa-arrow-circle-left me-0`}></i>
                    <i className={`${moveRight ? 'fad' : 'fas'} fa-2x px-1 fa-arrow-circle-right me-0`}></i>
                </div> */}

            {/* </div> */}

        </div>
    )
}