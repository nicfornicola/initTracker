import React, { useState, useEffect } from 'react';
import { SHORT_REFRESH } from '../../constants';


const secondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Get whole minutes
    let remainingSeconds = seconds % 60; // Get remaining seconds

    if (minutes === 0 && remainingSeconds < 60)
        return`${remainingSeconds}`

    if(remainingSeconds === 0)
        remainingSeconds = '00'
    return `${minutes}:${remainingSeconds}`;
};

const RefreshTimer = ({refresh}) => {
    const [seconds, setSeconds] = useState(SHORT_REFRESH * 60);

    useEffect(() => {
        if(refresh)
            setSeconds(SHORT_REFRESH * 60);        

        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
        }, 1000);

        return () => clearInterval(interval); 
    }, [refresh]);

    return (
        <>
            Next Auto Refresh: {secondsToMinutes(seconds)}
        </>
    );
};

export default RefreshTimer;