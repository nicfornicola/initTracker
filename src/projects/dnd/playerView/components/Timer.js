import React, { useState, useEffect } from 'react';
import pauseButton from '../pics/icons/pause.png'; 
import play from '../pics/icons/play.png'; 
import restart from '../pics/icons/restart.png'; 
import timer from '../pics/icons/timer.png'; 
import Tooltip from './Tooltip';


const secondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Get whole minutes
    const remainingSeconds = seconds % 60; // Get remaining seconds
    if (remainingSeconds < 10)
        return`${minutes}:0${remainingSeconds}`
    return `${minutes}:${remainingSeconds}`;
};

const Timer = () => {
    const [showTimerOptions, setShowTimerOptions] = useState(false);
    const [pause, setPause] = useState(true);
    const [reset, setReset] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (reset) {
            setSeconds(0);       
            setReset(false)
        } 

        let increment = 1
        if (pause) {
            increment = 0
        } 

        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + increment);
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [reset, pause]);

    return (
        <>
            <img className="option" src={timer} alt={"refresh"} onClick={() => setShowTimerOptions(!showTimerOptions)}/>
            <Tooltip message={"Timer"}/>
            {showTimerOptions && 
                <>
                    <img className="option" src={restart} alt={"refresh"} onClick={() => setReset(true)}/>
                    <Tooltip message={"Restart"}/>
                    <img className="option" src={pause ?  play : pauseButton} alt={"refresh"} onClick={() => setPause(!pause)}/>
                    <Tooltip message={pause ?  "Play" : "Pause"}/>
                    <div className='option timer'>
                        {secondsToMinutes(seconds)}
                    </div>
                </>
            }
        </>
    );
};

export default Timer;