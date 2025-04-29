import React from 'react';


const secondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Get whole minutes
    let remainingSeconds = seconds % 60; // Get remaining seconds

    if (minutes === 0 && remainingSeconds < 60)
        return`${remainingSeconds}`

    if(remainingSeconds === 0)
        remainingSeconds = '00'
    return `${minutes}:${remainingSeconds}`;
};

const RefreshTimer = ({ seconds }) => {
    return <>Next Auto Refresh: {secondsToMinutes(seconds)}</>;
};

export default RefreshTimer;