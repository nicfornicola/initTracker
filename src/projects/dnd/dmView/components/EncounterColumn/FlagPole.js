import React, {forwardRef} from 'react';
import { COLOR_GREEN, COLOR_RED } from '../../constants';

const FlagPole = forwardRef(({flagColor, handleTeamChangeWidget, alignment, isWidgetOpen}, ref) => {
    let teamColor = COLOR_GREEN
    
    if (alignment === "enemy") teamColor = COLOR_RED
    else if (alignment === "neutral") teamColor = '#999999'

    return (
        <div style={{border: `2px ridge ${teamColor}`}} className='flagpole-container' ref={ref} onClick={handleTeamChangeWidget}>
            <div className="flagpole">
                <div className="flag" style={ isWidgetOpen ? {animation: 'wave 1.0s infinite ease-in-out'} : {animation: 'none'}}>
                    <div className="flag-stripes" style={{background: `linear-gradient(to top, white 0%, ${flagColor} 65%)`}}></div>
                </div>
            </div>
        </div>
    );
});

export default FlagPole;
