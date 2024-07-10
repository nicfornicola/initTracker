import React, { useState, useEffect } from 'react';


const secondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Get whole minutes
    const remainingSeconds = seconds % 60; // Get remaining seconds
    if (remainingSeconds < 10)
        return`${minutes}:0${remainingSeconds}`
    return `${minutes}:${remainingSeconds}`;
};

const RefreshTimer = ({singleRefresh, totalRefresh}) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (singleRefresh || totalRefresh) {
            setSeconds(0);       
        } 

        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [singleRefresh, totalRefresh]);

    return (
        <div>
            {secondsToMinutes(seconds)}
        </div>
    );
};

export default RefreshTimer;